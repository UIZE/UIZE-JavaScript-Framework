/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.String.Builder Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Object
	importance: 2
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.String.Builder= module implements an object to facilitate the building of very large strings, in a way that minimizes performance costs.

		*DEVELOPERS:* `Chris van Rensburg`

		The =Uize.String.Builder= module is an object under the =Uize.String= namespace, and is *not* a =Uize.Class= subclass.

		In a Nutshell
			Building strings using a traditional incremental concatenation approach using the =+&#61;= (incrementing assignment) operator can be slow in certain JavaScript interpreters when *very large* strings are being built.

			One way around this performance issue is to use an array to accumulate all the segments of a large string, and then concatenate all the elements of that array at the end of the string building process using the =Array= object's =join= instance method. The =Uize.String.Builder= object wraps this pattern up neatly into an object that also provides the benefit of `string object parity` that wouldn't otherwise be available in a manual array building process. In doing so, the =Uize.String.Builder= object can provide a substantial `performance benefit` in certain applications.

			Performance Benefit
				The =Uize.String.Builder= object can provide significant performance benefits in some JavaScript interpreters when building *very large* strings.

				This can come in handy when writing build scripts that are to generate very large text files. When building small strings, using the =Uize.String.Builder= object could actually do more harm than good. Therefore, use the =Uize.String.Builder= object judiciously. If possible, test your code in the JavaScript interpreter that is slow at concatenating strings through incremental re-assignment, verifying that using the =Uize.String.Builder= object is improving performance in your specific case.

			A Before and After Example
				To introduce the concept of a string builder object, let's take a look at a simple before and after example...

				Let's say we have to build HTML for a gigantic data table from a records array and then write the HTML into the document using =document.writeln= (old school, indeed). Below is a comparison of how the code might be written before and after being retrofitted to use the =Uize.String.Builder= object...

				BEFORE
				..................................................
				var tableHtml = '<table>';
				for (var rowNo = -1; ++rowNo < rows.length;) {
					tableHtml += '<tr>';
					var cols = rows [rowNo];
					for (var colNo = -1; ++colNo < cols.length;) {
						tableHtml += '<td>' + cols [colNo] + '</td>';
					}
					tableHtml += '</tr>';
				}
				tableHtml += '</table>';
				document.writeln (tableHtml);
				..................................................

				AFTER
				........................................................
				var tableHtml = Uize.String.Builder ();
				for (var rowNo = -1; ++rowNo < rows.length;) {
					tableHtml.append ('<tr>');
					var cols = rows [rowNo];
					for (var colNo = -1; ++colNo < cols.length;) {
						tableHtml.append ('<td>' + cols [colNo] + '</td>');
					}
					tableHtml.append ('</tr>');
				}
				tableHtml.append ('</table>');
				document.writeln (tableHtml);
				........................................................

				Note that what changed between the before and after versions is the initial assignment to the =tableHtml= variable, and the incrementing assignment statements. The =document.writeln= statement did =not= need to change, because the =Uize.String.Builder= object implements the `toString and valueOf Intrinsic Methods`.

			Initializing the Value
				The value for a =Uize.String.Builder= instance can be initialized in a number of different ways, as described below...

				Initializing the Value in the Constructor
					The very first opportunity that you have to initialize the value of a =Uize.String.Builder= instance is during construction.

					The `constructor` for the =Uize.String.Builder= object supports a single parameter, being the initial value for the instance being created.

					EXAMPLE
					......................................................
					var myStringBuilder = Uize.String.Builder ('hello');
					alert (myStringBuilder);  // displays the text "hello"
					......................................................

					If you don't set the value for an instance during construction, the value for the instance will be initialized to =''= (empty string). There are still ways of `initializing the value after construction`.

				Initializing the Value After Construction
					After a =Uize.String.Builder= instance has already been constructed, its value can be subsequently re-initialized using the =setValue= instance method.

					The =setValue= instance method takes a single parameter, being the new value that the instance should be initialized to.

					EXAMPLE
					........................................................
					var myStringBuilder = Uize.String.Builder ('hello');
					myStringBuilder.setValue ('goodbye');
					alert (myStringBuilder);  // displays the text "goodbye"
					........................................................

					By specifying the value =''= (empty string) when calling the =setValue= method, this method can be used for `clearing the value after construction`.

				Clearing the Value After Construction
					As a convenience, a =clear= instance method is provided to allow you to set the value of an instance to an empty string at any point.

					The =clear= method takes no parameters, and calling it is equivalent to calling the =setValue= instance method and passing the value =''= (empty string) as a parameter, or calling the variation of the =setValue= method that takes no parameters. The following three statements are all equivalent...

					EXAMPLE
					..............................
					myStringBuilder.clear ();
					myStringBuilder.setValue ('');
					myStringBuilder.setValue ();
					..............................

			Building the Value
				As an instance of an object, the value for a =Uize.String.Builder= instance must be modified using instance methods.

				The =Uize.String.Builder= object provides two instance methods for building the value for an instance: the =append= and =prepend= instance methods. The =append= instance method can be used to add to the end of the value for an instance, and the =prepend= instance method can be used to add to the beginning. Consider the following exmaple...

				EXAMPLE
				......................................................
				var myStringBuilder = Uize.String.Builder ();

				myStringBuilder.append ('l');
				myStringBuilder.prepend ('e');
				myStringBuilder.append ('l');
				myStringBuilder.prepend ('h');
				myStringBuilder.append ('o');

				alert (myStringBuilder);  // displays the text "hello"
				......................................................

				The above example, while not representative of real world applications, shows how the =append= and =prepend= instance methods can be used in combination to build up a value for a =Uize.String.Builder= instance.

			Getting the Value
				The =Uize.String.Builder= object provides a number of ways of obtaining the value for an instance, as described below...

				Using the getValue Instance Method
					The most explicit way to obtain the value for a =Uize.String.Builder= instance is to call the =getValue= instance method.

					Like other ways of `getting the value` for an instance, calling the =getValue= instance method invokes `value resolution` for the instance, concatenating together any appended or prepended segments that were added since the last time that `value resolution` was performed for the instance. Consider the following example...

					EXAMPLE
					........................................................................
					var myStringBuilder = Uize.String.Builder ('solar');
					myStringBuilder.append (' power');
					alert (myStringBuilder.getValue ());  // displays the text "solar power"
					........................................................................

				Invoking the Intrinsic Methods
					The JavaScript language defines intrinsic methods that are called on objects in situations where objects need to be resolved in order for an operation to be completed.

					The =toString Intrinsic Method= is invoked automatically in certain contexts in order to convert an object to a string form, such as when alerting an object using the =alert= global function. The =valueOf Intrinsic Method= is invoked automatically in certain contexts in order to convert an object to a value, such as when using an object reference in an expression. As a convenience, the =Uize.String.Builder= object defines these two intrinsic methods to perform the same operation as the =getValue= instance method. Consider the following example...

					EXAMPLE
					.....................................................................................
					var myStringBuilder  = Uize.String.Builder ('hello');


					// all of the alert statements below will display the text "hello"

					alert (myStringBuilder.getValue ());  // using getValue instance method
					alert (myStringBuilder);              // invoking toString intrinsic method
					alert (myStringBuilder.toString ());  // calling toString intrinsic method explicitly
					alert (myStringBuilder + '');         // invoking valueOf intrinsic method
					alert (myStringBuilder.valueOf ());   // calling valueOf intrinsic method explicitly
					.....................................................................................

				Value Resolution
					Whether you are `using the getvalue instance method` or `invoking the intrinsic methods`, causing the string value for a =Uize.String.Builder= instance to be returned will cause the value to be resolved.

					Each time that the value of an instance is resolved there is the cost of concatenating any segments that have been appended or prepended and that are pending concatenation. The main `performance benefit` that comes from using the =Uize.String.Builder= object derives from *not* needing to access the resolved / concatenated string value until at the end of the building process. However, not being able to easily access the value before building is complete could make it that much harder to retrofit existing code to use the =Uize.String.Builder= object. Therefore, the methods for `getting the value` of an instance automatically resolve the value as needed.

				Variable Type Conversion
					When using a variable to store a reference to a =Uize.String.Builder= instance, one can easily convert that variable to the string equivalent of the =Uize.String.Builder= instance using the =+&#61;= (incrementing assignment) operator, as shown in the example below...

					EXAMPLE
					........................................................................................
					var fruitsTable = Uize.String.Builder ();  // set fruitsTable to string builder instance
					for (var fruitNo = -1; ++fruitNo < fruits.length;) {
						// ... ... ...
						// code here to append stuff to fruitsTable
						// ... ... ...
					}
					fruitsTable += '';  // force string builder to resolve value and reassign to fruitsTable
					........................................................................................

					After the above code has been executed, the value of the =fruitsTable= variable will be a string, being the value that was built up using the =Uize.String.Builder= object. This approach is certainly more concise than the statement =fruitsTable &#61; fruitsTable.getValue ()=. The re-assignment of the =fruitsTable= variable will cause the =Uize.String.Builder= instance to be thrown into the garbage collection pile.

			Value to String Coercion
				As a convenience, many of the instance methods that are provided for `initializing the value` or `building the value` of a =Uize.String.Builder= instance allow a value to be specified in any type.

				Methods such as the =append=, =equals=, =prepend=, and =setValue= instance methods, along with the `constructor`, all support a =valueANYTYPE= parameter. The value for this parameter can be of any type, and will be coerced to a string. If the value is an instance of an object or a =Uize.Class= subclass, then it will be coerced to a string by invoking the object's =valueOf Intrinsic Method=. So, string type values, boolean type values, number type values, etc. can be used with these methods. As an example, following is a list of mappings between value and string equivalent...

				........................................................................................
				<< table >>

				title: HOW DIFFERENT TYPES OF VALUES ARE COERCED TO STRINGS
				data
				:|             TYPE            |          VALUE             |     STRING EQUIVALENT     |
				:| string                      | 'fish'                     | 'fish'                    |
				:| boolean                     | true                       | 'true'                    |
				:| number                      | 42                         | '42'                      |
				:| number                      | Infinity                   | 'Infinity'                |
				:| number                      | NaN                        | 'NaN'                     |
				:| object                      | null                       | 'null'                    |
				:| object (regular expression) | /\s+/                      | '/\\s+/'                  |
				:| object (Uize instance)      | Uize.Class ({value:'foo'}) | 'foo'                     |
				:| undefined                   | undefined                  | 'undefined'               |
				:| function                    | function () {alert (1)}    | 'function () {alert (1)}' |
				.........................................................................................

				EXAMPLE
				.......................................................
				var myStringBuilder = Uize.String.Builder ();
				myStringBuilder.append ('hello');
				myStringBuilder.append (true);
				myStringBuilder.append (42);
				myStringBuilder.append (null);

				alert (myStringBuilder);  // displays "hellotrue42null"
				.......................................................

			String Object Parity
				As a convenience, and to ease retrofitting of code to use the =Uize.String.Builder= object, the =Uize.String.Builder= object is designed to have as much parity with JavaScript's built-in =String= object as possible.

				It does this in a number of ways, as described below...

				Mixed in String Object Instance Methods
					The =Uize.String.Builder= object mixes instance methods from the =String= object's prototype into its own prototype.

					This means that instance methods like =charAt=, =indexOf=, =lastIndexOf=, =match=, =replace=, =substring=, =toLowerCase=, etc. can be called on instances of the =Uize.String.Builder= object, just as you would call these same methods on =String= object instances. Consider the following example...

					EXAMPLE
					...........................................................................
					var myStringBuilder = Uize.String.Builder ('solar');
					myStringBuilder.append (' power');
					alert (myStringBuilder.toUpperCase ());  // displays the text "SOLAR POWER"
					...........................................................................

					In the above example, when the =toUpperCase= instance method is called on the =myStringBuilder= instance, `value resolution` is triggered in the =Uize.String.Builder= object. This is a pleasant side effect of the way that the methods of the =String= object are implemented.

					For the full list of mixed in methods, see the section `String Object Instance Methods`.

				length Property
					A =length= property is maintained for =Uize.String.Builder= object instances, to reflect the current length of the value - even before `value resolution` has been performed.

					The =length= property lets code query the length of the string value represented by a =Uize.String.Builder= instance, even before all the segments that may make up the value have been concatenated during `value resolution`. Consider the following example...

					EXAMPLE
					.........................................................
					var myStringBuilder = Uize.String.Builder ();
					alert (myStringBuilder.length);  // displays the text "0"

					myStringBuilder.append ('f');
					alert (myStringBuilder.length);  // displays the text "1"

					myStringBuilder.append ('o');
					alert (myStringBuilder.length);  // displays the text "2"

					myStringBuilder.append ('o');
					alert (myStringBuilder.length);  // displays the text "3"
					.........................................................

					The value of the =length= property is maintained while `building the value` for the instance using the =append= and =prepend= instance methods, and when `initializing the value` during construction or when calling the =clear= and =setValue= instance methods. Unlike `getting the value` for a =Uize.String.Builder= instance, simply querying its =length= property *does not* trigger `value resolution`, so querying =length= will not defeat the `performance benefit` of using this object.

					You can use the =length= property to test if a =Uize.String.Builder= instance has an empty value as follows...

					.....................................................
					var myStringBuilderIsEmpty = !myStringBuilder.length;
					.....................................................

				toString and valueOf Intrinsic Methods
					To match how instances of the =String= object behave when involved in operations or passed as parameters in function and method calls, the =Uize.String.Builder= object implements the =toString Intrinsic Method= and the =valueOf Intrinsic Method=.

					Involving an instance of the =Uize.String.Builder= object in an operation can result in JavaScript `invoking the intrinsic methods` in order to obtain a value that can be used in the operation. Consider the following example...

					EXAMPLE
					.......................................................................
					var
						myString = 'solar',
						myStringBuilder = Uize.String.Builder ('solar')
					;
					alert (myString);                    // displays the text "solar"
					alert (myStringBuilder);             // displays the text "solar"
					alert (myString + ' power');         // displays the text "solar power"
					alert (myStringBuilder + ' power');  // displays the text "solar power"
					.......................................................................

					In the above example, the =myStringBuilder= instance behaves the same as the string variable =myString=. In the =alert= statement without concatenation, the =toString Intrinsic Method= is invoked for the =myStringBuilder= instance, but in the =alert= statement *with* concatenation the =valueOf Intrinsic Method= is invoked. For further discussion on this, see the section `Invoking the Intrinsic Methods`.
