/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.Bar.FullEmpty.VisualSampler Class
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
		The =Uize.Widgets.Bar.FullEmpty.VisualSampler= class implements a visual sampler widget for the =Uize.Widgets.Bar.FullEmpty.Widget= class.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widgets.Bar.FullEmpty.VisualSampler',
	superclass:'Uize.Widgets.VisualSampler.Widget',
	required:[
		'Uize.Widgets.Bar.FullEmpty.Widget',
		'Uize.Widgets.StateValues'
	],
	builder:function (_superclass) {
		'use strict';

		var _allSizes = Uize.Widgets.StateValues.size;

		return _superclass.subclass ({
			omegastructor:function () {
				/*** horizontal sliders ***/
					this.addStateCombinationSamples ({
						orientation:'horizontal',
						value:75,
						size:'medium',
						maxValue:100,
						fullColor:['#f00','#0f0','#00f']
					});
					this.addStateCombinationSamples ({
						orientation:'horizontal',
						value:50,
						size:'tiny',
						maxValue:100,
						emptyColor:['#fff','#0f0'],
						fullColor:['#fff','#f00']
					});
					this.addStateCombinationSamples ({
						orientation:'horizontal',
						value:30,
						maxValue:100,
						size:_allSizes,
						fullColor:'#f00'
					});

				/*** vertical sliders ***/
					this.addStateCombinationSamples ({
						orientation:'vertical',
						trackLength:300,
						value:75,
						size:'medium',
						maxValue:100,
						fullColor:['#f00','#0f0','#00f']
					});
					this.addStateCombinationSamples ({
						orientation:'vertical',
						trackLength:300,
						value:50,
						size:'tiny',
						maxValue:100,
						emptyColor:['#fff','#0f0'],
						fullColor:['#fff','#f00']
					});
					this.addStateCombinationSamples ({
						orientation:'vertical',
						trackLength:300,
						value:30,
						maxValue:100,
						size:_allSizes,
						fullColor:'#f00'
					});
			},

			set:{
				samplerWidgetClass:Uize.Widgets.Bar.FullEmpty.Widget
			}
		});
	}
});

