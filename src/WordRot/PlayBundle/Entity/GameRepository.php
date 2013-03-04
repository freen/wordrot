<?php

namespace WordRot\PlayBundle\Entity;

use Doctrine\ORM\EntityRepository;

use WordRot\PlayBundle\Entity\Game;
use WordRot\PlayBundle\Entity\User;

class GameRepository extends EntityRepository
{
	public function getActiveGameByUser(User $User)
	{
		$qb = $this->getEntityManager()->createQueryBuilder();
		$qb->select('g')
		   ->from('WordRotPlayBundle:Game', 'g')
		   ->where('g.user = ?1')
		   ->andWhere('g.state = ?2')
		   ->setParameter('1', $User->getId())
		   ->setParameter('2', Game::STATE_ACTIVE)
		   ->setMaxResults(1);
		$query = $qb->getQuery();
		$result = $query->getResult();
		if(empty($result))
			return null;
		return current($result);
	}
}
