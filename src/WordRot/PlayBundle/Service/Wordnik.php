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

	/**
	 * API & Cache Credentials.
	 */
	protected $authToken = null;
	protected $cacheOwner = null;

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
	 * Load credentials needed for cache designation and API calls. 
	 * NOTE: Needs to be called after constructor to avoid circular dependency
	 * injection.
	 * @return null
	 */
	private function _initCredentials() {
		if(in_array(null, array($this->authToken, $this->cacheOwner))) {
			// Security Token contains user ID and auth token
			$securityToken = $this->container->get('security.context')->getToken();
			$user = $securityToken->getUser();
			$this->authToken = $user->getAuthToken();
			$this->cacheOwner = $user->getId();
		}
	}

	/**
	 * Returns a string to be used as a cache key for the current user and
	 * given resource name.
	 * @param  string $resourceName
	 * @return string
	 */
	private function makeCacheKey($resourceName) {
		$this->_initCredentials();
		$pieces = array(self::CACHE_KEY_PREFIX, $this->cacheOwner, $resourceName);
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
	 * Yield word lists for current user.
	 * @return  array Wordnik list objects.
	 */
	public function getLists() {
		$this->_initCredentials();

		// Attempt cache hit
		$cacheKey = $this->makeCacheKey(__FUNCTION__);
		$cachedResult = $this->cache->fetch($cacheKey);
		if($cachedResult) {
			$this->logger->debug("Loaded user word lists from cache (cache key $cacheKey).");
			return $cachedResult;
		}

		$this->logger->debug("Requesting user word lists from API. (Missed cache - cache key $cacheKey)");
		$result = $this->accountApi->getWordListsForLoggedInUser($this->authToken);

		$listsById = array();
		foreach($result as $WordnikList)
			$listsById[$WordnikList->id] = $WordnikList;

		$this->cache->save($cacheKey, $result);
		return $result;
	}

	/**
	 * Yield IDs of current user's Wordnik Lists which have $minCount or more
	 * words.
	 * @param int $minCount
	 * @return array The list IDs.
	 */
	public function filterListsWithWords($minCount = 2) {
		$this->_initCredentials();

		$wordLists = $this->getLists();
		$filteredListIds = array();
		foreach($wordLists as $WordnikList)
			if($WordnikList->numberWordsInList >= $minCount)
				$filteredListIds[] = $WordnikList->id;

		return $filteredListIds;
	}

}