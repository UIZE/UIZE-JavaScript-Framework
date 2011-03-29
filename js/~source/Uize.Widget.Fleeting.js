/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Fleeting Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2006-2011 UIZE
|           |__ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*ScruncherSettings Mappings="=c" LineCompacting="TRUE"*/

/* Module Meta Data
	type: Class
	importance: 4
	codeCompleteness: 100
	testCompleteness: 0
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Widget.Fleeting= class implements a fleeting message behavior with a configurable display lifespan and a JavaScript animation fade out effect.

		*DEVELOPERS:* `Jan Borgersen`
*/

Uize.module ({
	name:'Uize.Widget.Fleeting',
	required:'Uize.Fade',
	builder:function (_superclass) {
		/*** Variables for Scruncher Optimization ***/
			var
				_true = true,
				_false = false
			;

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					function () {
						var _this = this;

						/*** Private Instance Properties ***/
							_this._lifeTimeout = null;
							_this._showFade = new Uize.Fade ({
								curve:Uize.Fade.celeration (0,1),
								duration:750
							});
							_this._showFade.wire ({
								Start:
									function () {
										if( _this._shown )
											_this.displayNode ('',_this._shown);
									},
								'Changed.value':
									function () {
										_this.setNodeOpacity ('',_this._showFade);
									},
								Done:
									function () {
										if( !_this._shown )
											_this.displayNode ('',_this._shown);
									}
							});
					}
				),
				_classPrototype = _class.prototype
			;

		/*** Public Instance Methods ***/
			_classPrototype.show = function () {
				var _this = this;
				if (_this._lifeTimeout != null) {
					clearTimeout (_this._timeout);
					_this._timeout = null;
				}
				_this.set ({_shown:_true});
			};

		/*** Register Properties ***/
			_class.registerProperties ({
				_maxOpacity:{
					name:'maxOpacity',
					value:1
				},
				_lifeSpan:{
					name:'lifeSpan',
					value:5000
				},
				_shown:{
					name:'shown',
					onChange:function () {
						var _this = this;
						_this._shown && _this.fire ('Before Show');
						_this._showFade.start ({
							startValue: _this._shown ? 0 : _this._maxOpacity,
							endValue: _this._shown ? _this._maxOpacity : 0,
							curve:Uize.Fade.celeration (0,1)
						});
						if( _this._shown ) {
							_this._lifeTimeout = setTimeout( function() {
									_this.set({shown:false});
								}, _this._lifeSpan);
						}
						!_this._shown && _this.fire('After Hide');
					},
					value:_false
				}
			});

		return _class;
	}
});

