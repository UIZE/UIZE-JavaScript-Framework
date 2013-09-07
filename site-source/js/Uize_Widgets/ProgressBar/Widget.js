/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.ProgressBar.Widget Class
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
		The =Uize.Widgets.ProgressBar.Widget= class implements a progress bar widget that supports several standard sizes and optional overlayed status text.

		*DEVELOPERS:* `Chris van Rensburg`

		Visual Sampler
			Below is a visual sampler of the =Uize.Widgets.ProgressBar.Widget= class...

			...................................................
			<< widget >>

			widgetClass: Uize.Widgets.ProgressBar.VisualSampler
			...................................................
*/

Uize.module ({
	name:'Uize.Widgets.ProgressBar.Widget',
	superclass:'Uize.Widget.Bar',
	required:[
		'Uize.Widgets.ProgressBar.Html',
		'Uize.Widgets.ProgressBar.Css',
		'Uize.Template'
	],
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			stateProperties:{
				_displayedStatusText:{
					name:'displayedStatusText',
					derived:function (statusText,value,maxValue) {
						return (
							statusText
								? statusText.call (
									this,
									{
										stepsCompleted:value,
										totalSteps:maxValue,
										percentComplete:Math.round (value / maxValue * 100)
									}
								)
								: ''
						);
					}
				},

				_size:{
					name:'size',
					value:'medium'
				},

				_statusText:{
					name:'statusText',
					value:'',
					conformer:function (_value) {
						return _value && typeof _value == 'string' ? Uize.Template.compile (_value) : _value;
					}
				}
			},

			set:{
				html:Uize.Widgets.ProgressBar.Html,
				orientation:'horizontal',
				minValue:0,
				value:0
			},

			cssBindings:{
				size:'value'
			},

			htmlBindings:{
				displayedStatusText:'statusText:html'
			},

			staticProperties:{
				cssModule:Uize.Widgets.ProgressBar.Css
			}
		});
	}
});

