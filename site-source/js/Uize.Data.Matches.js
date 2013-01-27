/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Data.Matches Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2012-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 2
	codeCompleteness: 100
	docCompleteness: 5
*/

/*?
	Introduction
		The =Uize.Data.Matches= module provides methods for finding matching elements in arrays or matching properties in objects.

		*DEVELOPERS:* `Chris van Rensburg`

		In a Nutshell
			The =Uize.Data.Matches= module provides methods for performing the following types of matching operations...

			- `iterating over matches`
			- `removing or retaining matches`
			- `counting matches`
			- `getting the keys or values for all matches`
			- `getting the key or value of the first match`

			Iterating Over Matches
				To make it easy to iterate over matches in a source array, object, or range, the =Uize.Data.Matches= module provides the =Uize.Data.Matches.forEach= static method.

				The =Uize.Data.Matches.forEach= method can be used to `iterate over matching elements of an array`, `iterate over matching properties of an object`, or `iterate over matching values of a range`. In its most basic usage, the =Uize.Data.Matches.forEach= method lets you specify a source, a matcher, and an iterator.

				TYPICAL USAGE
				..............................................................................................
				Uize.Data.Matches.forEach (sourceARRAYorOBJorINT,matcherFUNCorSTRorREGEXPorBOOL,iteratorFUNC);
				..............................................................................................

				EXAMPLE
				...
				Uize.Data.Matches.forEach (
				);
				...

				The =Uize.Data.Matches.forEach= method is versatile and supports a number of different usages. For more in-depth info, consult the method's [[Uize.Data.Matches.forEach][reference documentation]].

			Removing or Retaining Matches
				The =Uize.Data.Matches= module offers methods for processing an array, object, or range, and either removing or retaining matches.

				The =Uize.Data.Matches.remove= method can be used to remove matches, while the =Uize.Data.Matches.retain= method can be used to retain matches.

				Both of these methods support...

				- processing a source array, object, or range (see `Specifying a Source`)
				- finding matches by value and/or key/index (see `Specifying a Matcher`)
				- removing or retaining a maximum number of matches (see `Limiting the Number of Matches`)
				- modifying the original source or outputting the result to a newly created or specified target (see `Specifying a Target`)

				Removing Matches
					Matches can be removed from an array, object, or number range, using the =Uize.Data.Matches.remove= method.

					TYPICAL USAGE
					.............................................................................................
					var result = Uize.Data.Matches.remove (sourceARRAYorOBJorINT,matcherFUNCorSTRorREGEXPorBOOL);
					.............................................................................................

					EXAMPLE
					..............................................................................
					var sparseArray = [];
					sparseArray [1] = 'orange';
					sparseArray [5] = 'peach';
					sparseArray [8] = 'apple';
					sparseArray [11] = 'pear';

					var denseArray = Uize.Data.Matches.remove (sparseArray,'value === undefined'};
					alert (denseArray.join ('|')); // alerts the text "orange|peach|apple|pear"
					..............................................................................

					In the above example, the sparsely populated array named =sparseArray= is being created and populated with four elements. There are gaps between the assigned elements of =sparseArray=, and the elements in these gaps will all have the value =undefined=. The =Uize.Data.Matches.remove= method is being used to produce a densely populated array from the =sparseArray= by removing every element whose value is =undefined=. You'll notice that we're `matching items using a value matcher regular expression` rather than a function. This is nice and concise.

					The =Uize.Data.Matches.remove= method is versatile and supports a number of different usages. For more in-depth info, consult the method's [[Uize.Data.Matches.remove][reference documentation]].

				Retaining Matches
					.

					EXAMPLE
					...
					...

			Counting Matches
				.

				EXAMPLE
				...
				...

			Getting the Keys or Values of All Matches
				documnt...

				EXAMPLE
				...
				...

			Getting the Key or Value of the First Match
				.

				EXAMPLE
				...
				...

			Specifying a Source
				.

				Specifying an Array Source
					.

				Specifying an Object Source
					.

				Specifying a Range Source
					.

			Specifying a Matcher
				.

				Matching Items Using a Matcher Function
					.

				Matching Items Using a Matcher Expression String
					.

				Matching Items Using a Value Matcher Regular Expression
					.

				Matching All Items
					.

				Matching No Items
					.

				Matching by Value
					.

				Matching by Key / Index
					.

				Matching by Key and Value
					.

			Limiting the Number of Matches
				.

			Specifying a Target
				.
*/

