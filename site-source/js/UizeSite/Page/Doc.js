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
		'Uize.Widgets.NavTree.List.Widget',
		'Uize.Url',
		'Uize.Widgets.Tooltip.Widget',
		'Uize.Flo'
	],
	builder:function (_superclass) {
		'use strict';

		var _sacredEmptyObject = {};

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

		return _superclass.subclass ({
			omegastructor:function () {
				var _this = this;

				/*** add the tooltip widget ***/
					var _tooltip = _this.addChild ('tooltip',Uize.Widgets.Tooltip.Widget,{built:false});

				/*** add the contents tree widget ***/
					_this.addChild (
						'contents',
						Uize.Widgets.NavTree.List.Widget,
						{
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
									An instance of =Uize.Widgets.NavTree.List.Widget= that is used to provide an expandable/collapsible contents tree at the top of the document.
						*/
					);
			},

			instanceMethods:{
				wireUi:function () {
					var _this = this;
					if (!_this.isWired) {
						var _tooltip = _this.children.tooltip;

						/*** populate contents tree's data ***/
							var
								_contents = _this.children.contents,
								_contentsTreeItems = Uize.Node.Tree.getTreeFromList (_contents.getNode ('shell'))
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
							Uize.Flo.forEach (
								function (_next) {
									_next (
										Uize.Node.find ({
											root:Uize.Node.find ({className:'contents0'}) [0],
											tagName:'A',
											href:/.+/
										})
									);
								},
								function (_next) {
									Uize.Node.wire (
										_next.flo.value,
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
									);
									_next ();
								}
							) ({breatheAfter:50});

						_superclass.doMy (_this,'wireUi');

						_this.children.tooltip.displayNode ('',false);
						_contents.setNodeStyle ('shell',{maxHeight:'none',overflow:'visible'});
					}
				}
			}
		});
	}
});

