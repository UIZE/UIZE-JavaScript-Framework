/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeDotCom.Build.BuildWidgetPages Namespace
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
		The =UizeDotCom.Build.BuildWidgetPages= package provides a method for building the supporting pages for the various widgets that are offered as part of the *uize.com* Web site's *Widgets to Go* feature.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'UizeDotCom.Build.BuildWidgetPages',
	required:[
		'Uize.Wsh',
		'Uize.Build.Util',
		'UizeDotCom.Templates.WidgetToGoGadgetXml',
		'UizeDotCom.Templates.WidgetToGoPage',
		'UizeDotCom.Templates.WidgetToGoHomepage'
	],
	builder:function () {
		/*** Variables for Scruncher Optimization ***/
			var _package = function () {};

		/*** Public Static Methods ***/
			_package.perform = function (_params) {
				var _widgets = Uize.Build.Util.readSimpleDataFile ('widgets/widgets.simpledata').widgets;
				for (var _widgetNo = -1, _widgetsLength = _widgets.length; ++_widgetNo < _widgetsLength;) {
					var
						_widget = _widgets [_widgetNo],
						_widgetNameForUrls = _widget.title.toLowerCase (),
						_widgetFilesPathPrefix = 'widgets\\' + _widgetNameForUrls
					;

					/*** build widget's homepage ***/
						Uize.Wsh.writeFile ({
							path:_widgetFilesPathPrefix + '.html',
							text:UizeDotCom.Templates.WidgetToGoHomepage.process (_widget)
						});

					/*** build files in widget's folder ***/
						/*** build widget's Google Gadget XML file ***/
							Uize.Wsh.writeFile ({
								path:_widgetFilesPathPrefix + '\\gadget.xml',
								text:UizeDotCom.Templates.WidgetToGoGadgetXml.process (_widget)
							});

						/*** build widget's web.html page ***/
							Uize.Wsh.writeFile ({
								path:_widgetFilesPathPrefix + '\\web.html',
								text:UizeDotCom.Templates.WidgetToGoPage.process ({widget:_widget})
							});

						/*** build widget's mobile.html page ***/
							Uize.Wsh.writeFile ({
								path:_widgetFilesPathPrefix + '\\mobile.html',
								text:UizeDotCom.Templates.WidgetToGoPage.process ({widget:_widget,mobile:true})
							});
				}
			};

		return _package;
	}
});

