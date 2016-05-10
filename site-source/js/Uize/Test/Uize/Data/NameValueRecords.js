/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Data.NameValueRecords Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2011-2016 UIZE
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
		The =Uize.Test.Uize.Data.NameValueRecords= module defines a suite of unit tests for the =Uize.Data.NameValueRecords= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Data.NameValueRecords',
	builder:function () {
		'use strict';

		return Uize.Test.resolve ({
			title:'Uize.Data.NameValueRecords Module Test',
			test:[
				Uize.Test.requiredModulesTest ('Uize.Data.NameValueRecords'),
				Uize.Test.staticMethodsTest ([
					['Uize.Data.NameValueRecords.fromHash',[
						/*** test support for string type name propery and value property parameters ***/
							['When string type name property and value property parameters are specified, an array of objects is returned',
								[{foo:'bar',hello:'world'},'KEY','VALUE'],
								[{KEY:'foo',VALUE:'bar'},{KEY:'hello',VALUE:'world'}]
							],
							['When a string type name property parameter and a number type value property parameter is specified, an array of objects is returned',
								[{foo:'bar',hello:'world'},'KEY',1],
								[{KEY:'foo',1:'bar'},{KEY:'hello',1:'world'}]
							],
							['When a number type name property parameter and a string type value property parameter is specified, an array of objects is returned',
								[{foo:'bar',hello:'world'},0,'VALUE'],
								[{0:'foo',VALUE:'bar'},{0:'hello',VALUE:'world'}]
							],

						/*** test support for number type name property and value property parameters ***/
							['When number type name property and value property parameters are specified, an array of arrays is returned',
								[{foo:'bar',hello:'world'},0,1],
								[['foo','bar'],['hello','world']]
							],
							['When number type name property and value property parameters are specified, the indexes for the name property and the value property can deviate from the conventional 0 and 1',
								[{foo:'bar',hello:'world'},3,1],
								[[undefined,'bar',undefined,'foo'],[undefined,'world',undefined,'hello']]
							],

						/*** test defaulting of name property and value property parameters ***/
							['When the value null is specified for the name property parameter, it is defaulted to  "name"',
								[{foo:'bar',hello:'world'},null,'VALUE'],
								[{name:'foo',VALUE:'bar'},{name:'hello',VALUE:'world'}]
							],
							['When the value undefined is specified for the name property parameter, it is defaulted to  "name"',
								[{foo:'bar',hello:'world'},undefined,'VALUE'],
								[{name:'foo',VALUE:'bar'},{name:'hello',VALUE:'world'}]
							],
							['When the value null is specified for the value property parameter, it is defaulted to  "value"',
								[{foo:'bar',hello:'world'},'KEY',null],
								[{KEY:'foo',value:'bar'},{KEY:'hello',value:'world'}]
							],
							['When the value undefined is specified for the value property parameter, it is defaulted to  "value"',
								[{foo:'bar',hello:'world'},'KEY',undefined],
								[{KEY:'foo',value:'bar'},{KEY:'hello',value:'world'}]
							],
							['When not specifying the name property and value property paremeters, they are defaulted to "name" and "value", respectively',
								[{foo:'bar',hello:'world'}],
								[{name:'foo',value:'bar'},{name:'hello',value:'world'}]
							],

						/*** test handling of non-object source hash ***/
							['When the value null is specified for the source hash object, an empty array is returned',
								[null,'KEY','VALUE'],
								[]
							],
							['When the value undefined is specified for the source hash object, an empty array is returned',
								[undefined,'KEY','VALUE'],
								[]
							],
							['When a primite type value is specified for the source hash object, an empty array is returned',
								[42,'KEY','VALUE'],
								[]
							],

						/*** miscellaneous ***/
							['When no parameters are specified, an empty array is returned',
								[],
								[]
							]
					]],
					['Uize.Data.NameValueRecords.toHash',[
						/*** test support for string type name propery and value property parameters ***/
							['Test that string type name property and value property parameters are supported correctly',
								[[{KEY:'foo',VALUE:'bar'},{KEY:'hello',VALUE:'world'}],'KEY','VALUE'],
								{foo:'bar',hello:'world'}
							],

						/*** test support for number type name property and value property parameters ***/
							['When the name/value records are objects, number type name property and value property parameters are supported correctly',
								[[{0:'foo',1:'bar'},{0:'hello',1:'world'}],0,1],
								{foo:'bar',hello:'world'}
							],
							['When the name/value records are arrays, number type name property and value property parameters are supported correctly',
								[[['foo','bar'],['hello','world']],0,1],
								{foo:'bar',hello:'world'}
							],
							['When the name/value records are arrays, the indexes for the name property and the value property can deviate from the conventional 0 and 1',
								[[[undefined,'bar',undefined,'foo'],[undefined,'world',undefined,'hello']],3,1],
								{foo:'bar',hello:'world'}
							],

						/*** test defaulting of name property and value property parameters ***/
							/*** when first element of name/value records array is an array ***/
								['When the value null is specified for both the name property and value property parameters, these parameters are defaulted to 0 and 1 when the first name/value record is an array',
									[[['foo','bar'],['hello','world']],null,null],
									{foo:'bar',hello:'world'}
								],
								['When the value undefined is specified for both the name property and value property parameters, these parameters are defaulted to 0 and 1 when the first name/value record is an array',
									[[['foo','bar'],['hello','world']],undefined,undefined],
									{foo:'bar',hello:'world'}
								],
								['When the name property and value property parameters are not specified, these parameters are defaulted to 0 and 1 when the first name/value record is an array',
									[[['foo','bar'],['hello','world']]],
									{foo:'bar',hello:'world'}
								],

							/*** when first element of name/value records array is an object ***/
								['When the value null is specified for both the name property and value property parameters, these parameters are defaulted to "name" and "value" when the first name/value record is an array',
									[[{name:'foo',value:'bar'},{name:'hello',value:'world'}],null,null],
									{foo:'bar',hello:'world'}
								],
								['When the value undefined is specified for both the name property and value property parameters, these parameters are defaulted to "name" and "value" when the first name/value record is an array',
									[[{name:'foo',value:'bar'},{name:'hello',value:'world'}],undefined,undefined],
									{foo:'bar',hello:'world'}
								],
								['When the name property and value property parameters are not specified, these parameters are defaulted to "name" and "value" when the first name/value record is an array',
									[[{name:'foo',value:'bar'},{name:'hello',value:'world'}]],
									{foo:'bar',hello:'world'}
								],

						/*** test handling of non-array source ***/
							['When the value null is specified for the name/value records array, an empty object is returned',
								[null,'KEY','VALUE'],
								{}
							],
							['When the value undefined is specified for the name/value records array, an empty object is returned',
								[undefined,'KEY','VALUE'],
								{}
							],
							['When an object is specified for the name/value records array, an empty object is returned',
								[{blah:'blah'},'KEY','VALUE'],
								{}
							],
							['When a primite type value is specified for the name/value records array, an empty object is returned',
								[42,'KEY','VALUE'],
								{}
							],

						/*** miscellaneous ***/
							['When an empty name/value records array is specified, an empty object is returned',
								[[],'KEY','VALUE'],
								{}
							],
							['When no parameters are specified, an empty object is returned',
								[],
								{}
							],
							['If multiple name/value records specify the same name, then the last record will take precedence',
								[[{KEY:'foo',VALUE:'bar'},{KEY:'foo',VALUE:'Bar'},{KEY:'foo',VALUE:'BAR'}],'KEY','VALUE'],
								{foo:'BAR'}
							],
							['All name/value records that specify null or undefined for the name, or that do not specify a name, are ignored and are omitted from the returned hash',
								[
									[{KEY:'foo',VALUE:'bar'},{KEY:null,VALUE:'Bar'},{KEY:undefined,VALUE:'BAR'},{VALUE:'BAR'}],
									'KEY',
									'VALUE'
								],
								{foo:'bar'}
							]
					]]
				])
			]
		});
	}
});

