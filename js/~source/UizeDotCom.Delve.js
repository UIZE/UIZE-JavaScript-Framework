/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeDotCom.Delve
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2012 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*ScruncherSettings Mappings="=d" LineCompacting="TRUE"*/

/*?
	Introduction
		document...

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'UizeDotCom.Delve',
	required:[
		'UizeDotCom.ModulesTree',
		'Uize.Widget.Tree.List',
		'Uize.Widget.TextInput',
		'Uize.Widget.Options.Tabbed',
		'Uize.Widget.Log.InstanceEvents',
		'Uize.Widget.TableSort',
		'Uize.Xml',
		'Uize.Util.Oop',
		'Uize.Node',
		'Uize.String',
		'Uize.Data.PathsTree',
		'Uize.Array.Sort',
		'Uize.Json',
		'Uize.Templates.HashTable',
		'Uize.Tooltip'
	],
	superclass:'Uize.Widget.Page',
	builder:function (_superclass) {
		/*** Variables for Scruncher Optimization ***/
			var _undefined;

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
					Uize.Data.PathsTree.toList (UizeDotCom.ModulesTree (),'.'),
					1,
					true
				),
				_javaScriptBuiltInObjectsLookup = Uize.lookup (
					['Array','Boolean','Function','Number','Object','RegExp','String','Window','XMLHttpRequest'],
					1,
					true
				),
				_objectNotValidOrNotLoadedMessage = '-- object is undefined, not valid, or is not loaded on page --',
				_reportDivider = '------------------------------------------------------------------------------',
				_treeListDividerQuery = {_title:'- - - - - - - - - - - - - - - - - - - - - - - - - - - -'},
				_treeListQueries = {
					/*** widget instance queries ***/
						widgetsOnPageTree:{
							_title:'All widgets on the page, as a tree',
							_itemsGenerator:function () {
								var
									_this = this,
									_items = [],
									_pageWidget = _this._getPageWidget ()
								;
								if (_pageWidget) {
									function _widgetToItem (_widget,_level) {
										var
											_item = {
												title:_this._getWidgetName (_widget),
												link:_treeItemLink,
												expanded:!_level,
												objectPath:_this._getWidgetPath (_widget)
											},
											_itemItems = []
										;
										_level++;
										for (
											var
												_childNo = -1,
												_children = _widget.children,
												_childNames = Uize.keys (_children).sort (),
												_childNamesLength = _childNames.length
											;
											++_childNo < _childNamesLength;
										)
											_itemItems.push (_widgetToItem (_children [_childNames [_childNo]],_level))
										;
										if (_itemItems.length)
											_item.items = _itemItems
										;
										return _item;
									}
									_items [0] = _widgetToItem (_pageWidget,0);
								}
								return _items;
							}
						},
						widgetsOnPageList:{
							_title:'All widgets on the page',
							_itemsGenerator:function () {return this._getMatchingWidgetsTreeListItems ()}
						},
						widgetsOnPageGroupedByClass:{
							_title:'All widgets on the page, grouped by class',
							_itemsGenerator:function () {
								var
									_this = this,
									_instancesPerWidgetClassMap = _this._getInstancesPerWidgetClassMap (),
									_widgetClasses = Uize.keys (_instancesPerWidgetClassMap)
								;

								/*** sort widget classes, from those with most instance to those with least instances ***/
									Uize.Array.Sort.sortBy (
										_widgetClasses,
										function (_widgetClass) {
											return (
												((10000 - _instancesPerWidgetClassMap [_widgetClass].length) + '').slice (1) +
												_widgetClass
											);
										}
									);

								/*** generate items ***/
									var _items = [];
									for (
										var
											_widgetClassNo = -1,
											_widgetClassesLength = _widgetClasses.length,
											_widgetClass,
											_widgetClassWidgets,
											_widgetClassWidgetsLength
										;
										++_widgetClassNo < _widgetClassesLength;
									) {
										if (
											_widgetClassWidgetsLength =
												(
													_widgetClassWidgets =
														_instancesPerWidgetClassMap [_widgetClass = _widgetClasses [_widgetClassNo]]
												).length
										)
											_items.push ({
												title:_widgetClass + ' (' + _widgetClassWidgetsLength + ')',
												link:_treeItemLink,
												expanded:false,
												objectPath:_widgetClass,
												items:Uize.map (
													_widgetClassWidgets,
													function (_widgetClassWidget) {
														var _widgetPath = _this._getWidgetPath (_widgetClassWidget);
														return {
															title:_widgetPath,
															link:_treeItemLink,
															objectPath:_widgetPath
														};
													}
												)
											})
										;
									}

								return _items;
							}
						},
						widgetsDisabled:{
							_title:'Widgets that are in the disabled state',
							_itemsGenerator:function () {
								return this._getMatchingWidgetsTreeListItems (
									function (_widget) {return !_widget.get ('enabledInherited')}
								);
							}
						},
						widgetsNotWired:{
							_title:'Widgets that are not wired',
							_itemsGenerator:function () {
								return this._getMatchingWidgetsTreeListItems (function (_widget) {return !_widget.isWired});
							}
						},
						wiredWidgetsMissingSomeNodeDOM:{
							_title:'Wired widgets that are missing some DOM nodes',
							_itemsGenerator:function () {
								var _this = this;
								return _this._getMatchingWidgetsTreeListItems (
									function (_widget) {
										var _result = false;
										if (_widget.isWired) {
											var _nodeCache = _this._getWidgetNodeCache (_widget);
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
								var _this = this;
								return _this._getMatchingWidgetsTreeListItems (
									function (_widget) {
										var _result = false;
										if (_widget.isWired) {
											var _nodeCache = _this._getWidgetNodeCache (_widget);
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
								return this._getMatchingWidgetsTreeListItems (
									function (_widget) {return !Uize.isEmpty (_widget.get ('localized'))}
								);
							}
						},
						widgetsWithRemappedNodes:{
							_title:'Widgets that have some remapped DOM nodes',
							_itemsGenerator:function () {
								return this._getMatchingWidgetsTreeListItems (
									function (_widget) {return !Uize.isEmpty (_widget.get ('nodeMap'))}
								);
							}
						},
						widgetsWithValueInterface:{
							_title:'Widgets that implement the value interface',
							_itemsGenerator:function () {
								return this._getMatchingWidgetsTreeListItems (
									function (_widget) {return 'value' in _widget.get ()}
								);
							}
						},

					divider1:_treeListDividerQuery,

					/*** module queries ***/
						builtModulesTree:{
							_title:'All built modules, as a tree',
							_itemsGenerator:function () {
								var _this = this;
								function _itemsFromModulesTree (_namespace,_modulesTree,_level) {
									if (_modulesTree) {
										var
											_items = [],
											_moduleName
										;
										for (var _property in _modulesTree)
											_items.push ({
												title:_moduleName = _namespace + (_namespace && '.') + _property,
												link:_treeItemLink,
												expanded:!_level,
												objectPath:_moduleName,
												items:_itemsFromModulesTree (_moduleName,_modulesTree [_property],_level + 1)
											})
										;
										return _items;
									}
								}
								return _itemsFromModulesTree (
									'',
									Uize.Data.PathsTree.fromList (_this._getBuiltModules (),'.'),
									0
								);
							}
						},
						builtModulesList:{
							_title:'All built modules (listed in build order)',
							_itemsGenerator:function () {return this._getMatchingModulesTreeListItems ()}
						},
						widgetClasses:{
							_title:'All widgets classes',
							_itemsGenerator:function () {
								return this._getWidgetClassesTreeListItems ();
							}
						},
						widgetClassesInstancesCreated:{
							_title:'Widget classes with instances created',
							_itemsGenerator:function () {
								return this._getWidgetClassesTreeListItems (true);
							}
						},
						widgetClassesNoInstancesCreated:{
							_title:'Widget classes with no instances created',
							_itemsGenerator:function () {
								return this._getWidgetClassesTreeListItems (false);
							}
						},
						nonWidgetClasses:{
							_title:'All non-widget built modules',
							_itemsGenerator:function () {
								var _this = this;
								return _this._getMatchingModulesTreeListItems (
									function (_moduleName) {return !_this._isWidgetClass (_moduleName)}
								);
							}
						},
						uizeModules:{
							_title:'All UIZE built modules',
							_itemsGenerator:function () {return this._getMatchingModulesTreeListItems (_isUizeModule)}
						},
						nonUizeModules:{
							_title:'All non-UIZE built modules',
							_itemsGenerator:function () {
								return this._getMatchingModulesTreeListItems (
									function (_moduleName) {return !_isUizeModule (_moduleName)}
								);
							}
						},

					divider2:_treeListDividerQuery,

					/*** DOM node queries ***/
						allWidgetDomNodes:{
							_title:'All accessed widget DOM nodes',
							_itemsGenerator:function () {
								return this._getMatchingWidgetDomNodesTreeListItems ();
							}
						},
						allPresentWidgetDomNodes:{
							_title:'All present accessed widget DOM nodes',
							_itemsGenerator:function () {
								return this._getMatchingWidgetDomNodesTreeListItems (function (_node) {return _node});
							}
						},
						allMissingWidgetDomNodes:{
							_title:'All missing accessed widget DOM nodes',
							_itemsGenerator:function () {
								return this._getMatchingWidgetDomNodesTreeListItems (function (_node) {return !_node});
							}
						},
						unaccessedWidgetDomNodes:{
							_title:'All unaccessed widget DOM nodes',
							_itemsGenerator:function () {return this._getUnaccessedDomNodesWithIdsTreeListItems (true)}
						},
						domNodesWithIdsNotBelongingToWidgets:{
							_title:'DOM nodes with IDs not belonging to widgets',
							_itemsGenerator:function () {return this._getUnaccessedDomNodesWithIdsTreeListItems (false)}
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
						' title="' + Uize.Xml.toAttributeValue (_objectPath || _linkText) + '"' +
					'>' +
						(
							_linkText.indexOf (_childrenDelimiter) > -1
								? Uize.String.hugJoin (
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
				return Uize.String.startsWith (_moduleName,'Uize');
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

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					function () {
						var _this = this;

						/*** Private Instance Properties ***/
							_this._summaryLastObject = _this._featuresLastObject = _notInitialized;
					},
					function () {
						var _this = this;

						/*** add tree list widget ***/
							_this.addChild (
								'treeList',
								Uize.Widget.Tree.List,
								{
									levelClasses:[
										'tree-list-level1',
										'tree-list-level2',
										'tree-list-level3',
										'tree-list-level4'
									],
									iconTheme:'arrows-black',
									tooltip:'infoTooltip',
									tooltipTemplate:function (_item) {
										return _this._getInfoTooltipHtml (_this._lastTreeItemOverObjectPath = _item.objectPath);
									},
									iconBgColor:'',
									built:false
								}
							).wire ({
								'After Show Tooltip':
									function (_event) {_this._highlightObjectInWindow (_event.item.objectPath)},
								'After Hide Tooltip':
									function () {_this._removeObjectHighlight ()}
							});

						/*** add object entry widget ***/
							var _objectEntry = _this.addChild ('objectEntry',Uize.Widget.TextInput);
							_objectEntry.wire (
								'Changed.value',
								function () {
									_this.set ({_objectInspectedPath:_objectEntry + ''});
									_this._updateDocumentationUrl ();
								}
							);

						/*** add object inspector tabs widget ***/
							_this.addChild (
								'objectInspectorTabs',
								Uize.Widget.Options.Tabbed,
								{
									bodyClassActive:'tabBodyActive',
									bodyClassInactive:'tabBodyInactive',
									value:'summary',
									values:['summary','state','features','documentation','eventsLog']
								}
							).wire ('Changed.value',function () {_this._updateUiVariousaTabs ()});

						/*** add summary wrapper widget (for wiring/unwiring objectLink tooltips) ***/
							_this.addChild ('objectInspectorSummary',Uize.Widget);

						/*** add state wrapper widget (for wiring/unwiring objectLink tooltips) ***/
							_this.addChild ('objectInspectorState',Uize.Widget);

						/*** add features wrapper widget (and features table sorter widget) ***/
							_this.addChild ('objectInspectorFeatures',Uize.Widget)
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
							_this.addChild ('objectInspectorEventsLog',Uize.Widget.Log.InstanceEvents);

						/*** initialization ***/
							_this._updateTreeListItems ();
							_this._updateObjectEntry ();
							_this._updateEventsLog ();
					}
				),
				_classPrototype = _class.prototype
			;

		/*** Private Instance Methods ***/
			_classPrototype._evalInWindow = function (_expression) {
				var _window = this._window;
				if (_window && _expression) {
					try {return _window.eval ('(' + _expression + ')')} catch (_error) {}
				}
			};

			_classPrototype._getInfoTooltipHtml = function (_objectPath) {
				var
					_this = this,
					_object = _this._resolveToObject (_objectPath),
					_whatItIs = _object == _undefined
						? _whatItIs + ''
						: _this._isWidget (_object)
							? 'widget'
							: Uize.Util.Oop.isUizeClass (_object)
								? 'class'
								: Uize.Node.isNode (_object)
									? 'DOM node'
									: _object.constructor == _this._window.Object
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
					_tooltipData ['DOM nodes'] = _this._getWidgetNodesInfo (_object)._summary;
				} else if (_whatItIs == 'class') {
					_tooltipData.superclass =
						Uize.Util.Oop.getClassName (_object.superclass) || 'this is the root class'
					;
					_tooltipData ['inheritance depth'] =
						Uize.Util.Oop.getInheritanceChain (_object).length - 1 || 'this is the root class'
					;
					_tooltipData.subclasses =
						_this._getSubclassesOfClassTreeListItems (_object).length || 'no subclasses on this page'
					;
					if (_this._isWidgetClass (_object))
						_tooltipData ['widget instances'] =
							_this._getMatchingWidgetsFromTree (
								function (_widget) {return _widget.constructor == _object}
							).length || 'no instances of this class'
					;
				} else if (_whatItIs == 'DOM node') {
					_tooltipData.id = _object.id;
					_tooltipData.tag = _object.tagName;

					var _widget = _this._getWidgetFromNodeId (_object.id);
					_tooltipData ['owner widget'] =
						_widget ? _this._getWidgetPath (_widget) : 'not owned by a widget'
					;
					_tooltipData ['owner widget class'] =
						_widget ? Uize.Util.Oop.getClassName (_widget.constructor) : 'not owned by a widget'
					;
				}
				if (Uize.Util.Oop.isUizeClassInstance (_object) && 'value' in _object.get ())
					_tooltipData.value = _object.valueOf ()
				;
				return (
					'<div class="info-tooltip-heading">' + _objectPath + '</div>' +
					Uize.Templates.HashTable.process (_tooltipData)
				);
			};

			_classPrototype._getPageWidget = function () {
				var _window = this._window;
				return _window && (_window.zPage || _window.page);
			};

			_classPrototype._getPageWidgetName = function () {
				var _pageWidget = this._getPageWidget ();
				return _pageWidget && (_pageWidget == this._window.zPage ? 'zPage' : 'page');
			};

			_classPrototype._getWidgetName = function (_widget) {
				return (
					_widget.get ('name') ||
					(_widget == this._getPageWidget () ? this._getPageWidgetName () : '')
				);
			};

			_classPrototype._getBuiltModules = function () {
				var _openerUize = this._window.Uize;
				return (
					(_openerUize.getModulesBuilt && _openerUize.getModulesBuilt ()) ||
					Uize.keys (_openerUize.getModuleByName ('*')) // NOTE: Uize.getModulesBuilt is deprecated */
				);
			};

			_classPrototype._getWidgetPath = function (_widget) {
				var
					_this = this,
					_widgetPath = []
				;
				while (_widget) {
					_widgetPath.unshift (_this._getWidgetName (_widget));
					_widget = _widget.parent
				}
				return _widgetPath.join ('.children.');
			};

			_classPrototype._getWidgetNodeCache = function (_widget) {
				var _this = this;

				/*** discover node cache object name (if not already known) ***/
					/* NOTE:
						The node cache object is not part of the public interface for the Uize.Widget class, so we have to play some tricks in order to find it.
					*/
					if (!_this._widgetNodeCachePropertyName) {
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
								_this._widgetNodeCachePropertyName = _propertyName;
								delete _propertyValue [_crazyNodeName];
								break;
							}
						}
					}

				return _widget [_this._widgetNodeCachePropertyName] || {};
			};

			_classPrototype._getWidgetNodesInfo = function (_widget) {
				var
					_this = this,
					_nodeCache = _this._getWidgetNodeCache (_widget),
					_allNodesMap = Uize.copyInto ({},_nodeCache),
					_idPrefix = _widget.get ('idPrefix'),
					_nodeIdPrefix = _idPrefix + '-',
					_nodeIdPrefixLength = _nodeIdPrefix.length,
					_nodeCacheIdLookup = {},
					_totalPresentAccessedNodes = 0,
					_totalMissingAccessedNodes = 0,
					_totalUnaccessedNodes = 0,
					_node
				;
				for (_nodeName in _nodeCache) {
					if (_node = _nodeCache [_nodeName]) {
						_nodeCacheIdLookup [_node.id] = 1;
						_totalPresentAccessedNodes++;
					} else {
						_totalMissingAccessedNodes++;
					}
				}
				_this._window.Uize.Node.find ({
					id:function (_nodeId) {
						if (
							_nodeId &&
							!(_nodeId in _nodeCacheIdLookup) &&
							(_nodeId == _idPrefix || Uize.String.startsWith (_nodeId,_nodeIdPrefix))
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
			};

			_classPrototype._getWidgetFromNodeId = function (_nodeId) {
				var _this = this;
				if (_nodeId) {
					function _findWidgetWithIdPrefix (_parent) {
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
					}
					var
						_nodeNamePos = _nodeId.indexOf ('-'),
						_idPrefix = _nodeNamePos > -1 ? _nodeId.slice (0,_nodeNamePos) : _nodeId
					;
					return _findWidgetWithIdPrefix (_this._getPageWidget ());
				}
			};

			_classPrototype._resolveToObject = function (_object) {
				return typeof _object == 'string' ? this._evalInWindow (_object) : _object;
			};

			_classPrototype._getMatchingModulesTreeListItems = function (_moduleMatcher) {
				var
					_this = this,
					_items = [],
					_builtModules = _this._getBuiltModules ()
				;
				Uize.forEach (
					_moduleMatcher ? _builtModules.sort () : _builtModules,
					function (_builtModule) {
						_builtModule && (!_moduleMatcher || _moduleMatcher (_builtModule)) &&
							_items.push ({
								title:_builtModule,
								link:_treeItemLink,
								objectPath:_builtModule
							})
						;
					}
				);
				return _items;
			};

			_classPrototype._getSubclassesOfClassTreeListItems = function (_class) {
				var _this = this;
				return _this._getMatchingModulesTreeListItems (
					function (_moduleName) {
						var _module = _this._resolveToObject (_moduleName);
						return _module != _class && Uize.Util.Oop.inheritsFrom (_module,_class);
					}
				);
			};

			_classPrototype._getInstancesPerWidgetClassMap = function () {
				var
					_this = this,
					_instancesPerWidgetClassMap = {}
				;
				_this._getMatchingWidgetsFromTree (
					function (_widget) {
						var _widgetClass = _widget.constructor.moduleName;
						(_instancesPerWidgetClassMap [_widgetClass] || (_instancesPerWidgetClassMap [_widgetClass] = []))
							.push (_widget)
						;
					}
				);
				return _instancesPerWidgetClassMap;
			};

			_classPrototype._getWidgetClassesTreeListItems = function (_instancesCreated) {
				var
					_this = this,
					_instancesPerWidgetClassMap = _this._getInstancesPerWidgetClassMap ()
				;
				return _this._getMatchingModulesTreeListItems (
					function (_moduleName) {
						return (
							(
								_instancesCreated == _undefined ||
								!!(_instancesPerWidgetClassMap [_moduleName] || _sacredEmptyObject).length == _instancesCreated
							) &&
							_this._isWidgetClass (_moduleName)
						);
					}
				);
			};

			_classPrototype._getMatchingWidgetsFromTree = function (_widgetMatcher) {
				var
					_this = this,
					_widgets = []
				;
				function _processWidget (_widget,_widgetPath) {
					_widgetPath += _this._getWidgetName (_widget);
					(!_widgetMatcher || _widgetMatcher (_widget)) && _widgets.push (_widgetPath);
					_widgetPath += '.children.';
					var _children = _widget.children;
					for (var _childName in _children)
						_processWidget (_children [_childName],_widgetPath)
					;
				}
				_processWidget (_this._getPageWidget (),'');
				return _widgets;
			};

			_classPrototype._getMatchingWidgetsTreeListItems = function (_widgetMatcher) {
				var _this = this;
				return Uize.map (
					_this._getMatchingWidgetsFromTree (_widgetMatcher).sort (),
					function (_widget) {
						return {
							title:_objectPath,
							link:_treeItemLink,
							objectPath:_objectPath
						};
					}
				);
			};

			_classPrototype._getMatchingWidgetDomNodesTreeListItems = function (_nodeMatcher) {
				var
					_this = this,
					_items = []
				;
				function _processWidget (_widget) {
					if (_widget) {
						/*** iterate through widget's accessed DOM nodes ***/
							var
								_nodeCache = _this._getWidgetNodeCache (_widget),
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
											(_objectPathPrefix = _this._getWidgetPath (_widget) + '.getNode (\'')
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
				_processWidget (_this._getPageWidget ());
				return _items;
			};

			_classPrototype._getUnaccessedDomNodesWithIdsTreeListItems = function (_widgetOrNotWidget) {
				var
					_this = this,
					_accessedNodesLookup = {},
					_idPrefixMap = {}
				;
				/*** iterate through widget tree, creating lookup of all accessed, non-null DOM nodes, and idPrefix map ***/
					function _processWidget (_widget) {
						if (_widget) {
							_idPrefixMap [_widget.get ('idPrefix')] = 1;

							/*** iterate through widget's accessed DOM nodes ***/
								var
									_nodeCache = _this._getWidgetNodeCache (_widget),
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
					_processWidget (_this._getPageWidget ());

				return Uize.Array.Sort.sortBy (
					Uize.map (
						_this._window.Uize.Node.find ({
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
			};

			_classPrototype._isWidgetClass = function (_class) {
				return Uize.Util.Oop.inheritsFrom (this._resolveToObject (_class),this._window.Uize.Widget);
			};

			_classPrototype._isWidget = function (_object) {
				return Uize.isInstance (_object) && this._isWidgetClass (_object);
			};

			_classPrototype._showReport = function (_title,_report) {
				var
					_window = this.launchPopup ({
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
								'<pre>' + Uize.Xml.toAttributeValue (_report) + '</pre>',
							'</body>',
						'</html>'
					].join ('\n')
				);
				_document.close ();
				_window.focus ();
			};

			_classPrototype._updateUiSummary = function () {
				var
					_this = this,
					_object = _this._objectInspected
				;
				if (
					_this.isWired &&
					_this.children.objectInspectorTabs + '' == 'summary' &&
					_object !== _this._summaryLastObject
				) {
					var
						_objectInspectedPath = _this._objectInspectedPath,
						_htmlChunks = []
					;
					if (_object != _undefined) {
						var
							_objectIsWidget = _this._isWidget (_object),
							_objectIsWidgetClass = !_objectIsWidget && _this._isWidgetClass (_object)
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

						function _addWidgetsSummarySection (_title,_widgets,_contentsDefault) {
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
													_widget = _this._resolveToObject (_widget);
													return (
														'<tr>' +
															'<td>' +
																_getObjectLink (_this._getWidgetPath (_widget)) +
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
						}

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
									_nodesInfo = _this._getWidgetNodesInfo (_object),
									_nodeCache = _nodesInfo._nodeCache,
									_allNodesMap = _nodesInfo._allNodesMap,
									_nodeNames = Uize.keys (_allNodesMap).sort (),
									_getNodeMethodCallPrefix = _this._getWidgetPath (_object) + '.getNode (\''
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
									_localizeMethodCallPrefix = _objectInspectedPath + '.localize ('
								;
								function _getLocalizeMethodCall (_stringName) {
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
								var _widgetNode = _object.get ('container') || _object.getNode ('shell') || _object.getNode ();
								_addTabContentsSection (
									_htmlChunks,
									'HTML',
									'',
									Uize.Xml.toAttributeValue (
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
									).join (' -> '),
									'this is the root class',
									true
								);

							/*** determine subclasses ***/
								var _subclasses = _this._getSubclassesOfClassTreeListItems (_object);
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
													_this._resolveToObject (_item.objectPath).superclass == _object
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
										_this._getMatchingWidgetsFromTree (
											function (_widget) {return _widget.constructor == _object}
										),
										'no widgets of this class instantiated'
									)
								;
						} else if (Uize.Node.isNode (_object)) {
							var _widget = _this._getWidgetFromNodeId (_object.id);
							_addTabContentsSection (
								_htmlChunks,
								'OWNER WIDGET',
								'',
								_widget ? _getObjectLink (_this._getWidgetPath (_widget)) : '',
								'this node does not appear to belong to a widget',
								true
							);
							_addTabContentsSection (_htmlChunks,'ID','',_object.id,'no id specified for this node',true);
							_addTabContentsSection (_htmlChunks,'TAG','',_object.tagName,'',true);
							_addTabContentsSection (
								_htmlChunks,
								'HTML',
								'',
								Uize.Xml.toAttributeValue (_getNodeOuterHtml (_object)),
								'',
								true
							);
						} else if (Uize.Util.Oop.isUizeClass (_object) || Uize.Util.Oop.isUizeClassInstance (_object)) {
							// do nothing, since state is shown in the state tab
						} else if (Uize.isFunction (_object)) {
							_addTabContentsSection (
								_htmlChunks,'CODE','',Uize.Xml.toAttributeValue (_object.toString ()),'',true
							);
						} else {
							_addTabContentsSection (
								_htmlChunks,'TO STRING','',Uize.Xml.toAttributeValue (_object.toString ()),'',true
							);
							_addTabContentsSection (
								_htmlChunks,'JSON SERIALIZATION','',Uize.Xml.toAttributeValue (Uize.Json.to (_object)),'',true
							);
						}
					} else {
						_htmlChunks.push ('<br/>' + _objectNotValidOrNotLoadedMessage);
					}

					_this._rebuildTabContetsHtmlAndWireUi (_this.children.objectInspectorSummary,_htmlChunks);
 					_this._summaryLastObject = _object;
				}
			};

			_classPrototype._updateUiState = function () {
				var
					_this = this,
					_object = _this._objectInspected
				;
				if (
					_this.isWired &&
					_this.children.objectInspectorTabs + '' == 'state' &&
					_object !== _this._stateLastObject
				) {
					var _htmlChunks = [];
					if (Uize.Util.Oop.isUizeClass (_object) || Uize.Util.Oop.isUizeClassInstance (_object)) {
						var
							_objectInspectedPath = _this._objectInspectedPath,
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
										'<td>' + Uize.Xml.toAttributeValue (_propertyValues [_property]) + '</td>',
									'</tr>'
								)
						;
						_propertiesHtmlChunks.push ('</table>');
						_addTabContentsSection (
							_htmlChunks,
							'SET-GET PROPERTIES',
							_propertiesLength + ' properties',
							_propertiesLength
								? _propertiesHtmlChunks.join ('')
								: '<pre>this class has no set-get properties</pre>'
						);
					} else {
						_htmlChunks.push ('<br/>' + '-- object does not support a set-get properties state interface --');
					}

					_this._rebuildTabContetsHtmlAndWireUi (_this.children.objectInspectorState,_htmlChunks);
					_this._stateLastObject = _object;
				}
			};

			_classPrototype._updateUiFeatures = function () {
				var
					_this = this,
					_object = _this._objectInspected
				;
				if (
					_this.isWired &&
					_this.children.objectInspectorTabs + '' == 'features' &&
					_object !== _this._featuresLastObject
				) {
					var _htmlChunks = [];
					if (_object != _undefined) {
						var
							_features = Uize.Util.Oop.getFeatures (_object),
							_featuresLength = _features.length
						;
						if (_featuresLength) {
							var _objectPath = Uize.Util.Oop.getClassName (_object = Uize.Util.Oop.resolveToClass (_object));
							function _getLinkedModuleCell (_object) {
								return (
									'<td class="moduleName">' +
										_getObjectLink (Uize.Util.Oop.getClassName (_object),'',true) +
									'</td>'
								);
							}
							_htmlChunks.push (
								'<table id="' + _this.children.objectInspectorFeatures.children.table.get ('idPrefix') + '" class="data">',
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
												_feature.context == 'Set-get'
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

					_this._rebuildTabContetsHtmlAndWireUi (_this.children.objectInspectorFeatures,_htmlChunks);
					_this._featuresLastObject =  _object;
				}
			};

			_classPrototype._updateUiVariousaTabs = function () {
				var _this = this;
				_this._updateUiSummary ();
				_this._updateUiState ();
				_this._updateUiFeatures ();
				_this._updateUiDocumentation ();
			};

			_classPrototype._updateEventsLog = function () {
				var _objectInspectorEventsLog = this.children.objectInspectorEventsLog;
				_objectInspectorEventsLog &&
					_objectInspectorEventsLog.set ({instance:this._objectInspected})
				;
			};

			for (var _treeItemClickedMethodName in {_treeItemClicked:1});
			var _treeItemLink = 'javascript:page.' + _treeItemClickedMethodName + ' ()';
			_classPrototype._treeItemClicked = function () {
				this.set ({_objectInspectedPath:this._lastTreeItemOverObjectPath});
			};

			_classPrototype._updateTreeListItems = function () {
				var
					_this = this,
					_treeList = _this.children.treeList
				;
				if (_treeList) {
					var _itemsGenerator = _treeListQueries [_this._treeListQuery]._itemsGenerator;
					_treeList.set ({items:_itemsGenerator ? _itemsGenerator.call (_this) : []})
				}
			};

			_classPrototype._updateUiTreeListDropdown = function () {
				var _this = this;
				if (_this.isWired) {
					_this.setNodeValue ('treeListDropdown',_this._treeListQuery);
				}
			};

			_classPrototype._updateObjectEntry = function () {
				var _objectEntry = this.children.objectEntry;
				_objectEntry && _objectEntry.set ({value:this._objectInspectedPath});
			};

			_classPrototype._updateDocumentationUrl = function () {
				var
					_this = this,
					_objectInspected = _this._objectInspected,
					_objectInspectedPath = _this._objectInspectedPath,
					_className = _knownUizeModulesLookup [_objectInspectedPath] && _objectInspectedPath
				;
				if (!_className && _objectInspected != _undefined) {
					_className = Uize.Util.Oop.getClassName (Uize.Util.Oop.resolveToClass (_objectInspected));
					if (!_isUizeModule (_className)) {
						var _class = _this._resolveToObject (_className);
						if (Uize.Util.Oop.isUizeClass (_class))
							while (
								(_className = (_class = _class.superclass).moduleName) &&
								!_isUizeModule (_className)
							)
						;
					}
				}
				_this.set ({
					_documentationUrl:
						_this._baseUrl + '/' +
						(
							(
								_className &&
								(
									_isUizeModule (_className)
										? 'reference/' + _className + '.html'
										: _javaScriptBuiltInObjectsLookup [_className]
											? 'javascript-reference/' + _className + '.html'
											: null
								)
							) || 'explainers/using-the-delve-tool.html'
						)
				});
			};

			_classPrototype._updateUiDocumentation = function () {
				var _this = this;
				if (_this.isWired && _this.children.objectInspectorTabs + '' == 'documentation') {
					var _documentationUrl = _this._documentationUrl;
					if (_documentationUrl != _this._lastDisplayedDocumentationUrl) {
						var _contentWindow = _this.getNode ('documentation').contentWindow;
						if (_contentWindow)
							_contentWindow.location.href = _documentationUrl
						;
						_this._lastDisplayedDocumentationUrl = _documentationUrl;
					}
				}
			};

			_classPrototype._updateUiWindowInspected = function () {
				var _this = this;
				if (_this.isWired) {
					var _window = _this._window;
					_this.setNodeValue (
						'windowInspected',
						_window
							? Uize.String.limitLength (_window.location.href,120)
							: 'no window being inspected'
					);
					_this.setNodeProperties (
						'windowInspected',
						{title:_window ? _window.document.title : ''}
					);
				}
			};

			_classPrototype._refresh = function () {
				var
					_this = this,
					_objectInspectedPath = _this._objectInspectedPath
				;
				_this._updateTreeListItems ();
				_this._updateUiWindowInspected ();
				_this.set ({_objectInspectedPath:''}); // first set empty string, so resetting triggers reevaluation
				_this.set ({_objectInspectedPath:_objectInspectedPath});
			};

			_classPrototype._highlightObjectInWindow = function (_objectPath) {
				var
					_this = this,
					_object = _this._resolveToObject (_objectPath),
					_objectIsWidget = _this._isWidget (_object),
					_objectIsNode = !_objectIsWidget && Uize.Node.isNode (_object)
				;
				if (_objectIsWidget || _objectIsNode) {
					var
						_window = _this._window,
						_getCoords = _window.Uize.Node.getCoords,
						_coords
					;
					if (_objectIsNode) {
						_coords = _getCoords (_object);
					} else {
						var
							_left = Infinity,
							_right = -Infinity,
							_top = Infinity,
							_bottom = -Infinity
						;
						function _expandCoords (_nodeCoords) {
							if (_nodeCoords.area && _nodeCoords.seen) {
								if (_nodeCoords.left < _left) _left = _nodeCoords.left;
								if (_nodeCoords.top < _top) _top = _nodeCoords.top;
								if (_nodeCoords.right > _right) _right = _nodeCoords.right;
								if (_nodeCoords.bottom > _bottom) _bottom = _nodeCoords.bottom;
							}
						}
						function _processWidget (_widget) {
							/*** iterate through accessed DOM nodes ***/
								var
									_nodeCache = _this._getWidgetNodeCache (_widget),
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
						_document = _window.document;
						_document.body.appendChild (_this._highlightNode = _document.createElement ('DIV'));
						Uize.Node.setStyle (
							_this._highlightNode,
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
						Uize.Node.setOpacity (_this._highlightNode,.5);
					}
				}
			};

			_classPrototype._removeObjectHighlight = function () {
				Uize.Node.remove (this._highlightNode);
				this._highlightNode = null;
			};

			_classPrototype._rebuildTabContetsHtmlAndWireUi = function (_wrapperWidget,_htmlChunks) {
				var _this = this;
				function _cleanupAfterObjectLinkPreview (_link) {
					if (!_link.title) {
						_link.title = _link.UizeDotCom_Delve_title;
						// we'd like to do a cleanup, but we can't do a delete because of stupid IE throwing an error
						// delete _link.UizeDotCom_Delve_title;
						Uize.Tooltip.showTooltip ('infoTooltip',false);
						_this._removeObjectHighlight ();
					}
				}
				_wrapperWidget.unwireUi ();
				_wrapperWidget.setNodeInnerHtml ('',_htmlChunks.join (''));
				_wrapperWidget.setNodeProperties ('',{scrollTop:0});
				_wrapperWidget.wireUi ();
				_wrapperWidget.wireNode (
					Uize.Node.find ({
						root:_wrapperWidget.getNode (),
						tagName:'a',
						className:'objectLink'
					}),
					{
						mouseover:function () {
							var _title = this.UizeDotCom_Delve_title = this.title;
							this.title = '';
							Uize.Node.setInnerHtml ('infoTooltip',_this._getInfoTooltipHtml (_title));
							Uize.Tooltip.showTooltip ('infoTooltip',true);
							_this._highlightObjectInWindow (_title);
						},
						mouseout:function () {_cleanupAfterObjectLinkPreview (this)},
						click:function () {
							_cleanupAfterObjectLinkPreview (this);
							_this.children.objectInspectorTabs.set ({value:'summary'});
							_this.set ({_objectInspectedPath:this.title || this.title});
						}
					}
				);
			};

		/*** Public Instance Methods ***/
			_classPrototype.updateUi = function () {
				var _this = this;
				if (_this.isWired) {
					_this._updateUiWindowInspected ();
					_this._updateUiTreeListDropdown ();
					_this._updateUiVariousaTabs ();
					_superclass.prototype.updateUi.call (_this);
				}
			};

			_classPrototype.wireUi = function () {
				var _this = this;
				if (!_this.isWired) {
					/*** make sure to clean up when reloading ***/
						_this.wireNode (
							window,
							'unload',
							function () {
								_this._removeObjectHighlight ();
								_this.set ({objectInspectedPath:''});
								/* NOTE:
									Setting objectInspectedPath to an empty string on unload ensures that the events log widget is set to no longer watch anything, which results in it unwiring any currently wired event handlers. If the event handlers were allowed to remain wired in the page being inspected across reload of DELVE, then execution of the handlers later would cause JavaScript errors as a result of the handler function references becoming invalid from the reload.
								*/
							}
						);

					/*** wire link for refreshing tree list and object inspector ***/
						_this.wireNode ('refresh','click',function () {_this._refresh ()});

					/*** wire link for getting widget from DOM node ID ***/
						_this.wireNode (
							'getWidgetFromNodeId',
							'click',
							function () {
								var _nodeId = prompt ('Enter a DOM node id...','');
								if (_nodeId) {
									var _widget = _this._getWidgetFromNodeId (_nodeId);
									_widget
										? _this.set ({_objectInspectedPath:_this._getWidgetPath (_widget)})
										: alert ('The DOM node with the ID "' + _nodeId + '" does not appear belong to a widget.')
									;
								}
							}
						);

					/*** wire help link ***/
						_this.wireNode (
							'help',
							'click',
							function () {
								_this.children.objectInspectorTabs.set ({value:'documentation'});
								_this.set ({_objectInspectedPath:''});
							}
						);

					/*** wire close link ***/
						_this.wireNode ('close','click',function () {top.close ()});

					/*** populate and wire up tree list dropdown ***/
						var _treeListDropdown = _this.getNode ('treeListDropdown');
						if (_treeListDropdown) {
							var _treeListDropdownOptions = _treeListDropdown.options;
							for (var _treeListQueryName in _treeListQueries)
								_treeListDropdownOptions [_treeListDropdownOptions.length] = new Option (
									_treeListQueries [_treeListQueryName]._title,
									_treeListQueryName
								)
							;
						}
						_this.wireNode (
							_treeListDropdown,
							'onchange',
							function () {_this.set ({treeListQuery:_this.getNodeValue (_treeListDropdown)})}
						);

					/*** wire up links for expanding tree list ***/
						_this.wireNode (
							'expandTreeListOneLevel',
							'click',
							function () {_this.children.treeList.setExpandedDepth (1)}
						);
						_this.wireNode (
							'expandTreeListTwoLevels',
							'click',
							function () {_this.children.treeList.setExpandedDepth (2)}
						);
						_this.wireNode (
							'expandTreeListThreeLevels',
							'click',
							function () {_this.children.treeList.setExpandedDepth (3)}
						);
						_this.wireNode (
							'expandTreeListAll',
							'click',
							function () {_this.children.treeList.setExpandedDepth (Infinity)}
						);

					/*** wire up link for getting items in the tree list as a report ***/
						_this.wireNode (
							'getTreeListItemsAsReport',
							'click',
							function () {
								var
									_reportTitle = _treeListQueries [_this._treeListQuery]._title,
									_reportLines = []
								;
								_this.children.treeList.traverseTree ({
									itemHandler:function (_item,_itemSpecifier,_depth) {
										_reportLines.push (Uize.String.repeat ('\t',_depth) + _item.title);
									}
								});
								_this._showReport (
									_reportTitle,
									'REPORT FOR: ' + _this._window.location.href + '\n' +
									_reportDivider + '\n' +
									'REPORT TYPE: ' + _reportTitle + ' (' + _reportLines.length + ' items)\n' +
									_reportDivider + '\n' +
									_reportLines.join ('\n')
								);
							}
						);

					/*** wire up link for getting a summary of all available queries as a report ***/
						_this.wireNode (
							'getAllQueriesSummary',
							'click',
							function () {
								var _querySummaries = [];
								for (var _treeListQueryName in _treeListQueries) {
									var
										_treeListQuery = _treeListQueries [_treeListQueryName],
										_itemsGenerator = _treeListQuery._itemsGenerator
									;
									function _countItems (_items) {
										if (!_items) return 0;
										var _totalItems = _items.length;
										for (var _itemNo = _totalItems; --_itemNo > -1;)
											_totalItems += _countItems (_items [_itemNo].items)
										;
										return _totalItems;
									}
									_querySummaries.push (
										_treeListQuery._title +
										(
											_itemsGenerator
												? (' -- ' + _countItems (_itemsGenerator.call (_this)) + ' items')
												: ''
										)
									);
								}
								_this._showReport (
									'Summary of all available queries',
									'SUMMARY OF ALL AVAILABLE QUERIES FOR: ' + _this._window.location.href + '\n' +
									_reportDivider + '\n' +
									_querySummaries.join ('\n')
								);
							}
						);

					_superclass.prototype.wireUi.call (_this);

					_this.set ({_objectInspectedPath:_this._getPageWidgetName ()});
				}
			};

		/*** Register Properties ***/
			_class.registerProperties ({
				_baseUrl:{
					name:'baseUrl',
					value:''
					/* NOTE:
						This set-get property is needed for IE, because even though the base tag is in the DELVE page and IE resolves relative stylesheet URLs just fine, the base tag is apparently not good enough for IE when it comes to changing the documentation IFRAME's URL by setting its src.
					*/
				},
				_documentationUrl:{
					onChange:_classPrototype._updateUiDocumentation
				},
				_objectInspected:{
					name:'objectInspected',
					onChange:[
						_classPrototype._updateUiVariousaTabs,
						_classPrototype._updateEventsLog
					]
				},
				_objectInspectedPath:{
					name:'objectInspectedPath',
					conformer:function (_value) {
						return (
							!this._resolveToObject (_value) &&
							this._window && this._window.document.getElementById (_value)
								? 'document.getElementById (\'' + _value + '\')'
								: _value
						);
					},
					onChange:[
						function () {this.set ({_objectInspected:this._resolveToObject (this._objectInspectedPath)})},
						_classPrototype._updateObjectEntry
					],
					value:''
				},
				_treeListQuery:{
					name:'treeListQuery',
					onChange:[
						_classPrototype._updateTreeListItems,
						_classPrototype._updateUiTreeListDropdown
					],
					value:'widgetsOnPageTree'
				},
				_window:{
					name:'window',
					onChange:[
						function () {this._widgetNodeCachePropertyName = _undefined},
						_classPrototype._updateTreeListItems,
						_classPrototype._updateUiWindowInspected
					]
				}
			});

		return _class;
	}
});

