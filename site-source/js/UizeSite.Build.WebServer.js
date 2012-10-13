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
		node _build.js UizeSite.Build.WebServer sourcePath=site-source tempPath=site-temp builtPath=site-built
		......................................................................................................
*/

Uize.module ({
	name:'UizeSite.Build.WebServer',
	required:[
		'Uize.Url',
		'Uize.String',
		'Uize.Build.Util',
		'Uize.Services.FileSystem'
	],
	builder:function () {
		/*** Variables for Scruncher Optimization ***/
			var
				_package = function () {},
				_Uize = Uize,
				_Uize_Url = _Uize.Url,
				_fileSystem = Uize.Services.FileSystem.singleton ();
			;

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
					_urlHandlers = [],
					_sourcePath = _params.sourcePath,
					_tempPath = _params.tempPath,
					_builtPath = _params.builtPath
				;

				function _registerUrlHandler (_urlHandler) {
					_urlHandlers.push (_urlHandler);
				}

				function _isUnderBuiltPath (_path) {
					return Uize.String.startsWith (_path,_builtPath);
				}

				function _sourcePathFromBuiltPath (_path) {
					return _sourcePath + _path.slice (_builtPath.length);
				}

				/*** handler for source files ***/
					_registerUrlHandler ({
						description:'Short-circuit handling for source files',
						urlMatcher:function (_urlParts) {
							return Uize.String.startsWith (_urlParts.folderPath,_sourcePath);
						}
					});

				/*** handler for SimpleDoc explainers, appendixes, news, etc. ***/
					_registerUrlHandler ({
						description:'Explainers, generated from SimpleDoc files',
						urlMatcher:function (_urlParts) {
							var _folderPath = _urlParts.folderPath;
							return (
								_urlParts.fileType == 'html' &&
								_isUnderBuiltPath (_folderPath) &&
								_fileSystem.pathExists ({
									path:_sourcePathFromBuiltPath (_urlParts.folderPath) + _urlParts.fileName + '.simple'
								})
							);
						},
						builderInputs:function (_urlParts) {
							var _sourceFolderPath = _sourcePathFromBuiltPath (_urlParts.folderPath);
							return {
								simpleDoc:_sourceFolderPath + _urlParts.fileName + '.simple',
								simpleDocTemplate:_sourceFolderPath + '~SIMPLE-DOC-TEMPLATE.html.jst'
							};
						},
						builder:function (_inputs,_urlParts) {
							/*** compile the template ***/
								var
									_simpleDocTemplatePath = _inputs.simpleDocTemplate,
									_simpleDocTemplate = Uize.Build.Util.compileJstFile (_simpleDocTemplatePath)
								;

							/*** determine path to root from current folder ***/
								var
									_pathSansLeadingSlash = _urlParts.pathname.slice (1),
									_pathToRoot = Uize.String.repeat (
										'../',
										_pathSansLeadingSlash.length -
										_pathSansLeadingSlash.replace (/[\/\\]/g,'').length
									)
								;
								console.log (_pathToRoot);
							
							return _fileSystem.readFile ({path:_inputs.simpleDoc});
							/*
								- load and parse SimpleDoc
								- load JST
								- compile JST
								- process JST
							*/
						}
					});

				/*** handler for module reference docs ***/

				/*** handler for module source view docs ***/

				/*** handler for scrunched JavaScript modules ***/

				/*** handler for source compiled JST modules ***/

				/*** handler for scrunched compiled JST modules ***/

				/*** handler for scrunched JavaScript library modules ***/

				/*** handler for example pages ***/

				/*** handler for example index pages ***/

				/*** handler for SimpleData derived JavaScript source modules ***/

				/*** handler for widgets-to-go widget pages ***/

				/*** handler for static assets ***/
					_registerUrlHandler ({
						description:'Fallback handler for static assets',
						urlMatcher:function (_urlParts) {
							var _folderPath = _urlParts.folderPath;
							return (
								Uize.String.startsWith (_folderPath,_builtPath) &&
								_fileSystem.pathExists ({path:_sourcePath + _urlParts.pathname.slice (_builtPath.length)})
							);
						},
						builderInputs:function (_urlParts) {
							return {sourcePath:_sourcePath + _urlParts.pathname.slice (_builtPath.length)};
						},
						builder:function (_inputs) {
							return _fileSystem.readFile ({path:_inputs.sourcePath});
						}
					});

				function _ensureFileCurrent (_url) {
					/*
						- how handlers are used...
							- handler is picked by going through all the handlers in sequence, until a handler matches the URL path
							- handlers are recursive, so for every handler that maps a requested path to a source path, the remaining handlers are evaluated to see if any apply to the source path
								- so, for example, a handler for scrunched JavaScript modules can rely on a handler for compiled JST modules, so that if a .jst source file is modified, requesting the scrunched compiled JST module will result in the .jst source file first being compiled to a JST source module, and then being scrunched to a scrunched JST module
							- handlers can also register build needs
							- handlers can have multiple inputs
								- a handler for a SimpleDoc explainer HTML URL will have at least two direct inputs...
									- the .simple source file
									- the .jst JavaScript template used to build the HTML file
							- some handlers may need to check multiple files to determine if the current built result is current
								- for example, a handler for a JavaScript module doc HTML page will need to check that none of the modules along the modules inheritance chain (if it is a class module) have a more recent modified date, since the documentation reflects inherited features for classes

						- needed items can be objects, in memory
							- as objects in memory, needed objects can have a last modified date

						- a JST template can have template modules as dependencies
							- template module dependencies are dependencies for the process of using of such a JST template
							- if one of the template module dependencies is modified since the last build using the JST template, then the last built product of the JST template would need to be rebuilt

						- with a request driven model for build process, for the purpose of performance, any file can have an internal / parsed representation as an object
							- so, for example, a .json file that is built as part of a build process can also be stored in memory as a JavaScript object, so that processes that repeatedly use the .json file as an input can not have to repeatedly parse the
							- all files can be modified through their string or object interfaces
								- if modified through object interface...
									- buffered serialization, buffered writing to file
									- immediate serialization when requested in text form or requested through file interface
									- writing to file can be decoupled from serialization to text, as a consequence of file system service
								- if modified through file interface...
									- immediate parsing when requested in object form
							- to aid in performance, files can be cached in a memory cache system (such as memcache)
					*/
					var
						_urlParts = _Uize_Url.from (_url),
						_matchingHandler
					;
					for (
						var _urlHandlerNo = -1, _urlHandlersLength = _urlHandlers.length, _urlHandler;
						++_urlHandlerNo < _urlHandlersLength;
					) {
						if ((_urlHandler = _urlHandlers [_urlHandlerNo]).urlMatcher (_urlParts)) {
							_matchingHandler = _urlHandler;
							break;
						}
					}
					if (_matchingHandler) {
						var
							_builderInputs = (_matchingHandler.builderInputs || Uize.nop) (_urlParts),
							_path = _urlParts.pathname,
							_mustBuild = !_fileSystem.pathExists ({path:_path}),
							_lastBuiltDate = _mustBuild ? 0 : _fileSystem.getModifiedDate ({path:_path}),
							_builderInput
						;
						for (var _builderInputName in _builderInputs) {
							_ensureFileCurrent (_builderInput = _builderInputs [_builderInputName]);
							_mustBuild || (_mustBuild = _fileSystem.getModifiedDate ({path:_builderInput}) > _lastBuiltDate);
						}
						_mustBuild &&
							_fileSystem.writeFile ({
								path:_url,
								contents:_matchingHandler.builder (_builderInputs,_urlParts)
							})
						;
					}
				}

				_http.createServer (
					function (_request,_response) {
						var
							_requestUrl = _builtPath + _request.url,
							_fileContents
						;
						_ensureFileCurrent (_requestUrl);
						try {
							var _urlParts = _Uize_Url.from (_requestUrl);
							_fileContents = _fileSystem.readFile ({path:_urlParts.pathname});
							_response.writeHead (200,{'Content-Type':_mimeTypes [_urlParts.fileType]});
						} catch (_error) {
							console.log (_error);
							_fileContents = '404';
							_response.writeHead (404,{'Content-Type':'text/html'});
						}
						_response.end (_fileContents);
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
				*/
			};

		return _package;
	}
});

