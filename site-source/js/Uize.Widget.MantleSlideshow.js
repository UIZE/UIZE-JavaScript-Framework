/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.MantleSlideshow Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2011 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 4
	codeCompleteness: 0
	testCompleteness: 0
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Widget.MantleSlideshow= class implements a common mantle slideshow widget, where each slide can contain arbitrary markup as opposed to being an image.

		*DEVELOPERS:* `Ben Ilegbodu`
*/

Uize.module ({
	name:'Uize.Widget.MantleSlideshow',
	superclass:'Uize.Widget.Options.Tabbed',
	required:[
		'Uize.Fade',
		'Uize.Node',
		'Uize.Node.Classes',
		'Uize.Widget.Button'
	],
	builder:function (_superclass) {
		/*** Variables for Scruncher Optimization ***/
			var
				_true = true,
				_false = false,
				_null = null,
				
				_Uize = Uize,
				_Uize_Fade = _Uize.Fade,
				_Uize_Node = _Uize.Node,
				_Uize_Node_Classes = _Uize_Node.Classes,
				
				_dissolve = 'dissolve',
				_wipeLeft = 'wipeLeft',
				_wipeRight = 'wipeRight',
				_wipeLeftOver = 'wipeLeftOver',
				_wipeRightOver = 'wipeRightOver'
			;
			
		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					_null,
					function() {
						var _this = this;

						/** private state variables **/
							_this._currentTransitionType = _this._transitionType.forward || _this._transitionType || _null;
							_this._advanceDirection = 1;
						
						/** add child widgets **/
							(
								_this._play = _this.addChild('play', Uize.Widget.Button)
							).wire(
								'Click',
								function() { _this.toggle('playing') }
							);
							(
								_this._next = _this.addChild('next', Uize.Widget.Button)
							).wire(
								'Click',
								function() { _this.advance(1) }
							);
							(
								_this._prev = _this.addChild('prev', Uize.Widget.Button)
							).wire(
								'Click',
								function() { _this.advance(-1) }
							);

						
						/** add fade object **/

							function _tabBodyStart(_valueNo) {
								if (_this.isWired) {
									var
										_additionalStyles = _null,
										_currentValueNo = _this.get('valueNo'),
										_containerWidth = _this._containerWidth,
										_isPrevious = _valueNo != _currentValueNo
									;
									
									switch (_this._currentTransitionType) {
										case _wipeLeft:
										case _wipeLeftOver:
											_additionalStyles = {
												left:_isPrevious ? 0 : _containerWidth,
												zIndex:+!_isPrevious,
												opacity:1
											};
											break;
										case _wipeRight:
										case _wipeRightOver:
											_additionalStyles = {
												left:_isPrevious ? 0 : -_containerWidth,
												opacity:1
											};
											break;
										default:	// dissolve
											_additionalStyles = {
												// to start out we want the previous tab to have full (1) opacity
												// and the current (next) one to have 0 opacity
												opacity:_isPrevious * 1,
												left:0
											};
											break;
									}
									
									_this.setNodeStyle(
										_this.getTabBodyNode(_valueNo),
										_Uize.copyInto(
											{
												bottom:'auto',
												position:'absolute',
												right:'auto',
												top:0,
												zIndex:+!_isPrevious
											},
											_additionalStyles
										)
									);
									_this._displayTabBodyNode(_valueNo, _true);
								}
							}
	
							(_this.fade = new _Uize_Fade).wire({
								Start:function() {
									_this.set({_advancing:_true});
									_tabBodyStart(_this._previousValueNo);
									_tabBodyStart(_this.get('valueNo'));
								},
								'Changed.value':function() {
									var
										_transitionType = _this._currentTransitionType,
										_fadeValue = +_this.fade,
										_containerWidth = _this._containerWidth,
										_previousTabStyle,
										_currentTabStyle
									;
									
									switch (_transitionType) {
										case _wipeLeft:
											_previousTabStyle = {left:-_fadeValue};
										case _wipeLeftOver:	// only the current tab moves
											_currentTabStyle = {left:_containerWidth - _fadeValue};
											break;
										case _wipeRight:
											_previousTabStyle = {left:_fadeValue};
										case _wipeRightOver:	// only the current tab moves
											_currentTabStyle = {left:_fadeValue - _containerWidth};
											break;
										default:
											_previousTabStyle = {opacity:1 - _fadeValue};
											_currentTabStyle = {opacity:_fadeValue};
											break;
									}
									
									_this.setNodeStyle(
										_this.getTabBodyNode(_this._previousValueNo),
										_previousTabStyle
									);
									_this.setNodeStyle(
										_this.getTabBodyNode(_this.get('valueNo')),
										_currentTabStyle
									);
								},
								Done:function() {
									_this._displayTabBodyNode(_this._previousValueNo, _false);
									_this.setNodeStyle(
										_this.getTabBodyNode(_this._previousValueNo),
										{
											opacity:1,
											zIndex:_null
										}
									);
									_this._previousValueNo = _this.get('valueNo');
									_this.set({_advancing:_false});
								}
							});
						
						_this.wire(
							'Changed.value',
							function() {
								if (_this._playing) {
									_this._clearAutoAdvanceTimeout();
									_this._setAutoAdvanceTimeout();
								}
							}
						);
					}
				),
				_classPrototype = _class.prototype
			;

		/*** Private Instance Methods ***/
			_classPrototype._autoAdvance = function() {
				var
					_this = this,
					_valueNo = _this.get('valueNo')
				;
				
				_this._clearAutoAdvanceTimeout();
				_this.advance(1);
			};

			_classPrototype._displayTabBodyNode = function(_valueNo, _mustDisplay) {
				_Uize_Node_Classes.setState(
					this.getTabBodyNode(_valueNo),
					[this.get('bodyClassInactive'), this.get('bodyClassActive')],
					_mustDisplay
				);
			};
			
			_classPrototype._clearAutoAdvanceTimeout = function () {
				var _this = this;
				if (_this.isWired && _this._autoAdvanceTimeout) {
					clearTimeout(_this._autoAdvanceTimeout);
					_this._autoAdvanceTimeout = _null;
				}
			};
			
			_classPrototype._setAutoAdvanceTimeout = function() {
				var _this = this;
				_this.set({_playing:_true});
				_this._autoAdvanceTimeout = setTimeout(function () { _this._autoAdvance() }, _this._interSlideTime)
			};

		/*** Public Instance Methods ***/
			_classPrototype.advance = function(_direction) {
				var
					_this = this,
					_values = _this.get('values'),
					_valueNo = _this.get('valueNo')
				;

				if (_valueNo > -1 && _values.length && !_this._advancing) {
					var
						_newValueNo = _valueNo + _direction,
						_validValueNo = _newValueNo < 0 || _newValueNo >= _values.length
							? _direction >= 0 ? 0 : _values.length - 1
							: _newValueNo
					;

					_this._advanceDirection = _direction;
					_this.set({
						value:typeof _values[0] == 'object'
							? _values[_validValueNo].name
							: _values[_validValueNo]
					});
				}
			};
			
			_classPrototype.updateUiTabState = function (_previousValueNo, _currentValueNo) {
				var
					_this = this,
					_values = _this.get('values'),
					_transitionForward  = _this._transitionType.forward || _this._transitionType || _null,
					_transitionBack  = _this._transitionType.back || _this._transitionType || _null
				;
				
				if (_this.isWired) {
					if (_this._advanceDirection == 0) {
						// a tab button was pressed
						_this._currentTransitionType = _previousValueNo > _currentValueNo ?
							_transitionBack :
							_transitionForward
						;
					} else {
						// we called _this.advance()
						_this._currentTransitionType = _this._advanceDirection < 0 ?
							_transitionBack :
							_transitionForward
						;
						_this._advanceDirection = 0;
					}

					//_this._previousValueNo = _previousValueNo;
					if (_this._currentTransitionType) {
						_this.fade.start({
							curve:_this._transitionCurve || _Uize_Fade.celeration (0,1),
							duration:_this._transitionTime,
							startValue:0,
							endValue:_this._currentTransitionType == _wipeLeft || _this._currentTransitionType == _wipeRight || _this._currentTransitionType == _wipeLeftOver || _this._currentTransitionType == _wipeRightOver
								? _this._containerWidth
								: 1
						});
					}
					else {
						_superclass.prototype.updateUiTabState.call (_this, _previousValueNo, _currentValueNo);
						_this._previousValueNo = _this.get('valueNo');
					}
				}
			};

			_classPrototype.wireUi = function () {
				var _this = this;
				if (!_this.isWired) {
					_this._previousValueNo = _this.get('valueNo');

					_superclass.prototype.wireUi.call (_this);

					_this._containerWidth = _Uize_Node.getDimensions(_this.getNode('slides')).width;
					_this.set({_playing:_true});
				}
			};

		/*** Register Properties ***/
			_class.registerProperties ({
				_advancing:{
					name:'advancing',
					onChange:function() { this.set({enabled:this._advancing ? _false : 'inherit'}) }
				},
				_interSlideTime:{
					name:'interSlideTime',
					value:4000
				},
				_playing:{
					name:'playing',
					onChange:function() {
						var _this = this;
						
						if (_this._playing) {
							if (_this._interSlideTime && _this._interSlideTime < 0) {							
								_this.set({_playing:_false});
							} else {
								_this._clearAutoAdvanceTimeout();
								_this._setAutoAdvanceTimeout();
							}
						}
						else {
							_this._clearAutoAdvanceTimeout();
						}
						
						_this._play
							&& _this._play.set({playing:_this._playing});
					},
					value:_false
				},
				_transitionCurve:'transitionCurve',
				_transitionTime:{
					name:'transitionTime',
					value:1000
				},
				_transitionType:{
					name:'transitionType',
					value:_dissolve
				}
			});

		return _class;
	}
});

