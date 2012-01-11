/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeDotCom.WidgetToGoPage
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2009-2012 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*ScruncherSettings Mappings="=d" LineCompacting="TRUE"*/

/*?
	Introduction
		A subclass of =Uize.Widget.Page= that provides functionality that is generally useful to widgets that are intended to be used remotely in an IFRAME.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'UizeDotCom.WidgetToGoPage',
	superclass:'Uize.Widget.Page',
	required:[
		'Uize.Node',
		'UizeDotCom.Templates.WidgetToGoTitle',
		'Uize.Widget.PopupPalette'
	],
	builder:function (_superclass) {
		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					null,
					function () {
						this.addChild (
							'menu',
							Uize.Widget.PopupPalette,
							{
								hideWhenOut:true,
								positioning:'absolute'
							}
						).fade.set ({duration:0});
					}
				),
				_classPrototype = _class.prototype
			;

		/*** Public Instance Methods ***/
			_classPrototype.wireUi = function () {
				var _this = this;
				if (!_this.isWired) {
					/*** insert the title HTML ***/
						Uize.Node.injectHtml (
							document.body,
							UizeDotCom.Templates.WidgetToGoTitle.process ({
								idPrefix:_this.get ('idPrefix'),
								title:document.title
							})
						);

					/*** add the main child widget ***/
						Uize.module ({
							required:[_this._widgetToGoClass,_this._widgetToGoHtml],
							builder:function () {
								_this.addChild (
									'widget',
									eval (_this._widgetToGoClass),
									{
										built:false,
										html:eval (_this._widgetToGoHtml)
									}
								).insertOrWireUi ();
							}
						});

					/*** wire up the menu links ***/
						var
							_menu = _this.children.menu,
							_widgetHomepageUrl = '../' + _this._title.toLowerCase ().replace (/\s+/g,'-') + '.html'
						;
						function _launchPopup (_name,_url,_width,_height,_haveStuff) {
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
						}
						function _wireUpPopupLink (_nodeName,_url) {
							_menu.wireNode (_nodeName,'click',function () {_launchPopup (null,_url,1010,690,1)});
						}
						_wireUpPopupLink ('getThisWidget',_widgetHomepageUrl);
						_wireUpPopupLink ('aboutThisWidget',_widgetHomepageUrl);
						_wireUpPopupLink ('moreWidgets','../../javascript-widgets.html');
						_wireUpPopupLink ('uize','../../index.html');

						_menu.wireNode (
							'openInNewWindow',
							'click',
							function () {
								var _windowDims = Uize.Node.getDimensions (window);
								_launchPopup ('',location.href,_windowDims.width,_windowDims.height,0);
							}
						);

					_superclass.prototype.wireUi.call (_this);
				}
			};

		/*** Register Properties ***/
			_class.registerProperties ({
				_title:'title',
				_widgetToGoClass:'widgetToGoClass',
				_widgetToGoHtml:'widgetToGoHtml'
			});

		return _class;
	}
});

