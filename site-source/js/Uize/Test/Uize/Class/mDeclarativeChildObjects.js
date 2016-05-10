/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Class.mDeclarativeChildObjects Class
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
		The =Uize.Test.Uize.Class.mDeclarativeChildObjects= module defines a suite of unit tests for the =Uize.Class.mDeclarativeChildObjects= mixin module.

		*DEVELOPERS:* `Ben Ilegbodu`, original code contributed by `Zazzle Inc.`
*/

Uize.module ({
	name:'Uize.Test.Uize.Class.mDeclarativeChildObjects',
	required:'Uize.Widget',
	builder:function () {
		'use strict';

		var
			_Uize = Uize,

			_declarativeFunctionName = 'childObjects'
		;

		function _expectAll(_children, _expectFunc) {
			for (var _childName in _children) {
				if (!_expectFunc(_children[_childName], _childName))
					return false;
			}

			return true;
		}

		function _getClass(_declarativeChildObjects, _getContainerMethod) {
			return Uize.Widget.subclass (
				Uize.copyInto(
					{
						mixins:Uize.Class.mDeclarativeChildObjects,
						declarativeChildObjects:{
							declaration:_declarativeFunctionName,
							addMethod:'addChild',
							childObjectClassKey:'objectClass'
						},
						stateProperties:{
							_propertyA:{
								name:'propertyA',
								value:14
							},
							_propertyB:{
								name:'propertyB',
								value:'hello'
							}
						}
					},
					_Uize.pairUp(
						_declarativeFunctionName,
						_declarativeChildObjects
							? Uize.map(
								_declarativeChildObjects,
								function(_childProperties) {
									if (Uize.isPlainObject(_childProperties) && _childProperties.objectClass)
										_childProperties.objectClass = Uize.getModuleByName(_childProperties.objectClass);
									else if (Uize.isString(_childProperties))
										_childProperties = Uize.getModuleByName(_childProperties);

									return _childProperties;
								}
							)
							: _declarativeChildObjects
					),
					_getContainerMethod
						? {instanceMethods:_Uize.pairUp('mDeclarativeChildObjects_' + _declarativeFunctionName + '_getContainer',_getContainerMethod)}
						: null
				)
			);
		}

		function _getDeclaredChildObjects(_declarativeChildObjects, _getContainerMethod) {
			return _getClass(_declarativeChildObjects, _getContainerMethod) ({name:'parent'}).children;
		}

		function _generateTest(_title, _declarativeChildObjects, _expectedChildObjects) {
			function _getDeclaredChildObjectsForTest() { return _getDeclaredChildObjects(_declarativeChildObjects) }
			function _expectAllDeclaredChildObjects(_expectFunc) { return _expectAll(_getDeclaredChildObjectsForTest(), _expectFunc) }

			return {
				title:_title,
				test:[
					{
						title:'Children object is not null',
						test:function() { return this.expectObject(_getDeclaredChildObjectsForTest()) }
					},
					{
						title:'Children object has the same child names as defined in declarative child objects w/ a objectClass',
						test:function() {
							var m = this;
							return _expectAllDeclaredChildObjects(function(_child, _childName) { return m.expect(true, _childName in _expectedChildObjects) });
						}
					},
					{
						title:'None of the children are null',
						test:function() {
							var m = this;
							return _expectAllDeclaredChildObjects(function(_child) { return m.expectNonNull(_child) });
						}
					},
					{
						title:'Each child should be an object',
						test:function() {
							var m = this;
							return _expectAllDeclaredChildObjects(function(_child) { return m.expectObject(_child) });
						}
					},
					{
						title:'Each child has the correct object class',
						test:function() {
							var m = this;
							return _expectAll(
								_getDeclaredChildObjectsForTest(),
								function(_child, _childName) {
									return m.expect(_expectedChildObjects[_childName].objectClass, _child.Class.moduleName);
								}
							);
						}
					},
					{
						title:'Each child has the correct initial state',
						test:function() {
							var m = this;
							return _expectAll(
								_getDeclaredChildObjectsForTest(),
								function(_child, _childName) {
									return m.expect(true, Uize.recordMatches(_child.get(), _expectedChildObjects[_childName].state));
								}
							);
						}
					}
				]
			};
		}

		return Uize.Test.resolve ({
			title:'Uize.Class.mDeclarativeChildObjects Module Test',
			test:[
				Uize.Test.requiredModulesTest ('Uize.Class.mDeclarativeChildObjects'),
				{
					title:'Empty',
					test:[
						_generateTest('When no declarative child objects are specified, no children are added to the instance'),
						_generateTest('When an empty declarative child objects is specified, no children are added to the instance', {})
					]
				},
				{
					title:'Verbose Syntax',
					test:[
						_generateTest(
							'When a single declarative child objects is specified, only one child is added to the instance with appopriate state properties',
							{
								foo:{
									objectClass:'Uize.Widget',
									enabled:false,
									busy:true,
									container:'shell'
								}
							},
							{
								foo:{
									objectClass:'Uize.Widget',
									state:{
										enabled:false,
										busy:true,
										container:'shell'
									}
								}
							}
						),
						_generateTest(
							'When multiple declarative child objects are specified, an equal number of children are added added to the instance, each with their appopriate state properties',
							{
								foo:{
									objectClass:'Uize.Widget',
									enabled:false,
									busy:true,
									container:'shell'
								},
								bar:{
									objectClass:'Uize.Widget',
									propretyA:1,
									propertyB:'valueB'
								},
								lorem:{
									objectClass:'Uize.Widget',
									foo:2
								}
							},
							{
								foo:{
									objectClass:'Uize.Widget',
									state:{
										enabled:false,
										busy:true,
										container:'shell'
									}
								},
								bar:{
									objectClass:'Uize.Widget',
									state:{
										propretyA:1,
										propertyB:'valueB'
									}
								},
								lorem:{
									objectClass:'Uize.Widget',
									state:{
										foo:2
									}
								}
							}
						),
						_generateTest(
							'When a declared child omits its objectClass, it does not get added to the instance',
							{
								ipsum:{
									enabled:false,
									busy:true,
									container:'shell'
								},
								dolor:{
									objectClass:'Uize.Widget',
									value:'foo'
								},
								sit:{
									objectClass:'Uize.Widget',
									foo:2
								},
								blah:{}
							},
							{
								dolor:{
									objectClass:'Uize.Widget',
									state:{
										value:'foo'
									}
								},
								sit:{
									objectClass:'Uize.Widget',
									state:{
										foo:2
									}
								}
							}
						),
						_generateTest(
							'When a declared child has a falsy value for objectClass, it does not getting added to the instance',
							{
								foo:{
									objectClass:''
								},
								bar:{
									objectClass:null
								},
								bat:{
									objectClass:undefined
								},
								baz:{
									objectClass:0
								},
								lorem:{
									objectClass:false
								},
								ipsum:{
									objectClass:NaN
								}
							},
							{

							}
						)
					]
				},
				{
					title:'Shorthand Syntax',
					test:[
						_generateTest(
							'When a single declarative child objects is specified, only one child is added to the instance with appopriate state properties',
							{
								foo:'Uize.Widget'
							},
							{
								foo:{
									objectClass:'Uize.Widget'
								}
							}
						),
						_generateTest(
							'When multiple declarative child objects are specified, an equal number of children are added added to the instance, each with their appopriate state properties',
							{
								foo:'Uize.Widget',
								bar:'Uize.Widget',
								lorem:'Uize.Widget'
							},
							{
								foo:{
									objectClass:'Uize.Widget'
								},
								bar:{
									objectClass:'Uize.Widget'
								},
								lorem:{
									objectClass:'Uize.Widget'
								}
							}
						),
						_generateTest(
							'When a declared child omits its objectClass, it does not get added to the instance',
							{
								ipsum:'',
								dolor:'Uize.Widget',
								sit:'Uize.Widget'
							},
							{
								dolor:{
									objectClass:'Uize.Widget'
								},
								sit:{
									objectClass:'Uize.Widget'
								}
							}
						),
						_generateTest(
							'When a falsy value is specified for objectClass of a declared child, it does not get added to the instance',
							{
								foo:'',
								bar:null,
								bat:undefined,
								baz:0,
								lorem:false,
								ipsum:NaN
							},
							{

							}
						)
					]
				},
				{
					title:'Function Syntax',
					test:[
						{
							title:'Function context is parent instance',
							test:function() {
								var
									m = this,
									_returnValue = false
								;

								_getDeclaredChildObjects({
									childA:function() {
										_returnValue = m.expect('parent', this.get('name'));
										return {};
									}
								});

								return _returnValue;
							}
						},
						{
							title:'Function\'s first parameter value is the child name',
							test:function() {
								var
									m = this,
									_returnValue = false
								;

								_getDeclaredChildObjects({
									childA:function(_childName) {
										_returnValue = m.expect('childA', _childName);
										return {};
									}
								});

								return _returnValue;
							}
						},
						_generateTest(
							'When a single declarative child objects is specified (verbose synax), only one child is added to the instance with appopriate state properties',
							{
								childA:function(_childName) {
									return {
										objectClass:Uize.Widget,
										propertyA:_childName,
										propertyB:this._propertyB,
										propertyC:Math.sqrt(16)
									};
								}
							},
							{
								childA:{
									objectClass:'Uize.Widget',
									state:{
										propertyA:'childA',
										propertyB:'hello',
										propertyC:4
									}
								}
							}
						),
						_generateTest(
							'When multiple declarative child objects are specified, an equal number of children are added added to the instance, each with their appopriate state properties',
							{
								foo:function() {
									return {
										objectClass:Uize.Widget,
										enabled:false,
										busy:true,
										container:'shell'
									};
								},
								bar:function() {
									return {
										objectClass:Uize.Widget
									};
								},
								lorem:function() {
									return {
										objectClass:Uize.Widget,
										foo:2
									};
								}
							},
							{
								foo:{
									objectClass:'Uize.Widget',
									state:{
										enabled:false,
										busy:true,
										container:'shell'
									}
								},
								bar:{
									objectClass:'Uize.Widget'
								},
								lorem:{
									objectClass:'Uize.Widget',
									state:{
										foo:2
									}
								}
							}
						),
						_generateTest(
							'When a declared child omits its objectClass, it does not get added to the instance',
							{
								ipsum:function() {
									return {
										enabled:false,
										busy:true,
										container:'shell'
									};
								},
								dolor:function() {
									return {
										objectClass:Uize.Widget,
										value:'foo'
									};
								},
								sit:function() {
									return {
										objectClass:Uize.Widget
									};
								},
								blah:function() { return {} }
							},
							{
								dolor:{
									objectClass:'Uize.Widget',
									state:{
										value:'foo'
									}
								},
								sit:{
									objectClass:'Uize.Widget'
								}
							}
						),
						_generateTest(
							'When a declared child has a falsy value for objectClass, it does not getting added to the instance',
							{
								foo:function() {
									return {
										objectClass:''
									};
								},
								bar:function() {
									return {
										objectClass:null
									};
								},
								bat:function() {
									return {
										objectClass:undefined
									};
								},
								baz:function() {
									return {
										objectClass:0
									};
								},
								lorem:function() {
									return {
										objectClass:false
									};
								},
								ipsum:function() {
									return {
										objectClass:NaN
									};
								}
							},
							{}
						)
					]
				},
				{
					title:'A Subclass can override the getContainer method',
					test:function() {
						var _returnValue = false;

						_getDeclaredChildObjects(
							{childA:'Uize.Widget'},
							function() {
								_returnValue = true;
								return this;
							}
						);

						return _returnValue;
					}
				}
			]
		});
	}
});
