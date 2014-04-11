/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Widget.mCssBindings Class
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
						title:_title + ' (children object not null)',
						test:function() { return this.expectObject(_getDeclaredChildren()) }
					},
					{
						title:_title + ' (children object has the same child names as defined in declarative children w/ a widgetClass)',
						test:function() {
							var m = this;
							return _expectAll(_getDeclaredChildren(), function(_child, _childName) { return m.expect(true, _childName in _normalizedDeclarativeChildren) });
						}
					},
					{
						title:_title + ' (none of the children should be null)',
						test:function() {
							var m = this;
							return _expectAll(_getDeclaredChildren(), function(_child) { return m.expectNonNull(_child) });
						}
					},
					{
						title:_title + ' (each child should be an object)',
						test:function() {
							var m = this;
							return _expectAll(_getDeclaredChildren(), function(_child) { return m.expectObject(_child) });
						}
					},
					{
						title:_title + ' (each child has the correct initial state)',
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
						title:_title + ' (each child has the correct widget class)',
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
					title:'Empty Tests',
					test:[
						_generateTest('Test that no declarative children results in no children added'),
						_generateTest('Test that empty declarative children results in no children added', {})
					]
				},
				{
					title:'Verbose Syntax Tests',
					test:[
						_generateTest(
							'Test that single declarative children results in only 1 child added with appopriate state properties',
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
							'Test that multiple declarative children results in only equal number of children added with appopriate state properties',
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
							'Test that declared child does not get added to children when widgetClass is omitted',
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
								}
							}
						)
					]
				},
				{
					title:'Shorthand Syntax Tests',
					test:[
						_generateTest(
							'Test that single declarative children results in only 1 child added with appopriate state properties',
							{
								foo:'Uize.Widget'
							}
						),
						_generateTest(
							'Test that multiple declarative children results in only equal number of children added with appopriate state properties',
							{
								foo:'Uize.Widget',
								bar:'Uize.Widget',
								lorem:'Uize.Widget'
							}
						),
						_generateTest(
							'Test that declared child does not get added to children when widgetClass is omitted',
							{
								ipsum:'',
								dolor:'Uize.Widget',
								sit:'Uize.Widget'
							}
						),
						_generateTest(
							'Test different ways that the widgetClass can be omitted w/ a falsy value',
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

