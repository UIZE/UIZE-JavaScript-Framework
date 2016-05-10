/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Web.xEffects Object Extension
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2009-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Extension
	importance: 5
	codeCompleteness: 80
	docCompleteness: 50
*/

/*?
	Introduction
		The =Uize.Web.xEffects= module extends the =Uize.Web= object by adding functionality for animation effects.

		*DEVELOPERS:* `Ben Ilegbodu`, original code contributed by `Zazzle Inc.`

		The =Uize.Web.xEffects= module is an extension module that extends the =Uize.Web= class. Pages that want to leverage the syntax-friendly nature of =Uize.Web= may not need to leverage any animation effects. Therefore, the animation effects functionality is not implemented in the =Uize.Web= class in order to reduce the need for loading the extra code.  Instead, in order to include the animation effects, one needs to require the =Uize.Web.xEffects= extension module.

		Key Features
			The =Uize.Web.xEffects= extension module provides the following features...

			Queued Animations Methods
				document...

			Queue Management Methods
				document...

			Display Animations Methods
				document...
*/

Uize.module ({
	name:'Uize.Web.xEffects',
	required:'Uize.Dom.Basics',
	builder:function (_object) {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_true = true,
				_false = false,
				_null = null,
				_undefined,
				_Uize = Uize,
				_Uize_Dom_Basics = _Uize.Dom.Basics,
				_Uize_isFunction = _Uize.isFunction,
				_Uize_isPlainObject = _Uize.isPlainObject,
				_Uize_copyInto = _Uize.copyInto,
				_Uize_Dom_Basics_getStyle = _Uize_Dom_Basics.getStyle,
				_Uize_Dom_Basics_setStyle = _Uize_Dom_Basics.setStyle,
				_objectPrototype = _object.prototype,

			/*** General Variables ***/
				_animationSpeeds = {
					slow:600,
					fast:200
				},
				_defaultTimingInfo = {
					module:'Uize.Fade',
					curve:'celeration',
					params:[0.1, 0.9]
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
				}
		;

		/*** Utility Functions ***/
			var
				_getDuration = function(_duration) {
					// ensure duration is a whole number
					return Math.max(
						0,
						!_Uize.isNumber(_duration)
							? _animationSpeeds[_duration] || 400 // 400 is default duration
							: _duration
					);
				}
			;

		/*** Implement Hook Methods ***/
			var _previousAtEndOfConstructor = _objectPrototype.atEndOfConstructor;

			_objectPrototype.atEndOfConstructor = function(_nodes) {
				var m = this;

				// call previous first just in case it's defined by base (or another extension)
				_previousAtEndOfConstructor.call(m, _nodes);

				/* effects queue */
					m._queue = [];
					m._activeFadeObjects = [];
			};

		/*** Private Instance Methods ***/
			_objectPrototype._animateDisplay = function(_mustDisplay, _displayProperties, _duration, _callback, _timing) {
				var
					m = this,
					_Uize_Dom_Basics_display = _Uize_Dom_Basics.display
				;

				m._enqueue( // add to effects queue
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

							_nodesLength = m.length,
							_doneNo = 0,
							_animationOptions = _Uize_isPlainObject(_duration)
								? _duration
								: {
									duration:_duration,
									callback:_callback,
									timing:_timing
								}
						;

						// update the reference to callback, since we want everything
						// drived from _animationOptions
						_callback = _animationOptions.callback;

						m.each(
							function() {
								var
									_node = this,
									_nodeMustDisplay = _mustDisplay,
									_nodeIsHidden = _Uize_Dom_Basics_getStyle(_node, 'display') == 'none'
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
									_Uize_Dom_Basics_setStyle(_node, {display:''});
									_Uize_Dom_Basics_getStyle(_node, 'display') == 'none'
										&& _Uize_Dom_Basics_display(_node);
								}

								var
									_propertiesFinal = _nodeMustDisplay
										? _Uize_Dom_Basics_getStyle(_node, _animateProperties)
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
								_Uize_Dom_Basics_setStyle(
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
										_Uize_Dom_Basics_getStyle(_node, _initialProperties)
									)
								);

								// create a throw-away Uize.Web. object so we can call animate on it and leverage existing code
								_object(_node).animate(
									_propertiesFinal,
									_Uize.copy(
										_animationOptions,
										{
											// override the callback in _animationOptions w/ our own, but call it in the function
											callback:function() {
												// Now that we're done, "cleanse" the style properties by resetting them
												_Uize_Dom_Basics_setStyle(_node, _propertiesToRestore);

												// Hide the node if we were actually trying to hide it
												!_nodeMustDisplay && _Uize_Dom_Basics_display(_node, _false);

												// finally call callback
												_Uize_isFunction(_callback) && _callback.call(_node);

												// go to the next element in the effects queue (if any)
												// when all nodes have been animated
												// we could call this before the callback, just in case the callback takes
												// a while, but the callback may want to clear the queue or otherwise change
												// stuff before moving onto the next animation
												++_doneNo == _nodesLength && m._dequeue();
											}
										}
									)
								);
							}
						);
					}
				);

				return m;
			};

			_objectPrototype._dequeue = function() {
				var
					m = this,
					_queue = this._queue,
					_queueLength = _queue.length
				;
				m._queueInUse = _false; // we always call dequeue to see if there's more work to do, so in the case where there isn't, this will stay false
				if (_queueLength) {
					m._queueInUse = _true;
					_queue.shift()(); // dequeue and call immediately
				}
			};

			_objectPrototype._enqueue = function(_effectToExec) {
				this._queue.push(_effectToExec) == 1
					&& !this._queueInUse
					&& this._dequeue() // if this is the first effect added to the queue we need to start it
				;
			};

		/*** Public Instance Methods ***/
			/** Animation **/
				_objectPrototype.animate = function(_styleProperties, _duration, _callback, _timing) {
					var
						m = this,
						_options = _Uize_isPlainObject(_duration) ? _duration : {},
						_useQueue = _options.useQueue !== _false,
						_step = _options.step,
						_startCallback = _options.startCallback,
						_stepCallback = _options.stepCallback,
						_startStyleProperties = _options.start
					;

					if (!_Uize.isEmpty(_options)) {
						_duration = _options.duration;
						_callback = _options.callback;
						_timing = _options.timing;
					}

					var
						_timingIsFunction = _Uize_isFunction(_timing),
						_timingInfo = !_timingIsFunction ? _timings[_timing] || _defaultTimingInfo : _null,
						_execAnimation = function() {
							var _modulesToRequire = ['Uize.Fx'];

							// ensure valid duration
							_duration = _getDuration(_duration);

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
										_nodesLength = m.length,
										_activeFadeObjects = m._activeFadeObjects
									;

									if (!_timingIsFunction)
										_timing = _curveClass[_timingInfo.curve].apply(_undefined, _timingInfo.params);

									m.each(
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
																m._dequeue()
															;
														}
													},
													_startCallback
														&& {
															Start:function(_event) { _startCallback.call(_node, _event.source.valueOf()) }
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
						: m._enqueue(_execAnimation) // add to the queue
					;

					return m;
					/*?
						Instance Methods
							animate
								Performs custom animation of a set of CSS style properties on the matched set of DOM nodes.

								SYNTAX
								........................................................
								myWeb = myWeb.animate(stylePropertiesOBJ, durationMsINT, callbackFUNC, timingSTRorFUNC);
								........................................................

								The stylePropertiesOBJ Parameter
									document...

								The durationMsINT Parameter
									document...

								The callbackFUNC Parameter
									document...

								The timingSTRorFUNC Parameter
									document...

								VARIATION
								........................................................
								myWeb = myWeb.animate(stylePropertiesOBJ, animationOptionsOBJ);
								........................................................

								The animationOptionsOBJ Parameter
									duration
										document

									callback
										document

									timing
										document

									start
										document

									startCallback
										document

									step
										document

									stepCallback
										document

									useQueue
										document

								NOTES
								- Returns a reference to the same =Uize.Web= object
								- See also related =delay= method
					*/
				};

				_objectPrototype.clearQueue = function() {
					this._queue.length = this._activeFadeObjects.length = 0;
					return this;
				};
					/*?
						Instance Methods
							clearQueue
								Remove all items from the queue that have not yet been run.

								SYNTAX
								........................................................
								myWeb = myWeb.clearQueue();
								........................................................

								NOTES
								- Returns a reference to the same =Uize.Web= object
					*/

				_objectPrototype.delay = function(_duration, _callback) {
					var m = this;
					m._enqueue(
						function() {
							var
								_activeFadeObjects = m._activeFadeObjects,
								_timeoutId = setTimeout(
									function() {
										_activeFadeObjects.length = 0;
										_Uize_isFunction(_callback) && _callback();
										m._dequeue();
									},
									_getDuration(_duration)
								)
							;

							// instead of adding a fade object, just add "stop" function
							_activeFadeObjects.push(function() { clearTimeout(_timeoutId) });
						}
					);
					return m;
					/*?
						Instance Methods
							delay
								Sets a timer for the specified duration to delay the execution of subsequent items in the queue.

								SYNTAX
								........................................................
								myWeb = myWeb.delay(durationMsINT);
								........................................................

								VARIATION 1
								........................................................
								myWeb = myWeb.delay(durationMsINT, callbackFUNC);
								........................................................

								VARIATION 2
								........................................................
								myWeb = myWeb.delay();
								........................................................

								NOTES
								- Returns a reference to the same =Uize.Web= object
								- See also related =animate= method
					*/
				};

				_objectPrototype.queue = function(_param) {
					var m = this;

					if (_param == _undefined)
						return m._queue;
					else {
						var _enqueueCallbackWithDequeue = function(_callback) {
							_Uize_isFunction(_callback)
								&& m._enqueue(
									function() {
										// pass dequeue as param so that it can be called at the end of user-supplied callback
										_callback(
											function() { m._dequeue() }
										);
									}
								)
							;
						};
						if (_Uize_isFunction(_param)) // add callback function to queue
							_enqueueCallbackWithDequeue(_param);
						else if (_Uize.isArray(_param)) { // replace current queue w/ new queue
							m.clearQueue();
							_Uize.forEach(_param, _enqueueCallbackWithDequeue);
						}

						return m;
					}
				};
					/*?
						Instance Methods
							queue
								get
									Returns the current queue of effects to be executed on the matched set of DOM nodes.

									SYNTAX
									........................................................
									queueARRAY = myWeb.queue();
									........................................................

									NOTES
									- Returns a reference to the actual effects queue, so manipulating the array affects the underlying queue as well.

								set
									Adds a callback to the effects queue to be executed once for each of the matched set of DOM nodes.

									SYNTAX
									........................................................
									myWeb = myWeb.queue(callbackFUNC);
									........................................................

									SYNTAX
									........................................................
									myWeb = myWeb.queue(newQueueARRAY);
									........................................................

									NOTES
									- Returns a reference to the same =Uize.Web= object
									- See also related =animate= & =delay= methods
					*/

				_objectPrototype.stop = function(_jumpToEnd, _clearQueue) {
					var
						m = this,
						_activeFadeObjects = m._activeFadeObjects
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
									&& _Uize_Dom_Basics_setStyle(m[_fadeNo], _activeFadeObject.get('endValue'))
								;
							}
						}

						// we stopped them all, so there should be no more active ones
						_activeFadeObjects.length = 0;
					}

					if (_clearQueue) // remove all queued animations
						m.clearQueue();

					// go to the next queued animation (if one exists)
					m._dequeue();

					return m;
					/*?
						Instance Methods
							stop
								Stops the currently running animation on the matched set of DOM nodes.

								SYNTAX
								........................................................
								myWeb = myWeb.stop();
								........................................................

								VARIATION 1
								........................................................
								myWeb = myWeb.stop(jumpToEndBOOL);
								........................................................

								VARIATION 2
								........................................................
								myWeb = myWeb.stop(jumpToEndBOOL, clearQueueBOOL);
								........................................................

								NOTES
								- Returns a reference to the same =Uize.Web= object
								- See related =animate= method
					*/
				};

			/** Display-related methods **/
				var _makeDisplayMethods = function(_methodNames, _displayProperties, _animationOptional) {
					// NOTE: The array of methodNames contains three method names:
					// 1st - for displaying the content (show/fadeIn/slideDown/slideOut)
					// 2nd - for hiding the content (hide/fadeOut/sldieUp/slideIn)
					// 3rd - for toggling 1st & 2nd (toggleShow/toggleFade/toggleSlideY/toggleSlideX)
					// 4th - for supporting parameterized display (display/fade/slideY/slideX)
					var
						_animateDisplay = function(_mustDisplay, _duration, _callback, _timing, _baseMethod) {
							if (_baseMethod) // intending to call the base functionality w/o animation
								return _baseMethod.call(this, _mustDisplay);
							else
								return this._animateDisplay(
									_mustDisplay,
									_displayProperties,
									_duration,
									_callback,
									_timing
								);
						}
					;
					_Uize.forEach(
						[_true, _false, _undefined],
						function(_mustDisplay, _methodNo) {
							var
								_methodName = _methodNames[_methodNo],
								_baseMethod = _objectPrototype[_methodName]
							;
							_objectPrototype[_methodName] = function(_duration, _callback, _timing) {
								return _animateDisplay.call(
									this,
									_mustDisplay,
									_duration,
									_callback,
									_timing,
									_animationOptional && !arguments.length && _baseMethod
								);
							};
						}
					);
					var
						_parameterizedMethodName = _methodNames[3],
						_baseParameterizedMethod = _objectPrototype[_parameterizedMethodName]
					;
					_objectPrototype[_parameterizedMethodName] = function(_mustDisplay, _duration, _callback, _timing) {
						return _animateDisplay.call(
							this,
							_mustDisplay,
							_duration,
							_callback,
							_timing,
							_animationOptional && arguments.length < 2 && _baseParameterizedMethod
						);
					};
				};

				_makeDisplayMethods(['show', 'hide', 'toggleShow', 'display'], {_opacity:1,_x:1,_y:1}, _true);
					/*?
						Instance Methods
							show
								Displays each of the set of matched DOM nodes by both fading in and sliding out horizontally & vertically.

								SYNTAX
								........................................................
								myWeb = myWeb.show(durationMsINTorSTR);
								........................................................

								VARIATION 1
								........................................................
								myWeb = myWeb.show(durationMsINTorSTR, callbackFUNC);
								........................................................

								VARIATION 2
								........................................................
								myWeb = myWeb.show(durationMsINTorSTR, callbackFUNC, timingSTRorFUNC);
								........................................................

								VARIATION 3
								........................................................
								myWeb = myWeb.show(animationOptionsOBJ);
								........................................................

								NOTES
								- Returns a reference to the same =Uize.Web= object
								- See =Uize.Web= base module for calling =show= without any animation
								- See the companion =hide= and =toggleShow= methods
								- See the related =fadeIn=, =slideDown= and =slideOut= methods
								- See =animate= method for more details on animation

							hide
								Hides each of the set of matched DOM nodes by both fading out and sliding in horizontally & vertically.

								SYNTAX
								........................................................
								myWeb = myWeb.hide(durationMsINTorSTR);
								........................................................

								VARIATION 3
								........................................................
								myWeb = myWeb.hide(animationOptionsOBJ);
								........................................................

								NOTES
								- Returns a reference to the same =Uize.Web= object
								- See =Uize.Web= base module for calling =hide= without any animation
								- See the companion =display= and =toggleShow= methods
								- See the related =fadeOut=, =slideUp= and =slideIn= methods
								- See =animate= method for more details on animation

							toggleShow
								Displays or hides each of the set of matched DOM nodes by both fading and sliding horizontally & vertically, depending on their current displayed state.

								SYNTAX
								........................................................
								myWeb = myWeb.toggleShow(durationMsINTorSTR);
								........................................................

								VARIATION 1
								........................................................
								myWeb = myWeb.toggleShow(durationMsINTorSTR, callbackFUNC);
								........................................................

								VARIATION 2
								........................................................
								myWeb = myWeb.toggleShow(durationMsINTorSTR, callbackFUNC, timingSTRorFUNC);
								........................................................

								VARIATION 3
								........................................................
								myWeb = myWeb.toggleShow(animationOptionsOBJ);
								........................................................

								NOTES
								- Returns a reference to the same =Uize.Web= object
								- See =Uize.Web= base module for calling =toggleShow= without any animation
								- See the companion =display= and =hide= methods
								- See the related =toggleFade=, =toggleSlideY= and =toggleSlideX= methods
								- See =animate= method for more details on animation

							display
								Displays or hides each of the set of matched DOM nodes by both fading in/out and sliding out horizontally & vertically.

								SYNTAX
								........................................................
								myWeb = myWeb.display(mustDisplayBOOL, durationMsINTorSTR);
								........................................................

								VARIATION 1
								........................................................
								myWeb = myWeb.display(mustDisplayBOOL, durationMsINTorSTR, callbackFUNC);
								........................................................

								VARIATION 2
								........................................................
								myWeb = myWeb.display(mustDisplayBOOL, durationMsINTorSTR, callbackFUNC, timingSTRorFUNC);
								........................................................

								VARIATION 3
								........................................................
								myWeb = myWeb.display(mustDisplayBOOL, animationOptionsOBJ);
								........................................................

								NOTES
								- Returns a reference to the same =Uize.Web= object
								- See =Uize.Web= base module for calling =display= without any animation
								- See the companion =show=, =hide= and =toggleShow= methods
								- See the related =fade=, =slideX= and =slideY= methods
								- See =animate= method for more details on animation
					*/
				_makeDisplayMethods(['fadeIn', 'fadeOut', 'toggleFade', 'fade'], {_opacity:1});
					/*?
						Instance Methods
							fadeIn
								Displays each of the set of matched DOM nodes by fading them to opaque.

								SYNTAX
								........................................................
								myWeb = myWeb.fadeIn();
								........................................................

								VARIATION 1
								........................................................
								myWeb = myWeb.fadeIn(durationMsINTorSTR);
								........................................................

								VARIATION 2
								........................................................
								myWeb = myWeb.fadeIn(durationMsINTorSTR, callbackFUNC);
								........................................................

								VARIATION 3
								........................................................
								myWeb = myWeb.fadeIn(durationMsINTorSTR, callbackFUNC, timingSTRorFUNC);
								........................................................

								VARIATION 4
								........................................................
								myWeb = myWeb.fadeIn(animationOptionsOBJ);
								........................................................

								NOTES
								- Returns a reference to the same =Uize.Web= object
								- See the companion =fadeTo=, =fadeOut= and =toggleFade= methods
								- See the related =display=, =slideDown= and =slideOut= methods
								- See =animate= method for more details on animation

							fadeOut
								Hides each of the set of matched DOM nodes by fading them to transparent.

								SYNTAX
								........................................................
								myWeb = myWeb.fadeOut();
								........................................................

								VARIATION 1
								........................................................
								myWeb = myWeb.fadeOut(durationMsINTorSTR);
								........................................................

								VARIATION 2
								........................................................
								myWeb = myWeb.fadeOut(durationMsINTorSTR, callbackFUNC);
								........................................................

								VARIATION 3
								........................................................
								myWeb = myWeb.fadeOut(durationMsINTorSTR, callbackFUNC, timingSTRorFUNC);
								........................................................

								VARIATION 4
								........................................................
								myWeb = myWeb.fadeOut(animationOptionsOBJ);
								........................................................

								NOTES
								- Returns a reference to the same =Uize.Web= object
								- See the companion =fadeTo=, =fadeIn= and =toggleFade= methods
								- See the related =hide=, =slideUp= and =slideIn= methods
								- See =animate= method for more details on animation

							toggleFade
								Displays or hides each of the set of matched DOM nodes by animating their opacity, depending on their current displayed state.

								SYNTAX
								........................................................
								myWeb = myWeb.toggleFade();
								........................................................

								VARIATION 1
								........................................................
								myWeb = myWeb.toggleFade(durationMsINTorSTR);
								........................................................

								VARIATION 2
								........................................................
								myWeb = myWeb.toggleFade(durationMsINTorSTR, callbackFUNC);
								........................................................

								VARIATION 3
								........................................................
								myWeb = myWeb.toggleFade(durationMsINTorSTR, callbackFUNC, timingSTRorFUNC);
								........................................................

								VARIATION 4
								........................................................
								myWeb = myWeb.toggleFade(animationOptionsOBJ);
								........................................................

								NOTES
								- Returns a reference to the same =Uize.Web= object
								- See the companion =fadeTo=, =fadeIn= and =fadeOut= methods
								- See the related =toggleShow=, =toggleSlideY= and =toggleSlideX= methods
								- See =animate= method for more details on animation

							fade
								Displays or hides each of the set of matched DOM nodes by animating their opacity.

								SYNTAX
								........................................................
								myWeb = myWeb.fade(mustDisplayBOOL, durationMsINTorSTR);
								........................................................

								VARIATION 1
								........................................................
								myWeb = myWeb.fade(mustDisplayBOOL, durationMsINTorSTR, callbackFUNC);
								........................................................

								VARIATION 2
								........................................................
								myWeb = myWeb.fade(mustDisplayBOOL, durationMsINTorSTR, callbackFUNC, timingSTRorFUNC);
								........................................................

								VARIATION 3
								........................................................
								myWeb = myWeb.fade(mustDisplayBOOL, animationOptionsOBJ);
								........................................................

								NOTES
								- Returns a reference to the same =Uize.Web= object
								- See the companion =fadeIn=, =fadeTo=, =fadeOut= and =toggleFade= methods
								- See the related =show=, =slideX= and =slideY= methods
								- See =animate= method for more details on animation
					*/

				_objectPrototype.fadeTo = function(_opacity, _duration, _timing, _callback) {
					return this.animate({opacity:_opacity}, _duration, _timing, _callback);
					/*?
						Instance Methods
							fadeTo
								Adjusts the opacity of each of the set of matched DOM nodes

								SYNTAX
								........................................................
								myWeb = myWeb.fadeTo(opacityFLOAT);
								........................................................

								VARIATION 1
								........................................................
								myWeb = myWeb.fadeTo(opacityFLOAT, durationMsINTorSTR);
								........................................................

								VARIATION 2
								........................................................
								myWeb = myWeb.fadeTo(opacityFLOAT, durationMsINTorSTR, callbackFUNC);
								........................................................

								VARIATION 3
								........................................................
								myWeb = myWeb.fadeTo(opacityFLOAT, durationMsINTorSTR, callbackFUNC, timingSTRorFUNC);
								........................................................

								VARIATION 4
								........................................................
								myWeb = myWeb.fadeTo(opacityFLOAT, animationOptionsOBJ);
								........................................................

								NOTES
								- Returns a reference to the same =Uize.Web= object
								- See the companion =fadeIn=, =fadeOut= and =toggleFade= methods
								- See =animate= method for more details on animation
					*/
				};

				_makeDisplayMethods(['slideDown', 'slideUp', 'toggleSlideY', 'slideY'], {_y:1});
					/*?
						Instance Methods
							slideDown
								Displays each of the set of matched DOM nodes with a vertical sliding motion.

								SYNTAX
								........................................................
								myWeb = myWeb.slideDown();
								........................................................

								VARIATION 1
								........................................................
								myWeb = myWeb.slideDown(durationMsINTorSTR);
								........................................................

								VARIATION 2
								........................................................
								myWeb = myWeb.slideDown(durationMsINTorSTR, callbackFUNC);
								........................................................

								VARIATION 3
								........................................................
								myWeb = myWeb.slideDown(durationMsINTorSTR, callbackFUNC, timingSTRorFUNC);
								........................................................

								VARIATION 4
								........................................................
								myWeb = myWeb.slideDown(animationOptionsOBJ);
								........................................................

								NOTES
								- Returns a reference to the same =Uize.Web= object
								- See the companion =slideUp= and =toggleSlideY= methods
								- See the related =display=, =fadeIn= and =slideOut= methods
								- See =animate= method for more details on animation

							slideUp
								Hides each of the set of matched DOM nodes with a vertical sliding motion.

								SYNTAX
								........................................................
								myWeb = myWeb.slideUp();
								........................................................

								VARIATION 1
								........................................................
								myWeb = myWeb.slideUp(durationMsINTorSTR);
								........................................................

								VARIATION 2
								........................................................
								myWeb = myWeb.slideUp(durationMsINTorSTR, callbackFUNC);
								........................................................

								VARIATION 3
								........................................................
								myWeb = myWeb.slideUp(durationMsINTorSTR, callbackFUNC, timingSTRorFUNC);
								........................................................

								VARIATION 4
								........................................................
								myWeb = myWeb.slideUp(animationOptionsOBJ);
								........................................................

								NOTES
								- Returns a reference to the same =Uize.Web= object
								- See the companion =slideDown= and =toggleSlideY= methods
								- See the related =hide=, =fadeOut= and =slideIn= methods
								- See =animate= method for more details on animation

							toggleSlideY
								Displays or hides each of the set of matched DOM nodes with a vertical sliding motion, depending on their current displayed state.

								SYNTAX
								........................................................
								myWeb = myWeb.toggleSlideY();
								........................................................

								VARIATION 1
								........................................................
								myWeb = myWeb.toggleSlideY(durationMsINTorSTR);
								........................................................

								VARIATION 2
								........................................................
								myWeb = myWeb.toggleSlideY(durationMsINTorSTR, callbackFUNC);
								........................................................

								VARIATION 3
								........................................................
								myWeb = myWeb.toggleSlideY(durationMsINTorSTR, callbackFUNC, timingSTRorFUNC);
								........................................................

								VARIATION 4
								........................................................
								myWeb = myWeb.toggleSlideY(animationOptionsOBJ);
								........................................................

								NOTES
								- Returns a reference to the same =Uize.Web= object
								- See the companion =slideDown= and =slideUp= methods
								- See the related =toggleShow=, =toggleFade= and =toggleSlideX= methods
								- See =animate= method for more details on animation

							slideY
								Displays or hides each of the set of matched DOM nodes with a vertical sliding motion.

								SYNTAX
								........................................................
								myWeb = myWeb.slideY(mustDisplayBOOL, durationMsINTorSTR);
								........................................................

								VARIATION 1
								........................................................
								myWeb = myWeb.toggleSlideY(mustDisplayBOOL, durationMsINTorSTR, callbackFUNC);
								........................................................

								VARIATION 2
								........................................................
								myWeb = myWeb.toggleSlideY(mustDisplayBOOL, durationMsINTorSTR, callbackFUNC, timingSTRorFUNC);
								........................................................

								VARIATION 3
								........................................................
								myWeb = myWeb.slideY(mustDisplayBOOL, animationOptionsOBJ);
								........................................................

								NOTES
								- Returns a reference to the same =Uize.Web= object
								- See the companion =slideDown=, =slideUp= and =toggleSlideY= methods
								- See the related =show=, =fade= and =slideY= methods
								- See =animate= method for more details on animation
					*/
				_makeDisplayMethods(['slideOut', 'slideIn', 'toggleSlideX', 'slideX'], {_x:1});
					/*?
						Instance Methods
							slideOut
								Displays each of the set of matched DOM nodes with a horizontal sliding motion.

								SYNTAX
								........................................................
								myWeb = myWeb.slideOut();
								........................................................

								VARIATION 1
								........................................................
								myWeb = myWeb.slideOut(durationMsINTorSTR);
								........................................................

								VARIATION 2
								........................................................
								myWeb = myWeb.slideOut(durationMsINTorSTR, callbackFUNC);
								........................................................

								VARIATION 3
								........................................................
								myWeb = myWeb.slideOut(durationMsINTorSTR, callbackFUNC, timingSTRorFUNC);
								........................................................

								VARIATION 4
								........................................................
								myWeb = myWeb.slideOut(animationOptionsOBJ);
								........................................................

								NOTES
								- Returns a reference to the same =Uize.Web= object
								- See the companion =slideIn= and =toggleSlideX= methods
								- See the related =display=, =fadeIn= and =slideDown= methods
								- See =animate= method for more details on animation

							slideIn
								Hides each of the set of matched DOM nodes with a horizontal sliding motion.

								SYNTAX
								........................................................
								myWeb = myWeb.slideIn();
								........................................................

								VARIATION 1
								........................................................
								myWeb = myWeb.slideIn(durationMsINTorSTR);
								........................................................

								VARIATION 2
								........................................................
								myWeb = myWeb.slideIn(durationMsINTorSTR, callbackFUNC);
								........................................................

								VARIATION 3
								........................................................
								myWeb = myWeb.slideIn(durationMsINTorSTR, callbackFUNC, timingSTRorFUNC);
								........................................................

								VARIATION 4
								........................................................
								myWeb = myWeb.slideIn(animationOptionsOBJ);
								........................................................

								NOTES
								- Returns a reference to the same =Uize.Web= object
								- See the companion =slideOut= and =toggleSlideX= methods
								- See the related =hide=, =fadeOut= and =slideUp= methods
								- See =animate= method for more details on animation

							toggleSlideX
								Displays or hides each of the set of matched DOM nodes with a horizontal sliding motion, depending on their current displayed state.

								SYNTAX
								........................................................
								myWeb = myWeb.toggleSlideX();
								........................................................

								VARIATION 1
								........................................................
								myWeb = myWeb.toggleSlideX(durationMsINTorSTR);
								........................................................

								VARIATION 2
								........................................................
								myWeb = myWeb.toggleSlideX(durationMsINTorSTR, callbackFUNC);
								........................................................

								VARIATION 3
								........................................................
								myWeb = myWeb.toggleSlideX(durationMsINTorSTR, callbackFUNC, timingSTRorFUNC);
								........................................................

								VARIATION 4
								........................................................
								myWeb = myWeb.toggleSlideX(animationOptionsOBJ);
								........................................................

								NOTES
								- Returns a reference to the same =Uize.Web= object
								- See the companion =slideOut= and =slideIn= methods
								- See the related =toggleShow=, =toggleFade= and =toggleSlideY= methods
								- See =animate= method for more details on animation

							slideX
								Displays or hides each of the set of matched DOM nodes with a horizontal sliding motion.

								SYNTAX
								........................................................
								myWeb = myWeb.slideX(mustDisplayBOOL, durationMsINTorSTR);
								........................................................

								VARIATION 1
								........................................................
								myWeb = myWeb.slideX(mustDisplayBOOL, durationMsINTorSTR, callbackFUNC);
								........................................................

								VARIATION 2
								........................................................
								myWeb = myWeb.slideX(mustDisplayBOOL, durationMsINTorSTR, callbackFUNC, timingSTRorFUNC);
								........................................................

								VARIATION 3
								........................................................
								myWeb = myWeb.slideX(mustDisplayBOOL, animationOptionsOBJ);
								........................................................

								NOTES
								- Returns a reference to the same =Uize.Web= object
								- See the companion =slideOut=, =slideIn= and =toggleSlidex= methods
								- See the related =show=, =fade= and =slideX= methods
								- See =animate= method for more details on animation
					*/
	}
});
