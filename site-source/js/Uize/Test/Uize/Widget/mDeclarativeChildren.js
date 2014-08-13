/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Widget.mDeclarativeChildren Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014 UIZE
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
		The =Uize.Test.Uize.Widget.mDeclarativeChildren= module defines a suite of unit tests for the =Uize.Widget.mDeclarativeChildren= mixin module.

		*DEVELOPERS:* `Ben Ilegbodu`, original code contributed by `Zazzle Inc.`
*/

Uize.module ({
	name:'Uize.Test.Uize.Widget.mDeclarativeChildren',
	builder:function () {
		'use strict';

		function _expectAll(_children, _expectFunc) {
			for (var _childName in _children) {
				if (!_expectFunc(_children[_childName], _childName))
					return false;
			}

			return true;
		}
		
		function _getWidgetClass(_declarativeChildren, _getContainerMethod) {
			return Uize.Widget.subclass (
				Uize.copyInto(
					{
						mixins:Uize.Widget.mDeclarativeChildren,
						children:_declarativeChildren
							? Uize.map(
								_declarativeChildren,
								function(_childProperties) {
									if (Uize.isPlainObject(_childProperties) && _childProperties.widgetClass)
										_childProperties.widgetClass = Uize.getModuleByName(_childProperties.widgetClass);
									else if (Uize.isString(_childProperties))
										_childProperties = Uize.getModuleByName(_childProperties);

									return _childProperties;
								}
							)
							: _declarativeChildren,
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
					_getContainerMethod
						? {instanceMethods:{mDeclarativeChildren_getContainer:_getContainerMethod}}
						: null
				)
			);
		}

		function _getDeclaredChildren(_declarativeChildren, _getContainerMethod) {
			return _getWidgetClass(_declarativeChildren, _getContainerMethod) ({name:'parent'}).children;
		}

		function _generateTest(_title, _declarativeChildren, _expectedChildren) {
			function _getDeclaredChildrenForTest() { return _getDeclaredChildren(_declarativeChildren) }
			function _expectAllDeclaredChildren(_expectFunc) { return _expectAll(_getDeclaredChildrenForTest(), _expectFunc) }

			return {
				title:_title,
				test:[
					{
						title:'Children object is not null',
						test:function() { return this.expectObject(_getDeclaredChildrenForTest()) }
					},
					{
						title:'Children object has the same child names as defined in declarative children w/ a widgetClass',
						test:function() {
							var m = this;
							return _expectAllDeclaredChildren(function(_child, _childName) { return m.expect(true, _childName in _expectedChildren) });
						}
					},
					{
						title:'None of the children are null',
						test:function() {
							var m = this;
							return _expectAllDeclaredChildren(function(_child) { return m.expectNonNull(_child) });
						}
					},
					{
						title:'Each child should be an object',
						test:function() {
							var m = this;
							return _expectAllDeclaredChildren(function(_child) { return m.expectObject(_child) });
						}
					},
					{
						title:'Each child has the correct widget class',
						test:function() {
							var m = this;
							return _expectAll(
								_getDeclaredChildrenForTest(),
								function(_child, _childName) {
									return m.expect(_expectedChildren[_childName].widgetClass, _child.Class.moduleName);
								}
							);
						}
					},
					{
						title:'Each child has the correct initial state',
						test:function() {
							var m = this;
							return _expectAll(
								_getDeclaredChildrenForTest(),
								function(_child, _childName) {
									return m.expect(true, Uize.recordMatches(_child.get(), _expectedChildren[_childName].state));
								}
							);
						}
					}
				]
			};
		}

		return Uize.Test.resolve ({
			title:'Uize.Widget.mDeclarativeChildren Module Test',
			test:[
				Uize.Test.requiredModulesTest ([
					'Uize.Widget',
					'Uize.Widget.mDeclarativeChildren'
				]),
				{
					title:'Empty',
					test:[
						_generateTest('When no declarative children are specified, no children are added to the widget'),
						_generateTest('When an empty declarative children is specified, no children are added to the widget', {})
					]
				},
				{
					title:'Verbose Syntax',
					test:[
						_generateTest(
							'When a single declarative children is specified, only one child is added to the widget with appopriate state properties',
							{
								foo:{
									widgetClass:'Uize.Widget',
									enabled:false,
									busy:true,
									container:'shell'
								}
							},
							{
								foo:{
									widgetClass:'Uize.Widget',
									state:{
										enabled:false,
										busy:true,
										container:'shell'
									}
								}
							}
						),
						_generateTest(
							'When multiple declarative children are specified, an equal number of children are added added to the widget, each with their appopriate state properties',
							{
								foo:{
									widgetClass:'Uize.Widget',
									enabled:false,
									busy:true,
									container:'shell'
								},
								bar:{
									widgetClass:'Uize.Widget',
									propretyA:1,
									propertyB:'valueB'
								},
								lorem:{
									widgetClass:'Uize.Widget',
									foo:2
								}
							},
							{
								foo:{
									widgetClass:'Uize.Widget',
									state:{
										enabled:false,
										busy:true,
										container:'shell'
									}
								},
								bar:{
									widgetClass:'Uize.Widget',
									state:{
										propretyA:1,
										propertyB:'valueB'
									}
								},
								lorem:{
									widgetClass:'Uize.Widget',
									state:{
										foo:2
									}
								}
							}
						),
						_generateTest(
							'When a declared child omits its widgetClass, it does not get added to the widget',
							{
								ipsum:{
									enabled:false,
									busy:true,
									container:'shell'
								},
								dolor:{
									widgetClass:'Uize.Widget',
									value:'foo'
								},
								sit:{
									widgetClass:'Uize.Widget',
									foo:2
								},
								blah:{}
							},
							{
								dolor:{
									widgetClass:'Uize.Widget',
									state:{
										value:'foo'
									}
								},
								sit:{
									widgetClass:'Uize.Widget',
									state:{
										foo:2
									}
								}
							}
						),
						_generateTest(
							'When a declared child has a falsy value for widgetClass, it does not getting added to the widget',
							{
								foo:{
									widgetClass:''
								},
								bar:{
									widgetClass:null
								},
								bat:{
									widgetClass:undefined
								},
								baz:{
									widgetClass:0
								},
								lorem:{
									widgetClass:false
								},
								ipsum:{
									widgetClass:NaN
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
							'When a single declarative children is specified, only one child is added to the widget with appopriate state properties',
							{
								foo:'Uize.Widget'
							},
							{
								foo:{
									widgetClass:'Uize.Widget'
								}
							}
						),
						_generateTest(
							'When multiple declarative children are specified, an equal number of children are added added to the widget, each with their appopriate state properties',
							{
								foo:'Uize.Widget',
								bar:'Uize.Widget',
								lorem:'Uize.Widget'
							},
							{
								foo:{
									widgetClass:'Uize.Widget'
								},
								bar:{
									widgetClass:'Uize.Widget'
								},
								lorem:{
									widgetClass:'Uize.Widget'
								}
							}
						),
						_generateTest(
							'When a declared child omits its widgetClass, it does not get added to the widget',
							{
								ipsum:'',
								dolor:'Uize.Widget',
								sit:'Uize.Widget'
							},
							{
								dolor:{
									widgetClass:'Uize.Widget'
								},
								sit:{
									widgetClass:'Uize.Widget'
								}
							}
						),
						_generateTest(
							'When a falsy value is specified for widgetClass of a declared child, it does not get added to the widget',
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
							title:'Function context is parent widget',
							test:function() {
								var
									m = this,
									_returnValue = false
								;

								_getDeclaredChildren({
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

								_getDeclaredChildren({
									childA:function(_childName) {
										_returnValue = m.expect('childA', _childName);
										return {};
									}
								});

								return _returnValue;
							}
						},
						_generateTest(
							'When a single declarative children is specified (verbose synax), only one child is added to the widget with appopriate state properties',
							{
								childA:function(_childName) {
									return {
										widgetClass:Uize.Widget,
										propertyA:_childName,
										propertyB:this._propertyB,
										propertyC:Math.sqrt(16)
									};
								}
							},
							{
								childA:{
									widgetClass:'Uize.Widget',
									state:{
										propertyA:'childA',
										propertyB:'hello',
										propertyC:4
									}
								}
							}
						),
						_generateTest(
							'When multiple declarative children are specified, an equal number of children are added added to the widget, each with their appopriate state properties',
							{
								foo:function() {
									return {
										widgetClass:Uize.Widget,
										enabled:false,
										busy:true,
										container:'shell'
									};
								},
								bar:function() {
									return {
										widgetClass:Uize.Widget
									};
								},
								lorem:function() {
									return {
										widgetClass:Uize.Widget,
										foo:2
									};
								}
							},
							{
								foo:{
									widgetClass:'Uize.Widget',
									state:{
										enabled:false,
										busy:true,
										container:'shell'
									}
								},
								bar:{
									widgetClass:'Uize.Widget'
								},
								lorem:{
									widgetClass:'Uize.Widget',
									state:{
										foo:2
									}
								}
							}
						),
						_generateTest(
							'When a declared child omits its widgetClass, it does not get added to the widget',
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
										widgetClass:Uize.Widget,
										value:'foo'
									};
								},
								sit:function() {
									return {
										widgetClass:Uize.Widget
									};
								},
								blah:function() { return {} }
							},
							{
								dolor:{
									widgetClass:'Uize.Widget',
									state:{
										value:'foo'
									}
								},
								sit:{
									widgetClass:'Uize.Widget'
								}
							}
						),
						_generateTest(
							'When a declared child has a falsy value for widgetClass, it does not getting added to the widget',
							{
								foo:function() {
									return {
										widgetClass:''
									};
								},
								bar:function() {
									return {
										widgetClass:null
									};
								},
								bat:function() {
									return {
										widgetClass:undefined
									};
								},
								baz:function() {
									return {
										widgetClass:0
									};
								},
								lorem:function() {
									return {
										widgetClass:false
									}
								},
								ipsum:function() {
									return {
										widgetClass:NaN
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

						_getDeclaredChildren(
							{childA:'Uize.Widget'},
							function() {
								_returnValue = true;
								return this;
							}
						);

						return _returnValue
					}
				}
			]
		});
	}
});
