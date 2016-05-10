/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.Tooltip.VisualTests Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 1
	codeCompleteness: 5
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Widgets.Tooltip.VisualTests= class implements a set of visual tests for the =Uize.Widgets.Tooltip.Widget= class.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widgets.Tooltip.VisualTests',
	superclass:'Uize.Widgets.VisualTests.Widget',
	required:'Uize.Widgets.Tooltip.Widget',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			omegastructor:function () {
				this.addStateTestCase ({
					heading:'5. Static Methods... 5.2. Uize.Color.cloneTuple',
					body:'A method that is useful in the development of color space or encoding extensions, and that returns a tuple array, being a clone of the specified source tuple array.'
				});
				this.addStateTestCase ({
					heading:'A Tooltip With No Body',
					body:''
				});
				this.addStateTestCase ({
					heading:'',
					body:'This is a tooltip<br/>that has no heading.'
				});
			},

			staticProperties:{
				widgetClass:Uize.Widgets.Tooltip.Widget
			}
		});
	}
});

