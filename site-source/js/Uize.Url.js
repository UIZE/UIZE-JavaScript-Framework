/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Url Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2004-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 7
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Url= module eases working with URLs, supporting query string parsing and serialization, resolving relative URLs to absolute URLs, and more.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Url',
	builder:function () {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_package = function () {},
				_undefined,
				_Uize_isArray = Uize.isArray
			;

		/*** General Variables ***/
			var
				_sacredEmptyArray = [],
				_sacredEmptyObject = {},
				_cacheDefeatStrCallCount = 0,
				_paramsDecodingOptionsDontFavorQuery = {favorQuery:false}
			;

		/*** Utility Functions ***/
			function _decodeUrlPiece (_toDecode) {
				return _toDecode != _undefined ? decodeURIComponent (_toDecode) : '';
			}

			function _encodeUrlPiece (_toEncode) {
				return encodeURIComponent (_toEncode + '');
			}

			function _splitOnQuery (_url,_favorQuery) {
				var _queryPos = (_url += '').indexOf ('?');
				if (_queryPos < 0 && !_favorQuery) _queryPos = _url.length;
				return {
					_urlPath:_url.slice (0,_queryPos),
					_queryStr:_url.slice (_queryPos + 1)
				};
			}

		/*** Public Static Methods ***/
			_package.from = function (_urlStr) {
				var _urlSegmentsMatch =
					_urlStr &&
					_urlStr.match (
						/^(([^:\\\/]+:)\/\/(([^:\\\/]*)(:(\d+))?)?)?(([^\?#]*[\\\/])?(([^\\\/\?#]*?)(\.([^\.\?#]+))?))(\?([^#]*))?(#(.*))?$/
					)
				;
				function _getUrlSegment (_segmentNo) {
					return _urlSegmentsMatch ? (_urlSegmentsMatch [_segmentNo] || '') : '';
				}
				return {                          // * properties marked '*' are consistent with browser's location object
					href:_urlStr,                  // * eg. http://uize.com:80/reference/Uize.html?param=value#anchor
					fullDomain:_getUrlSegment (1), //   eg. http://uize.com:80
					protocol:_getUrlSegment (2),   // * eg. http:
					host:_getUrlSegment (3),       // * eg. uize.com:80
					hostname:_getUrlSegment (4),   // * eg. uize.com
					port:_getUrlSegment (6),       // * eg. 80
					pathname:_getUrlSegment (7),   // * eg. /reference/Uize.html
					folderPath:_getUrlSegment (8), //   eg. /reference/
					file:_getUrlSegment (9),       //   eg. Uize.html
					fileName:_getUrlSegment (10),  //   eg. Uize
					extension:_getUrlSegment (11), //   eg. .html
					fileType:_getUrlSegment (12),  //   eg. html
					search:_getUrlSegment (13),    // * eg. ?param=value
					query:_getUrlSegment (14),     //   eg. param=value
					hash:_getUrlSegment (15),      // * eg. #anchor
					anchor:_getUrlSegment (16)     //   eg. hash
				};
				/*?
					Static Methods
						Uize.Url.from
							Returns an object, containing properties for the various logical segments of the specified URL string.

							SYNTAX
							........................................
							urlSegmentsOBJ = Uize.Url.from (urlSTR);
							........................................

							This method provides a convenient way to get at very precise portions of a URL string, such as the file name without the extension, the file type without the "." (period) character, the query params string without the "?" (question mark) character, the anchor without the "#" (pound / hash) character, etc.

							URL Segment Properties
								The =urlSegmentsOBJ= object returned by this method has the following structure...

								URL SEGMENTS OBJECT
								............................................................................................
								{
									href       : hrefSTR,       //  http://uize.com:80/reference/Uize.html?param=value#anchor
									fullDomain : fullDomainSTR, //  http://uize.com:80
									protocol   : protocolSTR,   //  http:
									host       : hostSTR,       //  uize.com:80
									hostname   : hostnameSTR,   //  uize.com
									port       : portSTR,       //  80
									pathname   : pathnameSTR,   //  /reference/Uize.html
									folderPath : folderPathSTR, //  /reference/
									file       : fileSTR,       //  Uize.html
									fileName   : fileNameSTR,   //  Uize
									extension  : extensionSTR,  //  .html
									fileType   : fileTypeSTR,   //  html
									search     : searchSTR,     //  ?param=value
									query      : querySTR,      //  param=value
									hash       : hashSTR,       //  #anchor
									anchor     : anchorSTR      //  hash
								}
								............................................................................................

								The URL segment properties are described in more detail below...

								href
									A string, representing the entire URL string parsed by the =Uize.Url.from= method.

									ILLUSTRATION
									.....................................................................
									URL      :  http://uize.com:80/reference/Uize.html?param=value#anchor
									PORTION  :  |<----------------------------------------------------->|
									VALUE    :  http://uize.com:80/reference/Uize.html?param=value#anchor
									.....................................................................

									NOTES
									- this property is equivalent to the same named property of the =window.location= object (see `Properties Consistent with window.location`)

								fullDomain
									A string, representing the portion of the URL comprised of the =protocol=, "//" (two forward slashes), and the =host=.

									ILLUSTRATION
									.....................................................................
									URL      :  http://uize.com:80/reference/Uize.html?param=value#anchor
									PORTION  :  |<-------------->|
									VALUE    :  http://uize.com:80
									.....................................................................

									NOTES
									- for relative URLs that only specify a =pathname= and/or =search= and/or =hash=, the value of this property will be =''= (an empty string)

								protocol
									A string, representing the [[http://en.wikipedia.org/wiki/Internet_Protocol][Internet protocol]] in use by the URL (eg. =http=, =ftp=, =irc=, =ssh=, etc.)

									ILLUSTRATION
									.....................................................................
									URL      :  http://uize.com:80/reference/Uize.html?param=value#anchor
									PORTION  :  |<->|
									VALUE    :  http:
									.....................................................................

									NOTES
									- for relative URLs that only specify a =pathname= and/or =search= and/or =hash=, the value of this property will be =''= (an empty string)
									- this property is equivalent to the same named property of the =window.location= object (see `Properties Consistent with window.location`)

								host
									A string, representing the portion of the URL comprised of the =hostname=, followed by a ":" (colon) character and the =port= if a port is present in the URL.

									ILLUSTRATION
									.....................................................................
									URL      :  http://uize.com:80/reference/Uize.html?param=value#anchor
									PORTION  :         |<------->|
									VALUE    :         uize.com:80
									.....................................................................

									NOTES
									- for relative URLs that only specify a =pathname= and/or =search= and/or =hash=, the value of this property will be =''= (an empty string)
									- this property is equivalent to the same named property of the =window.location= object (see `Properties Consistent with window.location`)

								hostname
									A string, representing the portion of the URL comprised of just the name of the host (ie. domain name or IP address) and without the =protocol= and =port= portions.

									ILLUSTRATION
									.....................................................................
									URL      :  http://uize.com:80/reference/Uize.html?param=value#anchor
									PORTION  :         |<---->|
									VALUE    :         uize.com
									.....................................................................

									NOTES
									- for relative URLs that only specify a =pathname= and/or =search= and/or =hash=, the value of this property will be =''= (an empty string)
									- this property is equivalent to the same named property of the =window.location= object (see `Properties Consistent with window.location`)

								port
									A string, representing the portion of the URL that specifies the [[http://en.wikipedia.org/wiki/TCP_and_UDP_port][port]] on which to communicate with a server.

									ILLUSTRATION
									.....................................................................
									URL      :  http://uize.com:80/reference/Uize.html?param=value#anchor
									PORTION  :                  ^^
									VALUE    :                  80
									.....................................................................

									Most URLs will not contain an explicit port, and the port will typically be defaulted by the server to 80 for communication via HTTP, and 443 for secure communication via HTTPS. For URLs that do not specify a port, the value of the =port= property will be =''= (an empty string).

									NOTES
									- for relative URLs that only specify a =pathname= and/or =search= and/or =hash=, the value of this property will be =''= (an empty string)
									- this property is equivalent to the same named property of the =window.location= object (see `Properties Consistent with window.location`)

								pathname
									A string, representing the portion of the URL comprised of the =folderPath= and =file=, and excluding the =fullDomain=, =search=, and =hash=.

									ILLUSTRATION
									.....................................................................
									URL      :  http://uize.com:80/reference/Uize.html?param=value#anchor
									PORTION  :                    |<---------------->|
									VALUE    :                    /reference/Uize.html
									.....................................................................

									NOTES
									- this property is equivalent to the same named property of the =window.location= object (see `Properties Consistent with window.location`)

								folderPath
									A string, representing the complete path to a folder (which may include multiple nested folder levels), and excluding the =fullDomain=, =file=, =search=, and =hash=.

									ILLUSTRATION
									.....................................................................
									URL      :  http://uize.com:80/reference/Uize.html?param=value#anchor
									PORTION  :                    |<------->|
									VALUE    :                    /reference/
									.....................................................................

								file
									A string, representing the portion of the URL comprised of just the =fileName= and =extension=, and excluding the =fullDomain=, =folderPath=, =search=, and =hash=.

									ILLUSTRATION
									.....................................................................
									URL      :  http://uize.com:80/reference/Uize.html?param=value#anchor
									PORTION  :                               |<----->|
									VALUE    :                               Uize.html
									.....................................................................

								fileName
									A string, representing the portion of the URL that specifies just the file name for a file, and excluding its =extension=.

									ILLUSTRATION
									.....................................................................
									URL      :  http://uize.com:80/reference/Uize.html?param=value#anchor
									PORTION  :                               |<>|
									VALUE    :                               Uize
									.....................................................................

								extension
									A string, representing the portion of the URL that specifies just the file extension for a file, and excluding its =fileName=.

									ILLUSTRATION
									.....................................................................
									URL      :  http://uize.com:80/reference/Uize.html?param=value#anchor
									PORTION  :                                   |<->|
									VALUE    :                                   .html
									.....................................................................

									Unlike the =fileType= property, the =extension= property contains the conventional "." (period character) delimiter that separates the =fileName= and =fileType=.

								fileType
									A string, representing the portion of the URL that specifies just the file type for a file, and excluding the conventional "." (period character) delimiter that separates the =fileName= and =fileType=.

									ILLUSTRATION
									.....................................................................
									URL      :  http://uize.com:80/reference/Uize.html?param=value#anchor
									PORTION  :                                    |<>|
									VALUE    :                                    html
									.....................................................................

								search
									A string, representing the portion of the URL comprised of the "?" (question mark) character and =query=, if present in the URL.

									ILLUSTRATION
									.....................................................................
									URL      :  http://uize.com:80/reference/Uize.html?param=value#anchor
									PORTION  :                                        |<-------->|
									VALUE    :                                        ?param=value
									.....................................................................

									Unlike the =query= property, the =search= property contains the conventional "?" (question mark character) that delimits the =query= from preceding portions of the URL.

									NOTES
									- this property is equivalent to the same named property of the =window.location= object (see `Properties Consistent with window.location`)

								query
									A string, representing the portion of the URL that specifies just the query parameters, and excluding the conventional "?" (question mark character) that delimits the =query= from preceding portions of the URL.

									ILLUSTRATION
									.....................................................................
									URL      :  http://uize.com:80/reference/Uize.html?param=value#anchor
									PORTION  :                                         |<------->|
									VALUE    :                                         param=value
									.....................................................................

								hash
									A string, representing the portion of the URL comprised of the "#" (hash / pound) character and =anchor=, if present in the URL.

									ILLUSTRATION
									.....................................................................
									URL      :  http://uize.com:80/reference/Uize.html?param=value#anchor
									PORTION  :                                                    |<--->|
									VALUE    :                                                    #anchor
									.....................................................................

									Unlike the =anchor= property, the =hash= property contains the conventional "#" (hash / pound character) that delimits the =anchor= from preceding portions of the URL.

									NOTES
									- this property is equivalent to the same named property of the =window.location= object (see `Properties Consistent with window.location`)

								anchor
									A string, representing the portion of the URL that specifies just the anchor name, and excluding the conventional "#" (hash / pound character) that delimits the =anchor= from preceding portions of the URL.

									ILLUSTRATION
									.....................................................................
									URL      :  http://uize.com:80/reference/Uize.html?param=value#anchor
									PORTION  :                                                     |<-->|
									VALUE    :                                                     anchor
									.....................................................................

							Properties Consistent with window.location
								Of the properties in the =urlSegmentsOBJ= object returned by the =Uize.Url.from= method, the properties =href=, =protocol=, =host=, =hostname=, =port=, =pathname=, =search=, and =hash= are consistent with the properties of the built-in =window.location= object.

							URL Segments, as a Tree
								The following diagram shows the properties of the =urlSegmentsOBJ= object as a tree structure, illustrating the relationship between the properties...

								URL SEGMENTS, AS A TREE
								........................
								href
								|__ fullDomain
								|       |__ protocol
								|       |__ //
								|       |__ host
								|            |__ hostname
								|            |__ :
								|            |__ port
								|
								|__ pathname
								|      |__ folderPath
								|      |__ file
								|            |__ fileName
								|            |__ extension
								|                    |__ .
								|                    |__ fileType
								|
								|__ search
								|      |__ ?
								|      |__ query
								|
								|__ hash
								      |__ #
								      |__ anchor
								........................

							Reconstructing a URL String
								A URL string can be reconstructed from a =urlSegmentsOBJ= type value in one of the following ways...

								...........................
								urlStr =
									urlSegments.fullDomain +
									urlSegments.pathname +
									urlSegments.search +
									urlSegments.hash
								;

								urlStr =
									urlSegments.fullDomain +
									urlSegments.folderPath +
									urlSegments.file +
									urlSegments.search +
									urlSegments.hash
								;

								urlStr =
									urlSegments.fullDomain +
									urlSegments.folderPath +
									urlSegments.fileName +
									urlSegments.extension +
									urlSegments.search +
									urlSegments.hash
								;
								...........................

								If you wish to reconstruct a URL string using any of the more granular URL segment properties, such as =protocol=, =hostname=, =port=, =fileType=, =query=, etc., then you will have to use logic to conditionally include the delimiters =//=, =:=, =.=, =?=, and =#=.

							NOTES
							- see also the =Uize.Url.fromParams= and =Uize.Url.fromPiece= static methods
				*/
			};

			_package.fromParams = function (_urlParamsStr,_decodingOptions) {
				var _urlParams = {};
				if (
					_urlParamsStr = _splitOnQuery (
						_urlParamsStr,
						(_decodingOptions || _sacredEmptyObject).favorQuery !== false
					)._queryStr
				) {
					for (
						var
							_urlParamPairNo = -1,
							_urlParamPairs = _urlParamsStr.split ('&'),
							_urlParamPairsLength = _urlParamPairs.length,
							_urlParamPair,
							_urlParamNameEncoded
						;
						++_urlParamPairNo < _urlParamPairsLength;
					) {
						if (_urlParamNameEncoded = (_urlParamPair = _urlParamPairs [_urlParamPairNo].split ('=')) [0])
							_urlParams [_decodeUrlPiece (_urlParamNameEncoded)] = _decodeUrlPiece (_urlParamPair [1])
						;
					}
				}
				return _urlParams;
				/*?
					Static Methods
						Uize.Url.fromParams
							A utility method that parses a query string and returns the query parameters as an object.

							SYNTAX
							.................................................
							paramsOBJ = Uize.Url.fromParams (queryParamsSTR);
							.................................................

							This method assumes that the query string was serialized using "&" to separate parameters, and "=" to separate parameter name from parameter value in each name/value pair.

							EXAMPLE
							.............................................................
							Uize.Url.fromParams ('category=holiday&type=all&results=20');
							.............................................................

							With the above query string, the =Uize.Url.fromParams= method would produce the object...

							......................
							{
								category:'holiday',
								type:'all',
								results:'20'
							}
							......................

							The value of the =queryParamsSTR= parameter may contain a prepended query '?' character, and even a URL path. These will simply be ignored when parsing the query parameters, so this method can be applied to a complete URL without worrying about first having to remove the path. So, extending on the above example, the same result would be produced if the value of the =queryParamsSTR= parameter was ='http://www.somedomain.com/search?category=holiday&type=all&results=20'=.

							NOTES
							- when parsing the query string, all parameter values are treated as strings
							- see also the corresponding =Uize.Url.toParams= static method
				*/
			};

			_package.fromPiece = _decodeUrlPiece;
				/*?
					Static Methods
						Uize.Url.fromPiece
							Returns a string, representing the decoded form of the specified URL segment string.

							SYNTAX
							.......................................................
							unencodedSTR = Uize.Url.fromPiece (encodedUrlPieceSTR);
							.......................................................

							EXAMPLE
							....................................................................................
							unencoded = Uize.Url.fromPiece ('solar%2C%20wind%2C%20efficiency%20%26%20biofuels');
							....................................................................................

							After executing the above statement, the variable =unencoded= would have the value ='solar, wind, efficiency & biofuels'=.

							NOTES
							- see also the corresponding =Uize.Url.toPiece= static method
				*/

			_package.getCacheDefeatStr = function () {
				return Uize.now () + '' + Math.round (Math.random () * 1000) + _cacheDefeatStrCallCount++;
				/*?
					Static Methods
						Uize.Url.getCacheDefeatStr
							A utility method that returns a string value, generated using time and a random number, that can then be used as a uniquifying query parameter on request URLs in order to defeat client caching.

							SYNTAX
							...............................................
							cacheDefeatSTR = Uize.Url.getCacheDefeatStr ();
							...............................................

							NOTES
							- this method takes no parameters
				*/
			};

			_package.toAbsolute = function (_baseUrl,_urlToAbsolutize) {
				var _baseUrlPieces = _urlToAbsolutize ? _package.from (_urlToAbsolutize) : _sacredEmptyObject;
				_baseUrlPieces.fullDomain ? (_urlToAbsolutize = '') : (_baseUrlPieces = _package.from (_baseUrl));
				var
					_lastFolderPathAndFilename,
					_folderPathAndFilename = _baseUrlPieces.folderPath + _urlToAbsolutize
				;
				while (_folderPathAndFilename != _lastFolderPathAndFilename) {
					_lastFolderPathAndFilename = _folderPathAndFilename;
					_folderPathAndFilename = _folderPathAndFilename.replace (/([\/\\])[^\/\\]*[\/\\]\.\.(?:[\/\\]|$)/,'$1');
				}
				return _baseUrlPieces.fullDomain + _folderPathAndFilename.replace (/\.\.([\/\\]|$)/g,'');
				/*?
					Static Methods
						Uize.Url.toAbsolute
							Returns a string, representing the specified relative URL resolved against the specified base URL.

							SYNTAX
							.................................................................
							absoluteUrlSTR = Uize.Url.toAbsolute (baseUrlSTR,relativeUrlSTR);
							.................................................................

							EXAMPLE 1
							.........................................................
							Uize.Url.toAbsolute (
								'http://www.uize.com/reference/source-code/Uize.html',
								'../../download.html'
							);
							.........................................................

							The above statement would produce the value ='http://www.uize.com/download.html'=.

							EXAMPLE 2
							.......................................................................
							Uize.Url.toAbsolute ('http://www.uize.com/index.html','download.html');
							.......................................................................

							The above statement would produce the value ='http://www.uize.com/download.html'=.

							EXAMPLE 3
							..........................................................
							Uize.Url.toAbsolute ('http://www.uize.com/index.html','');
							..........................................................

							The above statement would produce the value ='http://www.uize.com'=.
				*/
			};

			_package.toParams = function (_urlParams) {
				var
					_urlParamPairs = [],
					_paramValue
				;
				if (_Uize_isArray (_urlParams))
					_urlParams = _urlParams.length < 2
						? _urlParams [0]
						: Uize.copyInto.apply (Uize,[{}].concat (_urlParams))
				;
				for (var _paramName in _urlParams)
					_paramName && (_paramValue = _urlParams [_paramName]) != _undefined &&
						_urlParamPairs.push (_encodeUrlPiece (_paramName) + '=' + _encodeUrlPiece (_paramValue))
				;
				return _urlParamPairs.join ('&');
				/*?
					Static Methods
						Uize.Url.toParams
							A utility method that serializes the properties of the specified object to produce a URL query params string.

							SYNTAX
							...............................................
							queryParamsSTR = Uize.Url.toParams (paramsOBJ);
							...............................................

							This method assumes that the params in =paramsOBJ= should be serialized using "&" to separate parameters, and "=" to separate parameter name from parameter value in each name/value pair.

							EXAMPLE
							......................
							Uize.Url.toParams ({
								category:'holiday',
								type:'all',
								results:'20'
							});
							......................

							With the above =paramsOBJ= value, the =Uize.Url.toParams= method would produce the string...

							......................................
							'category=holiday&type=all&results=20'
							......................................

							VARIATION
							...........................................................
							queryParamsSTR = Uize.Url.toParams (urlParamsObjectsARRAY);
							...........................................................

							When a =urlParamsObjectsARRAY= parameter is specified, multiple params objects can be specified in an array. This provides for an easy way to merge query param sets from multiple sources, or to blend fixed params with parameterized params (eg. passed in a method call), or to override the values in param sets. The values from params objects later in the array override those from earlier params objects. None of the objects in the array will be modified by the operation.

							EXAMPLE
							..............................................................
							var defaultSearchSettings = {
								sort:'recent',
								type:'all',
								results:'20'
							};
							searchQueryParamsStr = Uize.Url.toParams (
								[defaultSearchSettings,{category:'holiday',sort:'popular'}]
							);
							..............................................................

							In the above example, the values of the =category= and =sort= properties of the second params object in the =urlParamsObjectsARRAY= value would be stitched in to the values provided by the =defaultSearchSettings= query params object that appears first in the array, with the value of the =sort= property of the second params object overriding the value contained in the =defaultSearchSettings= object, and with the =defaultSearchSettings= object *not* being modified in the process.

							NOTES
							- this method does not prepend the query '?' character to the params string
							- see also the corresponding =Uize.Url.fromParams= static method
				*/
			};

			_package.toPiece = _encodeUrlPiece;
				/*?
					Static Methods
						Uize.Url.toPiece
							Returns a string, representing the URL encoded form of the specified string.

							SYNTAX
							.....................................................
							encodedUrlPieceSTR = Uize.Url.toPiece (unencodedSTR);
							.....................................................

							EXAMPLE
							..........................................................................
							encodedUrlPiece = Uize.Url.toPiece ('solar, wind, efficiency & biofuels');
							..........................................................................

							After executing the above statement, the variable =encodedUrlPiece= would have the value ='solar%2C%20wind%2C%20efficiency%20%26%20biofuels'=.

							NOTES
							- see also the corresponding =Uize.Url.fromPiece= static method
				*/

			_package.resolve = function (_url,_urlParams) {
				if (_Uize_isArray (_url)) {
					_urlParams = _url.slice (1).concat (_urlParams || _sacredEmptyArray);
					_url = _url [0];
				}
				var _urlParamsStr = _package.toParams (
					[_package.fromParams (_url,_paramsDecodingOptionsDontFavorQuery)].concat (
						_Uize_isArray (_urlParams) ? _urlParams : [_urlParams]
					)
				);
				return _splitOnQuery (_url)._urlPath + (_urlParamsStr ? '?' : '') + _urlParamsStr;
				/*?
					Static Methods
						Uize.Url.resolve
							Returns a string, representing a URL that has been resolved from the specified URL path string and query params object.

							SYNTAX
							....................................................
							urlSTR = Uize.Url.resolve (urlPathSTR,urlParamsOBJ);
							....................................................

							EXAMPLE
							......................................
							searchUrl = Uize.Url.resolve (
								'http://www.somedomain.com/search',
								{
									category:'holiday',
									type:'all',
									results:'20'
								}
							);
							......................................

							In the above example, the =Uize.Url.resolve= method would produce the result ='http://www.somedomain.com/search?category=holiday&type=all&results=20'=.

							An Existing Query Character
								The value of the =urlPathSTR= parameter may already contain a query '?' character at the end.

								If this is the case, the =Uize.Url.resolve= method will *not* add an additional query character. So, the following example would produce the same result as the first example...

								EXAMPLE
								.......................................
								searchUrl = Uize.Url.resolve (
									'http://www.somedomain.com/search?',
									{
										category:'holiday',
										type:'all',
										results:'20'
									}
								);
								.......................................

								In the above example, the =Uize.Url.resolve= method would produce the result ='http://www.somedomain.com/search?category=holiday&type=all&results=20'=.

							Augmenting Existing Query Params
								The value of the =urlPathSTR= parameter may already contain query parameters.

								If this is the case, the =Uize.Url.resolve= method will concatenate the additional query parameters using the '&' query param delimiter.

								EXAMPLE
								..................................................
								searchUrl = Uize.Url.resolve (
									'http://www.somedomain.com/search?sort=recent',
									{
										category:'holiday',
										type:'all',
										results:'20'
									}
								);
								..................................................

								In the above example, the =Uize.Url.resolve= method would produce the result ='http://www.somedomain.com/search?sort=recent&category=holiday&type=all&results=20'=.

							Modifying Existing Query Params
								The value of the =urlPathSTR= parameter may contain query parameters whose values you wish to modify.

								Overwriting existing values for query params is handled automatically by the =Uize.Url.resolve= method - all you have to do is specify the new values in the =urlParamsOBJ= parameter.

								EXAMPLE
								......................................................................
								searchUrl = Uize.Url.resolve (
									'http://www.somedomain.com/search?sort=recent&results=20',
									{
										sort:'popular',      // overwrites existing sort param in URL
										category:'holiday',
										type:'all',
										results:'100'        // overwrites existing results param in URL
									}
								);
								......................................................................

								In the above example, the =Uize.Url.resolve= method would produce the result ='http://www.somedomain.com/search?sort=popular&results=100&category=holiday&type=all'=.

							Removing Existing Query Params
								The value of the =urlPathSTR= parameter may contain query parameters that you wish to remove.

								Removing existing query params from a URL can be accomplished by specifying the value =null= for the params you wish to remove in the =urlParamsOBJ= parameter. You can specify to remove params that don't exist in the URL, without any ill effects - those params will simply be ignored.

								EXAMPLE
								..........................................................................
								searchUrl = Uize.Url.resolve (
									'http://www.somedomain.com/search?sort=recent&results=20',
									{
										sort:null,      // removes existing sort param in URL
										category:null,  // would remove category param in URL, if it existed
										type:'all',
										results:null    // removes existing results param in URL
									}
								);
								..........................................................................

								In the above example, the =Uize.Url.resolve= method would produce the result ='http://www.somedomain.com/search?type=all'=.

							Variations
								The =Uize.Url.resolve= method is quite versatile in its signature, with several variations that can come in handy under different circumstances.

								VARIATION 1
								.............................................................
								urlSTR = Uize.Url.resolve (urlPathSTR,urlParamsObjectsARRAY);
								.............................................................

								When a =urlParamsObjectsARRAY= parameter is specified, multiple params objects can be specified in an array. This provides for an easy way to merge query param sets from multiple sources, or to blend fixed params with parameterized params (eg. passed in a method call), or to override the values in param sets. The values from params objects later in the array override those from earlier params objects. None of the objects in the array will be modified by the operation.

								EXAMPLE
								......................................
								var defaultSearchSettings = {
									sort:'recent',
									type:'all',
									results:'20'
								};
								searchUrl = Uize.Url.resolve (
									'http://www.somedomain.com/search',
									[
										defaultSearchSettings,
										{
											category:'holiday',
											sort:'popular'
										}
									]
								);
								......................................

								In the above example, the values of the =category= and =sort= properties of the second params object in the =urlParamsObjectsARRAY= value would be stitched in to the values provided by the =defaultSearchSettings= query params object that appears first in the array, with the value of the =sort= property of the second params object overriding the value contained in the =defaultSearchSettings= object, and with the =defaultSearchSettings= object *not* being modified in the process.

								VARIATION 2
								.........................................................
								urlSTR = Uize.Url.resolve (urlPathAndParamsObjectsARRAY);
								.........................................................

								Another versatile variation allows a single =urlPathAndParamsObjectsARRAY= parameter to be specified, where the array specified by this parameter contains the URL path string as its first element, and an arbitrary number of params objects in subsequent elements. Using this variation, the example shown for *VARIATION 1* could be re-written as...

								EXAMPLE
								......................................
								var defaultSearchSettings = {
									sort:'recent',
									type:'all',
									results:'20'
								};
								searchUrl = Uize.Url.resolve ([
									'http://www.somedomain.com/search',
									defaultSearchSettings,
									{
										category:'holiday',
										sort:'popular'
									}
								]);
								......................................

								This variation is powerful in that it allows you to write functions that can accept a single URL parameter, where that parameter's value may be a string, *or* an array containing a string path and params objects - and a single call to the =Uize.Url.resolve= method will resolve it to a string for the benefit of your functions' implementation code.

								VARIATION 3
								......................................................................
								urlSTR = Uize.Url.resolve (urlPathAndParamsObjectsARRAY,urlParamsOBJ);
								......................................................................

								When using the =urlPathAndParamsObjectsARRAY= parameter, you can still specify the =urlParamsOBJ= second parameter to stitch in further query params.

								EXAMPLE
								.............................................................
								var defaultSearchSettings = {
									sort:'recent',
									type:'all',
									results:'20'
								};
								searchUrl = Uize.Url.resolve (
									['http://www.somedomain.com/search',defaultSearchSettings],
									{
										category:'holiday',
										sort:'popular'
									}
								);
								.............................................................

								The above example would produce the same results as the previous example.

								VARIATION 4
								...............................................................................
								urlSTR = Uize.Url.resolve (urlPathAndParamsObjectsARRAY,urlParamsObjectsARRAY);
								...............................................................................

								Finally, it is also possible to specify the =urlParamsObjectsARRAY= second parameter, allowing ridiculous numbers of query params objects to be specified where desired and/or convenient.

								EXAMPLE
								.............................................................
								var defaultSearchSettings = {
									sort:'recent',
									type:'all',
									results:'20'
								};
								searchUrl = Uize.Url.resolve (
									['http://www.somedomain.com/search',{category:'holiday'}],
									[
										defaultSearchSettings,
										{sort:'popular'}
									]
								);
								.............................................................

								The above example would produce the same results as the previous example.

							Conditional Params
								If the value for a query params object is =null= or =undefined=, it will simply be treated as an empty params object, regardless of whether it's specified for the =urlParamsOBJ= parameter or one of the elements in the =urlPathAndParamsObjectsARRAY= or =urlParamsObjectsARRAY= parameters. This is convenient when using conditional expressions to choose params that should or should not be present.

								EXAMPLE
								......................................................
								var defaultSearchSettings = {
									category:'any',
									sort:'recent',
									type:'all',
									results:'20'
								};
								searchUrl = Uize.Url.resolve ([
									'http://www.somedomain.com/search',
									defaultSearchSettings,
									searchCategory ? {category:searchCategory} : null,
									useUserSearchSettings ? userSearchSettings : null,
									useCustomSort ? {sort:customSortValue} : null
								]);
								......................................................

								In the above example, conditional expressions that result in a null value will be treated as params objects containing no param values, so they will have no effect.

							NOTES
							- see also the =Uize.Url.toParams= static method
				*/
			};

		return _package;
	}
});

