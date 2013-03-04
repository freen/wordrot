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

    	$wordnik = $this->get('word_rot_play.wordnik');
       	$lists = $wordnik->getLists();
    	$listsWithWords = $wordnik->filterListsWithWords();
        return $this->render('WordRotPlayBundle:Play:index.html.twig');
    }
}
