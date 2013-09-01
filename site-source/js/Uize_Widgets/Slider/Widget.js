/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.Slider.Widget Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013 UIZE
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
		The =Uize.Widgets.Slider.Widget= class implements a slider widget that supports several standard sizes and horizontal and vertical orientations.

		*DEVELOPERS:* `Chris van Rensburg`

		Visual Sampler
			Below is a visual sampler of the =Uize.Widgets.Slider.Widget= class...

			..............................................
			<< widget >>

			widgetClass: Uize.Widgets.Slider.VisualSampler
			..............................................
*/

Uize.module ({
	name:'Uize.Widgets.Slider.Widget',
	superclass:'Uize.Widget.Bar.Slider',
	required:[
		'Uize.Widgets.Slider.Html',
		'Uize.Widgets.Slider.Css',
		'Uize.Template'
	],
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			omegastructor:function () {
				var _this = this;

				_this.onChange (
					function (orientation,trackLength) {return orientation == 'horizontal' ? trackLength : ''},
					function (_displayedStyleWidth) {_this.set ({_displayedStyleWidth:_displayedStyleWidth})}
				);
				_this.onChange (
					function (orientation,trackLength) {return orientation == 'horizontal' ? '' : trackLength},
					function (_displayedStyleHeight) {_this.set ({_displayedStyleHeight:_displayedStyleHeight})}
				);
			},

			stateProperties:{
				_size:{
					name:'size',
					value:'medium'
				},
				_trackLength:{
					name:'trackLength',
					value:''
				},
				_emptyColor:'emptyColor',
				_fullColor:'fullColor',
				_displayedStyleWidth:'displayedStyleWidth',
				_displayedStyleHeight:'displayedStyleHeight'
			},

			set:{
				html:Uize.Widgets.Slider.Html,
				orientation:'horizontal'
			},

			cssBindings:{
				orientation:'value',
				size:'value'
			},

			htmlBindings:{
				emptyColor:'empty:style.backgroundColor',
				fullColor:'full:style.backgroundColor',
				displayedStyleWidth:':style.width',
				displayedStyleHeight:':style.height'
			},

			staticProperties:{
				cssModule:Uize.Widgets.Slider.Css
			}
		});
	}
});

