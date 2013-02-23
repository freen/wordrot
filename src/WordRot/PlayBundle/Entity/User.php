<?php

namespace WordRot\PlayBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * User
 *
 * @ORM\Table(name="wordnik_user")
 * @ORM\Entity(repositoryClass="WordRot\PlayBundle\Entity\UserRepository")
 */
class User implements UserInterface, \Serializable
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @ORM\Column(type="string", length=30, unique=true)
     */
    private $username;

    /**
     * @var integer
     *
     * @ORM\Column(name="third_party_id", type="integer")
     */
    protected $third_party_id;

    /**
     * @var string
     *
     * @ORM\Column(name="user_signature", type="string", length=255)
     */
    protected $user_signature;

    /**
     * @var string
     *
     * @ORM\Column(name="auth_token", type="string", length=255)
     */
    protected $auth_token;

    public function __construct()
    {
        parent::__construct();
        // your own logic
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

    /**
     * Get username
     *
     * @return string
     */
    public function getUsername()
    {
        return $this->username;
    }

    /**
     * NOT STORED, however definition is obligatory.
     */
    public function getPassword()
    {
        return '';
    }

    /**
     * NOT STORED, however definition is obligatory.
     */
    public function getSalt()
    {
        return '';
    }

    /**
     * Set third_party_id
     *
     * @param integer $thirdPartyId
     * @return User
     */
    public function setThirdPartyId($thirdPartyId)
    {
        $this->third_party_id = $thirdPartyId;
    
        return $this;
    }

    /**
     * Get third_party_id
     *
     * @return integer 
     */
    public function getThirdPartyId()
    {
        return $this->third_party_id;
    }

    /**
     * Set user_signature
     *
     * @param string $userSignature
     * @return User
     */
    public function setUserSignature($userSignature)
    {
        $this->user_signature = $userSignature;
    
        return $this;
    }

    /**
     * Get user_signature
     *
     * @return string 
     */
    public function getUserSignature()
    {
        return $this->user_signature;
    }

    /**
     * Set auth_token
     *
     * @param string $authToken
     * @return User
     */
    public function setAuthToken($authToken)
    {
        $this->auth_token = $authToken;
    
        return $this;
    }

    /**
     * Get auth_token
     *
     * @return string 
     */
    public function getAuthToken()
    {
        return $this->auth_token;
    }

    /**
     * @see \Serializable::serialize()
     */
    public function serialize()
    {
        return serialize(array(
            $this->id,
        ));
    }

    /**
     * @see \Serializable::unserialize()
     */
    public function unserialize($serialized)
    {
        list (
            $this->id,
        ) = unserialize($serialized);
    }

    /** Unnecessary, but definition is obligatory. */
    public function eraseCredentials() { }

}
