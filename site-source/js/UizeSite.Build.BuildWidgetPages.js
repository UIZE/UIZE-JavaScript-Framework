/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Build.BuildWidgetPages Namespace
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2009-2012 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Namespace
	importance: 1
	codeCompleteness: 100
	testCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =UizeSite.Build.BuildWidgetPages= package provides a method for building the supporting pages for the various widgets that are offered as part of the UIZE Web site's *Widgets to Go* feature.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'UizeSite.Build.BuildWidgetPages',
	required:[
		'UizeSite.Build.File',
		'Uize.Build.Util'
	],
	builder:function () {
		/*** Variables for Scruncher Optimization ***/
			var _package = function () {};

		/*** Public Static Methods ***/
			_package.perform = function (_params) {
				var
					_urlsToBuild = [],
					_widgetsFolder = 'widgets'
				;

				/*** generate URLs to build for all widgets ***/
					Uize.forEach (
						Uize.Build.Util.readSimpleDataFile (
							_params.sourcePath + '/' + _widgetsFolder + '/widgets.simpledata'
						).widgets,
						function (_widget) {
							var _widgetFilesPathPrefix = _widgetsFolder + '/' + _widget.title.toLowerCase ();
							_urlsToBuild.push (
								_widgetFilesPathPrefix + '.html',        // homepage
								_widgetFilesPathPrefix + '/gadget.xml',  // Google Gadget XML
								_widgetFilesPathPrefix + '/web.html',    // Web version
								_widgetFilesPathPrefix + '/mobile.html'  // mobile version
							);
						}
					);

				/*** now build all the pages ***/
					UizeSite.Build.File.perform (Uize.copyInto ({url:_urlsToBuild},_params));
			};

		return _package;
	}
});

