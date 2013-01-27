/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Data.Csv Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2009-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 3
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Data.Csv= module provides support for serializing to and parsing from [[http://en.wikipedia.org/wiki/Comma-separated_values][CSV (Comma Separated Values)]] formatted data, with configurable options.

		*DEVELOPERS:* `Chris van Rensburg`

		Key Features
			The versatile =Uize.Data.Csv= module supports the following key features...

			Multiline Column Values
				Column values that contain linebreaks (either carriage return or linefeed characters) can be serialized *and* parsed using the methods of the =Uize.Data.Csv= module.

				When data is serialized where column values contain linebreak characters, those column values are always quoted in the serialized CSV data string, and the values will span multiple lines. That's because the CSV format doesn't provide a dedicated way for escaping linebreak characters. When parsing CSV formatted data, the =Uize.Data.Csv.from= method automatically reads column values across multiple lines when they are quoted and contain linebreak characters.

			Header Row
				The CSV format allows for an optional header row that contains the names of the columns.

				The =Uize.Data.Csv= module provides support for header rows when both serializing to and parsing from CSV data strings. Support for header rows is enabled by specifying the value =true= for the =hasHeader= option, available for both the =Uize.Data.Csv.from= and =Uize.Data.Csv.to= static methods.

				Header Rows and Parsing from CSV
					Header rows are supported when parsing from CSV data, both to arrays of arrays and to arrays of objects.

					When parsing CSV data to an array of arrays, a header row that exists in the CSV data string can either just be "gobbled" and thrown away, or it can be gathered in an empty array that you supply using the =columns= decoding option. Either way, the column names in a header row are kept from getting into the records array that is returned by the =Uize.Data.Csv.from= method, because they are not part of the data set.

					When parsing CSV data to an array of objects, the header row that exists in the CSV data string can be used for the key names for the objects in the returned records array. If there is no header row in the CSV data string and the value =false= is specified for the =hasHeader= option, the column names can still be supplied to the =Uize.Data.Csv.from= method using the =columns= decoding option when parsing to an array of objects.

				Header Rows and Serializing to CSV
					Header rows are supported when serializing to CSV data, both from arrays of arrays and from arrays of objects.

					When serializing an array of arrays to a CSV data string, the column names to be used in the header row can be supplied to the =Uize.Data.Csv.to= method using the =columns= encoding option.

					When serializing an array of objects to a CSV data string, the column names to be used in the header row can be taken directly from the key names of the first object in the records array, or they can be explicitly specified to the =Uize.Data.Csv.to= method using the =columns= encoding option. Using the =columns= option allows the column order to be controlled, or a subset of the columns to be serialized (see `Column Ordering And Filtering`).

			Object or Array Type Rows
				The =Uize.Data.Csv= module supports serializing from and parsing to a records array, where records are represented as either arrays or objects.

				When records are represented as objects, each key represents the name of a column and each value is that column's value. When records are represented as arrays, then each element of a record's array is a column value.

				The row type - array or object - can be controlled using the =rowType= option, available for both the =Uize.Data.Csv.from= and =Uize.Data.Csv.to= static methods. When the value ='auto'= (the default) is used for the =rowType= option when parsing CSV data, then array or object type will be chosen based upon the value of the =hasHeader= decoding option, with object type being chosen when =hasHeader= is =true=, and array type being chosen when =hasHeader= is =false=. When ='auto'= is used for the =rowType= option when serializing CSV data, then array or object type will be chosen based upon the type of the first element of the records array being serialized.

				When serializing to a CSV data string from an array of objects, the =columns= option can be used to control the column order, or to serialize only a subset of the columns (see `Column Ordering And Filtering`). When parsing from a CSV data string to an array of objects, the key names for the record objects can be taken from the header row of the CSV data string (the value =true= is specified for the =hasHeader= option), or the key names can be supplied in the =columns= decoding option.

			Configurable Quoting Character
				While [[http://tools.ietf.org/html/rfc4180][RFC 4180]] only addresses quoting of values using the double quote character, the =Uize.Data.Csv= module provides the flexibility to use other quoting characters - both when serializing using the =Uize.Data.Csv.to= method and parsing using the =Uize.Data.Csv.from= method.

				The quoting character is specified using the =quoteChar= option, available for both the =Uize.Data.Csv.from= and =Uize.Data.Csv.to= methods. The value specified for this option should be a string, specifying the *single* character used for quoting values in the serialized CSV data string.

				When serializing data to CSV format using a quoting character other than double quotes, it is important to specify that character in the =quoteChar= option when later parsing that serialized data - the =Uize.Data.Csv.from= method cannot tell automatically from the CSV data string what the quoting character is. Whatever quoting character is specified, if a value contains that quote character, then that value will be quoted. As per the RFC 4180 rules, the quoting character is escaped by doubling it.

			Configurable Quoting Behavior
				By default, the =Uize.Data.Csv.to= method automatically chooses whether or not to quote individual values, based upon a number of different criteria.

				This behavior can be controlled, though, using the =whenToQuoteValues= encoding option. When the value ='always'= is specified for this option, all column values in the serialized CSV data string will always be quoted. When this option is left in its default state of ='auto'=, then column values will be automatically quoted, only when they contain the quoting character (see the =quoteChar= option) or the value delimiter string (see the =valueDelimiter= option), if they contain linebreaks (either carriage return or linefeed characters), if they contain whitespace padding and the value =true= is specified for the =trimPaddingOnParse= option, or if the value delimiter (see the =valueDelimiter= option) contains whitespace padding and the value =false= is specified for the =trimPaddingOnParse= option.

			Configurable Value Delimiter
				While [[http://tools.ietf.org/html/rfc4180][RFC 4180]] only addresses separating values using the comma character, the =Uize.Data.Csv= module provides the flexibility to use other value delimiter characters - both when serializing using the =Uize.Data.Csv.to= method and parsing using the =Uize.Data.Csv.from= method.

				The value delimiter is specified using the =valueDelimiter= option, available for both the =Uize.Data.Csv.from= and =Uize.Data.Csv.to= methods. The value specified for this option should be a string, specifying the delimiter used for separating column values in rows of CSV data string.

				When serializing data to CSV format using a value delimiter character other than comma, it is important to specify that delimiter in the =valueDelimiter= option when later parsing that serialized data - the =Uize.Data.Csv.from= method cannot tell automatically from the CSV data string what the value delimiter is.

				Whatever value delimiter string is specified, if a value contains that string, then that value will be quoted. Also, if the value delimiter has whitespace padding, then the column values will always be quoted to ensure that later parsing doesn't result in the value delimiter's padding becoming whitespace in the parsed column values.

			Column Ordering And Filtering
				When serializing an array of objects to a CSV data string, the =Uize.Data.Csv= module provides support for controlling the ordering of columns in the serialized data string, as well as serializing just a subset of the columns in the data set.

				Column Order
					The =columns= encoding option can be used to enforce an ordering for columns in the serialized CSV data string.

					If you're serializing a records array where the records are of type object and you leave it up to the =Uize.Data.Csv.to= method to determine the columns, the column order will depend entirely on the order in which the keys were assigned to the first row's object in the records array. As long as the serialized CSV data string has a header row (the value =true= is specified for the =hasHeader= option) and the data is to be later parsed to an array of objects, one may not care about the column ordering. If column ordering is important, however, then the =columns= option can be used to control this.

				Subset of Columns
					In some cases you may wish to serialize an array of object records, but not include all of the columns in the serialized output.

					In such cases you can use the =columns= encoding option to specify just the columns that you wish to have serialized, along with the exact order in which you wish them to be arranged in the serialized CSV data string.

			Trimming of Value Padding
				While whitespace around value separator characters is considered significant, and while trimming such whitespace is specifically prohibited according to [[http://tools.ietf.org/html/rfc4180][RFC 4180]], the =Uize.Data.Csv= module supports trimming of value padding - both when serializing using the =Uize.Data.Csv.to= method and parsing using the =Uize.Data.Csv.from= method.

				When parsing CSV data, there might be real world situations where one is dealing with CSV data that is not serialized strictly according to the rules laid out in RFC 4180, and where there might be spaces after comma value separators. In such cases, the value =true= can be specified for the =trimPaddingOnParse= decoding option, which will cause the leading and trailing whitespace padding around the first and last non-whitespace characters of non-quoted values to be trimmed (for quoted values, this option will have no effect on the result).

				When serializing CSV data, the data serialized by the =Uize.Data.Csv.to= method may at some point be parsed by code that doesn't strictly observe the rules laid out in RFC 4180 and which may strip padding around comma value separators. In such cases, the value =true= can be specified for the =trimPaddingOnParse= encoding option, which will cause values that contain leading and/or trailing whitespace padding around the first and last non-whitespace characters to be quoted in order to ensure that whitespace that is part of values is not accidentally stripped by a non-compliant CSV parser.
*/

Uize.module ({
	name:'Uize.Data.Csv',
	required:'Uize.String',
	builder:function () {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_package = function () {},
				_true = true,
				_false = false,
				_undefined
			;

		/*** General Variables ***/
			var _optionDefaults = {
				columns:'all',              // 'all' | an array of column names
				hasHeader:false,            // true | false
				trimPaddingOnParse:false,   // true | false
				quoteChar:'"',              // '"' | '\'' | any single char
				rowType:'auto',             // 'array' | 'object' | 'auto'
				valueDelimiter:',',         // ',' | ';' | '\t' | any single char
				whenToQuoteValues:'auto'    // 'auto' | 'always'
			};

		/*** Utility Functions ***/
			function _getDefaultedOption (_options,_optionName) {
				var _optionValue = _options ? _options [_optionName] : _undefined;
				return _optionValue == _undefined ? _optionDefaults [_optionName] : _optionValue;
			}

			function _getEscapedQuoteChar (_options) {
				return Uize.String.repeat (_getDefaultedOption (_options,'quoteChar'),2);
			}

			function _globalLiteralRegExp (_replaceStr) {
				return new RegExp (Uize.escapeRegExpLiteral (_replaceStr),'g');
			}

		/*** Public Static Methods ***/
			_package.from = function (_toDecode,_decodingOptions) {
				var
					_columns = _getDefaultedOption (_decodingOptions,'columns'),
					_hasHeader = _getDefaultedOption (_decodingOptions,'hasHeader'),
					_trimPaddingOnParse = _getDefaultedOption (_decodingOptions,'trimPaddingOnParse'),
					_quoteChar = _getDefaultedOption (_decodingOptions,'quoteChar'),
					_rowType = _getDefaultedOption (_decodingOptions,'rowType'),
					_valueDelimiter = _getDefaultedOption (_decodingOptions,'valueDelimiter'),
					_escapedQuoteChar = _getEscapedQuoteChar (_decodingOptions),
					_escapedQuoteCharRegExp = _globalLiteralRegExp (_escapedQuoteChar),
					_columnsIsArray = Uize.isArray (_columns),
					_rowTypeIsObject =
						_rowType == 'object' || (_rowType == 'auto' && (_hasHeader || (_columnsIsArray && _columns.length))),
					_rows = [],
					_currentPos = 0,
					_rowNo = _hasHeader ? -1 : 0,
					_columnNo = 0,
					_toDecodeLength = _toDecode.length,
					_toDecodeLengthMinus1 = _toDecodeLength - 1
				;
				_hasHeader && (_columnsIsArray ? (_columns.length = 0) : (_columns = []));
				function _addColumn (_value) {
					(
						_rowNo < 0
							? _columns
							: _rows [_rowNo] || (_rows [_rowNo] = _rowTypeIsObject ? {} : [])
					) [
						_rowTypeIsObject && _rowNo > -1 ? _columns [_columnNo] : _columnNo
					] =
						_trimPaddingOnParse ? Uize.String.trim (_value) : _value
					;
					_columnNo++;
				}
				function _nextIndexOf (_char) {
					var _result = _toDecode.indexOf (_char,_currentPos);
					return _result < 0 ? _toDecodeLength : _result;
				}
				function _nextDelimiterPos () {
					return Math.min (
						_nextIndexOf ('\n'),
						_nextIndexOf ('\r'),
						_nextIndexOf (_valueDelimiter),
						_nextIndexOf (_quoteChar)
					);
				}
				var
					_nextSignificantCharPos,
					_nextSignificantChar,
					_endFound,
					_escapedQuotesFound,
					_closingQuoteCharPos
				;
				while (_currentPos < _toDecodeLength) {
					_nextSignificantChar =
						_toDecode.charAt (_closingQuoteCharPos = _nextSignificantCharPos = _nextDelimiterPos ())
					;
					if (_nextSignificantChar == _quoteChar) {
						/*** find end of value ***/
							_endFound = _escapedQuotesFound = _false;
							while (!_endFound) {
								_closingQuoteCharPos = _toDecode.indexOf (_quoteChar,_closingQuoteCharPos + 1);
								if (_closingQuoteCharPos < 0) _closingQuoteCharPos = _toDecodeLength;
								_closingQuoteCharPos < _toDecodeLengthMinus1 &&
								_toDecode.charAt (_closingQuoteCharPos + 1) == _quoteChar
									? (_closingQuoteCharPos += (_escapedQuotesFound = _true))
									: (_endFound = _true)
								;
							}

						/*** add the column value ***/
							var _columnValue = _toDecode.slice (_nextSignificantCharPos + 1,_closingQuoteCharPos);
							_addColumn (
								_escapedQuotesFound
									? _columnValue.replace (_escapedQuoteCharRegExp,_quoteChar)
									: _columnValue
							);

						_currentPos = _closingQuoteCharPos + 1; // update _currentPos for _nextDelimiterPos call below
						_currentPos = _nextDelimiterPos ();     // find next delimiter
						_currentPos += _toDecode.charAt (_currentPos) == _valueDelimiter; // advance by 1, if delimiter is value delimiter
					} else if (
						_nextSignificantCharPos == _currentPos &&
						(_nextSignificantChar == '\n' || _nextSignificantChar == '\r')
					) {
						_rowNo++;
						_columnNo = 0;
						_currentPos += 1 + (
							_nextSignificantChar == '\r' &&
							_currentPos < _toDecodeLengthMinus1 &&
							_toDecode.charAt (_currentPos + 1) == '\n'
						);
					} else {
						_addColumn (_toDecode.slice (_currentPos,_nextSignificantCharPos));
						_currentPos = _nextSignificantCharPos + (_nextSignificantChar == _valueDelimiter);
					}
				}
				return _rows;
				/*?
					Static Methods
						Uize.Data.Csv.from
							Returns an array, being the records parsed from the specified CSV formatted data string.

							SYNTAX
							...............................................
							recordsARRAY = Uize.Data.Csv.from (csvDataSTR);
							...............................................

							VARIATION
							..................................................................
							recordsARRAY = Uize.Data.Csv.from (csvDataSTR,decodingOptionsOBJ);
							..................................................................

							When the optional =decodingOptionsOBJ= parameter is specified, then CSV data strings that have not been serialized in strict accordance with the rules laid out in RFC 4180 can be successfully parsed. If one uses the =encodingOptionsOBJ= parameter of the companion =Uize.Data.Csv.to= method to serialize data to CSV format in a way that deviates from the rules of RFC 4180, then you can specify those same options in the =decodingOptionsOBJ= parameter in order to successfully parse that non-standard serialized CSV data back into a records array.

							The value of the =encodingOptionsOBJ= parameter should be an object, with properties as follows...

							DECODING OPTIONS
							..............................................................................
							{
								columns:columnsARRAY,                       // optional
								hasHeader:hasHeaderBOOL,                    // optional, defaults to false
								trimPaddingOnParse:trimPaddingOnParseBOOL,  // optional, defaults to false
								quoteChar:quoteCharSTR,                     // optional, defaults to '"'
								rowType:rowTypeSTR,                         // optional, defaults to 'auto'
								valueDelimiter:valueDelimiterSTR            // optional, defaults to ','
							}
							..............................................................................

							columns
								An array, that will be used to store the column names for the CSV data if the value =true= is specified for the =hasHeader= option, or that can be used to supply the names of columns if the value =false= is specified for the =hasHeader= option and the value ='object'= is specified for the =rowType= option.

								When Data Has Header Row
									When parsing a CSV data string that contains a header row, to an array of arrays (ie. specifying the value ='array'= for the =rowType= option), and specifying the value =true= for the =hasHeader= option, the column names row doesn't make its way into the returned records array.

									This is by design, because the column names are not part of the data set. In such cases, specifying an array value for the =columns= option provides a way for you to obtain the column names. Even when parsing such a CSV data string to an array of objects, where each record object has key names that reflect the column names obtained from the header row, it still may be useful to get back a separate array of the column names - especially for the occasional case where the CSV data string has no data, but just the column names header row.

									NOTE

									The contents of an array specified for the =columns= option will be replaced with the column names from the CSV data string's header row. Typically, you would supply an empty array, but you could reuse an array with existing contents.

								When Data Doesn't Have Header Row
									When parsing a CSV data string that doesn't contain a header row, to an array of objects (ie. specifying the value ='object'= for the =rowType= option), then the =columns= option lets you specify the names of the columns.

									Column names supplied by the =columns= option will be used as the key names for the objects of the returned records array. In this case, the contents of the specified column names array will not be altered.

								NOTES
								- the default value for this option is ='all'= (not meaningful for the =Uize.Data.Csv.from= method)

							hasHeader
								A boolean, specifying whether or not the CSV data string to be parsed has a header row for the column names.

								When the value =true= is specified for this option, the first row of CSV data will be used for the column names and will be "gobbled" (ie. won't make its way into the returned records array). If an array reference is specified as a value for the =columns= option, then the column names read from the header row will be populated into the specified array. If the value ='object'= is specified for the =rowType= option, then the column names obtained from the header row will be used as the key names for the objects of the returned records array.

								NOTES
								- the default value for this option is =false=

							trimPaddingOnParse
								A boolean, specifying whether or not padding around non-quoted values should be trimmed away.

								While whitespace around value separator characters is considered significant, and while trimming such whitespace is specifically prohibited according to [[http://tools.ietf.org/html/rfc4180][RFC 4180]], there might be real world situations where one is dealing with CSV data that is not serialized strictly according to the rules laid out in RFC 4180, and where there might be spaces after comma value separators.

								In such cases, the value =true= can be specified for the =trimPaddingOnParse= option, which will cause the leading and trailing whitespace padding around the first and last non-whitespace characters of non-quoted values to be trimmed (for quoted values, this option will have no effect on the result). Use this option with caution.

								NOTES
								- the default value for this option is =false=

							quoteChar
								A string, specifying the *single* character used for quoting values in the CSV data string to be parsed.

								While [[http://tools.ietf.org/html/rfc4180][RFC 4180]] only addresses quoting of values using the double quote character, the =Uize.Data.Csv= module provides the flexibility to use other quoting characters - both when parsing using the =Uize.Data.Csv.from= method and serializing using the =Uize.Data.Csv.to= method.

								If you are dealing with CSV formatted data that has not been serialized in strict compliance with the rules of RFC 4180 and a quoting character other than the double quote was used when serializing it, then you can specify that character for the =quoteChar= option in order to parse that data.

								NOTES
								- the value of the =quoteChar= option may not be the same as the =valueDelimiter= option
								- the default value for this option is ='"'= (the double quote character)

							rowType
								A string, specifying the type for the records in the returned records array.

								- ='array'= - Each row's record is represented by an array of values for the various columns.

								- ='object'= - Each row's record is represented by an object, with keys named according to the column names.

								- ='auto'= (default) - Array or object type will be chosen based upon the value of the =hasHeader= option, with object type being chosen when =hasHeader= is =true=, and array type being chosen when =hasHeader= is =false=.

								If the value ='object'= is specified for the =rowType= option and the value =false= is specified for the =hasHeader= option, then the column names should be supplied in the =columns= option.

								NOTES
								- the default value for this option is ='auto'=

							valueDelimiter
								A string, specifying the delimiter that separates column values in rows of the CSV data string to be parsed.

								While [[http://tools.ietf.org/html/rfc4180][RFC 4180]] only addresses separating values using the comma character, the =Uize.Data.Csv= module provides the flexibility to use other value delimiter characters - both when parsing using the =Uize.Data.Csv.from= method and serializing using the =Uize.Data.Csv.to= method.

								If you are dealing with CSV formatted data that has not been serialized in strict compliance with the rules of RFC 4180 and a value delimiter string other than a single comma was used when serializing it, then you can specify that delimiter string for the =valueDelimiter= option in order to parse that data.

								NOTES
								- the value of the =valueDelimiter= option may not be the same as the =quoteChar= option, and may not contain the quoting character if it is a multi-character delimiter
								- the default value for this option is =','= (the comma character)

							Examples
								Default Decoding Options
									In this example, the CSV data string being parsed has been serialized in strict accordance to the rules laid out in RFC 4180, and is being parsed by the =Uize.Data.Csv.from= method using all the decoding option defaults (ie. no =decodingOptionsOBJ= parameter is being specified).

									INPUT
									............................................
									"John ""Willy""",Wilkey,(650) 123-4567
									Marie, Stevenson ,"(415) 456-7890, Ext. 214"
									Craig,Pollack,"(310) 987-6543
									(650) 303-1000"
									............................................

									PARSE
									...........................
									Uize.Data.Csv.from (input);
									...........................

									OUTPUT
									.......................................................
									[
										['John "Willy"','Wilkey','(650) 123-4567'],
										['Marie',' Stevenson ','(415) 456-7890, Ext. 214'],
										['Craig','Pollack','(310) 987-6543\n(650) 303-1000']
									]
									.......................................................

									Looking at the CSV data string, you'll notice a few things...

									- The value ="John ""Willy"""= is quoted because it contains the double quote quoting character, and the double quotes in the value are escaped by doubling them up (ie. two double quotes for each double quote being escaped).
									- The value ="(415) 456-7890, Ext. 214"= is quoted because it contains the comma value delimiter character.
									- The phone number column for the last row is quoted because it contains a linebreak and spans two lines.

									None of the above factors are a problem for the =Uize.Data.Csv.from= method, since all these behaviors comply with the rules of RFC 4180.

								Padding After Value Separator Comma, Trim Padding On Parse
									In this example, the CSV data string was originally serialized with a cosmetic space after the comma value delimiter.

									We happen to know this about the source material, so we specify the value =true= for the =trimPaddingOnParse= option. This results in the whitespace padding around values being trimmed away. In the returned records array, therefore, the column values do not contain padding.

									INPUT
									................................
									John, Wilkey, (650) 123-4567
									Marie, Stevenson, (415) 456-7890
									Craig, Pollack, (310) 987-6543
									................................

									PARSE
									.....................................................
									Uize.Data.Csv.from (input,{trimPaddingOnParse:true});
									.....................................................

									OUTPUT
									..........................................
									[
										['John','Wilkey','(650) 123-4567'],
										['Marie','Stevenson','(415) 456-7890'],
										['Craig','Pollack','(310) 987-6543']
									]
									..........................................

								No Header Row, Column Names Explicitly Specified
									In this example, we're parsing a CSV data string to an array of records and supplying the column names.

									INPUT
									..............................
									John,Wilkey,(650) 123-4567
									Marie,Stevenson,(415) 456-7890
									Craig,Pollack,(310) 987-6543
									..............................

									PARSE
									......................................................................
									Uize.Data.Csv.from (input,{columns:['firstName','lastName','phone']});
									......................................................................

									OUTPUT
									..................................................................
									[
										{firstName:'John',lastName:'Wilkey',phone:'(650) 123-4567'},
										{firstName:'Marie',lastName:'Stevenson',phone:'(415) 456-7890'},
										{firstName:'Craig',lastName:'Pollack',phone:'(310) 987-6543'}
									]
									..................................................................

									As you'll notice from the CSV data string, there is no header row to indicate the column names. Therefore, when we parse the string we provide the column names using the =columns= option. Now, because we're specifying an array for the =columns= option, and because we're not specifying a value for the =rowType= option (so it defaults to ='auto'=), the =Uize.Data.Csv.from= method chooses object type for the records. The column names that we've provided are used as the keys for the record objects.

								With Header Row
									In this example, the CSV data string contains a header row and we're parsing the string to an array of objects.

									INPUT
									..............................
									firstName,lastName,phone
									John,Wilkey,(650) 123-4567
									Marie,Stevenson,(415) 456-7890
									Craig,Pollack,(310) 987-6543
									..............................

									PARSE
									............................................
									Uize.Data.Csv.from (input,{hasHeader:true});
									............................................

									OUTPUT
									..................................................................
									[
										{firstName:'John',lastName:'Wilkey',phone:'(650) 123-4567'},
										{firstName:'Marie',lastName:'Stevenson',phone:'(415) 456-7890'},
										{firstName:'Craig',lastName:'Pollack',phone:'(310) 987-6543'}
									]
									..................................................................

									The =Uize.Data.Csv.from= method doesn't know that the CSV data string has a header row unless we tell it, so we specify the value =true= for the =hasHeader= option. Now, because we're specifying =true= for the =hasHeader= option, and because we're not specifying a value for the =rowType= option (so it defaults to ='auto'=), the =Uize.Data.Csv.from= method chooses object type for the records. The column names are obtained from the first row of the CSV data string and are used as the keys for the record objects.

								With Header Row, Rows Are Arrays
									In this example, the CSV data string contains a header row, but we want to parse the string to an array of arrays and don't want the column names in the data set.

									INPUT
									..............................
									firstName,lastName,phone
									John,Wilkey,(650) 123-4567
									Marie,Stevenson,(415) 456-7890
									Craig,Pollack,(310) 987-6543
									..............................

									PARSE
									............................................................
									Uize.Data.Csv.from (input,{hasHeader:true,rowType:'array'});
									............................................................

									OUTPUT
									..........................................
									[
										['John','Wilkey','(650) 123-4567'],
										['Marie','Stevenson','(415) 456-7890'],
										['Craig','Pollack','(310) 987-6543']
									]
									..........................................

									First off, the =Uize.Data.Csv.from= method doesn't know that the CSV data string has a header row unless we tell it, so we specify the value =true= for the =hasHeader= option. If we don't expicitly specify a value for the =rowType= option, this option will default to ='auto'=, and the =Uize.Data.Csv.from= method will decide to parse the CSV data string to an array of objects because we're specifying =true= for the =hasHeader= option. By specifying the value ='array'= for =rowType=, we override this automatic behavior. This results in the header row being "gobbled" up - it's not getting used as the keys for object records, and it doesn't belong in the data set.

								With Header Row, Rows Are Arrays, Get Back Column Names
									In this example, the CSV data string contains a header row, we want to parse the string to an array of arrays and don't want the column names in the data set, but we would like to know what the column names are.

									INPUT
									..............................
									firstName,lastName,phone
									John,Wilkey,(650) 123-4567
									Marie,Stevenson,(415) 456-7890
									Craig,Pollack,(310) 987-6543
									..............................

									PARSE
									................................................................................
									var columnNames = [];
									Uize.Data.Csv.from (input,{hasHeader:true,rowType:'array',columns:columnNames});
									................................................................................

									OUTPUT
									..........................................
									[
										['John','Wilkey','(650) 123-4567'],
										['Marie','Stevenson','(415) 456-7890'],
										['Craig','Pollack','(310) 987-6543']
									]
									..........................................

									First off, the =Uize.Data.Csv.from= method doesn't know that the CSV data string has a header row unless we tell it, so we specify the value =true= for the =hasHeader= option. We specify the value ='array'= for the =rowType= option to override the automatic behaviour in this case of parsing the CSV data string to an array of objects. Finally, we specify a reference to an empty array for the =columns= option. This empty array will be populated with the column names obtained from the CSV data string's header row. We can then use these column names later in other code.

								Values Quoted Using Single Quotes
									In this example, the CSV data string was originally serialized using a single quote character for quoting values, rather than the standard double quote character.

									We happen to know this about the source material, so we specify the value ='\''= for the =quoteChar= option. Our CSV data string parses correctly and life is good.

									INPUT
									....................................
									'John','Wilkey','(650) 123-4567'
									'Marie','Stevenson','(415) 456-7890'
									'Craig','Pollack','(310) 987-6543'
									....................................

									PARSE
									............................................
									Uize.Data.Csv.from (input,{quoteChar:'\''});
									............................................

									OUTPUT
									..........................................
									[
										['John','Wilkey','(650) 123-4567'],
										['Marie','Stevenson','(415) 456-7890'],
										['Craig','Pollack','(310) 987-6543']
									]
									..........................................

								Pipe Used As a Value Delimiter
									In this example, the (obviously) eccentric software that originally serialized the CSV data string used a "|" (pipe) character for separating column values.

									Fortunately, we happen to know this about the source material, so we specify the value ='|'= for the =valueDelimiter= option and the =Uize.Data.Csv.from= method saves the day.

									INPUT
									..............................
									John|Wilkey|(650) 123-4567
									Marie|Stevenson|(415) 456-7890
									Craig|Pollack|(310) 987-6543
									..............................

									PARSE
									................................................
									Uize.Data.Csv.from (input,{valueDelimiter:'|'});
									................................................

									OUTPUT
									..........................................
									[
										['John','Wilkey','(650) 123-4567'],
										['Marie','Stevenson','(415) 456-7890'],
										['Craig','Pollack','(310) 987-6543']
									]
									..........................................

								Space As Value Delimiter, Values Quoted Using Hash
									To one-up the software that serialized a CSV data string using a "|" (pipe) character for separating column values, some even crazier software decided to use the "#" (pound / hash) character for quoting column values and a single space for separating values.

									We suspect as much about the source material, based upon our deep-seated suspicions of the provider of the data, so we specify the value ='#'= for the =quoteChar= option and the value =' '= (space) for the =valueDelimiter= option. Everything checks out, and we've dodged another bullet.

									INPUT
									....................................
									#John# #Wilkey# #(650) 123-4567#
									#Marie# #Stevenson# #(415) 456-7890#
									#Craig# #Pollack# #(310) 987-6543#
									....................................

									PARSE
									..............................................................
									Uize.Data.Csv.from (input,{quoteChar:'#',valueDelimiter:' '});
									..............................................................

									OUTPUT
									..........................................
									[
										['John','Wilkey','(650) 123-4567'],
										['Marie','Stevenson','(415) 456-7890'],
										['Craig','Pollack','(310) 987-6543']
									]
									..........................................

							NOTES
							- see the companion =Uize.Data.Csv.to= static method
				*/
			};

			_package.to = function (_toEncode,_encodingOptions) {
				var
					_csvChunks = [],
					_firstRow = _toEncode [0],
					_alwaysQuote = _getDefaultedOption (_encodingOptions,'whenToQuoteValues') == 'always',
					_columns = _getDefaultedOption (_encodingOptions,'columns'),
					_hasHeader = _getDefaultedOption (_encodingOptions,'hasHeader'),
					_trimPaddingOnParse = _getDefaultedOption (_encodingOptions,'trimPaddingOnParse'),
					_quoteChar = _getDefaultedOption (_encodingOptions,'quoteChar'),
					_rowType = _getDefaultedOption (_encodingOptions,'rowType'),
					_valueDelimiter = _getDefaultedOption (_encodingOptions,'valueDelimiter'),
					_valueDelimiterHasPadding = Uize.String.hasPadding (_valueDelimiter),
					_escapedQuoteChar = _getEscapedQuoteChar (_encodingOptions),
					_quoteRegExp = _globalLiteralRegExp (_quoteChar),
					_rowTypeIsObject = _rowType == 'object' || (_rowType == 'auto' && _firstRow && !Uize.isArray (_firstRow))
				;
				if (_columns == 'all')
					_columns = !_firstRow
						? []
						: _rowTypeIsObject
							? Uize.keys (_firstRow)
							: Uize.map (_firstRow.length,'key')
				;
				var _totalColumns = _columns.length;
				for (var _rowNo = -1 - _hasHeader, _totalRows = _toEncode.length; ++_rowNo < _totalRows;) {
					var _row = _rowNo < 0 ? _columns : _toEncode [_rowNo];
					for (var _columnNo = -1; ++_columnNo < _totalColumns;) {
						var
							_columnValue = _row [_rowNo < 0 || !_rowTypeIsObject ? _columnNo : _columns [_columnNo]] + '',
							_valueHasQuoteChar = _columnValue.indexOf (_quoteChar) > -1,
							_quoteCharForValue =
								_valueHasQuoteChar ||
								_alwaysQuote ||
								(_trimPaddingOnParse ? Uize.String.hasPadding (_columnValue) : _valueDelimiterHasPadding) ||
								_columnValue.indexOf (_valueDelimiter) > -1 ||
								_columnValue.indexOf ('\n') > -1 ||
								_columnValue.indexOf ('\r') > -1
									? _quoteChar
									: ''
						;
						_csvChunks.push (
							(_columnNo ? _valueDelimiter : '') +
							_quoteCharForValue +
							(_valueHasQuoteChar ? _columnValue.replace (_quoteRegExp,_escapedQuoteChar) : _columnValue) +
							_quoteCharForValue
						);
					}
					_rowNo < _totalRows - 1 && _csvChunks.push ('\n');
				}
				return _csvChunks.join ('');
				/*?
					Static Methods
						Uize.Data.Csv.to
							Returns a string, being the specified array of records serialized to a CSV formatted data string.

							SYNTAX
							.............................................
							csvDataSTR = Uize.Data.Csv.to (recordsARRAY);
							.............................................

							VARIATION
							................................................................
							csvDataSTR = Uize.Data.Csv.to (recordsARRAY,encodingOptionsOBJ);
							................................................................

							When the optional =encodingOptionsOBJ= parameter is specified, then the way in which the records array is serialized to CSV data format can be configured to produce wide ranging results - even non-standard serialized CSV data that is not in strict accordance with the rules laid out in RFC 4180. If you use this parameter to produce serialized data that deviates from the rules of RFC 4180, then you should specify the same options in the =decodingOptionsOBJ= parameter of the companion =Uize.Data.Csv.from= method in order to successfully parse the non-standard serialized CSV data back into a records array.

							The value of the =encodingOptionsOBJ= parameter should be an object, with properties as follows...

							ENCODING OPTIONS
							..............................................................................
							{
								columns:columnsSTRorARRAY,                  // optional, defaults to 'all'
								hasHeader:hasHeaderBOOL,                    // optional, defaults to false
								trimPaddingOnParse:trimPaddingOnParseBOOL,  // optional, defaults to false
								quoteChar:quoteCharSTR,                     // optional, defaults to '"'
								rowType:rowTypeSTR,                         // optional, defaults to 'auto'
								valueDelimiter:valueDelimiterSTR,           // optional, defaults to ','
								whenToQuoteValues:whenToQuoteValuesSTR      // optional, defaults to 'auto'
							}
							..............................................................................

							columns
								An array, that can be used to supply column names when the value of the =hasHeader= option is =true= and the records to be serialized are of type array, or that can be used to specify the order of columns or to specify a subset of columns when the records to be serialized are of type object, or a string with the value ='all'= specifying that all columns should be serialized.

								If the value ='all'= is specified for the =columns= option, then the column names will be the keys from the first record if the records to be serialized are of type object, or the indices of the columns if the records to be serialized are of type array.

								When serializing an array of objects to a CSV data string, the =Uize.Data.Csv.to= method provides support for controlling the ordering of columns in the serialized data string, as well as serializing just a subset of the columns in the data set. For more info, see the section `Column Ordering And Filtering`.

								NOTES
								- the default value for this option is ='all'=

							hasHeader
								A boolean, specifying whether or not the serialized CSV data string should contain a header row.

								When the value =true= is specified for this option, the first row of the serialized CSV data will contain the names of the columns. This allows the CSV formatted data to be parsed later by code that may not know the column names for the data - the column names can be obtained from the serialized data. The column names for the first row will be obtained from the =columns= option.

								NOTES
								- the default value for this option is =false=

							trimPaddingOnParse
								A boolean, specifying whether or not padding around non-quoted values will be trimmed away when the serialized CSV data string is parsed at a later stage.

								While whitespace around value separator characters is considered significant, and while trimming such whitespace is specifically prohibited according to [[http://tools.ietf.org/html/rfc4180][RFC 4180]], data serialized by the =Uize.Data.Csv.to= method may at some point be parsed by code that doesn't strictly observe the rules laid out in RFC 4180 and which may strip padding around comma value separators.

								In such cases, the value =true= can be specified for the =trimPaddingOnParse= option, which will cause values that contain leading and/or trailing whitespace padding around the first and last non-whitespace characters to be quoted in order to ensure that whitespace that is part of values is not accidentally stripped by a non-compliant CSV parser.

								NOTES
								- the default value for this option is =false=

							quoteChar
								A string, specifying the *single* character that should be used for quoting values in the serialized CSV data string.

								While [[http://tools.ietf.org/html/rfc4180][RFC 4180]] only addresses quoting of values using the double quote character, the =Uize.Data.Csv= module provides the flexibility to use other quoting characters - both when serializing using the =Uize.Data.Csv.to= method and parsing using the =Uize.Data.Csv.from= method.

								When serializing data to CSV format using a quoting character other than double quotes, it is important to specify that character in the =quoteChar= option when later parsing that serialized data - the =Uize.Data.Csv.from= method cannot tell automatically from the CSV data string what the quoting character is. Whatever quoting character is specified, if a value contains that quote character, then that value will be quoted. As per the RFC 4180 rules, the quoting character is escaped by doubling it.

								NOTES
								- the value of the =quoteChar= option may not be the same as the =valueDelimiter= option
								- the default value for this option is ='"'= (the double quote character)

							rowType
								A string, specifying the type for the records in the records array to be serialized to a CSV data string.

								- ='array'= - Each row's record is represented by an array of values for the various columns.

								- ='object'= - Each row's record is represented by an object, with key/value pairs for the various columns, where the key is the column name and the value is the column value.

								- ='auto'= (default) - Array or object type will be chosen based upon the type of the first element of the records array being serialized.

								If the row type is ='array'= and the value =true= is specified for the =hasHeader= option, then the column names should be supplied in the =columns= option.

								IMPORTANT

								Specifying ='array'= or ='object'= for this encoding option of the =Uize.Data.Csv.to= method has less meaning than specifying ='array'= or ='object'= for the companion decoding option of the =Uize.Data.Csv.from= method. When parsing a CSV data string, the =rowType= option lets you control the type of the generated records array. When specifying ='array'= or ='object'= for the =rowType= option with the =Uize.Data.Csv.to= method, the serialization could produce faulty results if the specified row type does not match the actual type of the elements of the records array. Therefore, one will generally not specify an explicit value for this encoding option of the =Uize.Data.Csv.to= method.

								NOTES
								- the default value for this option is ='auto'=

							valueDelimiter
								A string, specifying the delimiter that should be used to separate column values in rows of the serialized CSV data string.

								While [[http://tools.ietf.org/html/rfc4180][RFC 4180]] only addresses separating values using the comma character, the =Uize.Data.Csv= module provides the flexibility to use other value delimiter characters - both when serializing using the =Uize.Data.Csv.to= method and parsing using the =Uize.Data.Csv.from= method.

								When serializing data to CSV format using a value delimiter character other than comma, it is important to specify that delimiter in the =valueDelimiter= option when later parsing that serialized data - the =Uize.Data.Csv.from= method cannot tell automatically from the CSV data string what the value delimiter is.

								Whatever value delimiter string is specified, if a value contains that string, then that value will be quoted. Also, if the value delimiter has whitespace padding, then the column values will always be quoted to ensure that later parsing doesn't result in the value delimiter's padding becoming whitespace in the parsed column values.

								NOTES
								- the value of the =valueDelimiter= option may not be the same as the =quoteChar= option, and may not contain the quoting character if it is a multi-character delimiter
								- the default value for this option is =','= (the comma character)

							whenToQuoteValues
								A boolean, specifying the quoting behavior when serializing column values.

								- ='always'= - Column values will always be quoted. When this value is specified for the =whenToQuoteValues= option, all column values in the serialized CSV data string will be quoted.

								- ='auto'= (default) - Column values will be automatically quoted, only when necessary. When this value is specified for the =whenToQuoteValues= option, column values will be quoted if they contain the quoting character (see the =quoteChar= option) or the value delimiter string (see the =valueDelimiter= option), if they contain linebreaks (either carriage return or linefeed characters), if they contain whitespace padding and the value =true= is specified for the =trimPaddingOnParse= option, or if the value delimiter (see the =valueDelimiter= option) contains whitespace padding and the value =false= is specified for the =trimPaddingOnParse= option.

								NOTES
								- the default value for this option is ='auto'=

							Examples
								Default Encoding Options
									In this example, we have some very plain vanilla data - in the form of an array of arrays - and we're serializing this data to a CSV data string in strict accordance with the rules laid out in RFC 4180.

									INPUT
									..........................................
									[
										['John','Wilkey','(650) 123-4567'],
										['Marie','Stevenson','(415) 456-7890'],
										['Craig','Pollack','(310) 987-6543']
									]
									..........................................

									SERIALIZE
									.........................
									Uize.Data.Csv.to (input);
									.........................

									OUTPUT
									..............................
									John,Wilkey,(650) 123-4567
									Marie,Stevenson,(415) 456-7890
									Craig,Pollack,(310) 987-6543
									..............................

									There is nothing particulatly challenging about the source records array - none of the values have special characters that would cause them to need quoting. To serialize to strict CSV format, we don't need to specify any encoding options in the optional =encodingOptionsOBJ= parameter. Sometimes life is just too easy.

								Default Encoding Options, Values Needing Quotes
									In this example, we're serializing data to a CSV data string in strict accordance with the rules laid out in RFC 4180, but some of the column values contain special characters that require them to be quoted.

									INPUT
									.......................................................
									[
										['John "Willy"','Wilkey','(650) 123-4567'],
										['Marie','Stevenson','(415) 456-7890, Ext. 214'],
										['Craig','Pollack','(310) 987-6543\n(650) 303-1000']
									]
									.......................................................

									SERIALIZE
									.........................
									Uize.Data.Csv.to (input);
									.........................

									OUTPUT
									..........................................
									"John ""Willy""",Wilkey,(650) 123-4567
									Marie,Stevenson,"(415) 456-7890, Ext. 214"
									Craig,Pollack,"(310) 987-6543
									(650) 303-1000"
									..........................................

									Comparing the source records array to the serialized CSV data string, you'll notice a few things...

									- The value ='John "Willy"'= had to be quoted as ="John ""Willy"""=, because it contains the double quote quoting character. Therefore, the serialized value has double quotes around it, and the double quotes in the value are escaped by doubling them up (ie. two double quotes for each double quote being escaped).
									- The value ='(415) 456-7890, Ext. 214'= had to be quoted because it contains the comma value delimiter character.
									- The value ='(650) 123-4567\n(650) 303-1000'= had to be quoted because it contains a linebreak and spans two lines.

									None of the above factors are a problem for the =Uize.Data.Csv.to= method, since all these behaviors comply with the rules of RFC 4180, and no special encoding options needed to be specified.

								Default Encoding Options, Values With Padding
									In this example, we're serializing data to a CSV data string in strict accordance with the rules laid out in RFC 4180, where some of the column values contain whitespace padding.

									INPUT
									............................................
									[
										['John',' Wilkey ','(650) 123-4567'],
										['Marie',' Stevenson ','(415) 456-7890'],
										['Craig',' Pollack ','(310) 987-6543']
									]
									............................................

									SERIALIZE
									.........................
									Uize.Data.Csv.to (input);
									.........................

									OUTPUT
									................................
									John, Wilkey ,(650) 123-4567
									Marie, Stevenson ,(415) 456-7890
									Craig, Pollack ,(310) 987-6543
									................................

									Because we're serializing to strict CSV format, none of the values that contain padding need to be quoted. This is because whitespace around the value separator is considered significant according to RFC 4180 and should not be stripped. Therefore, no special encoding options need to be specified when calling the =Uize.Data.Csv.to= method in this case.

								Values With Padding, Trim Padding On Parse
									In this example, we're serializing an array of arrays to a CSV data string, some of the values contain whitespace padding, and we know that the serialized CSV data string may at some point be parsed by code that trims padding around values.

									In order to protect against the padding in our values being stripped out later, we let the =Uize.Data.Csv.to= method know that padding will be trimmed, by some parser in the future, by specifying the value =true= for the =trimPaddingOnParse= option. This results in the =Uize.Data.Csv.to= method quoting those values that contain padding.

									INPUT
									............................................
									[
										['John',' Wilkey ','(650) 123-4567'],
										['Marie',' Stevenson ','(415) 456-7890'],
										['Craig',' Pollack ','(310) 987-6543']
									]
									............................................

									SERIALIZE
									...................................................
									Uize.Data.Csv.to (input,{trimPaddingOnParse:true});
									...................................................

									OUTPUT
									..................................
									John," Wilkey ",(650) 123-4567
									Marie," Stevenson ",(415) 456-7890
									Craig," Pollack ",(310) 987-6543
									..................................

								With Header Row, Column Names Explicitly Specified
									In this example, we're serializing an array of arrays to a CSV data string that has a header row, so we're supplying the column names explicitly.

									To make sure that the serialized CSV data string has a header row, we specify the value =true= for the =hasHeader= option. Problem is, the records array does not contain the column names. This is normal, since the column names really aren't part of the data set. To remedy this, we explicitly provide the =Uize.Data.Csv.to= method with the column names using the =columns= option.

									INPUT
									..........................................
									[
										['John','Wilkey','(650) 123-4567'],
										['Marie','Stevenson','(415) 456-7890'],
										['Craig','Pollack','(310) 987-6543']
									]
									..........................................

									SERIALIZE
									..............................................
									Uize.Data.Csv.to (
										input,
										{
											hasHeader:true,
											columns:['firstName','lastName','phone']
										}
									);
									..............................................

									OUTPUT
									..............................
									firstName,lastName,phone
									John,Wilkey,(650) 123-4567
									Marie,Stevenson,(415) 456-7890
									Craig,Pollack,(310) 987-6543
									..............................

								With Header Row, Rows Are Objects, Column Names From Object Keys
									In this example, we're serializing an array of objects to a CSV data string that has a header row, where the keys of the first record object are used as the column names.

									As you'll notice from the records array, the first record has the object keys defined in a different order to the other records. The =phone= key is first, followed by =lastName= and =firstName=. Because we're not explicitly specifying a column order, the columns' names and their ordering is all determined by the first record. If you're parsing the serialized CSV data string back to an array of objects later, then this shouldn't matter. If you care about the order, then refer to the example `With Header Row, Rows Are Objects, Column Order Specified`. To get the header row in the serialized CSV data string, we're specifying the value =true= for the =hasHeader= option.

									INPUT
									...................................................................
									[
										{phone:'(650) 123-4567',lastName:'Wilkey',firstName:'John'},
										{firstName:'Marie',lastName:'Stevenson',phone:'(415) 456-7890'},
										{firstName:'Craig',lastName:'Pollack',phone:'(310) 987-6543'}
									]
									...................................................................

									SERIALIZE
									..........................................
									Uize.Data.Csv.to (input,{hasHeader:true});
									..........................................

									OUTPUT
									..............................
									phone,lastName,firstName
									(650) 123-4567,Wilkey,John
									(415) 456-7890,Stevenson,Marie
									(310) 987-6543,Pollack,Craig
									..............................

								With Header Row, Rows Are Objects, Column Order Specified
									In this example, we're serializing an array of objects to a CSV data string that has a header row, and we're explicitly specifying the column order using the =columns= option.

									Unlike the example `With Header Row, Rows Are Objects, Column Names From Object Keys`, here we actually care about the order of the columns in the serialized CSV data string. Therefore, we are using the =columns= option to control the ordering. If we didn't do this, the ordering would be determined by the order of the keys in the first record object.

									To get the header row in the serialized CSV data string, we're specifying the value =true= for the =hasHeader= option. You could argue that controlling the column ordering would be even more important if the serialized CSV data string were to *not* contain a header row and was expected to be parsed at some later stage to an array of arrays, where there was an expected column ordering.

									INPUT
									...................................................................
									[
										{phone:'(650) 123-4567',lastName:'Wilkey',firstName:'John'},
										{firstName:'Marie',lastName:'Stevenson',phone:'(415) 456-7890'},
										{firstName:'Craig',lastName:'Pollack',phone:'(310) 987-6543'}
									]
									...................................................................

									SERIALIZE
									..............................................
									Uize.Data.Csv.to (
										input,
										{
											hasHeader:true,
											columns:['firstName','lastName','phone']
										}
									);
									..............................................

									OUTPUT
									..............................
									firstName,lastName,phone
									John,Wilkey,(650) 123-4567
									Marie,Stevenson,(415) 456-7890
									Craig,Pollack,(310) 987-6543
									..............................

								With Header Row, Rows Are Objects, Subset of Columns
									In this example, we're serializing an array of objects to a CSV data string that has a header row, and we're specifying a subset of the columns in the data set to be serialized.

									Not only does the =columns= option let us control the ordering of columns in the serialized CSV data string (see the example `With Header Row, Rows Are Objects, Column Order Specified`), it also lets us specify just a subset of columns to serialize. In this example we're serializing just the =firstName= and =lastName= columns. To get the header row in the serialized CSV data string, we're specifying the value =true= for the =hasHeader= option.

									INPUT
									...................................................................
									[
										{phone:'(650) 123-4567',lastName:'Wilkey',firstName:'John'},
										{firstName:'Marie',lastName:'Stevenson',phone:'(415) 456-7890'},
										{firstName:'Craig',lastName:'Pollack',phone:'(310) 987-6543'}
									]
									...................................................................

									SERIALIZE
									......................................
									Uize.Data.Csv.to (
										input,
										{
											hasHeader:true,
											columns:['firstName','lastName']
										}
									);
									......................................

									OUTPUT
									..................
									firstName,lastName
									John,Wilkey
									Marie,Stevenson
									Craig,Pollack
									..................

								With Header Row, Columns Are Indices
									In this example, we're serializing an array of arrays to a CSV data string that has a header row, and since we're not explicitly specifying the column names using the =columns= option, the column indices are used instead.

									To get the header row in the serialized CSV data string, we're specifying the value =true= for the =hasHeader= option. To have the array indices be used for the column names, we simply don't specify a value for the =columns= option. The default value of ='all'= when the row type is array causes the column indices to be used as the column names. This may be an unusual and atypical case, but it illustrates the behavior when this combination of options is used.

									INPUT
									..........................................
									[
										['John','Wilkey','(650) 123-4567'],
										['Marie','Stevenson','(415) 456-7890'],
										['Craig','Pollack','(310) 987-6543']
									]
									..........................................

									SERIALIZE
									..........................................
									Uize.Data.Csv.to (input,{hasHeader:true});
									..........................................

									OUTPUT
									..............................
									0,1,2
									John,Wilkey,(650) 123-4567
									Marie,Stevenson,(415) 456-7890
									Craig,Pollack,(310) 987-6543
									..............................

								Always Quote Values
									In this example, we're serializing an array of arrays to a CSV data string and forcing all values to be quoted by specifying the value ='always'= for the =whenToQuoteValues= option.

									If we didn't specify a value for the =whenToQuoteValues= option in this example, then none of the values would be quoted. That's because none of the values contain special characters that would require them to be quoted. If it is anticipated that the CSV data string may be parsed by an inferior or non-RFC 4180 compliant parser that requires all values to be quoted, then we can used this facility. Alternatively, if the data set would likely cause a mix of quoting and not quoting, and we have an aesthetic preference for a consistent look / treatment, then we can force all values to be quoted using this option.

									INPUT
									..........................................
									[
										['John','Wilkey','(650) 123-4567'],
										['Marie','Stevenson','(415) 456-7890'],
										['Craig','Pollack','(310) 987-6543']
									]
									..........................................

									SERIALIZE
									......................................................
									Uize.Data.Csv.to (input,{whenToQuoteValues:'always'});
									......................................................

									OUTPUT
									....................................
									"John","Wilkey","(650) 123-4567"
									"Marie","Stevenson","(415) 456-7890"
									"Craig","Pollack","(310) 987-6543"
									....................................

								Always Quote Values, Using Single Quotes
									In this example, we're serializing an array of arrays to a CSV data string and forcing all values to be quoted using a single quote character.

									We force all values to be quoted by specifying the value ='always'= for the =whenToQuoteValues= option, and we force single quotes to be used by specifying the value ='/''= for the =quoteChar= option. It is important, when serializing data using encoding options that don't conform to RFC 4180, that you specify the same options upon decoding data serialized in this way using the =Uize.Data.Csv.from= method. Compare this example to the example `Always Quote Values`, where all values are quoted, but using the RFC 4180 compliant double quote character.

									INPUT
									..........................................
									[
										['John','Wilkey','(650) 123-4567'],
										['Marie','Stevenson','(415) 456-7890'],
										['Craig','Pollack','(310) 987-6543']
									]
									..........................................

									SERIALIZE
									.....................................................................
									Uize.Data.Csv.to (input,{whenToQuoteValues:'always',quoteChar:'\''});
									.....................................................................

									OUTPUT
									....................................
									'John','Wilkey','(650) 123-4567'
									'Marie','Stevenson','(415) 456-7890'
									'Craig','Pollack','(310) 987-6543'
									....................................

								Use Pipe As a Value Delimiter
									In this example, we're serializing an array of arrays to a CSV data string, using a non-standard "|" (pipe) character as a value delimiter.

									This is an unusual case, but not quite as unusual as the example `Space As Value Delimiter, Quote Values Using Hash`. The =Uize.Data.Csv.to= method provides the flexibility to do some unusual things. It is important, when serializing data using encoding options that don't conform to RFC 4180, that you specify the same options upon decoding data serialized in this way using the =Uize.Data.Csv.from= method.

									INPUT
									..........................................
									[
										['John','Wilkey','(650) 123-4567'],
										['Marie','Stevenson','(415) 456-7890'],
										['Craig','Pollack','(310) 987-6543']
									]
									..........................................

									SERIALIZE
									..............................................
									Uize.Data.Csv.to (input,{valueDelimiter:'|'});
									..............................................

									OUTPUT
									..............................
									John|Wilkey|(650) 123-4567
									Marie|Stevenson|(415) 456-7890
									Craig|Pollack|(310) 987-6543
									..............................

								Space As Value Delimiter, Quote Values Using Hash
									In this example, a space is being used as a value delimiter and a "#" (pound / hash) character is being used as a quoting character.

									This is a rather unusual case, and who's to say why this choice of options would be made. This example demonstrates, however, that the =Uize.Data.Csv.to= method provides the flexibility to do some unusual things. It is important, when serializing data using encoding options that don't conform to RFC 4180, that you specify the same options upon decoding data serialized in this way using the =Uize.Data.Csv.from= method.

									INPUT
									..........................................
									[
										['John','Wilkey','(650) 123-4567'],
										['Marie','Stevenson','(415) 456-7890'],
										['Craig','Pollack','(310) 987-6543']
									]
									..........................................

									SERIALIZE
									............................................................
									Uize.Data.Csv.to (input,{quoteChar:'#',valueDelimiter:' '});
									............................................................

									OUTPUT
									....................................
									#John# #Wilkey# #(650) 123-4567#
									#Marie# #Stevenson# #(415) 456-7890#
									#Craig# #Pollack# #(310) 987-6543#
									....................................

								Value Delimiter Contains Whitespace
									In this example, the value delimiter being specified in the =valueDelimiter= option is a comma with a trailing space.

									This makes for a prettier CSV data string. We're not specifying a value for the =trimPaddingOnParse= option here, so it gets its default value of =false=. This means that the spaces introduced by the value delimiter could find their way into the column values when the CSV data string is parsed at a later stage. Therefore, the =Uize.Data.Csv.to= automatically quotes all the column values (as you'll see from the output) so that it is clear what's really inside the values and what's outside the values.

									INPUT
									..........................................
									[
										['John','Wilkey','(650) 123-4567'],
										['Marie','Stevenson','(415) 456-7890'],
										['Craig','Pollack','(310) 987-6543']
									]
									..........................................

									SERIALIZE
									...............................................
									Uize.Data.Csv.to (input,{valueDelimiter:', '});
									...............................................

									OUTPUT
									......................................
									"John", "Wilkey", "(650) 123-4567"
									"Marie", "Stevenson", "(415) 456-7890"
									"Craig", "Pollack", "(310) 987-6543"
									......................................

								Value Delimiter Contains Whitespace, Trim Padding on Parse
									In this example, the value delimiter being specified in the =valueDelimiter= option is a comma with a trailing space.

									This makes for a prettier CSV data string. We don't mind that there appears to be an extra leading space before the second and third column values, because we know that the code that will parse this CSV data string later will trim whitespace padding around values, and we specify that fact using the =trimPaddingOnParse= option.

									INPUT
									..........................................
									[
										['John','Wilkey','(650) 123-4567'],
										['Marie','Stevenson','(415) 456-7890'],
										['Craig',' Pollack ','(310) 987-6543']
									]
									..........................................

									SERIALIZE
									.......................................................................
									Uize.Data.Csv.to (input,{valueDelimiter:', ',trimPaddingOnParse:true});
									.......................................................................

									OUTPUT
									..................................
									John, Wilkey, (650) 123-4567
									Marie, Stevenson, (415) 456-7890
									Craig, " Pollack ", (310) 987-6543
									..................................

									Notice in the output how the value =' Pollack '= is quoted, while all the other values aren't. This is because the value itself contains padding, and the =true= value for =trimPaddingOnParse= indicates that values containing padding should be quoted or there padding might be trimmed away in error during parsing at a later stage.

							NOTES
							- see the companion =Uize.Data.Csv.from= static method
				*/
			};

		return _package;
	}
});

