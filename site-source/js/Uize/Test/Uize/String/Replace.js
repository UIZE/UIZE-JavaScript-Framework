/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.String.Replace Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013-2014 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Test
	importance: 1
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Test.Uize.String.Replace= module defines unit tests to verify that the deprecated =Uize.String.Replace= module is still supported and is a reference to the newer =Uize.Str.Replace= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.String.Replace',
	required:'Uize.Str.Replace',
	builder:function () {
		'use strict';

		return Uize.Test.moduleAliasTest ('Uize.String.Replace','Uize.Str.Replace');
	}
});

