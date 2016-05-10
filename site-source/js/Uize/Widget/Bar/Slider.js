/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Bar.Slider Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2005-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 5
	codeCompleteness: 100
	docCompleteness: 60
*/

/*?
	Introduction
		The =Uize.Widget.Bar.Slider= class implements a slider widget that lets the user select a value by clicking-and-dragging the slider knob along a track.

		*DEVELOPERS:* `Chris van Rensburg`

		With the =Uize.Widget.Bar= superclass, the =knob= DOM node acts purely as a value indicator, but with the =Uize.Widget.Bar.Slider= class, the knob is draggable by the user.

		###
			- explain anatomy of a slider in Uize.Widget.Bar.Slider documentation
*/

Uize.module ({
	name:'Uize.Widget.Bar.Slider',
	required:'Uize.Widget.Bar.mSlider',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			mixins:Uize.Widget.Bar.mSlider,

			staticProperties:{
				presets:{}
			}

			/*?
				State Properties
					inDrag
						A boolean value, indicating whether or not the slider's knob is being dragged by the user.

						To monitor when a slider is being dragged, one can register an event handler on the =Changed.inDrag= instance event.

						NOTES
						- the initial value is =false=
						- this property is read-only

					restTime
						An integer, representing the time (in milliseconds) that the user must rest the mouse - during dragging the slider's knob - before the =Value Change After Rest= instance event will be fired.

						Using this property in conjunction with the =Value Change After Rest= instance event is useful in triggering updates that would be too expensive to trigger continuously during a drag operation.

						NOTES
						- the initial value is =250=

					valueFunc
						An optional function that can be provided to achieve a non-linear transformation of the slider's knob position to a value for the instance's =value= state property.

						This property should be used in conjunction with the =scaleFunc= state property. In order for the slider to operate sensibly, any function specified for this property should be the inverse of a function specified for the =scaleFunc= property. For example, if the function =function (unscaled) {return Math.pow (unscaled)}= was specified for the =scaleFunc= property, then the function =function (scaled) {return Math.sqrt (scaled)}= should be specified for the =valueFunc= property.

						NOTES
						- the initial value is a function that has no effect
			*/
		});
	}
});

