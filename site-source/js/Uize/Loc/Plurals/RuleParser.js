/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Loc.Plurals.RuleParser Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2016 UIZE
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
		The =Uize.Loc.Plurals.RuleParser= module provides methods for parsing [[http://unicode.org/repos/cldr-tmp/trunk/diff/supplemental/language_plural_rules.html][CLDR plural rules]] defined using the [[http://unicode.org/reports/tr35/tr35-numbers.html#Language_Plural_Rules][CLDR plural rule syntax]].

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Loc.Plurals.RuleParser',
	required:[
		'Uize.Str.Split',
		'Uize.Str.Trim',
		'Uize.Util.RegExpComposition'
	],
	builder:function () {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_split = Uize.Str.Split.split,

			/*** references to static methods used internally ***/
				_ruleToJs,
				_rulesToJs,

			/*** General Variables ***/
				_ruleRegExpComposition = Uize.Util.RegExpComposition ({
					digit:/\d/,
					value:/{digit}+/,
					decimalValue:/{value}(\.{value})?/,
					range:/{value}\.\.{value}/,
					sampleRange:/{decimalValue}(~{decimalValue})?/,
					samples:/{sampleRange}(\s*,\s*{sampleRange})*(\s*,\s*(…|\.\.\.))?/,
					integerOrDecimalSamples:/@(integer|decimal)\s+{samples}/g
				}),
				_samplesRegExp = _ruleRegExpComposition.get ('integerOrDecimalSamples'),
				_orRegExp = /\s+or\s+/,
				_andRegExp = /\s+and\s+/,
				_relationPartsRegExp = /^\s*(.+?)\s*(!?=)\s*(.+?)\s*$/,
				_rangeDetectorRegExp = /\.\.|,/
		;

		return Uize.package ({
			ruleToJs:_ruleToJs = function (_pluralRuleStr) {
				return Uize.Str.Trim.trim (
					Uize.map (
						_split (_pluralRuleStr.replace (_samplesRegExp,''),_orRegExp), // remove samples, split or conditions
						function (_andCondition) {
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
												(_operator == '!=' ? '!' : '') +
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
						Uize.Loc.Plurals.RuleParser.ruleToJs
							Returns a string, representing the CLDR plural rule in the form of a JavaScript expression.

							SYNTAX
							.......................................................................
							jsExpressionSTR = Uize.Loc.Plurals.RuleParser.ruleToJs (pluralRuleSTR);
							.......................................................................
				*/
			},

			rulesToJs:_rulesToJs = function (_pluralRulesMap) {
				delete (_pluralRulesMap = Uize.copy (_pluralRulesMap)).other;
				var
					_pluralRuleNo = -1,
					_pluralRuleNames = Uize.keys (_pluralRulesMap)
				;
				function _getPluralRuleCondition () {
					var _pluralRuleName = _pluralRuleNames [++_pluralRuleNo];
					return (
						_pluralRuleName
							? (
								_ruleToJs (_pluralRulesMap [_pluralRuleName]) +
								' ? \'' + _pluralRuleName + '\'' +
								' : ' + _getPluralRuleCondition ()
							)
							: '\'other\''
					);
				}
				return _getPluralRuleCondition ();
			},

			rulesToJsFunctionStr:function (_pluralRulesMap) {
				return (
					'function (n,i,f,t,v,w,within) {\n' +
						'\treturn ' + _rulesToJs (_pluralRulesMap) + ';\n' +
					'}\n'
				);
			},

			rulesToJsFunction:function (_pluralRulesMap) {
				return Function (
					'n', 'i', 'f', 't', 'v', 'w', 'within',
					'return ' + _rulesToJs (_pluralRulesMap) + ';'
				);
			}
		});
	}
});

