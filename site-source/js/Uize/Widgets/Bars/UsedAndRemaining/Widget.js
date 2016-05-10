/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.Bars.UsedAndRemaining.Widget Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2015-2016 UIZE
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
		The =Uize.Widgets.Bars.UsedAndRemaining.Widget= class implements a bar widget for indicating used versus remaining, supporting customizable text messages for each.

		*DEVELOPERS:* `Chris van Rensburg`

		Visual Sampler
			Below is a visual sampler of the =Uize.Widgets.Bars.UsedAndRemaining.Widget= class...

			.............................................................
			<< widget >>

			widgetClass: Uize.Widgets.Bars.UsedAndRemaining.VisualSampler
			.............................................................
*/

Uize.module ({
	name:'Uize.Widgets.Bars.UsedAndRemaining.Widget',
	superclass:'Uize.Widgets.Bar.HorzWithStatusText.Widget',
	required:[
		'Uize.Widgets.Bars.UsedAndRemaining.Html',
		'Uize.Widgets.Bars.UsedAndRemaining.Css',
		'Uize.Template',
		'Uize.Color',
		'Uize.Color.xUtil'
	],
	builder:function (_superclass) {
		'use strict';

		/*** Utility Functions ***/
			function _textConformer (_value) {
				return _value && typeof _value == 'string' ? Uize.Template.compile (_value) : _value;
			}

		return _superclass.subclass ({
			set:{
				html:Uize.Widgets.Bars.UsedAndRemaining.Html
			},

			staticProperties:{
				cssModule:Uize.Widgets.Bars.UsedAndRemaining.Css
			},

			stateProperties:{
				_used:{
					name:'used',
					value:0
				},
				_usedText:{
					name:'usedText',
					value:'',
					conformer:_textConformer
				},
				_remainingText:{
					name:'remainingText',
					value:'',
					conformer:_textConformer
				},

				/*** derived properties ***/
					value:{
						derived:'used'
					},
					_displayedUsedText:{
						name:'displayedUsedText',
						derived:{
							properties:'usedText,used',
							derivation:function (_usedText,_used) {
								return _usedText ? _usedText.call (this,{used:_used}) : '';
							}
						}
					},
					_displayedRemainingText:{
						name:'displayedRemainingText',
						derived:{
							properties:'remainingText,used,maxValue',
							derivation:function (_remainingText,_used,_maxValue) {
								return _remainingText ? _remainingText.call (this,{remaining:_maxValue - _used}) : '';
							}
						}
					},
					_usedColor:{
						derived:{
							properties:'value,maxValue',
							derivation:function (_value,_maxValue) {
								return Uize.Color.blend ('hsl(120,100,50)','hsl(0,100,50)',_value / _maxValue,'#hex');
							}
						}
					}
			},

			htmlBindings:{
				_usedColor:'full:style.backgroundColor',
				displayedUsedText:'usedText:html',
				displayedRemainingText:'remainingText:html'
			}
		});
	}
});

