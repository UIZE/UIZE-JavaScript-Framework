/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.WidgetViewer.VisualTestsViewer.Widget Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013-2016 UIZE
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
		The =Uize.Widgets.WidgetViewer.VisualTestsViewer.Widget= class implements a widget for selecting and viewing visual tests for widget modules that have companion visual tests modules.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widgets.WidgetViewer.VisualTestsViewer.Widget',
	superclass:'Uize.Widgets.WidgetViewer.Widget',
	required:[
		'Uize.Data.Matches',
		'Uize.Util.ModuleNaming'
	],
	builder:function (_superclass) {
		'use strict';

		var
			/*** variables for performance optimization ***/
				_visualTestsModuleNameFromWidgetClass = Uize.Util.ModuleNaming.visualTestsModuleNameFromWidgetClass
		;

		return _superclass.subclass ({
			hasLoc:true,

			instanceMethods:{
				insertViewer:function (_value) {
					var m = this;
					Uize.require (
						_visualTestsModuleNameFromWidgetClass (_value),
						function (_visualTestsModule) {
							m.addChild ('viewer',_visualTestsModule,{built:false}).insertUi ();
						}
					);
				}
			},

			stateProperties:{
				_widgetsWithVisualTests:{
					name:'widgetsWithVisualTests',
					derived:{
						properties:'modules',
						derivation:function (_modules) {
							var _modulesLookup = Uize.lookup (_modules);
							return Uize.Data.Matches.values (
								_modules,
								function (_moduleName) {
									return _modulesLookup [_visualTestsModuleNameFromWidgetClass (_moduleName)];
								}
							);
						}
					}
				},
				values:{
					derived:{
						properties:'widgetsWithVisualTests,loc_noSelectionText',
						derivation:function (_widgetsWithVisualTests,_loc_noSelectionText) {
							return [{displayName:_loc_noSelectionText || '',name:'-'}].concat (
								Uize.map (_widgetsWithVisualTests,'{name:value}')
							);
						}
					}
				}
			}
		});
	}
});

