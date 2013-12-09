/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.FormWarnings Class
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
		The =Uize.Widget.FormWarnings= widget provides functionality for displaying warnings for a =Uize.Widget.Form=.

		*DEVELOPERS:* `Ben Ilegbodu`, `Tim Carter`
*/

Uize.module ({
	name:'Uize.Widget.FormWarnings',
	required:'Uize.Template',	// for the JST
	builder:function (_superclass) {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_false = false
			;
			
		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					function() {
						this._wiringsLookup = {};
						this._watchedElements = [];
					}
				),
				_classPrototype = _class.prototype
			;

		/*** Private Instance Methods ***/
			_classPrototype._removeWatchedElements = function (_elementsToRemove) {
				var
					_this = this,
					_watchedElements = _this._watchedElements
				;
				
				if (_watchedElements && _watchedElements.length) {
					if (!_elementsToRemove)	// remove all
						_elementsToRemove = _watchedElements;
					
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
								_this._wiringsLookup[_watchedElementIdPrefix]
							)
						;
					}
				}
			};
			
			_classPrototype._updateUiCollapsed = function() {
				var
					_this = this,
					_collapsed = _this._collapsed
				;
				
				if (_this.isWired) {
					_this.setNodeInnerHtml(
						'toggleCollapsed',
						_this.localize(_collapsed ? 'showLinkText' : 'hideLinkText')
					);
					_this.displayNode('warnings', !_collapsed);
				}
			};
			
			_classPrototype._updateUiWarnings = function() {
				var _this = this;
				
				if (_this.isWired && _this._template) {
					var
						_warningElements = [],
						_messageNo = 0
					;

					// go through all of the message nodes and unwire them
					while (true) {
						var
							_messageNodeName = 'message' + _messageNo,
							_messageNode = _this.getNode(_messageNodeName)
						;

						_this.flushNodeCache(_messageNodeName);

						if (_messageNode)
							_this.unwireNode(_messageNode, 'click');
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
					}) (_this._watchedElements);
					
					_this.setNodeInnerHtml(
						'warnings',
						_this._template({warningElements:_warningElements})
					);

					Uize.forEach(
						_warningElements,
						function (_warningElement, _elementNo) {
							function _focus(_focused) { _warningElement.set({focused:_focused}) }
							
							_this.wireNode(
								'message' + _elementNo,
								{
									mouseover:function() { _focus(true) },
									mouseout:function() { _focus(_false) }
								}
							);
						}
					);
				}
			};
			
			_classPrototype._wireWatchedElement = function (_watchedElement) {
				var _this = this;

				function _updateUiWarnings() { _this._updateUiWarnings() }
				
				var _wirings = {
					'Changed.warningShown':_updateUiWarnings,
					'Changed.warningMessage':_updateUiWarnings
				};

				// NOTE: This needs to be optimized such that we're not updating the UI over and over
				// again even though the warning messages haven't changed.
				_watchedElement.wire(_wirings);
				
				_this._wiringsLookup[_watchedElement.get('idPrefix')] = _wirings;
			};

		/*** Public Instance Methods ***/
			_classPrototype.addWatchedElements = function (_elementsToWatch) {
				var
					_this = this,
					_watchedElements = _this._watchedElements || [],
					_elementsToWatchList = Uize.isArray(_elementsToWatch) ? _elementsToWatch : [_elementsToWatch],
					_elementsToWatchLength = _elementsToWatchList.length,
					_elementNo = -1
				;

				for (; ++_elementNo < _elementsToWatchLength;) {
					var _watchedElement = _elementsToWatchList[_elementNo];

					_watchedElements.push(_watchedElement);
					_this._wireWatchedElement(_watchedElement);
				}

				_this._watchedElements = _watchedElements;
				_this.fire('Changed.watchedElements');
			};
		
			_classPrototype.updateUi = function () {
				var _this = this;

				if (_this.isWired) {
					_this._updateUiWarnings();
					_this._updateUiCollapsed();
					
					_superclass.doMy (_this,'updateUi');
				}
			};

			_classPrototype.wireUi = function () {
				var _this = this;

				if (!_this.isWired) {
					var _templateNode = _this.getNode('template');
					
					if (_templateNode)
						_this._template = Uize.Template.compile(
							_templateNode.innerHTML,
							{
								openerToken:'[%',
								closerToken:'%]'
							}
						)
					;
					
					_this.wireNode('toggleCollapsed', 'click', function() { _this.toggle('collapsed') } );

					_superclass.doMy (_this,'wireUi');
				}
			};

		/*** State Properties ***/
			_class.stateProperties({
				_collapsed:{
					name:'collapsed',
					onChange:_classPrototype._updateUiCollapsed,
					value:_false
				},
				_shown:{
					name:'shown',
					onChange:function () {
						var
							_this = this,
							_shown = _this._shown === true
						;
						if (_this.isWired) {
							_this.displayNode('', _shown);
							_shown && _this._updateUiWarnings();
						}
					},
					value:_false
				},
				_watchedElements:{
					name:'watchedElements',
					conformer:function (_value) {
						// before updating w/ new list, remove the old list
						this._removeWatchedElements(this._watchedElements);

						return _value;
					},
					onChange:function () {
						var _this = this;
						Uize.forEach (
							_this._watchedElements,
							function (_watchedElement) {_this._wireWatchedElement (_watchedElement)}
						);
						_this._updateUiWarnings();
					}
				}
			});

		return _class;
	}
});
