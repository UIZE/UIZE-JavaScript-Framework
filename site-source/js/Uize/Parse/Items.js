/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Parse.Items Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 1
	codeCompleteness: 100
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Parse.Items= module implements an abstract base class for an items parser, where the parser classes for one or more item types can be configured in subclasses.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Parse.Items',
	superclass:'Uize.Parse.Base',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			constructor:function () {
				var m = this;
				m.items = [];
				m.workingItems = {};
				_superclass.apply (m,arguments);
			},

			staticProperties:{
				itemTypes:{}
			},

			instanceMethods:{
				parse:function (_source,_index) {
					var
						m = this,
						_sourceLength = (m.source = _source).length,
						_items = m.items,
						_workingItems = m.workingItems,
						_itemTypes = m.constructor.itemTypes,
						_keepParsing = true
					;
					m.isValid = true;
					_items.length = 0;
					m.index = _index || (_index = 0);
					while (_keepParsing && _index < _sourceLength) {
						for (var _itemType in _itemTypes) {
							var _item =
								_workingItems [_itemType] ||
								(_workingItems [_itemType] = new _itemTypes [_itemType])
							;
							_item.parse (_source,_index);
							if (_keepParsing = _item.isValid) {
								_items.push (_item);
								_workingItems [_itemType] = null;
								_index += _item.length;
								break;
							}
						}
					}
					m.length = _index - m.index;
				},

				serialize:function () {
					return this.isValid ? Uize.map (this.items,'value.serialize ()').join ('') : '';
				}
			}
		});
	}
});

