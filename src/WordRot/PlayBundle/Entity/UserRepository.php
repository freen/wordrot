<?php

namespace WordRot\PlayBundle\Entity;

use Doctrine\ORM\EntityRepository;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Component\Security\Core\Exception\UsernameNotFoundException;
use Symfony\Component\Security\Core\Exception\UnsupportedUserException;
use WordRot\PlayBundle\Entity\User;

/**
 * UserRepository
 */
class UserRepository extends EntityRepository implements UserProviderInterface
{
	public function supportsClass($class) {
		return $this->getEntityName() === $class || is_subclass_of($class, $this->getEntityName());
	}

	public function loadUserByUsername($username) {
		$user = $this->findOneBy(array('username' => $username));
		if(!$user) {
			throw new UsernameNotFoundException(sprintf('Username "%s" does not exist.', $username));
		}
		return $user;
	}

	public function refreshUser(UserInterface $user) {

        if (!$user instanceof User) {
            throw new UnsupportedUserException(sprintf('Instances of "%s" are not supported.', get_class($user)));
        }
		return $this->loadUserByUsername($user->getUsername());
	}
}
