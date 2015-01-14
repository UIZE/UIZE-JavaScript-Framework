/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Build.FileBuilders.WidgetsToGo.GoogleGadgetXmlPages Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2012-2015 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 1
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =UizeSite.Build.FileBuilders.WidgetsToGo.GoogleGadgetXmlPages= module defines a file builder for the individual widget Google gadget XML pages for the Widgets To Go section of the UIZE Web site.

		*DEVELOPERS:* `Chris van Rensburg`

		Functions defined in the file builder are called as instance methods on an instance of a subclass of the =Uize.Services.FileBuilderAdapter= class, so the functions can access instance methods implemented in this class.
*/

Uize.module ({
	name:'UizeSite.Build.FileBuilders.WidgetsToGo.GoogleGadgetXmlPages',
	required:[
		'UizeSite.Build.FileBuilders.WidgetsToGo',
		'Uize.Data.Matches',
		'Uize.Str.Has'
	],
	builder:function () {
		return Uize.package ({
			description:'Widget Google Gadget XML pages',
			urlMatcher:function (_urlParts) {
				return (
					_urlParts.file == 'gadget.xml' &&
					Uize.Str.Has.hasPrefix (
						_urlParts.folderPath,
						this.builtUrl (UizeSite.Build.FileBuilders.WidgetsToGo.widgetsToGoPath)
					) &&
					UizeSite.Build.FileBuilders.WidgetsToGo.threeFoldersDeepRegExp.test (_urlParts.pathname)
				);
			},
			builderInputs:function (_urlParts) {
				var _widgetsToGoMemoryPath = this.memoryUrl (UizeSite.Build.FileBuilders.WidgetsToGo.widgetsToGoPath);
				return {
					template:_widgetsToGoMemoryPath + 'gadget.xml.jst',
					widgets:_widgetsToGoMemoryPath + 'widgets.simpledata'
				};
			},
			builder:function (_inputs,_urlParts) {
				var _widgetTitleUrlized =
					_urlParts.pathname.match (UizeSite.Build.FileBuilders.WidgetsToGo.threeFoldersDeepRegExp) [3]
				;
				return this.readFile ({path:_inputs.template}) (
					Uize.Data.Matches.firstValue (
						this.readFile ({path:_inputs.widgets}).widgets,
						function (_widget) {
							return _widgetTitleUrlized == UizeSite.Build.FileBuilders.WidgetsToGo.urlizeWidgetTitle (_widget);
						}
					)
				);
			}
		});
	}
});

