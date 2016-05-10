/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.Tools.SourceVsResult.Widget Class
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
	docCompleteness: 5
*/

/*?
	Introduction
		The =Uize.Widgets.Tools.SourceVsResult.Widget= module implements a widget class.

		*DEVELOPERS:* `Chris van Rensburg`

		Visual Sampler
			Below is a visual sampler of the =Uize.Widgets.Tools.SourceVsResult.Widget= class...

			............................................................
			<< widget >>

			widgetClass: Uize.Widgets.Tools.SourceVsResult.VisualSampler
			............................................................
*/

Uize.module ({
	name:'Uize.Widgets.Tools.SourceVsResult.Widget',
	superclass:'Uize.Widget.V2',
	required:[
		'Uize.Widgets.Tools.SourceVsResult.Html',
		'Uize.Widgets.Tools.SourceVsResult.Css',
		'Uize.Widgets.Button.Widget'
	],
	builder:function (_superclass) {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_buttonWidgetProperties = {
					widgetClass:Uize.Widgets.Button.Widget,
					allowClickWhenSelected:true
				}
		;

		return _superclass.subclass ({
			set:{
				html:Uize.Widgets.Tools.SourceVsResult.Html
			},

			staticProperties:{
				cssModule:Uize.Widgets.Tools.SourceVsResult.Css
			},

			stateProperties:{
				source:{value:''},
				result:{value:''},
				sourceViewShown:{value:true},
				resultViewShown:{value:true},
				sourceViewButtonLabel:{value:''},
				resultViewButtonLabel:{value:''},
				twoWay:{value:false},

				/*** derived properties ***/
					sourceViewButtonSelected:{
						derived:'sourceViewShown,resultViewShown: sourceViewShown && !resultViewShown'
					},
					resultViewButtonSelected:{
						derived:'sourceViewShown,resultViewShown: resultViewShown && !sourceViewShown'
					},
					splitView:{
						derived:'sourceViewShown,resultViewShown: sourceViewShown && resultViewShown'
					},
					resultViewReadOnly:{
						derived:'!twoWay'
					}
			},

			children:{
				sourceViewButton:_buttonWidgetProperties,
				resultViewButton:_buttonWidgetProperties
			},

			eventBindings:{
				'sourceViewButton:Click':function () {
					this.set ({sourceViewShown:true});
					this.toggle ('resultViewShown');
				},
				'resultViewButton:Click':function () {
					this.set ({resultViewShown:true});
					this.toggle ('sourceViewShown');
				},
				'#source:keyup':function (_event) {
					this.set ({source:_event.target.value});
				},
				'#result:keyup':function (_event) {
					this.twoWay && this.set ({result:_event.target.value});
				}
			},

			childBindings:{
				sourceViewButtonSelected:'->sourceViewButton.selected',
				resultViewButtonSelected:'->resultViewButton.selected',
				sourceViewButtonLabel:'->sourceViewButton.text',
				resultViewButtonLabel:'->resultViewButton.text'
			},

			htmlBindings:{
				sourceViewShown:'sourceView:show',
				resultViewShown:'resultView:show',
				resultViewReadOnly:'result:readOnly',
				source:'source',
				result:'result'
			},

			cssBindings:{
				splitView:['','splitView']
			}
		});
	}
});

