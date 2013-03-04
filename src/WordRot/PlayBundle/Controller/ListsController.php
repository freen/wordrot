<?php

namespace WordRot\PlayBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use FOS\RestBundle\View\View;

use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

use WordRot\PlayBundle\Entity\User;

class ListsController extends Controller
{
	/**
	 * GET /play/lists/
	 */
    public function allAction()
    {
        $wordnik = $this->get('word_rot_play.wordnik');

        $lists = $wordnik->getLists();

        $view = View::create($lists)
		    ->setStatusCode(200);

		return $this->get('fos_rest.view_handler')->handle($view);
    }
}
