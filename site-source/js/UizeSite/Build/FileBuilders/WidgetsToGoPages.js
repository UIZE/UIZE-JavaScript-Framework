/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Build.FileBuilders.WidgetsToGoPages Package
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
		The =UizeSite.Build.FileBuilders.WidgetsToGoPages= module defines a file builder for all the pages of the Widgets To Go section of the UIZE Web site.

		*DEVELOPERS:* `Chris van Rensburg`

		Functions defined in the file builder are called as instance methods on an instance of a subclass of the =Uize.Services.FileBuilderAdapter= class, so the functions can access instance methods implemented in this class.
*/

Uize.module ({
	name:'UizeSite.Build.FileBuilders.WidgetsToGoPages',
	required:[
		'Uize.Data.Matches',
		'Uize.String'
	],
	builder:function () {
		var
			_widgetsToGoPath = 'widgets/',
			_threeFoldersDeepRegExp = /^([^\\\/]+)[\\\/]([^\\\/]+)[\\\/]([^\\\/]+)[\\\/][^\\\/]+$/
		;

		function _urlizeWidgetTitle (_widget) {
			return _widget.title.toLowerCase ().replace (/\s+/g,'-');
		}

		return [
			{
				description:'Widgets To Go index page',
				urlMatcher:function (_urlParts) {
					return _urlParts.pathname == this.builtUrl ('javascript-widgets.html');
				},
				builderInputs:function (_urlParts) {
					return {
						template:this.memoryUrlFromBuiltUrl (_urlParts.pathname) + '.jst',
						widgets:this.memoryUrl (_widgetsToGoPath + 'widgets.simpledata')
					};
				},
				builder:function (_inputs) {
					return this.readFile ({path:_inputs.template}) ({
						files:Uize.map (
							this.readFile ({path:_inputs.widgets}).widgets,
							function (_widget) {
								var _widgetTitleUrlized = _urlizeWidgetTitle (_widget);
								return {
									title:_widget.title,
									path:_widgetsToGoPath + _widgetTitleUrlized + '.html',
									imageSrc:'images/widgets/' + _widgetTitleUrlized + '-96x96.gif',
									description:_widget.description.short
								};
							}
						)
					});
				}
			},
			{
				description:'Widget homepages',
				urlMatcher:function (_urlParts) {
					return (
						_urlParts.fileType == 'html' &&
						_urlParts.folderPath == this.builtUrl (_widgetsToGoPath)
					);
				},
				builderInputs:function (_urlParts) {
					var _widgetsToGoMemoryPath = this.memoryUrl (_widgetsToGoPath);
					return {
						template:_widgetsToGoMemoryPath + 'homepage.html.jst',
						widgets:_widgetsToGoMemoryPath + 'widgets.simpledata'
					};
				},
				builder:function (_inputs,_urlParts) {
					var _widgetTitleUrlized = _urlParts.fileName;
					return this.readFile ({path:_inputs.template}) (
						Uize.Data.Matches.firstValue (
							this.readFile ({path:_inputs.widgets}).widgets,
							function (_widget) {return _widgetTitleUrlized == _urlizeWidgetTitle (_widget)}
						)
					);
				}
			},
			{
				description:'Widget IFRAME pages',
				urlMatcher:function (_urlParts) {
					return (
						_urlParts.fileType == 'html' &&
						Uize.String.startsWith (_urlParts.folderPath,this.builtUrl (_widgetsToGoPath)) &&
						(_urlParts.fileName == 'web' || _urlParts.fileName == 'mobile') &&
						_threeFoldersDeepRegExp.test (_urlParts.pathname)
					);
				},
				builderInputs:function (_urlParts) {
					var _widgetsToGoMemoryPath = this.memoryUrl (_widgetsToGoPath);
					return {
						template:_widgetsToGoMemoryPath + 'widget.html.jst',
						widgets:_widgetsToGoMemoryPath + 'widgets.simpledata'
					};
				},
				builder:function (_inputs,_urlParts) {
					var _widgetTitleUrlized = _urlParts.pathname.match (_threeFoldersDeepRegExp) [3];
					return this.readFile ({path:_inputs.template}) ({
						widget:Uize.Data.Matches.firstValue (
							this.readFile ({path:_inputs.widgets}).widgets,
							function (_widget) {return _widgetTitleUrlized == _urlizeWidgetTitle (_widget)}
						),
						mobile:_urlParts.fileName == 'mobile'
					});
				}
			},
			{
				description:'Widget Google Gadget XML pages',
				urlMatcher:function (_urlParts) {
					return (
						_urlParts.file == 'gadget.xml' &&
						Uize.String.startsWith (_urlParts.folderPath,this.builtUrl (_widgetsToGoPath)) &&
						_threeFoldersDeepRegExp.test (_urlParts.pathname)
					);
				},
				builderInputs:function (_urlParts) {
					var _widgetsToGoMemoryPath = this.memoryUrl (_widgetsToGoPath);
					return {
						template:_widgetsToGoMemoryPath + 'gadget.xml.jst',
						widgets:_widgetsToGoMemoryPath + 'widgets.simpledata'
					};
				},
				builder:function (_inputs,_urlParts) {
					var _widgetTitleUrlized = _urlParts.pathname.match (_threeFoldersDeepRegExp) [3];
					return this.readFile ({path:_inputs.template}) (
						Uize.Data.Matches.firstValue (
							this.readFile ({path:_inputs.widgets}).widgets,
							function (_widget) {return _widgetTitleUrlized == _urlizeWidgetTitle (_widget)}
						)
					);
				}
			}
		];
	}
});

