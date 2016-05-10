/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.ProgressBar.Widget Class
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
	superclass:'Uize.Widgets.Bar.HorzWithStatusText.Widget',
	required:'Uize.Template',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			stateProperties:{
				_displayedStatusText:{
					name:'displayedStatusText',
					derived:{
						properties:'statusText,value,maxValue',
						derivation:function (_statusText,_value,_maxValue) {
							return (
								_statusText
									? _statusText.call (
										this,
										{
											stepsCompleted:_value,
											totalSteps:_maxValue,
											percentComplete:Math.round (_value / _maxValue * 100)
										}
									)
									: ''
							);
						}
					}
				},
				_statusText:{
					name:'statusText',
					value:'',
					conformer:function (_value) {
						return _value && typeof _value == 'string' ? Uize.Template.compile (_value) : _value;
					}
				}
			},

			htmlBindings:{
				displayedStatusText:'statusText:html'
			}
		});
	}
});

