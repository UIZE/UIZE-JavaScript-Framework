/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Collapsy Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2013 UIZE
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

		*DEVELOPERS:* `Ben Ilegbodu`, `Tim Carter`, original code donated by `Zazzle Inc.`
*/

Uize.module ({
	name:'Uize.Widget.Collapsy',
	required:'Uize.Node.Classes',
	builder:function (_superclass) {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_true = true,
				_false = false
			;

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (),
				_classPrototype = _class.prototype
			;

		/*** Private Instance Methods ***/
			_classPrototype._updateUi = function () {
				var m = this;

				if (m.isWired) {
					var _shown = m._shown;

					m.setNodeStyle('', {display:_shown ? 'inline' : 'none'});

					if (_shown) {
						m.setNodeInnerHtml('text', m._getMessage(m._collapsed ? m._collapsedMessage : m._expandedMessage));
						Uize.Node.Classes.setState(
							m.getNode(),
							[m._expandedClass, m._collapsedClass],
							m._collapsed
						);
					}
				}
			};

		/*** Private Instance Methods ***/
			_classPrototype._getMessage = function (_message) {
				return Uize.isFunction (_message) ? _message() : _message;
			};

		/*** Public Instance Methods ***/
			_classPrototype.getCollapsedMessage = function () { return this._getMessage(this._collapsedMessage) };

			_classPrototype.getExpandedMessage = function () { return this._getMessage(this._expandedMessage) };

			_classPrototype.updateUi = function () {
				this._updateUi();
				_superclass.doMy (this,'updateUi');
			};

			_classPrototype.wireUi = function () {
				var m = this;

				if (!m.isWired) {
					var _collapse = function (_collapsed) { m.set({_collapsed:_collapsed}) };

					m.wireNode (
						'',
						{
							mouseover:function () { _collapse(_false) },
							mouseout:function () { _collapse(_true) }
						}
					);

					_superclass.doMy (m,'wireUi');
				}
			};

		/*** State Properties ***/
			_class.stateProperties({
				_collapsed:{
					name:'collapsed',
					onChange:_classPrototype._updateUi,
					value:_true
				},
				_collapsedClass:{
					name:'collapsedClass',
					onChange:_classPrototype._updateUi
				},
				_collapsedMessage:{
					name:'collapsedMessage',
					onChange:_classPrototype._updateUi,
					value:''
				},
				_expandedClass:{
					name:'expandedClass',
					onChange:_classPrototype._updateUi
				},
				_expandedMessage:{
					name:'expandedMessage',
					onChange:_classPrototype._updateUi
				},
				_shown:{
					name:'shown',
					onChange:_classPrototype._updateUi,
					value:_false
				}
			});

		return _class;
	}
});
