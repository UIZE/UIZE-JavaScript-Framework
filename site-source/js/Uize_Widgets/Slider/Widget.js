/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.Slider.Widget Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013 UIZE
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
		The =Uize.Widgets.Slider.Widget= class implements a slider widget that supports several standard sizes and horizontal and vertical orientations.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widgets.Slider.Widget',
	superclass:'Uize.Widget.Bar.Slider',
	required:[
		'Uize.Widgets.Slider.Html',
		'Uize.Widgets.Slider.Css',
		'Uize.Template'
	],
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			omegastructor:function () {
				var _this = this;

				_this.once (
					'wired',
					function () {
						_this.onChange (
							function (orientation,trackLength) {
								return (
									orientation == 'horizontal'
										? {width:trackLength,height:''}
										: {width:'',height:trackLength}
								);
							},
							function (_dimsStyle) {_this.isWired && _this.setNodeStyle ('',_dimsStyle)}
						);

						_this.onChange (
							'emptyColor',
							function (_emptyColor) {
								_this.isWired && _emptyColor && _this.setNodeStyle ('empty',{backgroundColor:_emptyColor});
							}
						);

						_this.onChange (
							'fullColor',
							function (_fullColor) {
								_this.isWired && _fullColor && _this.setNodeStyle ('full',{backgroundColor:_fullColor});
							}
						);
					}
				);
			},

			stateProperties:{
				_size:{
					name:'size',
					value:'medium'
				},
				_trackLength:{
					name:'trackLength',
					value:''
				},
				_emptyColor:'emptyColor',
				_fullColor:'fullColor'
			},

			set:{
				html:Uize.Widgets.Slider.Html,
				orientation:'horizontal'
			},

			stateToCssBindings:{
				orientation:'value',
				size:'value'
			},

			staticProperties:{
				cssModule:Uize.Widgets.Slider.Css
			}
		});
	}
});

