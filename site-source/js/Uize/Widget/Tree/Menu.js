/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Tree.Menu Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2008-2015 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 6
	codeCompleteness: 100
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Widget.Tree.Menu= class extends its superclass by adding support for multi-level / nested drop down menus, with support for separator items.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widget.Tree.Menu',
	superclass:'Uize.Widget.Tree.MenuAbstract',
	builder:function (_superclass) {
		'use strict';

		/*** General Variables ***/
			var _pathToResources = Uize.pathToResources + 'Uize/Widget/Tree/Menu/';

		return _superclass.subclass ({
			instanceMethods:{
				getItemClassName:function (_item,_depth) {
					var m = this;
					return (
						(_depth ? m._subMenuItemCssClass : m._menuItemCssClass) +
						(
							_item.expanded
								? (' ' + (_depth ? m._subMenuItemActiveCssClass : m._menuItemActiveCssClass))
								: ''
						) +
						(
							m.Class.itemHasChildren (_item)
								? (
									' ' +
									(
										_depth
											? m._subMenuItemChildrenIndicatorCssClass
											: m._menuItemChildrenIndicatorCssClass
									)
								)
								: ''
						)
					);
				}
			},

			stateProperties:{
				_menuCssClass:'menuCssClass',
				_menuDividerClass:'menuDividerClass',
				_menuItemActiveCssClass:'menuItemActiveCssClass',
				_menuItemChildrenIndicatorCssClass:'menuItemChildrenIndicatorCssClass',
				_menuItemCssClass:'menuItemCssClass',
				_subMenuCssClass:'subMenuCssClass',
				_subMenuDividerClass:'subMenuDividerClass',
				_subMenuItemActiveCssClass:'subMenuItemActiveCssClass',
				_subMenuItemChildrenIndicatorCssClass:'subMenuItemChildrenIndicatorCssClass',
				_subMenuItemCssClass:'subMenuItemCssClass'
			},

			set:{
				html:{
					process:function (input) {
						var
							m = this,
							_idPrefix = input.idPrefix,
							_htmlChunks = []
						;
						m.traverseTree ({
							itemHandler:
								function (_item,_itemSpecifier,_depth) {
									_htmlChunks.push (
										m.Class.itemIsDivider (_item)
											? (
												'<div class="' + (_depth ? input.subMenuDividerClass : input.menuDividerClass) + '" href="javascript://">&nbsp;</div>'
											) : (
												'<a id="' + _idPrefix + '-' + _itemSpecifier + 'TitleLink" class="' + m.getItemClassName (_item,_depth) + '" href="' + (_item.link || 'javascript://') + '"' + (_item.link ? '' : ' style="cursor:default;"') + '>' + _item.title + '</a>'
											)
									);
								},
							beforeSubItemsHandler:
								function (_item,_itemSpecifier,_depth) {
									_htmlChunks.push ('<div id="' + _idPrefix + '-' + _itemSpecifier + 'Children" class="' + input.subMenuCssClass + '">');
								},
							afterSubItemsHandler:function () {_htmlChunks.push ('</div>\n')}
						});
						return (
							'<div id="' + _idPrefix + '" class="' + input.menuCssClass + '">' +
							_htmlChunks.join ('') +
							'<br style="clear:both;"/>' +
							'</div>\n'
						);
					}
				}
			}
		});
	}
});

