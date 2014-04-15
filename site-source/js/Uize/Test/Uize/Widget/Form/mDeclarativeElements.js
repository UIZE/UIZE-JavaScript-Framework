/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Widget.Form.mDeclarativeElements Class
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
		The =Uize.Test.Uize.Widget.Form.mDeclarativeElements= module defines a suite of unit tests for the =Uize.Widget.Form.mDeclarativeElements= mixin module.

		*DEVELOPERS:* `Ben Ilegbodu`, original code donated by `Zazzle Inc.`
		
		=Uize.Test.Uize.Widget.Form.mDeclarativeElements= employs a very implementation-aware approach to testing =Uize.Widget.Form.mDeclarativeElements= because of the nature of how =Uize.Widget.Form.mDeclarativeElements= is implemented. In the event that the implementation for he widget mix-in changes, this test will most likely need to be updated as well.
*/

Uize.module ({
	name:'Uize.Test.Uize.Widget.Form.mDeclarativeElements',
	builder:function () {
		'use strict';
		
		function _generateTest(_title, _declarativeElementsShorthand, _declarativeElementsVerbose) {
			
			function _generateSyntaxTests(_isVerbose) {
				var
					_declarativeElements = _isVerbose ? _declarativeElementsVerbose : _declarativeElementsShorthand,
					_syntaxTests = []
				;
				
				function _getEvaluatedDeclarativeElements() {
					return _declarativeElements
						? Uize.map(
							_declarativeElements,
							function(_value) {
								var _childProperties = Uize.copy(_value);
								
								if (!Uize.isPlainObject(_childProperties))
									_childProperties = Uize.eval(_childProperties);
								else if (_childProperties.widgetClass)
									_childProperties.widgetClass = Uize.eval(_childProperties.widgetClass);
								
								return _childProperties;
							}
						)
						: _declarativeElements
					;
				}
				
				function _getFormElementsWidgetClass() {
					return Uize.Widget.Form.subclass ({
						mixins:Uize.Widget.Form.mDeclarativeElements,
						elements:_getEvaluatedDeclarativeElements()
					}).get('formElementsWidgetClass');
				}
				
				if (Uize.isEmpty(_declarativeElements)) {
					_syntaxTests.push(
						{
							title:'formElementsWidgetClass class state proprety is undefined',
							test:function() {
								return this.expectNull(_getFormElementsWidgetClass());
							}
						}
					);
				}
				else {
					_syntaxTests.push(
						{
							title:'formElementsWidgetClass class state proprety is defined',
							test:function() {
								return this.expectNonNull(_getFormElementsWidgetClass());
							}
						},
						{
							title:'formElementsWidgetClass class state proprety\'s "mDeclarativeChildren_children" static property is defined',
							test:function() {
								return this.expectNonNull(_getFormElementsWidgetClass().mDeclarativeChildren_children);
							}
						},
						{
							title:'formElementsWidgetClass class state proprety\'s "mDeclarativeChildren_children" static property matches declarative elements',
							test:function() {
								return this.expect(_getEvaluatedDeclarativeElements(), _getFormElementsWidgetClass().mDeclarativeChildren_children);
							}
						}
					);
				}
				
				return {
					title:(_isVerbose ? 'Verbose' : 'Shorthand') + ' Syntax',
					test:_syntaxTests
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
						bar:'Uize.Widget.FormElement.Text',
						baz:'Uize.Widget.Picker'
					},
					{
						foo:{
							widgetClass:'Uize.Widget.FormElement'	
						},
						bar:{
							widgetClass:'Uize.Widget.FormElement.Text'	
						},
						baz:{
							widgetClass:'Uize.Widget.Picker'	
						}
					}
				)
			]
		});
	}
});

