<?php

namespace WordRot\PlayBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use FOS\RestBundle\View\View;

use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

use WordRot\PlayBundle\Entity\User;

class ListsController extends Controller
{
	/**
     * All of the current user's lists.
     *
	 * GET /play/lists/
	 */
    public function allAction()
    {
        $wordnik = $this->get('word_rot_play.wordnik');

        $lists = $wordnik->getLists();

        // Omit the static property $swaggerTypes from each WordList object
        // TODO a more graceful way of excluding this property is preferable
        foreach($lists as &$list)
            $list::$swaggerTypes = null;

        $view = View::create($lists, 200);

		return $this->get('fos_rest.view_handler')->handle($view);
    }
}
