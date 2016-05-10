/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.StateValues Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 1
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Widgets.StateValues= module provides properties for the possible values of various state properties that are common to all V2 widget classes.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widgets.StateValues',
	required:'Uize.Widgets.CssUtil',
	builder:function () {
		'use strict';

		return Uize.package ({
			size:Uize.keys (Uize.Widgets.CssUtil.sizes),
			locale:['en-US','en-ZZ','de-DE','fr-FR','ja_JP','nl-NL','ru-RU','zh-CN']
		});
	}
});

