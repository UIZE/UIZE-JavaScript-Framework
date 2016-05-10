/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Util.Matchers.AttributeMatcher Package
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
		The =Uize.Util.Matchers.AttributeMatcher= package provides a way to resolve an attribute matcher expression to an attribute matcher function.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Util.Matchers.AttributeMatcher',
	required:[
		'Uize.Util.Matchers.Base',
		'Uize.Util.Matchers.ValueListMatcher'
	],
	builder:function () {
		'use strict';

		var
			/*** Variables for Scuncher Optimization ***/
				_resolveValueListMatcher = Uize.Util.Matchers.ValueListMatcher.resolve,

			/*** references to methods used internally ***/
				_resolve
		;

		return Uize.Util.Matchers.Base.extend ({
			resolve:_resolve = function (_matcher) {
				var _resolvedMatcher = _matcher;
				if (!_matcher) {
					_resolvedMatcher = Uize.returnTrue;
				} else if (!Uize.isFunction (_matcher)) {
					if (typeof _matcher == 'string') {
						var _atPos = _matcher.indexOf ('@');
						_matcher = {
							tag:_matcher.substr (0,_atPos),
							attribute:_matcher.slice (_atPos + 1)
						};
					}
					if (Uize.isPlainObject (_matcher)) {
						var
							_tagMatcher = _resolveValueListMatcher (_matcher.tag),
							_attributeMatcher = _resolveValueListMatcher (_matcher.attribute)
						;
						_resolvedMatcher = function (_attributeInfo) {
							return _tagMatcher (_attributeInfo.tag) && _attributeMatcher (_attributeInfo.attribute);
						};
					} else if (Uize.isArray (_matcher)) {
						var
							_subMatches = Uize.map (_matcher,_resolve),
							_subMatchesLength = _subMatches.length
						;
						_resolvedMatcher = function (_attributeInfo) {
							var _result = false;
							for (var _subMatchNo = -1; !_result && ++_subMatchNo < _subMatchesLength;)
								_result = _subMatches [_subMatchNo] (_attributeInfo)
							;
							return _result;
						};
					}
				}
				return _resolvedMatcher;
			}
		});
	}
});

