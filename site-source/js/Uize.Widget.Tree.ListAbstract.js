/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Tree.ListAbstract Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2003-2013 UIZE
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
		The =Uize.Widget.Tree.ListAbstract= class is an abstract class that provides common code to the =Uize.Widget.Tree.List= class and the newer =Uize.Widgets.Tree.List= V2 widget class.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widget.Tree.ListAbstract',
	required:[
		'Uize.Node',
		'Uize.Tooltip',
		'Uize.Xml'
	],
	builder:function (_superclass) {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_true = true,
				_false = false,
				_Uize_Node = Uize.Node,
				_Uize_Tooltip = Uize.Tooltip,
				_Uize_Xml_toAttributeValue = Uize.Xml.toAttributeValue
			;

		return _superclass.subclass ({
			instanceMethods:{
				getTogglerTitle:function (_item) {
					return 'Click to ' + (_item.expanded === _false ? 'expand' : 'collapse');
				},

				wireUi:function () {
					var _this = this;
					if (!_this.isWired) {
						var
							_tooltip = _this._tooltip,
							_tooltipIsPlainObject = Uize.isPlainObject (_tooltip),
							_tooltipNode = Uize.Node.getById (_tooltipIsPlainObject ? _tooltip.node : _tooltip)
						;
						_this.traverseTree ({
							itemHandler:
								function (_item,_itemSpecifier) {
									_tooltip &&
										_this.wireNode (
											_itemSpecifier + 'TitleLink',
											{
												mouseover:
													function () {
														if (_tooltipNode) {
															var _tooltipHtml;
															if (_tooltipIsPlainObject) {
																_tooltipHtml = _tooltip.show (_item);
															} else {
																var _tooltipTemplate = _this._tooltipTemplate;
																if (_tooltipTemplate) {
																	_tooltipHtml = _tooltipTemplate.call (_this,_item);
																} else {
																	var _itemDescription = _item.description;
																	if (_itemDescription)
																		_tooltipHtml = _Uize_Xml_toAttributeValue (_itemDescription)
																	;
																}
																_tooltipHtml && _Uize_Node.setInnerHtml (_tooltipNode,_tooltipHtml);
															}
															if (_tooltipHtml) {
																_Uize_Tooltip.showTooltip (_tooltipNode,_true);
																_this.fire ({name:'After Show Tooltip',item:_item});
															}
														}
													},
												mouseout:function () {
													_Uize_Tooltip.showTooltip (_tooltipNode,_false);
													_this.fire ({name:'After Hide Tooltip',item:_item});
												}
											}
										)
									;
								},
							beforeSubItemsHandler:
								function (_item,_itemSpecifier) {
									_this.wireNode (
										[
											_itemSpecifier + 'TogglerLink',
											!_item.link || _this._linksAlwaysToggleExpanded
												? (_itemSpecifier + 'TitleLink')
												: undefined
										],
										{
											click:function (_event) {
												if (_event.shiftKey || _event.ctrlKey || _event.metaKey) {
													_this.setExpandedDepth (
														_this.getItemFromSpecifier (_itemSpecifier).expanded !== _false
															? 0
															: (_event.shiftKey ? 1 : 1000),
														_itemSpecifier
													);
													_event.cancelBubble = _true;
												} else {
													_this.setItemExpanded (_itemSpecifier);
												}
											},
											focus:function () {this.blur ()}
										}
									);
								}
						});

						_superclass.doMy (_this,'wireUi');
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

