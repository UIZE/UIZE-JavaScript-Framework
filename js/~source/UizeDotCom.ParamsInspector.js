/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeDotCom.ParamsInspector
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2009-2012 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*ScruncherSettings Mappings="=c" LineCompacting="TRUE"*/

/*?
	Introduction
		A widget class that implements a tabbed interface for selecting params presets and also modifying the values of the individual params in a params table.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'UizeDotCom.ParamsInspector',
	superclass:'Uize.Widget',
	required:[
		'Uize.Widget.Options.Tabbed',
		'Uize.Data',
		'Uize.Json',
		'Uize.Node.Form',
		'UizeDotCom.Templates.ParamsInspector'
	],
	builder:function (_superclass) {
		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					null,
					function () {
						var _this = this;

						/*** add tabs child widget ***/
							_this.addChild (
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
							_this.addChild ('preview',Uize.Widget.Button)
								.wire ('Click',function () {_this._firePresetSelectedEvent ()})
							;
					}
				),
				_classPrototype = _class.prototype
			;

		/*** Private Instance Methods ***/
			_classPrototype._choosePreset = function (_presetName) {
				var
					_this = this,
					_params = _this._params
				;
				Uize.Node.Form.setValues (
					Uize.map (
						_this._presets [_presetName],
						function (_value,_key) {return _params [_key] == 'json' ? Uize.Json.to (_value,'mini') : _value}
					),
					_this.get ('idPrefix') + '_'
				);
			};

			_classPrototype._firePresetSelectedEvent = function () {
				this.fire ('Preset Selected');
			};

		/*** Public Instance Methods ***/
			_classPrototype.getValues = function () {
				var _params = this._params;
				return (
					Uize.map (
						Uize.Node.Form.getValues (this.getNode (),true,this.get ('idPrefix') + '_'),
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
			};

			_classPrototype.wireUi = function () {
				var _this = this;
				if (!_this.isWired) {
					_superclass.prototype.wireUi.call (_this);

					/*** wire a click event to catch clicking on any preset link ***/
						_this.wireNode (
							'presets',
							'click',
							function (_event) {
								var _eventTarget = _event.target || _event.srcElement;
								if (_eventTarget.tagName == 'A') {
									_this._choosePreset (Uize.Node.getText (_eventTarget));
									_this._firePresetSelectedEvent ();
								}
							}
						);

					for (var _presetName in _this._presets) break;
					_this._choosePreset (_presetName);
					_this._firePresetSelectedEvent ();
				}
			};

		/*** Register Properties ***/
			_class.registerProperties ({
				_params:{
					name:'params',
					value:{}
				},
				_presets:{
					name:'presets',
					value:{}
				}
			});

		/*** Override Initial Values for Inherited Set-Get Properties ***/
			_class.set ({
				built:false,
				html:UizeDotCom.Templates.ParamsInspector
			});

		return _class;
	}
});

