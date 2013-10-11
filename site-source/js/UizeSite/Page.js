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
		'Uize.Url',
		'UizeSite.Widgets.SiteNav.Widget',
		'UizeSite.Widgets.SiteAssistant.Widget',
		'UizeSite.Widgets.Footer.Widget'
	],
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			instanceMethods:{
				getPublicUrl:function () {
					var _urlParts = Uize.Url.from (window.location.href);
					return 'http://www.uize.com' + (_urlParts.protocol == 'file:' ? '' : _urlParts.pathname);
				},

				getPathToRoot:function () {
					var _homeLinkSrc = this.getNode ('homeLink').getAttribute ('href');
					return _homeLinkSrc.slice (0,_homeLinkSrc.search (/[\w\-]+.html/));
				},

				performSearch:function (_searchQuery,_sectionUrl) {
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
				},

				viewSource:function (_url,_title) {
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
				},

				wireUi:function () {
					var m = this;
					if (!m.isWired) {
						/*** wire up mouseover on UIZE icon in title bar to load and show site menu ***/
							var _wireUpSiteMenu = function () {
								m.unwireNode ('homeLink','mouseover',_wireUpSiteMenu);
								Uize.require (
									'UizeSite.Widgets.SiteMenu.Widget',
									function () {
										var _siteMenu = page.addChild ('siteMenu',UizeSite.Widgets.SiteMenu.Widget,{built:false});

										/*** stitch in the contents tree for this page ***/
											var
												_siteMenuItems0Items = _siteMenu.get ('items') [0].items,
												_contentsTreeItems0 = m._contentsTreeItems && m._contentsTreeItems [0]
											;
											_contentsTreeItems0 &&
												_siteMenuItems0Items.unshift (
													{title:'ON THIS PAGE...',link:'',items:_contentsTreeItems0.items},
													{title:'-'}
												)
											;

										/*** add shell node for site menu, that will overlay homeLink node ***/
											m.injectNodeHtml (
												m.getNode ('homeLink').parentNode,
												'<div id="page_siteMenu-shell" class="siteMenuShell"></div>'
											);

										/*** wire menu ***/
											_siteMenu.insertOrWireUi ();
											_siteMenu.setExpandedDepth (1); // the mouseover event for the root level item (which sits above the UIZE logo) is not picked up by Safari on the iPad, so force the issue
									}
								);
							};
							m.wireNode ('homeLink','mouseover',_wireUpSiteMenu);

						var _mainNode = Uize.Node.find ({tagName:'div',className:/\bmain\b/}) [0];

						if (_mainNode) {
							/*** inject site nav (if desired) ***/
								if (m._showSiteNav) {
									// add widget and inject its HTML
									Uize.Node.injectHtml (
										document.body,
										'<div id="page-siteNavPane"><div id="page-siteNavShell"></div></div>'
									);
									m.addChild (
										'siteNav',
										UizeSite.Widgets.SiteNav.Widget,
										{
											container:m.getNode ('siteNavShell'),
											built:false
										}
									);
								}

							/*** inject site assistant (if desired) ***/
								if (m._showSiteAssistant) {
									// add widget and inject its HTML
									Uize.Node.injectHtml (document.body,'<div id="page-siteAssistantPane"></div>');
									m.addChild (
										'siteAssistant',
										UizeSite.Widgets.SiteAssistant.Widget,
										{
											container:m.getNode ('siteAssistantPane'),
											built:false
										}
									);
								}

							/*** manage resizing of gutter panes ***/
								var _resizeGutterPanes = function () {
									var
										_showSiteNav = m._showSiteNav,
										_showSiteAssistant = m._showSiteAssistant
									;
									if (_showSiteNav || _showSiteAssistant) {
										var
											_gutterWidth =
												Uize.Node.getDimensions (window).width - Uize.Node.getDimensions (_mainNode).width,
											_halfGutterWidth = _gutterWidth / 2,
											_showBoth = _showSiteNav && _showSiteAssistant,
											_showPane = function (_mustShow,_node,_width) {
												_mustShow && m.setNodeStyle (
													_node,
													_width ? {display:'block',width:_width} : {display:'none'}
												);
											},
											_newWidth = _showBoth ? _halfGutterWidth : _gutterWidth,
											_siteNavWidth = _newWidth,
											_siteAssistantWidth = _newWidth
										;
										if (_showBoth && _newWidth <= 170) {
											_siteNavWidth = _gutterWidth;
											_siteAssistantWidth = 0;
										}
										if (_siteNavWidth <= 170) {
											_siteNavWidth = 0;
										}
										_showPane (_showSiteNav,'siteNavPane',_siteNavWidth);
										_showPane (_showSiteAssistant,'siteAssistantPane',_siteAssistantWidth);
										m.setNodeStyle (
											_mainNode,
											{marginRight:_siteAssistantWidth == 0 && !!_siteNavWidth ? '0' : 'auto'}
										);
									}
								};
								_resizeGutterPanes ();
								Uize.Node.wire (window,'resize',_resizeGutterPanes);
						}

						/*** inject footer (if desired) ***/
							if (m._showFooter) {
								Uize.Node.injectHtml (_mainNode,'<div id="page-footerShell"></div>');
								m.addChild (
									'footer',
									UizeSite.Widgets.Footer.Widget,
									{
										container:m.getNode ('footerShell'),
										built:false
									}
								);
							}

						_superclass.doMy (m,'wireUi');
					}
				}
			},

			stateProperties:{
				_contentsTreeItems:'contentsTreeItems',
				_showFooter:{
					name:'showFooter',
					value:true
				},
				_showSiteAssistant:{
					name:'showSiteAssistant',
					value:true
				},
				_showSiteNav:{
					name:'showSiteNav',
					value:true
				}
			},

			set:{
				confirmDialog:{widgetClassName:'UizeSite.DialogConfirm'}
			}
		});
	}
});

