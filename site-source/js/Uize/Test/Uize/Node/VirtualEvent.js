/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Node.VirtualEvent Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2015 UIZE
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
		The =Uize.Test.Uize.Node.VirtualEvent= module defines unit tests to verify that the deprecated =Uize.Node.VirtualEvent= module is still supported and is a reference to the newer =Uize.Dom.VirtualEvent= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Node.VirtualEvent',
	builder:function () {
		'use strict';

		return Uize.Test.resolve ({
			title:'Test for Uize.Node.VirtualEvent Module',
			test:[
				Uize.Test.requiredModulesTest ([
					'Uize.Dom.VirtualEvent',
					'Uize.Dom.VirtualEvents.ModClick',
					'Uize.Dom.VirtualEvents.Remain',
					'Uize.Node.VirtualEvent'
				]),
				Uize.Test.migratedStaticMethodsTest ([
					/*** test methods migrated to Uize.Dom.VirtualEvent ***/
						['Uize.Node.VirtualEvent.register','Uize.Dom.VirtualEvent.register'],
						['Uize.Node.VirtualEvent.getCached','Uize.Dom.VirtualEvent.getCached'],
						['Uize.Node.VirtualEvent.resolve','Uize.Dom.VirtualEvent.resolve'],

					/*** test methods migrated to Uize.Dom.VirtualEvents.ModClick ***/
						['Uize.Node.VirtualEvent.altClick','Uize.Dom.VirtualEvents.ModClick.altClick'],
						['Uize.Node.VirtualEvent.click','Uize.Dom.VirtualEvents.ModClick.click'],
						['Uize.Node.VirtualEvent.ctrlAltClick','Uize.Dom.VirtualEvents.ModClick.ctrlAltClick'],
						['Uize.Node.VirtualEvent.ctrlClick','Uize.Dom.VirtualEvents.ModClick.ctrlClick'],
						['Uize.Node.VirtualEvent.shiftAltClick','Uize.Dom.VirtualEvents.ModClick.shiftAltClick'],
						['Uize.Node.VirtualEvent.shiftClick','Uize.Dom.VirtualEvents.ModClick.shiftClick'],
						['Uize.Node.VirtualEvent.shiftCtrlAltClick','Uize.Dom.VirtualEvents.ModClick.shiftCtrlAltClick'],
						['Uize.Node.VirtualEvent.shiftCtrlClick','Uize.Dom.VirtualEvents.ModClick.shiftCtrlClick'],

					/*** test methods migrated to Uize.Dom.VirtualEvents.Remain ***/
						['Uize.Node.VirtualEvent.keyRemainDown','Uize.Dom.VirtualEvents.Remain.keyRemainDown'],
						['Uize.Node.VirtualEvent.keyRemainUp','Uize.Dom.VirtualEvents.Remain.keyRemainUp'],
						['Uize.Node.VirtualEvent.makeRemainInStateEventMaker','Uize.Dom.VirtualEvents.Remain.makeRemainInStateEventMaker'],
						['Uize.Node.VirtualEvent.mouseRemainDown','Uize.Dom.VirtualEvents.Remain.mouseRemainDown'],
						['Uize.Node.VirtualEvent.mouseRemainOut','Uize.Dom.VirtualEvents.Remain.mouseRemainOut'],
						['Uize.Node.VirtualEvent.mouseRemainOver','Uize.Dom.VirtualEvents.Remain.mouseRemainOver'],
						['Uize.Node.VirtualEvent.mouseRemainUp','Uize.Dom.VirtualEvents.Remain.mouseRemainUp'],
						['Uize.Node.VirtualEvent.mouseRest','Uize.Dom.VirtualEvents.Remain.mouseRest'],
						['Uize.Node.VirtualEvent.remainBlurred','Uize.Dom.VirtualEvents.Remain.remainBlurred'],
						['Uize.Node.VirtualEvent.remainFocused','Uize.Dom.VirtualEvents.Remain.remainFocused']
				])
			]
		});

	}
});

