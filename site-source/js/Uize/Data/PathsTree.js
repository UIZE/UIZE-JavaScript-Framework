/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Data.PathsTree Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2009-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 2
	codeCompleteness: 100
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Data.PathsTree= package provides methods for converting between a...

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Data.PathsTree',
	required:'Uize.Data.Flatten',
	builder:function () {
		'use strict';

		return Uize.package ({
			toList:function (_tree,_delimiter) {
				return Uize.keys (Uize.Data.Flatten.flatten (_tree,_delimiter,true));
			},

			fromList:function (_paths,_delimiter) {
				return Uize.Data.Flatten.unflatten (Uize.lookup (_paths,0),_delimiter);
			}
		});
	}
});
