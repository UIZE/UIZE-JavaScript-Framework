/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Data.ValuePack Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2015-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Test
	importance: 1
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Test.Uize.Data.ValuePack= module defines a suite of unit tests for the =Uize.Data.ValuePack= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Data.ValuePack',
	builder:function () {
		'use strict';

		/*** Utility Functions ***/
			function _packTest (_title,_archetype,_source,_expected) {
				return {
					title:_title,
					test:function () {
						var _valuePack = Uize.Data.ValuePack ({archetype:_archetype});
						return this.expect (_expected,_valuePack.pack (_source));
					}
				};
			}

			function _unpackTest (_title,_archetype,_source,_expected) {
				return {
					title:_title,
					test:function () {
						var _valuePack = Uize.Data.ValuePack ({archetype:_archetype});
						return this.expect (_expected,_valuePack.unpack (_source));
					}
				};
			}

		return Uize.Test.resolve ({
			title:'Uize.Data.ValuePack Module Test',
			test:[
				Uize.Test.requiredModulesTest ('Uize.Data.ValuePack'),
				{
					title:'Instance Method Tests',
					test:[
						{
							title:'Instances have a pack method, that can be used to pack the values of an object into an array',
							test:[
								_packTest (
									'If the archetype object is empty, then the packed values array will always be empty',
									{},
									{foo:0,bar:0,baz:0,qux:0},
									[]
								),
								_packTest (
									'The values for a source object can be packed to a values array, even if the properties in the source object are defined in a different order than they occur in the archetype object',
									{foo:0,bar:0,baz:0,qux:0},
									{bar:2,qux:4,baz:3,foo:1},
									[1,2,3,4]
								),
								_packTest (
									'When the source object being packed contains nodes and properties that are not present in the archetype, the values from these nodes and properties are ignored',
									{foo:0,bar:0,baz:0,qux:0},
									{bar:2,hello:5,qux:4,baz:3,foo:1,world:{blah:6}},
									[1,2,3,4]
								),
								_packTest (
									'The values for an arbitrarily structured source object can be packed to produce a values array, according to an arbitrarily structured archetype object',
									{foo:0,bar:0,baz:0,qux:0,hello:{hello:0},world:{blah:0,blahBlah:0}},
									{bar:2,hello:{hello:5},qux:4,world:{blahBlah:7,blah:6},baz:3,foo:1},
									[1,2,3,4,5,6,7]
								)
							]
						},
						{
							title:'Instances have an unpack method, that can be used to unpack the values from an array to produce an object',
							test:[
								_unpackTest (
									'If the archetype object is empty, then the unpacked object will always be empty',
									{},
									[1,2,3,4],
									{}
								),
								_unpackTest (
									'The values for a source array can be unpacked to produce an object that has the structure of the archetype, and the values from the source array are assigned to the properties of the object according to the order in which the properties occur in the archetype object',
									{foo:0,bar:0,baz:0,qux:0},
									[1,2,3,4],
									{foo:1,bar:2,baz:3,qux:4}
								),
								_unpackTest (
									'When the source value array being unpacked contains more value elements than there are properties on the archetype, then the extra value elements are ignored',
									{foo:0,bar:0,baz:0,qux:0},
									[1,2,3,4,5,6,7,8],
									{foo:1,bar:2,baz:3,qux:4}
								),
								_unpackTest (
									'The values for a source array can be unpacked to produce an arbitrarily structured object that has the structure of the archetype, and the values from the source array are assigned to the properties of the object according to the order in which the properties occur in the archetype object',
									{bar:0,hello:{hello:0},qux:0,world:{blahBlah:0,blah:0},baz:0,foo:0},
									[1,2,3,4,5,6,7],
									{bar:1,hello:{hello:2},qux:3,world:{blahBlah:4,blah:5},baz:6,foo:7}
								)
							]
						}
					]
				}
			]
		});
	}
});

