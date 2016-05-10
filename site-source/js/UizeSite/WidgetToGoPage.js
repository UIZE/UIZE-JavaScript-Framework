/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.WidgetToGoPage
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2009-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*?
	Introduction
		A subclass of =Uize.Widget.Page= that provides functionality that is generally useful to widgets that are intended to be used remotely in an IFRAME.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'UizeSite.WidgetToGoPage',
	superclass:'Uize.Widget.Page',
	required:[
		'Uize.Dom.Basics',
		'Uize.Dom.Pos',
		'UizeSite.Templates.WidgetToGoTitle',
		'Uize.Widget.PopupPalette'
	],
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			omegastructor:function () {
				this.addChild (
					'menu',
					Uize.Widget.PopupPalette,
					{
						hideWhenOut:true,
						positioning:'absolute'
					}
				).fade.set ({duration:0});
			},

			instanceMethods:{
				wireUi:function () {
					var m = this;
					if (!m.isWired) {
						/*** insert the title HTML ***/
							Uize.Dom.Basics.injectHtml (
								document.body,
								UizeSite.Templates.WidgetToGoTitle.process ({
									idPrefix:m.get ('idPrefix'),
									title:document.title
								})
							);

						/*** add the main child widget ***/
							Uize.require (
								[m._widgetToGoClass,m._widgetToGoHtml],
								function (_widgetToGoClass,_widgetToGoHtml) {
									m.addChild (
										'widget',
										_widgetToGoClass,
										{
											built:false,
											html:_widgetToGoHtml
										}
									).insertOrWireUi ();
								}
							);

						/*** wire up the menu links ***/
							var
								_menu = m.children.menu,
								_widgetHomepageUrl = '../' + m._title.toLowerCase ().replace (/\s+/g,'-') + '.html',
								_launchPopup = function (_name,_url,_width,_height,_haveStuff) {
									page.launchPopup ({
										name:_name,
										url:_url,
										width:_width,
										height:_height,
										toolbar:_haveStuff,
										location:_haveStuff,
										directories:_haveStuff,
										status:_haveStuff,
										menubar:_haveStuff,
										scrollbars:_haveStuff,
										resizable:_haveStuff
									});
								},
								_wireUpPopupLink = function (_nodeName,_url) {
									_menu.wireNode (_nodeName,'click',function () {_launchPopup (null,_url,1010,690,1)});
								}
							;
							_wireUpPopupLink ('getThisWidget',_widgetHomepageUrl);
							_wireUpPopupLink ('aboutThisWidget',_widgetHomepageUrl);
							_wireUpPopupLink ('moreWidgets','../../javascript-widgets.html');
							_wireUpPopupLink ('uize','../../index.html');

							_menu.wireNode (
								'openInNewWindow',
								'click',
								function () {
									var _windowDims = Uize.Dom.Pos.getDimensions (window);
									_launchPopup ('',location.href,_windowDims.width,_windowDims.height,0);
								}
							);

						_superclass.doMy (m,'wireUi');
					}
				}
			},

			stateProperties:{
				_title:'title',
				_widgetToGoClass:'widgetToGoClass',
				_widgetToGoHtml:'widgetToGoHtml'
			}
		});
	}
});

