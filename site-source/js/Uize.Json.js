/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Json Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2004-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 7
	codeCompleteness: 100
	docCompleteness: 92
*/

/*?
	Introduction
		The =Uize.Json= module provides versatile methods for serializing and deserializing objects to and from the [[http://en.wikipedia.org/wiki/JSON][JSON]] (JavaScript Object Notation) format.

		*DEVELOPERS:* `Chris van Rensburg`

		The =Uize.Json= module provides versatile serializaton options to permit a wide array of results, from prettified JSON (with linebreaks, indentation, key sorting, etc.) to compact (efficient for AJAX communication).

		Strict JSON Serialization
			To allow you to serialize JavaScript objects in strict accordance with the JSON specification (to be found at [[http://www.json.org][json.org]]), the =Uize.Json= module provides convenient `encoding presets for strict encoding`.

			Encoding Presets for Strict Encoding
				The =Uize.Json= module provides two encoding presets for strict encoding - `the strict encoding preset` and `the miniStrict encoding preset` - both of which ensure that all object keys are quoted, and that both object keys and string values are quoted using double quotes.

				The strict Encoding Preset
					The ='strict'= preset produces strict JSON serialization with pretty indentation and linebreaks.

					EXAMPLE
					..................
					Uize.Json.to (
						{
							prop1:true,
							prop2:'foo',
							prop3:42
						},
						'strict'
					);
					..................

					RESULT
					.................
					{
						"prop1":true,
						"prop2":"foo",
						"prop3":42
					}
					.................

				The miniStrict Encoding Preset
					The ='miniStrict'= preset produces strict JSON serialization that is as compact as possible, with no linebreaks or indentation.

					EXAMPLE
					..................
					Uize.Json.to (
						{
							prop1:true,
							prop2:'foo',
							prop3:42
						},
						'miniStrict'
					);
					..................

					RESULT
					.......................................
					{"prop1":true,"prop2":"foo","prop3":42}
					.......................................

			Strict Serialization is Not the Default
				If you don't specify the optional encoding parameter when calling the =Uize.Json.to= method, the encoding defaults to ='nice'= - strict serialization is not the default.

				Generally, when serializing values for debugging purposes, logging purposes, or as a part of build processes, it's more convenient to have your objects serialized in a neater and more readable form - without all the unnecessary and heavy double quotes around object keys. So, if you want strict JSON serialization, you must explicitly specify one of the two `encoding presets for strict encoding`.

				When To Be Strict
					Serializing a value to JSON using a strict encoding is appropriate when the serialized data is to be consumed by a JSON parser that only supports strict JSON syntax, such as a JSON parser provided for a server language like PHP.

				When Not To Be Strict
					Serializing a value to JSON using a non-strict encoding may be preferable when using the serialized data for debugging purposes, logging purposes, or as a part of build processes.

					In such cases, strict JSON may be too heavy, ugly, or unnatural. For example, if you wanted to serialize some data and then plug the serialized data directly into some JavaScript module, you probably won't be wanting the forced quoting around object keys or the use of double quotes for quoting keys and string values - it's more traditional to use single quotes for quoting strings in JavaScript code.
*/

