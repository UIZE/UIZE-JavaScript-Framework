/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Widgets.SiteMenu.Widget Class
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
		The =UizeSite.Widgets.SiteMenu.Widget= module implements a widget class.

		*DEVELOPERS:* `Chris van Rensburg`

		Visual Sampler
			Below is a visual sampler of the =UizeSite.Widgets.SiteMenu.Widget= class...

			....................................................
			<< widget >>

			widgetClass: UizeSite.Widgets.SiteMenu.VisualSampler
			....................................................
*/

Uize.module ({
	name:'UizeSite.Widgets.SiteMenu.Widget',
	superclass:'Uize.Widgets.NavTree.Menu.Widget',
	required:[
		'UizeSite.SiteMap',
		'UizeSite.Widgets.SiteMenu.Css'
	],
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			omegastructor:function () {
				var m = this;

				/*** adjust links to be relative to current document ***/
					var _getPathToRoot = m.callInherited ('getPathToRoot');

					if (_getPathToRoot) {
						var _pathToRoot = _getPathToRoot ();
						m.traverseTree ({
							itemHandler:
								function (_item) {
									if (_item.link != null) _item.link = _pathToRoot + _item.link;
								}
						});
					}
			},

			staticProperties:{
				cssModule:UizeSite.Widgets.SiteMenu.Css
			},

			set:{
				items:[{title:'',link:'index.html',items:Uize.clone (UizeSite.SiteMap ())}]
			}
		});
	}
});

