/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeDotCom.Page.Doc
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2008-2012 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*ScruncherSettings Mappings="=e" LineCompacting="TRUE"*/

/*?
	Introduction
		A subclass of =UizeDotCom.Page= that provides additional functionality specific to pages that contain documentation.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'UizeDotCom.Page.Doc',
	required:[
		'Uize.Node',
		'Uize.Node.Tree',
		'Uize.Widget.Tree.List',
		'Uize.Url'
	],
	builder:function (_superclass) {
		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					null,
					function () {
						var _this = this;

						/*** add the contents tree widget ***/
							_this.addChild (
								'contents',
								Uize.Widget.Tree.List,
								{
									levelClasses:['contents-tree-level1','contents-tree-level2','contents-tree-level3','contents-tree-level4'],
									iconTheme:'arrows-black',
									iconBgColor:'',
									tooltip:'contentsTooltip',
									built:false
								}
								/*?
									Child Widgets
										contents
											An instance of =Uize.Widget.Tree.List= that is used to provide an expandable/collapsible contents tree at the top of the document.
								*/
							);
					}
				),
				_classPrototype = _class.prototype
			;

			/*** Utility Functions ***/
				function _getAnchorFromLinkTag (_linkTag) {
					function _urlSansAnchor (_url) {
						var _anchorPos = _url.indexOf ('#');
						return _anchorPos > -1 ? _url.slice (0,_anchorPos) : _url;
					}
					var _href = _linkTag.getAttribute ('href');
					return (
						(
							_href.charCodeAt (0) == 35 ||
							(
								_href.indexOf ('#') > -1 &&
								_urlSansAnchor (_href) == _urlSansAnchor (location.href)
							)
						)
							? _href.slice (_href.indexOf ('#') + 1)
							: ''
					);
				}

			/*** Public Instance Methods ***/
				_classPrototype.wireUi = function () {
					var _this = this;
					if (!_this.isWired) {
						/*** populate contents tree's data ***/
							var
								_contents = _this.children.contents,
								_contentsTreeItems = Uize.Node.Tree.getTreeFromList (_contents.getNode ())
							;
							_this.set ({contentsTreeItems:_contentsTreeItems});
							_contents.set ({items:_contentsTreeItems});
							_contents.setExpandedDepth (1);

						/*** insert HTML for contents tree and section link tooltips ***/
							Uize.Node.injectHtml (
								document.body,
								'<div id="contentsTooltip" class="contents-tooltip"></div>' +
								'<div id="bodyLinkTooltip" class="body-link-tooltip">' +
									'<div id="bodyLinkTooltipTitle" class="body-link-tooltip-title"></div>' +
									'<div id="bodyLinkTooltipDescription" class="body-link-tooltip-description"></div>' +
									'<div class="body-link-tooltip-more">MORE...</div>' +
								'</div>'
							);

						/*** wire up page actions ***/
							var _pageTitle = document.title.match (/^\s*(.*?)\s*\|/) [1];

							/*** search link ***/
								_this.wireNode (
									'search',
									'click',
									function () {
										location.href = _this.getPathToRoot () + 'search-sections.html?' + _pageTitle;
									}
								);

							/*** examples link ***/
								_this.wireNode (
									'examples',
									'click',
									function () {_this.performSearch ('"' + _pageTitle + '"','/examples')}
								);

							/*** test link ***/
								_this.wireNode (
									'test',
									'click',
									function () {
										location.href = Uize.Url.resolve (
											_this.getPathToRoot () + 'examples/uize-unit-tests.html',
											{runtest:Uize.Url.from (location.href).fileName.replace (/^Uize\.Test\./,'')}
										);
									}
								);

						/*** wire up behavior for scrolling to anchors ***/
							/* TO DO: animated scrolling behavior
								- what to wire the event on (document.body or document.documentElement?)
								- how to cancel the event
								- how to know that the thing being clicked is a link that is an anchor link
								- calculate the position of the anchor
								- scroll the document to the positio
								- set the document location to the anchor
								- have a timeout that watches on changes in the href
									- if the anchor changes, scroll the position to the current anchor minus clearance amount

								issues
									- IE7 has a stupid issue where the getAttribute DOM method doesn't return the value from the document, but returns a resolved value, and for href for anchor links this contains the entire URL path, not just the anchor part
							*/
							var _titleBar = Uize.Node.find ({tagName:'h1',className:'document-title'}) [0];
							Uize.Node.getStyle (_titleBar,'position') == 'fixed' &&
								_this.wireNode (
									document.body,
									'click',
									function (_event) {
										var _target = _event.target || _event.srcElement;
										_target.tagName == 'A' && _getAnchorFromLinkTag (_target) &&
											setTimeout (
												function () {
													var _body = Uize.Node.isSafari ? document.body : document.documentElement;
													_body.scrollTop && (_body.scrollTop -= 48);
														/* NOTE:
															Only adjust scroll if it's not zero (in the case of Safari on the iPad, it remains 0 even with user scrolling or linking to anchors).
														*/
												},
												100
											)
										;
									}
								)
							;

						/*** wire up link tooltip behavior ***/
							var
								_links = Uize.Node.find ({
									root:Uize.Node.find ({className:'contents0'}) [0],
									tagName:'A',
									href:/.+/
								}),
								_linkNo = 0
							;
							function _wireNextLink () {
								var _lastLinkNo = _links.length - 1;
								if (_linkNo <= _lastLinkNo) {
									for (
										var _lastLinkToWireNo = Math.min (_lastLinkNo,_linkNo + 19);
										_linkNo <= _lastLinkToWireNo;
										_linkNo++
									)
										Uize.Node.wire (
											_links [_linkNo],
											{
												onmouseover:function () {
													var
														_anchor = _getAnchorFromLinkTag (this),
														_title,
														_description
													;
													if (_anchor) {
														var _itemSpecifier = [0];
														_anchor.replace (
															/\d+/g,
															function (_sectionSpecifier) {_itemSpecifier.push (_sectionSpecifier - 1)}
														);
														var _itemInfo = _contents.getItemInfoFromSpecifier (_itemSpecifier);
														if (_itemInfo && _itemInfo.item) {
															_title = _itemInfo.titleParts.slice (1).join (' ... ');
															_description = _itemInfo.item.description || '';
														}
													} else {
														var
															_href = this.getAttribute ('href'),
															_urlParts = Uize.Url.from (_href)
														;
														if (
															_urlParts.protocol == 'http:' &&
															_urlParts.host.indexOf ('uize.com') == -1
														) {
															_title = 'LINK TO EXTERNAL SITE';
															_description = _href;
														}
													}
													if (_title && _description) {
														Uize.Node.setValue ('bodyLinkTooltipTitle',_title);
														Uize.Node.setValue ('bodyLinkTooltipDescription',_description);
														Uize.Tooltip.showTooltip ('bodyLinkTooltip');
													}
												},
												onmouseout:function () {
													Uize.Tooltip.showTooltip ('bodyLinkTooltip',false);
												}
											}
										)
									;
									setTimeout (_wireNextLink,0);
								}
							}
							_wireNextLink ();

						_superclass.prototype.wireUi.call (_this);

						_contents.setNodeStyle ('',{maxHeight:'none',overflow:'visible'});
					}
				};

		return _class;
	}
});

