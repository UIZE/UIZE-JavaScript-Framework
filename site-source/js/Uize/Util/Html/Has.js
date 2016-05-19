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
	required:'Uize.Util.Html.Encode',
	builder:function () {
		'use strict';

		var
			/*** Variables for Performance Optimization ***/
				_htmlEntityRegExp = Uize.Util.Html.Encode.entityRegExp
		;

		return Uize.package ({
			hasHtml:function (_string) {
				return (
					/<[^<]+>/.test (_string) ||
						/* NOTE:
							this is not the most robust test for HTML tags, so probably RegExpComposition should be used
						*/
					!!(_string + '').match (_htmlEntityRegExp)
				);
			}
		});
	}
});

