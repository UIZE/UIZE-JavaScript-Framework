/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.Buttons.ViewSizeToggler.Widget Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2016 UIZE
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
		The =Uize.Widgets.Buttons.ViewSizeToggler.Widget= class implements a view size toggler button that supports toggling between small and large views.

		*DEVELOPERS:* `Chris van Rensburg`

		Visual Sampler
			Below is a visual sampler of the =Uize.Widgets.Buttons.ViewSizeToggler.Widget= class...

			...............................................................
			<< widget >>

			widgetClass: Uize.Widgets.Buttons.ViewSizeToggler.VisualSampler
			...............................................................
*/

Uize.module ({
	name:'Uize.Widgets.Buttons.ViewSizeToggler.Widget',
	superclass:'Uize.Widgets.Buttons.Directional.Widget',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			hasLoc:true,

			stateProperties:{
				viewSize:{value:'small'},

				/*** Derived Properties ***/
					directionX:{
						derived:'viewSize: viewSize == "small" ? 1 : -1'
					},
					directionY:{
						derived:'viewSize: viewSize == "small" ? -1 : 1'
					},
					_rootNodeTitle:{
						derived:'viewSize, loc_largerViewTooltip, loc_smallerViewTooltip: viewSize == "small" ? loc_largerViewTooltip : loc_smallerViewTooltip'
					}
			},

			set:{
				action:function () {
					this.set ({viewSize:this.viewSize == 'small' ? 'large' : 'small'});
				}
			},

			htmlBindings:{
				_rootNodeTitle:':title'
			}
		});
	}
});

