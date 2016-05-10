/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Class.mTreeInheritance Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2015-2016 UIZE
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
		The =Uize.Test.Uize.Class.mTreeInheritance= module defines a suite of unit tests for the =Uize.Class.mTreeInheritance= mixin module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Class.mTreeInheritance',
	required:'Uize.Class',
	builder:function () {
		'use strict';

		function _getTestClass () {
			return Uize.Class.subclass ({
				alphastructor:function () {
					this.children = {};
				},

				instanceMethods:{
					addChild:function (_childName,_child) {
						_child.set ({parent:this});
						this.children [_childName] = _child;
					},

					removeChild:function (_childName) {
						var _child = this.children [_childName];
						if (_child) {
							_child.set ({parent:undefined});
							delete this.children [_childName];
						}
					}
				},

				stateProperties:{
					parent:{}
				},

				mixins:Uize.Class.mTreeInheritance
			});
		}

		function _getTestClassWithTreeInheritedStateProperties (_properties) {
			return _getTestClass ().declare ({treeInheritedStateProperties:_properties});
		}

		return Uize.Test.resolve ({
			title:'Uize.Class.mTreeInheritance Module Test',
			test:[
				Uize.Test.requiredModulesTest ('Uize.Class.mTreeInheritance'),
				{
					title:'Static Method Tests',
					test:[
						{
							title:'STATIC METHOD TEST: MyClass.treeInheritedStateProperties',
							test:[
								{
									title:'The static property MyClass.treeInheritedStateProperties is a function',
									test:function () {
										var _TestClass = _getTestClass ();
										return this.expectFunction (_TestClass.treeInheritedStateProperties);
									}
								},
								{
									title:
										'When the treeInheritedStateProperties static method is used to declare a tree-inherited state property, two state properties are created: the main tree-inherited state property and the state property for the resolved value',
									test:function () {
										var
											_TestClass = _getTestClassWithTreeInheritedStateProperties ({
												foo:{value:'default'}
											}),
											_testInstance = _TestClass (),
											_properties = _testInstance.get ()
										;
										return (
											this.expect (true,'foo' in _properties) &&
											this.expect (true,'fooInherited' in _properties)
										);
									}
								},
								{
									title:'Multiple tree-inherited properties can be declared in a single declaration',
									test:function () {
										var
											_TestClass = _getTestClassWithTreeInheritedStateProperties ({
												foo:{value:'default'},
												bar:{value:'default'},
												baz:{value:'default'},
												qux:{value:'default'}
											}),
											_testInstance = _TestClass (),
											_properties = _testInstance.get ()
										;
										return (
											this.expect (true,'foo' in _properties) &&
											this.expect (true,'fooInherited' in _properties) &&
											this.expect (true,'bar' in _properties) &&
											this.expect (true,'barInherited' in _properties) &&
											this.expect (true,'baz' in _properties) &&
											this.expect (true,'bazInherited' in _properties) &&
											this.expect (true,'qux' in _properties) &&
											this.expect (true,'quxInherited' in _properties)
										);
									}
								},
								{
									title:
										'The value specified in the profile for a tree-inherited property will be the inherited value fot the property for an instance that is not parented',
									test:function () {
										var
											_TestClass = _getTestClassWithTreeInheritedStateProperties ({
												foo:{value:'default'}
											}),
											_testInstance = _TestClass ()
										;
										return this.expect ('default',_testInstance.get ('fooInherited'));
									}
								},
								{
									title:
										'If a value other than "inherit" is specified for the tree-inherited property, then that value will be the inherited value fot an instance that is not parented',
									test:function () {
										var
											_TestClass = _getTestClassWithTreeInheritedStateProperties ({
												foo:{value:'default'}
											}),
											_testInstance = _TestClass ({foo:'bar'})
										;
										return this.expect ('bar',_testInstance.get ('fooInherited'));
									}
								},
								{
									title:
										'When an unparented child whose inherited value for a tree-inherited property has already been resolved is later parented, the inherited value will be resolved again to reflect the new parentage',
									test:function () {
										var
											_expectedInheritedValues = [],
											_TestClass = _getTestClassWithTreeInheritedStateProperties ({
												foo:{value:'default'}
											}),
											_testInstance = _TestClass (),
											_testInstanceParent = _TestClass ({foo:'bar'})
										;
										_expectedInheritedValues.push (_testInstance.get ('fooInherited'));
										_testInstanceParent.addChild ('child',_testInstance);
										_expectedInheritedValues.push (_testInstance.get ('fooInherited'));

										return this.expect (['default','bar'],_expectedInheritedValues);
									}
								},
								{
									title:
										'When a parented child whose inherited value for a tree-inherited property has already been resolved is later unparented, the inherited value will be resolved again to reflect the new orphaned state',
									test:function () {
										var
											_expectedInheritedValues = [],
											_TestClass = _getTestClassWithTreeInheritedStateProperties ({
												foo:{value:'default'}
											}),
											_testInstance = _TestClass (),
											_testInstanceParent = _TestClass ({foo:'bar'})
										;
										_testInstanceParent.addChild ('child',_testInstance);
										_expectedInheritedValues.push (_testInstance.get ('fooInherited'));
										_testInstanceParent.removeChild ('child');
										_expectedInheritedValues.push (_testInstance.get ('fooInherited'));

										return this.expect (['bar','default'],_expectedInheritedValues);
									}
								},
								{
									title:
										'When a parented child whose inherited value for a tree-inherited property has already been resolved is later reparented, the inherited value will be resolved again to reflect the new parentage',
									test:function () {
										var
											_expectedInheritedValues = [],
											_TestClass = _getTestClassWithTreeInheritedStateProperties ({
												foo:{value:'default'}
											}),
											_testInstance = _TestClass (),
											_testInstanceParent = _TestClass ({foo:'bar'}),
											_testInstanceParent2 = _TestClass ({foo:'BAR'})
										;
										_testInstanceParent.addChild ('child',_testInstance);
										_expectedInheritedValues.push (_testInstance.get ('fooInherited'));
										_testInstanceParent.removeChild ('child');
										_testInstanceParent2.addChild ('child',_testInstance);
										_expectedInheritedValues.push (_testInstance.get ('fooInherited'));

										return this.expect (['bar','BAR'],_expectedInheritedValues);
									}
								},
								{
									title:
										'If the value "inherit" is specified for the tree-inherited property, then the inherited value will be inherited from the first parent up the parent chain that has a value other than "inherit" specified for the property',
									test:function () {
										var
											_TestClass = _getTestClassWithTreeInheritedStateProperties ({
												foo:{value:'default'}
											}),
											_testInstance = _TestClass (),
											_testInstanceParent = _TestClass (),
											_testInstanceGrandparent = _TestClass ({foo:'bar'}),
											_testInstanceGreatGrandparent = _TestClass ({foo:'BAR'})
										;
										_testInstanceGreatGrandparent.addChild ('child',_testInstanceGrandparent);
										_testInstanceGrandparent.addChild ('child',_testInstanceParent);
										_testInstanceParent.addChild ('child',_testInstance);
										return this.expect ('bar',_testInstance.get ('fooInherited'));
									}
								},
								{
									title:
										'When the inherited value of a tree-inherited property changes, the new value is propagated to all the children of the instance',
									test:function () {
										var
											_TestClass = _getTestClassWithTreeInheritedStateProperties ({
												foo:{value:'default'}
											}),
											_testInstance = _TestClass (),
											_testInstanceChild1 = _TestClass (),
											_testInstanceChild2 = _TestClass (),
											_testInstanceGrandchild = _TestClass ()
										;
										_testInstance.addChild ('child1',_testInstanceChild1);
										_testInstance.addChild ('child2',_testInstanceChild2);
										_testInstanceChild1.addChild ('child',_testInstanceGrandchild);
										_testInstance.set ({foo:'bar'});
										return (
											this.expect ('bar',_testInstance.get ('fooInherited')) &&
											this.expect ('bar',_testInstanceChild1.get ('fooInherited')) &&
											this.expect ('bar',_testInstanceChild2.get ('fooInherited')) &&
											this.expect ('bar',_testInstanceGrandchild.get ('fooInherited'))
										);
									}
								},
								{
									title:
										'When the inherited value for a tree-inherited property is updated as a result of a change to the value of the tree-inherited property, it is updated as part of the same set',
									test:function () {
										var
											_actualPropertiesBeingSet,
											_TestClass = _getTestClassWithTreeInheritedStateProperties ({
												foo:{value:'default'}
											}).declare ({
												stateProperties:{
													bar:{
														derived:'foo, fooInherited: foo + fooInherited',
														onChange:function (_propertiesBeingSet) {
															_actualPropertiesBeingSet = _propertiesBeingSet;
														}
													}
												}
											}),
											_testInstance = _TestClass ({foo:'bar'})
										;
										return (
											this.expect ('bar',_actualPropertiesBeingSet.foo) &&
											this.expect ('bar',_actualPropertiesBeingSet.fooInherited) &&
											this.expect ('barbar',_actualPropertiesBeingSet.bar)
										);
									}
								},
								{
									title:
										'If the value "inherit" is specified for the tree-inherited property, and if the instance\'s parent doesn\'t support the tree-inherited property, then the inherited value for the instance will be the default value defined for the tree-inherited property',
									test:function () {
										var
											_TestClass = _getTestClassWithTreeInheritedStateProperties ({
												foo:{value:'default'}
											}),
											_ParentTestClass = _getTestClassWithTreeInheritedStateProperties (),
											_testInstance = _TestClass (),
											_testInstanceParent = _ParentTestClass ()
										;
										_testInstanceParent.addChild ('child',_testInstance);

										return this.expect ('default',_testInstance.get ('fooInherited'));
									}
								}
							]
						}
					]
				},
				{
					title:'Instance Method Tests',
					test:[
						{
							title:'INSTANCE METHOD TEST: getProvider',
							test:[
								{
									title:'The instance property getProvider is a function',
									test:function () {
										return this.expectFunction (_getTestClass () ().getProvider);
									}
								},
								{
									title:
										'When the instance has no parent and does not itself provide the specified property, then the value undefined is returned',
									test:function () {
										var
											_TestClass = _getTestClass (),
											_instance = _TestClass ()
										;
										return this.expectSameAs (undefined,_instance.getProvider ('foo'));
									}
								},
								{
									title:
										'When the instance has no parent and has the value "inherit" set for the state property, then the value undefined is returned',
									test:function () {
										var
											_TestClass = _getTestClass ().declare ({stateProperties:{foo:{}}}),
											_instance = _TestClass ({value:'inherit'})
										;
										return this.expectSameAs (undefined,_instance.getProvider ('foo'));
									}
								},
								{
									title:
										'When the instance has no parent and has the value undefined set for the state property, then the value undefined is returned',
									test:function () {
										var
											_TestClass = _getTestClass ().declare ({stateProperties:{foo:{}}}),
											_instance = _TestClass ({value:undefined})
										;
										return this.expectSameAs (undefined,_instance.getProvider ('foo'));
									}
								},
								{
									title:
										'When a value other than "inherit" or undefined is specified for the state property of the instance, then the instance is returned, even if it has a parent that also provides a value other than "inherit" or undefined for the state property',
									test:function () {
										var
											_TestClass = _getTestClass ().declare ({stateProperties:{foo:{}}}),
											_instance = _TestClass ({foo:'bar'}),
											_instanceParent = _TestClass ({foo:'baz'})
										;
										_instanceParent.addChild ('child',_instance);

										return this.expectSameAs (_instance,_instance.getProvider ('foo'));
									}
								},
								{
									title:
										'When the instance does not have the state property, or has the value "inherit" or undefined set for the state property, but some parents in the parent chain provide the property, then the first parent in the parent chain that provides a value other than "inherit" or undefined will be returned',
									test:function () {
										var
											_TestClass = _getTestClass ().declare ({stateProperties:{foo:{}}}),
											_TestClassWithProperty = _getTestClass ().declare ({stateProperties:{foo:{}}}),
											_instance1 = _getTestClass () (),
											_instance2 = _TestClass ({foo:undefined}),
											_instance3 = _TestClass ({foo:'inherit'}),
											_instancesParent = _TestClassWithProperty (),
											_instancesGrandparent = _TestClassWithProperty ({foo:'inherit'}),
											_instancesGreatGrandparent = _TestClassWithProperty ({foo:'bar'}),
											_instancesGreatGreatGrandparent = _TestClassWithProperty ({foo:'baz'})
										;
										_instancesGreatGreatGrandparent.addChild ('child',_instancesGreatGrandparent);
										_instancesGreatGrandparent.addChild ('child',_instancesGrandparent);
										_instancesGrandparent.addChild ('child',_instancesParent);
										_instancesParent.addChild ('child1',_instance1);
										_instancesParent.addChild ('child2',_instance2);
										_instancesParent.addChild ('child3',_instance3);

										return (
											this.expectSameAs (_instancesGreatGrandparent,_instance1.getProvider ('foo')) &&
											this.expectSameAs (_instancesGreatGrandparent,_instance2.getProvider ('foo')) &&
											this.expectSameAs (_instancesGreatGrandparent,_instance3.getProvider ('foo'))
										);
									}
								},
								{
									title:
										'When the instance does not have the state property, or has the value "inherit" or undefined set for the state property, and no parents in the parent chain provide the property, then the value undefined is returned',
									test:function () {
										var
											_TestClass = _getTestClass ().declare ({stateProperties:{foo:{}}}),
											_TestClassWithProperty = _getTestClass ().declare ({stateProperties:{foo:{}}}),
											_instance1 = _getTestClass () (),
											_instance2 = _TestClass ({foo:undefined}),
											_instance3 = _TestClass ({foo:'inherit'}),
											_instancesParent = _TestClassWithProperty (),
											_instancesGrandparent = _TestClassWithProperty ({foo:'inherit'}),
											_instancesGreatGrandparent = _TestClassWithProperty ({foo:undefined}),
											_instancesGreatGreatGrandparent = _TestClassWithProperty ({foo:'inherit'})
										;
										_instancesGreatGreatGrandparent.addChild ('child',_instancesGreatGrandparent);
										_instancesGreatGrandparent.addChild ('child',_instancesGrandparent);
										_instancesGrandparent.addChild ('child',_instancesParent);
										_instancesParent.addChild ('child1',_instance1);
										_instancesParent.addChild ('child2',_instance2);
										_instancesParent.addChild ('child3',_instance3);

										return (
											this.expect (undefined,_instance1.getProvider ('foo')) &&
											this.expect (undefined,_instance2.getProvider ('foo')) &&
											this.expect (undefined,_instance3.getProvider ('foo'))
										);
									}
								}
							]
						},
						{
							title:'INSTANCE METHOD TEST: getInherited',
							test:[
								{
									title:'The instance property getInherited is a function',
									test:function () {
										return this.expectFunction (_getTestClass () ().getInherited);
									}
								}
								/*

								*/
							]
						},
						{
							title:'INSTANCE METHOD TEST: setInherited',
							test:[
								{
									title:'The instance property setInherited is a function',
									test:function () {
										return this.expectFunction (_getTestClass () ().setInherited);
									}
								}
								/*

								*/
							]
						},
						{
							title:'INSTANCE METHOD TEST: callInherited',
							test:[
								{
									title:'The instance property callInherited is a function',
									test:function () {
										return this.expectFunction (_getTestClass () ().callInherited);
									}
								}
								/*

								*/
							]
						}
					]
				}
			]
		});
	}
});

