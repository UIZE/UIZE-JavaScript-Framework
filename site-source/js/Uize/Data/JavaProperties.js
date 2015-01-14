/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Data.JavaProperties Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2015 UIZE
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
		The =Uize.Data.JavaProperties= module is deprecated *(DEPRECATED 2014-07-25)* and is an alias to the =Uize.Loc.FileFormats.JavaProperties= module, which is effectively the same module migrated to under the =Uize.Loc.FileFormats= namespace.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Data.JavaProperties',
	required:'Uize.Loc.FileFormats.JavaProperties',
	builder:function () {return Uize.Loc.FileFormats.JavaProperties}
});

