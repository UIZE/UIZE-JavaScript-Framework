/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Util.Html.EntityInfo Class
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
		The =Uize.Test.Uize.Util.Html.EntityInfo= module defines a suite of unit tests for the =Uize.Util.Html.EntityInfo= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Util.Html.EntityInfo',
	required:'Uize.Util.Html.Entities',
	builder:function () {
		'use strict';

		var _entityNameToCharCodeLookup = Uize.Util.Html.Entities.entityNameToCharCodeLookup;

		return Uize.Test.resolve ({
			title:'Test for Uize.Util.Html.EntityInfo Module',
			test:[
				Uize.Test.requiredModulesTest ('Uize.Util.Html.EntityInfo'),
				Uize.Test.staticPropertyTest ('Uize.Util.Html.EntityInfo.charCodeToEntityInfoLookup','object'),
				{
					title:'The Uize.Util.Html.EntityInfo.charCodeToEntityInfoLookup static property has properties with entity character codes as keys and entity info arrays as values',
					test:function () {
						var _charCodeToEntityInfoLookup = Uize.Util.Html.EntityInfo.charCodeToEntityInfoLookup;
						return this.expect (
							['Punctuation','quotation mark','single','low-9'],
							_charCodeToEntityInfoLookup [8218]
						);
					}
				},
				{
					title:'The Uize.Util.Html.EntityInfo.charCodeToEntityInfoLookup static property has entries for all the HTML entities that are defined in the Uize.Util.Html.Entities module',
					test:Uize.map (
						Uize.keys (_entityNameToCharCodeLookup),
						function (_entityName) {
							var _entityCode = _entityNameToCharCodeLookup [_entityName];
							return {
								title:'Entity info exists for the HTML entity &' + _entityName + '; (code ' + _entityCode + ')',
								test:function () {
									return this.expectArray (Uize.Util.Html.EntityInfo.charCodeToEntityInfoLookup [_entityCode]);
								}
							};
						}
					)
				}
			]
		});
	}
});

