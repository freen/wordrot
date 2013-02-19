<?php

namespace WordRot\PlayBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class PlayController extends Controller
{
    public function indexAction()
    {
        return $this->render('WordRotPlayBundle:Play:index.html.twig');
    }
}
