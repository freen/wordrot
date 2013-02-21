<?php

namespace WordRot\PlayBundle\Security\Authentication\Token;

use Symfony\Component\Security\Core\Authentication\Token\AbstractToken;

class WordnikUserToken extends AbstractToken
{
    public $created;
    public $digest;
    public $nonce;

    protected $username;

    public function __construct($username, $password, $providerKey, array $roles = array())
    {
        parent::__construct($roles);

        // If the user has roles, consider it authenticated
        $this->setAuthenticated(count($roles) > 0);

        $this->username = $username;
        $this->password = $password;
        $this->providerKey = $providerKey;
    }

    public function getCredentials()
    {
        return '';
    }
}