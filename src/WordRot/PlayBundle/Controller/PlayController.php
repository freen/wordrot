<?php

namespace WordRot\PlayBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class PlayController extends Controller
{
    public function indexAction()
    {
        // Authenticated User Credentials
        $securityToken = $this->get('security.context')->getToken();
        $user = $securityToken->getUser();

        // Fetch the active game
        $GameRepository = $this->get('doctrine.orm.entity_manager')
            ->getRepository('WordRotPlayBundle:Game');
        $ActiveGame = $GameRepository->getActiveGameByUser($user);

        return $this->render('WordRotPlayBundle:Play:index.html.twig', array(
            'activeGame' => $ActiveGame
        ));
    }
}
