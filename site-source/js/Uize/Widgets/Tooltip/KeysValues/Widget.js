/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.Tooltip.KeysValues.Widget Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013-2016 UIZE
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
		The =Uize.Widgets.Tooltip.KeysValues.Widget= module implements a widget class.

		*DEVELOPERS:* `Chris van Rensburg`

		Visual Sampler
			Below is a visual sampler of the =Uize.Widgets.Tooltip.KeysValues.Widget= class...

			..........................................................
			<< widget >>

			widgetClass: Uize.Widgets.Tooltip.KeysValues.VisualSampler
			..........................................................
*/

Uize.module ({
	name:'Uize.Widgets.Tooltip.KeysValues.Widget',
	superclass:'Uize.Widgets.Tooltip.Widget',
	required:'Uize.Widgets.Tooltip.KeysValues.Css',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			stateProperties:{
				_data:'data',
				body:{
					derived:{
						properties:'data',
						derivation:function (_data) {
							var
								m = this,
								_bodyChunks = []
							;
							if (_data) {
								_bodyChunks.push ('<table class="' + m.cssClass ('table') + '" cellspacing="1">');
								var
									_keyCssClass = m.cssClass ('tableKey'),
									_valueCssClass = m.cssClass ('tableValue')
								;
								for (var _key in _data)
									_bodyChunks.push (
										'<tr valign="top">' +
											'<td class="' + _keyCssClass + '">' + _key + '</td>' +
											'<td class="' + _valueCssClass + '">' + _data [_key] + '</td>' +
										'</tr>'
									)
								;
								_bodyChunks.push ('</table>');
							}
							return _bodyChunks.join ('');
						}
					}
				}
			},

			staticProperties:{
				cssModule:Uize.Widgets.Tooltip.KeysValues.Css
			}
		});
	}
});

