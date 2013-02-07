/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Build.FileBuilders.BuiltModules Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2012-2013 UIZE
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
		The =Uize.Build.FileBuilders.BuiltModules= module defines a file builder for the built versions (scrunched, if so configured) of the JavaScript modules of a site.

		*DEVELOPERS:* `Chris van Rensburg`

		Functions defined in the file builder are called as instance methods on an instance of a subclass of the =Uize.Services.FileBuilderAdapter= class, so the functions can access instance methods implemented in this class.
*/

Uize.module ({
	name:'Uize.Build.FileBuilders.BuiltModules',
	required:[
		'Uize.Build.ModuleInfo',
		'Uize.Util.Oop',
		'Uize.Url',
		'Uize.String',
		'Uize.Build.Scruncher',
		'Uize.Date'
	],
	builder:function () {
		var
			_scruncherPrefixChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
			_endsWithDotJsRegExp = /\.js$/,
			_moduleInheritanceDepthLookup = {
				Uize:0 // pre-cache this in order to prevent loading and re-evaluating the Uize base module
			}
		;

		return {
			description:'Built JavaScript module',
			urlMatcher:function (_urlParts) {
				return _urlParts.fileType == 'js' && this.isBuiltUrl (_urlParts.folderPath);
			},
			builderInputs:function (_urlParts) {
				return {jsTemp:this.tempUrlFromBuiltUrl (_urlParts.pathname)};
			},
			builder:function (_inputs) {
				var
					_this = this,
					_path = _inputs.jsTemp,
					_result = _this.readFile ({path:_path})
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
							var _moduleUrl = 'js/' + _moduleName + '.js';
							_this.buildFile (Uize.copyInto ({},_this.params,{url:_moduleUrl}));
							_moduleCode = _this.readFile ({path:_this.builtUrl (_moduleUrl)});
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
				if (!_this.params.isDev) {
					var
						_pathParts = Uize.Url.from (_path),
						_moduleName = _pathParts.fileName,
						_scruncherSettings = {},
						_sourceFileName = _pathParts.file,
						_headComment = _this.params.scrunchedHeadComments [
							_sourceFileName.slice (0,_sourceFileName.indexOf ('.'))
						],
						_keepHeadComment = _headComment == undefined
					;
					if (!_keepHeadComment)
						_scruncherSettings.KEEPHEADCOMMENT = 'FALSE'
					;
					if (Uize.String.startsWith (_path,_this.tempUrl ('js/'))) {
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
								: Uize.substituteInto (
									_headComment,
									{buildDate:Uize.Date.toIso8601 (),moduleName:_moduleName},
									'{KEY}'
								)
						) + _scruncherResult.scrunchedCode
					;
					/*
					return {
						outputText:_result,
						logDetails:Uize.String.Lines.indent (_scruncherResult.report,2) + '\n'
					};
					*/
				}
				return _result;
			}
		};
	}
});

