/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Data.MacStrings Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 1
	codeCompleteness: 5
	docCompleteness: 5
*/

/*?
	Introduction
		The =Uize.Data.MacStrings= module provides support for serializing to and parsing from [[][Mac OS / iOS Strings Files]], with configurable options.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Data.MacStrings',
	required:'Uize.Data.NameValueRecords',
	builder:function () {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_undefined,

			/*** General Variables ***/
				_optionDefaults = {
					stringComments:false  // true | false
				}
		;

		/*** Utility Functions ***/
			function _getDefaultedOption (_options,_optionName) {
				var _optionValue = _options ? _options [_optionName] : _undefined;
				return _optionValue == _undefined ? _optionDefaults [_optionName] : _optionValue;
			}

			function _getQuotedStr (_string) {
				return (
					'"' +
					_string
						.replace (/\\/g,'\\\\')
						.replace (/\n/g,'\\n')
						.replace (/\r/g,'\\r')
						.replace (/"/g,'\\"') +
					'"'
				);
			}

			function _charsLookup (_charsStr) {
				return Uize.lookup (_charsStr.split (''));
			}

			function _parserClass (_constructor,_instanceMethods) {
				Uize.copyInto (_constructor.prototype,_instanceMethods);
				return _constructor;
			}

		/*** Parser Objects ***/
			var
				_whitespaceCharsLookup = _charsLookup (' \t\r\n'), // TODO: make this more exhaustive
				_currentItems = {},
				_ItemsList = _parserClass (
					function () {
						var m = this;
						m._items = m.items = [];
					},
					{
						parse:function (_source,_index) {
							function _eatWhitespace () {
								while (_index < _sourceLength && _whitespaceCharsLookup [_source.charAt (_index)])
									_index++
								;
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
							return this.isValid ? Uize.map (this._items,'value.serialize ()').join ('') : '';
						}
					}
				),

				_SingleLineComment = _parserClass (
					function () {
					},
					{
						parse:function (_source,_index) {
							var
								m = this,
								_sourceLength = (m.source = _source).length
							;
							m.isValid = false;
							m.index = _index || (_index = 0);
							m.length = 0;
							m.comment = '';
							if (m.isValid = _source.substr (_index,2) == '//') {
								_index += 2;
								_index = Math.min (
									(_source.indexOf ('\r',_index) + 1 || _sourceLength + 1) - 1,
									(_source.indexOf ('\n',_index) + 1 || _sourceLength + 1) - 1
								);
								m.comment = _source.slice (m.index,_index);
								m.length = _index - m.index;
							}
						},

						serialize:function () {return this.comment}
					}
				),

				_MultiLineComment = _parserClass (
					function () {
					},
					{
						parse:function (_source,_index) {
							var
								m = this,
								_sourceLength = (m.source = _source).length
							;
							m.isValid = false;
							m.index = _index || (_index = 0);
							m.length = 0;
							m.comment = '';
							if (
								m.isValid =
									_source.substr (_index,2) == '/*' &&
									(_index = _source.indexOf ('*/',_index + 2)) > -1
							) {
								_index += 2;
								m.comment = _source.slice (m.index,_index);
								m.length = _index - m.index;
							}
						},

						serialize:function () {return this.comment}
					}
				),

				_String = _parserClass (
					function () {
						var m = this;
						m.stringKey = new _StringKeyOrValue;
						m.stringValue = new _StringKeyOrValue;
					},
					{
						parse:function (_source,_index) {
							function _eatWhitespace () {
								while (_index < _sourceLength && _whitespaceCharsLookup [_source.charAt (_index)])
									_index++
								;
							}
							var
								m = this,
								_sourceLength = (m.source = _source).length
							;
							m.isValid = false;
							m.index = _index || (_index = 0);
							m.length = 0;
							m.stringKey.parse (_source,_index);
							if (m.stringKey.isValid) {
								_index += m.stringKey.length;
								_eatWhitespace ();
								if (_source.charAt (_index) == '=') {
									_index++;
									_eatWhitespace ();
									m.stringValue.parse (_source,_index);
									if (m.stringValue.isValid) {
										_index += m.stringValue.length;
										_eatWhitespace ();
										if (_source.charAt (_index) == ';') {
											_index++;
											m.length = _index - m.index;
											m.isValid = true;
										}
									}
								}
							}
						},

						serialize:function () {
							return this.isValid ? this.stringKey.serialize () + ' = ' + this.stringValue.serialize () : '';
						}
					}
				),

				_StringKeyOrValue = _parserClass (
					function () {
					},
					{
						parse:function (_source,_index) {
							var
								m = this,
								_sourceLength = (m.source = _source).length
							;
							m.isValid = false;
							m.index = _index || (_index = 0);
							m.length = 0;
							m.value = '';
							if (_source.charAt (_index) == '"') {
								_index++;
								var _inEscape = false;
								while (_index < _sourceLength) {
									var _char = _source.charAt (_index);
									if (_char == '"' && !_inEscape) {
										m.isValid = true;
										m.value = _source.slice (m.index + 1,_index)
											.replace (/\\n/g,'\n')
											.replace (/\\r/g,'\r')
											.replace (/\\"/g,'"')
											.replace (/\\\\/g,'\\')
											/* TODO: implement a more robust approach to unescaping */
										;
										m.length = ++_index - m.index;
										break;
									} else {
										_inEscape = _inEscape ? false : _char == '\\';
										_index++;
									}
								}
							}
						},

						serialize:function () {return this.isValid ? _getQuotedStr (this.value) : ''}
					}
				)
			;

		return Uize.package ({
			from:function (_toDecode,_decodingOptions) {
				var
					_stringComments = _getDefaultedOption (_decodingOptions,'stringComments'),
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
						Uize.Data.MacStrings.from
							Returns an object, being the resource strings parsed from the specified source string.

							SYNTAX
							.......................................................
							stringsOBJ = Uize.Data.MacStrings.from (macStringsSTR);
							.......................................................

							VARIATION
							..........................................................................
							stringsOBJ = Uize.Data.MacStrings.from (macStringsSTR,decodingOptionsOBJ);
							..........................................................................

							When the optional =decodingOptionsOBJ= parameter is specified, then...

							The value of the =encodingOptionsOBJ= parameter should be an object, with properties as follows...

							DECODING OPTIONS
							....................................................................
							{
								stringComments:stringCommentsBOOL  // optional, defaults to false
							}
							....................................................................

							stringComments
								A boolean, specifying whether or not comments preceding string entries should be expressed in the resulting object as properties.

								NOTES
								- the default value for this option is =false=

							NOTES
							- see the companion =Uize.Data.MacStrings.to= static method
				*/
			},

			to:function (_toEncode,_encodingOptions) {
				var
					_stringComments = _getDefaultedOption (_encodingOptions,'stringComments')
				;
				return Uize.map (
					Uize.Data.NameValueRecords.fromHash (_toEncode),
					function (_nameValue) {
						return _getQuotedStr (_nameValue.name) + ' = ' + _getQuotedStr (_nameValue.value) + ';';
					}
				).join ('\n');
				/*?
					Static Methods
						Uize.Data.MacStrings.to
							Returns a string, being the specified array of records serialized to a CSV formatted data string.

							SYNTAX
							.....................................................
							macStringsSTR = Uize.Data.MacStrings.to (stringsOBJ);
							.....................................................

							VARIATION
							........................................................................
							macStringsSTR = Uize.Data.MacStrings.to (stringsOBJ,encodingOptionsOBJ);
							........................................................................

							When the optional =encodingOptionsOBJ= parameter is specified, then...

							The value of the =encodingOptionsOBJ= parameter should be an object, with properties as follows...

							ENCODING OPTIONS
							....................................................................
							{
								stringComments:stringCommentsBOOL  // optional, defaults to false
							}
							....................................................................

							stringComments
								A boolean, specifying whether or not comments preceding string entries should be expressed in the resulting object as properties.

								NOTES
								- the default value for this option is =false=

							NOTES
							- see the companion =Uize.Data.MacStrings.from= static method
				*/
			}
		});
	}
});

