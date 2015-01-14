/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Node.VirtualEvent Package
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
		The =Uize.Node.VirtualEvent= module is deprecated *(DEPRECATED 2014-01-07)* and is an aggregation of the =Uize.Dom.VirtualEvent=, =Uize.Dom.VirtualEvents.ModClick=, and =Uize.Dom.VirtualEvents.Remain= modules under the =Uize.Dom= namespace.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Node.VirtualEvent',
	required:[
		'Uize.Dom.VirtualEvent',
		'Uize.Dom.VirtualEvents.ModClick',
		'Uize.Dom.VirtualEvents.Remain'
	],
	builder:function () {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_Uize = Uize,
				_Uize_Dom = _Uize.Dom,
				_Uize_Dom_VirtualEvents = _Uize_Dom.VirtualEvents
		;
		return _Uize.package (
			_Uize.copy (
				_Uize_Dom.VirtualEvent,
				_Uize_Dom_VirtualEvents.ModClick,
				_Uize_Dom_VirtualEvents.Remain
			)
		);
	}
});

