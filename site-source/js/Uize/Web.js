/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Web Object
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)1997-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Object
	importance: 9
	codeCompleteness: 100
	docCompleteness: 50
*/

/*?
	Introduction
		The =Uize.Web= module provides support for ease of selecting, traversing, styling, and wiring events of DOM nodes, among other useful operations needed for creating an interactive UI.

		*DEVELOPERS:* `Ben Ilegbodu`, original code contributed by `Zazzle Inc.`

		Not a Uize Subclass
			First off, it's worth emphasizing that the =Uize.Web= object is not a =Uize.Class= subclass, but a very lightweight object.

			As such, the =Uize.Web= object does not support events, does not provide state properties, does not inherit subclassing facilities from the =Uize.Class= base class, etc. This object is deliberately designed to be very lightweight and to have a really tiny footprint - in the spirit of JavaScript's native objects, such as =String=, =Number=, =Date=, and the like.

		Key Features
			The =Uize.Web= object provides the following key features...

			Selectors
				document...

			Method Chaining
				document...

			Dynamic Methods Return Values
				document...

			Method Overloading
				document...

			CSS Methods
				document...

				CSS Support
					document...

			Events-Related Methods
				document...

				Virtual Event Methods
					document...

			Node Info/Manipulation Methods
				document...

			Display-Related Methods
				document...

			Filtering & Traversing Methods
				Filtering & traversing functionality is provided via the =Uize.Web.xFilters= extension module. Pages that want to leverage the syntax-friendly nature of =Uize.Web= may not need to leverage any filtering or traversing functionality. Therefore, the filtering & traversing functionality is not implemented in the =Uize.Web= class in order to reduce the need for loading the extra code.  Instead, in order to include the filtering & traversing functionality, one needs to require the =Uize.Web.xFilters= extension module.

			DOM Manipulation Methods
				document...

				Additional DOM manipulation functionality is provided via the =Uize.Web.xDom= extension module. Pages that want to leverage the syntax-friendly nature of =Uize.Web= may not need to leverage any DOM manipulation. Therefore, the DOM manipulation functionality is not implemented in the =Uize.Web= class in order to reduce the need for loading the extra code.  Instead, in order to include the DOM manipulation functionality, one needs to require the =Uize.Web.xDom= extension module.

			Animation Methods
				Animations & effects are provided via the =Uize.Web.xEffects= extension module. Pages that want to leverage the syntax-friendly nature of =Uize.Web= may not need to leverage any animation effects. Therefore, the animation effects functionality is not implemented in the =Uize.Web= class in order to reduce the need for loading the extra code.  Instead, in order to include the animation effects, one needs to require the =Uize.Web.xEffects= extension module.

		Creating Instances
			document...

		Extensions
			The =Uize.Web= object module has the following extensions...

			* =Uize.Web.xEffects= - provides animation effects
			* =Uize.Web.xFilters= - provides filtering & traversing functionality
			* =Uize.Web.xDom= - provides DOM manipulation functionality

*/

