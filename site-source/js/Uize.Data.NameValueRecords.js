/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Data.NameValueRecords Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2009-2013 UIZE
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
		The =Uize.Data.NameValueRecords= package provides methods for converting between a hash object and an array with elements representing name-value pairs.

		*DEVELOPERS:* `Chris van Rensburg`

	In a Nutshell
		A Real World Use Case
			To get a better understanding of how this module can be useful, let's take a look at a real world use case.

			You have a CSV formatted data file that was exported from a spreadsheet. This is a particular kind of spreadsheet, where the first column stores the id for localized string resources, and the second column stores their translations. The entire spreadsheet contains translations for a number of resources, for a single language. We'd like to parse the CSV file and ultimately produce a hash table that we can use to look up localized translations for given resource strings. We can parse the CSV file, using the =Uize.Data.Csv= module, to produce a records array. Then we'd like to convert that records array into a lookup hash. We can do this with the =Uize.Data.NameValueRecords.toHash= method, as follows...

			CSV FILE
			............................................................................
			welcomeMessage,"Welcome, {firstName} of {state}, {country}"
			deleteSingular,Are you sure you would like to delete this item?
			deletePlural,Are you sure you would like to delete these {totalItems} items?
			............................................................................

			PARSE AND CONVERT TO HASH
			............................................................
			var myLocalizationHash = Uize.Data.NameValueRecords.toHash (
				Uize.Data.Csv.from (localizationCsvFileText)
			);
			............................................................

			In the above example, we're assuming that the text contents has already been loaded into the string variable =myLocalizationHash=. We use the =Uize.Data.Csv.from= method to parse the CSV formatted data string, producing a `name/value records array` containing `array type name/value records`. The =Uize.Data.NameValueRecords.toHash= method is then used to convert this `name/value records array` to a hash object. After the above code has executed, the value of the =myLocalizationHash= variable would be as follows...

			OUTPUT
			.................................................................................
			{
				welcomeMessage:'Welcome, {firstName} of {state}, {country}',
				deleteSingular:'Are you sure you would like to delete this item?',
				deletePlural:'Are you sure you would like to delete these {totalItems} items?'
			}
			.................................................................................

		Name/value Records Array
			A name/value records array is an array where each record in the array represents a name/value pair.

			Name/value pairs in a name/value records array can be either `object type name/value records` or `array type name/value records`.

			Object Type Name/value Records
				With object type name/value records, each record is an object containing properties for the name and value of a name/value pair.

				EXAMPLE
				.............................................................................
				[
					{
						name:'welcomeMessage',
						value:'Welcome, {firstName} of {state}, {country}'
					},
					{
						name:'deleteSingular',
						value:'Are you sure you would like to delete this item?'
					},
					{
						name:'deletePlural',
						value:'Are you sure you would like to delete these {totalItems} items?'
					}
				]
				.............................................................................

				Non-standard Name/value Properties
					By default, and typically, the property used for specifying the name out of a name/value pair is called =name=, and the property used for specifying the value out of a name/value pair is called =value=, but this does not have to be the case.

					The methods of the =Uize.Data.NameValueRecords= module support `object type name/value records` where the name/value records use different property names for defining name/value pairs. Consider the following example...

					EXAMPLE
					...................................................................................
					[
						{
							stringId:'welcomeMessage',
							translation:'Welcome, {firstName} of {state}, {country}'
						},
						{
							stringId:'deleteSingular',
							translation:'Are you sure you would like to delete this item?'
						},
						{
							stringId:'deletePlural',
							translation:'Are you sure you would like to delete these {totalItems} items?'
						}
					]
					...................................................................................

					In the above example, =stringId= is used for the name property, and =translation= is used for the value property. This is an extreme example. Maybe more reasonable would be to use =key= and =value=, but this illustrates the point. The =Uize.Data.NameValueRecords.fromHash= and =Uize.Data.NameValueRecords.toHash= methods let you work with an `object type name/value records` array that has non-standard name/value properties, with their optional =namePropertySTRorINT= and =valuePropertySTRorINT= parameters.

					See the following examples for more info...

					- `EXAMPLE: From Object Type Records, Non-standard Name/value Properties`
					- `EXAMPLE: To Object Type Records, Non-standard Name/value Properties`

			Array Type Name/value Records
				With array type name/value records, each record is an array containing elements for the name and value of a name/value pair.

				EXAMPLE
				.......................................................................
				[
					[
						'welcomeMessage',
						'Welcome, {firstName} of {state}, {country}'
					],
					[
						'deleteSingular',
						'Are you sure you would like to delete this item?'
					],
					[
						'deletePlural',
						'Are you sure you would like to delete these {totalItems} items?'
					]
				]
				.......................................................................

				Non-standard Name/value Elements
					By default, and typically, the first element of `array type name/value records` is used for specifying the name out of a name/value pair, and the second element is used for specifying the value out of a name/value pair, but this does not have to be the case.

					The methods of the =Uize.Data.NameValueRecords= module support `array type name/value records` where different elements of the name/value records are used for defining name/value pairs. Consider the following example...

					EXAMPLE
					.......................................................................
					[
						[
							'Welcome, {firstName} of {state}, {country}',
							'welcomeMessage'
						],
						[
							'Are you sure you would like to delete this item?',
							'deleteSingular'
						],
						[
							'Are you sure you would like to delete these {totalItems} items?',
							'deletePlural'
						]
					]
					.......................................................................

					In the above example, we want the second element out of each record to be used for the name property, and the first element to be used for the value property. The =Uize.Data.NameValueRecords.fromHash= and =Uize.Data.NameValueRecords.toHash= methods let you work with an `array type name/value records` array that has non-standard ordering of name/value elements, with their optional =namePropertySTRorINT= and =valuePropertySTRorINT= parameters.

					See the following examples for more info...

					- `EXAMPLE: To Array Type Records, Name and Value Reversed`
					- `EXAMPLE: From Array Type Records, Name and Value Reversed`

			Extraneous Properties or Elements
				The methods of the =Uize.Data.NameValueRecords= module support the presence of extraneous properties or elements in `object type name/value records` and `array type name/value records`.

				For `object type name/value records`, properties that aren't the name or value properties for name/value pairs are simply ignored. For `array type name/value records`, elements that aren't the name or value elements for name/value pairs will also be ignored, provided the first element remains the name element and the second element remains the value element. If the presence of extraneous elements in `array type name/value records` interferes with the order of the name and value elements, then you will have to use the optional =namePropertySTRorINT= and =valuePropertySTRorINT= parameters to indicate the indices of the name and value elements.

				See the following examples for more info...

				- `EXAMPLE: From Object Type Records, With Extraneous Properties`
				- `EXAMPLE: From Array Type Records, With Extraneous Elements`

		Converting From Name/value Records Array To Hash
			Converting from a `name/value records array` to a hash object is done using the =Uize.Data.NameValueRecords.toHash= static method.

			EXAMPLE
			................................................................................
			Uize.Data.NameValueRecords.toHash (
				[
					{
						name:'welcomeMessage',
						value:'Welcome, {firstName} of {state}, {country}'
					},
					{
						name:'deleteSingular',
						value:'Are you sure you would like to delete this item?'
					},
					{
						name:'deletePlural',
						value:'Are you sure you would like to delete these {totalItems} items?'
					}
				]
			);
			................................................................................

			In the above example, an array of name/value records defines a dictionary of localized string id to translation mappings. This `name/value records array` is converted to a dictionary hash, for easy lookup, using the =Uize.Data.NameValueRecords.toHash=. The above method call would produce the following result...

			OUTPUT
			.................................................................................
			{
				welcomeMessage:'Welcome, {firstName} of {state}, {country}',
				deleteSingular:'Are you sure you would like to delete this item?',
				deletePlural:'Are you sure you would like to delete these {totalItems} items?'
			}
			.................................................................................

			For a more detailed explanation, and for more examples, see the reference for the =Uize.Data.NameValueRecords.toHash= method.

		Converting From Hash to Name/value Records Array
			Converting from a hash object to a `name/value records array` is done using the =Uize.Data.NameValueRecords.fromHash= static method.

			EXAMPLE
			....................................................................................
			Uize.Data.NameValueRecords.fromHash (
				{
					welcomeMessage:'Welcome, {firstName} of {state}, {country}',
					deleteSingular:'Are you sure you would like to delete this item?',
					deletePlural:'Are you sure you would like to delete these {totalItems} items?'
				}
			);
			....................................................................................

			In the above example, a dictionary of localized string id to translation mappings is being converted to an array of name/value records, where each record is an object containing =name= and =value= properties. The above method call would produce the following result...

			OUTPUT
			.............................................................................
			[
				{
					name:'welcomeMessage',
					value:'Welcome, {firstName} of {state}, {country}'
				},
				{
					name:'deleteSingular',
					value:'Are you sure you would like to delete this item?'
				},
				{
					name:'deletePlural',
					value:'Are you sure you would like to delete these {totalItems} items?'
				}
			]
			.............................................................................

			For a more detailed explanation, and for more examples, see the reference for the =Uize.Data.NameValueRecords.fromHash= method.

		Bi-directional Conversion
			Conversion back and forth between a hash object and a `name/value records array` should continue to preserve all the original data, provided that the original data did not contain `extraneous properties or elements` or mappings of multiple values to the same name, as these would get lost in the conversion from a `name/value records array` to a hash object.

			EXAMPLE
			....................................................................................
			Uize.Data.NameValueRecords.toHash (
				Uize.Data.NameValueRecords.fromHash (
					{
						welcomeMessage:'Welcome, {firstName} of {state}, {country}',
						deleteSingular:'Are you sure you would like to delete this item?',
						deletePlural:'Are you sure you would like to delete these {totalItems} items?'
					}
				)
			);
			....................................................................................

			OUTPUT
			.................................................................................
			{
				welcomeMessage:'Welcome, {firstName} of {state}, {country}',
				deleteSingular:'Are you sure you would like to delete this item?',
				deletePlural:'Are you sure you would like to delete these {totalItems} items?'
			}
			.................................................................................

		Transmuting a Name/value Records Array
			You can use the methods of the =Uize.Data.NameValueRecords= module to transmute a `name/value records array`, by going through a hash object as an intermediate state, as shown in the examples below...

			EXAMPLE 1
			......................................................................................
			var transmutedNameValueRecords =
				Uize.Data.NameValueRecords.fromHash (
					Uize.Data.NameValueRecords.toHash (
						[
							{
								name:'welcomeMessage',
								value:'Welcome, {firstName} of {state}, {country}'
							},
							{
								name:'deleteSingular',
								value:'Are you sure you would like to delete this item?'
							},
							{
								name:'deletePlural',
								value:'Are you sure you would like to delete these {totalItems} items?'
							}
						]
					),
					0,
					1
				)
			;
			......................................................................................

			In the above example, we're transmuting a `name/value records array` with `object type name/value records` into one with `array type name/value records`. After the above code has executed, the value of the =transmutedNameValueRecords= variable will be as follows...

			OUTPUT
			.......................................................................
			[
				[
					'welcomeMessage',
					'Welcome, {firstName} of {state}, {country}'
				],
				[
					'deleteSingular',
					'Are you sure you would like to delete this item?'
				],
				[
					'deletePlural',
					'Are you sure you would like to delete these {totalItems} items?'
				]
			]
			.......................................................................

			EXAMPLE 2
			......................................................................................
			var transmutedNameValueRecords =
				Uize.Data.NameValueRecords.fromHash (
					Uize.Data.NameValueRecords.toHash (
						[
							{
								name:'welcomeMessage',
								value:'Welcome, {firstName} of {state}, {country}'
							},
							{
								name:'deleteSingular',
								value:'Are you sure you would like to delete this item?'
							},
							{
								name:'deletePlural',
								value:'Are you sure you would like to delete these {totalItems} items?'
							}
						]
					),
					'stringId',
					'translation'
				)
			;
			......................................................................................

			In the above example, we're transmuting a `name/value records array` with `object type name/value records` into a new one - also with object type records - but where the names of the name/value properties have been remapped from =name= and =value= to =stringId= and =translation=. After the above code has executed, the value of the =transmutedNameValueRecords= variable will be as follows...

			OUTPUT
			...................................................................................
			[
				{
					stringId:'welcomeMessage',
					translation:'Welcome, {firstName} of {state}, {country}'
				},
				{
					stringId:'deleteSingular',
					translation:'Are you sure you would like to delete this item?'
				},
				{
					stringId:'deletePlural',
					translation:'Are you sure you would like to delete these {totalItems} items?'
				}
			]
			...................................................................................

			Other applications for transmuting include deduping and extraneous property removal. Use your imagination to conjure up other ways that name/value records arrays could be transmuted by converting back and forth with different options.
