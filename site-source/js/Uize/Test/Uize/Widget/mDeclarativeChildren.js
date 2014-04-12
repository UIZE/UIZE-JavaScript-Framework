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
	codeCompleteness: 5
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Test.Uize.Widget.mDeclarativeChildren= module defines a suite of unit tests for the =Uize.Widget.mDeclarativeChildren= mixin module.

		*DEVELOPERS:* `Ben Ilegbodu`, original code donated by `Zazzle Inc.`
*/

Uize.module ({
	name:'Uize.Test.Uize.Widget.mDeclarativeChildren',
	builder:function () {
		'use strict';
		
		function _generateTest(_title, _declarativeChildren) {
			var
				_normalizedDeclarativeChildren = _declarativeChildren ? {} : undefined
			;
			
			function _getDeclaredChildren() {
				return (Uize.Widget.subclass ({
					mixins:Uize.Widget.mDeclarativeChildren,
					children:_declarativeChildren
						? Uize.map(
							_declarativeChildren,
							function(_value) {
								var _childProperties = Uize.copy(_value);
								
								if (!Uize.isPlainObject(_childProperties))
									_childProperties = Uize.eval(_childProperties);
								else if (_childProperties.widgetClass)
									_childProperties.widgetClass = Uize.eval(_childProperties.widgetClass);
								
								return _childProperties;
							}
						)
						: _declarativeChildren
				}) ()).children;
			}
		
			function _expectAll(_children, _expectFunc) {
				for (var _childName in _children) {
					if (!_expectFunc(_children[_childName], _childName))
						return false;
				}
				
				return true;
			}
			
			for (var _childName in _declarativeChildren) {
				var _declarativeChild = _declarativeChildren[_childName];
				_normalizedDeclarativeChildren[_childName] = Uize.isPlainObject(_declarativeChild)
					? _declarativeChild
					: {widgetClass:_declarativeChild}
				;
			}
			
			return {
				title:_title,
				test:[
					{
						title:'Children object is not null',
						test:function() { return this.expectObject(_getDeclaredChildren()) }
					},
					{
						title:'Children object has the same child names as defined in declarative children w/ a widgetClass',
						test:function() {
							var m = this;
							return _expectAll(_getDeclaredChildren(), function(_child, _childName) { return m.expect(true, _childName in _normalizedDeclarativeChildren) });
						}
					},
					{
						title:'None of the children are null',
						test:function() {
							var m = this;
							return _expectAll(_getDeclaredChildren(), function(_child) { return m.expectNonNull(_child) });
						}
					},
					{
						title:'Each child should be an object',
						test:function() {
							var m = this;
							return _expectAll(_getDeclaredChildren(), function(_child) { return m.expectObject(_child) });
						}
					},
					{
						title:'Each child has the correct initial state',
						test:function() {
							var m = this;
							return _expectAll(
								_getDeclaredChildren(),
								function(_child, _childName) {
									var _expectedInitialState = Uize.copy(_normalizedDeclarativeChildren[_childName]);
									
									delete _expectedInitialState.widgetClass;
									
									return m.expect(true, Uize.recordMatches(_child.get(), _expectedInitialState));
								}
							);
						}
					},
					{
						title:'Each child has the correct widget class',
						test:function() {
							var m = this;
							return _expectAll(
								_getDeclaredChildren(),
								function(_child, _childName) {
									return m.expect(_normalizedDeclarativeChildren[_childName].widgetClass, _child.Class.moduleName);
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
									value:'foo',
									values:['foo', 'bar', 'baz', 'bat']
								},
								lorem:{
									widgetClass:'Uize.Widget',
									foo:2,
									regexp:/\w+/g
								}
							}
						),
						_generateTest(
							'When a declared child omits its widgetClass, it does not getting added to the widget',
							{
								ipsum:{
									enabled:false,
									busy:true,
									container:'shell'
								},
								dolor:{
									widgetClass:'Uize.Widget',
									value:'foo',
									values:['foo', 'bar', 'baz', 'bat']
								},
								sit:{
									widgetClass:'Uize.Widget',
									foo:2,
									regexp:/\w+/g
								},
								blah:{}
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
							}
						),
						_generateTest(
							'When multiple declarative children are specified, an equal number of children are added added to the widget, each with their appopriate state properties',
							{
								foo:'Uize.Widget',
								bar:'Uize.Widget',
								lorem:'Uize.Widget'
							}
						),
						_generateTest(
							'When a declared child omits its widgetClass, it does not get added to the widget',
							{
								ipsum:'',
								dolor:'Uize.Widget',
								sit:'Uize.Widget'
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
							}
						)
					]
				}
			]
		});
	}
});

