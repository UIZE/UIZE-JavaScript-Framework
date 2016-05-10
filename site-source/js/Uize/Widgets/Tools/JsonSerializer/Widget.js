/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.Tools.JsonSerializer.Widget Class
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
		The =Uize.Widgets.Tools.JsonSerializer.Widget= module implements a widget class for a JSON serializer tool.

		*DEVELOPERS:* `Chris van Rensburg`

		Visual Sampler
			Below is a visual sampler of the =Uize.Widgets.Tools.JsonSerializer.Widget= class...

			............................................................
			<< widget >>

			widgetClass: Uize.Widgets.Tools.JsonSerializer.VisualSampler
			............................................................
*/

Uize.module ({
	name:'Uize.Widgets.Tools.JsonSerializer.Widget',
	superclass:'Uize.Widget.V2',
	required:[
		'Uize.Widgets.Tools.JsonSerializer.Html',
		'Uize.Widgets.Tools.JsonSerializer.Css',
		'Uize.Widgets.Form.Input.Text.Widget',
		'Uize.Widgets.Button.Widget',
		'Uize.Widgets.Button.Toggle.OnOff.Widget',
		'Uize.Widgets.Form.Input.Select.Widget',
		'Uize.Widgets.Tools.SourceVsResult.Widget',
		'Uize.Json'
	],
	builder:function (_superclass) {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_onOffTogglerWidgetProperties = {widgetClass:Uize.Widgets.Button.Toggle.OnOff.Widget}
		;

		return _superclass.subclass ({
			hasLoc:true,

			set:{
				html:Uize.Widgets.Tools.JsonSerializer.Html
			},

			staticProperties:{
				cssModule:Uize.Widgets.Tools.JsonSerializer.Css
			},

			stateProperties:{
				source:{value:''},
				indentChars:{value:'\t'},
				linebreakChars:{value:'\n'},
				quoteChar:{value:'\''},
				keyDelimiter:{value:':'},
				padKeys:{value:false},
				keyAlign:{value:'left'},
				sortKeys:{value:false},
				whenToQuoteKeys:{value:'auto'},

				/*** derived properties ***/
					result:{
						derived:{
							properties:[
								'source',
								'indentChars',
								'linebreakChars',
								'quoteChar',
								'keyDelimiter',
								'padKeys',
								'keyAlign',
								'whenToQuoteKeys',
								'sortKeys'
							],
							derivation:function (
								_source,
								_indentChars,
								_linebreakChars,
								_quoteChar,
								_keyDelimiter,
								_padKeys,
								_keyAlign,
								_whenToQuoteKeys,
								_sortKeys
							) {
								try {
									return (
										_source === ''
											? ''
											: Uize.Json.to (
												Uize.Json.from (_source),
												{
													indentChars:_indentChars,
													linebreakChars:_linebreakChars,
													quoteChar:_quoteChar,
													keyDelimiter:_keyDelimiter,
													padKeys:_padKeys,
													keyAlign:_keyAlign,
													whenToQuoteKeys:_whenToQuoteKeys,
													sortKeys:_sortKeys
												}
											)
									);
								} catch (_error) {
									// do nothing
								}
							}
						}
					}
			},

			children:{
				presetPretty:{
					widgetClass:Uize.Widgets.Button.Widget,
					action:function () {
						this.parent.set ({
							indentChars:'   ',
							linebreakChars:'\n',
							quoteChar:'\'',
							keyDelimiter:': ',
							padKeys:false,
							keyAlign:'left',
							whenToQuoteKeys:'auto',
							sortKeys:false
						});
					}
				},
				presetCompact:{
					widgetClass:Uize.Widgets.Button.Widget,
					action:function () {
						this.parent.set ({
							indentChars:'',
							linebreakChars:'',
							quoteChar:'\'',
							keyDelimiter:':',
							padKeys:false,
							keyAlign:'left',
							whenToQuoteKeys:'auto',
							sortKeys:false
						});
					}
				},
				presetPaddedAndSorted:{
					widgetClass:Uize.Widgets.Button.Widget,
					action:function () {
						this.parent.set ({
							indentChars:'   ',
							linebreakChars:'\n',
							quoteChar:'\'',
							keyDelimiter:' : ',
							padKeys:true,
							keyAlign:'left',
							whenToQuoteKeys:'auto all',
							sortKeys:true
						});
					}
				},
				indentChars:{widgetClass:Uize.Widgets.Form.Input.Text.Widget},
				quoteChar:{
					widgetClass:Uize.Widgets.Form.Input.Select.Widget,
					values:[
						{name:'\''},
						{name:'"'}
					]
				},
				keyDelimiter:{widgetClass:Uize.Widgets.Form.Input.Text.Widget},
				padKeys:_onOffTogglerWidgetProperties,
				keyAlign:{
					widgetClass:Uize.Widgets.Form.Input.Select.Widget,
					values:[
						{name:'left'},
						{name:'center'},
						{name:'right'}
					]
				},
				whenToQuoteKeys:{
					widgetClass:Uize.Widgets.Form.Input.Select.Widget,
					values:[
						{name:'auto'},
						{name:'auto all'},
						{name:'always'}
					]
				},
				sortKeys:_onOffTogglerWidgetProperties,
				sourceVsResult:{widgetClass:Uize.Widgets.Tools.SourceVsResult.Widget}
			},

			eventBindings:{
				'#linebreakChars:keyup':function (_event) {
					this.set ({linebreakChars:_event.target.value});
				}
			},

			childBindings:{
				loc_presetPretty:'->presetPretty.text',
				loc_presetCompact:'->presetCompact.text',
				loc_presetPaddedAndSorted:'->presetPaddedAndSorted.text',
				indentChars:'indentChars.value',
				quoteChar:'quoteChar.value',
				keyDelimiter:'keyDelimiter.value',
				padKeys:'padKeys.value',
				keyAlign:'keyAlign.value',
				whenToQuoteKeys:'whenToQuoteKeys.value',
				sortKeys:'sortKeys.value',
				loc_sourceViewButtonLabel:'->sourceVsResult.sourceViewButtonLabel',
				loc_resultViewButtonLabel:'->sourceVsResult.resultViewButtonLabel',
				source:'sourceVsResult.source',
				result:'->sourceVsResult.result'
			},

			htmlBindings:{
				loc_presetsLabel:'presetsLabel',
				loc_indentCharsLabel:'indentCharsLabel',
				loc_linebreakCharsLabel:'linebreakCharsLabel',
				linebreakChars:'linebreakChars',
				loc_quoteCharLabel:'quoteCharLabel',
				quoteChar:'quoteChar',
				loc_keyDelimiterLabel:'keyDelimiterLabel',
				loc_padKeysLabel:'padKeysLabel',
				loc_keyAlignLabel:'keyAlignLabel',
				loc_whenToQuoteKeysLabel:'whenToQuoteKeysLabel',
				loc_sortKeysLabel:'sortKeysLabel'
			}
		});
	}
});

