/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Widgets.EnabledBusyDemo.Widget Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2008-2013 UIZE
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
		The =UizeSite.Widgets.EnabledBusyDemo.Widget= class implements a widget that is used to demonstrate how the =enabled= and =busy= state properties behave with widgets in a widget tree.

		*DEVELOPERS:* `Chris van Rensburg`

		Visual Sampler
			Below is a visual sampler of the =UizeSite.Widgets.EnabledBusyDemo.Widget= class...

			...........................................................
			<< widget >>

			widgetClass: UizeSite.Widgets.EnabledBusyDemo.VisualSampler
			...........................................................
*/

Uize.module ({
	name:'UizeSite.Widgets.EnabledBusyDemo.Widget',
	superclass:'Uize.Widget.V2',
	required:[
		'Uize.Widgets.Button.Widget',
		'UizeSite.Widgets.EnabledBusyDemo.Html',
		'UizeSite.Widgets.EnabledBusyDemo.Css'
	],
	builder:function (_superclass) {
		'use strict';

		var _class = _superclass.subclass ({
			omegastructor:function () {
				var _this = this;

				/*** add child button widgets ***/
					_this._addChildButton (
						'button1',
						function () {
							alert (_this.get ('idPrefix') + ' --- click button 1');
						}
					);
					_this._addChildButton (
						'button2',
						function () {
							alert (_this.get ('idPrefix') + ' --- click button 2');
						}
					);

				/*** code to update UI whenever enabled and busy state properties change ***/
					var _updateUi = function () {_this.updateUi ()};
					_this.wire ({
						'Changed.enabled':_updateUi,
						'Changed.busy':_updateUi
					});
			},

			instanceMethods:{
				_addChildButton:Uize.Widgets.Button.Widget.addChildButton,

				updateUi:function () {
					var _this = this;
					if (_this.isWired) {
						_this.setNodeValue ('enabledSelector',_this.get ('enabled'));
						_this.setNodeValue ('busySelector',_this.get ('busy'));
					}
				},

				wireUi:function () {
					var _this = this;
					if (!_this.isWired) {
						var _valuesMap = {'false':false,'true':true,inherit:'inherit'};
						_this.wireNode (
							'enabledSelector',
							'change',
							function () {_this.set ({enabled:_valuesMap [_this.getNodeValue ('enabledSelector')]})}
						);
						_this.wireNode (
							'busySelector',
							'change',
							function () {_this.set ({busy:_valuesMap [_this.getNodeValue ('busySelector')]})}
						);

						_superclass.doMy (_this,'wireUi');
					}
				},

				resetEnabledAndBusy:function () {
					this.set ({enabled:'inherit',busy:'inherit'});
					Uize.callOn (this.children,'resetEnabledAndBusy');
				}
			},

			set:{
				html:UizeSite.Widgets.EnabledBusyDemo.Html
			},

			staticProperties:{
				cssModule:UizeSite.Widgets.EnabledBusyDemo.Css
			},

			stateProperties:{
				_depth:'depth'
			},

			cssBindings:{
				depth:'"depth" + value'
			}
		});

		return _class;
	}
});

