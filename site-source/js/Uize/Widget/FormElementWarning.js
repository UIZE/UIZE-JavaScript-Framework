/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.FormElementWarning Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 5
	codeCompleteness: 80
	testCompleteness: 0
	docCompleteness: 3
*/

/*?
	Introduction
		The =Uize.Widget.FormElementWarning= widget provides functionality for displaying a warning/error message for a form element

		*DEVELOPERS:* `Ben Ilegbodu`, original code contributed by `Zazzle Inc.`
*/

Uize.module ({
	name:'Uize.Widget.FormElementWarning',
	required:'Uize.Dom.Classes',
	builder:function (_superclass) {
		'use strict';

		/*** Private Instance Methods ***/
			function _updateUiFocused (m) {
				m.isWired
					&& Uize.Dom.Classes.setState(
						m.getNode(),
						['', m._cssClassFocused],
						m._focused
					)
				;
			}

			function _updateUiMessage (m) { m.isWired && m.setNodeInnerHtml('text', m.getMessage()) }

			function _updateUiShown (m) { m.isWired && m.displayNode('', m._shown) }

		return _superclass.subclass ({
			instanceMethods:{
				getMessage:function () {
					var _message = this._message;
					return Uize.isFunction (_message) ? _message() : _message;
				},

				updateUi:function () {
					var m = this;

					if (m.isWired) {
						_updateUiMessage(m);
						_updateUiShown(m);
						_updateUiFocused(m);

						_superclass.doMy (m,'updateUi');
					}
				},

				wireUi:function () {
					var m = this;

					if (!m.isWired) {
						var _focus = function (_focused) { m.set({ _focused: _focused }) };

						m.wireNode (
							'',
							{
								mouseover:function () { _focus(true) },
								mouseout:function () { _focus(false) }
							}
						);

						m._message == null
							&& m.set({_message:m.getNodeValue('text')})
						;

						_superclass.doMy (m,'wireUi');
					}
				}
			},

			stateProperties:{
				_cssClassFocused:'cssClassFocused',
				_focused:{
					name:'focused',
					onChange:function () {_updateUiFocused (this)},
					value:false
				},
				_message:{
					name:'message',
					onChange:function () {_updateUiMessage (this)}
				},
				_shown:{
					name:'shown',
					onChange:function () {_updateUiShown (this)},
					value:false
				}
			}
		});
	}
});
