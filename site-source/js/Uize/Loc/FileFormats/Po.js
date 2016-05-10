/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Loc.FileFormats.Po Package
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
		The =Uize.Loc.FileFormats.Po= module provides support for serializing to and parsing from GNU gettext [[https://www.gnu.org/software/gettext/manual/html_node/PO-Files.html][PO files]].

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Loc.FileFormats.Po',
	required:[
		'Uize.Parse.Po.Document',
		'Uize.Parse.Po.NameValue',
		'Uize.Parse.Code.Whitespace'
	],
	builder:function () {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_Uize_Parse = Uize.Parse,
				_Uize_Parse_Po = Uize.Parse.Po,

			/*** Variables for Performance Optimization ***/
				_Uize_Parse_Po_Document = _Uize_Parse_Po.Document,
				_Uize_Parse_Po_NameValue = _Uize_Parse_Po.NameValue,
				_Uize_Parse_Code_Whitespace = _Uize_Parse.Code.Whitespace,

			/*** General Variables ***/
				_msgstrPluralRegExp = /msgstr\[(\d+)\]/
		;

		return Uize.package ({
			from:function (_stringsFileStr) {
				var
					_strings = {},
					_stringId,
					_stringValue
				;
				Uize.forEach (
					(new _Uize_Parse_Po_Document (_stringsFileStr)).items,
					function (_item) {
						if (_item.name && _item.value) {
							var
								_itemName = _item.name.name,
								_itemValue = _item.value.value
							;
							if (_itemName == 'msgid' || _itemName == 'msgid_plural') {
								if (_stringId)
									_strings [_stringId] = _stringValue
								;
								_stringId = _itemValue;
								_stringValue = _itemName == 'msgid' ? '' : [];
							} else if (_itemName == 'msgstr') {
								_stringValue = _itemValue;
							} else if (_msgstrPluralRegExp.test (_itemName)) {
								_stringValue [_itemName.match (_msgstrPluralRegExp) [1]] = _itemValue;
							}
						}
					}
				);
				if (_stringId)
					_strings [_stringId] = _stringValue
				;
				return _strings;
				/*?
					Static Methods
						Uize.Loc.FileFormats.Po.from
							Returns an object, being the properties parsed from the specified PO file string.

							SYNTAX
							......................................................
							stringsOBJ = Uize.Loc.FileFormats.Po.from (poFileSTR);
							......................................................

							NOTES
							- see the companion =Uize.Loc.FileFormats.Po.to= static method
				*/
			},

			to:function (_strings) {
				var
					_document = new _Uize_Parse_Po_Document (),
					_items = _document.items,
					_isFirstString = true
				;
				Uize.forEach (
					_strings,
					function (_stringValue,_stringId) {
						_isFirstString
							? (_isFirstString = false)
							: _items.push (new _Uize_Parse_Code_Whitespace ('\n\n'))
						;
						if (Uize.isArray (_stringValue)) {
							var _msgidPlural = new _Uize_Parse_Po_NameValue ('msgid_plural ""');
							_msgidPlural.value.value = _stringId;
							_items.push (_msgidPlural);
							Uize.forEach (
								_stringValue,
								function (_pluralValue,_pluralNo) {
									var _msgstr = new _Uize_Parse_Po_NameValue ('msgstr[' + _pluralNo + '] ""');
									_msgstr.value.value = _pluralValue;
									_items.push (
										new _Uize_Parse_Code_Whitespace ('\n'),
										_msgstr
									);
								}
							);
						} else {
							var
								_msgid = new _Uize_Parse_Po_NameValue ('msgid ""'),
								_msgstr = new _Uize_Parse_Po_NameValue ('msgstr ""')
							;
							_msgid.value.value = _stringId;
							_msgstr.value.value = _stringValue;
							_items.push (
								_msgid,
								new _Uize_Parse_Code_Whitespace ('\n'),
								_msgstr
							);
						}
					}
				);
				return _document.serialize ();
				/*?
					Static Methods
						Uize.Loc.FileFormats.Po.to
							Returns a string, being the specified properties object serialized to a PO file string.

							SYNTAX
							....................................................
							poFileSTR = Uize.Loc.FileFormats.Po.to (stringsOBJ);
							....................................................

							NOTES
							- see the companion =Uize.Loc.FileFormats.Po.from= static method
				*/
			}
		});
	}
});

