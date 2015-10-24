/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Fade.xFactory Class Extension
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2008-2015 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Extension
	importance: 5
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Fade.xFactory= module implements factory methods for conveniently initiating fades, along with a system for managing a pool of active fades.

		*DEVELOPERS:* `Chris van Rensburg`

		The =Uize.Fade.xFactory= module extends the =Uize.Fade= class by adding factory methods for conveniently initiating fades, and by implementing a mechanism for automatically managing a pool of active fade instances.

		BACKGROUND READING

		For an in-depth discussion on animation in the UIZE JavaScript Framework, and for a discussion on how this module fits into the larger picture, consult the guide [[../guides/javascript-animation-and-effects.html][JavaScript Animation and Effects]] and read through the section `The Fade Factory`.
*/

Uize.module ({
	name:'Uize.Fade.xFactory',
	required:[
		'Uize.Fade',
		'Uize.Fade.Factory'
	],
	builder:function () {
		'use strict';

		Uize.Fade.Factory.extend (Uize.Fade);
		/*?
			Static Methods
				Uize.Fade.fade
					Lets you conveniently initiate a generic fade process.

					SYNTAX
					..........................
					fadeOBJ = Uize.Fade.fade (
						targetINSTorFUNCorOBJ,
						startValueANYTYPE,
						endValueANYTYPE,
						durationINT
					);
					..........................

					EXAMPLE 1
					...................................
					Uize.Fade.fade (slider,0,100,2000);
					...................................

					In the above example, the =value= state property for the =Uize.Widget.Bar.Slider= instance =slider= would be faded from =0= to =100= over =2000= milliseconds (2 seconds).

					EXAMPLE 2
					............................................
					Uize.Fade.fade (scrollTo,[0,0],[0,200],500);
					............................................

					In the above example, the vertical scroll position of the document will be faded from =0= to =200= over a half second.

					The =scrollTo= method of the =window= object takes two parameters: left scroll position, and top scroll position. Using the =Uize.Fade.fade= method to fade calls to this function, a start parameter list of =[0,0]= is specified, and an end parameter list of =[0,200]= is specified. This has the effect of fading the scroll position of the window from 0,0 to 0,200. In this example, the left scroll position is the same at the start and end of the fade, but there's no saying that it has to be.

					Being able to easily fade function calls with interpolated argument lists is very powerful and makes it easy to do quite a lot in just a short statement. In another example, one could achieve a window roll down effect with a statement like =Uize.Fade.fade (resizeTo,[1024,0],[1024,768],1000)=.

					EXAMPLE 3
					.......................................................................
					Uize.Fade.fade (
						function (colors) {
							var docStyle = document.body.style;
							docStyle.color = Uize.Color.to (colors.textColor,'#hex');
							docStyle.backgroundColor = Uize.Color.to (colors.bgColor,'#hex');
						},
						{
							textColor:{red:255,green:0,blue:255}, // purple
							bgColor:{red:0,green:0,blue:0}        // black
						},
						{
							textColor:{red:0,green:0,blue:0},     // black
							bgColor:{red:255,green:0,blue:255}    // purple
						},
						3000
					);
					.......................................................................

					In the above example, the text and background colors for the document would be faded from purple on black to black on purple over =3000= milliseconds (3 seconds).

					The start and end values specified for the fade are complex values, each being an object with =textColor= and =bgColor= properties that are, themselves, objects representing the =red=, =green=, and =blue= color channel values for RGB colors. On each update of the fade the specified handler function is called, with the interpolated value for the fade being passed to the function as its single parameter. The structure of the interpolated value matches the structure of the start and end values, and so its =textColor= and =bgColor= properties are accessed and used to set the colors on the document body's style object.

					VARIATION 1
					..........................
					fadeOBJ = Uize.Fade.fade (
						targetINSTorFUNCorOBJ,
						startValueANYTYPE,
						endValueANYTYPE,
						durationINT,
						fadePropertiesOBJ
					);
					..........................

					When the optional =fadePropertiesOBJ= parameter is specified, additional values can be specified for the state properties of the =Uize.Fade= class - such as =curve=, =quantization=, etc. These property values will be set on the =Uize.Fade= instance that is created to service the fade process requested by calling this method.

					VARIATION 2
					..........................
					fadeOBJ = Uize.Fade.fade (
						targetINSTorFUNCorOBJ,
						startValueANYTYPE,
						endValueANYTYPE,
						durationINT,
						fadePropertiesOBJ,
						startNowBOOL
					);
					..........................

					By default, fades created using the =Uize.Fade.fade= method are started immediately. If you do not wish the fade to start immediately, but wish to initiate the fade at a later time by using the =start= instance method of the =Uize.Fade= instance returned from the =Uize.Fade.fade= method, then you can specify the value =false= for the optional =startNowBOOL= parameter. If you wish to use the =startNowBOOL= parameter but do not wish to specify any fade properties, then you should specify the value =null= for the =fadePropertiesOBJ= parameter.

				Uize.Fade.fadeMethod
					Lets you conveniently initiate a method call fade process.

					SYNTAX
					................................
					fadeOBJ = Uize.Fade.fadeMethod (
						contextOBJ,
						methodSTRorFUNC,
						startValueANYTYPE,
						endValueANYTYPE,
						durationINT
					);
					................................

					VARIATION 1
					................................
					fadeOBJ = Uize.Fade.fadeMethod (
						contextOBJ,
						methodSTRorFUNC,
						startValueANYTYPE,
						endValueANYTYPE,
						durationINT,
						fadePropertiesOBJ
					);
					................................

					When the optional =fadePropertiesOBJ= parameter is specified, additional values can be specified for the state properties of the =Uize.Fade= class - such as =curve=, =quantization=, etc. These property values will be set on the =Uize.Fade= instance that is created to service the fade process requested by calling this method.

					VARIATION 2
					................................
					fadeOBJ = Uize.Fade.fadeMethod (
						contextOBJ,
						methodSTRorFUNC,
						startValueANYTYPE,
						endValueANYTYPE,
						durationINT,
						fadePropertiesOBJ,
						startNowBOOL
					);
					................................

					By default, fades created using the =Uize.Fade.fadeMethod= method are started immediately. If you do not wish the fade to start immediately, but wish to initiate the fade at a later time by using the =start= instance method of the =Uize.Fade= instance returned from the =Uize.Fade.fadeMethod= method, then you can specify the value =false= for the optional =startNowBOOL= parameter. If you wish to use the =startNowBOOL= parameter but do not wish to specify any fade properties, then you should specify the value =null= for the =fadePropertiesOBJ= parameter.

				Uize.Fade.fadeProperties
					Lets you conveniently initiate a fade process for state properties of an instance.

					SYNTAX
					....................................
					fadeOBJ = Uize.Fade.fadeProperties (
						instanceOBJ,
						propertiesStartValuesOBJ,
						propertiesEndValuesOBJ,
						durationINT
					);
					....................................

					VARIATION 1
					....................................
					fadeOBJ = Uize.Fade.fadeProperties (
						instanceOBJ,
						propertiesStartValuesOBJ,
						propertiesEndValuesOBJ,
						durationINT,
						fadePropertiesOBJ
					);
					....................................

					When the optional =fadePropertiesOBJ= parameter is specified, additional values can be specified for the state properties of the =Uize.Fade= class - such as =curve=, =quantization=, etc. These property values will be set on the =Uize.Fade= instance that is created to service the fade process requested by calling this method.

					VARIATION 2
					....................................
					fadeOBJ = Uize.Fade.fadeProperties (
						instanceOBJ,
						propertiesStartValuesOBJ,
						propertiesEndValuesOBJ,
						durationINT,
						fadePropertiesOBJ,
						startNowBOOL
					);
					....................................

					By default, fades created using the =Uize.Fade.fadeProperties= method are started immediately. If you do not wish the fade to start immediately, but wish to initiate the fade at a later time by using the =start= instance method of the =Uize.Fade= instance returned from the =Uize.Fade.fadeProperties= method, then you can specify the value =false= for the optional =startNowBOOL= parameter. If you wish to use the =startNowBOOL= parameter but do not wish to specify any fade properties, then you should specify the value =null= for the =fadePropertiesOBJ= parameter.

					NOTES
					- compare to the =Uize.Fade.fadeProperty= static method

				Uize.Fade.fadeProperty
					Lets you conveniently initiate a fade process for a single state property of an instance.

					SYNTAX
					..................................
					fadeOBJ = Uize.Fade.fadeProperty (
						instanceOBJ,
						propertyNameSTR,
						propertyStartValueANYTYPE,
						propertyEndValueANYTYPE,
						durationINT
					);
					..................................

					VARIATION 1
					..................................
					fadeOBJ = Uize.Fade.fadeProperty (
						instanceOBJ,
						propertyNameSTR,
						propertyStartValueANYTYPE,
						propertyEndValueANYTYPE,
						durationINT,
						fadePropertiesOBJ
					);
					..................................

					When the optional =fadePropertiesOBJ= parameter is specified, additional values can be specified for the state properties of the =Uize.Fade= class - such as =curve=, =quantization=, etc. These property values will be set on the =Uize.Fade= instance that is created to service the fade process requested by calling this method.

					VARIATION 2
					..................................
					fadeOBJ = Uize.Fade.fadeProperty (
						instanceOBJ,
						propertyNameSTR,
						propertyStartValueANYTYPE,
						propertyEndValueANYTYPE,
						durationINT,
						fadePropertiesOBJ,
						startNowBOOL
					);
					..................................

					By default, fades created using the =Uize.Fade.fadeProperty= method are started immediately. If you do not wish the fade to start immediately, but wish to initiate the fade at a later time by using the =start= instance method of the =Uize.Fade= instance returned from the =Uize.Fade.fadeProperty= method, then you can specify the value =false= for the optional =startNowBOOL= parameter. If you wish to use the =startNowBOOL= parameter but do not wish to specify any fade properties, then you should specify the value =null= for the =fadePropertiesOBJ= parameter.

					NOTES
					- compare to the =Uize.Fade.fadeProperties= static method
		*/
	}
});

