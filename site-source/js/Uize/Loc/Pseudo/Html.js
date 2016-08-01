/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Loc.Pseudo.Html Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2016 UIZE
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
		The =Uize.Loc.Pseudo.Html= module provides a method to facilitate the [[http://en.wikipedia.org/wiki/Pseudolocalization][pseudo-localization]] of the resource strings of an application that contain HTML markup.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Loc.Pseudo.Html',
	required:[
		'Uize.Util.Html.Has',
		'Uize.Util.Matchers.AttributeMatcher',
		'Uize.Loc.Pseudo',
		'Uize.Loc.Pseudo.Xml',
		'Uize.Util.RegExpComposition.WordSplitterHtml'
	],
	builder:function () {
		'use strict';

		var
			/*** Variables for Performance Optimization ***/
				_hasHtml = Uize.Util.Html.Has.hasHtml,
				_pseudoLocalize = Uize.Loc.Pseudo.pseudoLocalize,

			/*** General Variables ***/
				_xmlPseudoLocalizeOptions = {
					wordSplitter:Uize.Util.RegExpComposition.WordSplitterHtml.get ('wordSplitter'),
					attributeMatcher:Uize.Util.Matchers.AttributeMatcher.resolve ([
						'title',
						'img@alt',
						'[input|textarea]@placeholder'
					]),
					tagNameMatcher:function (_tagName) {
						return _tagName != 'style' && _tagName != 'script';
					}
				}
		;

		return Uize.package ({
			pseudoLocalize:function (_sourceStr,_options) {
				_options = Uize.copy (_xmlPseudoLocalizeOptions,_options,{wrapper:''});
				var _pseudoLocalized = _hasHtml (_sourceStr);
				if (_pseudoLocalized) {
					var _startPos = (_sourceStr.match (/<html[\s>]/) || {}).index || 0;
					_pseudoLocalized =
						_sourceStr.slice (0,_startPos) +
						Uize.Loc.Pseudo.Xml.pseudoLocalize (
							_sourceStr.slice (_startPos)
								.replace (/(<(?:img|input|meta)\s+[^>]+[^\/])>/gi,'$1/>')
								.replace (/<br>/gi,'<br/>'),
							_options
						)
					;
				}
				return (
					!_pseudoLocalized ||
						// the string hasn't been pseudo-localized yet (because it didn't contain HTML)
					_pseudoLocalized.length < _sourceStr.length * .8
						// there must be some other errors in the HTML that prevent it from being parsed correctly
						? _pseudoLocalize (_sourceStr,_options)
						: _pseudoLocalized
				);
			}
		});
	}
});

