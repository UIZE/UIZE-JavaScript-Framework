/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Web Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)1997-2012 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Object
	importance: 9
	codeCompleteness: 0
	testCompleteness: 0
	docCompleteness: 0
*/

/*?
	Introduction
		The =Uize.Web= module provides support for ease of selecting, traversing, styling, and wiring events of DOM nodes, among other useful operations needed for creating an interactive UI.

		*DEVELOPERS:* `Ben Ilegbodu`, original code donated by `Zazzle Inc.`
*/

Uize.module ({
	name:'Uize.Web',
	required:[
		'Uize.Node',
		'Uize.Node.Classes',
		'Uize.String'
	],
	builder:function () {
		'use strict'; // http://www.nczonline.net/blog/2012/03/13/its-time-to-start-using-javascript-strict-mode/
		
		/*** Variables for Scruncher Optimization ***/
			var
				_true = true,
				_false = false,
				_null = null,
				_undefined,
				
				_Uize = Uize,
				_Uize_Node = _Uize.Node,
				_Uize_Node_Classes = _Uize_Node.Classes,
				_Uize_String = _Uize.String,
				
				_Uize_isString = _Uize.isString,
				_Uize_isArray = _Uize.isArray,
				_Uize_isFunction = _Uize.isFunction,
				_Uize_copyInto = _Uize.copyInto,
				
				_Uize_Node_getStyle = _Uize_Node.getStyle,
				_Uize_Node_setStyle = _Uize_Node.setStyle
			;

		/*** General Variables ***/
			var
				_animationSpeeds = {
					slow:600,
					fast:200
				},
				_defaultTimingInfo = {
					module:'Uize.Fade',
					curve:'celeration',
					params:[.1, .9]
				},
				_marginsInfo = {
					width:{marginRight:1,marginLeft:1},
					height:{marginTop:1,marginBottom:1}
				},
				_timings = {
					linear:{
						curve:'linear'
					},
					'ease-in':{
						curve:'easeInPow',
						params:[1.5]
					},
					'ease-out':{
						curve:'easeOutPow',
						params:[1.5]
					},
					'ease-in-out':{
						curve:'easeInOutPow',
						params:[1.5]
					},
					bounce:{
						module:'Uize.Curve.Rubber',
						curve:'easeOutBounce'
					}
				},
				_queueLookup = {}	// global effects queue for each selector / root node combination so that duplicate selections will share the same queue for adds/stops
			;

		/*** Utility Functions ***/
			var
				_buildEventsMap = function(_param1, _param2, _param3) {
					var
						_eventsMap = _param1,
						_selector = _param3,
						_makeHandlerWrapper = function(_handler) {
							if (_handler) { // no need to do anything if the handler isn't defined
								var _handlerWrapperKey = _selector || '_handlerWrapper';
								// store a reference in the handler to the wrapper so that if they try
								// to unwire later, we'll have a reference to the actual function that was wired
								return (
									_handler[_handlerWrapperKey]
										|| (_handler[_handlerWrapperKey] = function(_event) {
												_Uize.require(
													'Uize.Node.Event',
													function(_Uize_Node_Event) {
														// always fix the event to make life easier for everyone
														_Uize_Node_Event.fix(_event);
														
														var _target = _event.target;
														
														// optionally filter target by by selector
														_isMatch(_target, _selector)
															&& _handler.call(_target, _event) // pass wired node as "this"
														;
													}
												)
											}
										)
								);
							}
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
							_eventsMapWithWrapper[_eventName] = _makeHandlerWrapper(_eventsMap[_eventName])
						;
						
						_eventsMap = _eventsMapWithWrappers;
					}
					
					return _eventsMap;
				},
				_emptyNode = function(_rootNode, _unwireChildNodes) {
					var 
						_removeAndUnwireChildNodes = function(_node) {
							var
								_childNodes = _node.childNodes,
								_childNodeNo = _childNodes.length - 1,
								_parentNode = _node.parentNode
							;
							
							// remove/unwire child nodes in reverse, so that the change in length doesn't
							// affect our indexing
							for (; _childNodeNo > 0; _childNodeNo--)
								_removeAndUnwireChildNodes(_childNodes[_childNodeNo])
							;
							
							// don't remove the root node since we're emptying
							if (_node != _rootNode) {
								// if the node is an element than unwire it (no point unwiring text nodes)
								_node.nodeType == 1
									&& _Uize_Node.unwire(_node);

								// if the node is a child of the root node, remove it (an optimization since
								// we don't actually need to remove deep descendent nodes because removing their
								// parent will remove them too)
								_parentNode == _rootNode
									&& _Uize_Node.remove(_node);
							}
						}
					;
					
					_unwireChildNodes && _removeAndUnwireChildNodes(_rootNode);
					_rootNode.innerHTML = ''; // ensure completely empty
				},
				_getDimensions = function(_node, _includeMargins) {
					var _dimensions = _Uize_Node.getDimensions(_node);
					
					if (_includeMargins) {
						for (var _marginType in _marginsInfo) {
							var
								_marginInfo = _marginsInfo[_marginType],
								_marginValues = _Uize_Node_getStyle(_node, _marginInfo)
							;
							
							for (var _marginName in _marginInfo) {
								var _marginValue = _marginValues[_marginName];
								_dimensions[_marginType] += (_marginValue == 'auto' ? 0 : parseInt(_marginValue));
							}
						}
					}
					
					return _dimensions;
				},
				_getOffsetParent = function(_node, _selector) {
					var
						_bodyNode = document.body,
						_testNode = _node.parentNode,
						_offsetParent
					;
					
					while (_testNode && _testNode != _bodyNode) {
						if (_Uize_Node_getStyle(_testNode, 'position') != 'static'
							&& _isMatch(_testNode, _selector)
						) {
							_offsetParent = _testNode;
							break;
						}
						else
							_testNode = _testNode.parentNode;
					}
					
					return _offsetParent || (_isMatch(_bodyNode, _selector) ? _bodyNode : _undefined);
				},
				_getNodeUid = function(_node) { return _node._uid || (_node._uid = _Uize.getGuid()) },
				_isMatch = function(_node, _selector) {
					_node = _Uize_Node.getById(_node);
					return (
						_selector === _undefined
							|| (_Uize_isString(_selector) && _object.matches(_node, _selector))
							|| (_Uize_Node.isNode(_selector) && _node == _selector)
					)
				},
				_select = function(_param, _rootNode) {
					var
						_nodes,
						_key
					;

					if (_Uize_isString(_param)) { // selector string
						_nodes = _object.selectCss(_param, _rootNode = _Uize_Node.getById(_rootNode));
						_key = _param + (_rootNode ? '|' + _getNodeUid(_rootNode) : '');
					}
					else if (_Uize_Node.isNode(_param)) { // node reference
						_nodes = [_param];
						_key = _getNodeUid(_param);
					}
					else if (_Uize_isArray(_param) && (!_param.length || _Uize_Node.isNode(_param[0]))) { // node array
						_nodes =  _param.concat(); // make a copy to be safe
						_key = _Uize.map(_nodes, function(_node) { return _getNodeUid(_node) }).join('|');
					}
					else if (_Uize.getClass(_param) == _object) { // Uize.Web object
						_nodes = _param.elements();
						_key = _param._key;
					}
					else {
						_nodes = [];
						_key = '';
					}

					return {_nodes:_nodes, _key:_key};
				}
			;

		/*** Constructor ***/
			var
				_object = Uize.noNew (
					function () {
						var
							_this = this,
							_selectInfo = _select(arguments[0], arguments[1]),
							_nodes = _this._nodes = _selectInfo._nodes,
							_key = _this._key = _selectInfo._key,
							_queueInfo = _queueLookup[_key] = (_queueLookup[_key] || {_queue:[], _activeFadeObjects:[]}),

							_nodesLength = _this.length = _nodes.length, // add public length property
							_nodeNo = -1,
							_queueCacheKey = []
						;
						
						/* make array-like (length proprety + numeric keys) */
							// add numeric keys
							for (; ++_nodeNo < _nodesLength;)
								_this[_nodeNo] = _nodes[_nodeNo];
							
						/* effects queue */
							_this._queue = _this.queue = _queueInfo._queue;
							_this._activeFadeObjects = _queueInfo._activeFadeObjects;
					}
				),
				_objectPrototype = _object.prototype
			;

		/*** Public Static Methods ***/
			_object.matches = function(_node, _selector) {
				var _matches = _false;
				
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
			};
			
			_object.selectCss = function(_selector, _rootNode) {
				var
					_domElement = _rootNode || document,
					_nodeList = _domElement.querySelectorAll && _domElement.querySelectorAll(_selector)
				;
				
				if (_nodeList) {
					var _newNodeList = [];
					for (var _nodeNo = -1, _nodeListLength = _nodeList.length; ++_nodeNo < _nodeListLength;)
						_newNodeList.push(_nodeList[_nodeNo])
					;
					_nodeList = _newNodeList;
				}
				
				return _nodeList || [];
			};
			
		/*** Private Instance Methods ***/
			_objectPrototype._dequeue = function() {
				var
					_this = this,
					_queue = this._queue,
					_queueLength = _queue.length
				;
				_this._queueInUse = _false; // we always call dequeue to see if there's more work to do, so in the case where there isn't, this will stay false
				if (_queueLength) {
					_this._queueInUse = _true;
					_queue.shift()(); // dequeue and call immediately
				}
			};
			
			_objectPrototype._display = function(_mustDisplay, _displayProperties, _duration, _timing, _callback) {
				var
					_this = this,
					_Uize_Node_display = _Uize_Node.display
				;
				
				if (_duration === _undefined) { // no animation
					_this._each(
						function() {
							var
								_node = this,
								_nodeMustDisplay = _mustDisplay,
								_nodeStyleDisplay = _Uize_Node_getStyle(_node, 'display'),
								_nodeIsHidden = _nodeStyleDisplay == 'none'
							;
							
							// _nodeMustDisplay will be null or undefined if we're trying to do a toggle operation.
							// then _mustDisplay will be fixed based upon whether or not the node is hidden
							if (_nodeMustDisplay == _null)
								_nodeMustDisplay = _nodeIsHidden;

							if (_nodeIsHidden == _nodeMustDisplay) { // we actually need to change the display
								if (!_nodeMustDisplay) {
									_node._display = _nodeStyleDisplay;
									_Uize_Node_display(_node, _false);
								}
								else {
									var _displayToSet = _node._display || '';

									// displayToSet might be a explicit display (like 'inline') that was set before hiding
									_Uize_Node_setStyle(_node, {display:_displayToSet});
									
									// if there was no explicit display and we attempted to just remove 'display:none' from
									// the style attribute, we need to make sure that there wasn't external CSS setting
									// display:none. If so, we need to explicitly set a display.
									!_displayToSet
										&& _Uize_Node_getStyle(_node, 'display') == 'none'
										&& _Uize_Node_display(_node)
									;
									
									// clear cached explicit display on the node
									delete _node._display;
								}
							}
						}
					);
				}
				else {
					_this._enqueue( // add to effects queue
						function() {
							var
								_opacityProperties = {opacity:0},
								_xProperties = {
									width:0,
									
									// need to do margins & paddings since we're using the style width and not offsetWidth
									marginRight:0,
									marginLeft:0,
									paddingRight:0,
									paddingLeft:0
								},
								_yProperties = {
									height:0,
									
									// need to do margins & paddings since we're using the style height and not offsetHeight
									marginTop:0,
									marginBottom:0,
									paddingTop:0,
									paddingBottom:0
								},
								
								_animateOpacity = _displayProperties._opacity,
								_animateX = _displayProperties._x,
								_animateY = _displayProperties._y,
								
								_animateProperties = _Uize_copyInto(
									{},
									_animateOpacity ? _opacityProperties : _null,
									_animateX ? _xProperties : _null,
									_animateY ? _yProperties : _null
								),
								
								_nodesLength = _this.length,
								_doneNo = 0
							;
							
							_this._each(
								function() {
									var
										_node = this,
										_nodeMustDisplay = _mustDisplay,
										_nodeIsHidden = _Uize_Node_getStyle(_node, 'display') == 'none'
									;
									
									// _mustDisplay will be null or undefined if we're trying to do a toggle operation.
									// then _mustDisplay will be fixed based upon whether or not the node is hidden
									if (_nodeMustDisplay == _null)
										_nodeMustDisplay = _nodeIsHidden;
									
									// display the node (for style calculations) by:
									// - first checking to see if it's already visible
									// - second removing display value on the node
									// - third explicitly setting display to a non-"none" value
									if (_nodeIsHidden) {
										_Uize_Node_setStyle(_node, {display:''});
										_Uize_Node_getStyle(_node, 'display') == 'none'
											&& _Uize_Node_display(_node);
									}
			
									var
										_propertiesFinal = _nodeMustDisplay
											? _Uize_Node_getStyle(_node, _animateProperties)
											: _animateProperties,
										_initialProperties = _Uize_copyInto(
											{},
											!_nodeMustDisplay || !_animateOpacity ? _opacityProperties : _null,
											!_nodeMustDisplay || !_animateX ? _xProperties : _null,
											!_nodeMustDisplay || !_animateY ? _yProperties : _null
										),
										_restoreProperties = _Uize_copyInto(
											{overflow:1,overflowX:1,overflowY:1},
											_animateProperties,
											_initialProperties
										),
										_propertiesToRestore = {}
									;
									
									// build list of style properties actually set on the node itself
									// so we can set them back when we're done
									for (var _styleProperty in _restoreProperties) {
										var _styleValue = _node.style[_styleProperty];
										_propertiesToRestore[_styleProperty] = _styleValue != 'auto' ? _styleValue : '';
									}
		
									// set initial state before
									// NOTE: setting here instead of as the "start" property of animate
									// so that it happens immediately and not after all the processing/queueing
									// going on in animate (particularly defer loading modules)
									_Uize_Node_setStyle(
										_node,
										_Uize_copyInto(
											_animateX || _animateY
												? {
													// for clipping while animating (won't actually get animated)
													overflow:'hidden',
											
													// Apparently IE doesn't update overflow when overflowX/Y are the same
													overflowX:'hidden',
													overflowY:'hidden'
												}
												: {},
											_animateProperties,
											_Uize_Node_getStyle(_node, _initialProperties)
										)
									);
									
									// create a throw-away Uize.Web. object so we can call animate on it and leverage existing code
									_object(_node).animate(
										_propertiesFinal,
										_duration,
										_timing,
										function() {
											// Now that we're done, "cleanse" the style properties by resetting them
											_Uize_Node_setStyle(_node, _propertiesToRestore);
											
											// Hide the node if we were actually trying to hide it
											!_nodeMustDisplay && _Uize_Node_display(_node, _false);
											
											// finally call callback
											_Uize_isFunction(_callback) && _callback.call(_node);
											
											// go to the next element in the effects queue (if any)
											// when all nodes have been animated
											// we could call this before the callback, just in case the callback takes
											// a while, but the callback may want to clear the queue or otherwise change
											// stuff before moving onto the next animation
											++_doneNo == _nodesLength && _this._dequeue();
										}
									);
								}
							);
						}
					);
				}
				
				return _this;
			};
		
			_objectPrototype._enqueue = function(_effectToExec) {
				this._queue.push(_effectToExec) == 1
					&& !this._queueInUse
					&& this._dequeue() // if this is the first effect added to the queue we need to start it
			};

			_objectPrototype._handleGetAction = function(_getFunc) {
				var
					_nodes = this._nodes,
					_nodesLength = _nodes.length,
					_returnValue = _null
				;

				if (_nodesLength == 1) // only one node so just return a single value
					_returnValue = _getFunc(_nodes[0]);
				else if (_nodesLength > 1) // list of nodes so return an array of values
					_returnValue = this.map(_getFunc);
				
				return _returnValue;
			};
			
			_objectPrototype._handleGetOrSetAction = function(_isGet, _getFunc, _valueToSet, _setFunc) {
				return (
					_isGet
						? this._handleGetAction(_getFunc)
						: this._handleSetAction(_valueToSet, _setFunc)
				)
			};

			_objectPrototype._handleSetAction = function(_valueToSet, _setFunc) {
				var
					_this = this,
					_nodes = _this._nodes
				;
				
				if (_Uize_isFunction(_valueToSet)) {
					for (var _nodeNo = -1, _nodesLength = _nodes.length; ++_nodeNo < _nodesLength;) {
						var _node = _nodes[_nodeNo];
						_setFunc(
							_node,
							_valueToSet.call(_node, _nodeNo, _node)
						);
					}
				}
				else
					_this._each(function() { _setFunc(this, _valueToSet) }) // call setFunc for each node instead of passing array as nodeBlob
				;
				
				return _this;
			};

			_objectPrototype._wireOrUnwire = function(_methodName, _param1, _param2, _param3) {
				_Uize_Node[_methodName](
					this._nodes,
					_buildEventsMap(_param1, _param2, _param3)
				);
				
				return this;
			};
		
		/*** Public Instance Methods ***/
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
								_param1IsObject = _Uize.isPlainObject(_param1),
								_styleProperty = _Uize_isArray(_param1) ? _Uize.lookup(_param1) : _param1
							;
							
							return this._handleGetOrSetAction(
								_param2 == _undefined && !_param1IsObject,
								function(_node) { return _getFunc(_node, _styleProperty) },
								_param1IsObject ? _param1 : _param2,
								function(_node, _value) {
									_setFunc(
										_node,
										_param1IsObject ? _param1 : _Uize.pairUp(_param1, _value)
									)
								}
							);
						}
					},
					_makeGetNodeInfoFunction = function(_getInfoFunc) {
						// NOTE: the goal of this function is to have shared code for functions that want to get some info
						// from a node (and don't exist in Uize.Node).
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
					},
					_makeIsOnNodeTreeMethod = function(_objectNodesAreRoot) {
						// NOTE: the goal of this function is to add the "contains" & "contained" methods to the prototype
						// which are basically the same, just with the root & node parameters swapped
						_objectPrototype[_objectNodesAreRoot ? 'contains' : 'contained'] = function(_nodeParam) {
							return this._handleGetAction(
								function(_node) {
									return _Uize_Node.isOnNodeTree(
										_objectNodesAreRoot ? _nodeParam : _node,
										_objectNodesAreRoot ? _node : _nodeParam
									)
								}
							)
						}
					},
					_makeScrollPositionMethod = function(_horizontal) {
						var
							_windowMethodName = _horizontal ? 'pageXOffset' : 'pageYOffset',
							_domNodeMethodName = _horizontal ? 'scrollLeft' : 'scrollTop',
							_getMethodName = function(_node) { return _node == window ? _windowMethodName : _domNodeMethodName }
						;
						_objectPrototype[_domNodeMethodName] = function(_scrollValue) {
							return this._handleGetOrSetAction(
								_scrollValue == _undefined,
								function(_node) { return _node[_getMethodName(_node)] },
								_scrollValue,
								function(_node, _value) { _node[_getMethodName(_node)] = _value }
							)
						}
					}
				;

				_objectPrototype.add = function(_selector, _rootNode) {
					var
						_mergedNodes = this._nodes.concat(),
						_mergedNodesLength = _mergedNodes.length,
						_addedNodes = _select(_selector, _rootNode)._nodes,
						_addedNodesLength = _addedNodes.length,
						_nodesLookup = {},
						_nodeNo = -1
					;
					
					// add existing nodes to lookup table for comparising from added nodes
					for (; ++_nodeNo < _mergedNodesLength;) {
						var _node = _mergedNodes[_nodeNo];
						_nodesLookup[_getNodeUid(_node)] = _node;
					}
	
					// ensure no duplicates in the nodes to add
					for (_nodeNo = -1; ++_nodeNo < _addedNodesLength;) {
						var _node = _addedNodes[_nodeNo];
						if (!_nodesLookup[_getNodeUid(_node)]) // assuming added nodes has no duplicates
							_mergedNodes.push(_node);
					}
					
					// NOTE: Right now we're making a clone of the underlying nodes, the addedNodes is a new array
					// and constructing the object is making a clone of the merged nodes. How can we reduce the
					// number of unused new arrays while keeping the node order
					
					return _object(_mergedNodes); // create new object w/ merged set of nodes (which will have a new _key)
				};
				
				_objectPrototype.animate = function(_styleProperties, _duration, _timing, _callback) {
					var
						_this = this,
						_options = _Uize.isPlainObject(_duration) ? _duration : {},
						_useQueue = _options.useQueue !== _false,
						_step = _options.step,
						_stepCallback = _options.stepCallback,
						_startStyleProperties = _options.start
					;
					
					if (!_Uize.isEmpty(_options)) {
						_duration = _options.duration;
						_timing = _options.timing;
						_callback = _options.callback;
					}

					var
						_timingIsFunction = _Uize_isFunction(_timing),
						_timingInfo = !_timingIsFunction ? _timings[_timing] || _defaultTimingInfo : _null,
						_execAnimation = function() {
							var _modulesToRequire = ['Uize.Fx'];
							
							// ensure duration is a whole number
							_duration = Math.max(
								0,
								!_Uize.isNumber(_duration)
									? _animationSpeeds[_duration] || 400
									: _duration
							);
							
							// get timing info if timing isn't a function so we can build a timing function
							!_timingIsFunction
								&& _modulesToRequire.push( // also need to require curve module (if we don't already have a timing function
									(
										_timingInfo = _timings[_timing] || _defaultTimingInfo
									).module || 'Uize.Curve'
								)
							;

							// load in needed modules
							_Uize.require(
								_modulesToRequire,
								function(_Uize_Fx, _curveClass) {
									var
										_doneNo = 0,
										_nodesLength = _this.length,
										_activeFadeObjects = _this._activeFadeObjects
									;

									if (!_timingIsFunction)
										_timing = _curveClass[_timingInfo.curve].apply(_undefined, _timingInfo.params);

									_this._each(
										function() {
											var
												_node = this,
												_fadeObject = _Uize_Fx.fadeStyle(
													_node,
													_startStyleProperties,
													_styleProperties,
													_duration,
													{
														curve:_timing,
														quantization:_step
													}
												)
											;
											_activeFadeObjects.push(_fadeObject);
											_fadeObject.wire(
												_Uize_copyInto(
													{
														Done:function() {
															// remove in FIFO order
															_activeFadeObjects.shift();
															
															// call user-supplied callback
															_Uize_isFunction(_callback)
																&& _callback.call(_node);
																
															// if we used the queue, move on to the next effect in the queue
															if (++_doneNo == _nodesLength && _useQueue)
																_this._dequeue()
															;
														}
													},
													_stepCallback
														&& {
															'Changed.value':function(_event) { _stepCallback.call(_node, _event.source.valueOf()) }
														}
												)
											);
										}
									);
								}
							);
						}
					;

					_useQueue === _false
						? _execAnimation() // just call immediately
						: _this._enqueue(_execAnimation) // add to the queue
					;
					
					return _this;
				};
				
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
				);
				
				_objectPrototype.clearQueue = function() { this._queue.length = 0 };
				
				_makeIsOnNodeTreeMethod(); // contained
				_makeIsOnNodeTreeMethod(_true); // contains
				
				_objectPrototype.coords = function(_param1, _param2) {
					return this._handleGetOrSetAction(
						_param1 == _undefined || _Uize.isBoolean(_param1), // getting when param1 is undefined (no params) or it's a boolean (signifying whether or not to make it window-relative)
						function(_node) {
							var _coords = _Uize_Node.getCoords(_node);
							
							return {// optionally make coordinates window-relative
								left:_coords.left - (_param1 ? window.pageXOffset : 0),
								top:_coords.top - (_param1 ? window.pageYOffset : 0)
							};
						},
						_param1, // param1 contains coordsObj when setting
						function(_node, _valueToSet) {
							var _currentPosition = _Uize_Node_getStyle(_node, 'position');

							// first override all positioning so we can figure out where it naturally falls
							_Uize_Node.setStyle(
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
							var _currentCoords = _Uize_Node.getCoords(_node);

							// lastly position relative to where we want to go
							_Uize_Node_setStyle(
								_node,
								{
									left:-_currentCoords.left
										+ (_param1.left == _undefined ? _currentCoords.left : _param1.left) // omitting left will just leave it where it is
										+ (_param2 ? window.pageXOffset : 0), // make coordinates window-relative
									top:-_currentCoords.top
										+ (_param1.top == _undefined ? _currentCoords.top : _param1.top) // omitting top will just leave it where it is
										+ (_param2 ? window.pageYOffset : 0) // make coordinates window-relative
								}
							);
						}
					)
				};
				
				_objectPrototype.delay = function(_duration) {
					var _this = this;
					_this._enqueue(
						function() {
							var
								_activeFadeObjects = _this._activeFadeObjects,
								_timeoutId = setTimeout(
									function() {
										_activeFadeObjects.length = 0;
										_this._dequeue();
									},
									_duration
								)
							;
							
							// instead of adding a fade object, just add "stop" function
							_activeFadeObjects.push(function() { clearTimeout(_timeoutId) });
						}
					);
					return _this;
				};
				
				_objectPrototype.detach = function(_selector) {
					return this._each(function() { _isMatch(this, _selector) && _Uize_Node.remove(this) }) // NOTE: "this" in each is a reference to the node
				};
				
				_objectPrototype.each = _objectPrototype._each = function(_iterationHandler) {
					_Uize_isFunction(_iterationHandler)
						&& _Uize.forEach(
							this._nodes,
							function(_node, _nodeNo) { _iterationHandler.call(_node, _nodeNo, _node) } // pass node as "this" (and 2nd param)
						);
					return this;
				};
			
				_objectPrototype.elements = function(_index) {
					var _nodes = this._nodes;
					return _index != _undefined ? _nodes[_index] : _nodes.concat();
				};
				
				_objectPrototype.first = function() { return this.single(0) };
				
				_objectPrototype.dimensions = function(_includeMargins) {
					return this._handleGetAction(
						function(_node) { return _getDimensions(_node, _includeMargins) }
					)
				};
				
				_objectPrototype.empty = function() {
					return this._each(function() { _emptyNode(this, _true) })
				};
				
				_objectPrototype.height = function(_includeMargins) {
					return this._handleGetAction(
						function(_node) { return _getDimensions(_node, _includeMargins).height }
					)
				};
				
				_objectPrototype.html = function(_html, _unwireChildNodes) {
					return this._handleGetOrSetAction(
						_html == _undefined,
						function(_node) { return _node.innerHTML },
						_html,
						function(_node, _value) {
							_unwireChildNodes && _emptyNode(_node, _true);
							_Uize_Node.setInnerHtml(_node, _value);
						}
					)
				};
				
				_objectPrototype.innerHeight = function() {
					return this._handleGetAction(function(_node) { return _node.clientHeight })
				};
				
				_objectPrototype.innerWidth = function() {
					return this._handleGetAction(function(_node) { return _node.clientWidth })
				};
				
				_objectPrototype.last = function() { return this.single(-1) };
				
				_objectPrototype.map = function(_mapper) { return _Uize.map(this._nodes, _mapper) };
				
				_objectPrototype.offset = function(_selector) {
					return this._handleGetAction(
						function(_node) {
							var
								_nodeCoords = _Uize_Node.getCoords(_node),
								_offsetParentNode = _getOffsetParent(_node, _selector),
								_offsetParentCoords = _offsetParentNode
									? _Uize_Node.getCoords(_offsetParentNode)
									: {top:0,left:0}
							;
							return {
								top:_nodeCoords.top - _offsetParentCoords.top,
								left:_nodeCoords.left - _offsetParentCoords.left
							};
						}
					)
				};
				
				_objectPrototype.offsetParent = function(_selector) {
					return _object( // create new Uize.Web object
						this._handleGetAction(function(_node) { return _getOffsetParent(_node, _selector) })
					)
				};
				
				_makeNodeGetSetMethod(
					'property',
					_makeGetNodeInfoFunction(function (_node, _propertyName) { return _node[_propertyName] }),
					_Uize_Node.setProperties
				);
				
				_objectPrototype.removeAttribute = function(_attributeName) {
					var
						_attributeNames = _Uize_isArray(_attributeName) ? _attributeName : [_attributeName],
						_attributeNamesLength = _attributeNames.length,
						_attributeNamsNo
					;
					
					return this._handleSetAction(
						_attributeNames,
						function(_node) {
							for (_attributeNamsNo = -1; ++_attributeNamsNo < _attributeNamesLength;)
								_node.removeAttribute(_attributeNames[_attributeNamsNo])
							;
						}
					);
				};
				
				_makeScrollPositionMethod(); // scrollTop
				_makeScrollPositionMethod(_true); // scrollLeft
				
				_objectPrototype.single = function(_index) {
					var
						_this = this,
						_nodes = _this._nodes,
						_nodesLength = _this.length,
						_singleNode
					;
					
					if (_index >= 0 && _index < _nodesLength)
						_singleNode = _nodes[_index];
					else if (_index < 0 && (_index + _nodesLength) >= 0)
						_singleNode = _nodes[_index + _nodesLength];
					
					return _object(_singleNode); // an undefined _singleNode will just create an empty object
				};
				
				_objectPrototype.slice = function(_start, _end) { return _object(this._nodes.slice(_start, _end)) };
				 
				// For making a Uize.Web object look like an array in Firebug and other inspectors (http://www.mail-archive.com/firebug@googlegroups.com/msg01548.html), and passes Uize.isArray
				_objectPrototype.splice = _Uize.nop;
				
				_objectPrototype.stop = function(_jumpToEnd, _clearQueue) {
					var
						_this = this,
						_activeFadeObjects = _this._activeFadeObjects
					;
					
					if (_activeFadeObjects.length) {
						for (var _fadeNo = -1, _activeFadeObjectsLength = _activeFadeObjects.length; ++_fadeNo < _activeFadeObjectsLength;) {
							var _activeFadeObject = _activeFadeObjects[_fadeNo];
							
							if (_Uize_isFunction(_activeFadeObject))
								_activeFadeObject(); // delay setTimeout
							else {
								// stop the fade
								_activeFadeObject.stop();
								
								// set the end value of each node if _jumpToEnd is true
								_jumpToEnd
									&& _Uize_Node_setStyle(_this._nodes[_fadeNo], _activeFadeObject.get('endValue'))
								;
							}
						}
						
						// we stopped them all, so there should be no more active ones
						_activeFadeObjects.length = 0;
					}
					
					if (_clearQueue) // remove all queued animations
						_this.clearQueue();
					
					// go to the next queued animation (if one exists)
					_this._dequeue();
					
					return _this;
				};
				
				_objectPrototype.text = function(_text, _unwireChildNodes) {
					return this._handleGetOrSetAction(
						_text == _undefined,
						_Uize_Node.getText,
						_text,
						function(_node, _value) {
							_emptyNode(_node, _unwireChildNodes); // empty everything out first (optionally unwiring child ndoes)
							_node.appendChild(document.createTextNode(_value + '')); // coerce to a string value by invoking valueOf method
						}
					)
				};
				
				_objectPrototype.unwire = function(_param1, _param2, _param3) {
					return this._wireOrUnwire('unwire', _param1, _param2, _param3)
				};
				
				_objectPrototype.value = function(_value) {
					return this._handleGetOrSetAction(
						_value == _undefined,
						_Uize_Node.getValue,
						_value,
						_Uize_Node.setValue
					)
				};
				
				_objectPrototype.width = function(_includeMargins) {
					return this._handleGetAction(
						function(_node) { return _getDimensions(_node, _includeMargins).width }
					)
				};
				
			/** Classes **/
				var _makeUizeNodeClassesVoidMethod = function(_methodName, _uizeNodeClassesMethodName) {
					_objectPrototype[_methodName] = function() {
						_Uize_Node_Classes[_uizeNodeClassesMethodName || _methodName].apply(0, [this._nodes].concat(Array.prototype.slice.call(arguments)));
						return this;
					}
				};
				
				_makeUizeNodeClassesVoidMethod('addClass');
				_objectPrototype.getClassState = function(_stateClasses) {
					return this._handleGetAction(
						function(_node) { return _Uize_Node_Classes.getState(_node, _stateClasses) }
					)
				};
				_objectPrototype.hasClass = function(_class) {
					var
						_this = this,
						_nodes = _this._nodes,
						_nodesLength = _nodes.length,
						_nodeNo = -1
					;
					
					for (; ++_nodeNo < _nodesLength;)
						if (_Uize_Node_Classes.hasClass(_nodes[_nodeNo], _class))
							return _true;

					return _false;
				};
				_makeUizeNodeClassesVoidMethod('removeClass');
				_makeUizeNodeClassesVoidMethod('removeClassState', 'removeState');
				_makeUizeNodeClassesVoidMethod('setClassState', 'setState');
				_makeUizeNodeClassesVoidMethod('toggleClass');
				_makeUizeNodeClassesVoidMethod('toggleClassState', 'toggleState');
				
			/** Display-related methods **/
				var _makeDisplayMethods = function(_methodNames, _displayProperties, _animationOptional) {
					// NOTE: The array of methodNames contains three method names:
					// 1st - for displaying the content (display/fadeIn/slideDown/slideOut)
					// 2nd - for hiding the content (hide/fadeOut/sldieUp/slideIn)
					// 3rd - for toggling 1st & 2nd (toggleDisplay/toggleFade/toggleSlideY/toggleSlideX)
					_Uize.forEach(
						[_true, _false, _undefined],
						function(_mustDisplay, _methodNo) {
							_objectPrototype[_methodNames[_methodNo]] = function(_duration, _timing, _callback) {
								return this._display(
									_mustDisplay,
									_displayProperties,
									!_animationOptional && _duration == _undefined ? _null : _duration, // when _animationOptional is false, default animation duration is used
									_timing,
									_callback
								)
							}
						}
					)
				};
				
				_makeDisplayMethods(['display', 'hide', 'toggleDisplay'], {_opacity:1,_x:1,_y:1}, _true);
				_makeDisplayMethods(['fadeIn', 'fadeOut', 'toggleFade'], {_opacity:1});
				_makeDisplayMethods(['slideDown', 'slideUp', 'toggleSlideY'], {_y:1});
				_makeDisplayMethods(['slideOut', 'slideIn', 'toggleSlideX'], {_x:1});

				_objectPrototype.fadeTo = function(_opacity, _duration, _timing, _callback) {
					return this.animate({opacity:_opacity}, _duration, _timing, _callback)
				};
				
			/** Events **/
				_objectPrototype.domReady = function(_handler) {
					_Uize_Node.wire(document, 'DOMContentLoaded', _handler);
					return this;
				};
				_objectPrototype.hover = function(_overHandler, _outHandler) {
					return this.mouseover(_overHandler).mouseout(_outHandler || _overHandler)
				};

				_objectPrototype.trigger = function(_eventName) {
					var _this = this;
					if (_eventName) {
						var
							_document = document,
							_event
						;
						
						if (_document.createEvent) {
							_event = _document.createEvent('HTMLEvents');
							_event.initEvent(_eventName, _true, _true);
						}
						else {
							_event = _document.createEventObject();
							_event.eventType = _eventName;
						}
						
						_this._each(
							function() {
								var _node = this;
								_document.dispatchEvent
									? _node.dispatchEvent(_event)
									: _node.fireEvent('on' + _event.eventType, _event)
							}
						);
					}
					
					return _this;
				};

				_objectPrototype.wire = function(_param1, _param2, _param3) {
					return this._wireOrUnwire('wire', _param1, _param2, _param3)
				};
				
				_objectPrototype.wireOnce = function(_param1, _param2, _param3) {
					var
						_this = this,
						_eventsMap = _buildEventsMap(_param1, _param2, _param3),
						_wireOnceWrapperHandler = function(_node, _eventName, _handler) {
							var _onceWrapperHandler = function(_event) {
								// unwire the event first so it's not called again
								_Uize_Node.unwire(_node, _eventName, _onceWrapperHandler);
								
								// call the actual handler
								_handler(_event);
							};
							_Uize_Node.wire(_node, _eventName, _onceWrapperHandler);
						}
					;
					
					for (var _eventName in _eventsMap) {
						var _handler = _eventsMap[_eventName];
						_handler && 
							_this._each(
								function() { _wireOnceWrapperHandler(this, _eventName, _handler) }
							)
						;
					}
					
					return _this;
				};
			
				var 
					_makeWireMethod = function(_eventName) {
						_objectPrototype[_eventName] = function(_handler) { return this.wire(_eventName, _handler) }
					},
					_makeWireAndTriggerComboMethod = function(_eventName) {
						_objectPrototype[_eventName] = function(_handler) {
							return _Uize_isFunction(_handler) ? this.wire(_eventName, _handler) : this.trigger(_eventName)
						}
					}
				;
				
				_makeWireAndTriggerComboMethod('blur');
				_makeWireAndTriggerComboMethod('change');
				_makeWireAndTriggerComboMethod('click');
				_makeWireAndTriggerComboMethod('dblclick');
				_makeWireMethod('error');
				_makeWireAndTriggerComboMethod('focus');
				_makeWireAndTriggerComboMethod('keydown');
				_makeWireAndTriggerComboMethod('keypress');
				_makeWireAndTriggerComboMethod('keyup');
				_makeWireMethod('load');
				_makeWireAndTriggerComboMethod('mousedown');
				_makeWireAndTriggerComboMethod('mousemove');
				_makeWireAndTriggerComboMethod('mouseout');
				_makeWireAndTriggerComboMethod('mouseover');
				_makeWireAndTriggerComboMethod('keypress');
				_makeWireAndTriggerComboMethod('keyup');
				_makeWireAndTriggerComboMethod('mouseup');
				_makeWireAndTriggerComboMethod('resize');
				_makeWireAndTriggerComboMethod('scroll');
				_makeWireAndTriggerComboMethod('select');
				_makeWireAndTriggerComboMethod('submit');
				_makeWireMethod('unload');
				
				/* Uize.Node.VirtualEvent */
					var _makeUizeNodeVirtualEventMethod = function(_eventName) {
						_objectPrototype[_eventName] = function(_handler, _duration) {
							var _this = this;
							
							_Uize.require(
								'Uize.Node.VirtualEvent',
								function(_Uize_Node_VirtualEvent) {
									_Uize_Node.wire(
										_this._nodes,
										_Uize_Node_VirtualEvent[_eventName](_duration),
										_handler
									)
								}
							);
							
							return _this;
						}
					};
					
					_makeUizeNodeVirtualEventMethod('altClick');
					_makeUizeNodeVirtualEventMethod('ctrlClick');
					_makeUizeNodeVirtualEventMethod('ctrlAltClick');
					_makeUizeNodeVirtualEventMethod('keyRemainDown');
					_makeUizeNodeVirtualEventMethod('keyRemainUp');
					_makeUizeNodeVirtualEventMethod('mouseRemainDown');
					_makeUizeNodeVirtualEventMethod('mouseRemainOut');
					_makeUizeNodeVirtualEventMethod('mouseRemainOver');
					_makeUizeNodeVirtualEventMethod('mouseRemainUp');
					_makeUizeNodeVirtualEventMethod('mouseRest');
					_makeUizeNodeVirtualEventMethod('remainBlurred');
					_makeUizeNodeVirtualEventMethod('remainFocused');
					_makeUizeNodeVirtualEventMethod('shiftClick');
					_makeUizeNodeVirtualEventMethod('shiftAltClick');
					_makeUizeNodeVirtualEventMethod('shiftCtrlClick');
					_makeUizeNodeVirtualEventMethod('shiftCtrlAltClick');
					
				/** Node Manipulation **/
					var _makeInjectContentMethod = function(_methodName, _injectMode) {
						_objectPrototype[_methodName] = function() {
							var
								_this = this,
								_arguments = arguments,
								_argumentsLength = _arguments.length,
								_argNo = -1
							;
							
							for (; ++_argNo < _argumentsLength;)
								_this._handleSetAction(
									_arguments[_argNo],
									function(_node, _content) { _Uize_Node.injectHtml(_node, _content, _injectMode) }
								)
							;

							return _this;
						}
					};
					
					_makeInjectContentMethod('after', 'outer bottom');
					_makeInjectContentMethod('append');
					_makeInjectContentMethod('before', 'outer top');
					_makeInjectContentMethod('prepend', 'inner top');
					
				/** Style/CSS **/
					_makeNodeGetSetMethod('css', _Uize_Node_getStyle, _Uize_Node_setStyle);
					
					var _makeCssMethod = function(_methodName, _propertyName) {
						_objectPrototype[_methodName] = function(_propetyValue) {
							var
								_this = this,
								_returnValue = _this.css(_propertyName, _propetyValue)
							;
							return _this == _returnValue
								? _returnValue
								: (
									_Uize_isString(_returnValue)
										? parseInt(_returnValue)
										: _Uize.map(_returnValue, 'parseInt(value)')
								)
							;
						}
					};
					
					_makeCssMethod('contentHeight', 'height');
					_makeCssMethod('contentWidth', 'width');
					_makeCssMethod('opacity', 'opacity');
					
					_objectPrototype.showClickable = function(_clickable) {
						return this._handleSetAction(_clickable, _Uize_Node.showClickable)
					};

		return _object;
	}
});
