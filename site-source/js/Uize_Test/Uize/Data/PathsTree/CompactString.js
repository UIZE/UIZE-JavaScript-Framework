/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Data.PathsTree.CompactString Class
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
		The =Uize.Test.Uize.Data.PathsTree.CompactString= module defines a suite of unit tests for the =Uize.Data.PathsTree.CompactString= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Data.PathsTree.CompactString',
	builder:function () {
		'use strict';

		return Uize.Test.declare ({
			title:'Uize.Data.PathsTree.CompactString Module Test',
			test:[
				Uize.Test.requiredModulesTest ('Uize.Data.PathsTree.CompactString'),
				Uize.Test.staticMethodsTest ([
					['Uize.Data.PathsTree.CompactString.fromCompactString',[
						['Test that an empty string is decoded to an empty paths tree object',
							'',
							{}
						],
						['Test that a compact string containing only a single root path is decoded to an object with a single node',
							'Uize',
							{Uize:0}
						],
						['Test that a compact string containing multiple root paths is decoded to a paths tree object with multiple nodes at the root level',
							'Uize|UizeSite',
							{Uize:0,UizeSite:0}
						],
						['Test that a compact string for a paths tree containing only a root path and a subpath is decoded correctly',
							'Uize[Widget]',
							{Uize:{Widget:0}}
						],
						['Test that a subpath in a compact string supports everything that a root path in a compact string supports',
							'Uize[Node|Widget[Bar|Form]]',
							{Uize:{Node:0,Widget:{Bar:0,Form:0}}}
						],
						['Test that a complex compact string is decoded correctly to a paths tree object',
							'Uize[Fade|Color|Node|Widget[Bar[Slider]|Form]]|UizeSite[Delve|Page]',
							{Uize:{Fade:0,Color:0,Node:0,Widget:{Bar:{Slider:0},Form:0}},UizeSite:{Delve:0,Page:0}}
						],
						['Test that the omission of closers in a compact string is handled correctly',
							'Uize[Node|Widget[Bar|Form',
							{Uize:{Node:0,Widget:{Bar:0,Form:0}}}
						],
						['Test that custom opener, closer, and separator is handled correctly',
							['Uize<_Node::Widget<_Bar::Form_>_>',{opener:'<_',closer:'_>',separator:'::'}],
							{Uize:{Node:0,Widget:{Bar:0,Form:0}}}
						],
						['Test that the value null for custom opener, closer, and separator are defaulted',
							['Uize[Node|Widget[Bar|Form]]',{opener:null,closer:null,separator:null}],
							{Uize:{Node:0,Widget:{Bar:0,Form:0}}}
						],
						['Test that the value undefined for custom opener, closer, and separator are defaulted',
							['Uize[Node|Widget[Bar|Form]]',{opener:undefined,closer:undefined,separator:undefined}],
							{Uize:{Node:0,Widget:{Bar:0,Form:0}}}
						],
						/*** test empty subpaths ***/
							['Test that an empty root path as a parent of a subpath is handled correctly',
								'[Widget]',
								{'':{Widget:0}}
							],
							['Test that an empty root path at the head of a compact string is handled correctly',
								'|Uize',
								{'':0,Uize:0}
							],
							['Test that an empty root path in the middle of a compact string is handled correctly',
								'Uize||UizeSite',
								{Uize:0,'':0,UizeSite:0}
							],
							['Test that an empty root path at the tail of a compact string is handled correctly',
								'Uize|',
								{Uize:0,'':0}
							],
							['Test that an empty subpath tree is handled correctly',
								'Uize[]',
								{Uize:{'':0}}
							],
							['Test that an empty root path that is a parent of an empty subpath is handled correctly',
								'[[Widget]]',
								{'':{'':{Widget:0}}}
							]
					]],
					['Uize.Data.PathsTree.CompactString.toCompactString',[
						['Test that an empty object is encoded to an empty string',
							{},
							''
						],
						['Test that an object with a single node is encoded to just the name of that node',
							{Uize:0},
							'Uize'
						],
						['Test that multiple nodes at the same level in a tree is encoded correctly and the default delimiter is used',
							{Uize:0,UizeSite:0},
							'Uize|UizeSite'
						],
						['Test that a node with a single child node is encoded correctly',
							{Uize:{Widget:0}},
							'Uize[Widget]'
						],
						['Test that a child node supports everything that the root node supports',
							{Uize:{Node:0,Widget:{Bar:0,Form:0}}},
							'Uize[Node|Widget[Bar|Form]]'
						],
						['Test that a complex tree is encoded correctly',
							{Uize:{Fade:0,Color:0,Node:0,Widget:{Bar:{Slider:0},Form:0}},UizeSite:{Delve:0,Page:0}},
							'Uize[Fade|Color|Node|Widget[Bar[Slider]|Form]]|UizeSite[Delve|Page]'
						],
						['Test that custom opener, closer, and separator is handled correctly',
							[{Uize:{Node:0,Widget:{Bar:0,Form:0}}},{opener:'<_',closer:'_>',separator:'::'}],
							'Uize<_Node::Widget<_Bar::Form_>_>'
						],
						['Test that custom opener, closer, and separator can all be empty strings',
							[{Uize:{Node:0,Widget:{Bar:0,Form:0}}},{opener:'',closer:'',separator:''}],
							'UizeNodeWidgetBarForm'
						],
						['Test that the value null for custom opener, closer, and separator are defaulted',
							[{Uize:{Node:0,Widget:{Bar:0,Form:0}}},{opener:null,closer:null,separator:null}],
							'Uize[Node|Widget[Bar|Form]]'
						],
						['Test that the value undefined for custom opener, closer, and separator are defaulted',
							[{Uize:{Node:0,Widget:{Bar:0,Form:0}}},{opener:undefined,closer:undefined,separator:undefined}],
							'Uize[Node|Widget[Bar|Form]]'
						],
						/*** test empty subpaths ***/
							['Test that an empty root path as a parent of a subpath is handled correctly',
								{'':{Widget:0}},
								'[Widget]'
							],
							['Test that an empty root path as the first root path is handled correctly',
								{'':0,Uize:0},
								'|Uize'
							],
							['Test that an empty root path in the middle of several root paths is handled correctly',
								{Uize:0,'':0,UizeSite:0},
								'Uize||UizeSite'
							],
							['Test that an empty root path as the last root path is handled correctly',
								{Uize:0,'':0},
								'Uize|'
							],
							['Test that an empty subpath tree is handled correctly',
								{Uize:{'':0}},
								'Uize[]'
							],
							['Test that an empty root path that is a parent of an empty subpath is handled correctly',
								{'':{'':{Widget:0}}},
								'[[Widget]]'
							]
					]]
				])
			]
		});
	}
});

