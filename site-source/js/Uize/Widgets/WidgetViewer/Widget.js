/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.WidgetViewer.Widget Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013-2015 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 1
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Widgets.WidgetViewer.Widget= class implements a widget base class for the visual samplers and visual tests viewers.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widgets.WidgetViewer.Widget',
	superclass:'Uize.Widget.V2',
	required:[
		'Uize.Widgets.WidgetViewer.Html',
		'Uize.Widgets.WidgetViewer.Css'
	],
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			instanceMethods:{
				insertViewer:Uize.nop
			},

			staticProperties:{
				cssModule:Uize.Widgets.WidgetViewer.Css
			},

			set:{
				html:Uize.Widgets.WidgetViewer.Html
			},

			stateProperties:{
				_modules:'modules',
				_value:'value',
				_displayedSelectorOptions:'displayedSelectorOptions'
			},

			eventBindings:{
				'#selector:change':function () {
					this.set ({value:this.getNodeValue ('selector')});
				}
			},

			htmlBindings:{
				loc_selectorLabel:'selectorLabel:value',
				displayedSelectorOptions:function (_displayedSelectorOptions) {
					var
						m = this,
						_selector = m.getNode ('selector'),
						_selectorOptions = _selector.options
					;
					_selectorOptions.length = 0;
					for (
						var
							_displayedSelectorOptionNo = -1,
							_displayedSelectorOptionsLength = _displayedSelectorOptions.length
						;
						++_displayedSelectorOptionNo < _displayedSelectorOptionsLength;
					) {
						var _displayedSelectorOption = _displayedSelectorOptions [_displayedSelectorOptionNo];
						_selectorOptions [_selectorOptions.length] = new Option (
							_displayedSelectorOption [0],
							_displayedSelectorOption [1]
						);
					}
					m.setNodeValue (_selector,m.get ('value'));
				},
				value:[
					'selector:value',
					function (_value) {
						var m = this;
						if (m.children.viewer) {
							m.removeChild ('viewer');
							m.setNodeInnerHtml ('viewer','');
						}
						_value != undefined && _value != '-' && m.insertViewer (_value);
					}
				]
			}
		});
	}
});

