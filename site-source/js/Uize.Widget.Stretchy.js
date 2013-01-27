/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Stretchy Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2007-2013 UIZE
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

		*DEVELOPERS:* `Jan Borgersen`, `Michael Cheng`
*/

Uize.module ({
	name:'Uize.Widget.Stretchy',
	required:[
		'Uize.Node',
		'Uize.Fade'
	],
	builder:function (_superclass) {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_true = true,
				_false = false,
				_Uize_Node = Uize.Node
			;

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					null,
					function () {
						var _this = this;

						/*** Private Instance Properties ***/
							_this.fade = Uize.Fade ({
								curve:Uize.Fade.celeration (0,1),
								duration:500,
								quantization:1
							});
					}
				),
				_classPrototype = _class.prototype
			;

		/*** Public Instance Methods ***/
			_classPrototype.wireUi = function () {
				var _this = this;
				if (!_this.isWired) {
					/*** give the shell explicit height ***/
						var
							_shell = _this.getNode(),
							_short = _this.getNode('short'),
							_long = _this.getNode('long'),
							_shortHeight = _Uize_Node.getCoords(_short).height,
							_longHeight = 0;
							_currentShownDiv = _short
						;
						_Uize_Node.setStyle(_shell,{
							height:_Uize_Node.getCoords(_shell).height,
							overflow:'hidden'
						});
						_Uize_Node.setStyle([_short,_long],{
							position:'absolute',
							top:0,
							left:0
						});

					/*** wire up links ***/
						_this.fade.wire ({
							'Changed.value':
								function () {
									_Uize_Node.setStyle(_shell,{height:_this.fade});
								},
							Done:
								function () {
									if( _currentShownDiv == _short ) {
										_this.displayNode(_long,_false);
										_this.displayNode(_short);
									}
								}
						});

						var
							_showLong = function (){
								_this.displayNode(_short,_false);
								_this.displayNode(_long);
								_longHeight = _longHeight || _Uize_Node.getCoords(_long).height;
								_currentShownDiv = _long;
								_this.fade.start ({
									startValue: _shortHeight,
									endValue: _longHeight
								});
							},
							_showShort = function (){
								_currentShownDiv = _short;
								_longHeight = _longHeight || _Uize_Node.getCoords(_long).height;
								if( !_shortHeight ) {
									_this.displayNode(_short);
									_shortHeight = _Uize_Node.getCoords(_short).height;
									_this.displayNode(_short, _false);
								}
								_this.fade.start ({
									startValue:_longHeight,
									endValue:_shortHeight
								});
							}
						;
						_this.wireNode ('expand', 'click',
							function() {
								_this.fire ({name:'Expand', handler:_showLong}).handled || _showLong();
							}
						);
						_this.wireNode ('contract','click',_showShort);

					_superclass.prototype.wireUi.call (_this);
				}
			};

		return _class;
	}
});

