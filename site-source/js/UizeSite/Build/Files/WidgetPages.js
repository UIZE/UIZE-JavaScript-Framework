/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Build.Files.WidgetPages Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2009-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 1
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =UizeSite.Build.Files.WidgetPages= package provides a method for building the supporting pages for the various widgets that are offered as part of the UIZE Web site's *Widgets to Go* feature.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'UizeSite.Build.Files.WidgetPages',
	required:'Uize.Build.Util',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			staticMethods:{
				determineFilesToBuild:function (_params) {
					var
						_this = this,
						_widgetsFolder = 'widgets'
					;
					Uize.forEach (
						Uize.Build.Util.readSimpleDataFile (
							_params.sourcePath + '/' + _widgetsFolder + '/widgets.simpledata'
						).widgets,
						function (_widget) {
							var _widgetFilesPathPrefix = _widgetsFolder + '/' + _widget.title.toLowerCase ();
							_this.addFiles (
								_widgetFilesPathPrefix + '.html',        // homepage
								_widgetFilesPathPrefix + '/gadget.xml',  // Google Gadget XML
								_widgetFilesPathPrefix + '/web.html',    // Web version
								_widgetFilesPathPrefix + '/mobile.html'  // mobile version
							);
						}
					);
				}
			}
		});
	}
});

