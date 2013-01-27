/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Array.Sort Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 2
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Array.Sort= module provides a powerful array sorting method that is very versatile and highly optimized for performance.

		*DEVELOPERS:* `Chris van Rensburg`

		Key Features
			The =Uize.Array.Sort= module offers a number of important features, as outlined below...

			Sort Value Generator
				The =Uize.Array.Sort.sortBy= static method allows an array to be sorted by sort values that are generated for elements of the array by a sort value generator, which can be specified as either a `sort value generator expression` or a `value generator function`.

				Why a Sort Value Generator?
					When one sorts an array using the =sort= instance method of JavaScript's =Array= object, the =sort= method compares the raw values of the array's elements - unless one specifies a custom comparison function.

					When one *does* specify a comparison function, it may be called many times to compare the same value to some other value. If it is necessary to derive a value for use in the comparison, rather than simply using the raw value for an element, then the code to derive a value to be used in the comparison might be executed redundantly many times. This can be particularly costly when sorting a large array and where the code to derive a value for comparison involves more significant processing.

					To illustrate this point, consider the example of a case-insensitive sort. If one simply uses the =Array= object's =sort= instance method, then one might write the sort code as follows...

					POOR PERFORMANCE
					.......................................................................................
					firstNames.sort (function (a,b) {return a.toLowerCase () < b.toLowerCase () ? -1 : 1});
					.......................................................................................

					In the above example, the =toLowerCase= instance method of the =Array= object is being used to convert both string values being compared to lower case - this ensures that the case of individual characters in the two strings has no effect on the sort order, and the sort is thereby made case-insensitive. Problem is, the =toLowerCase= method may be called multiple times for the same element, just because of how the =sort= method is implemented. This could become a very serious performance problem when sorting large arrays of very long strings using this approach. This is where the =Uize.Array.Sort.sortBy= method comes in. Using this method, the above example could be rewritten as follows...

					IMPROVED PERFORMANCE
					...........................................................
					Uize.Array.Sort.sortBy (firstNames,'value.toLowerCase ()');
					...........................................................

					Now that we're using the =Uize.Array.Sort.sortBy= method, we no longer specify a comparison function. Instead, we're specifying the string ='value.toLowerCase ()'= as a `sort value generator expression`. This expression will be used for every element of the array being sorted. The array will then be sorted using the sort values generated for each of the array's elements. Instead of using the array's element values in the comparison function, the =Uize.Array.Sort.sortBy= method will use the generated sort values. This means that the =toLowerCase= method is guaranteed to only be called once for every element of the array.

				Sort Value Generator Function
					A sort value generator function is a `sort value generator` specified in the form of a function.

					When a function is specified for the Sort Value Generator, it should expect to receive two parameters: the value for an element of the array being sorted, and the index / key for that element. The function should return the generated sort value. Generated sort values should be of a type that can be used with the boolean less than and greater than comparison operators - numbers and strings are the typical types that are appropriate for generated sort values. This is all illustrated well in the following example...

					EXAMPLE
					..................................................................................
					Uize.Array.Sort.sortBy (names,function (value,key) {return value.toLowerCase ()});
					..................................................................................

					In the above example, the =names= array is an array of string values. It is being sorted in ASCIIbetical order, using a Sort Value Generator Function that renders the sort case-insensitive. The function accepts =value= and =key= parameters, using the =value= parameter to generate a sort value that is an element's value converted to all lower case. As you'll notice, the function is not actually using the =key= parameter, so it could just as well be omitted, as follows...

					WITHOUT THE KEY PARAMETER
					..............................................................................
					Uize.Array.Sort.sortBy (names,function (value) {return value.toLowerCase ()});
					..............................................................................

					For an example of how an element's key might be used in generating sort values, see the section `Using an Element's Key To Generate a Sort Value`.

				Sort Value Generator Expression
					A sort value generator expression is a `sort value generator` specified in the form of an expression string.

					When an expression string is specified for the Sort Value Generator, it should expect two variables to be defined in the scope of the expression's code: the =value= variable contains the value for an element of the array being sorted, and the =key= variable contains that element's index / key. The expression should produce the generated sort value. Generated sort values should be of a type that can be used with the boolean less than and greater than comparison operators - numbers and strings are the typical types that are appropriate for generated sort values. This is all illustrated well in the following example...

					EXAMPLE
					......................................................
					Uize.Array.Sort.sortBy (names,'value.toLowerCase ()');
					......................................................

					In the above example, the =names= array is an array of string values. It is being sorted in ASCIIbetical order, using a Sort Value Generator Expression that renders the sort case-insensitive. The expression is using the =value= variable to generate a sort value that is an element's value converted to all lower case. As you'll notice, using a `sort value generator expression` can be more concise than using a `sort value generator function`. And since you're just specifying a JavaScript expression and not defining a function, there is no =return= statement in the expression.

					You'll also notice that the expression is not using the =key= variable in generating the sort value. For an example of how an element's key might be used in generating sort values, see the section `using an element's key to generate a sort value`.

				Using an Element's Key To Generate a Sort Value
					The key for an element is very seldom used when performing a sort using the =Uize.Array.Sort.sortBy= method, but the following hypothetical example demonstrates how it might be used...

					USING THE KEY
					.............................................................................
					Uize.Array.Sort.sortBy (values,'key + (key % 2 ? ' + names.length + ' : 0)');
					.............................................................................

					In the above example, the =values= array is being "sorted" so that all even numbered elements are clumped at the beginning and all odd numbered elements are clumped at the end. So, if the contents of the values array was =['a','b','c','d','e','f','g','h']=, then the sorted values would be =['a','c','e','g','b','d','f','h']=. The reason this works is because the generated sort value is the key for even numbered elements, and the key plus the length of the array for odd numbered elements, achieved by using the =%= (mod) operator with a ternary operator expression. This preserves the order of the elements within the even numbered and odd numbered clumps of elements, but pushes all the odd numbered elements to after the even numbered elements. Generated sort values are not required to map in any way to the indexes of elements in the array being sorted, so it's ok than the sort values in this case extend beyond the length of the array, and that there are gaps between consecutive sort values.

					When the values of an array's elements are not used when generating sort values, then what you're doing is more like a reordering algorithm than a sort. Of course, there's no saying you can't use both the value and the index / key for elements when generating sort values.

			Sort Order Direction
				As a convenience, the sort direction for sorts performed by the =Uize.Array.Sort.sortBy= method can be controlled via its optional =directionINT= parameter.

				Specifying the value =-1= for the =directionINT= parameter will reverse the sort direction for a sort. Consider the following example...

				EXAMPLE
				.........................................................
				Uize.Array.Sort.sortBy (names,'value.toLowerCase ()',-1);
				.........................................................

				In the above example, the =names= array is an array of string values. It is being sorted in descending ASCIIbetical order, using a `sort value generator expression` that renders the sort case-insensitive. Using the =directionINT= parameter when you want to perform a sort in descending order is more efficient than first performing the sort and then reversing the sorted array using the array's =reverse= instance method. This is because the =Uize.Array.Sort.sortBy= method takes the sort direction into account during the sort operation's reordering of the array's elements.

			Easy Data Table Sorting
				The =Uize.Array.Sort= module's =Uize.Array.Sort.sortBy= method makes it very easy to sort a data table by the values of a specific column, simply by the number of the column to sort the table by for the method's =sortColumnINT= parameter.

				A data table is an array of arrays, where each array type element represents a row of data in the table. Consider the following example...

				EXAMPLE
				..................................
				var
					fruits = [
						['Apples',52,13.81,2.4],
						['Avocados',160,8.53,6.7],
						['Bananas',89,22.84,2.6],
						['Dates',277,74.97,6.7],
						['Grapefruits',42,10.66,1.6]
					]
				;
				Uize.Array.Sort.sortBy (fruits,1);
				..................................

				In the above example, the =fruits= array is a data table array where each row contains data describing a fruit. Each row array contains information for fruit name, calorie count, total carbohydrates, and dietary fiber. We're using the =Uize.Array.Sort.sortBy= method to sort the fruits in order of their caloric content, from lowest calorie count to highest calorie count. Specifying the value =1= for the =sortColumnINT= parameter indicates that the values of the second column (column numbers are zero-based) should be used as the sort values, so the sort values used to drive the sort of the =fruits= array is an array of calorie count numbers.

			Easy Record Array Sorting
				With the use of a simple `sort value generator expression`, the =Uize.Array.Sort= module's =Uize.Array.Sort.sortBy= method makes it a very concise thing to sort an array of records by a specific record field.

				A records array is an array of objects, where each object represents a record and contains properties that represent the fields of the record. Consider the following example...

				EXAMPLE
				.......................................................................
				var
					fruits = [
						{name:'Apples',calories:52,totalCarbs:13.81,dietaryFiber:2.4},
						{name:'Avocados',calories:160,totalCarbs:8.53,dietaryFiber:6.7},
						{name:'Bananas',calories:89,totalCarbs:22.84,dietaryFiber:2.6},
						{name:'Dates',calories:277,totalCarbs:74.97,dietaryFiber:6.7},
						{name:'Grapefruits',calories:42,totalCarbs:10.66,dietaryFiber:1.6}
					]
				;
				Uize.Array.Sort.sortBy (fruits,'value.calories');
				.......................................................................

				In the above example, the =fruits= array is a records array where each record describes a fruit and contains the fields =name=, =calories=, =totalCarbs=, and =dietaryFiber=. We're using the =Uize.Array.Sort.sortBy= method to sort the fruits in order of their caloric content, from lowest calorie count to highest calorie count. The `sort value generator expression` used here simply dereferences the =calories= property for a record, so the generated sort values used to drive the sort of the =fruits= array is an array of calorie count numbers.

			Optimized For Performance
				The =Uize.Array.Sort= method of the =Uize.Array.Sort= module is optimized for performance.

				The =Uize.Array.Sort= method sorts an array based upon sort values that are generated for all of the array's elements. These sort values are generated in the first pass of the sorting operation, and as a one time operation, unlike the traditional approach of generating comparison values every time one element is compared to another. This is illustrated well in the classic example of performing a case-insensitive ASCIIbetical sort of an array of strings, where a typical use of the =sort= instance method of JavaScript's =Array= object would be quite inefficient. That's because the same string value may be lowercased repeatedly - each time a given element is compared to some other element. The typical, inefficient solution might look as follows...

				INEFFICIENT CLASSIC SOLUTION
				..................................................................................
				names.sort (function (a,b) {return a.toLowerCase () < b.toLowerCase () ? -1 : 1});
				..................................................................................

				A more efficient solution is to use the =Uize.Array.Sort.sortBy= method, because it ensures that the lowercasing will only be performed once per element of the source array.

				EFFICIENT SOLUTION
				......................................................
				Uize.Array.Sort.sortBy (names,'value.toLowerCase ()');
				......................................................

			Sorts Are More Concise
				Besides being `optimized for performance`, the =Uize.Array.Sort.sortBy= method of the ==Uize.Array.Sort= module also produces more concise code than using the traditional approach.

				To illustrate this point, consider the following before-and-after examples...

				BEFORE-AFTER: Sort a Strings Array in Case-insensitive ASCIIbetical Order
					BEFORE
					.......................................................................................
					firstNames.sort (function (a,b) {return a.toLowerCase () < b.toLowerCase () ? -1 : 1});
					.......................................................................................

					AFTER
					......................................................
					Uize.Array.Sort.sortBy (names,'value.toLowerCase ()');
					......................................................

				BEFORE-AFTER: Sort a Data Table Array By the Values of the Second Column
					BEFORE
					............................................................
					table.sort (function (a,b) {return a [1] < b [1] ? -1 : 1});
					............................................................

					AFTER
					.................................
					Uize.Array.Sort.sortBy (table,1);
					.................................

				BEFORE-AFTER: Sort a Records Array by the name Field
					BEFORE
					................................................................
					records.sort (function (a,b) {return a.name < b.name ? -1 : 1});
					................................................................

					AFTER
					..............................................
					Uize.Array.Sort.sortBy (records,'value.name');
					..............................................
