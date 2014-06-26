/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.VisualTestsViewer.Widget Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013-2014 UIZE
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
		The =Uize.Widgets.VisualTestsViewer.Widget= class implements a widget for selecting and viewing visual tests for widget modules that have companion visual tests modules.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widgets.VisualTestsViewer.Widget',
	superclass:'Uize.Widget.V2',
	required:[
		'Uize.Widgets.VisualTestsViewer.Html',
		'Uize.Widgets.VisualTestsViewer.Css',
		'Uize.Data.Matches',
		'UizeSite.Build.Util'
	],
	builder:function (_superclass) {
		'use strict';

		var
			/*** variables for performance optimization ***/
				_visualTestsModuleNameFromWidgetClass = UizeSite.Build.Util.visualTestsModuleNameFromWidgetClass
		;

		return _superclass.subclass ({
			hasLoc:true,

			staticProperties:{
				cssModule:Uize.Widgets.VisualTestsViewer.Css
			},

			set:{
				html:Uize.Widgets.VisualTestsViewer.Html
			},

			stateProperties:{
				_modules:'modules',
				_widgetsWithVisualTests:{
					name:'widgetsWithVisualTests',
					derived:function (modules) {
						var
							_modules = modules,
							_modulesLookup = Uize.lookup (_modules)
						;
						return Uize.Data.Matches.values (
							_modules,
							function (_moduleName) {
								return _modulesLookup [_visualTestsModuleNameFromWidgetClass (_moduleName)];
							}
						);
					}
				},
				_selectedWidget:'selectedWidget',
				_displayedSelectorOptions:{
					name:'displayedSelectorOptions',
					derived:function (widgetsWithVisualTests,loc_noSelectionText) {
						return [loc_noSelectionText].concat (widgetsWithVisualTests);
					}
				}
			},

			eventBindings:{
				'#selector:change':function () {
					this.set ({_selectedWidget:this.getNodeValue ('selector')});
				}
			},

			htmlBindings:{
				loc_selectorLabel:'selectorLabel:value',
				displayedSelectorOptions:function (_displayedSelectorOptions) {
					var
						m = this,
						_selector = m.getNode ('selector'),
						_selectorOptions = _selector.options
					;
					_selectorOptions.length = 0;
					_selectorOptions [0] = new Option (_displayedSelectorOptions [0] || '','');
					for (
						var
							_displayedSelectorOptionNo = 0,
							_displayedSelectorOptionsLength = _displayedSelectorOptions.length
						;
						++_displayedSelectorOptionNo < _displayedSelectorOptionsLength;
					) {
						var _widgetClass = _displayedSelectorOptions [_displayedSelectorOptionNo];
						_selectorOptions [_selectorOptions.length] = new Option (_widgetClass,_widgetClass);
					}
					m.setNodeValue (_selector,m._selectedWidget);
				},
				selectedWidget:[
					'selector:value',
					function (_selectedWidget) {
						var m = this;
						if (m.children.visualTests) {
							m.removeChild ('visualTests');
							m.setNodeInnerHtml ('viewer','');
						}
						if (_selectedWidget) {
							Uize.require (
								_visualTestsModuleNameFromWidgetClass (_selectedWidget),
								function (_visualTestsModule) {
									m.addChild (
										'visualTests',
										_visualTestsModule,
										{
											built:false,
											container:m.getNode ('viewer')
										}
									).insertUi ();
								}
							);
						}
					}
				]
			}
		});
	}
});

