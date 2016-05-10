/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Collection.Dynamic Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2007-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 4
	codeCompleteness: 80
	docCompleteness: 3
*/

/*?
	Introduction
		The =Uize.Widget.Collection.Dynamic= class extends =Uize.Widget.Collection= by adding dynamic adding, removing, and drag-and-drop re-ordering of items.

		*DEVELOPERS:* `Chris van Rensburg`, `Jan Borgersen`, `Rich Bean`, `Tim Carter`, `Vinson Chuong`
*/

Uize.module ({
	name:'Uize.Widget.Collection.Dynamic',
	required:[
		'Uize.Dom.Basics',
		'Uize.Dom.Pos',
		'Uize.Widget.Drag',
		'Uize.Tooltip'
	],
	builder:function (_superclass) {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_true = true,
				_false = false,
				_null = null,
				_Uize_Dom = Uize.Dom,
				_Uize_Dom_Basics = _Uize_Dom.Basics,
				_Uize_Dom_Pos = _Uize_Dom.Pos,
				_Uize_Tooltip = Uize.Tooltip,

			/*** General Variables ***/
				_selectedProperty = {selected:_true}
		;

		/*** Private Instance Methods ***/
			function _addItem (m,_widgetProperties) {
				var
					_propertiesProperty = _widgetProperties.properties,
					_itemWidgetName = m.makeItemWidgetName (_propertiesProperty)
				;

				m.get ('items').push (_propertiesProperty);

				return m.addItemWidget (_itemWidgetName,_widgetProperties);
			}

			function _fireItemsChangedEvent (m) {m.fire ('Items Changed')};

		return _superclass.subclass ({
			omegastructor:function () {
				var m = this;

				/*** watch for dragging of items ***/
					var
						_itemInitiatingDrag,
						_itemDisplayOrderNo, // 0 is normal, 1 is reverse
						_itemsDragged,
						_itemsDraggedLength,
						_itemsCoords,
						_itemWidgetOver,
						_itemWidgetOverCoords,
						_insertPointItem,
						_insertPointModeNo, // 0 is before, 1 is after
						_insertPointCoords,
						_lastInsertPointItem,
						_lastInsertPointModeNo,
						_orientationNo,
						_insertionMarkerNode,
						_insertionMarkerDims,
						_axisPosName,
						_axisDimName,
						_drag = m.addChild ('drag',Uize.Widget.Drag,{nodeMap:{'':_null}}),
						_ignoreDrag = _false
					;

					// one way operation
					_drag.wire (
						'Changed.inDrag',
						function (_event) {m.set ({_inDrag:_event.newValue})}
					);

					function _setInDrag (_inDrag) {
						var
							_opacity = _inDrag ? m._itemVestigeOpacity : 1,
							_draggingTooltip = m.getNode ('tooltipDragging')
						;
						for (var _itemDraggedNo = _itemsDraggedLength; --_itemDraggedNo > -1;)
							_itemsDragged [_itemDraggedNo].setNodeOpacity ('',_opacity)
						;
						_inDrag &&
							_Uize_Dom_Basics.setInnerHtml (
								_draggingTooltip,
								m.localize (
									'draggingToReorder' + (_itemsDraggedLength > 1 ? 'Plural' : 'Singular'),
									{totalItems:_itemsDraggedLength}
								)
							)
						;
						_Uize_Tooltip.showTooltip (_draggingTooltip,_inDrag,_true);
					}
					_drag.wire ({
						'Drag Start':
						function () {
							_itemDisplayOrderNo = m._itemDisplayOrder == 'reverse' ? 1 : 0;

							_itemInitiatingDrag.set ({over:_false});

							/*** determine items being dragged ***/
								var _itemInitiatingDragIsSelected = _itemInitiatingDrag.get ('selected');
								if (!_itemInitiatingDragIsSelected) {
									m.selectAll (_false);
									m._ensureItemDraggedIsSelected && _itemInitiatingDrag.set ({selected:_true});
								}

								if (!m._dragIgnoresLocked) {
									// if drag obeys the locked property, the locked objects are not draggable.
									if (_itemInitiatingDragIsSelected) {
										for (
											var
												_itemsSelectedIdx = -1,
												_itemsToDrag = m.getSelected (),
												_itemsToDragLength = _itemsToDrag.length
											;
											++_itemsSelectedIdx < _itemsToDragLength;
										)
											_itemsToDrag[_itemsSelectedIdx].get ('locked') &&
												_itemsToDrag[_itemsSelectedIdx].set ({selected:_false})
											;

										// cancel drag if nothing is selected
										_ignoreDrag = !m.get ('totalSelected');
									}
									else if (_itemInitiatingDrag.get ('locked'))
										_ignoreDrag = _true
									;
								}

								_itemsDragged =
									_itemInitiatingDragIsSelected ? m.getSelected () : [_itemInitiatingDrag]
								;
								_itemsDraggedLength = _itemsDragged.length;

							/*** capture coords for item widgets (for performance during drag) ***/
								_itemsCoords = [];
								m.forAll (
									function (_itemWidget) {
										_itemsCoords.push (_Uize_Dom_Pos.getCoords (_itemWidget.getNode ()));
									}
								);

							/*** initialize ***/
								var
									_itemsCoordsLength = _itemsCoords.length,
									_totalItemsMinus1 = _itemsCoordsLength - 1,
									_itemsCoords0 = _itemsCoords [_itemDisplayOrderNo ? _totalItemsMinus1 : 0],
									_itemsCoords1 = _itemsCoords [_itemDisplayOrderNo ? _totalItemsMinus1 - 1 : 1]
								;
								_orientationNo =
									_totalItemsMinus1 && _itemsCoords1.top >= _itemsCoords0.bottom
										? 1 /* 1 = items layed out vertically */
										: 0 /* 0 = items layed out horizontally */
								;
								_axisPosName = _orientationNo ? 'top' : 'left';
								_axisDimName = _orientationNo ? 'height' : 'width';
								_insertPointItem = _insertPointModeNo = _insertPointCoords = _lastInsertPointItem = _lastInsertPointModeNo = _null;
								_insertionMarkerNode = m.getNode ('insertionMarker');
								_insertionMarkerDims = _Uize_Dom_Pos.getDimensions (_insertionMarkerNode);

								/*** expand drop coordinates for item widgets (performance optimization) ***/
									for (
										var
											_itemWidgetNo = -1,
											_itemWidgetSpacing = _totalItemsMinus1
												?
													_itemsCoords1 [_axisPosName] -
													(_itemsCoords0 [_axisPosName] + _itemsCoords0 [_axisDimName] - 1)
												: 0
											,
											_itemWidgetSpacingDiv2 = _itemWidgetSpacing / 2
										;
										++_itemWidgetNo < _itemsCoordsLength;
									) {
										var _itemWidgetCoords = _itemsCoords [_itemWidgetNo];
										_itemWidgetCoords [_axisPosName] -= _itemWidgetSpacingDiv2;
										_itemWidgetCoords [_axisDimName] += _itemWidgetSpacing;
									}

								_setInDrag (_true);
							},
						'Drag Update':
							function () {
								var
									_dragEventPos = _drag.eventPos
								;
								_Uize_Tooltip.positionTooltip (
									m.getNode ('tooltipDragging'),
									{pageX:_dragEventPos [0],pageY:_dragEventPos [1]}
								);

								function _pointWithinCoords (_coords) {
									return (
										_coords &&
										_Uize_Dom_Pos.doRectanglesOverlap (
											_coords.left,_coords.top,_coords.width,_coords.height,
											_dragEventPos [0],_dragEventPos [1],1,1
										)
									);
								}
								if (!_pointWithinCoords (_itemWidgetOverCoords)) {
									_itemWidgetOver = _itemWidgetOverCoords = _null;
									m.forAll (
										function (_itemWidget,_itemWidgetNo) {
											var _itemWidgetCoords = _itemsCoords [_itemWidgetNo];
											if (_pointWithinCoords (_itemWidgetCoords)) {
												_itemWidgetOver = _itemWidget;
												_itemWidgetOverCoords = _itemWidgetCoords;
											}
											return !_itemWidgetOver;
										}
									);
								}
								if (!_pointWithinCoords (_insertPointCoords)) {
									_insertPointItem = _insertPointCoords = _null;
									if (_itemWidgetOver && !Uize.isIn (_itemsDragged,_itemWidgetOver)) {
										var
											_axisDim = _itemWidgetOverCoords [_axisDimName],
											_axisDimDiv2 = _axisDim / 2,
											_axisLower = _itemWidgetOverCoords [_axisPosName],
											_axisCenter = _axisLower + _axisDimDiv2
										;
										_insertPointItem = _itemWidgetOver;
										_insertPointModeNo = _dragEventPos [_orientationNo] < _axisCenter ? 0 : 1;
										_insertPointCoords = Uize.clone (_itemWidgetOverCoords);
										_insertPointCoords [_axisPosName] = _insertPointModeNo ? _axisCenter : _axisLower;
										_insertPointCoords [_axisDimName] = _axisDimDiv2;
									}
								}
								if (
									_insertPointItem != _lastInsertPointItem ||
									_insertPointModeNo != _lastInsertPointModeNo
								) {
									m.displayNode (_insertionMarkerNode,!!_insertPointItem);
									if (_insertPointItem) {
										var _insertionMarkerCoords = Uize.clone (_insertPointCoords);
										_insertionMarkerCoords [_axisPosName] +=
											(_insertPointModeNo ? _insertPointCoords [_axisDimName] : 0)
											- _insertionMarkerDims [_axisDimName] / 2
										;
										delete _insertionMarkerCoords [_axisDimName];
										_Uize_Dom_Pos.setCoords (_insertionMarkerNode,_insertionMarkerCoords);
									}
									_lastInsertPointItem = _insertPointItem;
									_lastInsertPointModeNo = _insertPointModeNo;
								}
								_drag.set ({cursor:_insertPointItem || _itemWidgetOver ? m._dragCursor : 'not-allowed'});
							},
						'Drag Done':
							function () {
								if (_drag.get ('dragStarted')) {
									_setInDrag (_false);
									m.displayNode ('insertionMarker',_false);

									var _finishDrag = function () {
										if (_insertPointItem && !_ignoreDrag && !_drag.get ('dragCancelled')) {
											var _itemWidgets = m.itemWidgets;

											/*** handle the 'after' insert mode ***/
												if (_insertPointModeNo ^ _itemDisplayOrderNo) {
													var
														_itemWidgetsLength = _itemWidgets.length,
														_insertionIndex = Uize.indexIn (_itemWidgets,_insertPointItem) + 1
													;
													_insertPointItem = _null;
													while (_insertionIndex < _itemWidgetsLength) {
														var _itemWidget = _itemWidgets [_insertionIndex];
														if (!Uize.isIn (_itemsDragged,_itemWidget)) {
															_insertPointItem = _itemWidget;
															break;
														} else {
															_insertionIndex++;
														}
													}
												}

											/*** perform the move ***/
												for (var _itemDraggedNo = -1; ++_itemDraggedNo < _itemsDraggedLength;)
													m.move (_itemsDragged [_itemDraggedNo],_insertPointItem)
												;

											/*** fire events informing of move ***/
												m.fire ('Items Reordered');
												_fireItemsChangedEvent (m);
										}
									};
									m._confirmToDrag
										? m.confirm ({
											state:'warning',
											title:m.localize ('confirmDragToReorderTitle'),
											message:m.localize ('confirmDragToReorderPrompt'),
											yesHandler:function () {
												m._confirmToDrag = _false;
												m.fire ('Drag Confirmed');
												_finishDrag ();
											},
											noHandler:function () {
												_drag.set ({dragCancelled:true});
											}
										})
										: _finishDrag ()
									;
								}
							}
					});

					/*** initiate drag using the drag widget, and let it do the rest ***/
						m.wire (
							'Item Mouse Down',
							function (_event) {
								if (m._dragToReorder) {
									setTimeout(
										function() {
											_itemInitiatingDrag = _event.source;
											_drag.initiate (_event.domEvent);
										},
										0
									);
								}
								_event.bubble = _false;
							}
						);
			},

			instanceMethods:{
				add:function (_itemsToAdd) {
					var
						m = this,
						_itemWidgetsAdded = []
					;

					if (!Uize.isArray (_itemsToAdd)) _itemsToAdd = [_itemsToAdd];
					var _itemsToAddLength = _itemsToAdd.length;
					if (_itemsToAddLength) {
						m._makeNewlyAddedSelected && m.selectAll (_false);
						var _commonProperties = m._makeNewlyAddedSelected ? _selectedProperty : _null;
						for (var _itemToAddNo = -1; ++_itemToAddNo < _itemsToAddLength;)
							_itemWidgetsAdded.push (
								_addItem (m,Uize.copyInto (_itemsToAdd [_itemToAddNo],_commonProperties))
							)
						;
					}
					_fireItemsChangedEvent (m);

					return _itemWidgetsAdded;
				},

				getItemWidgetProperties:function () {
					var m = this;
					return (
						Uize.copyInto (
							{
								previewTooltip:
									function () {return m._dragToReorder ? m.getNode ('tooltipDragToReorder') : _null}
							},
							m.get ('itemWidgetProperties')
						)
					);
				},

				move:function (_itemWidgetToMove, _insertionPointItem) {
					var
						m = this,
						_insertAfter = m._itemDisplayOrder == 'reverse',
						_insertionPointNode = _insertionPointItem ? _insertionPointItem.getNode () : _null,
						_items = m.get ('items'),
						_itemWidgets = m.itemWidgets,
						_rootNode = _itemWidgetToMove.getNode().parentNode,
						_node = _itemWidgetToMove.getNode (),
						_nodeToInsertBefore = _insertAfter
							? (_insertionPointNode ? _insertionPointNode.nextSibling : _rootNode.childNodes[0])
							: _insertionPointNode
					;
					// reorder the DOM element
					_nodeToInsertBefore ? _rootNode.insertBefore (_node, _nodeToInsertBefore) : _rootNode.appendChild(_node);

					/*** reorder itemWidget in the itemWidgets, and item in items ***/
						/*** splice out item being dragged ***/
							var
								_spliceOutPos = Uize.indexIn (_itemWidgets,_itemWidgetToMove),
								_item = _items [_spliceOutPos]
							;
							_itemWidgets.splice (_spliceOutPos,1);
							_items.splice (_spliceOutPos,1);

						/*** splice item into new position ***/
							var _spliceInPos = _insertionPointItem
								? Uize.indexIn (_itemWidgets,_insertionPointItem)
								: _itemWidgets.length
							;
							_itemWidgets.splice (_spliceInPos,0,_itemWidgetToMove);
							_items.splice (_spliceInPos,0,_item);
				},
				getTemplateHtml: function (_templateNode) { /* virtual hook method */
					return _templateNode.innerHTML;
				},
				processItemTemplate:function (_templateNode) {
					// NOTE: This code is pretty much identical to the code in buildHtml (of Uize.Widget), but there's no
					// easy way to get the template into the markup so that it can do what it does.
					var _nodeInnerHtml = this.getTemplateHtml(_templateNode);
					return	Uize.Template &&_templateNode.tagName == 'SCRIPT' && _templateNode.type == 'text/jst'
						? Uize.Template.compile(_nodeInnerHtml, this._templateTokens || { openerToken: '[%', closerToken: '%]' })
						: function (_input) {return _nodeInnerHtml.replace (/ITEMWIDGETNAME/g, _input.name)}
					;
				},

				afterWireUi:function () {},

				wireUi:function () {
					var m = this;

					if (!m.isWired) {
						var
							_docBody = document.body,
							_insertionMarkerNode = m.getNode ('insertionMarker'),
							_itemWidgetProperties = {},
							_itemTemplateNode = m.getNode ('itemTemplate')
						;

						// Pull insertion marker to root
						if (_insertionMarkerNode && _insertionMarkerNode.parentNode != _docBody) {
							_docBody.insertBefore (_insertionMarkerNode, _docBody.childNodes[0]);
							m.setNodeStyle (
								_insertionMarkerNode,
								{
									display:'none',
									position:'absolute',
									zIndex:10000,
									left:'',
									top:'',
									right:'',
									bottom:''
								}
							);
						}

						if (_itemTemplateNode)
							_itemWidgetProperties.html = m.processItemTemplate (_itemTemplateNode)
						;

						_itemWidgetProperties.built = _false;
						_itemWidgetProperties.container = m.getNode ('items');
						_itemWidgetProperties.insertionMode = m._itemDisplayOrder == 'reverse' ? 'inner top' : 'inner bottom';

						// Update the already created item widgets if the UI hasn't been built yet
						m.get('built')
							|| m.forAll( function (_itemWidget) { _itemWidget.set(_itemWidgetProperties) } );

						// For future creation of item widgets we need to update the item widget properties to have all the UI building stuff
						m.set({itemWidgetProperties:Uize.copyInto(_itemWidgetProperties, m.get('itemWidgetProperties') || {})});

						_superclass.doMy (m,'wireUi');

						m.afterWireUi();
					}
				}
			},

			stateProperties:{
				_confirmToDrag:{
					name:'confirmToDrag',
					value:_false
				},
				_dragCursor:{
					name: 'dragCursor',
					value: 'move'
				},
				_dragIgnoresLocked:{
					name:'dragIgnoresLocked',
					value:_true
					/*
						If true, then drag will drag locked CollectionItem widgets. If false, then drag will de-select any locked CollectionItem widgets prior to carrying out the drag.
					*/
				},
				_dragToReorder:{
					name:'dragToReorder',
					value:_false
				},
				_ensureItemDraggedIsSelected:{
					name:'ensureItemDraggedIsSelected',
					value:_false
					/*
						If true, an unselected item that is dragged will be selected. If false, an unselected item that is dragged will remain unselected.
					*/
				},
				_inDrag:'inDrag', // get only
				_itemDisplayOrder:{
					name:'itemDisplayOrder',
					value:'normal' // normal | reverse
				},
				_makeNewlyAddedSelected:{
					name:'makeNewlyAddedSelected',
					value:_true
				},
				_itemVestigeOpacity:{
					name:'itemVestigeOpacity',
					value:.2
				},
				_templateTokens: 'templateTokens'
			}
		});
	}
});
