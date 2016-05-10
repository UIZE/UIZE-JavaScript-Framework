/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.SimpleStatsTable.TestsData Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013-2016 UIZE
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
		The =Uize.Widgets.SimpleStatsTable.TestsData= package provides some shareable test data for the visual sampler and visual tests for the =Uize.Widgets.SimpleStatsTable.Widget= class and subclasses.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widgets.SimpleStatsTable.TestsData',
	builder:function (_superclass) {
		'use strict';

		return {
			title:'This is the Table Heading',
			columns:[
				{
					title:'Item Type Heading'
				},
				{
					title:'Column 1 Heading',
					minColor:'hsl(200,100,0)',
					maxColor:'hsl(200,100,75)'
				},
				{
					title:'Column 2 Heading',
					minColor:'hsl(120,100,50)',
					maxColor:'hsl(0,100,50)'
				},
				{
					title:'Column 3 Heading',
					minColor:'hsl(120,100,50)',
					maxColor:'hsl(0,100,50)',
					minValue:0,
					maxValue:100
				}
			],
			rows:[
				['Row 1',0,12,100],
				['Row 2',15,-5,32],
				['Row 3',27,5,70],
				['Row 4',3,19,50],
				['Row 5',20,1,79]
			]
		};
	}
});

