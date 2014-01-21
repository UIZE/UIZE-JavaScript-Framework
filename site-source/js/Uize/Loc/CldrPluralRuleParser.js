/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Loc.CldrPluralRuleParser Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 1
	codeCompleteness: 5
	docCompleteness: 5
*/

/*?
	Introduction
		The =Uize.Loc.CldrPluralRuleParser= module provides methods for parsing [[http://unicode.org/repos/cldr-tmp/trunk/diff/supplemental/language_plural_rules.html][CLDR plural rules]] defined using the [[http://unicode.org/reports/tr35/tr35-numbers.html#Language_Plural_Rules][CLDR plural rule syntax]].

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Loc.CldrPluralRuleParser',
	required:'Uize.Str.Split',
	builder:function () {
		'use strict';

		/*** Utility Functions ***/
			function _resolveRegularExpressions (_regExpLookup) {
				var _resolved = {};

				return _resolved;
			}

		var
			/*** Variables for Scruncher Optimization ***/
				_split = Uize.Str.Split.split,

			/*** General Variables ***/
				_samplesRegExp = _resolveRegularExpressions ({
					digit:/\d/,
					value:/{digit}+/,
					decimalValue:/{value}(\.{value})?/,
					range:/{value}\.\.{value}/,
					sampleRange:/{decimalValue}(~{decimalValue})/,
					samples:/{sampleRange}(\s*,\s*{sampleRange})*(\s*,\s*(…|\.\.\.))?/,
					integerOrDecimalSamples:/@(integer|decimal)\s+{samples}/g
				}).integerOrDecimalSamples,
				_orRegExp = /\s+or\s+/
		;

		return Uize.package ({
			toJsExpression:function (_pluralRuleStr) {
				return Uize.map (
					_split (_pluralRuleStr.replace (_samplesRegExp,''),_orRegExp), // remove samples and split or conditions
					function (_andCondition) {
						console.log (_andCondition);
						/*
							for each part, split along ands
								for each part, split on operators of "is", "is not", "in", "not in", "=", "!=", "within", "not within"
								for expression part...
									replace "mod" with "%"
									wrap with parentheses, if contains mod
								for operand B, if contains ".." or ",", wrap operand A and operand B in call to inRange
						*/
					}
				).join (' || ');
				/*?
					Static Methods
						Uize.Loc.CldrPluralRuleParser.toJsExpression
							Returns a string, representing the CLDR plural rule in the form of a JavaScript expression.

							SYNTAX
							...............................................................................
							jsExpressionSTR = Uize.Loc.CldrPluralRuleParser.toJsExpression (pluralRuleSTR);
							...............................................................................
				*/
			}
		});
	}
});

