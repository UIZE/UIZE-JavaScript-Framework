/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Tree.MenuAbstract Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2008-2016 UIZE
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
		The =Uize.Widget.Tree.MenuAbstract= class is an abstract class that provides common code to the =Uize.Widget.Tree.Menu= class and the newer =Uize.Widgets.NavTree.Menu.Widget= V2 widget class.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widget.Tree.MenuAbstract',
	required:'Uize.Dom.Pos',
	builder:function (_superclass) {
		'use strict';

		/*** General Variables ***/
			var _zIndex = 10000;

		/*** Private Instance Methods ***/
			function _ensureItemWired (m,_itemSpecifier) {
				var _itemsWiredMap = m._itemsWiredMap;
				if (!_itemsWiredMap [_itemSpecifier]) {
					/*** iterate through and wire items ***/
						Uize.forEach (
							_itemSpecifier
								? m.getItemFromSpecifier (_itemSpecifier).items
								: m.get ('items'),
							function (_item,_itemNo) {
								var _subItemSpecifier = _itemSpecifier + (_itemSpecifier && 'x') + _itemNo;
								m.wireNode (
									_subItemSpecifier + 'TitleLink',
									'mouseover',
									function () {m.collapseAllBut (_subItemSpecifier)}
								);
							}
						);

					/*** code for managing dismiss when mousing out of the menu ***/
						/* NOTE:
							sure, you could have more anonymous functions in this code, but sharing a single reference across all occurrences should provide better performance
						*/
						var
							_clearDismissTimeout = function () {
								if (m._dismissTimeout)
									m._dismissTimeout = clearTimeout (m._dismissTimeout)
								;
							},
							_dismiss = function () {
								_clearDismissTimeout ();
								m.setExpandedDepth (0);
							},
							_setDismissTimeout = function () {
								_clearDismissTimeout ();
								m._dismissTimeout = setTimeout (_dismiss,m._dismissDelay);
							}
						;
						m.wireNode (
							_itemSpecifier + (_itemSpecifier && 'Children'),
							{
								mouseover:_clearDismissTimeout,
								mouseout:_setDismissTimeout,
								click:_dismiss
							}
						);

					_itemsWiredMap [_itemSpecifier] = true;
				}
			}

		return _superclass.subclass ({
			omegastructor:function () {
				var m = this;
				m.wire ('Changed.items',function () {m.setExpandedDepth (0)});
			},

			instanceMethods:{
				getItemClassName:function (_item,_depth) {
					// override this method
				},

				setItemExpanded:function (_itemSpecifier,_expanded) {
					var
						m = this,
						_item = m.getItemFromSpecifier (_itemSpecifier)
					;
					if (typeof _expanded != 'boolean') _expanded = _item.expanded === false;
					if (_expanded != _item.expanded) {
						var _depth = _itemSpecifier.split (m.get ('itemDelimiter')).length - 1;
						_item.expanded = _expanded;
						m.setNodeProperties (
							_itemSpecifier + 'TitleLink',
							{className:m.getItemClassName (_item,_depth)}
						);
						_expanded && _ensureItemWired (m,_itemSpecifier);
						if (m.Class.itemHasChildren (_item)) {
							var _itemChildrenNode = m.getNode (_itemSpecifier + 'Children');
							m.displayNode (_itemChildrenNode,_expanded);
							if (_expanded) {
								/*** move submenu node to root of document, if necessary ***/
									m.globalizeNode (_itemChildrenNode);

								/*** position the submenu ***/
									m.setNodeStyle (_itemChildrenNode,{zIndex:_zIndex + _depth});
									Uize.Dom.Pos.setAbsPosAdjacentTo (
										_itemChildrenNode,
										m.getNode (_itemSpecifier + 'TitleLink'),
										_depth ? 'x' : 'y'
									);
							}
						}
					}
				},

				wireUi:function () {
					var m = this;
					if (!m.isWired) {
						m._itemsWiredMap = {};
						_ensureItemWired (m,'');

						_superclass.doMy (m,'wireUi');
					}
				}
			},

			stateProperties:{
				_dismissDelay:{
					name:'dismissDelay',
					value:400
				}
			}
		});
	}
});

