/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Widget.Form.mDeclarativeElements Class
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
		The =Uize.Test.Uize.Widget.Form.mDeclarativeElements= module defines a suite of unit tests for the =Uize.Widget.Form.mDeclarativeElements= mixin module.

		*DEVELOPERS:* `Ben Ilegbodu`, original code contributed by `Zazzle Inc.`

		=Uize.Test.Uize.Widget.Form.mDeclarativeElements= employs a very implementation-aware approach to testing =Uize.Widget.Form.mDeclarativeElements= because of the nature of how =Uize.Widget.Form.mDeclarativeElements= is implemented. In the event that the implementation for he widget mix-in changes, this test will most likely need to be updated as well.
*/

Uize.module ({
	name:'Uize.Test.Uize.Widget.Form.mDeclarativeElements',
	builder:function () {
		'use strict';

		function _getDeclaredElements(_declarativeElements) {
			return Uize.Widget.Form.subclass ({
				mixins:Uize.Widget.Form.mDeclarativeElements,
				elements:_declarativeElements
					? Uize.map(
						_declarativeElements,
						function(_childProperties) {
							if (Uize.isPlainObject(_childProperties) && _childProperties.widgetClass)
								_childProperties.widgetClass = Uize.getModuleByName(_childProperties.widgetClass);
							else if (Uize.isString(_childProperties))
								_childProperties = Uize.getModuleByName(_childProperties);

							return _childProperties;
						}
					)
					: _declarativeElements
			}) ().children.elements.children;
		}

		function _generateTest(_title, _declarativeElementsShorthand, _declarativeElementsVerbose, _expectedChildren) {
			function _generateSyntaxTests(_isVerbose) {
				var
					_declarativeElements = _isVerbose ? _declarativeElementsVerbose : _declarativeElementsShorthand,
					_syntaxTests = []
				;

				function _getDeclaredElementsForTest() { return _getDeclaredElements(_declarativeElements) }

				return {
					title:(_isVerbose ? 'Verbose' : 'Shorthand') + ' Syntax',
					test:[
						{
							title:'Elements are children of elements child widget',
							test:function() {
								return this.expect(
									Uize.lookup(_expectedChildren),
									Uize.lookup(Uize.keys(_getDeclaredElementsForTest()))
								);
							}
						}
					]
				};
			}

			return {
				title:_title,
				test:[
					_generateSyntaxTests(),
					_generateSyntaxTests(true)
				]
			};
		}

		return Uize.Test.resolve ({
			title:'Uize.Widget.Form.mDeclarativeElements Module Test',
			test:[
				Uize.Test.requiredModulesTest ([
					'Uize.Widget.Form',
					'Uize.Widget.Form.mDeclarativeElements'
				]),
				{
					title:'Empty',
					test:[
						_generateTest('When no declarative elements are specified, no declarative children are added to form elements child widget'),
						_generateTest('When an empty declarative elements is specified, no declarative children are added to form elements child widget', {}, {})
					]
				},
				_generateTest(
					'When declarative elements are specified, those form elements are added as declarative children to form elements child widget',
					{
						foo:'Uize.Widget.FormElement',
						bar:'Uize.Widget.FormElement',
						baz:'Uize.Widget.FormElement'
					},
					{
						foo:{
							widgetClass:'Uize.Widget.FormElement'
						},
						bar:{
							widgetClass:'Uize.Widget.FormElement'
						},
						baz:{
							widgetClass:'Uize.Widget.FormElement'
						}
					},
					['foo', 'bar', 'baz']
				)
			]
		});
	}
});

