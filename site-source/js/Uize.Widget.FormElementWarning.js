/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.FormElementWarning Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2012 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 5
	codeCompleteness: 80
	testCompleteness: 0
	docCompleteness: 0
*/

/*?
	Introduction
		The =Uize.Widget.FormElementWarning= widget provides functionality for displaying a warning/error message for a form element

		*DEVELOPERS:* `Ben Ilegbodu`
*/

Uize.module ({
	name:'Uize.Widget.FormElementWarning',
	required:'Uize.Node.Classes',
	builder:function(_superclass) {
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
			_classPrototype._updateUiFocused = function() {
				var _this = this;

				_this.isWired
					&& Uize.Node.Classes.setState(
						_this.getNode(),
						['', _this._cssClassFocused],
						_this._focused
					)
				;
			};

			_classPrototype._updateUiMessage = function() {
				this.isWired && this.setNodeInnerHtml('text', this._getMessage())
			};

			_classPrototype._updateUiShown = function() {
				this.isWired && this.displayNode('', this._shown)
			};


		/*** Public Instance Methods ***/
			_classPrototype.getMessage = _classPrototype._getMessage = function() {
				var _message = this._message;
				return Uize.isFunction (_message) ? _message() : _message;
			};

			_classPrototype.updateUi = function() {
				var _this = this;

				if (_this.isWired) {
					_this._updateUiMessage();
					_this._updateUiShown();
					_this._updateUiFocused();

					_superclass.prototype.updateUi.call (_this);
				}
			};

			_classPrototype.wireUi = function () {
				var _this = this;

				if (!_this.isWired) {
					var _focus = function (_focused) { _this.set({ _focused: _focused }) };

					_this.wireNode (
						'',
						{
							mouseover:function() { _focus(_true) },
							mouseout:function() { _focus(_false) }
						}
					);

					_this._message == null
						&& _this.set({_message:_this.getNodeValue('text')})
					;

					_superclass.prototype.wireUi.call (_this);
				}
			};

		/*** State Properties ***/
			_class.stateProperties({
				_cssClassFocused:'cssClassFocused',
				_focused:{
					name:'focused',
					onChange:_classPrototype._updateUiFocused,
					value:_false
				},
				_message:{
					name:'message',
					onChange:_classPrototype._updateUiMessage
				},
				_shown:{
					name:'shown',
					onChange:_classPrototype._updateUiShown,
					value:_false
				}
			});

		return _class;
	}
});
