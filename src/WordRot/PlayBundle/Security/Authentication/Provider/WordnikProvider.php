<?php

namespace WordRot\PlayBundle\Security\Authentication\Provider;

use Symfony\Component\Security\Core\Authentication\Provider;
use Symfony\Component\Security\Core\Authentication\Provider\AuthenticationProviderInterface;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\Exception\NonceExpiredException;
use Symfony\Component\Security\Core\Exception\UsernameNotFoundException;

use WordRot\PlayBundle\Security\Authentication\Token\WordnikUserToken;
use WordRot\PlayBundle\Service\Wordnik;
use WordRot\PlayBundle\Entity\User;

class WordnikProvider implements AuthenticationProviderInterface {

    protected $userProvider;
    protected $wordnik;
    protected $doctrine;
    protected $em;

    public function __construct(UserProviderInterface $userProvider, Wordnik $wordnik, $doctrine)
    {
        $this->userProvider = $userProvider;
        $this->wordnik = $wordnik;
        $this->doctrine = $doctrine;
        $this->em = $doctrine->getEntityManager();
    }

    public function supports(TokenInterface $token)
    {
        return $token instanceof WordnikUserToken;
    }

    public function authenticate(TokenInterface $token)
    {
        $username = $token->getUsername();

        try {
            $user = $this->userProvider->loadUserByUsername($username);
        } catch (UsernameNotFoundException $notFound) {
            // The user has never been loaded before. 
            // Don't persist until the authentication is successful.)
            $user = new User();
            $user->setUsername($username);
        }

        // Attempt Wordnik API authentication.
        try {
            $authResponse = $this->wordnik->authenticate($username, $token->getPassword());
        } catch(\Exception $errorResponse) {
            $errorMessage = $errorResponse->getMessage();
            // The HTTP response code has to be parsed from the Exception message.
            $matches = array();
            preg_match("/response code: (\d{3})$/", $errorMessage, $matches);

            if(count($matches) > 1) {
                $responseCode = $matches[1];

                // Process HTTP response code
                switch($responseCode) {
                    case '403':
                        // Incorrect user/pass
                        throw new AuthenticationException('Wordnik authentication failed. Incorrect username or password.');
                    case '500':
                        throw new AuthenticationException('Wordnik authentication failed. An error occurred during the request. Try again later.');
                    default:
                        throw new AuthenticationException("Wordnik authentication failed. An unknown error occurred. ($errorMessage)");
                }
            } else {
                throw new AuthenticationException("Wordnik authentication failed. An unknown error occurred. ($errorMessage)");
            }
        }

        // Store user record
        $user->setThirdPartyId($authResponse->userId);
        $user->setUserSignature($authResponse->userSignature);
        $user->setAuthToken($authResponse->token);
        $this->em->persist($user);
        $this->em->flush();

        $authenticatedToken = new WordnikUserToken($username, '', '', $user->getRoles());
        $authenticatedToken->setUser($user);
        return $authenticatedToken;
    }

}