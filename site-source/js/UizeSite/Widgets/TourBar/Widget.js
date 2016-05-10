/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Widgets.TourBar.Widget Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013-2016 UIZE
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
		The =UizeSite.Widgets.TourBar.Widget= module implements a widget class.

		*DEVELOPERS:* `Chris van Rensburg`

		Visual Sampler
			Below is a visual sampler of the =UizeSite.Widgets.TourBar.Widget= class...

			...................................................
			<< widget >>

			widgetClass: UizeSite.Widgets.TourBar.VisualSampler
			...................................................
*/

Uize.module ({
	name:'UizeSite.Widgets.TourBar.Widget',
	superclass:'Uize.Widget.V2',
	required:[
		'Uize.Dom.Basics',
		'UizeSite.Examples',
		'Uize.Url',
		'Uize.Tooltip',
		'UizeSite.Widgets.TourBar.Html',
		'UizeSite.Widgets.TourBar.Css',
		'UizeSite.Widgets.ExampleInfoTooltip.Widget'
	],
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			omegastructor:function () {
				this.set ({_pageUrl:window.location.href});
				this.addChild ('tooltip',UizeSite.Widgets.ExampleInfoTooltip.Widget,{built:false});
			},

			instanceMethods:{
				wireUi:function () {
					var m = this;
					if (!m.isWired) {
						_superclass.doMy (m,'wireUi');

						var _getTourExampleByUrl = function (_url) {
							var _tourExamplesMap = _getTourExampleByUrl._map;
							if (!_tourExamplesMap) {
								_tourExamplesMap = _getTourExampleByUrl._map = {};
								Uize.forEach (
									UizeSite.Examples (),
									function (_tourExample) {
										_tourExamplesMap [Uize.Url.from (_tourExample.path).fileName] = _tourExample;
									}
								);
							}
							return _tourExamplesMap [Uize.Url.from (_url).fileName];
						};

						var
							_tooltip = m.children.tooltip,
							_tooltipNode = _tooltip.getNode ()
						;
						Uize.Dom.Basics.display (_tooltipNode,false);
						m.wireNode (
							Uize.Dom.Basics.find ({root:m.getNode (),tagName:'a'}),
							{
								mouseover:function () {
									var _tourExample = _getTourExampleByUrl (this.getAttribute ('href'));
									_tooltip.set ({
										heading:_tourExample.title,
										body:_tourExample.description
									});
									Uize.Tooltip.showTooltip (_tooltipNode);
								},
								mouseout:function () {Uize.Tooltip.showTooltip (_tooltipNode,false)}
							}
						);
					}
				}
			},

			set:{
				html:UizeSite.Widgets.TourBar.Html
			},

			staticProperties:{
				cssModule:UizeSite.Widgets.TourBar.Css
			},

			stateProperties:{
				_pageUrl:'pageUrl'
			}
		});
	}
});