Uize.module ({
	name:'Uize.Json',
	builder:function () {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_package = function () {},
				_undefined,
				_true = true,
				_false = false,
				_string = 'string',
				_sacredEmptyArray = [],
				_trueFlag = {}
			;

		/*** General Variables ***/
			var
				_someSpaces = '       ',
				_keyPadding = _someSpaces.replace (/ /g,_someSpaces).replace (/ /g,_someSpaces),
				_serializableBuiltInObjects = {RegExp:1,Date:1,String:1,Number:1,Boolean:1},
				_reservedWordsLookup = Uize.lookup (
					[
						'break', 'boolean', 'case', 'catch', 'continue', 'const', 'debugger', 'default', 'delete', 'do', 'else', 'export', 'false', 'finally', 'for', 'function', 'if', 'import', 'in', 'instanceof', 'new', 'null', 'return', 'switch', 'this', 'throw', 'true', 'try', 'typeof', 'var', 'void', 'while', 'with', 'implements', 'interface', 'let', 'package', 'private', 'protected', 'public', 'static', 'yield'
						/* NOTES:
							- future reserved words:
								- JavaScript 2.0
									as, class, extends, is, namespace, super, use
								- future use unknown
									abstract, enum, final, goto, native, synchronized, throws, transient, volatile
							- no longer reserved
								boolean, byte, char, double, float, int, long, short
							- words that are still an issue for Adobe's scripting environment in Photoshop and Illustrator
								boolean
						*/
					],
					_trueFlag
				)
			;

		/*** Public Static Methods ***/
			_package.from = function (_toDecode) {
				return _toDecode ? Uize.eval ('0,(' + _toDecode + ')') : null;
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
					if (
						_item == _undefined /* null, undefined */ ||
						_typeofItem == 'number' ||
						_typeofItem == 'boolean' ||
						_typeofItem == 'function'
					) {
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
								var
									_keys = Uize.keys (_item),
									_keysLength = _keys.length
								;
								if (_keysLength) {
									/*** sort keys, if desired ***/
										_sortKeys && _keys.sort ();

									/*** create serialized versions of keys ***/
										var _mustQuoteKey = function (_key) {
											return (
												isNaN (+_key)
													? (/[^\w\$]|^\d/.test (_key) || _reservedWordsLookup [_key] == _trueFlag)
													: _key != +_key + '' || _key < 0
											);
										};

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
										This `encoding options preset` can be used to serialize values to the most compact non-strict JSON form.

										This encoding preset is useful when serializing objects that are to be stored in string form somewhere, or that are to be sent "over the wire". The *mini* preset will minimize storage space needed to store serialized objects and bandwidth needed to send serialized objects over a network. The *mini* preset minimizes size by serializing objects without using any whitespace - no linebreaks, indentation, or key padding.

										EXAMPLE
										...............................................
										{foo:'bar',hello:'world',subObject:{foo:'bar'}}
										...............................................

										The =Uize.Json.encodingOptionsPresets.mini= preset defines the following encoding options...

										SETTINGS
										.........................
										{
											indentChars:'',
											keyAlign:'left',
											keyDelimiter:':',
											linebreakChars:'',
											padKeys:false,
											quoteChar:'\'',
											sortKeys:false,
											whenToQuoteKeys:'auto'
										}
										.........................

									Uize.Json.encodingOptionsPresets.miniStrict
										This `encoding options preset` can be used to serialize values to the most compact strict JSON form.

										This encoding preset is useful when you want all the benefits of the =Uize.Json.encodingOptionsPresets.mini= preset, but where you also need objects to be serialized using `strict JSON serialization` (possibly because some parts of the system only support deserializing objects that are in strict JSON form).

										EXAMPLE
										.......................................................
										{"foo":"bar","hello":"world","subObject":{"foo":"bar"}}
										.......................................................

										The =Uize.Json.encodingOptionsPresets.miniStrict= preset defines the following encoding options...

										SETTINGS
										...........................
										{
											indentChars:'',
											keyAlign:'left',
											keyDelimiter:':',
											linebreakChars:'',
											padKeys:false,
											quoteChar:'"',
											sortKeys:false,
											whenToQuoteKeys:'always'
										}
										...........................

									Uize.Json.encodingOptionsPresets.nice
										This `encoding options preset` can be used to serialize values to a human readable non-strict JSON form.

										This encoding preset is useful when serializing objects that are to be displayed (possibly for debugging or troubleshooting purposes), or that are to be incorporated into files that should be human readable (possibly as part of a build process). The *nice* preset spreads object properties over multiple lines and indents lines to indicate hierarchical structure.

										EXAMPLE
										.................
										{
											foo:'bar',
											hello:'world',
											subObject:{
												foo:'bar'
											}
										}
										.................

										The =Uize.Json.encodingOptionsPresets.nice= preset defines the following encoding options...

										SETTINGS
										.........................
										{
											indentChars:'\t',
											keyAlign:'left',
											keyDelimiter:':',
											linebreakChars:'\n',
											padKeys:false,
											quoteChar:'\'',
											sortKeys:false,
											whenToQuoteKeys:'auto'
										}
										.........................

									Uize.Json.encodingOptionsPresets.strict
										This `encoding options preset` can be used to serialize values to a human readable strict JSON form.

										This encoding preset is useful when you want all the benefits of the =Uize.Json.encodingOptionsPresets.nice= preset, but where you also need objects to be serialized using `strict JSON serialization` (possibly because some parts of the system only support deserializing objects that are in strict JSON form).

										EXAMPLE
										...................
										{
											"foo":"bar",
											"hello":"world",
											"subObject":{
												"foo":"bar"
											}
										}
										...................

										The =Uize.Json.encodingOptionsPresets.strict= preset defines the following encoding options...

										SETTINGS
										...........................
										{
											indentChars:'\t',
											keyAlign:'left',
											keyDelimiter:':',
											linebreakChars:'\n',
											padKeys:false,
											quoteChar:'"',
											sortKeys:false,
											whenToQuoteKeys:'always'
										}
										...........................
					*/
				}
			;

		return _package;
	}
});

