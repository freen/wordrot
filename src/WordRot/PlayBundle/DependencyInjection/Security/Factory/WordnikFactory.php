<?php

namespace WordRot\PlayBundle\DependencyInjection\Security\Factory;

use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Reference;
use Symfony\Component\DependencyInjection\DefinitionDecorator;
use Symfony\Component\Config\Definition\Builder\NodeDefinition;
use Symfony\Bundle\SecurityBundle\DependencyInjection\Security\Factory\SecurityFactoryInterface;
use Symfony\Bundle\SecurityBundle\DependencyInjection\Security\Factory\AbstractFactory;

class WordnikFactory extends AbstractFactory
{
    public function getPosition()
    {
        return 'form';
    }

    public function getKey()
    {
        return 'wordnik';
    }

    public function addConfiguration(NodeDefinition $node)
    {
        parent::addConfiguration($node);
    }

    protected function createAuthProvider(ContainerBuilder $container, $id, $config, $userProviderId)
    {
        $provider = 'security.authentication.provider.wordnik.'.$id;
        $container
            ->setDefinition($provider, new DefinitionDecorator('security.authentication.provider.wordnik'))
            ->replaceArgument(0, new Reference($userProviderId))
            //->replaceArgument(2, $id)
        ;

        return $provider;
    }

    protected function createListener($container, $id, $config, $userProvider)
    {
        $listenerId = $this->getListenerId();
        $listener = new DefinitionDecorator($listenerId);
        $listener->replaceArgument(4, $id);
        $listener->replaceArgument(5, new Reference($this->createAuthenticationSuccessHandler($container, $id, $config)));
        $listener->replaceArgument(6, new Reference($this->createAuthenticationFailureHandler($container, $id, $config)));
        $listener->replaceArgument(7, array_intersect_key($config, $this->options));

        $listenerId .= '.'.$id;
        $container->setDefinition($listenerId, $listener);

    }

    protected function getListenerId()
    {
        return 'security.authentication.listener.wordnik';
    }

    protected function isRememberMeAware($config)
    {
        return false;
    }
}