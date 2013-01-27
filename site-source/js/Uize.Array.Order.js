/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Array.Order Package
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
		The =Uize.Array.Order= module provides utility methods for reordering the elements of arrays, with support for reversing, jumbling, inside to out, etc.

		*DEVELOPERS:* `Chris van Rensburg`

		In a Nutshell
			Reordering Ins't Sorting
				Unlike sorting an array based upon its elements' values, the methods of the =Uize.Array.Order= module allow you to reorder the elements according to different patterns - without respect to the element values.

				As an example, the =Uize.Array.Order.reverse= method reverses the order of the elements in an array.

			Types of Reordering
				Reverse
					The elements in an array can be reversed by using the =Uize.Array.Order.reverse= method, or by using the =Uize.Array.Order.reorder= method and specifying the value ='reverse'= for the method's =reorderingModeSTR= parameter.

					EXAMPLE
					....................................................................................
					Uize.Array.Order.reverse ([1,2,3,4,5,6,7,8]); // returns the array [8,7,6,5,4,3,2,1]
					....................................................................................

					While JavaScript's built-in =Array= object *does* provide a =reverse= instance method, the =Uize.Array.Order.reverse= method offers a `versatile target` facility that is lacking with the built-in =reverse= method, which always modifies the source array.

					For a more in-depth explanation, consult the reference for the =Uize.Array.Order.reverse= method.

				Jumble
					The elements of an array can be jumbled (randomly shuffled) by using the =Uize.Array.Order.jumble= static method, or by using the =Uize.Array.Order.reorder= method and specifying the value ='jumbled'= for the method's =reorderingModeSTR= parameter.

					EXAMPLE
					.......................................................................................
					Uize.Array.Order.jumble ([1,2,3,4,5,6,7,8]); // returns an array like [2,8,4,1,6,3,7,5]
					.......................................................................................

					For a more in-depth explanation, consult the reference for the =Uize.Array.Order.jumble= method.

				Inside to Out
					The elements of an array can be reordered from inside to out by using the =Uize.Array.Order.insideOut= static method, or by using the =Uize.Array.Order.reorder= method and specifying the value ='inside out'= for the method's =reorderingModeSTR= parameter.

					EXAMPLE
					......................................................................................
					Uize.Array.Order.insideOut ([1,2,3,4,5,6,7,8]); // returns the array [4,5,3,6,2,7,1,8]
					......................................................................................

					For a more in-depth explanation, consult the reference for the =Uize.Array.Order.insideOut= method.

				Outside to In
					The elements of an array can be reordered from outside to in by using the =Uize.Array.Order.insideOut= static method, or by using the =Uize.Array.Order.reorder= method and specifying the value ='outside in'= for the method's =reorderingModeSTR= parameter.

					EXAMPLE
					......................................................................................
					Uize.Array.Order.outsideIn ([1,2,3,4,5,6,7,8]); // returns the array [1,8,2,7,3,6,4,5]
					......................................................................................

					For a more in-depth explanation, consult the reference for the =Uize.Array.Order.outsideIn= method.

			Versatile Target
				The methods of the =Uize.Array.Order= module support a versatile target facility that allows the processed elements of the source array to be targeted either to the source array, to a fresh array, or to a specified target array.

				With JavaScript's built-in =Array= object, some instance methods will modify the source array while others will create a fresh array. For example, the =splice= and =reverse= methods will modify the source array. On the other hand, the =concat= and =slice= methods return new arrays. In contrast, the methods of the =Uize.Array.Order= module let you specify the target behavior for the processed elements of the source array. A target is specified using the optional =targetARRAYorBOOL= parameter. Essentially three behaviors are supported: 1) modify the source array, 2) create a fresh array, or 3) use a specified target array.

				For a more in-depth discussion, consult the reference for the =targetARRAYorBOOL= value type.
*/

