/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Data.Diff Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 1
	codeCompleteness: 100
	docCompleteness: 90
*/

/*?
	Introduction
		The =Uize.Data.Diff= module provides a way to compare all the leaf node properties of two data objects and report the property differences in the form of a `diff result` object.

		*DEVELOPERS:* `Chris van Rensburg`

		In a Nutshell
			The =Uize.Data.Diff= module makes it easy to compare two objects to determine how they differ.

			The =Uize.Data.Diff.diff= method accepts two objects are arguments, along with an optional `property comparer` function, and then compares all the leaf node properties of those two objects and returns a `diff result`.

			Diff Result
				When the =Uize.Data.Diff.diff= method is used to compare two objects, it produces a diff result.

				The diff result is an object whose structure is based on a union of the structures of the two objects being compared. Depending on the `property comparer` function that is used when performing the diff, the diff result can be a complete or sparse union of the structures of the objects being compared - it is not required that the diff result contain a property for every property that is compared.

				The diff result can also be purely descriptive of the differences in properties between the objects being compared (e.g. ='modified'=, ='added'=, ='removed'=, ='unchanged'=), or the diff result can reflect actual values from the properties (values for only the properties that are the same, values for only the properties that are different, etc.).

				The diff result object is best explained with an example...

				EXAMPLE
				......................
				Uize.Data.Diff.diff (
					// object 1
					{
						foo:'fooValue',
						bar:'barValue',
						qux:'quxValue'
					},

					// object 2
					{
						foo:'FOO_VALUE',
						baz:'bazValue',
						qux:'quxValue'
					}
				);
				......................

				RESULT
				..................
				{
					foo:'modified',
					bar:'removed',
					baz:'added',
					qux:'unchanged'
				}
				..................

				In the diff result object, you will notice that there are properties for all of the combined properties of both of the objects being compared. This is due to the behavior of the `default property comparer`, which sets the values of the properties in the diff result object as descriptions of how the properties differ between the objects being compared - there are values in the diff result for properties that have been added or removed (i.e. they don't exist in both objects).

			Diffing is Recursive
				When two objects are compared using the =Uize.Data.Diff.diff= method, the objects are compared recursively so that all leaf nodes are compared.

				EXAMPLE
				........................
				Uize.Data.Diff.diff (
					// object 1
					{
						foo:{
							bar:'barValue'
						},
						baz:{
							qux:'quxValue',
							hello:'world'
						}
					},

					// object 2
					{
						foo:{
							bar:'BAR_VALUE'
						},
						baz:{
							hello:'world',
							more:'stuff'
						}
					}
				);
				........................

				RESULT
				........................
				{
					foo:{
						bar:'modified'
					},
					baz:{
						qux:'removed',
						hello:'unchanged',
						more:'added'
					}
				}
				........................

			Diffing Asymmetrical Objects
				When two objects are compared using the =Uize.Data.Diff.diff= method, it is the union of the two objects that is compared recursively, so that all leaf nodes of both objects are compared.

				EXAMPLE
				........................
				Uize.Data.Diff.diff (
					// object 1
					{
						foo:{
							bar:'barValue',
							baz:'bazValue'
						},
						qux:'quxValue'
					},

					// object 2
					{
						bar:{
							foo:'fooValue',
							baz:'bazValue'
						},
						qux:'quxValue'
					}
				);
				........................

				RESULT
				....................
				{
					foo:{
						bar:'removed',
						baz:'removed'
					},
					qux:'unchanged',
					bar:{
						foo:'added',
						baz:'added'
					}
				}
				....................

			How Diffing is Performed
				Comparing two objects using the =Uize.Data.Diff.diff= method involves the following process...

				- The method itereates recursively over the union of the two objects being compared.
				- For each leaf node property, the method calls a `property comparer` function in order to compare the values of the property between the two objects.
				- The `property comparer` function is passed two `property profile` objects as arguments. These property profile objects describe the values of the property for each of the two objects being compared.
				- The property comparer function is expected to return a property profile object that describes the property that should be placed into the corresponding spot in the diff result object.

			Property Comparer
				The =Uize.Data.Diff.diff= method uses a `property comparer function` to compare the values of the leaf node property between the two objects being compared.

				Property Comparer Function
					A property comparer function should accept up to two `property profile` arguments, and should return a `property profile` as its result.

					Consider the following example of a property comparer function...

					EXAMPLE
					..............................................................................
					function (obj1PropProfile,obj2PropProfile) {
						return obj1PropProfile && !obj2PropProfile ? {value:'removed'} : undefined;
					}
					..............................................................................

					The property comparer function in the above example can be used with the =Uize.Data.Diff.diff= method to find only the properties that exist in the first object (=obj1PropProfile=) but that don't exist in the second object (=obj2PropProfile=).

					The function checks to see if the `property profile` for the property in the first object is truthy and falsy in the second object. If so, it returns a property profile with ='removed'= for the =value= property, which would result in the value ='removed'= being set for the corresponding property in the `diff result` object. Otherwise, it returns the value =undefined=, which would result in no property being added to the diff result object.

					So, this property comparer function can be used to find just the properties that have been "removed" between the first object and the second object. If the returned `diff result` object is empty, then no properties have neen removed. If the `diff result` object is *not* empty, then its contents will indicate which properties have been removed.

					Property Profile
						In the context of a `property comparer function`, a property profile is either...

						- an object, providing information on the name and value of the property
						- the value =undefined=, indicating that the property doesn't exist for one of the objects being compared, or shouldn't exist in the `diff result` object

						When the property profile is an object value, it will be of the form...

						...............................................
						{
							key:keySTR,     // the name of the property
							value:valueSTR  // the value of the property
						}
						...............................................

					Returning a Property Profile
						There are a few things to note about the `property profile` that is returned by the `property comparer function`...

						- If the value =undefined= is returned in place of a property profile object, then no property will be added to the `diff result` object for the property being compared.
						- You may return one of the property profile arguments, so a check can be used to determine if the value for property from the first object should be used or if the value for the property from the second object should be used for the value of the property in the `diff result`.
						- If a =key= property is present in the returned property profile object, its value will determine the name of the property in the diff result object - this makes it possible to perform key re-mapping / renaming when comparing two objects (see the example `Rename Keys for Leaf Nodes of an Object`).
						- When returning a new object, the =key= property may be omitted, in which case the property name will be the name of the property being compared and will not be re-mapped.

				Default Property Comparer
					When no value is specified for the optional =propertyComparerFUNC= third argument of the =Uize.Data.Diff.diff= method, the default `property comparer` function will be used.

					The default property comparer function produces a comparison result value for every property being compared. Each property in the `diff result` object can have one of the following possible values...

					- ='unchanged'= - the property exists in both of the objects being compared and the values are identical
					- ='modified'= - the property exists in both of the objects being compared, but the values differ
					- ='added'= - the property doesn't exist in the first object but does exist in the second object
					- ='removed'= - the property exists in the first object but does not exist in the second object

					The default property comparer is implemented as follows...

					.............................................................
					function (obj1PropProfile,obj2PropProfile) {
						return {
							value:obj1PropProfile && !obj2PropProfile
								? 'removed'
								: !obj1PropProfile && obj2PropProfile
									? 'added'
									: obj1PropProfile.value === obj2PropProfile.value
										? 'unchanged'
										: 'modified'
						};
					}
					.............................................................

				Examples of Property Comparer Functions
					The =Uize.Data.Diff.diff= method is extremely versatile and can be used with different types of `property comparer` functions to achieve a wide variety of different effects.

					Find Added or Modified Values
						In order to obtain the values for all properties that have been added or modified in the second object, the following `property comparer function` can be used...

						..............................................................................................
						function (obj1PropProfile,obj2PropProfile) {
							return (
								obj2PropProfile && (!obj1PropProfile || obj2PropProfile.value !== obj1PropProfile.value)
									? obj2PropProfile
									: undefined
							);
						}
						..............................................................................................

					Get a Summary of Just the Differences
						In order to obtain a summary of just the differences between two objects, the following `property comparer function` can be used...

						.............................................................
						function (obj1PropProfile,obj2PropProfile) {
							return {
								obj1PropProfile && !obj2PropProfile
									? {value:'removed'}
									: !obj1PropProfile && obj2PropProfile
										? {value:'added'}
										: obj1PropProfile.value === obj2PropProfile.value
											? undefined
											: {value:'modified'}
							};
						}
						.............................................................

						If the above `property compater function` is used when comparing two objects and the object returned by the =Uize.Data.Diff.diff= method is empty, then the objects being compared can be considered identical.

					Get a Summary of Structural Differences
						In order to obtain a summary of just the structural differences between two objects, the following `property comparer function` can be used...

						..............................................
						function (obj1PropProfile,obj2PropProfile) {
							return {
								obj1PropProfile && !obj2PropProfile
									? {value:'removed'}
									: !obj1PropProfile && obj2PropProfile
										? {value:'added'}
										: undefined
							};
						}
						..............................................

						If the above `property compater function` is used when comparing two objects and the object returned by the =Uize.Data.Diff.diff= method is empty, then the objects being compared can be considered to have identical structure - even if the values of the properties may differ between the two objects.

					Get a Summary of Structural and Type Differences
						In order to obtain a summary of just the structural and type differences between two objects, the following `property comparer function` can be used...

						...........................................................................
						function (obj1PropProfile,obj2PropProfile) {
							return {
								obj1PropProfile && !obj2PropProfile
									? {value:'removed'}
									: !obj1PropProfile && obj2PropProfile
										? {value:'added'}
										: typeof obj1PropProfile.value !== typeof obj2PropProfile.value
											? {value:'type mismatch'}
											: undefined
							};
						}
						...........................................................................

						If the above `property compater function` is used when comparing two objects and the object returned by the =Uize.Data.Diff.diff= method is empty, then the objects being compared can be considered to have identical structure and type. This can be a useful way of testing if an object conforms to the structure and type requirements of some reference object.

					Get the Intersection Between Two Objects
						In order to obtain the values for all properties that are identical in the objects being compared, the following `property comparer function` can be used...

						...........................................................................................
						function (obj1PropProfile,obj2PropProfile) {
							return (
								obj1PropProfile && obj2PropProfile && obj1PropProfile.value === obj2PropProfile.value
									? obj1PropProfile
									: undefined
							);
						}
						...........................................................................................

					Perform a Conditional Merge
						In order to conditionally merge all properties of a second object with all properties of a first object, so that a property from the second object is only merged in if it doesn't exist in the first object, the following `property comparer function` can be used...

						.............................................
						function (obj1PropProfile,obj2PropProfile) {
							return obj1PropProfile || obj2PropProfile;
						}
						.............................................

						EXAMPLE
						................................................
						Uize.Data.Diff.diff (
							{
								foo:'foo',
								bar:{
									baz:'baz'
								}
							},
							{
								foo:'FOO',
								bar:{
									baz:'BAZ',
									qux:'QUX'
								}
							},
							function (obj1PropProfile,obj2PropProfile) {
								return obj1PropProfile || obj2PropProfile;
							}
						);
						................................................

						RESULT
						................
						{
							foo:'foo',
							bar:{
								baz:'baz',
								qux:'QUX'
							}
						}
						................

					Create an Initialized Clone of an Object
						The =Uize.Data.Diff.diff= method can be used in a less conventional way to create an initialized clone of a source object using the following approach...

						EXAMPLE
						..................................
						Uize.Data.Diff.diff (
							{
								foo:'foo',
								bar:{baz:{qux:'qux'}}
							},
							{},
							function () {return {value:''}}
						);
						..................................

						RESULT
						.....................
						{
							foo:'',
							bar:{baz:{qux:''}}
						}
						.....................

					Iterate Recursively Over the Leaf Nodes of an Object
						The =Uize.Data.Diff.diff= method can be used to recursively iterate over all the leaf nodes of an object.

						EXAMPLE
						...............................................................
						Uize.Data.Diff.diff (
							sourceObj,  // the object you wish to iterate over
							{},         // specify an empty object for the second object
							function (propertyProfile) {
								// do something for each leaf node
							}
						);
						...............................................................

						When using the =Uize.Data.Diff.diff= method as essentially an object iterator, the first argument can be used for specifying the object you wish to iterate over, and an empty object can be specified for the second object.

						Then, in the `property comparer function` that you specify, the information about the leaf node property currently being iterated over can be accessed from the first `property profile` argument, and the second argument can be ignored.

					Map Values for Leaf Nodes of an Object
						The =Uize.Data.Diff.diff= method can be used to map values for all the leaf nodes of an object.

						EXAMPLE
						..................................................................
						var remappedValuesObj = Uize.Data.Diff.diff (
							sourceObj,  // the object you wish to iterate over
							{},         // specify an empty object for the second object
							function (propertyProfile) {
								// modify the value property of the propertyProfile argument
								return propertyProfile;
							}
						);
						..................................................................

						When using the =Uize.Data.Diff.diff= method as a value mapper for object properties, the first argument can be used for specifying the object you wish to map, and an empty object can be specified for the second object.

						Then, in the `property comparer function` that you specify, the information about the leaf node property currently being iterated over can be accessed from the first `property profile` argument, and the second argument can be ignored. In order to map the value for a property, simply modify the =value= property of the property profile object and return this modified object as the result.

						EXAMPLE
						...................................................................
						Uize.Data.Diff.diff (
							{
								foo:'foo',
								bar:{baz:{qux:'qux'}}
							},
							{},
							function (propertyProfile) {
								propertyProfile.value = propertyProfile.value.toUpperCase ();
								return propertyProfile;
							}
						);
						...................................................................

						RESULT
						........................
						{
							foo:'FOO',
							bar:{baz:{qux:'QUX'}}
						}
						........................

					Rename Keys for Leaf Nodes of an Object
						The =Uize.Data.Diff.diff= method can be used to rename keys for all the leaf nodes of an object.

						EXAMPLE
						................................................................
						var renamedKeysObj = Uize.Data.Diff.diff (
							sourceObj,  // the object you wish to iterate over
							{},         // specify an empty object for the second object
							function (propertyProfile) {
								// modify the key property of the propertyProfile argument
								return propertyProfile;
							}
						);
						................................................................

						When using the =Uize.Data.Diff.diff= method as a key renamer for object leaf node properties, the first argument can be used for specifying the source object, and an empty object can be specified for the second object.

						Then, in the `property comparer function` that you specify, the information about the leaf node property currently being iterated over can be accessed from the first `property profile` argument, and the second argument can be ignored. In order to rename the key for a property, simply modify the =key= property of the property profile object and return this modified object as the result.

						EXAMPLE
						...............................................................
						Uize.Data.Diff.diff (
							{
								foo:'foo',
								bar:{baz:{qux:'qux'}}
							},
							{},
							function (propertyProfile) {
								propertyProfile.key = propertyProfile.key.toUpperCase ();
								return propertyProfile;
							}
						);
						...............................................................

						RESULT
						........................
						{
							FOO:'foo',
							bar:{baz:{QUX:'qux'}}
						}
						........................

						Notice from the above example that not all keys have been renamed - only the keys for the leaf node properties. This is because the `property comparer function` is only called for leaf node properties.

				### Basing Comparison Type on Key Name
					.

				### Recursive Arithmetic Processes
					Sum the Leaf Node Properties of Two Objects
						.

					Obtain the Max Values of the Leaf Node Properties of Two Objects
						.

				### Removing one Object from Another
					.

			### Diffing Options
				### Getting Just the Skeleton of an Object
					.

				### Getting the Skeleton of the Union of Two Objects
					.
*/

