/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Collection.Dynamic.xDialogEditable Class Extension
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Extension
	importance: 1
	codeCompleteness: 100
	testCompleteness: 0
	docCompleteness: 0
*/

/*?
	Introduction
		The =Uize.Widget.Collection.Dynamic.xDialogEditable= module extends the =Uize.Widget.Collection.Dynamic= base class by adding editing capability for dynamic collections.

		*DEVELOPERS:* `Lisa Nakano`
*/

Uize.module ({
	name:'Uize.Widget.Collection.Dynamic.xDialogEditable',
	required:[
		'Uize.Url',
		'Uize.Json'
	],
	builder:function (_class) {
		/*** Variables for Scruncher Optimization ***/
			var
				_true = true,
				_false = false,
				_Uize = Uize,

				_classPrototype = _class.prototype
			;

		/*** implement hook methods ***/
			_classPrototype.afterWireUi = function () {
				var _this = this;
				if (_this._isEditable) {
					// wire add item
					_this.wire('Item.add', function (_event) {
						_event.bubble = _false;
						_this.addItemHandler(_event.properties);
					});

					// wire delete item
					_this.wire('Item.delete', function (_event) {
						_event.bubble = _false;
						_this.deleteItemHandler(_event.source);
					});

					// wire edit item
					_this.wire('Item.edit', function (_event) {
						_event.bubble = _false;
						_this.editItemHandler(_event.source, _event.properties);
					});

					_this._uniqueIdentifierId = _this.get('totalItems');

					// By default, the items container for collections is this.getNode('items'). Override it.
					_this.set({ itemWidgetProperties: _Uize.copyInto(_this.get('itemWidgetProperties'), { container: _this.getContainerNode() }) });
				}
			};

			/* may be overriden by subclasses */
			_classPrototype.getCollectionItemControlName = function (/*_itemWidgetProperties*/) {
				return this.get('collectionItemControlName');
			};

		/* default is to override the default items container, may be 'undone' in subclasses */
			_classPrototype.getContainerNode = function () {
				return this.getNode('itemsNode');
			};

		/*** Public Instance Methods ***/

			_classPrototype.addNewItem = function (_properties, _callback) {
				var _this = this;
				if (_this.isWired) {
					_properties = _properties || {};
					var
						_itemWidgetProperties = _this.get('itemWidgetProperties'),
						_itemWidgetName = _this.get('itemWidgetNamePrefix') + _this._uniqueIdentifierId++,
						_collectionItemControlName = _this.getCollectionItemControlName(_properties)
					;

					if (_this.getNode('itemTemplate')) {
						_this.add([{ properties: _Uize.copyInto(_properties, { id: _itemWidgetName }), selected: _true }]);
						_callback && _callback(_this.children[_itemWidgetName]);
						_this.fire({ name: 'Item.added', bubble: _true });

					}
					else if (_collectionItemControlName) {
						var _serializedProperties = _this.serializeItemProperties(_properties);
						_this.callInherited('loadHtmlIntoNode')(
							{
								node: _itemWidgetProperties.container,
								injectMode: _itemWidgetProperties.insertionMode
							},
							_Uize.copyInto(
								{
									cp: _collectionItemControlName,
									idPrefix: _this.get('idPrefix') + '_' + _itemWidgetName,
									rootCssClassName: _this.get('itemRootNodeCssClass')
								},
								_serializedProperties // doesn't handle objects w/ any depth...
							),
							{
								cache: 'memory',
								callback: function () {
									_callback && _callback(_this.children[_itemWidgetName]);
									_this.fire({ name: 'Item.added', bubble: _true });
								}
							}
						);
					}
				}
			};

			_classPrototype.adaptFormValuesToItemProperties = function (_formValues) { return _formValues };
			_classPrototype.adaptItemPropertiesToFormValues = function (_itemProperties) { return _itemProperties };

			_classPrototype.mergeItemProperties = function (_oldItemProperties, _newItemProperties) {
				return _Uize.copy(_oldItemProperties, _newItemProperties);
			};

			_classPrototype.serializeItemProperties = function (_itemProperties) {
				var
					_serializedProperties = _Uize.clone(_itemProperties),
					_keys = _Uize.keys(_serializedProperties)
				;
				for (var _keyIndex in _keys) {
					var
						_propertyName = _keys[_keyIndex],
						_propertyValue = _serializedProperties[_propertyName]
					;

					if (_Uize.isPlainObject (_propertyValue)) {
						var
							_isPropertyValueFlat = _true,
							_keys2 = _Uize.keys(_propertyValue)
						;
						for (var _keyIndex2 in _keys2) {
							_Uize.isPlainObject (_propertyValue[_keys2[_keyIndex2]]) && (_isPropertyValueFlat = _false);
						}

						if (_isPropertyValueFlat)
							_serializedProperties[_propertyName] = _Uize.Url.toParams(_propertyValue);
						else
							_serializedProperties[_propertyName] = _Uize.Json.to(_propertyValue);
					}
				}
				return _serializedProperties;
			};

			_classPrototype.launchFormDialog = function (_dialogParams, _itemWidget) {
				var _this = this;
				if (_this.isWired) {

					var
						_formDialogJsClass = _this.get('formDialogJsClass'),
						_itemProperties = (_itemWidget && _itemWidget.get('properties')) || {}
					;

					_formDialogJsClass &&
						_this.callInherited('useDialog')({
							component: {
								name: _formDialogJsClass,
								params: _Uize.copy(_dialogParams, _this.adaptItemPropertiesToFormValues(_itemProperties), _this._formDialogParams)
							},
							widgetProperties: { name: 'itemFormDialog' },
							submitHandler: function (_newProperties) {
								if (_itemWidget) {
									_itemWidget.set({properties:_this.mergeItemProperties(_itemProperties, _this.adaptFormValuesToItemProperties(_newProperties))});
									_this.fire({name:'Item.edited', bubble:_true});
								}
								else {
									_this.addNewItem(_this.adaptFormValuesToItemProperties(_newProperties));
								}
							}
						})
					;
				}
			};

			_classPrototype.deleteItemHandler = function (_itemWidget) {
				var _this = this;
				if (_this.isWired && _itemWidget) {
					_this.remove([_itemWidget], _true);
					_this.fire({name:'Item.deleted', bubble:_true});
				}
			};

			_classPrototype.editItemHandler = function (_itemWidget, _dialogParams) {
				var _this = this;
				_this.isWired && _itemWidget &&
					_this.launchFormDialog(_dialogParams, _itemWidget)
				;
			};

			_classPrototype.addItemHandler = function (_dialogParams) {
				var _this = this;
				_this.isWired &&
					_this.launchFormDialog(_dialogParams)
				;
			};

		/*** State Properties ***/
			_class.stateProperties ({
				_collectionItemControlName:'collectionItemControlName',
				_formDialogJsClass:'formDialogJsClass',
				_formDialogParams:{
					name:'formDialogParams',
					value:{}
				},
				_isEditable:{
					name:'isEditable',
					value:_false
				},
				_itemsContainerNode:{
					name:'itemsNode',
					value:'items'
				}
			});
	}
});

