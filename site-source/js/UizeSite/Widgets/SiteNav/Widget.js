/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Widgets.SiteNav.Widget Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013-2015 UIZE
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
		The =UizeSite.Widgets.SiteNav.Widget= module implements a widget class.

		*DEVELOPERS:* `Chris van Rensburg`

		Visual Sampler
			Below is a visual sampler of the =UizeSite.Widgets.SiteNav.Widget= class...

			...................................................
			<< widget >>

			widgetClass: UizeSite.Widgets.SiteNav.VisualSampler
			...................................................
*/

Uize.module ({
	name:'UizeSite.Widgets.SiteNav.Widget',
	superclass:'Uize.Widgets.NavTree.List.Widget',
	required:[
		'Uize.Url',
		'UizeSite.SiteMap',
		'UizeSite.Widgets.SiteNav.Css'
	],
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			omegastructor:function () {
				var m = this;

				/*** adjust links to be relative to current document ***/
					var _getPathToRoot = m.callInherited ('getPathToRoot');

					if (_getPathToRoot) {
						var
							_pathnameToRoot = _getPathToRoot (),
							_pathname = Uize.Url.from (location.href).pathname.slice (1), // this seems fragile
							_itemToExpandTo
						;
						m.traverseTree ({
							itemHandler:
								function (_item,_itemSpecifier) {
									var _itemLink = _item.link;
									if (_itemLink != null) {
										if (!_itemToExpandTo && _itemLink == _pathname)
											_itemToExpandTo = _itemSpecifier
										;
										_item.link = _pathnameToRoot + _itemLink;
									}
								}
						});
						_itemToExpandTo
							? m.collapseAllBut (_itemToExpandTo)
							: m.setExpandedDepth (0)
						;
					}
			},

			set:{
				items:UizeSite.SiteMap ()
			},

			staticProperties:{
				cssModule:UizeSite.Widgets.SiteNav.Css
			}
		});
	}
});