*/

Uize.module ({
	name:'Uize.Array.Sort',
	builder:function () {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_package = function () {},
				_Function = Function
			;

		/*** General Variables ***/
			var
				_sortValues = [],
				_ascendingSort = _Function ('a,b','return a.v<b.v?-1:a.v>b.v?1:0'),
				_descendingSort = _Function ('a,b','return a.v<b.v?1:a.v>b.v?-1:0'),
				_ascendingSimpleSort = _Function ('a,b','return a<b?-1:a>b?1:0'),
				_descendingSimpleSort = _Function ('a,b','return a<b?1:a>b?-1:0')
			;

		/*** Public Static Methods ***/
			_package.sortBy = function (_elements,_sortValueGenerator,_direction) {
				var _elementsLength = _elements.length;
				if (_elementsLength > 1) {
					if (_sortValueGenerator != null) {
						var _sortValue;
						if (!Uize.isFunction (_sortValueGenerator)) {
							if (typeof _sortValueGenerator == 'number')
								_sortValueGenerator = 'value [' + _sortValueGenerator + ']'
							;
							_sortValueGenerator = Uize.resolveTransformer (_sortValueGenerator);
						};
						/*** build sortValues array ***/
							for (var _elementNo = _sortValues.length = _elementsLength; --_elementNo >= 0;) {
								(_sortValue = _sortValues [_elementNo] || (_sortValues [_elementNo] = {})).v =
									_sortValueGenerator (
										_sortValue._element = _elements [_sortValue._elementNo = _elementNo],
										_elementNo
									)
								;
							}

						/*** sort sortValues array ***/
							_sortValues.sort (_direction == -1 ? _descendingSort : _ascendingSort);

						/*** re-populate array to be sorted, using sortValues array ***/
							for (var _elementNo = _elementsLength; --_elementNo >= 0;) {
								if (_elementNo != (_sortValue = _sortValues [_elementNo])._elementNo)
									_elements [_elementNo] = _sortValue._element
								;
								_sortValue._element = _sortValue.v = null;
							}
					} else {
						_elements.sort (_direction == -1 ? _descendingSimpleSort : _ascendingSimpleSort);
					}
				}
				return _elements;
				/*?
					Static Methods
						Uize.Array.Sort.sortBy
							Returns an array, being the specified source array sorted by the values generated by the specified value generator (the source array is modified by this method).

							SYNTAX
							..........................................................................
							sourceARRAY = Uize.Array.Sort.sortBy (sourceARRAY,sortValueGeneratorFUNC);
							..........................................................................

							The =Uize.Array.Sort.sortBy= method is engineered for high performance when sorting arrays where the sort order is determined by values that are derived from the source array's element values (see `Optimized For Performance` for more details).

							When the =Uize.Array.Sort.sortBy= method sorts an array, it first generates sort values for all the elements of the array, using a `sort value generator` that can be specified either in the form of a `sort value generator function` or a `sort value generator expression`. The method then sorts the array of generated sort values, and then applies that sort order back to the elements of the source array. This lets you drive the sorting of the source array by something other than the exact values of the source array's elements.

							To illustrate this, let's take the simple example of performing a case-insensitive ASCIIbetical sort...

							EXAMPLE
							......................................................
							Uize.Array.Sort.sortBy (names,'value.toLowerCase ()');
							......................................................

							In the above example, when the =Uize.Array.Sort.sortBy= method is called, a sort values array is generated by iterating over the elements of the =names= array, and for each element executing the specified sort value generator. In this case, the sort value generator uses the value for an element of the names array and then produces the lowercased version of that string as the sort value. The lowercased names are then sorted, and the resulting sort order determines the new order for the elements of the source array.

							Generated Sort Values Only For Determining Sort Order
								It's worth emphasizing that the generated sort values are only used in determining the sort ordering of the elements of the source array.

								Therefore, in the case-insensitive ASCIIbetical sort example, the sorted values would be the original, non-lowercased values - *NOT* the lowercased sort values.

							Variations
								The =Uize.Array.Sort.sortBy= method supports the following variations...

								VARIATION 1
								.........................................................................
								sourceARRAY = Uize.Array.Sort.sortBy (sourceARRAY,sortValueGeneratorSTR);
								.........................................................................

								When a =sortValueGeneratorSTR= parameter is specified in place of the =sortValueGeneratorFUNC= parameter, then a more concise JavaScript expression string can be specified for the sort value generator. For a more in-depth discussion of this feature and to see an example, consult the section `sort value generator expression`.

								VARIATION 2
								.................................................................
								sourceARRAY = Uize.Array.Sort.sortBy (sourceARRAY,sortColumnINT);
								.................................................................

								When a =sortColumnINT= parameter is specified in place of the =sortValueGeneratorFUNC= parameter, then a data table (an array of row arrays) can be easily sorted by the values in one of its columns, by specifying the number of the column to sort the table by for the =sortColumnINT= parameter. For an example of this, see the section `Easy Data Table Sorting`.

								VARIATIONS 3 & 4
								.............................................................
								sourceARRAY = Uize.Array.Sort.sortBy (sourceARRAY,null);
								sourceARRAY = Uize.Array.Sort.sortBy (sourceARRAY,undefined);
								.............................................................

								When the value =null= or =undefined= is specified in place of the =sortValueGeneratorFUNC= parameter, then the =Uize.Array.Sort.sortBy= method will sort the specified array using the raw values of the array's elements as the sort values.

								VARIATIONS 5, 6, 7, 8 & 9
								.......................................................................................
								sourceARRAY = Uize.Array.Sort.sortBy (sourceARRAY,sortValueGeneratorFUNC,directionINT);
								sourceARRAY = Uize.Array.Sort.sortBy (sourceARRAY,sortValueGeneratorSTR,directionINT);
								sourceARRAY = Uize.Array.Sort.sortBy (sourceARRAY,sortColumnINT,directionINT);
								sourceARRAY = Uize.Array.Sort.sortBy (sourceARRAY,null,directionINT);
								sourceARRAY = Uize.Array.Sort.sortBy (sourceARRAY,undefined,directionINT);
								.......................................................................................

								By default, the sort direction of the =Uize.Array.Sort.sortBy= method is ascending. When the optional =directionINT= parameter is specified, the direction for a sort can be controlled. Specifying the value =-1= for the =directionINT= parameter will cause the sort direction to be descending (ie. reversed), while specifying the value =1= will cause the sort direction to be ascending (the default).

								VARIATION 10
								...................................................
								sourceARRAY = Uize.Array.Sort.sortBy (sourceARRAY);
								...................................................

								When only a =sourceARRAY= parameter is specified, the =Uize.Array.Sort.sortBy= method behaves in the same way as when the value =null= or =undefined= is specified for the sort value generator and no optional =directionINT= parameter is specified, performing the sort using the raw values of the source array's elements as the sort values.

							Examples
								Sort an Array of Strings by Length, Shortest to Longest
									An array of strings can be sorted by length with a simple `sort value generator expression` that returns the value of the =length= property of a value.

									EXAMPLE
									................................................
									Uize.Array.Sort.sortBy (strings,'value.length');
									................................................

								Sort an Array of People Records by lastName Property
									A records array, where each element is an object containing data for a person, can be sorted by last name with a simple `sort value generator expression` that returns the value of the =lastName= property of a value.

									EXAMPLE
									........................................................
									Uize.Array.Sort.sortBy (peopleRecords,'value.lastName');
									........................................................

								Sort an Array of People Records in lastName,firstName Order
									A records array, where each element is an object containing data for a person, can be sorted by last name and subsorted by first name, with a `sort value generator expression` that concatenates the values of the =lastName= and =firstName= properties of a value.

									EXAMPLE
									................................................................................
									Uize.Array.Sort.sortBy (peopleRecords,'value.lastName + "," + value.firstName');
									................................................................................

									Notice that a "," (comma character) is used as a delimiter between last name and first name. This is in order to avoid ambiguities that may arise if a first segment of one person's last name is coincidentally a last segment of someone else's first name. The comma forces a reliable split between the sort and subsort, because nobody's first or last name will contain a comma.

								Sort an Array of Row Arrays By The Second Column
									A rows array, where each element is an array representing a row of data in a data table, can be sorted by a specific column simply by specifying the column number for the =Uize.Array.Sort.sortBy= method's =sortColumnINT= parameter.

									EXAMPLE
									................................
									Uize.Array.Sort.sortBy (rows,1);
									................................

									Column indexes are zero based, so specifying the value =1= in the above example will sort the =rows= data table array by the values in the second column.

								Sort an Array of Strings That Are Decimal Numbers
									An array of strings that are decimal formatted numbers can be sorted numerically (rather than ASCIIbetically), by specifying a simple `sort value generator expression` that returns an element's value coerced to a number.

									EXAMPLE
									................................................
									Uize.Array.Sort.sortBy (numberStrings,'+value');
									................................................

									Coercing the string type element values to numbers is accomplished quite easily by simply prefixing the "+" (plus) operator in the expression.

								Sort an Array of Strings That are Hex Formatted Numbers
									An array of strings that are hexadecimal formatted numbers can be sorted numerically (rather than ASCIIbetically), by specifying a simple `sort value generator expression` that returns an element's value coerced to a decimal number.

									EXAMPLE
									............................................................
									Uize.Array.Sort.sortBy (hexNumberStrings,'+("0x" + value)');
									............................................................

									It is assumed in this example that the hex formatted numbers are *not* prefixed with any kind of hex formatting indicator (such as "0x" for programming languages, or "#" for RGB color values in CSS). The hex numbers are coerced to decimal by prepending the "0x" and then coercing the resulting string to a number by prefixing the "+" (plus) operator in the `sort value generator expression`.

								Sort an Array of Date Strings
									An array of correctly formatted date strings can be sorted into chronological order, by specifying a `sort value generator expression` that transforms a date string value into a number, representing the date as the number of milliseconds elapsed since January 1st, 1970 (ie. POSIX time).

									EXAMPLE
									...........................................................
									Uize.Array.Sort.sortBy (dateStrings,'+(new Date (value))');
									...........................................................

									A date string value is transformed into a POSIX time number by first using JavaScript's built-in =Date= object to parse the date string and create a =Date= object instance. The =Date= object instance is then coerced to a number by using the "+" (plus) operator, which invokes the =Date= object's =valueOf Intrinsic Method=.

								Sort an Array of Date Objects
									An array of =Date= object instances can be sorted into chronological order, by specifying a `sort value generator expression` that transforms a =Date= object instance into a number, representing the date as the number of milliseconds elapsed since January 1st, 1970 (ie. POSIX time).

									EXAMPLE
									..............................................
									Uize.Array.Sort.sortBy (dateObjects,'+value');
									..............................................

									A =Date= object instance is transformed into a POSIX time number by simply using the "+" (plus) operator, which invokes the =Date= object's =valueOf Intrinsic Method=.

								Sort Cubes by Volume, Smallest to Largest
									An array of objects representing geometric cubes can be sorted according to their volumes, from smallest volume to largest volume, by specifying a `sort value generator expression` that calculates the volume for a cube from its =width=, =height=, and =depth= properties.

									EXAMPLE
									..........................................................................
									Uize.Array.Sort.sortBy (cubes,'value.width * value.height * value.depth');
									..........................................................................

									Each value of the =cubes= array is an object containing =width=, =height=, and =depth= properties that describe a cube's dimensions. A `sort value generator expression` can calculate the volume for an element of the =cubes= array by dereferencing the =width=, =height=, and =depth= properties on the =value= variable and multiplying them together.

								Sort Rectangles by Squarest, Most Square to Least Square
									An array of objects representing rectangles can be sorted according to their squareness, from most square to least square, by specifying a `sort value generator expression` that calculates an aspect ratio for a rectangle from its =width= and =height= properties.

									EXAMPLE
									..............................................................................
									Uize.Array.Sort.sortBy (
										rectangles,
										'Math.max (value.width,value.height) / Math.min (value.width,value.height)'
									);
									..............................................................................

									Each value of the =rectangles= array is an object containing =width= and =height= properties that describe a rectangle's dimensions. A `sort value generator expression` can calculate the aspect ratio for an element of the =rectangles= array by dereferencing the =width= and =height= properties of the =value= variable and dividing the maximum axis dimension by the minimum axis dimension.

									According to this calculation, a perfectly square rectangle will have an aspect ratio of =1=. The more unsquare a rectangle is, the higher the calculated aspect ratio value. By always dividing the maximum axis dimension by the minimum axis dimension, the aspect ratio is guaranteed to always be =1= or greater, rather than being less than =1= for rectangles whose =width= is smaller than their =height= (ie. where orientation is landscape rather than portrait). Now, sorting the generated sort values into ascending order, the elements of the =rectangles= array are sorted according to how close to square they are.

								Sort Array of Numbers By Closeness to a Reference Number
									An array of numbers can be sorted according to how close they are to a reference number, from closest to furthest away, by specifying a `sort value generator expression` that calculates for a number its absolute distance from the reference number.

									EXAMPLE
									..............................................................................
									Uize.Array.Sort.sortBy (numbers,'Math.abs (' + referenceNumber + ' - value)');
									..............................................................................

									Because we are using a `sort value generator expression` rather than a `sort value generator function` in our example, we can fix the value of the =referenceNumber= variable into the expression using string concatenation. We use the =Math.abs= method of JavaScript's built-in =Math= object to ensure that the calculated distance is always positive - this ensures that numbers are sorted based on their closeness to the reference number, regardless of on which side of the reference number they fall. Now, sorting the generated sort values into ascending order, the elements of the =numbers= array are sorted according to how close they are to the reference number.

								Sort Array of Names in Case-insensitive ASCIIbetical Order
									An array of strings can be sorted into case-insensitive ASCIIbetical order, by specifying a `sort value generator expression` that generates a lower case version of a string value.

									EXAMPLE
									......................................................
									Uize.Array.Sort.sortBy (names,'value.toLowerCase ()');
									......................................................

									In this example, when the elements of the =names= array are sorted according to the lower case, generated sort values, the elements are effectively sorted in a case-insensitive manner, since all the letters of all the sort value strings are guaranteed to be lower case.

								Sort Array of RGB Color Objects By Blackness, Blackest to Whitest
									An array of objects representing RGB colors can be sorted according to their blackness, from blackest to whitest, by specifying a `sort value generator function` that calculates the distance of a color from black in three dimensional RGB color space.

									EXAMPLE
									.................................................................................
									Uize.Array.Sort.sortBy (
										rgbColorObjects,
										function (rgb) {
											return Math.sqrt (
												Math.pow (Math.sqrt (Math.pow (rgb.red,2) + Math.pow (rgb.green,2)),2) +
												Math.pow (rgb.blue,2)
											);
										}
									);
									.................................................................................

									Each value of the =rgbColorObjects= array is an object containing =red=, =green=, and =blue= properties that indicate the values of the three RGB color channels for a color. A `sort value generator function` can calculate a color's distance from black in three dimensional RGB color space by simply treating the color channels as dimensions like width, height, and depth.

									Calculating distance in three dimensional space involves two successive hypotenuse-of-a-triangle calculations (square root of the sum of the squares) - the first calculates a distance in two of the three dimensions, and the second uses the first distance as one of the sides of a right angled triangle to calculate the final distance in three dimensional space. Our calculation in the `sort value generator function` is made simpler by the fact that our reference color is black, which is represented by zeros for each of the color channels, so there is no delta calculation needed for each of the color channels.

								Randomly Shuffle the Elements in an Array
									The order of the elements in an array can be randomly shuffled, by specifying a `sort value generator function` that generates a random number.

									EXAMPLE
									..............................................
									Uize.Array.Sort.sortBy (elements,Math.random);
									..............................................

									Randomly shuffling the order of elements in an array is not influenced by the values of the elements, nor is this process influenced by the original order of the elements, so we use neither the =value= nor the =key= variable in our expression. Instead, we simply supply a `sort value generator function` that doesn't expect any input parameters and that always returns a random number. The =Math.random= method of JavaScript's built-in =Math= object fits the bill. Sorting the array using a set of randomly generated sort values has the effect of randomly shuffling the order of the elements in the array.

									While the above technique works, it's worth noting that a better performing way of shuffling the elements of an array is to use the =Uize.Array.Order.jumble= static method of the =Uize.Array.Order= module.

								Reverse the Elements in an Array
									The order of the elements in an array can be reversed, by specifying a `sort value generator expression` that subtracts the index for an element from the length of the array.

									EXAMPLE
									.............................................................
									Uize.Array.Sort.sortBy (elements,elements.length + ' - key');
									.............................................................

									Because we are using a `sort value generator expression` rather than a `sort value generator function` in our example, we can fix the array's length into the expression using string concatenation. Reversing the order of elements in an array is not influenced by the values of the elements, so we don't use the =value= variable in our expression. Instead, we use the =key= variable and subtract that from the array's length. This results in sort values that descend in value, starting from the length of the array for the first element, and ending with the value =1= for the last element. Sorting the array using these sort values has the effect of reversing the order of the elements.

									While the above technique works, it's worth noting that a better performing way of reversing the order of the elements of an array is to use the =Uize.Array.Order.reverse= static method of the =Uize.Array.Order= module, or the =reverse= instance method of JavaScript's built-in =Array= object.

									It should also be noted that the order of the elements in an array can be reversed by specifying the value =-1= for the =Uize.Array.Sort.sortBy= method's optional =directionINT= parameter, as follows...

									...........................................
									Uize.Array.Sort.sortBy (elements,'key',-1);
									...........................................

									When we use the =directionINT= parameter to reverse the sort direction, we no longer need to use the array's length in the `sort value generator expression`. Instead, we can have a simpler expression that simply returns the key / index.
				*/
			};

		return _package;
	}
});

