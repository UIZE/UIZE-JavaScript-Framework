/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Widget.mCssBindings Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014 UIZE
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
							title:'When a class name generator array in a CSS binding produces an empty string value, no class for the binding is added to the root node CSS classes for that binding',
							test:function () {
								var
									_WidgetClass = Uize.Widget.subclass ({
										mixins:Uize.Widget.mCssBindings,
										stateProperties:{isSelected:{value:false}},
										cssBindings:{isSelected:['','selected']},
										staticProperties:{
											cssModule:Uize.package ({
												add:Uize.nop,
												moduleName:'CssModule'
											})
										}
									})
								;
								_WidgetClass.moduleName = 'WidgetClass';

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
						}
					]
				}
			]
		});
	}
});

