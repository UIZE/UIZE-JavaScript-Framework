/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Util.RegExpComposition.WordSplitterHtml Object
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2015-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Object
	importance: 1
	codeCompleteness: 100
	docCompleteness: 4
*/

/*?
	Introduction
		The =Uize.Util.RegExpComposition.WordSplitterHtml= package defines a regular expression composition object for matching non-word character sequences in strings that contains HTML tags and HTML entities.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Util.RegExpComposition.WordSplitterHtml',
	required:[
		'Uize.Util.RegExpComposition.WordSplitter',
		'Uize.Util.Html.Encode'
	],
	builder:function () {
		'use strict';

		return Uize.Util.RegExpComposition.WordSplitter.extend ({
			punctuation:/[\?!\.;:,&=\-\(\)\[\]"]+/,
			htmlEntity:Uize.Util.Html.Encode.entityRegExp,
			htmlTag:/<(?:.|[\r\n\f])+?>/,
			wordSplitter:/{htmlTag}|{htmlEntity}|{whitespace}|{punctuation}|{number}/
		});
	}
});

