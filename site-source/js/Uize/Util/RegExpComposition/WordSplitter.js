/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Util.RegExpComposition.WordSplitter Object
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
		The =Uize.Util.RegExpComposition.WordSpliiter= package defines a regular expression composition object for matching non-word character sequences.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Util.RegExpComposition.WordSplitter',
	required:'Uize.Util.RegExpComposition',
	builder:function () {
		'use strict';

		return Uize.Util.RegExpComposition ({
			punctuation:/[\?!\.;:,&=\-\(\)\[\]"<>]+/,
			number:/\d+(?:\.\d+)?/,
			whitespace:/\s+/,
			wordSplitter:/{whitespace}|{punctuation}|{number}/
		});
	}
});

