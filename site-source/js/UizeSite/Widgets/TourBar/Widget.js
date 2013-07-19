/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Widgets.TourBar.Widget Class
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
		The =UizeSite.Widgets.TourBar.Widget= module implements a widget class.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'UizeSite.Widgets.TourBar.Widget',
	superclass:'Uize.Widget.V2',
	required:[
		'Uize.Node',
		'UizeSite.Examples',
		'Uize.Url',
		'Uize.Tooltip',
		'UizeSite.Widgets.TourBar.Html',
		'UizeSite.Widgets.TourBar.Css'
	],
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			omegastructor:function () {
				this.set ({_pageUrl:window.location.href});
			},

			instanceMethods:{
				wireUi:function () {
					var _this = this;
					if (!_this.isWired) {
						_superclass.doMy (_this,'wireUi');

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

						var _tooltipNode = _this.getNode ('tooltip');
						_this.globalizeNode (_tooltipNode);
						_this.wireNode (
							Uize.Node.find ({root:_this.getNode (),tagName:'a'}),
							{
								mouseover:function () {
									var _tourExample = _getTourExampleByUrl (this.getAttribute ('href'));

									/*** update nodes to reflect tour page being moused over ***/
										_this.setNodeValue ('tooltip-title',_tourExample.title);
										_this.setNodeValue ('tooltip-description',_tourExample.description);
										_this.setNodeValue (
											'tooltip-keywords',
											_tourExample.keywords || '-- NONE --'
										);

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

