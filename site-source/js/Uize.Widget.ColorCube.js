/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.ColorCube Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2005-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 1
	codeCompleteness: 100
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Widget.ColorCube= class implements a color grid, where total rows and columns is configurable, and colors are interpolated from corner colors.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widget.ColorCube',
	required:[
		'Uize.Color',
		'Uize.Color.xUtil'
	],
	builder:function (_superclass) {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_true = true,
				_false = false,
				_Uize_Color = Uize.Color
			;

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					function () {
						var m = this;

						/*** create the color objects that will be used in interpolation ***/
							m._colorObjectTopLeft = new _Uize_Color;
							m._colorObjectTopRight = new _Uize_Color;
							m._colorObjectBottomLeft = new _Uize_Color;
							m._colorObjectBottomRight = new _Uize_Color;
							m._colorObjectLeft = new _Uize_Color;
							m._colorObjectRight = new _Uize_Color;
							m._colorObjectPoint = new _Uize_Color;
					}
				),
				_classPrototype = _class.prototype
			;

		/*** Public Instance Methods ***/
			var _updateUi = _classPrototype.updateUi = function () {
				var m = this;
				if (m.isWired) {
					var
						_colorObjectTopLeft = m._colorObjectTopLeft.from (m._colorTopLeft),
						_colorObjectTopRight = m._colorObjectTopRight.from (m._colorTopRight),
						_colorObjectBottomLeft = m._colorObjectBottomLeft.from (m._colorBottomLeft),
						_colorObjectBottomRight = m._colorObjectBottomRight.from (m._colorBottomRight),
						_primaryEncoding = _colorObjectTopLeft.encoding,
						_colorObjectLeft = m._colorObjectLeft.setEncoding (_primaryEncoding),
						_colorObjectRight = m._colorObjectRight.setEncoding (_primaryEncoding),
						_colorObjectPoint = m._colorObjectPoint.setEncoding (_primaryEncoding),
						_divisionsX = m._divisionsX,
						_divisionsY = m._divisionsY,
						_divisionSizeX = m._divisionSizeX,
						_divisionSizeY = m._divisionSizeY,
						_nodeNameSuffix
					;

					for (var _divisionY = -1; ++_divisionY < _divisionsY;) {
						_nodeNameSuffix = 'y' + _divisionY;
						var _blendY = _divisionY * _divisionSizeY;
						_colorObjectLeft.blend (_colorObjectTopLeft,_colorObjectBottomLeft,_blendY);
						_colorObjectRight.blend (_colorObjectTopRight,_colorObjectBottomRight,_blendY);
						for (var _divisionX = -1; ++_divisionX < _divisionsX;) {
							_colorObjectPoint.blend (_colorObjectLeft,_colorObjectRight,_divisionX * _divisionSizeX);
							m.getNode ('x' + _divisionX + _nodeNameSuffix).style.backgroundColor =
								_colorObjectPoint.to ('RGB string')
							;
						}
					}
				}
			};

		/*** State Properties ***/
			_class.stateProperties ({
				_colorTopLeft:{
					name:'colorTopLeft',
					onChange:_updateUi,
					value:'ff0000'
				},
				_colorTopRight:{
					name:'colorTopRight',
					onChange:_updateUi,
					value:'ffffff'
				},
				_colorBottomLeft:{
					name:'colorBottomLeft',
					onChange:_updateUi,
					value:'ffff00'
				},
				_colorBottomRight:{
					name:'colorBottomRight',
					onChange:_updateUi,
					value:'ff00ff'
				},
				_divisionsX:{
					name:'divisionsX',
					onChange:function () {this._divisionSizeX = 1 / ((this._divisionsX - 1) || 1)},
					value:10
				},
				_divisionsY:{
					name:'divisionsY',
					onChange:function () {this._divisionSizeY = 1 / ((this._divisionsY - 1) || 1)},
					value:10
				}
			});

		/*** Override Initial Values for Inherited State Properties ***/
			_class.set ({
				html:{
					process:function (input) {
						/* compiled from...
							<% for (var _divisionY = -1, _divisionsY = input.divisionsY; ++_divisionY < _divisionsY;) { %>
							<% 	for (var _divisionX = -1, _divisionsX = input.divisionsX; ++_divisionX < _divisionsX;) { %><img id="<% .idPrefix %>-x<%= _divisionX %>y<%= _divisionY %>" src="<% .blankGif %>" class="swatch"/><% 	} %><br/>
							<% } %>
						*/
						var output = [];
						for (var _divisionY = -1, _divisionsY = input.divisionsY; ++_divisionY < _divisionsY;) {
							output.push("\n");
							for (var _divisionX = -1, _divisionsX = input.divisionsX; ++_divisionX < _divisionsX;) {
								output.push("<img id=\"", input.idPrefix, "-x", _divisionX, "y", _divisionY, "\" src=\"", input.blankGif, "\" class=\"swatch\"/>");
							}
							output.push("<br/>");
						}
						output.push("\n");
						return output.join("");
					}
				}
			});

		return _class;
	}
});

