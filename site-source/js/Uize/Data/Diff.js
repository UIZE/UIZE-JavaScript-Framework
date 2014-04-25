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

				The diff result is an object whose structure is based on a union of the structures of the two objects being compared. Depending on the `property comparer` function that is used when performing the diff, the diff result can be a complete or sparse union of the structurs of the objects being compared.

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

					A property comparer function must...

					- accept two `value descriptor` arguments
					- return a `value comparison result`

					Value Descriptor
						In the context of a `property comparer function`, a value descriptor is either...

						- an object, containing a =value= property that provides the value of the property for the object
						- the value =undefined=, indicating that the property is missing for the object

					Value Comparison Result
						In the context of a `property comparer function`, a value comparison result is either...

						- an object, containing a =value= property that provides the value that should be placed into the diff result object for the current property being compared
						- the value =undefined=, indicating that no value should be placed into the diff result object for the current property being compared

				Default Property Comparer
					.

				Finding Added or Modified Values
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
					_object1PropertyInfo = {},
					_object2PropertyInfo = {}
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
								_object1PropertyInfo.key = _property;
								_object1PropertyInfo.value = _object1PropertyValue;
							}
							if (_propertyInObject2) {
								_object2PropertyInfo.key = _property;
								_object2PropertyInfo.value = _object2PropertyValue;
							}
							_propertyComparisonResult = _propertyComparer (
								_propertyInObject1 ? _object1PropertyInfo : _undefined,
								_propertyInObject2 ? _object2PropertyInfo : _undefined
							);
						}
						if (_propertyComparisonResult)
							_result [_property] = _propertyComparisonResult.value
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
								SYNTAX
								............................................................
								diffResultOBJ = Uize.Data.Diff.diff (object1OBJ,object2OBJ);
								............................................................

							Diff Two Objects, Using a Custom Property Comparer
								SYNTAX
								.................................................................................
								diffResultOBJ = Uize.Data.Diff.diff (object1OBJ,object2OBJ,propertyComparerFUNC);
								.................................................................................
				*/
			}
		});
	}
});

