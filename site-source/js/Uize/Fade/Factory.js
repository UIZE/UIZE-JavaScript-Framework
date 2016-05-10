/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Fade.Factory Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2008-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 5
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Fade.Factory= module implements factory methods for conveniently initiating fades, along with a system for managing a pool of active fades.

		*DEVELOPERS:* `Chris van Rensburg`

		BACKGROUND READING

		For an in-depth discussion on animation in the UIZE JavaScript Framework, and for a discussion on how this module fits into the larger picture, consult the guide [[../guides/javascript-animation-and-effects.html][JavaScript Animation and Effects]] and read through the section `The Fade Factory`.
*/

Uize.module ({
	name:'Uize.Fade.Factory',
	required:'Uize.Fade',
	builder:function () {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_true = true,
				_false = false,
				_undefined,
				_totalKeys = Uize.totalKeys,
				_isFunction = Uize.isFunction,
				_isObject = Uize.isObject,
				_pTarget = 'Uize.Fade.Factory.target',

			/*** General Variables ***/
				_fadePool = []
		;

		function _extend (_host,_class) {
			function _fade (_target,_startValue,_endValue,_duration,_fadeStateProperties,_startNow) {
				var
					_object = this,
					_objectPrototype = _object && _object.prototype,
					_fadeClass =
						_objectPrototype && _isFunction (_objectPrototype.start) && _isFunction (_objectPrototype.stop)
							? _object
							: _class || _host
				;

				if (!_duration) _duration = 750;

				/*** canonicalize target (so that it's always an object with context and handler) ***/
					if (Uize.isInstance (_target))
						return _fadeProperty.call (
							_fadeClass,_target,'value',_startValue,_endValue,_duration,_fadeStateProperties
						)
					;
					if (Uize.isFunction (_target)) _target = {handler:_target};

				/*** canonicalize startValue and endValue to always be as simple as possible ***/
					function _canonicalizeValue (_value) {
						return (
							Uize.isArray (_value) && _value.length < 2 && !Uize.isArray (_value [0])
								? _value [0]
								: _value
						);
					}
					_startValue = _canonicalizeValue (_startValue);
					_endValue = _canonicalizeValue (_endValue);

				function _isPropertiesFade (_context,_handler) {
					return Uize.isInstance (_context) && _handler == 'set';
				}
				var
					_targetContext = _target.context,
					_targetHandler = _target.handler,
					_fadeIsPropertiesFade = _isPropertiesFade (_targetContext,_targetHandler),
					_fade
				;

				/*** for properties fades, default startValue and endValue, if null ***/
					if (_fadeIsPropertiesFade) {
						var _defaultFadePropertiesValue = function (_propertiesValue,_defaultIfNull) {
							if (_propertiesValue) {
								for (var _propertyName in _propertiesValue) {
									if (_propertiesValue [_propertyName] == _undefined)
										_propertiesValue [_propertyName] = _targetContext.get (_propertyName)
									;
								}
							} else {
								_propertiesValue = _targetContext.get (_startValue || _endValue);
							}
							return _propertiesValue;
						};
						_startValue = _defaultFadePropertiesValue (_startValue);
						_endValue = _defaultFadePropertiesValue (_endValue);
					}

				/*** try to find matching active fades in pool (and handle them) ***/
					var _fadesToStop;
					for (
						var _fadeNo = -1, _matchingFade, _fadePoolLength = _fadePool.length;
						++_fadeNo < _fadePoolLength;
					) {
						var
							_matchingFadeTarget = (_matchingFade = _fadePool [_fadeNo]) [_pTarget],
							_matchingFadeTargetContext = _matchingFadeTarget.context,
							_matchingFadeTargetHandler = _matchingFadeTarget.handler,
							_isMatch =
								_matchingFadeTargetContext == _targetContext &&
								_matchingFadeTargetHandler == _targetHandler
						;
						if (_isMatch) {
							var
								_matchingFadeStartValue = _matchingFade.get ('startValue'),
								_matchingFadeEndValue = _matchingFade.get ('endValue')
							;
							if (_fadeIsPropertiesFade) {
								if (_isPropertiesFade (_matchingFadeTargetContext,_matchingFadeTargetHandler)) {
									var _partialMatch = _false;
									for (var _propertyName in _matchingFadeStartValue)
										_propertyName in _startValue ? (_partialMatch = _true) : (_isMatch = _false)
									;
									if (_partialMatch && !_isMatch) {
										/* NOTE:
											This fade is a partial match, so don't terminate it but just remove the properties that are to be taken over by the new fade.
										*/
										var
											_newStartValue = {},
											_newEndValue = {}
										;
										for (var _propertyName in _matchingFadeStartValue) {
											if (!(_propertyName in _startValue)) {
												_newStartValue [_propertyName] = _matchingFadeStartValue [_propertyName];
												_newEndValue [_propertyName] = _matchingFadeEndValue [_propertyName];
											}
										}
										_matchingFade.set ({startValue:_newStartValue,endValue:_newEndValue});
									}
								}
							} else {
								var _doSignaturesMatch = function (_startValue,_endValue,_newFadeStartValue,_newFadeEndValue) {
									/* NOTE: this code is loosely based on Uize.Data.Compare.identical */
									var _signaturesMatch;
									if (_startValue == _endValue) {
										_signaturesMatch =
											_newFadeStartValue == _startValue && _newFadeEndValue == _startValue
										;
									} else if (
										_signaturesMatch = _isObject (_startValue) && _isObject (_newFadeStartValue)
											? (
												(
													typeof _startValue.length == 'number'
														? _startValue.length === _newFadeStartValue.length
														: _true
												) &&
												_totalKeys (_startValue) == _totalKeys (_newFadeStartValue)
											)
											: _true
									) {
										for (var _propertyName in _startValue) {
											if (
												!(_propertyName in _newFadeStartValue) ||
												!_doSignaturesMatch (
													_startValue [_propertyName],_endValue [_propertyName],
													_newFadeStartValue [_propertyName],_newFadeEndValue [_propertyName]
												)
											) {
												_signaturesMatch = _false;
												break;
											}
										}
									}
									return _signaturesMatch;
								};
								_isMatch =
									_doSignaturesMatch (_matchingFadeStartValue,_matchingFadeEndValue,_startValue,_endValue)
								;
							}
							_isMatch && (_fadesToStop || (_fadesToStop = [])).push (_matchingFade);
						}
					}
					_fadesToStop && Uize.callOn (_fadesToStop,'stop');

				/*** create new fade and start it ***/
					var _newFadeHolder = [];
					(
						_newFadeHolder [0] = _fadeClass (
							Uize.copyInto (
								{duration:_duration,startValue:_startValue,endValue:_endValue},
								Uize.pairUp (_pTarget,_target),
								_fadeStateProperties
							)
						)
					).wire ({
						'Changed.inProgress':
							function (_event) {
								var m = _event.source;
								_event.newValue
									? _fadePool.push (m)
									: _fadePool.splice (Uize.indexIn (_fadePool,m),1)
								;
							},
						'Changed.value':
							function (_event) {
								var
									m = _event.source,
									_target = m [_pTarget],
									_context = _target.context,
									_handler = _target.handler,
									_value = _event.newValue
								;
								(typeof _handler == 'string' ? _context [_handler] : _handler)
									[Uize.isArray (_value) ? 'apply' : 'call'] (_context,_value)
									// this pattern comes up from time to time, so perhaps put a static method in Uize for it?
								;
							}
					});
					_startNow !== _false && _newFadeHolder [0].start ();

				return _newFadeHolder.pop ();
				/*?
					Static Methods
						Uize.Fade.Factory.fade
							Lets you conveniently initiate a generic fade process.

							SYNTAX
							..................................
							fadeOBJ = Uize.Fade.Factory.fade (
								targetINSTorFUNCorOBJ,
								startValueANYTYPE,
								endValueANYTYPE,
								durationINT
							);
							..................................

							EXAMPLE 1
							...........................................
							Uize.Fade.Factory.fade (slider,0,100,2000);
							...........................................

							In the above example, the =value= state property for the =Uize.Widget.Bar.Slider= instance =slider= would be faded from =0= to =100= over =2000= milliseconds (2 seconds).

							EXAMPLE 2
							....................................................
							Uize.Fade.Factory.fade (scrollTo,[0,0],[0,200],500);
							....................................................

							In the above example, the vertical scroll position of the document will be faded from =0= to =200= over a half second.

							The =scrollTo= method of the =window= object takes two parameters: left scroll position, and top scroll position. Using the =Uize.Fade.Factory.fade= method to fade calls to this function, a start parameter list of =[0,0]= is specified, and an end parameter list of =[0,200]= is specified. This has the effect of fading the scroll position of the window from 0,0 to 0,200. In this example, the left scroll position is the same at the start and end of the fade, but there's no saying that it has to be.

							Being able to easily fade function calls with interpolated argument lists is very powerful and makes it easy to do quite a lot in just a short statement. In another example, one could achieve a window roll down effect with a statement like =Uize.Fade.Factory.fade (resizeTo,[1024,0],[1024,768],1000)=.

							EXAMPLE 3
							.......................................................................
							Uize.Fade.Factory.fade (
								function (colors) {
									var docStyle = document.body.style;
									docStyle.color = Uize.Color.to (colors.textColor,'#hex');
									docStyle.backgroundColor = Uize.Color.to (colors.bgColor,'#hex');
								},
								{
									textColor:{red:255,green:0,blue:255}, // purple
									bgColor:{red:0,green:0,blue:0}        // black
								},
								{
									textColor:{red:0,green:0,blue:0},     // black
									bgColor:{red:255,green:0,blue:255}    // purple
								},
								3000
							);
							.......................................................................

							In the above example, the text and background colors for the document would be faded from purple on black to black on purple over =3000= milliseconds (3 seconds).

							The start and end values specified for the fade are complex values, each being an object with =textColor= and =bgColor= properties that are, themselves, objects representing the =red=, =green=, and =blue= color channel values for RGB colors. On each update of the fade the specified handler function is called, with the interpolated value for the fade being passed to the function as its single parameter. The structure of the interpolated value matches the structure of the start and end values, and so its =textColor= and =bgColor= properties are accessed and used to set the colors on the document body's style object.

							VARIATION 1
							..................................
							fadeOBJ = Uize.Fade.Factory.fade (
								targetINSTorFUNCorOBJ,
								startValueANYTYPE,
								endValueANYTYPE,
								durationINT,
								fadePropertiesOBJ
							);
							..................................

							When the optional =fadePropertiesOBJ= parameter is specified, additional values can be specified for the state properties of the =Uize.Fade= class - such as =curve=, =quantization=, etc. These property values will be set on the =Uize.Fade= instance that is created to service the fade process requested by calling this method.

							VARIATION 2
							..................................
							fadeOBJ = Uize.Fade.Factory.fade (
								targetINSTorFUNCorOBJ,
								startValueANYTYPE,
								endValueANYTYPE,
								durationINT,
								fadePropertiesOBJ,
								startNowBOOL
							);
							..................................

							By default, fades created using the =Uize.Fade.Factory.fade= method are started immediately. If you do not wish the fade to start immediately, but wish to initiate the fade at a later time by using the =start= instance method of the =Uize.Fade= instance returned from the =Uize.Fade.Factory.fade= method, then you can specify the value =false= for the optional =startNowBOOL= parameter. If you wish to use the =startNowBOOL= parameter but do not wish to specify any fade properties, then you should specify the value =null= for the =fadePropertiesOBJ= parameter.
				*/
			}

			function _fadeMethod (_context,_method,_startValue,_endValue,_duration,_fadeStateProperties,_startNow) {
				return _fade.call (
					this,{context:_context,handler:_method},_startValue,_endValue,_duration,_fadeStateProperties,_startNow
				);
				/*?
					Static Methods
						Uize.Fade.Factory.fadeMethod
							Lets you conveniently initiate a method call fade process.

							SYNTAX
							........................................
							fadeOBJ = Uize.Fade.Factory.fadeMethod (
								contextOBJ,
								methodSTRorFUNC,
								startValueANYTYPE,
								endValueANYTYPE,
								durationINT
							);
							........................................

							VARIATION 1
							........................................
							fadeOBJ = Uize.Fade.Factory.fadeMethod (
								contextOBJ,
								methodSTRorFUNC,
								startValueANYTYPE,
								endValueANYTYPE,
								durationINT,
								fadePropertiesOBJ
							);
							........................................

							When the optional =fadePropertiesOBJ= parameter is specified, additional values can be specified for the state properties of the =Uize.Fade= class - such as =curve=, =quantization=, etc. These property values will be set on the =Uize.Fade= instance that is created to service the fade process requested by calling this method.

							VARIATION 2
							........................................
							fadeOBJ = Uize.Fade.Factory.fadeMethod (
								contextOBJ,
								methodSTRorFUNC,
								startValueANYTYPE,
								endValueANYTYPE,
								durationINT,
								fadePropertiesOBJ,
								startNowBOOL
							);
							........................................

							By default, fades created using the =Uize.Fade.Factory.fadeMethod= method are started immediately. If you do not wish the fade to start immediately, but wish to initiate the fade at a later time by using the =start= instance method of the =Uize.Fade= instance returned from the =Uize.Fade.Factory.fadeMethod= method, then you can specify the value =false= for the optional =startNowBOOL= parameter. If you wish to use the =startNowBOOL= parameter but do not wish to specify any fade properties, then you should specify the value =null= for the =fadePropertiesOBJ= parameter.
				*/
			}

			function _fadeProperties (_target,_startValues,_endValues,_duration,_fadeStateProperties,_startNow) {
				return _fadeMethod.call (
					this,_target,'set',_startValues,_endValues,_duration,_fadeStateProperties,_startNow
				);
				/*?
					Static Methods
						Uize.Fade.Factory.fadeProperties
							Lets you conveniently initiate a fade process for state properties of an instance.

							SYNTAX
							............................................
							fadeOBJ = Uize.Fade.Factory.fadeProperties (
								instanceOBJ,
								propertiesStartValuesOBJ,
								propertiesEndValuesOBJ,
								durationINT
							);
							............................................

							VARIATION 1
							............................................
							fadeOBJ = Uize.Fade.Factory.fadeProperties (
								instanceOBJ,
								propertiesStartValuesOBJ,
								propertiesEndValuesOBJ,
								durationINT,
								fadePropertiesOBJ
							);
							............................................

							When the optional =fadePropertiesOBJ= parameter is specified, additional values can be specified for the state properties of the =Uize.Fade= class - such as =curve=, =quantization=, etc. These property values will be set on the =Uize.Fade= instance that is created to service the fade process requested by calling this method.

							VARIATION 2
							............................................
							fadeOBJ = Uize.Fade.Factory.fadeProperties (
								instanceOBJ,
								propertiesStartValuesOBJ,
								propertiesEndValuesOBJ,
								durationINT,
								fadePropertiesOBJ,
								startNowBOOL
							);
							............................................

							By default, fades created using the =Uize.Fade.Factory.fadeProperties= method are started immediately. If you do not wish the fade to start immediately, but wish to initiate the fade at a later time by using the =start= instance method of the =Uize.Fade= instance returned from the =Uize.Fade.Factory.fadeProperties= method, then you can specify the value =false= for the optional =startNowBOOL= parameter. If you wish to use the =startNowBOOL= parameter but do not wish to specify any fade properties, then you should specify the value =null= for the =fadePropertiesOBJ= parameter.

							NOTES
							- compare to the =Uize.Fade.Factory.fadeProperty= static method
				*/
			}

			function _fadeProperty (_target,_propertyName,_startValue,_endValue,_duration,_fadeStateProperties,_startNow) {
				var
					_startValueObj = {},
					_endValueObj = {}
				;
				_startValueObj [_propertyName] = _startValue;
				_endValueObj [_propertyName] = _endValue;
				return _fadeProperties.call (
					this,_target,_startValueObj,_endValueObj,_duration,_fadeStateProperties,_startNow
				);
				/*?
					Static Methods
						Uize.Fade.Factory.fadeProperty
							Lets you conveniently initiate a fade process for a single state property of an instance.

							SYNTAX
							..........................................
							fadeOBJ = Uize.Fade.Factory.fadeProperty (
								instanceOBJ,
								propertyNameSTR,
								propertyStartValueANYTYPE,
								propertyEndValueANYTYPE,
								durationINT
							);
							..........................................

							VARIATION 1
							..........................................
							fadeOBJ = Uize.Fade.Factory.fadeProperty (
								instanceOBJ,
								propertyNameSTR,
								propertyStartValueANYTYPE,
								propertyEndValueANYTYPE,
								durationINT,
								fadePropertiesOBJ
							);
							..........................................

							When the optional =fadePropertiesOBJ= parameter is specified, additional values can be specified for the state properties of the =Uize.Fade= class - such as =curve=, =quantization=, etc. These property values will be set on the =Uize.Fade= instance that is created to service the fade process requested by calling this method.

							VARIATION 2
							..........................................
							fadeOBJ = Uize.Fade.Factory.fadeProperty (
								instanceOBJ,
								propertyNameSTR,
								propertyStartValueANYTYPE,
								propertyEndValueANYTYPE,
								durationINT,
								fadePropertiesOBJ,
								startNowBOOL
							);
							..........................................

							By default, fades created using the =Uize.Fade.Factory.fadeProperty= method are started immediately. If you do not wish the fade to start immediately, but wish to initiate the fade at a later time by using the =start= instance method of the =Uize.Fade= instance returned from the =Uize.Fade.Factory.fadeProperty= method, then you can specify the value =false= for the optional =startNowBOOL= parameter. If you wish to use the =startNowBOOL= parameter but do not wish to specify any fade properties, then you should specify the value =null= for the =fadePropertiesOBJ= parameter.

							NOTES
							- compare to the =Uize.Fade.Factory.fadeProperties= static method
				*/
			}

			return Uize.copyInto (
				_host,
				{
					fade:_fade,
					fadeMethod:_fadeMethod,
					fadeProperties:_fadeProperties,
					fadeProperty:_fadeProperty
				}
			);
		}

		return _extend (Uize.package ({extend:_extend}),Uize.Fade);
	}
});

