/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Util.Matchers.ValueListMatcher Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2015-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 1
	codeCompleteness: 100
	docCompleteness: 5
*/

/*?
	Introduction
		The =Uize.Util.Matchers.ValueListMatcher= package provides a way to resolve a value list matcher expression to a value matcher function.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Util.Matchers.ValueListMatcher',
	required:[
		'Uize.Util.Matchers.Base',
		'Uize.Str.Split'
	],
	builder:function () {
		'use strict';

		return Uize.Util.Matchers.Base.extend ({
			resolve:function (_matcher) {
				var _resolvedMatcher = _matcher;
				if (!_matcher) {
					_resolvedMatcher = Uize.returnTrue;
				} else if (!Uize.isFunction (_matcher)) {
					if (Uize.isRegExp (_matcher)) {
						_resolvedMatcher = function (_value) {return _matcher.test (_value)};
					} else {
						var
							_trueFlag = {},
							_valuesLookup = Uize.isPlainObject (_matcher)
								? Uize.map (_matcher,function (_value) {return _value && _trueFlag})
								: Uize.lookup (
									typeof _matcher == 'string'
										? Uize.Str.Split.split (_matcher.replace (/^\s*\[?\s*|\s*\]?\s*$/g,''),/\s*\|\s*/)
										: _matcher,
									_trueFlag
								)
						;
						_resolvedMatcher = function (_value) {return _valuesLookup [_value] == _trueFlag};
					}
				}
				return _resolvedMatcher;
			}
		});
	}
});

