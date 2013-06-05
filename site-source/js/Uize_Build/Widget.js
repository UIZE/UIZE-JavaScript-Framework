/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Build.Widget Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 1
	codeCompleteness: 100
	docCompleteness: 4
*/

/*?
	Introduction
		The =Uize.Build.Widget= package provides a convenient way to stub out a UIZE V2 widget class.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Build.Widget',
	required:[
		'Uize.Build.Util'
	],
	builder:function () {
		'use strict';

		return Uize.package ({
			perform;function (_params) {
				/*
					- use Url.modulePathResolver to determine where to write files
					- params
						- namespace
						- superclass (optional, defaults to Uize.Widget.V2)
						- required (optional)
						- hasHtml (false|true, defaults to true)
						- hasCss (false|true, defaulst to true)
						- hasAssets (false|true, defaults to false)
					- files to build and write
						- Widget.js
						- Css.csst
						- Html.jst
						- VisualSamplers.js
						- VisualTests.js
				*/
			}
		});
	}
});

