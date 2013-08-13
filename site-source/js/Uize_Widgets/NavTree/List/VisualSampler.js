/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.NavTree.List.VisualSampler Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 1
	codeCompleteness: 5
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Widgets.NavTree.List.VisualSampler= class implements a visual sampler widget for the =Uize.Widgets.NavTree.List.Widget= class.

		*DEVELOPERS:*
*/

Uize.module ({
	name:'Uize.Widgets.NavTree.List.VisualSampler',
	superclass:'Uize.Widgets.VisualSampler.Widget',
	required:'Uize.Widgets.NavTree.List.Widget',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			omegastructor:function () {
				this.addSample ({
					items:[
						{
							title:'Pets',
							items:[
								{
									title:'Dogs',
									items:[
										{
											title:'Small Breeds',
											items:[
												{title:'West Highland White'},
												{title:'Mexican Hairless'},
												{title:'Miniature Chihuahua'},
												{title:'Teacup Poodle'}
											]
										},
										{
											title:'Large Breeds',
											items:[
												{title:'Afghan'},
												{title:'Great Dane'},
												{title:'Irish Wolfhound'},
												{title:'St. Bernard'}
											]
										}
									]
								},
								{
									title:'Cats',
									items:[
										{title:'Persian'},
										{title:'Siamese'},
										{title:'Hairless'}
									]
								},
								{
									title:'Other',
									items:[
										{title:'Bunny'},
										{title:'Hamster'},
										{title:'Mouse'},
										{title:'Rat'}
									]
								}
							]
						},
						{
							title:'Wild Animals',
							items:[
								{
									title:'Dogs',
									items:[
										{title:'Coyote'},
										{title:'Dingo'}
									]
								},
								{
									title:'Cats',
									items:[
										{title:'Bobcat'},
										{title:'Cheetah'},
										{title:'Leopard'},
										{title:'Lion'},
										{title:'Lynx'},
										{title:'Mountain Lion'},
										{title:'Tiger'}
									]
								},
								{
									title:'Other',
									items:[
										{title:'Aardvark'},
										{title:'Elephant'},
										{title:'Hedgehog'},
										{title:'Opossum'},
										{title:'Water Buffalo'},
										{title:'Wildebeest'},
										{title:'Wild Boar'},
										{title:'Zebra'}
									]
								}
							]
						}
					]
				});
			},

			staticProperties:{
				widgetClass:Uize.Widgets.NavTree.List.Widget
			}
		});
	}
});

