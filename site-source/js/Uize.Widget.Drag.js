/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Drag Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2005-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 6
	codeCompleteness: 100
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Widget.Drag= class implements support for managing drag operations and draggable nodes - slider / scrollbar knobs, resizer drag handles, etc.

		*DEVELOPERS:* `Chris van Rensburg`, `Jan Borgersen`
*/

Uize.module ({
	name:'Uize.Widget.Drag',
	required:[
		'Uize.Node',
		'Uize.Node.Event'
	],
	builder:function  (_superclass) {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_undefined,
				_true = true,
				_false = false,
				_Uize_Node = Uize.Node,
				_Uize_Node_getEventAbsPos = _Uize_Node.getEventAbsPos,
				_isIe = _Uize_Node.isIe
			;

		/*** General Variables ***/
			var
				_dragShield,
				_hasStickyDragIssue = _false,
				_useFixedPositioningForShield = _false
			;
			if (typeof navigator != 'undefined') {
				var _ieMajorVersion = _Uize_Node.ieMajorVersion;
				_hasStickyDragIssue = _isIe && _ieMajorVersion < 9;
				_useFixedPositioningForShield =
					(!_isIe || _ieMajorVersion > 6) && navigator.userAgent.indexOf ('Firefox/2') < 0
				;
			}

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					function () {
						var _this = this;

						/*** Public Instance Properties ***/
							_this.eventStartPos = _this._eventStartPos = [0,0];
							_this.eventPos = _this._eventPos = [0,0];
							_this._eventPreviousPos = [0,0];
							_this._eventTime = _this._eventPreviousTime = 0;
							_this.eventDeltaPos = _this._eventDeltaPos = [0,0];
					}
				),
				_classPrototype = _class.prototype
			;

		/*** Private Instance Methods ***/
			_classPrototype._fireDragRestEvent = function () {
				this._dragRestTimeout = null;
				this.fire ('Drag Rest');
			};

			_classPrototype._flushDragRestTimeout = function () {
				this._dragRestTimeout && clearTimeout (this._dragRestTimeout);
				this._dragRestTimeout = null;
			};

			_classPrototype._updateUiCursor = function () {
				var _this = this;
				if (_this.isWired) {
					var _node = _this.getNode ();
					_this._cursor
						? _Uize_Node.setStyle (
							_this._inDrag ? [_node,_dragShield] : _node,
							{cursor:_this.get ('enabledInherited') ? _this._cursor : 'not-allowed'}
						)
						: _this.set ({_cursor:_Uize_Node.getStyle (_node,'cursor')})
					;
				}
			};

		/*** Public Instance Methods ***/
			_classPrototype.initiate = _classPrototype.mousedown = function (_event,_notRelayed) {
				var
					_this = this,
					_eventStartPos = _this._eventStartPos,
					_eventPos = _this._eventPos,
					_eventPreviousPos = _this._eventPreviousPos
				;

				function _dragDone (_event) {
					if (_this._inDrag) {
						if (_this._fade) {
							_this._fade.stop ();
							_this._fade = _undefined;
						}
						_dragIsDone = _true;
						if (_this._dragRestTimeout) {
							_this._flushDragRestTimeout ();
							_this._fireDragRestEvent ();
						}
						_this.set ({
							_inCancel:_false,
							_inDrag:_false,
							_inReleaseTravel:_false,
							_isTouch:_false
						});
						_this.fire ({name:'Drag Done',domEvent:_event});
						_this.set ({
							_dragCancelled:_false,
							_dragStarted:_false
						});
						if (_isTouch) {
							_this.unwireNode (
								_notRelayed ? '' : _event.target,
								{touchmove:null,touchend:null,touchcancel:null}
							);
							/* TODO:
								Consider why unwiring touch events makes sense *here*, but restoring document mouse events only makes sense in _cleanupAfterMouseDrag function. What am I missing here that it needs to be this way?
							*/
						}
					}
				}

				function _fadeDragMoveTo (_phasePropertyName,_endPos,_duration,_fadeProperties) {
					_this.set (_phasePropertyName,_true);
					(
						_this._fade = Uize.Fade.fade (
							_dragMove,
							[_eventPos [0],_eventPos [1]],
							_endPos,
							_duration,
							_fadeProperties
						)
					)
						.wire ('Done',function () {_dragDone (_event)})
					;
				}

				function _endDragWithPossibleReleaseTravel (_event) {
					if (_this._releaseTravel && Uize.Fade && Uize.Fade.fade) {
						/*
							QUESTION: do we need to have state like dragCancelled that disables user interaction during release travel phase?
						*/
						var
							_eventDistanceX = _eventPos [0] - _eventPreviousPos [0],
							_eventDistanceY = _eventPos [1] - _eventPreviousPos [1]
						;
						if (_eventDistanceX || _eventDistanceY) {
							var
								_eventDistance = Math.sqrt (Math.pow (_eventDistanceX,2) + Math.pow (_eventDistanceY,2)),
								_releaseTravelProperties = _this._releaseTravel (
									_eventDistance / ((_this._eventTime - _this._eventPreviousTime) || 1) * 1000
								),
								_eventDistanceFactor = 1 + (_releaseTravelProperties.distance / _eventDistance)
							;
							_fadeDragMoveTo (
								'inReleaseTravel',
								[
									_eventPreviousPos [0] + _eventDistanceX * _eventDistanceFactor,
									_eventPreviousPos [1] + _eventDistanceY * _eventDistanceFactor
								],
								_releaseTravelProperties.duration * 1000,
								{curve:_releaseTravelProperties.curve}
							);
							return;
						}
					}
					_dragDone (_event);
				}

				function _dragMove (_eventX,_eventY) {
					_this._eventPreviousTime = _this._eventTime;
					_this._eventTime = Uize.now ();
					_eventPreviousPos [0] = _eventPos [0];
					_eventPreviousPos [1] = _eventPos [1];
					var
						_eventDeltaPos = [
							(_eventPos [0] = _eventX) - _eventStartPos [0],
							(_eventPos [1] = _eventY) - _eventStartPos [1]
						],
						_absEventDeltaPos = [Math.abs (_eventDeltaPos [0]),Math.abs (_eventDeltaPos [1])]
					;
					for (var _axis = -1; ++_axis < 2;)
						_this._eventDeltaPos [_axis] =
							(
								_this._dragAxisMode == 'both' ||
								_absEventDeltaPos [_axis] > _absEventDeltaPos [1 - _axis] ||
								(_absEventDeltaPos [_axis] == _absEventDeltaPos [1 - _axis] && _axis == 1)
							)
							? _eventDeltaPos [_axis] : 0
					;
					_this.fire ('Drag Update');

					_this._flushDragRestTimeout ();
					_this._dragRestTimeout = setTimeout (function () {_this._fireDragRestEvent ()},_this._dragRestTime);
				}

				function _handleMoveEvent (_event) {
					if (!_dragIsDone && !_this._dragCancelled) {
						if (!_this._dragStarted) {
							if (!_isTouch) {
								_class.resizeShield (_dragShield);
								_Uize_Node.display (_dragShield);
							}
							_this.set ({_dragStarted:_true});
							_this.fire ({name:'Drag Start',domEvent:_event});
						}
						var _dragEventPos = _Uize_Node_getEventAbsPos (_event);
						_dragMove (_dragEventPos.left,_dragEventPos.top);
					}
				}

				function _cancelDrag (_event) {
					_this.set ({_dragCancelled:_true});
					if (_this._cancelFade && Uize.Fade && Uize.Fade.fade) {
						_fadeDragMoveTo ('inCancel',_eventStartPos,500,_this._cancelFade);
					} else {
						_dragMove (_eventStartPos [0],_eventStartPos [1]);
						_dragDone (_event);
					}
				}

				if (_this._inCancel || _this._inReleaseTravel)
					_dragDone (_event)
				;
				if (!_this._inDrag && _this.get ('enabledInherited')) {
					var _isTouch = !!_event.targetTouches;

					_this.set ({_inDrag:_true,_isTouch:_isTouch});
					_this._updateUiCursor ();
					Uize.Node.Event.abort (_event);
					_this._dragAxisMode = _event.shiftKey ? 'one' : 'both';

					_this.fire ({name:'Before Drag Start',domEvent:_event});

					var _dragEventPos = _Uize_Node_getEventAbsPos (_event);
					_eventStartPos [0] = _eventPos [0] = _eventPreviousPos [0] = _dragEventPos.left;
					_eventStartPos [1] = _eventPos [1] = _eventPreviousPos [1] = _dragEventPos.top;
					_this._eventTime = _this._eventPreviousTime = Uize.now ();

					var
						_dragIsDone = _false,
						_oldDocumentEvents
					;
					if (!_isTouch)
						_oldDocumentEvents = {
							onkeyup:document.onkeyup,
							onmousemove:document.onmousemove,
							onmouseup:document.onmouseup
						}
					;
					if (_isTouch) {
						_this.wireNode (
							_notRelayed ? '' : _event.target,
							{
								touchmove:function (_event) {
									_event.preventDefault ();
									_handleMoveEvent (_event);
								},
								touchend:function (_event) {
									_event.preventDefault ();
									_endDragWithPossibleReleaseTravel (_event);
								},
								touchcancel:function (_event) {
									_event.preventDefault ();
									_cancelDrag (_event);
								}
							}
						);
					} else {
						var _cleanupAfterMouseDrag = function (_event) {
							Uize.copyInto (document,_oldDocumentEvents);
							_Uize_Node.display (_dragShield,_false);
							_this._dragCancelled || _endDragWithPossibleReleaseTravel (_event);
						};
						document.onmousemove = function (_event) {
							_event || (_event = window.event);
							_hasStickyDragIssue && _event.button == 0
								? _this._inDrag && _cleanupAfterMouseDrag (_event)
									/* NOTE:
										when the user mouses up outside of the document area, the onmouseup event is not fired, so this is a way to catch the next mouse move inside the document where no mouse button is depressed -- can't do this in Firefox, because Firefox doesn't update the value of the button property for each onmousemove event
									*/
								: _handleMoveEvent (_event)
							;
							return _false;
						};
						document.onmouseup = function (_event) {
							_cleanupAfterMouseDrag (_event || window.event);
							return _false;
						};
						document.onkeyup = function (_event) {
							Uize.Node.Event.isKeyEscape (_event) && _this._inDrag && _cancelDrag (_event);
						};
					}
				}
				return _false;
			};

			_classPrototype.updateUi = function () {
				var _this = this;
				_this.isWired && !_this.get ('enabledInherited') || _this._cursor && _this._updateUiCursor ();
			};

			_classPrototype.wireUi = function () {
				var _this = this;
				if (!_this.isWired) {
					var _rootNode = _this.getNode ();
					if (_rootNode) {
						_rootNode.onmousedown = Uize.returnFalse;
						var _initiate = function (_event) {return _this.initiate (_event,_true)};
						_this.wireNode (_rootNode,{mousedown:_initiate,touchstart:_initiate});
					}
					if (!_dragShield) {
						_dragShield = _class.insertShield ({zIndex:50000});
						_useFixedPositioningForShield ||
							_Uize_Node.wire (window,'resize',function () {_class.resizeShield (_dragShield)})
						;
					}
					_this.wire ({'Changed.enabledInherited':function () {_this._updateUiCursor ()}});

					_superclass.prototype.wireUi.call (_this);
				}
			};

		/*** Public Static Methods ***/
			_class.insertShield = function (_extraStyleProperties) {
				var _styleProperties = {
					display:'none',
					position:'absolute'
				};
				if (_isIe)
					_styleProperties.background = 'url(' + _class.getBlankImageUrl () + ')'
					/* NOTE:
						using a transparent image for the background of the drag shield DIV is not necessary in Firefox and slows rendering on drag refreshes
					*/
				;
				var _shield = document.createElement ('div');
				_Uize_Node.setStyle (_shield,Uize.copyInto (_styleProperties,_extraStyleProperties));
				_shield.Uize_Widget_Drag_shield = _true;
				document.body.appendChild (_shield);
				_class.resizeShield (_shield);
				return _shield;
			};

			_class.resizeShield = function (_shield) {
				/* TO DO:
					- for browsers that support fixed positioning, updating the position and size only needs to happen once: at the time of initializing the shield. For IE6, we need to watch document scroll and resize. The best way to clean this up and factor it out would be to create a shield widget. Uize.Widget.Drag could share one instance, and instances of Uize.Widget.Dialog could each create their own.
				*/
				if (_useFixedPositioningForShield) {
					_Uize_Node.setStyle (
						_shield,
						{
							left:'0',
							top:'0',
							width:'100%',
							height:'100%',
							position:'fixed'
						}
					);
				} else {
					/* NOTE:
						This is a workaround for IE6 (which doesn't support fixed positioning) and should be killed as soon as possible.
					*/
					/*
						TO DO: just the following will work better, if we watch scroll events and reposition each time...

							var _documentElement = document.documentElement;
							_Uize_Node.setStyle (
								_shield,
								{
									left:'0',
									top:'0',
									width:_documentElement.clientWidth + 'px',
									height:_documentElement.clientHeight + 'px'
								}
							);
					*/
					var
						_shieldStyleDisplay = _Uize_Node.getStyle (_shield,'display'),
						_documentElement = document.documentElement,
						_documentBody = document.body
					;
					_Uize_Node.display (_shield,_false);
					_Uize_Node.setStyle (
						_shield,
						{
							left:0,
							top:0,
							width:_documentElement.scrollWidth,
							height:
								Math.max (
									typeof window.innerHeight =='number' ? window.innerHeight : (_documentElement && _documentElement.clientHeight ? _documentElement.clientHeight : (_documentBody && _documentBody.clientHeight ? _documentBody.clientHeight : 0)),
									_documentElement.scrollHeight
								),
							display:_shieldStyleDisplay
						}
					);
				}
			};

		/*** State Properties ***/
			_class.stateProperties ({
				_animation:{
					name:'animation',
					onChange:function () {this.set ({_cancelFade:this._animation ? {duration:500} : _undefined})}
				},
				_cancelFade:'cancelFade',
				_cursor:{
					name:'cursor',
					onChange:_classPrototype._updateUiCursor
				},
				_dragCancelled:'dragCancelled',
				_dragRestTime:{
					name:'dragRestTime',
					value:250
				},
				_dragStarted:'dragStarted',
				_inCancel:'inCancel',
				_inDrag:'inDrag',
				_inReleaseTravel:'inReleaseTravel',
				_isTouch:'isTouch',
				_releaseTravel:'releaseTravel'
			});

		return _class;
	}
});

