/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Fade.mSeries Class Mixin
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2009-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Mixin
	importance: 2
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Fade.mSeries= mixin module lets you mix in static and instance methods for interpolating a series of values between specified start and end values, into =Uize.Fade= subclasses.

		*DEVELOPERS:* `Chris van Rensburg`

		In a Nutshell
			The methods defined in the =Uize.Fade.mSeries= module utilize the =Uize.Fade= class to let you create arrays of interpolated values.

			Typically, the =Uize.Fade= class is used to produce time-based animations, but this class can also be used solely for its powerful value interpolation capabilities. The =getSeries= and =Uize.Fade.getSeries= methods defined in this mixin module could be useful when using fades in non-time based applications, such as displaying values in a bar chart, fading colors over a series of elements, plotting positions for a series of elements, populating data sets, etc.

			EXAMPLE
			..................................................................
			var MyFadeClass = Uize.Fade.subclass ({mixins:Uize.Fade.mSeries});

			function fadeNodesBgColor (nodes,startColorStr,endColorStr) {
				var colors = MyFadeClass.getSeries (
					Uize.Color.to (startColorStr,'RGB array'),
					Uize.Color.to (endColorStr,'RGB array'),
					nodes.length
				);
				for (var nodeNo = nodes.length; --nodeNo >= 0;) {
					Uize.Dom.Basics.setStyle (
						nodes [nodeNo],
						{backgroundColor:Uize.Color.to (colors [nodeNo],'#hex')}
					);
				}
			}
			..................................................................

			In the above example, a function is defined that will accept an array of DOM nodes, a start color, and an end color, and will then set the background color of all the nodes by fading from the start color to the end color.

			BACKGROUND READING

			For an in-depth discussion on animation in the UIZE JavaScript Framework, and for a discussion on how this module fits into the larger picture, consult the guide [[../guides/javascript-animation-and-effects.html][JavaScript Animation and Effects]] and read through the section `The Fade Factory`.
*/

Uize.module ({
	name:'Uize.Fade.mSeries',
	builder:function () {
		'use strict';

		return function (_class) {
			_class.declare ({
				instanceMethods:{
					getSeries:function (_valuesLength) {
						var
							m = this,
							_values = [],
							_valuesLengthMinus1 = Math.max (_valuesLength - 1,1)
						;
						for (var _valueNo = -1; ++_valueNo < _valuesLength;) {
							m.set ({progress:_valueNo / _valuesLengthMinus1});
							_values.push (Uize.clone (m.valueOf ()));
						}
						return _values;
						/*?
							Instance Methods
								getSeries
									Returns an array, representing a series - of the specified length - of the interpolated values that would be generated over the course of the fade's progress.

									SYNTAX
									..........................................................
									valueSeriesARRAY = myInstance.getSeries (seriesLengthINT);
									..........................................................

									The value series is generated using the current values for the fade instance's state properties. This method could be useful when using fades in non-time based applications, such as displaying values in a bar chart, fading colors over a series of elements, plotting positions for a series of elements, populating data sets, etc.

									NOTES
									- if the value =0= is specified for the =seriesLengthINT= parameter, then this method will return an empty array
									- if the value =1= is specified for the =seriesLengthINT= parameter, then this method will return an array containing one element whose value is the value of the fade's =startValue= state property
									- if the value =2= is specified for the =seriesLengthINT= parameter, then this method will return an array containing two elements, where the value of the first element is the value of the fade's =startValue= state property, and the value of the second element is the value of the fade's =endValue= state property
									- compare to the =Uize.Fade.getSeries= static method
						*/
					}
				},

				staticMethods:{
					getSeries:function (_startValue,_endValue,_valuesLength,_fadeProperties) {
						return this (
							Uize.copyInto ({startValue:_startValue,endValue:_endValue},_fadeProperties)
						).getSeries (
							_valuesLength
						);
						/*?
							Static Methods
								Uize.Fade.getSeries
									Returns an array, representing a series - of the specified length - of the interpolated values that would be generated over the course of a fade's progress.

									SYNTAX
									..........................................
									valueSeriesARRAY = MyFadeClass.getSeries (
										startValueNUMorARRAYorOBJ,
										endValueNUMorARRAYorOBJ,
										seriesLengthINT
									);
									..........................................

									VARIATION
									..........................................
									valueSeriesARRAY = MyFadeClass.getSeries (
										startValueNUMorARRAYorOBJ,
										endValueNUMorARRAYorOBJ,
										seriesLengthINT,
										fadePropertiesOBJ
									);
									..........................................

									By default, the values in the series are interpolated linearly. However, by using the optional =fadePropertiesOBJ= parameter it is possible to control all the properties of a fade, such as =curve= and =quantization=.

									NOTES
									- if the value =0= is specified for the =seriesLengthINT= parameter, then this method will return an empty array
									- if the value =1= is specified for the =seriesLengthINT= parameter, then this method will return an array containing one element whose value is the value of the =startValueNUMorARRAYorOBJ= parameter
									- if the value =2= is specified for the =seriesLengthINT= parameter, then this method will return an array containing two elements, where the value of the first element is the value of the =startValueNUMorARRAYorOBJ= parameter, and the value of the second element is the value of the =endValueNUMorARRAYorOBJ= parameter
									- compare to the =getSeries= instance method
						*/
					}
				}
			});
		};
	}
});

