/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Loc.Plurals.Util Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Test
	importance: 1
	codeCompleteness: 2
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Test.Uize.Loc.Plurals.Util= module defines a suite of unit tests for the =Uize.Loc.Plurals.Util= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Loc.Plurals.Util',
	builder:function () {
		'use strict';

		/*** Utility Functions ***/
			function _pluralRulesFunction (n,i,f,t,v,w,within) {
				return n == 0 ? 'zero' : n == 1 ? 'one' : n == 2 ? 'two' : within (n % 100,[[3,10]]) ? 'few' : within (n % 100,[[11,99]]) ? 'many' : 'other';
			}

		return Uize.Test.resolve ({
			title:'Test for Uize.Loc.Plurals.Util Module',
			test:[
				Uize.Test.requiredModulesTest ('Uize.Loc.Plurals.Util'),
				Uize.Test.staticMethodsTest ([
					['Uize.Loc.Plurals.Util.resolveValue',[
						['When the source value is a number, that number value is returned',
							5,
							5
						],
						['When the source value is a simple object, then the first property in that object whose value is a number is returned',
							{
								prop1:'foo',
								prop2:true,
								prop3:{},
								prop4:5,
								prop5:/\d+/,
								prop6:function () {}
							},
							5
						]
					]],
					['Uize.Loc.Plurals.Util.getNumberInfo',[
						['An object is returned, containing properties that describe the various qualities of the source number, as defined by the CLDR plural rules',
							123.789,
							{
								n:123.789,
								i:123,
								v:3,
								w:3,
								f:789,
								t:789
							}
						],
						['The n property represents the absolute value of the source number',
							-123.456,
							{
								n:123.456,
								i:123,
								v:3,
								w:3,
								f:456,
								t:456
							}
						],
						['The v property represents the number of visible fraction digits (including trailing zeros) and the f property represents the visible fraction digits (including trailing zeros), whereas the w and t properties disregard trailing zeros',
							'-123.456000',
							{
								n:123.456,
								i:123,
								v:6,
								w:3,
								f:456000,
								t:456
							}
						]
					]],
					['Uize.Loc.Plurals.Util.within',[
						['When there are no range items, then the source number is not considered to be within the range',
							[5,[]],
							false
						],
						['When the source number is less than the lower bound of the specified range, then the value false is returned',
							[1,[[2,8]]],
							false
						],
						['When the source number is equal to the lower bound of the specified range, then the value true is returned',
							[2,[[2,8]]],
							true
						],
						['When the source number is between the lower and upper bounds of the specified range, then the value true is returned',
							[5,[[2,8]]],
							true
						],
						['When the source number is equal to the upper bound of the specified range, then the value true is returned',
							[8,[[2,8]]],
							true
						],
						['When the source number is greater than the upper bound of the specified range, then the value false is returned',
							[12,[[2,8]]],
							false
						],
						{
							title:'When the source number is equal to one of the specified point sub-ranges, then the value true is returned',
							test:function () {
								var _ranges = [1,5,9,15];
								return (
									this.expect (true,Uize.Loc.Plurals.Util.within (1,_ranges)) &&
									this.expect (true,Uize.Loc.Plurals.Util.within (5,_ranges)) &&
									this.expect (true,Uize.Loc.Plurals.Util.within (9,_ranges)) &&
									this.expect (true,Uize.Loc.Plurals.Util.within (15,_ranges))
								);
							}
						},
						['When the source number is not equal to one of the specified point sub-ranges, then the value false is returned',
							[7,[1,5,9,15]],
							false
						],
						{
							title:'A ranges list may contain a mix of different types of sub-ranges',
							test:function () {
								var
									_ranges = [1,[5,15],23,33,[50,70],[90,95],104],
									_expectedResults = {
										0:false,
										1:true,
										4:false,
										5:true,
										10:true,
										15:true,
										16:false,
										23:true,
										30:false,
										33:true,
										49:false,
										50:true,
										60:true,
										70:true,
										71:false,
										89:false,
										90:true,
										93:true,
										95:true,
										96:false,
										104:true,
										105:false
									}
								;
								return this.expect (
									_expectedResults,
									Uize.map (
										_expectedResults,
										function (_value,_key) {
											return Uize.Loc.Plurals.Util.within (+_key,_ranges);
										}
									)
								);
							}
						}
					]],
					['Uize.Loc.Plurals.Util.getPluralCategory',[
						{
							title:'When a source number is specified, the specified plural rules function is used to determine the plural category',
							test:function () {
								return (
									this.expect ('zero',Uize.Loc.Plurals.Util.getPluralCategory (0,_pluralRulesFunction)) &&
									this.expect ('one',Uize.Loc.Plurals.Util.getPluralCategory (1,_pluralRulesFunction)) &&
									this.expect ('two',Uize.Loc.Plurals.Util.getPluralCategory (2,_pluralRulesFunction)) &&
									this.expect ('few',Uize.Loc.Plurals.Util.getPluralCategory (5,_pluralRulesFunction)) &&
									this.expect ('many',Uize.Loc.Plurals.Util.getPluralCategory (20,_pluralRulesFunction)) &&
									this.expect ('other',Uize.Loc.Plurals.Util.getPluralCategory (100,_pluralRulesFunction))
								);
							}
						},
						['When the specified source value is a plain object, then the first property in the object whose value is a number will be used to determine the plural category',
							[
								{
									prop1:'foo',
									prop2:true,
									prop3:{},
									prop4:5,
									prop5:/\d+/,
									prop6:function () {}
								},
								_pluralRulesFunction
							],
							'few'
						]
					]]
				])
			]
		});
	}
});

