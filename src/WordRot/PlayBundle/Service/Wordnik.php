<?php

namespace WordRot\PlayBundle\Service;

// require_once 

class Wordnik {

	public function __construct($container, $wordnik_api_key, $wordnik_api_url) {
		$this->container = $container;
		$this->kernel = $this->container->get('kernel');

		// Load the Wordnik Client Library (doesn't conform to PSR-0)
		$app_root = $this->kernel->getRootDir();
		$wordnik_root = $app_root . "/../vendor/wordnik-php/wordnik/";
		require_once $wordnik_root . "Swagger.php";

		$this->apiClient = new \APIClient($wordnik_api_key, $wordnik_api_url);
	}
}