/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.Bar.FullEmpty.mFullEmpty Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2005-2015 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 5
	codeCompleteness: 100
	docCompleteness: 25
*/

/*?
	Introduction
		The =Uize.Widgets.Bar.FullEmpty.mFullEmpty= module implements a mixin that lets you mix in the full/empty styling functionality for bar and slider V2 widget classes.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widgets.Bar.FullEmpty.mFullEmpty',
	builder:function () {
		'use strict';

		return function (_class) {
			_class.declare ({
				stateProperties:{
					emptyColor:{
						value:'#fff'
					},
					fullColor:{
						value:'#fff'
					},

					/*** derived properties ***/
						fullStyleTop:{
							derived:
								'orientation,valuePosPercent: orientation == "horizontal" ? 0 : 100 - valuePosPercent + "%"'
						},
						fullStyleRight:{
							derived:
								'orientation,valuePosPercent: orientation == "vertical" ? 0 : 100 - valuePosPercent + "%"'
						},
						emptyStyleBottom:{
							derived:
								'orientation,valuePosPercent: orientation == "horizontal" ? 0 : valuePosPercent + "%"'
						},
						emptyStyleLeft:{
							derived:
								'orientation,valuePosPercent: orientation == "vertical" ? 0 : valuePosPercent + "%"'
						}
				},

				htmlBindings:{
					fullColor:'full:style.backgroundColor',
					emptyColor:'empty:style.backgroundColor',
					fullStyleTop:'full:style.top',
					fullStyleRight:'full:style.right',
					emptyStyleBottom:'empty:style.bottom',
					emptyStyleLeft:'empty:style.left'
				}
			});
		};
	}
});

