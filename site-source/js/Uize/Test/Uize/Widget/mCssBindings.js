/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Widget.mCssBindings Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Test
	importance: 3
	codeCompleteness: 5
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Test.Uize.Widget.mCssBindings= module defines a suite of unit tests for the =Uize.Widget.mCssBindings= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Widget.mCssBindings',
	builder:function () {
		'use strict';

		/*** Utility Functions ***/
			function _getDummyWidgetClassWithCssBindingsFeature (_features) {
				return Uize.copyInto (
					Uize.Widget.subclass ({
						mixins:Uize.Widget.mCssBindings,
						staticProperties:{
							cssModule:Uize.package ({
								add:Uize.nop,
								moduleName:'CssModule'
							})
						}
					}).declare (_features),
					{moduleName:'WidgetClass'}
				);
			}

		return Uize.Test.resolve ({
			title:'Uize.Widget.mCssBindings Module Test',
			test:[
				Uize.Test.requiredModulesTest ([
					'Uize.Widget',
					'Uize.Widget.mCssBindings'
				]),
				{
					title:'Miscellaneous tests',
					test:[
						{
							title:'When a class name generator array produces an empty string value, no class is added for that CSS binding',
							test:function () {
								var _WidgetClass = _getDummyWidgetClassWithCssBindingsFeature ({
									stateProperties:{isSelected:{value:false}},
									cssBindings:{isSelected:['','selected']}
								});
								return (
									this.expect (
										'CssModule',
										_WidgetClass ().get ('mCssBindings_rootNodeClasses')
									) &&
									this.expect (
										'CssModule CssModule-selected',
										_WidgetClass ({isSelected:true}).get ('mCssBindings_rootNodeClasses')
									)
								);
							}
						},
						{
							title:'When an inverted state class name generator array is used, it results in a class being added when the state property is false and no class being added when the state property is true',
							test:function () {
								var _WidgetClass = _getDummyWidgetClassWithCssBindingsFeature ({
									stateProperties:{isSelected:{value:false}},
									cssBindings:{isSelected:['unselected','']}
								});
								return (
									this.expect (
										'CssModule CssModule-unselected',
										_WidgetClass ().get ('mCssBindings_rootNodeClasses')
									) &&
									this.expect (
										'CssModule',
										_WidgetClass ({isSelected:true}).get ('mCssBindings_rootNodeClasses')
									)
								);
							}
						}
					]
				}
			]
		});
	}
});

