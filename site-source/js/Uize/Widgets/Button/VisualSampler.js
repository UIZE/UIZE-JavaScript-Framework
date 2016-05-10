/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.Button.VisualSampler Class
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
		The =Uize.Widgets.Button.VisualSampler= class implements a visual sampler widget for the =Uize.Widgets.Button.Widget= class.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widgets.Button.VisualSampler',
	superclass:'Uize.Widgets.VisualSampler.Widget',
	required:[
		'Uize.Widgets.Button.Widget',
		'Uize.Widgets.StateValues'
	],
	builder:function (_superclass) {
		'use strict';

		var _allSizes = Uize.Widgets.StateValues.size;

		return _superclass.subclass ({
			omegastructor:function () {
				this.addStateCombinationSamples ({
					text:'START',
					flavor:'positive',
					size:_allSizes
				});
				this.addStateCombinationSamples ({
					text:'CANCEL',
					flavor:'normal',
					size:_allSizes
				});
				this.addStateCombinationSamples ({
					text:'DELETE',
					flavor:'negative',
					size:_allSizes
				});
				this.addStateCombinationSamples ({
					text:'SUBMIT',
					flavor:'primary',
					size:_allSizes
				});
				this.addStateCombinationSamples ({
					text:'RESET',
					flavor:'subdued',
					size:_allSizes
				});
			},

			set:{
				samplerWidgetClass:Uize.Widgets.Button.Widget
			}
		});
	}
});

