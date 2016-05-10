/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.ParamsInspector.InlinePresets
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2009-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*?
	Introduction
		A subclass of =UizeSite.ParamsInspector= that adds the ability to harvest the presets from a DOM node whose inner HTML is formatted in the Simple Data format.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'UizeSite.ParamsInspector.InlinePresets',
	required:'Uize.Data.Simple',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			omegastructor:function () {
				var m = this;

				/*** harvest inline settings ***/
					var _presets = Uize.Data.Simple.parse ({
						simple:m.getNode ('inlinePresets').innerHTML,
						collapseChildren:true
					});
					m.setNodeInnerHtml ('inlinePresets','');

					/*** turn tabs into three spaces ***/
						var _settingsPropertyName = m._settingsPropertyName;
						for (var _presetName in _presets) {
							var _preset = _presets [_presetName];
							_preset [_settingsPropertyName] = _preset [_settingsPropertyName].replace (/\t/g,'   ');
						}

					m.set ({presets:_presets});
			},

			stateProperties:{
				_settingsPropertyName:'settingsPropertyName'
			}
		});
	}
});

