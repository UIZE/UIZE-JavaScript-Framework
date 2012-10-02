/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.ImagePort.AutoPan Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2006-2012 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*ScruncherSettings Mappings="=d" LineCompacting="TRUE"*/

/*?
	Introduction
		Extends =Uize.Widget.ImagePort= by adding support for automatic panning movement, with reflection against sides.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widget.ImagePort.AutoPan',
	required:[
		'Uize.Fade',
		'Uize.Node'
	],
	builder:function (_superclass) {
		var
			_null = null,
			_Uize_Node = Uize.Node
		;

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					null,
					function () {
						var _this = this;

						/*** Initialization ***/
							_this.set ({
								direction:Math.random () * 360,
								speed:10 + Math.random () * 10
							});
					}
				),
				_classPrototype = _class.prototype
			;

		/*** Private Instance Methods ***/
			_classPrototype._clearTimeout = function () {
				var _this = this;
				if (_this._updateTimeout) {
					clearTimeout (_this._updateTimeout);
					_this._updateTimeout = _null;
				}
			};

			_classPrototype._updateUi = function () {
				var
					_this = this,
					_node = _Uize_Node.getById (_this._node)
				;
				if (_node) {
					/* TO DO:
						- calculate the node's move position
						- determine if node's move position exceeds bounds, if so...
							- change direction
							- calculate exceed amount and reflect that into the new direction
						- move the node to its new position
					*/
				}
			};

		/*** Public Instance Methods ***/
			_classPrototype.start = function () {
				this._updateUi ();
			};

			_classPrototype.stop = function () {
				this._clearTimeout ();
			};

			_classPrototype.wireUi = function () {
				this.start ();
			};

		/*** Register Properties ***/
			_class.registerProperties ({
				_direction:{
					name:'direction',
					onChange:function () {
						// calculate x and y vectors
						var _this = this;
						_this._xVector = .2;
						_this._yVector = -.2;
					}
				},
				_speed:'speed'
			});

			_class.set ({
			});

		return _class;
	}
});

