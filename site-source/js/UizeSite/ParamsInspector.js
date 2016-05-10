/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.ParamsInspector
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2009-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*?
	Introduction
		A widget class that implements a tabbed interface for selecting params presets and also modifying the values of the individual params in a params table.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'UizeSite.ParamsInspector',
	superclass:'Uize.Widget',
	required:[
		'Uize.Widget.Options.Tabbed',
		'Uize.Data',
		'Uize.Json',
		'Uize.Dom.Form',
		'Uize.Dom.Text',
		'UizeSite.Templates.ParamsInspector'
	],
	builder:function (_superclass) {
		'use strict';

		/*** Private Instance Methods ***/
			function _choosePreset (m,_presetName) {
				var _params = m._params;
				Uize.Dom.Form.setValues (
					Uize.map (
						m._presets [_presetName],
						function (_value,_key) {return _params [_key] == 'json' ? Uize.Json.to (_value,'mini') : _value}
					),
					m.get ('idPrefix') + '_'
				);
			}

			function _firePresetSelectedEvent (m) {
				m.fire ('Preset Selected');
			}

		return _superclass.subclass ({
			omegastructor:function () {
				var m = this;

				/*** add tabs child widget ***/
					m.addChild (
						'tabs',
						Uize.Widget.Options.Tabbed,
						{
							bodyClassActive:'tabBodyActive',
							bodyClassInactive:'tabBodyInactive',
							values:['presets','params'],
							value:'presets'
						}
					);

				/*** add the preview button ***/
					m.addChild ('preview',Uize.Widget.Button)
						.wire ('Click',function () {_firePresetSelectedEvent (m)})
					;
			},

			instanceMethods:{
				getValues:function () {
					var _params = this._params;
					return (
						Uize.map (
							Uize.Dom.Form.getValues (this.getNode (),true,this.get ('idPrefix') + '_'),
							function (_value,_key) {
								var _paramType = _params [_key];
								return (
									_paramType == 'json'
										? Uize.Json.from (_value)
										: Uize.isArray (_paramType)
											? _value
											: _paramType == 'integer' || _paramType == 'number' || typeof _paramType == 'object'
												? +_value
												: _value
								);
							},
							false
						)
					);
				},

				wireUi:function () {
					var m = this;
					if (!m.isWired) {
						_superclass.doMy (m,'wireUi');

						/*** wire a click event to catch clicking on any preset link ***/
							m.wireNode (
								'presets',
								'click',
								function (_event) {
									var _eventTarget = _event.target || _event.srcElement;
									if (_eventTarget.tagName == 'A') {
										_choosePreset (m,Uize.Dom.Text.getText (_eventTarget));
										_firePresetSelectedEvent (m);
									}
								}
							);

						for (var _presetName in m._presets) break;
						_choosePreset (m,_presetName);
						_firePresetSelectedEvent (m);
					}
				}
			},

			stateProperties:{
				_params:{
					name:'params',
					value:{}
				},
				_presets:{
					name:'presets',
					value:{}
				}
			},

			set:{
				built:false,
				html:UizeSite.Templates.ParamsInspector
			}
		});
	}
});

