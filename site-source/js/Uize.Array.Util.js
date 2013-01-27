/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Array.Util Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2011-2013 UIZE
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
		The =Uize.Array.Util= module provides a number of miscellaneous utility methods for manipulating arrays.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Array.Util',
	builder:function () {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_package = function () {},
				_undefined = undefined,
				_ArrayPrototype = Array.prototype,
				_ArrayPush = _ArrayPrototype.push,
				_ArrayConcat = _ArrayPrototype.concat,
				_ArraySplice = _ArrayPrototype.splice,
				_Infinity = Infinity,
				_fullArraySpliceArgs = [0,_Infinity]
			;

		/*** Public Static Methods ***/
			_package.replaceContents = function (_array1,_array2) {
				if (_array1 != _array2) {
					_array1.length = 0;
					_array2 && _array2.length && _ArrayPush.apply (_array1,_array2);
				}
				return _array1;
				/*?
					Static Methods
						Uize.Array.Util.replaceContents
							Replaces the contents of the first array with the contents of the second array, and returns a reference to the first array.

							SYNTAX
							........................................................................
							array1ARRAY = Uize.Array.Util.replaceContents (array1ARRAY,array2ARRAY);
							........................................................................

							EXAMPLE
							............................................................
							var
								foods = ['bacon','sausage','omelette'],
								vegetables = ['potato','beans','mushrooms']
							;
							Uize.Array.Util.replaceContents (foods,vegetables);
							alert (foods); // displays the text "potato,beans,mushrooms"
							............................................................

							In the above example, the contents of the =foods= array (which clearly contains some rather unhealthy food types) is being replaced with the contents of the healthier =vegetables= array. When the value of the =foods= array is then alerted, we see the text "potato,beans,mushrooms".

							VARIATION
							............................................................
							array1ARRAY = Uize.Array.Util.replaceContents (array1ARRAY);
							............................................................

							When no =array2ARRAY= parameter is specified, or if the value =undefined= or =null= is specified for the =array2ARRAY= parameter, then the array specified by the =array1ARRAY= parameter will be emptied out.

							NOTES
							- see the related =Uize.Array.Util.swapContents= static method
				*/
			};

			_package.swapContents = function (_array1,_array2) {
				if (_array1 != _array2) {
					_ArrayPush.apply (
						_array1,
						_ArraySplice.apply (_array2,_fullArraySpliceArgs.concat (_array1.splice (0,_Infinity)))
					);
				}
				return _array1;
				/*?
					Static Methods
						Uize.Array.Util.swapContents
							Swaps the contents of the two specified arrays, and returns a reference to the first array.

							SYNTAX
							.....................................................................
							array1ARRAY = Uize.Array.Util.swapContents (array1ARRAY,array2ARRAY);
							.....................................................................

							EXAMPLE
							......................................................................
							var
								healthyFoods = ['bacon','sausage','omelette'],
								unhealthyFoods = ['potato','beans','mushrooms']
							;
							Uize.Array.Util.swapContents (healthyFoods,unhealthyFoods);
							alert (healthyFoods);    // displays the text "potato,beans,mushrooms"
							alert (unhealthyFoods);  // displays the text "bacon,sausage,omelette"
							......................................................................

							In the above example, the contents of the =healthyFoods= and =unhealthyFoods= arrays are clearly mixed up. In order to correct this, the contents of the two arrays can be swapped. We can't just swap the variable references around, since other code may already have references to the arrays. What we really want to do is fix their contents. We can do this using the =Uize.Array.Util.swapContents= method.

							NOTES
							- see the related =Uize.Array.Util.replaceContents= static method
				*/
			};

			_package.flatten = function (_sourceArray,_depth,_target) {
				_depth = _depth == _undefined ? _Infinity : +_depth || 0;
				var
					_workingArray = _sourceArray,
					_workingArrayPreviousLength,
					_flattenedDepth = 0
				;
				while (_flattenedDepth++ < _depth && _workingArray.length != _workingArrayPreviousLength) {
					_workingArrayPreviousLength = _workingArray.length;
					_workingArray = _ArrayConcat.apply ([],_workingArray);
				}
				return (
					_target !== true
						? _package.replaceContents (_target || _sourceArray,_workingArray)
						: _workingArray != _sourceArray
							? _workingArray
							: _sourceArray.concat ()
				);
				/*?
					Static Methods
						Uize.Array.Util.flatten
							Flattens the elements of the specified source array and returns the flattened array.

							SYNTAX
							..................................................................................
							flattenedARRAY = Uize.Array.Util.flatten (sourceARRAY,depthINT,targetARRAYorBOOL);
							..................................................................................

							VARIATION 1
							................................................................
							flattenedARRAY = Uize.Array.Util.flatten (sourceARRAY,depthINT);
							................................................................

							When the optional =depthINT= parameter is specified, then the depth level to which the source array should be flattened can be controlled. When the value =0= is specified for this parameter, the source array will remain unflattened. When the value =1= is specified, then this method will `flatten an array to one level deep`. When the value =2= is specified, then this method will `flatten an array to two levels deep`. When the =depthINT= parameter is not specified, then this method will `flatten an array to infinite depth`.

							VARIATION 2
							................................................................
							flattenedARRAY = Uize.Array.Util.flatten (sourceARRAY,depthINT,targetARRAYorBOOL);
							................................................................

							When the optional =targetARRAYorBOOL= parameter is specified, then the target for the flattened contents of the source array can be controlled. When the value =true= is specified for the =targetARRAYorBOOL= parameter, then the target for the flattened contents of the source array will be a new array and the source array will not be modified. When the =false= is specified for the =targetARRAYorBOOL= parameter, then the flattened contents of the source array will replace the unflattened contents of the source array. When an array is specified for the =targetARRAYorBOOL= parameter, then the flattened contents of the source array will replace the contents of the specified target array.

							Examples
								Flatten an Array to One Level Deep
									When the value =1= is specified for the optional =depthINT= parameter, then the source array will be flattened one level deep.

									EXAMPLE
									......................................................................
									Uize.Array.Util.flatten ([0,[1,[2,[3,[4,[5,[6,6],5],4],3],2],1],0],1);
									......................................................................

									RESULT
									.......................................
									[0,1,[2,[3,[4,[5,[6,6],5],4],3],2],1,0]
									.......................................

								Flatten an Array to Two Levels Deep
									When the value =2= is specified for the optional =depthINT= parameter, then the source array will be flattened one level deep.

									EXAMPLE
									......................................................................
									Uize.Array.Util.flatten ([0,[1,[2,[3,[4,[5,[6,6],5],4],3],2],1],0],2);
									......................................................................

									RESULT
									.....................................
									[0,1,2,[3,[4,[5,[6,6],5],4],3],2,1,0]
									.....................................

								Flatten an Array to Infinite Depth
									When the optional =depthINT= parameter is not specified, then the source array will be flattened to infinite depth (ie. until all elements are no longer arrays).

									EXAMPLE
									....................................................................
									Uize.Array.Util.flatten ([0,[1,[2,[3,[4,[5,[6,6],5],4],3],2],1],0]);
									....................................................................

									RESULT
									.............................
									[0,1,2,3,4,5,6,6,5,4,3,2,1,0]
									.............................
				*/
			};

		return _package;
	}
});

