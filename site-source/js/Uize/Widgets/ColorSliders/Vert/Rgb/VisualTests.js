/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.ColorSliders.Vert.Rgb.VisualTests Class
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
		The =Uize.Widgets.ColorSliders.Vert.Rgb.VisualTests= class implements a set of visual tests for the =Uize.Widgets.ColorSliders.Vert.Rgb.Widget= class.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widgets.ColorSliders.Vert.Rgb.VisualTests',
	superclass:'Uize.Widgets.VisualTests.Widget',
	required:'Uize.Widgets.ColorSliders.Vert.Rgb.Widget',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			omegastructor:function () {
				this.addStateTestCase ({
					size:'tiny',
					sliderHeight:150,
					value:'#cc5599'
				});
				this.addStateTestCase ({
					size:'small',
					sliderHeight:180,
					value:'#cc5599'
				});
				this.addStateTestCase ({
					size:'medium',
					sliderHeight:220,
					value:'#cc5599'
				});
				this.addStateTestCase ({
					size:'large',
					sliderHeight:280,
					value:'#cc5599'
				});
				this.addStateCombinationTestCases ({
					value:['#e99975','#4c7cd1','#ff0000','#000','#fff','#888'],
					sliderHeight:250
				});
			},

			staticProperties:{
				widgetClass:Uize.Widgets.ColorSliders.Vert.Rgb.Widget
			}
		});
	}
});

