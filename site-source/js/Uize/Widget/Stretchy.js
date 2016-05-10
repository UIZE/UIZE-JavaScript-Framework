/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Stretchy Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2007-2016 UIZE
|           |__ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 2
	codeCompleteness: 100
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Widget.Stretchy= class implements a widget with long and short views, and controls for toggling between them with an accompanying animation.

		*DEVELOPERS:* `Lisa Nakano`, `Jan Borgersen`, `Michael Cheng`
*/

Uize.module ({
	name:'Uize.Widget.Stretchy',
	required:[
		'Uize.Dom.Basics',
		'Uize.Dom.Pos',
		'Uize.Fade'
	],
	builder:function (_superclass) {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_Uize_Dom = Uize.Dom,
				_getCoords = _Uize_Dom.Pos.getCoords,
				_setStyle = _Uize_Dom.Basics.setStyle
		;

		return _superclass.subclass ({
			omegastructor:function () {
				var m = this;

				/*** Private Instance Properties ***/
					m.fade = Uize.Fade ({
						curve:Uize.Fade.celeration (0,1),
						duration:500,
						quantization:1
					});
			},

			instanceMethods:{
				setState:function (_isExpanded) {
					var m = this;
					m._isExpanded = _isExpanded;
					m.changeState();
				},

				changeState:function () {
					var m = this;
					if (m.isWired) {
						var
							_shell = m.getNode(),
							_short = m.getNode('short'),
							_long = m.getNode('long'),
							_shortHeight = _getCoords(_short).height,
							_currentHeight = _getCoords(_shell).height,
							_longHeight = 0,
							_showLong = function() {
								m.displayNode(_short,false);
								m.displayNode(_long);
								_longHeight = _longHeight || _getCoords(_long).height;
								m.fade.start ({
									startValue: _currentHeight,
									endValue: _longHeight
								});
							},
							_showShort = function() {
								_longHeight = _longHeight || _getCoords(_long).height;
								if( !_shortHeight ) {
									m.displayNode(_short);
									_shortHeight = _getCoords(_short).height;
									m.displayNode(_short, false);
								}
								m.fade.start ({
									startValue:_currentHeight,
									endValue:_shortHeight
								});
							}
						;
						_setStyle(_shell,{
							height:_getCoords(_shell).height,
							overflow:'hidden'
						});
						_setStyle([_short,_long],{
							position:m._positioning,
							top:0,
							left:0
						});

						if (m._isExpanded)
							m.fire ({name:'Before Expand', handler:_showLong}).handled || _showLong();
						else
							m.fire ({name:'Before Contract', handler:_showShort}).handled || _showShort();
					}
				},

				updateUi:function () {
					var m = this;
					if (m.isWired) {

						/*** massage heights to handle the dialog case where nothing was visible before ***/
							var
								_shell = m.getNode(),
								_short = m.getNode('short'),
								_long = m.getNode('long')
							;
							m.displayNode(_short, !m._isExpanded);
							m.displayNode(_long, m._isExpanded);
							_setStyle(_shell,{
								height:_getCoords(m._isExpanded ? _long : _short).height,
								overflow:'hidden'
							});

						_superclass.doMy (m,'updateUi');
					}
				},

				wireUi:function () {
					var m = this;
					if (!m.isWired) {
						/*** give the shell explicit height ***/
							var
								_shell = m.getNode(),
								_short = m.getNode('short'),
								_long = m.getNode('long')
							;
							_setStyle(_shell,{
								height:_getCoords(_shell).height,
								overflow:'hidden'
							});
							_setStyle([_short,_long],{
								position:m._positioning,
								top:0,
								left:0
							});

						/*** wire up links ***/
							m.fade.wire ({
								'Changed.value':function (_event) {_setStyle(_shell,{height:_event.newValue})},
								Done:
									function () {
										m.displayNode(_long, m._isExpanded);
										m.displayNode(_short, !m._isExpanded);
										m._isExpanded &&
											m.fire ('After Expand')
										;
										!m._isExpanded &&
											m.fire ('After Contract')
										;
									}
							});

							m.wireNode ('expand', 'click',
								function() {
									m._isExpanded = true;
									m.changeState();
								}
							);
							m.wireNode ('contract', 'click',
								function() {
									m._isExpanded = false;
									m.changeState();
								}
							);

						_superclass.doMy (m,'wireUi');
					}
				}
			},

			stateProperties:{
				_positioning:{
					name:'positioning',
					value:'absolute'
				},
				_isExpanded:{
					name:'isExpanded',
					value:false,
					onChange:'updateUi'
				}
			}
		});
	}
});

