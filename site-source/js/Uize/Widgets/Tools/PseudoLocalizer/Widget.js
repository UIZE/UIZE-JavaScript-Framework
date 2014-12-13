/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.Tools.PseudoLocalizer.Widget Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 1
	codeCompleteness: 5
	docCompleteness: 5
*/

/*?
	Introduction
		The =Uize.Widgets.Tools.PseudoLocalizer.Widget= module implements a widget class.

		*DEVELOPERS:* `Chris van Rensburg`

		Visual Sampler
			Below is a visual sampler of the =Uize.Widgets.Tools.PseudoLocalizer.Widget= class...

			.............................................................
			<< widget >>

			widgetClass: Uize.Widgets.Tools.PseudoLocalizer.VisualSampler
			.............................................................
*/

Uize.module ({
	name:'Uize.Widgets.Tools.PseudoLocalizer.Widget',
	superclass:'Uize.Widget.V2',
	required:[
		'Uize.Widgets.Tools.PseudoLocalizer.Html',
		'Uize.Widgets.Tools.PseudoLocalizer.Css',
		'Uize.Widgets.Button.Widget',
		'Uize.Widgets.Button.Toggle.OnOff.Widget',
		'Uize.Loc.Pseudo',
		'Uize.Util.RegExpComposition',
		'Uize.Widgets.Slider.Widget'
	],
	builder:function (_superclass) {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_buttonWidgetProperties = {
					widgetClass:Uize.Widgets.Button.Widget,
					allowClickWhenSelected:true
				},

			/*** General Variables ***/
				_wordSplitterRegExpComposition = Uize.Util.RegExpComposition ({
					punctuation:/[\?!\.;,&=\-\(\)\[\]"]/,
					number:/\d+(?:\.\d+)?/,
					whitespace:/\s+/,
					htmlTag:/<(?:.|[\r\n\f])+?>/,
					token:/\{\{[^\}]+\}\}/,
					wordSplitter:/({htmlTag}|{token}|{whitespace}|{punctuation}|{number})/
				}),
				_wordSplitterRegExp = _wordSplitterRegExpComposition.get ('wordSplitter')
		;

		return _superclass.subclass ({
			hasLoc:true,

			set:{
				html:Uize.Widgets.Tools.PseudoLocalizer.Html
			},

			staticProperties:{
				cssModule:Uize.Widgets.Tools.PseudoLocalizer.Css
			},

			stateProperties:{
				source:{value:''},
				result:{
					derived:{
						properties:['source','accenting','wrapper','expansion','expansionChar'],
						derivation:function (_source,_accenting,_wrapper,_expansion,_expansionChar) {
							return Uize.Loc.Pseudo.pseudoLocalize (
								_source,
								{
									accent:_accenting,
									wordSplitter:_wordSplitterRegExp,
									wrapper:_wrapper,
									expansion:_expansion,
									expansionChar:_expansionChar
								}
							);
						}
					}
				},
				accenting:{value:true},
				wrapper:{value:'[]'},
				expansion:{value:1.3},
				expansionChar:{value:'_'},
				sourceViewShown:{value:true},
				resultViewShown:{value:true},

				/*** derived properties ***/
					sourceViewButtonSelected:{
						derived:'sourceViewShown,resultViewShown: sourceViewShown && !resultViewShown'
					},
					resultViewButtonSelected:{
						derived:'sourceViewShown,resultViewShown: resultViewShown && !sourceViewShown'
					},
					splitView:{
						derived:'sourceViewShown,resultViewShown: sourceViewShown && resultViewShown'
					}
			},

			children:{
				sourceViewButton:_buttonWidgetProperties,
				resultViewButton:_buttonWidgetProperties,
				accenting:{widgetClass:Uize.Widgets.Button.Toggle.OnOff.Widget},
				expansion:{
					widgetClass:Uize.Widgets.Slider.Widget,
					minValue:1,
					maxValue:2,
					increments:0,
					orientation:'horizontal'
				}
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
				'#wrapper:keyup':function (_event) {
					this.set ({wrapper:_event.target.value});
				},
				'#expansionChar:keyup':function (_event) {
					this.set ({expansionChar:_event.target.value});
				}
			},

			childBindings:{
				sourceViewButtonSelected:'->sourceViewButton.selected',
				resultViewButtonSelected:'->resultViewButton.selected',
				loc_sourceViewButtonLabel:'->sourceViewButton.text',
				loc_resultViewButtonLabel:'->resultViewButton.text',
				accenting:'accenting.selected',
				expansion:'expansion.value'
			},

			htmlBindings:{
				sourceViewShown:'sourceView:?',
				resultViewShown:'resultView:?',
				source:'source',
				result:'result',
				loc_accentingLabel:'accentingLabel',
				accenting:'accenting',
				loc_wrapperLabel:'wrapperLabel',
				wrapper:'wrapper',
				loc_expansionLabel:'expansionLabel',
				loc_expansionCharLabel:'expansionCharLabel',
				expansionChar:'expansionChar'
			},

			cssBindings:{
				splitView:['','splitView']
			}
		});
	}
});

