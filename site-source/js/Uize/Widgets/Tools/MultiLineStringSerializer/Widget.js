/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.Tools.MultiLineStringSerializer.Widget Class
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
		The =Uize.Widgets.Tools.MultiLineStringSerializer.Widget= module implements a widget class.

		*DEVELOPERS:* `Chris van Rensburg`

		Visual Sampler
			Below is a visual sampler of the =Uize.Widgets.Tools.MultiLineStringSerializer.Widget= class...

			.......................................................................
			<< widget >>

			widgetClass: Uize.Widgets.Tools.MultiLineStringSerializer.VisualSampler
			.......................................................................
*/

Uize.module ({
	name:'Uize.Widgets.Tools.MultiLineStringSerializer.Widget',
	superclass:'Uize.Widget.V2',
	required:[
		'Uize.Widgets.Tools.MultiLineStringSerializer.Html',
		'Uize.Widgets.Tools.MultiLineStringSerializer.Css',
		'Uize.Widgets.Form.Input.Select.Widget',
		'Uize.Widgets.Tools.SourceVsResult.Widget',
		'Uize.Json.MultiLineStringLiteral'
	],
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			hasLoc:true,

			set:{
				html:Uize.Widgets.Tools.MultiLineStringSerializer.Html
			},

			staticProperties:{
				cssModule:Uize.Widgets.Tools.MultiLineStringSerializer.Css
			},

			stateProperties:{
				source:{value:''},
				result:{
					value:'',
					onChange:function () {
						var m = this;
						if (!m._updatingSourceOrResult) {
							m._updatingSourceOrResult = true;
							try {
								m.set ({source:Uize.laxEval ('(' + m.result + ')')});
							} catch (_error) {
								// do nothing
							}
							m._updatingSourceOrResult = false;
						}
					}
				},
				quoteChar:{value:'\''},

				/*** derived properties ***/
					sourceSerialized:{
						derived:{
							properties:['source','quoteChar'],
							derivation:function (_source,_quoteChar) {
								return Uize.Json.MultiLineStringLiteral.serialize (_source,{quoteChar:_quoteChar});
							}
						},
						onChange:function () {
							var m = this;
							if (!m._updatingSourceOrResult) {
								m._updatingSourceOrResult = true;
								m.set ({result:m.sourceSerialized});
								m._updatingSourceOrResult = false;
							}
						}
					}
			},

			children:{
				quoteChar:{
					widgetClass:Uize.Widgets.Form.Input.Select.Widget,
					values:[
						{name:'\''},
						{name:'"'}
					]
				},
				sourceVsResult:{
					widgetClass:Uize.Widgets.Tools.SourceVsResult.Widget,
					twoWay:true
				}
			},

			childBindings:{
				loc_sourceViewButtonLabel:'->sourceVsResult.sourceViewButtonLabel',
				loc_resultViewButtonLabel:'->sourceVsResult.resultViewButtonLabel',
				quoteChar:'quoteChar.value',
				source:'sourceVsResult.source',
				result:'sourceVsResult.result'
			},

			htmlBindings:{
				loc_quoteCharLabel:'quoteCharLabel'
			}
		});
	}
});

