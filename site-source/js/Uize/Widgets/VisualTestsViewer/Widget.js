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
	superclass:'Uize.Widgets.WidgetViewer.Widget',
	required:[
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

			instanceMethods:{
				insertViewer:function (_value) {
					var m = this;
					Uize.require (
						_visualTestsModuleNameFromWidgetClass (_value),
						function (_visualTestsModule) {
							m.addChild (
								'viewer',
								_visualTestsModule,
								{
									built:false,
									container:m.getNode ('viewer')
								}
							).insertUi ();
						}
					);
				}
			},

			stateProperties:{
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
				displayedSelectorOptions:{
					derived:function (widgetsWithVisualTests,loc_noSelectionText) {
						return [[loc_noSelectionText || '','-']].concat (Uize.map (widgetsWithVisualTests,'[value,value]'));
					}
				}
			}
		});
	}
});

