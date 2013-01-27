/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Color Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)1997-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Object
	importance: 7
	codeCompleteness: 95
	docCompleteness: 92
*/

/*?
	Introduction
		The =Uize.Color= module provides support for `Color Spaces`, `Color Encodings`, `Named Colors`, the =sRGB= and =HSL= color spaces, and many color encodings.

		*DEVELOPERS:* `Chris van Rensburg`

		Not a Uize Subclass
			First off, it's worth emphasizing that the =Uize.Color= object is not a =Uize.Class= subclass, but a very lightweight object.

			As such, the =Uize.Color= object does not support events, does not provide state properties, does not inherit subclassing facilities from the =Uize.Class= base class, etc. This object is deliberately designed to be very lightweight and to have a really tiny footprint - in the spirit of JavaScript's native objects, such as =String=, =Number=, =Date=, and the like.

		Key Features
			The =Uize.Color= object provides the following key features...

			A Framework for Defining Color Spaces
				Colors can be represented using different color models and mapping functions. These are called [[http://en.wikipedia.org/wiki/Color_space][color spaces]]. Examples of color spaces include =sRGB=, =HSL=, =HSV=, and =CMYK=, but there are many more in existence.

			A Framework for Defining Color Encodings
				Colors can be represented using different formats and color models. In UIZE, the combination of a color space and format is called a color encoding.

				The =Uize.Color= object supports a wide variety of built-in `color encodings`. Multiple encodings often exist for the same color space. For example, the =#hex= (eg. =#ff00ff=), =RGB string= (eg. =rgb(255,0,255)=), and =name= (eg. =fuchsia=) encodings are all encodings for the =sRGB= color space.

				............................................................
				<< table >>

				title: EXAMPLES OF BUILT-IN ENCODINGS
				data
				:| ENCODING NAME  |  THE COLOR FUCHSIA IN THIS ENCODING    |
				:| color          |  Uize.Color ('fuchsia')                |
				:| hex            |  ff00ff                                |
				:| #hex           |  #ff0fff                               |
				:| name           |  fuchsia                               |
				:| RGB array      |  [255,0,255]                           |
				:| RGB int        |  16711935                              |
				:| RGB object     |  {red:255,green:0,blue:255}            |
				:| RGB string     |  rgb(255,0,255)                        |
				:| HSL array      |  [300,100,50]                          |
				:| HSL object     |  {hue:300,saturation:100,lightness:50} |
				:| HSL string     |  hsl(300,100%,50%)                     |
				............................................................

				Beyond the built-in encodings, further encodings are available in extension modules, such as the =Uize.Color.xHsv= module that defines the =HSV= color space. Further color spaces can be defined - your own custom color spaces, or those not yet supported.

			Methods for Manipulating Colors
				Using the =Uize.Color= object, colors can be converted across color spaces and formats.

				Further utilities for dealing with colors are available in extension module, such as the =Uize.Color.xUtil= module, which provides methods for blending between colors, mixing multiple colors together, testing for color equivalence, etc.

			A Framework for Defining Named Colors
				`Named colors` can be defined, and these colors can then be used wherever colors can be specified using the methods of the =Uize.Color= object.

				And because the =Uize.Color= module is used by other modules, such as the =Uize.Fx= module, it is possible to use color names when specifying the values of color CSS style properties for fade effects. The SVG 1.0 and CSS 3 specifications define over a hundred additional named colors, and these become available when using the =Uize.Color.xSvgColors= extension module. You can also define your own custom named colors (see the section `Defining New Named Colors`).

		Creating Instances
			There are actually three different ways that a new instance of the =Uize.Color= object can be created.

			Using the Constructor
				Typically, you will create a new instance of the =Uize.Color= object using its constructor, as follows...

				.............................................................
				var myColor = Uize.Color ('#f0f');  // initialized to fuchsia
				.............................................................

			Using the Uize.Color.from Static Method
				The =Uize.Color.from= static method is a factory method that decodes the specified color value and produces an instance of the =Uize.Color= object as a result.

				..................................................................
				var myColor = Uize.Color.from ('#f0f');  // initialized to fuchsia
				..................................................................

			Using the Uize.Color.to Static Method
				The =Uize.Color.to= static method decodes the specified color value and then encodes it using the specified encoding. Using the =color= encoding encodes the source color as an instance of the =Uize.Color= object.

				........................................................................
				var myColor = Uize.Color.to ('#f0f','color');  // initialized to fuchsia
				........................................................................

		### to note
			- decoding colors
			- encoding colors
				- doesn't modify internal tuple values, only for output
				- similarly, encoding into a different color space doesn't modify internal tuple values
			- changing color encoding / converting colors to different color spaces
			- manipulating colors (eg. blending, mixing, sorting)

			- defining custom encodings
				- the tuplet string encoding naming scheme (eg. "RGB string")
			- explain some things about blending...
				- when blending two colors, first color is authority on encoding (and, therefore, color space)
				- when blending colors, they are blended in the color space of the encoding (not the target encoding)

		### Specifying Color Values
			Automatic Encoding Detection
				.

			Disambiguating Encoding
				SYNTAX
				...
				{'encoding name':colorValueANYTYPE}
				...

				So, for example, the =HSL= tuple for the color white, which would be =[0,0,100]=, can be specified in a disambiguated form as ={'HSL array':[0,0,100]}=. Without this disambiguation, the automatic encoding detection will default to the =RGB array= encoding.

				An Example
					If you had two tuple arrays that each represented the three color components - hue, saturation, and brightness - of the =HSL= color space, then you could blend them as =HSL= colors by using the disambiguation facility, as follows...

					EXAMPLE
					.........................................................................................
					var
						color1HslTuple = [0,0,0],   // black as an HSL tuple
						color2HslTuple = [0,0,100]  // white as an HSL tuple
					;
					alert (
						Uize.Color.blend ({'HSL array':color1HslTuple},{'HSL array':color2HslTuple},.5,'name')
					);
					.........................................................................................

					In the above example, the =alert= statement will display the text "grey" in the dialog.
*/

