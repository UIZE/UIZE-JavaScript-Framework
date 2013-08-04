/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Build.Widget Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013 UIZE
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
		- hasImages: false|true, defaults to false
		- developers: comma-separated list of developers
*/

Uize.module ({
	name:'Uize.Build.Widget',
	required:[
		'Uize.Build.Util',
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
					_modulesPath = _params.sourcePath + '/' + _params.modulesFolder + '/',
					_namespace = _params.namespace,
					_hasHtml = _params.hasHtml + '' != 'false',
					_hasCss = _params.hasCss + '' != 'false',
					_developers = _params.developers
				;
				_developers = _developers ? _developers.split (',') : [];

				function _getModulePath (_moduleName,_sourceType) {
					return _modulesPath + Uize.modulePathResolver (_moduleName) + '.' + (_sourceType || 'js');
				}
				/*** create the HTML module's source .js.jst file, if necessary ***/
					_hasHtml && _fileSystem.writeFile ({
						path:_getModulePath (_namespace + '.Html','js.jst'),
						contents:[
							'<div id="<%. idPrefix %>" class="<%= this.rootNodeCssClasses () %>">',
							'	<div class="<%= this.cssClass (\'foo\') %>">foo</div>',
							'</div>'
						].join ('\n')
					});

				/*** create the CSS module's source .csst file, if necessary ***/
					_hasCss && _fileSystem.writeFile ({
						path:_getModulePath (_namespace + '.Css','csst'),
						contents:[
							'.`` {',
							'	background: #ccc;',
							'	padding: 5px;',
							'}',
							'',
							'.`foo` {',
							'	color: #000;',
							'	background: #eee;',
							'}'
						].join ('\n')
					});

				/*** create the CSS assets folder, if necessary ***/
					if (_params.hasImages + '' == 'true') {
						// TODO: make the Css folder
					}

				/*** create the JavaScript modules ***/
					var
						_headCommentModule = (_params.headComments || {}) [Uize.Build.Util.getModuleNamespace (_namespace)],
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
									path:_getModulePath (_moduleName),
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
									hasCss:_hasCss
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

