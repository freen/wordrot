<?php

namespace WordRot\PlayBundle\Entity;

use FOS\UserBundle\Entity\User as BaseUser;
use Doctrine\ORM\Mapping as ORM;

/**
 * User
 *
 * @ORM\Table(name="fos_user")
 * @ORM\Entity(repositoryClass="WordRot\PlayBundle\Entity\UserRepository")
 */
class User extends BaseUser
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

}
