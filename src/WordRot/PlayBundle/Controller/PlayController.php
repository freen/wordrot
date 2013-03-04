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
    	$authToken = $user->getAuthToken();

    	$wordnik = $this->get('word_rot_play.wordnik');
    	$wordLists = $wordnik->loadWordLists($user->getId(), $authToken);
        return $this->render('WordRotPlayBundle:Play:index.html.twig');
    }
}
