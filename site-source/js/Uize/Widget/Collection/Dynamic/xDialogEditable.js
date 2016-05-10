/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Collection.Dynamic.xDialogEditable Class Extension
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013-2016 UIZE
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

		*DEVELOPERS:* `Lisa Nakano`, original code contributed by `Zazzle Inc.`
*/

Uize.module ({
	name:'Uize.Widget.Collection.Dynamic.xDialogEditable',
	required:[
		'Uize.Url',
		'Uize.Json'
	],
	builder:function (_class) {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_true = true,
				_false = false,
				_Uize = Uize
		;

		_class.declare ({
			instanceMethods:{
				addNewItem:function (_properties, _callback) {
					var m = this;
					if (m.isWired) {
						_properties = _properties || {};
						var
							_itemWidgetProperties = m.get('itemWidgetProperties'),
							_itemWidgetName = m.get('itemWidgetNamePrefix') + m.uniqueIdentifierId++,
							_collectionItemControlName = m.getCollectionItemControlName(_properties)
						;

						if (m.getNode('itemTemplate')) {
							m.add([{ properties: _Uize.copyInto(_properties, { id: _itemWidgetName }), selected: _true }]);
							_callback && _callback(m.children[_itemWidgetName]);
							m.fire({ name: 'Item.added', bubble: _true });

						}
						else if (_collectionItemControlName) {
							var _serializedProperties = m.serializeItemProperties(_properties);
							m.callInherited('loadHtmlIntoNode')(
								{
									node: _itemWidgetProperties.container,
									injectMode: _itemWidgetProperties.insertionMode
								},
								_Uize.copyInto(
									{
										cp: _collectionItemControlName,
										idPrefix: m.get('idPrefix') + '_' + _itemWidgetName,
										rootCssClassName: m.get('itemRootNodeCssClass')
									},
									_serializedProperties // doesn't handle objects w/ any depth...
								),
								{
									cache: 'memory',
									callback: function () {
										_callback && _callback(m.children[_itemWidgetName]);
										m.fire({ name: 'Item.added', bubble: _true });
									}
								}
							);
						}
					}
				},
				editItem: function (_itemWidget, _newProperties) {
					var
						m = this,
						_itemProperties = (_itemWidget && _itemWidget.get('properties')) || {}
					;
					_itemWidget && _itemWidget.set({ properties: m.mergeItemProperties(_itemProperties, _newProperties) });
					m.fire({ name: 'Item.edited', bubble: _true });
				},

				adaptFormValuesToItemProperties:function (_formValues) { return _formValues },
				adaptItemPropertiesToFormValues:function (_itemProperties) { return _itemProperties },

				mergeItemProperties:function (_oldItemProperties, _newItemProperties) {
					return _Uize.copy(_oldItemProperties, _newItemProperties);
				},

				serializeItemProperties:function (_itemProperties) {
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
				},
				formSubmitHandler: function (_itemWidget, _formValues) {
					var
						m = this,
						_newProperties = m.adaptFormValuesToItemProperties(_formValues)
					;
					if (_itemWidget) {
						m.editItem(_itemWidget, _newProperties);
					}
					else {
						m.addNewItem(_newProperties);
					}
				},
				launchFormDialog:function (_dialogParams, _itemWidget) {
					var m = this;
					if (m.isWired) {

						var
							_formDialogJsClass = m.get('formDialogJsClass'),
							_itemProperties = (_itemWidget && _itemWidget.get('properties')) || {}
						;

						_formDialogJsClass &&
							m.callInherited('useDialog')({
								component: {
									name: _formDialogJsClass,
									params: _Uize.copy(_dialogParams, m.adaptItemPropertiesToFormValues(_itemProperties), m.formDialogParams)
								},
								widgetProperties: { name: 'itemFormDialog' },
								submitHandler: function (_formValues) {
									m.formSubmitHandler(_itemWidget, _formValues);
								}
							})
						;
					}
				},

				deleteItemHandler:function (_itemWidget) {
					var m = this;
					if (m.isWired && _itemWidget) {
						m.remove([_itemWidget], _true);
						m.fire({name:'Item.deleted', bubble:_true});
					}
				},

				editItemHandler:function (_itemWidget, _dialogParams) {
					var m = this;
					m.isWired && _itemWidget &&
						m.launchFormDialog(_dialogParams, _itemWidget)
					;
				},

				addItemHandler:function (_dialogParams) {
					var m = this;
					m.isWired &&
						m.launchFormDialog(_dialogParams)
					;
				},

				/*** Hook Method Implementations ***/
					afterWireUi:function () {
						var m = this;
						if (m.isEditable) {
							// wire add item
							m.wire('Item.add', function (_event) {
								_event.bubble = _false;
								m.addItemHandler(_event.properties);
							});

							// wire delete item
							m.wire('Item.delete', function (_event) {
								_event.bubble = _false;
								m.deleteItemHandler(_event.source);
							});

							// wire edit item
							m.wire('Item.edit', function (_event) {
								_event.bubble = _false;
								m.editItemHandler(_event.source, _event.properties);
							});

							m.uniqueIdentifierId = m.get('totalItems');

							// By default, the items container for collections is this.getNode('items'). Override it.
							m.set({ itemWidgetProperties: _Uize.copyInto(m.get('itemWidgetProperties'), { container: m.getContainerNode() }) });
						}
					},

					/* may be overriden by subclasses */
					getCollectionItemControlName:function (/*_itemWidgetProperties*/) {
						return this.get('collectionItemControlName');
					},

					/* default is to override the default items container, may be 'undone' in subclasses */
					getContainerNode: function () {
						var m = this;
						return m.getNode(m.itemsContainerNode);
					}
			},

			stateProperties:{
				collectionItemControlName:{},
				formDialogJsClass:{},
				formDialogParams:{},
				isEditable:{
					value:_false
				},
				itemsContainerNode:{
					value:'items'
				}
			}
		});
	}
});

