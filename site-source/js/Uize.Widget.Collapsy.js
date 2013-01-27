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

		*DEVELOPERS:* `Ben Ilegbodu`, `Tim Carter`
*/

Uize.module ({
	name:'Uize.Widget.Collapsy',
	required:'Uize.Node.Classes',
	builder:function(_superclass) {
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
			_classPrototype._updateUi = function() {
				var _this = this;

				if (_this.isWired) {
					var _shown = _this._shown;

					_this.setNodeStyle('', {display:_shown ? 'inline' : 'none'});

					if (_shown) {
						_this.setNodeInnerHtml('text', _this._getMessage(_this._collapsed ? _this._collapsedMessage : _this._expandedMessage));
						Uize.Node.Classes.setState(
							_this.getNode(''),
							[_this._expandedClass, _this._collapsedClass],
							_this._collapsed
						);
					}
				}
			};

		/*** Private Instance Methods ***/
			_classPrototype._getMessage = function(_message) {
				return Uize.isFunction (_message) ? _message() : _message;
			};

		/*** Public Instance Methods ***/
			_classPrototype.getCollapsedMessage = function() { return this._getMessage(this._collapsedMessage) };

			_classPrototype.getExpandedMessage = function() { return this._getMessage(this._expandedMessage) };

			_classPrototype.updateUi = function() {
				this._updateUi();
				_superclass.prototype.updateUi.call (this);
			};

			_classPrototype.wireUi = function () {
				var _this = this;

				if (!_this.isWired) {
					var _collapse = function (_collapsed) { _this.set({_collapsed:_collapsed}) };

					_this.wireNode (
						'',
						{
							mouseover:function() { _collapse(_false) },
							mouseout:function() { _collapse(_true) }
						}
					);

					_superclass.prototype.wireUi.call (_this);
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
