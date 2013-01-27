/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Mask Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2005-2013 UIZE
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
	required:'Uize.Node',
	builder:function (_superclass) {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_true = true,
				_false = false,
				_Uize_Node = Uize.Node
			;

		/*** General Variables ***/
			var _propertiesAffectingDisplay = ['left','top','width','height','img'];

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (),
				_classPrototype = _class.prototype
			;

		/*** Private Methods ***/
			_classPrototype._setImageNode = function() {
				var
					_this = this,
					_img = _this._img,
					_imgNode = _this.getNode('img')
				;

				if (_img) {
					// temporary code while ie6 still exists. It makes the assumption that the img is transparent
					// because this is supposed to be a mask overlay, not a solid mask.
					if (_Uize_Node.isIe && /MSIE 6.0/.test (navigator.appVersion)) {
						_imgNode.style.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'' + _img + '\', sizingMethod=\'crop\')';
						_imgNode.src = _class.getBlankImageUrl();
					}
					else
						_imgNode.src = _img;
				}

			};

		/*** Public Instance Methods ***/
			_classPrototype.getCoords = function () {
				var _this = this;
				return {left:_this._left,top:_this._top,width:_this._width,height:_this._height};
			};

			_classPrototype.updateUi = function () {
				var _this = this;
				if (_this.isWired) {
					/*** check to see if a property affecting display has changed since last updateUi ***/
						var
							_propertiesChanged = _false,
							_lastDisplayPropertyValues = _this._lastDisplayPropertyValues
						;
						if (!_lastDisplayPropertyValues)
							_lastDisplayPropertyValues = _this._lastDisplayPropertyValues = {}
						;
						for (
							var _propertyNo = -1, _propertiesAffectingDisplayLength = _propertiesAffectingDisplay.length;
							++_propertyNo < _propertiesAffectingDisplayLength;
						) {
							var
								_propertyName = _propertiesAffectingDisplay [_propertyNo],
								_propertyValue = _this.get (_propertyName)
							;
							if (_propertyValue !== _lastDisplayPropertyValues [_propertyName]) {
								_lastDisplayPropertyValues [_propertyName] = _propertyValue;
								_propertiesChanged = _true;
							}
						}

					if (_propertiesChanged) {
						var
							_img = _this._img,
							_imgNode = _this.getNode('img'),
							_shellWidth = _this._shellBoundsObj.width,
							_shellHeight = _this._shellBoundsObj.height,
							_left = _this._left,
							_top = _this._top,
							_width = _this._width,
							_height = _this._height,
							_viewBottom = _top + _height,
							_setClipRect = _Uize_Node.setClipRect,
							_maskNodeTop = _this._maskNodeTop,
							_maskNodeLeft = _this._maskNodeLeft,
							_maskNodeRight = _this._maskNodeRight,
							_maskNodeBottom = _this._maskNodeBottom
						;
						if (_img)
							_this._setImageNode();
						else {
							_setClipRect (_maskNodeTop,0,_shellWidth,_top,0);
							_setClipRect (_maskNodeLeft,_top,_left,_viewBottom,0);
							_setClipRect (_maskNodeRight,_top,_shellWidth,_viewBottom,_left + _width);
							_setClipRect (_maskNodeBottom,_viewBottom,_shellWidth,_shellHeight,0);
						}
						_this.displayNode(_imgNode, _img);
						_this.displayNode([_maskNodeTop, _maskNodeRight, _maskNodeLeft, _maskNodeBottom], !_img);
					}
				}
			};

			_classPrototype.wireUi = function () {
				var _this = this;
				if (!_this.isWired) {
					var
						_shell = _this.getNode (),
						_img = _this._img,
						_imgNode = _this.getNode('img'),
						_getClonedMaskNode = function () {
							var _node = _shell.cloneNode (_false);
							_node.removeAttribute ('id');
							_Uize_Node.setStyle (
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
					_this._shellBoundsObj = _Uize_Node.getDimensions (_shell);
					_this._maskNodeTop = _getClonedMaskNode ();
					_this._maskNodeLeft = _getClonedMaskNode ();
					_this._maskNodeRight = _getClonedMaskNode ();
					_this._maskNodeBottom = _getClonedMaskNode ();
					_img && _this._setImageNode();
					_Uize_Node.setStyle (
						_shell,
						{
							background:'transparent',
							opacity:'',
							filter:''
						}
					);

					_this.displayNode(_imgNode, _img);

					_superclass.prototype.wireUi.call (_this);
				}
			};

		/*** State Properties ***/
			var _updateUi = 'updateUi';
			_class.stateProperties ({
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
			});

		return _class;
	}
});

