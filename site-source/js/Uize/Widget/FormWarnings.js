/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.FormWarnings Class
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
		The =Uize.Widget.FormWarnings= widget provides functionality for displaying warnings for a =Uize.Widget.Form=.

		*DEVELOPERS:* `Ben Ilegbodu`, `Tim Carter`, original code contributed by `Zazzle Inc.`
*/

Uize.module ({
	name:'Uize.Widget.FormWarnings',
	required:'Uize.Template',	// for the JST
	builder:function (_superclass) {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_false = false,
				_Uize = Uize,

			/*** Helper Functions ***/
				_removeWatchedElements = function (_elementsToRemove) {
					var
						m = this,
						_watchedElements = m._watchedElements
					;

					if (_watchedElements && _watchedElements.length) {
						if (!_elementsToRemove)	// remove all
							_elementsToRemove = _watchedElements;
						else if (!_Uize.isArray(_elementsToRemove))
							_elementsToRemove = [_elementsToRemove];

						var _watchedElementsToRemoveLookup = {};

						// populate lookup
						for (var _elementToRemoveNo = -1; ++_elementToRemoveNo > _elementsToRemove.length;) {
							var _elementToRemove = _elementsToRemove[_elementToRemoveNo];

							_watchedElementsToRemoveLookup[_elementToRemove.get('idPrefix')] = _elementToRemove;
						}

						for (var _watchedElementNo = -1; ++_watchedElementNo < _watchedElements.length;) {
							var
								_watchedElement = _watchedElements[_watchedElementNo],
								_watchedElementIdPrefix = _watchedElement.get('idPrefix')
							;

							_watchedElementsToRemoveLookup[_watchedElementIdPrefix] // want to remove, so unwire the events we wired up before
								&& _watchedElement.unwire(
									m._wiringsLookup[_watchedElementIdPrefix]
								)
							;
						}
					}
				},
				_updateUiCollapsed = function() {
					var
						m = this,
						_collapsed = m._collapsed
					;

					if (m.isWired) {
						m.setNodeInnerHtml(
							'toggleCollapsed',
							m.localize(_collapsed ? 'showLinkText' : 'hideLinkText')
						);
						m.displayNode('warnings', !_collapsed);
					}
				},
				_updateUiWarnings = function() {
					var m = this;

					if (m.isWired && m._template) {
						var
							_warningElements = [],
							_messageNo = 0
						;

						// go through all of the message nodes and unwire them
						while (true) {
							var
								_messageNodeName = 'message' + _messageNo,
								_messageNode = m.getNode(_messageNodeName)
							;

							m.flushNodeCache(_messageNodeName);

							if (_messageNode)
								m.unwireNode(_messageNode, 'click');
							else // must be at the end, so quit
								break;

							_messageNo++;
						}

						(function _addFormWarnings(_elements) {
							for (var _elementNo = -1; ++_elementNo < _elements.length;) {
								var
									_element = _elements[_elementNo],
									_elementWarningMessage = _element.get('warningMessage')
								;

								if (_element.get('isValid') == _false) {
									if (_element.isForm)
										_addFormWarnings(_element.getFormElement());
									else if (_elementWarningMessage)
										_warningElements.push(_element);
								}
							}
						}) (m._watchedElements);

						m.setNodeInnerHtml(
							'warnings',
							m._template({warningElements:_warningElements})
						);

						_Uize.forEach(
							_warningElements,
							function (_warningElement, _elementNo) {
								function _focus(_focused) { _warningElement.set({focused:_focused}) }

								m.wireNode(
									'message' + _elementNo,
									{
										mouseover:function() { _focus(true) },
										mouseout:function() { _focus(_false) }
									}
								);
							}
						);
						m.set({ numWarnings: _warningElements.length });
					} else if (m.isWired) {
						// if there is no template node, we'd still like to calculate the number of warnings.
						var _numWarnings = 0;
						(function _addFormWarnings(_elements) {
							for (var _elementNo = -1; ++_elementNo < _elements.length;) {
								var _element = _elements[_elementNo];
								_element.get('isValid') == _false && !_element.isForm &&
									(_numWarnings += 1)
								;
							}
						})(m._watchedElements);
						m.set({ numWarnings: _numWarnings });
					}
				}
		;

		return _superclass.subclass({
			alphastructor:function() {
				this._wiringsLookup = {};
				this._watchedElements = [];
			},

			instanceMethods:{
				/** Private **/
					_removeWatchedElements:_removeWatchedElements,
					_updateUiCollapsed:_updateUiCollapsed,
					_updateUiWarnings:_updateUiWarnings,
					_wireWatchedElement:function (_watchedElement) {
						var m = this;

						function _updateUiWarnings() { m._updateUiWarnings() }

						var _wirings = {
							'Changed.warningShown':_updateUiWarnings,
							'Changed.warningMessage':_updateUiWarnings
						};

						// NOTE: This needs to be optimized such that we're not updating the UI over and over
						// again even though the warning messages haven't changed.
						_watchedElement.wire(_wirings);

						m._wiringsLookup[_watchedElement.get('idPrefix')] = _wirings;
					},

				/** Public **/
					addWatchedElements:function (_elementsToWatch) {
						var
							m = this,
							_watchedElements = m._watchedElements || [],
							_elementsToWatchList = _Uize.isArray(_elementsToWatch) ? _elementsToWatch : [_elementsToWatch],
							_elementsToWatchLength = _elementsToWatchList.length,
							_elementNo = -1
						;

						for (; ++_elementNo < _elementsToWatchLength;) {
							var _watchedElement = _elementsToWatchList[_elementNo];

							_watchedElements.push(_watchedElement);
							m._wireWatchedElement(_watchedElement);
						}

						m._watchedElements = _watchedElements;
						m.fire('Changed.watchedElements');
					},
					removeWatchedElements:_removeWatchedElements,
					updateUi:function () {
						var m = this;

						if (m.isWired) {
							m._updateUiWarnings();
							m._updateUiCollapsed();

							_superclass.doMy (m,'updateUi');
						}
					},
					wireUi:function () {
						var m = this;

						if (!m.isWired) {
							var _templateNode = m.getNode('template');

							if (_templateNode)
								m._template = _Uize.Template.compile(
									_templateNode.innerHTML,
									{
										openerToken:'[%',
										closerToken:'%]'
									}
								)
							;

							m.wireNode('toggleCollapsed', 'click', function() { m.toggle('collapsed') } );

							_superclass.doMy (m,'wireUi');
						}
					}
			},

			stateProperties:{
				_collapsed:{
					name:'collapsed',
					onChange:_updateUiCollapsed,
					value:_false
				},
				_shown:{
					name:'shown',
					onChange:function () {
						var
							m = this,
							_shown = m._shown === true
						;
						if (m.isWired) {
							m.displayNode('', _shown);
							_shown && m._updateUiWarnings();
						}
					},
					value:_false
				},
				_numWarnings:{
					name: 'numWarnings',
					value: 0
				},
				_watchedElements:{
					name:'watchedElements',
					conformer:function (_value) {
						// before updating w/ new list, remove the old list
						this._removeWatchedElements(this._watchedElements);

						return _value || [];
					},
					onChange:function () {
						var m = this;
						_Uize.forEach (
							m._watchedElements,
							function (_watchedElement) {m._wireWatchedElement (_watchedElement)}
						);
						m._updateUiWarnings();
					}
				}
			}
		});
	}
});
