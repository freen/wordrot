<?php

namespace WordRot\PlayBundle\Service;

class Wordnik {

	protected $container;
	protected $kernel;
	protected $session;
	protected $cache;
	protected $logger;

	/**
	 * Wordnik objects
	 */
	protected $client;
	protected $accountApi;

	/**
	 * Cache Values
	 */

	const CACHE_KEY_PREFIX = "WordnikService";
	const CACHE_KEY_SEPARATOR = "_";

	public function __construct($container, $wordnik_api_key, $wordnik_api_url)
	{
		$this->container = $container;
		$this->kernel = $this->container->get('kernel');
		$this->session = $this->container->get('session');
		$this->cache = $this->container->get('cache');
		$this->logger = $this->container->get('logger');

		/**
		 * Load the Wordnik Client Library (doesn't conform to PSR-0)
		 */
		$app_root = $this->kernel->getRootDir();
		$wordnik_root = $app_root . "/../manual_vendor/wordnik-php/wordnik/";
		require_once $wordnik_root . "Swagger.php";

		/**
		 * Wordnik objects
		 */
		$this->client = new \APIClient($wordnik_api_key, $wordnik_api_url);
	    $this->accountApi = new \AccountApi($this->client);
	}

	/**
	 * Returns a string to be used as a cache key for the given user and
	 * resource.
	 * @param  int $userId
	 * @param  string $resourceName
	 * @return string
	 */
	private function makeCacheKey($userId, $resourceName) {
		$pieces = array(self::CACHE_KEY_PREFIX, $userId, $resourceName);
		return implode(self::CACHE_KEY_SEPARATOR, $pieces);
	}
	
	/**
	 * Used by WordnikProvider, the Wordnik authentication provider.
     */
	public function authenticate($username, $password) {
		$authResponse = $this->accountApi->authenticate($username, $password);
		return $authResponse;
	}

	/**
	 * @todo Expire the cached list of lists
	 * @todo Expire each cached list
	 */
	public function expireUserCache($userId) { }

	/**
	 * @todo Call for lists
	 * @todo Cache result
	 */
	public function loadWordLists($userId, $authToken) {
		$cacheKey = $this->makeCacheKey($userId, __FUNCTION__);
		$cachedResult = $this->cache->fetch($cacheKey);
		if($cachedResult) {
			$this->logger->debug("Loaded user word lists from cache (user ID $userId, cache key $cacheKey).");
			return $cachedResult;
		}

		$this->logger->debug("Requesting user word lists from API (user ID $userId, cache key $cacheKey). (Missed cache)");
		$result = $this->accountApi->getWordListsForLoggedInUser($authToken);
		$this->cache->save($cacheKey, $result);
		return $result;
	}

}