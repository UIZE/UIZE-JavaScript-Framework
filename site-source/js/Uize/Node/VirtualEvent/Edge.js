/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Node.VirtualEvent.Edge Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2015 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Object
	importance: 1
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Node.VirtualEvent.Edge= module is deprecated *(DEPRECATED 2014-01-07)* and is an alias to the =Uize.Dom.VirtualEvents.Edge= module, which is effectively the same module migrated to under the =Uize.Dom= namespace.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Node.VirtualEvent.Edge',
	required:'Uize.Dom.VirtualEvents.Edge',
	builder:function () {return Uize.Dom.VirtualEvents.Edge}
});

