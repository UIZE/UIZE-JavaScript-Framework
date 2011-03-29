/*
	This is an automatically generated module, compiled from the JavaScript template file:
		UizeDotCom.Templates.Tour.js.jst
*/

/*ScruncherSettings Mappings="=" LineCompacting="TRUE"*/

Uize.module ({
	name:'UizeDotCom.Templates.Tour',
	required:[
		'UizeDotCom.Examples',
		'Uize.Url'
	],
	builder:function () {
		var _package = function () {};

		/*** Public Static Methods ***/
			_package.process = function (input) {
				var output = [];

					var
						_tour = input.tour,
						_tourExamples = UizeDotCom.Examples ()
					;

					/*** if tour is not "all", find all pages for this specific tour ***/
						if (_tour.toLowerCase () != 'all') {
							var
								_examples = _tourExamples,
								_keywordsMatchRegExp = new RegExp ('\\b' + _tour + '\\b','i')
							;
							_tourExamples = [];
							for (var _exampleNo = -1, _examplesLength = _examples.length; ++_exampleNo < _examplesLength;) {
								var _example = _examples [_exampleNo];
								_keywordsMatchRegExp.test (_example.keywords) && _tourExamples.push (_example);
							}
						}

					var
						_tourExamplesLength = _tourExamples.length,
						_tourExampleUrlSuffix = '?tour=' + _tour,
						_pageNo = -1,
						_pageFileName = Uize.Url.from (input.pageUrl).fileName
					;

					function _getExamplePageLink (_example) {
						return _example.path.match (/[\\\/]([^\\\/]+)$/) [1] + _tourExampleUrlSuffix;
					}

				output.push ('\r\n\r\n<div id="page-tourPageTooltip" class="tourPageTooltip">\r\n	<div id="page-tourPageTooltip-title" class="tourPageTitle"></div>\r\n	<div id="page-tourPageTooltip-description" class="tourPageDescription"></div>\r\n	<div class="tourPageKeywords">TAGS: <span id="page-tourPageTooltip-keywords"></span></div>\r\n</div>\r\n\r\n<table class="tourPages">\r\n	<tr>');

						for (var _tourExampleNo = -1; ++_tourExampleNo < _tourExamplesLength;) {
							var _tourExample = _tourExamples [_tourExampleNo];
							if (_pageNo < 0 && _pageFileName == Uize.Url.from (_tourExample.path).fileName)
								_pageNo = _tourExampleNo
							;

				output.push ('<td>\r\n			<a href="',_getExamplePageLink (_tourExample),'" class="tourPage',_tourExampleNo == _pageNo ? ' tourCurrentPage' : '','"></a>\r\n		</td>');

						}

				output.push ('</tr>\r\n</table>\r\n');
				 var _previousExample = _pageNo > 0 ? _tourExamples [_pageNo - 1] : null;
				 if (_previousExample) {
				output.push ('\r\n<a href="',_getExamplePageLink (_previousExample),'" class="tourButton tourButtonPrevious"></a>');
				 }
				output.push ('\r\n');
				 var _nextExample = _pageNo < _tourExamplesLength - 1 ? _tourExamples [_pageNo + 1] : null;
				 if (_nextExample) {
				output.push ('\r\n<a href="',_getExamplePageLink (_nextExample),'" class="tourButton tourButtonNext"></a>');
				 }
				output.push ('\r\n\r\n');
				return output.join ('');
			};

		/*** Public Static Properties ***/
			_package.input = {
				tour:'string',
				pageUrl:'string'
			};

		return _package;
	}
});

