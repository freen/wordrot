<?php

namespace WordRot\PlayBundle\Security\Firewall;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\GetResponseEvent;
use Symfony\Component\HttpKernel\Log\LoggerInterface;
use Symfony\Component\Security\Http\HttpUtils;
use Symfony\Component\Security\Http\Firewall\ListenerInterface;
use Symfony\Component\Security\Http\Firewall\AbstractAuthenticationListener;
use Symfony\Component\Security\Http\Session\SessionAuthenticationStrategyInterface;
use Symfony\Component\Security\Http\Authentication\AuthenticationFailureHandlerInterface;
use Symfony\Component\Security\Http\Authentication\AuthenticationSuccessHandlerInterface;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\SecurityContextInterface;
use Symfony\Component\Security\Core\Authentication\AuthenticationManagerInterface;
use WordRot\PlayBundle\Security\Authentication\Token\WordnikUserToken;

class WordnikListener extends AbstractAuthenticationListener
{
    public function __construct(SecurityContextInterface $securityContext, AuthenticationManagerInterface $authenticationManager, SessionAuthenticationStrategyInterface $sessionStrategy, HttpUtils $httpUtils, $providerKey, AuthenticationSuccessHandlerInterface $successHandler, AuthenticationFailureHandlerInterface $failureHandler, array $options = array(), LoggerInterface $logger = null, EventDispatcherInterface $dispatcher = null)
    {
        parent::__construct($securityContext, $authenticationManager, $sessionStrategy, $httpUtils, $providerKey, $successHandler, $failureHandler, array_merge(array(
                    'username_parameter' => '_username',
                    'password_parameter' => '_password',
                    'csrf_parameter'     => '_csrf_token',
                    'intention'          => 'authenticate',
                    'post_only'          => true,
                ), $options), $logger, $dispatcher);
    }

    protected function attemptAuthentication(Request $request)
    {
        // die('Called ' . __CLASS__ . '#' . __FUNCTION__);

        if ($this->options['post_only'] && 'post' !== strtolower($request->getMethod())) {
            if (null !== $this->logger) {
                $this->logger->debug(sprintf('Authentication method not supported: %s.', $request->getMethod()));
            }

            return null;
        }

        $username = trim($request->get($this->options['username_parameter'], null, true));
        $password = $request->get($this->options['password_parameter'], null, true);

        $request->getSession()->set(SecurityContextInterface::LAST_USERNAME, $username);

        $attemptToken = new WordnikUserToken($username, $password, $this->providerKey);
        $authenticationResult = $this->authenticationManager->authenticate($attemptToken);

        // var_dump($authenticationResult);
        // exit;

        return $authenticationResult;
    }

    protected function requiresAuthentication(Request $request)
    {
        // die('Called ' . __CLASS__ . '#' . __FUNCTION__);
        return $this->httpUtils->checkRequestPath($request, '/play_check');
    }
}
