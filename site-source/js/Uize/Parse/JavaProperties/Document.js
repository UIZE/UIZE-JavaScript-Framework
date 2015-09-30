/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Parse.JavaProperties.Document Object
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2015 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Object
	importance: 1
	codeCompleteness: 100
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Parse.JavaProperties.Document= module provides methods for parsing and serializing [[http://en.wikipedia.org/wiki/.properties][Java properties]] files.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Parse.JavaProperties.Document',
	superclass:'Uize.Parse.Base',
	required:[
		'Uize.Str.Whitespace',
		'Uize.Parse.JavaProperties.Property',
		'Uize.Parse.Code.PoundComment'
	],
	builder:function (_superclass) {
		'use strict';

		var
			/*** Variables for Performance Optimization ***/
				_Uize_Parse = Uize.Parse,
				_indexOfNonWhitespace = Uize.Str.Whitespace.indexOfNonWhitespace
		;

		return _superclass.subclass ({
			constructor:function () {
				var m = this;
				m._items = m.items = [];
				m._currentItems = {};
				_superclass.apply (m,arguments);
			},

			instanceProperties:{
				parserClassesByType:{
					comment:_Uize_Parse.Code.PoundComment,
					property:_Uize_Parse.JavaProperties.Property
				}
			},

			instanceMethods:{
				parse:function (_source,_index) {
					function _tryParseItem (_itemType) {
						var _item =
							m._currentItems [_itemType] ||
							(m._currentItems [_itemType] = new m.parserClassesByType [_itemType])
						;
						_item.parse (_source,_index);
						if (_item.isValid) {
							_items.push (_item);
							m._currentItems [_itemType] = null;
							_index += _item.length;
						}
						return _item.isValid;
					}
					function _eatWhitespace () {
						_index = (_indexOfNonWhitespace (_source,_index) + 1 || _sourceLength + 1) - 1;
					}
					var
						m = this,
						_sourceLength = (m.source = _source = _source || '').length,
						_items = m._items
					;
					_items.length = 0;
					m.isValid = true;
					m.index = _index || (_index = 0);
					while (
						_index < _sourceLength &&
						(
							_tryParseItem ('comment') ||
							_tryParseItem ('property') ||
							_eatWhitespace () ||
							true
						)
					);
					m.length = _index - m.index;
				},

				serialize:function () {
					return this.isValid ? Uize.map (this._items,'value.serialize ()').join ('\n') : '';
				}
			}
		});
	}
});

