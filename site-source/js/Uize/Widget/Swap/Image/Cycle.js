/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Swap.Image.Cycle Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2005-2016 UIZE
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

		/*** Private Instance Methods ***/
			function _clearAdvanceTimeout (m) {
				if (m._advanceTimeout) {
					clearTimeout (m._advanceTimeout);
					m._advanceTimeout = null;
				}
			}

			function _advance (m) {
				var _cycleSettings = m._cycleSettings;
				_clearAdvanceTimeout (m);
				_cycleSettings &&
					m.set (_cycleSettings [m._cycleSettingNo = (m._cycleSettingNo + 1) % _cycleSettings.length])
				;
				m.set ({src:m._images [m._imageNo = (m._imageNo + 1) % m._images.length]});
			}

		return _superclass.subclass ({
			alphastructor:function () {
				var m = this;

				/*** Private Instance Properties ***/
					m._imageNo = -1;
					m._running = false;
					m._advanceTimeout = null;

				/*** Initialization ***/
					m.fade.wire (
						'Done',
						function () {
							if (m._running && (m._imageNo < m._images.length - 1 || m._loop))
								m._advanceTimeout = setTimeout (function () {_advance (m)},m._interval)
							;
						}
					);
			},

			instanceMethods:{
				start:function () {
					this._running = true;
					_advance (this);
				},

				stop:function () {
					_clearAdvanceTimeout (this);
					this._running = false;
				}
			},

			stateProperties:{
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
					value:true
				},
				_cycleSettings:{
					name:'cycleSettings',
					conformer:function (_value) {return Uize.isArray (_value) ? _value : Uize.values (_value)},
					onChange:function () {this._cycleSettingNo = -1}
				}
			}
		});
	}
});

