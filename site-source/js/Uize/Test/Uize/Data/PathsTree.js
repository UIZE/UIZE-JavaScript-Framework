/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Data.PathsTree Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2016 UIZE
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

		return Uize.Test.resolve ({
			title:'Uize.Data.PathsTree Module Test',
			test:[
				Uize.Test.requiredModulesTest ('Uize.Data.PathsTree'),
				Uize.Test.staticMethodsTest ([
					['Uize.Data.PathsTree.toList',[
						['An empty object is encoded to an empty array',
							{},
							[]
						],
						['An object with a single node is encoded to an array with a single element whose value is the name of that node',
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
						['A child node supports everything that the root node supports',
							{Uize:{Dom:0,Widget:{Bar:0,Form:0}}},
							['Uize','Uize.Dom','Uize.Widget','Uize.Widget.Bar','Uize.Widget.Form']
						],
						['A complex tree can be encoded',
							{Uize:{Fade:0,Color:0,Dom:0,Widget:{Bar:{Slider:0},Form:0}},MyCompanySite:{Dialog:0,Page:0}},
							[
								'Uize',
								'Uize.Fade',
								'Uize.Color',
								'Uize.Dom',
								'Uize.Widget',
								'Uize.Widget.Bar',
								'Uize.Widget.Bar.Slider',
								'Uize.Widget.Form',
								'MyCompanySite',
								'MyCompanySite.Dialog',
								'MyCompanySite.Page'
							]
						],
						['A custom delimiter can be specified',
							[{Uize:{Dom:0,Widget:{Bar:0,Form:0}}},'_'],
							['Uize','Uize_Dom','Uize_Widget','Uize_Widget_Bar','Uize_Widget_Form']
						],
						['The custom delimiter can be an empty string',
							[{Uize:{Dom:0,Widget:{Bar:0,Form:0}}},''],							['Uize','UizeDom','UizeWidget','UizeWidgetBar','UizeWidgetForm']
						],
						['When the value null is specified for the custom delimiter, the default delimiter is used',
							[{Uize:{Dom:0,Widget:{Bar:0,Form:0}}},null],
							['Uize','Uize.Dom','Uize.Widget','Uize.Widget.Bar','Uize.Widget.Form']
						],
						['When the value undefined is specified for the custom delimiter, the default delimiter is used',
							[{Uize:{Dom:0,Widget:{Bar:0,Form:0}}},undefined],
							['Uize','Uize.Dom','Uize.Widget','Uize.Widget.Bar','Uize.Widget.Form']
						]
					]],
					['Uize.Data.PathsTree.fromList',[
						['An empty array is decoded to an empty object',
							[[]],
							{}
						],
						['An array with a single element whose value does not have a delimiter is decoded to an object with a single node whose key is the array element value',
							[['Uize']],
							{Uize:0}
						],
						['An array with multiple elements whose values do not have a delimiter is decoded to an object with multiple nodes at the same level',
							[['Uize','MyCompanySite']],
							{Uize:0,MyCompanySite:0}
						],
						['An array that has two values, representing a root path and a subpath, is decoded to a node with a single child node',
							[['Uize','Uize.Widget']],
							{Uize:{Widget:0}}
						],
						['A subpath supports everything that a root path supports',
							[['Uize','Uize.Dom','Uize.Widget','Uize.Widget.Bar','Uize.Widget.Form']],
							{Uize:{Dom:0,Widget:{Bar:0,Form:0}}}
						],
						['A complex paths list can be decoded to a paths tree',
							[
								[
									'Uize',
									'Uize.Fade',
									'Uize.Color',
									'Uize.Dom',
									'Uize.Widget',
									'Uize.Widget.Bar',
									'Uize.Widget.Bar.Slider',
									'Uize.Widget.Form',
									'MyCompanySite',
									'MyCompanySite.Dialog',
									'MyCompanySite.Page'
								]
							],
							{Uize:{Fade:0,Color:0,Dom:0,Widget:{Bar:{Slider:0},Form:0}},MyCompanySite:{Dialog:0,Page:0}}
						],
						['A custom delimiter can be specified',
							[['Uize','Uize_Dom','Uize_Widget','Uize_Widget_Bar','Uize_Widget_Form'],'_'],
							{Uize:{Dom:0,Widget:{Bar:0,Form:0}}}
						],
						['When the value null is specified for the custom delimiter, the default delimiter is used',
							[['Uize','Uize.Dom','Uize.Widget','Uize.Widget.Bar','Uize.Widget.Form'],null],
							{Uize:{Dom:0,Widget:{Bar:0,Form:0}}}
						],
						['When the value undefined is specified for the custom delimiter, the default delimiter is used',
							[['Uize','Uize.Dom','Uize.Widget','Uize.Widget.Bar','Uize.Widget.Form'],undefined],
							{Uize:{Dom:0,Widget:{Bar:0,Form:0}}}
						]
					]]
				])
			]
		});
	}
});

