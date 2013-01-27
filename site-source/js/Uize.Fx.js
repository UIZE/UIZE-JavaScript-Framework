/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Fx Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2009-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 5
	codeCompleteness: 100
	docCompleteness: 85
*/

/*?
	Introduction
		The =Uize.Fx= module provides easy ways to initiate fades of CSS style properties, making a wide array of unique JavaScript animation effects possible.

		*DEVELOPERS:* `Chris van Rensburg`

		In a Nutshell
			Using this module, colors can easily be animated, DOM nodes can be made to fly across the page, dimensions of objects can be morphed, and a whole array of other interesting effects can be achieved.

			BACKGROUND READING

			For an in-depth discussion on animation in the UIZE JavaScript Framework, and for a discussion on how this module fits into the larger picture, consult the explainer [[../explainers/javascript-animation-and-effects.html][JavaScript Animation and Effects]] and read through the section `Animating CSS Style Properties`.

		Extensions For CSS3 Support
			Support for fading the values of CSS3 style properties that are not yet universally supported by Web browsers is provided in the form of extension modules under the =Uize.Fx= namespace.

			An example is the =Uize.Fx.xShadows= module, which provides support for fading values for the =text-shadow= and =box-shadow= CSS3 style properties.
*/

Uize.module ({
	name:'Uize.Fx',
	required:[
		'Uize.Fade.xFactory',
		'Uize.Node',
		'Uize.Color'
	],
	builder:function () {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_package = function () {},
				_undefined
			;

		/*** General Variables ***/
			var
				_stylePropertiesProfiles = [],
				_stylePropertiesProfilesMap,
				_updaterFunctions = {},
				_isIe = Uize.Node.isIe
			;

		/*** Utility Functions ***/
			function _getStylePropertiesProfile (_styleProperty) {
				if ((_stylePropertiesProfilesMap || (_stylePropertiesProfilesMap = {})) [_styleProperty])
					return _stylePropertiesProfilesMap [_styleProperty]
				;
				for (var _profileNo = _stylePropertiesProfiles.length, _test; --_profileNo > -1;) {
					if (
						typeof (_test = _stylePropertiesProfiles [_profileNo].test) == 'string'
							? _styleProperty == _test
							: Uize.isFunction (_test)
								? _test (_styleProperty)
								: _test.test (_styleProperty)
					)
						return _stylePropertiesProfilesMap [_styleProperty] = _stylePropertiesProfiles [_profileNo]
					;
				}
			}

		/*** Public Static Methods ***/
			var _defineStylePropertiesProfile = _package.defineStylePropertiesProfile = function (_stylePropertiesProfile) {
				_stylePropertiesProfiles.push (_stylePropertiesProfile);
				if (_stylePropertiesProfilesMap)
					/* NOTE:
						We wipe the cached mappings, since a new properties profile might want to override a mapping that has already been cached, especially if it provides enhanced support for style properties for which basic support was provided by a properties profile defined earlier.
					*/
					_stylePropertiesProfilesMap = _undefined
				;
				/*?
					Static Methods
						Uize.Fx.defineStylePropertiesProfile
							For advanced developers only, this is an extension hook that lets you extend the =Uize.Fx= module by adding support for fading of CSS style properties for which built-in support is not provided.

							SYNTAX
							.................................................................
							Uize.Fx.defineStylePropertiesProfile (stylePropertiesProfileOBJ);
							.................................................................

							The =Uize.Fx.defineStylePropertiesProfile= method lets you define a profile for one or more CSS style properties, and such a profile will then allow values for those properties to be faded using the =Uize.Fx.fadeStyle= static method. Furthermore, any other modules that use the =Uize.Fx.fadeStyle= method in their implementation will also gain the benefit of supporting fading for those style properties.

							As an example, the =Uize.Fx.xShadows= module uses the =Uize.Fx.defineStylePropertiesProfile= method to add support for the CSS3 =text-shadow= and =box-shadow= style properties. Once this module has been loaded, the =Uize.Widget.HoverFader= widget class, which uses the =Uize.Fx.fadeStyle= method in its implementation, will be able to support fading of text shadows and box shadows.

							stylePropertiesProfileOBJ
								A profile for one or more style properties is defined in the =stylePropertiesProfileOBJ= parameter.

								The value of this parameter should be an object of the form...

								.......................................................................................
								{
									test              : testSTRorREGEXPorFUNC,  // property name test
									decoder           : decoderFUNC,            // value decoder function
									encoderExpression : encoderExpressionSTR,   // interpolated value encoder expression
									remappedProperty  : remappedPropertySTR     // remapped property name (optional)
								}
								.......................................................................................

								test
									A string, regular expression, or function, that will be used to determine if the profile applies to a specific style property.

									A string value can be used to specify the exact name of a style property to which the profile applies. A regular expression can be used to match the profile to multiple style properties. A function can be used to provide a custom test that will be used to determine if the profile applies for a specific style property. A function value specified for this parameter should expect to receive a single parameter, being the name of a style property. The function should return =true= or =false=, depending on whether or not the profile supports the style property being tested.

									LAST PROFILE WINS

									The last profile that is defined and that tests positive for a specific style property will take over support for that property, even if a profile defined earlier had tested positive for that property and was providing support for it.

								remappedProperty
									An optional string, specifying a remapped name for the style property supported by the profile.

									This property of the =stylePropertiesProfileOBJ= parameter can be useful in rare cases where the actual CSS style property to be faded needs to be different to the style property specified, such as with fading the value of the =opacity= style property in Internet Explorer. See the `EXAMPLE: Opacity Profile` below...

								decoder
									A function that is responsible for decoding the value of the style property and returning a value (possibly a compound value) that can be interpolated in the code of the =Uize.Fade= class.

									If a compound value is returned, then the various interpolatable components of that compound value should be numbers. For example, a color type style property value can be decoded to produce a tuple array representing the components of the color. Decoding an RGB color value in this way would produce a color tuple with three elements, representing the values of the red, green, and blue components, respectively.

								encoderExpression
									A string, specifying an expression that can be used to encode the style property value that is interpolated in the code of the =Uize.Fade= class.

									The specified expression string should contain the text "VALUE", which will be substituted, by the =Uize.Fx.fadeStyle= method, with a reference to the interpolated value for the style property. This is because the =Uize.Fx.fadeStyle= method can be used to fade the values of many style properties in a single fade process, and a larger compound value contains the values for all the individual style properties being faded. The encoder expression provided in your style properties profile will be combined together with the encodeer expressions for other style properties being faded and will then be compiled into a single function for improved performance.

							Supporting Multiple Style Properties
								In order to support multiple style properties, the test specified by the =test= property of the =stylePropertiesProfileOBJ= parameter should test positive for multiple style property names.

								This, by definition, means that the value of the =test= property cannot be a string with a specific style property name, but should be either a regular expression or function. It also means that the =remappedProperty= property is not likely to be applicable, because you're not likely to want to map multiple different style property names to the same style property for fading. You should also only support multiple style properties with the same style properties profile if the value follows the same format for all the style properties.

								See the `EXAMPLE: Color Properties Profile` for a demonstration of supporting multiple style properties.

							EXAMPLE: Color Properties Profile
								The following example shows a style properties profile that will support a large number of color type style properties...

								EXAMPLE
								.........................................................................
								Uize.Fx.defineStylePropertiesProfile ({
									test:/color|^background$/i,
									decoder:function (_value) {return Uize.Color.to (_value,'RGB array')},
									encoderExpression:'"rgb("+VALUE.join(",")+")"',
									quantization:1
								});
								.........................................................................

								Because we want to support a wide array of color style properties - such as =color=, =background=, =backgroundColor=, =borderColor=, =borderTopColor=, etc. - we use a regular expression for the =test= property of the =stylePropertiesProfileOBJ= parameter. The regular expression in this case will test positive for any style property name containing the word "color", and also for the =background= style property.

								Our =decoder= takes the color style property value and turns it into an RGB tuple array using the =Uize.Color.to= method of the =Uize.Color= module and specifying the value ='RGB array'= for its =encodingSTR= parameter. Our =encoderExpression= specifies an expression that constructs an =rgb(...)= formatted color value by joining the interpolated tuple array, represented by the "VALUE" token. Finally, to ensure that the values interpolated for the components of the RGB color tuple are integers, we specify the value =1= for the =quantization= property.

							EXAMPLE: Opacity Profile
								The following example shows a style properties profile that supports just the =opacity= style property...

								EXAMPLE
								............................................................................................
								Uize.Fx.defineStylePropertiesProfile ({
									test:'opacity',
									remappedProperty:Uize.Node.isIe ? 'filter' : 'opacity',
									decoder:function (_value) {return +_value},
									encoderExpression:Uize.Node.isIe ? '"alpha(opacity="+Math.round(VALUE*100)+")"' : 'VALUE'
								});
								............................................................................................

								Because we're only supporting the =opacity= style property in this profile, we can use the string value ='opacity'= for the =test= property of the =stylePropertiesProfileOBJ= parameter. To deal with the fact that supporting opacity fades in Internet Explorer involves using the non-standard =filter= style property, we specify a value for the =remappedProperty= property of the =stylePropertiesProfileOBJ= parameter, where this value is conditionalized using the =Uize.Node.isIe= static property.

								The =decoder= is easy in this case - all our decoder function does is coerce the =opacity= property value to a number. Our =encoder= is also conditionalized, based upon whether or not we're dealing with Internet Explorer. For IE the expression constructs an alpha filter value for the non-standard =filter= style property, and for all other browsers the interpolated value is simply used as is. Finally, because opacity is interpolated as a floating point number in the range of =0= to =1=, we don't specify any =quantization= property in this profile, which defaults the quantization to =0= for this profile.

							More Examples of Style Properties Profiles
								If you're looking to develop extension modules to support CSS style properties, you can look over the code of the =Uize.Fx= module (yes, *this* module), which contains style properties profiles for a variety of different style properties.
				*/
			};

			_package.fadeStyle = function (_node,_startStyle,_endStyle,_duration,_fadeProperties,_startNow) {
				if (!(_node = Uize.Node.getById (_node))) return;

				/*** form a map of the superset of style properties between the start style and end style ***/
					var
						_styleProperty,
						_stylePropertiesMap = {}
					;
					for (_styleProperty in _startStyle) _stylePropertiesMap [_styleProperty] = 1;
					for (_styleProperty in _endStyle) _stylePropertiesMap [_styleProperty] = 1;

				/*** translate the style objects to fade values, and build the fade handler function ***/
					var
						_styleProperties = [],
						_startValue = {},
						_endValue = {},
						_quantization = {},
						_decoder
					;
					function _decodeStyleProperty (_styleObject) {
						var _stylePropertyValue = _styleObject && _styleObject [_styleProperty];
						return (
							_decoder (
								_stylePropertyValue != _undefined
									? _stylePropertyValue
									: Uize.Node.getStyle (_node,_styleProperty)
							)
						);
					}
					for (_styleProperty in _stylePropertiesMap) {
						_styleProperties.push (_styleProperty);
						var _stylePropertiesProfile = _getStylePropertiesProfile (_styleProperty);
						_decoder = _stylePropertiesProfile.decoder;
						_startValue [_styleProperty] = _decodeStyleProperty (_startStyle);
						_endValue [_styleProperty] = _decodeStyleProperty (_endStyle);
						_quantization [_styleProperty] = _stylePropertiesProfile.quantization;
					}

				/*** build the fade handler function, if necessary ***/
					var
						_updaterFunctionId = _styleProperties.sort ().join (),
						_updaterFunction = _updaterFunctions [_updaterFunctionId]
					;
					if (!_updaterFunctions [_updaterFunctionId]) {
						var _functionChunks = [
							'var nodeStyle = this.style;',
							'if (!nodeStyle) return;'
						];
						for (_styleProperty in _stylePropertiesMap) {
							var _stylePropertiesProfile = _getStylePropertiesProfile (_styleProperty);
							_functionChunks.push (
								'nodeStyle.' + (_stylePropertiesProfile.remappedProperty || _styleProperty) + '=' +
								_stylePropertiesProfile.encoderExpression.replace (
									'VALUE',
									'style.' + _styleProperty
								) + ';'
							);
						}
						_updaterFunction = _updaterFunctions [_updaterFunctionId] =
							Function ('style',_functionChunks.join (''))
						;
					}

				return Uize.Fade.fade (
					{context:_node,handler:_updaterFunction},
					_startValue,
					_endValue,
					_duration,
					Uize.copyInto ({quantization:_quantization},_fadeProperties),
					_startNow
				);
				/*?
					Static Methods
						Uize.Fx.fadeStyle
							Lets you easily fade one or more CSS style properties for a specified node.

							SYNTAX
							.............................
							fadeOBJ = Uize.Fx.fadeStyle (
								nodeSTRorOBJ,
								startStylePropertiesOBJ,
								endStylePropertiesOBJ,
								durationINT
							);
							.............................

							The =Uize.Fx.fadeStyle= method supports fading values for the following CSS style properties...

							- color style properties: =color=, =background=, =backgroundColor=, =borderColor=, =borderTopColor=, =borderRightColor=, =borderBottomColor=, =borderLeftColor=

							- position style properties: =top=, =right=, =bottom=, =left=, =backgroundPosition=

							- padding and margin style properties: =padding=, =paddingTop=, =paddingRight=, =paddingBottom=, =paddingLeft=, =margin=, =marginTop=, =marginRight=, =marginBottom=, =marginLeft=

							- dimension style properties: =width=, =height=, =maxWidth=, =maxHeigh=, =borderWidth=, =borderTopWidth=, =borderRightWidth=, =borderBottomWidth=, =borderLeftWidth=

							- font style properties: =fontSize=, =letterSpacing=, =wordSpacing=, =lineHeight=, =textIndent=

							EXAMPLES
							.......................................................................................
							// fade from thin border/thick padding to thick border/thin padding over 1/4 second
							Uize.Fx.fadeStyle ('myNode',{borderWidth:1,padding:20},{borderWidth:20,padding:1},250);

							// fade from current colors to white text on black background over two seconds
							Uize.Fx.fadeStyle ('myNode',null,{color:'#fff',backgroundColor:'#000'},2000);

							// fade font size from 30px back to current size over a half second
							Uize.Fx.fadeStyle ('myNode',{fontSize:30},null,500);
							.......................................................................................

							IMPORTANT

							The naming of style properties in the style properties objects for the =startStylePropertiesOBJ= and =endStylePropertiesOBJ= parameters should use the DOM reflected (ie. camelCased) names rather than the CSS format names. For example, the CSS style property =border-left-color= is reflected in the DOM as =borderLeftColor=.

							VARIATION 1
							.............................
							fadeOBJ = Uize.Fx.fadeStyle (
								nodeSTRorOBJ,
								startStylePropertiesOBJ,
								endStylePropertiesOBJ,
								durationINT,
								fadePropertiesOBJ
							);
							.............................

							When the optional =fadePropertiesOBJ= parameter is specified, additional values can be specified for the state properties of the =Uize.Fade= class - such as =curve=, =quantization=, etc. These property values will be set on the =Uize.Fade= instance that is created to service the fade process requested by calling this method.

							VARIATION 2
							.............................
							fadeOBJ = Uize.Fx.fadeStyle (
								nodeSTRorOBJ,
								startStylePropertiesOBJ,
								endStylePropertiesOBJ,
								durationINT,
								fadePropertiesOBJ,
								startNowBOOL
							);
							.............................

							By default, fades created using the =Uize.Fade.fadeStyle= method are started immediately. If you do not wish the fade to start immediately, but wish to initiate the fade at a later time by using the =start= instance method of the =Uize.Fade= instance returned from the =Uize.Fade.fadeStyle= method, then you can specify the value =false= for the optional =startNowBOOL= parameter. If you wish to use the =startNowBOOL= parameter but do not wish to specify any fade properties, then you should specify the value =null= for the =fadePropertiesOBJ= parameter.

							Fading Clip Region
								The =Uize.Fx.fadeStyle= method can be used to fade the value of the =clip= style property.

								With the =Uize.Fx.fadeStyle= method, values for the =clip= style property can be specified in a variety of ways, as illustrated by the examples below...

								...................................................
								// as a correct string value, according to CSS spec

								{clip:'rect (0px , 200px , 100px , 0px)'}
								{clip:'rect(0px, 200px, 100px, 0px)'}
								{clip:'rect(0px,200px,100px,0px)'}

								// as a string value, with a measure of forgiveness

								{clip:'rect(0px 200px 100px 0px)'}
								{clip:'rect(0px200px100px0px)'}
								{clip:'rect(0 200 100 0)'}
								{clip:'rect(0,200,100,0)'}

								// as a string, with no "rect(...)" wrapper

								{clip:'0px 200px 100px 0px'}
								{clip:'0px, 200px, 100px, 0px'}
								{clip:'0px,200px,100px,0px'}
								{clip:'0px200px100px0px'}
								{clip:'0 200 100 0'}
								{clip:'0,200,100,0'}

								// as an array with four elements

								{clip:['0px','200px','100px','0px']}
								{clip:['0','200','100','0']}
								{clip:[0,200,100,0]}
								...................................................

							Fading Opacity
								The =Uize.Fx= module supports fading of the =opacity= style property.

								This module deals with the difference between Internet Explorer and browsers that support the CSS standard =opacity= style property. For IE, the proprietary =filter= style property is used, but as a developer you can specify =opacity= as if it were supported by IE.

								EXAMPLES
								....................................................................................
								Uize.Fx.fadeStyle ('myNode',null,{opacity:0});        // from current to transparent
								Uize.Fx.fadeStyle ('myNode',{opacity:0},{opacity:1}); // from transparent to opaque
								....................................................................................

							Specifying Color Values
								The =Uize.Fx.fadeStyle= method supports a wide variety of ways for specifying values for color CSS style properties.

								Basically, color values can be specified in any way that a color can be specified when using the single parameter variations of the =Uize.Color= constructor. For example, the following statements would all fade the background color of the node "myNode" from the current color to white...

								EXAMPLES
								................................................................................
								Uize.Fx.fadeStyle ('myNode',null,{backgroundColor:'#fff'});
								Uize.Fx.fadeStyle ('myNode',null,{backgroundColor:'#ffffff'});
								Uize.Fx.fadeStyle ('myNode',null,{backgroundColor:'f'});
								Uize.Fx.fadeStyle ('myNode',null,{backgroundColor:'Rgb(255,255,255)');
								Uize.Fx.fadeStyle ('myNode',null,{backgroundColor:{red:255,green:255,blue:255});
								Uize.Fx.fadeStyle ('myNode',null,{backgroundColor:[255,255,255]});
								Uize.Fx.fadeStyle ('myNode',null,{backgroundColor:Uize.Color (255)});
								Uize.Fx.fadeStyle ('myNode',null,{backgroundColor:255});
								................................................................................

							### Specifying Dimension Values
								- mention that the value for any position and dimension CSS style property can be specified as a string in pixels (eg. {left:'100px'}) or as a number (eg. {left:100})

							### Fading From Current

							### Fading Back To Current

							### Mixed From / Back To Current

							NOTES
							- see the related =Uize.Fx.fadeStyleAcrossNodes= static method
				*/
			};

			_package.fadeStyleAcrossNodes = function (_nodes,_startStyle,_endStyle,_fadeProperties) {
				var
					_fadedStyle = {},
					_dummyNode = {style:_fadedStyle},
					_fade = _package.fadeStyle (_dummyNode,_startStyle,_endStyle,0,_fadeProperties,false),
					_reverse = _fade.get ('reverse')
				;
				_fade.set ({progress:1});
					/* NOTE:
						We need to make sure that the updater function gets called for the very first loop iteration (it's triggered by a change in the progress property's value, and progress is initially set to 0 when a fade is created).
					*/
				for (
					var _nodeNo = -1, _nodesLengthMinus1 = (_nodes = Uize.Node.find (_nodes)).length - 1;
					++_nodeNo <= _nodesLengthMinus1;
				) {
					_nodesLengthMinus1 &&
						_fade.set ({progress:(_reverse ? _nodesLengthMinus1 - _nodeNo : _nodeNo) / _nodesLengthMinus1})
					;
					Uize.copyInto (_nodes [_nodeNo].style,_fadedStyle);
				}
				/*?
					Static Methods
						Uize.Fx.fadeStyleAcrossNodes
							Lets you easily fade values for an arbitrary number of CSS style properties across a specified series of nodes.

							SYNTAX
							..............................
							Uize.Fx.fadeStyleAcrossNodes (
								findExpressionOBJ,
								startStylePropertiesOBJ,
								endStylePropertiesOBJ
							);
							..............................

							This method produces a style fade across a series of nodes, rather than over a period of time like the related =Uize.Fx.fadeStyle= static method. Using this method, you can easily produce color gradients that span multiple nodes by fading the values of the =color=, =backgroundColor=, =borderColor=, and other color style properties. You can just as easily create size and position graduations in order to arrange and scale HTML elements in a continuous fashion. Other CSS style properties, such as =padding=, =margin=, =fontSize=, =letterSpacing=, =wordSpacing=, =lineHeight=, =textIndent=, etc. can also be faded across a series of nodes. And, when loading in extension modules that provide support for additional CSS style properties, such as the =Uize.Fx.xShadows= module that provides support for the =text-shadow= and =box-shadow= CSS3 style properties, such style properties can also be faded across nodes.

							With the ability to apply curve functions discretely to different properties in a style fade, complex and compelling non-linear style fades can be created. To get a taste of the wide variety of different effects that can be achieved using this method, see the example [[../examples/fade-css-style-across-nodes.html][Fade CSS Style Across Nodes]].

							findExpressionOBJ
								An object, specifying the series of nodes across which the CSS style fade should be applied.

								The value of the =findExpressionOBJ= parameter is resolved to an array of nodes using the =Uize.Node.find= static method that is implemented in the =Uize.Node= module. This means that any facilities provided by that method are available when specifying nodes in a call to the =Uize.Fx.fadeStyleAcrossNodes= method. If you already have an array of nodes, then this array can be supplied as the value of the =findExpressionOBJ= parameter.

							startStylePropertiesOBJ
								An object, specifying the start values for an arbitrary number of CSS style properties.

								The style property values specified in the =startStylePropertiesOBJ= parameter will be applied to the *first* node in the series of nodes specified by the =findExpressionOBJ= parameter (unless you specify the value =true= for the =reverse= property in the optional =fadePropertiesOBJ= parameter).

							endStylePropertiesOBJ
								An object, specifying the end values for an arbitrary number of CSS style properties.

								The style property values specified in the =endStylePropertiesOBJ= parameter will be applied to the *last* node in the series of nodes specified by the =findExpressionOBJ= parameter (unless you specify the value =true= for the =reverse= property in the optional =fadePropertiesOBJ= parameter).

							Start and End Style Structures Must Match
								Whatever style property values are specified in the =startStylePropertiesOBJ= object, values for those same style properties should also be specified in the =endStylePropertiesOBJ= parameter, so the structures of these two parameters should be the same.

								This rule also applies to style properties that can have compound values, such as =textShadow=. For example, if the value of the =textShadow= property specified in the =startStylePropertiesOBJ= parameter defines three shadows, then the value of the =textShadow= property specified in the =endStylePropertiesOBJ= parameter should also define three shadows. Moreover, the structure of the corresponding shadow definitions should match between the start value and the end value. For instance, the unit used for specifying the optional blur radius should be the same for the same shadow between the start and end values for =textShadow=. Similarly, if shadow color is specified for a shadow in the start value, then shadow color should also be specified for the corresponding shadow in the end value.

							fadePropertiesOBJ
								When the optional =fadePropertiesOBJ= parameter is specified, additional values can be specified for the state properties of the =Uize.Fade= class - such as =curve=, =quantization=, etc.

								VARIATION
								..............................
								Uize.Fx.fadeStyleAcrossNodes (
									findExpressionOBJ,
									startStylePropertiesOBJ,
									endStylePropertiesOBJ,
									fadePropertiesOBJ
								);
								..............................

								The fade property values specified in the optional =fadePropertiesOBJ= parameter will be set on the =Uize.Fade= instance that is created for the style fade. One compelling use of the =fadePropertiesOBJ= parameter is to use it to specify a curve function, so that a style fade can be non-linear.

							An Example
								To get a better idea of how the =Uize.Fx.fadeStyleAcrossNodes= works, let's consider an example...

								EXAMPLE
								..............................
								Uize.Fx.fadeStyleAcrossNodes (
									{className:/\bmenuLink\b/},
									{
										color:'efe',
										backgroundColor:'9aa',
										borderColor:'bcb',
										textShadow:'#0 2 2 3'
									},
									{
										color:'899',
										backgroundColor:'234',
										borderColor:'345',
										textShadow:'#0 2 2 3'
									}
								)
								..............................

								In the above example, a color gradient is being applied to all the nodes that make up a navigation menu. The series of nodes across which CSS style is being faded is specified using the find expression ={className:/\bmenuLink\b/}=. This expression finds all nodes that contain the CSS class "menuLink" in their =class= attribute (the =\b= in the regular expression indicates a word boundary).

								The color gradient being applied across the menu nodes is fading the color values of the =color=, =backgroundColor=, and =borderColor= style properties. In addition, a text shadow is being applied to all the nodes, but the properties of the text shadow are not changing across the nodes - it's just a basic drop shadow. The particular color gradient represented by the above style fade statement would result in the first node in the series being a light greenish gray, and the last node in the series being a dark blueish gray. Nodes between the first and last nodes would be blends of gray that are between the light gray and the dark gray.

							NOTES
							- see the related =Uize.Fx.fadeStyle= static method
				*/
			};

		/*** Initialization ***/
			/*** fallback ***/
				_defineStylePropertiesProfile ({
					test:Uize.returnTrue,
					decoder:Uize.returnX,
					encoderExpression:'VALUE'
				});

			/*** position and dimension style properties ***/
				function _numericStylePropertyValueDecoder (_value) {
					return typeof _value == 'number' ? _value : parseInt (_value) || 0;
				}

				/*** position and dimension style properties (negative values allowed) ***/
					_defineStylePropertiesProfile ({
						test:/(left|top|right|bottom|padding|margin|spacing|textIndent)/i,
						decoder:_numericStylePropertyValueDecoder,
						encoderExpression:'VALUE+"px"',
						quantization:1
					});

				/*** non-negative dimension style properties ***/
					_defineStylePropertiesProfile ({
						test:/(fontSize|width|height)/i,
						decoder:_numericStylePropertyValueDecoder,
						encoderExpression:'Math.max(VALUE,0)+"px"',
						quantization:1
					});

			/*** color style properties ***/
				_defineStylePropertiesProfile ({
					test:/color|^background$/i,
					decoder:function (_value) {return Uize.Color.to (_value,'RGB array')},
					encoderExpression:'"Rgb("+VALUE.join(",")+")"',
					quantization:1
				});

			/*** background position ***/
				var _positionMap = {left:'0%',right:'100%',top:'0%',bottom:'100%',center:'50%'};
				_defineStylePropertiesProfile ({
					test:'backgroundPosition',
					decoder:function (_value) {
						if (_value) {
							if (Uize.isArray (_value) && _value.length == 2)
								_value = _value [0] + ' ' + _value [1]
							;
							if (typeof _value == 'string') {
								_value = _value
									.replace (
										/left|right|top|bottom|center/gi,
										function (_positionName) {return _positionMap [_positionName]}
									).match (/(left|center|right|[\+\-]?\d+)(%|px)?\s+(top|center|bottom|[\+\-]?\d+)(%|px)?/)
								;
								_value && _value.shift ();
							}
						}
						if (!_value) _value = [0,'px',0,'px'];
						return [
							parseInt (_value [0]) || 0,(_value [1] || 'px') + ' ',
							parseInt (_value [2]) || 0,(_value [3] || 'px') + ' '
						];
					},
					encoderExpression:'VALUE.join("")',
					quantization:1
				});

			/*** clip ***/
				var
					_clipRectRegExpCoordPiece = '(\\d+)\\s*(?:px)?\\s*,?\\s*',
					_clipRectRegExp = new RegExp (
						_clipRectRegExpCoordPiece + _clipRectRegExpCoordPiece +
						_clipRectRegExpCoordPiece + _clipRectRegExpCoordPiece,
						'i'
					)
				;
				_defineStylePropertiesProfile ({
					test:'clip',
					decoder:function (_value) {
						Uize.isArray (_value) ||
							((_value = _value.match (_clipRectRegExp)) ? _value.shift () : (_value = [0,0,0,0]))
						;
						return [parseInt (_value [0]),parseInt (_value [1]),parseInt (_value [2]),parseInt (_value [3])];
					},
					encoderExpression:'"rect("+VALUE.join("px,")+"px)"',
					quantization:1
				});

			/*** opacity ***/
				_defineStylePropertiesProfile ({
					test:'opacity',
					remappedProperty:_isIe ? 'filter' : 'opacity',
					decoder:function (_value) {return +_value},
					encoderExpression:_isIe ? '"alpha(opacity="+Math.round(VALUE*100)+")"' : 'VALUE'
				});

		return _package;
	}
});

