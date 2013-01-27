/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Swap.Image Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2005-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 3
	codeCompleteness: 100
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Widget.Swap.Image= class supports swapping between two image URLs, with an accompanying, highly configurable JavaScript animation effect.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widget.Swap.Image',
	required:[
		'Uize.Node',
		'Uize.Node.Util'
	],
	builder:function (_superclass) {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var _Uize_Node = Uize.Node;

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					function () {
						var _this = this;
						/*** Private Instance Properties ***/
							_this._currentItemNo = 0;
							_this._imagesLoaded = {};
					}
				)
			;

		/*** State Properties ***/
			_class.stateProperties ({
				_background:'background',
				_height:'height',
				_src:{
					name:'src|value',
					onChange:function () {
						var _this = this;
						if (_this.isWired) {
							var
								_currentItem = _this.getNode ('item' + _this._currentItemNo),
								_nextItemNo = 1 - _this._currentItemNo,
								_nextItem = _this.getNode ('item' + _nextItemNo),
								_nextItemImg = _this.getNode ('item' + _nextItemNo + 'Image')
							;
							_nextItem.style.padding = '0px';
							_this.prepareForNextItem (_currentItem,_nextItem);

							var _loadNextImage = function () {
								var _image = _this._imagesLoaded [_this._src];
								_Uize_Node.setStyle (
									_nextItem,
									{
										paddingLeft:(_this.viewFinalCoords [2] + 1 - _image._width) / 2,
										paddingTop:(_this.viewFinalCoords [3] + 1 - _image._height) / 2
									}
								);
								function _nextImageLoaded () {
									_nextItemImg.Uize_Widget_ImageSwap_src = _this._src;
									_this.unwireNode (_nextItemImg);
									_this._currentItemNo = _nextItemNo;
									_this.setCurrentItem (_nextItem);
								}
								if (_nextItemImg.Uize_Widget_ImageSwap_src === _this._src) {
									/* NOTE:
										In IE 5.2 and Safari 1.3- on Mac OS X, the load event for an IMG node is not fired when that node's src is set again to its current value. So, when switching back and forth between two image URLs, the load event cannot be relied upon for triggering the reveal, since we're toggling between two IMG nodes and sometimes an IMG node used to display an image will already have loaded that image from a previous toggle.
									*/
									_nextImageLoaded ();
								} else {
									_this.wireNode (
										_nextItemImg,
										{
											load:_nextImageLoaded,
											error:_nextImageLoaded,
											abort:_nextImageLoaded
										}
									);
									if (_Uize_Node.isIe && /\.png$/i.test (_this._src)) {
										_nextItemImg.style.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'' + _this._src + '\', sizingMethod=\'crop\')';
										_nextItemImg.src = _class.getBlankImageUrl ();
									}
									else {
										_nextItemImg.src = _this._src;
										_nextItemImg.style.filter = null;
									}

									_nextItemImg.width = _image._width;
									_nextItemImg.height = _image._height;
								}
							};
							if (_this._imagesLoaded [_this._src]) {
								_loadNextImage ();
							} else {
								var _imageLoader = new Image;
								/* NOTE:
									We can't use the Uize.Node.wire method here because Safari doesn't implement instances of the Image object as real IMG DOM nodes, and Uize.Node.wire has no effect.
								*/
								_imageLoader.onload = _imageLoader.onerror = _imageLoader.onabort =
									function () {
										_imageLoader = null;
										_this._imagesLoaded [_this._src] = {
											_width:_this._width || this.width,
											_height:_this._height || this.height
										};
										_loadNextImage ();
									}
								;
								_imageLoader.src = _this._src;
							}
						}
					},
					value:''
				},
				_width:'width'
			});

		/*** Override Initial Values for Inherited State Properties ***/
			_class.set ({
				html:{
					process:function (input) {
						var
							_shellNode = this.getNode (),
							_shellSize = _Uize_Node.getDimensions (_shellNode),
							_background = input.background || _Uize_Node.Util.getEffectiveBgColor (_shellNode)
						;
						function _getItemTag (_itemNo) {
							return (
								'<div id="' + input.idPrefix + '-item' + _itemNo +
								'" style="position:absolute; margin:0px; padding:0px; left:0px; top:0px; width:' + _shellSize.width +
								'px; height:' + _shellSize.height + 'px; background:' + _background +
								'; overflow:hidden;"><img id="' + input.idPrefix + '-item' + _itemNo + 'Image" src="' +
								_class.getBlankImageUrl () + '"' +
								(typeof input.width == 'number' ? (' width="' + input.width + '"') : '') +
								(typeof input.height == 'number' ? (' height="' + input.height + '"') : '') + '/></div>'
							);
						}
						return _getItemTag (0) + _getItemTag (1);
					}
				}
			});

		return _class;
	}
});

