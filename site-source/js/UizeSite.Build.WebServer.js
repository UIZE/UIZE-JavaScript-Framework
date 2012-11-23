/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Build.WebServer Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2012 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 1
	codeCompleteness: 100
	testCompleteness: 0
	docCompleteness: 4
*/

/*?
	Introduction
		The =UizeSite.Build.WebServer= package provides a method for running a Web server for the UIZE Web site on the localhost.

		*DEVELOPERS:* `Chris van Rensburg`

		EXAMPLE USAGE
		......................................................................................................
		node _build.js UizeSite.Build.WebServer sourcePath=site-source tempPath=site-temp builtPath=site-built freshBuild=true isDev=true
		......................................................................................................

		Parameters
			sourcePath
				document...

			tempPath
				document...

			builtPath
				document...

			freshBuild
				document...

			isDev
				document...

			scrunchedHeadComments
				document...
*/

Uize.module ({
	name:'UizeSite.Build.WebServer',
	required:[
		'UizeSite.Build.File',
		'Uize.Url',
		'Uize.Services.FileSystem'
	],
	builder:function () {
		/*** Variables for Scruncher Optimization ***/
			var _package = function () {};

		/*** General Variables ***/
			var _fileSystem = Uize.Services.FileSystem.singleton ();

		/*** Public Static Methods ***/
			_package.perform = function (_params) {
				var
					_port = 1337,
					_host = '127.0.0.1',
					_http = require ('http'),
					_mimeTypes = {
						html:'text/html',
						text:'text/plain',
						js:'application/javascript',
						css:'text/css',
						png:'image/png',
						gif:'image/gif',
						jpg:'image/jpeg'
					},
					_minAllowedModifiedDate = _params.freshBuild == 'true' ? Uize.now () : -Infinity,
					_builtPath = _params.builtPath
				;

				_http.createServer (
					function (_request,_response) {
						/*** default to index and strip query ***/
							var _requestUrl = _request.url == '/' ? '/index.html' : _request.url;

							/*** remove query from URL (since we don't handle this on the server side yet) ***/
								var _queryPos = _requestUrl.indexOf ('?');
								if (_queryPos > -1)
									_requestUrl = _requestUrl.slice (0,_queryPos)
								;

						var
							_builtUrl = _builtPath + _requestUrl,
							_fileContents,
							_startTime = Uize.now ()
						;
						try {
							UizeSite.Build.File.perform (
								Uize.copyInto (
									{
										url:_requestUrl.slice (1),
										minAllowedModifiedDate:_minAllowedModifiedDate
									},
									_params
								)
							);
							_fileContents = _fileSystem.readFile ({path:_builtUrl,encoding:'buffer'});
							_response.writeHead (200,{'Content-Type':_mimeTypes [Uize.Url.from (_requestUrl).fileType]});
						} catch (_error) {
							console.log ('404: ' + _requestUrl);
							_fileContents = '404';
							_response.writeHead (404,{'Content-Type':'text/html'});
						}
						_response.end (_fileContents);
						console.log ('PAGE DELIVERY TIME: ' + _requestUrl + ' (' + (Uize.now () - _startTime) + ')\n');
					}
				).listen (_port,_host);

				console.log ('Server running at http://' + _host + ':' + _port + '/');
				/*?
					Static Methods
						UizeSite.Build.WebServer.perform
							SYNTAX
							.............................................
							UizeSite.Build.WebServer.perform (paramsOBJ);
							.............................................

							Parameters
								sourcePath
									A string, specifying the folder path for the site's source code.

								tempPath
									A string, specifying the folder path for temporary files created while building files for the site.

								builtPath
									A string, specifying the folder path for the built files of the site.

								freshBuild
									document...

								isDev
									document...

								scrunchedHeadComments
									document...
				*/
			};

		return _package;
	}
});

