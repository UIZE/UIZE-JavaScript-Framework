/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Tree Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2003-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 5
	codeCompleteness: 100
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Widget.Tree= class is a base class for hierarchical collapsible/expandable tree widgets of many kinds, including lists, drop-down menus, etc.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widget.Tree',
	builder:function (_superclass) {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_undefined,
				_false = false
		;

		/*** Private Instance Methods ***/
			function _canonicalizeItemSpecifier (m,_itemSpecifier) {
				return (
					typeof _itemSpecifier == 'string'
						? _itemSpecifier
						: m.getItemInfoFromSpecifier (_itemSpecifier).itemSpecifier
				);
			}

		return _superclass.subclass ({
			instanceMethods:{
				getItemFromSpecifier:function (_itemSpecifier) {
					return this.getItemInfoFromSpecifier (_itemSpecifier).item;
				},

				getItemInfoFromSpecifier:function (_itemSpecifier) {
					var
						m = this,
						_item,
						_items = m._items,
						_canonicalItemSpecifier = [],
						_titleParts = [],
						_itemSpecifierWasArray = Uize.isArray (_itemSpecifier),
						_itemDelimiter = m._itemDelimiter,
						_itemSpecifierLevels = _itemSpecifierWasArray ? _itemSpecifier : _itemSpecifier.split (_itemDelimiter),
						_itemSpecifierLevelsLength = _itemSpecifierLevels.length
					;
					for (var _levelNo = -1; ++_levelNo < _itemSpecifierLevelsLength;) {
						var _itemSpecifierForLevel = _itemSpecifierLevels [_levelNo];
						if (_itemSpecifierWasArray && typeof _itemSpecifierForLevel == 'string')
							_itemSpecifierForLevel = Uize.findRecordNo (_items,{title:_itemSpecifierForLevel})
						;
						_item = _items [_itemSpecifierForLevel];
						if (_item) {
							_items = _item.items;
							_canonicalItemSpecifier.push (_itemSpecifierForLevel);
							_titleParts.push (_item.title);
						} else {
							break;
						}
					}
					return {
						item:_item,
						titleParts:_titleParts,
						itemSpecifier:_item ? _canonicalItemSpecifier.join (_itemDelimiter) : ''
					};
				},

				setExpandedDepth:function (_expandedDepth,_itemSpecifier) {
					var m = this;
					m.traverseTree ({
						itemHandler:
							function (_item,_itemSpecifier,_depth) {
								m.setItemExpanded (_itemSpecifier,_depth < _expandedDepth);
							},
						itemSpecifier:_itemSpecifier
					});
				},

				setItemExpanded:function (_itemSpecifier,_expanded) {
					/* NOTE:
						- override the implementation of this method in a subclass
						- fall back to using this implementation in subclass implementation if widget is not yet wired
					*/
					var _item = this.getItemFromSpecifier (_itemSpecifier);
					_item.expanded = typeof _expanded == 'boolean' ? _expanded : _item.expanded === _false;
				},

				collapseAllBut:function (_expandedItemSpecifier) {
					var
						m = this,
						_itemDelimiter = m._itemDelimiter
					;
					_expandedItemSpecifier = _canonicalizeItemSpecifier (m,_expandedItemSpecifier);
					m.traverseTree ({
						itemHandler:
							function (_item,_itemSpecifier) {
								m.setItemExpanded (
									_itemSpecifier,
									!(_expandedItemSpecifier + _itemDelimiter).indexOf (_itemSpecifier + _itemDelimiter)
								);
							}
					});
				},

				traverseTree:function (_params) {
					var
						m = this,
						_itemSpecifier = _params.itemSpecifier,
						_itemDelimiter = m._itemDelimiter,
						_nop = Uize.nop,
						_itemHandler = _params.itemHandler || _nop,
						_beforeSubItemsHandler = _params.beforeSubItemsHandler || _nop,
						_afterSubItemsHandler = _params.afterSubItemsHandler || _nop
					;
					function _traverseItem (_item,_itemSpecifier,_depth) {
						_itemHandler (_item,_itemSpecifier,_depth);
						var _itemItems = _item.items;
						if (_itemItems && _itemItems.length) {
							_beforeSubItemsHandler (_item,_itemSpecifier,_depth);
							_traverseItems (_itemItems,_itemSpecifier + _itemDelimiter,_depth + 1);
							_afterSubItemsHandler (_item,_itemSpecifier,_depth);
						}
					}
					function _traverseItems (_items,_itemSpecifierPrefix,_depth) {
						for (var _itemNo = -1, _itemsLength = _items.length; ++_itemNo < _itemsLength;)
							_traverseItem (_items [_itemNo],_itemSpecifierPrefix + _itemNo,_depth)
						;
					}
					if (_itemSpecifier) {
						_itemSpecifier = _canonicalizeItemSpecifier (m,_itemSpecifier);
						_traverseItem (m.getItemFromSpecifier (_itemSpecifier),_itemSpecifier,0);
					} else {
						_traverseItems (m._items,'',0);
					}
				}
			},

			staticMethods:{
				itemHasChildren:function (_item) {
					return !!(_item && _item.items && _item.items.length);
				},

				itemIsDivider:function (_item) {
					return !!_item && _item.title == '-' && !this.itemHasChildren (_item);
				}
			},

			stateProperties:{
				_itemDelimiter:{
					name:'itemDelimiter',
					value:'x'
				},
				_items:{
					name:'items',
					value:[],
					onChange:function () {
						var m = this;
						if (m.isWired) {
							m.removeUi ();
							m.insertUi ();
						}
					}
				},
				_value:{
					name:'value',
					value:[]
				}
			},

			set:{
				built:_false
			}
		});
	}
});

