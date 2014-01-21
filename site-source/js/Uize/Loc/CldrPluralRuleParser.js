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
	required:[
		'Uize.Str.Split',
		'Uize.Str.Trim'
	],
	builder:function () {
		'use strict';

		/*** Utility Functions ***/
			function _resolveRegularExpressions (_regExpLookup) {
				var _resolved = {};
				function _resolveRegularExpression (_regExp,_regExpName) {
					if (!_resolved [_regExpName]) {
						_resolved [_regExpName] = new RegExp (
							_regExp.source.replace (
								/{([a-zA-Z_$][a-zA-Z_$\d]*)}/g,
								function (_match,_subRegExpName) {
									_resolveRegularExpression (_regExpLookup [_subRegExpName],_subRegExpName);
									return '(' + _resolved [_subRegExpName].source + ')';
								}
							),
							'g'
						)
					}
				}
				Uize.forEach (_regExpLookup,_resolveRegularExpression);
				return _resolved;
			}

		var
			/*** Variables for Scruncher Optimization ***/
				_split = Uize.Str.Split.split,

			/*** General Variables ***/
				_segmentRegularExpressions = _resolveRegularExpressions ({
					digit:/\d/,
					value:/{digit}+/,
					decimalValue:/{value}(\.{value})?/,
					range:/{value}\.\.{value}/,
					sampleRange:/{decimalValue}(~{decimalValue})?/,
					samples:/{sampleRange}(\s*,\s*{sampleRange})*(\s*,\s*(…|\.\.\.))?/,
					integerOrDecimalSamples:/@(integer|decimal)\s+{samples}/g
				}),
				_samplesRegExp = _segmentRegularExpressions.integerOrDecimalSamples,
				_orRegExp = /\s+or\s+/,
				_andRegExp = /\s+and\s+/,
				_relationPartsRegExp = /^\s*(.+?)\s*(!?=)\s*(.+?)\s*$/,
				_rangeDetectorRegExp = /\.\.|,/
		;

		return Uize.package ({
			toJsExpression:function (_pluralRuleStr) {
				console.log (_pluralRuleStr.replace (_samplesRegExp,''));
				return Uize.Str.Trim.trim (
					Uize.map (
						_split (_pluralRuleStr.replace (_samplesRegExp,''),_orRegExp), // remove samples, split or conditions
						function (_andCondition) {
							console.log (_andCondition);
							return Uize.map (
								_split (_andCondition,_andRegExp),
								function (_relation) {
									var
										_relationParts = _relation.match (_relationPartsRegExp),
										_operandA = _relationParts [1],
										_operator = _relationParts [2],
										_operandB = _relationParts [3]
									;
									if (_operator == '=')
										_operator = '=='
									;
									return (
										_rangeDetectorRegExp.test (_operandB)
											?
												'within (' +
													_operandA + ',' +
													'[' +
														_operandB.replace (
															/(\d+)\.\.(\d+)/g,
															function (_match,_rangeLimitA,_rangeLimitB) {
																return '[' + _rangeLimitA + ',' + _rangeLimitB + ']';
															}
														) +
													']' +
												')'
											: _operandA + ' ' + _operator + ' ' + _operandB
									);
								}
							).join (' && ');
						}
					).join (' || ')
				);
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

