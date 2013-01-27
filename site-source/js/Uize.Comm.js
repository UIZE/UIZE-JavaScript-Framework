/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Comm Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2004-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 10
	codeCompleteness: 90
	docCompleteness: 80
*/

/*?
	Introduction
		The =Uize.Comm= class provides functionality and interface that is shared by subclasses that implement support for specific communication protocols.

		*DEVELOPERS:* `Chris van Rensburg`, `Jan Borgersen`, original code donated by `Zazzle Inc.`

		The =Uize.Comm= class serves as the base class for subclasses that implement support for specific communication protocols (such as =Uize.Comm.Ajax=, =Uize.Comm.Iframe=, and =Uize.Comm.Script=). The =Uize.Comm= base class provides support for queuing subsequent calls to allow sequenced server requests.
*/

Uize.module ({
	name:'Uize.Comm',
	superclass:'Uize.Class',
	required:'Uize.Url',
	builder:function (_superclass) {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_true = true,
				_false = false,
				_undefined
			;

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					function () {
						var _this = this;

						/*** Private Instance Properties ***/
							_this._requestQueue = [];
							_this._responseCache = {};

						/*** Public Instance Properties ***/
							_this.requestQueue = _this._requestQueue;
							/*?
								Instance Properties
									requestQueue
										An array, containing all pending requests that have been queued up and are waiting to be performed.

										NOTES
										- see also the =flush=, =queueRequest=, and =useQueue= instance methods
							*/
					}
				),
				_classPrototype = _class.prototype
			;

		/*** Utility Functions ***/
			function _getResponsePropertyNameForRequest (_request) {
				return 'response' + Uize.capFirstChar (_request.returnType);
			}

			function _resolveRequestUrl (_request) {
				_request.url = Uize.Url.resolve (_request.url) // resolves it, in case it's an array
			}

		/*** Private Instance Methods ***/
			_classPrototype._getCachedResponse = function (_request) {
				return _request.cache == 'memory' ? this._responseCache [_request.url] : null
			};

			_classPrototype._callResponseCallback = function (_request) {
				var
					_returnType = _request.returnType,
					_requestCallback = _request.callback,
					_cachedResponse = this._getCachedResponse (_request)
				;
				if (_cachedResponse) {
					var _returnTypeIsObject = _returnType == 'object';
					if (_requestCallback) {
						_request.responseText = '';
						_request.responseJson = _request.responseXml = null;
						if (_returnTypeIsObject || _returnType == 'xml')
							_request.responseXml = Uize.clone (_cachedResponse.responseXml)
						;
						if (_returnTypeIsObject || _returnType == 'text')
							_request.responseText = _cachedResponse.responseText
						;
						if (_returnTypeIsObject || _returnType == 'json')
							_request.responseJson = Uize.clone (_cachedResponse.responseJson)
						;
					}
				} else {
					if (_request.cache == 'memory')
						this._responseCache [_request.url] = {
							responseXml:Uize.clone (_request.responseXml),
							responseJson:Uize.clone (_request.responseJson),
							responseText:_request.responseText
						}
					;
				}
				_requestCallback &&
					_requestCallback (
						_returnType == 'object' ? _request : _request [_getResponsePropertyNameForRequest (_request)]
					)
				;
			};

			_classPrototype._fireRequestQueueUpdatedEvent = function () {
				this.fire ('Request Queue Updated');
				/*?
					Instance Events
						Request Queue Updated
							The =Request Queue Updated= event is fired each time the =requestQueue= instance property is updated.
				*/
			};

		/*** Public Instance Methods ***/
			_classPrototype.performRequest = function (_request,_callback) {
				_callback ();
				/*?
					Instance Methods
						performRequest
							A method that should be overrided in subclasses that implement support for specific communication protocols.

							SYNTAX
							...................................................
							myInstance.performRequest (requestOBJ,callbackFUNC)
							...................................................

							This method is not intended to be called by application code. It is only public so that it can be overrided in subclasses. When implementing this method in a subclass, your method should expect to receive the two parameters =requestOBJ= and =callbackFUNC=. The =requestOBJ= parameter will contain all the information necessary for performing the request.

							Once the request has been sucessfully completed, your implementation should place request results into =requestOBJ= and then call the callback function specified in the =callbackFUNC= parameter. It is not necessary to pass any parameters when calling the =callbackFUNC= function, since the request results are placed into =requestOBJ=.
				*/
			};

			_classPrototype.flush = function () {
				this._requestQueue.length = 0;
				this._fireRequestQueueUpdatedEvent ();
				/*?
					Instance Methods
						flush
							A method that lets you flush the request queue.

							SYNTAX
							....................
							myInstance.flush ();
							....................

							NOTES
							- this method takes no parameters
							- after flushing the request queue, the =Request Queue Updated= instance event will be fired
							- see also the =queueRequest= and =useQueue= instance methods
							- see also the =requestQueue= instance property
				*/
			};

			_classPrototype.flushCache = function (_requestOrUrl) {
				arguments.length
					? delete this._responseCache [typeof _requestOrUrl == 'string' ? _requestOrUrl : _requestOrUrl.url]
					: (this._responseCache = {})
				;
				/*?
					Instance Methods
						flushCache
							Lets you flush the cached response for a specific request, or lets you flush the entire response cache for the instance.

							SYNTAX
							...................................
							myInstance.flushCache (requestOBJ);
							...................................

							VARIATION 1
							......................................
							myInstance.flushCache (requestUrlSTR);
							......................................

							As an alternative to specifying a request by request object, a request can be specified by its URL (ie. the value of the =url= property of the request object).

							VARIATION 2
							.........................
							myInstance.flushCache ();
							.........................

							When no parameter is specified, then the =flushCache= method will flush the entire response cache for the instance.

							NOTES
							- don't confuse this method with the =flush= instance method that flushes the request queue
				*/
			};

			_classPrototype.request = function (_request) {
				var _this = this;
				_resolveRequestUrl (_request);
				if (_this._getCachedResponse (_request)) {
					setTimeout (function () {_this._callResponseCallback (_request)},0);
				} else {
					_this.queueRequest (_request);
					_this.useQueue ();
				}
				/*?
					Instance Methods
						request
							A method that lets you initiate a request.

							SYNTAX
							................................
							myInstance.request (requestOBJ);
							................................

							All the information that governs the request is contained inside the =requestOBJ= parameter. The properties of this object will vary, depending on the communication protocol and are determined by the particular subclass =Uize.Comm= you are using.

							SYNTAX (EXPLODED)
							................................................
							myInstance.request ({
								// ...properties specific to comm protocol...
								// ...properties specific to comm protocol...
								// ...properties specific to comm protocol...
								returnType:returnTypeSTR,
								cache:cacheBOOLorSTR,
								callback:callbackFUNC
							});
							................................................

							requestOBJ Properties
								The =Uize.Comm= base class handles the following properties of the =requestOBJ= parameter...

								returnType
									A string, specifying the data type that should be used when passing the response result to the callback function specified by the =callback= property.

									VALUES
									- ='text'= - the value of the =responseText= property of =requestOBJ= will be passed as the parameter to the =callback= function
									- ='json'= - the value of the =responseJson= property of =requestOBJ= will be passed as the parameter to the =callback= function
									- ='xml'= - the value of the =responseJson= property of =requestOBJ= will be passed as the parameter to the =callback= function
									- ='object'= (default) - the =requestOBJ= object will be passed as the parameter to the =callback= function

									NOTES
									- the default value for this property is ='object'=

								cache
									A string, specifying the caching mode that should be employed when performing the request.

									VALUES
									- ='memory'= - a JavaScript memory based mechanism will be employed to cache the request's response. Using this caching mode, the browser's caching mechanism is preempted. Because this caching mode is memory based, the caching of responses in this mode is not persisted across page reloads or navigation. This mode is useful for requests that are likely to be hit heavily and repeatedly throughout a page session.
									- ='browser'= - caching is left to the browser's built-in mechanism.
									- ='never'= (default) - a cache defeat mechanism is employed to ensure that the request is never cached. This mode is useful for requests where the response will vary with repeated use - even with identical request parameters - because the response may be determined by data beyond that contained in the request, such as data contributed through community interaction with a Web application, or data that is updated in the user's session.

									NOTES
									- the default value for this property is ='never'=

								callback
									A function reference, specifying the function that should be called once the request has been performed.

									The callback function you specify should expect to receive one parameter that will be of the type specified by the =returnType= property.

								cutToHead
									A boolean, specifying whether or not the request should cut to the head of the request queue.

									If the value =false= is specified for the =cutToHead= property, or if this property is not specified, then the request is appended to the request queue. This is the default behavior. In some rare cases, such as when recovering from a request that returns a failure / error response, it might be desirable to push requests that are part of recovering from the failed request to the head of the queue. In such cases, such recovery requests can specify the value =true= for the =cutToHead= property.
				*/
			};

			_classPrototype.queueRequest = function (_request) {
				var _this = this;
				_resolveRequestUrl (_request);
				delete _request.completed; // in case the request object was already used for a previous request and completed was set to true (we don't want the repeated request wrapped up prematurely)
				if (!_request.requestMethod) _request.requestMethod = 'GET';
				if (!_request.returnType) _request.returnType = 'object';
				if (typeof _request.cache != 'string')
					_request.cache = _request.cache ? 'memory' : 'never'
				;
				_this._requestQueue [_request.cutToHead ? 'unshift' : 'push'] (_request);
				_this._fireRequestQueueUpdatedEvent ();
			};

			_classPrototype.useQueue = function () {
				var
					_this = this,
					_requestQueue = _this._requestQueue,
					_requestQueueLength = _requestQueue.length
				;
				if (!_this._usingQueue && _requestQueueLength) {
					_this._usingQueue = _true;

					var
						_cleanFromQueue = function () {
							var _request;
							while (
								(_request = _requestQueue [0]) && (_this._getCachedResponse (_request) || _request.completed)
							)
								_this._callResponseCallback (_requestQueue.shift ())
							;
							_this._usingQueue = _false;
							_this._fireRequestQueueUpdatedEvent ();

							_requestQueue.length && setTimeout (function () {_this.useQueue ()},1);
								/* TO DO:
									- determine whether or not it's necessary and/or OK to set a timeout in the AJAX case
									- determine if it's OK in the IFRAME case to do the location back before this timeout is set
								*/
						},
						_handleSingleRequest = function (_request) {
							if (_this._getCachedResponse (_request)) {
								_cleanFromQueue ();
							} else {
								_this.fire ({name:'Perform Request',request:_request});
								/*?
									Instance Events
										Perform Request
											The =Perform Request= instance event fires each time before a request is performed - for both single requests as well as batch requests. The event object contains a "request" property, which is a reference to the request object for the request about to be performed.
								*/
								_this.performRequest (
									_request,
									function () {
										_request.completed = _true;
										_cleanFromQueue ();
									}
								);
							}
						}
					;

					if (_requestQueueLength == 1) {
						_handleSingleRequest (_requestQueue [0]);
					} else {
						var _requestsToBatch = [];

						/*** determine list of requests to batch ***/
							var _batchingAgent;
							for (var _requestNo = -1; ++_requestNo < _requestQueueLength;) {
								var
									_request = _requestQueue [_requestNo],
									_requestBatchingAgent = _request.batchingAgent
								;
								if (
									!_requestBatchingAgent ||
									(_batchingAgent && _requestBatchingAgent != _batchingAgent) ||
									_request.cache == 'browser'
								) {
									break;
								} else {
									if (!_batchingAgent)
										_batchingAgent = _requestBatchingAgent
									;
									_requestsToBatch.push (_request);
								}
							}

						var _requestsToBatchLength = _requestsToBatch.length;
						if (_requestsToBatchLength > 1) {
							/*** handle batch request ***/
								/*** find all the requests in the batch that aren't already memory cached ***/
									var _requestsInBatchRequest = [];
									for (var _requestNo = -1; ++_requestNo < _requestsToBatchLength;) {
										var _request = _requestsToBatch [_requestNo];
										if (!_this._getCachedResponse (_request)) {
											_request.completed = _false;
											_requestsInBatchRequest.push (_request);
										}
									}

								/*** perform batch request and handle responses ***/
									var _requestsInBatchRequestLength = _requestsInBatchRequest.length;
									if (_requestsInBatchRequestLength) {
										if (_requestsInBatchRequestLength == 1) {
											_handleSingleRequest (_requestsInBatchRequest [0]);
										} else {
											/* NOTE:
												only package up as a batch request if there turn out to be more than one non-cached requests
											*/
											var _batchRequest = _batchingAgent.buildRequest (_requestsInBatchRequest);
											_this.fire ({name:'Perform Request',request:_batchRequest});
											_this.performRequest (
												_batchRequest,
												function () {
													var
														_batchResponses = _batchingAgent.responseParser (_batchRequest),
														_batchResponseNo = 0
													;
													for (var _requestNo = -1; ++_requestNo < _requestsToBatchLength;) {
														var _request = _requestsToBatch [_requestNo];
														if (_request.completed !== _undefined) {
															_request [_getResponsePropertyNameForRequest (_request)] =
																_batchResponses [_batchResponseNo++]
															;
															_request.completed = _true;
														}
													}
													_cleanFromQueue ();
												}
											);
										}
									} else {
										_cleanFromQueue ();
									}
						} else {
							/*** handle single request ***/
								_handleSingleRequest (_requestQueue [0]);
						}
					}
				}
			};

		/*** Public Static Methods ***/
			_class.processArrayAsync = function (_elements,_processElementAsync,_completion,_direction) {
				if (!_direction) _direction = 1;
				var
					_elementsLengthMinus1 = _elements.length - 1,
					_elementNo = (_direction > 0 ? 0 : _elementsLengthMinus1) - _direction
				;
				function _processNextElement (_mustContinue) {
					(_elementNo += _direction) >= 0 && _elementNo <= _elementsLengthMinus1 && _mustContinue !== _false
						? _processElementAsync (_elements [_elementNo],_processNextElement,_elementNo)
						: _completion ? _completion (_elementsLengthMinus1 + 1) : 0
				}
				_processNextElement ();
				/*?
					Static Methods
						Uize.Comm.processArrayAsync
							A method that facilitates asynchronous iteration through and processing of the elements of an array.

							SYNTAX
							...................................................................................
							Uize.Comm.processArrayAsync (elementsARRAY,processElementAsyncFUNC,completionFUNC);
							...................................................................................

							While asynchronous, the array specified by the =elementsARRAY= parameter is guaranteed to be iterated through sequentially. This method is useful for iterating through the elements of an array and using an asynchronous communication protocol, such as Ajax, in the processing of the elements.

							The function you specify in the =processElementAsyncFUNC= parameter should be of the form...

							......................................................................................
							myAsyncElementProcessor (elementToProcessANYTYPE,processNextElementFUNC,elementNoINT);
							......................................................................................

							The value of the =elementToProcessANYTYPE= parameter will be the value of each successive element in the array that is being iterated through. In order to inform the =Uize.Comm.processArrayAsync= method that the asynchronous processing of the current element has been completed so that it can continue on with the iteration, the function specified by the =processNextElementFUNC= parameter should be called. This function does not need to be called with any parameters. However, if you call it with the value =false=, then the iteration will be terminated and any function that you specified for the =completionFUNC= parameter will be called.

							Your processor function can optionally declare an =elementNoINT= parameter, to receive the array index of the current element being processed. This might be useful if you need to index into other corresponding support data structures, or use the number as part of the construction of some string or such. Naturally, your own element processor function can name these three parameters whatever it likes.

							If you specified a value for the optional =completionFUNC= parameter, then your completion function will be called once the iteration is completed, with one parameter, being the length of the array that was processed.

							TYPICAL USAGE SKELETON
							...................................................................
							Uize.Comm.processArrayAsync (
								_elementsToIterateThrough,
								function (_currentElement,_continueIterating) {
									_doSomethingAsynchronous (
										function () { // the callback for _doSomethingAsynchronous
											// further processing of element
											_continueIterating ();
										}
									);
								},
								function () {
									// done iterating, wrap it all up
								}
							);
							...................................................................

							EXAMPLE
							........................................................................................
							var imagesInfoHtml = '';
							Uize.Comm.processArrayAsync (
								myPhotoStream.getImageIds (),
								function (_imageId,_addInfoHtmlForNextImage) {
									myAjaxCommObject.request ({
										url:'/svc/getimageinfo?id=' + _imageId,
										returnType:'json',
										requestMethod:'GET',
										callback:function (resonseJson) {
											imagesInfoHtml +=
												'title: ' + resonseJson.title + '<br/>' +
												'description: ' + resonseJson.description + '<br/>' +
												'dimensions: ' + resonseJson.width + 'x' + resonseJson.height + '<br/>' +
												'<hr/>'
											;
											_addInfoHtmlForNextImage ();
										}
									});
								},
								function () {
									Uize.Node.setInnerHtml ('imagesInfo',imagesInfoHtml);
								}
							);
							........................................................................................

							In this fictitious example, =Uize.Comm.processArrayAsync= is being used to iterate through an array of image IDs for a photo stream.

							On each iteration, the processor function performs an asynchronous request, using an instance of =Uize.Comm.Ajax=, to the service "/svc/getimageinfo" in order to get info for each image. When the Ajax request returns with the image info, the callback registered for the request uses the image info to build image info HTML for the entire photo stream. After adding to the HTML string, the continuation function is called in order to continue the iteration. Once all the image IDs have been processed, the completion function is called, which spits out the constructed info HTML into the page.

							One thing that this example demonstrates is that the parameters that your element processor function receives can be named to be semantically suitable to your application.

							VARIATION 1
							....................................................................
							Uize.Comm.processArrayAsync (
								elementsARRAY,processElementAsyncFUNC,completionFUNC,directionINT
							);
							....................................................................

							The optional =directionINT= parameter lets you specify the increment (and, therefore, direction) of the asynchronous loop. By default, this method loops forward through the array - from the first element to the last element. Specifying a value of =-1= for the =directionINT= parameter will cause the iteration to start from the last element of the array and loop towards the first element - one element at a time. Specifying a value of =-2= will also result in a reverse loop, but will iterate backwards two elements at a time.

							VARIATION 2
							....................................................................
							Uize.Comm.processArrayAsync (elementsARRAY,processElementAsyncFUNC);
							....................................................................

							When the optional =completionFUNC= parameter is not specified, then the caller of this method will not be notified when the process has been completed.
				*/
			};

		return _class;
	}
});

