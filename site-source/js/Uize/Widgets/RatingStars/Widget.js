/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.RatingStars.Widget Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 1
	codeCompleteness: 100
	docCompleteness: 5
*/

/*?
	Introduction
		The =Uize.Widgets.ImagePort.Widget= module implements a widget class for a rating stars widget.

		*DEVELOPERS:* `Chris van Rensburg`

		In a Nutshell
			The =Uize.Widgets.ImagePort.Widget= widget module supports a very simple interface with two state properties: =value= and =maxValue=.

			The =maxValue= state property is used to specify the maximum possible number of stars that a rating can have, and the =value= state property is used to specify the number of rating stars for the current rating value.

			EXAMPLE
			....................................................
			var ratingStars = Uize.Widgets.RatingStars.Widget ({
				value:2.5,
				maxValue:5,
				size:'tiny'
			});
			....................................................

			In the above example, a rating stars widget is being created to display a two and half stars out of five rating at the ='tiny'= size.

		Visual Sampler
			Below is a visual sampler of the =Uize.Widgets.RatingStars.Widget= class...

			...................................................
			<< widget >>

			widgetClass: Uize.Widgets.RatingStars.VisualSampler
			...................................................
*/

Uize.module ({
	name:'Uize.Widgets.RatingStars.Widget',
	superclass:'Uize.Widget.V2',
	required:[
		'Uize.Widgets.RatingStars.Html',
		'Uize.Widgets.RatingStars.Css'
	],
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			set:{
				html:Uize.Widgets.RatingStars.Html
			},

			staticProperties:{
				cssModule:Uize.Widgets.RatingStars.Css
			},

			stateProperties:{
				value:{
					value:0
					/*?
						State Properties
							value
								A number, in the range of =0= to the value of the =maxValue= state property, indicating the number of rating stars.

								The value of this property may be fractional. So, for example, it is perfectly acceptable for the rating value to be =3.25= stars out of =5=.

								NOTES
								- see the related =maxValue= state property
								- the initial value is =0=
					*/
				},
				maxValue:{
					value:5
					/*?
						State Properties
							maxValue
								A positive integer, indicating the maximum number of rating stars that are possible.

								The value of this property must be an integer. So, for example, it is not acceptable for the maximum number of rating stars to be =5.5=.

								NOTES
								- see the related =value= state property
								- the initial value is =5=
					*/
				},

				/*** derived properties ***/
					_tooltipText:{
						derived:'value, maxValue: value + " / " + maxValue'
					},
					_starsOnRight:{
						derived:'value, maxValue: ((1 - value / maxValue) * 100).toFixed (2) + "%"'
					},
					_starsText:{
						derived:'maxValue: Uize.map (maxValue,"\'★\'").join ("")'
					}
			},

			htmlBindings:{
				_tooltipText:':title',
				_starsOnRight:'starsOn:style.right',
				_starsText:['starsOff','starsOn']
			}
		});
	}
});

