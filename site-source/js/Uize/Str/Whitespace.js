/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Str.Whitespace Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2016 UIZE
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
			The =Uize.Str.Whitespace= module provides methods for testing if strings contain whitespace characters, if they contain non-whitespace characters, if they are only whitespace or non-whitespace characters, and for finding the first index or last index of whitespace or non-whitespace characters.

			Whitespace Characters ~~ Whitespace Character
				The =Uize.Str.Whitespace= module defines whitespace characters as any character contained in the two character classes, `inline whitespace characters` and `line break whitespace characters`.

				Inline Whitespace Characters
					Inline whitescpace characters are defined as any character from the set of characters listed in the following table...

					........................................
					<< table >>

					title: Inline Whitespace Characters
					data
					:| Code | Escape | Description |
					:| 9 | \t | Horizontal Tab (HT) |
					:| 11 | \x0b | Vertical Tab (VT) |
					:| 12 | \f | Form Feed (FF) |
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
					........................................

					The character codes for the set of inline whitescpace characters is exposed through the =Uize.Str.Whitespace.inlineWhitespaceCharCodes= static property.

				Line Break Whitespace Characters
					Line break whitescpace characters are defined as any character from the set of characters listed in the following table...

					.......................................
					<< table >>

					title: Line Break Whitespace Characters
					data
					:| Code | Escape | Description |
					:| 10 | \n | Line Feed (LF) |
					:| 13 | \r | Carriage Return (CR) |
					.......................................

					The character codes for the set of line break whitescpace characters is exposed through the =Uize.Str.Whitespace.linebreakCharCodes= static property.

				Methods for Dealing With Whitespace Characters
					The =Uize.Str.Whitespace= module provides the following methods for dealing with whitespace characters...

					- =Uize.Str.Whitespace.isWhitespace= - tests if the source string is only whitespace characters
					- =Uize.Str.Whitespace.hasWhitespace= - tests if the source string contains any whitespace characters
					- =Uize.Str.Whitespace.indexOfWhitespace= - finds the first whitespace character and returns its index
					- =Uize.Str.Whitespace.lastIndexOfWhitespace= - finds the last whitespace character and returns its index

			Non-whitespace Characters ~~ Non-whitespace Character
				Non-whitespace characters are defined simply as any characters that don't fit the definition for `whitespace characters`

				The =Uize.Str.Whitespace= module provides the following methods for dealing with non-whitespace characters...

				- =Uize.Str.Whitespace.isNonWhitespace= - tests if the source string is only non-whitespace characters
				- =Uize.Str.Whitespace.hasNonWhitespace= - tests if the source string contains any non-whitespace characters
				- =Uize.Str.Whitespace.indexOfNonWhitespace= - finds the first non-whitespace character and returns its index
				- =Uize.Str.Whitespace.lastIndexOfNonWhitespace= - finds the last non-whitespace character and returns its index

			Benefits Over Using Regular Expressions
				While it is possible to use regular expressions to detect whitespace and non-whitespace characters in strings, the =Uize.Str.Whitespace= module offers some key benefits.

				Improved Performance
					By avoiding the use of regular expressions, the =Uize.Str.Whitespace= module can achieve improved performance in performance critital applications such as parser implementations.

					In addition to avoiding regular expressions, the methods of the =Uize.Str.Whitespace= module also achieve improved performnce by implementing an optimized handling for the special case of single character source strings that avoids looping.

				Convenient Index Methods
					The various index type methods of the =Uize.Str.Whitespace= module provide a more convenient and semantically elegant way of finding the index of whitespace or non-whitespace characters in a string.

					To illustrate this, consider the following example of how an index could be obtained using a whitespace matcher regular expression versus using the =Uize.Str.Whitespace= module...

					BEFORE
					.........................................
					var regExp = /\s/g;
					regExp.exec (sourceStr);
					var whitespacePos = regExp.lastIndex - 1;
					.........................................

					Using a regular expression, we have to create the regular expression and assign it to a local variable. Then, we call the =exec= method on the regular expression instance. Finally, we compute the index of the matched whitespace character by using the regular expression instance's =lastIndex= property. In order for this property to have a meaningful value, the regular expression instance must be created with the "g" flag.

					All of this is not so intuitive. In contrast, using the =Uize.Str.Whitespace.indexOfWhitespace= static method produces a statement that is easy to read and make sense of...

					AFTER
					......................................................................
					var whitespacePos = Uize.Str.Whitespace.indexOfWhitespace (sourceStr);
					......................................................................

				Start Position
					The index type methods of the =Uize.Str.Whitespace= module provide any easy and understandable way to specify a start position for a search for whitespace or non-whitespace characters.

					Consider the following example of how a start position for a search can be achieved using regular expression versus using the =Uize.Str.Whitespace= module...

					BEFORE
					.........................................
					var regExp = /\s/g;
					regExp.lastIndex = startPos;
					regExp.exec (sourceStr);
					var whitespacePos = regExp.lastIndex - 1;
					.........................................

					Using a regular expression, we have to set the start position as the value for its =lastIndex= property before we call its =exec= method. Combining this with the other steps we need to perform, we end up with something that is far less elegant than just using the =Uize.Str.Whitespace.indexOfWhitespace= static and specifying the start position using the optional second argument...

					AFTER
					...............................................................................
					var whitespacePos = Uize.Str.Whitespace.indexOfWhitespace (sourceStr,startPos);
					...............................................................................

				Backwards Scanning
					The =Uize.Str.Whitespace.lastIndexOfWhitespace= and =Uize.Str.Whitespace.lastIndexOfNonWhitespace= methods support backwards scanning to find the last whitespace or non-whitespace character in a source string.

					This can be achieved with regular expressions by applying a bit of trickery, but there can be a performance cost. Consider the following example of how a last index of whitespace could be obtained using a regular expression versus using the =Uize.Str.Whitespace= module...

					BEFORE
					.....................................................................
					var regExp = /\s\S*$/g;
					var match = regExp.exec (sourceStr);
					var whitespacePos = match ? regExp.lastIndex - match [0].length : -1;
					.....................................................................

					In order to achieve a backwards scan for the last whitespace character using a regular expression, we have to create a regular expression than matches a whitespace character, followed by any number of non-whitespace characters, and that is anchored to the end of the source string. Now, because our match could contain more than one character, we need to use the length of the first element in the match array to adjust the value of the =lastIndex= property.

					We don't need to deal with this kind of trickery if we just use the dedicated =Uize.Str.Whitespace.lastIndexOfWhitespace= static method...

					AFTER
					..........................................................................
					var whitespacePos = Uize.Str.Whitespace.lastIndexOfWhitespace (sourceStr);
					..........................................................................

					Backwards Scanning and Start Position
						While backwards scanning for whitespace or non-whitespace characters using regular expressions is awkward enough, backwards scanning from a start position is even clumsier.

						One way to accomplish this would be to create a slice of the source string that terminates at the desired start position for the scan. Then, the previously mentioned approach to `backwards scanning` using regular expressions could be applied.

						BEFORE
						.....................................................................
						var regExp = /\s\S*$/g;
						var match = regExp.exec (sourceStr.slice (0,startPos + 1));
						var whitespacePos = match ? regExp.lastIndex - match [0].length : -1;
						.....................................................................

						Having to create a temporary slice of the source string and then use a tricky regular expression match on that slice is quite unfortunate from a performance perspective. The approach to supporting start position that is implemented in the =Uize.Str.Whitespace.lastIndexOfWhitespace= and =Uize.Str.Whitespace.lastIndexOfNonWhitespace= methods is better suited to performance critical situations.

						AFTER
						...................................................................................
						var whitespacePos = Uize.Str.Whitespace.lastIndexOfWhitespace (sourceStr,startPos);
						...................................................................................
