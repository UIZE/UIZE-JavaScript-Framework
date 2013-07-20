/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.Tooltip.Widget Class
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
		The =Uize.Widgets.Tooltip.Widget= module implements a widget class.

		*DEVELOPERS:* `Chris van Rensburg`

		Visual Sampler
			Below is a visual sampler of the =Uize.Widgets.Tooltip.Widget= class...

			...................................................
			<< widget >>

			widgetClass: Uize.Widgets.Tooltip.VisualSampler
			...................................................
*/

Uize.module ({
	name:'Uize.Widgets.Tooltip.Widget',
	superclass:'Uize.Widgets.BoxWithHeading.Widget',
	required:[
		'Uize.Widgets.Tooltip.Css'
	],
	builder:function (_superclass) {
		'use strict';

		function _updateUiHeading () {
			this.isWired && this.setNodeInnerHtml ('heading',this.get ('heading'));
		}

		function _updateUiBody () {
			if (this.isWired) {
				var _bodyHtml = this.get ('body') || '';
				this.setNodeInnerHtml ('body',_bodyHtml);
				this.displayNode ('body',_bodyHtml);
			}
		}

		return _superclass.subclass ({
			omegastructor:function () {
				var _this = this;
				_this.wire ({
					'Changed.heading':function () {_updateUiHeading.call (_this)},
					'Changed.body':function () {_updateUiBody.call (_this)}
				});
			},

			instanceMethods:{
				updateUi:function () {
					_updateUiHeading.call (this);
					_updateUiBody.call (this);
				}
			},

			staticProperties:{
				cssModule:Uize.Widgets.Tooltip.Css
			}
		});
	}
});

