/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Bevel Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2005-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 0
	codeCompleteness: 100
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Widget.Bevel= class implements support for a bevel overlay effect for the borders of an image, with configurable bevel thickness and opacity.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widget.Bevel',
	required:[
		'Uize.Node',
		'Uize.Node.Util'
	],
	builder:function (_superclass) {
		'use strict';

		var
			_null = null,
			_Uize_Node = Uize.Node
		;

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					function () {
						var _this = this;

						/*** Private Instance Properties ***/
							_this._imageDims = [0,0];
					}
				),
				_classPrototype = _class.prototype
			;

		/*** Private Instance Methods ***/
			_classPrototype._updateUi = function () {
				var
					_this = this,
					_node = _this.getNode ()
				;
				if (_node) {
					_this._imageDims [0] = _node.offsetWidth;
					_this._imageDims [1] = _node.offsetHeight;
					var
						_boxModelDimOffset = (_Uize_Node.isIe == 'Microsoft Internet Explorer' && document.compatMode != 'CSS1Compat') ? 0 : _this._thickness * 2,
						_borderCommon = 'solid ' + _this._thickness + 'px ',
						_html =
							'<div style="width:' + (_this._imageDims [0] - _boxModelDimOffset) + 'px; height:' + (_this._imageDims [1] - _boxModelDimOffset) + 'px; border-left:' + _borderCommon + '#ccc; border-top:' + _borderCommon + '#fff; border-right:' + _borderCommon + '#444; border-bottom:' + _borderCommon + '#000;' + _Uize_Node.Util.getOpacityStr (_this._opacity) + '">' +
							'&nbsp' +
							'</div>'
					;
					_node.innerHTML = _html;
				}
			};

		/*** Public Instance Methods ***/
			_classPrototype.insertUi = function () {
				this._updateUi ();
			};

		/*** State Properties ***/
			_class.stateProperties ({
				_opacity:{
					name:'opacity',
					onChange:_classPrototype._updateUi,
					value:.3
				},
				_thickness:{
					name:'thickness',
					onChange:_classPrototype._updateUi,
					value:10
				}
			});

		return _class;
	}
});

