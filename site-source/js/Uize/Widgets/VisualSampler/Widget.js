/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.VisualSampler.Widget Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 1
	codeCompleteness: 5
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Widgets.VisualSampler.Widget= class implements a base class for widget visual samplers, to be subclassed when creating visual samplers for other widget classes.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widgets.VisualSampler.Widget',
	superclass:'Uize.Widgets.BoxWithHeading.Widget',
	required:[
		'Uize.Widget.V2',
		'Uize.Widgets.VisualSampler.Html',
		'Uize.Data.Combinations'
	],
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			alphastructor:function () {
				this._totalSamples = 0;
			},

			omegastructor:function () {
				this._samples = this.addChild ('samples',Uize.Widget.V2);
			},

			instanceMethods:{
				addStateCombinationSamples:function (_stateCombinationsSpecifier) {
					var m = this;
					Uize.Data.Combinations.forEach (
						_stateCombinationsSpecifier,
						function (_state) {m.addSample (_state)}
					);
				},

				addSample:function (_state) {
					var m = this;
					return m._samples.addChild ('sample' + m._totalSamples++,m.Class.widgetClass,_state);
				}
			},

			staticProperties:{
				widgetClass:null // override this in a subclass
			},

			set:{
				html:Uize.Widgets.VisualSampler.Html
			}
		});
	}
});

