/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Tree.List Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2003-2016 UIZE
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
	superclass:'Uize.Widget.Tree.ListAbstract',
	builder:function (_superclass) {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_false = false,
				_pathToResources = Uize.pathToResources + 'Uize/Widget/Tree/List/'
		;

		/*** Private Instance Methods ***/
			function _getTogglerSrc (m,_item) {
				return _pathToResources + m._iconTheme + '-' + (_item.expanded === _false ? 'collapsed' : 'expanded') + '.gif';
			}

		return _superclass.subclass ({
			instanceMethods:{
				setItemExpanded:function (_itemSpecifier,_expanded) {
					var m = this;
					if (m.isWired) {
						var _item = m.getItemFromSpecifier (_itemSpecifier);
						m.displayNode (
							_itemSpecifier + 'Children',
							_item.expanded = typeof _expanded == 'boolean' ? _expanded : _item.expanded === _false
						);
						m.setNodeProperties (
							_itemSpecifier + 'Toggler',
							{
								src:_getTogglerSrc (m,_item),
								title:m.getTogglerTitle (_item)
							}
						);
					} else {
						_superclass.doMy (m,'setItemExpanded',[_itemSpecifier,_expanded]);
					}
				}
			},

			stateProperties:{
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
				_spaceBeforeText:{
					name:'spaceBeforeText',
					value:7
				}
			},

			set:{
				html:{
					process:function (input) {
						var
							m = this,
							_thisClass = m.Class,
							_htmlChunks = [],
							_idPrefix = input.idPrefix,
							_blankImageUrl = _thisClass.getBlankImageUrl (),
							_dividerHtml = '<img src="' + _blankImageUrl + '" class="divider" align="center"/>',
							_iconStyle = 'style="' + (input.iconBgColor ? ('background:' + input.iconBgColor + '; ') : '') + 'width:9px; height:9px;"',
							_levelClasses = input.levelClasses,
							_levelClassesLengthMinus1 = _levelClasses.length - 1
						;
						m.traverseTree ({
							itemHandler:
								function (_item,_itemSpecifier,_depth) {
									var
										_itemLink = _item.link,
										_hasItems = _thisClass.itemHasChildren (_item),
										_depthSpacer = '<img src="' + _blankImageUrl + '" width="' + (_depth * (10 + input.spaceBeforeText)) + '" height="10"/>',
										_levelClass = _levelClasses [Math.min (_depth,_levelClassesLengthMinus1)]
									;
									_htmlChunks.push (
										'<nobr>' +
										_depthSpacer +
										(
											_thisClass.itemIsDivider (_item)
												? _dividerHtml
												: (
													'<span style="width:10px; height:10px; padding-right:' + input.spaceBeforeText + 'px;">' +
													(
														_hasItems
															? (
																'<a id="' + _idPrefix + '-' + _itemSpecifier + 'TogglerLink" href="javascript://"><img id="' + _idPrefix + '-' + _itemSpecifier + 'Toggler" src="' + _getTogglerSrc (m,_item) + '" ' + _iconStyle + ' border="0" title="' + m.getTogglerTitle (_item) + '"/></a>'
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
			}
		});
	}
});

