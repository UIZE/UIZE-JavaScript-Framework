/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Widget.mChildBindings Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2015 UIZE
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
		The =Uize.Test.Uize.Widget.mChildBindings= module defines a suite of unit tests for the =Uize.Widget.mChildBindings= mixin module.

		*DEVELOPERS:* `Ben Ilegbodu`, original code contributed by `Zazzle Inc.`
*/

Uize.module ({
	name:'Uize.Test.Uize.Widget.mChildBindings',
	builder:function () {
		'use strict';

		function _getRandomPropertyValue() { return Math.floor(Math.random() * 10000) }

		function _getChildrenToAdd(_children) {
			return Uize.map (
				_children,
				function (_childProperties) {
					return Uize.copyInto ({widgetClass:Uize.Widget},_childProperties);
				}
			);
		}

		function _getTestWidgetClass(_bindings, _stateProperties, _children) {
			return Uize.Widget.subclass ({
				mixins:Uize.Widget.mChildBindings,
				omegastructor:function() { this.addChildren(_getChildrenToAdd(_children)) },
				stateProperties:_stateProperties,
				childBindings:_bindings
			});
		}

		function _getTestWidgetClassInstance(_bindings, _stateProperties, _children) {
			return _getTestWidgetClass(_bindings, _stateProperties, _children)({name:'parent'});
		}

		function _generateTest(_title, _bindingsVerbose, _bindingsShorthand, _expectedBindings) {
			var
				_generatedTests = [],
				_stateProperties,
				_children
			;

			function _generateSyntaxTests(_isVerbose) {
				var _bindings = _isVerbose ? _bindingsVerbose : _bindingsShorthand;

				function _getSyntaxTestWidgetClass(_omitChildren) {
					return _getTestWidgetClass(_bindings, _stateProperties, !_omitChildren && _children);
				}

				function _getSyntaxTestWidgetClassInstance(_omitChildren) {
					return _getSyntaxTestWidgetClass(_omitChildren)({name:'parent'});
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
													title:'Test for: ' + _propertyName + ' ' + _binding.direction + ' ' + _childName + '.' + _binding.property,
													test:function(_continue) {
														_expectFunc.call(
															this,
															Uize.copyInto(
																{
																	widget:_getSyntaxTestWidgetClassInstance(_omitChildren),
																	widgetProperty:_propertyName,
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
							title:'Widget class is not null',
							test:function() { return this.expectNonNull(_getSyntaxTestWidgetClass()) }
						},
						{
							title:'Widget instance without any children is not null (widget works without any children)',
							test:function() { return this.expectNonNull(_getSyntaxTestWidgetClassInstance(true)) }
						},
						{
							title:'Widget instance with children is not null (children aren\'t wired before they are added)',
							test:function() { return this.expectNonNull(_getSyntaxTestWidgetClassInstance()) }
						},
						{
							title:'State property is synched with child\'s state property in the correct direction when child is added',
							test:_generateTestsForAll(
								function(_binding, _continue) {
									var
										_widget = _binding.widget,
										_initialValue = _widget.get(_binding.widgetProperty),
										_aToB = _binding.aToB || Uize.returnX,
										_bToA = Uize.returnX
									;

									// Only when the direction is from child to widget does the child's initial value get synched to the widget
									if (_binding.direction == '<-') {
										_initialValue = _children[_binding.child][_binding.property];
										_aToB = Uize.returnX;
										_bToA = _binding.bToA || Uize.returnX;
									}

									_widget.addChildren(_getChildrenToAdd(_children));

									_continue(
										this.expect(_bToA(_initialValue), _widget.get(_binding.widgetProperty))
											&& this.expect(_aToB(_initialValue), _widget.children[_binding.child].get(_binding.property))
									);
								},
								true
							)
						},
						{
							title:'When widget value changes, child value updates to same value (when applicable)',
							test:_generateTestsForAll(
								function(_binding, _continue) {
									// we're not synching parent -> child so just keep going
									if (_binding.direction == '<-') {
										_continue(true);
										return;
									}

									var
										m = this,
										_widget = _binding.widget,
										_newValue = _getRandomPropertyValue(),
										_aToB = _binding.aToB || Uize.returnX
									;

									// set widget to new value
									_widget.set(_binding.widgetProperty, _newValue);

									_continue(m.expect(_aToB(_newValue), _widget.children[_binding.child].get(_binding.property)));
								}
							)
						},
						{
							title:'When child widget value changes, widget value updates to same value (when applicable)',
							test:_generateTestsForAll(
								function(_binding, _continue) {
									// we're not synching child -> parent so just skip
									if (_binding.direction == '->') {
										_continue(true);
										return;
									}

									var
										m = this,
										_widget = _binding.widget,
										_newValue = _getRandomPropertyValue(),
										_bToA = _binding.bToA || Uize.returnX
									;

									// set widget to new value
									_widget.children[_binding.child].set(_binding.property, _newValue);

									_continue(m.expect(_bToA(_newValue), _widget.get(_binding.widgetProperty)));
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
						for (var _bindingNo = -1; ++_bindingNo < _bindingsForChild.length;)
							(_children[_childName] = _children[_childName] || {})[
								_bindingsForChild[_bindingNo].property
							] = _getRandomPropertyValue()
						;
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

		return Uize.Test.resolve ({
			title:'Uize.Widget.mChildBindings Module Test',
			test:[
				Uize.Test.requiredModulesTest ([
					'Uize.Widget',
					'Uize.Widget.mChildBindings'
				]),
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
					title:'Edge Cases',
					test:[
						{
							title:'When a child is bound bi-directionally and the parent widget has data and the child widget doesn\'t, the parent should be the driver widget',
							test:function() {
								var
									_widgetInitialPropertyValue = _getRandomPropertyValue(),
									_widget = _getTestWidgetClassInstance(
										{propertyA:'childA'},
										{propertyA:{name:'propertyA',value:_widgetInitialPropertyValue}},
										{childA:{}}
									)
								;

								return this.expect(_widgetInitialPropertyValue, _widget.get('propertyA'))
									&& this.expect(_widget.get('propertyA'), _widget.children.childA.get('propertyA'))
								;
							}
						},
						{
							title:'When a child is bound bi-directionally and it has data and the parent widget doesn\'t, the child should be the driver widget',
							test:function() {
								var
									_childWidgetInitialPropertyValue = _getRandomPropertyValue(),
									_widget = _getTestWidgetClassInstance(
										{propertyA:'childA'},
										{propertyA:{name:'propertyA'}},
										{childA:{propertyA:_childWidgetInitialPropertyValue}}
									),
									_childAWidget = _widget.children.childA
								;

								return this.expect(_childWidgetInitialPropertyValue, _childAWidget.get('propertyA'))
									&& this.expect(_childAWidget.get('propertyA'), _widget.get('propertyA'))
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
									_widget = _getTestWidgetClassInstance(
										{propertyA:'childA'},
										{propertyA:{name:'propertyA',value:_getRandomPropertyValue()}},
										{childA:{propertyA:_getRandomPropertyValue()}}
									),
									_childToRemove = _widget.children.childA // keep reference so we'll have it after removal
								;

								_widget.removeChild(_childToRemove);

								// set widget to new value to see if child widget will also update (which it shouldn't)
								_widget.set('propertyA', _getRandomPropertyValue());

								return this.expect(true, _widget.get('propertyA') != _childToRemove.get('propertyA'));
							}
						},
						{
							title:'When a bound child is removed, a state property change in child after removal is properly handled (no errors and not fired on parent)',
							test:function() {
								var
									_widget = _getTestWidgetClassInstance(
										{propertyA:'childA'},
										{propertyA:{name:'propertyA',value:_getRandomPropertyValue()}},
										{childA:{propertyA:_getRandomPropertyValue()}}
									),
									_childToRemove = _widget.children.childA // keep reference so we'll have it after removal
								;

								_widget.removeChild(_childToRemove);

								// set widget to new value to see if child widget will also update (which it shouldn't)
								_childToRemove.set('propertyA', _getRandomPropertyValue());

								return this.expect(true, _widget.get('propertyA') != _childToRemove.get('propertyA'));
							}
						},
						{
							title:'When a bound child is removed, and a new same-named child is re-added, the new child\'s state is synched',
							test:function() {
								var
									_widget = _getTestWidgetClassInstance(
										{propertyA:'childA'},
										{propertyA:{name:'propertyA',value:_getRandomPropertyValue()}},
										{childA:{propertyA:_getRandomPropertyValue()}}
									)
								;

								// first remove the child
								_widget.removeChild('childA');

								// then add back a new child with the same name (which should get bound again)
								_widget.addChild('childA', Uize.Widget, {propertyA:_getRandomPropertyValue()});

								// state should match when the child's state is synched
								return this.expect(_widget.get('propertyA'), _widget.children.childA.get('propertyA'));
							}
						},
						{
							title:'When a bound child is removed, and a new same-named child is re-added, a change in widget state should be reflected in child\'s',
							test:function() {
								var
									_widget = _getTestWidgetClassInstance(
										{propertyA:'childA'},
										{propertyA:{name:'propertyA',value:_getRandomPropertyValue()}},
										{childA:{propertyA:_getRandomPropertyValue()}}
									)
								;

								// first remove the child
								_widget.removeChild('childA');

								// then add back a new child with the same name (which should get bound again)
								_widget.addChild('childA', Uize.Widget, {propertyA:_getRandomPropertyValue()});

								// set widget to new value (which should get bound to child)
								_widget.set('propertyA', _getRandomPropertyValue());

								return this.expect(_widget.get('propertyA'), _widget.children.childA.get('propertyA'));
							}
						},
						{
							title:'When a subclass declares the same state property/child/child state property combination, the base class\' declaration is overridden',
							test:function() {
								var
									_WidgetClass = _getTestWidgetClass(
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
									_WidgetSubclass = _WidgetClass.subclass({
										childBindings:{
											propertyA:'->childA.childPropertyA'
										}
									})
								;

								return this.expectSameAs(_WidgetSubclass.mChildBindings_bindings.childB['propertyA/propertyA'], _WidgetClass.mChildBindings_bindings.childB['propertyA/propertyA'])
									&& this.expectNotSameAs(_WidgetSubclass.mChildBindings_bindings.childA['propertyA/childPropertyA'], _WidgetClass.mChildBindings_bindings.childA['propertyA/childPropertyA'])
									&& this.expect(1, Uize.keys(_WidgetSubclass.mChildBindings_bindings.childA).length)
									&& this.expectNonNull(1, _WidgetSubclass.mChildBindings_bindings.childA['propertyA/childPropertyA'])
									&& this.expect(1, Uize.keys(_WidgetSubclass.mChildBindings_bindings.childB).length)
									&& this.expectNonNull(1, _WidgetSubclass.mChildBindings_bindings.childB['propertyA/propertyA'])
								;
							}
						}
					]
				}
			]
		});
	}
});

