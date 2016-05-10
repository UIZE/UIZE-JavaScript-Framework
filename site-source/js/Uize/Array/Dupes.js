/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Array.Dupes Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2011-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 1
	codeCompleteness: 50
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
	required:'Uize.Data.Matches',
	builder:function () {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_true = true,
				_false = false,
				_undefined,
				_Uize = Uize,

			/*** General Variables ***/
				_objectTaggerValue = {}
		;

		/*** Utility Objects ***/
			var _ValueIndexer = Uize.mergeInto (
				function (_canonicalizer) {
					this._canonicalizer = _canonicalizer;
					this._valuesLookup = _Uize.lookup (_undefined,1,_true);
				},
				{
					prototype:{
						isIn:function (_value,_addToIfNot) {
							var
								m = this,
								_canonicalizer = m._canonicalizer,
								_canonicalizedValue = _canonicalizer ? _canonicalizer (_value) : _value,
								_wasIn = _false
							;
							if (
								_Uize.isPrimitive (_canonicalizedValue) ||
								!(_Uize.isObject (_canonicalizedValue) || _Uize.isFunction (_canonicalizedValue))
							) {
								var
									_typeofCanonicalizedValue = typeof _canonicalizedValue,
									_valuesLookup = m._valuesLookup
								;
								if (
									(_valuesLookup [_canonicalizedValue] || (_valuesLookup [_canonicalizedValue] = {})) [
										_typeofCanonicalizedValue
									]
								) {
									_wasIn = _true;
								} else if (_addToIfNot) {
									_valuesLookup [_canonicalizedValue] [_typeofCanonicalizedValue] = _true;
								}
							} else {
								if (_canonicalizedValue.tagged == _objectTaggerValue) {
									_wasIn = _true;
								} else if (_addToIfNot) {
									(m._taggedObjects || (m._taggedObjects = [])).push ({
										_object:_canonicalizedValue,
										_hadTaggedProperty:_canonicalizedValue.hasOwnProperty ('tagged'),
										_taggedPropertyOldValue:_canonicalizedValue.tagged
									});
									_canonicalizedValue.tagged = _objectTaggerValue;
								}
							}
							return _wasIn;
						},

						addTo:function (_value) {
							return !this.isIn (_value,_true);
						},

						cleanUp:function () {
							var _taggedObjects = this._taggedObjects;
							if (_taggedObjects) {
								for (
									var _taggedObjectNo = _taggedObjects.length, _taggedObject, _object;
									--_taggedObjectNo >= 0;
								) {
									_object = (_taggedObject = _taggedObjects [_taggedObjectNo])._object;
									_taggedObject._hadTaggedProperty
										? (_object.tagged = _taggedObject._taggedPropertyOldValue)
										: delete _object.tagged
									;
								}
							}
						}
					}
				}
			);

			function _removeOrRetainValues (_source,_valuesToRemove,_canonicalizer,_target,_retain) {
				var _valueIndexer = new _ValueIndexer (_canonicalizer);
				_Uize.forEach (
					_valuesToRemove,
					function (_valueToRemove) {_valueIndexer.isIn (_valueToRemove,_true)},
					0,
					_true
				);
				_target = _Uize.Data.Matches.retain (
					_source,function (_value) {return _valueIndexer.isIn (_value) == _retain},null,_target
				);
				_valueIndexer.cleanUp ();
				return _target;
			}

		return Uize.package ({
			dedupe:function (_source,_canonicalizer,_target) {
				_target = _source;
				var _valueIndexer = new _ValueIndexer (_canonicalizer);
				_target = _Uize.Data.Matches.remove (
					_source,function (_value) {return _valueIndexer.isIn (_value,_true)},null,_target
				);
				_valueIndexer.cleanUp ();
				return _target;
			},

			removeValues:function (_source,_valuesToRemove,_canonicalizer,_target) {
				return _removeOrRetainValues (_source,_valuesToRemove,_canonicalizer,_target,_false);
			},

			retainValues:function (_source,_valuesToRemove,_canonicalizer,_target) {
				return _removeOrRetainValues (_source,_valuesToRemove,_canonicalizer,_target,_true);
			}
		});
	}
});

