/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.RatingStars.Widget Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 1
	codeCompleteness: 100
	docCompleteness: 5
*/

/*?
	Introduction
		The =Uize.Widgets.ImagePort.Widget= module implements a widget class for a rating stars widget.

		*DEVELOPERS:* `Chris van Rensburg`

		Visual Sampler
			Below is a visual sampler of the =Uize.Widgets.RatingStars.Widget= class...

			...................................................
			<< widget >>

			widgetClass: Uize.Widgets.RatingStars.VisualSampler
			...................................................
*/

Uize.module ({
	name:'Uize.Widgets.RatingStars.Widget',
	superclass:'Uize.Widget.V2',
	required:[
		'Uize.Widgets.RatingStars.Html',
		'Uize.Widgets.RatingStars.Css'
	],
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			set:{
				html:Uize.Widgets.RatingStars.Html
			},

			staticProperties:{
				cssModule:Uize.Widgets.RatingStars.Css
			},

			stateProperties:{
				value:{value:3.5},
				maxValue:{value:5},

				/*** derived properties ***/
					_tooltipText:{
						derived:'value, maxValue: value + " / " + maxValue'
					},
					_starsOnRight:{
						derived:'value, maxValue: ((1 - value / maxValue) * 100).toFixed (2) + "%"'
					},
					_starsText:{
						derived:'maxValue: Uize.map (maxValue,"\'★\'").join ("")'
					}
			},

			htmlBindings:{
				_tooltipText:':title',
				_starsOnRight:'starsOn:style.right',
				_starsText:['starsOff','starsOn']
			}
		});
	}
});

