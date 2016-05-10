/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Drag Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2005-2016 UIZE
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
		'Uize.Dom.Basics',
		'Uize.Dom.Pos',
		'Uize.Dom.Event',
		'Uize.Fade.Factory'
	],
	builder:function  (_superclass) {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_undefined,
				_true = true,
				_false = false,
				_Uize_Dom_Basics = Uize.Dom.Basics,
				_getEventAbsPos = Uize.Dom.Pos.getEventAbsPos,
				_isIe = _Uize_Dom_Basics.isIe,

			/*** General Variables ***/
				_dragShield,
				_hasStickyDragIssue = _false,
				_useFixedPositioningForShield = _false
		;

		if (typeof navigator != 'undefined') {
			var _ieMajorVersion = _Uize_Dom_Basics.ieMajorVersion;
			_hasStickyDragIssue = _isIe && _ieMajorVersion < 9;
			_useFixedPositioningForShield = !_isIe || _ieMajorVersion > 6;
		}

		/*** Private Instance Methods ***/
			function _fireDragRestEvent (m) {
				m._dragRestTimeout = null;
				m.fire ('Drag Rest');
			}

			function _flushDragRestTimeout (m) {
				m._dragRestTimeout && clearTimeout (m._dragRestTimeout);
				m._dragRestTimeout = null;
			}

			function _updateUiCursor (m) {
				if (m.isWired) {
					var _node = m.getNode ();
					m._cursor
						? _Uize_Dom_Basics.setStyle (
							m._inDrag ? [_node,_dragShield] : _node,
							{cursor:m.get ('enabledInherited') ? m._cursor : 'not-allowed'}
						)
						: m.set ({_cursor:_Uize_Dom_Basics.getStyle (_node,'cursor')})
					;
				}
			}

		function _mousedown (_event,_notRelayed) {
			var
				m = this,
				_eventStartPos = m._eventStartPos,
				_eventPos = m._eventPos,
				_eventPreviousPos = m._eventPreviousPos
			;

			function _dragDone (_event) {
				if (m._inDrag) {
					if (m._fade) {
						m._fade.stop ();
						m._fade = _undefined;
					}
					_dragIsDone = _true;
					if (m._dragRestTimeout) {
						_flushDragRestTimeout (m);
						_fireDragRestEvent (m);
					}
					m.set ({
						_inCancel:_false,
						_inDrag:_false,
						_inReleaseTravel:_false,
						_isTouch:_false
					});
					m.fire ({name:'Drag Done',domEvent:_event});
					m.set ({
						_dragCancelled:_false,
						_dragStarted:_false
					});
					if (_isTouch) {
						m.unwireNode (
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
				m.set (_phasePropertyName,_true);
				(
					m._fade = Uize.Fade.Factory.fade (
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
				if (m._releaseTravel) {
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
							_releaseTravelProperties = m._releaseTravel (
								_eventDistance / ((m._eventTime - m._eventPreviousTime) || 1) * 1000
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
				m._eventPreviousTime = m._eventTime;
				m._eventTime = Uize.now ();
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
					m._eventDeltaPos [_axis] =
						(
							m._dragAxisMode == 'both' ||
							_absEventDeltaPos [_axis] > _absEventDeltaPos [1 - _axis] ||
							(_absEventDeltaPos [_axis] == _absEventDeltaPos [1 - _axis] && _axis == 1)
						)
						? _eventDeltaPos [_axis] : 0
				;
				m.fire ('Drag Update');

				_flushDragRestTimeout (m);
				m._dragRestTimeout = setTimeout (function () {_fireDragRestEvent (m)},m._dragRestTime);
			}

			function _handleMoveEvent (_event) {
				if (!_dragIsDone && !m._dragCancelled) {
					if (!m._dragStarted) {
						if (!_isTouch) {
							m.Class.resizeShield (_dragShield);
							_Uize_Dom_Basics.display (_dragShield);
						}
						m.set ({_dragStarted:_true});
						m.fire ({name:'Drag Start',domEvent:_event});
					}
					var _dragEventPos = _getEventAbsPos (_event);
					_dragMove (_dragEventPos.left,_dragEventPos.top);
				}
			}

			function _cancelDrag (_event) {
				m.set ({_dragCancelled:_true});
				if (m._cancelFade) {
					_fadeDragMoveTo ('inCancel',_eventStartPos,500,m._cancelFade);
				} else {
					_dragMove (_eventStartPos [0],_eventStartPos [1]);
					_dragDone (_event);
				}
			}

			if (m._inCancel || m._inReleaseTravel)
				_dragDone (_event)
			;
			if (!m._inDrag && m.get ('enabledInherited')) {
				var _isTouch = !!_event.targetTouches;

				m.set ({_inDrag:_true,_isTouch:_isTouch});
				_updateUiCursor (m);
				Uize.Dom.Event.abort (_event);
				m._dragAxisMode = _event.shiftKey ? 'one' : 'both';

				m.fire ({name:'Before Drag Start',domEvent:_event});

				var _dragEventPos = _getEventAbsPos (_event);
				_eventStartPos [0] = _eventPos [0] = _eventPreviousPos [0] = _dragEventPos.left;
				_eventStartPos [1] = _eventPos [1] = _eventPreviousPos [1] = _dragEventPos.top;
				m._eventTime = m._eventPreviousTime = Uize.now ();

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
					m.wireNode (
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
						_Uize_Dom_Basics.display (_dragShield,_false);
						m._dragCancelled || _endDragWithPossibleReleaseTravel (_event);
					};
					document.onmousemove = function (_event) {
						_event || (_event = window.event);
						_hasStickyDragIssue && _event.button == 0
							? m._inDrag && _cleanupAfterMouseDrag (_event)
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
						Uize.Dom.Event.isKeyEscape (_event) && m._inDrag && _cancelDrag (_event);
					};
				}
			}
			return _false;
		};

		return _superclass.subclass ({
			alphastructor:function () {
				var m = this;

				/*** Public Instance Properties ***/
					m.eventStartPos = m._eventStartPos = [0,0];
					m.eventPos = m._eventPos = [0,0];
					m._eventPreviousPos = [0,0];
					m._eventTime = m._eventPreviousTime = 0;
					m.eventDeltaPos = m._eventDeltaPos = [0,0];
			},

			instanceMethods:{
				initiate:_mousedown,
				mousedown:_mousedown,

				updateUi:function () {
					var m = this;
					m.isWired && !m.get ('enabledInherited') || m._cursor && _updateUiCursor (m);
				},

				wireUi:function () {
					var m = this;
					if (!m.isWired) {
						var _rootNode = m.getNode ();
						if (_rootNode) {
							_rootNode.onmousedown = Uize.returnFalse;
							var _initiate = function (_event) {return m.initiate (_event,_true)};
							m.wireNode (_rootNode,{mousedown:_initiate,touchstart:_initiate});
						}
						if (!_dragShield) {
							_dragShield = m.Class.insertShield ({zIndex:50000});
							_useFixedPositioningForShield ||
								_Uize_Dom_Basics.wire (window,'resize',function () {m.Class.resizeShield (_dragShield)})
							;
						}

						m.wire ({'Changed.enabledInherited':function () {_updateUiCursor (m)}});

						_superclass.doMy (m,'wireUi');
					}
				}
			},

			staticMethods:{
				insertShield:function (_extraStyleProperties) {
					var
						m = this,
						_styleProperties = {
							display:'none',
							position:'absolute'
						}
					;
					if (_isIe)
						_styleProperties.background = 'url(' + m.getBlankImageUrl () + ')'
						/* NOTE:
							using a transparent image for the background of the drag shield DIV is not necessary in Firefox and slows rendering on drag refreshes
						*/
					;
					var _shield = document.createElement ('div');
					_Uize_Dom_Basics.setStyle (_shield,Uize.copyInto (_styleProperties,_extraStyleProperties));
					_shield.Uize_Widget_Drag_shield = _true;
					document.body.appendChild (_shield);
					m.resizeShield (_shield);
					return _shield;
				},

				resizeShield:function (_shield) {
					/* TO DO:
						- for browsers that support fixed positioning, updating the position and size only needs to happen once: at the time of initializing the shield. For IE6, we need to watch document scroll and resize. The best way to clean this up and factor it out would be to create a shield widget. Uize.Widget.Drag could share one instance, and instances of Uize.Widget.Dialog could each create their own.
					*/
					if (_useFixedPositioningForShield) {
						_Uize_Dom_Basics.setStyle (
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
								_Uize_Dom_Basics.setStyle (
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
							_shieldStyleDisplay = _Uize_Dom_Basics.getStyle (_shield,'display'),
							_documentElement = document.documentElement,
							_documentBody = document.body
						;
						_Uize_Dom_Basics.display (_shield,_false);
						_Uize_Dom_Basics.setStyle (
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
				}
			},

			stateProperties:{
				_animation:{
					name:'animation',
					onChange:function () {this.set ({_cancelFade:this._animation ? {duration:500} : _undefined})}
				},
				_cancelFade:'cancelFade',
				_cursor:{
					name:'cursor',
					onChange:function () {_updateUiCursor (this)}
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
			}
		});
	}
});