Uize.module ({
	name:'Uize.Array.Order',
	builder:function () {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var _package = function () {};

		/*** Utility Functions ***/
			function _randomSorter () {return Math.random () - .5}

		/*** Public Static Methods ***/
			var _reorder = _package.reorder = function (_source,_reorderScheme,_target) {
				if (typeof _target != 'object')
					_target = _target === false ? _source : []
				;
				if (
					_target == _source &&
					(_reorderScheme == 'normal' || _reorderScheme == 'reverse' || _reorderScheme == 'jumbled')
				) {
					_reorderScheme == 'reverse'
						? _source.reverse ()
						: _reorderScheme == 'jumbled'
							? _source.sort (_randomSorter)
							: 0
					;
				} else {
					if (_target == _source) _source = _source.concat ();
					var
						_sourceLength = _source.length,
						_sourceLengthMinus1 = _sourceLength - 1,
						_indexMapper
					;
					if (_reorderScheme == 'reverse') {
						_indexMapper = function (_index) {return _sourceLengthMinus1 - _index};
					} else if (_reorderScheme == 'inside out') {
						var
							_startLeft = _sourceLength % 2,
							_rightInnerNo = Math.ceil (_sourceLengthMinus1 / 2)
						;
						_indexMapper = function (_index) {
							return (
								_index % 2 == _startLeft
									? _rightInnerNo - 1 - (_index >> 1)
									: _rightInnerNo + (_index >> 1)
							);
						};
					} else if (_reorderScheme == 'outside in') {
						_indexMapper = function (_index) {
							return _index % 2 ? _sourceLengthMinus1 - (_index >> 1) : _index >> 1;
						};
					} else if (_reorderScheme == 'normal') {
						_indexMapper = Uize.returnX;
					} else {
						var _jumbledOrder = Uize.map (_sourceLength,'key').sort (_randomSorter);
						_indexMapper = function (_index) {return _jumbledOrder [_index]};
					}
					for (var _elementNo = -1; ++_elementNo <= _sourceLengthMinus1;)
						_target [_elementNo] = _source [_indexMapper (_elementNo)]
					;
				}
				return _target;
				/*?
					Static Methods
						Uize.Array.Order.reorder
							Returns an array, being a reordered version of the specified source array, using the specified reordering mode.

							SYNTAX
							..........................................................................
							reorderedARRAY = Uize.Array.Order.reorder (sourceARRAY,reorderingModeSTR);
							..........................................................................

							VARIATION 1
							.............................................................................
							reorderedARRAY =
								Uize.Array.Order.reorder (sourceARRAY,reorderingModeSTR,targetARRAYorBOOL)
							;
							.............................................................................

							By default, the =Uize.Array.Order.reorder= method packages the reordered array elements into a new array and does not modify the source array (ie. it's non-destructive). Specifying the optional =targetARRAYorBOOL= parameter allows you to explicitly specify a target for the operation, into which the reordered elements will be packaged.

							VARIATION 2
							......................................................
							jumbledARRAY = Uize.Array.Order.reorder (sourceARRAY);
							......................................................

							When only a =sourceARRAY= parameter is specified, then the default behavior is to reorder the source array using the ='jumble'= mode and package the results into a new array.

							reorderingModeSTR
								The =reorderingModeSTR= parameter is a string, specifying the reordering mode that should be employed, and can have the following values...

								- ='jumbled'= (default) - reorders the specified source array in the same way as the =Uize.Array.Order.jumble= static method
								- ='reverse'= - reorders the specified source array in the same way as the =Uize.Array.Order.reverse= static method
								- ='inside out'= - reorders the specified source array in the same way as the =Uize.Array.Order.insideOut= static method
								- ='outside in'= - reorders the specified source array in the same way as the =Uize.Array.Order.outsideIn= static method
								- ='normal'= - leaves the order of elements unchanged

							NOTES
							- see the related =Uize.Array.Order.insideOut=, =Uize.Array.Order.jumble=, =Uize.Array.Order.outsideIn=, and =Uize.Array.Order.reverse= static methods
				*/
			};

			_package.insideOut = function (_elements,_target) {
				return _reorder (_elements,'inside out',_target)
				/*?
					Static Methods
						Uize.Array.Order.insideOut
							Returns an array, being the specified source array reordered from inside to out.

							SYNTAX
							..........................................................
							reorderedARRAY = Uize.Array.Order.insideOut (sourceARRAY);
							..........................................................

							When an array is reordered from inside to out, the new order is formed by starting with the inner elements and moving outwards in both directions to reach the start and the end of the array. Consider the following example...

							EXAMPLE
							......................................................................................
							Uize.Array.Order.insideOut ([1,2,3,4,5,6,7,8]); // returns the array [4,5,3,6,2,7,1,8]
							......................................................................................

							In the above example, at the center of the array being reordered are the values =4= and =5=. These are the first two elements of the reordered array. Moving outwards in both directions, the next two values are =3= and =6=, so these are the next two elements in the reordered array. Moving outwards further, the next two values are =2= and =7=, which become the next two elements in the reordered array. Finally, we get to the first and last values in the array being reordered, =1= and =9=, which become the last two elements of the reordered array.

							VARIATION
							............................................................................
							reorderedARRAY = Uize.Array.Order.insideOut (sourceARRAY,targetARRAYorBOOL);
							............................................................................

							When the optional =targetARRAYorBOOL= parameter is specified, the target destination for the reordered elements can be controlled (for more info, see the reference for the =targetARRAYorBOOL= value type).

							NOTES
							- see the related =Uize.Array.Order.jumble=, =Uize.Array.Order.outsideIn=, =Uize.Array.Order.reorder=, and =Uize.Array.Order.reverse= static methods
				*/
			};

			_package.jumble = function (_elements,_target) {
				return _reorder (_elements,'jumbled',_target)
				/*?
					Static Methods
						Uize.Array.Order.jumble
							Returns an array, being a jumbled (randomly shuffled) version of the specified source array.

							SYNTAX
							.......................................................
							reorderedARRAY = Uize.Array.Order.jumble (sourceARRAY);
							.......................................................

							EXAMPLE
							.......................................................................................
							Uize.Array.Order.jumble ([1,2,3,4,5,6,7,8]); // returns an array like [2,8,4,1,6,3,7,5]
							.......................................................................................

							In the above example, the order of the elements in the jumbled array will very likely be different for every different time that the =Uize.Array.Order.jumble= method is called.

							VARIATION
							.........................................................................
							reorderedARRAY = Uize.Array.Order.jumble (sourceARRAY,targetARRAYorBOOL);
							.........................................................................

							When the optional =targetARRAYorBOOL= parameter is specified, the target destination for the jumbled elements can be controlled (for more info, see the reference for the =targetARRAYorBOOL= value type).

							NOTES
							- see the related =Uize.Array.Order.insideOut=, =Uize.Array.Order.outsideIn=, =Uize.Array.Order.reorder=, and =Uize.Array.Order.reverse= static methods
				*/
			};

			_package.outsideIn = function (_elements,_target) {
				return _reorder (_elements,'outside in',_target)
				/*?
					Static Methods
						Uize.Array.Order.outsideIn
							Returns an array, being the specified source array reordered from outside to in.

							SYNTAX
							..........................................................
							reorderedARRAY = Uize.Array.Order.outsideIn (sourceARRAY);
							..........................................................

							When an array is reordered from outside to in, the new order is formed by starting with the start and the end of the array and moving inwards in both directions to reach the inner elements. Consider the following example...

							EXAMPLE
							......................................................................................
							Uize.Array.Order.outsideIn ([1,2,3,4,5,6,7,8]); // returns the array [1,8,2,7,3,6,4,5]
							......................................................................................

							In the above example, at the start and end of the array being reordered are the values =1= and =8=. These are the first two elements of the reordered array. Moving inwards in both directions, the next two values are =2= and =7=, so these are the next two elements in the reordered array. Moving inwards further, the next two values are =3= and =6=, which become the next two elements in the reordered array. Finally, we get to the inner values in the array being reordered, =4= and =5=, which become the last two elements of the reordered array.

							VARIATION
							............................................................................
							reorderedARRAY = Uize.Array.Order.outsideIn (sourceARRAY,targetARRAYorBOOL);
							............................................................................

							When the optional =targetARRAYorBOOL= parameter is specified, the target destination for the reordered elements can be controlled (for more info, see the reference for the =targetARRAYorBOOL= value type).

							NOTES
							- see the related =Uize.Array.Order.insideOut=, =Uize.Array.Order.jumble=, =Uize.Array.Order.reorder=, and =Uize.Array.Order.reverse= static methods
				*/
			};

			_package.reverse = function (_elements,_target) {
				return _reorder (_elements,'reverse',_target)
				/*?
					Static Methods
						Uize.Array.Order.reverse
							Returns an array, being a reversed version of the specified source array.

							SYNTAX
							........................................................
							reorderedARRAY = Uize.Array.Order.reverse (sourceARRAY);
							........................................................

							EXAMPLE
							....................................................................................
							Uize.Array.Order.reverse ([1,2,3,4,5,6,7,8]); // returns the array [8,7,6,5,4,3,2,1]
							....................................................................................

							VARIATION
							..........................................................................
							reorderedARRAY = Uize.Array.Order.reverse (sourceARRAY,targetARRAYorBOOL);
							..........................................................................

							When the optional =targetARRAYorBOOL= parameter is specified, the target destination for the reversed elements can be controlled (for more info, see the reference for the =targetARRAYorBOOL= value type).

							NOTES
							- see the related =Uize.Array.Order.insideOut=, =Uize.Array.Order.jumble=, =Uize.Array.Order.outsideIn=, and =Uize.Array.Order.reorder= static methods
				*/
			};

		/*?
			Value Types
				For the sake of not redundantly describing the value types for certain method parameters and return values repeatedly, some common value types are described here.

				sourceARRAY
					An array reference, specifying an array that should be processed by an array method.

					Values of this type can be accepted by the =Uize.Array.Order.insideOut=, =Uize.Array.Order.jumble=, =Uize.Array.Order.outsideIn=, =Uize.Array.Order.reorder=, and =Uize.Array.Order.reverse= static methods.

					Array-like Values
						Methods that accept parameters of the =sourceARRAY= value type can also support array-like objects, such as collections of DOM nodes - provided that the source array is not also specified as the target for reordered elements.

				targetARRAYorBOOL
					An array reference or boolean value, which lets you specify where the result of an array method's processing should be packaged.

					Values of this type can be accepted by the =Uize.Array.Order.insideOut=, =Uize.Array.Order.jumble=, =Uize.Array.Order.outsideIn=, =Uize.Array.Order.reorder=, and =Uize.Array.Order.reverse= static methods.

					VALUES

					- When the *boolean* value =true= is specified (the default value for the =targetARRAYorBOOL= parameter if it is omitted), then the result of an array method's processing will be packaged into a new array.

					- When the *boolean* value =false= is specified (not the same as not specifying a value), then the result of an array method's processing will be packaged into the source array that was supplied to the array method in its =sourceARRAY= parameter (ie. the method won't use a different target).

					- When an *array* is explicitly specified, then the result of an array method's processing will be packaged into the specified target array. This is convenient if you already have an array into which you wish to package the result. Incidentally, specifying the source array that you supplied to an array method as also the target array has the same effect as specifying the value =false= for =targetARRAYorBOOL= (ie. use the source as the target, don't use a different target).
		*/

		return _package;
	}
});

