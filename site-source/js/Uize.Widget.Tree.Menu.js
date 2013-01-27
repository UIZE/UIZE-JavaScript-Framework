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
	required:'Uize.Node',
	builder:function (_superclass) {
		'use strict';

		var
			_undefined,
			_true = true,
			_false = false,
			_Uize_Node = Uize.Node
		;

		/*** General Variables ***/
			var
				_pathToResources = Uize.pathToResources + 'Uize_Widget_Tree_Menu/',
				_zIndex = 10000
			;

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					_undefined,
					function () {
						var _this = this;
						_this.wire ('Changed.items',function () {_this.setExpandedDepth (0)});
					}
				),
				_classPrototype = _class.prototype
			;

		/*** Private Instance Methods ***/
			_classPrototype._ensureItemWired = function (_itemSpecifier) {
				var
					_this = this,
					_itemsWiredMap = _this._itemsWiredMap
				;
				if (!_itemsWiredMap [_itemSpecifier]) {
					/*** iterate through and wire items ***/
						Uize.forEach (
							_itemSpecifier
								? _this.getItemFromSpecifier (_itemSpecifier).items
								: _this.get ('items'),
							function (_item,_itemNo) {
								var _subItemSpecifier = _itemSpecifier + (_itemSpecifier && 'x') + _itemNo;
								_this.wireNode (
									_subItemSpecifier + 'TitleLink',
									'mouseover',
									function () {_this.collapseAllBut (_subItemSpecifier)}
								);
							}
						);

					/*** code for managing dismiss when mousing out of the menu ***/
						/* NOTE:
							sure, you could have more anonymous functions in this code, but sharing a single reference across all occurrences should provide better performance
						*/
						var
							_clearDismissTimeout = function () {
								if (_this._dismissTimeout)
									_this._dismissTimeout = clearTimeout (_this._dismissTimeout)
								;
							},
							_dismiss = function () {
								_clearDismissTimeout ();
								_this.setExpandedDepth (0);
							},
							_setDismissTimeout = function () {
								_clearDismissTimeout ();
								_this._dismissTimeout = setTimeout (_dismiss,_this._dismissDelay);
							}
						;
						_this.wireNode (
							_itemSpecifier + (_itemSpecifier && 'Children'),
							{
								mouseover:_clearDismissTimeout,
								mouseout:_setDismissTimeout,
								click:_dismiss
							}
						);

					_itemsWiredMap [_itemSpecifier] = _true;
				}
			};

			_classPrototype._getItemClassName = function (_item,_depth) {
				var _this = this;
				return (
					(_depth ? _this._subMenuItemCssClass : _this._menuItemCssClass) +
					(
						_item.expanded
							? (' ' + (_depth ? _this._subMenuItemActiveCssClass : _this._menuItemActiveCssClass))
							: ''
					) +
					(
						_class.itemHasChildren (_item)
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
			};

		/*** Public Instance Methods ***/
			_classPrototype.setItemExpanded = function (_itemSpecifier,_expanded) {
				var
					_this = this,
					_item = _this.getItemFromSpecifier (_itemSpecifier)
				;
				if (typeof _expanded != 'boolean') _expanded = _item.expanded === _false;
				if (_expanded != _item.expanded) {
					var _depth = _itemSpecifier.split (_this.get ('itemDelimiter')).length - 1;
					_item.expanded = _expanded;
					_this.setNodeProperties (
						_itemSpecifier + 'TitleLink',
						{className:_this._getItemClassName (_item,_depth)}
					);
					_expanded && _this._ensureItemWired (_itemSpecifier);
					if (_class.itemHasChildren (_item)) {
						var _itemChildrenNode = _this.getNode (_itemSpecifier + 'Children');
						_this.displayNode (_itemChildrenNode,_expanded);
						if (_expanded) {
							/*** move submenu node to root of document, if necessary ***/
								_this.globalizeNode (_itemChildrenNode);

							/*** position the submenu ***/
								_this.setNodeStyle (_itemChildrenNode,{zIndex:_zIndex + _depth});
								_Uize_Node.setAbsPosAdjacentTo (
									_itemChildrenNode,
									_this.getNode (_itemSpecifier + 'TitleLink'),
									_depth ? 'x' : 'y'
								);
						}
					}
				}
			};

			_classPrototype.wireUi = function () {
				var _this = this;
				if (!_this.isWired) {
					_this._itemsWiredMap = {};
					_this._ensureItemWired ('');

					_superclass.prototype.wireUi.call (_this);
				}
			};

		/*** State Properties ***/
			_class.stateProperties ({
				_dismissDelay:{
					name:'dismissDelay',
					value:400
				},
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
			});

		/*** Override Initial Values for Inherited State Properties ***/
			_class.set ({
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
										_class.itemIsDivider (_item)
											? (
												'<div class="' + (_depth ? input.subMenuDividerClass : input.menuDividerClass) + '" href="javascript://">&nbsp;</div>'
											) : (
												'<a id="' + _idPrefix + '-' + _itemSpecifier + 'TitleLink" class="' + _this._getItemClassName (_item,_depth) + '" href="' + (_item.link || 'javascript://') + '"' + (_item.link ? '' : ' style="cursor:default;"') + '>' + _item.title + '</a>'
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
			});

		return _class;
	}
});

