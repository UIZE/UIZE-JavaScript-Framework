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
		The =Uize.Widgets.ProgressBar.Widget= class implements a progress bar widget that supports horizontal and vertical orientations.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widgets.ProgressBar.Widget',
	superclass:'Uize.Widget.Bar',
	required:[
		'Uize.Widgets.ProgressBar.Html',
		'Uize.Widgets.ProgressBar.Css'
	],
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			omegastructor:function () {
				var _this = this;

				_this.onChange (
					function (statusText,value,maxValue) {
						return statusText ? statusText.call (this,{stepsCompleted:value,totalSteps:maxValue}) : '';
					},
					function (_displayedStatusText) {_this.set ({_displayedStatusText:_displayedStatusText})}
				);
			},

			stateProperties:{
				_displayedStatusText:{
					name:'displayedStatusText',
					onChange:function () {
						var _this = this;
						_this.once ('isWired',function () {_this.setNodeValue ('statusText',_this._displayedStatusText)});
					}
				},

				_statusText:{
					name:'statusText',
					value:''
				}
			},

			set:{
				html:Uize.Widgets.ProgressBar.Html,
				orientation:'horizontal',
				minValue:0,
				value:0
			},

			staticProperties:{
				cssModule:Uize.Widgets.ProgressBar.Css
			}
		});
	}
});

