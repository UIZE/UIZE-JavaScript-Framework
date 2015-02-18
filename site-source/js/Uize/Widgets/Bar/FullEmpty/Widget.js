/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.Bar.FullEmpty.Widget Class
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
		The =Uize.Widget.Bar.FullEmpty= class implements a widget for displaying numerical values using a bar, with full and empty indicators and an optional value knob.

		*DEVELOPERS:* `Chris van Rensburg`, `Bryan Hsueh`

		This module supports both horizontally and vertically oriented bars.

		Visual Sampler
			Below is a visual sampler of the =Uize.Widgets.Bar.FullEmpty.Widget= class...

			.....................................................
			<< widget >>

			widgetClass: Uize.Widgets.Bar.FullEmpty.VisualSampler
			.....................................................
*/

Uize.module ({
	name:'Uize.Widgets.Bar.FullEmpty.Widget',
	superclass:'Uize.Widgets.Bar.Widget',
	required:[
		'Uize.Widgets.Bar.FullEmpty.Html',
		'Uize.Widgets.Bar.FullEmpty.Css'
	],
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			set:{
				html:Uize.Widgets.Bar.FullEmpty.Html
			},

			staticProperties:{
				cssModule:Uize.Widgets.Bar.FullEmpty.Css
			},

			stateProperties:{
				_emptyColor:{
					name:'emptyColor',
					value:'#fff'
				},
				_fullColor:{
					name:'fullColor',
					value:'#fff'
				},

				/*** derived properties ***/
					_fullStyleTop:{
						derived:'orientation,valuePosPercent: orientation == "horizontal" ? 0 : 100 - valuePosPercent + "%"'
					},
					_fullStyleRight:{
						derived:'orientation,valuePosPercent: orientation == "vertical" ? 0 : 100 - valuePosPercent + "%"'
					},
					_emptyStyleBottom:{
						derived:'orientation,valuePosPercent: orientation == "horizontal" ? 0 : valuePosPercent + "%"'
					},
					_emptyStyleLeft:{
						derived:'orientation,valuePosPercent: orientation == "vertical" ? 0 : valuePosPercent + "%"'
					}
			},

			htmlBindings:{
				fullColor:'full:style.backgroundColor',
				emptyColor:'empty:style.backgroundColor',
				_fullStyleTop:'full:style.top',
				_fullStyleRight:'full:style.right',
				_emptyStyleBottom:'empty:style.bottom',
				_emptyStyleLeft:'empty:style.left'
			}
		});
	}
});

