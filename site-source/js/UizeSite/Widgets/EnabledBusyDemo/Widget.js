/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Widgets.EnabledBusyDemo.Widget Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2008-2016 UIZE
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

		return _superclass.subclass ({
			omegastructor:function () {
				var m = this;

				/*** add child button widgets ***/
					m.addChildren (
						{
							button1:{action:function () {alert (m.get ('idPrefix') + ' --- click button 1')}},
							button2:{action:function () {alert (m.get ('idPrefix') + ' --- click button 2')}}
						},
						{widgetClass:Uize.Widgets.Button.Widget}
					);

				/*** code to update UI whenever enabled and busy state properties change ***/
					var _updateUi = function () {m.updateUi ()};
					m.wire ({
						'Changed.enabled':_updateUi,
						'Changed.busy':_updateUi
					});
			},

			instanceMethods:{
				updateUi:function () {
					var m = this;
					if (m.isWired) {
						m.setNodeValue ('enabledSelector',m.get ('enabled'));
						m.setNodeValue ('busySelector',m.get ('busy'));
					}
				},

				wireUi:function () {
					var m = this;
					if (!m.isWired) {
						var _valuesMap = {'false':false,'true':true,inherit:'inherit'};
						m.wireNode (
							'enabledSelector',
							'change',
							function () {m.set ({enabled:_valuesMap [m.getNodeValue ('enabledSelector')]})}
						);
						m.wireNode (
							'busySelector',
							'change',
							function () {m.set ({busy:_valuesMap [m.getNodeValue ('busySelector')]})}
						);

						_superclass.doMy (m,'wireUi');
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
			},

			htmlBindings:{
				idPrefix:'heading:html'
			}
		});
	}
});

