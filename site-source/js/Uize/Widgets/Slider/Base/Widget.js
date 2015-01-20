/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.Slider.Base.Widget Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013-2015 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 1
	codeCompleteness: 100
	docCompleteness: 5
*/

/*?
	Introduction
		The =Uize.Widgets.Slider.Base.Widget= class implements an abstract base class for slider widget classes.

		*DEVELOPERS:* `Chris van Rensburg`

		Visual Sampler
			Below is a visual sampler of the =Uize.Widgets.Slider.Base.Widget= class...

			...................................................
			<< widget >>

			widgetClass: Uize.Widgets.Slider.Base.VisualSampler
			...................................................
*/

Uize.module ({
	name:'Uize.Widgets.Slider.Base.Widget',
	superclass:'Uize.Widget.Bar.Slider',
	required:[
		'Uize.Widget.mV2',
		'Uize.Widgets.Slider.Base.Html',
		'Uize.Widgets.Slider.Base.Css'
	],
	builder:function (_superclass) {
		'use strict';

		var _superUpdateUi = _superclass.prototype.updateUi;

		function _displayedStyleWidthHeight (_orientation,_trackLength,_isWidth) {
			return (
				(_orientation != 'horizontal') == _isWidth
					? ''
					: typeof _trackLength == 'number'
						? _trackLength + 'px'
						: _trackLength
			);
		}

		return _superclass.subclass ({
			mixins:Uize.Widget.mV2,

			stateProperties:{
				_trackLength:{
					name:'trackLength',
					value:''
				},

				/*** derived properties ***/
					_displayedStyleWidth:{
						name:'displayedStyleWidth',
						derived:function (orientation,trackLength) {
							return _displayedStyleWidthHeight (orientation,trackLength,true);
						}
					},
					_displayedStyleHeight:{
						name:'displayedStyleHeight',
						derived:function (orientation,trackLength) {
							return _displayedStyleWidthHeight (orientation,trackLength,false);
						}
					}
			},

			set:{
				html:Uize.Widgets.Slider.Base.Html,
				orientation:'horizontal'
			},

			cssBindings:{
				orientation:'value'
			},

			htmlBindings:{
				displayedStyleWidth:[':style.width',_superUpdateUi],
				displayedStyleHeight:[':style.height',_superUpdateUi]
			},

			staticProperties:{
				cssModule:Uize.Widgets.Slider.Base.Css
			}
		});
	}
});

