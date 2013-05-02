/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Data.PathsTree Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2013 UIZE
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
		The =Uize.Test.Uize.Data.PathsTree= module defines a suite of unit tests for the =Uize.Data.PathsTree= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Data.PathsTree',
	builder:function () {
		'use strict';

		return Uize.Test.declare ({
			title:'Uize.Data.PathsTree Module Test',
			test:[
				Uize.Test.requiredModulesTest ('Uize.Data.PathsTree'),
				Uize.Test.staticMethodsTest ([
					['Uize.Data.PathsTree.toList',[
						['Test that an empty object is encoded to an empty array',
							{},
							[]
						],
						['Test that an object with a single node is encoded to an array with a single element whose value is the name of that node',
							{Uize:0},
							['Uize']
						],
						['Test that multiple nodes at the same level in a tree is encoded correctly, using the default delimiter',
							{Uize:0,MyCompanySite:0},
							['Uize','MyCompanySite']
						],
						['Test that a node with a single child node is encoded correctly, using the default delimiter',
							{Uize:{Widget:0}},
							['Uize','Uize.Widget']
						],
						['Test that a child node supports everything that the root node supports',
							{Uize:{Node:0,Widget:{Bar:0,Form:0}}},
							['Uize','Uize.Node','Uize.Widget','Uize.Widget.Bar','Uize.Widget.Form']
						],
						['Test that a complex tree is encoded correctly',
							{Uize:{Fade:0,Color:0,Node:0,Widget:{Bar:{Slider:0},Form:0}},MyCompanySite:{Dialog:0,Page:0}},
							[
								'Uize',
								'Uize.Fade',
								'Uize.Color',
								'Uize.Node',
								'Uize.Widget',
								'Uize.Widget.Bar',
								'Uize.Widget.Bar.Slider',
								'Uize.Widget.Form',
								'MyCompanySite',
								'MyCompanySite.Dialog',
								'MyCompanySite.Page'
							]
						],
						['Test that a custom delimiter is handled correctly',
							[{Uize:{Node:0,Widget:{Bar:0,Form:0}}},'_'],
							['Uize','Uize_Node','Uize_Widget','Uize_Widget_Bar','Uize_Widget_Form']
						],
						['Test that the custom delimiter can be an empty string',
							[{Uize:{Node:0,Widget:{Bar:0,Form:0}}},''],							['Uize','UizeNode','UizeWidget','UizeWidgetBar','UizeWidgetForm']
						],
						['Test that the value null for the custom delimiter is defaulted correctly',
							[{Uize:{Node:0,Widget:{Bar:0,Form:0}}},null],
							['Uize','Uize.Node','Uize.Widget','Uize.Widget.Bar','Uize.Widget.Form']
						],
						['Test that the value undefined for the custom delimiter is defaulted correctly',
							[{Uize:{Node:0,Widget:{Bar:0,Form:0}}},undefined],
							['Uize','Uize.Node','Uize.Widget','Uize.Widget.Bar','Uize.Widget.Form']
						]
					]],
					['Uize.Data.PathsTree.fromList',[
						['Test that an empty array is decoded to an empty object',
							[{}],
							{}
						],
						['Test that an array with a single element whose value does not have a delimiter is decoded correctly to an object with a single node whose key is the array element value',
							[['Uize']],
							{Uize:0}
						],
						['Test that an array with multiple elements whose values do not have a delimiter is decoded correctly to an object with multiple nodes at the same level',
							[['Uize','MyCompanySite']],
							{Uize:0,MyCompanySite:0}
						],
						['Test that an array that has two values, representing a root path and a subpath, is decoded correctly to a node with a single child node',
							[['Uize','Uize.Widget']],
							{Uize:{Widget:0}}
						],
						['Test that a subpath supports everything that a root path supports',
							[['Uize','Uize.Node','Uize.Widget','Uize.Widget.Bar','Uize.Widget.Form']],
							{Uize:{Node:0,Widget:{Bar:0,Form:0}}}
						],
						['Test that a complex paths list is decoded correctly to a paths tree',
							[
								[
									'Uize',
									'Uize.Fade',
									'Uize.Color',
									'Uize.Node',
									'Uize.Widget',
									'Uize.Widget.Bar',
									'Uize.Widget.Bar.Slider',
									'Uize.Widget.Form',
									'MyCompanySite',
									'MyCompanySite.Dialog',
									'MyCompanySite.Page'
								]
							],
							{Uize:{Fade:0,Color:0,Node:0,Widget:{Bar:{Slider:0},Form:0}},MyCompanySite:{Dialog:0,Page:0}}
						],
						['Test that a custom delimiter is handled correctly',
							[['Uize','Uize_Node','Uize_Widget','Uize_Widget_Bar','Uize_Widget_Form'],'_'],
							{Uize:{Node:0,Widget:{Bar:0,Form:0}}}
						],
						['Test that the value null for the custom delimiter is defaulted correctly',
							[['Uize','Uize.Node','Uize.Widget','Uize.Widget.Bar','Uize.Widget.Form'],null],
							{Uize:{Node:0,Widget:{Bar:0,Form:0}}}
						],
						['Test that the value undefined for the custom delimiter is defaulted correctly',
							[['Uize','Uize.Node','Uize.Widget','Uize.Widget.Bar','Uize.Widget.Form'],undefined],
							{Uize:{Node:0,Widget:{Bar:0,Form:0}}}
						]
					]]
				])
			]
		});
	}
});

