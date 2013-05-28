/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.RgbSliders.Widget Class
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
	docCompleteness: 30
*/

/*?
	Introduction
		The =Uize.Widgets.RgbSliders.Widget= class implements an RGB color picker interface, with sliders for adjusting levels for the red, green, and blue channels.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widgets.RgbSliders.Widget',
	superclass:'Uize.Widget.V2',
	required:[
		'Uize.Color',
		'Uize.Widgets.Slider.Widget',
		'Uize.Widgets.RgbSliders.Html',
		'Uize.Widgets.RgbSliders.Css'
	],
	builder:function (_superclass) {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_undefined,
				_true = true,
				_false = false
			;

		return _superclass.subclass ({
			alphastructor:function () {
				var _this = this;

				_this._color = Uize.Color ();

				/*** Initialization ***/
					function _addSlider (_sliderName,_sliderColor) {
						var _slider = _this.addChild (
							_sliderName,
							Uize.Widgets.Slider.Widget,
							{
								minValue:0,
								maxValue:255,
								orientation:'vertical',
								emptyColor:'#fff',
								fullColor:_sliderColor
							}
						);
						_slider.wire (
							'Changed.value',
							function () {
								_this._settingSliders ||
									_this.set ({_value:_this._color.from (_this._rgbSliders).to ('hex')})
								;
							}
						);
						return _slider;
					}
					_this._rgbSliders = [
						_addSlider ('sliderR','#f00'),_addSlider ('sliderG','#0f0'),_addSlider ('sliderB','#00f')
					];
			},

			instanceMethods:{
				/*** Private Instance Methods ***/
					_updateUiSwatch:function () {
						var _this = this;
						if (_this.isWired) {
							var _value = _this._value;
							_this.setNodeStyle ('swatch',{background:'#' + _value});
							_this.setNodeInnerHtml ('swatch','#' + _value);
						}
					},

				/*** Public Instance Methods ***/
					updateUi:function () {
						var _this = this;
						if (_this.isWired) {
							Uize.callOn (_this.children,'updateUi');
							_this._updateUiSwatch ();
						}
					}
			},

			stateProperties:{
				_sliderHeight:'sliderHeight',
				_size:{
					name:'size',
					value:'medium'
				},
				_value:{
					name:'value',
					conformer:function (_value) {return Uize.Color.to (_value,'hex')},
					onChange:function () {
						var
							_this = this,
							_children = _this.children,
							_colorTuple = _this._color.from (this._value).tuple
						;
						_this._settingSliders = _true;
						_children.sliderR.set ({value:_colorTuple [0]});
						_children.sliderG.set ({value:_colorTuple [1]});
						_children.sliderB.set ({value:_colorTuple [2]});
						_this._settingSliders = _false;
						_this._updateUiSwatch ();
					},
					value:'000000'
				}
			},

			set:{
				html:Uize.Widgets.RgbSliders.Html
			},

			staticProperties:{
				cssModule:Uize.Widgets.RgbSliders.Css
			},

			stateToCssBindings:{
				size:'value'
			}
		});
	}
});

