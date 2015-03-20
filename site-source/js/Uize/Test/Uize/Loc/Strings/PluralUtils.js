/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Loc.Strings.PluralUtils Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2015 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Test
	importance: 1
	codeCompleteness: 10
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Test.Uize.Loc.Strings.PluralUtils= module defines a suite of unit tests for the =Uize.Loc.Strings.PluralUtils= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Loc.Strings.PluralUtils',
	builder:function () {
		'use strict';

		return Uize.Test.resolve ({
			title:'Test for Uize.Loc.Strings.PluralUtils Module',
			test:[
				Uize.Test.requiredModulesTest ('Uize.Loc.Strings.PluralUtils'),
				Uize.Test.staticMethodsTest ([
					['Uize.Loc.Strings.PluralUtils.normalizePluralStringsForPrimaryLanguage',[
						['When the primary language resources contains plural strings, the plural strings are normalized to contain values for the "zero", "two", "few", and "many" plural classes that are derived from the value of the "other" plural class"',
							{
								newMessages:{
									one:'You have {count} new message.',
									other:'You have {count} new messages.'
								},
								confirmDelete:{
									one:'Are you sure you would like to delete the {count} selected file?',
									other:'Are you sure you would like to delete the {count} selected files?'
								}
							},
							{
								newMessages:{
									zero:'You have {count} new messages.',
									one:'You have {count} new message.',
									two:'You have {count} new messages.',
									few:'You have {count} new messages.',
									many:'You have {count} new messages.',
									other:'You have {count} new messages.'
								},
								confirmDelete:{
									zero:'Are you sure you would like to delete the {count} selected files?',
									one:'Are you sure you would like to delete the {count} selected file?',
									two:'Are you sure you would like to delete the {count} selected files?',
									few:'Are you sure you would like to delete the {count} selected files?',
									many:'Are you sure you would like to delete the {count} selected files?',
									other:'Are you sure you would like to delete the {count} selected files?'
								}
							}
						]
					]],
					['Uize.Loc.Strings.PluralUtils.normalizePluralStringsForTranslatableLanguage',[
					]],
					['Uize.Loc.Strings.PluralUtils.removeUnsupportedPluralsForTranslatableLanguage',[
					]]
				])
			]
		});
	}
});

