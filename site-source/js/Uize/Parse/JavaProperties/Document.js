/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Parse.JavaProperties.Document Object
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014 UIZE
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
	required:[
		'Uize.Str.Whitespace',
		'Uize.Parse.JavaProperties.Property',
		'Uize.Parse.JavaProperties.Comment'
	],
	builder:function () {
		'use strict';

		var
			_class,

			/*** Variables for Performance Optimization ***/
				_Uize_Parse_JavaProperties = Uize.Parse.JavaProperties,
				_Uize_Parse_JavaProperties_Property = _Uize_Parse_JavaProperties.Property,
				_indexOfNonWhitespace = Uize.Str.Whitespace.indexOfNonWhitespace
		;

		return _class = Uize.mergeInto (
			function (_source,_index) {
				var m = this;
				m._items = m.items = [];
				m._currentItems = {};
				m.parse (_source,_index);
			},

			{
				prototype:{
					source:'',
					index:0,
					length:0,
					isValid:true,

					parse:function (_source,_index) {
						function _tryParseItem (_itemType) {
							var _item =
								m._currentItems [_itemType] ||
								(m._currentItems [_itemType] = new _Uize_Parse_JavaProperties [_itemType])
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
						m.index = _index || (_index = 0);
						while (
							_index < _sourceLength &&
							(
								_tryParseItem ('Comment') ||
								_tryParseItem ('Property') ||
								_eatWhitespace () ||
								true
							)
						);
						m.length = _index - m.index;
					},

					serialize:function () {
						return this.isValid ? Uize.map (this._items,'value.serialize ()').join ('\n') : '';
					}
				},

				fromHash:function (_hash) {
					var
						_document = new _class (),
						_items = _document._items
					;
					Uize.forEach (
						_hash,
						function (_propertyValue,_propertyName) {
							var _property = new _Uize_Parse_JavaProperties_Property ('key=value');
							_property.name.name = _propertyName;
							_property.value.value = _propertyValue;
							_items.push (_property);
						}
					);
					return _document.serialize ();
				},

				toHash:function (_documentText) {
					var _hash = {};
					Uize.forEach (
						(new _class (_documentText)).items,
						function (_property) {
							if (_property.name && _property.value)
								_hash [_property.name.name] = _property.value.value
							;
						}
					);
					return _hash;
				},
			}
		);
	}
});

