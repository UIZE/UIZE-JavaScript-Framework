/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.TextInputBasic Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2007-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 4
	codeCompleteness: 100
	docCompleteness: 6
*/

/*?
	Introduction
		The =Uize.Widget.TextInputBasic= class provides an interface for entering text, with support for min and max length, validation with warning tips, and more.

		*DEVELOPERS:* `Tim Carter`, `Ben Ilegbodu`, `Chris van Rensburg`, `Irena Pashchenko`
*/

Uize.module ({
	name:'Uize.Widget.TextInputBasic',
	required:'Uize.Dom.Event',
	builder:function (_superclass) {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_true = true,
				_false = false,
				_undefined,
				_Uize_Dom_Event = Uize.Dom.Event
		;

		return _superclass.subclass ({
			instanceMethods:{
				blur:function () {
					this._inputNode && this._inputNode.blur ()
					/*?
						Instance Methods
							blur
								Blur the =input= DOM node of the instance.

								SYNTAX
								....................
								myTextInput.blur ();
								....................

								NOTES
								- see the companion =focus= instance method
					*/
				},

				focus:function () {
					this._inputNode && this._inputNode.focus ()
					/*?
						Instance Methods
							focus
								Focuses the =input= DOM node of the instance.

								SYNTAX
								.....................
								myTextInput.focus ();
								.....................

								NOTES
								- see the companion =blur= instance method
					*/
				},

				updateUi:function () {
					var
						m = this,
						_inputNode = m._inputNode
					;
					if (m.isWired && _inputNode) {
						_inputNode.disabled = !m.get('enabled');

						if (_inputNode.value != m._value)
							_inputNode.value = m._value
						;
					}
				},

				wireUi:function () {
					var m = this;
					if (!m.isWired) {
						m._inputNode = m.getNode ('input');

						if (m._inputNode) {
							m._inputNodeIsInputTag = m._inputNode.tagName == 'INPUT';

							m.wireNode (
								m._inputNode,
								{
									keydown:function (_domEvent) {
										if (
											m._inputNodeIsInputTag &&
											_Uize_Dom_Event.isKeyEnter (_domEvent) &&
											m.fire ({name:'Ok',domEvent:_domEvent}).cancelSubmit
										) {
											var _inputNodeForm = m._inputNode.form;
											if (_inputNodeForm) {
												m._storedFormOnsubmit = _inputNodeForm.onsubmit;
												m._blockedFormSubmit = _true;
												_inputNodeForm.onsubmit = Uize.returnFalse;
											}
										}
									},
									keypress:function (_domEvent) {
										m._keyAborted = m.fire ({name:'Key Press',domEvent:_domEvent}).abort &&
											_Uize_Dom_Event.abort (_domEvent)
										;
									},
									keyup:function (_domEvent) {
										if (m._keyAborted) {
											m._keyAborted = _false;
										} else {
											if (m._blockedFormSubmit) {
												m._inputNode.form.onsubmit = m._storedFormOnsubmit;
												m._storedFormOnsubmit = m._blockedFormSubmit = _undefined;
											}
											_Uize_Dom_Event.isKeyEscape (_domEvent) &&
												m.fire ({name:'Cancel',domEvent:_domEvent})
											;
											m.set ({_value:m._inputNode.value});
											m.updateUi (); // the conformer might result in the value not being the current text
										}
										m.fire ({name:'Key Up',domEvent:_domEvent});
									},
									blur:function () {
										m._currentNodeEventIsBlur = _true;
										m.set ({_value:m._inputNode.value}); // catch any last values that might have been missed by blurring
										m.set ({_inFocus:_false});
										m.fire('Blur');
										m._currentNodeEventIsBlur = _false;
									},
									focus:function () {
										m._inputNode.value && m.set({_value:m._inputNode.value});
										m.set ({_inFocus:_true});
										m.fire('Focus');
									}
								}
							);
						}

						_superclass.doMy (m,'wireUi');
					}
				}
			},

			stateProperties:{
				_inFocus:{
					name:'inFocus',
					value:_false
				},
				_maxLength:{
					name:'maxLength',
					value:Infinity
				},
				_minLength:{
					name:'minLength',
					value:0
				},
				_value:{
					name:'value',
					conformer:function (_value) {
						var
							m = this,
							_maxLength = m._maxLength
						;
						_value += '';
						if (m._filterType == 'LAN' && /[^a-z0-9]/.test (_value))
							_value = _value.toLowerCase ().replace(/[^a-z0-9]/g,'')
						;
						if (_value.length > _maxLength)
							_value = _value.slice (0,_maxLength)
						;
						return _value;
					},
					onChange:'updateUi',
					value:''
				},
				_filterType:'filterType'
					/***
					LAN - lowerAlphaNumeric
					***/
			}
		});
	}
});