*/

Uize.module ({
	name:'Uize.Str.Whitespace',
	required:'Uize.Str.CharClass',
	builder:function () {
		'use strict';

		var
			/*** General Variables ***/
				_inlineWhitespaceCharCodes = [
					9,    // \t     - Horizontal Tab (HT)
					11,   // \x0b   - Vertical Tab (VT)
					12,   // \f     - Form Feed (FF)
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
				],
				_linebreakCharCodes = [
					10,   // \n     - Line Feed (LF)
					13    // \r     - Carriage Return (CR)
				],
				_whitespaceCharClass = Uize.Str.CharClass (_inlineWhitespaceCharCodes.concat (_linebreakCharCodes))
		;

		return Uize.package (
			Uize.copyInto (
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

										Uize.Str.Whitespace.isNonWhitespace ('');            // returns false
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
				),
				{
					inlineWhitespaceCharCodes:_inlineWhitespaceCharCodes,
						/*?
							Static Properties
								Uize.Str.Whitespace.inlineWhitespaceCharCodes
									An array of numbers, representing the character codes for just the `inline whitespace characters` (i.e. excluding `line break whitespace characters`).

									NOTES
									- see the related =Uize.Str.Whitespace.linebreakCharCodes= static property
						*/

					linebreakCharCodes:_linebreakCharCodes
						/*?
							Static Properties
								Uize.Str.Whitespace.linebreakCharCodes
									An array of numbers, representing the character codes for just the `line break whitespace characters` (i.e. excluding `inline whitespace characters`).

									NOTES
									- see the related =Uize.Str.Whitespace.inlineWhitespaceCharCodes= static property
						*/
				}
			)
		);
	}
});

