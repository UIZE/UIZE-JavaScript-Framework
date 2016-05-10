/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Str.Camel Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2008-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 1
	codeCompleteness: 50
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Str.Camel= module provides convenience methods for dealing with camelCased strings.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Str.Camel',
	builder:function () {
		'use strict';

		var
			/*** General Variables ***/
				_sacredEmptyObject = {}
		;

		return Uize.package ({
			to:function (_source,_capFirstChar) {
				return (
					(Uize.isArray (_source) ? _source.join (' ') : _source)
						.toLowerCase ()
						.replace (
							/^[^a-zA-Z0-9]+/,'' // remove leading non-word chars
						).replace (
							/[^a-zA-Z0-9]+$/,'' // remove trailing non-word chars
						).replace (
							_capFirstChar ? /(^|[^a-zA-Z0-9]+)./g : /[^a-zA-Z0-9]+./g,
							function (_match) {return _match.slice (-1).toUpperCase ()}
						)
				);
				/*?
					Static Methods
						Uize.Str.Camel.to
							Returns a string, that is the specified source string converted to a camelCase formatted string.

							SYNTAX
							.............................................
							camelCaseSTR = Uize.Str.Camel.to (sourceSTR);
							.............................................

							This method removes all non-word characters separating words in the source string, capitalizes the first letters of the words, and lowercases all other letters.

							EXAMPLES
							..........................................................................
							Uize.Str.Camel.to ('encode HTML entity');    // returns 'encodeHtmlEntity'
							Uize.Str.Camel.to ('XML document');          // returns 'xmlDocument'
							Uize.Str.Camel.to ('XML document',true);     // returns 'XmlDocument'
							Uize.Str.Camel.to ('city, state, zip');      // returns 'cityStateZip'
							Uize.Str.Camel.to ('www.uize.com');          // returns 'wwwUizeCom'
							Uize.Str.Camel.to ('theme/css/button.css');  // returns 'themeCssButtonCss'
							Uize.Str.Camel.to ('nav-arrow-horz-next');   // returns 'navArrowHorzNext'
							Uize.Str.Camel.to ('json 2 XML');            // returns 'json2Xml'
							Uize.Str.Camel.to ('--hyphens-are-cool--');  // returns 'hyphensAreCool'
							...........................................................................

							The above example illustrates how the method will behave with a variety of input values.

							VARIATION
							..............................................................
							camelCaseSTR = Uize.Str.Camel.to (sourceSTR,capFirstCharBOOL);
							..............................................................

							By default, the first letter of the camelCased string is lowercase, although the optional =capFirstCharBOOL= parameter allows control over this behavior. Specify the value =true= for this parameter and the first letter of the camelCased string will be uppercase.

							VARIATION
							.......................................................
							camelCaseSTR = Uize.Str.Camel.to (stringSegmentsARRAY);
							.......................................................

							In addition to being able to camelCase a source string, the =Uize.Str.Camel.to= method can also generate a camelCase string from an array of string segments.

							EXAMPLE
							......................................................................
							Uize.Str.Camel.to (['city','state','zip']);  // returns 'cityStateZip'
							......................................................................

							VARIATION
							........................................................................
							camelCaseSTR = Uize.Str.Camel.to (stringSegmentsARRAY,capFirstCharBOOL);
							........................................................................

							Naturally, the optional =capFirstCharBOOL= parameter can also be used when the =stringSegmentsARRAY= parameter is specified.

							NOTES
							- compare to the companion `Uize.Str.Camel.from` static method
				*/
			},

			from:function (_source,_decodingOptions) {
				_decodingOptions || (_decodingOptions = _sacredEmptyObject);
				var
					_delimiter = _decodingOptions.delimiter,
					_lowerCaseFirstChar = _decodingOptions.lowerCaseFirstChar,
					_totalWords = 1
				;
				if (_delimiter == null)
					_delimiter = '-'
				;
				if (_lowerCaseFirstChar == null)
					_lowerCaseFirstChar = true
				;
				return _source.replace (
					/([^A-Z]?)([A-Z])/g,
					function (_match,_precedingChar,_upperCaseLetter) {
						_totalWords++;
						return (
							_precedingChar +
							((_totalWords > 2 || _precedingChar) && _delimiter) +
							(_lowerCaseFirstChar ? _upperCaseLetter.toLowerCase () : _upperCaseLetter)
						);
					}
				);
				/*?
					Static Methods
						Uize.Str.Camel.from
							Returns a string, that is the specified source string converted from a camelCase formatted string to a delimited string.

							DIFFERENT USAGES

							`Convert a camelCased String to a Hyphenated String`
							................................................
							hyphenatedSTR = Uize.Str.Camel.from (sourceSTR);
							................................................

							`Convert a camelCased String to a Delimited String, With Options`
							...........................................................
							hyphenatedSTR = Uize.Str.Camel.from (sourceSTR,optionsOBJ);
							...........................................................

							`Convert a camelCased String to a Hyphenated String, Without Lowercasing`
							...........................................................................
							hyphenatedSTR = Uize.Str.Camel.from (sourceSTR,{lowerCaseFirstChar:false});
							...........................................................................

							`Convert a camelCased String to a Delimited String, Specifying a Custom Delimiter`
							........................................................................
							delimitedSTR = Uize.Str.Camel.from (sourceSTR,{delimiter:delimiterSTR});
							........................................................................

							Convert a camelCased String to a Hyphenated String
								In the simplest use case, a camelCased string can be converted to a hyphenated string by specifying the camelCased source string as the first argument.

								SYNTAX
								................................................
								hyphenatedSTR = Uize.Str.Camel.from (sourceSTR);
								................................................

								EXAMPLES
								......................................................................
								Uize.Str.Camel.from ('city');            // returns 'city'
								Uize.Str.Camel.from ('cityStateZip');    // returns 'city-state-zip'
								Uize.Str.Camel.from ('CityStateZip');    // returns 'city-state-zip'
								Uize.Str.Camel.from ('propertyAValue');  // returns 'property-a-value'
								......................................................................

							Convert a camelCased String to a Delimited String, With Options
								When the default behavior of the method is not suitable, the method's behavior can be customized by specifying the optional =optionsOBJ= second argument.

								SYNTAX
								...........................................................
								hyphenatedSTR = Uize.Str.Camel.from (sourceSTR,optionsOBJ);
								...........................................................

								optionsOBJ
									An object, containing properties for specifying conversion options.

									SYNTAX
									............................................
									{
										delimiter:delimiterSTR,
										lowerCaseFirstChar:lowerCaseFirstCharBOOL
									}
									............................................

									delimiter
										A string, specifying a set of characters that should be used to delimit the words parsed from the camelCased source string.

										The value of the =delimiter= property may be any string, containing zero or more characters. Typically, the value will be a single character, but multi-character delimiters are acceptable. If no value is specified for the =delimiter= property, or if the value =null= or =undefined= is specified, then the value for this property is defaulted to a ='-'= (hyphen) character.

									lowerCaseFirstChar
										A boolean, specifying whether or not the first character of each of the words parsed from the camelCased source string should be lowercased.

										When the value =false= is specified for the =lowerCaseFirstChar= property, the first character of each word will not be lowercased and will be left as is. For words after the first word, this will mean that the characters will remain uppercased, although it is possible for the camelCased source string to also start with an uppercase letter. If no value is specified for the =lowerCaseFirstChar= property, or if the value =null= or =undefined= is specified, then the value for this property is defaulted to =true=.

							Convert a camelCased String to a Hyphenated String, Without Lowercasing
								A camelCased source string can be converted to a hyphenated string without lowercasing of the first letters of words by specifying the value =false= for the =lowerCaseFirstChar= option.

								SYNTAX
								...........................................................................
								hyphenatedSTR = Uize.Str.Camel.from (sourceSTR,{lowerCaseFirstChar:false});
								...........................................................................

								EXAMPLES
								.................................................................................................
								Uize.Str.Camel.from ('city',{lowerCaseFirstChar:false});            // returns 'city'
								Uize.Str.Camel.from ('cityStateZip',{lowerCaseFirstChar:false});    // returns 'city-State-Zip'
								Uize.Str.Camel.from ('CityStateZip',{lowerCaseFirstChar:false});    // returns 'City-State-Zip'
								Uize.Str.Camel.from ('propertyAValue',{lowerCaseFirstChar:false});  // returns 'property-A-Value'
								.................................................................................................

							Convert a camelCased String to a Delimited String, Specifying a Custom Delimiter
								A camelCased source string can be converted to a delimited string with a custom delimiter, by specifying the custom delimiter for the =delimiter= option.

								SYNTAX
								........................................................................
								delimitedSTR = Uize.Str.Camel.from (sourceSTR,{delimiter:delimiterSTR});
								........................................................................

								EXAMPLE
								........................................................................................
								Uize.Str.Camel.from ('cityStateZip',{delimiter:'-'});    // returns 'city-state-zip'
								Uize.Str.Camel.from ('cityStateZip',{delimiter:'_'});    // returns 'city_state_zip'
								Uize.Str.Camel.from ('cityStateZip',{delimiter:', '});   // returns 'city, state, zip'
								Uize.Str.Camel.from ('cityStateZip',{delimiter:''});     // returns 'citystatezip'
								Uize.Str.Camel.from ('cityStateZip',{delimiter:'#'});    // returns 'city#state#zip'
								Uize.Str.Camel.from ('cityStateZip',{delimiter:' + '});  // returns 'city + state + zip'
								........................................................................................

							NOTES
							- compare to the companion `Uize.Str.Camel.to` static method
				*/
			}
		});
	}
});

