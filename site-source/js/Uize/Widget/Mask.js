/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Mask Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2005-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 5
	codeCompleteness: 100
	docCompleteness: 2
*/

/*?
	Introduction
		The Uize.Widget.Mask class implements a dynamic mask overlay that can be used to highlight a region of a view port by masking out surrounding content.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widget.Mask',
	required:[
		'Uize.Dom.Basics',
		'Uize.Dom.Pos'
	],
	builder:function (_superclass) {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_Uize_Dom_Basics = Uize.Dom.Basics,
				_updateUi = 'updateUi',

			/*** General Variables ***/
				_propertiesAffectingDisplay = ['left','top','width','height','img']
		;

		/*** Private Instance Methods ***/
			function _setImageNode (m) {
				var
					_img = m._img,
					_imgNode = m.getNode('img')
				;

				if (_img) {
					// temporary code while IE6 still exists. It makes the assumption that the img is transparent
					// because this is supposed to be a mask overlay, not a solid mask.
					if (_Uize_Dom_Basics.isIe && /MSIE 6.0/.test (navigator.appVersion)) {
						_imgNode.style.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'' + _img + '\', sizingMethod=\'crop\')';
						_imgNode.src = _class.getBlankImageUrl();
					}
					else
						_imgNode.src = _img;
				}
			}

		return _superclass.subclass ({
			instanceMethods:{
				getCoords:function () {
					var m = this;
					return {left:m._left,top:m._top,width:m._width,height:m._height};
				},

				updateUi:function () {
					var m = this;
					if (m.isWired) {
						/*** check to see if a property affecting display has changed since last updateUi ***/
							var
								_propertiesChanged = false,
								_lastDisplayPropertyValues = m._lastDisplayPropertyValues
							;
							if (!_lastDisplayPropertyValues)
								_lastDisplayPropertyValues = m._lastDisplayPropertyValues = {}
							;
							for (
								var _propertyNo = -1, _propertiesAffectingDisplayLength = _propertiesAffectingDisplay.length;
								++_propertyNo < _propertiesAffectingDisplayLength;
							) {
								var
									_propertyName = _propertiesAffectingDisplay [_propertyNo],
									_propertyValue = m.get (_propertyName)
								;
								if (_propertyValue !== _lastDisplayPropertyValues [_propertyName]) {
									_lastDisplayPropertyValues [_propertyName] = _propertyValue;
									_propertiesChanged = true;
								}
							}

						if (_propertiesChanged) {
							var
								_img = m._img,
								_imgNode = m.getNode('img'),
								_shellWidth = m._shellBoundsObj.width,
								_shellHeight = m._shellBoundsObj.height,
								_left = m._left,
								_top = m._top,
								_width = m._width,
								_height = m._height,
								_viewBottom = _top + _height,
								_setClipRect = _Uize_Dom_Basics.setClipRect,
								_maskNodeTop = m._maskNodeTop,
								_maskNodeLeft = m._maskNodeLeft,
								_maskNodeRight = m._maskNodeRight,
								_maskNodeBottom = m._maskNodeBottom
							;
							if (_img)
								_setImageNode (m);
							else {
								_setClipRect (_maskNodeTop,0,_shellWidth,_top,0);
								_setClipRect (_maskNodeLeft,_top,_left,_viewBottom,0);
								_setClipRect (_maskNodeRight,_top,_shellWidth,_viewBottom,_left + _width);
								_setClipRect (_maskNodeBottom,_viewBottom,_shellWidth,_shellHeight,0);
							}
							m.displayNode(_imgNode, _img);
							m.displayNode([_maskNodeTop, _maskNodeRight, _maskNodeLeft, _maskNodeBottom], !_img);
						}
					}
				},

				wireUi:function () {
					var m = this;
					if (!m.isWired) {
						var
							_shell = m.getNode (),
							_img = m._img,
							_imgNode = m.getNode('img'),
							_getClonedMaskNode = function () {
								var _node = _shell.cloneNode (false);
								_node.removeAttribute ('id');
								_Uize_Dom_Basics.setStyle (
									_node,
									{
										position:'absolute',
										display:_img ? 'none' : 'block',
										visibility:'inherit'
									}
								);
								_shell.appendChild (_node);
								return _node;
							}
						;
						m._shellBoundsObj = Uize.Dom.Pos.getDimensions (_shell);
						m._maskNodeTop = _getClonedMaskNode ();
						m._maskNodeLeft = _getClonedMaskNode ();
						m._maskNodeRight = _getClonedMaskNode ();
						m._maskNodeBottom = _getClonedMaskNode ();
						_img && _setImageNode (m);
						_Uize_Dom_Basics.setStyle (
							_shell,
							{
								background:'transparent',
								opacity:'',
								filter:''
							}
						);

						m.displayNode(_imgNode, _img);

						_superclass.doMy (m,'wireUi');
					}
				}
			},

			stateProperties:{
				_height:{
					name:'height',
					onChange:_updateUi,
					value:200
				},
				_img:{
					name:'img',
					onChange:_updateUi,
					value:''
				},
				_left:{
					name:'left',
					onChange:_updateUi,
					value:0
				},
				_top:{
					name:'top',
					onChange:_updateUi,
					value:0
				},
				_width:{
					name:'width',
					onChange:_updateUi,
					value:200
				}
			}
		});
	}
});

