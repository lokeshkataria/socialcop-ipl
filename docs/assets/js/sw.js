	
	var version = 'v1';
	var base_url = 'https://lokeshkataria.github.io/socialcop-ipl/';
	
	/* indexed DB initialization */
	var request = indexedDB.open("iplDb",1);
	request.onerror = function(event) {
		
	}
	var db;

	request.onsuccess = function(event) {
		db = event.target.result;
		
		db.onerror = function(event) {
			// Generic error handler for all errors targeted at this database's
			// requests!
			//alert("Database error: " + event.target.errorCode);
		};

	}

	request.onupgradeneeded = function(event) {
		var db =  event.target.result;
		var storeNames = db.objectStoreNames;
		if(!storeNames.contains("mediaImages"))
			var objectStore = db.createObjectStore("mediaImages",{ keyPath: "url" });
		if(!storeNames.contains("blobImages"))
			var blobStore = db.createObjectStore("blobImages");
	}
	/* indexed DB initialization end */
	
	/* Application specific data */
	var CACHE_STATIC = 'ipl-cache-'+version;
	var CACHE_SOURCE = 'ipl-pages-cache-'+version;
	
	var networkFirstUrl = [
	  '/socialcop-ipl/',
	  '/socialcop-ipl/index.html',
	  '/socialcop-ipl/inline.bundle.js',
	  '/socialcop-ipl/polyfills.bundle.js',
	  '/socialcop-ipl/styles.bundle.js',
	  '/socialcop-ipl/vendor.bundle.js',
	  '/socialcop-ipl/main.bundle.js',
	];

	
	var cacheFirstUrl = [
	  '/socialcop-ipl/assets/vendor/bootstrap/css/bootstrap.min.css',
	  '/socialcop-ipl/assets/vendor/font-awesome/css/font-awesome.min.css',
	  '/socialcop-ipl/assets/css/sb-admin.css',
	  '/socialcop-ipl/assets/vendor/jquery/jquery.min.js',
	  '/socialcop-ipl/assets/vendor/bootstrap/js/bootstrap.bundle.min.js',
	  '/socialcop-ipl/assets/vendor/chart.js/Chart.min.js'
	];

	var myCaches = [
		{
			name: CACHE_STATIC,
			urls: cacheFirstUrl
		},
		{
			name: CACHE_SOURCE,
			urls: networkFirstUrl
		}
	];
	
	self.addEventListener('install',function(event) {
		
		event.waitUntil(Promise.all(
			myCaches.map(function (myCache) {
				return caches.open(myCache.name).then(function (cache) {
				  return cache.addAll(myCache.urls);
				})
			} 	)
		));
	});
	
	this.addEventListener('activate', function(event) {
	  var cacheWhitelist = [version];

	  event.waitUntil(
		caches.keys().then(function(keyList) {
		  return Promise.all(keyList.map(function(key) {
			if (key.indexOf(cacheWhitelist) === -1) {
			  return caches.delete(key);
			}
		  }));
		})
	  );
	});

	self.addEventListener('fetch', function(event) {
		var requestUrl = event.request.url;
		var imgFile;
		var static_request;console.info(requestUrl);
		for(var u = 0;u < cacheFirstUrl.length;u++) {
			if (requestUrl.indexOf(cacheFirstUrl[u]) > -1) {
				static_request = 1;
				break;
			}
		}
		if(static_request == 1) {
			cacheName = CACHE_STATIC;
			event.respondWith(
				caches.match(event.request).then( function(response) {
						request = event.request;

						if(response) {
							return response;
						}

						var requestToCache = request.clone();
						return fetch(request).then(
								function(response) {
										// check if we received a valid response
										if(!response || response.status !== 200 || response.type !== 'basic') {

												return response;
										} 
										if(request.method != 'POST') {
											var responseToCache = response.clone();
											if(requestUrl.indexOf('connection-test') === -1) {
												caches.open(cacheName).then(function(cache){
														cache.put(requestToCache,responseToCache);
												});
											}
										}
										return response;
								}
						).catch(function(err){
							if(requestUrl.indexOf('connection-test') === -1){
								 return offlineResponse();
							}
						}); // catch end
				}) // cache end
			); // event end
		} else {
			// Non static files - network then cache
			cacheName = CACHE_PAGES; 
			request = event.request;
			event.respondWith(
				fetch(request).then(
					function(response) {
					// check if we received a valid response
						if(!response || response.status !== 200 || response.type !== 'basic') {
							
							return response;
						} 
						if(request.method != 'POST') {
							var responseToCache = response.clone();
							var requestToCache = request.clone();
							caches.open(cacheName).then(function(cache){
								cache.put(requestToCache,responseToCache);
							});
						}
						return response;
					}
				).catch(function(err){
					if(requestUrl.indexOf('connection-test') === -1){
						return caches.match(request).then( function(response) {
					
							if(response) { 
								return response;
							}
							return offlineResponse();
						}) // cache end
					}
				}) // catch end		
			); // event end
		}
	});

	function offlineResponse() {
		return new Response('<h1>You are offline or Service Unavailable</h1>', {
					status: 503,
					statusText: 'Service Unavailable',
					headers: new Headers({
						'Content-Type': 'text/html'
					})
			}); // return end*/
	}
