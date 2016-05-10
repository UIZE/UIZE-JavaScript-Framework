/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Util.Matchers.ModuleNameMatcher Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 2
	codeCompleteness: 100
	docCompleteness: 5
*/

/*?
	Introduction
		The =Uize.Util.Matchers.ModuleNameMatcher= package provides a way to resolve a module name matcher expression to a value matcher function that can be used in high performance filtering of module name lists.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Util.Matchers.ModuleNameMatcher',
	required:[
		'Uize.Util.Matchers.Base',
		'Uize.Data.Matches',
		'Uize.Str.Split',
		'Uize.Str.Has'
	],
	builder:function () {
		'use strict';

		return Uize.Util.Matchers.Base.extend ({
			resolve:function (_matcher) {
				var
					_expressionChunks = [],
					_expressionChunkMatchers = [],
					_expressionChunkSign = '+'
				;
				for (
					var
						_partNo = -1,
						_signAndMatcherList = Uize.Data.Matches.retain (
							Uize.Str.Split.split (_matcher,/(^|[\+\-])([^\+\-]+)/),
							function (_value,_key) {return _key % 3}
						),
						_totalParts = _signAndMatcherList.length / 2
					;
					++_partNo <= _totalParts;
				) {
					var
						_sign = _signAndMatcherList [_partNo * 2] || '+',
						_subMatcher = _signAndMatcherList [_partNo * 2 + 1]
					;
					if (_sign != _expressionChunkSign || _partNo == _totalParts) {
						_expressionChunks.push (
							(_expressionChunkSign == '-' ? '!' : '') +
							'/^(' +
							Uize.map (
								_expressionChunkMatchers,
								function (_moduleNameMatcher) {
									return (
										Uize.Str.Has.hasSuffix (
											_moduleNameMatcher = Uize.escapeRegExpLiteral (_moduleNameMatcher)
												.replace (/\\\*/g,'.+'),
											'\\..+'
										)
											? _moduleNameMatcher.slice (0,-4) + '(\\..+)?'
											: _moduleNameMatcher
									);
								}
							).join ('|') +
							')$/.test (v)'
						);
						_expressionChunkSign = _sign;
						_expressionChunkMatchers = [];

					}
					_expressionChunkMatchers.push (_subMatcher);
				}
				var _matcherExpression = '';
				Uize.forEach (
					_expressionChunks,
					function (_expressionChunk) {
						_matcherExpression =
							(
								_matcherExpression &&
								(
									'(' + _matcherExpression + ')' +
									(_expressionChunk.charAt (0) == '!' ? '&&' : '||')
								)
							) +
							_expressionChunk
						;
					}
				);
				return Function ('v','return ' + _matcherExpression);
			}
		});
	}
});

