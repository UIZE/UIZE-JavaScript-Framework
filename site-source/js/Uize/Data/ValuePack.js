/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Data.ValuePack Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2015-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 1
	codeCompleteness: 100
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Data.ValuePack= module provides methods for packing just the values of an object structure into a values array, or unpacking such a packed values array to produce an object structure.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Data.ValuePack',
	superclass:'Uize.Class',
	required:[
		'Uize.Data.Diff',
		'Uize.Data.Flatten',
		'Uize.Json'
	],
	builder:function (_superclass) {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_Uize = Uize,
				_Uize_Data = _Uize.Data,
				_Uize_Json = _Uize.Json,
				_Function = Function
		;

		return _superclass.subclass ({
			instanceMethods:{
				pack:function (_source) {
					return this._packer (_source);
				},

				unpack:function (_source) {
					return this._unpacker (_source);
				}
			},

			stateProperties:{
				archetype:{
					value:{}
				},

				/*** derived properties ***/
					_packer:{
						derived:{
							properties:'archetype',
							derivation:function (_archetype) {
								return _Function (
									'a',
									'return [' +
									_Uize.keys (
										_Uize_Data.Flatten.flatten (
											_archetype,
											function (_path) {
												return 'a [' + _Uize.map (_path,_Uize_Json.to).join ('] [') + ']';
											}
										)
									).join (',') +
									']'
								);
							}
						}
					},

					_unpacker:{
						derived:{
							properties:'archetype',
							derivation:function (_archetype) {
								var _propertyNo = -1;
								return _Function (
									'a',
									'return ' +
									_Uize_Json.to (
										_Uize_Data.Diff.diff (
											_archetype,
											{},
											function (_property) {
												_property.value = '```' + ++_propertyNo + '```';
												return _property;
											}
										)
									).replace (
										/'```(\d+)```'/g,
										'a [$1]'
									) + ';'
								);
							}
						}
					}
			}
		});
	}
});

