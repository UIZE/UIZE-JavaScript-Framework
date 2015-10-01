/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Util.RegExpComposition.PrintfWithParam Object
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013-2015 UIZE
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
		The =Uize.Util.RegExpComposition.PrintfWithParam= package defines a regular expression composition object for matching [[http://pubs.opengroup.org/onlinepubs/009695399/functions/printf.html][printf formatting specifier]] character sequences, with support for param / argument placeholders (such as "%1").

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Util.RegExpComposition.PrintfWithParam',
	required:'Uize.Util.RegExpComposition',
	builder:function () {
		'use strict';

		return Uize.Util.RegExpComposition ({
			// https://en.wikipedia.org/wiki/Printf_format_string#Format_placeholder_specification
			parameter:/\d+\$/,
			flags:/[\+ \-#0]{0,5}/,
				/* NOTES
					- this isn't robust, since it shouldn't be possible to have 5 of the same flag
					- some flags are only applicable for numeric types, so the string "above 5% and" does not have the placeholder "% a" since this is not a valid placeholder
				*/
			width:/-?\d+/,
			precision:/\d+/,
			length:/hh?|ll?|[Lzjt]/,
			type:/[diufFeEgGxXoscPaAn%]/,
			specifier:/(?:{parameter})?(?:{flags})?(?:{width})?(?:\.{precision})?(?:{length})?{type}/,
			placeholder:/%{specifier}/,
			placeholderWithCapture:/%({specifier})/
		});
	}
});

