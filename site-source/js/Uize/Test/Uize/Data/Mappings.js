/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Data.Mappings Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2016 UIZE
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
		The =Uize.Test.Uize.Data.Mappings= module defines a suite of unit tests for the =Uize.Data.Mappings= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Data.Mappings',
	required:'Uize.Test',
	builder:function () {
		'use strict';

		return Uize.Test.resolve ({
			title:'Test for Uize.Data.Mappings Module',
			test:[
				Uize.Test.requiredModulesTest ('Uize.Data.Mappings'),
				Uize.Test.staticMethodsTest ([
					['Uize.Data.Mappings.getMappings',[
						['Entries in the mappings object have the value as key and a mapped value map object as the value',
							[
								{
									string1:'foo',
									string2:'bar',
									more:{
										strings:[
											'baz',
											'qux',
											'foo'
										]
									},
									string3:'foo'
								},
								{
									string1:'FOO',
									string2:'BAR',
									more:{
										strings:[
											'BAZ',
											'QUX',
											'FOO!!!'
										]
									},
									string3:'FOO'
								}
							],
							{
								foo:{
									FOO:[
										['string1'],
										['string3']
									],
									'FOO!!!':[
										['more','strings',2]
									]
								},
								bar:{
									BAR:[
										['string2']
									]
								},
								baz:{
									BAZ:[
										['more','strings',0]
									]
								},
								qux:{
									QUX:[
										['more','strings',1]
									]
								}
							}
						],
						['There will be no entries in the mappings object for properties that don\'t exist in both objects',
							[
								{
									string1:'foo',
									string2:'bar',
									string3:'baz'
								},
								{
									string1:'FOO',
									string2:'BAR',
									string4:'QUX'
								}
							],
							{
								foo:{
									FOO:[
										['string1']
									]
								},
								bar:{
									BAR:[
										['string2']
									]
								}
							}
						],
						{
							title:'When an optional matcher is specified, it is called with the arguments describing the corresponding properties of the two objects and the path of the property',
							test:function () {
								var _argumentsForMatcherCalls = [];
								Uize.Data.Mappings.getMappings (
									{
										string1:'foo',
										string2:'bar',
										more:{
											strings:[
												'baz',
												'qux',
												'foo'
											]
										},
										string3:'foo'
									},
									{
										string1:'FOO',
										string2:'BAR',
										more:{
											strings:[
												'BAZ',
												'QUX',
												'FOO!!!'
											]
										},
										string3:'FOO'
									},
									function () {
										_argumentsForMatcherCalls.push (Uize.clone (Uize.copyList (arguments)));
									}
								);
								return this.expect (
									[
										[
											{key:'string1',value:'foo'},
											{key:'string1',value:'FOO'},
											['string1']
										],
										[
											{key:'string2',value:'bar'},
											{key:'string2',value:'BAR'},
											['string2']
										],
										[
											{key:0,value:'baz'},
											{key:0,value:'BAZ'},
											['more','strings',0]
										],
										[
											{key:1,value:'qux'},
											{key:1,value:'QUX'},
											['more','strings',1]
										],
										[
											{key:2,value:'foo'},
											{key:2,value:'FOO!!!'},
											['more','strings',2]
										],
										[
											{key:'string3',value:'foo'},
											{key:'string3',value:'FOO'},
											['string3']
										]
									],
									_argumentsForMatcherCalls
								);
							}
						},
						['All properties for which the optional matcher returns false are excluded and all properties for which the matcher returns true are included',
							[
								{
									string1:'foo',
									string2:'bar',
									more:{
										strings:[
											'baz',
											'qux',
											'foo'
										]
									},
									string3:'foo'
								},
								{
									string1:'FOO',
									string2:'BAR',
									more:{
										strings:[
											'BAZ',
											'QUX',
											'FOO!!!'
										]
									},
									string3:'FOO'
								},
								function (_propertyAInfo) {return typeof _propertyAInfo.key == 'string'}
							],
							{
								foo:{
									FOO:[
										['string1'],
										['string3']
									]
								},
								bar:{
									BAR:[
										['string2']
									]
								}
							}
						]
					]],
					['Uize.Data.Mappings.getDeviantMappings',[
						['The deviant mappings object will contain entries for only values that have more than one mapping',
							[
								{
									string1:'foo',
									string2:'bar',
									more:{
										strings:[
											'baz',
											'qux',
											'foo'
										]
									},
									string3:'foo'
								},
								{
									string1:'FOO',
									string2:'BAR',
									more:{
										strings:[
											'BAZ',
											'QUX',
											'FOO!!!'
										]
									},
									string3:'FOO'
								}
							],
							{
								foo:{
									FOO:[
										['string1'],
										['string3']
									],
									'FOO!!!':[
										['more','strings',2]
									]
								}
							}
						]
					]]
				])
			]
		});
	}
});

