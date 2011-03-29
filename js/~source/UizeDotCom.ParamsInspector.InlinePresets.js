/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeDotCom.ParamsInspector.InlinePresets
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2009-2011 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*ScruncherSettings Mappings="=d" LineCompacting="TRUE"*/

/*?
	Introduction
		A subclass of =UizeDotCom.ParamsInspector= that adds the ability to harvest the presets from an implied node whose inner HTML is formatted in the Simple Data format.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'UizeDotCom.ParamsInspector.InlinePresets',
	required:'Uize.Data.Simple',
	builder:function (_superclass) {
		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					null,
					function () {
						var _this = this;

						/*** harvest inline settings ***/
							var _presets = Uize.Data.Simple.parse ({
								simple:_this.getNode ('inlinePresets').innerHTML,
								collapseChildren:true
							});
							_this.setNodeInnerHtml ('inlinePresets','');

							/*** turn tabs into three spaces ***/
								var _settingsPropertyName = _this._settingsPropertyName;
								for (var _presetName in _presets) {
									var _preset = _presets [_presetName];
									_preset [_settingsPropertyName] = _preset [_settingsPropertyName].replace (/\t/g,'   ');
								}

							_this.set ({presets:_presets});
						}
				),
				_classPrototype = _class.prototype
			;

		/*** Register Properties ***/
			_class.registerProperties ({
				_settingsPropertyName:'settingsPropertyName'
			});

		return _class;
	}
});

