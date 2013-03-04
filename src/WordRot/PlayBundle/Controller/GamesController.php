<?php

namespace WordRot\PlayBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use FOS\RestBundle\View\View;

use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

use WordRot\PlayBundle\Entity\Game;

class GamesController extends Controller
{
	/**
     * Fetch a user's game.
     * 
	 * GET /play/games/{id}
	 */
    public function getAction($id)
    {
    	$GameRepository = $this->get('doctrine.orm.entity_manager')
    		->getRepository('WordRotPlayBundle:Game');

        $User = $this->get('security.context')->getToken()->getUser();

    	$Game = $GameRepository->findOneBy(array(
            'id' => $id,
            'user' => $User
        ));

        if (!$Game instanceof Game) {
            throw new NotFoundHttpException('Game not found');
        }

        $view = View::create($Game)
		    ->setStatusCode(200);

		return $this->get('fos_rest.view_handler')->handle($view);
    }
}
