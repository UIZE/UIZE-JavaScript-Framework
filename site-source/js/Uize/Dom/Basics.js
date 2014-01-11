/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Dom.Basics Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2004-2014 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 9
	codeCompleteness: 95
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Dom.Basics= module provides a very minimal set of methods to ease working with DOM nodes - just the basics that are needed by the =Uize.Widget= class.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Dom.Basics',
	required:'Uize.Event.Bus',
	builder:function () {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_undefined,
				_null = null,
				_true = true,
				_false = false,
				_typeString = 'string',
				_typeObject = 'object',
				_Uize = Uize,
				_copyInto = _Uize.copyInto,
				_returnFalse = _Uize.returnFalse,

			/*** references to static methods used internally ***/
				_getById,
				_doForAll,
				_isNode,
				_joinIdPrefixAndNodeId,
				_isOnNodeTree,
				_getStyle,
				_setStyle,
				_unwire,

			/*** General Variables ***/
				_isBrowser = typeof navigator != 'undefined',
				_navigator = _isBrowser ? navigator : {userAgent:'',appName:''},
				_userAgent = _navigator.userAgent.toLowerCase (),
				_isIe = _navigator.appName == 'Microsoft Internet Explorer',
				_isMozilla = _userAgent.indexOf ('gecko') > -1,
				_isOpera = _userAgent.indexOf ('opera') > -1,
				_isMozillaOrOpera = _isMozilla || _isOpera,
				_mousePos = {clientX:0,clientY:0,pageX:0,pageY:0},
				_ActiveXObject = _isIe && ActiveXObject,

			/*** variables for event wiring methods ***/
				_wirings = {},
				_wiringIdsByOwnerId = {},
				_totalWirings = 0,

			/*** variables for display method ***/
				_tableDisplayValuePrefix = 'table-',
				_tableRowDisplayValue = _tableDisplayValuePrefix + 'row',
				_tableCellDisplayValue = _tableDisplayValuePrefix + 'cell',
				_tagSpecificDisplayValues = _copyInto (
					{
						SPAN:'inline',
						THEAD:_tableDisplayValuePrefix + 'header-group',
						TFOOT:_tableDisplayValuePrefix + 'footer-group',
						LI:'list-item'
					},
					_isIe && typeof DOMImplementation == 'undefined'
						/* NOTE:
							IE8 supports all the display values, and also the DOMImplementation object (so we use it for testing for older IE)
						*/
						? _null
						: {
							TABLE:'table',
							TR:_tableRowDisplayValue,
							TH:_tableCellDisplayValue,
							TD:_tableCellDisplayValue,
							TBODY:_tableRowDisplayValue + '-group',
							COLGROUP:_tableDisplayValuePrefix + 'column-group',
							COL:_tableDisplayValuePrefix + 'column',
							CAPTION:_tableDisplayValuePrefix + 'caption'
						}
				),

			/*** variables for getStyle method ***/
				_trblStylePropertiesMap = {
					borderColor:['border','Color'],
					borderWidth:['border','Width'],
					padding:1,
					margin:1
				},

			/*** variables for injectHtml method ***/
				_ieInnerHtmlReadOnly = {
					TABLE:_true, THEAD:_true, TFOOT:_true, TBODY:_true, TR:_true, COL:_true, COLGRPUP:_true,
					FRAMESET:_true, HEAD:_true, HTML:_true, STYLE:_true, TITLE:_true
				},

			/*** variables for setOpacity method ***/
				_opacityStyleProperty = {}
		;

		/*** Utility Functions ***/
			function _getElementById (_nodeId) {
				var _result = document.getElementById (_nodeId);
				return (!_isIe || (_result && _result.id == _nodeId)) ? _result : _null;
				/* WORKAROUND:
					stupid issue in IE, where document.getElementById will return a reference to a node that has a name attribute with the specified ID value, if no node has an id with that value
				*/
			}

			function _captureMousePos (_event) {
				_mousePos.clientX = _event.clientX;
				_mousePos.clientY = _event.clientY;
				_mousePos.pageX = _event.pageX;
				_mousePos.pageY = _event.pageY;
			}

			function _resolveStringEventName (_eventName) {
				var _VirtualEvent = _Uize.Dom.VirtualEvent;
				return (
					_VirtualEvent && _eventName.charCodeAt (_eventName.length - 1) == 41
						? _VirtualEvent.resolve (_eventName)
						: _eventName.charCodeAt (0) == 111 && _eventName.charCodeAt (1) == 110
							? _eventName.slice (2)
							: _eventName
				);
			}

		var _package = _Uize.package ({
			/*** Private Static Properties ***/
				_wirings:_wirings,
				_captureMousePos:_captureMousePos, // NOTE: this is needed for the quarantined mouseover handler

			/*** Public Static Methods ***/
				display:function (_nodeBlob,_mustDisplay) {
					_mustDisplay = _mustDisplay === _undefined || !!_mustDisplay;
					_doForAll (
						_nodeBlob,
						function (_node) {
							_node.style.display = _mustDisplay ? (_tagSpecificDisplayValues [_node.tagName] || 'block') : 'none';
						}
					);
				},

				find:function (_properties) {
					/*** return early if the parameter for find is already resolved to a node or array of nodes ***/
						if (
							typeof _properties != _typeObject || !_properties ||
							typeof _properties.length == 'number' || _isNode (_properties)
						)
							return _properties
						;

					var
						_document = document,
						_isPrimitive = _Uize.isPrimitive,
						_nodePool = [],
						_unusedProperties = _copyInto ({},_properties),
						_root = 'root' in _unusedProperties ? _getById (_unusedProperties.root) : _document
					;
					delete _unusedProperties.root;

					/*** narrow down node pool, consuming root, id, name, and tagName tests, where possible ***/
						if (_root) {
							var _tagName = _unusedProperties.tagName;
							if ('id' in _unusedProperties && _isPrimitive (_unusedProperties.id)) {
								/* NOTE: optimization for when id is specified and has a simple value */
								var _node = _getElementById (_unusedProperties.id);
								_node && _nodePool.push (_node);
								delete _unusedProperties.id;
							} else if ('name' in _unusedProperties && _isPrimitive (_unusedProperties.name)) {
								/* NOTE: optimization for when name is specified and has a simple value */
								_nodePool = _document.getElementsByName (_unusedProperties.name);
								delete _unusedProperties.name;
							} else {
								/* NOTE:
									populate the node pool using getElementsByTagName, with optimization for when tagName is specified and has a simple value
								*/
								var _tagNameIsSimplyType = _isPrimitive (_tagName);
								_tagNameIsSimplyType && delete _unusedProperties.tagName;
								_nodePool = _root.getElementsByTagName (_tagName && _tagNameIsSimplyType ? _tagName : '*');
								_root = _null;
							}
							if (_root == _document)
								/* NOTE:
									By this point, if the root has not been consumed and *is* the document, then eliminate it as a test, since all nodes in the pool will fall under this root.
								*/
								_root = _null
							;
							if (!_tagName || _tagName == '*')
								/* NOTE:
									By this point, if we weren't able to consume tagName (because we fell into the id case or the name case) and it is the wildcard character (or an empty string or null or undefined), then eliminate it as a test, since it will have no limiting effect (being the wildcard that it is).
								*/
								delete _unusedProperties.tagName
							;
						}

					/*** return early (which I generally hate doing) if node pool is empty, or no unused properties ***/
						var _nodePoolLength = _nodePool.length;
						for (var _firstUnusedPropertyName in _unusedProperties) break;
						if (!_nodePoolLength || (_firstUnusedPropertyName == _undefined && !_root)) return _nodePool;

					/*** test each node in node pool against remaining unused properties (and possible root test) ***/
						var
							_matchingNodes = [],
							_isMatch
						;
						for (var _nodeNo = -1; ++_nodeNo < _nodePoolLength;) {
							var _node = _nodePool [_nodeNo];
							if (_isMatch = _root ? _isOnNodeTree (_node,_root) : _true) {
								for (var _propertyName in _unusedProperties) {
									var
										_nodePropertyValue = _node [_propertyName],
										_test = _unusedProperties [_propertyName],
										_isFunction = _Uize.isFunction
									;
									if (
										!(
											_isPrimitive (_test)
												? _nodePropertyValue == _test
												: (
													_test instanceof RegExp
														? _test.test (_nodePropertyValue || '')
														: (_isFunction (_test) ? _test.call (_node,_nodePropertyValue) : _true)
												)
										)
									) {
										_isMatch = _false;
										break;
									}
								}
							}
							_isMatch && _matchingNodes.push (_node);
						}
						return _matchingNodes;
				},

				getById:_getById = function (_node,_idPrefix,_nodeCache) {
					if (typeof _node != _typeString) return _node;

					var _result = _nodeCache ? _nodeCache [_node] : _undefined;
					if (_result === _undefined) {
						var _nodeIdOrName = _joinIdPrefixAndNodeId (_idPrefix,_node);
						(_result = _getElementById (_nodeIdOrName)) ||
							(
								(_result = document.getElementsByName (_nodeIdOrName)).length < 2 &&
								(_result = _result [0] || _null)
							)
						;
						if (_nodeCache) _nodeCache [_node] = _result;
					}
					return _result;
				},

				getStyle:_getStyle = function (_node,_property) {
					var
						_typeofPropertyIsString = typeof _property == _typeString,
						_value = _typeofPropertyIsString ? '' : {}
					;
					if (_node = _getById (_node)) {
						if (_typeofPropertyIsString) {
							var
								_opacityInIe = _isIe && _property == 'opacity',
								_documentDefaultView = document.defaultView,
								_computedStyle = _documentDefaultView && _documentDefaultView.getComputedStyle (_node,'')
							;
							if (_opacityInIe) _property = 'filter';
							if (_computedStyle) {
								if (!(_value = _computedStyle [_property])) {
									var _trblStylePropertyPrefixSuffix = _trblStylePropertiesMap [_property];
									if (_trblStylePropertyPrefixSuffix) {
										var
											_stylePropertyPrefix = _trblStylePropertyPrefixSuffix [0] || _property,
											_stylePropertySuffix = _trblStylePropertyPrefixSuffix [1] || '',
											_top = _computedStyle [_stylePropertyPrefix + 'Top' + _stylePropertySuffix],
											_right = _computedStyle [_stylePropertyPrefix + 'Right' + _stylePropertySuffix],
											_bottom = _computedStyle [_stylePropertyPrefix + 'Bottom' + _stylePropertySuffix],
											_left = _computedStyle [_stylePropertyPrefix + 'Left' + _stylePropertySuffix]
										;
										_value = _top == _right && _right == _bottom && _bottom == _left
											? _left
											: _top + ' ' + _right + ' ' + _bottom + ' ' + _left
										;
									}
								}
							} else {
								var _nodeCurrentStyle = _node.currentStyle;
								_value = _nodeCurrentStyle
									? _nodeCurrentStyle.getAttribute (_property)
									: _node.style [_property]
								;
							}
							if (_opacityInIe) {
								var _match = (_value || '').match (/alpha\s*\(\s*opacity\s*=([^\)]*)\)/i);
								_value = _match ? _match [1] / 100 : 1;
							}
						} else {
							for (_property in _property)
								_value [_property] = _getStyle (_node,_property)
							;
						}
					}
					return _value;
				},

				getValue:function (_node) {
					var _value;
					if (_node = _getById (_node)) {
						if (_isNode (_node)) {
							var _nodeTagName = _node.tagName;
							if (_nodeTagName == 'TEXTAREA') {
								_value = _node.value;
							} else if (_nodeTagName == 'INPUT') {
								_value = _node.type == 'checkbox' ? _node.checked : _node.value;
							} else if (_nodeTagName == 'SELECT') {
								if (_node.multiple) {
									_value = [];
									_Uize.forEach (
										_node.options,
										function (_option) {_option.selected && _value.push (_option.value)}
									);
								} else {
									_value = _node.value;
								}
							} else if (_nodeTagName == 'IMG') {
								_value = _node.src;
							} else {
								_value = _node.innerHTML.replace (/<br\/?>/gi,'\n').replace (/&nbsp;/g,' ');
							}
						} else {
							_value = (_Uize.findRecord (_node,{tagName:'INPUT',type:'radio',checked:_true}) || {}).value;
						}
					}
					return _value;
				},

				injectHtml:function (_nodeBlob,_htmlToInject,_mode) {
					var
						_isInnerReplace, _isOuterReplace, _isInnerTop, _isOuterTop, _isOuterBottom, _isInnerBottom,
						_areNodes =
							_Uize.isList (_htmlToInject) ||
							(_isNode (_htmlToInject) && (_htmlToInject = [_htmlToInject]))
					;
					(
						(_isInnerReplace = _mode == 'inner replace') ||
						(_isOuterReplace = _mode == 'outer replace') ||
						(_isInnerTop = _mode == 'inner top') ||
						(_isOuterTop = _mode == 'outer top') ||
						(_isOuterBottom = _mode == 'outer bottom') ||
						(_isInnerBottom = _true)
					);
					_areNodes || (_htmlToInject += ''); // coerce to a string value by invoking valueOf method

					_doForAll (
						_nodeBlob,
						function (_node) {
							var _nodeChildNodes = _node.childNodes;
							function _htmlHasScript (_html) {
								return _html && /<script/i.test (_html)
							}
							function _htmlToInjectHasScript () {
								return _htmlHasScript (_htmlToInject)
							}
							if (
								(_isInnerReplace || (!_nodeChildNodes.length && (_isInnerTop || _isInnerBottom))) &&
								!_isNode &&
								!_htmlToInjectHasScript ()
							) {
								_node.innerHTML = _htmlToInject;
							} else if (_isOuterReplace && _isIe && !_isNode && !_htmlToInjectHasScript ()) {
								_node.outerHTML = _htmlToInject;
							} else {
								var _nodesToInject = [];
								if (_isInnerReplace)
									if (_isIe && _ieInnerHtmlReadOnly [_node.tagName]) {
										var _newNode = _node.cloneNode ();
										_node.replaceNode (_newNode);
										_node = _newNode;
									} else
										_node.innerHTML = '';
								if (_areNodes) {
									for (var _nodeNo = -1, _nodesLength = _htmlToInject.length; ++_nodeNo < _nodesLength;) {
										var _nodeToInject = _htmlToInject [_nodeNo];
										if (_nodeToInject) {
											if (_nodeToInject.parentNode)
												_nodeToInject = _nodeToInject.cloneNode (_true);
											_nodesToInject.push (_nodeToInject);
										}
									}
								} else {
									// IE is "special" in that it has nodes that don't accept innerHTML, so the solution to parse
									// the HTML string is to parse it as XML with the XMLDOM ACtiveX control. But XmlDom is different
									// than HtmlDom nodes, so we have to traverse the XmlDom tree creating corresponding HtmlDom nodes
									if (_ActiveXObject && _ieInnerHtmlReadOnly [_node.tagName]) {
										var _activeXObject = new _ActiveXObject('Microsoft.XMLDOM');
										_activeXObject.async = _false;
										_activeXObject.loadXML('<foo>' + _htmlToInject.replace(/&/g, '&amp;') + '</foo>');

										var
											_xmlChildNodes = _activeXObject.documentElement.childNodes,
											_convertToHtmlNode = function (_xmlNode) {
												var _htmlNode;
												switch (_xmlNode.nodeType) {
													case 1: // element
														_htmlNode = document.createElement(_xmlNode.tagName);

														// add attributes
														for (
															var
																_xmlNodeAttributes = _xmlNode.attributes,
																_attributeNo = _xmlNodeAttributes.length
															;
															--_attributeNo >= 0;
														) {
															var _attribute = _xmlNodeAttributes[_attributeNo];
															_htmlNode.setAttribute(_attribute.nodeName, _attribute.nodeValue);
														}

														// handle scripts specially but just getting text contents
														if (_htmlNode.tagName == 'SCRIPT')
															_htmlNode.text = _xmlNode.text;
														else {
															// all others iterate through child nodes and get their html equivalents
															for (
																var
																	_childNodeNo = -1,
																	_xmlNodeChildNodes = _xmlNode.childNodes,
																	_xmlNodeChildNodesLength = _xmlNodeChildNodes.length,
																	_htmlChildNode
																;
																++_childNodeNo < _xmlNodeChildNodesLength;
															)
																(_htmlChildNode = _convertToHtmlNode(_xmlNodeChildNodes[_childNodeNo]))
																	&& _htmlNode.appendChild(_htmlChildNode)
															;
														}

														break;
													case 3:	// text
														_htmlNode = document.createTextNode(_xmlNode.nodeValue);
														break;
													case 8: // comment
														_htmlNode = document.createComment(_xmlNode.nodeValue);
														break;
												}
												return _htmlNode;
											}
										;

										// iterate through XML nodes and convert to their HTML equivalents
										for (var _nodeNo = -1; ++_nodeNo < _xmlChildNodes.length;)
											_nodesToInject.push(
												_convertToHtmlNode(_xmlChildNodes[_nodeNo])
											)
										;

										// we have an array of nodes as opposed to a NodeList
										_areNodes = _true;
									} else {
										var _dummyNode = document.createElement (_node.tagName);
										_dummyNode.innerHTML = '<i>e</i>'	// fix for IE NoScope issue (http://www.thecssninja.com/javascript/noscope)
											+ _htmlToInject
										;
										_nodesToInject = _dummyNode.childNodes;
									}
								}
								var
									_nodeToInsertBefore = _isInnerTop
										? _nodeChildNodes [0]
										: _isOuterBottom ? _node.nextSibling : _node
									,
									_nodeParentNode = _node.parentNode,
									_nodesToSkip = +!_areNodes, // IE NoScope fix not needed when given dom nodes
									_fixCrippledScripts = function (_node) {
										if (_node.tagName == 'SCRIPT') {
											/* WORKAROUND:
												This is a workaround for an issue where script tags, that are part of HTML that is injected through innerHTML replacement, become crippled in the document. This is particularly an issue for component markup that is loaded and inserted dynamically and that may wish to define properties in companion script tags using the $[idPrefix] syntax.
											*/
											var _activatedScriptNode = document.createElement ('script');

											/*** transfer properties of crippled script node to fresh script node ***/
												if (_node.id) _activatedScriptNode.id = _node.id;
												if (_node.type) _activatedScriptNode.type = _node.type;
												_activatedScriptNode.text = _node.text;
												if (_node.src) _activatedScriptNode.src = _node.src;

											_node.parentNode.replaceChild (_activatedScriptNode,_node);
										} else if (_htmlHasScript (_node.innerHTML)) {
											_Uize.forEach (_node.childNodes,_fixCrippledScripts);
										}
									}
								;
								while (_nodesToInject.length > _nodesToSkip) {
									var _childNodeToInject = _areNodes ?
										_nodesToInject.shift () :
										_nodesToInject [_nodesToSkip];
									if (_isInnerBottom || _isInnerReplace) {
										_node.appendChild (_childNodeToInject);
									} else if (_isInnerTop) {
										_nodeToInsertBefore
											? _node.insertBefore (_childNodeToInject,_nodeToInsertBefore)
											: _node.appendChild (_childNodeToInject)
										;
									} else if (_isOuterTop || _isOuterReplace) {
										_nodeParentNode.insertBefore (_childNodeToInject,_nodeToInsertBefore);
									} else if (_isOuterBottom) {
										_nodeToInsertBefore
											? _nodeParentNode.insertBefore (_childNodeToInject,_nodeToInsertBefore)
											: _nodeParentNode.appendChild (_childNodeToInject)
										;
									}
									_areNodes || _fixCrippledScripts (_childNodeToInject); // Assume if given nodes that the proper fixes have already been applied
								}
								_isOuterReplace && _nodeParentNode.removeChild (_node);
							}
						}
					);
				},

				isOnNodeTree:_isOnNodeTree = function (_node,_rootNode) {
					_node = _getById (_node);
					_rootNode = _getById (_rootNode);
					while (_node) {
						if (_node == _rootNode) return _true;
						_node = _node.parentNode;
					}
					return _false;
				},

				isNode:_isNode = function (_node) {
					return !!(
						_node && typeof _node == _typeObject &&
						(_node.nodeType || _node.getAttribute || _node.documentElement || _node.self == _node)
					);
				},

				joinIdPrefixAndNodeId:_joinIdPrefixAndNodeId = function (_idPrefix,_nodeId) {
					return (_idPrefix || '') + (_idPrefix && _nodeId ? '-' : '') + _nodeId;
				},

				doForAll:_doForAll = function (_nodeBlob,_function,_idPrefix,_nodeCache) {
					if (typeof _nodeBlob == _typeString)
						_nodeBlob = _getById (_nodeBlob,_idPrefix,_nodeCache)
					;
					if (_nodeBlob != _undefined) {
						if (_isNode (_nodeBlob)) {
							_function (_nodeBlob);
						} else {
							var _typeofNodeBlob = typeof _nodeBlob;
							if (
								(_typeofNodeBlob == _typeObject || _typeofNodeBlob == 'function') &&
								typeof _nodeBlob.length == 'number'
							) {
								for (
									var _subNodeBlobNo = -1, _nodeBlobLength = _nodeBlob.length;
									++_subNodeBlobNo < _nodeBlobLength;
								)
									_doForAll (_nodeBlob [_subNodeBlobNo],_function,_idPrefix,_nodeCache)
								;
							} else if (_typeofNodeBlob == _typeObject) {
								for (var _subNodeBlobName in _nodeBlob)
									_doForAll (_nodeBlob [_subNodeBlobName],_function,_idPrefix,_nodeCache)
								;
							}
						}
					}
				},

				remove:function (_nodeBlob) {
					_doForAll (_nodeBlob,function (_node) {_node.parentNode.removeChild (_node)});
				},

				setClipRect:function (_nodeBlob,_top,_right,_bottom,_left) {
					var _clipValue = 'rect(' + _top + 'px, ' + _right + 'px, ' + _bottom + 'px, ' + _left + 'px)';
					_doForAll (_nodeBlob,function (_node) {_node.style.clip = _clipValue});
				},

				setInnerHtml:function (_nodeBlob,_html) {
					_html += ''; // coerce to a string value by invoking valueOf method
					_doForAll (_nodeBlob,function (_node) {_node.innerHTML = _html});
				},

				setOpacity:function (_nodeBlob,_opacity) {
					_opacityStyleProperty.opacity = _opacity;
					_setStyle (_nodeBlob,_opacityStyleProperty);
				},

				setProperties:function (_nodeBlob,_properties) {
					_doForAll (_nodeBlob,function (_node) {_copyInto (_node,_properties)});
				},

				setStyle:_setStyle = function (_nodeBlob,_properties) {
					_doForAll (
						_nodeBlob,
						function (_node) {
							var
								_nodeStyle = _node.style,
								_propertyValue
							;
							if (_isIe && 'opacity' in _properties)
								_nodeStyle.filter =
									/* NOTE:
										if the value is an empty string, it will be turned into #, which will produce NaN when multiplied by 100, and NaN is not less than 100. For the number 0, the string '0' will be retained and coerced back to 0 when multiplied. This is more compact and does not involve an additional function call, which is more important for animations for opacity where it is called repeatedly.
									*/
									(_propertyValue = _Math.round ((_properties.opacity + '' || '#') * 100)) < 100
										? 'alpha(opacity=' + _propertyValue + ')'
										: ''
							;
							for (var _property in _properties)
								_nodeStyle [_property] =
									(
										typeof (_propertyValue = _properties [_property]) == _typeObject && _propertyValue
											? (_propertyValue = _propertyValue.valueOf ())
											: _propertyValue
									) != _undefined
										? (
											typeof _propertyValue == 'number' && _property != 'opacity' && _property != 'zIndex'
												? Math.round (_propertyValue) + 'px'
												: _propertyValue + ''
										)
										: ''
							;
						}
					);
				},

				setValue:function (_nodeBlob,_value) {
					_value += ''; // coerce to a string value by invoking valueOf method
					_doForAll (
						_nodeBlob,
						function (_node) {
							var
								_nodeTagName = _node.tagName,
								_oldReadOnly = _node.readOnly
							;
							if (_oldReadOnly) _node.readOnly = _false;
							if (_nodeTagName == 'TEXTAREA') {
								_node.value = _value;
							} else if (_nodeTagName == 'INPUT') {
								var _nodeType = _node.type;
								if (_nodeType == 'checkbox') {
									_node.checked = _value == 'true';
								} else if (_nodeType == 'radio') {
									_node.checked = _node.value == _value;
								} else {	// text, password, hidden, HTML5 types, etc.
									_node.value = _value
								}
							} else if (_nodeTagName == 'SELECT') {
								if (!_value) {
									_node.selectedIndex = -1;
								} else {
									var _options = _node.options;
									if (_node.multiple && (_value == '*' || _value.indexOf (',') > -1)) {
										var _valuesMap = _value != '*' ? _Uize.lookup (_value.split (',')) : _undefined;
										for (var _optionNo = _options.length, _option; --_optionNo >= 0;)
											(_option = _options [_optionNo]).selected = !_valuesMap || _valuesMap [_option.value]
										;
									} else {
										_node.selectedIndex = _Uize.findRecordNo (_options,{value:_value},_node.selectedIndex);
									}
								}
							} else if (_nodeTagName == 'IMG') {
								if (_value) _node.src = _value;
							} else {
								_nodeTagName == 'PRE' && _isIe
									? (_node.innerText = _value)
									: (_node.innerHTML = _value.replace (/</g,'&lt;').replace (/\n/g,'<br/>'))
								;
							}
							if (_oldReadOnly) _node.readOnly = _oldReadOnly;
						}
					);
				},

				show:function (_nodeBlob,_mustShow) {
					_setStyle (_nodeBlob,{visibility:_mustShow || _mustShow === _undefined ? 'inherit' : 'hidden'});
				},

				unwire:_unwire = function (_nodeBlob,_eventNameOrEventsMap,_argument3,_argument4) {
					if (
						typeof _eventNameOrEventsMap == _typeObject &&
						_eventNameOrEventsMap &&
						!_eventNameOrEventsMap.virtualDomEvent
					) {
						// _argument3 is _wiringOwnerId
						for (var _eventName in _eventNameOrEventsMap)
							_unwire (_nodeBlob,_eventName,_eventNameOrEventsMap [_eventName],_argument3)
						;
					} else {
						// _argument3 is _handler
						// _argument4 is _wiringOwnerId
						_package.unwireEventsByOwnerId (
							_argument4,
							_nodeBlob !== _undefined || _eventNameOrEventsMap != _undefined || _argument3 != _undefined
								? {node:_nodeBlob,eventName:_eventNameOrEventsMap,handler:_argument3}
								: _undefined
						);
					}
				},

				unwireEventsByOwnerId:function (_wiringOwnerId,_eventMatch) {
					var _wiringIds = _wiringIdsByOwnerId [_wiringOwnerId = _wiringOwnerId || ''];
					if (_wiringIds) {
						var _unwireWiringForNode = function (_eventMatchNode) {
							if (_eventMatchNode !== _null) {
								var
									_eventMatchEventName = _eventMatch && _eventMatch.eventName,
									_eventMatchHandler = _eventMatch && _eventMatch.handler,
									_effectivelyHasEventMatch = _eventMatchNode || _eventMatchEventName || _eventMatchHandler
								;
								if (_eventMatchEventName && _eventMatchEventName.charCodeAt)
									_eventMatchEventName = _resolveStringEventName (_eventMatchEventName)
								;
								for (var _wiringIdNo = _wiringIds.length; --_wiringIdNo >= 0;) {
									var
										_wiringId = _wiringIds [_wiringIdNo],
										_wiring = _wirings [_wiringId],
										_node = _wiring._node,
										_eventName = _wiring._eventName
									;
									if (
										!_effectivelyHasEventMatch ||
										(
											(!_eventMatchNode || _eventMatchNode == (_wiring._unremappedNode || _node)) &&
											(!_eventMatchEventName || _eventMatchEventName == _eventName) &&
											(!_eventMatchHandler || _eventMatchHandler == _wiring._handler)
										)
									) {
										_effectivelyHasEventMatch && _wiringIds.splice (_wiringIdNo,1);
										if (_wiring._subWiringsOwnerId) {
											_package.unwireEventsByOwnerId (_wiring._subWiringsOwnerId)
											/* NOTE:
												the wiring is for a virtual DOM event that holds references to supporting events that form part of its implementation and which must also be unwired
											*/
										} else {
											try {
												_node == window
													? _windowEventVehicle.unwire (_eventName,_wiring._handlerCaller)
													: _isIe
														? _node.detachEvent ('on' + _eventName,_wiring._handlerCaller)
														: _node.removeEventListener (_eventName,_wiring._handlerCaller,_false)
												;
											} catch (_error) {
												// the node must be gone already, so don't do anything
											}
										}
										delete _wirings [_wiringId];
									}
								}
								(_effectivelyHasEventMatch && _wiringIds.length) || delete _wiringIdsByOwnerId [_wiringOwnerId];
							}
						};
						_eventMatch && _eventMatch.node !== _undefined
							? _doForAll (_eventMatch.node,_unwireWiringForNode)
							: _unwireWiringForNode ()
						;
					}
				},

				wire:(function () {
					var
						_quarantine = _Uize.quarantine,
						_makeWindowEventHandlerCaller = _quarantine (
							function (_wiringId) {
								return (
									function (_event) {
										var _wiring = window.Uize && Uize.Dom.Basics._wirings [_wiringId];
											/* NOTE: test on window.Uize in case page is being torn down */
										return _wiring && _wiring._handler.call (_wiring._node,_event.windowEvent);
											/* NOTE:
												_wiring could be undefined if window.Uize is undefined because the page is being torn down, or in some cases in IE if the DOM event is still fired after the wiring is removed (some kind of a threading issue?)
											*/
									}
								);
							}
						),
						_makeGenericHandlerCaller = _quarantine (
							function (_wiringId) {
								return (
									function (_event) {
										var _wiring = window.Uize && Uize.Dom.Basics._wirings [_wiringId];
											/* NOTE: test on window.Uize in case page is being torn down */
										return _wiring && _wiring._handler.call (_wiring._node,_event || window.event);
											/* NOTE:
												_wiring could be undefined if window.Uize is undefined because the page is being torn down, or in some cases in IE if the DOM event is still fired after the wiring is removed (some kind of a threading issue?)
											*/
									}
								);
							}
						),
						_handlerCallerMakersByEvent = {
							click:_makeGenericHandlerCaller,
							mouseover:_quarantine (
								function (_wiringId) {
									return (
										function (_event) {
											var
												_Uize_Dom_Basics = Uize.Dom.Basics,
												_wiring = window.Uize && _Uize_Dom_Basics._wirings [_wiringId],
													/* NOTE: test on window.Uize in case page is being torn down */
												_exitNode = (_event || (_event = window.event)).fromElement || _event.relatedTarget
											;
											if (_wiring) {
												/* NOTE:
													_wiring could be undefined if window.Uize is undefined because the page is being torn down, or in some cases in IE if the DOM event is still fired after the wiring is removed (some kind of a threading issue?)
												*/
												if (_exitNode) {
													try {
														if (
															!_exitNode.Uize_Widget_Drag_shield &&
															!_Uize_Dom_Basics.isOnNodeTree (_exitNode,_wiring._node)
														)
															_exitNode = null
														;
													} catch (_error) {
														/* NOTE:
															In some cases in Firefox, trying to get a property of form nodes results in a weird permission denied exception. In this case we can't determine if the node is in the tree.
															In that case, pass the event along
														*/
														_exitNode = null;
													}
												}
												if (!_exitNode) {
													_Uize_Dom_Basics._captureMousePos (_event);
													return _wiring._handler.call (_wiring._node,_event);
												}
											}
										}
									);
								}
							),
							mouseout:_quarantine (
								function (_wiringId) {
									return (
										function (_event) {
											var
												_Uize_Dom_Basics = Uize.Dom.Basics,
												_wiring = window.Uize && _Uize_Dom_Basics._wirings [_wiringId],
													/* NOTE: test on window.Uize in case page is being torn down */
												_entryNode = (_event || (_event = window.event)).toElement || _event.relatedTarget
											;
											if (_wiring) {
												/* NOTE:
													_wiring could be undefined if window.Uize is undefined because the page is being torn down, or in some cases in IE if the DOM event is still fired after the wiring is removed (some kind of a threading issue?)
												*/
												if (_entryNode) {
													try {
														if (
															!_entryNode.Uize_Widget_Drag_shield &&
															!_Uize_Dom_Basics.isOnNodeTree (_entryNode,_wiring._node)
														)
															_entryNode = null
														;
													} catch (_error) {
														/* NOTE:
															In some cases in Firefox, trying to get a property of form nodes results in a weird permission denied exception. In this case we can't determine if the node is in the tree.
															In that case, pass the event along
														*/
														_entryNode = null;
													}
												}
												if (!_entryNode)
													return _wiring._handler.call (_wiring._node,_event)
												;
											}
										}
									);
								}
							),
							mousedown:_makeGenericHandlerCaller,
							mouseup:_makeGenericHandlerCaller
						}
					;
					return function (_nodeBlob,_eventName,_handler,_wiringOwnerId) {
						if (!_eventName) return;

						if (_wiringOwnerId == _undefined) _wiringOwnerId = '';
						var _isVirtualDomEvent;
						if (_eventName.charCodeAt)
							_eventName = _resolveStringEventName (_eventName)
						;
						if (typeof _eventName == _typeObject && !(_isVirtualDomEvent = !!_eventName.virtualDomEvent)) {
							_wiringOwnerId = arguments [2] || ''; // third argument is wiring owner ID in this variation
							for (var _event in _eventName)
								_package.wire (_nodeBlob,_event,_eventName [_event],_wiringOwnerId)
							;
							return;
						}
						_doForAll (
							_nodeBlob,
							function (_node) {
								var _nodeTagName = _node.tagName;

								/*** update handler mapping info ***/
									(_wiringIdsByOwnerId [_wiringOwnerId] || (_wiringIdsByOwnerId [_wiringOwnerId] = [])).push (
										_totalWirings
									);

								/*** make handler caller function ***/
									var _handlerCaller =
										(
											_isVirtualDomEvent
												? _returnFalse
												: _node == window
													? _makeWindowEventHandlerCaller
													: _handlerCallerMakersByEvent [_eventName] || _makeGenericHandlerCaller
										) (_totalWirings)
									;

								/*** add entry in handler map ***/
									var _wiring = _wirings [_totalWirings++] = {
										_node:_node,
										_eventName:_eventName,
										_handler:_handler,
										_handlerCaller:_handlerCaller
									};
									if (_isMozillaOrOpera && _nodeTagName == 'BODY' && _eventName == 'scroll') {
										/* NOTE:
											special node remapping for Firefox, so that the scroll event can be wired for the body node (from the application's perspective), even though FF only supports this event for the document object.
										*/
										_wiring._unremappedNode = _node;
										_node = _wiring._node = document;
									}

								if (_handlerCaller) {
									/*** wire the event ***/
										var _eventPropertyName = 'on' + _eventName;
										_node == window
											? _windowEventVehicle.wire (_eventName,_handlerCaller)
											: _node.attachEvent
												? _node.attachEvent (_eventPropertyName,_handlerCaller)
												: _node.addEventListener (_eventName,_handlerCaller,_false)
										;
										if (
											_nodeTagName == 'A' &&
											(_eventName == 'mousedown' || _eventName == 'click' || _eventName == 'touchstart') && !_node [_eventPropertyName]
										)
											_node [_eventPropertyName] = _returnFalse
										;
								} else if (_isVirtualDomEvent) {
									_eventName.wire (_node,_handler,_wiring._subWiringsOwnerId = _Uize.getGuid ());
								}
							}
						);
					}
				}) (),

			/*** Static Properties ***/
				ieMajorVersion:+(_isIe && (_userAgent.match (/MSIE\s*(\d+)/i) || [0,0]) [1]),
				isIe:_isIe,
				isSafari:_userAgent.indexOf ('applewebkit') > -1,
				isMozilla:_isMozilla,
				mousePos:_mousePos
		});

		/*** Initialization ***/
			if (_isBrowser) {
				/*** wire up document mousemove to keep track of mouse position ***/
					_package.wire (document.documentElement,'mousemove',_captureMousePos);

				/*** wire up window events to fire events on window event vehicle ***/
					var
						_windowEventVehicle = new _Uize.Event.Bus,
						_documentLoadedTimeout = setTimeout (function () {_windowEventVehicle.fire ('load')},15000)
					;
					_Uize.forEach (
						['focus','blur','load','beforeunload','unload','resize','scroll','hashchange'],
						function (_windowEventName) {
							var
								_windowEventPropertyName = 'on' + _windowEventName,
								_oldWindowEventHandler = window [_windowEventPropertyName] || _returnFalse
							;
							window [_windowEventPropertyName] = function (_event) {
								_windowEventName == 'load' && clearTimeout (_documentLoadedTimeout);
								_oldWindowEventHandler.call (window,_event || (_event = window.event));
								_windowEventVehicle.fire ({name:_windowEventName,windowEvent:_event});
							};
						}
					);
			}

		return _package;
	}
});

