/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Tree.Menu Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2008-2013 UIZE
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
	required:'Uize.Node',
	builder:function (_superclass) {
		'use strict';

		/*** General Variables ***/
			var _pathToResources = Uize.pathToResources + 'Uize_Widget_Tree_Menu/';

		return _superclass.subclass ({
			instanceMethods:{
				getItemClassName:function (_item,_depth) {
					var _this = this;
					return (
						(_depth ? _this._subMenuItemCssClass : _this._menuItemCssClass) +
						(
							_item.expanded
								? (' ' + (_depth ? _this._subMenuItemActiveCssClass : _this._menuItemActiveCssClass))
								: ''
						) +
						(
							_this.Class.itemHasChildren (_item)
								? (
									' ' +
									(
										_depth
											? _this._subMenuItemChildrenIndicatorCssClass
											: _this._menuItemChildrenIndicatorCssClass
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
							_this = this,
							_idPrefix = input.idPrefix,
							_htmlChunks = []
						;
						_this.traverseTree ({
							itemHandler:
								function (_item,_itemSpecifier,_depth) {
									_htmlChunks.push (
										_this.Class.itemIsDivider (_item)
											? (
												'<div class="' + (_depth ? input.subMenuDividerClass : input.menuDividerClass) + '" href="javascript://">&nbsp;</div>'
											) : (
												'<a id="' + _idPrefix + '-' + _itemSpecifier + 'TitleLink" class="' + _this.getItemClassName (_item,_depth) + '" href="' + (_item.link || 'javascript://') + '"' + (_item.link ? '' : ' style="cursor:default;"') + '>' + _item.title + '</a>'
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

