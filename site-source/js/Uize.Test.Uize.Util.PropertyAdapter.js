/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Util.PropertyAdapter Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2011-2013 UIZE
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
		The =Uize.Test.Uize.Util.PropertyAdapter= module defines a suite of unit tests for the =Uize.Util.PropertyAdapter= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Util.PropertyAdapter',
	required:'Uize.Class',
	builder:function () {
		'use strict';

		var _DummyClass = Uize.Class.subclass ();

		function _getRig (_extraAdapterProperties) {
			var
				_instanceA = new _DummyClass ({energy:'solar'}),
				_instanceB = new _DummyClass ({energy:'wind'})
			;
			return {
				_instanceA:_instanceA,
				_instanceB:_instanceB,
				_propertyAdapter:Uize.Util.PropertyAdapter (
					Uize.copyInto (
						{
							propertyA:{instance:_instanceA,property:'energy'},
							propertyB:{instance:_instanceB,property:'energy'}
						},
						_extraAdapterProperties
					)
				)
			};
		}

		function _getRigWithValueAdapter () {
			var
				_instanceA = new _DummyClass ({normal:2}),
				_instanceB = new _DummyClass ({scaled:4})
			;
			return {
				_instanceA:_instanceA,
				_instanceB:_instanceB,
				_propertyAdapter:Uize.Util.PropertyAdapter ({
					propertyA:{instance:_instanceA,property:'normal'},
					propertyB:{instance:_instanceB,property:'scaled'},
					valueAdapter:{
						aToB:function (_value) {return _value * 2},
						bToA:function (_value) {return _value / 2}
					}
				})
			};
		}

		function _propertyAorBConformerTest (_whichProperty) {
			var _propertyName = 'property' + _whichProperty;
			function _conformerTestCase (_title,_value,_expectedConformedValue) {
				return {
					title:_title,
					test:function () {
						var _propertyAdapter = Uize.Util.PropertyAdapter ();
						_propertyAdapter.set (_propertyName,_value);
						return this.expect (_expectedConformedValue,_propertyAdapter.get (_propertyName));
					}
				};
			}
			var _someDummyInstance = Uize.Class ();
			return {
				title:'Test that the conformer for ' + _propertyName + ' works correctly',
				test:[
					_conformerTestCase (
						'Test that specifying simply an instance is resolved to an object where the instance property for the object is set to the specified instance, and the property property is set to "value"',
						_someDummyInstance,
						{instance:_someDummyInstance,property:'value'}
					),
					{
						title:'Test that an array value is conformed correctly, where the first element specifies the instance and the second element specifies the property',
						test:[
							_conformerTestCase (
								'Test that specifying an array is resolved to an object where the instance is the first element from the array, and the property is the second element from the array',
								[_someDummyInstance,'foo'],
								{instance:_someDummyInstance,property:'foo'}
							),
							_conformerTestCase (
								'Test the specifying the value null for the second element results in the property being defaulted to the "value" property',
								[_someDummyInstance,null],
								{instance:_someDummyInstance,property:'value'}
							),
							_conformerTestCase (
								'Test the specifying the value undefined for the second element results in the property being defaulted to the "value" property',
								[_someDummyInstance,undefined],
								{instance:_someDummyInstance,property:'value'}
							),
							_conformerTestCase (
								'Test that not specifying a second element results in the property being defaulted to the "value" property',
								[_someDummyInstance],
								{instance:_someDummyInstance,property:'value'}
							)
						]
					},
					{
						title:'Test that an object value is conformed correctly, where the property property is defaulted to "value" if it is null, undefined, or omitted',
						test:[
							_conformerTestCase (
								'Test the specifying the value null for the property results in the property being defaulted to "value"',
								{instance:_someDummyInstance,property:null},
								{instance:_someDummyInstance,property:'value'}
							),
							_conformerTestCase (
								'Test the specifying the value undefined for the property results in the property being defaulted to "value"',
								{instance:_someDummyInstance,property:undefined},
								{instance:_someDummyInstance,property:'value'}
							),
							_conformerTestCase (
								'Test that not specifying the property results in it being defaulted to "value"',
								{instance:_someDummyInstance},
								{instance:_someDummyInstance,property:'value'}
							)
						]
					},
					{
						title:'Test that null or undefined is conformed correctly (ie. left as is)',
						test:[
							_conformerTestCase (
								'Test the specifying the value null for the value adapter results in it remaining null',
								null,
								null
							),
							_conformerTestCase (
								'Test the specifying the value undefined for the value adapter results in it remaining null',
								undefined,
								undefined
							)
						]
					}
				]
			};
		}

		return Uize.Test.declare ({
			title:'Test for Uize.Util.PropertyAdapter Module',
			test:[
				Uize.Test.requiredModulesTest ('Uize.Util.PropertyAdapter'),
				{
					title:'Test that an instance of the class can be successfully created',
					test:function () {
						return this.expectInstanceOf (Uize.Util.PropertyAdapter,Uize.Util.PropertyAdapter ());
					}
				},
				{
					title:'Test that connecting a property adapter between two properties of different objects immediately synchronizes property B to property A',
					test:function () {
						var _rig = _getRig ();
						return this.expect ('solar',_rig._instanceB.get ('energy'));
					}
				},
				{
					title:'Test basic synchronization (without a value adapter) in both directions',
					test:[
						{
							title:'Test that a property adapter correctly synchronizes from property A to property B',
							test:function () {
								var _rig = _getRig ();
								_rig._instanceA.set ({energy:'geothermal'});
								return this.expect ('geothermal',_rig._instanceB.get ('energy'));
							}
						},
						{
							title:'Test that a property adapter correctly synchronizes from property B to property A',
							test:function () {
								var _rig = _getRig ();
								_rig._instanceB.set ({energy:'geothermal'});
								return this.expect ('geothermal',_rig._instanceA.get ('energy'));
							}
						}
					]
				},
				{
					title:'Test that synchronization with a value adapter works in both directions',
					test:[
						{
							title:'Test that a value adapter is applied correctly when synchronizing from propertyA to propertyB',
							test:function () {
								var _rig = _getRigWithValueAdapter ();
								_rig._instanceA.set ({normal:2.5});
								return this.expect (5,_rig._instanceB.get ('scaled'));
							}
						},
						{
							title:'Test that a value adapter is applied correctly when synchronizing from propertyB to propertyA',
							test:function () {
								var _rig = _getRigWithValueAdapter ();
								_rig._instanceB.set ({scaled:5});
								return this.expect (2.5,_rig._instanceA.get ('normal'));
							}
						}
					]
				},
				{
					title:'Test that changing the value adapter after properties have already been connected is handled correctly',
					test:[
						{
							title:'Test that changing a value adapter mid-stream results in propertyB being immediately re-synchronized to propertyA using the new value adapter, with correct synchronization in both directions thereafter',
							test:function () {
								var _rig = _getRigWithValueAdapter ();
								_rig._propertyAdapter.set ({
									valueAdapter:{
										aToB:function (_value) {return _value * 3},
										bToA:function (_value) {return _value / 3}
									}
								});

								var _propertyBAfterChangingValueAdapter = _rig._instanceB.get ('scaled');
								_rig._instanceA.set ({normal:5});
								var _propertyBAfterSettingPropertyA = _rig._instanceB.get ('scaled');
								_rig._instanceB.set ({scaled:30});
								var _propertyAAfterSettingPropertyB = _rig._instanceA.get ('normal');

								return (
									this.expect (6,_propertyBAfterChangingValueAdapter) &&
									this.expect (15,_propertyBAfterSettingPropertyA) &&
									this.expect (10,_propertyAAfterSettingPropertyB)
								);
							}
						},
						{
							title:'Test that nulling out a value adapter mid-stream results in propertyB being immediately re-synchronized to propertyA without any value adapter translation, with correct synchronization in both directions thereafter',
							test:function () {
								var _rig = _getRigWithValueAdapter ();
								_rig._propertyAdapter.set ({valueAdapter:null});

								var _propertyBAfterChangingValueAdapter = _rig._instanceB.get ('scaled');
								_rig._instanceA.set ({normal:5});
								var _propertyBAfterSettingPropertyA = _rig._instanceB.get ('scaled');
								_rig._instanceB.set ({scaled:30});
								var _propertyAAfterSettingPropertyB = _rig._instanceA.get ('normal');

								return (
									this.expect (2,_propertyBAfterChangingValueAdapter) &&
									this.expect (5,_propertyBAfterSettingPropertyA) &&
									this.expect (30,_propertyAAfterSettingPropertyB)
								);
							}
						}
					]
				},
				{
					title:'Test that the connected state property is observed correctly',
					test:[
						{
							title:'Test that connecting a property adapter between two properties of different objects with the adapter not initially connected results in property B *not* being immediately synchronized to property A',
							test:function () {
								var _rig = _getRig ({connected:false});
								return this.expect ('wind',_rig._instanceB.get ('energy'));
							}
						},
						{
							title:'Test that disconnecting a property adapter by setting its connected state property to false results in properties no longer being synchronized',
							test:function () {
								var _rig = _getRig ();

								_rig._propertyAdapter.set ({connected:false});

								_rig._instanceA.set ({energy:'geothermal'});
								var _propertyBAfterSettingPropertyA = _rig._instanceB.get ('energy');

								_rig._instanceB.set ({energy:'tidal'});
								var _propertyAAfterSettingPropertyB = _rig._instanceA.get ('energy');

								return (
									this.expect ('solar',_propertyBAfterSettingPropertyA) &&
									this.expect ('geothermal',_propertyAAfterSettingPropertyB)
								);
							}
						},
						{
							title:'Test that disconnecting and then reconnecting a property adapter results in properties once again being synchronized correctly',
							test:function () {
								var _rig = _getRig ();

								_rig._propertyAdapter.set ({connected:false});
								_rig._propertyAdapter.set ({connected:true});

								_rig._instanceA.set ({energy:'geothermal'});
								var _propertyBAfterSettingPropertyA = _rig._instanceB.get ('energy');

								_rig._instanceB.set ({energy:'tidal'});
								var _propertyAAfterSettingPropertyB = _rig._instanceA.get ('energy');

								return (
									this.expect ('geothermal',_propertyBAfterSettingPropertyA) &&
									this.expect ('tidal',_propertyAAfterSettingPropertyB)
								);
							}
						}
					]
				},
				{
					title:'Test that the conformer for the propertyA and propertyB state properties works correctly',
					test:[
						_propertyAorBConformerTest ('A'),
						_propertyAorBConformerTest ('B')
					]
				},
				{
					title:'Test that changing either propertyA or propertyB mid-stream is handled correctly',
					test:[
						{
							title:'Test that when changing propertyA, propertyB is immediately re-synchronized to the new property for propertyA',
							test:function () {
								var _rig = _getRig ();

								_rig._propertyAdapter.set ({
									propertyA:{instance:new _DummyClass ({energy:'biofuel'}),property:'energy'}
								});

								return this.expect ('biofuel',_rig._instanceB.get ('energy'));
							}
						},
						{
							title:'Test that when changing propertyB, propertyB is immediately synchronized to the property for propertyA',
							test:function () {
								var
									_rig = _getRig (),
									_newInstanceB = new _DummyClass ({energy:'geothermal'})
								;
								_rig._propertyAdapter.set ({propertyB:{instance:_newInstanceB,property:'energy'}});

								return this.expect ('solar',_newInstanceB.get ('energy'));
							}
						},
						{
							title:'Test that when changing propertyA, the old property for propertyA is no longer synchronized when the property for propertyB is modified',
							test:function () {
								var _rig = _getRig ();

								_rig._propertyAdapter.set ({
									propertyA:{instance:new _DummyClass ({energy:'geothermal'}),property:'energy'}
								});
								_rig._instanceB.set ({energy:'tidal'});

								return this.expect ('solar',_rig._instanceA.get ('energy'));
							}
						},
						{
							title:'Test that after changing propertyA, modifying the value of the old property for propertyA no longer has an affect on the property for propertyB',
							test:function () {
								var _rig = _getRig ();

								_rig._propertyAdapter.set ({
									propertyA:{instance:new _DummyClass ({energy:'geothermal'}),property:'energy'}
								});
								_rig._instanceA.set ({energy:'tidal'});

								return this.expect ('geothermal',_rig._instanceB.get ('energy'));
							}
						},
						{
							title:'Test that when changing propertyB, the old property for propertyB is no longer synchronized when the property for propertyA is modified',
							test:function () {
								var
									_rig = _getRig (),
									_newInstanceB = new _DummyClass ({energy:'geothermal'})
								;
								_rig._propertyAdapter.set ({propertyB:{instance:_newInstanceB,property:'energy'}});
								_rig._instanceA.set ({energy:'tidal'});
								return this.expect ('solar',_rig._instanceB.get ('energy'));
							}
						},
						{
							title:'Test that after changing propertyB, modifying the value of the old property for propertyB no longer has an affect on the property for propertyA',
							test:function () {
								var _rig = _getRig ();

								_rig._propertyAdapter.set ({
									propertyB:{instance:new _DummyClass ({energy:'geothermal'}),property:'energy'}
								});
								_rig._instanceB.set ({energy:'tidal'});

								return this.expect ('solar',_rig._instanceA.get ('energy'));
							}
						}
					]
				},
				{
					title:'Test that nulling out either or both of propertyA and propertyB, after properties have already been connected, is handled correctly',
					test:[
						{
							title:'Test that changing propertyA to null after a property adapter has already been connected is handled correctly',
							test:function () {
								var _rig = _getRig ();

								_rig._propertyAdapter.set ({propertyA:null});
								var _propertyBAfterNullingPropertyA = _rig._instanceB.get ('energy');

								_rig._instanceA.set ({energy:'geothermal'});
								var _propertyBAfterSettingOldPropertyA = _rig._instanceB.get ('energy');

								_rig._instanceB.set ({energy:'tidal'});
								var _oldPropertyAAfterSettingPropertyB = _rig._instanceA.get ('energy');

								return (
									this.expect ('solar',_propertyBAfterNullingPropertyA) &&
									this.expect ('solar',_propertyBAfterSettingOldPropertyA) &&
									this.expect ('geothermal',_oldPropertyAAfterSettingPropertyB)
								);
							}
						},
						{
							title:'Test that changing propertyB to null after a property adapter has already been connected is handled correctly',
							test:function () {
								var _rig = _getRig ();

								_rig._propertyAdapter.set ({propertyB:null});
								var _oldPropertyBAfterNullingPropertyB = _rig._instanceB.get ('energy');

								_rig._instanceB.set ({energy:'geothermal'});
								var _propertyAAfterSettingOldPropertyB = _rig._instanceA.get ('energy');

								_rig._instanceA.set ({energy:'tidal'});
								var _oldPropertyBAfterSettingPropertyA = _rig._instanceB.get ('energy');

								return (
									this.expect ('solar',_oldPropertyBAfterNullingPropertyB) &&
									this.expect ('solar',_propertyAAfterSettingOldPropertyB) &&
									this.expect ('geothermal',_oldPropertyBAfterSettingPropertyA)
								);
							}
						},
						{
							title:'Test that changing propertyA and propertyB to null after a property adapter has already been connected is handled correctly',
							test:function () {
								var _rig = _getRig ();

								_rig._propertyAdapter.set ({propertyA:null,propertyB:null});
								var
									_oldPropertyAAfterNullingPropertyB = _rig._instanceA.get ('energy'),
									_oldPropertyBAfterNullingPropertyA = _rig._instanceA.get ('energy')
								;

								_rig._instanceA.set ({energy:'geothermal'});
								var _oldPropertyBAfterSettingOldPropertyA = _rig._instanceB.get ('energy');

								_rig._instanceB.set ({energy:'tidal'});
								var _oldPropertyAAfterSettingOldPropertyB = _rig._instanceA.get ('energy');

								return (
									this.expect ('solar',_oldPropertyAAfterNullingPropertyB) &&
									this.expect ('solar',_oldPropertyBAfterNullingPropertyA) &&
									this.expect ('solar',_oldPropertyBAfterSettingOldPropertyA) &&
									this.expect ('geothermal',_oldPropertyAAfterSettingOldPropertyB)
								);
							}
						}
					]
				},
				{
					title:'Test that the infinite loop prevention mechanism works correctly',
					test:[
						{
							title:'Test that the infinite loop prevention mechanism does not prevent two properties of the same instance from being connected successfully by an adapter',
							test:function () {
								var
									_instance = new _DummyClass ({prop1:'foo',prop2:'bar'}),
									_propertyAdapter = Uize.Util.PropertyAdapter ({
										propertyA:{instance:_instance,property:'prop1'},
										propertyB:{instance:_instance,property:'prop2'}
									}),
									_propertyBAfterAdapterConnected = _instance.get ('prop2')
								;

								_instance.set ({prop1:'doo'});
								var _propertyBAfterSettingPropertyA = _instance.get ('prop2');

								_instance.set ({prop2:'goo'});
								var _propertyAAfterSettingPropertyB = _instance.get ('prop1');

								return (
									this.expect ('foo',_propertyBAfterAdapterConnected) &&
									this.expect ('doo',_propertyBAfterSettingPropertyA) &&
									this.expect ('goo',_propertyAAfterSettingPropertyB)
								);
							}
						},
						{
							title:'Test that the infinite loop prevention mechanism does not prevent three properties of the same instance from being connected successfully by two adapters',
							test:function () {
								var
									_instance = new _DummyClass ({prop1:'foo',prop2:'bar',prop3:'ha'}),
									_propertyAdapter1 = Uize.Util.PropertyAdapter ({
										propertyA:{instance:_instance,property:'prop1'},
										propertyB:{instance:_instance,property:'prop2'}
									}),
									_propertyAdapter2 = Uize.Util.PropertyAdapter ({
										propertyA:{instance:_instance,property:'prop2'},
										propertyB:{instance:_instance,property:'prop3'}
									}),
									_prop2AfterAdapterConnected = _instance.get ('prop2'),
									_prop3AfterAdapterConnected = _instance.get ('prop3')
								;

								_instance.set ({prop1:'doo'});
								var
									_prop2AfterSettingProp1 = _instance.get ('prop2'),
									_prop3AfterSettingProp1 = _instance.get ('prop3')
								;

								_instance.set ({prop2:'hoo'});
								var
									_prop1AfterSettingProp2 = _instance.get ('prop1'),
									_prop3AfterSettingProp2 = _instance.get ('prop3')
								;

								_instance.set ({prop3:'hoo'});
								var
									_prop1AfterSettingProp3 = _instance.get ('prop1'),
									_prop2AfterSettingProp3 = _instance.get ('prop2')
								;

								return (
									this.expect ('foo',_prop2AfterAdapterConnected) &&
									this.expect ('foo',_prop3AfterAdapterConnected) &&
									this.expect ('doo',_prop2AfterSettingProp1) &&
									this.expect ('doo',_prop3AfterSettingProp1) &&
									this.expect ('hoo',_prop1AfterSettingProp2) &&
									this.expect ('hoo',_prop3AfterSettingProp2) &&
									this.expect ('hoo',_prop1AfterSettingProp3) &&
									this.expect ('hoo',_prop2AfterSettingProp3)
								);
							}
						},
						{
							title:'Test that an infinite loop is prevented when two properties combined in a property adapter are guaranteed to never be able to ever settle their values, because of a divergent value adapter',
							test:function () {
								var _DummyClass = Uize.Class.subclass ();
								_DummyClass.stateProperties ({
									_property1:'property1',
									_property2:'property2'
								});

								var
									_instance = new _DummyClass,
									_propertyAdapter = Uize.Util.PropertyAdapter ({
										propertyA:{instance:_instance,property:'property1'},
										propertyB:{instance:_instance,property:'property2'},
										valueAdapter:{
											aToB:function (_value) {return _value * 2},
											bToA:function (_value) {return _value * 2}
										}
									})
								;
								_instance.set ({property1:1});

								return true;
							}
						},
						{
							title:'Test that an infinite loop is prevented when two properties combined in a property adapter are guaranteed to never be able to ever settle their values, based upon the definition of those properties',
							test:function () {
								var _CrazyClass = Uize.Class.subclass ();
								_CrazyClass.stateProperties ({
									_property1:{
										name:'property1',
										conformer:function (_value) {return _value + 1},
										value:1
									},
									_property2:{
										name:'property2',
										conformer:function (_value) {return _value + 1},
										value:1
									}
								});

								var
									_instance = new _CrazyClass,
									_propertyAdapter = Uize.Util.PropertyAdapter ({
										propertyA:{instance:_instance,property:'property1'},
										propertyB:{instance:_instance,property:'property2'}
									})
								;
								_instance.set ({property1:10});

								return true;
							}
						}
					]
				}
			]
		});
	}
});

