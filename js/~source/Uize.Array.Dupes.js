/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Array.Dupes Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2011-2012 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*ScruncherSettings Mappings="=" LineCompacting="TRUE"*/

/* Module Meta Data
	type: Package
	importance: 1
	codeCompleteness: 50
	testCompleteness: 0
	docCompleteness: 0
*/

/*?
	Introduction
		The =Uize.Array.Dupes= module provides functionality to deal with arrays containing duplicate values.

		*DEVELOPERS:* `Chris van Rensburg`

		### Key Features
			- high performance
				- linear time complexity (even when removing object reference duplicates)
				- can remove duplicates from source array, rather than always returning new array, and removes duplicates efficiently
			- supports strict type checking
			- supports object values
			- supports optional target
			- supports optional canonicalizer function, such as a lowercasing function for string values
*/

Uize.module ({
	name:'Uize.Array.Dupes',
	required:'Uize.Json',
	builder:function () {
		/*** Variables for Scruncher Optimization ***/
			var
				_package = function () {},
				_true = true,
				_false = false,
				_undefined
			;

		/*** General Variables ***/
			var _objectTaggerValue = {};

		/*** Public Static Methods ***/
			_package.dedupe = function (_source,_canonicalizer,_target) {
				/* TO DO
					- add support for removing values
						- basically uses the dedupe method, but valuesToRemove array is used to pre-populate the valuesLookup hash
					- support canonicalizers that can achieve the effect of loose type comparison
						- one approach for a simple canonicalizer to perform loose type deduping would canonicalize primitive type values to strings, and map both null and undefined to a nully value object stand-in object

							...............................
							var nullyValueStandin = {};
							function (value) {
								return (
									Uize.isPrimitive (value)
										? value + ''
										: Uize.isNully (value)
											? nullyValueStandin
											: value
								);
							}
							...............................

						- an alternative approach would allow a canonicalizer to return multiple equivalent canonical values
							- when the canonicalizer sees a number value, it would return the number value, the string serialization of the number, and the boolean equivalent of the number
							- when the canonicalizer sees a boolean value, it would return the number equivalent of the boolean, and the string serialization of the boolean
							- when the canonicalizer sees the value null, it would return the value null, the value 0, and the value undefined
							- problems with this approach are...
								- canonicalizers should be able to return array values, so how would a canonicalizer that is to return multiple values differentiate that intent from simply returning an array as a canonicalized result? Perhaps the canonicalizer would have to have a property on it to indicate that it uses this signature, so that the return value would not have to be overloaded.
								- if a canonicalizer could return multiple values, code that currently does the lookup and the insert would have to be wrapped in a loop to do multiple lookups and multiple inserts
				*/
				var
					_valuesLookup = Uize.lookup (_undefined,1,_true),
					_taggedObjects,
					_totalRemoved = 0
				;
				for (
					var
						_elementNo = -1,
						_sourceLength = _source.length,
						_elementValue,
						_canonicalizedValue,
						_typeofCanonicalizedValue,
						_removeValue
					;
					++_elementNo < _sourceLength;
				) {
					_removeValue = _false;
					_elementValue = _source [_elementNo];
					if (
						Uize.isPrimitive (
							_canonicalizedValue = _canonicalizer ? _canonicalizer (_elementValue) : _elementValue
						) ||
						!(Uize.isObject (_canonicalizedValue) || Uize.isFunction (_canonicalizedValue))
					) {
						if (
							(_valuesLookup [_canonicalizedValue] || (_valuesLookup [_canonicalizedValue] = {})) [
								_typeofCanonicalizedValue = typeof _canonicalizedValue
							]
						) {
							_removeValue = true;
						} else {
							_valuesLookup [_canonicalizedValue] [_typeofCanonicalizedValue] = _true;
						}
					} else {
						if (_canonicalizedValue.tagged == _objectTaggerValue) {
							_removeValue = true;
						} else {
							(_taggedObjects || (_taggedObjects = [])).push ({
								_object: _canonicalizedValue,
								_hadTaggedProperty: _canonicalizedValue.hasOwnProperty ('tagged'),
								_taggedPropertyOldValue: _canonicalizedValue.tagged
							});
							_canonicalizedValue.tagged = _objectTaggerValue;
						}
					}
					if (_removeValue) {
						_totalRemoved++;
					} else if (_totalRemoved) {
						_source [_elementNo - _totalRemoved] = _elementValue;
					}
				}
				_source.length -= _totalRemoved;
				if (_taggedObjects) {
					for (var _taggedObjectNo = _taggedObjects.length, _taggedObject, _object; --_taggedObjectNo >= 0;) {
						_object = (_taggedObject = _taggedObjects [_taggedObjectNo])._object;
						_taggedObject._hadTaggedProperty
							? (_object.tagged = _taggedObject._taggedPropertyOldValue)
							: delete _object.tagged
						;
					}
				}

				return _source;
			};

			_package.removeValues = function (_source,_valuesToRemove,_canonicalizer,_target) {
			};

			_package.retainValues = function (_source,_valuesToRemove,_canonicalizer,_target) {
			};

		return _package;
	}
});

