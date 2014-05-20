/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Str.Whitespace Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Instance
	importance: 1
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Str.Whitespace= module provides methods for working with strings that may contain whitespace characters.

		*DEVELOPERS:* `Chris van Rensburg`

		In a Nutshell
			The =Uize.Str.Whitespace= module provides methods for testing if strings contain whitespace characters, if they contain non-whitespace characters, if they are only whitespace or non-whitespace characters, and for finding the index of whitespace or non-whitespace characters.

			Whitespace Characters ~~ Whitespace Character
				.

				...
				<< table >>

				title: Fooo
				data
				:| Code | Escape | Description |
				:| 9 | \t | Horizontal Tab (HT) |
				:| 10 | \n | Line Feed (LF) |
				:| 11 | \x0b | Vertical Tab (VT) |
				:| 12 | \f | Form Feed (FF) |
				:| 13 | \r | Carriage Return (CR) |
				:| 32 | \x20 | Space |
				:| 160 | \xa0 | Non-breaking space |
				:| 8192 | \u2000 | -- |
				:| 8193 | \u2001 | -- |
				:| 8194 | \u2002 | En Space |
				:| 8195 | \u2003 | Em Space |
				:| 8196 | \u2004 | -- |
				:| 8197 | \u2005 | Four-per-em Space |
				:| 8198 | \u2006 | -- |
				:| 8199 | \u2007 | Figure Space |
				:| 8200 | \u2008 | Punctuation Space |
				:| 8201 | \u2009 | Thin Space |
				:| 8202 | \u200a | Hair Space |
				:| 8203 | \u200b | Zero-width Space |
				:| 8232 | \u2028 | Line Separator |
				:| 8233 | \u2029 | Paragraph Separator |
				:| 12288 | \u3000 | Ideographic Space |
				...

				The =Uize.Str.Whitespace= module provides the following methods for dealing with whitespace characters...

				- =Uize.Str.Whitespace.isWhitespace=
				- =Uize.Str.Whitespace.hasWhitespace=
				- =Uize.Str.Whitespace.indexOfWhitespace=
				- =Uize.Str.Whitespace.lastIndexOfWhitespace=

			Non-whitespace Characters ~~ Non-whitespace Character
				Non-whitespace characters are defined simply as any characters that don't fit the definition for `whitespace characters`

				The =Uize.Str.Whitespace= module provides the following methods for dealing with non-whitespace characters...

				- =Uize.Str.Whitespace.isNonWhitespace=
				- =Uize.Str.Whitespace.hasNonWhitespace=
				- =Uize.Str.Whitespace.indexOfNonWhitespace=
				- =Uize.Str.Whitespace.lastIndexOfNonWhitespace=
*/

