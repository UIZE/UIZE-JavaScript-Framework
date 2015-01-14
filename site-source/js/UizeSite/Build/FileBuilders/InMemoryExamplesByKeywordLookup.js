/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Build.FileBuilders.InMemoryExamplesByKeywordLookup Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2012-2015 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 5
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =UizeSite.Build.FileBuilders.InMemoryExamplesByKeywordLookup= module defines a file builder for the in-memory examples-by-keyword lookup for the example pages of the UIZE Web site.

		*DEVELOPERS:* `Chris van Rensburg`

		Functions defined in the file builder are called as instance methods on an instance of a subclass of the =Uize.Services.FileBuilderAdapter= class, so the functions can access instance methods implemented in this class.
*/

Uize.module ({
	name:'UizeSite.Build.FileBuilders.InMemoryExamplesByKeywordLookup',
	builder:function () {
		return Uize.package ({
			description:'Examples-by-keyword lookup',
			urlMatcher:function (_urlParts) {
				return _urlParts.pathname == this.memoryUrl ('examples-by-keyword');
			},
			builderInputs:function (_urlParts) {
				return {filesIndex:this.memoryUrl ('examples.index')};
			},
			builder:function (_inputs) {
				var
					_examples = this.readFile ({path:_inputs.filesIndex}),
					_examplesByKeyword = {'':_examples}
				;
				for (
					var _exampleNo = -1, _examplesLength = _examples.length, _example, _keywords, _keywordsStr;
					++_exampleNo < _examplesLength;
				) {
					if (_keywordsStr = (_example = _examples [_exampleNo]).keywords) {
						for (
							var
								_keywordNo = -1,
								_keywords = _keywordsStr.split (' '),
								_keywordsLength = _keywords.length,
								_keyword
							;
							++_keywordNo < _keywordsLength;
						)
							(
								_examplesByKeyword [_keyword = _keywords [_keywordNo]] ||
								(_examplesByKeyword [_keyword] = [])
							).push (_example)
						;
					}
				}
				return _examplesByKeyword;
			}
		});
	}
});

