/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Data.Util Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Test
	importance: 5
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Test.Uize.Data.Util= module defines a suite of unit tests for the =Uize.Data.Util= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Data.Util',
	required:'Uize.Test',
	builder:function () {
		'use strict';

		return Uize.Test.resolve ({
			title:'Test for Uize.Data.Util Module',
			test:[
				Uize.Test.requiredModulesTest ('Uize.Data.Util'),
				Uize.Test.staticMethodsTest ([
					['Uize.Data.Util.filter',[
						['Calling with no parameter produces an empty object',
							[],
							{}
						],
						['Calling with the value null specified for source object produces an empty object',
							[null],
							{}
						],
						['Calling with the value undefined specified for source object produces an empty object',
							[undefined],
							{}
						],
						['Calling with no propertyNames parameter produces an empty object',
							[{foo:1,bar:2,fooBar:3}],
							{}
						],
						['Calling with null specified for propertyNames parameter produces an empty object',
							[{foo:1,bar:2,fooBar:3},null],
							{}
						],
						['Calling with undefined specified for propertyNames parameter produces an empty object',
							[{foo:1,bar:2,fooBar:3},undefined],
							{}
						],
						['Calling with empty array specified for propertyNames parameter produces an empty object',
							[{foo:1,bar:2,fooBar:3},[]],
							{}
						],
						['Calling with propertyNames array with no matching properties produces an empty object',
							[{foo:1,bar:2,fooBar:3},['hello','kitty']],
							{}
						],
						['Calling with propertyNames array with superset of properties produces source object',
							[{foo:1,bar:2,fooBar:3},['foo','bar','fooBar','hello','kitty']],
							{foo:1,bar:2,fooBar:3}
						],
						['Calling with propertyNames array with subset of properties produces subset source object',
							[{foo:1,bar:2,fooBar:3},['foo','bar','hello','kitty']],
							{foo:1,bar:2}
						],
						['Calling with empty source object produces empty object',
							[{},['foo','bar','hello','kitty']],
							{}
						],
						['Source object properties with values undefined, null, 0, NaN, or false are not missed',
							[{foo:undefined,bar:null,fooBar:0,hello:NaN,kitty:false},['foo','bar','fooBar','hello','kitty']],
							{foo:undefined,bar:null,fooBar:0,hello:NaN,kitty:false}
						],
						['Duplicate values in propertyNames array are ok',
							[{foo:1,bar:2,fooBar:3},['foo','foo','bar','bar']],
							{foo:1,bar:2}
						]
					]],
					['Uize.Data.Util.findRecords',[
						['Calling with no parameter produces an empty array',
							[],
							[]
						],
						['Calling with null for records array produces an empty array',
							[null,{type:'b'}],
							[]
						],
						['Calling with undefined for records array produces an empty array',
							[null,{type:'b'}],
							[]
						],
						['Calling with an empty records array produces an empty array',
							[[],{type:'b'}],
							[]
						],
						['Calling with a non-empty records array with no matching records produces an empty array',
							[[{foo:1,type:'a'},{bar:2,type:'c'}],{type:'b'}],
							[]
						],
						['Calling with a non-empty records array and no match specified produces source array',
							[[{foo:1},{bar:2}]],
							[{foo:1},{bar:2}]
						],
						['Calling with a non-empty records array and null for match produces source array',
							[[{foo:1},{bar:2}],null],
							[{foo:1},{bar:2}]
						],
						['Calling with a non-empty records array and undefined for match produces source array',
							[[{foo:1},{bar:2}],undefined],
							[{foo:1},{bar:2}]
						],
						['Calling with a non-empty records array with matching records produces array with those matching records, in the correct order',
							[[{foo:1,type:'a'},{hello:3,type:'b'},{bar:2,type:'c'},{kitty:4,type:'b'}],{type:'b'}],
							[{hello:3,type:'b'},{kitty:4,type:'b'}]
						]
					]],
					['Uize.Data.Util.getColumn',[
						['Get named column from an array of object records',
							[
								[
									{first:'John',last:'Wilkey'},
									{first:'Marie',last:'Stevenson'},
									{first:'Craig',last:'Pollack'}
								],
								'first'
							],
							['John','Marie','Craig']
						],
						['Get numbered column from an array of array records',
							[
								[
									['John','Wilkey'],
									['Marie','Stevenson'],
									['Craig','Pollack']
								],
								0
							],
							['John','Marie','Craig']
						],
						['Get column, using option to remove duplicate value',
							[
								[
									{firstName:'John',lastName:'Wilkey',department:'engineering'},
									{firstName:'Marie',lastName:'Stevenson',department:'finance'},
									{firstName:'Craig',lastName:'Pollack',department:'finance'},
									{firstName:'Nick',lastName:'Arendsen',department:'engineering'},
									{firstName:'Mark',lastName:'Strathley',department:'engineering'}
								],
								'department',
								true
							],
							['engineering','finance']
						]
					]],
					['Uize.Data.Util.sortKeys',[
						['When an empty source object is specified, an empty object is returned',
							{},
							{}
						],
						{
							title:'The returned object is a fresh object and is not a reference to the source object',
							test:function () {
								var _sourceObject = {foo:'bar',baz:'qux'};
								return this.expectNotSameAs (_sourceObject,Uize.Data.Util.sortKeys (_sourceObject));
							}
						},
						{
							title:'The source object is not modified',
							test:function () {
								var
									_sourceObject = {hello:'world',foo:'bar',baz:'qux'},
									_result = Uize.Data.Util.sortKeys (_sourceObject)
								;
								return this.expect (['hello','foo','baz'],Uize.keys (_sourceObject));
							}
						},
						{
							title:'When no custom comparator function is specified, the keys in the returned object are sorted using the default comparator function',
							test:function () {
								return this.expect (
									['baz','foo','hello'],
									Uize.keys (Uize.Data.Util.sortKeys ({hello:'world',foo:'bar',baz:'qux'}))
								);
							}
						},
						{
							title:'When a custom comparator function is specified, then the keys in the returned object are sorted using the specified comparator function',
							test:function () {
								return this.expect (
									['file1','file2','file15','file25'],
									Uize.keys (
										Uize.Data.Util.sortKeys (
											{file25:'foo.txt',file15:'bar.txt',file2:'baz.txt',file1:'qux.txt'},
											function (a,b) {return a.match (/\d+/) [0] - b.match (/\d+/) [0]}
										)
									)
								);
							}
						}
					]]
				])
			]
		});
	}
});

