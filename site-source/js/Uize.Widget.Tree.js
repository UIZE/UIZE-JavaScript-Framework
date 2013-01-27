/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Tree Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2003-2013 UIZE
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

		/*** Variables for Scruncher Optimization ***/
			var
				_undefined,
				_false = false
			;

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (),
				_classPrototype = _class.prototype
			;

		/*** Public Static Methods ***/
			_class.itemHasChildren = function (_item) {
				return !!(_item && _item.items && _item.items.length);
			};

			_class.itemIsDivider = function (_item) {
				return !!_item && _item.title == '-' && !_class.itemHasChildren (_item);
			};

		/*** Private Instance Methods ***/
			_classPrototype._canonicalizeItemSpecifier = function (_itemSpecifier) {
				return (
					typeof _itemSpecifier == 'string'
						? _itemSpecifier
						: this.getItemInfoFromSpecifier (_itemSpecifier).itemSpecifier
				);
			};

		/*** Public Instance Methods ***/
			_classPrototype.getItemFromSpecifier = function (_itemSpecifier) {
				return this.getItemInfoFromSpecifier (_itemSpecifier).item;
			};

			_classPrototype.getItemInfoFromSpecifier = function (_itemSpecifier) {
				var
					_this = this,
					_item,
					_items = _this._items,
					_canonicalItemSpecifier = [],
					_titleParts = [],
					_itemSpecifierWasArray = Uize.isArray (_itemSpecifier),
					_itemDelimiter = _this._itemDelimiter,
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
			};

			_classPrototype.setExpandedDepth = function (_expandedDepth,_itemSpecifier) {
				var _this = this;
				_this.traverseTree ({
					itemHandler:
						function (_item,_itemSpecifier,_depth) {
							_this.setItemExpanded (_itemSpecifier,_depth < _expandedDepth);
						},
					itemSpecifier:_itemSpecifier
				});
			};

			_classPrototype.setItemExpanded = function (_itemSpecifier,_expanded) {
				/* NOTE:
					- override the implementation of this method in a subclass
					- fall back to using this implementation in subclass implementation if widget is not yet wired
				*/
				var _item = this.getItemFromSpecifier (_itemSpecifier);
				_item.expanded = typeof _expanded == 'boolean' ? _expanded : _item.expanded === _false;
			};

			_classPrototype.collapseAllBut = function (_expandedItemSpecifier) {
				var
					_this = this,
					_itemDelimiter = _this._itemDelimiter
				;
				_expandedItemSpecifier = _this._canonicalizeItemSpecifier (_expandedItemSpecifier);
				_this.traverseTree ({
					itemHandler:
						function (_item,_itemSpecifier) {
							_this.setItemExpanded (
								_itemSpecifier,
								!(_expandedItemSpecifier + _itemDelimiter).indexOf (_itemSpecifier + _itemDelimiter)
							);
						}
				});
			};

			_classPrototype.traverseTree = function (_params) {
				var
					_this = this,
					_itemSpecifier = _params.itemSpecifier,
					_itemDelimiter = _this._itemDelimiter,
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
					_itemSpecifier = _this._canonicalizeItemSpecifier (_itemSpecifier);
					_traverseItem (_this.getItemFromSpecifier (_itemSpecifier),_itemSpecifier,0);
				} else {
					_traverseItems (_this._items,'',0);
				}
			};

		/*** State Properties ***/
			_class.stateProperties ({
				_itemDelimiter:{
					name:'itemDelimiter',
					value:'x'
				},
				_items:{
					name:'items',
					value:[],
					onChange:function () {
						var _this = this;
						if (_this.isWired) {
							_this.removeUi ();
							_this.insertUi ();
						}
					}
				},
				_value:{
					name:'value',
					value:[]
				}
			});

		/*** Override Initial Values for Inherited State Properties ***/
			_class.set ({
				built:_false
			});

		return _class;
	}
});

