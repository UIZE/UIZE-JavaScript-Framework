/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.CssUtil Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 3
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Widgets.CssUtil= class provides utilities to facilitate ensuring standardized styling throughout the various built-in widgets of the UIZE JavaScript Framework.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widgets.CssUtil',
	builder:function () {
		'use strict';

		return {
			sizes:{
				tiny:{
					font:12,
					outer:23
				},
				small:{
					font:13,
					outer:28
				},
				medium:{
					font:15,
					outer:38
				},
				large:{
					font:21,
					outer:51
				}
			}
		};
	}
});

