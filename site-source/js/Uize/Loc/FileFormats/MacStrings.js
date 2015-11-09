/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Loc.FileFormats.MacStrings Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2015 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 1
	codeCompleteness: 100
	docCompleteness: 50
*/

/*?
	Introduction
		The =Uize.Loc.FileFormats.MacStrings= module provides support for serializing to and parsing from [[https://developer.apple.com/library/mac/documentation/Cocoa/Conceptual/LoadingResources/Strings/Strings.html][Mac OS / iOS Strings Files]].

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Loc.FileFormats.MacStrings',
	required:[
		'Uize.Str.Whitespace',
		'Uize.Parse.Code.CStyleSingleLineComment',
		'Uize.Parse.Code.CStyleMultiLineComment',
		'Uize.Parse.Code.StringLiteral',
		'Uize.Parse.MacStrings.String'
	],
	builder:function () {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_undefined,
				_indexOfNonWhitespace = Uize.Str.Whitespace.indexOfNonWhitespace,
				_Uize_Parse_Code_StringLiteral = Uize.Parse.Code.StringLiteral
		;

		/*** Utility Functions ***/
			function _parserClass (_constructor,_instanceMethods) {
				Uize.copyInto (_constructor.prototype,_instanceMethods);
				return _constructor;
			}

		/*** Parser Objects ***/
			var
				_currentItems = {},
				_ItemsList = _parserClass (
					function () {
						this._items = this.items = [];
					},
					{
						parse:function (_source,_index) {
							function _eatWhitespace () {
								_index = (_indexOfNonWhitespace (_source,_index) + 1 || _sourceLength + 1) - 1;
							}
							var
								m = this,
								_sourceLength = (m.source = _source).length,
								_items = m._items
							;
							m.isValid = true;
							m.index = _index || (_index = 0);
							m.length = _items.length = 0;

							function _tryParseItem (_itemType,_itemClass) {
								var _item = _currentItems [_itemType] || (_currentItems [_itemType] = new _itemClass);
								_item.parse (_source,_index);
								if (_item.isValid) {
									_items.push (_item);
									_currentItems [_itemType] = null;
									_index += _item.length;
								}
								return _item.isValid;
							}
							while (m.isValid && _index < _sourceLength) {
								_eatWhitespace ();
								if (_index < _sourceLength)
									m.isValid =
										_tryParseItem ('SingleLineComment',_SingleLineComment) ||
										_tryParseItem ('MultiLineComment',_MultiLineComment) ||
										_tryParseItem ('String',_String)
									;
								;
							}
							if (m.isValid)
								m.length = _index - m.index
							;
						},

						serialize:function () {
							return this.isValid ? Uize.map (this._items,'value.serialize ()').join ('\n') : '';
						}
					}
				),

				_SingleLineComment = Uize.Parse.Code.CStyleSingleLineComment,
				_MultiLineComment = Uize.Parse.Code.CStyleMultiLineComment,
				_String = Uize.Parse.MacStrings.String
			;

		return Uize.package ({
			from:function (_toDecode) {
				var
					_itemsList = new _ItemsList,
					_strings = {}
				;
				_itemsList.parse (_toDecode);
				Uize.forEach (
					_itemsList.items,
					function (_item) {
						if (_item.constructor == _String)
							_strings [_item.stringKey.value] = _item.stringValue.value
						;
					}
				);
				return _strings;
				/*?
					Static Methods
						Uize.Loc.FileFormats.MacStrings.from
							Returns an object, being the resource strings parsed from the specified source string.

							SYNTAX
							.......................................................
							stringsOBJ = Uize.Loc.FileFormats.MacStrings.from (macStringsSTR);
							.......................................................

							NOTES
							- see the companion =Uize.Loc.FileFormats.MacStrings.to= static method
				*/
			},

			to:function (_toEncode) {
				function _getQuotedStr (_value) {
					_stringLiteralParser.value = _value;
					_stringLiteralParser.isValid = true;
					return _stringLiteralParser.serialize ();
				}
				var
					_lines = [],
					_stringLiteralParser = new _Uize_Parse_Code_StringLiteral
				;
				Uize.forEach (
					_toEncode,
					function (_value,_key) {_lines.push (_getQuotedStr (_key) + ' = ' + _getQuotedStr (_value) + ';')}
				);
				return _lines.join ('\n');
				/*?
					Static Methods
						Uize.Loc.FileFormats.MacStrings.to
							Returns a string, being the specified array of records serialized to a CSV formatted data string.

							SYNTAX
							.....................................................
							macStringsSTR = Uize.Loc.FileFormats.MacStrings.to (stringsOBJ);
							.....................................................

							NOTES
							- see the companion =Uize.Loc.FileFormats.MacStrings.from= static method
				*/
			}
		});
	}
});

