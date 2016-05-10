/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Color.xUtil Object Extension
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)1997-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Extension
	importance: 2
	codeCompleteness: 90
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Color.xUtil= module is an extension module that extends the =Uize.Color= object by adding various instance and static utility methods.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Color.xUtil',
	builder:function (_class) {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_undefined,
				_blendValues = Uize.blendValues,

			/*** General Variables ***/
				_dummyColor1 = new _class,
				_dummyColor2 = new _class
		;

		_class.declare ({
			instanceMethods:{
				blend:function (_color1,_color2,_blendAmount) {
					_blendAmount = Uize.toNumber (_blendAmount,.5);
					_dummyColor1.from (_color1);
					_dummyColor2.from (_color2);
					var
						_dummyColor1Tuple = _dummyColor1.tuple,
						_dummyColor2Tuple = _dummyColor2.getTuple (_dummyColor1.encoding)
					;
					_class.setTuple (
						this.tuple,
						_blendValues (_dummyColor1Tuple [0],_dummyColor2Tuple [0],_blendAmount),
						_blendValues (_dummyColor1Tuple [1],_dummyColor2Tuple [1],_blendAmount),
						_blendValues (_dummyColor1Tuple [2],_dummyColor2Tuple [2],_blendAmount),
						_blendValues (_dummyColor1Tuple [3],_dummyColor2Tuple [3],_blendAmount)
					);

					return this;
					/*?
						Instance Methods
							blend
								Blends between the two specified colors using the specified blend amount, and sets the current color of the instance to the new blended color.

								SYNTAX
								...........................................................
								colorOBJ.blend (color1ANYTYPE,color2ANYTYPE,blendFRACTION);
								...........................................................

								The =blendFRACTION= parameter should be a floating point number in the range of =0= to =1=, where  a value of =0= will result in =colorOBJ= being set to the color represented by the =color1ANYTYPE= parameter, the value =1= will result in =colorOBJ= being set to the color represented by the =color2ANYTYPE= parameter, and the value =.5= will result in =colorOBJ= being set to a color that is an equal blend of the colors represented by the =color1ANYTYPE= and =color2ANYTYPE= parameters.

								Different values between =0= and =1= for the =blendFRACTION= parameter give you different blends between color one and color two...

								EXAMPLES
								..............................................................................
								// a range of blends between black and white

								myColor.blend ('000000','ffffff',0);    // myColor now #000000, encoding "hex"
								myColor.blend ('000000','ffffff',.25);  // myColor now #404040, encoding "hex"
								myColor.blend ('000000','ffffff',.5);   // myColor now #808080, encoding "hex"
								myColor.blend ('000000','ffffff',.75);  // myColor now #bfbfbf, encoding "hex"
								myColor.blend ('000000','ffffff',1);    // myColor now #ffffff, encoding "hex"
								..............................................................................

								VARIATION
								.............................................
								colorOBJ.blend (color1ANYTYPE,color2ANYTYPE);
								.............................................

								When no =blendFRACTION= parameter is specified, the value for this parameter is defaulted to =.5=, producing an equal mix between =color1ANYTYPE= and =color2ANYTYPE=.

								EXAMPLE
								................................................................................
								myColor.blend ('black','white');  // myColor now #808080 (gray), encoding "name"
								................................................................................

								Color one and color two - the source colors for the blending operation - can be specified using any of the many supported `color encodings`...

								EXAMPLES
								....................................................................................
								// equal blend of black and white, specified using different encodings

								myColor.blend ('000000','ffffff');      // myColor now #808080, encoding "hex"
								myColor.blend ('black','white');        // myColor now #808080, encoding "name"
								myColor.blend (0x000000,0xffffff);      // myColor now #808080, encoding "RGB int"
								myColor.blend ([0,0,0],[255,255,255]);  // myColor now #808080, encoding "RGB array"
								myColor.blend ('#000','#fff');          // myColor now #808080, encoding "#hex"
								myColor.blend ('#0','#f');              // myColor now #808080, encoding "#hex"
								....................................................................................

								The `color encodings` for color one and color two do not have to be the same...

								EXAMPLES
								..................................................................................
								// equal blend of black and white, using mixed encodings for source colors

								myColor.blend ('#000000',0xffffff);   // myColor now #808080, encoding "#hex"
								myColor.blend ('black','#fff');       // myColor now #808080, encoding "name"
								myColor.blend ([0,0,0],'ffffff');     // myColor now #808080, encoding "RGB array"
								..................................................................................

								To blend the instance's current color value with a different color, simply pass a reference to the color object instance as one of the colors to blend, as in...

								EXAMPLE
								................................................................................
								myColor.blend (myColor,'white',.1);  // blend in some white to lighten the color
								................................................................................

								NOTES
								- see the related =Uize.Color.blend= static method
					*/
				},

				equal:function (_color) {
					_dummyColor1.from (_color).setEncoding (this.encoding);
					var
						_tuple = this.tuple,
						_dummyColor1Tuple = _dummyColor1.tuple
					;
					return (
						!Math.round (_tuple [0] - _dummyColor1Tuple [0]) &&
						!Math.round (_tuple [1] - _dummyColor1Tuple [1]) &&
						!Math.round (_tuple [2] - _dummyColor1Tuple [2]) &&
						!Math.round (_tuple [3] - _dummyColor1Tuple [3])
					);
					/*?
						Instance Methods
							equal
								Returns a boolean, indicating whether or not the specified color is equivalent to the color of the instance.

								SYNTAX
								...........................................
								isEqualBOOL = myColor.equal (colorANYTYPE);
								...........................................

								EXAMPLES
								........................................................................
								var fuchsia = Uize.Color ('fuchsia');
								fuchsia.equal (Uize.Color ('fuchsia'));                 // produces true
								fuchsia.equal ('ff00ff');                               // produces true
								fuchsia.equal ('#ff00ff');                              // produces true
								fuchsia.equal ('fuchsia');                              // produces true
								fuchsia.equal ([255,0,255]);                            // produces true
								fuchsia.equal (16711935);                               // produces true
								fuchsia.equal ({red:255,green:0,blue:255});             // produces true
								fuchsia.equal ('rgb(255,0,255)');                       // produces true
								fuchsia.equal ({'HSL array':[300,100,50]});             // produces true
								fuchsia.equal ({hue:300,saturation:100,lightness:50});  // produces true
								fuchsia.equal ('hsl(300,100,50)');                      // produces true
								........................................................................

								In the above example, all the statements produce the result =true=. That's because all the colors that the =fuchsia= color object is being compared to are equivalent to the color "fuchsia" - regardless of the encoding used to specify them.

								MORE EXAMPLES
								.......................................................................................
								Uize.Color.Util.mix (['black','red']).equal ('maroon');                // produces true
								Uize.Color.Util.mix (['rgb(0,0,0)','#f00']).equal ('hsl(0,100%,25%)'); // produces true
								.......................................................................................

								NOTES
								- see the companion =Uize.Color.equal= static method
					*/
				},

				random:function () {
					for (
						var
							_components = _class.colorSpaces [_class.encodings [this.encoding].colorSpace].tuple,
							_componentNo = _components.length,
							_tuple = this.tuple
						;
						--_componentNo >= 0;
					) {
						var
							_component = _components [_componentNo],
							_componentMin = _component.min
						;
						_tuple [_componentNo] = _componentMin + Math.random () * (_component.max - _componentMin);
					}
					return this;
					/*?
						Instance Methods
							random
								Randomizes the color of the instance in the color space of the instance's current encoding.

								SYNTAX
								..................
								myColor.random ();
								..................

								NOTES
								- see the related =Uize.Color.random= static method
					*/
				}
			},

			staticMethods:{
				blend:function (_color1,_color2,_blendAmount,_encoding) {
					return _dummyColor1.blend (_color1,_color2,_blendAmount).to (_encoding || _dummyColor1.encoding);
					/*?
						Static Methods
							Uize.Color.blend
								Blends between the two specified colors using the specified blend amount, and returns the blended color encoded using the specified encoding.

								SYNTAX
								............................................................................
								colorANYTYPE = Uize.Color.blend (color1ANYTYPE,color2ANYTYPE,blendFRACTION);
								............................................................................

								The =blendFRACTION= parameter should be a floating point number in the range of =0= to =1=, where  a value of =0= will result in returning the color represented by the =color1ANYTYPE= parameter, the value =1= will result in returning the color represented by the =color2ANYTYPE= parameter, and the value =.5= will result in returning a color that is an equal blend of the colors represented by the =color1ANYTYPE= and =color2ANYTYPE= parameters.

								Different values between =0= and =1= for the =blendFRACTION= parameter give you different blends between color one and color two...

								EXAMPLES
								....................................................................
								// a range of blends between black and white

								Uize.Color.blend ('000000','ffffff',0);     // returns '000000'
								Uize.Color.blend ('000000','ffffff',.25);   // returns '404040'
								Uize.Color.blend ('000000','ffffff',.5);    // returns '808080'
								Uize.Color.blend ('000000','ffffff',.75);   // returns 'bfbfbf'
								Uize.Color.blend ('000000','ffffff',1);     // returns 'ffffff'
								....................................................................

								VARIATION 1
								........................................................................................
								colorANYTYPE = Uize.Color.blend (color1ANYTYPE,color2ANYTYPE,blendFRACTION,encodingSTR);
								........................................................................................

								The resulting blended color can be encoded in any of the many supported `color encodings`, by using the optional =encodingSTR= parameter, as follows...

								EXAMPLES
								........................................................................
								// equal blend of black and white, different encodings for the result

								Uize.Color.blend ('black','white',.5,'color');       // new Uize.Color
								Uize.Color.blend ('black','white',.5,'hex');         // 808080
								Uize.Color.blend ('black','white',.5,'#hex');        // #808080
								Uize.Color.blend ('black','white',.5,'name');        // gray
								Uize.Color.blend ('black','white',.5,'RGB array');   // [128,128,128]
								Uize.Color.blend ('black','white',.5,'RGB int');     // 8421504
								Uize.Color.blend ('black','white',.5,'RGB string');  // rgb(128,128,128}
								........................................................................

								VARIATION 2
								.............................................................
								colorHexSTR = Uize.Color.blend (color1ANYTYPE,color2ANYTYPE);
								.............................................................

								When no =blendFRACTION= or =encodingSTR= parameters are specified, then the colors specified by the =color1ANYTYPE= and =color2ANYTYPE= parameters will be blended equally and the resulting color will be encoded using the encoding of the first color, as specified by the =color1ANYTYPE= parameter.

								EXAMPLE
								.................................................................................
								var myColorHex = Uize.Color.blend ('fuchsia','olive');  // myColorHex is 'c04080'
								.................................................................................

								Color one and color two - the source colors for the blending operation - can be specified using any of the many supported `color encodings`...

								EXAMPLES
								...................................................................................
								// equal blend of black and white, specified using different encodings

								Uize.Color.blend ('000000','ffffff');                // returns '808080'
								Uize.Color.blend ('black','white');                  // returns 'gray'
								Uize.Color.blend (0x000000,0xffffff);                // returns 8421504
								Uize.Color.blend ([0,0,0],[255,255,255]);            // returns [127.5,127.5,127.5]
								Uize.Color.blend ('#000','#fff');                    // returns '#808080'
								Uize.Color.blend ('#0','#f');                        // returns '#808080'
								Uize.Color.blend ('hsl(0,0%,0%)','hsl(0,0%,100%)');  // returns 'hsl(0,0%,50%)'
								...................................................................................

								The `color encodings` for color one and color two do not have to be the same...

								EXAMPLES
								..........................................................................
								// equal blend of black and white, using mixed encodings for source colors

								Uize.Color.blend ('#000000',0xffffff);   // returns '#808080'
								Uize.Color.blend ('black','#fff');       // returns 'gray'
								Uize.Color.blend ([0,0,0],'ffffff');     // returns [127.5,127.5,127.5]
								..........................................................................

								In the above example, notice how the encoding of the first color is used for encoding the result.

								NOTES
								- see the related =blend= instance method
					*/
				},

				equal:function (_color1,_color2) {
					return _dummyColor2.from (_color1).equal (_color2);
					/*?
						Static Methods
							Uize.Color.equal
								Returns a boolean, indicating whether or not the two specified colors are equivalent.

								SYNTAX
								..............................................................
								areEqualBOOL = Uize.Color.equal (color1ANYTYPE,color2ANYTYPE);
								..............................................................

								EXAMPLES
								............................................................................
								Uize.Color.equal ('fuchsia',Uize.Color ('fuchsia'));                 // true
								Uize.Color.equal ('ff00ff','#ff00ff');                               // true
								Uize.Color.equal ([255,0,255],'hsl(300,100,50)');                    // true
								Uize.Color.equal (16711935,{red:255,green:0,blue:255});              // true
								Uize.Color.equal ('rgb(255,0,255)',{'HSL array':[300,100,50]});      // true
								Uize.Color.equal ('fuchsia',{hue:300,saturation:100,lightness:50});  // true
								............................................................................

								In the above example, all the statements produce the result =true=. That's because all of the colors specified for the =color1ANYTYPE= and =color2ANYTYPE= parameters are equivalent to the color "fuchsia" - regardless of the encoding used to specify them.

								MORE EXAMPLES
								...............................................................................
								Uize.Color.equal (Uize.Color.blend ('red','black'),'maroon');  // produces true
								Uize.Color.equal (Uize.Color.blend ('white','black'),'gray');  // produces true
								Uize.Color.equal (Uize.Color.blend ('red','blue'),'purple');   // produces true
								...............................................................................

								NOTES
								- see the companion =equal= instance method
					*/
				},

				random:function (_encoding) {
					return _dummyColor1.setEncoding (_encoding).random ().to (_encoding);
					/*?
						Static Methods
							Uize.Color.random
								Generates a random color with the specified encoding.

								SYNTAX
								...............................................
								colorANYTYPE = Uize.Color.random (encodingSTR);
								...............................................

								EXAMPLE
								................................................................................
								Uize.Dom.Basics.setStyle (
									'myNodeId',
									{color:Uize.Color.random ('#hex'),backgroundColor:Uize.Color.random ('#hex')}
								);
								................................................................................

								In the above example, the text color and background color for the DOM node with the id "myNodeId" are being randomized.

								VARIATION
								......................................
								colorRgbHexSTR = Uize.Color.random ();
								......................................

								When no =encodingSTR= parameter is specified, the default value ='hex'= will be used and the method will return a string value, being a hex formatted random RGB color value.

								NOTES
								- when the value ='color'= is specified for the =encodingSTR= parameter, then this method will return an instance of the =Uize.Color= object with its encoding set to ='hex'= (i.e. in the =sRGB= color space)
								- see the related =random= instance method
					*/
				}
			}
		});
	}
});

