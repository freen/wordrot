<?php

namespace WordRot\PlayBundle;

use WordRot\PlayBundle\DependencyInjection\Security\Factory\WordnikFactory;
use Symfony\Component\HttpKernel\Bundle\Bundle;
use Symfony\Component\DependencyInjection\ContainerBuilder;

class WordRotPlayBundle extends Bundle
{
    public function build(ContainerBuilder $container)
    {
        parent::build($container);

        $extension = $container->getExtension('security');
        $extension->addSecurityListenerFactory(new WordnikFactory());
    }
}
