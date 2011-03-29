/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeDotCom.BuildUtils
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2011 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*ScruncherSettings Mappings="=" LineCompacting="TRUE"*/

/*?
	Introduction
		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'UizeDotCom.BuildUtils',
	required:'Uize.Wsh.BuildUtils',
	builder:function () {
		/*** Variables for Scruncher Optimization ***/
			var _package = function () {};

		/*** Public Static Methods ***/
			_package.getFirstTitleSegment = function (_title) {return _title.match (/^\s*(.*?)\s*\|/) [1]};

			_package.getExamplesByKeyword = function () {
				var _examplesByKeyword = {};
				for (
					var
						_exampleNo = -1,
						_examples = Uize.Wsh.BuildUtils.getHtmlFilesInfo ('examples',_package.getFirstTitleSegment),
						_examplesLength = _examples.length,
						_example,
						_keywordsStr
					;
					++_exampleNo < _examplesLength;
				) {
					if (_keywordsStr = (_example = _examples [_exampleNo]).keywords) {
						var _keywords = _keywordsStr.split (' ');
						for (
							var _keywordNo = -1, _keywordsLength = _keywords.length, _keyword;
							++_keywordNo < _keywordsLength;
						)
							(
								_examplesByKeyword [_keyword = _keywords [_keywordNo]] ||
								(_examplesByKeyword [_keyword] = [])
							).push ({
								title:_example.title,
								url:'../' + _example.path,
								description:_example.description
							})
						;
					}
				}
				return _examplesByKeyword;
			};

		return _package;
	}
});

