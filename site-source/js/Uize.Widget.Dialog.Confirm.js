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
						var m = this;

						/*** add event handlers ***/
							function _handleConfirm(_event) { m.handleConfirm(_event) }
							m.wire ({
								Ok:_handleConfirm,
								Cancel:_handleConfirm,
								Close:_handleConfirm
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
				var m = this;
				m.isWired && m._message != null && m.setNodeInnerHtml ('message',m._message)
			};

			_classPrototype._updateUiMode = function () {
				this.isWired && this.children.cancel.showNode ('',!this._mode.indexOf ('confirm'))
			};

		/*** Public Instance Methods ***/
			_classPrototype.handleConfirm = function (_event) {
				this.fire ({name:'Submission Complete',result:_event.name == 'Ok'})
			};

			_classPrototype.updateUi = function () {
				var m = this;
				m._updateUiState ();
				m._updateUiMessage ();
				m._updateUiMode ();
				_superclass.doMy (m,'updateUi');
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
						var m = this;
						m._mode.indexOf ('Custom') < 0 &&
							m.set ({defaultTitle:m.localize (m._mode == 'confirm' ? 'confirm' : 'attention')})
						;
						m._updateUiMode ();
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

