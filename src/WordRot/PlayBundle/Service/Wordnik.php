<?php

namespace WordRot\PlayBundle\Service;

class Wordnik {

	protected $container;
	protected $kernel;

	protected $client;
	protected $accountApi;

	public function __construct($container, $wordnik_api_key, $wordnik_api_url)
	{
		$this->container = $container;
		$this->kernel = $this->container->get('kernel');
		$this->session = $this->container->get('session');

		// Load the Wordnik Client Library (doesn't conform to PSR-0)
		$app_root = $this->kernel->getRootDir();
		$wordnik_root = $app_root . "/../vendor/wordnik-php/wordnik/";
		require_once $wordnik_root . "Swagger.php";

		$this->client = new \APIClient($wordnik_api_key, $wordnik_api_url);
	    $this->accountApi = new \AccountApi($this->client);
	}
	
	/**
	 * Used by WordnikProvider, the Wordnik authentication provider.
     */
	public function authenticate($username, $password) {
		$authResponse = $this->accountApi->authenticate($username, $password);
		return $authResponse;
	}

}