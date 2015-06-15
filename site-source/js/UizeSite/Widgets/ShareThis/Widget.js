/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Widgets.ShareThis.Widget Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2008-2015 UIZE
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
		The =UizeSite.Widgets.ShareThis.Widget= class implements a widget that lets users easily share a link to the page they are on, using a service of their choice.

		*DEVELOPERS:* `Chris van Rensburg`

		Visual Sampler
			Below is a visual sampler of the =UizeSite.Widgets.ShareThis.Widget= class...

			.....................................................
			<< widget >>

			widgetClass: UizeSite.Widgets.ShareThis.VisualSampler
			.....................................................
*/

Uize.module ({
	name:'UizeSite.Widgets.ShareThis.Widget',
	superclass:'Uize.Widget.V2',
	required:[
		'Uize.Dom.Basics',
		'UizeSite.Widgets.ShareThis.Html',
		'UizeSite.Widgets.ShareThis.Css'
	],
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			omegastructor:function () {
				this.set (this.callInherited ('getPageInfo') ());
			},

			set:{
				html:UizeSite.Widgets.ShareThis.Html
			},

			staticProperties:{
				cssModule:UizeSite.Widgets.ShareThis.Css
			},

			stateProperties:{
				url:{value:''}
			}
		});
	}
});

