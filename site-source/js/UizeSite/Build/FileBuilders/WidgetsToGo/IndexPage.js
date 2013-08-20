/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Build.FileBuilders.WidgetsToGo.IndexPage Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2012-2013 UIZE
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
		The =UizeSite.Build.FileBuilders.WidgetsToGo.IndexPage= module defines a file builder for the index page of the Widgets To Go section of the UIZE Web site.

		*DEVELOPERS:* `Chris van Rensburg`

		Functions defined in the file builder are called as instance methods on an instance of a subclass of the =Uize.Services.FileBuilderAdapter= class, so the functions can access instance methods implemented in this class.
*/

Uize.module ({
	name:'UizeSite.Build.FileBuilders.WidgetsToGo.IndexPage',
	required:'UizeSite.Build.FileBuilders.WidgetsToGo',
	builder:function () {
		return Uize.package ({
			description:'Widgets To Go index page',
			urlMatcher:function (_urlParts) {
				return _urlParts.pathname == this.builtUrl ('javascript-widgets.html');
			},
			builderInputs:function (_urlParts) {
				return {
					template:this.memoryUrlFromBuiltUrl (_urlParts.pathname) + '.jst',
					widgets:this.memoryUrl (UizeSite.Build.FileBuilders.WidgetsToGo.widgetsToGoPath + 'widgets.simpledata')
				};
			},
			builder:function (_inputs) {
				return this.readFile ({path:_inputs.template}) ({
					files:Uize.map (
						this.readFile ({path:_inputs.widgets}).widgets,
						function (_widget) {
							var _widgetTitleUrlized = UizeSite.Build.FileBuilders.WidgetsToGo.urlizeWidgetTitle (_widget);
							return {
								title:_widget.title,
								path:UizeSite.Build.FileBuilders.WidgetsToGo + _widgetTitleUrlized + '.html',
								imageSrc:'images/widgets/' + _widgetTitleUrlized + '-96x96.gif',
								description:_widget.description.short
							};
						}
					)
				});
			}
		});
	}
});

