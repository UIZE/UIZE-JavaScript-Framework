/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Page.Doc
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2008-2016 UIZE
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
		'Uize.Dom.Basics',
		'Uize.Dom.Tree',
		'Uize.Widgets.NavTree.List.Widget',
		'Uize.Url',
		'Uize.Widgets.Tooltip.Widget',
		'Uize.Flo',
		'Uize.Util.ModuleNaming'
	],
	builder:function (_superclass) {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_Uize_Dom_Basics = Uize.Dom.Basics,

			/*** General Variables ***/
				_sacredEmptyObject = {}
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

		return _superclass.subclass ({
			omegastructor:function () {
				var m = this;

				/*** add the tooltip widget ***/
					var _tooltip = m.addChild ('tooltip',Uize.Widgets.Tooltip.Widget,{built:false});

				/*** add the contents tree widget ***/
					m.addChild (
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
					var m = this;
					if (!m.isWired) {
						var _tooltip = m.children.tooltip;

						/*** populate contents tree's data ***/
							var
								_contents = m.children.contents,
								_contentsTreeItems = Uize.Dom.Tree.getTreeFromList (m.getNode ('contents'))
							;
							m.set ({contentsTreeItems:_contentsTreeItems});
							_contents.set ({items:_contentsTreeItems});
							_contents.setExpandedDepth (1);

						/*** wire up page actions ***/
							var _pageTitle = document.title.match (/^\s*(.*?)\s*\|/) [1];

							/*** search link ***/
								m.wireNode (
									'search',
									'click',
									function () {m.navigateTo ('search-sections.html?' + _pageTitle)}
								);

							/*** examples link ***/
								m.wireNode (
									'examples',
									'click',
									function () {m.performSearch ('"' + _pageTitle + '"','/examples')}
								);

							/*** search link ***/
								m.wireNode (
									'deps',
									'click',
									function () {m.navigateTo ('examples/dependency-analyzer.html',{module:_pageTitle})}
								);

							/*** test link ***/
								m.wireNode (
									'test',
									'click',
									function () {
										m.navigateTo (
											'examples/uize-unit-tests.html',
											{runtest:Uize.Util.ModuleNaming.getModuleNameFromTestModuleName (_pageTitle)}
										);
									}
								);

						/*** wire up behavior for scrolling to anchors ***/
							var _titleBar = _Uize_Dom_Basics.find ({tagName:'h1',className:'document-title'}) [0];
							_Uize_Dom_Basics.getStyle (_titleBar,'position') == 'fixed' &&
								m.wireNode (
									document.body,
									'click',
									function (_event) {
										var _target = _event.target || _event.srcElement;
										_target.tagName == 'A' && _getAnchorFromLinkTag (_target) &&
											setTimeout (
												function () {
													var _body = _Uize_Dom_Basics.isSafari ? document.body : document.documentElement;
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
										_Uize_Dom_Basics.find ({
											root:_Uize_Dom_Basics.find ({className:'contents0'}) [0],
											tagName:'A',
											href:/.+/
										})
									);
								},
								function (_next) {
									_Uize_Dom_Basics.wire (
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

						_superclass.doMy (m,'wireUi');

						m.children.tooltip.displayNode ('',false);
						m.setNodeStyle ('contents',{maxHeight:'none',overflow:'visible'});
					}
				}
			}
		});
	}
});

