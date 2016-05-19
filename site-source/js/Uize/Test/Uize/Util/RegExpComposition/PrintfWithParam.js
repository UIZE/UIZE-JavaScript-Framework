/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Util.RegExpComposition.PrintfWithParam Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2016 UIZE
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
		The =Uize.Test.Uize.Util.RegExpComposition.PrintfWithParam= module defines a suite of unit tests for the =Uize.Util.RegExpComposition.PrintfWithParam= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Util.RegExpComposition.PrintfWithParam',
	required:'Uize.Class',
	builder:function () {
		'use strict';

		function _regExpCompositionTest (_title,_sourceStr,_matchOrNot) {
			return {
				title:_title,
				test:function () {
					return (
						_sourceStr.replace (Uize.Util.RegExpComposition.PrintfWithParam.get ('placeholder'),'').length ==
						(_matchOrNot ? 0 : _sourceStr.length)
					);
				}
			};
		}

		return Uize.Test.resolve ({
			title:'Test for Uize.Util.RegExpComposition.PrintfWithParam Module',
			test:[
				Uize.Test.requiredModulesTest ('Uize.Util.RegExpComposition.PrintfWithParam'),

				/*** test support for the "%" type ***/
					_regExpCompositionTest (
						'The "%" type is supported for escaping "%" characters',
						'%%',
						true
					),
					_regExpCompositionTest (
						'The "%" type cannot be preceded by parameter, flag, precision, or length specifiers',
						'%$1% %+% %4% %L% %.4%',
						false
					)
			]
		});
	}
});

