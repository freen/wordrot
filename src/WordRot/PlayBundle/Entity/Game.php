<?php

namespace WordRot\PlayBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

use WordRot\PlayBundle\Entity\User;

/**
 * Game
 *
 * @ORM\Table()
 * @ORM\Entity(repositoryClass="WordRot\PlayBundle\Entity\GameRepository")
 */
class Game
{

    const STATE_ACTIVE = 1;
    const STATE_COMPLETE = 2;

    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * The owning user.
     * 
     * @var User
     *
     * @ORM\ManyToOne(targetEntity="User", inversedBy="games")
     */
    protected $user;

    /**
     * Whether the game is active or complete. Defined by the entity's class
     * constants, STATE_ACTIVE and STATE_COMPLETE.
     * 
     * @var integer
     *
     * @ORM\Column(type="tinyint")
     */
    protected $state;

    public function __construct() {
        $this->state = self::STATE_ACTIVE;
    }

    /**
     * Get id
     *
     * @return integer 
     */
    public function getId()
    {
        return $this->id;
    }
}
