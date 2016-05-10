/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.ColorGrid Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2005-2016 UIZE
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
		The =Uize.Widget.ColorGrid= class implements a color grid, where total rows and columns is configurable, and colors are interpolated from corner colors.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widget.ColorGrid',
	required:[
		'Uize.Color',
		'Uize.Color.xUtil'
	],
	builder:function (_superclass) {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_Uize_Color = Uize.Color,
				_updateUi = 'updateUi'
		;

		return _superclass.subclass ({
			alphastructor:function () {
				var m = this;

				/*** create the color objects that will be used in interpolation ***/
					m._colorObjectTopLeft = _Uize_Color ();
					m._colorObjectTopRight = _Uize_Color ();
					m._colorObjectBottomLeft = _Uize_Color ();
					m._colorObjectBottomRight = _Uize_Color ();
					m._colorObjectLeft = _Uize_Color ();
					m._colorObjectRight = _Uize_Color ();
					m._colorObjectPoint = _Uize_Color ();
			},

			instanceMethods:{
				randomize:function () {
					this.set ({
						_colorTopLeft:_Uize_Color.random (),
						_colorTopRight:_Uize_Color.random (),
						_colorBottomLeft:_Uize_Color.random (),
						_colorBottomRight:_Uize_Color.random ()
					});
				},

				updateUi:function () {
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
				}
			},

			stateProperties:{
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
			}
		});
	}
});

