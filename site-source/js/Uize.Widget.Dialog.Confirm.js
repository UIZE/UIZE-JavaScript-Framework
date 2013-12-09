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

		/*** Private Instance Methods ***/
			function _updateUiState (m) {
				m.isWired &&
					m.setNodeProperties (
						'icon',
						{className:'dialogIcon dialog' + Uize.capFirstChar (m._state) + 'Icon'}
					)
				;
			}

			function _updateUiMessage (m) {
				m.isWired && m._message != null && m.setNodeInnerHtml ('message',m._message);
			}

			function _updateUiMode (m) {
				m.isWired && m.children.cancel.showNode ('',!m._mode.indexOf ('confirm'));
			}

		return _superclass.subclass ({
			omegastructor:function () {
				var m = this;

				/*** add event handlers ***/
					function _handleConfirm(_event) { m.handleConfirm(_event) }
					m.wire ({
						Ok:_handleConfirm,
						Cancel:_handleConfirm,
						Close:_handleConfirm
					});
			},

			instanceMethods:{
				handleConfirm:function (_event) {
					this.fire ({name:'Submission Complete',result:_event.name == 'Ok'});
				},

				updateUi:function () {
					var m = this;
					_updateUiState (m);
					_updateUiMessage (m);
					_updateUiMode (m);
					_superclass.doMy (m,'updateUi');
				}
			},

			stateProperties:{
				_message:{
					name:'message',
					onChange:function () {_updateUiMessage (this)},
					value:''
				},
				_mode:{
					name:'mode',
					onChange:function () {
						var m = this;
						m._mode.indexOf ('Custom') < 0 &&
							m.set ({defaultTitle:m.localize (m._mode == 'confirm' ? 'confirm' : 'attention')})
						;
						_updateUiMode (m);
					},
					value:'confirm'
				},
				_state:{
					name:'state',
					onChange:function () {_updateUiState (this)},
					value:'info'
					/* NOTES: states that are supported
						- info (eg. "i" in blue circle)
						- warning (eg. "!" in orange triangle)
						- error (eg. "!" in red triangle, or "x" in red circle)
						- confirm (eg. "?" in gray speech bubble)
						- success (eg. green check mark, or check mark in a circle)
					*/
				}
			}
		});
	}
});

