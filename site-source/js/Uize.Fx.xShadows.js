/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Fx.xShadows Extension
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2009-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Extension
	importance: 2
	codeCompleteness: 100
	docCompleteness: 70
*/

/*?
	Introduction
		The =Uize.Fx.xShadows= extension module supports animating the =box-shadow= and =text-shadow= CSS3 style properties, making many stunning effects possible.

		*DEVELOPERS:* `Chris van Rensburg`

		In a Nutshell
			Using this module, color, horizontal offset, vertical offset, and blur radius properties for box shadow and/or an arbitrary number of text shadows can be animated between one state and another, making a vast array of interesting effects possible.

			The [[http://www.w3.org/TR/css3-text/#text-shadow][text-shadow]] property is defined in the [[http://www.w3.org/TR/css3-text/][CSS Text Level 3]] specification, while the =box-shadow= property has been in somewhat of a state of flux. At the time of this writing, these properties are supported only in certain newer browsers, such as Google Chrome 2.x+, Safari 4.x+, Firefox 3.1+, Opera 9.5+, Konqueror, and other browsers based on the recent [[http://webkit.org/][WebKit]] project.

			BACKGROUND READING

			For an in-depth discussion on animation in the UIZE JavaScript Framework, and for a discussion on how this module fits into the larger picture, consult the explainer [[../explainers/javascript-animation-and-effects.html][JavaScript Animation and Effects]] and read through the section `Animating CSS Style Properties`.

		Why An Extension?
			Because support for shadow effects by Web browsers is likely to take some time to become pervasive, support for fading the shadow CSS properties is not built directly into the =Uize.Fx= base module, but is instead provided in this separate extension.

			Fading values for shadows (such as text shadows) of DOM nodes can produce some [[../examples/hover-fader-text-shadow-animation.html][spectacular effects]], but such effects can be considered esoteric enough that the weight of the framework should not be increased for the majority of use cases for the sake of supporting shadow animation. In cases where shadow animation is desired, it is easy enough to simply load in the =Uize.Fx.xShadows= module.

		Whet Your Appetite
			If you are not yet familiar with text shadow and box shadow, and the kinds of effects that are possible when animating shadows, you can whet your appetite by taking a look at the [[../examples/hover-fader-text-shadow-animation.html][Hover Fader Text Shadow Animation]] and [[../examples/animated-buttons-with-box-shadow.html][Animated Buttons with Box Shadow]] examples.

			Once you are done checking out these examples and feel inspired to learn more about the nitty-gritty of animating shadows, then you can return to this reference to get the full scoop.

		A Basic Example
			Before getting into a detailed discussion of shadow animation, let's take a look at a very basic example...

			EXAMPLE
			................................................................
			Uize.Fx.fadeStyle (
				'myNode',
				{
					color:'#fff',                   // white text
					backgroundColor:'#666',         // medium gray background
					textShadow:'#0 .3em .3em .3em'  // black drop shadow
				},
				{
					color:'#000',                   // black text
					backgroundColor:'#6a9',         // teal background
					textShadow:'#f 0em 0em .3em'    // white outer glow
				},
				500
			);
			................................................................

			In the above example, which demonstrates animation of the =text-shadow= property, we're fading the style of the DOM node with the =id= of "myNode". Along with values for the =color= and =backgroundColor= style properties, the style properties objects specified for the start and end values of the fade also contain values for the =textShadow= style property. In this simple case, our starting text shadow is a black drop shadow, offset =.3em= to the right and =.3em= down from the text. Furthermore, the drop shadow has a blur radius of =.3em=. By contrast, the ending text shadow is a white outer glow, which is aligned perfectly underneath the text (ie. horizontal and vertical offsets are both =0em=), and the blur radius is still =.3em=. Because the text shadow color is fading from black to white, the color of the text and the background are also fading in a complementary fashion, so that the text continues to be legible.

	### No Public Methods or Properties
		no public methods or properties added by this extension

	Key Features
		The =Uize.Fx.xShadows= module supports the following key features...

		Animates All Properties of a Shadow
			Shadows in CSS3 are specified using four shadow properties: horizontal offset, vertical offset, blur radius, and color.

			The horizontal and vertical offset properties specify the offset of the shadow relative to the object casting the shadow (ie. box or text). The blur radius controls the degree to which the shadow is blurred. The color specifies the color of the shadow (simple enough). Once the =Uize.Fx.xShadows= module has been loaded, the =Uize.Fx.fadeStyle= method can be used to fade/animate the values for all these shadow properties.

		### Animates All Components of a Color

		### supports all spacial units, as per spec
			- em ex px in cm mm pt pc
			- supports defaulting unit
				- unit always defaults to px when no unit specified (regardless of unit specified for corresponding shadow property of corresponding shadow for opposite value in fade range)
			- IMPORTANT: whatever unit is specified in startValue must also be used in endValue

		### versatile support for specifying color values
			#0
			#000
			#000000
			red
			rgb(...)
			hsl(...)

			### Chrome and Safari don't support rgb(...) syntax for shadow color, but this module resolves all faded shadow color values to hex RGB

		### Flexible Arrangement of Shadow Properties
			- supported formats
				- offsetX offsetY
				- offsetX offsetY blurRadius
				- offsetX offsetY color
				- offsetX offsetY blurRadius color
				- color offsetX offsetY
				- color offsetX offsetY blurRadius

			- color is optional
			- blur radius is optional

			- properties not specified are not faded, so browser implemented default applies
				- blur radius is defaulted to 0, according to CSS3 specification
				- color default is chosen by user agent, so omitting the color property is not recommended since results may then vary by browser

		Supports an Arbitrary Number of Shadows
			The CSS3 specification for the =text-shadow= style property allows a DOM node to have multiple shadows.

			This is done by specifying multiple shadows in a comma separated list, as in the following CSS style rule example...

			........................................................................................
			#myNode {
				text-shadow:-1px 0px 1px #fff, 1px 0px 1px #fff, 0px -1px 1px #fff, 0px 1px 1px #fff;
			}
			........................................................................................

			In the above example, four shadows are being used to produce a strong, white stroke effect around some text. This is done by offsetting the first shadow one pixel left, offsetting the second shadow one pixel right, offsetting the third shadow one pixel up, and offsetting the fourth shadow one pixel down. All the shadows are white, and their blur radius is one pixel to produce a subtle anti-aliased edge.

			The =Uize.Fx.xShadows= module supports fading values for all shadow properties of an arbitrary number of shadows. You can produce some pretty sophisticated animation effects when you involve multiple shadows for the same node, but be aware of `performance considerations` when doing this.

			Only One Box Shadow Per Node
				While the shadow parsing code can technically support an arbitrary number of box shadows per =boxShadow= value, as with text shadows, the browsers that support box shadow only support a single shadow per DOM node.

				At the time of this writing, there is still debate regarding whether or not multiple box shadows per DOM node should be supported.

		### breaks shadow up into data structure, allowing different curves to be applied to different properties for different shadows, and even different color components for colors of different shadows
			textShadow
			[
				shadow0OBJ,
				shadow1OBJ,
				...,
				shadowNOBJ
			]

			Shadow Object
			{
				offsetX        : offsetXFLOAT,
				offsetXUnit    : offsetXUnitSTR,
				offsetY        : offsetYFLOAT,
				offsetYUnit    : offsetYUnitSTR,
				blurRadius     : blurRadiusFLOAT,
				blurRadiusUnit : blurRadiusUnitSTR,
				color          : [
					colorComponent0FLOAT,
					colorComponent1FLOAT,
					colorComponent2FLOAT
				]
			}

		### advanced techniques
			- applying different curves to different parts of a shadow animation

	Important Considerations
		Not All Browsers Support Shadows
			At the time of writing, a number of the leading Web browsers support text shadow and box shadow, but the overwhelming majority of the installed base of browsers still do not.

			Browsers that provide complete support for text shadow and box shadow include...

			- Safari 4.x
			- Chrome 2.x
			- Firefox 3.1+
			- Opera 10.5+ (text shadow support in 9.5+)
			- Konqueror

			Internet Explorer
				Neither IE6, IE7, nor IE8 support text shadow or box shadow, and it is not yet clear whether or not IE9 will support shadows.

				We hope that IE9 will support both text shadow *AND* box shadow, because shadows can be very compelling in providing rich visualizations. Hopefully Web developers will strongly express their desire for full CSS3 support, and hopefully Microsoft will rise to the challenge.

			Graceful Degradation
				Given the reality that shadows will take a while to become universally supported in a majority of installed browsers, it is important to employ the principle of graceful degradation when using shadows.

				Quite often an element that is styled using shadows can also look satisfactory when shadows are not present. At the very least, color choices should be made that ensure that text remains legible when text shadow is not supported. Don't rely on text shadow, in other words, in order for text to be visible against a background that has a similar lightness. The best way to achieve gracefuly degradation is to simply test your content in browsers that don't support shadows and tune text and background colors accordingly to make sure the fallback is acceptable.

		Performance Considerations
			When animating shadow effects, keep in mind that rendering text shadows for large amounts of text (or for many DOM nodes), or rendering box shadows for many DOM nodes or for very large boxes, can be costly enough to the browser as to reduce the number of animation updates that can be performed.

			Therefore, when animating shadows for many DOM nodes simultaneously, animation may become jerky. Animation performance is also impacted by the number of shadows being animated per element, and other factors such as the blur radius for shadows. Keep this in mind when designing effects using shadow animation, and test in a few browsers that support shadows to see if your effects need to be "dialed back" a bit to perform adequately in all.

		Match Structure of Start and End Values
			When animating a shadow between a start value and an end value, it is important that the structure of the start value is the same as that of the end value in the following key ways...

			Use All the Same Units For Start and End Values
				While the units for different properties of a shadow don't all have to be the same, all spacial properties for the start value of a shadow should have the same unit as the *corresponding* properties of the end value of a shadow.

				For =textShadow= values where there are multiple shadows (see `Supports an Arbitrary Number of Shadows`), this rule applies to each one of the shadows in the start value and the corresponding shadow in the end value. Also, the start and end values should also have the same number of shadows in such cases.

				All this is best illustrated with an example...

				INCORRECT
				......................................................
				Uize.Fx.fadeStyle (
					'myNode',
					{
						color:'#fff',
						backgroundColor:'#000',
						textShadow:'#000 0em 0 0em, #000 0px 0 0px'
					},
					{
						color:'#000',
						backgroundColor:'#045',
						textShadow:'#0ff -30px 0 .5em, #0ff 30px 0 .5em'
					},
					500
				);
				......................................................

				In the above example, the horizontal offset for the first shadow is specified as =0em= in the start value and as =-30px= in the end value. The units should match. Similarly, the blur radius for the second shadow is specified as =0px= in the start value and as =.5em= in the end value. Once again we mismatching units. It doesn't matter that =0em= is practically the same as =0px=. In order to not confuse the interpolation code, the same unit should be used for both start value and end value.

				CORRECT
				......................................................
				Uize.Fx.fadeStyle (
					'myNode',
					{
						color:'#fff',
						backgroundColor:'#000',
						textShadow:'#000 0px 0 0em, #000 0px 0 0em'
					},
					{
						color:'#000',
						backgroundColor:'#045',
						textShadow:'#0ff -30px 0 .5em, #0ff 30px 0 .5em'
					},
					500
				);
				......................................................

				Now the units match for *corresponding* properties of *corresponding* shadows, between the start value and the end value.

				### The Color Exception
					- unlike the spatial shadow properties, color can be specified in any format supported by the =Uize.Color= module, and color will always be resolved to the =sRGB= color space.

			Always Specify Units When Not Using px
				When no unit is specified for a spatial property, its unit defaults to "px", so the rule to `use all the same units for start and end values` applies in this case as well.

				So, for instance, you should not omit the unit for a spatial property of a shadow in the start value if the unit specified for the corresponding property of the corresponding shadow in the end value is not "px". Consider the following example...

				INCORRECT
				..................................
				Uize.Fx.fadeStyle (
					'myNode',
					{
						color:'#fff',
						backgroundColor:'#666',
						textShadow:'#0 .3em .3em .3'
					},
					{
						color:'#000',
						backgroundColor:'#6a9',
						textShadow:'#f 0 0em .3em'
					},
					500
				);
				..................................

				In the above example, the horizontal offset of the text shadow is being specified as =.3em= in the start value and as just =0= in the end value. The unit for the end value's version is defaulted to "px", and so the units for horizontal offset don't match. Similarly, the blur radius of the text shadow is being specified as =.3= in the start value and as =.3em= in the end value. The unit for the start value's version is defaulted to "px", and so the units for blur radius don't match.

				CORRECT
				....................................
				Uize.Fx.fadeStyle (
					'myNode',
					{
						color:'#fff',
						backgroundColor:'#666',
						textShadow:'#0 .3em .3em .3em'
					},
					{
						color:'#000',
						backgroundColor:'#6a9',
						textShadow:'#f 0em 0em .3em'
					},
					500
				);
				....................................

				Now the units match for *corresponding* properties of *corresponding* shadows, between the start value and the end value.

			Same Number of Shadows
				For =textShadow= values where there are multiple shadows (see `Supports an Arbitrary Number of Shadows`), both the start value and the end value should contain the same number of shadows.

				INCORRECT
				.................................................................................
				Uize.Fx.fadeStyle (
					'myNode',
					{
						color:'#fff',
						backgroundColor:'#000',
						textShadow:'#000 0px 0 0em, #000 0px 0 0em, #000 0px 0 0em, #000 0px 0 0em'
					},
					{
						color:'#000',
						backgroundColor:'#045',
						textShadow:'#0ff -30px 0 .5em, #0ff 30px 0 .5em'
					},
					500
				);
				.................................................................................

				In the above example, the start value for =textShadow= contains four shadows, while the end value contains only two.

				CORRECT
				.........................................................................................
				Uize.Fx.fadeStyle (
					'myNode',
					{
						color:'#fff',
						backgroundColor:'#000',
						textShadow:'#000 0px 0 0em, #000 0px 0 0em, #000 0px 0 0em, #000 0px 0 0em'
					},
					{
						color:'#000',
						backgroundColor:'#045',
						textShadow:'#0ff -30px 0 .5em, #0ff 30px 0 .5em, #0f0 -20px 0 1em, #0f0 20px 0 1em'
					},
					500
				);
				.........................................................................................

				Now we have four shadows for the start value as well as the end value.

			Shadows Must Have Same Properties Specified
				While the =Uize.Fx.xShadows= module supports `flexible arrangement of shadow properties`, with some properties being optional and having defaulting behavior, whatever properties are specified for a shadow in the start value, those same properties should all be specified for the corresponding shadow in the end value.

				This is best illustrated with an example...

				INCORRECT
				................................................................
				Uize.Fx.fadeStyle (
					'myNode',
					{
						color:'#000',
						backgroundColor:'#888',
						textShadow:'-1 0 #fff, #fff 1 0 0,0 -1 #fff, 0 1 0 #fff'
					},
					{
						color:'#000',
						backgroundColor:'#000',
						textShadow:'-1 0 0 #f95, 1 0 0 #fc0,0 -1 #ff0, 0 1 0 #f00'
					},
					500
				);
				................................................................

				In the above example, the problem is with the way the properties of the first shadow are specified in the start and end values. While the optional blur radius property does default to =0= when not specified, if you specify it in a shadow in the start value, then you must specify it in the corresponding shadow in the end value. Looking at the second shadow, you'll notice that the order of the properties is different between the start and end values. This is fine, because the =Uize.Fx.xShadows= module supports `flexible arrangement of shadow properties`, as long as all the same properties are present for any given shadow in both the start and end values. Looking at the third shadow, you'll notice that the blur radius is not specified in either the start value or the end value. This is fine as well, since it will default to =0=.

				CORRECT
				................................................................
				Uize.Fx.fadeStyle (
					'myNode',
					{
						color:'#000',
						backgroundColor:'#888',
						textShadow:'-1 0 0 #fff, #fff 1 0 0,0 -1 #fff, 0 1 0 #fff'
					},
					{
						color:'#000',
						backgroundColor:'#000',
						textShadow:'-1 0 0 #f95, 1 0 0 #fc0,0 -1 #ff0, 0 1 0 #f00'
					},
					500
				);
				................................................................

				Looking at all the shadows now, you'll notice that each shadow has all the same properties between the start and end values.
*/

