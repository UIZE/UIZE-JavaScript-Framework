/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Util.RegExpComposition Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014 UIZE
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

		function _getIdentifierRegExpComposition () {
			return Uize.Util.RegExpComposition ({
				startCharacter:/[a-zA-Z_$]/,
				continuationCharacter:/({startCharacter}|\d)/,
				identifier:/^{startCharacter}{continuationCharacter}*$/
			});
		}

		return Uize.Test.resolve ({
			title:'Test for Uize.Util.RegExpComposition Module',
			test:[
				Uize.Test.requiredModulesTest ('Uize.Util.RegExpComposition'),
				{
					title:'',
					test:function () {
						var _identifierRegExp = _getIdentifierRegExpComposition ().get ('identifier');
						return this.expect (true,_identifierRegExp.test ('aABC_$'));
					}
				},
				{
					title:'',
					test:function () {
						var _identifierRegExp = _getIdentifierRegExpComposition ().get ('identifier');
						return this.expect (false,_identifierRegExp.test ('0ABC_$'));
					}
				}
			]
		});
	}
});

