/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Loc.FileFormats.MacStrings Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2016 UIZE
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
		'Uize.Parse.MacStrings.Document',
		'Uize.Parse.MacStrings.String',
		'Uize.Parse.Code.Whitespace'
	],
	builder:function () {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_Uize_Parse_MacStrings_Document = Uize.Parse.MacStrings.Document
		;

		return Uize.package ({
			from:function (_toDecode) {
				var _strings = {};
				Uize.forEach (
					(new _Uize_Parse_MacStrings_Document (_toDecode)).items,
					function (_item) {
						if (_item.stringKey && _item.stringValue)
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
				var
					_document = new _Uize_Parse_MacStrings_Document,
					_itemParser = Uize.Parse.MacStrings.String,
					_items = _document.items
				;
				Uize.forEach (
					_toEncode,
					function (_stringValue,_stringKey) {
						var _item = new _itemParser ('"key" = "value";');
						_item.stringKey.value = _stringKey;
						_item.stringValue.value = _stringValue;
						_items.length && _items.push (new Uize.Parse.Code.Whitespace ('\n'));
						_items.push (_item);
					}
				);
				return _document.serialize ();
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

