/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Build.WebServer Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2012-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 1
	codeCompleteness: 100
	docCompleteness: 4
*/

/*?
	Introduction
		The =Uize.Build.WebServer= package provides a method for running a Web server for a project on the localhost.

		*DEVELOPERS:* `Chris van Rensburg`

		EXAMPLE USAGE
		......................................................................................................
		node build.js Uize.Build.WebServer sourcePath=site-source tempPath=site-temp builtPath=site-built staleBefore=now isDev=true
		......................................................................................................

		Parameters
			sourcePath
				.

			tempPath
				.

			builtPath
				.

			staleBefore
				.

			isDev
				.

			scrunchedHeadComments
				.
*/

Uize.module ({
	name:'Uize.Build.WebServer',
	required:[
		'Uize.Url',
		'Uize.Services.FileBuilder',
		'Uize.Services.FileSystem'
	],
	builder:function () {
		'use strict';

		return {
			perform:function (_params) {
				var
					_fileBuilder = Uize.Services.FileBuilder.singleton (),
					_fileSystem = Uize.Services.FileSystem.singleton (),
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
							_fileBuilder.buildFile (Uize.copyInto ({url:_requestUrl.slice (1),filesModified:true},_params));
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
						Uize.Build.WebServer.perform
							SYNTAX
							.........................................
							Uize.Build.WebServer.perform (paramsOBJ);
							.........................................

							Parameters
								sourcePath
									A string, specifying the folder path for the site's source code.

								tempPath
									A string, specifying the folder path for temporary files created while building files for the site.

								builtPath
									A string, specifying the folder path for the built files of the site.

								staleBefore
									.

								isDev
									.

								scrunchedHeadComments
									.
				*/
			}
		};
	}
});

