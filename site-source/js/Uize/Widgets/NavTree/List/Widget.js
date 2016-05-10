/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.NavTree.List.Widget Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 1
	codeCompleteness: 5
	docCompleteness: 5
*/

/*?
	Introduction
		The =Uize.Widgets.NavTree.List.Widget= module implements a widget class.

		*DEVELOPERS:* `Chris van Rensburg`

		Visual Sampler
			Below is a visual sampler of the =Uize.Widgets.NavTree.List.Widget= class...

			....................................................
			<< widget >>

			widgetClass: Uize.Widgets.NavTree.List.VisualSampler
			....................................................
*/

Uize.module ({
	name:'Uize.Widgets.NavTree.List.Widget',
	superclass:'Uize.Widget.Tree.ListAbstract',
	required:[
		'Uize.Widget.mV2',
		'Uize.Widgets.NavTree.List.Html',
		'Uize.Widgets.NavTree.List.Css',
		'Uize.Dom.Classes'
	],
	builder:function (_superclass) {
		'use strict';

		var _Uize_Dom_Classes = Uize.Dom.Classes;

		return _superclass.subclass ({
			mixins:Uize.Widget.mV2,

			instanceMethods:{
				setItemExpanded:function (_itemSpecifier,_expanded) {
					var m = this;
					if (m.isWired) {
						var
							_item = m.getItemFromSpecifier (_itemSpecifier),
							_togglerLink = m.getNode (_itemSpecifier + 'TogglerLink')
						;
						_expanded = _item.expanded = typeof _expanded == 'boolean' ? _expanded : _item.expanded === false;
						m.setNodeProperties (_togglerLink,{title:m.getTogglerTitle (_item)});
						_Uize_Dom_Classes.setState (
							_togglerLink,
							[m.cssClass ('collapsed'),m.cssClass ('expanded')],
							_expanded
						);
						m.displayNode (_itemSpecifier + 'Children',_expanded);
					} else {
						_superclass.doMy (m,'setItemExpanded',[_itemSpecifier,_expanded]);
					}
				}
			},

			set:{
				built:true,
				html:Uize.Widgets.NavTree.List.Html
			},

			staticProperties:{
				cssModule:Uize.Widgets.NavTree.List.Css
			}
		});
	}
});

