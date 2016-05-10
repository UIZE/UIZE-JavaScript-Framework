/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Util.Matchers.AttributeMatcher Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2015-2016 UIZE
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
		The =Uize.Test.Uize.Util.Matchers.AttributeMatcher= module defines a suite of unit tests for the =Uize.Util.Matchers.AttributeMatcher= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Util.Matchers.AttributeMatcher',
	builder:function () {
		'use strict';

		var
			/*** General Variables ***/
				_attributesToMatch = [
					{tag:'img',attribute:'alt'},
					{tag:'img',attribute:'src'},
					{tag:'img',attribute:'title'},
					{tag:'div',attribute:'title'},
					{tag:'span',attribute:'title'},
					{tag:'span',attribute:'style'}
				]
		;

		return Uize.Test.resolve ({
			title:'Test for Uize.Util.Matchers.AttributeMatcher Module',
			test:[
				Uize.Test.requiredModulesTest ('Uize.Util.Matchers.AttributeMatcher'),
				Uize.Test.staticMethodsTest ([
					['Uize.Util.Matchers.AttributeMatcher.resolve',[
						/* NOTE:
							all the behaviors of this method are effectively tested by testing the test static method
						*/
					]],
					['Uize.Util.Matchers.AttributeMatcher.test',[
						/* NOTE:
							various behaviors of this method are effectively tested by testing the filter static method
						*/
					]],
					['Uize.Util.Matchers.AttributeMatcher.filter',[
						/*** test support for specifying an attribute matcher as a string expression ***/
							['An attribute matcher may be specified as a string expression, comprising tag name and attribute name matcher expressions delimited by an "@" symbol',
								[
									_attributesToMatch,
									'img@title'
								],
								[
									{tag:'img',attribute:'title'}
								]
							],
							['When an attribute matcher is specified as a string expression, and when the tag name matcher is blank, then the tag name of attributes will be disregarded when performing matches',
								[
									_attributesToMatch,
									'@title'
								],
								[
									{tag:'img',attribute:'title'},
									{tag:'div',attribute:'title'},
									{tag:'span',attribute:'title'}
								]
							],
							['When an attribute matcher is specified as a string expression, and when the "@" delimiter is omitted, then the string expression is regarded as an attribute name matcher alone and the tag name of attributes will be disregarded when performing matches',
								[
									_attributesToMatch,
									'title'
								],
								[
									{tag:'img',attribute:'title'},
									{tag:'div',attribute:'title'},
									{tag:'span',attribute:'title'}
								]
							],
							['When an attribute matcher is specified as a string expression, the tag name matcher portion can be specified as a pipe-delimited value list',
								[
									_attributesToMatch,
									'[img|span]@title'
								],
								[
									{tag:'img',attribute:'title'},
									{tag:'span',attribute:'title'}
								]
							],
							['When an attribute matcher is specified as a string expression, the attribute name matcher portion can be specified as a pipe-delimited value list',
								[
									_attributesToMatch,
									'img@[alt|src]'
								],
								[
									{tag:'img',attribute:'alt'},
									{tag:'img',attribute:'src'}
								]
							],
							['When an attribute matcher is specified as a string expression, both the tag name and attribute name matcher portions can be specified as pipe-delimited value lists',
								[
									_attributesToMatch,
									'[img|span]@[alt|title|style]'
								],
								[
									{tag:'img',attribute:'alt'},
									{tag:'img',attribute:'title'},
									{tag:'span',attribute:'title'},
									{tag:'span',attribute:'style'}
								]
							],
							['When an attribute matcher is specified as a string expression, and when both the tag name and attribute name matcher portions are blank, then all attributes will be matched',
								[
									_attributesToMatch,
									'@'
								],
								_attributesToMatch
							],
							['When an empty string is specified for the attribute matcher, then all attributes will be matched',
								[
									_attributesToMatch,
									''
								],
								_attributesToMatch
							],

						/*** test support for specifying an attribute matcher as an object ***/
							['An attribute matcher may be specified as an object, with "tag" and "attribute" properties that specify value matchers for the tag name and attribute name of attributes being matched',
								[
									_attributesToMatch,
									{
										tag:'img',
										attribute:'title'
									}
								],
								[
									{tag:'img',attribute:'title'}
								]
							],

							/*** test support for various forms of tag name matcher ***/
								['When an attribute matcher is specified as an object, the tag name matcher can be specified as a pipe-delimited tag names list',
									[
										_attributesToMatch,
										{
											tag:'img|span',
											attribute:'title'
										}
									],
									[
										{tag:'img',attribute:'title'},
										{tag:'span',attribute:'title'}
									]
								],
								['When an attribute matcher is specified as an object, the tag name matcher can be specified as a tag names array',
									[
										_attributesToMatch,
										{
											tag:['img','span'],
											attribute:'title'
										}
									],
									[
										{tag:'img',attribute:'title'},
										{tag:'span',attribute:'title'}
									]
								],
								['When an attribute matcher is specified as an object, the tag name matcher can be specified as a tag names lookup object',
									[
										_attributesToMatch,
										{
											tag:{img:1,div:0,span:1},
											attribute:'title'
										}
									],
									[
										{tag:'img',attribute:'title'},
										{tag:'span',attribute:'title'}
									]
								],
								['When an attribute matcher is specified as an object, the tag name matcher can be specified as a regular expression',
									[
										_attributesToMatch,
										{
											tag:/^(img|span)$/,
											attribute:'title'
										}
									],
									[
										{tag:'img',attribute:'title'},
										{tag:'span',attribute:'title'}
									]
								],
								['When an attribute matcher is specified as an object, the tag name matcher can be specified as a value matcher function',
									[
										_attributesToMatch,
										{
											tag:function (_tag) {return _tag == 'img' || _tag == 'span'},
											attribute:'title'
										}
									],
									[
										{tag:'img',attribute:'title'},
										{tag:'span',attribute:'title'}
									]
								],
								['When an attribute matcher is specified as an object and the "tag" property is omitted, then the tag name of attributes will be disregarded when performing matches',
									[
										_attributesToMatch,
										{
											attribute:'title'
										}
									],
									[
										{tag:'img',attribute:'title'},
										{tag:'div',attribute:'title'},
										{tag:'span',attribute:'title'}
									]
								],
								['When an attribute matcher is specified as an object and an empty string is specified for the "tag" property, then the tag name of attributes will be disregarded when performing matches',
									[
										_attributesToMatch,
										{
											tag:'',
											attribute:'title'
										}
									],
									[
										{tag:'img',attribute:'title'},
										{tag:'div',attribute:'title'},
										{tag:'span',attribute:'title'}
									]
								],
								['When an attribute matcher is specified as an object and the value null is specified for the "tag" property, then the tag name of attributes will be disregarded when performing matches',
									[
										_attributesToMatch,
										{
											tag:null,
											attribute:'title'
										}
									],
									[
										{tag:'img',attribute:'title'},
										{tag:'div',attribute:'title'},
										{tag:'span',attribute:'title'}
									]
								],
								['When an attribute matcher is specified as an object and the value undefined is specified for the "tag" property, then the tag name of attributes will be disregarded when performing matches',
									[
										_attributesToMatch,
										{
											tag:undefined,
											attribute:'title'
										}
									],
									[
										{tag:'img',attribute:'title'},
										{tag:'div',attribute:'title'},
										{tag:'span',attribute:'title'}
									]
								],

							/*** test support for various forms of attribute name matcher ***/
								['When an attribute matcher is specified as an object, the attribute name matcher can be specified as a pipe-delimited attribute names list',
									[
										_attributesToMatch,
										{
											tag:'img',
											attribute:'alt|src'
										}
									],
									[
										{tag:'img',attribute:'alt'},
										{tag:'img',attribute:'src'}
									]
								],
								['When an attribute matcher is specified as an object, the attribute name matcher can be specified as an attribute names array',
									[
										_attributesToMatch,
										{
											tag:'img',
											attribute:['alt','src']
										}
									],
									[
										{tag:'img',attribute:'alt'},
										{tag:'img',attribute:'src'}
									]
								],
								['When an attribute matcher is specified as an object, the attribute name matcher can be specified as an attribute names lookup object',
									[
										_attributesToMatch,
										{
											tag:'img',
											attribute:{alt:1,src:1,title:0}
										}
									],
									[
										{tag:'img',attribute:'alt'},
										{tag:'img',attribute:'src'}
									]
								],
								['When an attribute matcher is specified as an object, the attribute name matcher can be specified as a regular expression',
									[
										_attributesToMatch,
										{
											tag:'img',
											attribute:/^(alt|src)$/
										}
									],
									[
										{tag:'img',attribute:'alt'},
										{tag:'img',attribute:'src'}
									]
								],
								['When an attribute matcher is specified as an object, the attribute name matcher can be specified as a value matcher function',
									[
										_attributesToMatch,
										{
											tag:'img',
											attribute:function (_value) {return _value == 'alt' || _value == 'src'}
										}
									],
									[
										{tag:'img',attribute:'alt'},
										{tag:'img',attribute:'src'}
									]
								],
								['When an attribute matcher is specified as an object and the "attribute" property is omitted, then the attribute name of attributes will be disregarded when performing matches',
									[
										_attributesToMatch,
										{
											tag:'img'
										}
									],
									[
										{tag:'img',attribute:'alt'},
										{tag:'img',attribute:'src'},
										{tag:'img',attribute:'title'}
									]
								],
								['When an attribute matcher is specified as an object and an empty string is specified for the "attribute" property, then the attribute name of attributes will be disregarded when performing matches',
									[
										_attributesToMatch,
										{
											tag:'img',
											attribute:''
										}
									],
									[
										{tag:'img',attribute:'alt'},
										{tag:'img',attribute:'src'},
										{tag:'img',attribute:'title'}
									]
								],
								['When an attribute matcher is specified as an object and the value null is specified for the "attribute" property, then the attribute name of attributes will be disregarded when performing matches',
									[
										_attributesToMatch,
										{
											tag:'img',
											attribute:null
										}
									],
									[
										{tag:'img',attribute:'alt'},
										{tag:'img',attribute:'src'},
										{tag:'img',attribute:'title'}
									]
								],
								['When an attribute matcher is specified as an object and the value undefined is specified for the "attribute" property, then the attribute name of attributes will be disregarded when performing matches',
									[
										_attributesToMatch,
										{
											tag:'img',
											attribute:undefined
										}
									],
									[
										{tag:'img',attribute:'alt'},
										{tag:'img',attribute:'src'},
										{tag:'img',attribute:'title'}
									]
								],

							/*** miscellaneous tests ***/
								['When an attribute matcher is specified as an object and both the "tag" and "attribute" properties are omitted, then the tag name and attribute name of attributes will be disregarded when performing matches',
									[_attributesToMatch,{}],
									_attributesToMatch
								],

						/*** test support for specifying an attribute matcher as a function ***/
							['When an attribute matcher specified as a matcher function returns true, all attributes will be matched',
								[_attributesToMatch,Uize.returnTrue],
								_attributesToMatch
							],
							['When a value list matcher specified as a matcher function returns false, the value false is returned',
								[_attributesToMatch,Uize.returnFalse],
								[]
							],
							{
								title:'When an attribute matcher is specified as a matcher function, then that function is passed the attribute being tested as its only argument',
								test:function () {
									var
										_attributeBeingTested = {tag:'img',attribute:'alt'},
										_attributePassed,
										_totalArgumentsPassed
									;
									Uize.Util.Matchers.ValueListMatcher.filter (
										[_attributeBeingTested],
										function (_attribute) {
											_attributePassed = _attribute;
											_totalArgumentsPassed = arguments.length;
										}
									);
									return (
										this.expect (1,_totalArgumentsPassed) &&
										this.expect (_attributeBeingTested,_attributePassed)
									);
								}
							},

						/*** test support for specifying an attribute matcher as an array of attribute matchers ***/
							['An attribute matcher may be specified as an array of attribute matchers, representing an attribute matcher composition, and the resolved attribute matcher will match an attribute if any one of the sub-matchers matches the attribute',
								[
									_attributesToMatch,
									[
										'img@alt',
										'title',
										'span@'
									]
								],
								[
									{tag:'img',attribute:'alt'},
									{tag:'img',attribute:'title'},
									{tag:'div',attribute:'title'},
									{tag:'span',attribute:'title'},
									{tag:'span',attribute:'style'}
								]
							],
							['When an attribute matcher is specified as an array of attribute matchers, then the sub-matchers can be specified using any of the supported forms of attribute matchers',
								[
									_attributesToMatch,
									[
										'img@alt',
										{attribute:'title'},
										function (_attribute) {return _attribute.tag == 'span'}
									]
								],
								[
									{tag:'img',attribute:'alt'},
									{tag:'img',attribute:'title'},
									{tag:'div',attribute:'title'},
									{tag:'span',attribute:'title'},
									{tag:'span',attribute:'style'}
								]
							],
							['When an attribute matcher is specified as an array of attribute matchers, then the sub-matchers may themselves also be specified as arrays of attribute matchers, and any level of nesting is supported',
								[
									_attributesToMatch,
									[
										'img@alt',
										[
											{attribute:'title'},
											[
												function (_attribute) {return _attribute.tag == 'span'},
												'src'
											]
										]
									]
								],
								_attributesToMatch
							],

						/*** miscellaneous tests ***/
							['When the value null is specified for the attribute matcher, the value true is always returned',
								[_attributesToMatch,null],
								_attributesToMatch
							],
							['When the value undefined is specified for the attribute matcher, the value true is always returned',
								[_attributesToMatch,undefined],
								_attributesToMatch
							]
					]]
				])
			]
		});
	}
});

