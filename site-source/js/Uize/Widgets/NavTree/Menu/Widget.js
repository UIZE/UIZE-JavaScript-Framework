/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.NavTree.Menu.Widget Class
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
		The =Uize.Widgets.NavTree.Menu.Widget= module implements a widget class.

		*DEVELOPERS:* `Chris van Rensburg`

		Visual Sampler
			Below is a visual sampler of the =Uize.Widgets.NavTree.Menu.Widget= class...

			....................................................
			<< widget >>

			widgetClass: Uize.Widgets.NavTree.Menu.VisualSampler
			....................................................
*/

Uize.module ({
	name:'Uize.Widgets.NavTree.Menu.Widget',
	superclass:'Uize.Widget.Tree.MenuAbstract',
	required:[
		'Uize.Widget.mV2',
		'Uize.Widgets.NavTree.Menu.Html',
		'Uize.Widgets.NavTree.Menu.Css'
	],
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			mixins:Uize.Widget.mV2,

			instanceMethods:{
				getItemClassName:function (_item,_depth) {
					var m = this;
					return (
						m.cssClass (_depth ? 'subMenuItem' : 'menuItem') +
						(
							_item.expanded
								? (' ' + m.cssClass (_depth ? 'subMenuItemActive' : 'menuItemActive'))
								: ''
						) +
						(
							m.Class.itemHasChildren (_item)
								? (' ' + m.cssClass (_depth ? 'subMenuItemHasChildren' : 'menuItemHasChildren'))
								: ''
						)
					);
				}
			},

			set:{
				built:true,
				html:Uize.Widgets.NavTree.Menu.Html
			},

			staticProperties:{
				cssModule:Uize.Widgets.NavTree.Menu.Css
			}
		});
	}
});

