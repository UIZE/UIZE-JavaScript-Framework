/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Dialog.Confirm
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2008-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 6
	codeCompleteness: 100
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Widget.Dialog.Confirm= class implements a confirmation dialog that can be used by the =confirm= and =inform= methods of the =Uize.Widget= class.

		*DEVELOPERS:* `Chris van Rensburg`, original code donated by `Zazzle Inc.`
*/

Uize.module ({
	name:'Uize.Widget.Dialog.Confirm',
	builder:function (_superclass) {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_false = false,
				_true = true
			;

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					null,
					function () {
						var _this = this;

						/*** add event handlers ***/
							function _submitDialog (_result) {_this.fire ({name:'Submission Complete',result:_result})}
							_this.wire ({
								Ok:function () {_submitDialog (_true)},
								Cancel:function () {_submitDialog (_false)},
								Close:function () {_submitDialog (_false)}
							});
					}
				),
				_classPrototype = _class.prototype
			;

		/*** Private Instance Methods ***/
			_classPrototype._updateUiState = function () {
				this.isWired &&
					this.setNodeProperties (
						'icon',
						{className:'dialogIcon dialog' + Uize.capFirstChar (this._state) + 'Icon'}
					)
				;
			};

			_classPrototype._updateUiMessage = function () {
				this.isWired && this._message != null && this.setNodeInnerHtml ('message',this._message)
			};

			_classPrototype._updateUiMode = function () {
				this.isWired && this.children.cancel.showNode ('',!this._mode.indexOf ('confirm'))
			};

		/*** Public Instance Methods ***/
			_classPrototype.updateUi = function () {
				this._updateUiState ();
				this._updateUiMessage ();
				this._updateUiMode ();
				_superclass.prototype.updateUi.call (this);
			};

		/*** State Properties ***/
			_class.stateProperties ({
				_message:{
					name:'message',
					onChange:_classPrototype._updateUiMessage,
					value:''
				},
				_mode:{
					name:'mode',
					onChange:function () {
						this._mode.indexOf ('Custom') < 0 &&
							this.set ({defaultTitle:this.localize (this._mode == 'confirm' ? 'confirm' : 'attention')})
						;
						this._updateUiMode ();
					},
					value:'confirm'
				},
				_state:{
					name:'state',
					onChange:_classPrototype._updateUiState,
					value:'info'
					/* NOTES: states that are supported
						- info (eg. "i" in blue circle)
						- warning (eg. "!" in orange triangle)
						- error (eg. "!" in red triangle, or "x" in red circle)
						- confirm (eg. "?" in gray speech bubble)
						- success (eg. green check mark, or check mark in a circle)
					*/
				}
			});

		return _class;
	}
});

