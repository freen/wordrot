<?php

namespace WordRot\PlayBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use FOS\RestBundle\View\View;

use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

use WordRot\PlayBundle\Entity\User;

class UsersController extends Controller
{
	/**
	 * GET /play/users/{id}
	 */
    public function getAction($id)
    {
    	$UserRepository = $this->get('doctrine.orm.entity_manager')
    		->getRepository('WordRotPlayBundle:User');
    	$user = $UserRepository->find($id);

        if (!$user instanceof User) {
            throw new NotFoundHttpException('User not found');
        }

        $view = View::create($user)
		    ->setStatusCode(200);

		return $this->get('fos_rest.view_handler')->handle($view);
    }
}
