/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Class.mChildObjectBindings Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2016 UIZE
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
		The =Uize.Test.Uize.Class.mChildObjectBindings= module defines a suite of unit tests for the =Uize.Class.mChildObjectBindings= mixin module.

		*DEVELOPERS:* `Ben Ilegbodu`, original code contributed by `Zazzle Inc.`
*/

Uize.module ({
	name:'Uize.Test.Uize.Class.mChildObjectBindings',
	superclass:'Uize.Test.Class',
	required:'Uize.Widget',
	builder:function (_superclass) {
		'use strict';

		var
			_Uize = Uize,

			_bindingsFunctionName = 'childBindings',
			_addMethodName = 'addChild',
			_removeMethodName = 'removeChild',
			_childObjectsInstancePropertyName = 'children',
			_bindingWiringsStaticDataName = 'mChildObjectBindings_' + _bindingsFunctionName + '_wirings',

			_class = _superclass.subclass({
				moduleToTest:'Uize.Class.mChildObjectBindings'
			})
		;

		function _getRandomPropertyValue() { return Math.floor(Math.random() * 10000) }

		function _addChildren(_instance, _children) {
			_children = Uize.map (
				_children,
				function (_childProperties, _childName) {
					if (_childName) {
						var _objectClass = _Uize.Widget;

						if ('objectClass' in _childProperties) {
							_childProperties = _Uize.clone(_childProperties);
							_objectClass = _childProperties.objectClass;

							delete _childProperties.objectClass;
						}

						_instance[_addMethodName](_childName, _objectClass, _childProperties);
					}
				}
			);
		}

		function _getTestClass(_bindings, _stateProperties, _children) {
			return Uize.Widget.subclass (
				_Uize.copyInto(
					{
						mixins:_Uize.Class.mChildObjectBindings,
						childObjectBindings:{
							declaration:_bindingsFunctionName,
							instanceProperty:_childObjectsInstancePropertyName,
							addedInstanceProperty:'addedChildren',
							stateProperty:_childObjectsInstancePropertyName
						},
						omegastructor:function() { _addChildren(this, _children) },
						stateProperties:_stateProperties
					},
					_Uize.pairUp(_bindingsFunctionName, _bindings)
				)
			);
		}

		function _getTestClassInstance(_bindings, _stateProperties, _children) {
			return _getTestClass(_bindings, _stateProperties, _children)({name:'parent'});
		}

		function _generateTest(_title, _bindingsVerbose, _bindingsShorthand, _expectedBindings) {
			var
				_generatedTests = [],
				_stateProperties,
				_children
			;

			function _generateSyntaxTests(_isVerbose) {
				var _bindings = _isVerbose ? _bindingsVerbose : _bindingsShorthand;

				function _getSyntaxTestClass(_omitChildren) {
					return _getTestClass(_bindings, _stateProperties, !_omitChildren && _children);
				}

				function _getSyntaxTestClassInstance(_omitChildren) {
					return _getSyntaxTestClass(_omitChildren)({name:'parent'});
				}

				function _generateTestsForAll(_expectFunc, _omitChildren) {
					var _tests = [];

					if (!Uize.isEmpty(_expectFunc)) {
						Uize.forEach(
							_expectedBindings,
							function(_bindingsForProperty, _propertyName) {
								Uize.forEach(
									_bindingsForProperty,
									function(_bindingsForChild, _childName) {
										Uize.forEach(
											_bindingsForChild,
											function(_binding) {
												_tests.push({
													title:'Test for: ' + _propertyName + ' ' + _binding.direction + ' ' + (_childName || '[self]') + '.' + _binding.property,
													test:function(_continue) {
														_expectFunc.call(
															this,
															Uize.copyInto(
																{
																	instance:_getSyntaxTestClassInstance(_omitChildren),
																	instanceProperty:_propertyName,
																	child:_childName
																},
																_binding
															),
															_continue
														)
													;}
												});
											}
										);
									}
								);
							}
						);
					}

					return _tests;
				}

				return {
					title:(_isVerbose ? 'Verbose' : 'Shorthand') + ' Syntax',
					test:[
						{
							title:'Class is not null',
							test:function() { return this.expectNonNull(_getSyntaxTestClass()) }
						},
						{
							title:'Instance without any children is not null (instance works without any children)',
							test:function() { return this.expectNonNull(_getSyntaxTestClassInstance(true)) }
						},
						{
							title:'Instance with children is not null (children aren\'t wired before they are added)',
							test:function() { return this.expectNonNull(_getSyntaxTestClassInstance()) }
						},
						{
							title:'State property is synched with child\'s state property in the correct direction when child is added',
							test:_generateTestsForAll(
								function(_binding, _continue) {
									var
										_instance = _binding.instance,
										_initialValue = _instance.get(_binding.instanceProperty),
										_aToB = _binding.aToB || Uize.returnX,
										_bToA = Uize.returnX
									;

									// Only when the direction is from child to instance does the child's initial value get synched to the instance
									if (_binding.direction == '<-') {
										_initialValue = _binding.child
											? _children[_binding.child][_binding.property]
											: _instance.get(_binding.property)
										;
										_aToB = Uize.returnX;
										_bToA = _binding.bToA || Uize.returnX;
									}

									_addChildren(_instance, _children);

									var
										_child = _binding.child
											? _instance[_childObjectsInstancePropertyName][_binding.child]
											: _instance
									;

									_continue(
										this.expect(_bToA(_initialValue), _instance.get(_binding.instanceProperty))
											&& this.expect(_aToB(_initialValue), _child.get(_binding.property))
									);
								},
								true
							)
						},
						{
							title:'When instance value changes, child value updates to same value (when applicable)',
							test:_generateTestsForAll(
								function(_binding, _continue) {
									// we're not synching parent -> child so just keep going
									if (_binding.direction == '<-') {
										_continue(true);
										return;
									}

									var
										m = this,
										_instance = _binding.instance,
										_newValue = _getRandomPropertyValue(),
										_aToB = _binding.aToB || Uize.returnX,
										_child = _binding.child
											? _instance[_childObjectsInstancePropertyName][_binding.child]
											: _instance
									;

									// set instance to new value
									_instance.set(_binding.instanceProperty, _newValue);

									_continue(m.expect(_aToB(_newValue), _child.get(_binding.property)));
								}
							)
						},
						{
							title:'When child object value changes, instance value updates to same value (when applicable)',
							test:_generateTestsForAll(
								function(_binding, _continue) {
									// we're not synching child -> parent so just skip
									if (_binding.direction == '->') {
										_continue(true);
										return;
									}

									var
										m = this,
										_instance = _binding.instance,
										_newValue = _getRandomPropertyValue(),
										_bToA = _binding.bToA || Uize.returnX,
										_child = _binding.child
											? _instance[_childObjectsInstancePropertyName][_binding.child]
											: _instance
									;

									// set instance to new value
									_child.set(_binding.property, _newValue);

									_continue(m.expect(_bToA(_newValue), _instance.get(_binding.instanceProperty)));
								}
							)
						}
					]
				};
			}

			if (_expectedBindings) {
				_children = {};
				_stateProperties = {};

				for (var _property in _expectedBindings) {
					var _bindingsForProperty = _expectedBindings[_property];

					_stateProperties[_property] = {
						name:_property,
						value:_getRandomPropertyValue()
					};

					for (var _childName in _bindingsForProperty) {
						var _bindingsForChild = _bindingsForProperty[_childName];
						for (var _bindingNo = -1; ++_bindingNo < _bindingsForChild.length;) {
							var
								_childPropertyName = _bindingsForChild[_bindingNo].property,
								_propertyValue = _getRandomPropertyValue()
							;
							if (_childName)
								(_children[_childName] = _children[_childName] || {})[_childPropertyName] = _propertyValue;
							else
								_stateProperties[_childPropertyName] = {
									name:_childPropertyName,
									value:_propertyValue
								};
						}
					}
				}
			}

			(!_expectedBindings || _bindingsShorthand)
				&& _generatedTests.push(_generateSyntaxTests());
			(!_expectedBindings || _bindingsVerbose)
				&& _generatedTests.push(_generateSyntaxTests(true));

			return {
				title:_title,
				test:_generatedTests
			};
		}

		return _class.declare({
			set:{
				test:[
					_class.requiredModulesTest(),

					{
						title:'Empty',
						test:[
							_generateTest('When no bindings are specified, no state properties are bound'),
							_generateTest('When empty bindings are specified, no state properties are bound', {}, {})
						]
					},
					{
						title:'Errors',
						test:[
							_generateTest(
								'When no child is specified, nothing is bound (and no errors are thrown)',
								{
									propertyA:{}
								},
								{
									propertyA:''
								}
							),
							_generateTest(
								'When malformed shorthand syntax is specified, nothing is bound (and no errors are thrown)',
								undefined,
								{
									propertyA:'#child',
									propertyB:'child.'
								}
							)
						]
					},
					{
						title:'Single State Property Binding',
						test:[
							{
								title:'Single Child Binding',
								test:[
									_generateTest(
										'When only the child property is specified, the child is bound to same-named state property bi-directionally',
										{
											propertyA:{
												child:'childA'
											}
										},
										{
											propertyA:'childA'
										},
										{
											propertyA:{
												childA:[
													{
														property:'propertyA',
														direction:'<->'
													}
												]
											}
										}
									),
									_generateTest(
										'When the child & property properties are specified, the child is bound to the state property bi-directionally',
										{
											propertyA:{
												child:'childA',
												property:'childPropertyA'
											}
										},
										{
											propertyA:'childA.childPropertyA'
										},
										{
											propertyA:{
												childA:[
													{
														property:'childPropertyA',
														direction:'<->'
													}
												]
											}
										}
									),
									{
										title:'When the child & direction properties are specified, the child is bound to same-named state property according to the direction',
										test:[
											_generateTest(
												'<->',
												{
													propertyA:{
														child:'childA',
														direction:'<->'
													}
												},
												{
													propertyA:'<->childA'
												},
												{
													propertyA:{
														childA:[
															{
																property:'propertyA',
																direction:'<->'
															}
														]
													}
												}
											),
											_generateTest(
												'->',
												{
													propertyA:{
														child:'childA',
														direction:'->'
													}
												},
												{
													propertyA:'->childA'
												},
												{
													propertyA:{
														childA:[
															{
																property:'propertyA',
																direction:'->'
															}
														]
													}
												}
											),
											_generateTest(
												'<-',
												{
													propertyA:{
														child:'childA',
														direction:'<-'
													}
												},
												{
													propertyA:'<-childA'
												},
												{
													propertyA:{
														childA:[
															{
																property:'propertyA',
																direction:'<-'
															}
														]
													}
												}
											)
										]
									},
									{
										title:'When the child & valueAdapter properties are specified, the child is bound to same-named state property via the appropriate value transformer',
										test:[
											_generateTest(
												'Empty value adapter',
												{
													propertyA:{
														child:'childA',
														valueAdapter:{}
													}
												},
												{
													propertyA:'childA'
												},
												{
													propertyA:{
														childA:[
															{
																property:'propertyA',
																direction:'<->'
															}
														]
													}
												}
											),
											_generateTest(
												'String value transformers',
												{
													propertyA:{
														child:'childA',
														valueAdapter:{
															aToB:'value * 2',
															bToA:'value / 2'
														}
													}
												},
												null,
												{
													propertyA:{
														childA:[
															{
																property:'propertyA',
																direction:'<->',
																aToB:function(_value) { return _value * 2 },
																bToA:function(_value) { return _value / 2 }
															}
														]
													}
												}
											),
											_generateTest(
												'Function value transformers',
												{
													propertyA:{
														child:'childA',
														valueAdapter:{
															aToB:function(_value) { return _value / 2 },
															bToA:function(_value) { return _value * 2 }
														}
													}
												},
												null,
												{
													propertyA:{
														childA:[
															{
																property:'propertyA',
																direction:'<->',
																aToB:function(_value) { return _value / 2 },
																bToA:function(_value) { return _value * 2 }
															}
														]
													}
												}
											),
											_generateTest(
												'->',
												{
													propertyA:{
														child:'childA',
														direction:'->',
														valueAdapter:{
															aToB:function(_value) { return _value - 15 }
														}
													}
												},
												null,
												{
													propertyA:{
														childA:[
															{
																property:'propertyA',
																direction:'->',
																aToB:function(_value) { return _value - 15 }
															}
														]
													}
												}
											),
											_generateTest(
												'<-',
												{
													propertyA:{
														child:'childA',
														direction:'<-',
														valueAdapter:{
															bToA:'value + 7'
														}
													}
												},
												null,
												{
													propertyA:{
														childA:[
															{
																property:'propertyA',
																direction:'<-',
																bToA:function(_value) { return _value + 7 }
															}
														]
													}
												}
											)
										]
									}
								]
							},
							{
								title:'Multiple Child Binding',
								test:[
									_generateTest(
										'When only the child property is specified, each child is bound to same-named state property bi-directionally',
										{
											propertyA:[
												{
													child:'childA'
												},
												{
													child:'childB'
												}
											]
										},
										{
											propertyA:[
												'childA',
												'childB'
											]
										},
										{
											propertyA:{
												childA:[
													{
														property:'propertyA',
														direction:'<->'
													}
												],
												childB:[
													{
														property:'propertyA',
														direction:'<->'
													}
												]
											}
										}
									),
									_generateTest(
										'When the child & property properties are specified, each child is bound to the state property bi-directionally',
										{
											propertyA:[
												{
													child:'childA',
													property:'childPropertyA'
												},
												{
													child:'childB',
													property:'childPropertyA'
												}
											]
										},
										{
											propertyA:[
												'childA.childPropertyA',
												'childB.childPropertyA'
											]
										},
										{
											propertyA:{
												childA:[
													{
														property:'childPropertyA',
														direction:'<->'
													}
												],
												childB:[
													{
														property:'childPropertyA',
														direction:'<->'
													}
												]
											}
										}
									),
									{
										title:'When the child & direction properties are specified, each child is bound to same-named state property according to the direction',
										test:[
											_generateTest(
												'<->',
												{
													propertyA:[
														{
															child:'childA',
															direction:'<->'
														},
														{
															child:'childB',
															direction:'<->'
														}
													]
												},
												{
													propertyA:[
														'<->childA',
														'<->childB'
													]
												},
												{
													propertyA:{
														childA:[
															{
																property:'propertyA',
																direction:'<->'
															}
														],
														childB:[
															{
																property:'propertyA',
																direction:'<->'
															}
														]
													}
												}
											),
											_generateTest(
												'->',
												{
													propertyA:[
														{
															child:'childA',
															direction:'->'
														},
														{
															child:'childB',
															direction:'->'
														}
													]
												},
												{
													propertyA:[
														'->childA',
														'->childB'
													]
												},
												{
													propertyA:{
														childA:[
															{
																property:'propertyA',
																direction:'->'
															}
														],
														childB:[
															{
																property:'propertyA',
																direction:'->'
															}
														]
													}
												}
											)/*,
											_generateTest(
												'<-',
												{
													propertyA:[
														{
															child:'childA',
															direction:'<-'
														},
														{
															child:'childB',
															direction:'<-'
														}
													]
												},
												{
													propertyA:[
														'<-childA',
														'<-childB'
													]
												},
												{
													propertyA:{
														childA:[
															{
																property:'propertyA',
																direction:'<-'
															}
														],
														childB:[
															{
																property:'propertyA',
																direction:'<-'
															}
														]
													}
												}
											)*/
										]
									},
									{
										title:'When the child & valueAdapter properties are specified, each child is bound to same-named state property via the appropriate value transformer',
										test:[
											_generateTest(
												'Empty value adapter',
												{
													propertyA:[
														{
															child:'childA',
															valueAdapter:{}
														},
														{
															child:'childB',
															valueAdapter:{}
														}
													]
												},
												{
													propertyA:['childA', 'childB']
												},
												{
													propertyA:{
														childA:[
															{
																property:'propertyA',
																direction:'<->'
															}
														],
														childB:[
															{
																property:'propertyA',
																direction:'<->'
															}
														]
													}
												}
											),
											_generateTest(
												'String value transformers',
												{
													propertyA:[
														{
															child:'childA',
															valueAdapter:{
																aToB:'value * 2',
																bToA:'value / 2'
															}
														},
														{
															child:'childB',
															valueAdapter:{
																aToB:'value + 2',
																bToA:'value - 2'
															}
														}
													]
												},
												null,
												{
													propertyA:{
														childA:[
															{
																property:'propertyA',
																direction:'<->',
																aToB:function(_value) { return _value * 2 },
																bToA:function(_value) { return _value / 2 }
															}
														],
														childB:[
															{
																property:'propertyA',
																direction:'<->',
																aToB:function(_value) { return _value + 2 },
																bToA:function(_value) { return _value - 2 }
															}
														]
													}
												}
											),
											_generateTest(
												'Function value transformers',
												{
													propertyA:[
														{
															child:'childA',
															valueAdapter:{
																aToB:function(_value) { return _value / 2 },
																bToA:function(_value) { return _value * 2 }
															}
														},
														{
															child:'childB',
															valueAdapter:{
																aToB:function(_value) { return _value - 2 },
																bToA:function(_value) { return _value + 2 }
															}
														}
													]
												},
												null,
												{
													propertyA:{
														childA:[
															{
																property:'propertyA',
																direction:'<->',
																aToB:function(_value) { return _value / 2 },
																bToA:function(_value) { return _value * 2 }
															}
														],
														childB:[
															{
																property:'propertyA',
																direction:'<->',
																aToB:function(_value) { return _value - 2 },
																bToA:function(_value) { return _value + 2 }
															}
														]
													}
												}
											),
											_generateTest(
												'->',
												{
													propertyA:[
														{
															child:'childA',
															direction:'->',
															valueAdapter:{
																aToB:function(_value) { return _value - 15 }
															}
														},
														{
															child:'childB',
															direction:'->',
															valueAdapter:{
																aToB:function(_value) { return _value * 15 }
															}
														},
														{
															child:'childC',
															direction:'->',
															valueAdapter:{
																aToB:function(_value) { return _value / 15 }
															}
														}
													]
												},
												null,
												{
													propertyA:{
														childA:[
															{
																property:'propertyA',
																direction:'->',
																aToB:function(_value) { return _value - 15 }
															}
														],
														childB:[
															{
																property:'propertyA',
																direction:'->',
																aToB:function(_value) { return _value * 15 }
															}
														],
														childC:[
															{
																property:'propertyA',
																direction:'->',
																aToB:function(_value) { return _value / 15 }
															}
														]
													}
												}
											)/*,
											_generateTest(
												'<-',
												{
													propertyA:[
														{
															child:'childA',
															direction:'<-',
															valueAdapter:{
																bToA:'value + 7'
															}
														},
														{
															child:'childB',
															direction:'<-',
															valueAdapter:{
																bToA:'value + 17'
															}
														}
													]
												},
												null,
												{
													propertyA:{
														childA:[
															{
																property:'propertyA',
																direction:'<-',
																bToA:function(_value) { return _value + 7 }
															}
														],
														childB:[
															{
																property:'propertyA',
																direction:'<-',
																bToA:function(_value) { return _value + 17 }
															}
														]
													}
												}
											)*/
										]
									}
								]
							}
						]
					},
					{
						title:'Multiple State Property Binding',
						test:[
							{
								title:'Single Child Binding',
								test:[
									_generateTest(
										'When only the child property is specified, the child is bound to same-named state property bi-directionally',
										{
											propertyA:{
												child:'childA'
											},
											propertyB:{
												child:'childA'
											}
										},
										{
											propertyA:'childA',
											propertyB:'childA'
										},
										{
											propertyA:{
												childA:[
													{
														property:'propertyA',
														direction:'<->'
													}
												]
											},
											propertyB:{
												childA:[
													{
														property:'propertyB',
														direction:'<->'
													}
												]
											}
										}
									),
									_generateTest(
										'When the child & property properties are specified, the child is bound to the state property bi-directionally',
										{
											propertyA:{
												child:'childA',
												property:'childPropertyA'
											},
											propertyB:{
												child:'childA',
												property:'childPropertyB'
											}
										},
										{
											propertyA:'childA.childPropertyA',
											propertyB:'childA.childPropertyB'
										},
										{
											propertyA:{
												childA:[
													{
														property:'childPropertyA',
														direction:'<->'
													}
												]
											},
											propertyB:{
												childA:[
													{
														property:'childPropertyB',
														direction:'<->'
													}
												]
											}
										}
									),
									{
										title:'When the child & direction properties are specified, the child is bound to same-named state property according to the direction',
										test:[
											_generateTest(
												'<->',
												{
													propertyA:{
														child:'childA',
														direction:'<->'
													},
													propertyB:{
														child:'childA',
														direction:'<->'
													}
												},
												{
													propertyA:'<->childA',
													propertyB:'<->childA'
												},
												{
													propertyA:{
														childA:[
															{
																property:'propertyA',
																direction:'<->'
															}
														]
													},
													propertyB:{
														childA:[
															{
																property:'propertyB',
																direction:'<->'
															}
														]
													}
												}
											),
											_generateTest(
												'->',
												{
													propertyA:{
														child:'childA',
														direction:'->'
													},
													propertyB:{
														child:'childA',
														direction:'->'
													}
												},
												{
													propertyA:'->childA',
													propertyB:'->childA'
												},
												{
													propertyA:{
														childA:[
															{
																property:'propertyA',
																direction:'->'
															}
														]
													},
													propertyB:{
														childA:[
															{
																property:'propertyB',
																direction:'->'
															}
														]
													}
												}
											),
											_generateTest(
												'<-',
												{
													propertyA:{
														child:'childA',
														direction:'<-'
													},
													propertyB:{
														child:'childA',
														direction:'<-'
													}
												},
												{
													propertyA:'<-childA',
													propertyB:'<-childA'
												},
												{
													propertyA:{
														childA:[
															{
																property:'propertyA',
																direction:'<-'
															}
														]
													},
													propertyB:{
														childA:[
															{
																property:'propertyB',
																direction:'<-'
															}
														]
													}
												}
											)
										]
									},
									{
										title:'When the child & valueAdapter properties are specified, the child is bound to same-named state property via the appropriate value transformer',
										test:[
											_generateTest(
												'Empty value adapter',
												{
													propertyA:{
														child:'childA',
														valueAdapter:{}
													},
													propertyB:{
														child:'childA',
														valueAdapter:{}
													}
												},
												{
													propertyA:'childA',
													propertyB:'childA'
												},
												{
													propertyA:{
														childA:[
															{
																property:'propertyA',
																direction:'<->'
															}
														]
													},
													propertyB:{
														childA:[
															{
																property:'propertyB',
																direction:'<->'
															}
														]
													}
												}
											),
											_generateTest(
												'String value transformers',
												{
													propertyA:{
														child:'childA',
														valueAdapter:{
															aToB:'value * 2',
															bToA:'value / 2'
														}
													},
													propertyB:{
														child:'childA',
														valueAdapter:{
															aToB:'value + 2',
															bToA:'value - 2'
														}
													}
												},
												null,
												{
													propertyA:{
														childA:[
															{
																property:'propertyA',
																direction:'<->',
																aToB:function(_value) { return _value * 2 },
																bToA:function(_value) { return _value / 2 }
															}
														]
													},
													propertyB:{
														childA:[
															{
																property:'propertyB',
																direction:'<->',
																aToB:function(_value) { return _value + 2 },
																bToA:function(_value) { return _value - 2 }
															}
														]
													}
												}
											),
											_generateTest(
												'Function value transformers',
												{
													propertyA:{
														child:'childA',
														valueAdapter:{
															aToB:function(_value) { return _value / 2 },
															bToA:function(_value) { return _value * 2 }
														}
													},
													propertyB:{
														child:'childA',
														valueAdapter:{
															aToB:function(_value) { return _value - 2 },
															bToA:function(_value) { return _value + 2 }
														}
													}
												},
												null,
												{
													propertyA:{
														childA:[
															{
																property:'propertyA',
																direction:'<->',
																aToB:function(_value) { return _value / 2 },
																bToA:function(_value) { return _value * 2 }
															}
														]
													},
													propertyB:{
														childA:[
															{
																property:'propertyB',
																direction:'<->',
																aToB:function(_value) { return _value - 2 },
																bToA:function(_value) { return _value + 2 }
															}
														]
													}
												}
											),
											_generateTest(
												'->',
												{
													propertyA:{
														child:'childA',
														direction:'->',
														valueAdapter:{
															aToB:function(_value) { return _value - 15 }
														}
													},
													propertyB:{
														child:'childA',
														direction:'->',
														valueAdapter:{
															aToB:function(_value) { return _value * 15 }
														}
													},
													propertyC:{
														child:'childA',
														direction:'->',
														valueAdapter:{
															aToB:function(_value) { return _value / 15 }
														}
													}
												},
												null,
												{
													propertyA:{
														childA:[
															{
																property:'propertyA',
																direction:'->',
																aToB:function(_value) { return _value - 15 }
															}
														]
													},
													propertyB:{
														childA:[
															{
																property:'propertyB',
																direction:'->',
																aToB:function(_value) { return _value * 15 }
															}
														]
													},
													propertyC:{
														childA:[
															{
																property:'propertyC',
																direction:'->',
																aToB:function(_value) { return _value / 15 }
															}
														]
													}
												}
											),
											_generateTest(
												'<-',
												{
													propertyA:{
														child:'childA',
														direction:'<-',
														valueAdapter:{
															bToA:'value + 7'
														}
													},
													propertyB:{
														child:'childA',
														direction:'<-',
														valueAdapter:{
															bToA:'value + 17'
														}
													}
												},
												null,
												{
													propertyA:{
														childA:[
															{
																property:'propertyA',
																direction:'<-',
																bToA:function(_value) { return _value + 7 }
															}
														]
													},
													propertyB:{
														childA:[
															{
																property:'propertyB',
																direction:'<-',
																bToA:function(_value) { return _value + 17 }
															}
														]
													}
												}
											)
										]
									}
								]
							},
							{
								title:'Multiple Child Binding',
								test:[
									_generateTest(
										'When only the child property is specified, each child is bound to same-named state property bi-directionally',
										{
											propertyA:[
												{
													child:'childA'
												},
												{
													child:'childB'
												}
											],
											propertyB:[
												{
													child:'childA'
												},
												{
													child:'childB'
												}
											]
										},
										{
											propertyA:[
												'childA',
												'childB'
											],
											propertyB:[
												'childA',
												'childB'
											]
										},
										{
											propertyA:{
												childA:[
													{
														property:'propertyA',
														direction:'<->'
													}
												],
												childB:[
													{
														property:'propertyA',
														direction:'<->'
													}
												]
											},
											propertyB:{
												childA:[
													{
														property:'propertyB',
														direction:'<->'
													}
												],
												childB:[
													{
														property:'propertyB',
														direction:'<->'
													}
												]
											}
										}
									),
									_generateTest(
										'When the child & property properties specified, each child is bound to the state property bi-directionally',
										{
											propertyA:[
												{
													child:'childA',
													property:'childPropertyA'
												},
												{
													child:'childB',
													property:'childPropertyA'
												}
											],
											propertyB:[
												{
													child:'childA',
													property:'childPropertyB'
												},
												{
													child:'childB',
													property:'childPropertyB'
												},
												{
													child:'childC',
													property:'childPropertyB'
												}
											]
										},
										{
											propertyA:[
												'childA.childPropertyA',
												'childB.childPropertyA'
											],
											propertyB:[
												'childA.childPropertyB',
												'childB.childPropertyB',
												'childC.childPropertyB'
											]
										},
										{
											propertyA:{
												childA:[
													{
														property:'childPropertyA',
														direction:'<->'
													}
												],
												childB:[
													{
														property:'childPropertyA',
														direction:'<->'
													}
												]
											},
											propertyB:{
												childA:[
													{
														property:'childPropertyB',
														direction:'<->'
													}
												],
												childB:[
													{
														property:'childPropertyB',
														direction:'<->'
													}
												],
												childC:[
													{
														property:'childPropertyB',
														direction:'<->'
													}
												]
											}
										}
									),
									{
										title:'When the child & direction properties are specified, each child is bound to same-named state property according to the direction',
										test:[
											_generateTest(
												'<->',
												{
													propertyA:[
														{
															child:'childA',
															direction:'<->'
														},
														{
															child:'childB',
															direction:'<->'
														},
														{
															child:'childC',
															direction:'<->'
														},
														{
															child:'childD',
															direction:'<->'
														}
													],
													propertyB:[
														{
															child:'childA',
															direction:'<->'
														},
														{
															child:'childB',
															direction:'<->'
														}
													]
												},
												{
													propertyA:[
														'<->childA',
														'<->childB',
														'<->childC',
														'<->childD'
													],
													propertyB:[
														'<->childA',
														'<->childB'
													]
												},
												{
													propertyA:{
														childA:[
															{
																property:'propertyA',
																direction:'<->'
															}
														],
														childB:[
															{
																property:'propertyA',
																direction:'<->'
															}
														],
														childC:[
															{
																property:'propertyA',
																direction:'<->'
															}
														],
														childD:[
															{
																property:'propertyA',
																direction:'<->'
															}
														]
													},
													propertyB:{
														childA:[
															{
																property:'propertyB',
																direction:'<->'
															}
														],
														childB:[
															{
																property:'propertyB',
																direction:'<->'
															}
														]
													}
												}
											),
											_generateTest(
												'->',
												{
													propertyA:[
														{
															child:'childA',
															direction:'->'
														},
														{
															child:'childB',
															direction:'->'
														},
														{
															child:'childC',
															direction:'->'
														}
													],
													propertyB:[
														{
															child:'childA',
															direction:'->'
														},
														{
															child:'childB',
															direction:'->'
														},
														{
															child:'childC',
															direction:'->'
														}
													],
													propertyC:[
														{
															child:'childA',
															direction:'->'
														},
														{
															child:'childB',
															direction:'->'
														}
													]
												},
												{
													propertyA:[
														'->childA',
														'->childB',
														'->childC'
													],
													propertyB:[
														'->childA',
														'->childB',
														'->childC'
													],
													propertyC:[
														'->childA',
														'->childB'
													]
												},
												{
													propertyA:{
														childA:[
															{
																property:'propertyA',
																direction:'->'
															}
														],
														childB:[
															{
																property:'propertyA',
																direction:'->'
															}
														],
														childC:[
															{
																property:'propertyA',
																direction:'->'
															}
														]
													},
													propertyB:{
														childA:[
															{
																property:'propertyB',
																direction:'->'
															}
														],
														childB:[
															{
																property:'propertyB',
																direction:'->'
															}
														],
														childC:[
															{
																property:'propertyB',
																direction:'->'
															}
														]
													},
													propertyC:{
														childA:[
															{
																property:'propertyC',
																direction:'->'
															}
														],
														childB:[
															{
																property:'propertyC',
																direction:'->'
															}
														]
													}
												}
											)/*,
											_generateTest(
												'<-',
												{
													propertyA:[
														{
															child:'childA',
															direction:'<-'
														},
														{
															child:'childB',
															direction:'<-'
														},
														{
															child:'childC',
															direction:'<-'
														},
														{
															child:'childD',
															direction:'<-'
														}
													],
													propertyB:[
														{
															child:'childA',
															direction:'<-'
														},
														{
															child:'childB',
															direction:'<-'
														}
													]
												},
												{
													propertyA:[
														'<-childA',
														'<-childB',
														'<-childC',
														'<-childD'
													],
													propertyB:[
														'<-childA',
														'<-childB'
													]
												},
												{
													propertyA:{
														childA:[
															{
																property:'propertyA',
																direction:'<-'
															}
														],
														childB:[
															{
																property:'propertyA',
																direction:'<-'
															}
														],
														childC:[
															{
																property:'propertyA',
																direction:'<-'
															}
														],
														childD:[
															{
																property:'propertyA',
																direction:'<-'
															}
														]
													},
													propertyB:{
														childA:[
															{
																property:'propertyB',
																direction:'<-'
															}
														],
														childB:[
															{
																property:'propertyB',
																direction:'<-'
															}
														]
													}
												}
											)*/
										]
									},
									{
										title:'When the child & valueAdapter properties are specified, each child is bound to same-named state property via the appropriate value transformer',
										test:[
											_generateTest(
												'Empty value adapter',
												{
													propertyA:[
														{
															child:'childA',
															valueAdapter:{}
														},
														{
															child:'childB',
															valueAdapter:{}
														}
													],
													propertyB:[
														{
															child:'childA',
															valueAdapter:{}
														},
														{
															child:'childB',
															valueAdapter:{}
														}
													]
												},
												{
													propertyA:['childA', 'childB'],
													propertyB:['childA', 'childB']
												},
												{
													propertyA:{
														childA:[
															{
																property:'propertyA',
																direction:'<->'
															}
														],
														childB:[
															{
																property:'propertyA',
																direction:'<->'
															}
														]
													},
													propertyB:{
														childA:[
															{
																property:'propertyB',
																direction:'<->'
															}
														],
														childB:[
															{
																property:'propertyB',
																direction:'<->'
															}
														]
													}
												}
											),
											_generateTest(
												'String value transformers',
												{
													propertyA:[
														{
															child:'childA',
															valueAdapter:{
																aToB:'value * 2',
																bToA:'value / 2'
															}
														},
														{
															child:'childB',
															valueAdapter:{
																aToB:'value + 2',
																bToA:'value - 2'
															}
														}
													],
													propertyB:[
														{
															child:'childA',
															valueAdapter:{
																aToB:'value - 20',
																bToA:'value + 20'
															}
														},
														{
															child:'childB',
															valueAdapter:{
																aToB:'value + 20',
																bToA:'value - 20'
															}
														}
													]
												},
												null,
												{
													propertyA:{
														childA:[
															{
																property:'propertyA',
																direction:'<->',
																aToB:function(_value) { return _value * 2 },
																bToA:function(_value) { return _value / 2 }
															}
														],
														childB:[
															{
																property:'propertyA',
																direction:'<->',
																aToB:function(_value) { return _value + 2 },
																bToA:function(_value) { return _value - 2 }
															}
														]
													},
													propertyB:{
														childA:[
															{
																property:'propertyB',
																direction:'<->',
																aToB:function(_value) { return _value - 20 },
																bToA:function(_value) { return _value + 20 }
															}
														],
														childB:[
															{
																property:'propertyB',
																direction:'<->',
																aToB:function(_value) { return _value + 20 },
																bToA:function(_value) { return _value - 20 }
															}
														]
													}
												}
											),
											_generateTest(
												'Function value transformers',
												{
													propertyA:[
														{
															child:'childA',
															valueAdapter:{
																aToB:function(_value) { return _value / 2 },
																bToA:function(_value) { return _value * 2 }
															}
														},
														{
															child:'childB',
															valueAdapter:{
																aToB:function(_value) { return _value - 2 },
																bToA:function(_value) { return _value + 2 }
															}
														}
													],
													propertyB:[
														{
															child:'childA',
															valueAdapter:{
																aToB:function(_value) { return _value / 10 },
																bToA:function(_value) { return _value * 10 }
															}
														},
														{
															child:'childB',
															valueAdapter:{
																aToB:function(_value) { return _value - 10 },
																bToA:function(_value) { return _value + 10 }
															}
														}
													]
												},
												null,
												{
													propertyA:{
														childA:[
															{
																property:'propertyA',
																direction:'<->',
																aToB:function(_value) { return _value / 2 },
																bToA:function(_value) { return _value * 2 }
															}
														],
														childB:[
															{
																property:'propertyA',
																direction:'<->',
																aToB:function(_value) { return _value - 2 },
																bToA:function(_value) { return _value + 2 }
															}
														]
													},
													propertyB:{
														childA:[
															{
																property:'propertyB',
																direction:'<->',
																aToB:function(_value) { return _value / 10 },
																bToA:function(_value) { return _value * 10 }
															}
														],
														childB:[
															{
																property:'propertyB',
																direction:'<->',
																aToB:function(_value) { return _value - 10 },
																bToA:function(_value) { return _value + 10 }
															}
														]
													}
												}
											),
											_generateTest(
												'->',
												{
													propertyA:[
														{
															child:'childA',
															direction:'->',
															valueAdapter:{
																aToB:function(_value) { return _value - 15 }
															}
														},
														{
															child:'childB',
															direction:'->',
															valueAdapter:{
																aToB:function(_value) { return _value * 15 }
															}
														},
														{
															child:'childC',
															direction:'->',
															valueAdapter:{
																aToB:function(_value) { return _value / 15 }
															}
														}
													],
													propertyB:[
														{
															child:'childA',
															direction:'->',
															valueAdapter:{
																aToB:function(_value) { return _value - 15 }
															}
														},
														{
															child:'childB',
															direction:'->',
															valueAdapter:{
																aToB:function(_value) { return _value * 15 }
															}
														},
														{
															child:'childC',
															direction:'->',
															valueAdapter:{
																aToB:function(_value) { return _value / 15 }
															}
														}
													]
												},
												null,
												{
													propertyA:{
														childA:[
															{
																property:'propertyA',
																direction:'->',
																aToB:function(_value) { return _value - 15 }
															}
														],
														childB:[
															{
																property:'propertyA',
																direction:'->',
																aToB:function(_value) { return _value * 15 }
															}
														],
														childC:[
															{
																property:'propertyA',
																direction:'->',
																aToB:function(_value) { return _value / 15 }
															}
														]
													},
													propertyB:{
														childA:[
															{
																property:'propertyB',
																direction:'->',
																aToB:function(_value) { return _value - 15 }
															}
														],
														childB:[
															{
																property:'propertyB',
																direction:'->',
																aToB:function(_value) { return _value * 15 }
															}
														],
														childC:[
															{
																property:'propertyB',
																direction:'->',
																aToB:function(_value) { return _value / 15 }
															}
														]
													}
												}
											)/*,
											_generateTest(
												'<-',
												{
													propertyA:[
														{
															child:'childA',
															direction:'<-',
															valueAdapter:{
																bToA:'value + 7'
															}
														},
														{
															child:'childB',
															direction:'<-',
															valueAdapter:{
																bToA:'value + 17'
															}
														}
													]
												},
												null,
												{
													propertyA:{
														childA:[
															{
																property:'propertyA',
																direction:'<-',
																bToA:function(_value) { return _value + 7 }
															}
														],
														childB:[
															{
																property:'propertyA',
																direction:'<-',
																bToA:function(_value) { return _value + 17 }
															}
														]
													}
												}
											)*/
										]
									}
								]
							}
						]
					},
					{
						title:'Conditional binding (when)',
						test:[
							{
								title:'When *when* condition is specified and it isn\'t initially met, the children do *not* initially have the instance\'s properties',
								test:_Uize.map(
									[
										{
											child:'childA',
											when:'whenProperty'
										},
										'childA:whenProperty'
									],
									function(_propertyBinding) {
										return {
											title:_Uize.isPlainObject(_propertyBinding) ? 'Verbose Syntax' : 'Shorthand Syntax',
											test:function() {
												var
													m = this,
													_childInstancePropertyValue = _getRandomPropertyValue(),
													_instance = _getTestClassInstance(
														{propertyA:_propertyBinding},
														{
															propertyA:{name:'propertyA',value:_getRandomPropertyValue()},
															propertyB:{name:'whenProperty', value:false}
														},
														{childA:{propertyA:_childInstancePropertyValue}}
													)
												;

												return m.expect(_childInstancePropertyValue, _instance[_childObjectsInstancePropertyName].childA.get('propertyA'));
											}
										};
									}
								)
							},
							{
								title:'When *when* condition is specified and it isn\'t initially met, the instance\'s properties do not initially have the child\'s',
								test:_Uize.map(
									[
										{
											child:'childA',
											property:'propertyA',
											direction:'<-',
											when:'whenProperty'
										},
										'<-childA.propertyA:whenProperty'
									],
									function(_propertyBinding) {
										return {
											title:_Uize.isPlainObject(_propertyBinding) ? 'Verbose Syntax' : 'Shorthand Syntax',
											test:function() {
												var
													m = this,
													_instancePropertyValue = _getRandomPropertyValue(),
													_instance = _getTestClassInstance(
														{propertyA:_propertyBinding},
														{
															propertyA:{name:'propertyA',value:_instancePropertyValue},
															propertyB:{name:'whenProperty', value:false}
														},
														{childA:{propertyA:_getRandomPropertyValue()}}
													)
												;

												return m.expect(_instancePropertyValue, _instance.get('propertyA'));
											}
										};
									}
								)
							},
							{
								title:'When *when* condition is specified and it isn\'t initially met, but becomes met, the children\'s properties are synced',
								test:_Uize.map(
									[
										{
											child:'childA',
											when:'whenProperty'
										},
										'childA:whenProperty'
									],
									function(_propertyBinding) {
										return {
											title:_Uize.isPlainObject(_propertyBinding) ? 'Verbose Syntax' : 'Shorthand Syntax',
											test:function() {
												var
													m = this,
													_instancePropertyValue = _getRandomPropertyValue(),
													_instance = _getTestClassInstance(
														{propertyA:_propertyBinding},
														{
															propertyA:{name:'propertyA',value:_instancePropertyValue},
															propertyB:{name:'whenProperty', value:false}
														},
														{childA:{propertyA:_getRandomPropertyValue()}}
													)
												;

												_instance.met('whenProperty');

												return m.expect(_instancePropertyValue, _instance[_childObjectsInstancePropertyName].childA.get('propertyA'));
											}
										};
									}
								)
							},
							{
								title:'When *when* condition is specified and it isn\'t initially met, but becomes met, the intance\'s properties are synced',
								test:function() {
									var
										m = this,
										_childInstancePropertyValue = _getRandomPropertyValue(),
										_instance = _getTestClassInstance(
											{
												propertyA:{
													child:'childA',
													direction:'<-',
													when:'whenProperty'
												}
											},
											{
												propertyA:{name:'propertyA',value:_getRandomPropertyValue()},
												propertyB:{name:'whenProperty', value:false}
											},
											{childA:{propertyA:_childInstancePropertyValue}}
										)
									;

									_instance.met('whenProperty');

									return m.expect(_childInstancePropertyValue, _instance.get('propertyA'));
								}
							},
							{
								title:'When *when* condition is specified and it isn\'t initially met and the instance\'s value changes, the children still do *not* have the instance\'s properties',
								test:function() {
									var
										m = this,
										_childInstancePropertyValue = _getRandomPropertyValue(),
										_instance = _getTestClassInstance(
											{
												propertyA:{
													child:'childA',
													when:'whenProperty'
												}
											},
											{
												propertyA:{name:'propertyA',value:_getRandomPropertyValue()},
												propertyB:{name:'whenProperty', value:false}
											},
											{childA:{propertyA:_childInstancePropertyValue}}
										)
									;

									_instance.set('propertyA', _getRandomPropertyValue());

									return m.expect(_childInstancePropertyValue, _instance[_childObjectsInstancePropertyName].childA.get('propertyA'));
								}
							},
							{
								title:'When *when* condition is specified and it isn\'t initially met and the child\'s value changes, the instance\'s properties still do *not* have the child\'s',
								test:function() {
									var
										m = this,
										_instancePropertyValue = _getRandomPropertyValue(),
										_instance = _getTestClassInstance(
											{
												propertyA:{
													child:'childA',
													direction:'<-',
													when:'whenProperty'
												}
											},
											{
												propertyA:{name:'propertyA',value:_instancePropertyValue},
												propertyB:{name:'whenProperty', value:false}
											},
											{childA:{propertyA:_getRandomPropertyValue()}}
										),
										_child = _instance[_childObjectsInstancePropertyName].childA
									;

									_child.set('propertyA', _getRandomPropertyValue());

									return m.expect(_instancePropertyValue, _instance.get('propertyA'));
								}
							},
							{
								title:'When *when* condition is specified and it is initially met, the children\'s properties are synced',
								test:function() {
									var
										m = this,
										_instancePropertyValue = _getRandomPropertyValue(),
										_instance = _getTestClassInstance(
											{
												propertyA:{
													child:'childA',
													when:'whenProperty'
												}
											},
											{
												propertyA:{name:'propertyA',value:_instancePropertyValue},
												propertyB:{name:'whenProperty', value:true}
											},
											{childA:{propertyA:_getRandomPropertyValue()}}
										)
									;

									return m.expect(_instancePropertyValue, _instance[_childObjectsInstancePropertyName].childA.get('propertyA'));
								}
							},
							{
								title:'When *when* condition is specified and it isn initially met, the intance\'s properties are synced',
								test:function() {
									var
										m = this,
										_childInstancePropertyValue = _getRandomPropertyValue(),
										_instance = _getTestClassInstance(
											{
												propertyA:{
													child:'childA',
													direction:'<-',
													when:'whenProperty'
												}
											},
											{
												propertyA:{name:'propertyA',value:_getRandomPropertyValue()},
												propertyB:{name:'whenProperty', value:true}
											},
											{childA:{propertyA:_childInstancePropertyValue}}
										)
									;

									return m.expect(_childInstancePropertyValue, _instance.get('propertyA'));
								}
							},
							{
								title:'When *when* condition is specified and it is initially met, but becomes unmet and the instance\'s value changes, the children still do *not* have the instance\'s properties',
								test:function() {
									var
										m = this,
										_instancePropertyValue = _getRandomPropertyValue(),
										_instance = _getTestClassInstance(
											{
												propertyA:{
													child:'childA',
													when:'whenProperty'
												}
											},
											{
												propertyA:{name:'propertyA',value:_instancePropertyValue},
												propertyB:{name:'whenProperty', value:true}
											},
											{childA:{propertyA:_getRandomPropertyValue()}}
										)
									;

									_instance.unmet('whenProperty');
									_instance.set('propertyA', _getRandomPropertyValue());

									return m.expect(_instancePropertyValue, _instance[_childObjectsInstancePropertyName].childA.get('propertyA'));
								}
							},
							{
								title:'When *when* condition is specified and it is initially met, but becomes unmet and the child\'s value changes, the instance\'s properties still do *not* have the child\'s',
								test:function() {
									var
										m = this,
										_childInstancePropertyValue = _getRandomPropertyValue(),
										_instance = _getTestClassInstance(
											{
												propertyA:{
													child:'childA',
													direction:'<-',
													when:'whenProperty'
												}
											},
											{
												propertyA:{name:'propertyA',value:_getRandomPropertyValue()},
												propertyB:{name:'whenProperty', value:true}
											},
											{childA:{propertyA:_childInstancePropertyValue}}
										),
										_child = _instance[_childObjectsInstancePropertyName].childA
									;

									_instance.unmet('whenProperty');
									_child.set('propertyA', _getRandomPropertyValue());

									return m.expect(_childInstancePropertyValue, _instance.get('propertyA'));
								}
							},
							{
								title:'When *when* condition is specified and it isn\'t initially met, the child is removed, and condition becomes met, the child\'s value is *not* synched',
								test:function() {
									var
										m = this,
										_childInstancePropertyValue = _getRandomPropertyValue(),
										_instance = _getTestClassInstance(
											{
												propertyA:{
													child:'childA',
													when:'whenProperty'
												}
											},
											{
												propertyA:{name:'propertyA',value:_getRandomPropertyValue()},
												propertyB:{name:'whenProperty', value:false}
											},
											{childA:{propertyA:_childInstancePropertyValue}}
										),
										_child = _instance[_childObjectsInstancePropertyName].childA
									;

									_instance.removeChild(_child);
									_instance.met('whenProperty');

									return m.expect(_childInstancePropertyValue, _child.get('propertyA'));
								}
							},
							{
								title:'When *when* condition is specified and it isn\'t initially met, the child is removed, and condition becomes met, the instance\'s properties still do *not* have the child\'s',
								test:function() {
									var
										m = this,
										_instancePropertyValue = _getRandomPropertyValue(),
										_instance = _getTestClassInstance(
											{
												propertyA:{
													child:'childA',
													direction:'<-',
													when:'whenProperty'
												}
											},
											{
												propertyA:{name:'propertyA',value:_instancePropertyValue},
												propertyB:{name:'whenProperty', value:false}
											},
											{childA:{propertyA:_getRandomPropertyValue()}}
										),
										_child = _instance[_childObjectsInstancePropertyName].childA
									;

									_instance.removeChild(_child);
									_instance.met('whenProperty');

									return m.expect(_instancePropertyValue, _instance.get('propertyA'));
								}
							}
						]
					},
					{
						title:'Edge Cases',
						test:[
							{
								title:'Child is self (parent) widget',
								test:[
									_generateTest(
										'Omit child name (and no child property specified so it\'s pointing back to itself)',
										{
											propertyA:{}
										},
										{
											propertyA:''
										},
										{
											propertyA:{
												'':[
													{
														property:'propertyA',
														direction:'<->'
													}
												]
											}
										}
									),
									_generateTest(
										'Omit child name (same property name specified so it\'s pointing back to itself)',
										{
											propertyA:{
												property:'propertyA'
											}
										},
										{
											propertyA:'.propertyA'
										},
										{
											propertyA:{
												'':[
													{
														property:'propertyA',
														direction:'<->'
													}
												]
											}
										}
									),
									_generateTest(
										'Omit child name (different property name)',
										{
											propertyA:{
												property:'propertyB'
											}
										},
										{
											propertyA:'.propertyB'
										},
										{
											propertyA:{
												'':[
													{
														property:'propertyB',
														direction:'<->'
													}
												]
											}
										}
									),
									_generateTest(
										'Specify child name (null)',
										{
											propertyA:{
												child:null,
												property:'propertyB'
											}
										},
										{
											propertyA:'.propertyB'
										},
										{
											propertyA:{
												'':[
													{
														property:'propertyB',
														direction:'<->'
													}
												]
											}
										}
									),
									_generateTest(
										'Specify child name (undefined)',
										{
											propertyA:{
												child:undefined,
												property:'propertyB'
											}
										},
										{
											propertyA:'.propertyB'
										},
										{
											propertyA:{
												'':[
													{
														property:'propertyB',
														direction:'<->'
													}
												]
											}
										}
									),
									_generateTest(
										'Specify child name (empty)',
										{
											propertyA:{
												child:'',
												property:'propertyB'
											}
										},
										{
											propertyA:'.propertyB'
										},
										{
											propertyA:{
												'':[
													{
														property:'propertyB',
														direction:'<->'
													}
												]
											}
										}
									),
									_generateTest(
										'Specify child name, property & direction (<->)',
										{
											propertyA:{
												child:'',
												property:'propertyB',
												direction:'<->'
											}
										},
										{
											propertyA:'<->.propertyB'
										},
										{
											propertyA:{
												'':[
													{
														property:'propertyB',
														direction:'<->'
													}
												]
											}
										}
									),
									_generateTest(
										'Specify child name, property & direction (->)',
										{
											propertyA:{
												child:'',
												property:'propertyB',
												direction:'->'
											}
										},
										{
											propertyA:'->.propertyB'
										},
										{
											propertyA:{
												'':[
													{
														property:'propertyB',
														direction:'->'
													}
												]
											}
										}
									),
									_generateTest(
										'Specify child name, property & direction (<-)',
										{
											propertyA:{
												child:'',
												property:'propertyB',
												direction:'<-'
											}
										},
										{
											propertyA:'<-.propertyB'
										},
										{
											propertyA:{
												'':[
													{
														property:'propertyB',
														direction:'<-'
													}
												]
											}
										}
									)
								]
							},
							{
								title:'When a child is added, it is created with its parent\'s initial state for its bound properties to the parent',
								test:function() {
									var
										m = this,
										_childChangeHandlerCallCount = 0,
										_instance = _getTestClassInstance(
											{propertyA:'childA'},
											{propertyA:{name:'propertyA',value:_getRandomPropertyValue()}}
										),
										_childClass = _Uize.Widget.subclass({
											stateProperties:{
												propertyA:{
													name:'propertyA',
													onChange:function() {
														_childChangeHandlerCallCount++;
													},
													value:_getRandomPropertyValue()
												}
											}
										})
									;

									_instance[_addMethodName]('childA', _childClass);

									return m.expect(1, _childChangeHandlerCallCount);
								}
							},
							{
								title:'When a child is bound bi-directionally and the instance has data and the child doesn\'t, the instance should be the driver object',
								test:function() {
									var
										_instanceInitialPropertyValue = _getRandomPropertyValue(),
										_instance = _getTestClassInstance(
											{propertyA:'childA'},
											{propertyA:{name:'propertyA',value:_instanceInitialPropertyValue}},
											{childA:{}}
										)
									;

									return this.expect(_instanceInitialPropertyValue, _instance.get('propertyA'))
										&& this.expect(_instance.get('propertyA'), _instance[_childObjectsInstancePropertyName].childA.get('propertyA'))
									;
								}
							},
							{
								title:'When a child is bound bi-directionally and it has data and the instance doesn\'t, the child should be the driver object',
								test:function() {
									var
										_childObjectInitialPropertyValue = _getRandomPropertyValue(),
										_instance = _getTestClassInstance(
											{propertyA:'childA'},
											{propertyA:{name:'propertyA'}},
											{childA:{propertyA:_childObjectInitialPropertyValue}}
										),
										_childAObject = _instance[_childObjectsInstancePropertyName].childA
									;

									return this.expect(_childObjectInitialPropertyValue, _childAObject.get('propertyA'))
										&& this.expect(_childAObject.get('propertyA'), _instance.get('propertyA'))
									;
								}
							},
							/*_generateTest(
								'Thrashing doesn\'t occurr with bi-directional bindings (best demonstrated with mis-match value adapters)',
								{
									propertyA:{
										child:'childA',
										valueAdapter:{
											aToB:'value * 3',
											bToA:'value / 2'
										}
									}
								},
								null,
								{
									propertyA:{
										childA:[
											{
												property:'propertyA',
												direction:'<->',
												aToB:function(_value) { return _value * 3},
												bToA:function(_value) { return _value / 2 }
											}
										]
									}
								}
							),*/
							{
								title:'When a bound child is removed, a state property change in parent after removal is properly handled (no errors and not fired on child)',
								test:function() {
									var
										_instance = _getTestClassInstance(
											{propertyA:'childA'},
											{propertyA:{name:'propertyA',value:_getRandomPropertyValue()}},
											{childA:{propertyA:_getRandomPropertyValue()}}
										),
										_childToRemove = _instance[_childObjectsInstancePropertyName].childA // keep reference so we'll have it after removal
									;

									_instance[_removeMethodName](_childToRemove);

									// set instance to new value to see if child will also update (which it shouldn't)
									_instance.set('propertyA', _getRandomPropertyValue());

									return this.expect(true, _instance.get('propertyA') != _childToRemove.get('propertyA'));
								}
							},
							{
								title:'When a bound child is removed, a state property change in child after removal is properly handled (no errors and not fired on parent)',
								test:function() {
									var
										_instance = _getTestClassInstance(
											{propertyA:'childA'},
											{propertyA:{name:'propertyA',value:_getRandomPropertyValue()}},
											{childA:{propertyA:_getRandomPropertyValue()}}
										),
										_childToRemove = _instance[_childObjectsInstancePropertyName].childA // keep reference so we'll have it after removal
									;

									_instance[_removeMethodName](_childToRemove);

									// set instance to new value to see if child will also update (which it shouldn't)
									_childToRemove.set('propertyA', _getRandomPropertyValue());

									return this.expect(true, _instance.get('propertyA') != _childToRemove.get('propertyA'));
								}
							},
							{
								title:'When a bound child is removed, and a new same-named child is re-added, the new child\'s state is sync\'d',
								test:function() {
									var
										_instance = _getTestClassInstance(
											{propertyA:'childA'},
											{propertyA:{name:'propertyA',value:_getRandomPropertyValue()}},
											{childA:{propertyA:_getRandomPropertyValue()}}
										)
									;

									// first remove the child
									_instance[_removeMethodName]('childA');

									// then add back a new child with the same name (which should get bound again)
									_instance.addChild('childA', Uize.Widget, {propertyA:_getRandomPropertyValue()});

									// state should match when the child's state is synched
									return this.expect(_instance.get('propertyA'), _instance[_childObjectsInstancePropertyName].childA.get('propertyA'));
								}
							},
							{
								title:'When a bound child is removed, and a new same-named child is re-added, a change in instance state should be reflected in child\'s',
								test:function() {
									var
										_instance = _getTestClassInstance(
											{propertyA:'childA'},
											{propertyA:{name:'propertyA',value:_getRandomPropertyValue()}},
											{childA:{propertyA:_getRandomPropertyValue()}}
										)
									;

									// first remove the child
									_instance[_removeMethodName]('childA');

									// then add back a new child with the same name (which should get bound again)
									_instance.addChild('childA', Uize.Widget, {propertyA:_getRandomPropertyValue()});

									// set instance to new value (which should get bound to child)
									_instance.set('propertyA', _getRandomPropertyValue());

									return this.expect(_instance.get('propertyA'), _instance[_childObjectsInstancePropertyName].childA.get('propertyA'));
								}
							},
							{
								title:'When a subclass declares the same state property/child/child state property combination, the base class\' declaration is overridden',
								test:function() {
									var
										_Class = _getTestClass(
											{
												propertyA:[
													{
														child:'childA',
														property:'childPropertyA',
														direction:'<->',
														valueAdapter:{
															aToB:'value * 2',
															bToA:'value / 2'
														}
													},
													'childB'
												]
											},
											{
												propertyA:{name:'propertyA',value:_getRandomPropertyValue()},
												propertyB:{name:'propertyB',value:_getRandomPropertyValue()}
											},
											{
												childA:{
													propertyA:_getRandomPropertyValue(),
													propertyB:_getRandomPropertyValue()
												},
												childB:{
													propertyA:_getRandomPropertyValue()
												}
											}
										),
										_Subclass = _Class.subclass(
											_Uize.pairUp(
												_bindingsFunctionName,
												{
													propertyA:'->childA.childPropertyA'
												}
											)
										),
										_ClassBindingsData = _Class[_bindingWiringsStaticDataName],
										_SubclassBindingsData = _Subclass[_bindingWiringsStaticDataName]
									;

									return this.expectSameAs(_SubclassBindingsData.childB['propertyA/propertyA'], _ClassBindingsData.childB['propertyA/propertyA'])
										&& this.expectNotSameAs(_SubclassBindingsData.childA['propertyA/childPropertyA'], _ClassBindingsData.childA['propertyA/childPropertyA'])
										&& this.expect(1, Uize.keys(_SubclassBindingsData.childA).length)
										&& this.expectNonNull(1, _SubclassBindingsData.childA['propertyA/childPropertyA'])
										&& this.expect(1, Uize.keys(_SubclassBindingsData.childB).length)
										&& this.expectNonNull(1, _SubclassBindingsData.childB['propertyA/propertyA'])
									;
								}
							}
						]
					}
				]
			}
		});
	}
});
