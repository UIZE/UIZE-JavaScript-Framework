/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.String Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Test
	importance: 3
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Test.Uize.String= module defines a suite of unit tests for the =Uize.String= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.String',
	required:[
		'Uize.Class.Value',
		'Uize.Array.Join',
		'Uize.Str.Camel',
		'Uize.Str.Has',
		'Uize.Str.Limit',
		'Uize.Str.Split',
		'Uize.Str.Trim',
		'Uize.Str.Repeat'
	],
	builder:function () {
		'use strict';

		function _migratedStaticMethodsTest (_migratedMethods) {
			return {
				title:'Test that various deprecated static methods that have been migrated are still supported and map correctly to their new locations',
				test:Uize.map (
					_migratedMethods,
					function (_migratedMethod) {
						var
							_oldName = _migratedMethod [0],
							_newName = _migratedMethod [1]
						;
						return {
							title:'Test that the deprecated ' + _oldName + ' method still exists and is simply a reference to the new ' + _newName + ' method',
							test:function () {
								function _getStatic (_staticName) {
									var _methodPos = _staticName.lastIndexOf ('.');
									return Uize.getModuleByName (_staticName.slice (0,_methodPos)) [
										_staticName.slice (_methodPos + 1)
									];
								}
								var _newStatic = _getStatic (_newName);
								return this.expectFunction (_newStatic) && this.expectSameAs (_getStatic (_oldName),_newStatic);
							}
						};
					}
				)
			};
		}

		return Uize.Test.resolve ({
			title:'Test for Uize.String Module',
			test:[
				Uize.Test.requiredModulesTest ('Uize.String'),
				_migratedStaticMethodsTest ([
					['Uize.String.contains','Uize.Str.Has.has'],
					['Uize.String.endsWith','Uize.Str.Has.hasSuffix'],
					['Uize.String.hasPadding','Uize.Str.Trim.hasPadding'],
					['Uize.String.hugJoin','Uize.Array.Join.hugJoin'],
					['Uize.String.joinUsingSuffixPriority','Uize.Str.Limit.joinUsingSuffixPriority'],
					['Uize.String.limitLength','Uize.Str.Limit.limitLength'],
					['Uize.String.repeat','Uize.Str.Repeat.repeat'],
					['Uize.String.split','Uize.Str.Split.split'],
					['Uize.String.splitInTwo','Uize.Str.Split.splitInTwo'],
					['Uize.String.startsWith','Uize.Str.Has.hasPrefix'],
					['Uize.String.toCamel','Uize.Str.Camel.to'],
					['Uize.String.trim','Uize.Str.Trim.trim'],
					['Uize.String.trimLeft','Uize.Str.Trim.trimLeft'],
					['Uize.String.trimRight','Uize.Str.Trim.trimRight']
				])
			]
		});
	}
});

