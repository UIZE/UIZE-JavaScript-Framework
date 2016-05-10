/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Xml Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)1997-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 4
	codeCompleteness: 10
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Xml= package defines utility methods (primarily for serialization and deserialization) that are useful when handling data in the XML format.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Xml',
	required:'Uize.Util.Html.Encode',
	builder:function () {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_sacredEmptyObject = {},
				_Uize_Util_Html_Encode = Uize.Util.Html.Encode,
				_toAttributeValue = _Uize_Util_Html_Encode.encode,
				_fromAttributeValue = _Uize_Util_Html_Encode.decode,

			/*** General Variables ***/
				_attributeMatchRegExp = /\s*([^=\s]+)\s*(=\s*("([^"]*)"|'([^']*)'|(\S*))|$|)/g
			;

		/*** Utility Functions ***/
			function _getNameCaseMethodName (_options) {
				return {upper:'toUpperCase',lower:'toLowerCase'} [_options.nameCase] || 'valueOf';
			}

		return Uize.package ({
			toAttributeValue:_toAttributeValue,
				/*?
					Static Methods
						Uize.Xml.toAttributeValue
							Returns a string, representing the XML attribute encoded form of the specified string.

							SYNTAX
							..................................................................................
							encodedAttributeValueSTR = Uize.Xml.toAttributeValue (unencodedAttributeValueSTR);
							..................................................................................

							EXAMPLE
							...............................................................................
							encodedValue = Uize.Xml.toAttributeValue ('solar & wind beats "fossil" fuels');
							...............................................................................

							After executing the above statement, the variable =encodedValue= would have the value ='solar &amp;amp; wind beats &amp;quot;fossil&amp;quot; fuels'=.

							NOTES
							- see also the corresponding =Uize.Xml.fromAttributeValue= static method
				*/

			fromAttributeValue:_fromAttributeValue,
				/*?
					Static Methods
						Uize.Xml.fromAttributeValue
							Returns a string, representing the decoded form of the specified XML encoded attribute value.

							SYNTAX
							....................................................................................
							unencodedAttributeValueSTR = Uize.Xml.fromAttributeValue (encodedAttributeValueSTR);
							....................................................................................

							This method supports decoding the full set of 252 character entities contained in the HTML 4 specification, as well as entities encoded using the forms =&amp;#nnnn;= and =&amp;#xhhhh;= (where =nnnn= and =hhhh= are the Unicode character code of the character in decimal and hexadecimal formats, respectively).

							EXAMPLE
							....................................................
							unencoded = Uize.Xml.fromAttributeValue (
								'solar &amp; wind beats &quot;fossil&quot; fuels'
							);
							....................................................

							After executing the above statement, the variable =unencoded= would have the value ='solar &amp; wind beats "fossil" fuels'=.

							NOTES
							- see also the corresponding =Uize.Xml.toAttributeValue= static method
				*/

			fromAttributes:function (_toDecode,_options) {
				var _attributesObj = {};
				if (_toDecode) {
					_options = _options || _sacredEmptyObject;
					var
						_nameCaseMethodName = _getNameCaseMethodName (_options),
						_attributeMatch
					;
					while (_attributeMatch = _attributeMatchRegExp.exec (_toDecode))
						_attributesObj [_attributeMatch [1] [_nameCaseMethodName] ()] =
							_fromAttributeValue (_attributeMatch [4] || _attributeMatch [5] || _attributeMatch [6] || '')
					;
				}
				return _attributesObj;
				/*?
					Static Methods
						Uize.Xml.fromAttributes
							A utility method that parses an XML formatted attributes string and returns the attributes as an object.

							SYNTAX
							........................................................
							attributesOBJ = Uize.Xml.fromAttributes (attributesSTR);
							........................................................

							EXAMPLE
							......................................................................................
							Uize.Xml.fromAttributes ('src="myimage.gif" width="640" height="480" alt="My Image"');
							......................................................................................

							With the above attributes string, the =Uize.Xml.fromAttributes= method would produce the object...

							......................
							{
								src:'myimage.gif',
								width:'640',
								height:'480',
								alt:'My Image'
							}
							......................

							VARIATION
							...................................................................
							attributesOBJ = Uize.Xml.fromAttributes (attributesSTR,optionsOBJ);
							...................................................................

							The optional =optionsOBJ= parameter lets you qualify how the specified attributes string should be decoded.

							DECODING OPTIONS
							..................................................................
							{
								nameCase:nameCaseSTR // 'lower' | 'upper' | undefined (default)
							}
							..................................................................

							nameCase
								A string, specifying the case for keys in the object that is produced from decoding the attributes string.

								This property is optional. By default, attribute names are left as they appear in the attributes string. This property allows us to coerce the case in order to correct for attribute strings that do not conform in our specific use case.

							EXAMPLE
							......................................................................................
							Uize.Xml.fromAttributes (
								'src="myimage.gif" WIDTH="640" Height="480" ALT="My Image"',
								{nameCase:'lower'}
							);
							......................................................................................

							The above attributes string contains attribute names in mixed case. Specifying the value ='lower'= for the =nameCase= property of the =optionsOBJ= parameter will cause the decoding to produce an object with all lowercase keys, as in...

							......................
							{
								src:'myimage.gif',
								width:'640',
								height:'480',
								alt:'My Image'
							}
							......................

							NOTES
							- when parsing the attributes string, all attribute values are treated as strings
							- see also the corresponding =Uize.Xml.toAttributes= static method
				*/
			},

			toAttributes:function (_toEncode,_options) {
				var
					_nameCaseMethodName = _getNameCaseMethodName (_options = _options || _sacredEmptyObject),
					_quoteChar = _options.quoteChar || '"',
					_equalPlusQuoteChar = '=' + _quoteChar,
					_attributesStrChunks = []
				;
				/*** change name case of attributes, in a way that collapses duplicates that may otherwise arise ***/
					if (_nameCaseMethodName != 'valueOf') {
						/* NOTE: this is something that could be captured for re-use in a map-keys type method */
						var _oldToEncode = _toEncode;
						_toEncode = {};
						for (var _attributeName in _oldToEncode)
							_toEncode [_attributeName [_nameCaseMethodName] ()] = _oldToEncode [_attributeName]
						;
					}

				for (var _attributeName in _toEncode)
					_attributeName && _attributesStrChunks.push (
						_attributeName + _equalPlusQuoteChar + _toAttributeValue (_toEncode [_attributeName]) + _quoteChar
					)
				;
				return _attributesStrChunks.join (' ');
				/* if we didn't care about last duplicate attribute winning, this would be a more optimized implementation
					var
						_nameCaseMethodName = _getNameCaseMethodName (_options = _options || _sacredEmptyObject),
						_quoteChar = _options.quoteChar || '"',
						_equalPlusQuoteChar = '=' + _quoteChar,
						_attributesStrChunks = [],
						_attributeUsedLookup = {},
						_trueFlag = {},
						_attributeCasedName
					;
					for (var _attributeName in _toEncode) {
						if (
							_attributeName &&
							_attributeUsedLookup [_attributeCasedName = _attributeName [_nameCaseMethodName] ()] != _trueFlag
						) {
							_attributeUsedLookup [_attributeCasedName] = _trueFlag;
							_attributesStrChunks.push (
								_attributeCasedName + _equalPlusQuoteChar +
								_toAttributeValue (_toEncode [_attributeName]) + _quoteChar
							);
						}
					}
					return _attributesStrChunks.join (' ');
				*/
				/*?
					Static Methods
						Uize.Xml.toAttributes
							A utility method that serializes the properties of the specified object to produce an XML formatted attributes string.

							SYNTAX
							......................................................
							attributesSTR = Uize.Xml.toAttributes (attributesOBJ);
							......................................................

							EXAMPLE
							........................
							Uize.Xml.toAttributes ({
								src:'myimage.gif',
								width:'640',
								height:'480',
								alt:'My Image'
							});
							........................

							With the above =attributesOBJ= value, the =Uize.Xml.toAttributes= method would produce the string...

							...........................................................
							'src="myimage.gif" width="640" height="480" alt="My Image"'
							...........................................................

							VARIATION
							.................................................................
							attributesSTR = Uize.Xml.toAttributes (attributesOBJ,optionsOBJ);
							.................................................................

							The optional =optionsOBJ= parameter lets you qualify how the specified attributes object should be encoded to produce an attribute string.

							ENCODING OPTIONS
							..................................................................
							{
								nameCase:nameCaseSTR // 'lower' | 'upper' | undefined (default)
							}
							..................................................................

							nameCase
								A string, specifying the case for attribute names that are generated from the keys of the attributes object.

								This property is optional. By default, attribute names are identical to the keys in the attributes object. This property allows us to coerce the case in order to conform the attributes string for our specific use case.

								EXAMPLE
								........................
								Uize.Xml.toAttributes (
									{
										SRC:'myimage.gif',
										WIDTH:'640',
										HEIGHT:'480',
										ALT:'My Image'
									}
									{nameCase:'lower'}
								);
								........................

								The above attributes object contains keys that are all uppercase. Specifying the value ='lower'= for the =nameCase= property of the =optionsOBJ= parameter will cause the encoding to produce an attributes string with all lowercase attribute names, as in...

								...........................................................
								'src="myimage.gif" width="640" height="480" alt="My Image"'
								...........................................................

							NOTES
							- all attribute values are enclosed in double quotes
							- empty string attribute values are always fully serialized (e.g. =myattribute&#61;""=)
							- see also the corresponding =Uize.Xml.fromParams= static method
				*/
			}
		});
	}
});

