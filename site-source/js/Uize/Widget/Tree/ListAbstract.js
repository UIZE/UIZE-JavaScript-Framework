/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Tree.ListAbstract Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2003-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 5
	codeCompleteness: 100
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Widget.Tree.ListAbstract= class is an abstract class that provides common code to the =Uize.Widget.Tree.List= class and the newer =Uize.Widgets.NavTree.List.Widget= V2 widget class.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widget.Tree.ListAbstract',
	required:[
		'Uize.Dom.Basics',
		'Uize.Tooltip',
		'Uize.Util.Html.Encode'
	],
	builder:function (_superclass) {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_true = true,
				_false = false,
				_Uize_Dom_Basics = Uize.Dom.Basics,
				_Uize_Tooltip = Uize.Tooltip,
				_htmlEncode = Uize.Util.Html.Encode.encode
		;

		return _superclass.subclass ({
			instanceMethods:{
				getTogglerTitle:function (_item) {
					return 'Click to ' + (_item.expanded === _false ? 'expand' : 'collapse');
				},

				wireUi:function () {
					var m = this;
					if (!m.isWired) {
						var
							_tooltip = m._tooltip,
							_tooltipIsPlainObject = Uize.isPlainObject (_tooltip),
							_tooltipNode = _Uize_Dom_Basics.getById (_tooltipIsPlainObject ? _tooltip.node : _tooltip)
						;
						m.traverseTree ({
							itemHandler:
								function (_item,_itemSpecifier) {
									_tooltip &&
										m.wireNode (
											_itemSpecifier + 'TitleLink',
											{
												mouseover:
													function () {
														if (_tooltipNode) {
															var _tooltipHtml;
															if (_tooltipIsPlainObject) {
																_tooltipHtml = _tooltip.show (_item);
															} else {
																var _tooltipTemplate = m._tooltipTemplate;
																if (_tooltipTemplate) {
																	_tooltipHtml = _tooltipTemplate.call (m,_item);
																} else {
																	var _itemDescription = _item.description;
																	if (_itemDescription)
																		_tooltipHtml = _htmlEncode (_itemDescription)
																	;
																}
																_tooltipHtml && _Uize_Dom_Basics.setInnerHtml (_tooltipNode,_tooltipHtml);
															}
															if (_tooltipHtml) {
																_Uize_Tooltip.showTooltip (_tooltipNode,_true);
																m.fire ({name:'After Show Tooltip',item:_item});
															}
														}
													},
												mouseout:function () {
													_Uize_Tooltip.showTooltip (_tooltipNode,_false);
													m.fire ({name:'After Hide Tooltip',item:_item});
												}
											}
										)
									;
								},
							beforeSubItemsHandler:
								function (_item,_itemSpecifier) {
									m.wireNode (
										[
											_itemSpecifier + 'TogglerLink',
											!_item.link || m._linksAlwaysToggleExpanded
												? (_itemSpecifier + 'TitleLink')
												: undefined
										],
										{
											click:function (_event) {
												if (_event.shiftKey || _event.ctrlKey || _event.metaKey) {
													m.setExpandedDepth (
														m.getItemFromSpecifier (_itemSpecifier).expanded !== _false
															? 0
															: (_event.shiftKey ? 1 : 1000),
														_itemSpecifier
													);
													_event.cancelBubble = _true;
												} else {
													m.setItemExpanded (_itemSpecifier);
												}
											},
											focus:function () {this.blur ()}
										}
									);
								}
						});

						_superclass.doMy (m,'wireUi');
					}
				}
			},

			stateProperties:{
				_alwaysLinkHeadings:{
					name:'alwaysLinkHeadings',
					value:_false
				},
				_linksAlwaysToggleExpanded:{
					name:'linksAlwaysToggleExpanded',
					value:_false
				},
				_tooltip:'tooltip',
				_tooltipTemplate:'tooltipTemplate'
			}
		});
	}
});

