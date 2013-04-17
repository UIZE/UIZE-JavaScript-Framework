/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.ColorPicker Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2005-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 1
	codeCompleteness: 100
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Widget.ColorPicker= class implements an RGB color picker interface, with sliders for adjusting levels for the red, green, and blue channels.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widget.ColorPicker',
	superclass:'Uize.Widget.V2',
	required:[
		'Uize.Widget.Bar.Slider.xSkin',
		'Uize.Color',
		'Uize.Templates.ColorPicker'
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
							Uize.Widget.Bar.Slider,
							{
								minValue:0,
								maxValue:255,
								borderThickness:3,
								borderTintColor:'#fff',
								borderTintLevel:40,
								knobSize:28,
								emptyTintColor:'#fff',
								emptyTintLevel:10,
								fullTintColor:_sliderColor,
								fullTintLevel:100
							}
						);
						_slider.wire (
							'Changed.value',
							function () {
								if (!_this._settingSliders) {
									var _children = _this.children;
									_this.set ({_value:_this._color.from (_this._rgbSliders).to ('hex')});
								}
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
						this.isWired && this.setNodeStyle ('swatch',{background:'#' + this._value});
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
				html:Uize.Templates.ColorPicker
			}
		});
	}
});

