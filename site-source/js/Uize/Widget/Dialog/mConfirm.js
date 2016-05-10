/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Dialog.mConfirm Mixin
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Mixin
	importance: 6
	codeCompleteness: 2
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Widget.Dialog.mConfirm= mixin module implements features to facilitate the creation of confirm dialogs (dialog subclasses).

		*DEVELOPERS:* `Rachel Lopatin`
*/

Uize.module ({
	name: 'Uize.Widget.Dialog.mConfirm',
	required: 'Uize.Widget.Form',
	builder:function () {
		'use strict';

		/*** Private Instance Methods ***/
		function _updateUiState (m) {
			m.isWired &&
				m.setNodeProperties (
					'icon',
					{className:'dialogIcon dialog' + Uize.capFirstChar (m.state) + 'Icon'}
				)
			;
		}

		function _updateUiMessage (m) {
			m.isWired && m.message != null && m.setNodeInnerHtml ('message',m.message);
		}

		function _updateUiMode (m) {
			m.isWired && m.children.cancel.showNode ('',!m.mode.indexOf ('confirm'));
		}

		return function (_class) {
			_class.declare({
				omegastructor: function () {
					var m = this;

					/*** add event handlers ***/
					function _handleConfirm(_event) { m.handleConfirm(_event) }
					m.wire({
						Ok: _handleConfirm,
						Cancel: _handleConfirm,
						Close: _handleConfirm
					});
				},

				instanceMethods: {
					handleConfirm: function (_event) {
						this.fire({ name: 'Submission Complete', result: _event.name == 'Ok' });
					},

					updateUi: function () {
						var m = this;
						_updateUiState(m);
						_updateUiMessage(m);
						_updateUiMode(m);
						_class.superclass.doMy(m, 'updateUi');
					}
				},

				stateProperties: {
					message: {
						name: 'message',
						onChange: function () { _updateUiMessage(this) },
						value: ''
					},
					mode: {
						name: 'mode',
						onChange: function () {
							var m = this;
							m.mode.indexOf('Custom') < 0 &&
								m.set({ defaultTitle: m.localize(m.mode == 'confirm' ? 'confirm' : 'attention') })
							;
							_updateUiMode(m);
						},
						value: 'confirm'
					},
					state: {
						name: 'state',
						onChange: function () { _updateUiState(this) },
						value: 'info'
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
		};
		
	}
});