*/

Uize.module ({
	name:'Uize.String.Builder',
	builder:function () {
		'use strict';

		/*** Constructor ***/
			var
				_object = Uize.noNew (
					function (_value) {
						this._chunks = [];
						this.setValue (arguments.length ? _value : '');
					}
					/*?
						Constructor
							Returns a freshly constructed instance of the =Uize.String.Builder= object.

							SYNTAX
							......................................................
							stringBuilderOBJ = Uize.String.Builder (valueANYTYPE);
							......................................................

							VARIATION
							..........................................
							stringBuilderOBJ = Uize.String.Builder ();
							..........................................

							When no =valueANYTYPE= parameter is specified in the constructor, then the newly created =Uize.String.Builder= instance will be initialized to an empty string.

							For an in-depth discussion on setting the value for an instance, see the section `Initializing the Value`.

							NOTES
							- the constructor supports `value to string coercion` for the =valueANYTYPE= parameter

						Instance Properties
							length
								An integer, specifying the current length of the instance's value.

								For an in-depth discussion of this property, see the section `length Property`.
					*/
				),
				_objectPrototype = _object.prototype
			;

			/*** Public Instance Methods ***/
				_objectPrototype.equals = function (_value) {
					if (!arguments.length)
						_value = ''
					; else if (typeof _value != 'string')
						_value += ''
					;
					return _value.length == this.length && (!_value.length || _value == this.valueOf ());
					/*?
						Instance Methods
							equals
								Returns a boolean, indicating whether or not the instance's value is equal to the specified comparison value.

								SYNTAX
								..................................................
								equalBOOL = myStringBuilder.equals (valueANYTYPE);
								..................................................

								EXAMPLE
								...................................................................
								var myStringBuilder = Uize.String.Builder (' ');
								myStringBuilder.append ('power');
								myStringBuilder.prepend ('solar');
								alert (myStringBuilder.equals ('solar power'));  // displays "true"
								...................................................................

								Because the =Uize.String.Builder= object implements a =valueOf Intrinsic Method=, you can also coerce the value of an instance to a string before doing a normal equality operation, using the simple =+ ''= trick. So, the following =alert= statement would produce the same result as the one shown in the above example...

								..................................................................
								alert (myStringBuilder + '' == 'solar power');  // displays "true"
								..................................................................

								VARIATION
								......................................
								equalBOOL = myStringBuilder.equals ();
								......................................

								When no =valueANYTYPE= parameter is specified, then the =equals= method tests whether or not the instance's value is an empty string. You can also use the =length= instance property to test if a =Uize.String.Builder= instance has an empty value (see the section `length Property` for details).

								NOTES
								- this method supports `value to string coercion` for the =valueANYTYPE= parameter
					*/
				};

				_objectPrototype.getValue = _objectPrototype.toString = _objectPrototype.valueOf = function () {
					this._chunks.length > 1 && this.setValue (this._chunks.join (''));
					return this._chunks [0];
					/*?
						Instance Methods
							getValue
								Returns a string, being the current value of the instance.

								SYNTAX
								.......................................
								valueSTR = myStringBuilder.getValue ();
								.......................................

								For a more in-depth discussion on accessing the value for an instance, see the section `Getting the Value`.

								NOTES
								- see the equivalent =toString Intrinsic Method= and =valueOf Intrinsic Method=
								- calling this method will trigger `value resolution`

							toString Intrinsic Method
								Returns a string, being the current value of the instance.

								SYNTAX
								.......................................
								valueSTR = myStringBuilder.toString ();
								.......................................

								For a more in-depth discussion on accessing the value for an instance, see the section `getting the value`.

								NOTES
								- see the equivalent =getValue= instance method and =valueOf Intrinsic Method=
								- calling this method will trigger `value resolution`

							valueOf Intrinsic Method
								Returns a string, being the current value of the instance.

								SYNTAX
								......................................
								valueSTR = myStringBuilder.valueOf ();
								......................................

								For a more in-depth discussion on accessing the value for an instance, see the section `getting the value`.

								NOTES
								- see the equivalent =getValue= instance method and =toString Intrinsic Method=
								- calling this method will trigger `value resolution`
					*/
				};

				_objectPrototype.append = function (_chunk) {
					this.length +=
						(this._chunks [this._chunks.length] = typeof _chunk == 'string' ? _chunk : (_chunk += '')).length
					;
					/*?
						Instance Methods
							append
								Lets you append the specified value to the value of the instance.

								SYNTAX
								......................................
								myStringBuilder.append (valueANYTYPE);
								......................................

								EXAMPLE
								....................................................
								var myStringBuilder = Uize.String.Builder ('solar');
								myStringBuilder.append (' power');
								alert (myStringBuilder);  // displays "solar power"
								....................................................

								NOTES
								- see the companion =prepend= instance method
								- this method supports `value to string coercion` for the =valueANYTYPE= parameter
					*/
				};

				_objectPrototype.prepend = function (_chunk) {
					this._chunks.unshift (typeof _chunk == 'string' ? _chunk : (_chunk += ''));
					this.length += _chunk.length;
					/*?
						Instance Methods
							prepend
								Lets you prepend the specified value to the value of the instance.

								SYNTAX
								.......................................
								myStringBuilder.prepend (valueANYTYPE);
								.......................................

								EXAMPLE
								....................................................
								var myStringBuilder = Uize.String.Builder ('power');
								myStringBuilder.prepend ('solar ');
								alert (myStringBuilder);  // displays "solar power"
								....................................................

								NOTES
								- see the companion =append= instance method
								- this method supports `value to string coercion` for the =valueANYTYPE= parameter
					*/
				};

				_objectPrototype.setValue = _objectPrototype.clear = function (_value) {
					this._chunks.length = 1;
					this.length = (this._chunks [0] = arguments.length ? _value + '' : '').length;
					/*?
						Instance Methods
							clear
								Lets you initialize the instance to an empty string.

								SYNTAX
								.........................
								myStringBuilder.clear ();
								.........................

								The statement =myStringBuilder.clear ()= has the same effect as the statements =myStringBuilder.setValue ('')= and =myStringBuilder.setValue ()=. For a more in-depth discussion on setting the value for an instance, see the section `Initializing the Value`.

								NOTES
								- see the related =setValue= instance method

							setValue
								Lets you set the value for the instance.

								SYNTAX
								........................................
								myStringBuilder.setValue (valueANYTYPE);
								........................................

								VARIATION
								............................
								myStringBuilder.setValue ();
								............................

								When no =valueANYTYPE= parameter is specified, then calling =setValue= has the same effect as calling =clear=.

								For a more in-depth discussion on setting the value for an instance, see the section `Initializing the Value`.

								NOTES
								- see the related =clear= instance method
								- see the companion =getValue= instance method
								- this method supports `value to string coercion` for the =valueANYTYPE= parameter
					*/
				};

				var _StringPrototype = String.prototype;
				Uize.forEach (
					[
						'charAt', 'charCodeAt', 'concat', 'indexOf', 'lastIndexOf', 'match', 'replace', 'search', 'slice', 'split', 'substr', 'substring', 'toLowerCase', 'toUpperCase', 'anchor', 'big', 'blink', 'bold', 'fixed', 'fontcolor', 'fontsize', 'italics', 'link', 'small', 'strike', 'sub', 'sup'
					],
					function (_methodName) {_objectPrototype [_methodName] = _StringPrototype [_methodName]}
					/*?
						Instance Methods
							String Object Instance Methods
								In addition to the `instance methods` implemented specifically to facilitate building strings, the =Uize.String.Builder= object also supports the instance methods from JavaScript's =String= object.

								These instance methods include: =charAt=, =charCodeAt=, =concat=, =indexOf=, =lastIndexOf=, =match=, =replace=, =search=, =slice=, =split=, =substr=, =substring=, =toLowerCase=, =toUpperCase=, =anchor=, =big=, =blink=, =bold=, =fixed=, =fontcolor=, =fontsize=, =italics=, =link=, =small=, =strike=, =sub=, and =sup=.

								All of the =String= object instance methods implemented for the =Uize.String.Builder= object have exactly the same signatures and behave in exactly the same way as they do for the =String= object. Because of this, they have not been documented in detail here. For a detailed explanation for any of them, consult a good JavaScript reference. For some examples, you can read through the section `string object parity`.
					*/
				);

		return _object;
	}
});