Uize.module ({
	name:'Uize.Web',
	required:[
		'Uize.Dom.Basics',
		'Uize.Dom.Classes',
		'Uize.Dom.Pos',
		'Uize.Dom.Text'
	],
	builder:function () {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_true = true,
				_false = false,
				_null = null,
				_undefined,

				_Uize = Uize,
				_Uize_Dom = _Uize.Dom,
				_Uize_Dom_Basics = _Uize_Dom.Basics,
				_Uize_Dom_Classes = _Uize_Dom.Classes,
				_Uize_Dom_Pos = _Uize_Dom.Pos,

				_Uize_isString = _Uize.isString,
				_Uize_isArray = _Uize.isArray,
				_Uize_isList = _Uize.isList,
				_Uize_isFunction = _Uize.isFunction,
				_Uize_isPlainObject = _Uize.isPlainObject,
				_Uize_isBoolean = _Uize.isBoolean,

				_Uize_Dom_Basics_getStyle = _Uize_Dom_Basics.getStyle,
				_Uize_Dom_Basics_setStyle = _Uize_Dom_Basics.setStyle,
				_Uize_Dom_Basics_isNode = _Uize_Dom_Basics.isNode,

				_window = _Uize.global(),
				_document = _window.document,

			/*** General Variables ***/
				_marginsInfo = {
					width:{marginRight:1,marginLeft:1},
					height:{marginTop:1,marginBottom:1}
				},
				_vendorPrefixes = ['webkit', 'ms', 'moz', 'o'],
				_vendorPrefixesLength = _vendorPrefixes.length,
				_windowWidth = 0,
				_windowHeight = 0,

			/*** Utility Functions ***/
				_buildEventsMap = function(_param1, _param2, _param3) {
					var _eventsMap = _param1;

					if (_param1) {
						var
							_selector = _param3,
							_makeHandlerWrapper = function(_handler) {
								if (_Uize_isFunction(_handler)) { // no need to do anything if the handler isn't defined
									var _handlerWrapperKey = _selector || '_handlerWrapper';

									// store a reference in the handler to the wrapper so that if they try
									// to unwire later, we'll have a reference to the actual function that was wired
									return (
										_handler[_handlerWrapperKey]
											|| (_handler[_handlerWrapperKey] = function(_event) {
													var _node = this;
													_Uize.require(
														'Uize.Dom.Event',
														function(_Uize_Dom_Event) {
															// always fix the event to make life easier for everyone
															_Uize_Dom_Event.fix(_event);

															// optionally filter target by by selector
															_isMatch(_event.target, _selector)
																&& _handler.call(_node, _event) // pass wired node as "this"
															;
														}
													);
												}
											)
									);
								}
								else if (_Uize_isBoolean(_handler)) // simple return false
									return _handler ? _Uize.returnTrue : _Uize.returnFalse;
							}
						;

						if (_Uize_isString(_param1))// first param is a string so param2 is the handler & param3 is the optional selector
							_eventsMap = _Uize.pairUp(_param1, _makeHandlerWrapper(_param2));
						else if (_Uize_isArray(_param1)) // an array of events so create map with each event pointing to handler
							_eventsMap = _Uize.lookup(_param1, _makeHandlerWrapper(_param2));
						else {
							// got an events map by default so param2 is the selector
							_selector = _param2;

							// update the map to point to our handler wrapper
							var _eventsMapWithWrappers = {};

							for (var _eventName in _eventsMap)
								_eventsMapWithWrappers[_eventName] = _makeHandlerWrapper(_eventsMap[_eventName])
							;

							_eventsMap = _eventsMapWithWrappers;
						}
					}

					return _eventsMap;
				},
				_getById = function(_nodeBlob) { return _Uize_Dom_Basics.getById(_nodeBlob) },
				_getDimensions = function(_node, _includeMargins) {
					var _dimensions = _Uize_Dom_Pos.getDimensions(_node);

					if (_includeMargins) {
						for (var _marginType in _marginsInfo) {
							var
								_marginInfo = _marginsInfo[_marginType],
								_marginValues = _Uize_Dom_Basics_getStyle(_node, _marginInfo)
							;

							for (var _marginName in _marginInfo) {
								var _marginValue = _marginValues[_marginName];
								_dimensions[_marginType] += (_marginValue == 'auto' ? 0 : parseInt(_marginValue, 10));
							}
						}
					}

					return _dimensions;
				},
				_getNodeUid = function(_node) { return _node._uid || (_node._uid = _Uize.getGuid()) },
				_getOffsetParent = function(_node, _selector) {
					var
						_testNode = _node,
						_offsetParent
					;

					while (_testNode = _testNode.offsetParent) {
						if (_isMatch(_testNode, _selector)) {
							_offsetParent = _testNode;
							break;
						}
					}

					return _offsetParent;
				},
				_getPrefixedProperty = function(_propertyName, _node, _returnKey) {
					var _returnValue;

					_node = _node || _document;

					if (_node) {
						var
							_propertyNames = _getPrefixedProperyNames(_propertyName),
							_index = -1
						;

						// loop through the prefixed property names (the first is unprefixed)
						// seeing if there is a value defined
						for (; ++_index < _vendorPrefixesLength + 1;) {
							var _prefixedPropertyName = _propertyNames[_index];
							if (_prefixedPropertyName in _node) {
								_returnValue = _returnKey ? _prefixedPropertyName : _node[_prefixedPropertyName];
								break;
							}
						}
					}

					return _returnValue;
				},
				_getPrefixedProperyNames = function(_propertyName) {
					var
						_propertyNames = [_propertyName], // first item is unprefixed
						_propertyNameCap = _Uize.capFirstChar(_propertyName),
						_prefixNo = -1
					;

					for (; ++_prefixNo < _vendorPrefixesLength;)
						_propertyNames.push(_vendorPrefixes[_prefixNo] + _propertyNameCap)
					;

					return _propertyNames;
				},
				_getSupportedProperties = function(_properties, _nodeToTest) {
					var _supportedProperties;

					if (_properties) {
						_supportedProperties = {};

						for (var _propertyName in _properties) {
							var _supportedPropertyName = _supportsCss(_propertyName, _nodeToTest);

							if (_supportedPropertyName)
								_supportedProperties[_supportedPropertyName] = _properties[_propertyName];
						}
					}

					return _supportedProperties;
				},
				_getSacredNode = function() { return _object._sacredNode = _object._sacredNode || _document.createElement('DIV') },
				_isMatch = function(_node, _selector) {
					_node = _getById(_node);
					return (
						_selector === _undefined
							|| (_Uize_isString(_selector) && _object.matches(_node, _selector))
							|| (_Uize_Dom_Basics_isNode(_selector) && _node == _selector)
							|| (_isWeb(_selector) && _Uize.isIn(_selector._nodes, _node))
							|| (_Uize_isArray(_selector) && _Uize.isIn(_selector, _node))
					);
				},
				_isWeb = function(_param) { return _Uize.getClass(_param) == _object },
				_select = function(_param, _rootSelector) {
					var _nodes;

					if (_param && _Uize_isString(_param)) // selector string
						_nodes = _object.selectCss(_param, _select(_rootSelector)[0]);
					else if (_Uize_Dom_Basics_isNode(_param)) // node reference
						_nodes = [_param];
					else if (_isWeb(_param)) // Uize.Web object
						_nodes = _param.element();
					else if (_Uize_isList(_param)) { // node list, to be converted to a unique set
						var _nodeLookup = {};

						_nodes = []; // make a copy to be safe (can't use concat because may not be a native JS array)

						for (var _nodeNo = -1; ++_nodeNo < _param.length;) {
							var _node = _param[_nodeNo];
							if (_Uize_Dom_Basics_isNode(_node)) {
								var _nodeUid = _getNodeUid(_node);
								if (!_nodeLookup[_nodeUid]) {
									_nodes.push(_node);
									_nodeLookup[_nodeUid] = _true;
								}
							}
						}
					}
					else
						_nodes = [];

					return _nodes;
				},
				_supportsCss = function(_propertyName, _nodeBlobToTest) {
					var _supportsCss = _object._cssSupport[_propertyName];

					if (_supportsCss == _undefined)
						_supportsCss = _getPrefixedProperty(
							_propertyName,
							(_getById(_nodeBlobToTest) || _getSacredNode()).style,
							_true
						)
					;

					return _object._cssSupport[_propertyName] = _supportsCss;
				}
		;

		/*** Constructor ***/
			var
				_object = Uize.noNew (
					function (_selector, _rootSelector) {
						var
							m = this,
							_nodes = m._nodes = _select(_selector, _rootSelector),

							_nodesLength = m.length = _nodes.length, // add public length property
							_nodeNo = -1
						;

						m.supportsTouch = _object.supportsTouch;

						/* make array-like (length proprety + numeric keys) */
							// add numeric keys
							for (; ++_nodeNo < _nodesLength;)
								m[_nodeNo] = _nodes[_nodeNo];

						/* call constructor hook method for extensions */
							m.atEndOfConstructor(_nodes);

						/*?
							Constructor
								Creates an instance of the =Uize.Web= object containing a collection of matched nodes found in the DOM based on the specified argument(s).

								SYNTAX
								.....................................
								webOBJ = Uize.Web(selectorSTR);
								.....................................

								VARIATION 1
								.....................................
								webOBJ = Uize.Web(selectorSTR, rootSelector);
								.....................................

								VARIATION 2
								.....................................
								webOBJ = Uize.Web(node);
								.....................................

								VARIATION 3
								.....................................
								webOBJ = Uize.Web(nodesARRAY);
								.....................................

								VARIATION 4
								.....................................
								webOBJ = Uize.Web(webOBJ);
								.....................................

								VARIATION 5
								.....................................
								webOBJ = Uize.Web();
								.....................................

							Instance Properties
								length
									A number, reflecting of the number of nodes in the =Uize.Web= object.

									NOTES
									- this is a read-only property

								supportsTouch
									A boolean, indicating whether or not the browser supports touch event.

									NOTES
									- this is a read-only property
									- Some browsers may report that they do support touch even if there is not a touch interface.
									- See also =Uize.Web.supportsTouch= static property
						*/
					}
				),
				_objectPrototype = _object.prototype
			;

		/*** Easy Global Access ***/
			if (_window && !_window.U)
				_window.U = _object;

		/*** Private static variables ***/
			_object._sacredNode = _undefined;
			_object._cssSupport = {};

		/*** Public static variables ***/
			_object.supportsTouch = 'ontouchstart' in _window;
				/*?
					Static Properties
						Uize.Web.supportsTouch
							A boolean, indicating whether or not the browser supports touch event.

							SYNTAX
							.....................................................
							supportsTouchBOOL = Uize.Web.supportsTouch;
							.....................................................

							NOTES
							- this is a read-only property
							- Some browsers may report that they do support touch even if there is not a touch interface.
							- See also =supportsTouch= instance property
				*/

		/*** Public Static Methods ***/
			_object.getPrefixedProperty = _getPrefixedProperty;
				/*?
					Static Methods
						Uize.Web.getPrefixedProperty
							A method that returns the value of the specified (and potentially prefixed) property on the specified node object.

							SYNTAX
							.....................................................
							propertyValueANYTYPE = Uize.Web.getPrefixedProperty(propertyNameSTR, nodeBLOB);
							.....................................................

							VARIATION 1
							....
							valueANYTYPE = Uize.Web.getPrefixedProperty(propertyNameSTR, nodeBLOB, returnKeyBOOL);
							....

							In this variation, the optional third =returnKeyBOOL= parameter indicates whether the return value should be the prefixed property name (when =returnKeyBOOL= is =true=) or the property value (when =returnKeyBOOL= is =false=).

							VARIATION 2
							....
							propertyValueANYTYPE = Uize.Web.getPrefixedProperty(propertyNameSTR);
							....

							In this variation, when the =nodeBLOB= parameter is omitted, it is defaulted the =document= object.

							NOTES
							- The default value of =nodeBLOB= is the =document=
							- The default value of =returnKeyBOOL= is =false=
							- Use this method instead of browser version testing to determine if a given property is supported by the browser
							- See also =Uize.Web.supportsCss= static method
				*/

			_object.matches = function(_nodeBlob, _selector) {
				var
					_node = _getById(_nodeBlob),
					_matches = _false
				;

				if (_node) {
					var
						_matchesFunction = _node.matches
							|| _node.msMatchesSelector
							|| _node.mozMatchesSelector
							|| _node.webkitMatchesSelector
							|| _node.oMatchesSelector
					;
					if (_matchesFunction)
						_matches = _matchesFunction.call(_node, _selector);
				}

				return _matches;
				/*?
					Static Methods
						Uize.Web.matches
							A method that returns whether or not a specified DOM node matches a specified selector.

							SYNTAX
							.....................................................
							matchesBOOL = Uize.Web.matches(nodeBLOB, selectorSTR);
							.....................................................

							NOTES
							- This method wraps the [[http://dev.w3.org/2006/webapi/selectors-api2/#matchtesting][matches]] method available on DOM elmenent nodes.
				*/
			};

			_object.selectCss = function(_selector, _rootNode) {
				var
					_domElement = _rootNode ? _getById(_rootNode) : _document,
					_nodeList = _domElement.querySelectorAll && _domElement.querySelectorAll(_selector)
				;

				if (_nodeList) {
					var _newNodeList = [];
					for (var _nodeNo = -1, _nodeListLength = _nodeList.length; ++_nodeNo < _nodeListLength;)
						_newNodeList[_nodeNo] = _nodeList[_nodeNo]
					;
					_nodeList = _newNodeList;
				}

				return _nodeList || [];
				/* NOTE: More optimal code-wise, but copyList is slower
				var
					_domElement = _rootNode ? _getById(_rootNode) : _document,
					_nodeList = _domElement.querySelectorAll && _domElement.querySelectorAll(_selector)
				;
				return _nodeList ? _Uize.copyList(_nodeList) : [];
				*/
				/*?
					Static Methods
						Uize.Web.selectCss
							A method that returns a list of nodes within the specified (optional) root DOM node (using depth-first pre-order traversal of the root node's child nodes) that match ths specified selector.

							SYNTAX
							.....................................................
							nodesARRAY = Uize.Web.matches(selectorSTR, rootNodeBLOB);
							.....................................................

							VARIATION
							....
							nodesARRAY = Uize.Web.matches(selectorSTR);
							....

							NOTES
							- This method wraps the =querySelectorAll= method that applies to the [[https://developer.mozilla.org/en-US/docs/DOM/Document.querySelectorAll][document object]] and other [[https://developer.mozilla.org/en-US/docs/DOM/Element.querySelectorAll][DOM elements]].
							- see also `Constructor`
				*/
			};

			_object.supportsCss = _supportsCss;
				/*?
					Static Methods
						Uize.Web.supportsCss
							A method that determines whether or not the specified CSS property is supported in the current browser.

							SYNTAX
							.....................................................
							supportedSTR = Uize.Web.supportsCss(propertyNameSTR);
							.....................................................

							VARIATION
							....
							supportedSTR = Uize.Web.supportsCss(propertyNameSTR, nodeBLOB);
							....

							NOTES
							- Use this method instead of browser version testing to determine if a given CSS property is supported by the browser
							- See also =supportsCss= instance method
				*/

		/*** Public Static Helper Methods ***/
			_object.getNodeUid = _getNodeUid;
				/*?
					Static Methods
						Uize.Web.getNodeUid
							Gets a unique identifier for the specified node.

							SYNTAX
							.....................................................
							nodeUidSTR = Uize.Web.matches(nodeOBJ);
							.....................................................

							NOTES
							- This is primarily for internal use by =Uize.Web= extensions
				*/

			_object.isMatch = _isMatch;
				/*?
					Static Methods
						Uize.Web.isMatch
							Returns whether or not the specified node matches the specified selector.

							SYNTAX
							.....................................................
							isMatchBOOL = Uize.Web.isMatch(nodeBLOB, selectorSTR);
							.....................................................

							VARIATION 1
							.....................................................
							isMatchBOOL = Uize.Web.isMatch(nodeBLOB, nodeOBJ);
							.....................................................

							VARIATION 2
							.....................................................
							isMatchBOOL = Uize.Web.isMatch(nodeBLOB, webOBJ);
							.....................................................

							VARIATION 2
							.....................................................
							isMatchBOOL = Uize.Web.isMatch(nodeBLOB, nodesARRAY);
							.....................................................

							NOTES
							- This is primarily for internal use by =Uize.Web= extensions
				*/

			_object.isWeb = _isWeb;
				/*?
					Static Methods
						Uize.Web.isWeb
							Returns whether or not the specified parameter is a =Uize.Web= object.

							SYNTAX
							.....................................................
							isWebBOOL = Uize.Web.isWeb(paramANYTYPE);
							.....................................................

							NOTES
							- This is primarily for internal use by =Uize.Web= extensions
				*/

			_object.select = _select;
				/*?
					Static Methods
						Uize.Web.select
							Gets selection info for the specified selector.

							SYNTAX
							.....................................................
							nodesARRAY = Uize.Web.select(selectorSTR, rootNodeBLOB);
							.....................................................

							VARIATION 1
							.....................................
							nodesARRAY = Uize.Web.select(selectorSTR, rootNodeBLOB);
							.....................................

							VARIATION 2
							.....................................
							nodesARRAY = Uize.Web.select(node);
							.....................................

							VARIATION 3
							.....................................
							nodesARRAY = Uize.Web.select(nodesARRAY);
							.....................................

							VARIATION 4
							.....................................
							nodesARRAY = Uize.Web.select(webOBJ);
							.....................................

							VARIATION 5
							.....................................
							nodesARRAY = Uize.Web.select();
							.....................................

							NOTES
							- This is primarily for internal use by =Uize.Web= extensions
				*/

		/*** Private Instance Methods ***/
			_objectPrototype._display = function(_mustDisplay) {
				var
					m = this,
					_Uize_Dom_Basics_display = _Uize_Dom_Basics.display
				;

				m._each(
					function() {
						var
							_node = this,
							_nodeMustDisplay = _mustDisplay,
							_nodeStyleDisplay = _Uize_Dom_Basics_getStyle(_node, 'display'),
							_nodeIsHidden = _nodeStyleDisplay == 'none'
						;

						// _nodeMustDisplay will be null or undefined if we're trying to do a toggle operation.
						// then _mustDisplay will be fixed based upon whether or not the node is hidden
						if (_nodeMustDisplay == _null)
							_nodeMustDisplay = _nodeIsHidden;

						if (_nodeIsHidden == _nodeMustDisplay) { // we actually need to change the display
							if (!_nodeMustDisplay) {
								_node._display = _nodeStyleDisplay;
								_Uize_Dom_Basics_display(_node, _false);
							}
							else {
								var _displayToSet = _node._display || '';

								// displayToSet might be a explicit display (like 'inline') that was set before hiding
								_Uize_Dom_Basics_setStyle(_node, {display:_displayToSet});

								// if there was no explicit display and we attempted to just remove 'display:none' from
								// the style attribute, we need to make sure that there wasn't external CSS setting
								// display:none. If so, we need to explicitly set a display.
								!_displayToSet
									&& _Uize_Dom_Basics_getStyle(_node, 'display') == 'none'
									&& _Uize_Dom_Basics_display(_node)
								;

								// clear cached explicit display on the node
								_node._display = _undefined;
							}
						}
					}
				);

				return m;
			};

			_objectPrototype._wireOrUnwire = function(_methodName, _param1, _param2, _param3) {
				_Uize_Dom_Basics[_methodName](
					this._nodes,
					_buildEventsMap(_param1, _param2, _param3)
				);

				return this;
			};

		/*** Public Instance Methods ***/
			/** Hook Methods **/
				_objectPrototype.atEndOfConstructor = _Uize.nop;
					/*?
						Instance Methods
							atEndOfConstructor
								A hook method called at the end of the constructor.

								SYNTAX
								.....................................................
								atEndOfConstructor();
								.....................................................

								NOTES
								- This is primarily for internal use by =Uize.Web= extensions
					*/

			/** Helper Methods **/
				_objectPrototype.handleGetAction = _objectPrototype._handleGetAction = function(_getFunc, _returnAll) {
					var
						_nodes = this._nodes,
						_returnValue = _null
					;

					if (_returnAll) // return an array of values
						_returnValue = _Uize.map(_nodes, _getFunc);
					else if (_nodes.length) // just return the first one (if it exists)
						_returnValue = _getFunc(_nodes[0], 0);

					return _returnValue;
				};

				_objectPrototype.handleGetOrSetAction = _objectPrototype._handleGetOrSetAction = function(_getFunc, _returnAllOrValueToSet, _setFunc) {
					return (
						_returnAllOrValueToSet == _undefined || _Uize_isBoolean(_returnAllOrValueToSet) // getting if there's no param2 OR param2 is boolean (returnAll param)
							? this._handleGetAction(_getFunc, _returnAllOrValueToSet)
							: this._handleSetAction(_returnAllOrValueToSet, _setFunc)
					);
				};

				_objectPrototype.handleSetAction = _objectPrototype._handleSetAction = function(_valueToSet, _setFunc) {
					var
						m = this,
						_nodes = m._nodes
					;

					if (_Uize_isFunction(_valueToSet)) {
						for (var _nodeNo = -1, _nodesLength = _nodes.length; ++_nodeNo < _nodesLength;) {
							var _node = _nodes[_nodeNo];
							_setFunc(
								_node,
								_valueToSet.call(_node, _nodeNo, _node) // pass node as "this", index as 1st param, node as 2nd param
							);
						}
					}
					else
						m._each(function() { _setFunc(this, _valueToSet) }) // call setFunc for each node instead of passing array as nodeBlob
					;

					return m;
				};

			/** General **/
				var
					_makeNodeGetSetMethod = function(_methodName, _getFunc, _setFunc) {
						// NOTE: the goal of this function is to add a method to the prototype that serves as a getter/setter
						// of properties of the matched set of nodes.
						// - the getter takes either string parameter or a string list of the property name(s) to get
						// - the setter takes two string parameters (name & value), a string name parameter + value function,
						// - or a name-value dictionary
						// _getFunc is the actual function that will get the info from the node
						// _setFunc is the actual function that will set the info on the nodes
						_objectPrototype[_methodName] = function(_param1, _param2) {
							var
								_param1IsObject = _Uize_isPlainObject(_param1),
								_styleProperty = _Uize_isArray(_param1) ? _Uize.lookup(_param1) : _param1
							;

							return this._handleGetOrSetAction(
								function(_node) { return _getFunc(_node, _styleProperty) }, // getFunc
								_param1IsObject ? _param1 : _param2, // get - (param1 won't be an object) param2 contains returnAll or is undefined, set - param1 is the object or param2 is the scalar value
								function(_node, _value) { // setFunc
									_setFunc(
										_node,
										_param1IsObject ? _param1 : _Uize.pairUp(_param1, _value)
									);
								}
							);
						};
					},
					_makeGetNodeInfoFunction = function(_getInfoFunc) {
						// NOTE: the goal of this function is to have shared code for functions that want to get some info
						// from a node (and don't exist in Uize.Dom.Basics).
						// _getInfoFunc acutally gets the information from the node
						var _function = function(_node, _infoName) {
							var
								_typeofInfoNameIsString = _Uize_isString(_infoName),
								_value = _typeofInfoNameIsString ? '' : {}
							;

							if (_node) {
								if (_typeofInfoNameIsString)
									_value = _getInfoFunc(_node, _infoName);
								else {
									for (var _key in _infoName)
										_value [_key] = _function (_node, _key)
									;
								}
							}

							return _value;
						};
						return _function;
					}
				;

				_objectPrototype.each = _objectPrototype._each = function(_iterationHandler) {
					_Uize_isFunction(_iterationHandler)
						&& _Uize.forEach(
							this._nodes,
							function(_node, _nodeNo) { _iterationHandler.call(_node, _nodeNo, _node) } // pass node as "this" (and 2nd param)
						);
					return this;
					/*?
						Instance Methods
							each
								Iterates over the set of matched DOM nodes, executing a function for each DOM node.

								SYNTAX
								........................................................
								myWeb = myWeb.each(iteratorFUNC);
								........................................................

								NOTES
								- Returns a reference to the same =Uize.Web= object
					*/
				};

				_objectPrototype.element = function(_index) {
					var _nodes = this._nodes;
					return _index != _undefined ? _nodes[_index] : _nodes.concat();
					/*?
						Instance Methods
							element
								Retrieves the DOM node within the set of matched DOM nodes at the specified index.

								SYNTAX
								........................................................
								nodeOBJ = myWeb.element(indexINT);
								........................................................

								VARIATION 1
								........................................................
								noesARRAY = myWeb.element();
								........................................................
					*/
				};

				_objectPrototype.getPrefixedProperty = function(_propertyName, _returnAll) {
					return this._handleGetAction(
						function(_node) { return _getPrefixedProperty(_propertyName, _node) },
						_returnAll
					);
					/*?
						Instance Methods
							getPrefixedProperty
								Gets the value of the specified (and potentially prefixed) property in the current environment (i.e. browser) of the set of matched DOM nodes.

								SYNTAX
								........................................................
								propertyValueSTR = myWeb.getPrefixedProperty(propertyNameSTR); // one matched node
								........................................................

								VARIATION
								........................................................
								propertyValuesARRAY = myWeb.getPrefixedProperty(propertyNameSTR, returnAllBOOL); // multiple matched nodes
								........................................................

								NOTES
								- Use this method instead of browser version testing to determine if a given property is supported by the browser
								- If =returnAllBOOL= is set to =true=, then the return value for each of the matched nodes is wrapped in an array (even if there's only one matched node). If =returnAllBOOL= is =false= or unspecified (=undefined=), only the value for the first matched node is returned. See `Dynamic Methods Return Values` for more info.
								- See also =Uize.Web.getPrefixedProperty= static method
					*/
				};

				// For making a Uize.Web object look like an array in Firebug and other inspectors (http://www.mail-archive.com/firebug@googlegroups.com/msg01548.html), and passes Uize.isArray
				_objectPrototype.splice = _Uize.nop;

			/** Classes **/
				var
					_makeUizeNodeClassesVoidMethod = function(_methodName) { // regular class methods
						_objectPrototype[_methodName] = function(_classNameSTRorFUNC) {
							return this._handleSetAction(
								_classNameSTRorFUNC,
								function(_node, _className) { _Uize_Dom_Classes[_methodName](_node, _className) }
							);
						};
					},
					_makeUizeNodeClassesVoidStateMethod = function(_methodName, _uizeDomClassesMethodName) { // class state methods
						_objectPrototype[_methodName] = function() {
							_Uize_Dom_Classes[_uizeDomClassesMethodName].apply(0, [this._nodes].concat(Array.prototype.slice.call(arguments)));
							return this;
						};
					}
				;

				_makeUizeNodeClassesVoidMethod('addClass');
					/*?
						Instance Methods
							addClass
								Adds the specified class name(s) to each of the set of matched DOM nodes, provided the class name(s) is(are) not already present.

								SYNTAX
								........................................................
								myWeb = myWeb.addClass(classNameSTR);
								........................................................

								VARIATION
								........................................................
								myWeb = myWeb.addClass(classNameFUNC);
								........................................................

								NOTES
								- Returns a reference to the same =Uize.Web= object
								- See the companion =removeClass= method
								- See the related =hasClass= and =toggleClass= methods
								- See also the =setClassState= method
								- For more details see the =addClass= method of the =Uize.Dom.Classes= module
					*/

				_objectPrototype.getClassState = function(_stateClasses, _returnAll) {
					return this._handleGetAction(
						function(_node) { return _Uize_Dom_Classes.getState(_node, _stateClasses) },
						_returnAll
					);
					/*?
						Instance Methods
							getClassState
								Returns a boolean or integer (a value of the type stateBOOLorINT), indicating the current state for the specified state classes for each of the set of matched DOM nodes.

								SYNTAX
								........................................................
								stateBOOLorINT = myWeb.getClassState(stateClassesSTRorARRAY); // first matched node
								........................................................

								VARIATION
								........................................................
								statesARRAY = myWeb.getClassState(stateClassesSTRorARRAY, returnAllBOOL); // all matched nodes
								........................................................

								NOTES
								- If =returnAllBOOL= is set to =true=, then the return value for each of the matched nodes is wrapped in an array (even if there's only one matched node). If =returnAllBOOL= is =false= or unspecified (=undefined=), only the value for the first matched node is returned. See `Dynamic Methods Return Values` for more info.
								- See the companion =setClassState=, =toggleClassState=, and =removeClassState= methods
								- For more details see the =getState= method of the =Uize.Dom.Classes= module
					*/
				};
				_objectPrototype.hasClass = function(_class) {
					var
						m = this,
						_nodes = m._nodes,
						_nodesLength = _nodes.length,
						_nodeNo = -1
					;

					for (; ++_nodeNo < _nodesLength;)
						if (_Uize_Dom_Classes.hasClass(_nodes[_nodeNo], _class))
							return _true;

					return _false;
					/*?
						Instance Methods
							hasClass
								Returns a boolean indicating whether or not any node within the set of matched DOM nodes contains the specified CSS class.

								SYNTAX
								........................................................
								hasClassBOOL = myWeb.hasClass(classNameSTR);
								........................................................

								NOTES
								- See the related =addClass=, =toggleClass=, and =removeClass= methods
								- See also the =getClassState= method
								- For more details see the =hasClass= method of the =Uize.Dom.Classes= module
					*/
				};
				_makeUizeNodeClassesVoidMethod('removeClass');
					/*?
						Instance Methods
							removeClass
								Removes the specified class name(s) from each of the set of matched DOM nodes, provided the class name(s) is(are) present.

								SYNTAX
								........................................................
								myWeb = myWeb.removeClass(classNameSTR);
								........................................................

								VARIATION
								........................................................
								myWeb = myWeb.removeClass(classNameFUNC);
								........................................................

								NOTES
								- Returns a reference to the same =Uize.Web= object
								- See the companion =addClass= method
								- See the related =hasClass= and =toggleClass= methods
								- See also the =removeClassState= method
								- For more details see the =removeClass= method of the =Uize.Dom.Classes= module
					*/
				_makeUizeNodeClassesVoidStateMethod('removeClassState', 'removeState');
					/*?
						Instance Methods
							removeClassState
								Updates each of the set of matched DOM nodes to no longer contain one of the specified state classes.

								SYNTAX
								........................................................
								myWeb = myWeb.removeClassState(classNameSTR);
								........................................................

								VARIATION
								........................................................
								myWeb = myWeb.removeClassState(classNamesARRAY);
								........................................................

								NOTES
								- Returns a reference to the same =Uize.Web= object
								- See the companion =getClassState=, =setClassState= and =toggleClassState= methods
								- For more details see the =removeState= method of the =Uize.Dom.Classes= module
					*/
				_makeUizeNodeClassesVoidStateMethod('setClassState', 'setState');
					/*?
						Instance Methods
							setClassState
								Updates each of the set of matched DOM nodes to contain the one CSS class out of the specified state classes that corresponds to the specified state.

								SYNTAX
								........................................................
								myWeb = myWeb.removeClassState(classNameSTR, stateBOOL);
								........................................................

								VARIATION
								........................................................
								myWeb = myWeb.removeClassState(classNamesARRAY, stateINT);
								........................................................

								NOTES
								- Returns a reference to the same =Uize.Web= object
								- See the companion =getClassState=, =removeClassState= and =toggleClassState= methods
								- For more details see the =setState= method of the =Uize.Dom.Classes= module
					*/
				_makeUizeNodeClassesVoidMethod('toggleClass');
					/*?
						Instance Methods
							toggleClass
								Toggles the presence of the specified class name(s) from each of the set of matched DOM nodes.

								SYNTAX
								........................................................
								myWeb = myWeb.toggleClass(classNameSTR);
								........................................................

								VARIATION
								........................................................
								myWeb = myWeb.toggleClass(classNameFUNC);
								........................................................

								NOTES
								- Returns a reference to the same =Uize.Web= object
								- See the related =addClass=, =hasClass= and =removeClass= methods
								- See also the =toggleClassState= method
								- For more details see the =toggleClass= method of the =Uize.Dom.Classes= module
					*/
				_makeUizeNodeClassesVoidStateMethod('toggleClassState', 'toggleState');
					/*?
						Instance Methods
							toggleClassState
								Updates each of the set of matched DOM nodes to contain the one CSS class out of the specified state classes that corresponds to the state that is obtained from the DOM node and then advanced by one.

								SYNTAX
								........................................................
								myWeb = myWeb.toggleClassState(classNameSTR);
								........................................................

								VARIATION
								........................................................
								myWeb = myWeb.toggleClassState(classNamesARRAY);
								........................................................

								NOTES
								- Returns a reference to the same =Uize.Web= object
								- See the companion =getClassState=, =setClassState= and =removeClassState= methods
								- See the related =toggleClass= method
								- For more details see the =toggleState= method of the =Uize.Dom.Classes= module
					*/

			/** Events **/
				_objectPrototype.domReady = function(_handler) {
					_Uize_Dom_Basics.wire(_document, 'DOMContentLoaded', _handler);
					return this;
					/*?
						Instance Methods
							domReady
								Wires the specified function to execute when the DOM is fully loaded.

								SYNTAX
								........................................................
								myWeb = myWeb.domReady(handlerFUNC);
								........................................................

								NOTES
								- Returns a reference to the same =Uize.Web= object
								- Wires the [[https://developer.mozilla.org/en-US/docs/Mozilla_event_reference/DOMContentLoaded_(event)][DOMContentLoaded]] event on the =document=
					*/
				};
				_objectPrototype.hover = function(_overHandler, _outHandler) {
					return this.mouseover(_overHandler).mouseout(_outHandler || _overHandler);
					/*?
						Instance Methods
							hover
								Wires handlers to the set of matched DOM nodes, to be executed when the mouse pointer enters and leaves the DOM nodes.

								SYNTAX
								........................................................
								myWeb = myWeb.hover(handlerInFUNC, handlerOutFUNC);
								........................................................

								VARIATION
								........................................................
								myWeb = myWeb.hover(handlerInoUTFUNC);
								........................................................

								NOTES
								- Returns a reference to the same =Uize.Web= object
					*/
				};

				_objectPrototype.trigger = function(_eventName, _eventProperties) {
					var m = this;
					if (_eventName) {
						var _event;

						if (_document.createEvent) {
							_event = _document.createEvent('HTMLEvents');
							_event.initEvent(_eventName, _true, _true);
						}
						else {
							_event = _document.createEventObject();
							_event.eventType = _eventName;
						}

						_Uize.copyInto(_event, _eventProperties);

						m._each(
							function() {
								var _node = this;
								_document.dispatchEvent
									? _node.dispatchEvent(_event)
									: _node.fireEvent('on' + _event.eventType, _event);
							}
						);
					}

					return m;
					/*?
						Instance Methods
							trigger
								Executes all the handlers attached to the set of matched DOM nodes for the specified event name.

								SYNTAX
								........................................................
								myWeb = myWeb.trigger(eventNameSTR);
								........................................................

								VARIATION
								........................................................
								myWeb = myWeb.trigger(eventNameSTR, eventPropertiesOBJ);
								........................................................

								NOTES
								- Returns a reference to the same =Uize.Web= object
					*/
				};

				_objectPrototype.unwire = function(_param1, _param2, _param3) {
					return this._wireOrUnwire('unwire', _param1, _param2, _param3);
					/*?
						Instance Methods
							unwire
								Removes previously wired event handler(s) from the set of matched DOM nodes.

								SYNTAX
								........................................................
								myWeb = myWeb.unwire(eventNameSTR, eventHandlerFUNC);
								........................................................

								VARIATION 1
								........................................................
								myWeb = myWeb.unwire(eventNameSTR, eventHandlerFUNC, selectorSTR);
								........................................................

								VARIATION 2
								........................................................
								myWeb = myWeb.unwire(eventNameSTR, returnBOOL);
								........................................................

								VARIATION 3
								........................................................
								myWeb = myWeb.unwire(eventNameSTR, returnBOOL, selectorSTR);
								........................................................

								VARIATION 4
								........................................................
								myWeb = myWeb.unwire(eventNameSTR);
								........................................................

								VARIATION 5
								........................................................
								myWeb = myWeb.unwire(eventsMapOBJ);
								........................................................

								VARIATION 6
								........................................................
								myWeb = myWeb.unwire(eventsMapOBJ, selectorSTR);
								........................................................

								VARIATION 7
								........................................................
								myWeb = myWeb.unwire();
								........................................................

								VARIATION 8
								........................................................
								myWeb = myWeb.unwire(eventNamesARRAY, eventHandlerFUNC);
								........................................................

								VARIATION 9
								........................................................
								myWeb = myWeb.unwire(eventNamesARRAY, eventHandlerFUNC, selectorSTR);
								........................................................

								VARIATION 10
								........................................................
								myWeb = myWeb.unwire(eventNamesARRAY, returnBOOL);
								........................................................

								VARIATION 11
								........................................................
								myWeb = myWeb.unwire(eventNamesARRAY, returnBOOL, selectorSTR);
								........................................................

								NOTES
								- Returns a reference to the same =Uize.Web= object
								- See companion =wire= and =wireOnce= methods
								- See also the =unwire= static method in =Uize.Dom.Basics=
					*/
				};

				_objectPrototype.wire = function(_param1, _param2, _param3) {
					return this._wireOrUnwire('wire', _param1, _param2, _param3);
					/*?
						Instance Methods
							wire
								Wires event handler(s) to the set of matched DOM nodes.

								SYNTAX
								........................................................
								myWeb = myWeb.wire(eventNameSTR, eventHandlerFUNC);
								........................................................

								VARIATION 1
								........................................................
								myWeb = myWeb.wire(eventNameSTR, eventHandlerFUNC, selectorSTR);
								........................................................

								VARIATION 2
								........................................................
								myWeb = myWeb.wire(eventNameSTR, returnBOOL);
								........................................................

								VARIATION 3
								........................................................
								myWeb = myWeb.wire(eventNameSTR, returnBOOL, selectorSTR);
								........................................................

								VARIATION 4
								........................................................
								myWeb = myWeb.wire(eventsMapOBJ);
								........................................................

								VARIATION 5
								........................................................
								myWeb = myWeb.wire(eventsMapOBJ, selectorSTR);
								........................................................

								VARIATION 6
								........................................................
								myWeb = myWeb.wire(eventNamesARRAY, eventHandlerFUNC);
								........................................................

								VARIATION 7
								........................................................
								myWeb = myWeb.wire(eventNamesARRAY, eventHandlerFUNC, selectorSTR);
								........................................................

								VARIATION 8
								........................................................
								myWeb = myWeb.wire(eventNamesARRAY, returnBOOL);
								........................................................

								VARIATION 9
								........................................................
								myWeb = myWeb.wire(eventNamesARRAY, returnBOOL, selectorSTR);
								........................................................

								NOTES
								- Returns a reference to the same =Uize.Web= object
								- See companion =unwire= and =wireOnce= methods
								- See also the =wire= static method in =Uize.Dom.Basics=
								- Calls =Uize.Dom.Event.fix= on the event object
					*/
				};

				_objectPrototype.wireOnce = function(_param1, _param2, _param3) {
					var
						m = this,
						_eventsMap = _buildEventsMap(_param1, _param2, _param3),
						_wireOnceWrapperHandler = function(_node, _eventName, _handler) {
							var _onceWrapperHandler = function(_event) {
								// unwire the event first so it's not called again
								_Uize_Dom_Basics.unwire(_node, _eventName, _onceWrapperHandler);

								// call the actual handler
								_handler(_event);
							};
							_Uize_Dom_Basics.wire(_node, _eventName, _onceWrapperHandler);
						}
					;

					_Uize.forEach(
						_eventsMap,
						function(_handler, _eventName) {
							_handler &&
								m._each(
									function() { _wireOnceWrapperHandler(this, _eventName, _handler) }
								)
							;
						}
					);

					return m;
					/*?
						Instance Methods
							wireOnce
								Wires event handler(s) to the set of matched DOM nodes, with each handler executed at most once per DOM node.

								SYNTAX
								........................................................
								myWeb = myWeb.wireOnce(eventNameSTR, eventHandlerFUNC);
								........................................................

								VARIATION 1
								........................................................
								myWeb = myWeb.wireOnce(eventNameSTR, eventHandlerFUNC, selectorSTR);
								........................................................

								VARIATION 2
								........................................................
								myWeb = myWeb.wireOnce(eventNameSTR, returnBOOL);
								........................................................

								VARIATION 3
								........................................................
								myWeb = myWeb.wireOnce(eventNameSTR, returnBOOL, selectorSTR);
								........................................................

								VARIATION 4
								........................................................
								myWeb = myWeb.wireOnce(eventsMapOBJ);
								........................................................

								VARIATION 5
								........................................................
								myWeb = myWeb.wireOnce(eventsMapOBJ, selectorSTR);
								........................................................

								VARIATION 6
								........................................................
								myWeb = myWeb.wireOnce(eventNamesARRAY, eventHandlerFUNC);
								........................................................

								VARIATION 7
								........................................................
								myWeb = myWeb.wireOnce(eventNamesARRAY, eventHandlerFUNC, selectorSTR);
								........................................................

								VARIATION 8
								........................................................
								myWeb = myWeb.wireOnce(eventNamesARRAY, returnBOOL);
								........................................................

								VARIATION 9
								........................................................
								myWeb = myWeb.wireOnce(eventNamesARRAY, returnBOOL, selectorSTR);
								........................................................

								NOTES
								- Returns a reference to the same =Uize.Web= object
								- See companion =wire= and =unwire= methods
								- See also the =wire= and =unwire= static method in =Uize.Dom.Basics=
					*/
				};

				var
					_makeWireMethod = function(_methodName, _eventNameorNames) {
						_objectPrototype[_methodName] = function(_handler, _target) { return this.wire(_eventNameorNames || _methodName, _handler, _target) };
					},
					_wireAndTriggerComboFunc = function(_eventName, _param2, _param3, _param4) {
						var
							_throttleTimeout = 0,
							_param3IsNumber = _Uize.isNumber(_param3) // _param3 is throttle when a number, otherwise selector
						;
						return _Uize_isFunction(_param2)
							? this.wire(
								_eventName,
								_param3IsNumber
									? function(_event) {
										if (!_throttleTimeout) {
											_throttleTimeout = setTimeout(
												function() {
													_throttleTimeout = 0;
													_param2(_event);
												},
												_param3
											);
										}
									}
									: _param2,
								_param3IsNumber ? _param4 : _param3
							)
							: this.trigger(_eventName, _param2)
						;
					},
					_makeWireAndTriggerComboMethod = function(_eventName) {
						_objectPrototype[_eventName] = function(_param1, _param2, _param3) {
							return _wireAndTriggerComboFunc.call(this, _eventName, _param1, _param2, _param3);
						};
					}
				;

				_makeWireAndTriggerComboMethod('blur');
					/*?
						Instance Methods
							blur
								wire
									Wires the specified event handler to the "blur" JavaScript event to the set of matched DOM nodes.

									SYNTAX
									........................................................
									myWeb = myWeb.blur(eventHandlerFUNC);
									........................................................

									VARIATION
									........................................................
									myWeb = myWeb.blur(eventHandlerFUNC, throttleINT);
									........................................................

								trigger
									Triggers a "blur" JavaScript event on the set of matched DOM nodes.

									SYNTAX
									........................................................
									myWeb = myWeb.blur();
									........................................................

								NOTES
								- Returns a reference to the same =Uize.Web= object
								- See the companion =focus= method
								- See the related =wire= and =trigger= methods
					*/
				_makeWireAndTriggerComboMethod('change');
					/*?
						Instance Methods
							change
								wire
									Wires the specified event handler to the "change" JavaScript event to the set of matched DOM nodes.

									SYNTAX
									........................................................
									myWeb = myWeb.change(eventHandlerFUNC);
									........................................................

									VARIATION
									........................................................
									myWeb = myWeb.change(eventHandlerFUNC, throttleINT);
									........................................................

								trigger
									Triggers a "change" JavaScript event on the set of matched DOM nodes.

									SYNTAX
									........................................................
									myWeb = myWeb.change();
									........................................................

								NOTES
								- Returns a reference to the same =Uize.Web= object
								- See the companion =select= method
								- See the related =wire= and =trigger= methods
					*/
				_makeWireAndTriggerComboMethod('click');
					/*?
						Instance Methods
							click
								wire
									Wires the specified event handler to the "click" JavaScript event to the set of matched DOM nodes.

									SYNTAX
									........................................................
									myWeb = myWeb.click(eventHandlerFUNC);
									........................................................

									VARIATION
									........................................................
									myWeb = myWeb.click(eventHandlerFUNC, throttleINT);
									........................................................

								trigger
									Triggers a "click" JavaScript event on the set of matched DOM nodes.

									SYNTAX
									........................................................
									myWeb = myWeb.click();
									........................................................

								NOTES
								- Returns a reference to the same =Uize.Web= object
								- See the companion =dblclick= method
								- See the related =wire= and =trigger= methods
					*/
				_makeWireAndTriggerComboMethod('dblclick');
					/*?
						Instance Methods
							dblclick
								wire
									Wires the specified event handler to the "dblclick" JavaScript event to the set of matched DOM nodes.

									SYNTAX
									........................................................
									myWeb = myWeb.dblclick(eventHandlerFUNC);
									........................................................

									VARIATION
									........................................................
									myWeb = myWeb.dblclick(eventHandlerFUNC, throttleINT);
									........................................................

								trigger
									Triggers a "dblclick" JavaScript event on the set of matched DOM nodes.

									SYNTAX
									........................................................
									myWeb = myWeb.dblclick();
									........................................................

								NOTES
								- Returns a reference to the same =Uize.Web= object
								- See the companion =click= method
								- See the related =wire= and =trigger= methods
					*/
				_makeWireMethod('error');
					/*?
						Instance Methods
							error
								Wires the specified event handler to the "error" JavaScript event to the set of matched DOM nodes.

								SYNTAX
								........................................................
								myWeb = myWeb.error(eventHandlerFUNC);
								........................................................

								NOTES
								- Returns a reference to the same =Uize.Web= object
								- See the related =wire= method
					*/
				_makeWireAndTriggerComboMethod('focus');
					/*?
						Instance Methods
							focus
								wire
									Wires the specified event handler to the "focus" JavaScript event to the set of matched DOM nodes.

									SYNTAX
									........................................................
									myWeb = myWeb.focus(eventHandlerFUNC);
									........................................................

									VARIATION
									........................................................
									myWeb = myWeb.focus(eventHandlerFUNC, throttleINT);
									........................................................

								trigger
									Triggers a "focus" JavaScript event on the set of matched DOM nodes.

									SYNTAX
									........................................................
									myWeb = myWeb.focus();
									........................................................

								NOTES
								- Returns a reference to the same =Uize.Web= object
								- See the companion =blur= method
								- See the related =wire= and =trigger= methods
					*/
				_makeWireAndTriggerComboMethod('keydown');
					/*?
						Instance Methods
							keydown
								wire
									Wires the specified event handler to the "keydown" JavaScript event to the set of matched DOM nodes.

									SYNTAX
									........................................................
									myWeb = myWeb.keydown(eventHandlerFUNC);
									........................................................

									VARIATION
									........................................................
									myWeb = myWeb.keydown(eventHandlerFUNC, throttleINT);
									........................................................

								trigger
									Triggers a "keydown" JavaScript event on the set of matched DOM nodes.

									SYNTAX
									........................................................
									myWeb = myWeb.keydown();
									........................................................

								NOTES
								- Returns a reference to the same =Uize.Web= object
								- See the companion =keypress= and =keyup= methods
								- See the related =wire= and =trigger= methods
					*/
				_makeWireAndTriggerComboMethod('keypress');
					/*?
						Instance Methods
							keypress
								wire
									Wires the specified event handler to the "keypress" JavaScript event to the set of matched DOM nodes.

									SYNTAX
									........................................................
									myWeb = myWeb.keypress(eventHandlerFUNC);
									........................................................

									VARIATION
									........................................................
									myWeb = myWeb.keypress(eventHandlerFUNC, throttleINT);
									........................................................

								trigger
									Triggers a "keypress" JavaScript event on the set of matched DOM nodes.

									SYNTAX
									........................................................
									myWeb = myWeb.keypress();
									........................................................

								NOTES
								- Returns a reference to the same =Uize.Web= object
								- See the companion =keydown= and =keyup= methods
								- See the related =wire= and =trigger= methods
					*/
				_makeWireAndTriggerComboMethod('keyup');
					/*?
						Instance Methods
							keyup
								wire
									Wires the specified event handler to the "keyup" JavaScript event to the set of matched DOM nodes.

									SYNTAX
									........................................................
									myWeb = myWeb.keyup(eventHandlerFUNC);
									........................................................

									VARIATION
									........................................................
									myWeb = myWeb.keyup(eventHandlerFUNC, throttleINT);
									........................................................

								trigger
									Triggers a "keyup" JavaScript event on the set of matched DOM nodes.

									SYNTAX
									........................................................
									myWeb = myWeb.keyup();
									........................................................

								NOTES
								- Returns a reference to the same =Uize.Web= object
								- See the companion =keydown= and =keypress= methods
								- See the related =wire= and =trigger= methods
					*/
				_makeWireMethod('load');
					/*?
						Instance Methods
							load
								Wires the specified event handler to the "load" JavaScript event to the set of matched DOM nodes.

								SYNTAX
								........................................................
								myWeb = myWeb.load(eventHandlerFUNC);
								........................................................

								NOTES
								- Returns a reference to the same =Uize.Web= object
								- See the companion =unload= method
								- See the related =wire= method
					*/
				_makeWireAndTriggerComboMethod('mousedown');
					/*?
						Instance Methods
							mousedown
								wire
									Wires the specified event handler to the "mousedown" JavaScript event to the set of matched DOM nodes.

									SYNTAX
									........................................................
									myWeb = myWeb.mousedown(eventHandlerFUNC);
									........................................................

									VARIATION
									........................................................
									myWeb = myWeb.mousedown(eventHandlerFUNC, throttleINT);
									........................................................

								trigger
									Triggers a "mousedown" JavaScript event on the set of matched DOM nodes.

									SYNTAX
									........................................................
									myWeb = myWeb.mousedown();
									........................................................

								NOTES
								- Returns a reference to the same =Uize.Web= object
								- See the companion =mouseup=, =mouseout=, =mousemove= and =mouseover= methods
								- See the related =wire= and =trigger= methods
					*/
				_makeWireAndTriggerComboMethod('mousemove');
					/*?
						Instance Methods
							mousemove
								wire
									Wires the specified event handler to the "mousemove" JavaScript event to the set of matched DOM nodes.

									SYNTAX
									........................................................
									myWeb = myWeb.mousemove(eventHandlerFUNC);
									........................................................

									VARIATION
									........................................................
									myWeb = myWeb.mousemove(eventHandlerFUNC, throttleINT);
									........................................................

								trigger
									Triggers a "mousemove" JavaScript event on the set of matched DOM nodes.

									SYNTAX
									........................................................
									myWeb = myWeb.mousemove();
									........................................................

								NOTES
								- Returns a reference to the same =Uize.Web= object
								- See the companion =mouseup=, =mouseout=, =mousedown= and =mouseover= methods
								- See the related =wire= and =trigger= methods
					*/
				_makeWireAndTriggerComboMethod('mouseout');
					/*?
						Instance Methods
							mouseout
								wire
									Wires the specified event handler to the "mouseout" JavaScript event to the set of matched DOM nodes.

									SYNTAX
									........................................................
									myWeb = myWeb.mouseout(eventHandlerFUNC);
									........................................................

									VARIATION
									........................................................
									myWeb = myWeb.mouseout(eventHandlerFUNC, throttleINT);
									........................................................

								trigger
									Triggers a "mouseout" JavaScript event on the set of matched DOM nodes.

									SYNTAX
									........................................................
									myWeb = myWeb.mouseout();
									........................................................

								NOTES
								- Returns a reference to the same =Uize.Web= object
								- See the companion =mouseup=, =mousemove=, =mousedown= and =mouseover= methods
								- See the related =wire= and =trigger= methods
					*/
				_makeWireAndTriggerComboMethod('mouseover');
					/*?
						Instance Methods
							mouseover
								wire
									Wires the specified event handler to the "mouseover" JavaScript event to the set of matched DOM nodes.

									SYNTAX
									........................................................
									myWeb = myWeb.mouseover(eventHandlerFUNC);
									........................................................

									VARIATION
									........................................................
									myWeb = myWeb.mouseover(eventHandlerFUNC, throttleINT);
									........................................................

								trigger
									Triggers a "mouseover" JavaScript event on the set of matched DOM nodes.

									SYNTAX
									........................................................
									myWeb = myWeb.mouseover();
									........................................................

								NOTES
								- Returns a reference to the same =Uize.Web= object
								- See the companion =mouseup=, =mousemove=, =mousedown= and =mouseout= methods
								- See the related =wire= and =trigger= methods
					*/
				_makeWireAndTriggerComboMethod('mouseup');
					/*?
						Instance Methods
							mouseup
								wire
									Wires the specified event handler to the "mouseup" JavaScript event to the set of matched DOM nodes.

									SYNTAX
									........................................................
									myWeb = myWeb.mouseup(eventHandlerFUNC);
									........................................................

									VARIATION
									........................................................
									myWeb = myWeb.mouseup(eventHandlerFUNC, throttleINT);
									........................................................

								trigger
									Triggers a "mouseup" JavaScript event on the set of matched DOM nodes.

									SYNTAX
									........................................................
									myWeb = myWeb.mouseup();
									........................................................

								NOTES
								- Returns a reference to the same =Uize.Web= object
								- See the companion =mouseout=, =mousemove=, =mousedown= and =mouseover= methods
								- See the related =wire= and =trigger= methods
					*/
				_objectPrototype.resize = function(_handler, _throttle) {
					var m = this;
					return _wireAndTriggerComboFunc.call(
						m,
						'resize',
						_Uize_isFunction(_handler) && m.length > 0 && m[0] == _window && _Uize_Dom_Basics.isIe && _Uize_Dom_Basics.ieMajorVersion < 9
							? function(_event) {
								var _dimensions = m.dimensions();
								if (_dimensions.width != _windowWidth || _dimensions.height != _windowHeight) {
									_windowWidth = _dimensions.width;
									_windowHeight = _dimensions.height;
									_handler(_event);
								}
							}
							: _handler,
						_throttle
					);
					/*?
						Instance Methods
							resize
								wire
									Wires the specified event handler to the "resize" JavaScript event to the set of matched DOM nodes.

									SYNTAX
									........................................................
									myWeb = myWeb.resize(eventHandlerFUNC);
									........................................................

									VARIATION
									........................................................
									myWeb = myWeb.resize(eventHandlerFUNC, throttleINT);
									........................................................

								trigger
									Triggers a "resize" JavaScript event on the set of matched DOM nodes.

									SYNTAX
									........................................................
									myWeb = myWeb.resize();
									........................................................

								NOTES
								- Returns a reference to the same =Uize.Web= object
								- See the companion =scroll= method
								- See the related =wire= and =trigger= methods
					*/
				};
				_makeWireAndTriggerComboMethod('scroll');
					/*?
						Instance Methods
							scroll
								wire
									Wires the specified event handler to the "scroll" JavaScript event to the set of matched DOM nodes.

									SYNTAX
									........................................................
									myWeb = myWeb.scroll(eventHandlerFUNC);
									........................................................

									VARIATION
									........................................................
									myWeb = myWeb.scroll(eventHandlerFUNC, throttleINT);
									........................................................

								trigger
									Triggers a "scroll" JavaScript event on the set of matched DOM nodes.

									SYNTAX
									........................................................
									myWeb = myWeb.scroll();
									........................................................

								NOTES
								- Returns a reference to the same =Uize.Web= object
								- See the companion =resize= method
								- See the related =wire= and =trigger= methods
					*/
				_makeWireAndTriggerComboMethod('select');
					/*?
						Instance Methods
							select
								wire
									Wires the specified event handler to the "select" JavaScript event to the set of matched DOM nodes.

									SYNTAX
									........................................................
									myWeb = myWeb.select(eventHandlerFUNC);
									........................................................

									VARIATION
									........................................................
									myWeb = myWeb.select(eventHandlerFUNC, throttleINT);
									........................................................

								trigger
									Triggers a "select" JavaScript event on the set of matched DOM nodes.

									SYNTAX
									........................................................
									myWeb = myWeb.select();
									........................................................

								NOTES
								- Returns a reference to the same =Uize.Web= object
								- See the companion =change= method
								- See the related =wire= and =trigger= methods
					*/
				_makeWireAndTriggerComboMethod('submit');
					/*?
						Instance Methods
							submit
								wire
									Wires the specified event handler to the "submit" JavaScript event to the set of matched DOM nodes.

									SYNTAX
									........................................................
									myWeb = myWeb.submit(eventHandlerFUNC);
									........................................................

									VARIATION
									........................................................
									myWeb = myWeb.submit(eventHandlerFUNC, throttleINT);
									........................................................

								trigger
									Triggers a "submit" JavaScript event on the set of matched DOM nodes.

									SYNTAX
									........................................................
									myWeb = myWeb.submit();
									........................................................

								NOTES
								- Returns a reference to the same =Uize.Web= object
								- See the related =wire= and =trigger= methods
					*/
				_makeWireAndTriggerComboMethod('touchcancel');
					/*?
						Instance Methods
							touchcancel
								wire
									Wires the specified event handler to the "touchcancel" JavaScript event for touch devices to the set of matched DOM nodes.

									SYNTAX
									........................................................
									myWeb = myWeb.touchcancel(eventHandlerFUNC);
									........................................................

									VARIATION
									........................................................
									myWeb = myWeb.touchcancel(eventHandlerFUNC, throttleINT);
									........................................................

								trigger
									Triggers a "touchcancel" JavaScript event for touch devices on the set of matched DOM nodes.

									SYNTAX
									........................................................
									myWeb = myWeb.touchcancel();
									........................................................

								NOTES
								- Returns a reference to the same =Uize.Web= object
								- See the companion =touchend=, =touchleave=, =touchmove= and =touchstart= methods
								- See the related =wire= and =trigger= methods
					*/
				_makeWireAndTriggerComboMethod('touchend');
					/*?
						Instance Methods
							touchend
								wire
									Wires the specified event handler to the "touchend" JavaScript event for touch devices to the set of matched DOM nodes.

									SYNTAX
									........................................................
									myWeb = myWeb.touchend(eventHandlerFUNC);
									........................................................

									VARIATION
									........................................................
									myWeb = myWeb.touchend(eventHandlerFUNC, throttleINT);
									........................................................

								trigger
									Triggers a "touchend" JavaScript event for touch devices on the set of matched DOM nodes.

									SYNTAX
									........................................................
									myWeb = myWeb.touchend();
									........................................................

								NOTES
								- Returns a reference to the same =Uize.Web= object
								- See the companion =touchcancel=, =touchleave=, =touchmove= and =touchstart= methods
								- See the related =wire= and =trigger= methods
					*/
				_makeWireAndTriggerComboMethod('touchleave');
					/*?
						Instance Methods
							touchleave
								wire
									Wires the specified event handler to the "touchleave" JavaScript event for touch devices to the set of matched DOM nodes.

									SYNTAX
									........................................................
									myWeb = myWeb.touchleave(eventHandlerFUNC);
									........................................................

									VARIATION
									........................................................
									myWeb = myWeb.touchleave(eventHandlerFUNC, throttleINT);
									........................................................

								trigger
									Triggers a "touchleave" JavaScript event for touch devices on the set of matched DOM nodes.

									SYNTAX
									........................................................
									myWeb = myWeb.touchleave();
									........................................................

								NOTES
								- Returns a reference to the same =Uize.Web= object
								- See the companion =touchcancel=, =touchend=, =touchmove= and =touchstart= methods
								- See the related =wire= and =trigger= methods
					*/
				_makeWireAndTriggerComboMethod('touchmove');
					/*?
						Instance Methods
							touchmove
								wire
									Wires the specified event handler to the "touchmove" JavaScript event for touch devices to the set of matched DOM nodes.

									SYNTAX
									........................................................
									myWeb = myWeb.touchmove(eventHandlerFUNC);
									........................................................

									VARIATION
									........................................................
									myWeb = myWeb.touchmove(eventHandlerFUNC, throttleINT);
									........................................................

								trigger
									Triggers a "touchmove" JavaScript event for touch devices on the set of matched DOM nodes.

									SYNTAX
									........................................................
									myWeb = myWeb.touchmove();
									........................................................

								NOTES
								- Returns a reference to the same =Uize.Web= object
								- See the companion =touchcancel=, =touchend=, =touchleave= and =touchstart= methods
								- See the related =wire= and =trigger= methods
					*/
				_makeWireAndTriggerComboMethod('touchstart');
					/*?
						Instance Methods
							touchstart
								wire
									Wires the specified event handler to the "touchstart" JavaScript event for touch devices to the set of matched DOM nodes.

									SYNTAX
									........................................................
									myWeb = myWeb.touchstart(eventHandlerFUNC);
									........................................................

									VARIATION
									........................................................
									myWeb = myWeb.touchstart(eventHandlerFUNC, throttleINT);
									........................................................

								trigger
									Triggers a "touchstart" JavaScript event for touch devices on the set of matched DOM nodes.

									SYNTAX
									........................................................
									myWeb = myWeb.touchstart();
									........................................................

								NOTES
								- Returns a reference to the same =Uize.Web= object
								- See the companion =touchcancel=, =touchend=, =touchleave= and =touchmove= methods
								- See the related =wire= and =trigger= methods
					*/
				_makeWireMethod('transitionend', ['transitionend', 'webkitTransitionEnd', 'oTransitionEnd', 'otransitionend']);
					/*?
						Instance Methods
							transitionend
								Wires the specified event handler to the "transitionend" JavaScript event to the set of matched DOM nodes.

								SYNTAX
								........................................................
								myWeb = myWeb.transitionend(eventHandlerFUNC);
								........................................................

								NOTES
								- Returns a reference to the same =Uize.Web= object
								- Webkit browsers (Chrome & Safari) still use the proprietary ="webkitTransitionEnd"= event, so that is wired as well
								- See the related =wire= method
					*/
				_makeWireMethod('unload');
					/*?
						Instance Methods
							unload
								Wires the specified event handler to the "unload" JavaScript event to the set of matched DOM nodes.

								SYNTAX
								........................................................
								myWeb = myWeb.unload(eventHandlerFUNC);
								........................................................

								NOTES
								- Returns a reference to the same =Uize.Web= object
								- See the companion =load= method
								- See the related =wire= method
					*/

				/* Uize.Dom.VirtualEvent */
					var
						_modClick = 'ModClick',
						_remain = 'Remain',
						_makeVirtualEventMethods = function(_events) {
							_Uize.forEach(
								_events,
								function(_eventType, _eventName) {
									_objectPrototype[_eventName] = function(_handler, _duration) {
										var m = this;

										_Uize.require(
											'Uize.Dom.VirtualEvents.' + _eventType,
											function(_virtualEventClass) {
												_Uize_Dom_Basics.wire(
													m._nodes,
													_virtualEventClass[_eventName](_duration),
													_handler
												);
											}
										);

										return m;
									};

								}
							);
						}
					;

					_makeVirtualEventMethods({
						altClick:_modClick,
							/*?
								Instance Methods
									altClick
										Wires the specified event handler to the "altClick" virtual event (the user clicks with only the alt modifier key pressed) to the set of matched DOM nodes.

										SYNTAX
										........................................................
										myWeb = myWeb.altClick(eventHandlerFUNC);
										........................................................

										NOTES
										- Returns a reference to the same =Uize.Web= object
										- See the companion =ctrlClick=, =ctrlAltClick=, =shiftClick=, =shiftAltClick=, =shiftCtrlClick= and =shiftCtrlAltClick= methods
										- See the related =click= method
										- See the =Uize.Dom.VirtualEvent= module for more information on virtual events
							*/
						ctrlAltClick:_modClick,
							/*?
								Instance Methods
									ctrlAltClick
										Wires the specified event handler to the "ctrlAltClick" virtual event (the user clicks with only the ctrl and alt modifier keys pressed) to the set of matched DOM nodes.

										SYNTAX
										........................................................
										myWeb = myWeb.ctrlAltClick(eventHandlerFUNC);
										........................................................

										NOTES
										- Returns a reference to the same =Uize.Web= object
										- See the companion =altClick=, =ctrlClick=, =shiftClick=, =shiftAltClick=, =shiftCtrlClick= and =shiftCtrlAltClick= methods
										- See the related =click= method
										- See the =Uize.Dom.VirtualEvent= module for more information on virtual events
							*/
						ctrlClick:_modClick,
							/*?
								Instance Methods
									ctrlClick
										Wires the specified event handler to the "ctrlClick" virtual event (the user clicks with only the ctrl modifier key pressed) to the set of matched DOM nodes.

										SYNTAX
										........................................................
										myWeb = myWeb.ctrlClick(eventHandlerFUNC);
										........................................................

										NOTES
										- Returns a reference to the same =Uize.Web= object
										- See the companion =altClick=, =ctrlAltClick=, =shiftClick=, =shiftAltClick=, =shiftCtrlClick= and =shiftCtrlAltClick= methods
										- See the related =click= method
										- See the =Uize.Dom.VirtualEvent= module for more information on virtual events
							*/
						keyRemainDown:_remain,
							/*?
								Instance Methods
									keyRemainDown
										Wires the specified event handler to the "keyRemainDown" virtual event (the user presses down on a key, and then holds down for a specified duration) to the set of matched DOM nodes.

										SYNTAX
										........................................................
										myWeb = myWeb.keyRemainDown(eventHandlerFUNC, durationMsINT);
										........................................................

										VARIATION
										........................................................
										myWeb = myWeb.keyRemainDown(eventHandlerFUNC);
										........................................................

										NOTES
										- Returns a reference to the same =Uize.Web= object
										- See the companion =keyRemainUp= method
										- See the related =keydown= method
										- See the =Uize.Dom.VirtualEvent= module for more information on virtual events
							*/
						keyRemainUp:_remain,
							/*?
								Instance Methods
									keyRemainUp
										Wires the specified event handler to the "keyRemainUp" virtual event (the user releases a key, and then doesn't press down again for a specified duration) to the set of matched DOM nodes.

										SYNTAX
										........................................................
										myWeb = myWeb.keyRemainUp(eventHandlerFUNC, durationMsINT);
										........................................................

										VARIATION
										........................................................
										myWeb = myWeb.keyRemainUp(eventHandlerFUNC);
										........................................................

										NOTES
										- Returns a reference to the same =Uize.Web= object
										- See the companion =keyRemainDown= method
										- See the related =keyup= method
										- See the =Uize.Dom.VirtualEvent= module for more information on virtual events
							*/
						mouseRemainDown:_remain,
							/*?
								Instance Methods
									mouseRemainDown
										Wires the specified event handler to the "mouseRemainDown" virtual event (the user moused down, and then doesn't mouse up or out for a specified duration) to the set of matched DOM nodes.

										SYNTAX
										........................................................
										myWeb = myWeb.mouseRemainDown(eventHandlerFUNC, durationMsINT);
										........................................................

										VARIATION
										........................................................
										myWeb = myWeb.mouseRemainDown(eventHandlerFUNC);
										........................................................

										NOTES
										- Returns a reference to the same =Uize.Web= object
										- See the companion =mouseRemainOut=, =mouseRemainOver=, =mouseRemainUp= method
										- See the related =mousedown= method
										- See the =Uize.Dom.VirtualEvent= module for more information on virtual events
							*/
						mouseRemainOut:_remain,
							/*?
								Instance Methods
									mouseRemainOut
										Wires the specified event handler to the "mouseRemainOut" virtual event (the user moused out, and then doesn't mouse over for a specified duration) to the set of matched DOM nodes.

										SYNTAX
										........................................................
										myWeb = myWeb.mouseRemainOut(eventHandlerFUNC, durationMsINT);
										........................................................

										VARIATION
										........................................................
										myWeb = myWeb.mouseRemainOut(eventHandlerFUNC);
										........................................................

										NOTES
										- Returns a reference to the same =Uize.Web= object
										- See the companion =mouseRemainDown=, =mouseRemainOver=, =mouseRemainUp= method
										- See the related =mouseout= method
										- See the =Uize.Dom.VirtualEvent= module for more information on virtual events
							*/
						mouseRemainOver:_remain,
							/*?
								Instance Methods
									mouseRemainOver
										Wires the specified event handler to the "mouseRemainOver" virtual event (the user moused over, and then doesn't mouse out or down for a specified duration) to the set of matched DOM nodes.

										SYNTAX
										........................................................
										myWeb = myWeb.mouseRemainOver(eventHandlerFUNC, durationMsINT);
										........................................................

										VARIATION
										........................................................
										myWeb = myWeb.mouseRemainOver(eventHandlerFUNC);
										........................................................

										NOTES
										- Returns a reference to the same =Uize.Web= object
										- See the companion =mouseRemainDown=, =mouseRemainOut=, =mouseRemainUp= method
										- See the related =mouseover= method
										- See the =Uize.Dom.VirtualEvent= module for more information on virtual events
							*/
						mouseRemainUp:_remain,
							/*?
								Instance Methods
									mouseRemainUp
										Wires the specified event handler to the "mouseRemainUp" virtual event (the user moused up, and then doesn't mouse down for a specified duration) to the set of matched DOM nodes.

										SYNTAX
										........................................................
										myWeb = myWeb.mouseRemainUp(eventHandlerFUNC, durationMsINT);
										........................................................

										VARIATION
										........................................................
										myWeb = myWeb.mouseRemainUp(eventHandlerFUNC);
										........................................................

										NOTES
										- Returns a reference to the same =Uize.Web= object
										- See the companion =mouseRemainDown=, =mouseRemainOut=, =mouseRemainOver= method
										- See the related =mouseup= method
										- See the =Uize.Dom.VirtualEvent= module for more information on virtual events
							*/
						mouseRest:_remain,
							/*?
								Instance Methods
									mouseRest
										Wires the specified event handler to the "mouseRest" virtual event (the user moused over, and then doesn't mouse out or down for a specified duration) to the set of matched DOM nodes.

										SYNTAX
										........................................................
										myWeb = myWeb.mouseRest(eventHandlerFUNC, durationMsINT);
										........................................................

										VARIATION
										........................................................
										myWeb = myWeb.mouseRest(eventHandlerFUNC);
										........................................................

										NOTES
										- Returns a reference to the same =Uize.Web= object
										- See the related =mouseRemainOver= method
										- See the =Uize.Dom.VirtualEvent= module for more information on virtual events
							*/
						remainBlurred:_remain,
							/*?
								Instance Methods
									remainBlurred
										Wires the specified event handler to the "remainBlurred" virtual event (node loses focus and remains blurred / unfocused for a specified duration) to the set of matched DOM nodes.

										SYNTAX
										........................................................
										myWeb = myWeb.remainBlurred(eventHandlerFUNC, durationMsINT);
										........................................................

										VARIATION
										........................................................
										myWeb = myWeb.remainBlurred(eventHandlerFUNC);
										........................................................

										NOTES
										- Returns a reference to the same =Uize.Web= object
										- See the companion =remainFocused= method
										- See the related =blur= method
										- See the =Uize.Dom.VirtualEvent= module for more information on virtual events
							*/
						remainFocused:_remain,
							/*?
								Instance Methods
									remainFocused
										Wires the specified event handler to the "remainFocused" virtual event (node stays focused for a specified duration) to the set of matched DOM nodes.

										SYNTAX
										........................................................
										myWeb = myWeb.remainFocused(eventHandlerFUNC, durationMsINT);
										........................................................

										VARIATION
										........................................................
										myWeb = myWeb.remainFocused(eventHandlerFUNC);
										........................................................

										NOTES
										- Returns a reference to the same =Uize.Web= object
										- See the companion =remainBlurred= method
										- See the related =focus= method
										- See the =Uize.Dom.VirtualEvent= module for more information on virtual events
							*/
						shiftAltClick:_modClick,
							/*?
								Instance Methods
									shiftAltClick
										Wires the specified event handler to the "shiftAltClick" virtual event (the user clicks with only the shift and alt modifier keys pressed) to the set of matched DOM nodes.

										SYNTAX
										........................................................
										myWeb = myWeb.shiftAltClick(eventHandlerFUNC);
										........................................................

										NOTES
										- Returns a reference to the same =Uize.Web= object
										- See the companion =altClick=, =ctrlClick=, =shiftClick=, =ctrlAltClick=, =shiftCtrlClick= and =shiftCtrlAltClick= methods
										- See the related =click= method
										- See the =Uize.Dom.VirtualEvent= module for more information on virtual events
							*/
						shiftClick:_modClick,
							/*?
								Instance Methods
									shiftClick
										Wires the specified event handler to the "shiftClick" virtual event (the user clicks with only the shift modifier key pressed) to the set of matched DOM nodes.

										SYNTAX
										........................................................
										myWeb = myWeb.shiftClick(eventHandlerFUNC);
										........................................................

										NOTES
										- Returns a reference to the same =Uize.Web= object
										- See the companion =altClick=, =ctrlAltClick=, =ctrlClick=, =shiftAltClick=, =shiftCtrlClick= and =shiftCtrlAltClick= methods
										- See the related =click= method
										- See the =Uize.Dom.VirtualEvent= module for more information on virtual events
							*/
						shiftCtrlAltClick:_modClick,
							/*?
								Instance Methods
									shiftCtrlAltClick
										Wires the specified event handler to the "shiftCtrlAltClick" virtual event (the user clicks with only the shift and ctrl modifier keys pressed) to the set of matched DOM nodes.

										SYNTAX
										........................................................
										myWeb = myWeb.shiftCtrlAltClick(eventHandlerFUNC);
										........................................................

										NOTES
										- Returns a reference to the same =Uize.Web= object
										- See the companion =altClick=, =ctrlClick=, =shiftClick=, =ctrlAltClick=, =shiftAltClick= and =shiftCtrlClick= methods
										- See the related =click= method
										- See the =Uize.Dom.VirtualEvent= module for more information on virtual events
							*/
						shiftCtrlClick:_modClick
							/*?
								Instance Methods
									shiftCtrlClick
										Wires the specified event handler to the "shiftCtrlClick" virtual event (the user clicks with only the shift and ctrl modifier keys pressed) to the set of matched DOM nodes.

										SYNTAX
										........................................................
										myWeb = myWeb.shiftCtrlClick(eventHandlerFUNC);
										........................................................

										NOTES
										- Returns a reference to the same =Uize.Web= object
										- See the companion =altClick=, =ctrlClick=, =shiftClick=, =ctrlAltClick=, =shiftAltClick= and =shiftCtrlAltClick= methods
										- See the related =click= method
										- See the =Uize.Dom.VirtualEvent= module for more information on virtual events
							*/
					});

			/** Style/CSS **/
				_makeNodeGetSetMethod(
					'css',
					function (_node, _properties) {
						return _Uize_Dom_Basics_getStyle(
							_node,
							_Uize_isString(_properties)
								? _supportsCss(_properties, _node) || _properties // if the property is not supported at all, _supportCss will return null, which causes getStyle to return an empty object
								: _getSupportedProperties(_properties, _node)
						);
					},
					function (_node, _properties) { _Uize_Dom_Basics_setStyle(_node, _getSupportedProperties(_properties, _node)) }
				);
					/*?
						Instance Methods
							css
								get
									Gets the value of one or more CSS properties for each of the set of matched DOM nodes.

									SYNTAX
									........................................................
									propertyValueSTR = myWeb.css(propertyNameSTR); // one matched node
									........................................................

									VARIATION 1
									........................................................
									propertyValuesOBJ = myWeb.css(propertyNamesARRAY); // one matched node
									........................................................

									VARIATION 2
									........................................................
									propretyValuesARRAY = myWeb.css(propertyNameSTR, returnAllBOOL); // multiple matched nodes
									........................................................

									VARIATION 3
									........................................................
									propretyValuesARRAY = myWeb.css(propertyNamesARRAY, returnAllBOOL); // multiple matched nodes
									........................................................

									NOTES
									- If =returnAllBOOL= is set to =true=, then the return value for each of the matched nodes is wrapped in an array (even if there's only one matched node). If =returnAllBOOL= is =false= or unspecified (=undefined=), only the value for the first matched node is returned. See `Dynamic Methods Return Values` for more info.

								set
									Sets one or more CSS properties for every node in the set of matched DOM nodes..

									SYNTAX
									........................................................
									myWeb = myWeb.css(propertyName, propertyValueSTR);
									........................................................

									VARIATION 1
									........................................................
									myWeb = myWeb.css(propertyName, propertyValueFUNC);
									........................................................

									VARIATION 2
									........................................................
									myWeb = myWeb.css(propertiesOBJ);
									........................................................

									NOTES
									- Returns a reference to the same =Uize.Web= object
					*/

				var
					_makeCssMethod = function(_methodName, _propertyName) {
						_objectPrototype[_methodName] = function(_propertyValue) {
							var
								m = this,
								_returnValue = m.css(_propertyName, _propertyValue)
							;
							return m == _returnValue
								? _returnValue
								: (
									_Uize_isString(_returnValue)
										? parseInt(_returnValue, 10)
										: _Uize.map(_returnValue, 'parseInt(value, 10)')
								)
							;
						};
					}
				;

				_makeCssMethod('contentHeight', 'height');
					/*?
						Instance Methods
							contentHeight
								get
									Gets the computed height for the set of matched DOM nodes, excluding padding, border and margin.

									SYNTAX
									........................................................
									heightINT = myWeb.contentHeight(); // one matched node
									........................................................

									VARIATION
									........................................................
									heightsARRAY = myWeb.contentHeight(returnAllBOOL); // multiple matched nodes
									........................................................

									The difference between =css('height')= and =contentHeight()= is that the latter returns a unit-less pixel value (i.e. =400=), while the former returns a value with the units (i.e. ="20%"=).

									Calling =height()= (as opposed to =css('height')=) is recommended when a DOM node's height needs to be used in a mathematical calculation.

									NOTES
									- If =returnAllBOOL= is set to =true=, then the return value for each of the matched nodes is wrapped in an array (even if there's only one matched node). If =returnAllBOOL= is =false= or unspecified (=undefined=), only the value for the first matched node is returned. See `Dynamic Methods Return Values` for more info.
									- Use =height= for retrieving height of the =window= object
									- Use =document.body= with =contentHeight= for the =document= object
									- See also related =height= method

								set
									Sets the CSS height for every node in the set of matched DOM nodes..

									SYNTAX
									........................................................
									myWeb = myWeb.contentHeight(heightINTorSTR);
									........................................................

									VARIATION
									........................................................
									myWeb = myWeb.contentHeight(heightFUNC);
									........................................................

									NOTES
									- Returns a reference to the same =Uize.Web= object
					*/
				_makeCssMethod('contentWidth', 'width');
					/*?
						Instance Methods
							contentWidth
								get
									Gets the computed width for the set of matched DOM nodes, excluding padding, border and margin.

									SYNTAX
									........................................................
									widthINT = myWeb.contentWidth(); // one matched node
									........................................................

									VARIATION
									........................................................
									widthsARRAY = myWeb.contentWidth(returnAllBOOL); // multiple matched nodes
									........................................................

									The difference between =css('width')= and =contentWidth()= is that the latter returns a unit-less pixel value (i.e. =400=), while the former returns a value with the units (i.e. ="20%"=).

									Calling =width()= (as opposed to =css('width')=) is recommended when a DOM node's width needs to be used in a mathematical calculation.

									NOTES
									- If =returnAllBOOL= is set to =true=, then the return value for each of the matched nodes is wrapped in an array (even if there's only one matched node). If =returnAllBOOL= is =false= or unspecified (=undefined=), only the value for the first matched node is returned. See `Dynamic Methods Return Values` for more info.
									- Use =width= for retrieving height of the =window= object
									- Use =document.body= with =contentWidth= for the =document= object
									- See related =width= method

								set
									Sets the CSS width for every node in the set of matched DOM nodes..

									SYNTAX
									........................................................
									myWeb = myWeb.contentWidth(widthINTorSTR);
									........................................................

									VARIATION
									........................................................
									myWeb = myWeb.contentWidth(widthFUNC);
									........................................................

									NOTES
									- Returns a reference to the same =Uize.Web= object
					*/
				_makeCssMethod('opacity', 'opacity');
					/*?
						Instance Methods
							opacity
								get
									Gets the opacity for the set of matched DOM nodes.

									SYNTAX
									........................................................
									opacityFLOAT = myWeb.opacity(); // one matched node
									........................................................

									VARIATION
									........................................................
									opacitiesARRAY = myWeb.opacity(returnAllBOOL); // multiple matched nodes
									........................................................

									NOTES
									- If =returnAllBOOL= is set to =true=, then the return value for each of the matched nodes is wrapped in an array (even if there's only one matched node). If =returnAllBOOL= is =false= or unspecified (=undefined=), only the value for the first matched node is returned. See `Dynamic Methods Return Values` for more info.

								set
									Sets the CSS opacity for every node in the set of matched DOM nodes..

									SYNTAX
									........................................................
									myWeb = myWeb.opacity(opacityFLOAT);
									........................................................

									VARIATION
									........................................................
									myWeb = myWeb.opacity(opacityFUNC);
									........................................................

									NOTES
									- Returns a reference to the same =Uize.Web= object
					*/

				_objectPrototype.rotate = function(_param) {
					return this._handleSetAction(
						_param,
						function(_node, _rotationAngle) {
							var _supportsTransform = _supportsCss('transform', _node);
							_supportsTransform
								&& _Uize_Dom_Basics_setStyle(
									_node,
									_Uize.pairUp(
										_supportsTransform,
										'rotate(' + (_Uize.isNumber(_rotationAngle) ? _rotationAngle + 'deg' : _rotationAngle) + ')'
									)
								)
							;
						}
					);
					/*?
						Instance Methods
							rotate
								Sets the rotation angle for the set of matched DOM nodes.

								SYNTAX
								........................................................
								myWeb = myWeb.rotate(rotationAngleINT);
								........................................................

								VARIATION 1
								........................................................
								myWeb = myWeb.rotate(rotationAngleSTR);
								........................................................

								VARIATION 2
								........................................................
								myWeb = myWeb.rotate(rotationAngleFUNC);
								........................................................

								NOTES
								- Does not work in IE < 9
								- Abstracts the differences between how rotations are achieved in different browsers
								- Returns a reference to the same =Uize.Web= object
					*/
				};

				_objectPrototype.supportsCss = function(_propertyName, _returnAll) {
					return this._handleGetAction(
						function(_node) { return _supportsCss(_propertyName, _node) },
						_returnAll
					);
					/*?
						Instance Methods
							supportsCss
								Gets whether or not the set of matched DOM nodes supports the specified CSS property name in the current environment (i.e. browser).

								SYNTAX
								........................................................
								supportsSTR = myWeb.supportsCss(propertyNameSTR); // one matched node
								........................................................

								VARIATION
								........................................................
								supportsARRAY = myWeb.supportsCss(propertyNameSTR, returnAllBOOL); // multiple matched nodes
								........................................................

								NOTES
								- Use this method instead of browser version testing to determine if a given CSS property is supported by the browser
								- If =returnAllBOOL= is set to =true=, then the return value for each of the matched nodes is wrapped in an array (even if there's only one matched node). If =returnAllBOOL= is =false= or unspecified (=undefined=), only the value for the first matched node is returned. See `Dynamic Methods Return Values` for more info.
								- See also =Uize.Web.supportsCss= static method
					*/
				};

				/** Display-related methods **/
					var _makeDisplayMethod = function(_methodName, _mustDisplay) {
						_objectPrototype[_methodName] = function() { return this._display(_mustDisplay) };
					};

					_objectPrototype.display = function(_mustDisplay) {
						return this._display(_mustDisplay === _undefined || !!_mustDisplay);
						/*?
							Instance Methods
								display
									Displays or hides each of the set of matched DOM nodes.

									SYNTAX
									........................................................
									myWeb = myWeb.display(mustDisplayBOOL);
									........................................................

									VARIATION
									........................................................
									myWeb = myWeb.display();
									........................................................

									NOTES
									- Returns a reference to the same =Uize.Web= object
									- See the companion =show=, =hide= and =toggleShow= methods
						*/
					};
					_makeDisplayMethod('show', _true);
						/*?
							Instance Methods
								show
									Displays each of the set of matched DOM nodes.

									SYNTAX
									........................................................
									myWeb = myWeb.show();
									........................................................

									NOTES
									- Returns a reference to the same =Uize.Web= object
									- See the companion =hide= and =toggleShow= methods
						*/
					_makeDisplayMethod('hide', _false);
						/*?
							Instance Methods
								hide
									Hides each of the set of matched DOM nodes.

									SYNTAX
									........................................................
									myWeb = myWeb.hide();
									........................................................

									NOTES
									- Returns a reference to the same =Uize.Web= object
									- See the companion =display= and =toggleShow= methods
						*/
					_makeDisplayMethod('toggleShow');
						/*?
							Instance Methods
								toggleShow
									Displays or hides each of the set of matched DOM nodes, depending on their current displayed state.

									SYNTAX
									........................................................
									myWeb = myWeb.toggleShow();
									........................................................

									NOTES
									- Returns a reference to the same =Uize.Web= object
									- See the companion =display= and =hide= methods
						*/
					_objectPrototype.visible = function() {
						this.visibility(_true);
						/*?
							Instance Methods
								visible
									Sets the visibility of each of the set of matched DOM nodes to visible.

									SYNTAX
									........................................................
									myWeb = myWeb.visible();
									........................................................

									NOTES
									- Returns a reference to the same =Uize.Web= object
									- See the companion =invisible= and =visibility= methods
						*/
					};
					_objectPrototype.invisible = function() {
						this.visibility(_false);
						/*?
							Instance Methods
								invisible
									Sets the visibility of each of the set of matched DOM nodes to invisible.

									SYNTAX
									........................................................
									myWeb = myWeb.invisible();
									........................................................

									NOTES
									- Returns a reference to the same =Uize.Web= object
									- See the companion =visible= and =visibility= methods
						*/
					};
					_objectPrototype.visibility = function(_mustShow) {
						this._handleSetAction(_mustShow, _Uize_Dom_Basics.show);
						/*?
							Instance Methods
								show
									Sets the visibility of each of the set of matched DOM nodes to visible or invisible.

									SYNTAX
									........................................................
									myWeb = myWeb.visibility(mustShowBOOL);
									........................................................

									VARIATION
									........................................................
									myWeb = myWeb.visibility();
									........................................................

									NOTES
									- Returns a reference to the same =Uize.Web= object
									- See the companion =visible= and =invisible= methods
						*/
					};


			/** Node Info/Manipulation **/
				var
					_makeMapPropertyMethod = function(_methodName, _propertyName) {
						// Creates a method that accesses/sets a property on the nodes by basically calling the property method
						// with any specified parameters
						_objectPrototype[_methodName] = function(_param1) { return this.property(_propertyName || _methodName, _param1) };
					},
					_makeScrollPositionMethod = function(_horizontal) {
						var
							_windowPropertyName = _horizontal ? 'pageXOffset' : 'pageYOffset',
							_domNodePropertyName = _horizontal ? 'scrollLeft' : 'scrollTop',
							_getPropertyName = function(_node) { return _node == _window ? _windowPropertyName : _domNodePropertyName }
						;
						_objectPrototype[_domNodePropertyName] = function(_returnAllOrValueToSet) {
							return this._handleGetOrSetAction(
								function(_node) { return _node[_getPropertyName(_node)] },
								_returnAllOrValueToSet,
								function(_node, _scrollValue) { _node[_getPropertyName(_node)] = _scrollValue }
							);
						};
					}
				;

				_makeNodeGetSetMethod(
					'attribute',
					_makeGetNodeInfoFunction(
						function (_node, _attributeName) { return _node.getAttribute(_attributeName) }
					),
					function(_node, _attributes) {
						for (var _attributeName in _attributes)
							_node.setAttribute(_attributeName, _attributes[_attributeName])
						;
					}
					/*?
						Instance Methods
							attribute
								get
									Gets the value of one or more attributes with the specified attribute name for each of the set of matched DOM nodes.

									SYNTAX
									........................................................
									attributeSTR = myWeb.attribute(attributeNameSTR); // one matched node
									........................................................

									VARIATION 1
									........................................................
									attributesOBJ = myWeb.attribute(attributesARRAY); // one matched node
									........................................................

									VARIATION 2
									........................................................
									attributesARRAY = myWeb.attribute(attributeNameSTR, returnAllBOOL); // multiple matched nodes
									........................................................

									VARIATION 3
									........................................................
									attributesARRAY = myWeb.attribute(attributesARRAY, returnAllBOOL); // multiple matched nodes
									........................................................

									NOTES
									- If =returnAllBOOL= is set to =true=, then the return value for each of the matched nodes is wrapped in an array (even if there's only one matched node). If =returnAllBOOL= is =false= or unspecified (=undefined=), only the value for the first matched node is returned. See `Dynamic Methods Return Values` for more info.
									- See related =property= method

								set
									Sets one or more attributes for the set of matched DOM nodes.

									SYNTAX
									........................................................
									myWeb = myWeb.attribute(attributeNameSTR, valueSTR);
									........................................................

									VARIATION 1
									........................................................
									myWeb = myWeb.attribute(attributesOBJ);
									........................................................

									VARIATION 2
									........................................................
									myWeb = myWeb.attribute(attributeNameSTR, valueFUNC);
									........................................................

									NOTES
									- Returns a reference to the same =Uize.Web= object
									- See related =property= method
									- See related =removeAttribute= method
					*/
				);

				_objectPrototype.coords = function(_param1, _param2) {
					return this._handleGetOrSetAction(
						function(_node) {
							var
								_coords = _Uize_Dom_Pos.getCoords(_node),
								_documentElement = _document.documentElement,
								_documentBody = _document.body
							;
							return {// optionally make coordinates window-relative
								left:_coords.left - (_param1 ? _window.pageXOffset || _documentElement.scrollLeft || _documentBody.scrollLeft : 0),
								top:_coords.top - (_param1 ? _window.pageYOffset || _documentElement.scrollTop || _documentBody.scrollTop : 0)
							};
						},
						_param1 == _undefined || _Uize_isBoolean(_param1) ? _param2 : _param1, // param2 contains returnAll when getting, param1 is the value when setting
						function(_node, _value) {
							var _currentPosition = _Uize_Dom_Basics_getStyle(_node, 'position');

							// first override all positioning so we can figure out where it naturally falls
							_Uize_Dom_Basics_setStyle(
								_node,
								{
									position:_currentPosition == 'static' ? 'relative' : _currentPosition,
									left:'auto',
									right:'auto',
									top:'auto',
									bottom:'auto'
								}
							);

							// next get coords
							var _currentCoords = _Uize_Dom_Pos.getCoords(_node);

							// lastly position relative to where we want to go
							_Uize_Dom_Basics_setStyle(
								_node,
								{
									left:-_currentCoords.left
										+ (_value.left == _undefined ? _currentCoords.left : _value.left) // omitting left will just leave it where it is
										+ (_param2 ? _window.pageXOffset : 0), // make coordinates window-relative
									top:-_currentCoords.top
										+ (_value.top == _undefined ? _currentCoords.top : _value.top) // omitting top will just leave it where it is
										+ (_param2 ? _window.pageYOffset : 0) // make coordinates window-relative
								}
							);
						}
					);
					/*?
						Instance Methods
							coords
								get
									Gets the coordinates of the current set of matched DOM nodes, relative to the document.

									SYNTAX
									........................................................
									coordsOBJ = myWeb.coords(); // one matched node
									........................................................

									VARIATION 1
									........................................................
									coordsOBJ = myWeb.coords(windowRelativeBOOL); // one matched node
									........................................................

									VARIATION 2
									........................................................
									corodsARRAY = myWeb.coords(windowRelativeBOOL, returnAllBOOL); // multiple matched nodes
									........................................................

									NOTES
									- If =returnAllBOOL= is set to =true=, then the return value for each of the matched nodes is wrapped in an array (even if there's only one matched node). If =returnAllBOOL= is =false= or unspecified (=undefined=), only the value for the first matched node is returned. See `Dynamic Methods Return Values` for more info.
									- See related =offset= method

								set
									Sets the coordinates of every node in the set of matched DOM nodes, relative to the document.

									SYNTAX
									........................................................
									myWeb = myWeb.coords(coordinatesOBJ);
									........................................................

									VARIATION 1
									........................................................
									myWeb = myWeb.coords(coordinatesOBJ, windowRelativeBOOL);
									........................................................

									VARIATION 2
									........................................................
									myWeb = myWeb.coords(coordinatesFUNC);
									........................................................

									VARIATION 3
									........................................................
									myWeb = myWeb.coords(coordinatesFUNC, windowRelativeBOOL);
									........................................................

									NOTES
									- Returns a reference to the same =Uize.Web= object
					*/
				};

				_objectPrototype.dimensions = function(_includeMargins, _returnAll) {
					return this._handleGetAction(
						function(_node) { return _getDimensions(_node, _includeMargins) },
						_returnAll
					);
					/*?
						Instance Methods
							dimensions
								Gets the computed dimensions for the set of matched DOM nodes, including padding, border, and optionally margin.

								SYNTAX
								........................................................
								dimensionsOBJ = myWeb.dimensions(); // one matched node
								........................................................

								VARIATION 1
								........................................................
								dimensionsWithMarginsOBJ = myWeb.dimensions(includeMarginBOOL); // one matched node
								........................................................

								VARIATION 2
								........................................................
								dimensionsWithMarginsARRAY = myWeb.dimensions(includeMarginBOOL, returnAllBOOL); // multiple matched nodes
								........................................................

								NOTES
								- Return values are integers (without 'px', 'em', etc.)
								- If =returnAllBOOL= is set to =true=, then the return value for each of the matched nodes is wrapped in an array (even if there's only one matched node). If =returnAllBOOL= is =false= or unspecified (=undefined=), only the value for the first matched node is returned. See `Dynamic Methods Return Values` for more info.
					*/
				};

				_objectPrototype.height = function(_includeMargins, _returnAll) {
					return this._handleGetAction(
						function(_node) { return _getDimensions(_node, _includeMargins).height },
						_returnAll
					);
					/*?
						Instance Methods
							height
								Gets the computed height for the set of matched DOM nodes, including padding, border, and optionally margin.

								SYNTAX
								........................................................
								heightINT = myWeb.height(); // one matched node
								........................................................

								VARIATION 1
								........................................................
								heightWithMarginsINT = myWeb.height(includeMarginBOOL); // one matched node
								........................................................

								VARIATION 2
								........................................................
								heightWithMarginsARRAY = myWeb.height(includeMarginBOOL, returnAllBOOL); // multiple matched nodes
								........................................................

								NOTES
								- Return values are integers (without 'px', 'em', etc.)
								- If =returnAllBOOL= is set to =true=, then the return value for each of the matched nodes is wrapped in an array (even if there's only one matched node). If =returnAllBOOL= is =false= or unspecified (=undefined=), only the value for the first matched node is returned. See `Dynamic Methods Return Values` for more info.
					*/
				};

				_objectPrototype.html = function(_returnAllOrValueToSet) {
					return this._handleGetOrSetAction(
						function(_node) { return _node.innerHTML },
						_returnAllOrValueToSet,
						_Uize_Dom_Basics.setInnerHtml
					);
					/*?
						Instance Methods
							html
								get
									Gets the HTML contents for each of the set of matched DOM nodes.

									SYNTAX
									........................................................
									htmlSTR = myWeb.html(); // one matched node
									........................................................

									VARIATION
									........................................................
									htmlARRAY = myWeb.html(returnAllBOOL); // multiple matched nodes
									........................................................

									NOTES
									- If =returnAllBOOL= is set to =true=, then the return value for each of the matched nodes is wrapped in an array (even if there's only one matched node). If =returnAllBOOL= is =false= or unspecified (=undefined=), only the value for the first matched node is returned. See `Dynamic Methods Return Values` for more info.

								set
									Sets the HTML of every node in the set of matched DOM nodes.

									SYNTAX
									........................................................
									myWeb = myWeb.html(htmlSTR);
									........................................................

									VARIATION
									........................................................
									myWeb = myWeb.html(htmlFUNC);
									........................................................

									NOTES
									- Returns a reference to the same =Uize.Web= object
					*/
				};

				_objectPrototype.innerHeight = function(_returnAll) {
					return this._handleGetAction(function(_node) { return _node.clientHeight }, _returnAll);
					/*?
						Instance Methods
							innerHeight
								Gets the computed height for the set of matched DOM nodes, including padding, but not border or margin.

								SYNTAX
								........................................................
								innerHeightINT = myWeb.innerHeight(); // one matched node
								........................................................

								VARIATION
								........................................................
								innerHeightARRAY = myWeb.innerHeight(returnAllBOOL); // multiple matched nodes
								........................................................

								NOTES
								- Return values are integers (without 'px', 'em', etc.)
								- If =returnAllBOOL= is set to =true=, then the return value for each of the matched nodes is wrapped in an array (even if there's only one matched node). If =returnAllBOOL= is =false= or unspecified (=undefined=), only the value for the first matched node is returned. See `Dynamic Methods Return Values` for more info.
					*/
				};

				_objectPrototype.innerWidth = function(_returnAll) {
					return this._handleGetAction(function(_node) { return _node.clientWidth }, _returnAll);
					/*?
						Instance Methods
							innerWidth
								Gets the computed width for the set of matched DOM nodes, including padding, but not border or margin.

								SYNTAX
								........................................................
								innerWidthINT = myWeb.innerWidth(); // one matched node
								........................................................

								VARIATION
								........................................................
								innerWidthARRAY = myWeb.innerWidth(returnAllBOOL); // multiple matched nodes
								........................................................

								NOTES
								- Return values are integers (without 'px', 'em', etc.)
								- If =returnAllBOOL= is set to =true=, then the return value for each of the matched nodes is wrapped in an array (even if there's only one matched node). If =returnAllBOOL= is =false= or unspecified (=undefined=), only the value for the first matched node is returned. See `Dynamic Methods Return Values` for more info.
					*/
				};

				_objectPrototype.offset = function(_param1, _param2) {
					var _hasSelector = !_Uize.isBoolean(_param1) && _param1;
					return this._handleGetAction(
						function(_node) {
							if (_hasSelector)  {
								var
									_nodeCoords = _Uize_Dom_Pos.getCoords(_node),
									_offsetParentNode = _getOffsetParent(_node, _param1),
									_offsetParentCoords = _offsetParentNode
										? _Uize_Dom_Pos.getCoords(_offsetParentNode)
										: {top:0,left:0}
								;
								return {
									top:_nodeCoords.top - _offsetParentCoords.top,
									left:_nodeCoords.left - _offsetParentCoords.left
								};
							}
							else
								return {
									top:_node.offsetTop,
									left:_node.offsetLeft
								};
						},
						_hasSelector ? _param2 : _param1
					);
					/*?
						Instance Methods
							offset
								Gets the coordinates of the current set of matched DOM nodes, relative to the offset parent matching the (optional) selector.

								SYNTAX
								........................................................
								coordsOBJ = myWeb.offset(); // one matched node
								........................................................

								VARIATION 1
								........................................................
								coordsOBJ = myWeb.offset(selectorSTR); // one matched node
								........................................................

								VARIATION 2
								........................................................
								coordsOBJ = myWeb.offset(nodeOBJ); // one matched node
								........................................................

								VARIATION 3
								........................................................
								corodsARRAY = myWeb.offset(returnAllBOOL); // multiple matched nodes
								........................................................

								VARIATION 4
								........................................................
								corodsARRAY = myWeb.offset(selectorSTR, returnAllBOOL); // multiple matched nodes
								........................................................

								VARIATION 5
								........................................................
								corodsARRAY = myWeb.offset(nodeOBJ, returnAllBOOL); // multiple matched nodes
								........................................................

								NOTES
								- If =returnAllBOOL= is set to =true=, then the return value for each of the matched nodes is wrapped in an array (even if there's only one matched node). If =returnAllBOOL= is =false= or unspecified (=undefined=), only the value for the first matched node is returned. See `Dynamic Methods Return Values` for more info.
								- See related =coords= and =offsetParent= method
					*/
				};

				_objectPrototype.offsetParent = function(_selector) {
					return _object(
						this._handleGetAction(
							function(_node) { return _getOffsetParent(_node, _selector) },
							_true
						)
					);
					/*?
						Instance Methods
							offsetParent
								For each of the set of matched DOM nodes, gets the closest ancestor DOM node that is positioned and matches the (optional) selector), wrapped a new =Uize.Web= object.

								SYNTAX
								........................................................
								newWeb = myWeb.offsetParent();
								........................................................

								VARIATION 1
								........................................................
								newWeb = myWeb.offsetParent(selectorSTR);
								........................................................

								VARIATION 2
								........................................................
								newWeb = myWeb.offsetParent(nodeOBJ);
								........................................................

								NOTES
								- See related =offset= method
					*/
				};

				_makeNodeGetSetMethod(
					'property',
					_makeGetNodeInfoFunction(function (_node, _propertyName) { return _node[_propertyName] }),
					_Uize_Dom_Basics.setProperties
					/*?
						Instance Methods
							property
								get
									Gets the value of one or more properties with the specified property name for each of the set of matched DOM nodes.

									SYNTAX
									........................................................
									propertySTR = myWeb.property(propertyNameSTR); // one matched node
									........................................................

									VARIATION 1
									........................................................
									propertiesOBJ = myWeb.property(propertiesARRAY); // one matched node
									........................................................

									VARIATION 2
									........................................................
									propertiesARRAY = myWeb.property(propertyNameSTR, returnAllBOOL); // multiple matched nodes
									........................................................

									VARIATION 3
									........................................................
									propertiesARRAY = myWeb.property(propertiesARRAY, returnAllBOOL); // multiple matched nodes
									........................................................

									NOTES
									- If =returnAllBOOL= is set to =true=, then the return value for each of the matched nodes is wrapped in an array (even if there's only one matched node). If =returnAllBOOL= is =false= or unspecified (=undefined=), only the value for the first matched node is returned. See `Dynamic Methods Return Values` for more info.
									- See related =attribute= method

								set
									Sets one or more property for the set of matched DOM nodes.

									SYNTAX
									........................................................
									myWeb = myWeb.property(propertyNameSTR, valueSTR);
									........................................................

									VARIATION 1
									........................................................
									myWeb = myWeb.property(propertiesOBJ);
									........................................................

									VARIATION 2
									........................................................
									myWeb = myWeb.property(propertyNameSTR, valueFUNC);
									........................................................

									NOTES
									- Returns a reference to the same =Uize.Web= object
									- See related =attribute= method
					*/
				);

				_objectPrototype.removeAttribute = function(_attributeName) {
					var
						_attributeNames = _Uize_isArray(_attributeName) ? _attributeName : [_attributeName],
						_attributeNamesLength = _attributeNames.length,
						_attributeNamesNo
					;

					return this._handleSetAction(
						_attributeNames,
						function(_node) {
							for (_attributeNamesNo = -1; ++_attributeNamesNo < _attributeNamesLength;)
								_node.removeAttribute(_attributeNames[_attributeNamesNo])
							;
						}
					);
					/*?
						Instance Methods
							removeAttribute
								Removes one or more attributes from each DOM node in the set of matched DOM nodes.

								SYNTAX
								........................................................
								myWeb = myWeb.removeAttribute(attributeNameSTR);
								........................................................

								VARIATION
								........................................................
								myWeb = myWeb.removeAttribute(attributeNamesARRAY);
								........................................................

								NOTES
								- Returns a reference to the same =Uize.Web= object
								- See also related =attribute= method
					*/
				};

				_makeScrollPositionMethod(_true);
					/*?
						Instance Methods
							scrollLeft
								get
									Gets the horizontal position of the scroll bar for the set of matched DOM nodes.

									SYNTAX
									........................................................
									scrollLeftINT = myWeb.scrollLeft(); // one matched node
									........................................................

									VARIATION
									........................................................
									scrollLeftARRAY = myWeb.scrollLeft(returnAllBOOL); // multiple matched nodes
									........................................................

									NOTES
									- If =returnAllBOOL= is set to =true=, then the return value for each of the matched nodes is wrapped in an array (even if there's only one matched node). If =returnAllBOOL= is =false= or unspecified (=undefined=), only the value for the first matched node is returned. See `Dynamic Methods Return Values` for more info.
									- See related =scrollTop=, =scrollHeight= and =scrollWidth= methods

								set
									Sets the horizontal position of the scroll bar for the set of matched DOM nodes.

									SYNTAX
									........................................................
									myWeb = myWeb.scrollLeft(valueINT);
									........................................................

									VARIATION
									........................................................
									myWeb = myWeb.scrollLeft(valueFUNC);
									........................................................

									NOTES
									- Returns a reference to the same =Uize.Web= object
									- See related =scrollTop= method
					*/

				_makeMapPropertyMethod('scrollHeight');
					/*?
						Instance Methods
							scrollHeight
								Gets the height of the scroll view for the set of matched DOM nodes, including padding, but not margin.

								SYNTAX
								........................................................
								scrollHeightINT = myWeb.scrollHeight();
								........................................................

								VARIATION
								........................................................
								scrollHeightINT = myWeb.scrollHeight(returnAllBOOL); // multiple matched nodes
								........................................................

								NOTES
								- If =returnAllBOOL= is set to =true=, then the return value for each of the matched nodes is wrapped in an array (even if there's only one matched node). If =returnAllBOOL= is =false= or unspecified (=undefined=), only the value for the first matched node is returned. See `Dynamic Methods Return Values` for more info.
								- See related =scrollTop=, =scrollLeft= and =scrollWidth= methods
					*/

				_makeScrollPositionMethod();
					/*?
						Instance Methods
							scrollTop
								get
									Gets the vertical position of the scroll bar for each of the set of matched DOM nodes.

									SYNTAX
									........................................................
									scrollTopINT = myWeb.scrollTop(); // one matched node
									........................................................

									VARIATION
									........................................................
									scrollTopARRAY = myWeb.scrollTop(returnAllBOOL); // multiple matched nodes
									........................................................

									NOTES
									- If =returnAllBOOL= is set to =true=, then the return value for each of the matched nodes is wrapped in an array (even if there's only one matched node). If =returnAllBOOL= is =false= or unspecified (=undefined=), only the value for the first matched node is returned. See `Dynamic Methods Return Values` for more info.
									- See related =scrollLeft= method

								set
									Sets the vertical position of the scroll bar for the set of matched DOM nodes.

									SYNTAX
									........................................................
									myWeb = myWeb.scrollTop(valueINT);
									........................................................

									VARIATION
									........................................................
									myWeb = myWeb.scrollTop(valueFUNC);
									........................................................

									NOTES
									- Returns a reference to the same =Uize.Web= object
									- See related =scrollLeft=, =scrollHeight= and =scrollWidth= methods
					*/

				_makeMapPropertyMethod('scrollWidth');
					/*?
						Instance Methods
							scrollWidth
								Gets the width of the scroll view for the set of matched DOM nodes, including padding, but not margin.

								SYNTAX
								........................................................
								scrollHeightINT = myWeb.scrollWidth();
								........................................................

								VARIATION
								........................................................
								scrollWidthINT = myWeb.scrollWidth(returnAllBOOL); // multiple matched nodes
								........................................................

								NOTES
								- If =returnAllBOOL= is set to =true=, then the return value for each of the matched nodes is wrapped in an array (even if there's only one matched node). If =returnAllBOOL= is =false= or unspecified (=undefined=), only the value for the first matched node is returned. See `Dynamic Methods Return Values` for more info.
								- See related =scrollTop=, =scrollLeft= and =scrollHeight= methods
					*/

				_objectPrototype.text = function(_returnAllOrValueToSet) {
					return this._handleGetOrSetAction(
						_Uize_Dom.Text.getText,
						_returnAllOrValueToSet,
						function(_node, _text) {
							_node.appendChild(_document.createTextNode(_text + '')); // coerce to a string value by invoking valueOf method
						}
					);
					/*?
						Instance Methods
							text
								get
									Gets the text contents for each of the set of matched DOM nodes, including their descendents.

									SYNTAX
									........................................................
									textSTR = myWeb.text(); // one matched node
									........................................................

									VARIATION
									........................................................
									textARRAY = myWeb.text(returnAllBOOL); // multiple matched nodes
									........................................................

									NOTES
									- If =returnAllBOOL= is set to =true=, then the return value for each of the matched nodes is wrapped in an array (even if there's only one matched node). If =returnAllBOOL= is =false= or unspecified (=undefined=), only the value for the first matched node is returned. See `Dynamic Methods Return Values` for more info.

								set
									Sets the text content of every node in the set of matched DOM nodes..

									SYNTAX
									........................................................
									myWeb = myWeb.text(textSTR);
									........................................................

									VARIATION
									........................................................
									myWeb = myWeb.text(textFUNC);
									........................................................

									NOTES
									- Returns a reference to the same =Uize.Web= object
					*/
				};

				_objectPrototype.value = function(_returnAllOrValueToSet) {
					return this._handleGetOrSetAction(
						_Uize_Dom_Basics.getValue,
						_returnAllOrValueToSet, // returnAll
						_Uize_Dom_Basics.setValue
					);
					/*?
						Instance Methods
							value
								get
									Gets the values for each of the set of matched DOM nodes.

									SYNTAX
									........................................................
									valueSTR = myWeb.value(); // one matched node
									........................................................

									VARIATION
									........................................................
									valueARRAY = myWeb.value(returnAllBOOL); // multiple matched nodes
									........................................................

									NOTES
									- If =returnAllBOOL= is set to =true=, then the return value for each of the matched nodes is wrapped in an array (even if there's only one matched node). If =returnAllBOOL= is =false= or unspecified (=undefined=), only the value for the first matched node is returned. See `Dynamic Methods Return Values` for more info.

								set
									Sets the value of every node in the set of matched DOM nodes..

									SYNTAX
									........................................................
									myWeb = myWeb.value(valueSTR);
									........................................................

									VARIATION
									........................................................
									myWeb = myWeb.value(valueFUNC);
									........................................................

									NOTES
									- Returns a reference to the same =Uize.Web= object
					*/
				};

				_objectPrototype.width = function(_includeMargins, _returnAll) {
					return this._handleGetAction(
						function(_node) { return _getDimensions(_node, _includeMargins).width },
						_returnAll
					);
					/*?
						Instance Methods
							width
								Gets the computed width for the set of matched DOM nodes, including padding, border, and optionally margin.

								SYNTAX
								........................................................
								widthINT = myWeb.width(); // one matched node
								........................................................

								VARIATION
								........................................................
								widthWithMarginsINT = myWeb.width(includeMarginBOOL); // one matched node
								........................................................

								VARIATION 2
								........................................................
								widthWithMarginsARRAY = myWeb.width(includeMarginBOOL, returnAllBOOL); // multiple matched nodes
								........................................................

								NOTES
								- Return values are integers (without 'px', 'em', etc.)
								- If =returnAllBOOL= is set to =true=, then the return value for each of the matched nodes is wrapped in an array (even if there's only one matched node). If =returnAllBOOL= is =false= or unspecified (=undefined=), only the value for the first matched node is returned. See `Dynamic Methods Return Values` for more info.
					*/
				};

		return _object;
	}
});
