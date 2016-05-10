/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Delve
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*?
	Introduction
		.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'UizeSite.Delve',
	required:[
		'UizeSite.ModulesTree',
		'Uize.Widgets.NavTree.List.Widget',
		'Uize.Widget.TextInput',
		'Uize.Widget.Options.Tabbed',
		'Uize.Widgets.Log.InstanceEvents.Widget',
		'Uize.Widget.TableSort',
		'Uize.Util.Html.Encode',
		'Uize.Util.Oop',
		'Uize.Dom.Basics',
		'Uize.Str.Has',
		'Uize.Str.Limit',
		'Uize.Str.Repeat',
		'Uize.Array.Join',
		'Uize.Data.PathsTree',
		'Uize.Array.Sort',
		'Uize.Json',
		'Uize.Widgets.Tooltip.KeysValues.Widget',
		'Uize.Tooltip',
		'Uize.Data.Matches'
	],
	superclass:'Uize.Widget.Page',
	builder:function (_superclass) {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_undefined,
				_htmlEncode = Uize.Util.Html.Encode.encode,
				_Uize_Dom_Basics = Uize.Dom.Basics
		;

		/*** Utility Functions ***/
			function _getNodeOuterHtml (_node) {
				return 'outerHTML' in _node ? _node.outerHTML : new XMLSerializer ().serializeToString (_node);
				// REFERENCE: http://stackoverflow.com/questions/1700870/how-do-i-do-outerhtml-in-firefox
			}

		/*** General Variables ***/
			var
				_sacredEmptyObject = {},
				_notInitialized = {},
				_knownUizeModulesLookup = Uize.lookup (
					Uize.Data.PathsTree.toList (UizeSite.ModulesTree (),'.'),
					1,
					true
				),
				_objectNotValidOrNotLoadedMessage = '-- object is undefined, not valid, or is not loaded on page --',
				_reportDivider = '------------------------------------------------------------------------------',
				_treeListDividerQuery = {_title:'- - - - - - - - - - - - - - - - - - - - - - - - - - - -'},
				_treeItemLink = 'javascript:page.treeItemClicked ()',
				_treeListQueries = {
					/*** widget instance queries ***/
						widgetsOnPageTree:{
							_title:'All widgets on the page, as a tree',
							_itemsGenerator:function () {
								var
									m = this,
									_items = [],
									_pageWidget = _getPageWidget (m)
								;
								if (_pageWidget) {
									var _widgetToItem = function (_widget,_level) {
										var
											_children = _widget.children,
											_childNames = Uize.keys (_children).sort ()
										;
										_level++;
										return {
											title:_getWidgetName (m,_widget),
											link:_treeItemLink,
											expanded:_level == 1,
											objectPath:_getWidgetPath (m,_widget),
											items:_childNames.length
												? Uize.map (
													_childNames,
													function (_childName) {return _widgetToItem (_children [_childName],_level)}
												)
												: undefined
										};
									};
									_items [0] = _widgetToItem (_pageWidget,0);
								}
								return _items;
							}
						},
						widgetsOnPageList:{
							_title:'All widgets on the page',
							_itemsGenerator:function () {return _getMatchingWidgetsTreeListItems (this)}
						},
						widgetsOnPageGroupedByClass:{
							_title:'All widgets on the page, grouped by class',
							_itemsGenerator:function () {
								var
									m = this,
									_instancesPerWidgetClassMap = _getInstancesPerWidgetClassMap (m)
								;
								return Uize.map (
									Uize.Array.Sort.sortBy (
										Uize.Data.Matches.values (
											Uize.keys (_instancesPerWidgetClassMap),
											function (_widgetClass) {return _instancesPerWidgetClassMap [_widgetClass].length}
										),
										function (_widgetClass) {
											return (
												((10000 - _instancesPerWidgetClassMap [_widgetClass].length) + '').slice (1) +
												_widgetClass
											);
										}
									),
									function (_widgetClass) {
										var _widgetClassWidgets = _instancesPerWidgetClassMap [_widgetClass];
										return {
											title:_widgetClass + ' (' + _widgetClassWidgets.length + ')',
											link:_treeItemLink,
											expanded:false,
											objectPath:_widgetClass,
											items:Uize.map (
												_widgetClassWidgets,
												function (_widgetClassWidget) {
													var _widgetPath = _getWidgetPath (m,_widgetClassWidget);
													return {
														title:_widgetPath,
														link:_treeItemLink,
														objectPath:_widgetPath
													};
												}
											)
										};
									}
								);
							}
						},
						widgetsDisabled:{
							_title:'Widgets that are in the disabled state',
							_itemsGenerator:function () {
								return _getMatchingWidgetsTreeListItems (
									this,
									function (_widget) {return !_widget.get ('enabledInherited')}
								);
							}
						},
						widgetsNotWired:{
							_title:'Widgets that are not wired',
							_itemsGenerator:function () {
								return _getMatchingWidgetsTreeListItems (this,function (_widget) {return !_widget.isWired});
							}
						},
						wiredWidgetsMissingSomeNodeDOM:{
							_title:'Wired widgets that are missing some DOM nodes',
							_itemsGenerator:function () {
								var m = this;
								return _getMatchingWidgetsTreeListItems (
									m,
									function (_widget) {
										var _result = false;
										if (_widget.isWired) {
											var _nodeCache = _getWidgetNodeCache (m,_widget);
											for (var _nodeName in _nodeCache) {
												if (!_nodeCache [_nodeName]) {
													_result = true;
													break;
												}
											}
										}
										return _result;
									}
								);
							}
						},
						wiredWidgetsMissingAllNodeDOM:{
							_title:'Wired widgets that appear to missing all DOM nodes',
							_itemsGenerator:function () {
								var m = this;
								return _getMatchingWidgetsTreeListItems (
									m,
									function (_widget) {
										var _result = false;
										if (_widget.isWired) {
											var _nodeCache = _getWidgetNodeCache (m,_widget);
											for (var _nodeName in _nodeCache) {
												_result = true;
												if (_nodeCache [_nodeName]) {
													_result = false;
													break;
												}
											}
										}
										return _result;
									}
								);
							}
						},
						widgetsWithLocalizedStringsSpecified:{
							_title:'Widgets for which localized strings are specified',
							_itemsGenerator:function () {
								return _getMatchingWidgetsTreeListItems (
									this,
									function (_widget) {return !Uize.isEmpty (_widget.get ('localized'))}
								);
							}
						},
						widgetsWithRemappedNodes:{
							_title:'Widgets that have some remapped DOM nodes',
							_itemsGenerator:function () {
								return _getMatchingWidgetsTreeListItems (
									this,
									function (_widget) {return !Uize.isEmpty (_widget.get ('nodeMap'))}
								);
							}
						},
						widgetsWithValueInterface:{
							_title:'Widgets that implement the value interface',
							_itemsGenerator:function () {
								return _getMatchingWidgetsTreeListItems (
									this,
									function (_widget) {return 'value' in _widget.get ()}
								);
							}
						},

					divider1:_treeListDividerQuery,

					/*** module queries ***/
						loadedModulesTree:{
							_title:'All loaded modules, as a tree',
							_itemsGenerator:function () {
								var m = this;
								function _itemsFromModulesTree (_namespace,_modulesTree,_level) {
									return _modulesTree && Uize.map (
										Uize.keys (_modulesTree).sort (),
										function (_property) {
											var _moduleName = _namespace + (_namespace && '.') + _property;
											return {
												title:_moduleName,
												link:_treeItemLink,
												expanded:!_level,
												objectPath:_moduleName,
												items:_itemsFromModulesTree (_moduleName,_modulesTree [_property],_level + 1)
											};
										}
									);
								}
								return _itemsFromModulesTree (
									'',
									Uize.Data.PathsTree.fromList (_getLoadedModules (m),'.'),
									0
								);
							}
						},
						loadedModulesList:{
							_title:'All loaded modules (listed in build order)',
							_itemsGenerator:function () {return _getMatchingModulesTreeListItems (this)}
						},
						widgetClasses:{
							_title:'All widgets classes',
							_itemsGenerator:function () {
								return _getWidgetClassesTreeListItems (this);
							}
						},
						widgetClassesInstancesCreated:{
							_title:'Widget classes with instances created',
							_itemsGenerator:function () {
								return _getWidgetClassesTreeListItems (this,true);
							}
						},
						widgetClassesNoInstancesCreated:{
							_title:'Widget classes with no instances created',
							_itemsGenerator:function () {
								return _getWidgetClassesTreeListItems (this,false);
							}
						},
						nonWidgetClasses:{
							_title:'All non-widget loaded modules',
							_itemsGenerator:function () {
								var m = this;
								return _getMatchingModulesTreeListItems (
									m,
									function (_moduleName) {return !_isWidgetClass (m,_moduleName)}
								);
							}
						},
						uizeModules:{
							_title:'All UIZE loaded modules',
							_itemsGenerator:function () {return _getMatchingModulesTreeListItems (this,_isUizeModule)}
						},
						nonUizeModules:{
							_title:'All non-UIZE loaded modules',
							_itemsGenerator:function () {
								return _getMatchingModulesTreeListItems (
									this,
									function (_moduleName) {return !_isUizeModule (_moduleName)}
								);
							}
						},

					divider2:_treeListDividerQuery,

					/*** DOM node queries ***/
						allWidgetDomNodes:{
							_title:'All accessed widget DOM nodes',
							_itemsGenerator:function () {
								return _getMatchingWidgetDomNodesTreeListItems (this);
							}
						},
						allPresentWidgetDomNodes:{
							_title:'All present accessed widget DOM nodes',
							_itemsGenerator:function () {
								return _getMatchingWidgetDomNodesTreeListItems (this,function (_node) {return _node});
							}
						},
						allMissingWidgetDomNodes:{
							_title:'All missing accessed widget DOM nodes',
							_itemsGenerator:function () {
								return _getMatchingWidgetDomNodesTreeListItems (this,function (_node) {return !_node});
							}
						},
						unaccessedWidgetDomNodes:{
							_title:'All unaccessed widget DOM nodes',
							_itemsGenerator:function () {return _getUnaccessedDomNodesWithIdsTreeListItems (this,true)}
						},
						domNodesWithIdsNotBelongingToWidgets:{
							_title:'DOM nodes with IDs not belonging to widgets',
							_itemsGenerator:function () {return _getUnaccessedDomNodesWithIdsTreeListItems (this,false)}
						}
				}
			;

		/*** Utility Functions ***/
			var _childrenDelimiter = '.children.';
			function _getObjectLink (_linkText,_objectPath) {
				return (
					'<a' +
						' href="javascript://"' +
						' class="objectLink"' +
						' title="' + _htmlEncode (_objectPath || _linkText) + '"' +
					'>' +
						(
							_linkText.indexOf (_childrenDelimiter) > -1
								? Uize.Array.Join.hugJoin (
									_linkText.split (_childrenDelimiter),
									'<b>',
									'</b>',
									_childrenDelimiter
								)
								: _linkText
						) +
					'</a>'
				);
			}

			function _isUizeModule (_moduleName) {
				return Uize.Str.Has.hasPrefix (_moduleName,'Uize');
			}

			function _addTabContentsSection (
				_htmlChunks,_title,_subtitle,_contents,_contentsDefault,_preformattedText
			) {
				_htmlChunks.push (
					'<div class="objectInspectorTabContentsSectionTitle">' +
						_title +
						(
							_subtitle
								? (
									'<span class="objectInspectorTabContentsSectionSubtitle">&nbsp;&nbsp;-&nbsp;&nbsp;' +
									_subtitle +
									'</span>'
								)
								: ''
						) +
					'</div>',
					_preformattedText ? '<pre>' : '',
						((Uize.isArray (_contents) ? _contents.join ('\n') : _contents) || _contentsDefault) + '\n',
					_preformattedText ? '</pre>' : ''
				);
			}

		/*** Private Instance Methods ***/
			function _updateUiDocumentation () {
				var m = this;
				if (m.isWired && m.children.objectInspectorTabs + '' == 'documentation') {
					var _documentationUrl = m._documentationUrl;
					if (_documentationUrl != m._lastDisplayedDocumentationUrl) {
						var _contentWindow = m.getNode ('documentation').contentWindow;
						if (_contentWindow)
							_contentWindow.location.href = _documentationUrl
						;
						m._lastDisplayedDocumentationUrl = _documentationUrl;
					}
				}
			}

			function _updateUiVariousTabs () {
				var m = this;
				_updateUiSummary (m);
				_updateUiState (m);
				_updateUiFeatures (m);
				_updateUiDocumentation.call (m);
			}

			function _updateEventsLog () {
				var _objectInspectorEventsLog = this.children.objectInspectorEventsLog;
				_objectInspectorEventsLog &&
					_objectInspectorEventsLog.set ({instance:this._objectInspected})
				;
			}

			function _updateObjectEntry () {
				var _objectEntry = this.children.objectEntry;
				_objectEntry && _objectEntry.set ({value:this._objectInspectedPath});
			}

			function _updateTreeListItems () {
				var
					m = this,
					_treeList = m.children.treeList
				;
				if (_treeList) {
					var _itemsGenerator = _treeListQueries [m._treeListQuery]._itemsGenerator;
					_treeList.set ({items:_itemsGenerator ? _itemsGenerator.call (m) : []})
				}
			}

			function _updateUiTreeListDropdown () {
				var m = this;
				if (m.isWired) {
					m.setNodeValue ('treeListDropdown',m._treeListQuery);
				}
			}

			function _updateUiWindowInspected () {
				var m = this;
				if (m.isWired) {
					var _window = m._window;
					m.setNodeValue (
						'windowInspected',
						_window
							? Uize.Str.Limit.limitLength (_window.location.href,120)
							: 'no window being inspected'
					);
					m.setNodeProperties (
						'windowInspected',
						{title:_window ? _window.document.title : ''}
					);
				}
			}

			function _evalInWindow (m,_expression) {
				var _window = m._window;
				if (_window && _expression) {
					try {return _window.eval ('(' + _expression + ')')} catch (_error) {}
				}
			}

			function _updateInfoTooltip (m,_objectPath) {
				var
					_object = _resolveToObject (m,_objectPath),
					_whatItIs = _object == _undefined
						? _whatItIs + ''
						: _isWidget (m,_object)
							? 'widget'
							: Uize.Util.Oop.isUizeClass (_object)
								? 'class'
								: _Uize_Dom_Basics.isNode (_object)
									? 'DOM node'
									: _object.constructor == m._window.Object
										? 'simple object'
										: typeof _object
					,
					_tooltipData = {'what it is':_whatItIs}
				;
				if (_object != _undefined)
					_tooltipData ['instance of'] = Uize.Util.Oop.getClassName (_object.constructor)
				;
				if (_whatItIs == 'widget') {
					var
						_depth = 0,
						_parent = _object
					;
					while (_parent = _parent.parent) _depth++;
					_tooltipData ['depth in tree'] = _depth || 'this is the root widget';
					_tooltipData.children = Uize.totalKeys (_object.children) || 'no children';
					_tooltipData.siblings =
						(_object.parent && (Uize.totalKeys (_object.parent.children) - 1)) || 'no siblings'
					;
					_tooltipData ['localized strings'] =
						Uize.totalKeys (_object.get ('localized')) || 'no localized strings'
					;
					_tooltipData ['DOM nodes'] = _getWidgetNodesInfo (m,_object)._summary;
				} else if (_whatItIs == 'class') {
					_tooltipData.superclass =
						Uize.Util.Oop.getClassName (_object.superclass) || 'this is the root class'
					;
					_tooltipData ['inheritance depth'] =
						Uize.Util.Oop.getInheritanceChain (_object).length - 1 || 'this is the root class'
					;
					_tooltipData.subclasses =
						_getSubclassesOfClassTreeListItems (m,_object).length || 'no subclasses on this page'
					;
					if (_isWidgetClass (m,_object))
						_tooltipData ['widget instances'] =
							_getMatchingWidgetsFromTree (
								m,
								function (_widget) {return _widget.constructor == _object}
							).length || 'no instances of this class'
					;
				} else if (_whatItIs == 'DOM node') {
					_tooltipData.id = _object.id;
					_tooltipData.tag = _object.tagName;

					var _widget = _getWidgetFromNodeId (m,_object.id);
					_tooltipData ['owner widget'] =
						_widget ? _getWidgetPath (m,_widget) : 'not owned by a widget'
					;
					_tooltipData ['owner widget class'] =
						_widget ? Uize.Util.Oop.getClassName (_widget.constructor) : 'not owned by a widget'
					;
				}
				if (Uize.Util.Oop.isUizeClassInstance (_object) && 'value' in _object.get ())
					_tooltipData.value = _object.valueOf ()
				;
				m.children.infoTooltip.set ({
					heading:_objectPath,
					data:_tooltipData
				});
			}

			function _showInfoTooltip (m,_mustShow) {
				Uize.Tooltip.showTooltip (m.children.infoTooltip.getNode (),_mustShow);
			}

			function _getPageWidget (m) {
				var _window = m._window;
				return _window && (_window.zPage || _window.page);
			}

			function _getPageWidgetName (m) {
				var _pageWidget = _getPageWidget (m);
				return _pageWidget && (_pageWidget == m._window.zPage ? 'zPage' : 'page');
			}

			function _getWidgetName (m,_widget) {
				return (
					_widget.get ('name') ||
					(_widget == _getPageWidget (m) ? _getPageWidgetName (m) : '')
				);
			}

			function _getLoadedModules (m) {
				var _openerUize = m._window.Uize;
				return (
					(_openerUize.getModulesBuilt && _openerUize.getModulesBuilt ()) ||
					Uize.keys (_openerUize.getModuleByName ('*')) // NOTE: Uize.getModulesBuilt is deprecated */
				);
			}

			function _getWidgetPath (m,_widget) {
				var _widgetPath = [];
				while (_widget) {
					_widgetPath.unshift (_getWidgetName (m,_widget));
					_widget = _widget.parent
				}
				return _widgetPath.join ('.children.');
			}

			function _getWidgetNodeCache (m,_widget) {
				/*** discover node cache object name (if not already known) ***/
					/* NOTE:
						The node cache object is not part of the public interface for the Uize.Widget class, so we have to play some tricks in order to find it.
					*/
					if (!m._widgetNodeCachePropertyName) {
						var
							_crazyNodeName = 'THIS_IS_THE_NAME_FOR_A_NODE_THAT_SHOULD_NEVER_EXIST_IN_PRACTICE',
							_nodeCache
						;
						_widget.getNode (_crazyNodeName);
						for (var _propertyName in _widget) {
							var _propertyValue = _widget [_propertyName];
							if (
								_propertyValue != _undefined &&
								typeof _propertyValue == 'object' &&
								_crazyNodeName in _propertyValue
							) {
								m._widgetNodeCachePropertyName = _propertyName;
								delete _propertyValue [_crazyNodeName];
								break;
							}
						}
					}

				return _widget [m._widgetNodeCachePropertyName] || {};
			}

			function _windowFind (m) {
				var _windowUize = m._window.Uize;
				return (_windowUize.Node || _windowUize.Dom.Basics).find;
				/* NOTE:
					A better approach here would be to allow the Uize.Dom.* modules to be invoked with a window or document context. This would require restructuring so that such modules become classes, of which instances or singletons can be created.

					At the very least, the Uize.Dom.Basics module could support a static property for the window that should be used as the context, and this function could return a function that changed the context before executing the Uize.Dom.* methods and then restored the context afterwards.
				*/
			}

			function _windowGetCoords (m) {
				var _windowUize = m._window.Uize;
				return (_windowUize.Node || _windowUize.Dom.Pos).getCoords;
				/* NOTE:
					A better approach here would be to allow the Uize.Dom.* modules to be invoked with a window or document context. This would require restructuring so that such modules become classes, of which instances or singletons can be created.

					At the very least, the Uize.Dom.Basics module could support a static property for the window that should be used as the context, and this function could return a function that changed the context before executing the Uize.Dom.* methods and then restored the context afterwards.
				*/
			}

			function _getWidgetNodesInfo (m,_widget) {
				var
					_nodeCache = _getWidgetNodeCache (m,_widget),
					_allNodesMap = Uize.copy (_nodeCache),
					_idPrefix = _widget.get ('idPrefix'),
					_nodeIdPrefix = _idPrefix + '-',
					_nodeIdPrefixLength = _nodeIdPrefix.length,
					_nodeCacheIdLookup = {},
					_totalPresentAccessedNodes = 0,
					_totalMissingAccessedNodes = 0,
					_totalUnaccessedNodes = 0,
					_node
				;
				for (var _nodeName in _nodeCache) {
					if (_node = _nodeCache [_nodeName]) {
						_nodeCacheIdLookup [_node.id] = 1;
						_totalPresentAccessedNodes++;
					} else {
						_totalMissingAccessedNodes++;
					}
				}
				_windowFind (m) ({
					id:function (_nodeId) {
						if (
							_nodeId &&
							!(_nodeId in _nodeCacheIdLookup) &&
							(_nodeId == _idPrefix || Uize.Str.Has.hasPrefix (_nodeId,_nodeIdPrefix))
						) {
							_totalUnaccessedNodes++;
							_allNodesMap [_nodeId.slice (_nodeIdPrefixLength)] = this;
						}
					}
				});
				var
					_totalAccessedNodes = _totalPresentAccessedNodes + _totalMissingAccessedNodes,
					_totalNodes = _totalAccessedNodes + _totalUnaccessedNodes,
					_allAccessed = _totalAccessedNodes == _totalNodes
				;
				return {
					_nodeCache:_nodeCache,
					_allNodesMap:_allNodesMap,
					_totalNodes:_totalNodes,
					_totalAccessedNodes:_totalAccessedNodes,
					_totalUnaccessedNodes:_totalUnaccessedNodes,
					_totalPresentAccessedNodes:_totalPresentAccessedNodes,
					_totalMissingAccessedNodes:_totalMissingAccessedNodes,
					_summary:
						_totalNodes
							?
								_totalNodes + ' (' +
									(
										_allAccessed
											? 'all accessed'
											: _totalUnaccessedNodes == _totalNodes
												? 'none accessed'
												: _totalAccessedNodes + ' accessed, ' + _totalUnaccessedNodes + ' unaccessed'
									) +
									(
										_totalAccessedNodes
											? (
												', ' +
												(
													_allAccessed && (!_totalPresentAccessedNodes || !_totalMissingAccessedNodes)
														? (_totalPresentAccessedNodes ? 'all present' : 'all missing')
														: _totalMissingAccessedNodes + ' known missing'
												)
											)
											: ''
									) +
								')'
							: 'no DOM nodes'
				};
			}

			function _getWidgetFromNodeId (m,_nodeId) {
				if (_nodeId) {
					var
						_findWidgetWithIdPrefix = function (_parent) {
							if (_parent.get ('idPrefix') == _idPrefix) {
								return _parent;
							} else {
								var
									_children = _parent.children,
									_widget
								;
								for (var _childName in _children) {
									if (_widget = _findWidgetWithIdPrefix (_children [_childName]))
										return _widget
									;
								}
							}
						},
						_nodeNamePos = _nodeId.indexOf ('-'),
						_idPrefix = _nodeNamePos > -1 ? _nodeId.slice (0,_nodeNamePos) : _nodeId
					;
					return _findWidgetWithIdPrefix (_getPageWidget (m));
				}
			}

			function _resolveToObject (m,_object) {
				return typeof _object == 'string' ? _evalInWindow (m,_object) : _object;
			}

			function _getMatchingModulesTreeListItems (m,_moduleMatcher) {
				var
					_items = [],
					_loadedModules = _getLoadedModules (m)
				;
				Uize.forEach (
					_moduleMatcher ? _loadedModules.sort () : _loadedModules,
					function (_module) {
						_module && (!_moduleMatcher || _moduleMatcher (_module)) &&
							_items.push ({
								title:_module,
								link:_treeItemLink,
								objectPath:_module
							})
						;
					}
				);
				return _items;
			}

			function _getSubclassesOfClassTreeListItems (m,_class) {
				return _getMatchingModulesTreeListItems (
					m,
					function (_moduleName) {
						var _module = _resolveToObject (m,_moduleName);
						return _module != _class && Uize.Util.Oop.inheritsFrom (_module,_class);
					}
				);
			}

			function _getInstancesPerWidgetClassMap (m) {
				var _instancesPerWidgetClassMap = {};
				_getMatchingWidgetsFromTree (
					m,
					function (_widget) {
						var _widgetClass = _widget.constructor.moduleName;
						(_instancesPerWidgetClassMap [_widgetClass] || (_instancesPerWidgetClassMap [_widgetClass] = []))
							.push (_widget)
						;
					}
				);
				return _instancesPerWidgetClassMap;
			}

			function _getWidgetClassesTreeListItems (m,_instancesCreated) {
				var _instancesPerWidgetClassMap = _getInstancesPerWidgetClassMap (m);
				return _getMatchingModulesTreeListItems (
					m,
					function (_moduleName) {
						return (
							(
								_instancesCreated == _undefined ||
								!!(_instancesPerWidgetClassMap [_moduleName] || _sacredEmptyObject).length == _instancesCreated
							) &&
							_isWidgetClass (m,_moduleName)
						);
					}
				);
			}

			function _getMatchingWidgetsFromTree (m,_widgetMatcher) {
				var _widgets = [];
				function _processWidget (_widget,_widgetPath) {
					_widgetPath += _getWidgetName (m,_widget);
					(!_widgetMatcher || _widgetMatcher (_widget)) && _widgets.push (_widgetPath);
					_widgetPath += '.children.';
					var _children = _widget.children;
					for (var _childName in _children)
						_processWidget (_children [_childName],_widgetPath)
					;
				}
				_processWidget (_getPageWidget (m),'');
				return _widgets;
			}

			function _getMatchingWidgetsTreeListItems (m,_widgetMatcher) {
				return Uize.map (
					_getMatchingWidgetsFromTree (m,_widgetMatcher).sort (),
					function (_objectPath) {
						return {
							title:_objectPath,
							link:_treeItemLink,
							objectPath:_objectPath
						};
					}
				);
			}

			function _getMatchingWidgetDomNodesTreeListItems (m,_nodeMatcher) {
				var _items = [];
				function _processWidget (_widget) {
					if (_widget) {
						/*** iterate through widget's accessed DOM nodes ***/
							var
								_nodeCache = _getWidgetNodeCache (m,_widget),
								_objectPathPrefix
							;
							for (var _nodeName in _nodeCache) {
								var _node = _nodeCache [_nodeName];
								(!_nodeMatcher || _nodeMatcher (_node)) && _items.push ({
									title:
										'#' +
										(
											_node
												? _node.id || ' [DOM NODE WITH NO ID]'
												: _widget.get ('idPrefix') + (_nodeName && ('-' + _nodeName)) + ' [MISSING]'
										),
									link:_treeItemLink,
									objectPath:
										(
											_objectPathPrefix ||
											(_objectPathPrefix = _getWidgetPath (m,_widget) + '.getNode (\'')
										) +
											_nodeName +
										'\')'
								});
							}

						/*** iterate through child widgets ***/
							var _children = _widget.children;
							for (var _childName in _children)
								_processWidget (_children [_childName])
							;
					}
				}
				_processWidget (_getPageWidget (m));
				return _items;
			}

			function _getUnaccessedDomNodesWithIdsTreeListItems (m,_widgetOrNotWidget) {
				var
					_accessedNodesLookup = {},
					_idPrefixMap = {}
				;
				/*** iterate through widget tree, creating lookup of all accessed, non-null DOM nodes, and idPrefix map ***/
					function _processWidget (_widget) {
						if (_widget) {
							_idPrefixMap [_widget.get ('idPrefix')] = 1;

							/*** iterate through widget's accessed DOM nodes ***/
								var
									_nodeCache = _getWidgetNodeCache (m,_widget),
									_node,
									_nodeId
								;
								for (var _nodeName in _nodeCache) {
									if ((_node = _nodeCache [_nodeName]) && (_nodeId = _node.id))
										_accessedNodesLookup [_nodeId] = 1
									;
								}

							/*** iterate through child widgets ***/
								var _children = _widget.children;
								for (var _childName in _children)
									_processWidget (_children [_childName])
								;
						}
					}
					_processWidget (_getPageWidget (m));

				return Uize.Array.Sort.sortBy (
					Uize.map (
						_windowFind (m) ({
							id:function (_nodeId) {
								if (!_nodeId || _accessedNodesLookup [_nodeId]) return false;
								var _nodeBelongsToWidget = _idPrefixMap [_nodeId];
								if (!_nodeBelongsToWidget) {
									var _nodeNamePos = _nodeId.indexOf ('-');
									_nodeBelongsToWidget = _nodeNamePos > -1 && _idPrefixMap [_nodeId.slice (0,_nodeNamePos)];
								}
								return _nodeBelongsToWidget == _widgetOrNotWidget;
							}
						}),
						function (_node) {
							var _nodeId = _node.id;
							return {
								title:'#' + _nodeId,
								link:_treeItemLink,
								objectPath:'document.getElementById (\'' + _nodeId + '\')'
							};
						}
					),
					'value.title'
				);
			}

			function _isWidgetClass (m,_class) {
				return Uize.Util.Oop.inheritsFrom (_resolveToObject (m,_class),m._window.Uize.Widget);
			}

			function _isWidget (m,_object) {
				return Uize.isInstance (_object) && _isWidgetClass (m,_object);
			}

			function _showReport (m,_title,_report) {
				var
					_window = m.launchPopup ({
						name:'delveReport',
						width:980,
						height:650
					}),
					_document = _window.document
				;
				_document.open ('text/html');
				_document.writeln (
					[
						'<html>',
							'<head>',
								'<title>REPORT: ' + _title + '</title>',
							'</head>',
							'<body>',
								'<pre>' + _htmlEncode (_report) + '</pre>',
							'</body>',
						'</html>'
					].join ('\n')
				);
				_document.close ();
				_window.focus ();
			}

			function _updateUiSummary (m) {
				var _object = m._objectInspected;
				if (
					m.isWired &&
					m.children.objectInspectorTabs + '' == 'summary' &&
					_object !== m._summaryLastObject
				) {
					var
						_objectInspectedPath = m._objectInspectedPath,
						_htmlChunks = []
					;
					if (_object != _undefined) {
						var
							_objectIsWidget = _isWidget (m,_object),
							_objectIsWidgetClass = !_objectIsWidget && _isWidgetClass (m,_object)
						;
						_addTabContentsSection (
							_htmlChunks,
							'SUMMARY FOR',
							'',
							_getObjectLink (_objectInspectedPath),
							'',
							true
						);
						_addTabContentsSection (
							_htmlChunks,
							'INSTANCE OF',
							'',
							_getObjectLink (Uize.Util.Oop.getClassName (_object.constructor)),
							'',
							true
						);

						var _addWidgetsSummarySection = function (_title,_widgets,_contentsDefault) {
							_addTabContentsSection (
								_htmlChunks,
								_title,
								_widgets.length + ' widgets',
								_widgets.length
									? (
										'<table class="objectInspectorTabContentsInfoTable">' +
											'<tr class="heading">' +
												'<td>WIDGET PATH</td>' +
												'<td>CLASS</td>' +
											'</tr>' +
											Uize.map (
												_widgets,
												function (_widget) {
													_widget = _resolveToObject (m,_widget);
													return (
														'<tr>' +
															'<td>' +
																_getObjectLink (_getWidgetPath (m,_widget)) +
															'</td>' +
															'<td>' +
																_getObjectLink (Uize.Util.Oop.getClassName (_widget.constructor)) +
															'</td>' +
														'</tr>'
													);
												}
											).join ('') +
										'</table>'
									)
									: ('<pre>' + _contentsDefault + '</pre>')
							);
						};

						if (_objectIsWidget) {
							/*** determine parentage ***/
								var
									_parent = _object.parent,
									_parents = []
								;
								while (_parent) {
									_parents.push (_parent);
									_parent = _parent.parent;
								}
								_addWidgetsSummarySection ('PARENTAGE',_parents,'no parents');

							/*** determine children ***/
								var
									_childWidgets = [],
									_children = _object.children
								;
								for (var _childName in _children)
									_childWidgets.push (_children [_childName])
								;
								_addWidgetsSummarySection ('CHILDREN',_childWidgets,'no children');

							/*** determine siblings ***/
								var
									_siblings = [],
									_parentChildren = _object.parent && _object.parent.children,
									_sibling
								;
								for (var _siblingName in _parentChildren)
									(_sibling = _parentChildren [_siblingName]) != _object &&
										_siblings.push (_sibling)
								;
								_addWidgetsSummarySection ('SIBLINGS',_siblings,'no siblings');

							/*** determine DOM nodes ***/
								var
									_nodesInfo = _getWidgetNodesInfo (m,_object),
									_nodeCache = _nodesInfo._nodeCache,
									_allNodesMap = _nodesInfo._allNodesMap,
									_nodeNames = Uize.keys (_allNodesMap).sort (),
									_getNodeMethodCallPrefix = _getWidgetPath (m,_object) + '.getNode (\''
								;
								_addTabContentsSection (
									_htmlChunks,
									'DOM NODES',
									_nodesInfo._summary,
									_nodeNames.length
										? (
											'<table class="objectInspectorTabContentsInfoTable">' +
												'<tr class="heading">' +
													'<td>NODE NAME</td>' +
													'<td>ACCESSED</td>' +
													'<td>EXISTS</td>' +
													'<td>ID</td>' +
													'<td>TAG</td>' +
												'</tr>' +
												Uize.map (
													_nodeNames,
													function (_nodeName) {
														var
															_node = _allNodesMap [_nodeName],
															_accessed = _nodeName in _nodeCache
														;
														return (
															'<tr>' +
																'<td>' +
																	_getObjectLink (
																		_nodeName || '[ROOT NODE]',
																		_accessed
																			? _getNodeMethodCallPrefix + _nodeName + '\')'
																			: 'document.getElementById (\'' + _node.id + '\')'
																	) +
																'</td>' +
																'<td style="text-align:center;">' +
																	(_accessed ? 'yes' : '<b>NO</b>') +
																'</td>' +
																'<td style="text-align:center;">' +
																	(_node ? 'present' : '<b>MISSING</b>') +
																'</td>' +
																'<td>' + (_node ? _node.id : '-----') + '</td>' +
																'<td style="text-align:center;">' +
																	(_node ? _node.tagName : '-----') +
																'</td>' +
															'</tr>'
														);
													}
												).join ('') +
											'</table>'
										)
										: '<pre>no DOM nodes</pre>'
								);

							/*** determine localized strings ***/
								var
									_localized = _object.get ('localized'),
									_stringNames = Uize.keys (_localized).sort (),
									_localizeMethodCallPrefix = _objectInspectedPath + '.localize (',
									_getLocalizeMethodCall = function (_stringName) {
										var
											_stringValue = _localized [_stringName],
											_totalTokens = 0,
											_tokensHash = {},
											_tokenMatcher = /\{([^\}]+)\}/g,
											_tokenMatch
										;
										while (_tokenMatch = _tokenMatcher.exec (_stringValue)) {
											_tokensHash [_tokenMatch [1]] = '';
											_totalTokens++;
										}
										return (
											_localizeMethodCallPrefix + Uize.Json.to (_stringName) +
											(_totalTokens ? ',' + Uize.Json.to (_tokensHash,'mini') : '') +
											')'
										);
									}
								;
								_addTabContentsSection (
									_htmlChunks,
									'LOCALIZED STRINGS',
									_stringNames.length + ' strings',
									_stringNames.length
										? (
											'<table class="objectInspectorTabContentsInfoTable">' +
												'<tr class="heading">' +
													'<td>NAME</td>' +
													'<td>VALUE</td>' +
												'</tr>' +
												Uize.map (
													_stringNames,
													function (_stringName) {
														return (
															'<tr>' +
																'<td>' +
																	_getObjectLink (_stringName,_getLocalizeMethodCall (_stringName)) +
																'</td>' +
																'<td>' + _localized [_stringName] + '</td>' +
															'</tr>'
														);
													}
												).join ('') +
											'</table>'
										)
										: '<pre>no localized strings specified for this widget</pre>'
								);

							/*** determine HTML for the widget ***/
								var _widgetNode =
									_object.get ('container') ||
									_object.getNode ('shell') ||
									_object.getNode () ||
									(_object.parent && _object.parent.getNode (_object.get ('name')))
								;
								_addTabContentsSection (
									_htmlChunks,
									'HTML',
									'',
									_htmlEncode (
										_widgetNode
											? _getNodeOuterHtml (_widgetNode)
											: 'this widget has no container node, shell node, or root node'
									),
									'',
									true
								);

						} else if (Uize.Util.Oop.isUizeClass (_object)) {
							/*** determine inheritance ***/
								var _inheritanceChain = Uize.Util.Oop.getInheritanceChain (_object);
								_addTabContentsSection (
									_htmlChunks,
									'INHERITANCE CHAIN',
									'inheritance depth: ' + (_inheritanceChain.length - 1),
									Uize.map (
										_inheritanceChain,
										function (_class) {return _getObjectLink (_class.moduleName)}
									).join (' &minus;> '),
									'this is the root class',
									true
								);

							/*** determine subclasses ***/
								var _subclasses = _getSubclassesOfClassTreeListItems (m,_object);
								_addTabContentsSection (
									_htmlChunks,
									'SUBCLASSES (ON THIS PAGE)',
									_subclasses.length + ' subclasses',
									Uize.map (
										_subclasses,
										function (_item) {
											return (
												_getObjectLink (_item.title) +
												(
													_resolveToObject (m,_item.objectPath).superclass == _object
														? ' - <b>DIRECT SUBCLASS</b>'
														: ''
												)
											);
										}
									),
									'no subclasses on this page',
									true
								);

							/*** determine widgets of this class ***/
								_objectIsWidgetClass &&
									_addWidgetsSummarySection (
										'INSTANCES OF THIS WIDGET CLASS',
										_getMatchingWidgetsFromTree (
											m,
											function (_widget) {return _widget.constructor == _object}
										),
										'no widgets of this class instantiated'
									)
								;
						} else if (_Uize_Dom_Basics.isNode (_object)) {
							var _widget = _getWidgetFromNodeId (m,_object.id);
							_addTabContentsSection (
								_htmlChunks,
								'OWNER WIDGET',
								'',
								_widget ? _getObjectLink (_getWidgetPath (m,_widget)) : '',
								'this node does not appear to belong to a widget',
								true
							);
							_addTabContentsSection (_htmlChunks,'ID','',_object.id,'no id specified for this node',true);
							_addTabContentsSection (_htmlChunks,'TAG','',_object.tagName,'',true);
							_addTabContentsSection (
								_htmlChunks,
								'HTML',
								'',
								_htmlEncode (_getNodeOuterHtml (_object)),
								'',
								true
							);
						} else if (Uize.Util.Oop.isUizeClass (_object) || Uize.Util.Oop.isUizeClassInstance (_object)) {
							// do nothing, since state is shown in the state tab
						} else if (Uize.isFunction (_object)) {
							_addTabContentsSection (
								_htmlChunks,'CODE','',_htmlEncode (_object.toString ()),'',true
							);
						} else {
							_addTabContentsSection (
								_htmlChunks,'TO STRING','',_htmlEncode (_object.toString ()),'',true
							);
							_addTabContentsSection (
								_htmlChunks,'JSON SERIALIZATION','',_htmlEncode (Uize.Json.to (_object)),'',true
							);
						}
					} else {
						_htmlChunks.push ('<br/>' + _objectNotValidOrNotLoadedMessage);
					}

					_rebuildTabContetsHtmlAndWireUi (m,m.children.objectInspectorSummary,_htmlChunks);
 					m._summaryLastObject = _object;
				}
			}

			function _updateUiState (m) {
				var _object = m._objectInspected;
				if (
					m.isWired &&
					m.children.objectInspectorTabs + '' == 'state' &&
					_object !== m._stateLastObject
				) {
					var _htmlChunks = [];
					if (Uize.Util.Oop.isUizeClass (_object) || Uize.Util.Oop.isUizeClassInstance (_object)) {
						var
							_objectInspectedPath = m._objectInspectedPath,
							_propertiesHtmlChunks = [
								'<table class="objectInspectorTabContentsInfoTable">' +
									'<tr class="heading">',
										'<td>NAME</td>',
										'<td>ACTIONS</td>',
										'<td>VALUE</td>',
									'</tr>'
							]
						;
						for (
							var
								_propertyNo = -1,
								_propertyValues = _object.get (),
								_properties = Uize.keys (_propertyValues).sort (),
								_propertiesLength = _properties.length,
								_propertyGetMethodCallPrefix = _objectInspectedPath + '.get (\'',
								_propertySetMethodCallPrefix = _objectInspectedPath + '.set (\'',
								_property
							;
							++_propertyNo < _propertiesLength;
						)
							(_property = _properties [_propertyNo]).indexOf ('_') < 0 &&
								_propertiesHtmlChunks.push (
									'<tr>',
										'<td>',
											_getObjectLink (_property,_propertyGetMethodCallPrefix + _property + '\')'),
										'</td>',
										'<td style="white-space:nowrap; text-align:center;">',
											_getObjectLink ('get',_propertyGetMethodCallPrefix + _property + '\')'),
											' | ',
											_getObjectLink ('set',_propertySetMethodCallPrefix + _property + '\',#)'),
										'</td>',
										'<td>' + _htmlEncode (_propertyValues [_property]) + '</td>',
									'</tr>'
								)
						;
						_propertiesHtmlChunks.push ('</table>');
						_addTabContentsSection (
							_htmlChunks,
							'STATE PROPERTIES',
							_propertiesLength + ' properties',
							_propertiesLength
								? _propertiesHtmlChunks.join ('')
								: '<pre>this class has no state properties</pre>'
						);
					} else {
						_htmlChunks.push ('<br/>' + '-- object does not support a state properties state interface --');
					}

					_rebuildTabContetsHtmlAndWireUi (m,m.children.objectInspectorState,_htmlChunks);
					m._stateLastObject = _object;
				}
			}

			function _updateUiFeatures (m) {
				var _object = m._objectInspected;
				if (
					m.isWired &&
					m.children.objectInspectorTabs + '' == 'features' &&
					_object !== m._featuresLastObject
				) {
					var _htmlChunks = [];
					if (_object != _undefined) {
						var
							_features = Uize.Util.Oop.getFeatures (_object),
							_featuresLength = _features.length
						;
						if (_featuresLength) {
							var
								_objectPath = Uize.Util.Oop.getClassName (_object = Uize.Util.Oop.resolveToClass (_object)),
								_getLinkedModuleCell = function (_object) {
									return (
										'<td class="moduleName">' +
											_getObjectLink (Uize.Util.Oop.getClassName (_object),'',true) +
										'</td>'
									);
								}
							;
							_htmlChunks.push (
								'<table id="' + m.children.objectInspectorFeatures.children.table.get ('idPrefix') + '" class="data">',
									'<tr class="title">',
										'<td colspan="6">',
											'Features detected for ' + _objectPath,
										'</td>',
									'</tr>',
									'<tr class="heading">',
										'<td>NAME</td>',
										'<td>ACCESS</td>',
										'<td>CONTEXT</td>',
										'<td>TYPE</td>',
										'<td>INTRODUCED IN</td>',
										'<td>LAST OVERRIDDEN IN</td>',
									'</tr>'
							);
							for (
								var
									_featureNo = -1,
									_objectPrototypePath = _objectPath + '.prototype.'
								;
								++_featureNo < _featuresLength;
							) {
								var _feature = _features [_featureNo];
								_htmlChunks.push (
									'<tr>',
										'<td class="featureName">' +
											(
												_feature.context == 'State'
													? _feature.name
													: _getObjectLink (
														_feature.name,
														_feature.context == 'Instance' ? _objectPrototypePath + _feature.name : '',
														true
													)
											) +
										'</td>',
										'<td>' + _feature.access + '</td>',
										'<td>' + _feature.context + '</td>',
										'<td>' + _feature.type + '</td>',
										_getLinkedModuleCell (_feature.introducedIn),
										_getLinkedModuleCell (_feature.overriddenIn),
									'</tr>'
								);
							}
							_htmlChunks.push ('</table>');
						} else {
							_htmlChunks.push ('<br/>-- no features could be automatically detected for this object');
						}
					} else {
						_htmlChunks.push ('<br/>' + _objectNotValidOrNotLoadedMessage);
					}

					_rebuildTabContetsHtmlAndWireUi (m,m.children.objectInspectorFeatures,_htmlChunks);
					m._featuresLastObject = _object;
				}
			}

			function _updateDocumentationUrl (m) {
				var
					_objectInspected = m._objectInspected,
					_objectInspectedPath = m._objectInspectedPath,
					_className = _knownUizeModulesLookup [_objectInspectedPath] && _objectInspectedPath
				;
				if (!_className && _objectInspected != _undefined) {
					_className = Uize.Util.Oop.getClassName (Uize.Util.Oop.resolveToClass (_objectInspected));
					if (!_isUizeModule (_className)) {
						var _class = _resolveToObject (m,_className);
						if (Uize.Util.Oop.isUizeClass (_class))
							while (
								(_className = (_class = _class.superclass).moduleName) &&
								!_isUizeModule (_className)
							)
						;
					}
				}
				m.set ({
					_documentationUrl:
						m._baseUrl + '/' +
						(
							_className && _isUizeModule (_className)
								? 'reference/' + _className + '.html'
								: 'guides/using-the-delve-tool.html'
						)
				});
			}

			function _refresh (m) {
				var _objectInspectedPath = m._objectInspectedPath;
				_updateTreeListItems.call (m);
				_updateUiWindowInspected.call (m);
				m.set ({_objectInspectedPath:''}); // first set empty string, so resetting triggers reevaluation
				m.set ({_objectInspectedPath:_objectInspectedPath});
			}

			function _highlightObjectInWindow (m,_objectPath) {
				var
					_object = _resolveToObject (m,_objectPath),
					_objectIsWidget = _isWidget (m,_object),
					_objectIsNode = !_objectIsWidget && _Uize_Dom_Basics.isNode (_object)
				;
				if (_objectIsWidget || _objectIsNode) {
					var
						_window = m._window,
						_getCoords = _windowGetCoords (m),
						_coords
					;
					if (_objectIsNode) {
						_coords = _getCoords (_object);
					} else {
						var
							_left = Infinity,
							_right = -Infinity,
							_top = Infinity,
							_bottom = -Infinity,
							_expandCoords = function (_nodeCoords) {
								if (_nodeCoords.area && _nodeCoords.seen) {
									if (_nodeCoords.left < _left) _left = _nodeCoords.left;
									if (_nodeCoords.top < _top) _top = _nodeCoords.top;
									if (_nodeCoords.right > _right) _right = _nodeCoords.right;
									if (_nodeCoords.bottom > _bottom) _bottom = _nodeCoords.bottom;
								}
							},
							_processWidget = function (_widget) {
								/*** iterate through accessed DOM nodes ***/
									var
										_nodeCache = _getWidgetNodeCache (m,_widget),
										_node
									;
									for (var _nodeName in _nodeCache)
										if (_node = _nodeCache [_nodeName]) _expandCoords (_getCoords (_node))
									;

								/*** iterate through child widgets ***/
									var _children = _widget.children;
									for (var _childName in _children)
										_processWidget (_children [_childName])
									;
							}
						;
						_processWidget (_object);

						if (_left != Infinity) {
							var
								_width = _right - _left + 1,
								_height = _bottom - _top + 1
							;
							_coords = {
								left:_left,
								right:_right,
								top:_top,
								bottom:_bottom,
								width:_width,
								height:_height,
								area:_width * _height,
								seen:true
							};
						}
					}
					if (_coords && _coords.area && _coords.seen) {
						var _document = _window.document;
						_document.body.appendChild (m._highlightNode = _document.createElement ('DIV'));
						_Uize_Dom_Basics.setStyle (
							m._highlightNode,
							{
								position:'absolute',
								zIndex:1000000,
								left:_coords.left,
								top:_coords.top,
								width:_coords.width,
								height:_coords.height,
								background:'#ffa200'
							}
						);
						_Uize_Dom_Basics.setOpacity (m._highlightNode,.5);
					}
				}
			}

			function _removeObjectHighlight (m) {
				_Uize_Dom_Basics.remove (m._highlightNode);
				m._highlightNode = null;
			}

			function _rebuildTabContetsHtmlAndWireUi (m,_wrapperWidget,_htmlChunks) {
				function _cleanupAfterObjectLinkPreview (_link) {
					if (!_link.title) {
						_link.title = _link.UizeSite_Delve_title;
						// we'd like to do a cleanup, but we can't do a delete because of stupid IE throwing an error
						// delete _link.UizeSite_Delve_title;
						_showInfoTooltip (m,false);
						_removeObjectHighlight (m);
					}
				}
				_wrapperWidget.unwireUi ();
				_wrapperWidget.setNodeInnerHtml ('',_htmlChunks.join (''));
				_wrapperWidget.setNodeProperties ('',{scrollTop:0});
				_wrapperWidget.wireUi ();
				_wrapperWidget.wireNode (
					_Uize_Dom_Basics.find ({
						root:_wrapperWidget.getNode (),
						tagName:'a',
						className:'objectLink'
					}),
					{
						mouseover:function () {
							var _title = this.UizeSite_Delve_title = this.title;
							this.title = '';
							_updateInfoTooltip (m,_title);
							_showInfoTooltip (m,true);
							_highlightObjectInWindow (m,_title);
						},
						mouseout:function () {_cleanupAfterObjectLinkPreview (this)},
						click:function () {
							_cleanupAfterObjectLinkPreview (this);
							m.children.objectInspectorTabs.set ({value:'summary'});
							m.set ({_objectInspectedPath:this.title || this.title});
						}
					}
				);
			}

		return _superclass.subclass ({
			alphastructor:function () {
				var m = this;

				/*** Private Instance Properties ***/
					m._summaryLastObject = m._featuresLastObject = _notInitialized;
			},
			omegastructor:function () {
				var m = this;

				/*** add the info tooltip widget ***/
					var _infoTooltip = m.addChild ('infoTooltip',Uize.Widgets.Tooltip.KeysValues.Widget,{built:false});

				/*** add tree list widget ***/
					m.addChild (
						'treeList',
						Uize.Widgets.NavTree.List.Widget,
						{
							tooltip:{
								node:_infoTooltip.nodeId (),
								show:function (_item) {
									_updateInfoTooltip (m,m._lastTreeItemOverObjectPath = _item.objectPath);
									return true;
								}
							},
							built:false
						}
					).wire ({
						'After Show Tooltip':
							function (_event) {_highlightObjectInWindow (m,_event.item.objectPath)},
						'After Hide Tooltip':
							function () {_removeObjectHighlight (m)}
					});

				/*** add object entry widget ***/
					m.addChild ('objectEntry',Uize.Widget.TextInput).wire (
						'Changed.value',
						function (_event) {
							m.set ({_objectInspectedPath:_event.newValue});
							_updateDocumentationUrl (m);
						}
					);

				/*** add object inspector tabs widget ***/
					m.addChild (
						'objectInspectorTabs',
						Uize.Widget.Options.Tabbed,
						{
							bodyClassActive:'tabBodyActive',
							bodyClassInactive:'tabBodyInactive',
							value:'summary',
							values:['summary','state','features','documentation','eventsLog']
						}
					).wire ('Changed.value',function () {_updateUiVariousTabs.call (m)});

				/*** add summary wrapper widget (for wiring/unwiring objectLink tooltips) ***/
					m.addChild ('objectInspectorSummary',Uize.Widget);

				/*** add state wrapper widget (for wiring/unwiring objectLink tooltips) ***/
					m.addChild ('objectInspectorState',Uize.Widget);

				/*** add features wrapper widget (and features table sorter widget) ***/
					m.addChild ('objectInspectorFeatures',Uize.Widget)
						.addChild (
							'table',
							Uize.Widget.TableSort,
							{
								headingOverClass:'headingOver',
								headingLitClass:'headingLit',
								rowOverClass:'rowOver',
								cellTooltips:true
							}
						)
					;

				/*** add events log widget ***/
					m.addChild (
						'objectInspectorEventsLog',
						Uize.Widgets.Log.InstanceEvents.Widget,
						{built:false,extraClasses:'objectInspectorEventsLog'}
					);

				/*** initialization ***/
					_updateTreeListItems.call (m);
					_updateObjectEntry.call (m);
					_updateEventsLog.call (m);
			},

			instanceMethods:{
				updateUi:function () {
					var m = this;
					if (m.isWired) {
						_updateUiWindowInspected.call (m);
						_updateUiTreeListDropdown.call (m);
						_updateUiVariousTabs.call (m);
						_superclass.doMy (m,'updateUi');
					}
				},

				wireUi:function () {
					var m = this;
					if (!m.isWired) {
						/*** make sure to clean up when reloading ***/
							m.wireNode (
								window,
								'unload',
								function () {
									_removeObjectHighlight (m);
									m.set ({objectInspectedPath:''});
									/* NOTE:
										Setting objectInspectedPath to an empty string on unload ensures that the events log widget is set to no longer watch anything, which results in it unwiring any currently wired event handlers. If the event handlers were allowed to remain wired in the page being inspected across reload of DELVE, then execution of the handlers later would cause JavaScript errors as a result of the handler function references becoming invalid from the reload.
									*/
								}
							);

						/*** wire link for refreshing tree list and object inspector ***/
							m.wireNode ('refresh','click',function () {_refresh (m)});

						/*** wire link for getting widget from DOM node ID ***/
							m.wireNode (
								'getWidgetFromNodeId',
								'click',
								function () {
									var _nodeId = prompt ('Enter a DOM node id...','');
									if (_nodeId) {
										var _widget = _getWidgetFromNodeId (m,_nodeId);
										_widget
											? m.set ({_objectInspectedPath:_getWidgetPath (m,_widget)})
											: alert ('The DOM node with the ID "' + _nodeId + '" does not appear belong to a widget.')
										;
									}
								}
							);

						/*** wire help link ***/
							m.wireNode (
								'help',
								'click',
								function () {
									m.children.objectInspectorTabs.set ({value:'documentation'});
									m.set ({_objectInspectedPath:''});
								}
							);

						/*** wire close link ***/
							m.wireNode ('close','click',function () {top.close ()});

						/*** populate and wire up tree list dropdown ***/
							var _treeListDropdown = m.getNode ('treeListDropdown');
							if (_treeListDropdown) {
								var _treeListDropdownOptions = _treeListDropdown.options;
								for (var _treeListQueryName in _treeListQueries)
									_treeListDropdownOptions [_treeListDropdownOptions.length] = new Option (
										_treeListQueries [_treeListQueryName]._title,
										_treeListQueryName
									)
								;
							}
							m.wireNode (
								_treeListDropdown,
								'onchange',
								function () {m.set ({treeListQuery:m.getNodeValue (_treeListDropdown)})}
							);

						/*** wire up links for expanding tree list ***/
							m.wireNode (
								'expandTreeListOneLevel',
								'click',
								function () {m.children.treeList.setExpandedDepth (1)}
							);
							m.wireNode (
								'expandTreeListTwoLevels',
								'click',
								function () {m.children.treeList.setExpandedDepth (2)}
							);
							m.wireNode (
								'expandTreeListThreeLevels',
								'click',
								function () {m.children.treeList.setExpandedDepth (3)}
							);
							m.wireNode (
								'expandTreeListAll',
								'click',
								function () {m.children.treeList.setExpandedDepth (Infinity)}
							);

						/*** wire up link for getting items in the tree list as a report ***/
							m.wireNode (
								'getTreeListItemsAsReport',
								'click',
								function () {
									var
										_reportTitle = _treeListQueries [m._treeListQuery]._title,
										_reportLines = []
									;
									m.children.treeList.traverseTree ({
										itemHandler:function (_item,_itemSpecifier,_depth) {
											_reportLines.push (Uize.Str.Repeat.repeat ('\t',_depth) + _item.title);
										}
									});
									_showReport (
										m,
										_reportTitle,
										'REPORT FOR: ' + m._window.location.href + '\n' +
										_reportDivider + '\n' +
										'REPORT TYPE: ' + _reportTitle + ' (' + _reportLines.length + ' items)\n' +
										_reportDivider + '\n' +
										_reportLines.join ('\n')
									);
								}
							);

						/*** wire up link for getting a summary of all available queries as a report ***/
							m.wireNode (
								'getAllQueriesSummary',
								'click',
								function () {
									var _querySummaries = [];
									for (var _treeListQueryName in _treeListQueries) {
										var
											_treeListQuery = _treeListQueries [_treeListQueryName],
											_itemsGenerator = _treeListQuery._itemsGenerator,
											_countItems = function (_items) {
												if (!_items) return 0;
												var _totalItems = _items.length;
												for (var _itemNo = _totalItems; --_itemNo > -1;)
													_totalItems += _countItems (_items [_itemNo].items)
												;
												return _totalItems;
											}
										;
										_querySummaries.push (
											_treeListQuery._title +
											(
												_itemsGenerator
													? (' -- ' + _countItems (_itemsGenerator.call (m)) + ' items')
													: ''
											)
										);
									}
									_showReport (
										m,
										'Summary of all available queries',
										'SUMMARY OF ALL AVAILABLE QUERIES FOR: ' + m._window.location.href + '\n' +
										_reportDivider + '\n' +
										_querySummaries.join ('\n')
									);
								}
							);

						_superclass.doMy (m,'wireUi');

						m.set ({_objectInspectedPath:_getPageWidgetName (m)});
					}
				},

				treeItemClicked:function () {
					this.set ({_objectInspectedPath:this._lastTreeItemOverObjectPath});
				}
			},

			stateProperties:{
				_baseUrl:{
					name:'baseUrl',
					value:''
					/* NOTE:
						This state property is needed for IE, because even though the base tag is in the DELVE page and IE resolves relative stylesheet URLs just fine, the base tag is apparently not good enough for IE when it comes to changing the documentation IFRAME's URL by setting its src.
					*/
				},
				_documentationUrl:{
					onChange:_updateUiDocumentation
				},
				_objectInspected:{
					name:'objectInspected',
					onChange:[
						_updateUiVariousTabs,
						_updateEventsLog
					]
				},
				_objectInspectedPath:{
					name:'objectInspectedPath',
					conformer:function (_value) {
						return (
							!_resolveToObject (this,_value) &&
							this._window && this._window.document.getElementById (_value)
								? 'document.getElementById (\'' + _value + '\')'
								: _value
						);
					},
					onChange:[
						function () {this.set ({_objectInspected:_resolveToObject (this,this._objectInspectedPath)})},
						_updateObjectEntry
					],
					value:''
				},
				_treeListQuery:{
					name:'treeListQuery',
					onChange:[
						_updateTreeListItems,
						_updateUiTreeListDropdown
					],
					value:'widgetsOnPageTree'
				},
				_window:{
					name:'window',
					onChange:[
						function () {this._widgetNodeCachePropertyName = _undefined},
						_updateTreeListItems,
						_updateUiWindowInspected
					]
				}
			}
		});
	}
});

