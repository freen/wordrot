<?php

namespace WordRot\PlayBundle\Security\Authentication\Token;

use Symfony\Component\Security\Core\Authentication\Token\AbstractToken;

class WordnikUserToken extends AbstractToken
{
    public $created;
    public $digest;
    public $nonce;

    protected $username;
    protected $password;

    public function __construct($username, $password, $providerKey, array $roles = array())
    {
        parent::__construct($roles);

        // If the user has roles, consider it authenticated
        $this->setAuthenticated(count($roles) > 0);

        $this->username = $username;
        $this->password = $password;
        $this->providerKey = 'wordnik';
        // $this->providerKey = $providerKey;
        $this->created = new \DateTime();

        // xdebug_break();
        // die('Called ' . __CLASS__ . '#' . __FUNCTION__);
    }

    public function getPassword() {
        return $this->password;
    }

    public function getUsername() {
        return $this->username;
    }

    public function getCredentials()
    {
        return '';
    }
}