/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.Tools.PseudoLocalizer.Widget Class
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
		'Uize.Widgets.Button.Toggle.OnOff.Widget',
		'Uize.Widgets.Slider.Widget',
		'Uize.Widgets.Form.Input.Text.Widget',
		'Uize.Widgets.Tools.SourceVsResult.Widget',
		'Uize.Loc.Pseudo',
		'Uize.Util.RegExpComposition'
	],
	builder:function (_superclass) {
		'use strict';

		var
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
				accenting:{value:true},
				wrapper:{value:'[]'},
				expansion:{value:1.3},
				expansionChar:{value:'_'},

				/*** derived properties ***/
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
					}
			},

			children:{
				accenting:{widgetClass:Uize.Widgets.Button.Toggle.OnOff.Widget},
				wrapper:{widgetClass:Uize.Widgets.Form.Input.Text.Widget},
				expansion:{
					widgetClass:Uize.Widgets.Slider.Widget,
					minValue:1,
					maxValue:2,
					increments:0,
					orientation:'horizontal'
				},
				expansionChar:{widgetClass:Uize.Widgets.Form.Input.Text.Widget},
				sourceVsResult:{widgetClass:Uize.Widgets.Tools.SourceVsResult.Widget}
			},

			childBindings:{
				loc_sourceViewButtonLabel:'->sourceVsResult.sourceViewButtonLabel',
				loc_resultViewButtonLabel:'->sourceVsResult.resultViewButtonLabel',
				source:'sourceVsResult.source',
				result:'->sourceVsResult.result',
				accenting:'accenting.value',
				wrapper:'wrapper.value',
				expansion:'expansion.value',
				expansionChar:'expansionChar.value'
			},

			htmlBindings:{
				loc_accentingLabel:'accentingLabel',
				loc_wrapperLabel:'wrapperLabel',
				loc_expansionLabel:'expansionLabel',
				loc_expansionCharLabel:'expansionCharLabel'
			}
		});
	}
});

