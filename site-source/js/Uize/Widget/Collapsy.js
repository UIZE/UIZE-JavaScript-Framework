/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Collapsy Class
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
	docCompleteness: 0
*/

/*?
	Introduction
		The =Uize.Widget.Collapsy= widget provides functionality surrounding showing status messages (like a form warning) in both a collapsed and expanded state.

		*DEVELOPERS:* `Ben Ilegbodu`, `Tim Carter`, original code contributed by `Zazzle Inc.`
*/

Uize.module ({
	name:'Uize.Widget.Collapsy',
	required:'Uize.Dom.Classes',
	builder:function (_superclass) {
		'use strict';

		/*** Utility Functions ***/
			function _resolveMessage (_message) {
				return Uize.isFunction (_message) ? _message() : _message;
			}

		/*** Private Instance Methods ***/
			function _updateUi () {
				var m = this;

				if (m.isWired) {
					var _shown = m._shown;

					m.setNodeStyle('', {display:_shown ? 'inline' : 'none'});

					if (_shown) {
						m.setNodeInnerHtml('text', _resolveMessage(m._collapsed ? m._collapsedMessage : m._expandedMessage));
						Uize.Dom.Classes.setState(
							m.getNode(),
							[m._expandedClass, m._collapsedClass],
							m._collapsed
						);
					}
				}
			}

		return _superclass.subclass ({
			instanceMethods:{
				getCollapsedMessage:function () { return _resolveMessage(this._collapsedMessage) },

				getExpandedMessage:function () { return _resolveMessage(this._expandedMessage) },

				updateUi:function () {
					_updateUi.call (this);
					_superclass.doMy (this,'updateUi');
				},

				wireUi:function () {
					var m = this;

					if (!m.isWired) {
						var _collapse = function (_collapsed) { m.set({_collapsed:_collapsed}) };

						m.wireNode (
							'',
							{
								mouseover:function () { _collapse(false) },
								mouseout:function () { _collapse(true) }
							}
						);

						_superclass.doMy (m,'wireUi');
					}
				}
			},

			stateProperties:{
				_collapsed:{
					name:'collapsed',
					onChange:_updateUi,
					value:true
				},
				_collapsedClass:{
					name:'collapsedClass',
					onChange:_updateUi
				},
				_collapsedMessage:{
					name:'collapsedMessage',
					onChange:_updateUi,
					value:''
				},
				_expandedClass:{
					name:'expandedClass',
					onChange:_updateUi
				},
				_expandedMessage:{
					name:'expandedMessage',
					onChange:_updateUi
				},
				_shown:{
					name:'shown',
					onChange:_updateUi,
					value:false
				}
			}
		});
	}
});
