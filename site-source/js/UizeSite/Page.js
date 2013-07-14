/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Page
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2008-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*?
	Introduction
		A subclass of =Uize.Widget.Page= that provides a base class for page widget classes used by the UIZE JavaScript Framework's Web site. This class provides functionality that is generally useful to all types of pages on the site.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'UizeSite.Page',
	superclass:'Uize.Widget.Page',
	required:[
		'Uize.Node',
		'UizeSite.SiteMap',
		'Uize.Widget.Tree.Menu',
		'Uize.Url',
		'UizeSite.Widgets.SiteAssistant.Widget',
		'UizeSite.Templates.Footer'
	],
	builder:function (_superclass) {
		'use strict';

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
				Uize.require (
					'Uize.Comm.Ajax',
					function (_Uize_Comm_Ajax) {
						_Uize_Comm_Ajax ().request ({
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
				);
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
						var _wireUpSiteMenu = function () {
							_this.unwireNode ('homeLink','mouseover',_wireUpSiteMenu);
							var
								_siteMenuItems = [{title:'',link:'index.html',items:UizeSite.SiteMap ()}],
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
						};
						_this.wireNode ('homeLink','mouseover',_wireUpSiteMenu);

					/*** inject site assistant (if desired) ***/
						var _mainNode = Uize.Node.find ({tagName:'div',className:/\bmain\b/}) [0];
						if (_this._showSiteAssistant && _mainNode) {
							/*** add widget and inject its HTML ***/
								Uize.Node.injectHtml (document.body,'<div id="page-siteAssistant"></div>');
								_this.addChild (
									'siteAssistant',
									UizeSite.Widgets.SiteAssistant.Widget,
									{
										container:_this.getNode ('siteAssistant'),
										built:false
									}
								);

							/*** maintain size of site assistant ***/
								var _resizeSiteAssistant = function () {
									var _newWidth =
										(Uize.Node.getDimensions (window).width - Uize.Node.getDimensions (_mainNode).width) / 2
									;
									_this.setNodeStyle (
										'siteAssistant',
										_newWidth > 170 ? {display:'block',width:_newWidth} : {display:'none'}
									)
								};

								_resizeSiteAssistant ();
								Uize.Node.wire (window,'resize',_resizeSiteAssistant);
						}

					/*** inject footer (if desired) ***/
						_this._showFooter && Uize.Node.injectHtml (document.body,UizeSite.Templates.Footer.process ());

					_superclass.doMy (_this,'wireUi');
				}
			};

		/*** State Properties ***/
			_class.stateProperties ({
				_contentsTreeItems:'contentsTreeItems',
				_showFooter:{
					name:'showFooter',
					value:true
				},
				_showSiteAssistant:{
					name:'showSiteAssistant',
					value:true
				}
			});

		/*** Override Initial Values for Inherited State Properties ***/
			_class.set ({
				confirmDialog:{widgetClassName:'UizeSite.DialogConfirm'}
			});

		return _class;
	}
});

