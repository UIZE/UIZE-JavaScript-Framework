/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Data.Flatten Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013-2016 UIZE
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
		The =Uize.Test.Uize.Data.Flatten= module defines a suite of unit tests for the =Uize.Data.Flatten= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Data.Flatten',
	builder:function () {
		'use strict';

		function _pathToKeyMapper (_key) {
			return Uize.map (
				_key.split ('.'),
				function (_pathPart) {return Uize.toNumber (_pathPart,_pathPart)}
			)
		}

		return Uize.Test.resolve ({
			title:'Uize.Data.Flatten Module Test',
			test:[
				Uize.Test.requiredModulesTest ('Uize.Data.Flatten'),
				Uize.Test.staticMethodsTest ([
					['Uize.Data.Flatten.flatten',[
						['Flattening an empty object produces an empty object',
							{},
							{}
						],
						['Flattening an already flat object returns an object with the same contents',
							{
								foo:'bar',
								baz:'qux',
								hello:'world',
								'':'empty string key',
								'key.with.periods':'what it says'
							},
							{
								foo:'bar',
								baz:'qux',
								hello:'world',
								'':'empty string key',
								'key.with.periods':'what it says'
							}
						],
						['Test that flattening a hierarchical object using the default pathToKey transformer is handled correctly',
							{
								foo:'bar',
								baz:{
									qux:42,
									more:{
										hello:'world',
										evenMore:{
											more:['stuff','cowbell']
										}
									}
								},
								apples:'oranges'
							},
							{
								foo:'bar',
								'baz.qux':42,
								'baz.more.hello':'world',
								'baz.more.evenMore.more':['stuff','cowbell'],
								apples:'oranges'
							}
						],
						['Test that flattening a hierarchical object using a custom string pathToKey transformer is handled correctly',
							[{foo:{bar:{baz:1,qux:2}}},'::'],
							{
								'foo::bar::baz':1,
								'foo::bar::qux':2
							}
						],
						['Test that flattening a hierarchical object using a custom function pathToKey transformer is handled correctly',
							[
								{foo:{bar:{baz:1,qux:2}}},
								function (_path) {return _path.join ('|').toUpperCase ()}
							],
							{
								'FOO|BAR|BAZ':1,
								'FOO|BAR|QUX':2
							}
						],
						{
							title:'Object type property values that are not plain objects are treated as leaf nodes',
							test:function () {
								function _MyConstructor () {}
								var
									_functionWithCustomProperties = Uize.copyInto (function () {},{foo:'bar',baz:'qux'}),
									_regExp = /\d+/,
									_array = ['foo','bar','baz','qux'],
									_instance = new _MyConstructor,
									_unflattened = {
										foo:{
											someFunction:_functionWithCustomProperties,
											regExp:_regExp,
											array:_array,
											instance:_instance
										}
									},
									_flattened = Uize.Data.Flatten.flatten (_unflattened)
								;
								return (
									this.expectSameAs (_functionWithCustomProperties,_flattened ['foo.someFunction']) &&
									this.expectSameAs (_regExp,_flattened ['foo.regExp']) &&
									this.expectSameAs (_array,_flattened ['foo.array']) &&
									this.expectSameAs (_instance,_flattened ['foo.instance'])
								);
							}
						},
						['Properties of an unflattened object that are simple type values are treated as leaf nodes when flattening',
							{
								foo:{
									'null':null,
									'undefined':undefined,
									'0':0,
									'42':42,
									'NaN':NaN,
									'false':false,
									'':'',
									'bar':'bar'
								}
							},
							{
								'foo.null':null,
								'foo.undefined':undefined,
								'foo.0':0,
								'foo.42':42,
								'foo.NaN':NaN,
								'foo.false':false,
								'foo.':'',
								'foo.bar':'bar'
							}
						],
						{
							title:'Flattening an unflattened object produces a new object and does not modify the source object',
							test:function () {
								var
									_unflattened = {foo:{bar:{baz:1,qux:2}}},
									_flattened = Uize.Data.Flatten.flatten (_unflattened)
								;
								return (
									this.expect (true,_unflattened !== _flattened) &&
									this.expect ({foo:{bar:{baz:1,qux:2}}},_unflattened)
								);
							}
						},
						{
							title:'Test that flattening a hierarchical object and specifying the value true for the optional inclueNonLeafNodes argument is handled correctly',
							test:function () {
								var
									_qux = {},
									_baz = {qux:_qux},
									_bar = {baz:_baz},
									_foo = {bar:_bar},
									_unflattened = {foo:_foo},
									_flattened = Uize.Data.Flatten.flatten (_unflattened,'.',true)
								;
								return (
									this.expect (
										{
											'foo':_foo,
											'foo.bar':_bar,
											'foo.bar.baz':_baz,
											'foo.bar.baz.qux':{}
										},
										_flattened
									) &&
									this.expectSameAs (_foo,_flattened ['foo']) &&
									this.expectSameAs (_bar,_flattened ['foo.bar']) &&
									this.expectSameAs (_baz,_flattened ['foo.bar.baz']) &&
									this.expectSameAs (_qux,_flattened ['foo.bar.baz.qux'])
								);
							}
						},
						['Specifying the value false for the optional inclueNonLeafNodes argument results in only leaf nodes being included in the flattened object',
							[{foo:{bar:{baz:{qux:1}}}},'.',false],
							{'foo.bar.baz.qux':1}
						],
						['Specifying the value null for the optional inclueNonLeafNodes argument results in only leaf nodes being included in the flattened object',
							[{foo:{bar:{baz:{qux:1}}}},'.',null],
							{'foo.bar.baz.qux':1}
						],
						['Specifying the value undefined for the optional inclueNonLeafNodes argument results in only leaf nodes being included in the flattened object',
							[{foo:{bar:{baz:{qux:1}}}},'.',undefined],
							{'foo.bar.baz.qux':1}
						],

						/*** test support for the optional allowArraysNodes parameter ***/
							['When the value true is specified for the optional allowArraysNodes parameter, then array values are treated as non-leaf nodes',
								[
									{
										foo:['a','b'],
										bar:{
											baz:[['c','d'],['e','f']],
											qux:42
										}
									},
									null,
									false,
									true
								],
								{
									'foo.0':'a',
									'foo.1':'b',
									'bar.baz.0.0':'c',
									'bar.baz.0.1':'d',
									'bar.baz.1.0':'e',
									'bar.baz.1.1':'f',
									'bar.qux':42
								}
							],
							['When the value true is specified for the optional allowArraysNodes parameter, then the object being flattened can be an array and will be treated as a non-leaf node as expected',
								[
									[
										'a',
										['b','c'],
										['d','e'],
										'f'
									],
									null,
									false,
									true
								],
								{
									'0':'a',
									'1.0':'b',
									'1.1':'c',
									'2.0':'d',
									'2.1':'e',
									'3':'f'
								}
							],
							['When the value true is specified for the optional allowArraysNodes parameter, missing elements in sparsely populated array values are excluded from the resulting hash object',
								[
									{
										foo:(function () {var _array = ['a','b']; _array [9] = 'c'; return _array}) ()
									},
									null,
									false,
									true
								],
								{
									'foo.0':'a',
									'foo.1':'b',
									'foo.9':'c'
								}
							]
					]],
					['Uize.Data.Flatten.unflatten',[
						['Unflattening an empty object produces an empty object',
							{},
							{}
						],
						['Unflattening an already unflattened object produces an object containing the same contents as the already unflattened source object',
							{
								foo:'bar',
								baz:{
									qux:42,
									more:{
										hello:'world',
										evenMore:{
											more:['stuff','cowbell']
										}
									}
								},
								apples:'oranges'
							},
							{
								foo:'bar',
								baz:{
									qux:42,
									more:{
										hello:'world',
										evenMore:{
											more:['stuff','cowbell']
										}
									}
								},
								apples:'oranges'
							}
						],
						['Test that unflattening a flattened object using the default pathToKey transformer, and where the default pathToKey transformer was used when flattening the object, is handled correctly',
							{
								foo:'bar',
								'baz.qux':42,
								'baz.more.hello':'world',
								'baz.more.evenMore.more':['stuff','cowbell'],
								apples:'oranges'
							},
							{
								foo:'bar',
								baz:{
									qux:42,
									more:{
										hello:'world',
										evenMore:{
											more:['stuff','cowbell']
										}
									}
								},
								apples:'oranges'
							}
						],
						['Test that unflattening a flattened using a custom string pathToKey transformer is handled correctly',
							[
								{
									'foo::bar::baz':1,
									'foo::bar::qux':2
								},
								'::'
							],
							{foo:{bar:{baz:1,qux:2}}}
						],
						['Test that unflattening a flattened using a custom function pathToKey transformer is handled correctly',
							[
								{
									'FOO|BAR|BAZ':1,
									'FOO|BAR|QUX':2
								},
								function (_path) {return _path.toLowerCase ().split ('|')}
							],
							{foo:{bar:{baz:1,qux:2}}}
						],
						{
							title:'Unflattening a flattened object produces a new object and does not modify the source object',
							test:function () {
								var
									_flattened = {'foo.bar.baz':1,'foo.bar.qux':2},
									_unflattened = Uize.Data.Flatten.unflatten (_flattened)
								;
								return (
									this.expect (true,_flattened !== _unflattened) &&
									this.expect ({'foo.bar.baz':1,'foo.bar.qux':2},_flattened)
								);
							}
						},
						{
							title:'Test that unflattening a flattened object that was flattened using the value true for the optional inclueNonLeafNodes argument (so, an object that contains path repititions) is handled correctly',
							test:function () {
								var _unflattened = {
									foo:'bar',
									baz:{
										qux:42,
										more:{
											hello:'world',
											evenMore:{
												more:['stuff','cowbell']
											}
										}
									},
									apples:'oranges'
								};
								return this.expect (
									_unflattened,
									Uize.Data.Flatten.unflatten (Uize.Data.Flatten.flatten (_unflattened,'.',true),'.')
								);
							}
						},

						/*** test support for the optional allowArraysNodes parameter ***/
							['When the value true is specified for the optional allowArraysNodes parameter, then number type elements of the path array are treated as array indexes of array nodes',
								[
									{
										'foo.0':'a',
										'foo.1':'b',
										'bar.baz.0.0':'c',
										'bar.baz.0.1':'d',
										'bar.baz.1.0':'e',
										'bar.baz.1.1':'f',
										'bar.qux':42
									},
									_pathToKeyMapper,
									true
								],
								{
									foo:['a','b'],
									bar:{
										baz:[['c','d'],['e','f']],
										qux:42
									}
								}
							],
							['When the value true is specified for the optional allowArraysNodes parameter, then the unflattened object will be an array if the path elements at the root of the paths are number type',
								[
									{
										'0':'a',
										'1.0':'b',
										'1.1':'c',
										'2.0':'d',
										'2.1':'e',
										'3':'f'
									},
									_pathToKeyMapper,
									true
								],
								[
									'a',
									['b','c'],
									['d','e'],
									'f'
								]
							],
							{
								title:
									'When the value true is specified for the optional allowArraysNodes parameter, then sparsely populated array values will be produced in the unflattened object if there are missing keys for some indexes',
								test:function () {
									var
										_result = Uize.Data.Flatten.unflatten (
											{
												'foo.0':'a',
												'foo.1':'b',
												'foo.9':'c'
											},
											_pathToKeyMapper,
											true
										),
										_array = ['a','b']
									;
									_array [9] = 'c';
									return this.expect ({foo:_array},_result);
								}
							}
						]]
				])
			]
		});
	}
});

