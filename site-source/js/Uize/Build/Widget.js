/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Build.Widget Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013-2016 UIZE
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
		The =Uize.Build.Widget= package provides a convenient way to stub out a UIZE V2 widget class.

		*DEVELOPERS:* `Chris van Rensburg`
*/

/*
	- params
		- namespace
		- superclass: optional, defaults to Uize.Widget.V2
		- hasHtml: false|true, defaults to true
		- hasCss: false|true, defaulst to true
		- hasAssets: false|true, defaults to false
		- developers: comma-separated list of developers
*/

Uize.module ({
	name:'Uize.Build.Widget',
	required:[
		'Uize.Util.ModuleNaming',
		'Uize.Services.FileSystem',
		'Uize.Build.Templates.Module.Widget.Widget',
		'Uize.Build.Templates.Module.Widget.VisualSampler',
		'Uize.Build.Templates.Module.Widget.VisualTests',
		'Uize.Flo'
	],
	builder:function () {
		'use strict';

		return Uize.package ({
			perform:function (_params) {
				var
					_fileSystem = Uize.Services.FileSystem.singleton (),
					_fileSystemWriteFile = _fileSystem.writeFile,
					_modulesPath = _params.sourcePath + '/' + _params.modulesFolder + '/',
					_namespace = _params.namespace,
					_projectNamespace = Uize.Util.ModuleNaming.getNamespace (_namespace),
					_hasHtml = _params.hasHtml + '' != 'false',
					_hasCss = _params.hasCss + '' != 'false',
					_hasLoc = _params.hasLoc + '' != 'false',
					_console = _params.console || 'verbose',
					_developers = _params.developers
				;
				_developers = _developers ? _developers.split (',') : [];

				_fileSystem.writeFile = function (_params) {
					if (_console == 'verbose')
						console.log ('CREATED FILE: ' + _params.path)
					;
					_fileSystemWriteFile.apply (_fileSystem,arguments);
				};

				function _getModulePath (_moduleName,_sourceType) {
					return _modulesPath + Uize.modulePathResolver (_moduleName) + (_sourceType ? ('.' + _sourceType) : '');
				}
				/*** create the HTML module's source file, if necessary ***/
					_hasHtml && _fileSystem.writeFile ({
						path:_getModulePath (_namespace + '.Html','htmlt'),
						contents:'<div>BLANK WIDGET</div>'
					});

				/*** create the CSS module's source .csst file, if necessary ***/
					_hasCss && _fileSystem.writeFile ({
						path:_getModulePath (_namespace + '.Css','csst'),
						contents:[
							'.`` {',
							'	background: #ccc;',
							'	padding: 5px;',
							'}'
						].join ('\n')
					});

				/*** create the primary language's source .loc file, if necessary ***/
					var
						_locConfig = (_params.moduleConfigs || {}) ['Uize.Build.Loc'] || {},
						_locProjectConfig = (_locConfig.projects || {}) [_projectNamespace] || {},
						_locCommonConfig = _locConfig.common || {},
						_primaryLanguage = _locProjectConfig.primaryLanguage || _locCommonConfig.primaryLanguage || 'en-US'
					;
					_hasLoc && _fileSystem.writeFile ({
						path:_getModulePath (_namespace + '.Loc.' + _primaryLanguage.replace ('-','_'),'loc'),
						contents:''
					});

				/*** create the CSS assets folder, if necessary ***/
					if (_params.hasAssets + '' == 'true')
						_fileSystem.makeFolder ({path:_getModulePath (_namespace + '.Css')})
					;

				/*** create the JavaScript modules ***/
					var
						_headCommentModule = (_params.headComments || {}) [_projectNamespace],
						_headCommentGenerator
					;
					Uize.Flo.block (
						function (_next) {
							if (_headCommentModule) {
								Uize.require (
									_headCommentModule,
									function (_headCommentModule) {
										_headCommentGenerator = _headCommentModule.process;
										_next ();
									}
								);
							} else {
								_next ()
							}
						},
						function (_next) {
							function _createJavaScriptModule (_moduleType,_templateParams) {
								var _moduleName = _namespace + '.' + _moduleType;
								_fileSystem.writeFile ({
									path:_getModulePath (_moduleName,'js'),
									contents:Uize.Build.Templates.Module.Widget [_moduleType].process (
										Uize.copyInto (
											{
												headComment:_headCommentGenerator
													? _headCommentGenerator ({
														moduleName:_moduleName,
														creationYear:(new Date).getFullYear ()
													})
													: ''
												,
												widgetNamespace:_namespace,
												developers:_developers
											},
											_templateParams
										)
									)
								});
							}

							_createJavaScriptModule (
								'Widget',
								{
									superclass:_params.superclass,
									hasHtml:_hasHtml,
									hasCss:_hasCss,
									hasLoc:_hasLoc
								}
							);
							_createJavaScriptModule ('VisualSampler');
							_createJavaScriptModule ('VisualTests');
							_next ();
						}
					) ();
			}
		});
	}
});

