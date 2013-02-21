<?php

namespace WordRot\PlayBundle\Security\Authentication\Provider;

use Symfony\Component\Security\Core\Authentication\Provider;

use Symfony\Component\Security\Core\Authentication\Provider\AuthenticationProviderInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\Exception\NonceExpiredException;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;

use WordRot\PlayBundle\Security\Authentication\Token\WordnikUserToken;
use WordRot\PlayBundle\Service\Wordnik;


class WordnikProvider implements AuthenticationProviderInterface {

    protected $wordnik;
	protected $userProvider;

    public function __construct(UserProviderInterface $userProvider, Wordnik $wordnik)
    {
        $this->wordnik = $wordnik;
        $this->userProvider = $userProvider;
    }

    /**
     * Does additional checks on the user and token (like validating the
     * credentials).
     *
     * @param UserInterface         $user  The retrieved UserInterface instance
     * @param WordnikUserToken $token The WordnikUserToken token to be authenticated
     *
     * @throws AuthenticationException if the credentials could not be validated
     */
    protected function checkAuthentication(UserInterface $user, WordnikUserToken $token)
    {

        $currentUser = $token->getUser();
        if ($currentUser instanceof UserInterface) {

			$authResponse = $this->wordnik->authenticate($username, $password);

            // if ($currentUser->getPassword() !== $user->getPassword()) {
            //     throw new BadCredentialsException('The credentials were changed from another session.');
            // }

            /**
             * This is the next milestone: get to this point.
             */
			var_dump("\$authResponse", $authResponse);
			exit;

        } else {
            if ("" === ($presentedPassword = $token->getCredentials())) {
                throw new BadCredentialsException('The presented password cannot be empty.');
            }

            if (!$this->encoderFactory->getEncoder($user)->isPasswordValid($user->getPassword(), $presentedPassword, $user->getSalt())) {
                throw new BadCredentialsException('The presented password is invalid.');
            }
        }
    }

    public function supports(TokenInterface $token)
    {
        return $token instanceof WordnikUserToken;
    }

    public function authenticate(TokenInterface $token)
    {
        $user = $this->userProvider->loadUserByUsername($token->getUsername());

        if ($user && $this->validateDigest($token->digest, $token->nonce, $token->created, $user->getPassword())) {
            $authenticatedToken = new WsseUserToken($user->getRoles());
            $authenticatedToken->setUser($user);

            return $authenticatedToken;
        }

        throw new AuthenticationException('The WSSE authentication failed.');
    }

}


// <?php

// // src/Acme/DemoBundle/Security/Authentication/Provider/WsseProvider.php
// namespace Acme\DemoBundle\Security\Authentication\Provider;

// class WsseProvider implements AuthenticationProviderInterface
// {
//     private $userProvider;
//     private $cacheDir;

//     public function __construct(UserProviderInterface $userProvider, $cacheDir)
//     {
//         $this->userProvider = $userProvider;
//         $this->cacheDir     = $cacheDir;
//     }

//     public function authenticate(TokenInterface $token)
//     {
//         $user = $this->userProvider->loadUserByUsername($token->getUsername());

//         if ($user && $this->validateDigest($token->digest, $token->nonce, $token->created, $user->getPassword())) {
//             $authenticatedToken = new WsseUserToken($user->getRoles());
//             $authenticatedToken->setUser($user);

//             return $authenticatedToken;
//         }

//         throw new AuthenticationException('The WSSE authentication failed.');
//     }

//     protected function validateDigest($digest, $nonce, $created, $secret)
//     {
//         // Expire timestamp after 5 minutes
//         if (time() - strtotime($created) > 300) {
//             return false;
//         }

//         // Validate nonce is unique within 5 minutes
//         if (file_exists($this->cacheDir.'/'.$nonce) && file_get_contents($this->cacheDir.'/'.$nonce) + 300 > time()) {
//             throw new NonceExpiredException('Previously used nonce detected');
//         }
//         file_put_contents($this->cacheDir.'/'.$nonce, time());

//         // Validate Secret
//         $expected = base64_encode(sha1(base64_decode($nonce).$created.$secret, true));

//         return $digest === $expected;
//     }

//     public function supports(TokenInterface $token)
//     {
//         return $token instanceof WsseUserToken;
//     }
// }