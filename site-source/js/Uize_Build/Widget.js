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
		'Uize.Templates.WidgetModule',
		'Uize.Templates.WidgetVisualSamplerModule',
		'Uize.Templates.WidgetVisualTestsModule'
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

				/*** create the widget module file ***/
					/*
					if (_hasHtml) {
						_builderLines.push (
							'		set:{',
							'			html:' + _htmlModuleName,
							'		}' + (_hasCss ? ',' : '')
						);
						_hasCss && _builderLines.push ('');
					}
					if (_hasCss) {
						_builderLines.push (
							'		staticProperties:{',
							'			cssModule:' + _cssModuleName,
							'		}'
						);
					}
					*/
					_fileSystem.writeFile ({
						path:_getModulePath (_namespace + '.Widget'),
						contents:Uize.Templates.WidgetModule.process ({
							widgetNamespace:_namespace,
							developers:_developers,
							superclass:_params.superclass,
							hasHtml:_hasHtml,
							hasCss:_hasCss
						})
					});

				/*** create the visual sampler module file ***/
					_fileSystem.writeFile ({
						path:_getModulePath (_namespace + '.VisualSampler'),
						contents:Uize.Templates.WidgetVisualSamplerModule.process ({
							widgetNamespace:_namespace,
							developers:_developers
						})
					});

				/*** create the visual tests module file ***/
					_fileSystem.writeFile ({
						path:_getModulePath (_namespace + '.VisualTests'),
						contents:Uize.Templates.WidgetVisualTestsModule.process ({
							widgetNamespace:_namespace,
							developers:_developers
						})
					});
			}
		});
	}
});

