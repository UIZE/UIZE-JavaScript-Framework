/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Bar.Slider.xSkin Class Extension
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2005-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Extension
	importance: 1
	codeCompleteness: 100
	docCompleteness: 15
*/

/*?
	Introduction
		The =Uize.Widget.Bar.Slider.xSkin= extension sets an initial value for the =html= state property so as to provide slider instances with a default skin.

		*DEVELOPERS:* `Chris van Rensburg`

		The =Uize.Widget.Bar.Slider.xSkin= module is an extension module that extends the =Uize.Widget.Bar.Slider= class.
*/

Uize.module ({
	name:'Uize.Widget.Bar.Slider.xSkin',
	required:[
		'Uize.Node',
		'Uize.Node.Util'
	],
	builder:function (_class) {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var _undefined;

		/*** Extend the Class ***/
			_class.presets.Skin = {
				html:{
					process:function (_input) {
						function _opacityStyle (_color,_opacity) {
							_opacity = _opacity || 0;
							return (
								_opacity
									? ('background:' + _color + ';' + (_opacity < 100 ? _Uize_Node_Util_getOpacityStr (_opacity / 100) : ''))
									: 'display:none;'
							);
						}
						var
							_this = this,
							_Uize_Node = Uize.Node,
							_Uize_Node_Util_getOpacityStr = _Uize_Node.Util.getOpacityStr,
							_idPrefix = _input.idPrefix,
							_orientation = _input.orientation,
							_orientationNo = _orientation == 'vertical' ? 1 : 0,
							_borderThickness = _input.borderThickness != _undefined ? _input.borderThickness : 5,
							_knobSize = _input.knobSize != _undefined ? _input.knobSize : 15,
							_shell = _this.getNode (),
							_shellDims = _Uize_Node.getDimensions (_shell),
							_dimAttributes = ['width','height'],
							_outerDims = _shell
								? [
									_shellDims [_dimAttributes [1 - _orientationNo]],
									_shellDims [_dimAttributes [_orientationNo]]
								]
								: [35,280],
							_trackDims = [_outerDims [0] - _borderThickness * 2,_outerDims [1] - _borderThickness * 2],
							_knobDims = [_trackDims [0],_knobSize],
							_borderHtml = '',
							_resourcesFolderPath = _input.pathToResources + 'Uize_Widget_Bar_Slider/'
						;
						/*** Generate Border HTML ***/
							if (_borderThickness > 0 && _input.borderTintLevel != 100) {
								var
									_borderTopCell = '<td><img src="' + _resourcesFolderPath + 'border-h.gif" width="' + _trackDims [1 - _orientationNo] + '" height="' + _borderThickness + '" border="0" hspace="0" vspace="0"/></td>',
									_borderSideCell = '<td><img src="' + _resourcesFolderPath + 'border-v.gif" width="' + _borderThickness + '" height="' + _trackDims [_orientationNo] + '" border="0" hspace="0" vspace="0"/></td>'
								;
								_borderHtml =
									'<table border="0" cellspacing="0" cellpadding="0" style="position:absolute; left:0px; top:0px;">' +
										'<tr>' +
											'<td><img src="' + _resourcesFolderPath + 'border-tl.gif" width="' + _borderThickness + '" height="' + _borderThickness + '" border="0" hspace="0" vspace="0"/></td>' +
											_borderTopCell +
											'<td><img src="' + _resourcesFolderPath + 'border-tr.gif" width="' + _borderThickness + '" height="' + _borderThickness + '" border="0" hspace="0" vspace="0"/></td>' +
										'</tr>' +
										'<tr>' +
											_borderSideCell +
											'<td></td>' +
											_borderSideCell +
										'</tr>' +
										'<tr>' +
											'<td><img src="' + _resourcesFolderPath + 'border-bl.gif" width="' + _borderThickness + '" height="' + _borderThickness + '" border="0" hspace="0" vspace="0"/></td>' +
											_borderTopCell +
											'<td><img src="' + _resourcesFolderPath + 'border-br.gif" width="' + _borderThickness + '" height="' + _borderThickness + '" border="0" hspace="0" vspace="0"/></td>' +
										'</tr>' +
									'</table>'
								;
							}
						/*** Generate Complete Slider HTML ***/
							var
								_outerDimsStyle = 'width:' + _outerDims [1 - _orientationNo] + 'px; height:' + _outerDims [_orientationNo] + 'px;',
								_trackDimsStyle = 'width:' + _trackDims [1 - _orientationNo] + 'px; height:' + _trackDims [_orientationNo] + 'px;',
								_trackPosStyle = 'left:' + _borderThickness + 'px; top:' + _borderThickness + 'px;',
								_knobDimsStyle = 'position:absolute; left:0px; top:0px; width:' + _knobDims [1 - _orientationNo] + 'px; height:' + _knobDims [_orientationNo] + 'px;'
							;
						return (
							'<div style="position:relative; left:0px; top:0px; ' + _outerDimsStyle + '">' +
								_borderHtml +
								'<div style="position:absolute; left:0px; top:0px; ' + _outerDimsStyle + ' ' + _opacityStyle (_input.borderTintColor,_input.borderTintLevel) + '"></div>' +
								((_input.emptyTintLevel != 100 || _input.fullTintLevel != 100) ? ('<img src="' + _resourcesFolderPath + 'track-bg-' + _orientation + '.gif" style="position:absolute; ' + _trackPosStyle + ' ' + _trackDimsStyle + '" border="0" hspace="0" vspace="0"/>') : '') +
								'<div id="' + _idPrefix + '-empty" style="position:absolute; ' + _trackPosStyle + ' ' + _trackDimsStyle + ' ' + _opacityStyle (_input.emptyTintColor,_input.emptyTintLevel) + '"></div>' +
								'<div id="' + _idPrefix + '-full" style="position:absolute; ' + _trackPosStyle + ' ' + _trackDimsStyle + ' ' + _opacityStyle (_input.fullTintColor,_input.fullTintLevel) + '"></div>' +
								'<div id="' + _idPrefix + '-track" style="position:absolute; cursor:pointer; background:url(' + _input.blankGif + '); ' + _trackPosStyle + ' ' + _trackDimsStyle + '">' +
									'<div id="' + _idPrefix + '-knob" style="' + _knobDimsStyle + '">' +
										(_input.knobTintLevel != 100 ? ('<img src="' + _resourcesFolderPath + 'knob-' + _orientation + '.gif" style="' + _knobDimsStyle + '" border="0" hspace="0" vspace="0"/>') : '') +
										'<img src="' + _input.blankGif + '" style="' + _knobDimsStyle + ' ' + _opacityStyle (_input.knobTintColor,_input.knobTintLevel) + '"/>' +
									'</div>' +
								'</div>' +
							'</div>'
						);
					}
				}
			};

			_class.set (_class.presets.Skin);
	}
});

