/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Data.Combinations Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2012-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 1
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Data.Combinations= module provides methods for generating object or array combinations from a `combination specifier`, with support for an optional combination transformer and combination matcher.

		*DEVELOPERS:* `Chris van Rensburg`

		In a Nutshell
			The methods of the =Uize.Data.Combinations= module make it easy to produce a large set of combinations in a highly performant way.

			Scalable
				The =Uize.Data.Combinations= module is scalable in its ability to support an arbitrary number of combination properties.

				Whereas a typical approach to producing combinations might involve nested =for= loop structures, this approach can only support a fixed number of properties and does not scale well to support an arbitrary or dynamic number of properties. The =Uize.Data.Combinations= module can support an arbitrary and also very large number of combination properties without trouble.

			Performant
				The =Uize.Data.Combinations= module is implemented to be highly performant, avoiding the use of recursion or the repeated creation and destruction of partial results sets.

				The =Uize.Data.Combinations= module uses an approach much like generating all possible numbers up to a maximum number. In this way, the module can implement combination generation using just two levels of loop nesting, regardless of how many properties there are in the `combination specifier`. No recursion is used, thereby reducing function call overhead and call stack bloat.

			The Methods
				The =Uize.Data.Combinations= module provides the following static methods to deal with generated combinations...

				- =Uize.Data.Combinations.forEach= - lets you iterate through generated combinations, executing the specified iteration handler function for each combination
				- =Uize.Data.Combinations.generate= - produces an array containing the generated combinations

			How Combinations Are Generated
				Combinations are generated using a `combination specifier` that provides a template for the combinations, along with an `optional combination transformer` that can be used to modify the generated combinations, and an `optional combination matcher` that can be used to filter the combinations.

				Combination Specifier
					The `combination specifier` lets you specify a kind of template for the generated combinations, with possible values for each property or element.

					When the Combination Specifier is an Object
						If the `combination specifier` is an object, then each property of the object represents a property of the generated combinations, and the value for each property specifies the possible values for that property that should be iterated through when generating the combinations.

						Consider the following example of generating combinations of car specifications...

						EXAMPLE
						.................................................
						var cars = Uize.Data.Combinations.generate ({
							headlights:['regular','xenon','LED'],
							tires:['regular','low profile','fatty'],
							roof:['regular','sun roof','convertible'],
							upholstery:['regular','micro suede','leather']
						});
						.................................................

						With the above `combination specifier`, the =Uize.Data.Combinations.generate= method would produce combinations as follows...

						COMBINATIONS
						........................................................................................
						[
							{headlights:'regular',hubcaps:'regular',roof:'regular',upholstery:'regular'},
							{headlights:'regular',hubcaps:'regular',roof:'regular',upholstery:'micro suede'},
							{headlights:'regular',hubcaps:'regular',roof:'regular',upholstery:'leather'},
							{headlights:'regular',hubcaps:'regular',roof:'sun roof',upholstery:'regular'},
							{headlights:'regular',hubcaps:'regular',roof:'sun roof',upholstery:'micro suede'},
							{headlights:'regular',hubcaps:'regular',roof:'sun roof',upholstery:'leather'},
							{headlights:'regular',hubcaps:'regular',roof:'convertible',upholstery:'regular'},
							{headlights:'regular',hubcaps:'regular',roof:'convertible',upholstery:'micro suede'},
							{headlights:'regular',hubcaps:'regular',roof:'convertible',upholstery:'leather'},
							... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ...
							... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ...
							... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ...
						]
						........................................................................................

						As you may notice from the above sample of the output combinations, the combinations are produced by cycling through the possible values starting from the last property in the `combination specifier` (=upholstery= in this example), and then working steadily towards the first property in the `combination specifier` as the possible values "clock over". Looking at our example `combination specifier`, we can tell that the =Uize.Data.Combinations.generate= method would produce =81= combinations: three possible values for =headlights=, times three possible values for =tires=, times three possible values for =roof=, times three possible values for =upholstery=.

					When the Combination Specifier is an Array
						If the `combination specifier` is an array, then each element of the array represents an element of a generated combination array, and the value for each element specifies the possible values for that element that should be iterated through when generating the combinations.

						Consider the following example of generating combinations of Web safe color tuples...

						EXAMPLE
						.................................................................................
						Uize.Data.Combinations.generate ([
							['00','33','66','99','CC','FF'],  // possible values for red channel element
							['00','33','66','99','CC','FF'],  // possible values for green channel element
							['00','33','66','99','CC','FF']   // possible values for blue channel element
						]);
						.................................................................................

						With the above `combination specifier`, the =Uize.Data.Combinations.generate= method would produce combinations as follows...

						COMBINATIONS
						......................
						[
							['00','00','00'],
							['00','00','33'],
							['00','00','66'],
							['00','00','99'],
							['00','00','CC'],
							['00','00','FF'],
							['00','33','00'],
							['00','33','33'],
							['00','33','66'],
							['00','33','99'],
							['00','33','CC'],
							['00','33','FF'],
							... ... ... ... ...
							... ... ... ... ...
							... ... ... ... ...
						]
						......................

						As is the case `when the combination specifier is an object`, the combinations are produced by cycling through the possible values starting from the last element in the `combination specifier` array (the blue channel's color value in this example), and then working steadily towards the first element in the `combination specifier` as the possible values "clock over". Looking at our example `combination specifier`, we can tell that the =Uize.Data.Combinations.generate= method would produce =216= combinations: six possible values for the red channel, times six possible values for the green channel, times six possible values for the blue channel.

					More on Specifying Possible Values
						When the Possible Values is Not an Array
							If the value of a property in the `combination specifier` is anything other than a list of possible values, then the value is treated as the single possible value for the property in the generated combinations.

							EXAMPLE
							..........................................
							Uize.Data.Combinations.generate ({
								headlights:'regular',
								tires:['regular','low profile','fatty']
							});
							..........................................

							In the above example, the value ='regular'= is the only possible value for the =headlights= property of the generated combinations. It could be specified as an array with only a single element, as in =['regular']=, but this is not necessary with the =Uize.Data.Combinations= module. The above statement would produce the following result...

							RESULT
							..............................................
							[
								{headlights:'regular',tires:'regular'},
								{headlights:'regular',tires:'low profile'},
								{headlights:'regular',tires:'fatty'}
							]
							..............................................

						When There is Only One Possible Value
							When there is only one possible value for a property in the generated combinations, the possible value can be specified as an array with only one element, or just the possible value can be specified.

							However, if the single possible value is an array, then it must be specified wrapped inside an array. Consider the following example...

							EXAMPLE
							.............................................
							Uize.Data.Combinations.generate ({
								bodyColor:[[255,127,0]],
								dashboardColor:[[245,132,0],[205,154,78]],
								tires:'regular'
							});
							.............................................

							In the above example, car configuration combinations are being generated. Colors are specified as RGB tuple arrays, and there is only one possible color for the =bodyColor= property. Therefore, the tuple must be wrapped in a possible values array, or otherwise the individual red, green, and blue color channel values would be confused for possible values. In contrast, there is only one possible value for the =tires= property, but the value is a string. Therefore, this one possible value does *not* need to be wrapped inside an array, because there is no ambiguity. The above statement would produce the following result...

							RESULT
							......................................................................
							[
								{bodyColor:[255,127,0],dashboardColor:[245,132,0],tires:'regular'},
								{bodyColor:[255,127,0],dashboardColor:[205,154,78],tires:'regular'}
							]
							......................................................................

						When There Are No Possible Values
							When the possible values array for a property in the `combination specifier` contains no elements, then this is regarded as there being no possible values for the property and that property is excluded from the generated combinations.

							EXAMPLE
							...........................................
							Uize.Data.Combinations.generate ({
								headlights:'regular',
								tires:['regular','low profile','fatty'],
								racingStripes:[]
							});
							...........................................

							In the above example of a combination specifier for car configuration combinations, there is only one possible value for the =headlights= property, there are two possible values for the =tires= property, and there are no possible values for the =racingStripes= property. The =headlights= property is included in the generated combinations, with the same one value for each combination. In contrast, the =racingStripes= property is excluded from the generated combinations, since there are no possible values for it. The above statement would produce the following result...

							RESULT
							..............................................
							[
								{headlights:'regular',tires:'regular'},
								{headlights:'regular',tires:'low profile'},
								{headlights:'regular',tires:'fatty'}
							]
							..............................................

				Optional Combination Transformer
					Both the =Uize.Data.Combinations.forEach= and =Uize.Data.Combinations.generate= static methods support an optional =combinationTransformerSTRorFUNC= parameter that lets you modify each combination.

					Combination Transformer Function
						When a function is specified for the optional =combinationTransformerSTRorFUNC= parameter, then the function will be executed for each generated combination.

						The `combination transformer function` can expect two arguments: the combination and the combination number / index. The function can modify the combination passed to it, using the combination index if desired. The function does not need to return a value, however, if the function *does* return a value other than =undefined=, then that value will replace the generated combination. A value returned by the function does not need to be an object - it can be of any type. For example, the returned value could be the combination serialized to a string of some form (see the `Generate Web Safe Color Palette` example).

						EXAMPLE
						............................................
						Uize.Data.Combinations.generate (
							{
								width:[6,9],
								length:[10,15],
								height:[12,21]
							},
							function (room,roomNo) {
								room.area = room.width * room.length;
								room.volume = room.area * room.height;
								room.roomNo = roomNo;
							}
						);
						............................................

						In the above example, we are generating different room combinations, where there are two possible options for each of the room properties of =width=, =length=, and =height=. We have specified a custom `combination transformer function` that adds to each room combination object the computed properties =area= and =volume=, while also tagging each combination with a =roomNo= property that is based on the combination index. The above statement would produce the following result...

						RESULT
						...............................................................
						[
							{width:6,length:10,height:12,area:60,volume:720,roomNo:0},
							{width:6,length:10,height:21,area:60,volume:1260,roomNo:1},
							{width:6,length:15,height:12,area:90,volume:1080,roomNo:2},
							{width:6,length:15,height:21,area:90,volume:1890,roomNo:3},
							{width:9,length:10,height:12,area:90,volume:1080,roomNo:4},
							{width:9,length:10,height:21,area:90,volume:1890,roomNo:5},
							{width:9,length:15,height:12,area:135,volume:1620,roomNo:6},
							{width:9,length:15,height:21,area:135,volume:2835,roomNo:7}
						]
						...............................................................

					Combination Transformer Expression String
						When an expression string is specified for the optional =combinationTransformerSTRorFUNC= parameter, then the expression will be executed for each generated combination.

						The `combination transformer expression string` can expect two variables to be defined in the scope of the expression: the =value= variable which represents the generated combination, and the =key= variable which represents the index of the generated combination. The expression can use these two variables to generate a transformed combination. The result of the expression does not need to be an object - it can be of any type - and this value will be used to replace the generated combination. For example, the returned value could be the combination serialized to a string of some form (see the `Generate Web Safe Color Palette` example).

						EXAMPLE
						............................................................................
						Uize.Data.Combinations.generate (
							{
								width:[6,9],
								length:[10,15],
								height:[12,21]
							},
							'value.width + "(W) x " + value.length + "(L) x " + value.height + "(H)"'
						);
						............................................................................

						In the above example, we are generating different room combinations, where there are two possible options for each of the room properties of =width=, =length=, and =height=. We have specified a custom `combination transformer expression string` that serializes the room dimensions to a string of the form "6(W) x 10(L) x 12(H)". The above statement would produce the following result...

						RESULT
						..........................
						[
							'6(W) x 10(L) x 12(H)',
							'6(W) x 10(L) x 21(H)',
							'6(W) x 15(L) x 12(H)',
							'6(W) x 15(L) x 21(H)',
							'9(W) x 10(L) x 12(H)',
							'9(W) x 10(L) x 21(H)',
							'9(W) x 15(L) x 12(H)',
							'9(W) x 15(L) x 21(H)'
						]
						..........................

				Optional Combination Matcher
					Both the =Uize.Data.Combinations.forEach= and =Uize.Data.Combinations.generate= static methods support an optional =combinationMatcherSTRorFUNC= parameter that lets you filter the generated combinations.

					Combination Matcher Function
						When a function is specified for the optional =combinationMatcherSTRorFUNC= parameter, then the function will be executed for each generated combination.

						The `combination matcher function` can expect two arguments: the combination and the combination number / index. The function should return a boolean value, indicating whether or not the combination passed to it should be included in the final set of generated combinations that is returned by the =Uize.Data.Combinations.generate= method or iterated over by the =Uize.Data.Combinations.forEach= method.

						EXAMPLE
						...............................................
						Uize.Data.Combinations.generate (
							{
								width:[6,9],
								length:[10,15],
								height:[12,21]
							},
							function (room,roomNo) {
								room.area = room.width * room.length;
								room.volume = room.area * room.height;
								room.roomNo = roomNo;
							},
							function (room) {return room.volume >= 1500}
						);
						...............................................

						In the above example, we are generating different room combinations, where there are two possible options for each of the room properties of =width=, =length=, and =height=. Additionally, we have specified a custom `combination matcher function` that is filtering out all rooms whose volume is less than 1500 cubic feet. One interesting thing that you'll notice in this example is that the combination matcher is executed after the `optional combination transformer` (if specified), so it gets to match using the generated combination after the transformer has had its opportunity to modify it by changing or adding properties. The above statement would produce the following result...

						RESULT
						...............................................................
						[
							{width:6,length:15,height:21,area:90,volume:1890,roomNo:3},
							{width:9,length:10,height:21,area:90,volume:1890,roomNo:5},
							{width:9,length:15,height:12,area:135,volume:1620,roomNo:6},
							{width:9,length:15,height:21,area:135,volume:2835,roomNo:7}
						]
						...............................................................

					Combination Matcher Expression String
						When an expression string is specified for the optional =combinationMatcherSTRorFUNC= parameter, then the expression will be executed for each generated combination.

						The `combination matcher expression string` can expect two variables to be defined in the scope of the expression: the =value= variable which represents the generated combination, and the =key= variable which represents the index of the generated combination. The expression can use these two variables to generate a boolean value, indicating whether or not the combination should be included in the final set of generated combinations that is returned by the =Uize.Data.Combinations.generate= method or iterated over by the =Uize.Data.Combinations.forEach= method.

						EXAMPLE
						............................................
						Uize.Data.Combinations.generate (
							{
								width:[6,9],
								length:[10,15],
								height:[12,21]
							},
							function (room,roomNo) {
								room.area = room.width * room.length;
								room.volume = room.area * room.height;
								room.roomNo = roomNo;
							},
							'value.volume >= 1500'
						);
						............................................

						In the above example, we are generating different room combinations, where there are two possible options for each of the room properties of =width=, =length=, and =height=. Additionally, we have specified a custom `combination matcher expression string` that is filtering out all rooms whose volume is less than 1500 cubic feet. The combination matcher is executed after the `optional combination transformer` (if specified), so it gets to match using the generated combination after the transformer has had its opportunity to modify it by changing or adding properties.

						Worth pointing out in this example is that, while the `combination transformer function` can name its value and key arguments as it sees fit (=room= and =roomNo= in this case), the `combination matcher expression string` must use the reserved variable names =value= and =key=. The above statement would produce the following result...

						RESULT
						...............................................................
						[
							{width:6,length:15,height:21,area:90,volume:1890,roomNo:3},
							{width:9,length:10,height:21,area:90,volume:1890,roomNo:5},
							{width:9,length:15,height:12,area:135,volume:1620,roomNo:6},
							{width:9,length:15,height:21,area:135,volume:2835,roomNo:7}
						]
						...............................................................

				Transformer, Then Matcher
					When both an `optional combination transformer` and an `optional combination matcher` are specified, the combination transformer is executed first, before the combination matcher is executed.

					This behavior allows each generated combination to be filtered, taking into account how the combination may have been altered or augmented by the combination transformer. Consider the following example...

					EXAMPLE
					..........................................................................
					Uize.Data.Combinations.generate (
						{
							firstName: ['Christopher', 'Jan', 'Jonathan', 'Charles', 'Anthony'],
							lastName: ['Smith', 'von Breugelstein', 'Daniels', 'Pickenson']
						},
						function (person) {
							person.fullName = firstName + ' ' + lastName;
						},
						function (person) {
							return person.fullName.length <= 20;
						}
					);
					..........................................................................

					In the above example, an array of person records is being generated by combining possible values for first name with possible values for last name. This set of person records could be used to feed as dummy data into an automated test process. In this case, we're specifying an `optional combination transformer` to add a =fullName= property to each generated combination. We're also specifying an `optional combination matcher` to filter out / exclude those generated people records where the full name that was constructed in the combination transformer is greater than twenty characters in length.

					The above statement would allow the record with the full name of "Jan von Breugelstein" (exactly twenty characters long), but exclude the record with the full name of "Christopher Pickenson" (twenty one characters long). Importantly, because the `combination transformer function` is executed before the `combination matcher function`, the matcher can access and use the added =fullName= property in its determination.

			Real World Examples
				Generate Web Safe Color Palette
					In this example, we are using the =Uize.Data.Combinations.generate= method to generate an array of hex RGB color strings for the full palette of [[http://en.wikipedia.org/wiki/Web_safe_colors#Web-safe_colors][Web safe colors]].

					If we were to approach this problem the traditional way, we would write our code using three nested =for= loops - one for each of the three RGB color channels. This approach would produce code as follows...

					THE TEDIOUS WAY
					....................................................................................
					var
						channelValues = ['00','33','66','99','CC','FF'],
						webSafeColors = []
					;
					for (var redValueNo = 0; redValueNo < channelValues.length; redValueNo++) {
						for (var greenValueNo = 0; greenValueNo < channelValues.length; greenValueNo++) {
							for (var blueValueNo = 0; blueValueNo < channelValues.length; blueValueNo++) {
								webSafeColors.push (
									'#' +
									channelValues [redValueNo] +
									channelValues [greenValueNo] +
									channelValues [blueValueNo]
								);
							}
						}
					}
					....................................................................................

					If we instead use the =Uize.Data.Combinations.generate= method, we can reduce our code down to something more concise and elegant, as follows...

					THE CONCISE WAY
					....................................................
					var
						channelValues = ['00','33','66','99','CC','FF'],
						webSafeColors = Uize.Data.Combinations.generate (
							[channelValues,channelValues,channelValues],
							'"#" + value.join ("")'
						)
					;
					....................................................

					In our solution, we create the variable =channelValues=, whose value is an array representing all the possible values for a color channel in a Web safe color. We then use this possible values array in a `combination specifier` that provides a template for an RGB color tuple. Then, to ensure that the array of generated values is an array of hex formatted RGB color strings, we specify a `combination transformer expression string` that takes a generated combination tuple and joins its three elements and adds a "#" (pound character) prefix.

				Generate Style Combinations For Testing
					In this example, we are generating a bunch of HTML divs to test various combinations of styling that can be applied using various CSS classes that are used by selectors in a stylesheet.

					Now, given the way we have designed the CSS, we've effectively divided the styling into four different styling dimensions: any div can be styled using one of several possible CSS classes for decorating the border, the padding, the font characteristics, and the color theme. To easily preview and test all the possible styling variations that would be produced by using different combinations of values for these four styling dimensions, we could create four nested =for= loops to iterate through the possible values for each of the styling dimensions. This approach would produce code as follows...

					THE TEDIOUS WAY
					...........................................................................................
					var
						borderClasses = ['noBorder','thinBorder','thickBorder','dottedBorder','fancyBorder'],
						paddingClasses = ['noPadding','smallPadding','extraPadding'],
						printClasses = ['finePrint','normalPrint','easilyReadable','printForVisionImpared'],
						colorClasses = ['normalColors','subduedColors','brightColors','highContrastColors'],
						htmlChunks = []
					;
					for (var borderClassNo = 0; borderClassNo < borderClasses.length; borderClassNo++) {
						for (var paddingClassNo = 0; paddingClassNo < paddingClasses.length; paddingClassNo++) {
							for (var printClassNo = 0; printClassNo < printClasses.length; printClassNo++) {
								for (var colorClassNo = 0; colorClassNo < colorClasses.length; colorClassNo++) {
									htmlChunks.push (
										'<div class="' +
											borderClasses [borderClassNo] + ' ' +
											paddingClasses [paddingClassNo] + ' ' +
											printClasses [printClassNo] + ' ' +
											colorClasses [colorClassNo] + ' ' +
										'">some text</div>'
									);
								}
							}
						}
					}
					Uize.Node.setInnerHtml ('styleCombos',htmlChunks.join ('\n'));
					...........................................................................................

					Of course, if we wanted a more concise and elegant solution - one that is more easily scalable when we want to add more styling dimensions - we could use the =Uize.Data.Combinations.generate= method as follows...

					THE CONCISE WAY
					..............................................................................
					Uize.Node.setInnerHtml (
						'styleCombos',
						Uize.Data.Combinations.generate (
							[
								['noBorder','thinBorder','thickBorder','dottedBorder','fancyBorder'],
								['noPadding','smallPadding','extraPadding'],
								['finePrint','normalPrint','easilyReadable','printForVisionImpared'],
								['normalColors','subduedColors','brightColors','highContrastColors']
							],
							"'<div class=\"' + value.join (' ') + '\">some text</div>'"
						).join ('\n')
					);
					..............................................................................

					In this solution, the `combination specifier` is an array, where each element represents one of the four styling dimensions, and where the value for each element is an array of the possible CSS classes that provides different stylings for that styling dimension. Then, we are specifying a `combination transformer expression string` to take the generated CSS classes array, concatenate it with a " " (space character) delimiter, and wrap it in an HTML =div= tag prefix and suffix. As a result, the =Uize.Data.Combinations.generate= method will return an array of =div= tag strings, which we then join with a newline character to produce an HTML chunk that we insert as inner HTML into the DOM node with the =id= of "styleCombos".

					With this improved approach, if we want to add a new styling dimension, all we need to do is add another element to the `combination specifier` - much cleaner than the alternative approach shown earlier.
*/

Uize.module ({
	name:'Uize.Data.Combinations',
	builder:function () {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_package = function () {},
				_undefined,
				_isList = Uize.isList
			;

		/*** Public Static Methods ***/
			_package.generate = function (_combinationsSpecifier,_combinationTransformer,_combinationMatcher) {
				var _combinations = [];
				_package.forEach (
					_combinationsSpecifier,
					function (_combination) {_combinations.push (_combination)},
					_combinationTransformer,
					_combinationMatcher
				);
				return _combinations;
				/*?
					Static Methods
						Uize.Data.Combinations.generate
							Returns an array of generated combinations that are derived from a `combination specifier`, with support for optionally transforming and/or filtering the combinations.

							DIFFERENT USAGES

							`Generate an Array of Combinations from a Combination Specifier`
							......................................................................................
							combinationsARRAY = Uize.Data.Combinations.generate (combinationsSpecifierOBJorARRAY);
							......................................................................................

							`Generate an Array of Transformed Combinations`
							.....................................................
							combinationsARRAY = Uize.Data.Combinations.generate (
								combinationsSpecifierOBJorARRAY,
								combinationTransformerSTRorFUNC
							);
							.....................................................

							`Generate a Filtered Array of Transformed Combinations`
							.....................................................
							combinationsARRAY = Uize.Data.Combinations.generate (
								combinationsSpecifierOBJorARRAY,
								combinationTransformerSTRorFUNC,
								combinationMatcherSTRorFUNC
							);
							.....................................................

							Generate an Array of Combinations from a Combination Specifier
								In the most typical use case, an array of combinations can be generated by specifying just the =combinationsSpecifierOBJorARRAY= parameter.

								SYNTAX
								......................................................................................
								combinationsARRAY = Uize.Data.Combinations.generate (combinationsSpecifierOBJorARRAY);
								......................................................................................

								The =combinationsSpecifierOBJorARRAY= parameter lets you specify the `combination specifier` from which the combinations will be generated. `When the combination specifier is an object`, an array of objects will be produced. `When the combination specifier is an array`, an array of arrays will be produced. For more information, refer to the section `How Combinations Are Generated`.

							Generate an Array of Transformed Combinations
								When the optional =combinationTransformerSTRorFUNC= second parameter is specified, the generated combinations can be transformed or replaced.

								SYNTAX
								.....................................................
								combinationsARRAY = Uize.Data.Combinations.generate (
									combinationsSpecifierOBJorARRAY,
									combinationTransformerSTRorFUNC
								);
								.....................................................

								For more information on combination transformers and to see examples, refer to the section `Optional Combination Transformer`.

							Generate a Filtered Array of Transformed Combinations
								When the optional =combinationMatcherSTRorFUNC= third parameter is specified, the generated (and optionally transformed) combinations can be filtered.

								SYNTAX
								.....................................................
								combinationsARRAY = Uize.Data.Combinations.generate (
									combinationsSpecifierOBJorARRAY,
									combinationTransformerSTRorFUNC,
									combinationMatcherSTRorFUNC
								);
								.....................................................

								When a combination matcher is desired but a combination transformer is not desired, the value =null= or =undefined= can be specified for the =combinationTransformerSTRorFUNC= parameter. For more information on combination matchers and to see examples, refer to the section `Optional Combination Matcher`.

							NOTES
							- compare to the =Uize.Data.Combinations.forEach= static method
				*/
			};

			_package.forEach = function (
				_combinationsSpecifier,_iterationHandler,_combinationTransformer,_combinationMatcher
			) {
				if (Uize.isObject (_combinationsSpecifier)) {
					/*** normalize parameters ***/
						if (_combinationTransformer != _undefined)
							_combinationTransformer = Uize.resolveTransformer (_combinationTransformer)
						;
						if (_combinationMatcher != _undefined)
							_combinationMatcher = Uize.resolveMatcher (_combinationMatcher)
						;

					/*** preparation to optimize performance of iterating through combinations ***/
						var
							_keys = [],
							_key,
							_keyNo = -1,
							_values,
							_valuesPerKeyNo = [],
							_valuesLengthPerKeyNo = [],
							_valueNoPerKeyNo = [],
							_combinationsAreArray = Uize.isArray (_combinationsSpecifier)
						;
						Uize.forEach (
							_combinationsSpecifier,
							function (_values,_key) {
								_values = _combinationsSpecifier [_key];
								if (!_isList (_values)) _values = [_values]; // treat non-list value as only one possible value
								if (_values.length) { // only include property if it has at least one possible value
									_keys.push (_key);
									_keyNo++;
									_valuesLengthPerKeyNo [_keyNo] = (_valuesPerKeyNo [_keyNo] = _values).length;
									_valueNoPerKeyNo [_keyNo] = 0;
								}
							}
						);

					/*** iterate through and produce combinations ***/
						var
							_combinationNo = -1,
							_keysLength = _keyNo + 1,
							_combinationTransformerResult
						;
						while (_keyNo >= 0) {
							_combinationNo++;

							/*** build object for current combination ***/
								var _combination = _combinationsAreArray ? [] : {};
								for (_keyNo = -1; ++_keyNo < _keysLength;)
									_combination [_keys [_keyNo]] = _valuesPerKeyNo [_keyNo] [_valueNoPerKeyNo [_keyNo]]
								;

							/*** use combination transformer, if specified ***/
								if (
									_combinationTransformer &&
									(
										_combinationTransformerResult = _combinationTransformer (_combination,_combinationNo)
									) !== _undefined
								)
									_combination = _combinationTransformerResult
								;

							/*** call iteration handler, if combination matcher permits ***/
								(!_combinationMatcher || _combinationMatcher (_combination,_combinationNo)) &&
									_iterationHandler (_combination)
								;

							/*** advance to next combination ***/
								_keyNo = _keysLength;
								while (
									--_keyNo >= 0 &&
									!(
										_valueNoPerKeyNo [_keyNo] =
										(_valueNoPerKeyNo [_keyNo] + 1) % _valuesLengthPerKeyNo [_keyNo]
									)
								);
						}
				}
				/*?
					Static Methods
						Uize.Data.Combinations.forEach
							Iterates through the generated combinations, calling the specified iterator handler for each combination.

							DIFFERENT USAGES

							`Iterate Over a Set of Generated Combinations`
							.....................................................................................
							Uize.Data.Combinations.forEach (combinationsSpecifierOBJorARRAY,iteratorHandlerFUNC);
							.....................................................................................

							`Iterate Over a Set of Transformed Combinations`
							...................................
							Uize.Data.Combinations.forEach (
								combinationsSpecifierOBJorARRAY,
								iteratorHandlerFUNC,
								combinationTransformerSTRorFUNC
							);
							...................................

							`Iterate Over a Filtered Set of Combinations`
							...................................
							Uize.Data.Combinations.forEach (
								combinationsSpecifierOBJorARRAY,
								iteratorHandlerFUNC,
								combinationTransformerSTRorFUNC,
								combinationMatcherSTRorFUNC
							);
							...................................

							Iterate Over a Set of Generated Combinations
								In the most typical use case, an array of combinations can be iterated over by specifying just the =combinationsSpecifierOBJorARRAY= and =iteratorHandlerFUNC= parameters.

								SYNTAX
								.....................................................................................
								Uize.Data.Combinations.forEach (combinationsSpecifierOBJorARRAY,iteratorHandlerFUNC);
								.....................................................................................

								The =combinationsSpecifierOBJorARRAY= parameter lets you specify the `combination specifier` from which the combinations will be generated. `When the combination specifier is an object`, the generated combinations will be objects. `When the combination specifier is an array`, the generated combinations will be arrays. For more information, refer to the section `How Combinations Are Generated`.

								The =iteratorHandlerFUNC= parameter lets you specify the handler function that should be called for each iteration. The handler function will be called with a single argument, being the generated combination for the iteration.

								EXAMPLE
								.................................................................................
								var channelValues = ['00','33','66','99','CC','FF'];
								Uize.Data.Combinations.forEach (
									[channelValues,channelValues,channelValues],
									function (webSafeColorTuple) {console.log ('#' + webSafeColorTuple.join (''))}
								);
								.................................................................................

								In the above example, the RGB hex values of all the Web safe colors are being logged to the console. In our iteration handler function, we are defining the single argument =webSafeColorTuple=. This argument is essentially the generated combination for the iteration, but we can call it whatever makes the most sense in our particular application. In this example, each generated combination is really a Web safe colo tuple, with values for the red, green, and blue color channels.

							Iterate Over a Set of Transformed Combinations
								When the optional =combinationTransformerSTRorFUNC= third parameter is specified, the generated combinations can be transformed before they are passed to the iteration handler.

								SYNTAX
								...................................
								Uize.Data.Combinations.forEach (
									combinationsSpecifierOBJorARRAY,
									iteratorHandlerFUNC,
									combinationTransformerSTRorFUNC
								);
								...................................

								For more information on combination transformers and to see examples, refer to the section `Optional Combination Transformer`.

							Iterate Over a Filtered Set of Combinations
								When the optional =combinationMatcherSTRorFUNC= fourth parameter is specified, the generated (and optionally transformed) combinations can be filtered.

								SYNTAX
								...................................
								Uize.Data.Combinations.forEach (
									combinationsSpecifierOBJorARRAY,
									iteratorHandlerFUNC,
									combinationTransformerSTRorFUNC,
									combinationMatcherSTRorFUNC
								);
								...................................

								When a combination matcher is desired but a combination transformer is not desired, the value =null= or =undefined= can be specified for the =combinationTransformerSTRorFUNC= parameter. For more information on combination matchers and to see examples, refer to the section `Optional Combination Matcher`.

							NOTES
							- compare to the =Uize.Data.Combinations.generate= static method
				*/
			};

		return _package;
	}
});

