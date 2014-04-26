/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Data.Diff Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 1
	codeCompleteness: 100
	docCompleteness: 5
*/

/*?
	Introduction
		The =Uize.Data.Diff= module provides methods for comparing the contents of two data objects and reporting the differences.

		*DEVELOPERS:* `Chris van Rensburg`

		In a Nutshell
			The =Uize.Data.Diff= module makes it easy to compare two objects to determine how they differ.

			The =Uize.Data.Diff.diff= method accepts two objects are arguments, along with an optional `property comparer` function, and then compares those two objects and returns a `diff result`.

			Diff Result
				When the =Uize.Data.Diff.diff= method is used to compare two objects, it produces a diff result.

				The diff result is an object whose structure is based on a union of the structures of the two objects being compared. Depending on the `property comparer` function that is used when performing the diff, the diff result can be a complete or sparse union of the structurs of the objects being compared. The diff result can also be purely descriptive of the differences in properties between the objects being compared (eg. ='modified'=, ='added'=, ='removed'=, ='unchanged'=), or the diff result can be reflect actual values from the properties (values for only the properties that are the same, values for only the properties that are different, etc.).

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
				},
				..................

			Diffing is Recursive
				.

			Diffing Asymmetrical Objects
				.

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
					},
				}
				....................

			How Diffing is Performed
				.

			Property Comparer
				.

				Property Comparer Function

					A property comparer function should...

					- accept up to two `property profile` arguments
					- return a `property profile` as its return value

					Property Profile
						In the context of a `property comparer function`, a property profile is either...

						- an object, providing information on the name and value of the property
						- the value =undefined=, indicating that the property doesn't exist for the object

						When the property profile is an object value, it will be of the form...

						...............................................
						{
							key:keySTR,     // the name of the property
							value:valueSTR  // the value of the property
						}
						...............................................

					Returning a Property Profile
						.

					Value Comparison Result
						In the context of a `property comparer function`, a value comparison result is either...

						- the value =undefined=, indicating that no value should be placed into the diff result object for the current property being compared
						- an object, containing a =value= property that provides the value that should be placed into the diff result object for the current property being compared

				Default Property Comparer
					.

				Use Cases
					Finding Added or Modified Values
						.

					Getting the Difference Between Two Objects
						.

					Getting the Intersection Between Two Objects
						.

					Performing a Conditional Merge of Two Objects
						.

					Mapping Values for Leaf Nodes of an Object
						.

					Renaming Keys for Leaf Nodes of an Object
						.

					Conditional Merging of Two Objects
						.

					Blank or Initialized Clones
						.
*/

Uize.module ({
	name:'Uize.Data.Diff',
	builder:function () {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_isPlainObject = Uize.isPlainObject,
				_isEmpty = Uize.isEmpty,
				_undefined,

			/*** General Variables ***/
				_sacredEmpyObject = {}
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
			diff:function (_object1,_object2,_propertyComparer) {
				_propertyComparer || (_propertyComparer = _defaultPropertyComparer);
				var
					_object1PropertyProfile = {},
					_object2PropertyProfile = {}
				;
				function _compareNode (_object1,_object2) {
					var _result = {};
					for (var _property in Uize.copy (_object1,_object2)) {
						var
							_propertyComparisonResult,
							_object1PropertyValue = _object1 [_property],
							_object2PropertyValue = _object2 [_property]
						;
						if (_isPlainObject (_object1PropertyValue) || _isPlainObject (_object2PropertyValue)) {
							var _subNodeComparison = _compareNode (
								_object1PropertyValue || _sacredEmpyObject,
								_object2PropertyValue || _sacredEmpyObject
							);
							_propertyComparisonResult = _isEmpty (_subNodeComparison)
								? _undefined
								: {value:_subNodeComparison}
							;
						} else {
							var
								_propertyInObject1 = _property in _object1,
								_propertyInObject2 = _property in _object2
							;
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
								_propertyInObject2 ? _object2PropertyProfile : _undefined
							);
						}
						if (_propertyComparisonResult)
							_result ['key' in _propertyComparisonResult ? _propertyComparisonResult.key : _property] =
								_propertyComparisonResult.value
						;
					}
					return _result;
				}
				return _compareNode (_object1,_object2);
				/*?
					Static Methods
						Uize.Data.Diff.diff
							Performs a diff comparison between two objects, comparing all the corresponding leaf node properties, and reports the diff result as an object.

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
								In cases where the behavior of the `default property comparer` is not suitable, a custom `property comparer` function can be specified for the optional third argument.

								SYNTAX
								.................................................................................
								diffResultOBJ = Uize.Data.Diff.diff (object1OBJ,object2OBJ,propertyComparerFUNC);
								.................................................................................

								EXAMPLE
								.............................................
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
									function (obj1Prop,obj2Prop) {
										return obj1Prop ? undefined : obj2Prop;
									}
								);
								.............................................

								RESULT
								...............
								{
									foo:{
										baz:'baz'
									},
									qux:'qux'
								}
								...............

				*/
			}
		});
	}
});

