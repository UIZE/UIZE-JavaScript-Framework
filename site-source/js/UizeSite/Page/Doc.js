/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Page.Doc
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2008-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*?
	Introduction
		A subclass of =UizeSite.Page= that provides additional functionality specific to pages that contain documentation.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'UizeSite.Page.Doc',
	required:[
		'Uize.Node',
		'Uize.Node.Tree',
		'Uize.Widget.Tree.List',
		'Uize.Url',
		'UizeSite.Widgets.Tooltip.Widget'
	],
	builder:function (_superclass) {
		'use strict';

		var _sacredEmptyObject = {};

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					null,
					function () {
						var _this = this;

						/*** add the tooltip widget ***/
							var _tooltip = _this.addChild (
								'tooltip',
								UizeSite.Widgets.Tooltip.Widget,
								{built:false}
							);

						/*** add the contents tree widget ***/
							_this.addChild (
								'contents',
								Uize.Widget.Tree.List,
								{
									levelClasses:['contents-tree-level1','contents-tree-level2','contents-tree-level3','contents-tree-level4'],
									iconTheme:'arrows-black',
									iconBgColor:'',
									tooltip:{
										node:_tooltip.nodeId (),
										show:function (_item) {
											_tooltip.set ({
												heading:_item.title,
												body:_item.description
											});
											return true;
										}
									},
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
						/*** hide the tooltips ***/
							_this.children.tooltip.displayNode ('',false);

						/*** populate contents tree's data ***/
							var
								_contents = _this.children.contents,
								_contentsTreeItems = Uize.Node.Tree.getTreeFromList (_contents.getNode ())
							;
							_this.set ({contentsTreeItems:_contentsTreeItems});
							_contents.set ({items:_contentsTreeItems});
							_contents.setExpandedDepth (1);

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
								_tooltip = _this.children.tooltip,
								_links = Uize.Node.find ({
									root:Uize.Node.find ({className:'contents0'}) [0],
									tagName:'A',
									href:/.+/
								}),
								_linkNo = 0,
								_wireNextLink = function () {
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
																function (_sectionSpecifier) {
																	_itemSpecifier.push (_sectionSpecifier - 1);
																}
															);
															var _item =
																(
																	_contents.getItemInfoFromSpecifier (_itemSpecifier) ||
																	_sacredEmptyObject
																).item
															;
															if (_item) {
																_title = _item.title;
																_description = _item.description || '';
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
															_tooltip.set ({heading:_title,body:_description});
															Uize.Tooltip.showTooltip (_tooltip.getNode ());
														}
													},
													onmouseout:function () {
														Uize.Tooltip.showTooltip (_tooltip.getNode (),false);
													}
												}
											)
										;
										setTimeout (_wireNextLink,0);
									}
								}
							;
							_wireNextLink ();

						_superclass.doMy (_this,'wireUi');

						_contents.setNodeStyle ('',{maxHeight:'none',overflow:'visible'});
					}
				};

		return _class;
	}
});

