/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Build.File Namespace
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2012-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 5
	codeCompleteness: 0
	testCompleteness: 0
	docCompleteness: 2
*/

/* TODO:
	- to implement
		- get log output working again
			- add support in factored out code for producing log output, so that built scripts can generate log files much like before
*/

/*?
	Introduction
		The =Uize.Build.File= package provides a method for building any file requested for the UIZE Web site.

		*DEVELOPERS:* `Chris van Rensburg`

		EXAMPLE USAGE
		......................................................................................................
		node _build.js Uize.Build.File url=reference/Uize.html sourcePath=site-source tempPath=site-temp memoryPath=site-memory builtPath=site-built freshBuild=true
		......................................................................................................

		Parameters
			builtPath
				document...

			freshBuild
				document...

			isDev
				document...

			memoryPath
				document...

			minAllowedModifiedDate
				document...

			url
				document...

			sourcePath
				document...

			tempPath
				document...
*/

Uize.module ({
	name:'Uize.Build.File',
	superclass:'Uize.Class',
	required:[
		'Uize.Url',
		'Uize.String',
		'Uize.Services.FileSystem'
	],
	builder:function (_superclass) {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_class = _superclass.subclass (),
				_undefined
			;

		/*** General Variables ***/
			var
				_objectCache = {},
				_sacredEmptyObject = {},
				_trueFlag = {}
			;

		/*** Utility Functions ***/
			function _log () {
				typeof console != 'undefined' && typeof console.log == 'function' &&
					console.log.apply (console,arguments)
				;
			}

			function _isUnderPath (_url,_whichPath) {return Uize.String.startsWith (_url,_whichPath + '/')}

			function _transformUrl (_url,_pathToRemove,_pathToPrepend) {
				return (_pathToPrepend || '') + _url.slice (_pathToRemove.length);
			}

			function _generateUrl (_pathPrefix,_path) {
				return _pathPrefix + (_path && _path.charCodeAt (0) != 47 ? '/' : '') + _path;
			};

		/*** Private Static Properties ***/
			_class._filesConsideredCurrentLookup = {};

		/*** Public Static Properties ***/
			_class.fileSystem = Uize.Services.FileSystem.singleton ();
			_class.urlHandlers = [];

		/*** Public Static Methods ***/
			_class.registerUrlHandler = function (_urlHandler) {
				this.urlHandlers.push (_urlHandler);
			};

			/*** URL tester methods ***/
				_class.isMemoryUrl = function (_url) {
					return _isUnderPath (_url,this.params.memoryPath);
				};

				_class.isBuiltUrl = function (_url) {
					return _isUnderPath (_url,this.params.builtPath);
				};

				_class.isTempUrl = function (_url) {
					return _isUnderPath (_url,this.params.tempPath);
				};

				_class.isSourceUrl = function (_url) {
					return _isUnderPath (_url,this.params.sourcePath);
				};

			/*** URL transformer methods ***/
				_class.sourceUrlFromBuiltUrl = function (_url) {
					var _params = this.params;
					return _transformUrl (_url,_params.builtPath,_params.sourcePath);
				};

				_class.tempUrlFromBuiltUrl = function (_url) {
					var _params = this.params;
					return _transformUrl (_url,_params.builtPath,_params.tempPath);
				};

				_class.tempUrlFromMemoryUrl = function (_url) {
					var _params = this.params;
					return _transformUrl (_url,_params.memoryPath,_params.tempPath);
				};

				_class.memoryUrlFromBuiltUrl = function (_url) {
					var _params = this.params;
					return _transformUrl (_url,_params.builtPath,_params.memoryPath);
				};

				_class.builtUrlFromMemoryUrl = function (_url) {
					var _params = this.params;
					return _transformUrl (_url,_params.memoryPath,_params.builtPath);
				};

				_class.sourceUrlFromMemoryUrl = function (_url) {
					var _params = this.params;
					return _transformUrl (_url,_params.memoryPath,_params.sourcePath);
				};

				_class.sourceUrlFromTempUrl = function (_url) {
					var _params = this.params;
					return _transformUrl (_url,_params.tempPath,_params.sourcePath);
				};

			/*** URL generator methods ***/
				_class.builtUrl = function (_path) {return _generateUrl (this.params.builtPath,_path)};
				_class.tempUrl = function (_path) {return _generateUrl (this.params.tempPath,_path)};
				_class.memoryUrl = function (_path) {return _generateUrl (this.params.memoryPath,_path)};
				_class.sourceUrl = function (_path) {return _generateUrl (this.params.sourcePath,_path)};

			/*** abstractions of various methods of the file system service to support object storage ***/
				_class.writeFile = function (_params) {
					var _path = _params.path;
					this.isMemoryUrl (_path)
						? (
							_objectCache [_path] = {
								contents:_params.contents,
								modifiedDate:new Date
							}
						)
						: this.fileSystem.writeFile (_params)
					;
				};

				_class.readFile = function (_params) {
					var _path = _params.path;
					return (
						this.isMemoryUrl (_path)
							? (_objectCache [_path] || _sacredEmptyObject).contents
							: this.fileSystem.readFile (_params)
					);
				};

				_class.getModifiedDate = function (_params) {
					var _path = _params.path;
					return (
						this.isMemoryUrl (_path)
							? (_objectCache [_path] || _sacredEmptyObject).modifiedDate
							: this.fileSystem.getModifiedDate (_params)
					);
				};

				_class.fileExists = function (_params) {
					var _path = _params.path;
					return this.isMemoryUrl (_path) ? !!_objectCache [_path] : this.fileSystem.fileExists (_params);
				};

			_class.perform = function (_params,_pathPrefix) {
				var _this = this;
				_this.params = _params;
				_params.isDev = _params.isDev == 'true';
				_params.freshBuild = _params.freshBuild == 'true';
				var
					_filesConsideredCurrentLookup = _this._filesConsideredCurrentLookup = {},
					_minAllowedModifiedDate = _params.minAllowedModifiedDate = Math.max (
						Uize.toNumber (_params.minAllowedModifiedDate,-Infinity),
						_params.freshBuild ? Uize.now () : -Infinity
					)
				;
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
					if (_filesConsideredCurrentLookup [_url] != _trueFlag) {
						var
							_urlParts = Uize.Url.from (_url),
							_matchingHandler
						;
						for (
							var
								_urlHandlerNo = -1,
								_urlHandlers = _this.urlHandlers,
								_urlHandlersLength = _urlHandlers.length,
								_urlHandler
							;
							++_urlHandlerNo < _urlHandlersLength;
						) {
							if ((_urlHandler = _urlHandlers [_urlHandlerNo]).urlMatcher.call (_this,_urlParts)) {
								_matchingHandler = _urlHandler;
								break;
							}
						}
						if (_matchingHandler) {
							var
								_builderInputs = (_matchingHandler.builderInputs || Uize.nop).call (_this,_urlParts),
								_builder = _matchingHandler.builder
							;
							if (_builderInputs || _builder) {
								var
									_path = _urlParts.pathname,
									_mustBuild = !_this.fileExists ({path:_path}),
									_lastBuiltDate = _mustBuild ? 0 : _this.getModifiedDate ({path:_path}),
									_builderInput
								;
								_mustBuild || (_mustBuild = _lastBuiltDate < _minAllowedModifiedDate);
								for (var _builderInputName in _builderInputs) {
									_ensureFileCurrent (_builderInput = _builderInputs [_builderInputName]);
									_mustBuild || (
										_mustBuild = Math.max (
											_this.getModifiedDate ({path:_builderInput}),
											_minAllowedModifiedDate
										) > _lastBuiltDate
									);
								}
								if (_mustBuild) {
									var
										_startTime = Uize.now (),
										_buildError
									;
									try {
										_builder
											? _this.writeFile ({path:_url,contents:_builder.call (_this,_builderInputs,_urlParts)})
											: _this.fileSystem.copyFile ({path:Uize.values (_builderInputs) [0],targetPath:_url})
										;
										_filesConsideredCurrentLookup [_url] = _trueFlag;
									} catch (_error) {
										_buildError = _error;
									}
									_log (
										(_buildError ? '*** BUILD FAILED' : 'BUILT') + ': ' + _url + '\n' +
											'\tduration: ' + (Uize.now () - _startTime) + '\n' +
											'\tbuilder: ' + _matchingHandler.description + '\n' +
											'\tbuilder inputs:\n' +
												Uize.map (
													Uize.keys (_builderInputs),
													function (_key) {return '\t\t' + _key + ': ' + _builderInputs [_key] + '\n'}
												).join ('')
									);
									if (_buildError) {
										_log (_buildError);
										throw _buildError;
									}
								} else {
									_filesConsideredCurrentLookup [_url] = _trueFlag;
								}
							}
						}
					}
				}

				var _url = _params.url;
				if (_pathPrefix == _undefined)
					_pathPrefix = _this.params.builtPath + '/'
				;
				if (Uize.isArray (_url)) {
					Uize.forEach (_url,function (_url) {_ensureFileCurrent (_pathPrefix + _url)});
				} else {
					_ensureFileCurrent (_pathPrefix + _url);
				}
				/*?
					Static Methods
						Uize.Build.File.perform
							SYNTAX
							........................................
							Uize.Build.File.perform (paramsOBJ);
							........................................

							Parameters
								url
									A string, specifying the URL, relative to the built path, of the file that should be built.

								sourcePath
									A string, specifying the folder path for the site's source code.

								tempPath
									A string, specifying the folder path for temporary files created while building files for the site.

								builtPath
									A string, specifying the folder path for the built files of the site.

								minAllowedModifiedDate
									document...

								isDev
									document...
				*/
			};

		return _class;
	}
});

