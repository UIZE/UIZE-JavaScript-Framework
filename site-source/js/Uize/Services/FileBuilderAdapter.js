/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Services.FileBuilderAdapter Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2012-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 5
	codeCompleteness: 0
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Services.FileBuilderAdapter= module defines an abstract base class for adapters for the file builder service (=Uize.Services.FileBuilder=).

		*DEVELOPERS:* `Chris van Rensburg`
*/

/*
	- how handlers are used...
		- handler is picked by going through all the handlers in sequence, until a handler matches the URL path
		- handlers are recursive, so for every handler that maps a requested path to a source path, the remaining handlers are evaluated to see if any apply to the source path
			- so, for example, a handler for scrunched JavaScript modules can rely on a handler for compiled JST modules, so that if a .jst source file is modified, requesting the scrunched compiled JST module will result in the .jst source file first being compiled to a JST source module, and then being scrunched to a scrunched JST module
		- handlers can also register build needs
		- handlers can have multiple inputs
			- a handler for a SimpleDoc guide HTML URL will have at least two direct inputs...
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

Uize.module ({
	name:'Uize.Services.FileBuilderAdapter',
	superclass:'Uize.Service.Adapter',
	required:[
		'Uize.Url',
		'Uize.Str.Has',
		'Uize.Array.Util',
		'Uize.Services.FileSystem',
		'Uize.Json',
		'Uize.Build.Util'
	],
	builder:function (_superclass) {
		'use strict';

		/*** General Variables ***/
			var
				_undefined,
				_hasPrefix = Uize.Str.Has.hasPrefix,
				_sacredEmptyObject = {},
				_trueFlag = {}
			;

		/*** Utility Functions ***/
			function _makeUrlTesterMethod (_pathType) {
				_pathType += 'Path';
				return function (_url) {return _hasPrefix (_url,this.params [_pathType] + '/')};
			}

			function _makeUrlTransformerMethod (_pathTypeToRemove,_pathTypeToPrepend) {
				var _pathTypeToPrependIsSource = _pathTypeToPrepend == 'source';
				_pathTypeToRemove += 'Path';
				_pathTypeToPrepend += 'Path';

				return (
					_pathTypeToPrependIsSource
						? function (_url) {
							var
								_params = this.params,
								_urlMinusOldPath = _url.slice (_params [_pathTypeToRemove].length)
							;
							return (
								(
									_hasPrefix (_urlMinusOldPath,'/' + _params.modulesFolder + '/Uize')
										? _params.uizePath
										: _params [_pathTypeToPrepend]
								) +
								_urlMinusOldPath
							);
						}
						: function (_url) {
							var _params = this.params;
							return _params [_pathTypeToPrepend] + _url.slice (_params [_pathTypeToRemove].length);
						}
				);
			}

			function _makeUrlGeneratorMethod (_pathType) {
				_pathType += 'Path';
				return function (_path) {
					return this.params [_pathType] + (_path && _path.charCodeAt (0) != 47 ? '/' : '') + _path;
				};
			};

			function _makeSubPathExtractorMethod (_pathType) {
				_pathType += 'Path';
				return function (_url) {return _url.slice (this.params [_pathType].length + 1)};
			}

		return _superclass.subclass ({
			alphastructor:function () {
				var m = this;

				/*** Private Instance Properties ***/
					m._filesConsideredCurrentLookup = {};
					m._objectCache = {};

				/*** Public Instance Properties ***/
					m.fileSystem = Uize.Services.FileSystem.singleton ();
					m.urlHandlers = [];
			},

			instanceMethods:{
				registerFileBuilders:function (_urlHandler) {
					Uize.push (this.urlHandlers,Uize.Array.Util.flatten (arguments,Infinity,true));
				},

				/*** URL tester methods ***/
					isBuiltUrl:_makeUrlTesterMethod ('built'),
					isTempUrl:_makeUrlTesterMethod ('temp'),
					isMemoryUrl:_makeUrlTesterMethod ('memory'),
					isSourceUrl:_makeUrlTesterMethod ('source'),

				/*** URL transformer methods ***/
					sourceUrlFromBuiltUrl:_makeUrlTransformerMethod ('built','source'),
					sourceUrlFromTempUrl:_makeUrlTransformerMethod ('temp','source'),
					sourceUrlFromMemoryUrl:_makeUrlTransformerMethod ('memory','source'),
					tempUrlFromBuiltUrl:_makeUrlTransformerMethod ('built','temp'),
					tempUrlFromMemoryUrl:_makeUrlTransformerMethod ('memory','temp'),
					tempUrlFromSourceUrl:_makeUrlTransformerMethod ('source','temp'),
					memoryUrlFromBuiltUrl:_makeUrlTransformerMethod ('built','memory'),
					memoryUrlFromTempUrl:_makeUrlTransformerMethod ('temp','memory'),
					memoryUrlFromSourceUrl:_makeUrlTransformerMethod ('source','memory'),
					builtUrlFromTempUrl:_makeUrlTransformerMethod ('temp','built'),
					builtUrlFromMemoryUrl:_makeUrlTransformerMethod ('memory','built'),
					builtUrlFromSourceUrl:_makeUrlTransformerMethod ('source','built'),

				/*** URL generator methods ***/
					builtUrl:_makeUrlGeneratorMethod ('built'),
					tempUrl:_makeUrlGeneratorMethod ('temp'),
					memoryUrl:_makeUrlGeneratorMethod ('memory'),
					sourceUrl:_makeUrlGeneratorMethod ('source'),

				/*** sub-path extractor methods ***/
					pathUnderBuiltUrl:_makeSubPathExtractorMethod ('built'),
					pathUnderTempUrl:_makeSubPathExtractorMethod ('temp'),
					pathUnderMemoryUrl:_makeSubPathExtractorMethod ('memory'),
					pathUnderSourceUrl:_makeSubPathExtractorMethod ('source'),

				/*** abstractions of various methods of the file system service to support object storage ***/
					writeFile:function (_params) {
						var
							m = this,
							_path = _params.path
						;
						m.isMemoryUrl (_path)
							? (
								m._objectCache [_path] = {
									contents:_params.contents,
									modifiedDate:new Date
								}
							)
							: m.fileSystem.writeFile (_params)
						;
					},

					readFile:function (_params) {
						var
							m = this,
							_path = _params.path
						;
						return (
							m.isMemoryUrl (_path)
								? (m._objectCache [_path] || _sacredEmptyObject).contents
								: m.fileSystem.readFile (_params)
						);
					},

					getModifiedDate:function (_params) {
						var
							m = this,
							_path = _params.path
						;
						return (
							m.isMemoryUrl (_path)
								? (m._objectCache [_path] || _sacredEmptyObject).modifiedDate
								: m.fileSystem.getModifiedDate (_params)
						);
					},

					fileExists:function (_params) {
						var
							m = this,
							_path = _params.path
						;
						return (
							m.isMemoryUrl (_path)
								? !!m._objectCache [_path]
								: m.fileSystem.fileExists (_params)
						);
					},

					folderExists:function (_params) {
						var
							m = this,
							_path = _params.path
						;
						return (
							m.isMemoryUrl (_path)
								? !!m._objectCache [_path]
								: m.fileSystem.folderExists (_params)
							);
					},

				/*** General Utility Methods ***/
					processSimpleDoc:function (_title,_simpleDocBuildResult,_simpleDocTemplatePath,_extraTemplateInputs) {
						var
							_contentsTreeItems = _simpleDocBuildResult.contentsTreeItems,
							_contentsTreeItem0 = _contentsTreeItems [0]
						;
						return this.readFile ({path:_simpleDocTemplatePath}) (
							Uize.copyInto (
								{
									title:_title,
									description:
										(
											_contentsTreeItem0 &&
											(_contentsTreeItem0.description || (_contentsTreeItem0.items [0] || {}).description)
										) || '',
									body:_simpleDocBuildResult.html
								},
								_extraTemplateInputs
							)
						);
					},

					moduleNameFromPath:function (_path,_pathType) {
						var _modulesPath = this [_pathType + 'Url'] (this.params.modulesFolder + '/');
						return (
							_hasPrefix (_path,_modulesPath)
								? Uize.Build.Util.moduleNameFromModulePath (_path.slice (_modulesPath.length),true)
								: ''
						);
					},

					moduleNameFromTempPath:function (_path) {
						return this.moduleNameFromPath (_path,'temp');
					},

					getModuleUrl:function (_moduleName,_includeExtension) {
						return (
							this.params.modulesFolder + '/' + Uize.modulePathResolver (_moduleName) +
							(_includeExtension !== false ? '.js' : '')
						);
					},

				buildFile:function (_params,_callback) {
					var m = this;
					if (_params.filesModified)
						m._filesConsideredCurrentLookup = {}
					;
					var
						_console = _params.console,
						_filesConsideredCurrentLookup = m._filesConsideredCurrentLookup,
						_staleBefore = _params.staleBefore = Uize.toNumber (_params.staleBefore,-Infinity)
					;
					_params.isDev = _params.isDev == 'true';
					m.params = _params;

					function _ensureFileCurrent (_url) {
						var
							_startTime = Uize.now (),
							_log
						;
						if (_filesConsideredCurrentLookup [_url] == _trueFlag) {
							_log = {
								url:_url,
								built:false,
								duration:Uize.since (_startTime)
							};
						} else {
							var
								_urlParts = Uize.Url.from (_url),
								_matchingHandler
							;
							for (
								var
									_urlHandlerNo = -1,
									_urlHandlers = m.urlHandlers,
									_urlHandlersLength = _urlHandlers.length,
									_urlHandler
								;
								++_urlHandlerNo < _urlHandlersLength;
							) {
								if ((_urlHandler = _urlHandlers [_urlHandlerNo]).urlMatcher.call (m,_urlParts)) {
									_matchingHandler = _urlHandler;
									break;
								}
							}
							if (_matchingHandler) {
								var
									_builderInputs = (_matchingHandler.builderInputs || Uize.nop).call (m,_urlParts),
									_builder = _matchingHandler.builder
								;
								if (_builderInputs || _builder) {
									var
										_path = _urlParts.pathname,
										_subLogs = [],
										_subLog,
										_builderInputModifiedDate,
										_maxBuilderInputModifiedDate = _staleBefore,
										_processBuilderInput = function (_builderInput) {
											if (typeof _builderInput == 'string') {
												if (
													(_subLog = _ensureFileCurrent (_builderInput)) &&
													(_subLog.built || _subLog.buildError)
												)
													_subLogs.push (_subLog)
												;
												if (
													(_builderInputModifiedDate = m.getModifiedDate ({path:_builderInput})) >
													_maxBuilderInputModifiedDate
												)
													_maxBuilderInputModifiedDate = _builderInputModifiedDate
												;
											} else {
												Uize.forEach (_builderInput,_processBuilderInput);
											}
										}
									;
									_processBuilderInput (_builderInputs);

									if (
										!m.fileExists ({path:_path}) ||
										m.getModifiedDate ({path:_path}) < _maxBuilderInputModifiedDate
									) {
										var _buildError;
										try {
											if (_builder) {
												m.writeFile ({
													path:_url,
													contents:_builder.call (m,_builderInputs,_urlParts)
												});
												if (m.isMemoryUrl (_url))
													m._objectCache [_url].modifiedDate = _maxBuilderInputModifiedDate
												;
											} else {
												m.fileSystem.copyFile ({
													path:Uize.values (_builderInputs) [0],targetPath:_url
												});
											}
											_filesConsideredCurrentLookup [_url] = _trueFlag;
										} catch (_error) {
											_buildError = _error;
										}
										_log = {
											url:_url,
											built:!_buildError,
											fileBuilder:_matchingHandler.moduleName || _matchingHandler.description,
											duration:Uize.since (_startTime),
											builderInputs:_builderInputs
										};
										if (_subLogs.length)
											_log.subLogs = _subLogs
										;
										if (_buildError)
											_log.buildError = _buildError
										;
										if (_buildError) {
											console.log (_buildError);
											typeof console != 'undefined' && typeof console.trace == 'function' &&
												console.trace ()
											;
											throw _buildError;
										}
									} else {
										_log = {
											url:_url,
											built:false,
											fileBuilder:_matchingHandler.moduleName || _matchingHandler.description,
											duration:Uize.since (_startTime)
										};
										_filesConsideredCurrentLookup [_url] = _trueFlag;
									}
								}
							}
						}
						return _log;
					}

					var _pathPrefix = m.params.pathPrefix;
					if (_pathPrefix == _undefined)
						_pathPrefix = m.params.builtPath + '/'
					;
					var
						_url = _params.url,
						_log = []
					;
					Uize.isArray (_url)
						? Uize.forEach (_url,function (_url) {_log.push (_ensureFileCurrent (_pathPrefix + _url))})
						: _log.push (_ensureFileCurrent (_pathPrefix + _url))
					;
					var _logAsJson = Uize.Json.to (_log,{keyDelimiter:': ',indentChars:'  '});
					if (_console == 'verbose')
						console.log (_logAsJson)
					;
					_callback && _callback (_logAsJson);
				}
			}
		});
	}
});