Uize.module ({
	name:'Uize.Data.Diff',
	builder:function () {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_isPlainObject = Uize.isPlainObject,
				_isArray = Uize.isArray,
				_isEmpty = Uize.isEmpty,
				_canExtend = Uize.canExtend,
				_undefined,

			/*** General Variables ***/
				_sacredEmptyObject = {},
				_sacredEmptyArray = []
		;

		/*** Utility Functions ***/
			function _defaultPropertyComparer (_object1Property,_object2Property) {
				return {
					value:_object1Property && !_object2Property
						? 'removed'
						: !_object1Property && _object2Property
							? 'added'
							: _object1Property.value === _object2Property.value
								? 'unchanged'
								: 'modified'
				};
			}

		return Uize.package ({
			diff:function (_object1,_object2,_propertyComparer,_options) {
				_propertyComparer || (_propertyComparer = _defaultPropertyComparer);
				_options || (_options = _sacredEmptyObject);
				var
					_path = [],
					_object1PropertyProfile = {},
					_object2PropertyProfile = {},
					_skeleton = _options.skeleton,
					_dual = _options.dual !== false
				;
				function _compareNode (_object1,_object2) {
					var
						_level = _path.length,
						_object1IsExtensible = _canExtend (_object1),
						_object2IsExtensible = _canExtend (_object2)
					;
					function _compareProperty (_property) {
						_path [_level] = _property;
						var
							_propertyComparisonResult,
							_object1PropertyValue = _object1 [_property],
							_object2PropertyValue = _object2 [_property],
							_object2PropertyValueIsPlainObject = _isPlainObject (_object2PropertyValue)
						;
						if (_isPlainObject (_object1PropertyValue) || (_object2PropertyValueIsPlainObject && _dual)) {
							var _subNodeComparison = _compareNode (
								_object1PropertyValue || _sacredEmptyObject,
								((_dual || _object2PropertyValueIsPlainObject) && _object2PropertyValue) || _sacredEmptyObject
							);
							_propertyComparisonResult = !_isEmpty (_subNodeComparison)
								? {value:_subNodeComparison}
								: _skeleton ? {value:{}} : _undefined
							;
						} else {
							var
								_propertyInObject1 = _object1IsExtensible && (_property in _object1),
								_propertyInObject2 = _object2IsExtensible && (_property in _object2),
								_object1PropertyValueIsArray = _propertyInObject1 && _isArray (_object1PropertyValue),
								_object2PropertyValueIsArray = _propertyInObject2 && _isArray (_object2PropertyValue)
							;
							if (
								_dual
									?
										(_object1PropertyValueIsArray || !_propertyInObject1) &&
										(_object2PropertyValueIsArray || !_propertyInObject2)
									: _object1PropertyValueIsArray
							) {
								var _subNodeComparison = _compareNode (
									_object1PropertyValue || _sacredEmptyArray,
									((_dual || _object2PropertyValueIsArray) && _object2PropertyValue) || _sacredEmptyArray
								);
								_propertyComparisonResult = !_isEmpty (_subNodeComparison)
									? {value:_subNodeComparison}
									: _skeleton ? {value:[]} : _undefined
								;
							} else {
								if (_propertyInObject1) {
									_object1PropertyProfile.key = _property;
									_object1PropertyProfile.value = _object1PropertyValue;
								}
								if (_propertyInObject2) {
									_object2PropertyProfile.key = _property;
									_object2PropertyProfile.value = _object2PropertyValue;
								}
								_propertyComparisonResult = _propertyComparer (
									_propertyInObject1 ? _object1PropertyProfile : _undefined,
									_propertyInObject2 ? _object2PropertyProfile : _undefined,
									_path
								);
							}
						}
						if (_propertyComparisonResult)
							_result ['key' in _propertyComparisonResult ? _propertyComparisonResult.key : _property] =
								_propertyComparisonResult.value
						;
					}
					if (_isPlainObject (_object1) || (_isPlainObject (_object2) && _dual)) {
						var _result = {};
						for (var _property in _dual ? Uize.copy (_object1,_object2) : _object1)
							_compareProperty (_property)
						;
					} else {
						var _result = [];
						for (
							var _elementNo = -1, _totalElements = Math.max (_object1.length,_dual * _object2.length);
							++_elementNo < _totalElements;
						) {
							_compareProperty (_elementNo);
						}
					}
					_path.length = _level;
					return _result;
				}
				return _compareNode (_object1,_object2);
				/*?
					Static Methods
						Uize.Data.Diff.diff
							Performs a diff between two objects, comparing all the corresponding leaf node properties, and reports the difference in the form of a `diff result` object.

							DIFFERENT USAGES

							`Diff Two Objects, Using the Default Property Comparer`
							............................................................
							diffResultOBJ = Uize.Data.Diff.diff (object1OBJ,object2OBJ);
							............................................................

							`Diff Two Objects, Using a Custom Property Comparer`
							.................................................................................
							diffResultOBJ = Uize.Data.Diff.diff (object1OBJ,object2OBJ,propertyComparerFUNC);
							.................................................................................

							Diff Two Objects, Using the Default Property Comparer
								In its most basic usage, two objects can be compared using the `default property comparer` by specifying just the two objects to be compared as arguments.

								SYNTAX
								............................................................
								diffResultOBJ = Uize.Data.Diff.diff (object1OBJ,object2OBJ);
								............................................................

								When the `default property comparer` is used, the result returned by this method is an object that represents the union between the two objects being compared, and where the value of each leaf node describes the difference, for the corresponding property, between the two objects.

								EXAMPLE
								.....................
								Uize.Data.Diff.diff (
									{
										foo:'foo',
										bar:'bar',
										baz:'baz'
									},
									{
										foo:'foo',
										bar:'BAR',
										qux:'qux'
									}
								);
								.....................

								RESULT
								...................
								{
									foo:'unchanged',
									bar:'modified',
									baz:'removed',
									qux:'added'
								}
								...................

								For a more in-depth discussion, see the section on the `default property comparer`.

							Diff Two Objects, Using a Custom Property Comparer
								In cases where the behavior of the `default property comparer` is not suitable, a custom `property comparer function` can be specified for the optional third argument.

								SYNTAX
								.................................................................................
								diffResultOBJ = Uize.Data.Diff.diff (object1OBJ,object2OBJ,propertyComparerFUNC);
								.................................................................................

								EXAMPLE
								...........................................................
								Uize.Data.Diff.diff (
									{
										foo:{
											bar:'bar'
										}
									},
									{
										foo:{
											bar:'bar',
											baz:'baz'
										},
										qux:'qux'
									},
									function (obj1PropProfile,obj2PropProfile) {
										return obj1PropProfile ? undefined : obj2PropProfile;
									}
								);
								...........................................................

								In the above example, the =Uize.Data.Diff.diff= method is being used with a custom `property comparer function` to return an object that contains the values of only the properties that are "added" in the second object - in other words, properties that exist in the second object that don't exist in the first object.

								The implementation of this custom property comparer function is quite straightforward: the function returns =undefined= if a property exists in the first object - otherwise, it returns the profile for the property from the second object. When the function returns =undefined=, no property is added to the resulting diff result object. But, when the function returns the profile for the property from the second object, then the value of the property in the second object is added to the diff result object.

								This means that the diff result object will only contain leaf node properties for properties that exist in the second object and that do not exist in the first, and the value for the properties in the diff result object will be the values of the "added" properties in the second object. From our above example we would, therefore, obtain the following result...

								RESULT
								...............
								{
									foo:{
										baz:'baz'
									},
									qux:'qux'
								}
								...............

							Diff Two Objects, Specifying Additional Diffing Options
								In cases where the standard behavior of this method is not suitable, its behavior can be customized by specifying values for options through the optional =optionsOBJ= fourth argument.

								SYNTAX
								............................................................................................
								diffResultOBJ = Uize.Data.Diff.diff (object1OBJ,object2OBJ,propertyComparerFUNC,optionsOBJ);
								............................................................................................

								Because the options are specified through the fourth argument, this means that the =propertyComparerFUNC= third argument must necessarily be specified in this usage. Therefore, if you wish to use the `default property comparer` with this usage you should specify the value =null= or =undefined= for the =propertyComparerFUNC= argument.

								optionsOBJ
									The value specified for the =optionsOBJ= argument should be an object of the form...

									OPTIONS
									......................................................................................
									{
										skeleton:skeletonBOOL  // whether or not a skeleton should be returned at a minimum
									}
									......................................................................................

									skeleton
										A boolean, specifying whether or not a structural skeleton will be returned at a minimum when two objects are compared that either have empty nodes or where the `property comparer` function returns =undefined= for all compared properties.

										- When the value =true= is specified for the =skeleton= option, then the returned comparison result will at a minimum be a skeleton object that is the union of the structures of the two objects being compared.
										- When the value =false= is specified for the =skeleton= option, then the returned comparison result will not contain empty nodes in which there are no property comparison values.
										- When no value is specified for the =skeleton= option, or if the =optionsOBJ= argument is omitted, then the value for the =skeleton= option is defaulted to =false=.

										EXAMPLE
										..............................................
										Uize.Data.Diff.diff (
											{
												address:{
													mailing:{
														line1:'123 Strange Blvd',
														line2:'Apt 6',
														city:'Strangeville',
														state:'CA',
														zip:'12345'
													}
												},
												contact:{
													phoneNumbers:{
														home:'(555) 123-4567',
														cell:'(555) 555-5555',
														work:'(555) 999-9999'
													}
												}
											},
											{
												address:{
													shipping:{
														line1:'456 Work Plaze',
														line2:'Suite 400',
														city:'Workville',
														state:'CA',
														zip:'67890'
													}
												},
												contact:{
													other:{
														email:'misterstrange@strange.net',
														IRC:'mstrange'
													}
												}
											},
											function () {return undefined},
											{skeleton:true}
										);
										..............................................

										In the above example, two objects are being compared that have similar but slightly differing structures. The custom `property comparer` function that is being specified always returns the value =undefined=. Normally, this would mean that the comparison result object would be empty. But, because the value =true= is being specified for the =skeleton= option, the method returns a skeleton object that is the union of the structures of the two objects being compared, as shown below...

										RESULT
										......................
										{
											address:{
												mailing:{},
												shipping:{}
											},
											contact:{
												phoneNumbers:{},
												other:{}
											}
										}
										......................
				*/
			}
		});
	}
});