Uize.module ({
	name:'Uize.Data.Matches',
	builder:function () {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_package = function () {},
				_true = true,
				_false = false,
				_undefined,
				_Uize = Uize,
				_resolveMatcher = _Uize.resolveMatcher
			;

		/*** Public Static Methods ***/
			_package.forEach = function (_source,_matcher,_iterator,_maxMatches) {
				if (_maxMatches == _undefined)
					_maxMatches = Infinity
				;
				if (_maxMatches > 0) {
					_matcher = _resolveMatcher (_matcher);
					var _totalMatches = 0;
					_Uize.forEach (
						_source,
						function (_value,_key) {
							if (_totalMatches < _maxMatches && _matcher (_value,_key)) {
								_totalMatches++;
								_iterator (_value,_key);
							}
						},
						0,
						_true
					);
				}
				/*?
					Static Methods
						Uize.Data.Matches.forEach
							Iterates over elements in the specified source array, or properties in the specified source object, or values in the specified source range, that match the specified matching criteria.

							DIFFERENT USAGES

							`Iterate Over Matching Elements of an Array`
							....................................................................................
							Uize.Data.Matches.forEach (sourceARRAY,matcherFUNCorSTRorREGEXPorBOOL,iteratorFUNC);
							....................................................................................

							`Iterate Over Matching Properties of an Object`
							..................................................................................
							Uize.Data.Matches.forEach (sourceOBJ,matcherFUNCorSTRorREGEXPorBOOL,iteratorFUNC);
							..................................................................................

							`Iterate Over Matching Values of a Range`
							..................................................................................
							Uize.Data.Matches.forEach (sourceINT,matcherFUNCorSTRorREGEXPorBOOL,iteratorFUNC);
							..................................................................................

							`Iterate Over up to a Maximum Number of Matches`
							..................................................................................
							Uize.Data.Matches.forEach (
								sourceARRAYorOBJorINT,matcherFUNCorSTRorREGEXPorBOOL,iteratorFUNC,maxMatchesINT
							);
							..................................................................................

							`Iterate Over All of the Items of a Source`
							.........................................................................................
							Uize.Data.Matches.forEach (sourceARRAYorOBJorINT,true,iteratorFUNC);
							Uize.Data.Matches.forEach (sourceARRAYorOBJorINT,null,iteratorFUNC);
							Uize.Data.Matches.forEach (sourceARRAYorOBJorINT,undefined,iteratorFUNC);
							Uize.Data.Matches.forEach (sourceARRAYorOBJorINT,function () {return true},iteratorFUNC);
							Uize.Data.Matches.forEach (sourceARRAYorOBJorINT,Uize.returnTrue,iteratorFUNC);
							Uize.Data.Matches.forEach (sourceARRAYorOBJorINT,'true',iteratorFUNC);
							.........................................................................................

							`Iterate Over None of the Items of a Source`
							..........................................................................................
							Uize.Data.Matches.forEach (sourceARRAYorOBJorINT,false,iteratorFUNC);
							Uize.Data.Matches.forEach (sourceARRAYorOBJorINT,function () {return false},iteratorFUNC);
							Uize.Data.Matches.forEach (sourceARRAYorOBJorINT,Uize.returnFalse,iteratorFUNC);
							Uize.Data.Matches.forEach (sourceARRAYorOBJorINT,'false',iteratorFUNC);
							..........................................................................................

							Iterate Over Matching Elements of an Array
								In a typical use case, this method can be used to iterate over matching elements of an array by specifying an array as the first parameter.

								SYNTAX
								....................................................................................
								Uize.Data.Matches.forEach (sourceARRAY,matcherFUNCorSTRorREGEXPorBOOL,iteratorFUNC);
								....................................................................................

							Iterate Over Matching Properties of an Object
								SYNTAX
								..................................................................................
								Uize.Data.Matches.forEach (sourceOBJ,matcherFUNCorSTRorREGEXPorBOOL,iteratorFUNC);
								..................................................................................

							Iterate Over Matching Values of a Range
								SYNTAX
								..................................................................................
								Uize.Data.Matches.forEach (sourceINT,matcherFUNCorSTRorREGEXPorBOOL,iteratorFUNC);
								..................................................................................

							Iterate Over up to a Maximum Number of Matches
								SYNTAX
								..................................................................................
								Uize.Data.Matches.forEach (
									sourceARRAYorOBJorINT,matcherFUNCorSTRorREGEXPorBOOL,iteratorFUNC,maxMatchesINT
								);
								..................................................................................

							Iterate Over All of the Items of a Source
								SYNTAX
								.........................................................................................
								Uize.Data.Matches.forEach (sourceARRAYorOBJorINT,true,iteratorFUNC);
								Uize.Data.Matches.forEach (sourceARRAYorOBJorINT,null,iteratorFUNC);
								Uize.Data.Matches.forEach (sourceARRAYorOBJorINT,undefined,iteratorFUNC);
								Uize.Data.Matches.forEach (sourceARRAYorOBJorINT,function () {return true},iteratorFUNC);
								Uize.Data.Matches.forEach (sourceARRAYorOBJorINT,Uize.returnTrue,iteratorFUNC);
								Uize.Data.Matches.forEach (sourceARRAYorOBJorINT,'true',iteratorFUNC);
								.........................................................................................

							Iterate Over None of the Items of a Source
								SYNTAX
								..........................................................................................
								Uize.Data.Matches.forEach (sourceARRAYorOBJorINT,false,iteratorFUNC);
								Uize.Data.Matches.forEach (sourceARRAYorOBJorINT,function () {return false},iteratorFUNC);
								Uize.Data.Matches.forEach (sourceARRAYorOBJorINT,Uize.returnFalse,iteratorFUNC);
								Uize.Data.Matches.forEach (sourceARRAYorOBJorINT,'false',iteratorFUNC);
								..........................................................................................

				*/
			};

			function _filter (_source,_matcher,_maxMatches,_target,_remove) {
				var
					_sourceIsNumber = typeof _source == 'number',
					_sourceActsLikeArray = _sourceIsNumber || _Uize.isArray (_source)
				;
				if (_maxMatches == _undefined)
					_maxMatches = Infinity
				;
				if (typeof _target != 'object')
					_target = _sourceIsNumber
						? []
						: _target === _false
							? _source
							: _sourceActsLikeArray ? [] : {}
				;
				var
					_targetIsArray = _Uize.isArray (_target),
					_totalRemoved = 0,
					_targetLength = 0
				;
				if (!_targetIsArray) {
					if (_target == _source)
						_source = _Uize.copyInto ({},_target)
					;
					_Uize.emptyOut (_target);
				}
				if (_remove) {
					var _resolvedMatcher = _resolveMatcher (_matcher);
					_matcher = function (_value,_key) {
						var _mustRemove = _totalRemoved < _maxMatches && _resolvedMatcher (_value,_key);
						_mustRemove && _totalRemoved++;
						return !_mustRemove;
					};
				}
				_package.forEach (
					_source,
					_matcher,
					function (_value,_key) {_target [_sourceActsLikeArray ? _targetLength++ : _key] = _value},
					_remove ? _undefined : _maxMatches
				);
				if (_sourceActsLikeArray || _targetIsArray)
					_target.length = _targetLength
				;
				return _target;
			}

			_package.remove = function (_source,_matcher,_maxMatches,_target) {
				return _filter (_source,_matcher,_maxMatches,_target,_true);
				/*?
					Static Methods
						Uize.Data.Matches.remove
							Removes elements in the specified source array, or properties in the specified source object, or values in the specified source range, that match the specified matching criteria.

							DIFFERENT USAGES

							`Remove All Matching Elements of an Array`
							....................................................................................
							Uize.Data.Matches.remove (sourceARRAY,matcherFUNCorSTRorREGEXPorBOOL,iteratorFUNC);
							....................................................................................

							`Remove All Matching Properties of an Object`
							..................................................................................
							Uize.Data.Matches.remove (sourceOBJ,matcherFUNCorSTRorREGEXPorBOOL,iteratorFUNC);
							..................................................................................

							`Remove All Matching Values of a Range`
							..................................................................................
							Uize.Data.Matches.remove (sourceINT,matcherFUNCorSTRorREGEXPorBOOL,iteratorFUNC);
							..................................................................................

							`Remove up to a Maximum Number of Matches`
							..................................................................................
							Uize.Data.Matches.remove (
								sourceARRAYorOBJorINT,matcherFUNCorSTRorREGEXPorBOOL,iteratorFUNC,maxMatchesINT
							);
							..................................................................................

							`Remove All of the Items of a Source`
							.........................................................................................
							Uize.Data.Matches.remove (sourceARRAYorOBJorINT,true,iteratorFUNC);
							Uize.Data.Matches.remove (sourceARRAYorOBJorINT,null,iteratorFUNC);
							Uize.Data.Matches.remove (sourceARRAYorOBJorINT,undefined,iteratorFUNC);
							Uize.Data.Matches.remove (sourceARRAYorOBJorINT,function () {return true},iteratorFUNC);
							Uize.Data.Matches.remove (sourceARRAYorOBJorINT,Uize.returnTrue,iteratorFUNC);
							Uize.Data.Matches.remove (sourceARRAYorOBJorINT,'true',iteratorFUNC);
							.........................................................................................

							`Remove None of the Items of a Source`
							..........................................................................................
							Uize.Data.Matches.remove (sourceARRAYorOBJorINT,false,iteratorFUNC);
							Uize.Data.Matches.remove (sourceARRAYorOBJorINT,function () {return false},iteratorFUNC);
							Uize.Data.Matches.remove (sourceARRAYorOBJorINT,Uize.returnFalse,iteratorFUNC);
							Uize.Data.Matches.remove (sourceARRAYorOBJorINT,'false',iteratorFUNC);
							..........................................................................................

							Remove All Matching Elements of an Array
								In a typical use case, this method can be used to remove matching elements of an array by specifying an array as the first parameter.

								SYNTAX
								....................................................................................
								Uize.Data.Matches.remove (sourceARRAY,matcherFUNCorSTRorREGEXPorBOOL,iteratorFUNC);
								....................................................................................

							Remove All Matching Properties of an Object
								SYNTAX
								..................................................................................
								Uize.Data.Matches.remove (sourceOBJ,matcherFUNCorSTRorREGEXPorBOOL,iteratorFUNC);
								..................................................................................

							Remove All Matching Values of a Range
								SYNTAX
								..................................................................................
								Uize.Data.Matches.remove (sourceINT,matcherFUNCorSTRorREGEXPorBOOL,iteratorFUNC);
								..................................................................................

							Remove up to a Maximum Number of Matches
								SYNTAX
								..................................................................................
								Uize.Data.Matches.remove (
									sourceARRAYorOBJorINT,matcherFUNCorSTRorREGEXPorBOOL,iteratorFUNC,maxMatchesINT
								);
								..................................................................................

							Remove All of the Items of a Source
								SYNTAX
								.........................................................................................
								Uize.Data.Matches.remove (sourceARRAYorOBJorINT,true,iteratorFUNC);
								Uize.Data.Matches.remove (sourceARRAYorOBJorINT,null,iteratorFUNC);
								Uize.Data.Matches.remove (sourceARRAYorOBJorINT,undefined,iteratorFUNC);
								Uize.Data.Matches.remove (sourceARRAYorOBJorINT,function () {return true},iteratorFUNC);
								Uize.Data.Matches.remove (sourceARRAYorOBJorINT,Uize.returnTrue,iteratorFUNC);
								Uize.Data.Matches.remove (sourceARRAYorOBJorINT,'true',iteratorFUNC);
								.........................................................................................

							Remove None of the Items of a Source
								SYNTAX
								..........................................................................................
								Uize.Data.Matches.remove (sourceARRAYorOBJorINT,false,iteratorFUNC);
								Uize.Data.Matches.remove (sourceARRAYorOBJorINT,function () {return false},iteratorFUNC);
								Uize.Data.Matches.remove (sourceARRAYorOBJorINT,Uize.returnFalse,iteratorFUNC);
								Uize.Data.Matches.remove (sourceARRAYorOBJorINT,'false',iteratorFUNC);
								..........................................................................................

							NOTES
							- see also the companion `Uize.Data.Matches.retain` static method
				*/
			};

			_package.retain = function (_source,_matcher,_maxMatches,_target) {
				return _filter (_source,_matcher,_maxMatches,_target,_false);
				/*?
					Static Methods
						Uize.Data.Matches.retain
							Retains elements in the specified source array, or properties in the specified source object, or values in the specified source range, that match the specified matching criteria.

							NOTES
							- see also the companion `Uize.Data.Matches.remove` static method
				*/
			};

			_package.count = function (_source,_matcher,_maxMatches) {
				var _result = 0;
				_package.forEach (_source,_matcher,function () {_result++},_maxMatches);
				return _result;
				/*?
					Static Methods
						Uize.Data.Matches.count
							Returns an integer, representing the number of elements in the specified source array, or properties in the specified source object, or values in the specified source range, that match the specified matching criteria.
				*/
			};

			function _getMatchesAsArray (_source,_matcher,_maxMatches,_returnKeys) {
				var _result = [];
				_package.forEach (
					_source,
					_matcher,
					function (_value,_key) {_result.push (_returnKeys ? _key : _value)},
					_maxMatches
				);
				return _result;
			}

			_package.keys = function (_source,_matcher,_maxMatches) {
				return _getMatchesAsArray (_source,_matcher,_maxMatches,_true);
				/*?
					Static Methods
						Uize.Data.Matches.keys
							Returns the keys/indexes for elements in the specified source array, or properties in the specified source object, or values in the specified source range, that match the specified matching criteria.

							NOTES
							- see also the companion `Uize.Data.Matches.values` static method
				*/
			};

			_package.values = function (_source,_matcher,_maxMatches) {
				return _getMatchesAsArray (_source,_matcher,_maxMatches,_false);
				/*?
					Static Methods
						Uize.Data.Matches.values
							Returns the values for elements in the specified source array, or properties in the specified source object, or values in the specified source range, that match the specified matching criteria.

							NOTES
							- see also the companion `Uize.Data.Matches.keys` static method
				*/
			};

			_package.firstKey = function (_source,_matcher) {
				return _getMatchesAsArray (_source,_matcher,1,_true) [0];
				/*?
					Static Methods
						Uize.Data.Matches.firstKey
							Returns the key/index of the first element in the specified source array, or property in the specified source object, or value in the specified source range, that matches the specified matching criteria.

							NOTES
							- see also the companion `Uize.Data.Matches.firstValue` static method
				*/
			};

			_package.firstValue = function (_source,_matcher) {
				return _getMatchesAsArray (_source,_matcher,1,_false) [0];
				/*?
					Static Methods
						Uize.Data.Matches.firstValue
							Returns the value of the first element in the specified source array, or property in the specified source object, or value in the specified source range, that matches the specified matching criteria.

							NOTES
							- see also the companion `Uize.Data.Matches.firstKey` static method
				*/
			};

		return _package;
	}
});

