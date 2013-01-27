/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Tree.List Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2003-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 6
	codeCompleteness: 100
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Widget.Tree.List= class extends its superclass by adding support for collapsible/expandable tree lists, with clickable expand/collapse icons.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widget.Tree.List',
	required:[
		'Uize.Node',
		'Uize.Tooltip',
		'Uize.Xml'
	],
	builder:function (_superclass) {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_undefined,
				_true = true,
				_false = false,
				_pathToResources = Uize.pathToResources + 'Uize_Widget_Tree_List/',
				_Uize_Node = Uize.Node,
				_Uize_Tooltip = Uize.Tooltip,
				_Uize_Xml_toAttributeValue = Uize.Xml.toAttributeValue
			;

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (),
				_classPrototype = _class.prototype
			;

		/*** Private Instance Methods ***/
			_classPrototype.setItemExpanded = function (_itemSpecifier,_expanded) {
				var _this = this;
				if (_this.isWired) {
					var _item = _this.getItemFromSpecifier (_itemSpecifier);
					_this.displayNode (
						_itemSpecifier + 'Children',
						_item.expanded = typeof _expanded == 'boolean' ? _expanded : _item.expanded === _false
					);
					_this.setNodeProperties (
						_itemSpecifier + 'Toggler',
						{
							src:_this._getTogglerSrc (_item),
							title:_this._getTogglerTitle (_item)
						}
					);
				} else {
					_superclass.prototype.setItemExpanded.call (_this,_itemSpecifier,_expanded);
				}
			};

			_classPrototype._getTogglerSrc = function (_item) {
				return _pathToResources + this._iconTheme + '-' + (_item.expanded === _false ? 'collapsed' : 'expanded') + '.gif';
			};

			_classPrototype._getTogglerTitle = function (_item) {
				return 'Click to ' + (_item.expanded === _false ? 'expand' : 'collapse');
			};

		/*** Public Instance Methods ***/
			_classPrototype.wireUi = function () {
				var _this = this;
				if (!_this.isWired) {
					var _tooltip = _this._tooltip;
					_this.traverseTree ({
						itemHandler:
							function (_item,_itemSpecifier) {
								_tooltip &&
									_this.wireNode (
										_itemSpecifier + 'TitleLink',
										{
											mouseover:
												function () {
													var _tooltipNode = Uize.Node.getById (_tooltip);
													if (_tooltipNode) {
														var
															_tooltipHtml,
															_tooltipTemplate = _this._tooltipTemplate
														;
														if (_tooltipTemplate) {
															_tooltipHtml = _tooltipTemplate.call (_this,_item);
														} else {
															var _itemDescription = _item.description;
															if (_itemDescription)
																_tooltipHtml = _Uize_Xml_toAttributeValue (_itemDescription)
															;
														}
														if (_tooltipHtml) {
															_Uize_Node.setInnerHtml (_tooltipNode,_tooltipHtml);
															_Uize_Tooltip.showTooltip (_tooltipNode,_true);
															_this.fire ({name:'After Show Tooltip',item:_item});
														}
													}
												},
											mouseout:function () {
												_Uize_Tooltip.showTooltip (_this._tooltip,_false);
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
											: _undefined
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

					_superclass.prototype.wireUi.call (_this);
				}
			};

		/*** State Properties ***/
			_class.stateProperties ({
				_alwaysLinkHeadings:{
					name:'alwaysLinkHeadings',
					value:_false
				},
				_iconBgColor:{
					name:'iconBgColor',
					value:'#aaa'
				},
				_iconTheme:{
					name:'iconTheme',
					value:'arrows'
				},
				_levelClasses:{
					name:'levelClasses',
					value:[]
				},
				_linksAlwaysToggleExpanded:{
					name:'linksAlwaysToggleExpanded',
					value:_false
				},
				_spaceBeforeText:{
					name:'spaceBeforeText',
					value:7
				},
				_tooltip:'tooltip',
				_tooltipTemplate:'tooltipTemplate'
			});

		/*** Override Initial Values for Inherited State Properties ***/
			_class.set ({
				html:{
					process:function (input) {
						var
							_this = this,
							_htmlChunks = [],
							_idPrefix = input.idPrefix,
							_blankImageUrl = _class.getBlankImageUrl (),
							_dividerHtml = '<img src="' + _blankImageUrl + '" class="divider" align="center"/>',
							_iconStyle = 'style="' + (input.iconBgColor ? ('background:' + input.iconBgColor + '; ') : '') + 'width:9px; height:9px;"',
							_levelClasses = input.levelClasses,
							_levelClassesLengthMinus1 = _levelClasses.length - 1
						;
						_this.traverseTree ({
							itemHandler:
								function (_item,_itemSpecifier,_depth) {
									var
										_itemLink = _item.link,
										_hasItems = _class.itemHasChildren (_item),
										_depthSpacer = '<img src="' + _blankImageUrl + '" width="' + (_depth * (10 + input.spaceBeforeText)) + '" height="10"/>',
										_levelClass = _levelClasses [Math.min (_depth,_levelClassesLengthMinus1)]
									;
									_htmlChunks.push (
										'<nobr>' +
										_depthSpacer +
										(
											_class.itemIsDivider (_item)
												? _dividerHtml
												: (
													'<span style="width:10px; height:10px; padding-right:' + input.spaceBeforeText + 'px;">' +
													(
														_hasItems
															? (
																'<a id="' + _idPrefix + '-' + _itemSpecifier + 'TogglerLink" href="javascript://"><img id="' + _idPrefix + '-' + _itemSpecifier + 'Toggler" src="' + _this._getTogglerSrc (_item) + '" ' + _iconStyle + ' border="0" title="' + _this._getTogglerTitle (_item) + '"/></a>'
															)
															: '<img src="' + _pathToResources + input.iconTheme + '-bullet.gif" ' + _iconStyle + '"/>'
													) + '</span>' +
													(
														_itemLink || (_hasItems && input.alwaysLinkHeadings)
															? (
																'<a id="' + _idPrefix + '-' + _itemSpecifier + 'TitleLink" class="' + _levelClass + '" href="' + (_itemLink || 'javascript://') + '">' + _item.title + '</a>'
															)
															: ('<span class="' + _levelClass + '">' + _item.title + '</span>')
													)
												)
										) +
										'</nobr><br/>'
									);
								},
							beforeSubItemsHandler:
								function (_item,_itemSpecifier) {
									_htmlChunks.push ('<span id="' + _idPrefix + '-' + _itemSpecifier + 'Children" style="display:' + (_item.expanded !== _false ? 'block' : 'none') + ';">');
								},
							afterSubItemsHandler:function () {_htmlChunks.push ('</span>\n')}
						});
						return _htmlChunks.join ('');
					}
				}
			});

		return _class;
	}
});