*/

Uize.module ({
	name:'Uize.Data.NameValueRecords',
	builder:function () {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_undefined,
				_Uize_defaultNully = Uize.defaultNully,
				_package = function () {}
			;

		/*** Public Static Methods ***/
			_package.fromHash = function (_hash,_nameProperty,_valueProperty) {
				var _result = [];

				if (Uize.isObject (_hash)) {
					var
						_recordTypeIsArray = typeof _nameProperty == 'number' && typeof _valueProperty == 'number',
						_record
					;

					/*** default _nameProperty and _valueProperty params ***/
						_nameProperty = _Uize_defaultNully (_nameProperty,'name');
						_valueProperty = _Uize_defaultNully (_valueProperty,'value');

					for (var _name in _hash) {
						_result.push (_record = _recordTypeIsArray ? [] : {});
						_record [_nameProperty] = _name;
						_record [_valueProperty] = _hash [_name];
					}
				}

				return _result;
				/*?
					Static Methods
						Uize.Data.NameValueRecords.fromHash
							Returns a `name/value records array`, where each record contains the name and value for a property of the specified object hash.

							SYNTAX
							......................................................................
							nameValueRecordsARRAY = Uize.Data.NameValueRecords.fromHash (hashOBJ);
							......................................................................

							VARIATION
							.............................................................
							nameValueRecordsARRAY = Uize.Data.NameValueRecords.fromHash (
								hashOBJ,namePropertySTRorINT,valuePropertySTRorINT
							);
							.............................................................

							When the optional =namePropertySTRorINT= and =valuePropertySTRorINT= parameters are specified, then the key names for the name and value properties of the name/value records can be controlled (by default they are ='name'= and ='value'=). Specifying number type values for these parameters will cause the generated name/value records to be two element arrays, rather than two property objects.

							EXAMPLE: To Object Type Records
								By default, name/value records generated by the =Uize.Data.NameValueRecords.fromHash= method are objects containing =name= and =value= properties.

								EXAMPLE
								....................................................................................
								Uize.Data.NameValueRecords.fromHash (
									{
										welcomeMessage:'Welcome, {firstName} of {state}, {country}',
										deleteSingular:'Are you sure you would like to delete this item?',
										deletePlural:'Are you sure you would like to delete these {totalItems} items?'
									}
								);
								....................................................................................

								In the above example, a dictionary of localized string id to translation mappings is being converted to an array of name/value records, where each record is an object containing =name= and =value= properties. The above method call would produce the following result...

								OUTPUT
								.............................................................................
								[
									{
										name:'welcomeMessage',
										value:'Welcome, {firstName} of {state}, {country}'
									},
									{
										name:'deleteSingular',
										value:'Are you sure you would like to delete this item?'
									},
									{
										name:'deletePlural',
										value:'Are you sure you would like to delete these {totalItems} items?'
									}
								]
								.............................................................................

							EXAMPLE: To Object Type Records, Non-standard Name/value Properties
								In this example, we are specifying values for the optional =namePropertySTRorINT= and =valuePropertySTRorINT= parameters in order to override the default values of ='name'= and ='value'=.

								EXAMPLE
								....................................................................................
								Uize.Data.NameValueRecords.fromHash (
									{
										welcomeMessage:'Welcome, {firstName} of {state}, {country}',
										deleteSingular:'Are you sure you would like to delete this item?',
										deletePlural:'Are you sure you would like to delete these {totalItems} items?'
									},
									'stringId',
									'translation'
								);
								....................................................................................

								Here we are specifying ='stringId'= for =namePropertySTRorINT= to override the default of ='name'=, and ='translation'= for =valuePropertySTRorINT= to override the default of ='value'=. The above method call would produce the following result...

								OUTPUT
								...................................................................................
								[
									{
										stringId:'welcomeMessage',
										translation:'Welcome, {firstName} of {state}, {country}'
									},
									{
										stringId:'deleteSingular',
										translation:'Are you sure you would like to delete this item?'
									},
									{
										stringId:'deletePlural',
										translation:'Are you sure you would like to delete these {totalItems} items?'
									}
								]
								...................................................................................

							EXAMPLE: To Array Type Records
								By specifying number type values for the =namePropertySTRorINT= and =valuePropertySTRorINT= parameters, we can coerce the =Uize.Data.NameValueRecords.fromHash= method to make the name/value records two element arrays, rather than two property objects.

								Specifying the value =0= for =namePropertySTRorINT= would put the name in the first element of each name/value array, and specifying the value =1= for =valuePropertySTRorINT= would put the value in the second element. Consider the following example...

								EXAMPLE
								....................................................................................
								Uize.Data.NameValueRecords.fromHash (
									{
										welcomeMessage:'Welcome, {firstName} of {state}, {country}',
										deleteSingular:'Are you sure you would like to delete this item?',
										deletePlural:'Are you sure you would like to delete these {totalItems} items?'
									},
									0,
									1
								);
								....................................................................................

								In the above example we are specifying the values =0= and =1= for the =namePropertySTRorINT= and =valuePropertySTRorINT= parameters, respectively. This tells the =Uize.Data.NameValueRecords.fromHash= to return an array of arrays, rather than an array of objects. The above method call would produce the following result...

								OUTPUT
								.......................................................................
								[
									[
										'welcomeMessage',
										'Welcome, {firstName} of {state}, {country}'
									],
									[
										'deleteSingular',
										'Are you sure you would like to delete this item?'
									],
									[
										'deletePlural',
										'Are you sure you would like to delete these {totalItems} items?'
									]
								]
								.......................................................................

							EXAMPLE: To Array Type Records, Name and Value Reversed
								You can specify any index values for the =namePropertySTRorINT= and =valuePropertySTRorINT= parameters, so you could even swap the name/value order, as in the following example...

								EXAMPLE
								....................................................................................
								Uize.Data.NameValueRecords.fromHash (
									{
										welcomeMessage:'Welcome, {firstName} of {state}, {country}',
										deleteSingular:'Are you sure you would like to delete this item?',
										deletePlural:'Are you sure you would like to delete these {totalItems} items?'
									},
									1,
									0
								);
								....................................................................................

								In the above example we are specifying the values =1= and =0= for the =namePropertySTRorINT= and =valuePropertySTRorINT= parameters, respectively. This has the effect of swapping the name/value order in the two element name/value arrays. The above method call would produce the following result...

								OUTPUT
								........................................................................
								[
									[
										'Welcome, {firstName} of {state}, {country}',
										'welcomeMessage'
									],
									[
										'Are you sure you would like to delete this item?',
										'deleteSingular'
									],
									[
										'Are you sure you would like to delete these {totalItems} items?',
										'deletePlural'
									]
								]
								........................................................................

							NOTES
							- see the companion =Uize.Data.NameValueRecords.toHash= static method
				*/
			};

			_package.toHash = function (_records,_nameProperty,_valueProperty) {
				var
					_result = {},
					_recordsLength = Uize.isArray (_records) && _records.length
				;
				if (_recordsLength) {
					/*** default _nameProperty and _valueProperty params ***/
						var _recordTypeIsArray = Uize.isArray (_records [0]);
						_nameProperty = _Uize_defaultNully (_nameProperty,_recordTypeIsArray ? 0 : 'name');
						_valueProperty = _Uize_defaultNully (_valueProperty,_recordTypeIsArray ? 1 : 'value');

						for (var _recordNo = -1, _record, _name; ++_recordNo < _recordsLength;) {
							_name = (_record = _records [_recordNo]) [_nameProperty];
							if (_name != _undefined)
								_result [_name] = _record [_valueProperty]
							;
						}
				}
				return _result;
				/*?
					Static Methods
						Uize.Data.NameValueRecords.toHash
							Returns an object hash, where each property of the hash represents an element of the specified `name/value records array`.

							SYNTAX
							....................................................................
							hashOBJ = Uize.Data.NameValueRecords.toHash (nameValueRecordsARRAY);
							....................................................................

							VARIATION
							...................................................................
							hashOBJ = Uize.Data.NameValueRecords.toHash (
								nameValueRecordsARRAY,namePropertySTRorINT,valuePropertySTRorINT
							);
							...................................................................

							When the optional =namePropertySTRorINT= and =valuePropertySTRorINT= parameters are specified, then you can control which property in the name/value records should be used for the property name in the returned hash object, and which property in the name/value records should be used for the property value. When these parameters are not specified, then the values of these paremeters will be defaulted to ether ='name'= and ='value'=, or =0= and =1=, depending on the type of the first name/value record in the array - ='name'= and ='value'= for object type, and =0= and =1= for array type.

							EXAMPLE: From Object Type Records
								By default, name/value records supplied to the =Uize.Data.NameValueRecords.toHash= method are expected to be objects containing =name= and =value= properties.

								EXAMPLE
								................................................................................
								Uize.Data.NameValueRecords.toHash (
									[
										{
											name:'welcomeMessage',
											value:'Welcome, {firstName} of {state}, {country}'
										},
										{
											name:'deleteSingular',
											value:'Are you sure you would like to delete this item?'
										},
										{
											name:'deletePlural',
											value:'Are you sure you would like to delete these {totalItems} items?'
										}
									]
								);
								................................................................................

								In the above example, an array of name/value records defines a dictionary of localized string id to translation mappings. This `name/value records array` is converted to a dictionary hash, for easy lookup, using the =Uize.Data.NameValueRecords.toHash=. Because the name/value records are objects containing =name= and =value= properties, the optional =namePropertySTRorINT= and =valuePropertySTRorINT= parameters do not need to be used. The above method call would produce the following result...

								OUTPUT
								.................................................................................
								{
									welcomeMessage:'Welcome, {firstName} of {state}, {country}',
									deleteSingular:'Are you sure you would like to delete this item?',
									deletePlural:'Are you sure you would like to delete these {totalItems} items?'
								}
								.................................................................................

							EXAMPLE: From Object Type Records, With Extraneous Properties
								When converting an array of name/value records to an object hash, where the name/value records are objects, the =Uize.Data.NameValueRecords.toHash= method ignores extraneous properties in the name/value objects.

								EXAMPLE
								................................................................................
								Uize.Data.NameValueRecords.toHash (
									[
										{
											language:'us-english',
											name:'welcomeMessage',
											value:'Welcome, {firstName} of {state}, {country}'
										},
										{
											name:'deleteSingular',
											language:'us-english',
											value:'Are you sure you would like to delete this item?'
										},
										{
											name:'deletePlural',
											value:'Are you sure you would like to delete these {totalItems} items?',
											language:'us-english'
										}
									]
								);
								................................................................................

								In the above example, each name/value record also contains a =language= property. Because the name/value records are objects, and because the optional =namePropertySTRorINT= and =valuePropertySTRorINT= parameters are not being used, the =Uize.Data.NameValueRecords.toHash= method uses the =name= and =value= properties from each name/value record to populate the returned object hash. So, in this case, the extraneous =language= property is simply ignored. The above method call would produce the following result...

								OUTPUT
								.................................................................................
								{
									welcomeMessage:'Welcome, {firstName} of {state}, {country}',
									deleteSingular:'Are you sure you would like to delete this item?',
									deletePlural:'Are you sure you would like to delete these {totalItems} items?'
								}
								.................................................................................

							EXAMPLE: From Object Type Records, Non-standard Name/value Properties
								When the name/value records are objects whose name and value properties are not named =name= and =value=, then the optional =namePropertySTRorINT= and =valuePropertySTRorINT= parameters can be used to specify which property should be used as the property name and which should be used as the property value for properties of the returned hash object.

								EXAMPLE
								......................................................................................
								Uize.Data.NameValueRecords.toHash (
									[
										{
											stringId:'welcomeMessage',
											translation:'Welcome, {firstName} of {state}, {country}'
										},
										{
											stringId:'deleteSingular',
											translation:'Are you sure you would like to delete this item?'
										},
										{
											stringId:'deletePlural',
											translation:'Are you sure you would like to delete these {totalItems} items?'
										}
									],
									'stringId',
									'translation'
								);
								......................................................................................

								In this example, the name/value records in our array are not using the standard =name= and =value= properties. Instead, we would like to use the =stringId= property for property names and the =translation= property for property values in the returned hash object. Therefore, we specify the value ='stringId'= for the =namePropertySTRorINT= parameter, and the value ='translation'= for the =valuePropertySTRorINT= parameter. The above method call would produce the following result...

								OUTPUT
								.................................................................................
								{
									welcomeMessage:'Welcome, {firstName} of {state}, {country}',
									deleteSingular:'Are you sure you would like to delete this item?',
									deletePlural:'Are you sure you would like to delete these {totalItems} items?'
								}
								.................................................................................

							EXAMPLE: From Array Type Records
								Name/value records supplied to the =Uize.Data.NameValueRecords.toHash= method can also be two element arrays, where the first element represents the property name and the second element represents the property value for properties of the returned hash object.

								EXAMPLE
								..........................................................................
								Uize.Data.NameValueRecords.toHash (
									[
										[
											'welcomeMessage',
											'Welcome, {firstName} of {state}, {country}'
										],
										[
											'deleteSingular',
											'Are you sure you would like to delete this item?'
										],
										[
											'deletePlural',
											'Are you sure you would like to delete these {totalItems} items?'
										]
									]
								);
								..........................................................................

								In the above example, the =Uize.Data.NameValueRecords.toHash= method detects that the first record in the `name/value records array` is an array. Because the optional =namePropertySTRorINT= and =valuePropertySTRorINT= parameters are not used, and because the name/value records are arrays, the =Uize.Data.NameValueRecords.toHash= method defaults the =namePropertySTRorINT= and =valuePropertySTRorINT= parameters to =0= and =1=, which results in extracting the first and second elements out of each name/value record when forming the properties of the returned hash object. The above method call would produce the following result...

								OUTPUT
								.................................................................................
								{
									welcomeMessage:'Welcome, {firstName} of {state}, {country}',
									deleteSingular:'Are you sure you would like to delete this item?',
									deletePlural:'Are you sure you would like to delete these {totalItems} items?'
								}
								.................................................................................

							EXAMPLE: From Array Type Records, Name and Value Reversed
								You can specify any index values for the =namePropertySTRorINT= and =valuePropertySTRorINT= parameters, so you can swap the name/value order when name/value records are arrays containing more than two elements, as in the following example...

								EXAMPLE
								..........................................................................
								Uize.Data.NameValueRecords.toHash (
									[
										[
											'Welcome, {firstName} of {state}, {country}',
											'welcomeMessage'
										],
										[
											'Are you sure you would like to delete this item?',
											'deleteSingular'
										],
										[
											'Are you sure you would like to delete these {totalItems} items?',
											'deletePlural'
										]
									],
									1,
									0
								);
								..........................................................................

								In this example, we know that the name/value records of the array have their name and value elements swapped around. To adjust for this, we can specify the value =1= and =0= for the =namePropertySTRorINT= and =valuePropertySTRorINT= parameters, respectively, to map the second element of each name/value record to the property name, and the first element to the property value, when mapping the name/value records to properties of the returned hash object. The above method call would produce the following result...

								OUTPUT
								.................................................................................
								{
									welcomeMessage:'Welcome, {firstName} of {state}, {country}',
									deleteSingular:'Are you sure you would like to delete this item?',
									deletePlural:'Are you sure you would like to delete these {totalItems} items?'
								}
								.................................................................................

							EXAMPLE: From Array Type Records, With Extraneous Elements
								Because you can specify any index values for the =namePropertySTRorINT= and =valuePropertySTRorINT= parameters, you can use this facility to cherry pick the correct elements from array type name/value records, as in the following example...

								EXAMPLE
								..........................................................................
								Uize.Data.NameValueRecords.toHash (
									[
										[
											'us-english',
											'welcomeMessage',
											'Welcome, {firstName} of {state}, {country}'
										],
										[
											'us-english',
											'deleteSingular',
											'Are you sure you would like to delete this item?'
										],
										[
											'us-english',
											'deletePlural',
											'Are you sure you would like to delete these {totalItems} items?'
										]
									],
									1,
									2
								);
								..........................................................................

								In this example, the first element of every name/value record is an extraneous language code element. Now, if we didn't specify values for the optional =namePropertySTRorINT= and =valuePropertySTRorINT= parameters, then the returned hash object would be somewhat borked: there would be only one property, having the name =us-english=, and its value would be ='deletePlural'= (because the second element of the last name/value record would win out over the other records).

								What we need to do here is specify the value =1= and =2= for the =namePropertySTRorINT= and =valuePropertySTRorINT= parameters, respectively, to map the second element of each name/value record to the property name, and the third element to the property value, when mapping the name/value records to properties of the returned hash object. The above method call would produce the following result...

								OUTPUT
								.................................................................................
								{
									welcomeMessage:'Welcome, {firstName} of {state}, {country}',
									deleteSingular:'Are you sure you would like to delete this item?',
									deletePlural:'Are you sure you would like to delete these {totalItems} items?'
								}
								.................................................................................

							NOTES
							- see the companion =Uize.Data.NameValueRecords.fromHash= static method
				*/
			};

		return _package;
	}
});
