/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Node Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2014 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Test
	importance: 8
	codeCompleteness: 1
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Test.Uize.Node= module defines a suite of unit tests for the =Uize.Node= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Node',
	builder:function () {
		'use strict';

		return Uize.Test.resolve ({
			title:'Test for Uize.Node Module',
			test:[
				Uize.Test.requiredModulesTest ([
					'Uize.Node',
					'Uize.Dom.Basics',
					'Uize.Dom.Pos',
					'Uize.Dom.Text',
					'Uize.Dom.Util'
				]),
				Uize.Test.migratedStaticMethodsTest ([
					/*** static methods migrated to the Uize.Dom.Basics module ***/
						['Uize.Node.display','Uize.Dom.Basics.display'],
						['Uize.Node.doForAll','Uize.Dom.Basics.doForAll'],
						['Uize.Node.getById','Uize.Dom.Basics.getById'],
						['Uize.Node.find','Uize.Dom.Basics.find'],
						['Uize.Node.getStyle','Uize.Dom.Basics.getStyle'],
						['Uize.Node.getValue','Uize.Dom.Basics.getValue'],
						['Uize.Node.injectHtml','Uize.Dom.Basics.injectHtml'],
						['Uize.Node.isNode','Uize.Dom.Basics.isNode'],
						['Uize.Node.isOnNodeTree','Uize.Dom.Basics.isOnNodeTree'],
						['Uize.Node.joinIdPrefixAndNodeId','Uize.Dom.Basics.joinIdPrefixAndNodeId'],
						['Uize.Node.setClipRect','Uize.Dom.Basics.setClipRect'],
						['Uize.Node.setInnerHtml','Uize.Dom.Basics.setInnerHtml'],
						['Uize.Node.setOpacity','Uize.Dom.Basics.setOpacity'],
						['Uize.Node.setProperties','Uize.Dom.Basics.setProperties'],
						['Uize.Node.setStyle','Uize.Dom.Basics.setStyle'],
						['Uize.Node.setValue','Uize.Dom.Basics.setValue'],
						['Uize.Node.show','Uize.Dom.Basics.show'],
						['Uize.Node.unwire','Uize.Dom.Basics.unwire'],
						['Uize.Node.unwireEventsByOwnerId','Uize.Dom.Basics.unwireEventsByOwnerId'],
						['Uize.Node.wire','Uize.Dom.Basics.wire'],

					/*** static methods migrated to the Uize.Dom.Pos module ***/
						['Uize.Node.centerInWindow','Uize.Dom.Pos.centerInWindow'],
						['Uize.Node.doRectanglesOverlap','Uize.Dom.Pos.doRectanglesOverlap'],
						['Uize.Node.getCoords','Uize.Dom.Pos.getCoords'],
						['Uize.Node.getDimensions','Uize.Dom.Pos.getDimensions'],
						['Uize.Node.getDocumentScrollElement','Uize.Dom.Pos.getDocumentScrollElement'],
						['Uize.Node.getEventAbsPos','Uize.Dom.Pos.getEventAbsPos'],
						['Uize.Node.setAbsPos','Uize.Dom.Pos.setAbsPos'],
						['Uize.Node.setAbsPosAdjacentTo','Uize.Dom.Pos.setAbsPosAdjacentTo'],
						['Uize.Node.setCoords','Uize.Dom.Pos.setCoords'],

					/*** static methods migrated to the Uize.Dom.Text module ***/
						['Uize.Node.getText','Uize.Dom.Text.getText'],

					/*** static methods migrated to the Uize.Dom.Util module ***/
						['Uize.Node.showClickable','Uize.Dom.Util.showClickable']
				])
			]
		});
	}
});

