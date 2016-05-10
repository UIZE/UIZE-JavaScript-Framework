/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Util.RegExpComposition Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2016 UIZE
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
		The =Uize.Test.Uize.Util.RegExpComposition= module defines a suite of unit tests for the =Uize.Util.RegExpComposition= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Util.RegExpComposition',
	required:'Uize.Class',
	builder:function () {
		'use strict';

		return Uize.Test.resolve ({
			title:'Test for Uize.Util.RegExpComposition Module',
			test:[
				Uize.Test.requiredModulesTest ('Uize.Util.RegExpComposition'),
				{
					title:'A regular expression composition object may contain a component that is simply a regular expression, and the g (global) flag will be set when it is resolved to a regular expression',
					test:function () {
						var _regExpComposition = Uize.Util.RegExpComposition ({
							digits:/\d+/
						});
						return this.expect (/\d+/g,_regExpComposition.get ('digits'));
					}
				},
				{
					title:'A regular expression composition object may contain a component that references another component',
					test:function () {
						var _regExpComposition = Uize.Util.RegExpComposition ({
							digit:/\d/,
							digits:/{digit}+/
						});
						return this.expect (/\d+/g,_regExpComposition.get ('digits'));
					}
				},
				{
					title:'A regular expression composition object may contain a component that references multiple other components',
					test:function () {
						var _regExpComposition = Uize.Util.RegExpComposition ({
							startCharacter:/[a-zA-Z_$]/,
							continuationCharacter:/({startCharacter}|\d)/,
							identifier:/^{startCharacter}{continuationCharacter}*$/
						});
						return this.expect (/^[a-zA-Z_$]([a-zA-Z_$]|\d)*$/g,_regExpComposition.get ('identifier'));
					}
				},
				{
					title:'When a regular expression composition object contain multiple components, each component can be resolved to a regular expression',
					test:function () {
						var _regExpComposition = Uize.Util.RegExpComposition ({
							startCharacter:/[a-zA-Z_$]/,
							continuationCharacter:/({startCharacter}|\d)/,
							identifier:/^{startCharacter}{continuationCharacter}*$/
						});
						return (
							this.expect (/[a-zA-Z_$]/g,_regExpComposition.get ('startCharacter')) &&
							this.expect (/([a-zA-Z_$]|\d)/g,_regExpComposition.get ('continuationCharacter')) &&
							this.expect (/^[a-zA-Z_$]([a-zA-Z_$]|\d)*$/g,_regExpComposition.get ('identifier'))
						);
					}
				},
				{
					title:'Names of components of a regular expression composition object may begin with a "$" (dollar) character or a "_" (underscore) character',
					test:function () {
						var _regExpComposition = Uize.Util.RegExpComposition ({
							$foo:/foo/,
							'_bar':/bar/,
							fooBar:/{$foo}{_bar}/
						});
						return this.expect (/foobar/g,_regExpComposition.get ('fooBar'));
					}
				},
				{
					title:'Names of components of a regular expression composition object may not begin with a digit, but may contain digits, dollars, and underscores',
					test:function () {
						var _regExpComposition = Uize.Util.RegExpComposition ({
							1:/one/,
							a_$123456789_$:/bar/,
							foo:/foo{1}{a_$123456789_$}/
						});
						return this.expect (/foo{1}bar/g,_regExpComposition.get ('foo'));
					}
				}
			]
		});
	}
});

