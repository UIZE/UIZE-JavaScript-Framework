/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Services.LocAdapter.mHtmlPseudoLocalization Mixin
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2015-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Mixin
	importance: 1
	codeCompleteness: 100
	docCompleteness: 10
*/

/*?
	Introduction
		The =Uize.Services.LocAdapter.mHtmlPseudoLocalization= mixin lets you mix in a true HTML pseudo-localization behavior for resource strings that contain HTML.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Services.LocAdapter.mHtmlPseudoLocalization',
	required:[
		'Uize.Util.Matchers.AttributeMatcher',
		'Uize.Loc.Pseudo.Xml'
	],
	builder:function () {
		'use strict';

		var
			/*** General Variables ***/
				_xmlPseudoLocalizeOptions = {
					attributeMatcher:Uize.Util.Matchers.AttributeMatcher.resolve ([
						'title',
						'img@alt',
						'[input|textarea]@placeholder'
					])
				}
		;

		return function (_class) {
			_class.declare ({
				instanceMethods:{
					pseudoLocalizeString:function _method (_stringInfo,_pseudoLocalizeOptions) {
						var
							m = this,
							_stringValue = _stringInfo.value,
							_pseudoLocalized =
								m.stringHasHtml (_stringInfo.path,_stringValue) &&
								Uize.Loc.Pseudo.Xml.pseudoLocalize (
									_stringValue
										.replace (/(<(?:img|input|meta)\s+[^>]+[^\/])>/gi,'$1/>')
										.replace (/<br>/gi,'<br/>'),
									Uize.copyInto (_xmlPseudoLocalizeOptions,_pseudoLocalizeOptions)
								)
						;
						return (
							!_pseudoLocalized ||
								// the string hasn't been pseudo-localized yet (because it didn't contain HTML)
							_pseudoLocalized.length < _stringValue.length * .8
								// there must be some other errors in the HTML that prevent it from being parsed correctly
								? _method.former.apply (m,arguments)
								: _pseudoLocalized
						);
					}
				}
			});
		};
	}
});

