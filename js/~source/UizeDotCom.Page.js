/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeDotCom.Page
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2008-2012 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*ScruncherSettings Mappings="=d" LineCompacting="TRUE"*/

/*?
	Introduction
		A subclass of =Uize.Widget.Page= that provides a base class for page widget classes used by the UIZE JavaScript Framework's Web site. This class provides functionality that is generally useful to all types of pages on the site.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'UizeDotCom.Page',
	superclass:'Uize.Widget.Page',
	required:[
		'Uize.Node.VirtualEvent',
		'UizeDotCom.SiteMap',
		'Uize.Widget.Tree.Menu',
		'Uize.Url',
		'Uize.Fx',
		'Uize.Curve',
		'Uize.Curve.Rubber',
		'UizeDotCom.Templates.ShareThisPanel',
		'UizeDotCom.Templates.Footer'
	],
	builder:function (_superclass) {
		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (),
				_classPrototype = _class.prototype
			;

		/*** Public Instance Methods ***/
			_classPrototype.getPathToRoot = function () {
				var _homeLinkSrc = this.getNode ('homeLink').getAttribute ('href');
				return _homeLinkSrc.slice (0,_homeLinkSrc.search (/[\w\-]+.html/));
			};

			_classPrototype.performSearch = function (_searchQuery,_sectionUrl) {
				location.href = Uize.Url.resolve (
					'http://www.google.com/search',
					{
						hl:'en',
						safe:'off',
						domains:_sectionUrl = 'uize.com' + (_sectionUrl || ''),
						sitesearch:_sectionUrl,
						q:_searchQuery
					}
				);
			};

			_classPrototype.viewSource = function (_url,_title) {
				var _sourceWindow = this.launchPopup ({
					name:'viewSource',
					width:1000,
					height:740
				});
				Uize.module ({
					required:'Uize.Comm.Ajax',
					builder:function () {
						Uize.Comm.Ajax ().request ({
							url:_url,
							requestMethod:'GET',
							returnType:'text',
							callback:function (_responseText) {
								var _sourceWindowDocument = _sourceWindow.document;
								_sourceWindowDocument.open ('text/html');
								_sourceWindowDocument.writeln ('<html><head><title>' + _title + '</title></head><body style="padding:0; margin:0;"><div style="font-family:Arial; color:#fff; font-weight:bold; background:#000; border-bottom:5px solid #ccc; text-align:center;">' + _title + '</div><pre style="padding:8px;">' + _responseText.replace (/</g,'&lt;').replace (/\t/g,'   ') + '</pre></body></html>');
								_sourceWindowDocument.close ();
							}
						});
					}
				});
				/*?
					Instance Methods
						viewSource
							The =viewSource= instance method lets you open a popup window that will show the source code for the specified URL. This can be used to show source code for example pages as well as the source for JavaScript modules.

							SYNTAX
							..................................
							viewSource (urlSTR,windowTitleSTR)
							..................................
				*/
			};

			_classPrototype.wireUi = function () {
				var _this = this;
				if (!_this.isWired) {
					/*** wire up mouseover on UIZE icon in title bar to load and show site menu ***/
						function _wireUpSiteMenu () {
							_this.unwireNode ('homeLink','mouseover',_wireUpSiteMenu);
							var
								_siteMenuItems = [{title:'',link:'index.html',items:UizeDotCom.SiteMap ()}],
								_siteMenu = page.addChild (
									'siteMenu',
									Uize.Widget.Tree.Menu,
									{
										items:_siteMenuItems,
										menuCssClass:'siteMenuShell',
										menuDividerClass:'divider',
										menuItemActiveCssClass:'siteMenuItemActive',
										menuItemChildrenIndicatorCssClass:'siteMenuItemWithChildren',
										menuItemCssClass:'siteMenuItem',
										subMenuCssClass:'subMenuShell',
										subMenuDividerClass:'divider',
										subMenuItemActiveCssClass:'subMenuItemActive',
										subMenuItemChildrenIndicatorCssClass:'subMenuItemWithChildren',
										subMenuItemCssClass:'subMenuItem',
										built:false
									}
								)
							;

							/*** adjust links to be relative to current document ***/
								var _pathToRoot = _this.getPathToRoot ();
								_siteMenu.traverseTree ({
									itemHandler:
										function (_item) {
											if (_item.link != null) _item.link = _pathToRoot + _item.link;
										}
								});

							/*** stitch in some additional items ***/
								var _siteMenuItems0Items = _siteMenuItems [0].items;

								/*** stitch in the contents tree for this page ***/
									var _contentsTreeItems0 = _this._contentsTreeItems && _this._contentsTreeItems [0];
									_contentsTreeItems0 &&
										_siteMenuItems0Items.unshift (
											{title:'ON THIS PAGE...',link:'',items:_contentsTreeItems0.items},
											{title:'-'}
										)
									;

								/*** stitch in window size options ***/
									_siteMenuItems0Items.push (
										{title:'-'},
										{
											title:'WINDOW SIZE',
											items:[
												{
													title:'1024 x 768',
													link:'javascript:moveTo ((screen.width - 1024) >> 1,0); resizeTo (1024,768)'
												},
												{
													title:'1024 x MAX HEIGHT',
													link:'javascript:moveTo ((screen.width - 1024) >> 1,0); resizeTo (1024,screen.height)'
												}
											]
										}
									);

							/*** add shell node for site menu, that will overlay homeLink node ***/
								_this.injectNodeHtml (
									_this.getNode ('homeLink').parentNode,
									'<div id="page_siteMenu-shell" class="siteMenuIcon"></div>'
								);

							/*** wire menu ***/
								_siteMenu.insertOrWireUi ();
								_siteMenu.setExpandedDepth (1); // the mouseover event for the root level item (which sits above the UIZE logo) is not picked up by Safari on the iPad, so force the issue
						}
						_this.wireNode ('homeLink','mouseover',_wireUpSiteMenu);

					/*** inject share this panel (if desired) ***/
						if (_this._showShareThisPanel) {
							/*** inject the HTML ***/
								function _getMetaTagContent (_metaTagName) {
									/* ISSUE:
										can't use name property in find object, because it doesn't seem to find the tags in FF. Perhaps getElementsByName is being used in Uize.Node.find, or something, and that doesn't work with meta tags? Weird!
									*/
									var _metaTag = Uize.Node.find ({
										tagName:'meta',
										self:function () {return this.name == _metaTagName}
									}) [0];
									return _metaTag ? _metaTag.content : '';
								}
								Uize.Node.injectHtml (
									document.body,
									UizeDotCom.Templates.ShareThisPanel.process ({
										title:document.title.match (/^\s*(.*?)\s*(\||$)/) [1],
										url:location.href,
										keywords:_getMetaTagContent ('keywords'),
										description:_getMetaTagContent ('description')
									})
								);

							/*** wire the slide-out behavior ***/
								_this.wireNode (
									'shareThisPanel',
									{
										mouseover:function () {
											Uize.Fx.fadeStyle (this,null,{opacity:1},300)
										},
										'mouserest(250)':function () {
											Uize.Fx.fadeStyle (this,null,{left:1},600,{curve:Uize.Curve.easeInOutPow (5)})
										},
										mouseout:function () {
											Uize.Fx.fadeStyle (this,null,{opacity:.2},300).wire (
												'Done',
												function () {
													Uize.Fx.fadeStyle (
														_this.getNode ('shareThisPanel'),
														null,
														{left:-112},
														1200,
														{curve:Uize.Curve.Rubber.easeOutBounce (4,1.5)}
													)
												}
											);
										}
									}
								);

							/*** reveal the panel ***/
								Uize.Fx.fadeStyle (_this.getNode ('shareThisPanel'),null,{opacity:.2},1000);
						}

					/*** inject foot (if desired) ***/
						_this._showFooter && Uize.Node.injectHtml (document.body,UizeDotCom.Templates.Footer.process ());

					_superclass.prototype.wireUi.call (_this);
				}
			};

		/*** Register Properties ***/
			_class.registerProperties ({
				_contentsTreeItems:'contentsTreeItems',
				_showFooter:{
					name:'showFooter',
					value:true
				},
				_showShareThisPanel:{
					name:'showShareThisPanel',
					value:true
				}
			});

		/*** Override Initial Values for Inherited Set-Get Properties ***/
			_class.set ({
				confirmDialog:{widgetClassName:'UizeDotCom.DialogConfirm'}
			});

		return _class;
	}
});

