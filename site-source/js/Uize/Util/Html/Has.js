/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Util.Html.Has Package
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
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Util.Html.Has= package defines a method for testing if strings contain HTML markup.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Util.Html.Has',
	required:[
		'Uize.Util.Html.Encode',
		'Uize.Util.RegExpComposition'
	],
	builder:function () {
		'use strict';

		var
			/*** Variables for Performance Optimization ***/
				_htmlEntityRegExp = Uize.Util.Html.Encode.entityRegExp,
				_htmlTagRegExp = Uize.Util.RegExpComposition ({
					singleQuotedAttributeValue:/'[^']*?'/,
					doubleQuotedAttributeValue:/"[^"]*?"/,
					unquotedAttributeValue:/[^'">\s]+/,
					attributeValue:/{doubleQuotedAttributeValue}|{singleQuotedAttributeValue}|{unquotedAttributeValue}/,
					tagName:/\w+/,
					attributeName:/\w+/,
					attribute:/{attributeName}(\s*=\s*(?:{attributeValue}))?/,
					closingTag:/<\s*\/\s*{tagName}\s*>/,
					openingOrSelfClosingTag:/<\s*{tagName}((\s+{attribute})+\s*|\s*)\/?\s*>/,
					htmlTag:/{closingTag}|{openingOrSelfClosingTag}/
				}).get ('htmlTag')
		;

		/*** Utility Functions ***/
			function _hasHtmlTag (_string) {
				return !!(_string + '').match (_htmlTagRegExp);
			}

			function _hasHtmlEntity (_string) {
				return !!(_string + '').match (_htmlEntityRegExp)
			}

		return Uize.package ({
			tagRegExp:_htmlTagRegExp,
			hasHtmlTag:_hasHtmlTag,
			hasHtmlEntity:_hasHtmlEntity,
			hasHtml:function (_string) {return _hasHtmlTag (_string) || _hasHtmlEntity (_string)}
		});
	}
});

