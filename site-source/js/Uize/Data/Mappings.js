/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Data.Mappings Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 1
	codeCompleteness: 100
	docCompleteness: 90
*/

/*?
	Introduction
		The =Uize.Data.Mappings= module provides a method for determining how values have been mapped between a source object and a mapped object.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Data.Mappings',
	required:[
		'Uize.Data.Diff',
		'Uize.Data.Matches'
	],
	builder:function () {
		'use strict';

		var
			/*** references to methods used internally ***/
				_getMappings
		;

		return Uize.package ({
			getMappings:_getMappings = function (_sourceObject,_mappedObject,_matcher) {
				var _mappings = {};
				Uize.Data.Diff.diff (
					_sourceObject,
					_mappedObject,
					function (_sourceProperty,_mappedProperty,_path) {
						if (
							_sourceProperty && _mappedProperty &&
							(!_matcher || _matcher (_sourceProperty,_mappedProperty,_path))
						) {
							var
								_sourcePropertyValue = _sourceProperty.value,
								_mappedPropertyValue = _mappedProperty.value,
								_mappedValueMap = _mappings [_sourcePropertyValue] || (_mappings [_sourcePropertyValue] = {})
							;
							(
								_mappedValueMap [_mappedPropertyValue] || (_mappedValueMap [_mappedPropertyValue] = [])
							).push (_path.concat ());
						}
					}
				);
				return _mappings;
			},

			getDeviantMappings:function (_sourceObject,_mappedObject,_matcher) {
				return Uize.Data.Matches.retain (
					_getMappings (_sourceObject,_mappedObject,_matcher),
					function (_valueMappings) {return Uize.totalKeys (_valueMappings) > 1}
				);
			}
		});
	}
});

