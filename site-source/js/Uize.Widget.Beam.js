/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Beam Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2007-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 1
	codeCompleteness: 50
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Widget.Beam= class implements a widget for rendering a beam effect, where the coordinates of the two sides of the beam can be set dynamically.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widget.Beam',
	required:'Uize.Node',
	builder:function  (_superclass) {
		'use strict';

		var
			_null = null,
			_Uize_Node = Uize.Node
		;

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (),
				_classPrototype = _class.prototype
			;

		/*** Public Instance Methods ***/
			var _updateUi = _classPrototype.updateUi = function () {
				var _this = this;
				if (_this.isWired) {
					var
						_width = _this._width,
						_height = _this._height,
						_beamThinSizePixels = Math.round (_height * _this._thinSize),
						_middleTop = Math.round (_height - _beamThinSizePixels) * _this._thinAlign,
						_middleBottom = _middleTop + _beamThinSizePixels - 1
					;
					_this.setNodeStyle ('',_this.get (['left','top','width','height']));
					_this.setNodeStyle ('diamondTopLeft',{left:0,top:0,width:_width,height:_middleTop});
					_this.setNodeStyle (
						'diamondBottomLeft',
						{left:0,top:_middleTop + _beamThinSizePixels,width:_width,height:_height - _beamThinSizePixels - _middleTop}
					);
					_this.setNodeStyle ('middle',{left:0,top:_middleTop,width:_width,height:_beamThinSizePixels});
				}
			};

		/*** State Properties ***/
			_class.stateProperties ({
				_direction:{
					name:'direction',
					onChange:_updateUi,
					value:'right'
				},
				_height:{
					name:'height',
					onChange:_updateUi,
					value:100
				},
				_left:{
					name:'left',
					onChange:_updateUi,
					value:0
				},
				_thinAlign:{
					name:'thinAlign',
					onChange:_updateUi,
					value:.5
				},
				_thinSize:{
					name:'thinSize',
					onChange:_updateUi,
					value:.1
				},
				_top:{
					name:'top',
					onChange:_updateUi,
					value:0
				},
				_width:{
					name:'width',
					onChange:_updateUi,
					value:100
				}
			});

		return _class;
	}
});