Uize.module ({
	name:'Uize.Fx.xShadows',
	required:[
		'Uize.Color',
		'Uize.Node'
	],
	builder:function (_package) {
		'use strict';

		/*** General Variables ***/
			var
				_extension = function () {},
				_shadowPropertiesRegExp,
				_encoderExpression = 'Uize.Fx.xShadows.toShadow(VALUE)'
			;

		/*** Utility Functions ***/
			function _initializeShadowPropertiesRegExp () {
				if (_shadowPropertiesRegExp) {
					_shadowPropertiesRegExp.lastIndex = 0;
				} else {
					var
						_colorPropertyRegExpStr = '(#[0-9a-f]{1,6}|(?:rgba?|hsla?)\\s*\\(.+?\\)|[a-z]+)?',
						_dimensionPropertyRegExpStr = '(?:(-?(?:\\d\\.?|\\.\\d)\\d*)(em|ex|px|in|cm|mm|pt|pc|))',
						_whitespaceRegExpStr = '\\s+',
						_optionalWhitespaceRegExpStr = '\\s*'
					;
					_shadowPropertiesRegExp = new RegExp (
						'(?:^|)' + _optionalWhitespaceRegExpStr + '(?:' +
							_colorPropertyRegExpStr +
							_whitespaceRegExpStr + _dimensionPropertyRegExpStr +
							_whitespaceRegExpStr + _dimensionPropertyRegExpStr +
							'(?:' + _whitespaceRegExpStr + _dimensionPropertyRegExpStr + ')?' +
						'|' +
							_dimensionPropertyRegExpStr +
							_whitespaceRegExpStr + _dimensionPropertyRegExpStr +
							'(?:' + _whitespaceRegExpStr + _dimensionPropertyRegExpStr + ')?' +
							'(?:' + _whitespaceRegExpStr + _colorPropertyRegExpStr + ')?' +
						')' + _optionalWhitespaceRegExpStr + '(?:$|,)',
						'g'
					);
				}
			}

			function _fromShadow (_toDecode) {
				if (Uize.isArray (_toDecode)) _toDecode = _toDecode.join (',');
				var
					_result = [],
					_shadowPropertiesMatch
				;
				_initializeShadowPropertiesRegExp ();
				while (_shadowPropertiesMatch = _shadowPropertiesRegExp.exec (_toDecode)) {
					var
						_colorAtEnd = _shadowPropertiesMatch [8],
						_offsetValuesIndex = _colorAtEnd ? 8 : 2,
						_shadow = {
							offsetX:+_shadowPropertiesMatch [_offsetValuesIndex],
							offsetXUnit:_shadowPropertiesMatch [_offsetValuesIndex + 1] || 'px',
							offsetY:+_shadowPropertiesMatch [_offsetValuesIndex + 2],
							offsetYUnit:_shadowPropertiesMatch [_offsetValuesIndex + 3] || 'px'
						},
						_colorValue = _shadowPropertiesMatch [_colorAtEnd ? 14 : 1],
						_blurRadiusValue = _shadowPropertiesMatch [_offsetValuesIndex + 4]
					;
					if (_colorValue)
						_shadow.color = Uize.Color.to (_colorValue,'RGB array')
					;
					if (_blurRadiusValue) {
						_shadow.blurRadius = +_blurRadiusValue;
						_shadow.blurRadiusUnit = _shadowPropertiesMatch [_offsetValuesIndex + 5] || 'px';
					}
					_result.push (_shadow);
				}
				return _result;
			}

			_extension.toShadow = function (_toEncode) {
				/* NOTE:
					this method is only public for reasons of code size optimization (to avoid having to use the determine-scrunched-private-property-name-for-global-dereferencing trick)
				*/
				var _shadows = [];
				for (var _shadowNo = -1, _toEncodeLength = _toEncode.length, _shadow; ++_shadowNo < _toEncodeLength;)
					_shadows.push (
						(_shadow = _toEncode [_shadowNo]).offsetX + _shadow.offsetXUnit +
						' ' + _shadow.offsetY + _shadow.offsetYUnit +
						('blurRadius' in _shadow ? (' ' + _shadow.blurRadius + _shadow.blurRadiusUnit) : '') +
						('color' in _shadow ? (' ' + Uize.Color.to (_shadow.color,'#hex')) : '')
					)
				;
				return _shadows.join (',');
			};

		_package.defineStylePropertiesProfile ({
			test:'boxShadow',
			remappedProperty:Uize.Node.isSafari ? 'WebkitBoxShadow' : Uize.Node.isMozilla ? 'MozBoxShadow' : 'boxShadow',
			decoder:_fromShadow,
			encoderExpression:_encoderExpression
		});

		_package.defineStylePropertiesProfile ({
			test:'textShadow',
			decoder:_fromShadow,
			encoderExpression:_encoderExpression
		});

		return _extension;
	}
});

