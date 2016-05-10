/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Util.Spy Class
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
		The =Uize.Test.Uize.Util.Spy= module defines a suite of unit tests for the =Uize.Util.Spy= module.

		*DEVELOPERS:* `Ben Ilegbodu`
*/

Uize.module ({
	name:'Uize.Test.Uize.Util.Spy',
	superclass:'Uize.Test.Class',
	required:'Uize.Class',
	builder:function (_superclass) {
		'use strict';

		var
			_Uize = Uize,
			_Uize_Class = _Uize.Class,

			_class = _superclass.subclass({
				moduleToTest:'Uize.Util.Spy'
			})
		;

		return _class.declare({
			set:{
				test:[
					_class.requiredModulesTest(),

					_class.derivedPropertiesTest([
						{
							propertyName:'callCount',
							cases:[
								{
									instanceProperties:{calls:[]},
									expected:0
								},
								{
									instanceProperties:{calls:[{}]},
									expected:1
								},
								{
									instanceProperties:{calls:[{},{},{},{},{}]},
									expected:5
								}
							]
						},
						{
							propertyName:'hasBeenCalled',
							cases:[
								{
									instanceProperties:{calls:[]},
									expected:false
								},
								{
									instanceProperties:{calls:[{}]},
									expected:true
								},
								{
									instanceProperties:{calls:[{},{},{},{},{}]},
									expected:true
								}
							]
						},
						{
							propertyName:'recentCall',
							cases:[
								{
									instanceProperties:{calls:[]},
									expected:undefined
								},
								{
									instanceProperties:{calls:[{args:['First']}]},
									expected:{args:['First']}
								},
								{
									instanceProperties:{calls:[{args:['1st']},{args:['2nd']},{args:['3rd']},{args:['4th']},{args:['5th']}]},
									expected:{args:['5th']}
								}
							]
						}
					]),

					{
						title:'Testing calls state',
						test:[
							{
								title:'When spy object is created without object & method name, calls is empty',
								test:function() {
									return this.expect(
										0,
										_class.getInstance().get('callCount')
									);
								}
							},
							{
								title:'When spy object is created with object & method name, calls is empty before actually calling method',
								test:function() {
									return this.expect(
										0,
										_class.getInstance({object:_Uize_Class(), methodName:'fire'}).get('callCount')
									);
								}
							},
							{
								title:'When spy object is created with object & method name, calls has one item after making one method call',
								test:function() {
									var
										_object = _Uize_Class(),
										_spyObject = _class.getInstance({object:_object, methodName:'fire'})
									;

									_object.fire('Foo');

									return this.expect(
										1,
										_spyObject.get('callCount')
									);
								}
							},
							{
								title:'When spy object is created with object & method name, calls has multiple items after making multiple method calls',
								test:function() {
									var
										_object = _Uize_Class(),
										_spyObject = _class.getInstance({object:_object, methodName:'fire'})
									;

									_object.fire('1st');
									_object.fire('2nd');
									_object.fire('3rd');
									_object.fire('4th');

									return this.expect(
										4,
										_spyObject.get('callCount')
									);
								}
							},
							{
								title:'When making a method call on spy object with a single argument, the call data has the correct number of arguments',
								test:function() {
									var
										_object = _Uize_Class(),
										_spyObject = _class.getInstance({object:_object, methodName:'fire'})
									;

									_object.fire('Foo');

									return this.expect(
										1,
										_spyObject.get('calls')[0].args.length
									);
								}
							},
							{
								title:'When making a method call on spy object with multiple arguments, the call data has the correct number of arguments',
								test:function() {
									var
										_object = _Uize_Class(),
										_spyObject = _class.getInstance({object:_object, methodName:'fire'})
									;

									_object.fire('Foo', 'Bar', 'Baz');

									return this.expect(
										3,
										_spyObject.get('calls')[0].args.length
									);
								}
							},
							{
								title:'When making a method call on spy object with a single argument, the call data arguments are correct',
								test:function() {
									var
										_object = _Uize_Class(),
										_spyObject = _class.getInstance({object:_object, methodName:'fire'})
									;

									_object.fire('Foo');

									return this.expect(
										['Foo'],
										_spyObject.get('calls')[0].args
									);
								}
							},
							{
								title:'When making a method call on spy object with multiple arguments, the call data arguments are correct',
								test:function() {
									var
										_object = _Uize_Class(),
										_spyObject = _class.getInstance({object:_object, methodName:'fire'})
									;

									_object.fire('Foo', 'Bar', 'Baz');

									return this.expect(
										['Foo', 'Bar', 'Baz'],
										_spyObject.get('calls')[0].args
									);
								}
							}
						]
					},

					{
						title:'Testing callThrough',
						test:[
							{
								title:'When making a method call on a spy object, underlying method is not called by default',
								test:function(_continue) {
									var
										_callThroughTimeout,
										_object = _Uize_Class.subclass({
											instanceMethods:{
												foo:function() {
													clearTimeout(_callThroughTimeout);
													_continue(false);
												}
											}
										}) ()
									;

									_class.getInstance({object:_object, methodName:'foo'});

									_callThroughTimeout = setTimeout(
										function() { _continue(true) },
										0
									);

									_object.foo();
								}
							},
							{
								title:'When making a method call on a spy object and callThrough is set to true, underlying method is called',
								test:function(_continue) {
									var
										_callThroughTimeout,
										_object = _Uize_Class.subclass({
											instanceMethods:{
												foo:function() {
													clearTimeout(_callThroughTimeout);
													_continue(true);
												}
											}
										}) ()
									;

									_class.getInstance({
										object: _object,
										methodName: 'foo',
										callThrough: true
									});

									_callThroughTimeout = setTimeout(
										function() { _continue(false) },
										0
									);

									_object.foo();
								}
							},
							{
								title:'When making a method call on a spy object and callThrough is set to true, underlying method is called with correct context',
								test:function(_continue) {
									var
										m = this,
										_callThroughTimeout,
										_object = _Uize_Class.subclass({
											instanceMethods:{
												foo:function() {
													clearTimeout(_callThroughTimeout);
													_continue(m.expect(_object, this));
												}
											}
										}) ()
									;

									_class.getInstance({
										object: _object,
										methodName: 'foo',
										callThrough: true
									});

									_callThroughTimeout = setTimeout(
										function() { _continue(false) },
										0
									);

									_object.foo();
								}
							},
							{
								title:'When making a method call on a spy object and callThrough is set to true, underlying method is called with correct arguments',
								test:function(_continue) {
									var
										m = this,
										_callThroughTimeout,
										_object = _Uize_Class.subclass({
											instanceMethods:{
												foo:function() {
													clearTimeout(_callThroughTimeout);
													_continue(m.expect(['1','2','3'], _Uize.copyList(arguments)));
												}
											}
										}) ()
									;

									_class.getInstance({
										object: _object,
										methodName: 'foo',
										callThrough: true
									});

									_callThroughTimeout = setTimeout(
										function() { _continue(false) },
										0
									);

									_object.foo('1', '2', '3');
								}
							},
							{
								title:'When making a method call on a spy object and callThrough is set to true, underlying method returns the correct value',
								test:function() {
									var
										_object = _Uize_Class.subclass({
											instanceMethods:{
												foo:_Uize.returnX
											}
										}) ()
									;

									_class.getInstance({
										object:_object,
										methodName:'foo',
										callThrough:true
									});

									return this.expect(7, _object.foo(7));
								}
							},
							{
								title:'When making a method call on a spy object and callThrough is set to true, but there is a mockMethod, underlying method is not called',
								test:function(_continue) {
									var
										_callThroughTimeout,
										_object = _Uize_Class.subclass({
											instanceMethods:{
												foo:function() {
													clearTimeout(_callThroughTimeout);
													_continue(false);
												}
											}
										}) ()
									;

									_class.getInstance({
										object: _object,
										methodName: 'foo',
										callThrough: true,
										mockMethod: _Uize.returnTrue
									});

									_callThroughTimeout = setTimeout(
										function() { _continue(true) },
										0
									);

									_object.foo();
								}
							}
						]
					},

					{
						title:'Testing mockMethod',
						test:[
							{
								title:'When mockMethod is specified, but not a function, no errors',
								test:function() {
									_class.getInstance({
										object: _Uize_Class(),
										methodName: 'fire',
										mockMethod: 'not a function'
									});

									return true;
								}
							},
							{
								title:'When mockMethod is specified and a function, it is called',
								test:function(_continue) {
									var
										_mockMethodTimeout,
										_object = _Uize_Class()
									;

									_class.getInstance({
										object: _object,
										methodName: 'fire',
										mockMethod: function () {
											clearTimeout(_mockMethodTimeout);
											_continue(true);
										}
									});

									_mockMethodTimeout = setTimeout(
										function() { _continue(false) },
										0
									);

									_object.fire('Foo');
								}
							},
							{
								title:'When mockMethod is specified and a function, it is called with correct context',
								test:function(_continue) {
									var
										m = this,
										_mockMethodTimeout,
										_object = _Uize_Class()
									;

									_class.getInstance({
										object: _object,
										methodName: 'fire',
										mockMethod: function () {
											clearTimeout(_mockMethodTimeout);
											_continue(m.expect(_object, this));
										}
									});

									_mockMethodTimeout = setTimeout(
										function() { _continue(false) },
										0
									);

									_object.fire('Foo');
								}
							},
							{
								title:'When mockMethod is specified and a function, it is called with correct arguments',
								test:function(_continue) {
									var
										m = this,
										_mockMethodTimeout,
										_object = _Uize_Class()
									;

									_class.getInstance({
										object:_object,
										methodName:'fire',
										mockMethod:function() {
											clearTimeout(_mockMethodTimeout);
											_continue(m.expect(['Foo', 'Bar'], _Uize.copyList(arguments)));
										}
									});

									_mockMethodTimeout = setTimeout(
										function() { _continue(false) },
										0
									);

									_object.fire('Foo', 'Bar');
								}
							},
							{
								title:'When mockMethod is specified and a function, it returns the correct value',
								test:function() {
									var
										_object = _Uize_Class()
									;

									_class.getInstance({
										object:_object,
										methodName:'fire',
										mockMethod:_Uize.returnFalse
									});

									return this.expect(false, _object.fire('Foo'));
								}
							}
						]
					},

					{
						title:'Testing object',
						test:[
							{
								title:'When object is null, no errors',
								test:function() {
									_class.getInstance({object:null});
									return true;
								}
							},
							{
								title:'When object is a class, static method is spied on',
								test:function() {
									var
										_subclass = _Uize_Class.subclass({
											staticMethods:{
												foo:_Uize.returnTrue
											}
										}),
										_spyObject = _class.getInstance({
											object:_subclass,
											methodName:'foo'
										})
									;

									_subclass.foo('Foo', 'Bar');

									return _spyObject.get('hasBeenCalled');
								}
							}
						]
					},

					{
						title:'Testing methodName',
						test:[
							{
								title:'When methodName is null, no errors',
								test:function() {
									_class.getInstance({methodName:null});
									return true;
								}
							},
							{
								title:'When methodName refers to a non-existent method, no errors',
								test:function() {
									_class.getInstance({
										object:_Uize_Class(),
										methodName:'foo'
									});
									return true;
								}
							}
						]
					},

					{
						title:'Testing reset',
						test:[
							{
								title:'Calling reset after making calls, clears out calls list',
								test:function() {
									var
										_object = _Uize_Class(),
										_spyObject = _class.getInstance({object:_object, methodName:'fire'})
									;

									_object.fire('Foo');
									_object.fire('Foo');
									_object.fire('Foo');
									_object.fire('Foo');
									_object.fire('Foo');
									_object.fire('Foo');

									_spyObject.reset();

									return this.expect(
										0,
										_spyObject.get('callCount')
									);

								}
							},
							{
								title:'Changing object, clears out calls list',
								test:function() {
									var
										_object = _Uize_Class(),
										_spyObject = _class.getInstance({object:_object, methodName:'fire'})
									;

									_object.fire('Foo');
									_object.fire('Foo');
									_object.fire('Foo');
									_object.fire('Foo');
									_object.fire('Foo');
									_object.fire('Foo');

									_spyObject.set('object', _Uize_Class());

									return this.expect(
										0,
										_spyObject.get('callCount')
									);

								}
							},
							{
								title:'Changing methodName, clears out calls list',
								test:function() {
									var
										_object = _Uize_Class(),
										_spyObject = _class.getInstance({object:_object, methodName:'fire'})
									;

									_object.fire('Foo');
									_object.fire('Foo');
									_object.fire('Foo');
									_object.fire('Foo');
									_object.fire('Foo');
									_object.fire('Foo');

									_spyObject.set('methodName', 'wire');

									return this.expect(
										0,
										_spyObject.get('callCount')
									);

								}
							}
						]
					}
				]
			}
		});
	}
});
