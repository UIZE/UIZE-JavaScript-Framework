/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Util.Html.Entities Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Test
	importance: 0
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Test.Uize.Util.Html.Entities= module defines a suite of unit tests for the =Uize.Util.Html.Entities= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Util.Html.Entities',
	builder:function () {
		'use strict';

		return Uize.Test.resolve ({
			title:'Test for Uize.Util.Html.Entities Module',
			test:[
				Uize.Test.requiredModulesTest ('Uize.Util.Html.Entities'),
				Uize.Test.staticPropertyTest ('Uize.Util.Html.Entities.entityNameToCharCodeLookup','object'),
				{
					title:'The Uize.Util.Html.Entities.entityNameToCharCodeLookup static property has properties with entity names as keys and entity character codes as values',
					test:function () {
						var _entityNameToCharCodeLookup = Uize.Util.Html.Entities.entityNameToCharCodeLookup;
						return (
							this.expect (169,_entityNameToCharCodeLookup.copy) &&
							this.expect (9824,_entityNameToCharCodeLookup.spades)
						);
					}
				},
				Uize.Test.staticPropertyTest ('Uize.Util.Html.Entities.charCodeToEntityNameLookup','object'),
				{
					title:'The Uize.Util.Html.Entities.charCodeToEntityNameLookup static property has properties with entity character codes as keys and entity names as values',
					test:function () {
						var _charCodeToEntityNameLookup = Uize.Util.Html.Entities.charCodeToEntityNameLookup;
						return (
							this.expect ('copy',_charCodeToEntityNameLookup [169]) &&
							this.expect ('spades',_charCodeToEntityNameLookup [9824])
						);
					}
				}
			]
		});
	}
});

