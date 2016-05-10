/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Math.Matrix2D Object
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)1997-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Object
	importance: 2
	codeCompleteness: 75
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Math.Matrix2D= module provides support for building and applying 2-D affine transformations in a 2-dimensional plane.

		*DEVELOPERS:* `Petar Ivanov` & `Ben Ilegbodu`, original code contributed by `Zazzle Inc.`

		Not a Uize Subclass
			First off, it's worth emphasizing that the =Uize.Math.Matrix2D= object is not a =Uize.Class= subclass, but a very lightweight object.

			As such, the =Uize.Math.Matrix2D= object does not support events, does not provide state properties, does not inherit subclassing facilities from the =Uize.Class= base class, etc. This object is deliberately designed to be very lightweight and to have a really tiny footprint - in the spirit of JavaScript's native objects, such as =String=, =Number=, =Date=, and the like.
*/

Uize.module ({
	name:'Uize.Math.Matrix2D',
	builder:function () {
		'use strict';

		var
			_Uize = Uize
		;

		/*** Constructor ***/
			var
				_object = _Uize.noNew (
					function (_coefficients) {
						var m = this;

						m._setCoefficients(
							_Uize.isArray(_coefficients)
								? _coefficients
								: (arguments.length == 6
									? arguments
									: [1.0, 0.0, 0.0, 1.0, 0.0, 0.0] // identity matrix
								)
						);
						/*?
							Constructor
								Creates an instance of the =Uize.Math.Matrix2D= object from the specified coefficients.

								SYNTAX
								.....................................
								var matrixOBJ = Uize.Math.Matrix2D(xxFLOAT, yxFLOAT, xyFLOAT, yyFLOT, xFLOAT, yFLOAT);
								.....................................

								EXAMPLE
								..................................................................
								var matrix = Uize.Math.Matrix2D (2.0, 3.0, 4.0, 5.0, 6.0, 7.0);
								..................................................................

								This will resultant in a matrix that looks like...

								..................................................................
								:| 2.0 | 3.0 | 6.0 |
								:| 4.0 | 5.0 | 7.0 |
								..................................................................

								VARIATION 1
								.....................................
								var matrixOBJ = Uize.Math.Matrix2D(coefficientsARRAY);
								.....................................

								In this variation, the coefficients, instead of being passed as individual parameters, are passed as a 6-element array.

								EXAMPLE
								..................................................................
								var matrix = Uize.Math.Matrix2D ([2.0, 3.0, 4.0, 5.0, 6.0, 7.0]);
								..................................................................

								This will resultant in a matrix that looks like...

								..................................................................
								:| 2.0 | 3.0 | 6.0 |
								:| 4.0 | 5.0 | 7.0 |
								..................................................................

								VARIATION 2
								.....................................
								var matrixOBJ = Uize.Math.Matrix2D();
								.....................................

								When no parameters are passed to the =Uize.Math.Matrix2D= `constructor`, the matrix is initialized as the identity matrix.

								EXAMPLE
								..................................................................
								var identityMatrix = Uize.Math.Matrix2D ();
								..................................................................

								This will resultant in a matrix that looks like...

								EXAMPLE
								..................................................................
								:| 1 | 0 | 0 |
								:| 0 | 1 | 0 |
								..................................................................
						*/
					}
				),
				_objectPrototype = _object.prototype
			;


		/*** Private Instance Methods ***/
			_objectPrototype._setCoefficients = function (_coefficients) {
				var m = this;

				m._XX = +_coefficients[0];
				m._YX = +_coefficients[1];
				m._XY = +_coefficients[2];
				m._YY = +_coefficients[3];
				m._X =  +_coefficients[4];
				m._Y =  +_coefficients[5];
			};


		/*** Public Instance Methods ***/
			_objectPrototype.clone = function () {
				return _object(this.values());
				/*?
					Instance Methods
						clone
							Makes a copy of the 2-D matrix, returning a reference to the cloned =Uize.Math.Matrix2D= object.

							SYNTAX
							.....................................................
							var newMatrixOBJ = matrix.clone();
							.....................................................

							NOTES
							- Returns a reference to the cloned =Uize.Math.Matrix2D= object
				*/
			};

			_objectPrototype.multiply = function (_other) {
				var m = this;

				m._setCoefficients([
					_other._XX * m._XX + _other._YX * m._XY,
					_other._XX * m._YX + _other._YX * m._YY,
					_other._XY * m._XX + _other._YY * m._XY,
					_other._XY * m._YX + _other._YY * m._YY,
					_other._XX * m._X + _other._YX * m._Y + _other._X,
					_other._XY * m._X + _other._YY * m._Y + _other._Y
				]);

				return m;
				/*?
					Instance Methods
						multiply
							Multiplies this matrix by the specified =otherMatrixOBJ= transformation, by appending the specified =otherMatrixOBJ=.

							SYNTAX
							.....................................................
							var matrixOBJ = matrix.multiply(otherMatrixOBJ);
							.....................................................

							EXAMPLE
							.....................................................
							var matrix = Uize.Math.Matrix2D(1,0,0,1,20,30);
							matrix.multiply(Uize.Math.Matrix2D(2,0,0,2,8,9));
							.....................................................

							The matrix created in the previous example would be...

							.....................................................
							:| 2.0 | 0.0 | 48.0 |
							:| 0.0 | 2.0 | 69.0 |
							.....................................................

							NOTES
							- The other transformation is added after the orignal one (i.e. appended).
							- Returns a reference to the same =Uize.Math.Matrix2D= object
				*/
			};

			_objectPrototype.rotate = function (_angle) {
				var
					_cos = Math.cos(_angle),
					_sin = Math.sin(_angle)
				;

				return this.multiply(_object(_cos, -_sin, _sin, _cos, 0, 0));
				/*?
					Instance Methods
						rotate
							Appends to this matrix a clockwise rotation, around the origin and by the specified =angleFLOAT=.

							SYNTAX
							.....................................................
							var matrixOBJ = matrix.rotate(angleFLOAT);
							.....................................................

							EXAMPLE
							.....................................................
							var matrix = Uize.Math.Matrix2D();
							matrix.rotate(Math.PI / 4);
							.....................................................

							The matrix created in the previous example would be...

							.....................................................
							:| 0.7071 | -0.7071 | 0.0 |
							:| 0.7071 |  0.7071 | 0.0 |
							.....................................................

							NOTES
							- The rotation is added after the original transformation (i.e. appended).
							- =angleFLOAT= is in radians
							- Positive rotation is a rotation from positive X-axis towards positive Y-axis
							- Returns a reference to the same =Uize.Math.Matrix2D= object

				*/
			};


			_objectPrototype.scale = function (_xScale, _yScale) {
				return this.multiply(_object(_xScale, 0, 0, _yScale, 0, 0));
				/*?
					Instance Methods
						scale
							Applies the scale vector (specified by =xScaleFLOAT= and =yScaleFLOAT=) to this matrix by appending the scale vector.

							SYNTAX
							.....................................................
							var matrixOBJ = matrix.scale(xScaleFLOAT, yScaleFLOAT);
							.....................................................

							EXAMPLE
							.....................................................
							var matrix = Uize.Math.Matrix2D(1,2,3,4,20,30);
							matrix.scale(10, 100);
							.....................................................

							The matrix created in the previous example would be...

							.....................................................
							:|  10 |   20 |  200 |
							:| 300 |  400 | 3000 |
							.....................................................

							NOTES
							- The scaling transformation is added after the original one (i.e. appended).
							- Returns a reference to the same =Uize.Math.Matrix2D= object
				*/
			};

			_objectPrototype.toString = function () {
				return this.values() + '';
				/*?
					Instance Methods
						toString
							Serializes the 2-D matrix to a string.

							SYNTAX
							.....................................................
							var matrixString = matrix.toString();
							.....................................................
				*/
			};

			_objectPrototype.translate = function (_x, _y) {
				var m = this;

				m._X += _x;
				m._Y += _y;

				return m;
				/*?
					Instance Methods
						translate
							Applies the translation vector (specified by xOffsetFLOAT and yOffsetFLOAT) to this matrix by appending the translation vector.

							SYNTAX
							.....................................................
							var matrixOBJ = matrix.translate(xOffsetFLOAT, yOffsetFLOAT);
							.....................................................

							EXAMPLE
							.....................................................
							var matrix = Uize.Math.Matrix2D(1,0,0,1,20,30);
							matrix.translate(8, 9);
							.....................................................

							The matrix created in the previous example would be...

							.....................................................
							:| 1 | 0 | 28 |
							:| 0 | 1 | 39 |
							.....................................................

							NOTES
							- The translation is added after the original transformation (i.e appended).
							- Returns a reference to the same =Uize.Math.Matrix2D= object
				*/
			};

			_objectPrototype.values = function () {
				var m = this;
				return [m._XX, m._YX, m._XY, m._YY, m._X, m._Y];
				/*?
					Instance Methods
						values
							Gets a 6-element array of values that represent the matrix coefficients of this matrix.

							SYNTAX
							.....................................................
							var coefficiensARRAY = matrix.values();
							.....................................................

							EXAMPLE
							.....................................................
							var matrix = Uize.Math.Matrix2D();
							matrix.rotate(Math.PI / 2);
							matrix.translate(20,30);
							var matrixArray = matrix.values();
							.....................................................

							The array returned in the previous example would be =[0,-1,1,0,20,30]=.

							NOTES
							- Returns an new array containing the matrix coefficients
							- The translation coefficients are at the end of the array
				*/
			};

			_objectPrototype.xForm = function (_param1, _param2) {
				var
					m = this,

					// assume two parameters
					_x = +_param1,
					_y = +_param2
				;

				if (_Uize.isPlainObject(_param1)) { // passed a vector object
					_x = +_param1.x;
					_y = +_param1.y;
				}

				return {
					x:m._XX * _x + m._YX * _y + m._X,
					y:m._XY * _x + m._YY * _y + m._Y
				};
				/*?
					Instance Methods
						xForm
							Applies this matrix to the 2-D vector (specified by =xFLOAT= and =yFLOAT=).

							SYNTAX
							.....................................................
							var vectorOBJ = matrix.xForm(xFLOAT, yFLOAT);
							.....................................................

							EXAMPLE
							.....................................................
							var matrix = Uize.Math.Matrix2D();
							matrix.rotate(Math.PI / 2);
							var vector = matrix.xForm(1,0);
							.....................................................

							The vector returned in the previous example would be ={x:0, y:1}=.

							VARIATION
							.....................................................
							var vectorOBJ = matrix.xForm(vectorOBJ);
							.....................................................

							In this variation, the 2-D vector is specified a simple object, =vectorOBJ=, with 2 properties =x= and =y=.

							EXAMPLE
							.....................................................
							var matrix = Uize.Math.Matrix2D();
							matrix.rotate(Math.PI / 2);
							var vector = matrix.xForm({x:1, y:0});
							.....................................................

							The vector returned in the previous example would be ={x:0, y:1}=.

							NOTES
							- Returns a vector object with =x= and =y= properties
				*/
			};

		return _object;
	}
});
