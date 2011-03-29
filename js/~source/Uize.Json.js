/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Json Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2004-2011 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*ScruncherSettings Mappings="=" LineCompacting="TRUE"*/

/* Module Meta Data
	type: Package
	importance: 7
	codeCompleteness: 100
	testCompleteness: 0
	docCompleteness: 90
*/

/*?
	Introduction
		The =Uize.Json= module provides versatile methods for serializing and deserializing objects to and from the [[http://en.wikipedia.org/wiki/JSON][JSON]] (JavaScript Object Notation) format.

		*DEVELOPERS:* `Chris van Rensburg`

		The =Uize.Json= module provides versatile serializaton options to permit a wide array of results, from prettified JSON (with linebreaks, indentation, key sorting, etc.) to compact (efficient for AJAX communication).
*/

Uize.module ({
	name:'Uize.Json',
	builder:function () {
		/*** Variables for Scruncher Optimization ***/
			var
				_package = function () {},
				_undefined,
				_true = true,
				_false = false,
				_string = 'string',
				_sacredEmptyArray = []
			;

		/*** Global Variables ***/
			var
				_someSpaces = '       ',
				_keyPadding = _someSpaces.replace (/ /g,_someSpaces).replace (/ /g,_someSpaces),
				_serializableBuiltInObjects = {RegExp:1,Date:1,String:1,Number:1,Boolean:1},
				_reservedWordsMap = {
					'break':1, 'boolean':1, 'case':1, 'catch':1, 'continue':1, 'const':1, 'debugger':1, 'default':1, 'delete':1, 'do':1, 'else':1, 'export':1, 'false':1, 'finally':1, 'for':1, 'function':1, 'if':1, 'import':1, 'in':1, 'instanceof':1, 'new':1, 'null':1, 'return':1, 'switch':1, 'this':1, 'throw':1, 'true':1, 'try':1, 'typeof':1, 'var':1, 'void':1, 'while':1, 'with':1
					/* NOTES:
						- future reserved words:
							- JavaScript 2.0
								as, class, extends, interface, is, namespace, package, private, public, super, use
							- future use unknown
								abstract, enum, final, goto, implements, native, protected, static, synchronized, throws, transient, volatile
						- no longer reserved
							boolean, byte, char, double, float, int, long, short
						- words that are still an issue for Adobe's scripting environment in Photoshop and Illustrator
							boolean
					*/
				}
			;

		/*** Public Static Methods ***/
			_package.from = function (_toDecode) {
				return _toDecode ? eval ('(' + _toDecode + ')') : null;
				/*?
					Static Methods
						Uize.Json.from
							Returns a value of any type, being the result of evaluating the expression specified by the =jsonSTR= parameter.

							SYNTAX
							........................................
							valueANYTYPE = Uize.Json.from (jsonSTR);
							........................................

							NOTES
							- see the companion =Uize.Json.to= static method
				*/
			};

			_package.to = function (_toEncode,_encodingOptions) {
				_encodingOptions =
					(typeof _encodingOptions == 'string' ? _encodingOptionsPresets [_encodingOptions] : _encodingOptions) ||
					_encodingOptionsPresets.nice
				;
				function _getDefaultedStringOption (_optionName,_defaultValue) {
					var _optionValue = _encodingOptions [_optionName];
					return typeof _optionValue == _string ? _optionValue : _defaultValue;
				}
				var
					_serializedItemLines = [],
					_indentChars = _getDefaultedStringOption ('indentChars','\t'),
					_linebreakChars = _getDefaultedStringOption ('linebreakChars','\n'),
					_quoteChar = _getDefaultedStringOption ('quoteChar','\''),
					_quoteRegExp = new RegExp (_quoteChar,'g'),
					_quoteCharEscaped = '\\' + _quoteChar,
					_sortKeys = _encodingOptions.sortKeys === true,
					_padKeys = _encodingOptions.padKeys === true,
					_keyDelimiter = _encodingOptions.keyDelimiter || ':',
					_keyAlignAsFraction = {left:0,center:0.5,right:1} [_encodingOptions.keyAlign || 'left'],
					_whenToQuoteKeys = _encodingOptions.whenToQuoteKeys || 'auto' /* auto | auto all | always */
				;
				function _getPadding (_paddingAmount) {return _keyPadding.substr (0,_paddingAmount)}
				function _getQuotedStr (_string) {
					return (
						_quoteChar +
						_string
							.replace (/\\/g,'\\\\')
							.replace (/\n/g,'\\n')
							.replace (/\r/g,'\\r')
							.replace (_quoteRegExp,_quoteCharEscaped) +
						_quoteChar
					);
				}
				function _addSerializedItemLines (_item,_startPrefix,_indentPrefix,_appendComma) {
					var
						_itemLinesAdded = 0,
						_typeofItem = typeof _item
					;
					function _addSerializedItemLine (_itemValue,_appendComma) {
						_serializedItemLines.push (
							_indentPrefix + (_itemLinesAdded++ ? '' : _startPrefix) + _itemValue + (_appendComma ? ',' : '')
						);
					}
					if (_item == _undefined /* null, undefined */ || _typeofItem == 'number' || _typeofItem == 'boolean') {
						_addSerializedItemLine (_item,_appendComma);
					} else if (_typeofItem == _string) {
						_addSerializedItemLine (_getQuotedStr (_item),_appendComma);
					} else if (_typeofItem == 'object') {
						var
							_constructor = _item.constructor,
							_isSimpleObjectOrArray = _constructor == Object || _constructor == Array,
							_className
						;

						/*** determine name of class ***/
							/* NOTE:
								This code is plucked from Uize.Util.Oop. Ideally, it would be factored out into a place where it is nicely shareable. Do we want to make Uize.Json depend on Uize.Util.Oop? Either it goes into Uize base class, or Uize.Util.Oop needs to be lighter and some of its stuff should be put into a subnamespace.
							*/
							if (!_isSimpleObjectOrArray)
								_className = (
									(
										(_constructor + '').match (
											typeof _constructor == 'object'
												? /\[object\s+([^\]]+)\]/
												: /^\s*function\s+([^\(]+)\s*\(/
										) || _sacredEmptyArray
									) [1]
								) || ''
							;

						if (_isSimpleObjectOrArray || _className == 'Object' || _className == 'Array') {
							var _deeperIndentPrefix = _indentPrefix + _indentChars;
							if (_item instanceof Array || (_item && Uize.isFunction (_item.splice))) {
								var _elementsLength = _item.length;
								if (_elementsLength) {
									var _elementsLengthMinus1 = _elementsLength - 1;
									_addSerializedItemLine ('[');
									for (var _elementNo = -1; ++_elementNo < _elementsLength;)
										_addSerializedItemLines (
											_item [_elementNo],'',_deeperIndentPrefix,_elementNo < _elementsLengthMinus1
										)
									;
									_addSerializedItemLine (']',_appendComma);
								} else {
									_addSerializedItemLine ('[]',_appendComma);
								}
							} else {
								var _keys = [];
								for (var _memberName in _item)
									_keys.push (_memberName)
								;
								var _keysLength = _keys.length;
								if (_keysLength) {
									/*** sort keys, if desired ***/
										_sortKeys && _keys.sort ();

									/*** create serialized versions of keys ***/
										function _mustQuoteKey (_key) {
											return (
												isNaN (+_key)
													? (/[^\w\$]|^\d/.test (_key) || _reservedWordsMap [_key])
													: _key != +_key + '' || _key < 0
											);
										}

										/*** determine if all keys should be quoted ***/
											var _quoteAllKeys = _whenToQuoteKeys == 'always';
											if (!_quoteAllKeys && _whenToQuoteKeys == 'auto all') {
												for (var _keyNo = -1; ++_keyNo < _keysLength && !_quoteAllKeys;)
													_quoteAllKeys = _quoteAllKeys || _mustQuoteKey (_keys [_keyNo])
												;
											}

										/*** populate _serializedKeys array ***/
											var _serializedKeys = [];
											for (var _keyNo = -1; ++_keyNo < _keysLength;) {
												var _key = _keys [_keyNo];
												_serializedKeys [_keyNo] = (_quoteAllKeys || _mustQuoteKey (_key))
													? _getQuotedStr (_key)
													: _key
												;
											}

									/*** determine max key length (only if key padding desired) ***/
										var _maxKeyLength = 0;
										if (_padKeys) {
											for (var _keyNo = -1; ++_keyNo < _keysLength;)
												_maxKeyLength = Math.max (_maxKeyLength,_serializedKeys [_keyNo].length)
											;
										}

									/*** serialize the object ***/
										var _keysLengthMinus1 = _keysLength - 1;
										_addSerializedItemLine ('{');
										for (var _keyNo = -1; ++_keyNo < _keysLength;) {
											var
												_extraLeftPadding = '',
												_serializedKey = _serializedKeys [_keyNo]
											;
											if (_padKeys) {
												var
													_padding = _maxKeyLength - _serializedKey.length,
													_leftPadding = Math.round (_keyAlignAsFraction * _padding)
												;
												_extraLeftPadding = _getPadding (_leftPadding);
												_serializedKey += _getPadding (_padding - _leftPadding);
											}
											_addSerializedItemLines (
												_item [_keys [_keyNo]],
												_serializedKey + _keyDelimiter,
												_deeperIndentPrefix + _extraLeftPadding,
												_keyNo < _keysLengthMinus1
											);
										}
										_addSerializedItemLine ('}',_appendComma);
								} else {
									_addSerializedItemLine ('{}',_appendComma);
								}
							}
						} else {
							if (_serializableBuiltInObjects [_className]) {
								_addSerializedItemLine (
									'new ' + _className + ' (' +
										(_className == 'String' ? _getQuotedStr (_item) : _item.valueOf ()) +
									')',
									_appendComma
								);
							} else {
								_addSerializedItemLine ('{}',_appendComma);
							}
						}
					}
				}
				_addSerializedItemLines (_toEncode,'','');
				return _serializedItemLines.join (_linebreakChars);
				/*?
					Static Methods
						Uize.Json.to
							Serializes the specified value to a string of JSON format. The value to serialize can be a string, boolean, number, object, array, null, undefined, or a regular expression.

							SYNTAX
							......................................
							jsonSTR = Uize.Json.to (valueANYTYPE);
							......................................

							VARIATION 1
							..............................................................
							jsonSTR = Uize.Json.to (valueANYTYPE,serializationOptionsOBJ);
							..............................................................

							When the optional =serializationOptionsOBJ= parameter is specified, then the way in which the value is serialized to JSON format can be configured to produce wide ranging results, from prettified to compact. The value of the =serializationOptionsOBJ= parameter should be an object, with properties as follows...

							SERIALIZATION OPTIONS
							....................................................................................
							{
								indentChars:indentCharsSTR,         // optional, defaults to one tab
								linebreakChars:linebreakCharsSTR,   // optional, defaults to one linebreak
								quoteChar:quoteCharSTR,             // optional, defaults to a single quote
								keyDelimiter:keyDelimiterSTR,       // optional, defaults to colon without spaces
								padKeys:padKeysBOOL,                // optional, defaults to false
								keyAlign:keyAlignSTR,               // 'left' (default) | 'center' | 'right'
								whenToQuoteKeys:whenToQuoteKeysSTR, // 'auto' (default) | 'auto all' | 'always'
								sortKeys:sortKeysBOOL               // optional, defaults to false
							}
							....................................................................................

							indentChars
								A string, specifying the characters that should be used to indent key/value pairs of objects and elements of arrays. Defaults to one tab. Specify an empty string for compact serialization.

							linebreakChars
								A string, specifying the characters to be used to separate key/value pairs of objects and elements of arrays. Defaults to a single linebreak. Specify an empty string for compact serialization.

							quoteChar
								A string, specifying the character to be used when quoting string literals for string values or object property names (keys) that require quoting. Defaults to a single quote character.

							keyDelimiter
								A string, specifying the characters to be used when separating keys from values for serializing objects. Defaults to a colon without padding spaces around it. Add your own spaces to order.

							padKeys
								A boolean, specifying whether or not keys should be padded with spaces so that all keys occupy the same number of characters and so that the =keyDelimiter= character lines up vertically. Defaults to =false=. See the companion =keyAlign= property.

							keyAlign
								A string, specifying whether the keys should be aligned left, center, or right when padding keys. Only applicable when the companion =padKeys= property is set to =true=.

							whenToQuoteKeys
								A string, specifying under what conditions object property names (keys) should be quoted. The default value of ='auto'= causes individual keys to only be quoted when necessary. The value of ='auto all'= causes all keys of the same object to be quoted if any of the keys needs to be quoted. The value of ='always'= causes all keys to always be quoted.

							sortKeys
								A boolean, specifying whether or not object property names (keys) should be sorted ASCIIbetically when serializing objects. Defaults to =false=.

							EXAMPLES

							For the following examples, let's assume that we have a JavaScript object defined as follows...

							............................................
							var myObject = {
								someNumber:123.456,
								aBoolean:true,
								'value is a regular expression':/\d+/gim,
								123.456:'it\'s a floating point key!',
								'~!@#$%^&*()_+':1,
								'a key with a double quote "':1,
								'a key with a single quote \'':1
							};
							............................................

							EXAMPLE 1

							The following call to =Uize.Json.to=...

							.............................................
							Uize.Json.to (myObject,{keyDelimiter:' : '});
							.............................................

							...would produce the output...

							..............................................
							{
								someNumber : 123.456,
								aBoolean : true,
								'value is a regular expression' : /\d+/gim,
								123.456 : 'it\'s a floating point key!',
								'~!@#$%^&*()_+' : 1,
								'a key with a double quote "' : 1,
								'a key with a single quote \'' : 1
							}
							..............................................

							EXAMPLE 2

							The following call to =Uize.Json.to=...

							..........................................................................
							Uize.Json.to (myObject,{keyDelimiter:' : ',padKeys:true,keyAlign:'left'});
							..........................................................................

							...would produce the output...

							...................................................................
							{
								someNumber                      : 123.456,
								aBoolean                        : true,
								'value is a regular expression' : /\d+/gim,
								123.456                         : 'it\'s a floating point key!',
								'~!@#$%^&*()_+'                 : 1,
								'a key with a double quote "'   : 1,
								'a key with a single quote \''  : 1
							}
							...................................................................

							EXAMPLE 3

							The following call to =Uize.Json.to=...

							...........................................................................
							Uize.Json.to (myObject,{keyDelimiter:' : ',padKeys:true,keyAlign:'right'});
							...........................................................................

							...would produce the output...

							...................................................................
							{
								                     someNumber : 123.456,
								                       aBoolean : true,
								'value is a regular expression' : /\d+/gim,
								                        123.456 : 'it\'s a floating point key!',
								                '~!@#$%^&*()_+' : 1,
								  'a key with a double quote "' : 1,
								 'a key with a single quote \'' : 1
							}
							...................................................................

							EXAMPLE 4

							The following call to =Uize.Json.to=...

							........................................................................
							Uize.Json.to (myObject,{keyDelimiter:' : ',whenToQuoteKeys:'auto all'});
							........................................................................

							...would produce the output...

							...............................................
							{
								'someNumber' : 123.456,
								'aBoolean' : true,
								'value is a regular expression' : /\d+/gim,
								'123.456' : 'it\'s a floating point key!',
								'~!@#$%^&*()_+' : 1,
								'a key with a double quote "' : 1,
								'a key with a single quote \'' : 1
							}
							...............................................

							EXAMPLE 5

							The following call to =Uize.Json.to=...

							...........................................................
							Uize.Json.to (myObject,{keyDelimiter:' : ',quoteChar:'"'});
							...........................................................

							...would produce the output...

							..............................................
							{
								someNumber : 123.456,
								aBoolean : true,
								"value is a regular expression" : /\d+/gim,
								123.456 : "it's a floating point key!",
								"~!@#$%^&*()_+" : 1,
								"a key with a double quote \"" : 1,
								"a key with a single quote '" : 1
							}
							..............................................

							EXAMPLE 6

							The following call to =Uize.Json.to=...

							...........................................................
							Uize.Json.to (myObject,{keyDelimiter:' : ',sortKeys:true});
							...........................................................

							...would produce the output...

							..............................................
							{
								123.456 : 'it\'s a floating point key!',
								'a key with a double quote "' : 1,
								'a key with a single quote \'' : 1,
								aBoolean : true,
								someNumber : 123.456,
								'value is a regular expression' : /\d+/gim,
								'~!@#$%^&*()_+' : 1
							}
							..............................................

							VARIATION 2
							.............................................
							jsonSTR = Uize.Json.to (valueANYTYPE,'mini');
							.............................................

							When the special string value ='mini'= is specified in place of the =serializationOptionsOBJ= parameter, then serialization options are used that will produce a compact serialization of the specified value. This is equivalent to specifying the value ={indentChars:'',linebreakChars:''}= for the =serializationOptionsOBJ= parameter.

							NOTES
							- see the companion =Uize.Json.from= static method
				*/
			};

		/*** Public Static Properties ***/
			var
				_nice = {
					indentChars:'\t',
					keyAlign:'left',
					keyDelimiter:':',
					linebreakChars:'\n',
					padKeys:_false,
					quoteChar:'\'',
					sortKeys:_false,
					whenToQuoteKeys:'auto'
				},
				_strictness = {
					whenToQuoteKeys:'always',
					quoteChar:'"'
				},
				_mininess = {
					indentChars:'',
					linebreakChars:''
				},
				_encodingOptionsPresets = _package.encodingOptionsPresets = {
					mini:Uize.copyInto ({},_nice,_mininess),
					miniStrict:Uize.copyInto ({},_nice,_mininess,_strictness),
					nice:_nice,
					strict:Uize.copyInto ({},_nice,_strictness)
					/*?
						Static Properties
							Uize.Json.encodingOptionsPresets
								Available Presets
									Uize.Json.encodingOptionsPresets.mini
										document...

									Uize.Json.encodingOptionsPresets.miniStrict
										document...

									Uize.Json.encodingOptionsPresets.nice
										document...

									Uize.Json.encodingOptionsPresets.strict
										document...
					*/
				}
			;

		return _package;
	}
});

