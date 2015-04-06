/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Str.Camel Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2008-2015 UIZE
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
			}
		});
	}
});