Uize.module ({
	name:'Uize.Str.Whitespace',
	required:'Uize.Str.CharClass',
	builder:function () {
		'use strict';

		var
			/*** General Variables ***/
				_whitespaceCharClass = new Uize.Str.CharClass ([
					9,    // \t     - Horizontal Tab (HT)
					10,   // \n     - Line Feed (LF)
					11,   // \x0b   - Vertical Tab (VT)
					12,   // \f     - Form Feed (FF)
					13,   // \r     - Carriage Return (CR)
					32,   // \x20   - Space
					160,  // \xa0   - Non-breaking space
					8192, // \u2000 - ??
					8193, // \u2001 - ??
					8194, // \u2002 - En Space
					8195, // \u2003 - Em Space
					8196, // \u2004 - ??
					8197, // \u2005 - Four-per-em Space
					8198, // \u2006 - ??
					8199, // \u2007 - Figure Space
					8200, // \u2008 - Punctuation Space
					8201, // \u2009 - Thin Space
					8202, // \u200a - Hair Space
					8203, // \u200b - Zero-width Space
					8232, // \u2028 - Line Separator
					8233, // \u2029 - Paragraph Separator
					12288 // \u3000 - Ideographic Space
				])
		;

		return Uize.package (
			Uize.map (
				{
					isWhitespace:'isClassChars',
						/*?
							Static Methods
								Uize.Str.Whitespace.isWhitespace
									Returns a boolean, indicating whether or not the specified source string contains only `whitespace characters`.

									SYNTAX
									................................................................
									isWhitespaceBOOL = Uize.Str.Whitespace.isWhitespace (sourceSTR);
									................................................................

									EXAMPLES
									....................................................................
									Uize.Str.Whitespace.isWhitespace ('   ');           // returns true
									Uize.Str.Whitespace.isWhitespace ('\t\t\t');        // returns true
									Uize.Str.Whitespace.isWhitespace (' \t \r \r\n ');  // returns true

									Uize.Str.Whitespace.isWhitespace ('');              // returns false
									Uize.Str.Whitespace.isWhitespace ('foobar');        // returns false
									Uize.Str.Whitespace.isWhitespace (' \t * \r\n ');   // returns false
									....................................................................

									NOTES
									- see the companion =Uize.Str.Whitespace.isNonWhitespace= static method
									- compare to the related =Uize.Str.Whitespace.hasWhitespace= static method
						*/

					isNonWhitespace:'isNonClassChars',
						/*?
							Static Methods
								Uize.Str.Whitespace.isNonWhitespace
									Returns a boolean, indicating whether or not the specified source string contains only `non-whitespace characters`.

									SYNTAX
									......................................................................
									isNonWhitespaceBOOL = Uize.Str.Whitespace.isNonWhitespace (sourceSTR);
									......................................................................

									EXAMPLES
									.....................................................................
									Uize.Str.Whitespace.isNonWhitespace ('foobar');      // returns true
									Uize.Str.Whitespace.isNonWhitespace ('');            // returns true

									Uize.Str.Whitespace.isNonWhitespace ('foo bar');     // returns false
									Uize.Str.Whitespace.isNonWhitespace ('foo\nbar');    // returns false
									Uize.Str.Whitespace.isNonWhitespace ('\t\tfoobar');  // returns false
									Uize.Str.Whitespace.isNonWhitespace ('   ');         // returns false
									.....................................................................

									NOTES
									- see the companion =Uize.Str.Whitespace.isWhitespace= static method
									- compare to the related =Uize.Str.Whitespace.hasNonWhitespace= static method
						*/

					hasWhitespace:'hasClassChars',
						/*?
							Static Methods
								Uize.Str.Whitespace.hasWhitespace
									Returns a boolean, indicating whether or not the specified source string contains any `whitespace characters`.

									SYNTAX
									..................................................................
									hasWhitespaceBOOL = Uize.Str.Whitespace.hasWhitespace (sourceSTR);
									..................................................................

									EXAMPLES
									.................................................................
									Uize.Str.Whitespace.hasWhitespace ('  foobar');  // returns true
									Uize.Str.Whitespace.hasWhitespace ('foobar  ');  // returns true
									Uize.Str.Whitespace.hasWhitespace ('foo  bar');  // returns true
									Uize.Str.Whitespace.hasWhitespace ('  \t\r\n');  // returns true

									Uize.Str.Whitespace.hasWhitespace ('foobar');    // returns false
									Uize.Str.Whitespace.hasWhitespace ('');          // returns false
									.................................................................

									NOTES
									- see the companion =Uize.Str.Whitespace.hasNonWhitespace= static method
						*/

					hasNonWhitespace:'hasNonClassChars',
						/*?
							Static Methods
								Uize.Str.Whitespace.hasNonWhitespace
									Returns a boolean, indicating whether or not the specified source string contains any `non-whitespace characters`.

									SYNTAX
									........................................................................
									hasNonWhitespaceBOOL = Uize.Str.Whitespace.hasNonWhitespace (sourceSTR);
									........................................................................

									EXAMPLES
									....................................................................
									Uize.Str.Whitespace.hasNonWhitespace ('  foobar');  // returns true
									Uize.Str.Whitespace.hasNonWhitespace ('foobar  ');  // returns true
									Uize.Str.Whitespace.hasNonWhitespace ('foo  bar');  // returns true
									Uize.Str.Whitespace.hasNonWhitespace ('foobar');    // returns true

									Uize.Str.Whitespace.hasNonWhitespace ('  \t\r\n');  // returns false
									Uize.Str.Whitespace.hasNonWhitespace ('');          // returns false
									....................................................................

									NOTES
									- see the companion =Uize.Str.Whitespace.hasWhitespace= static method
						*/

					indexOfWhitespace:'indexOfClassChar',
						/*?
							Static Methods
								Uize.Str.Whitespace.indexOfWhitespace
									Returns an integer, indicating the index of the first `whitespace character` in the specified source string.

									DIFFERENT USAGES

									`Get the Index of the First Whitespace Character in a String`
									.............................................................
									indexINT = Uize.Str.Whitespace.indexOfWhitespace (sourceSTR);
									.............................................................

									`Get the Index of the First Whitespace Character After a Specified Start Position`
									.........................................................................
									indexINT = Uize.Str.Whitespace.indexOfWhitespace (sourceSTR,startPosINT);
									.........................................................................

									Get the Index of the First Whitespace Character in a String
										In the typical use case, the index of the first `whitespace character` in a source string can be obtained by specifying just the source string as the single argument.

										SYNTAX
										.............................................................
										indexINT = Uize.Str.Whitespace.indexOfWhitespace (sourceSTR);
										.............................................................

										If the source string does not contain any whitespace characters, then the value =-1= will be returned.

										EXAMPLES
										......................................................................
										Uize.Str.Whitespace.indexOfWhitespace ('   foobar');     // returns 0
										Uize.Str.Whitespace.indexOfWhitespace ('foobar   ');     // returns 6
										Uize.Str.Whitespace.indexOfWhitespace ('foo bar baz ');  // returns 3

										Uize.Str.Whitespace.indexOfWhitespace ('');              // returns -1
										Uize.Str.Whitespace.indexOfWhitespace ('foobar');        // returns -1
										......................................................................

									Get the Index of the First Whitespace Character After a Specified Start Position
										To obtain the index of the first `whitespace character` after a start position, the start position can be specified for the optional second argument.

										SYNTAX
										.........................................................................
										indexINT = Uize.Str.Whitespace.indexOfWhitespace (sourceSTR,startPosINT);
										.........................................................................

										If the source string does not contain any whitespace characters after the specified start position, then the value =-1= will be returned.

										EXAMPLES
										..............................................................................
										Uize.Str.Whitespace.indexOfWhitespace ('foo bar baz qux ',4);    // returns 7
										Uize.Str.Whitespace.indexOfWhitespace ('foo \r\n\t\n \rbar',5);  // returns 5
										Uize.Str.Whitespace.indexOfWhitespace ('foo bar',-10);           // returns 3

										Uize.Str.Whitespace.indexOfWhitespace ('foo barbazqux',4);       // returns -1
										Uize.Str.Whitespace.indexOfWhitespace ('foo barbazqux ',100);    // returns -1
										..............................................................................

									NOTES
									- see the companion =Uize.Str.Whitespace.indexOfNonWhitespace= static method
									- see the related =Uize.Str.Whitespace.lastIndexOfWhitespace= and =Uize.Str.Whitespace.lastIndexOfNonWhitespace= static methods
						*/

					lastIndexOfWhitespace:'lastIndexOfClassChar',
						/*?
							Static Methods
								Uize.Str.Whitespace.lastIndexOfWhitespace
									Returns an integer, indicating the index of the last `whitespace character` in the specified source string.

									DIFFERENT USAGES

									`Get the Index of the Last Whitespace Character in a String`
									.................................................................
									indexINT = Uize.Str.Whitespace.lastIndexOfWhitespace (sourceSTR);
									.................................................................

									`Get the Index of the Last Whitespace Character Before a Specified Start Position`
									.............................................................................
									indexINT = Uize.Str.Whitespace.lastIndexOfWhitespace (sourceSTR,startPosINT);
									.............................................................................

									Get the Index of the Last Whitespace Character in a String
										In the typical use case, the index of the last `whitespace character` in a source string can be obtained by specifying just the source string as the single argument.

										SYNTAX
										.................................................................
										indexINT = Uize.Str.Whitespace.lastIndexOfWhitespace (sourceSTR);
										.................................................................

										If the source string does not contain any whitespace characters, then the value =-1= will be returned.

										EXAMPLES
										...........................................................................
										Uize.Str.Whitespace.lastIndexOfWhitespace ('foobar   ');      // returns 8
										Uize.Str.Whitespace.lastIndexOfWhitespace ('foo  bar  baz');  // returns 9
										Uize.Str.Whitespace.lastIndexOfWhitespace (' foobar');        // returns 0

										Uize.Str.Whitespace.lastIndexOfWhitespace ('');               // returns -1
										Uize.Str.Whitespace.lastIndexOfWhitespace ('foobar');         // returns -1
										...........................................................................

									Get the Index of the Last Whitespace Character Before a Specified Start Position
										To obtain the index of the last `whitespace character` before a start position, the start position can be specified for the optional second argument.

										SYNTAX
										.............................................................................
										indexINT = Uize.Str.Whitespace.lastIndexOfWhitespace (sourceSTR,startPosINT);
										.............................................................................

										If the source string does not contain any whitespace characters before the specified start position, then the value =-1= will be returned.

										EXAMPLES
										..................................................................................
										Uize.Str.Whitespace.lastIndexOfWhitespace ('foo bar baz qux ',14);   // returns 11
										Uize.Str.Whitespace.lastIndexOfWhitespace ('foo bar baz qux ',50);   // returns 15
										Uize.Str.Whitespace.lastIndexOfWhitespace ('foo \r\n\t\n \rbar',5);  // returns 5

										Uize.Str.Whitespace.lastIndexOfWhitespace ('foobar baz qux',3);      // returns -1
										Uize.Str.Whitespace.lastIndexOfWhitespace ('foobarbazqux ',-10);     // returns -1
										Uize.Str.Whitespace.lastIndexOfWhitespace ('foobar',10);             // returns -1
										..................................................................................

									NOTES
									- see the companion =Uize.Str.Whitespace.lastIndexOfNonWhitespace= static method
									- see the related =Uize.Str.Whitespace.indexOfWhitespace= and =Uize.Str.Whitespace.indexOfNonWhitespace= static methods
						*/

					indexOfNonWhitespace:'indexOfNonClassChar',
						/*?
							Static Methods
								Uize.Str.Whitespace.indexOfNonWhitespace
									Returns an integer, indicating the index of the first `non-whitespace character` in the specified source string.

									DIFFERENT USAGES

									`Get the Index of the First Non-whitespace Character in a String`
									................................................................
									indexINT = Uize.Str.Whitespace.indexOfNonWhitespace (sourceSTR);
									................................................................

									`Get the Index of the First Non-whitespace Character After a Specified Start Position`
									............................................................................
									indexINT = Uize.Str.Whitespace.indexOfNonWhitespace (sourceSTR,startPosINT);
									............................................................................

									Get the Index of the First Non-whitespace Character in a String
										In the typical use case, the index of the first `non-whitespace character` in a source string can be obtained by specifying just the source string as the single argument.

										SYNTAX
										................................................................
										indexINT = Uize.Str.Whitespace.indexOfNonWhitespace (sourceSTR);
										................................................................

										If the source string does not contain any non-whitespace characters, then the value =-1= will be returned.

										EXAMPLES
										...........................................................................
										Uize.Str.Whitespace.indexOfNonWhitespace ('foo bar');         // returns 0
										Uize.Str.Whitespace.indexOfNonWhitespace ('        foobar');  // returns 8
										Uize.Str.Whitespace.indexOfNonWhitespace ('   foo bar   ');   // returns 3

										Uize.Str.Whitespace.indexOfNonWhitespace ('');                // returns -1
										Uize.Str.Whitespace.indexOfNonWhitespace ('  \r\t\n  ');      // returns -1
										...........................................................................

									Get the Index of the First Non-whitespace Character After a Specified Start Position
										To obtain the index of the first `non-whitespace character` after a start position, the start position can be specified for the optional second argument.

										SYNTAX
										............................................................................
										indexINT = Uize.Str.Whitespace.indexOfNonWhitespace (sourceSTR,startPosINT);
										............................................................................

										If the source string does not contain any non-whitespace characters after the specified start position, then the value =-1= will be returned.

										EXAMPLES
										..............................................................................
										Uize.Str.Whitespace.indexOfNonWhitespace ('foo  bar  baz',3);    // returns 5
										Uize.Str.Whitespace.indexOfNonWhitespace ('   foobarbaz   ',8);  // returns 8

										Uize.Str.Whitespace.indexOfNonWhitespace ('foo  \r\n\t ',3);     // returns -1
										Uize.Str.Whitespace.indexOfNonWhitespace ('foobarbazqux',100);   // returns -1
										..............................................................................

									NOTES
									- see the companion =Uize.Str.Whitespace.indexOfWhitespace= static method
									- see the related =Uize.Str.Whitespace.lastIndexOfWhitespace= and =Uize.Str.Whitespace.lastIndexOfNonWhitespace= static methods
						*/

					lastIndexOfNonWhitespace:'lastIndexOfNonClassChar'
						/*?
							Static Methods
								Uize.Str.Whitespace.lastIndexOfNonWhitespace
									Returns an integer, indicating the index of the last `non-whitespace character` in the specified source string.

									DIFFERENT USAGES

									`Get the Index of the Last Non-whitespace Character in a String`
									....................................................................
									indexINT = Uize.Str.Whitespace.lastIndexOfNonWhitespace (sourceSTR);
									....................................................................

									`Get the Index of the Last Non-Whitespace Character Before a Specified Start Position`
									................................................................................
									indexINT = Uize.Str.Whitespace.lastIndexOfNonWhitespace (sourceSTR,startPosINT);
									................................................................................

									Get the Index of the Last Non-whitespace Character in a String
										In the typical use case, the index of the last `non-whitespace character` in a source string can be obtained by specifying just the source string as the single argument.

										SYNTAX
										....................................................................
										indexINT = Uize.Str.Whitespace.lastIndexOfNonWhitespace (sourceSTR);
										....................................................................

										If the source string does not contain any non-whitespace characters, then the value =-1= will be returned.

										EXAMPLES
										.............................................................................
										Uize.Str.Whitespace.lastIndexOfNonWhitespace ('   foobar');     // returns 8
										Uize.Str.Whitespace.lastIndexOfNonWhitespace ('  foo  bar  ');  // returns 9
										Uize.Str.Whitespace.lastIndexOfNonWhitespace ('f  \r\n\t\n ');  // returns 0

										Uize.Str.Whitespace.lastIndexOfNonWhitespace ('');              // returns -1
										Uize.Str.Whitespace.lastIndexOfNonWhitespace (' \r\n\t\n ');    // returns -1
										.............................................................................

									Get the Index of the Last Non-whitespace Character Before a Specified Start Position
										To obtain the index of the last `non-whitespace character` before a start position, the start position can be specified for the optional second argument.

										SYNTAX
										................................................................................
										indexINT = Uize.Str.Whitespace.lastIndexOfNonWhitespace (sourceSTR,startPosINT);
										................................................................................

										If the source string does not contain any non-whitespace characters before the specified start position, then the value =-1= will be returned.

										EXAMPLES
										....................................................................................
										Uize.Str.Whitespace.lastIndexOfNonWhitespace ('  foo   bar  ',7);      // returns 4
										Uize.Str.Whitespace.lastIndexOfNonWhitespace ('   foobar   ',6);       // returns 6
										Uize.Str.Whitespace.lastIndexOfNonWhitespace ('  foo  bar  ',100);     // returns 9

										Uize.Str.Whitespace.lastIndexOfNonWhitespace ('  \r\n\t  foobar ',5);  // returns -1
										Uize.Str.Whitespace.lastIndexOfNonWhitespace ('foo barbazqux ',-100);  // returns -1
										Uize.Str.Whitespace.lastIndexOfNonWhitespace ('  \r\n\t  ',50);        // returns -1
										....................................................................................

									NOTES
									- see the companion =Uize.Str.Whitespace.lastIndexOfWhitespace= static method
									- see the related =Uize.Str.Whitespace.indexOfWhitespace= and =Uize.Str.Whitespace.indexOfNonWhitespace= static methods
						*/
				},
				function (_functionName) {
					var _function = _whitespaceCharClass [_functionName];
					return function () {return _function.apply (_whitespaceCharClass,arguments)};
				}
			)
		);
	}
});