Uize.module ({
	name:'Uize.Color',
	builder:function () {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var _undefined;

		/*** General Variables ***/
			var
				_colorNamesLookup,
				_tupleRegExp = /(\w+)\s*\(\s*([^,\)]+)\s*,\s*([^,\)]+)\s*,\s*([^,\)]+)\s*(?:,\s*([^,\)]+)\s*)?\)/i
			;

		/*** Utility Functions ***/
			function _byte (_value) {
				return Uize.constrain (Math.round (_value),0,255) || 0;
			}

			function _updateColorNamesLookup (_colors) {
				for (var _colorName in _colors)
					_colorNamesLookup [_colors [_colorName]] = _colorNamesLookup [_colorName.toLowerCase ()] = _colorName
				;
			}

			function _createColorNamesLookupIfNecessary () {
				if (!_colorNamesLookup) {
					_colorNamesLookup = _object.colorNamesLookup = {};
					_updateColorNamesLookup (_colors);
				}
			}

		/*** Constructor ***/
			var
				_object = Uize.noNew (
					function () {
						/*** Public Instance Properties ***/
							this.tuple = [];

						_objectPrototype.from.apply (this,arguments);
					}
					/*?
						Constructor
							Lets you create an instance of the =Uize.Color= object.

							SYNTAX
							.....................................
							colorOBJ = Uize.Color (colorANYTYPE);
							.....................................

							Initial color value can be specified in the =colorANYTYPE= parameter using any of the many `color encodings` supported by the =Uize.Color= module. The following examples illustrate this variety and flexibility...

							EXAMPLES
							..................................................................
							Uize.Color (Uize.Color (255,0,255));                 // color
							Uize.Color ('ff00ff');                               // hex
							Uize.Color ('#ff00ff');                              // #hex
							Uize.Color ('fuchsia');                              // name
							Uize.Color ([255,0,255]);                            // RGB array
							Uize.Color (0xff00ff);                               // RGB int
							Uize.Color ({red:255,green:0,blue:255});             // RGB object
							Uize.Color ('Rgb(255,0,255)');                       // RGB string
							Uize.Color ({'HSL array':[300,100,50]});             // HSL array
							Uize.Color ({hue:300,saturation:100,lightness:50});  // HSL object
							Uize.Color ('Hsl(300,100%,50%)');                    // HSL string
							..................................................................

							VARIATION 1
							.........................
							colorOBJ = Uize.Color ();
							.........................

							When no parameter is specified, then the instance will be initialized to black (in the =sRGB= color space).

							VARIATION 2
							................................................
							colorOBJ = Uize.Color (redINT,greenINT,blueINT);
							................................................

							When the three parameters =redINT=, =greenINT=, =blueINT= are specified, then the color will be initialized as though the arguments of the constructor represented an =RGB array= encoding.

							EXAMPLE
							........................................
							var
								yellow = Uize.Color (255,255,0),
								alsoYellow = Uize.Color ([255,255,0])
							;
							........................................

							NOTES
							- in addition to using the constructor, there are two other methods for `creating instances` of the =Uize.Color= object

						Instance Properties
							encoding
								A string, reflecting the name of the color encoding that is set for the instance.

								This is a read-only property. In order to change the color encoding for an instance, you should use the =setEncoding= instance method. The =setEncoding= method handles the conversions necessary when switching to an encoding in a different color space and will automatically transform the color component values contained inside the =tuple= array.

								NOTES
								- this is a read-only property
								- see the related =setEncoding= instance method

							tuple
								An array, containing typically three, but up to four floating point number elements, representing the values for the color components of the instance.

								This property can be accessed by code that wishes to perform color computations, or by code that wishes to encode a color value in a custom manner - not using any of the `color encodings` supported by the =Uize.Color= object. This property can also be useful when implementing extension modules.

								NOTES
								- for three component color spaces, the =tuple= array may still contain four elements, where the value of the fourth element is =NaN= or =undefined=
								- see the related =getTuple= instance method
					*/
				),
				_objectPrototype = _object.prototype
			;

		/*** Public Instance Methods ***/
			_objectPrototype.from = function (_color) {
				var _this = this;
				if (_color instanceof _object) {
					_this.encoding = _color.encoding;
					_setTupleFromArray (_color.tuple,_this.tuple);
				} else {
					var _encoding;
					if (arguments.length == 3) {
						_encoding = 'RGB array';
						_color = _cloneTuple (arguments); // NOTE: can't just assign arguments to _color, since color is the first argument, and doing so will make the first argument a reference to arguments
					} else {
						if (_color == _undefined || typeof _color == 'number') {
							_encoding = 'RGB int';
						} else if (typeof _color == 'string') {
							_createColorNamesLookupIfNecessary ();
							if (_colorNamesLookup [_color] || _colorNamesLookup [_color.toLowerCase ()]) {
								_encoding = 'name';
							} else {
								var _tupleMatch = _color.match (_tupleRegExp);
								_encoding = _tupleMatch
									? _tupleMatch [1].toUpperCase () + ' string'
									: _color.charCodeAt (0) == 35 ? '#hex' : 'hex'
								;
							}
						} else if (typeof _color == 'object') {
							if (_color.length) {
								_encoding = 'RGB array';
							} else if ('red' in _color) {
								_encoding = 'RGB object';
							} else if ('lightness' in _color) {
								_encoding = 'HSL object';
							} else {
								for (_encoding in _color) break;
								_color = _color [_encoding];
							}
						}
					}
					var _encodingProfile = _encodings [_encoding];
					if (!_encodingProfile) {
						_encodingProfile = _encodings [_encoding = 'RGB int'];
						_color = 0;
					}
					_encodingProfile.from (_color,_this.tuple);
					_this.encoding = _encoding;
				}

				return _this;
				/*?
					Instance Methods
						from
							Lets you set the color for the =Uize.Color= object instance from the specified color, by decoding the specified color as needed.

							SYNTAX
							........................................
							colorOBJ = colorOBJ.from (colorANYTYPE);
							........................................

							The color specified by the =colorANYTYPE= parameter can be specified using any of the many `color encodings` supported by the =Uize.Color= module. The following examples illustrate this variety and flexibility...

							EXAMPLES
							....................................................................
							myColor.from (Uize.Color (255,0,255));                 // color
							myColor.from ('ff00ff');                               // hex
							myColor.from ('#ff00ff');                              // #hex
							myColor.from ('fuchsia');                              // name
							myColor.from ([255,0,255]);                            // RGB array
							myColor.from (0xff00ff);                               // RGB int
							myColor.from ({red:255,green:0,blue:255});             // RGB object
							myColor.from ('Rgb(255,0,255)');                       // RGB string
							myColor.from ({hue:300,saturation:100,lightness:50});  // HSL object
							myColor.from ('Hsl(300,100%,50%)');                    // HSL string
							....................................................................

							The above statements would all set the color of the instance =myColor= to the color "fuchsia" (=#ff00ff=).

							VARIATION
							.................
							colorOBJ.from ();
							.................

							When no =colorANYTYPE= parameter is specified, the instance will be initialized to black (in the =sRGB= color space).

							TIP

							Because the =from= method returns the instance on which it is called, you can "daisy chain" method calls, as in...

							..............................................................
							fuchsiaHslObject = myColor.from ('fuchsia').to ('HSL object');
							..............................................................

							The above example first sets the =Uize.Color= object instance =myColor= to the color "fuchsia" and then encodes its value as =HSL object= and assigns that value to the variable =fuchsiaHslObject=.

							NOTES
							- see the related =Uize.Color.from= static method
				*/
			};

			_objectPrototype.getTuple = function (_encodingOrColorSpace) {
				var
					_oldEncodingColorSpaceProfile = _colorSpaces [_encodings [this.encoding].colorSpace],
					_newEncodingColorSpaceProfile = _encodingOrColorSpace
						?
							_colorSpaces [_encodingOrColorSpace] ||
							_colorSpaces [_encodings [_encodingOrColorSpace].colorSpace]
						:
							_oldEncodingColorSpaceProfile
				;
				return (
					_newEncodingColorSpaceProfile != _oldEncodingColorSpaceProfile
						? _newEncodingColorSpaceProfile.fromHsl (_oldEncodingColorSpaceProfile.toHsl (this.tuple))
						: this.tuple
				);
				/*?
					Instance Methods
						getTuple
							Returns an array, being the the tuple of color components for the instance, transformed for the specified color encoding or color space.

							SYNTAX
							........................................................
							tupleARRAY = myColor.getTuple (encodingOrColorSpaceSTR);
							........................................................

							If the color space of the instance's current encoding is the same as the color space defined by the =encodingOrColorSpaceSTR= parameter, then the value of the =tuple= instance property will be returned as is (ie. no transformation is performed). Otherwise, the necessary conversion functions will be employed to transform the instance's tuple for use in the desired color space.

							This method can be used by other methods that wish to blend, mix, or otherwise process multiple tuples in a single color space.

							VARIATION
							.................................
							tupleARRAY = myColor.getTuple ();
							.................................

							When no =encodingOrColorSpaceSTR= parameter is specified, then the value of the =tuple= instance property will be returned (ie. no transformation is performed).

							EXAMPLE
							................................
							myColor.getTuple ('HSL');
							myColor.getTuple ('HSL array');
							myColor.getTuple ('HSL string');
							................................

							In the above example, the same =HSL= color space is implied by all statements, so all statements will return the same result. Note that the particular encoding has no bearing on how the tuple is returned - it is always an array of the components of the color. So, the value ='HSL string'= for =encodingOrColorSpaceSTR= still results in the tuple array being returned.

							NOTES
							- see the related =tuple= and =encoding= instance properties
				*/
			};

			_objectPrototype.setEncoding = function (_newEncoding) {
				_setTupleFromArray (
					this.getTuple (_newEncoding && _newEncoding != 'color' ? _newEncoding : (_newEncoding = 'hex')),
					this.tuple
				);
				this.encoding = _newEncoding;
				return this;
				/*?
					Instance Methods
						setEncoding
							Lets you change the encoding for an instance.

							Changing the encoding for an instance will have no effect on the instance's =tuple= values if the new encoding is of the same color space as the current encoding. However, if the color spaces differ, then the =tuple= values will be converted to be in the color space of the new encoding.

							SYNTAX
							..................................
							myColor.setEncoding (encodingSTR);
							..................................

							NOTES
							- see the related =encoding= instance property
				*/
			};

			_objectPrototype.to = function (_newEncoding) {
				return (
					_newEncoding == 'color'
						? new _object (this)
						: _encodings [_newEncoding || this.encoding].to (this.getTuple (_newEncoding))
				);
				/*?
					Instance Methods
						to
							Returns the current color of the instance, encoded to the specified color encoding.

							SYNTAX
							.........................................
							encodedColor = colorOBJ.to (encodingSTR);
							.........................................

							The =encodingSTR= parameter supports a wide variety of different `color encodings`.

							EXAMPLES
							.............................................................................
							var fuchsia = Uize.Color ('fuchsia');
							fuchsia.to ('color');       // produces a new Uize.Color object
							fuchsia.to ('hex');         // produces 'ff00ff'
							fuchsia.to ('#hex');        // produces '#ff00ff'
							fuchsia.to ('name');        // produces 'fuchsia'
							fuchsia.to ('RGB array');   // produces [255,0,255]
							fuchsia.to ('RGB int');     // produces 16711935
							fuchsia.to ('RGB object');  // produces {red:255,green:0,blue:255}
							fuchsia.to ('RGB string');  // produces 'rgb(255,0,255)'
							fuchsia.to ('HSL array');   // produces [300,100,50]
							fuchsia.to ('HSL object');  // produces {hue:300,saturation:100,lightness:50}
							fuchsia.to ('HSL string');  // produces 'hsl(300,100,50)'
							.............................................................................

							NOTES
							- see the related =Uize.Color.to= static method
				*/
			};

		/*** Public Static Methods ***/
			_object.adapter = function (_aEncoding,_bEncoding) {
				return {
					aToB:function (_value) {return Uize.Color.to (Uize.pairUp (_aEncoding,_value),_bEncoding)},
					bToA:function (_value) {return Uize.Color.to (Uize.pairUp (_bEncoding,_value),_aEncoding)}
				}
				/*?
					Static Methods
						Uize.Color.adapter
							Returns a value adapter object,

							SYNTAX
							.................................................................
							valueAdapterOBJ = Uize.Color.adapter (aEncodingSTR,bEncodingSTR);
							.................................................................
				*/
			};

			_object.defineColors = function (_colorsToDefine) {
				Uize.copyInto (_colors,_colorsToDefine);
				_colorNamesLookup && _updateColorNamesLookup (_colorsToDefine);
				/*?
					Static Methods
						Uize.Color.defineColors
							Lets you define an arbitrary number of custom `named colors`, which will then be accessible to code that uses the =Uize.Color= module.

							SYNTAX
							.......................................
							Uize.Color.defineColors (colorsMapOBJ);
							.......................................

							When you extend this object with new named colors, it will then be possible to use the names of those colors when creating instances of the =Uize.Color= object, or when setting the color of =Uize.Color= instances using the =from= instance method.

							For more information, see the section `Defining New Named Colors`.

							NOTES
							- see the related =Uize.Color.colors= static property
							- over a hundred additional named colors - as defined in the SVG 1.0 and CSS 3 specifications - are defined in the =Uize.Color.xSvgColors= extension module
				*/
			};

			_object.from = function () {
				return _objectPrototype.from.apply (new _object,arguments)
				/*?
					Static Methods
						Uize.Color.from
							Returns a freshly minted instance of the =Uize.Color= object, whose color is initialized to the specified color, by decoding the specified color as needed.

							SYNTAX
							..........................................
							colorOBJ = Uize.Color.from (colorANYTYPE);
							..........................................

							The =Uize.Color.from= method is a factory method, is essentially equivalent to using the =Uize.Color= object's `constructor`, and is mainly provided to have parity with the =Uize.Color.to= static method.

							EXAMPLE
							...........................
							Uize.Color ('ff00ff');
							Uize.Color.from ('ff00ff');
							...........................

							The above two statements would both return new instances of the =Uize.Color= object initialized to the color "fuchsia" (=#ff00ff=).

							The color specified by the =colorANYTYPE= parameter can be specified using any of the many `color encodings` supported by the =Uize.Color= module. The following examples illustrate this variety and flexibility...

							EXAMPLES
							.......................................................................
							Uize.Color.from (Uize.Color (255,0,255));                 // color
							Uize.Color.from ('ff00ff');                               // hex
							Uize.Color.from ('#ff00ff');                              // #hex
							Uize.Color.from ('fuchsia');                              // name
							Uize.Color.from ([255,0,255]);                            // RGB array
							Uize.Color.from (0xff00ff);                               // RGB int
							Uize.Color.from ({red:255,green:0,blue:255});             // RGB object
							Uize.Color.from ('Rgb(255,0,255)');                       // RGB string
							Uize.Color.from ({hue:300,saturation:100,lightness:50});  // HSL object
							Uize.Color.from ('Hsl(300,100%,50%)');                    // HSL string
							.......................................................................

							The above statements would all return new instances of the =Uize.Color= object initialized to the color "fuchsia" (=#ff00ff=).

							VARIATION
							...................
							Uize.Color.from ();
							...................

							When no =colorANYTYPE= parameter is specified, the new instance will be initialized to black (in the =sRGB= color space).

							A Tip on Preserving Encoding
								There might be times when you want to set the color value for an instance using a color that is specified in a different encoding - possibly even in a different color space - but you don't wish to change the encoding of the instance.

								You can accomplish this by temporarily storing the instance's encoding, and then restoring it after setting the instance's color by using the =setEncoding= instance method, as in...

								EXAMPLE
								.......................................................
								var oldEncoding = myColor.encoding;
								myColor.from (newColorValue).setEncoding (oldEncoding);
								.......................................................

								Because the =from= instance method returns a reference to the instance, you can call the =setEncoding= method on the result.

							NOTES
							- see the related =from= instance method
				*/
			};

			var _cloneTuple = _object.cloneTuple = function (_tuple) {
				var _component3 = _tuple [3];
				return (
					isNaN (_component3) || _component3 == _undefined
						? [_tuple [0],_tuple [1],_tuple [2]]
						: [_tuple [0],_tuple [1],_tuple [2],_component3]
				);
				/*?
					Static Methods
						Uize.Color.cloneTuple
							A method that is useful in the development of color space or encoding extensions, and that returns a tuple array, being a clone of the specified source tuple array.

							SYNTAX
							......................................................
							clonedTupleARRAY = Uize.Color.cloneTuple (tupleARRAY);
							......................................................

							This method is intended primary for use in the implementation of `color encodings`.

							NOTES
							- see the related =Uize.Color.setTuple=, =Uize.Color.setTupleFromArray=, and =Uize.Color.setTupleFromString= static methods
				*/
			};

			var _setTuple = _object.setTuple = function (_tuple,_component0,_component1,_component2,_component3) {
				_tuple [0] = +_component0;
				_tuple [1] = +_component1;
				_tuple [2] = +_component2;
				_tuple [3] = +_component3;
				/*?
					Static Methods
						Uize.Color.setTuple
							A method that is useful in the development of color space or encoding extensions, and that copies the specified values for up to four components of a tuple into the specified tuple array.

							SYNTAX
							..................................................................
							Uize.Color.setTuple (
								tupleARRAY,
								component0FLOAT,component1FLOAT,component2FLOAT,component3FLOAT
							);
							..................................................................

							This method is intended primary for use in the implementation of `color encodings`.

							NOTES
							- see the related =Uize.Color.cloneTuple=, =Uize.Color.setTupleFromArray=, and =Uize.Color.setTupleFromString= static methods
				*/
			};

			var _setTupleFromArray = _object.setTupleFromArray = function (_array,_tuple) {
				_setTuple (_tuple,_array [0],_array [1],_array [2],_array [3]);
				/*?
					Static Methods
						Uize.Color.setTupleFromArray
							A method that is useful in the development of color space or encoding extensions, and that copies the values of the first four elements of the specified source array into the specified tuple array.

							SYNTAX
							......................................................
							Uize.Color.setTupleFromArray (sourceARRAY,tupleARRAY);
							......................................................

							This method is intended primary for use in the implementation of `color encodings`.

							NOTES
							- see the related =Uize.Color.cloneTuple=, =Uize.Color.setTuple=, and =Uize.Color.setTupleFromString= static methods
				*/
			};

			var _setTupleFromString = _object.setTupleFromString = function (_tupleStr,_tuple) {
				var _tupleMatch = _tupleStr.match (_tupleRegExp);
				_setTuple (
					_tuple,
					parseFloat (_tupleMatch [2]),
					parseFloat (_tupleMatch [3]),
					parseFloat (_tupleMatch [4]),
					parseFloat (_tupleMatch [5])
				);
				/*?
					Static Methods
						Uize.Color.setTupleFromString
							A method that is useful in the development of color space or encoding extensions, and that parses up to four color components from the specified source string and copies the values of those components into the specified tuple array.

							SYNTAX
							.....................................................
							Uize.Color.setTupleFromString (sourceSTR,tupleARRAY);
							.....................................................

							This method is intended primary for use in the implementation of `color encodings`.

							NOTES
							- see the related =Uize.Color.cloneTuple=, =Uize.Color.setTuple=, and =Uize.Color.setTupleFromArray= static methods
				*/
			};

			_object.to = function (_colorValue,_encoding) {
				return _dummyColor1.from (_colorValue).to (_encoding || 'hex')
				/*?
					Static Methods
						Uize.Color.to
							Encodes the specified color to the specified encoding / format.

							SYNTAX
							.......................................................................
							encodedColorANYTYPE = Uize.Color.to (colorToEncodeANYTYPE,encodingSTR);
							.......................................................................

							This method's return value can be of any type, and is determined by the encoding specified in the =encodingSTR= parameter, which supports a wide variety of different `color encodings`. Moreover, the color to be encoded, as specified by the =colorToEncodeANYTYPE= parameter, can be specified in any of the supported encodings.

							VARIATION
							..........................................................
							encodedColorHexSTR = Uize.Color.to (colorToEncodeANYTYPE);
							..........................................................

							When no =encodingSTR= parameter is specified, then the color specified by the =colorToEncodeANYTYPE= parameter will be encoded as =hex=.

							EXAMPLES
							..................................................................................
							Uize.Color.to ('fuchsia','color');        // produces a new Uize.Color object
							Uize.Color.to ('#f0f','HSL object');      // {hue:300,saturation:100,lightness:50}
							Uize.Color.to ('Rgb(255,0,255)','name');  // produces 'fuchsia'
							Uize.Color.to ('hsl(300,100,50)','#hex'); // produces '#ff00ff'
							Uize.Color.to ('ff00ff','HSL string');    // produces 'hsl(300,100,50)'
							Uize.Color.to ('fuchsia,'RGB string');    // produces 'rgb(255,0,255)'
							Uize.Color.to ([255,0,255],'hex');        // produces 'ff00ff'
							Uize.Color.to ([255,0,255]);              // produces 'ff00ff'
							..................................................................................

							These are just a few examples to illustrate the versatility of this method. Given the wide variety of different `color encodings` supported by the =Uize.Color= module, there are a great many permutations to this method - too numerous to list.

							NOTES
							- see the related =to= instance method
				*/
			};

		/*** Public Static Properties ***/
			/*** Color Spaces ***/
				var _colorSpaces = _object.colorSpaces = {
					/*?
						Static Properties
							Uize.Color.colorSpaces
								An object, containing definitions for `color spaces` supported by the =Uize.Color= object.

								In general, color spaces are not explicitly specified when working with =Uize.Color= instances. Instead, a color space is implied by a given color encoding. Encodings specify their associated color spaces, and the profile that defines a color space is utilized automatically when encoding across color spaces, such as when encoding a color object that was initialized in the =sRGB= color space as =HSL string=, as shown in the following example...

								EXAMPLE
								................................................................................
								var myRgbColor = Uize.Color ('#ff00ff');
								alert (myRgbColor.to ('HSL string'));  // displays "Hsl(300,100%,50%)" in dialog
								................................................................................

								You can define your own color spaces by extending the =Uize.Color.colorSpaces= static property. For more information, see the section `Defining New Color Spaces`.

								NOTES
								- compare to the =Uize.Color.encodings= static property

						Color Spaces
							The =Uize.Color= object provides a foundation for supporting multiple color spaces, and supports two built-in color spaces: =sRGB= and =HSL=.

							A [[http://en.wikipedia.org/wiki/Color_space][color space]] provides a way to represent colors, and is the combination of a [[http://en.wikipedia.org/wiki/Color_model][color model]] and a mapping function. Certain color spaces are better suited to specific applications, and a wide variety of color spaces exist. In the computer world, =sRGB= is the dominant color space and is based around an additive color model. In the print world, =CMYK= is a dominant color space and is based around a subtractive color model.


					*/
					sRGB:{
						fromHsl:function (_tuple) {
							// http://en.wikipedia.org/wiki/HSL_color_space
							var
								_saturation = _tuple [1] / 100,
								_lightness = _tuple [2] / 100
							;
							if (_saturation) {
								var
									_temp1 = _lightness < .5
										? _lightness * (1 + _saturation)
										: _lightness + _saturation - _lightness * _saturation,
									_temp2 = 2 * _lightness - _temp1
								;
								var
									_hue = _tuple [0] / 360,
									_computeChannel = function (_level) {
										return (
											(_level = (_level + 1) % 1) < 1 / 6
												? _temp2 + (_temp1 - _temp2) * 6 * _level
												: _level < .5
													? _temp1
													: _level < 2 / 3
														? _temp2 + (_temp1 - _temp2) * 6 * (2 / 3 - _level)
														: _temp2
										) * 255;
									}
								;
								return [_computeChannel (_hue + 1 / 3),_computeChannel (_hue),_computeChannel (_hue - 1 / 3)];
							} else {
								var _channelLevel = _lightness * 255;
								return [_channelLevel,_channelLevel,_channelLevel];
							}
						},
						toHsl:function (_tuple) {
							// http://en.wikipedia.org/wiki/HSL_color_space
							var
								_redLevel = _tuple [0] / 255,
								_greenLevel = _tuple [1] / 255,
								_blueLevel = _tuple [2] / 255,
								_maxLevel = Math.max (_redLevel,_greenLevel,_blueLevel),
								_minLevel = Math.min (_redLevel,_greenLevel,_blueLevel),
								_maxMinLevelSum = _maxLevel + _minLevel,
								_maxMinLevelDelta = _maxLevel - _minLevel,
								_hue = 0,
								_saturation = 0,
								_lightness = _maxMinLevelSum / 2
							;
							if (_maxMinLevelDelta) {
								_saturation = _maxMinLevelDelta / (_lightness < .5 ? _maxMinLevelSum : 2 - _maxMinLevelSum);
								_hue =
									(
										(
											_redLevel == _maxLevel
												? 6 + (_greenLevel - _blueLevel) / _maxMinLevelDelta
												: _greenLevel == _maxLevel
													? 2 + (_blueLevel - _redLevel) / _maxMinLevelDelta
													: 4 + (_redLevel - _greenLevel) / _maxMinLevelDelta
										) * 60
									) % 360
								;
							}
							function _levelToPercent (_level) {return Uize.constrain (_level * 100,0,100)}
							return [_hue,_levelToPercent (_saturation),_levelToPercent (_lightness)];
						},
						tuple:[
							{name:'red',min:0,max:255},
							{name:'green',min:0,max:255},
							{name:'green',min:0,max:255}
						]
						/*?
							Color Spaces
								sRGB
									The =Uize.Color.colorSpaces.sRGB= property defines the [[http://en.wikipedia.org/wiki/SRGB][sRGB]] (standard RGB) color space.

									sRGB is the recommended color space for the Internet and is the color space used by the [[http://www.w3.org/TR/CSS21/colors.html][CSS 2.1 color specification]]. Because of this, it is also the default working color space for many digital cameras, phones, scanners, and other electronics devices.

						*/
					},
					HSL:{
						fromHsl:Object, // when called as a function with an object argument, Object just returns argument
						toHsl:Object,
						tuple:[
							{name:'hue',min:0,max:360},
							{name:'saturation',min:0,max:100},
							{name:'lightness',min:0,max:100}
						]
						/*?
							Color Spaces
								HSL
									The =Uize.Color.colorSpaces.HSL= property defines the [[http://en.wikipedia.org/wiki/HSL_color_space][HSL]] (Hue, Saturation, Lightness) color space.

									The HSL color space is essentially an alternate representation / mapping of the =sRGB= color space, but might be considered to be a more intuitive representation of the qualities of color. Because of the benefits of this color space, it has been adopted in the [[http://www.w3.org/TR/css3-color/#hsl-color][CSS 3 color specification]] as another accepted way of specifying colors.
						*/
					}
					/*?
						Color Spaces
							Additional Color Spaces
								Additional color spaces are made available through extension modules, such as the =Uize.Color.xHsv= module that defines the =HSV= color space.

								Implementing color spaces in extension modules avoids burdening the core code with having to support less common / more esoteric color spaces that are not as frequently used. This also allows applications built on the UIZE JavaScript Framework to be better optimized for code size.

							Defining New Color Spaces
								You can extend the =Uize.Color.colorSpaces= object in order to define new `color spaces`.

								This can be done quite easily by setting a new property on the =Uize.Color.colorSpaces= object, as follows...

								EXAMPLE
								....................................................................
								Uize.Color.colorSpaces.CMYK = {
									fromHsl:function (_tuple) {
										// this function should accept a tuple in the HSL colorspace
										// and should return a new tuple that represents the color
										// transformed to the CMYK color space
									},
									toHsl:function (_tuple) {
										// this function should accept a tuple in the CMYK color space
										// and should return a new tuple that represents the color
										// transformed to the HSL color space
									},
									tuple:[
										{name:'cyan',min:0,max:100},
										{name:'magenta',min:0,max:100},
										{name:'yellow',min:0,max:100},
										{name:'black',min:0,max:100}
									]
								}
								....................................................................

								Typically one will define a new color space and also define new `color encodings` to accompany the new color space. The new encodings should specify the name of their associated color space in their =colorSpace= property.

								The object that describes a color space is called a color space profile, and should have the following properties...

								- =fromHsl= - This is a function that should accept a tuple in the =HSL= colorspace and should return a new tuple that represents the color transformed to your color space.

								- =toHsl= - This function should accept a tuple in your color space and should return a new tuple that represents the color transformed to the =HSL= color space.

								- =tuple (profile)= - This is an object that provides a profile for the tuple of color components of the color space - the "dimensions" of the color space, if you will. The tuple profile is an array of objects, one for each component of the color space, where each object is a profile for a component and should contain "name", "min", and "max" properties. The "name" property for a component profile is self-explanatory, and the "min" and "max" properties define the value range for the component.

								The =fromHsl= and =toHsl= conversion functions that you provide as part of a color space profile are used for converting a tuple back and forth between your color space and the =HSL= color space. The =HSL= color space is essentially used as a canonical color space - a kind of "conduit" through which colors are converted in order to convert across `color spaces`. This avoids having to have an ever increasing number of cross conversion functions for every defined color space to every other. For example, if a =CMYK= color space were defined, then conversion from =sRGB= to =CMYK= would first involve conversion from =sRGB= to =HSL=, and then =HSL= to =CMYK=.
					*/
				};

			/*** Encodings ***/
				function _setTupleFromRgbHex (_color,_tuple) {
					if (_color.charCodeAt (0) == 35)
						_color = _color.slice (1) // strip "#"
					;
					var _hexDigits = _color.length;
					_color = '0x' + _color - 0;
					_hexDigits == 1
						? _setTuple (_tuple,_color *= 17,_color,_color)
						: _hexDigits == 3
							? _setTuple (_tuple,((_color >> 8) & 15) * 17,((_color >> 4) & 15) * 17,(_color & 15) * 17)
							: _setTuple (_tuple,(_color >> 16) & 255,(_color >> 8) & 255,_color & 255)
					;
				}

				var _encodings = _object.encodings = {
					/*?
						Color Encodings
							The =Uize.Color= module supports a wide variety of different color encodings / formats.

							For methods that have color parameters, color values for these parameters can be flexibly specified in any of the many supported encodings. Additionally, many of the methods that produce a color as a result allow an encoding to optionally be specified for that return value.

							Supported encodings are as follows...

							color
								An instance of the =Uize.Color= object.

								Encoding
									When a color is encoded as =color=, an instance of the =Uize.Color= object is created with its color initialized to that of the encoding source.

									...........................................
									<< table >>

									title: EXAMPLES
									data
									:| COLOR NAME   |  color                  |
									:| fuchsia      |  Uize.Color ('fuchsia') |
									:| yellow       |  Uize.Color ('yellow')  |
									:| blue         |  Uize.Color ('blue')    |
									:| white        |  Uize.Color ('white')   |
									...........................................

								Decoding
									When a color is decoded from =color=, the value of the source =Uize.Color= object instance's =encoding= property and the component values in its =tuple= property are used for the resulting =Uize.Color= object.

						Static Properties
							Uize.Color.encodings
								An object, containing definitions for color encodings supported by the =Uize.Color= object.

								The =Uize.Color= object defines a wide variety of built-in encodings. For the full list, consult the section `Color Encodings`. You can also define your own color encoding by extending the =Uize.Color.encodings= static property. For more information, see the section `Defining New Color Encodings`.

								NOTES
								- see the related =Uize.Color.colorSpaces= static property
					*/
					hex:{
						colorSpace:'sRGB',
						from:_setTupleFromRgbHex,
						to:function (_tuple) {
							return (0x1000000 + _encodings ['RGB int'].to (_tuple)).toString (16).slice (1);
						}
						/*?
							Color Encodings
								hex
									A six digit, three digit, or one digit hexadecimal string (eg. the color chartreuse is encoded as ='7fff00'=).

									Encoding
										When a color is encoded as =hex=, the hexadecimal number always contains six digits and is all lowercase.

										...........................
										<< table >>

										title: EXAMPLES
										data
										:| COLOR NAME  |  hex     |
										:| fuchsia     |  ff00ff  |
										:| yellow      |  ffff00  |
										:| blue        |  0000ff  |
										:| white       |  ffffff  |
										...........................

									Decoding
										When a color is decoded from =hex=, the hexadecimal number may be specified using only one digit, three digits, or six digits, the "#" (pound) character is optional, and the digits may be in upper, lower, or mixed case (ie. *not* case sensitive).

										.................................................................................
										<< table >>

										title: WHITE
										data
										:| lowercase  |  UPPERCASE  |  #lowercase  |  #UPPERCASE  |  MiXeD  |  #MiXeD   |
										:| ffffff     |  FFFFFF     |  #ffffff     |  #FFFFFF     |  FfFfFf |  #FfFfFf  |
										:| fff        |  FFF        |  #fff        |  #FFF        |  FfF    |  #FfF     |
										:| f          |  F          |  #f          |  #F          |         |           |
										.................................................................................
									*/
					},
					'#hex':{
						colorSpace:'sRGB',
						from:_setTupleFromRgbHex,
						to:function (_tuple) {return '#' + _encodings.hex.to (_tuple)}
						/*?
							Color Encodings
								#hex
									A six digit, three digit, or one digit hexadecimal string, with a "#" (pound) character prefixed (eg. the color chartreuse is encoded as ='#7fff00'=).

									Encoding
										When a color is encoded as =#hex=, the hexadecimal number always contains six digits, is all lowercase, and is prefixed with a "#" (pound) character.

										............................
										<< table >>

										title: EXAMPLES
										data
										:| COLOR NAME  |  #hex     |
										:| fuchsia     |  #ff00ff  |
										:| yellow      |  #ffff00  |
										:| blue        |  #0000ff  |
										:| white       |  #ffffff  |
										............................

									Decoding
										When a color is decoded from =#hex=, the hexadecimal number may be specified using only one digit, three digits, or six digits, the "#" (pound) character is optional, and the digits may be in upper, lower, or mixed case (ie. *not* case sensitive).

										.................................................................................
										<< table >>

										title: WHITE
										data
										:| lowercase  |  UPPERCASE  |  #lowercase  |  #UPPERCASE  |  MiXeD  |  #MiXeD   |
										:| ffffff     |  FFFFFF     |  #ffffff     |  #FFFFFF     |  FfFfFf |  #FfFfFf  |
										:| fff        |  FFF        |  #fff        |  #FFF        |  FfF    |  #FfF     |
										:| f          |  F          |  #f          |  #F          |         |           |
										.................................................................................
						*/
					},
					name:{
						colorSpace:'sRGB',
						from:function (_colorName,_tuple) {
							_createColorNamesLookupIfNecessary ();
							var _resolvedColorName;
							if (
								(_resolvedColorName = _colorNamesLookup [_colorName]) ||
								(
									(_resolvedColorName = _colorNamesLookup [_colorName.toLowerCase ()]) &&
									(_colorNamesLookup [_colorName] = _resolvedColorName)
								)
							)
								_encodings ['RGB int'].from (_colors [_resolvedColorName],_tuple)
							;
						},
						to:function (_tuple) {
							_createColorNamesLookupIfNecessary ();
							return _colorNamesLookup [_encodings ['RGB int'].to (_tuple)] || _encodings.hex.to (_tuple);
						}
						/*?
							Color Encodings
								name
									A string, representing the name for a color (eg. the color chartreuse is encoded as ='chartreuse'=).

									Encoding
										When a color is encoded as =name=, the name string is camelCase. If no named color is defined that matches the color being encoded, then the encoding source will be encoded as =hex= as a fallback.

										............................
										<< table >>

										title: EXAMPLES
										data
										:| COLOR NAME  |  name     |
										:| fuchsia     |  fuchsia  |
										:| yellow      |  yellow   |
										:| blue        |  blue     |
										:| white       |  white    |
										............................

									Decoding
										When a color is decoded from =name=, the name may be in upper, lower, or mixed case (ie. *not* case sensitive). If no named color is defined by the name specified, then the color will be decoded as black (in the =sRGB= color space).

										EXAMPLES
										.......
										fuchsia
										YELLOW
										Blue
										whITE
										.......

									NOTES
									- for a list of all the color names supported by the =Uize.Color= module, see the section `Named Colors`
									- further named colors may be defined using the =Uize.Color.defineColors= static method (see the section `Defining New Named Colors`)
									- over a hundred additional named colors - as defined in the SVG 1.0 and CSS 3 specifications - are defined in the =Uize.Color.xSvgColors= extension module
						*/
					},
					'RGB array':{
						colorSpace:'sRGB',
						from:_setTupleFromArray,
						to:_cloneTuple
						/*?
							Color Encodings
								RGB array
									An array, containing three elements for the red, green, and blue channels of an =sRGB= color, whose values are integers (eg. the color chartreuse is encoded as =[127,255,0]=).

									Encoding
										When a color is encoded as =RGB array=, the resulting array is made up of three number type elements that represent the values of the source color's red, green, and blue channels, respectively.

										..................................
										<< table >>

										title: EXAMPLES
										data
										:| COLOR NAME  |  RGB array      |
										:| fuchsia     |  [255,0,255]    |
										:| yellow      |  [255,255,0]    |
										:| blue        |  [0,0,255]      |
										:| white       |  [255,255,255]  |
										..................................

									Decoding
										When a color is decoded from =RGB array=, the values of the array's three elements may be numbers, strings, or any object that implements a =valueOf interface= (such as an instance of a =Uize.Class= subclass that implements the =value= state property).

										EXAMPLES
										..................................
										[255,0,255]         // fuchsia
										[255.5,0.23,254.7]  // fuchsia
										['255','0','255']   // fuchsia
										[redSlider,greenSlider,blueSlider]
										..................................

										NOTES
										- the values of the color components will be coerced to number type by invoking the =valueOf Intrinsic Method=
						*/
					},
					'RGB int':{
						colorSpace:'sRGB',
						from:function (_rgbInt,_tuple) {
							_rgbInt = Uize.constrain (Math.round (_rgbInt),0,16777215);
							_setTuple (_tuple,(_rgbInt >> 16) & 255,(_rgbInt >> 8) & 255,_rgbInt & 255);
						},
						to:function (_tuple) {
							return (_byte (_tuple [0]) << 16) + (_byte (_tuple [1]) << 8) + _byte (_tuple [2]);
						}
						/*?
							Color Encodings
								RGB int
									An integer in the range of =0= to =16777215=, corresponding in value to the hexadecimal RGB representation of a color (eg. the color chartreuse is encoded as =8388352=, which is equivalent to the hex number representation =0x7fff00=).

									Encoding
										When a color is encoded as =RGB int=, it is calculated as =red &#42; 65536 + green &#42; 255 + blue=.

										.............................
										<< table >>

										title: EXAMPLES
										data
										:| COLOR NAME  |  RGB int   |
										:| fuchsia     |  16711935  |
										:| yellow      |  16776960  |
										:| blue        |  255       |
										:| white       |  16777215  |
										.............................

									Decoding
										When a color is decoded from =RGB int=, the value is first rounded and then constrained to the range of =0= to =16777215=.

										EXAMPLES
										.....................
										16711935   // fuchsia
										0xff00ff   // fuchsia
										.....................

										*TIP:* When specifying colors as =RGB int=, you can use JavaScript's facility for specifying numbers in hexadecimal format using the "0x" prefix. This way, you're specifying an integer that looks exactly like a =hex= or =#hex= encoded RGB color value, but with the benefit of not using a more costly (in terms of performance) string.
						*/
					},
					'RGB object':{
						colorSpace:'sRGB',
						from:function (_rgbObject,_tuple) {
							_setTuple (_tuple,_rgbObject.red,_rgbObject.green,_rgbObject.blue);
						},
						to:function (_tuple) {return {red:_tuple [0],green:_tuple [1],blue:_tuple [2]}}
						/*?
							Color Encodings
								RGB object
									An object, containing =red=, =green=, and =blue= properties for the three =sRGB= channels, whose values are integers (eg. the color chartreuse is encoded as ={red:127,green:255,blue:0}=).

									Encoding
										When a color is encoded as =RGB object=, the resulting object will contain the three number type properties =red=, =green=, and =blue=, reflecting the values of the source color's red, green, and blue channels.

										.................................................
										<< table >>

										title: EXAMPLES
										data
										:| COLOR NAME  |  RGB object                    |
										:| fuchsia     |  {red:255,green:0,blue:255}    |
										:| yellow      |  {red:255,green:255,blue:0}    |
										:| blue        |  {red:0,green:0,blue:255}      |
										:| white       |  {red:255,green:255,blue:255}  |
										.................................................

									Decoding
										When a color is decoded from =RGB object=, the values of the object's =red=, =green=, and =blue= properties may be numbers, strings, or any object that implements a =valueOf interface= interface (such as an instance of a =Uize.Class= subclass that implements the =value= state property).

										EXAMPLES
										.................................................
										{red:255,green:0,blue:255}         // fuchsia
										{red:255.5,green:0.23,blue:254.7}  // fuchsia
										{red:'255',green:'0',blue:'255'}   // fuchsia
										{red:redSlider,green:greenSlider,blue:blueSlider}
										.................................................

										NOTES
										- the values of the color components will be coerced to number type by invoking the =valueOf Intrinsic Method=
										- the property names of the source =RGB object= must be all lowercase
						*/
					},
					'RGB string':{
						colorSpace:'sRGB',
						from:_setTupleFromString,
						to:function (_tuple) {
							return 'rgb(' + _byte (_tuple [0]) + ',' + _byte (_tuple [1]) + ',' + _byte (_tuple [2]) +')';
						}
						/*?
							Color Encodings
								RGB string
									An =Rgb(...)= formatted CSS color style property value (eg. the color chartreuse is encoded as ='rgb(127,255,0)'=)

									Encoding
										When a color is encoded as =RGB string=, the resulting string will always be all lowercase, without any spaces, and the values of the red, green, and blue components will be rounded and constrained to the range of =0= to =255=.

										.....................................
										<< table >>

										title: EXAMPLES
										data
										:| COLOR NAME  |  RGB string        |
										:| fuchsia     |  rgb(255,0,255)    |
										:| yellow      |  rgb(255,255,0)    |
										:| blue        |  rgb(0,0,255)      |
										:| white       |  rgb(255,255,255)  |
										.....................................

									Decoding
										When a color is decoded from =RGB string=, the string may contain separating spaces, and may be in upper, lower, or mixed case (ie. *not* case sensitive).

										FUCHSIA
										.....................
										rgb(255,0,255)
										RGB(255,0,255)
										Rgb (255, 0, 255)
										RGB ( 255 , 0 , 255 )
										.....................
						*/
					},
					'HSL array':{
						colorSpace:'HSL',
						from:_setTupleFromArray,
						to:_cloneTuple
						/*?
							Color Encodings
								HSL array
									An array, containing three elements for hue, saturation, and lightness, whose values may be floating point numbers (eg. the color chartreuse is encoded as =[90.11764705882354,100,50]=), and that specifies a color in the =HSL= color space.

									Encoding
										When a color is encoded as =HSL array=, the resulting array is made up of three number type elements that represent the values of the source color's hue, saturation, and lightness, respectively.

										.................................
										<< table >>

										title: EXAMPLES
										data
										:| COLOR NAME  |  HSL array     |
										:| fuchsia     |  [300,100,50]  |
										:| yellow      |  [60,100,50]   |
										:| blue        |  [240,100,50]  |
										:| white       |  [0,0,100]     |
										.................................

									Decoding
										When a color is decoded from =HSL array=, the values of the array's three elements may be numbers, strings, or any object that implements a =valueOf interface= interface (such as an instance of a =Uize.Class= subclass that implements the =value= state property).

										EXAMPLES
										............................................
										[300,100,50]         // fuchsia
										['300','100','50']   // fuchsia
										[hueSlider,saturationSlider,lightnessSlider]
										............................................

										NOTES
										- the values of the color components will be coerced to number type by invoking the =valueOf Intrinsic Method=
										- string values for the saturation and lightness components in the array *may not* contain a "%" (percent) suffix
						*/
					},
					'HSL object':{
						colorSpace:'HSL',
						from:function (_hslObject,_tuple) {
							_setTuple (_tuple,_hslObject.hue,_hslObject.saturation,_hslObject.lightness);
						},
						to:function (_tuple) {return {hue:_tuple [0],saturation:_tuple [1],lightness:_tuple [2]}}
						/*?
							Color Encodings
								HSL object
									An object, containing =hue=, =saturation=, and =lightness= properties, whose values may be floating point numbers (eg. the color chartreuse is encoded as ={hue:90.11764705882354,saturation:100,lightness:50}=), and that specifies a color in the =HSL= color space.

									Encoding
										When a color is encoded as =HSL object=, the resulting object will contain the three number type properties =hue=, =saturation=, and =lightness=, reflecting the values of the source color's hue, saturation, and lightness.

										..........................................................
										<< table >>

										title: EXAMPLES
										data
										:| COLOR NAME  |  HSL object                             |
										:| fuchsia     |  {hue:300,saturation:100,lightness:50}  |
										:| yellow      |  {hue:60,saturation:100,lightness:50}   |
										:| blue        |  {hue:240,saturation:100,lightness:50}  |
										:| white       |  {hue:0,saturation:0,lightness:100}     |
										..........................................................

									Decoding
										When a color is decoded from =HSL object=, the values of the object's =hue=, =saturation=, and =lightness= properties may be numbers, strings, or any object that implements a =valueOf interface= interface (such as an instance of a =Uize.Class= subclass that implements the =value= state property).

										EXAMPLES
										.....................................................................
										{hue:300,saturation:100,lightness:50}         // fuchsia
										{hue:'300',saturation:'100',lightness:'50'}   // fuchsia
										{hue:hueSlider,saturation:saturationSlider,lightness:lightnessSlider}
										.....................................................................

										NOTES
										- the values of the color components will be coerced to number type by invoking the =valueOf Intrinsic Method=
										- string values for the saturation and lightness components in the array *may not* contain a "%" (percent) suffix
										- the property names of the source =RGB object= must be all lowercase
						*/
					},
					'HSL string':{
						colorSpace:'HSL',
						from:_setTupleFromString,
						to:function (_tuple) {
							function _percentStr (_percent) {return Uize.constrain (Math.round (_percent),0,100) + '%'}
							return (
								'hsl(' +
									Math.round (_tuple [0]) + ',' +
									_percentStr (_tuple [1]) + ',' +
									_percentStr (_tuple [2]) +
								')'
							);
						}
						/*?
							Color Encodings
								HSL string
									An =Hsl(...)= formatted CSS color style property value (eg. the color chartreuse is encoded as ='hsl(90,100%,50%)'=) that specifies a color in the =HSL= color space.

									Encoding
										When a color is encoded as =HSL string=, the resulting string will always be all lowercase, without any spaces.

										Furthermore, the values for hue, saturation, and lightness will be rounded to the nearest integer, and a "%" (percent symbol) character will be appended to the values for saturation and lightness.

										......................................
										<< table >>

										title: EXAMPLES
										data
										:| COLOR NAME  |  HSL string         |
										:| fuchsia     |  hsl(300,100%,50%)  |
										:| yellow      |  hsl(60,100%,50%)   |
										:| blue        |  hsl(240,100%,50%)  |
										:| white       |  hsl(0,0%,100%)     |
										......................................

										NOTES
										- because encoding as =HSL string= rounds the values for hue, saturation, and lightness, colors encoded as =HSL string= may not produce exactly the same original color when decoding the encoded =HSL string=

									Decoding
										When a color is decoded from =HSL string=, the string may contain separating spaces, may be in upper, lower, or mixed case (ie. *not* case sensitive), and the "%" (percent symbol) character for the saturation and lightness values may be omitted.

										FUCHSIA
										........................
										hsl(300,100,50)
										hsl(300,100%,50%)
										HSL(300,100%,50%)
										Hsl (300, 100%, 50%)
										HSL ( 300 , 100% , 50% )
										Hsl ( 300 , 100 , 50 )
										........................
						*/
					}
					/*?
						Color Encodings
							Defining New Color Encodings
								You can extend the =Uize.Color.encodings= object in order to define new color encodings.

								This can be done quite easily by setting a new property on the =Uize.Color.encodings= object, as follows...

								EXAMPLE
								..................................................................
								Uize.Color.encodings ['RGB float array'] = {
									colorSpace:'sRGB',
									from:function (_colorValue,_tuple) {
										_tuple [0] = _colorValue [0] * 255;
										_tuple [1] = _colorValue [1] * 255;
										_tuple [2] = _colorValue [2] * 255;
									},
									to:function (_tuple) {
										return [_tuple [0] / 255,_tuple [1] / 255,_tuple [2] / 255];
									}
								}
								..................................................................

								The above example defines an encoding named "RGB float aray", where the three elements of the array represent the values of the red, green, and blue channels as floating point numbers in the range of =0= to =1=. So, whereas the statement =Uize.Color.to ('purple','RGB array')= would produce the result =[128,0,128]=, the statement =Uize.Color.to ('purple','RGB float array')= would produce the result =[0.5019607843137255,0,0.5019607843137255]=. Conversely, the statement =Uize.Color.to ({'RGB float array':[.5,0,.5]},'name')= would produce the result ='purple'=.

								The object that describes a color encoding is called a color encoding profile, and should have the following properties...

								- =colorSpace= - This is the name of the color space that is associated with the encoding, and should be one of the `color spaces` defined in the =Uize.Color.colorSpaces= static property.

								- =from (decoder function)= - This is a function that should set the values of the elements of the provided tuple array, based upon the provided color value. The function should expect two parameters: 1) the color value, and 2) the tuple. The function should decode (ie. process or parse) the color value as needed in order to set the appropriate values for the components of the color in the provided tuple array. The function does not need to return anything, and anything it returns will be ignored.

								- =to (encoder function)= - This is a function that should use the values for the components of the color in the provided tuple array, and encode them as needed in order to produce a color value. The encoded color value should then be returned by the function.
					*/
				};

			/*** Colors ***/
				var _colors = _object.colors = {
					white:   16777215, // 0xffffff
					silver:  12632256, // 0xc0c0c0
					gray:     8421504, // 0x808080
					black:          0, // 0x000000
					navy:         128, // 0x000080
					blue:         255, // 0x0000ff
					aqua:       65535, // 0x00ffff
					teal:       32896, // 0x008080
					green:      32768, // 0x008000
					olive:    8421376, // 0x808000
					lime:       65280, // 0x00ff00
					maroon:   8388608, // 0x800000
					red:     16711680, // 0xff0000
					orange:  16753920, // 0xffa500
					yellow:  16776960, // 0xffff00
					purple:   8388736, // 0x800080
					fuchsia: 16711935  // 0xff00ff
					/*?
						Static Properties
							Uize.Color.colors
								An object, containing presets for the standard color names supported in the CSS 2.1 specification.

								Named colors defined in the =Uize.Color.colors= object can be used wherever color values can be specified in the methods of the =Uize.Color= object, and other modules that use this object for resolving color values.

								EXAMPLE
								.....................................................................
								Uize.Color ('yellow');                  // source encoding is name
								Uize.Color (Uize.Color.colors.yellow);  // source encoding is RGB int
								.....................................................................

								In the above example, each of the statements would create a new instance of the =Uize.Color= object initialized to primary yellow. In the first statement, the color yellow is specified using the =name= encoding. In the second statement, however, the color is specified using the =RGB int= encoding. That's because the values of the properties of the =Uize.Color.colors= static property are actually integers representing the RGB values of the colors.

								For more information, see the section `Named Colors`. You can also define your own named colors by extending the =Uize.Color.colors= static property. For more information, see the section `Defining New Named Colors`.

								NOTES
								- see the related =Uize.Color.defineColors= static method
								- over a hundred additional named colors - as defined in the SVG 1.0 and CSS 3 specifications - are defined in the =Uize.Color.xSvgColors= extension module

						Named Colors
							The =Uize.Color= object defines a set of seventeen standard named colors (as defined in the [[http://www.w3.org/TR/CSS21/syndata.html#value-def-color][CSS 2.1 color specification]]) in the =Uize.Color.colors= object.

							.............................
							<< table >>

							title: NAMED COLORS
							data
							:| COLOR NAME  |  HEX VALUE |
							:| white       |   #ffffff  |
							:| silver      |   #c0c0c0  |
							:| gray        |   #808080  |
							:| black       |   #000000  |
							:| navy        |   #000080  |
							:| blue        |   #0000ff  |
							:| aqua        |   #00ffff  |
							:| teal        |   #008080  |
							:| green       |   #008000  |
							:| olive       |   #808000  |
							:| lime        |   #00ff00  |
							:| maroon      |   #800000  |
							:| red         |   #ff0000  |
							:| orange      |   #ffa500  |
							:| yellow      |   #ffff00  |
							:| purple      |   #800080  |
							:| fuchsia     |   #ff00ff  |
							.............................

							Using Named Colors
								Named colors defined in the =Uize.Color.colors= object can be used wherever color values can be specified in the methods of the =Uize.Color= object, and other modules that use this object for resolving color values.

								EXAMPLE 1
								.....................................
								var myColor = Uize.Color ('fuchsia');
								.....................................

								In the above example, the =Uize.Color= instance =myColor= is being initialized to the color "fuchsia" (=#ff00ff=).

								EXAMPLE 2
								......................................................
								var fuchsiaAsHexStr = Uize.Color.to ('fuchsia','hex');
								......................................................

								In the above example, the color "fuchsia" is being converted to a hexadecimal string using the =hex= encoding.

								EXAMPLE 3
								..............................................................................
								Uize.Fx.fadeStyle ('myNodeId',{borderColor:'purple'},{borderColor:'fuchsia'});
								..............................................................................

								Because the =Uize.Color= module is used by other modules, such as the =Uize.Fx= module, it is also possible to use color names when specifying the values of color CSS style properties for fade effects.

							Additional Named Colors
								Additional named colors are made available through extension modules, such as the =Uize.Color.xSvgColors= module that defines the SVG 1.0 / CSS 3 named colors.

								Over a hundred additional named colors - as defined in the SVG 1.0 and CSS 3 specifications - are defined in the =Uize.Color.xSvgColors= extension module. Implementing further named colors in extension modules avoids burdening the core code with having to support less frequently used color sets. This also allows applications built on the UIZE JavaScript Framework to be better optimized for code size.

							Defining New Named Colors
								You can extend the =Uize.Color.colors= object using the =Uize.Color.defineColors= static method in order to add your own named colors, which will then be accessible to code that uses the =Uize.Color= module.

								EXAMPLE
								.............................................................................
								Uize.Color.defineColors ({darkmagenta:0x8b008b,lavenderblush:0xfff0f5});
								Uize.Fx.fadeStyle ('myNodeId',{color:'darkmagenta'},{color:'lavenderblush'});
								.............................................................................

								Case Doesn't Matter
									When extending the =Uize.Color.colors= object, the names of added colors can be in mixed case.

									Regardless of the case of the color names you define, it will be possible to specify those newly defined colors by using names that are equivalent but have different case. So, for example, if you define a color by the name ='BabyPukeYellow'=, it will then be possible to specify that color by the names ='babypukeyellow'=, ='babyPukeYellow'=, ='BABYPUKEYELLOW'=, etc.

								Specify Color Values as RGB int
									When extending the =Uize.Color.colors= object by defining new colors, the values of added colors should be specified in the =RGB int= encoding.

									You can use JavaScript's hexadecimal notation for convenience, so that the =RGB int= encoding resembles the =hex= or =#hex= encodings. The following examples illustrate incorrect versus correct ways of specifying color values when defining colors...

									INCORRECT
									.................................................................................
									Uize.Color.defineColors ({lavenderblush:'#fff0f5'});  // DON'T USE OTHER ENCODING
									.................................................................................

									CORRECT
									................................................................
									Uize.Color.defineColors ({
										darkmagenta   : 0x8b008b,   // OK TO USE HEX FORMATTED NUMBER
										lavenderblush : 16773365    // OK TO USE DECIMAL NUMBER
									});
									................................................................

								NOTES
								- see the related =Uize.Color.colors= static property
								- see the related =Uize.Color.defineColors= static method
								- over a hundred additional named colors - as defined in the SVG 1.0 and CSS 3 specifications - are defined in the =Uize.Color.xSvgColors= extension module
					*/
				};

		/*** dummy color objects for mixing and conversion ***/
			var
				_dummyColor1 = new _object,
				_dummyColor2 = new _object
			;

		return _object;
	}
});

