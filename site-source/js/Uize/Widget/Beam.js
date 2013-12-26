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

		/*** Private Instance Methods ***/
			function _updateUi () {
				var m = this;
				if (m.isWired) {
					var
						_width = m._width,
						_height = m._height,
						_beamThinSizePixels = Math.round (_height * m._thinSize),
						_middleTop = Math.round (_height - _beamThinSizePixels) * m._thinAlign,
						_middleBottom = _middleTop + _beamThinSizePixels - 1
					;
					m.setNodeStyle ('',m.get (['left','top','width','height']));
					m.setNodeStyle ('diamondTopLeft',{left:0,top:0,width:_width,height:_middleTop});
					m.setNodeStyle (
						'diamondBottomLeft',
						{left:0,top:_middleTop + _beamThinSizePixels,width:_width,height:_height - _beamThinSizePixels - _middleTop}
					);
					m.setNodeStyle ('middle',{left:0,top:_middleTop,width:_width,height:_beamThinSizePixels});
				}
			}

		return _superclass.subclass ({
			instanceMethods:{
				updateUi:function () {
					_superclass.doMy (this,'updateUi');
					_updateUi.call (this);
				}
			},

			stateProperties:{
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
			}
		});
	}
});

