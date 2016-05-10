/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Build.FileBuilders.CompressedModules Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2012-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 5
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Build.FileBuilders.CompressedModules= module defines a file builder for the compressed versions of the JavaScript modules of a site.

		*DEVELOPERS:* `Chris van Rensburg`

		Functions defined in the file builder are called as instance methods on an instance of a subclass of the =Uize.Services.FileBuilderAdapter= class, so the functions can access instance methods implemented in this class.
*/

Uize.module ({
	name:'Uize.Build.FileBuilders.CompressedModules',
	required:[
		'Uize.Build.ModuleInfo',
		'Uize.Util.Oop',
		'Uize.Build.Scruncher',
		'Uize.Date',
		'Uize.Util.ModuleNaming',
		'Uize.Str.Has'
	],
	builder:function () {
		'use strict';

		var
			_scruncherPrefixChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
			_dotJsRegExp = /\.js$/,
			_compressedJsFileExtension = '.min.js',
			_moduleInheritanceDepthLookup = {
				Uize:0 // pre-cache this in order to prevent loading and re-evaluating the Uize base module
			}
		;
		return Uize.package ({
			description:'Compressed JavaScript modules',
			urlMatcher:function (_urlParts) {
				return (
					_urlParts.fileType == 'js' &&
					this.isTempUrl (_urlParts.folderPath) &&
					Uize.Str.Has.hasSuffix (_urlParts.file,_compressedJsFileExtension)
				);
			},
			builderInputs:function (_urlParts) {
				var
					m = this,
					_jsTemp = _urlParts.pathname.slice (0,-_compressedJsFileExtension.length) + '.js',
					_builderInputs = {jsTemp:_jsTemp},
					_params = m.params,
					_moduleName = m.moduleNameFromTempPath (_jsTemp),
					_scrunchedHeadComments = _params.scrunchedHeadComments,
					_scrunchedHeadCommentModule =
						_scrunchedHeadComments &&
						_scrunchedHeadComments [Uize.Util.ModuleNaming.getNamespace (_moduleName)]
				;
				if (_scrunchedHeadCommentModule)
					_builderInputs.scrunchedHeadComment = m.memoryUrl (
						_params.modulesFolder + '/' + Uize.modulePathResolver (_scrunchedHeadCommentModule) + '.js.jst'
					)
				;
				return _builderInputs;
			},
			builder:function (_inputs) {
				var
					m = this,
					_jsTemp = _inputs.jsTemp,
					_result = m.readFile ({path:_jsTemp}),
					_moduleName = m.moduleNameFromTempPath (_jsTemp),
					_scruncherSettings = {},
					_scrunchedHeadComment = _inputs.scrunchedHeadComment,
					_keepHeadComment = _scrunchedHeadComment == undefined
				;
				function _getModuleInheritanceDepth (_moduleName,_moduleCode) {
					if (_moduleName in _moduleInheritanceDepthLookup) {
						return _moduleInheritanceDepthLookup [_moduleName];
					} else {
						var
							_inheritanceDepth = 0,
							_superclassKnown
						;
						if (!_moduleCode) {
							var _moduleUrl = m.getModuleUrl (_moduleName);
							m.buildFile (Uize.copy (m.params,{url:_moduleUrl}));
							_moduleCode = m.readFile ({path:m.builtUrl (_moduleUrl)});
						}
						var _moduleDefinition = Uize.Build.ModuleInfo.getDefinitionFromCode (_moduleCode);
						if (_moduleDefinition && (_superclassKnown = 'superclass' in _moduleDefinition)) {
							var _superclass = _moduleDefinition.superclass;
							if (_superclass)
								_inheritanceDepth = _getModuleInheritanceDepth (_superclass) + 1
							;
						}
						_superclassKnown ||
							Uize.require (
								_moduleName,
								function (_module) {
									_inheritanceDepth = Uize.Util.Oop.getInheritanceChain (_module).length;
								}
							)
						;
						_moduleInheritanceDepthLookup [_moduleName] = _inheritanceDepth;
						return _moduleInheritanceDepthLookup [_moduleName] = _inheritanceDepth;
					}
				}
				if (!_keepHeadComment)
					_scruncherSettings.KEEPHEADCOMMENT = 'FALSE'
				;
				if (_moduleName) {
					var _inheritanceDepth = _getModuleInheritanceDepth (_moduleName,_result);
					_scruncherSettings.MAPPINGS =
						'=' +
						(_inheritanceDepth ? _scruncherPrefixChars.charAt (_inheritanceDepth - 1) : '') +
						',' + _moduleName.replace (/\./g,'_')
					;
				}
				var _scruncherResult = Uize.Build.Scruncher.scrunch (_result,_scruncherSettings);
				_result =
					(
						_keepHeadComment
							? ''
							: m.readFile ({path:_scrunchedHeadComment}) ({
								buildDate:Uize.Date.toIso8601 (),
								moduleName:_moduleName
							})
					) + _scruncherResult.scrunchedCode
				;
				return _result;
			}
		});
	}
});

