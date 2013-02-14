<?php

namespace WordRot\PlayBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class DefaultController extends Controller
{
    public function indexAction()
    {
    	$Wordnik = $this->get('word_rot_play.wordnik');
        return $this->render('WordRotPlayBundle:Default:index.html.twig');
    }
}
