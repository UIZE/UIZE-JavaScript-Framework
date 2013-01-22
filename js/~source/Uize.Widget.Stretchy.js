/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Stretchy Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2007-2012 UIZE
|           |__ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 2
	codeCompleteness: 100
	testCompleteness: 0
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Widget.Stretchy= class implements a widget with long and short views, and controls for toggling between them with an accompanying animation.

		*DEVELOPERS:* `Jan Borgersen`, `Michael Cheng`, `Lisa Nakano`
*/

Uize.module ({
	name:'Uize.Widget.Stretchy',
	required:[
		'Uize.Node',
		'Uize.Fade'
	],
	builder:function (_superclass) {
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

			_classPrototype.setState = function (_isExpanded) {
				var _this = this;
				_this._isExpanded = _isExpanded;
				_this.changeState();
			};

			_classPrototype.changeState = function () {
				var _this = this;
				if (_this.isWired) {
					var 
						_shell = _this.getNode(),
						_short = _this.getNode('short'),
						_long = _this.getNode('long'),
						_shortHeight = _Uize_Node.getCoords(_short).height,
						_currentHeight = _Uize_Node.getCoords(_shell).height,
						_longHeight = 0
					;
					_Uize_Node.setStyle(_shell,{
						height:_Uize_Node.getCoords(_shell).height,
						overflow:'hidden'
					});
					_Uize_Node.setStyle([_short,_long],{
						position:_this._positioning,
						top:0,
						left:0
					});

					function _showLong(){
						_this.displayNode(_short,_false);
						_this.displayNode(_long);
						_longHeight = _longHeight || _Uize_Node.getCoords(_long).height;
						_this.fade.start ({
							startValue: _currentHeight,
							endValue: _longHeight
						});
					}
					function _showShort(){
						_longHeight = _longHeight || _Uize_Node.getCoords(_long).height;
						if( !_shortHeight ) {
							_this.displayNode(_short);
							_shortHeight = _Uize_Node.getCoords(_short).height;
							_this.displayNode(_short, _false);
						}
						_this.fade.start ({
							startValue:_currentHeight,
							endValue:_shortHeight
						});
					}

					if (_this._isExpanded)
						_this.fire ({name:'Before Expand', handler:_showLong}).handled || _showLong();
					else
						_this.fire ({name:'Before Contract', handler:_showShort}).handled || _showShort();
				}
			};

		/*** Public Instance Methods ***/
			_classPrototype.updateUi = function () {
				var _this = this;
				if (_this.isWired) {

					/*** massage heights to handle the dialog case where nothing was visible before ***/
						var
							_shell = _this.getNode(),
							_short = _this.getNode('short'),
							_long = _this.getNode('long')
						;
						_this.displayNode(_short, !_this._isExpanded);
						_this.displayNode(_long, _this._isExpanded);
						_Uize_Node.setStyle(_shell,{
							height:_Uize_Node.getCoords(_this._isExpanded ? _long : _short).height,
							overflow:'hidden'
						});

					_superclass.prototype.updateUi.call (_this);
				}
			};

			_classPrototype.wireUi = function () {
				var _this = this;
				if (!_this.isWired) {
					/*** give the shell explicit height ***/
						var
							_shell = _this.getNode(),
							_short = _this.getNode('short'),
							_long = _this.getNode('long')
						;
						_Uize_Node.setStyle(_shell,{
							height:_Uize_Node.getCoords(_shell).height,
							overflow:'hidden'
						});
						_Uize_Node.setStyle([_short,_long],{
							position:_this._positioning,
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
									_this.displayNode(_long, _this._isExpanded);
									_this.displayNode(_short, !_this._isExpanded);
									_this._isExpanded && 
										_this.fire ('After Expand')
									;
									!_this._isExpanded && 
										_this.fire ('After Contract')
									;
								}
						});

						_this.wireNode ('expand', 'click',
							function() {
								_this._isExpanded = true;
								_this.changeState();
							}
						);
						_this.wireNode ('contract', 'click', 
							function() {
								_this._isExpanded = false;
								_this.changeState();
							}
						);

					_superclass.prototype.wireUi.call (_this);
				}
			};

		/*** Register Properties ***/
			_class.registerProperties ({
				_positioning:{
					name:'positioning',
					value:'absolute'
				},
				_isExpanded:{
					name:'isExpanded',
					value:false,
					onChange:_classPrototype.updateUi
				}
			});

		return _class;
	}
});

