/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Swap.Image.Cycle Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2005-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 2
	codeCompleteness: 100
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Widget.Swap.Image.Cycle= class extends its superclass by adding the ability to specify a set of images that the widget should cycle through.

		*DEVELOPERS:* `Chris van Rensburg`

		The =Uize.Widget.Swap.Image.Cycle= class adds the ability to specify a set of image URLs and have the widget automatically cycle through the images, with a configurable time interval between consecutive images, and the option of cycling through a set of swap effect settings so that each image is revealed with a different effect.
*/

Uize.module ({
	name:'Uize.Widget.Swap.Image.Cycle',
	builder:function  (_superclass) {
		'use strict';

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
							_this._imageNo = -1;
							_this._running = _false;
							_this._advanceTimeout = null;

						/*** Initialization ***/
							_this.fade.wire (
								'Done',
								function () {
									if (_this._running && (_this._imageNo < _this._images.length - 1 || _this._loop))
										_this._advanceTimeout = setTimeout (function () {_this._advance ()},_this._interval)
									;
								}
							);
					}
				),
				_classPrototype = _class.prototype
			;

		/*** Private Instance Methods ***/
			_classPrototype._clearAdvanceTimeout = function () {
				if (this._advanceTimeout) {
					clearTimeout (this._advanceTimeout);
					this._advanceTimeout = null;
				}
			};

			_classPrototype._advance = function () {
				var
					_this = this,
					_cycleSettings = _this._cycleSettings
				;
				_this._clearAdvanceTimeout ();
				_cycleSettings &&
					_this.set (_cycleSettings [_this._cycleSettingNo = (_this._cycleSettingNo + 1) % _cycleSettings.length])
				;
				_this.set ({src:_this._images [_this._imageNo = (_this._imageNo + 1) % _this._images.length]});
			};

		/*** Public Instance Methods ***/
			_classPrototype.start = function () {
				this._running = _true;
				this._advance ();
			};

			_classPrototype.stop = function () {
				this._clearAdvanceTimeout ();
				this._running = _false;
			};

		/*** State Properties ***/
			_class.stateProperties ({
				_images:{
					name:'images',
					value:[]
				},
				_interval:{
					name:'interval',
					value:2000
				},
				_loop:{
					name:'loop',
					value:_true
				},
				_cycleSettings:{
					name:'cycleSettings',
					conformer:function (_value) {return Uize.isArray (_value) ? _value : Uize.values (_value)},
					onChange:function () {this._cycleSettingNo = -1}
				}
			});

		return _class;
	}
});

