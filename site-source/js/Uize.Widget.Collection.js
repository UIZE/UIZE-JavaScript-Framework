/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Collection Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2007-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 5
	codeCompleteness: 90
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Widget.Collection= class manages a collection of items, with support for managing selected state, and methods for manipulating the collection.

		*DEVELOPERS:* `Chris van Rensburg`, `Jan Borgersen`, `Guang-yu Xu`, `Vinson Chuong`

		In a Nutshell
			The =Uize.Widget.Collection= class implements a widget for managing a collection of items, with support for managing selected state of items (including non-contiguous selection, range selection, and controls for selecting all, selecting none, and removing selected items), and methods by which application code can manipulate the collection.

			Collection Item Widget Naming
				Collection item widgets that are added to an instance of the =Uize.Widget.Collection= class as child widgets are named using one of two available schemes: `explicit naming of collection item widgets`, and `automatic naming of collection item widgets`.

				Explicit Naming of Collection Item Widgets
					When a collection item widget is added as a child widget of the collection, the element out of the =items= array that corresponds to the collection item being added is supplied as the value of the collection item widget's =properties= state property.

					The =itemPropertyForItemWidgetName= property lets you specify a property out of the collection item properties object that should be used for the name of the collection item child widget. This is best illustrated with a simple example...

					EXAMPLE
					.................................................
					var myCollection = page.addChild (
						'collection',
						Uize.Widget.Collection,
						{
							itemWidgetClass:Uize.Widget.CollectionItem,
							itemPropertyForItemWidgetName:'widgetName',
							items:[
								{
									widgetName:'bravingTheOnslaught',
									title:'Braving the Onslaught',
									category:'The Winter Collection'
								},
								{
									widgetName:'flockOfClouds',
									title:'Flock of Clouds',
									category:'The Photographic Orphanage'
								}
							]
						}
					);
					.................................................

					In the above example, the newly created collection widget will have two collection item child widgets: one named ='bravingTheOnslaught'=, and the other named ='flockOfClouds'=. The =items= state property specifies the array of data for the items in the collection. The value of each element is passed to the corresponding collection item child widget, through its =properties= state property. But the =widgetName= property is treated specially in this example. That's because the =itemPropertyForItemWidgetName= state property calls out the =widgetName= property as the property that should determine the name of the collection item widgets.

				Automatic Naming of Collection Item Widgets
					When =itemPropertyForItemWidgetName= is set to the value =null=, =undefined=, or =''= (empty string), or if the value of the item property specified by =itemPropertyForItemWidgetName= is =null=, =undefined=, or =''= (empty string), then the name of the child widget for a collection item will be generated using the value of the =itemWidgetNamePrefix= state property as a prefix and appending an automatically incremented uniquifier.

					EXAMPLE
					.................................................
					var myCollection = page.addChild (
						'collection',
						Uize.Widget.Collection,
						{
							itemWidgetClass:Uize.Widget.CollectionItem,
							itemPropertyForItemWidgetName:null,
							itemWidgetNamePrefix:'photoItem',
							items:[
								{
									title:'Braving the Onslaught',
									category:'The Winter Collection'
								},
								{
									title:'Flock of Clouds',
									category:'The Photographic Orphanage'
								}
							]
						}
					);
					.................................................

					In the above example, the newly created collection widget will have two collection item child widgets: one named ='photoItem0'=, and the other named ='photoItem1'=. This is because the =itemPropertyForItemWidgetName= state property is set to =null=, thereby defeating the `explicit naming of collection item widgets`, and because the =itemWidgetNamePrefix= state property is set to ='photoItem'=. The uniqifier value starts at =0=, and is incremented for each item added to the collection. This results in the collection item widget names ='photoItem0'= and ='photoItem1'=.
*/

Uize.module ({
	name:'Uize.Widget.Collection',
	required:[
		'Uize.Widget.Button',
		'Uize.Node.Event'
	],
	builder:function (_superclass) {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_true = true,
				_false = false,
				_null = null,
				_undefined
			;

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					function () {
						var _this = this;

						/*** Private Instance Properties ***/
							_this._itemWidgetNameUniquifier = 0;

						/*** Private-public Instance Properties ***/
							_this._itemWidgets = _this.itemWidgets = [];
							/*?
								Instance Properties
									itemWidgets
										A read-only array of collection item widget instances, where each collection item widget in the array corresponds to an element of the =items= array.

										Elements of this array are typically instances of the =Uize.Widget.CollectionItem= class, or some subclass thereof. The contents of this array are modified as items are added to or removed from the collection, but the =itemWidgets= property should maintain a reference to the same array throughout the life of the collection instance. The value of this property should not be set explicitly, nor should the contents of the array be changed explicitly. Instead, methods such as the =addItemWidget= instance method should be used to manage the contents of the collection.

										NOTES
										- this property is read-only
										- see the related =items= state property
										- the initial value is =[]= (empty array)
							*/

						/*** keep totalItems property up-to-date ***/
							_this.wire (
								'Items Changed',
								function () {
									_this.set ({_totalItems:_this._itemWidgets.length});
									_this._updateTotalSelected ();
								}
							);
					},
					function () {
						var _this = this;

						/*** add the select all, select none, and remove buttons ***/
							_this._addControlButton (
								'selectAll',
								function () {_this.selectAll ()},
								{
									affectedBy:['allSelected','totalItems','selectionMode','isEmpty'],
									stateEvaluator:
										function () {
											return (
												!this._allSelected &&
												!this._isEmpty &&
												(this._selectionMode != 'single' || this._totalItems == 1)
											)
										}
								}
								/*?
									Child Widgets
										selectAll Child Widget
											An instance of =Uize.Widget.Button=, that is wired up to call the =selectAll= instance method when clicked.

											This button is *disabled* whenever...

											- the value of the =allSelected= state property is =true=
											- the value of the =isEmpty= state property is =true=
											- the value of the =selectionMode= state property is ='single'= and the value of the =totalItems= state property is not =1=

											NOTES
											- the markup for this child widget is optional, and a given implementation of a collection widget's HTML does not need to offer this button
											- see the companion =selectNone= Child Widget=
											- this child widget is added in the constructor
								*/
							);
							_this._addControlButton (
								'selectNone',
								function () {_this.selectAll (_false)},
								'someSelected'
								/*?
									Child Widgets
										selectNone Child Widget
											An instance of =Uize.Widget.Button=, that is wired up to call the =selectAll= instance method when clicked, with the value =false= specified for the =selectAll= method's =selectedBOOL= parameter.

											This button is disabled whenever the value of the =someSelected= state property is =false=. Put another way, this button is only enabled when the value of =someSelected= is =true=.

											NOTES
											- the markup for this child widget is optional, and a given implementation of a collection widget's HTML does not need to offer this button
											- see the companion =selectAll= Child Widget=
											- this child widget is added in the constructor
								*/
							);
							_this._addControlButton (
								'remove',
								function () {_this._removeWithConfirm (_this._getSelected (),_true)},
								'someSelected'
								/*?
									Child Widgets
										remove Child Widget
											An instance of =Uize.Widget.Button=, that is wired up so that clicking it will prompt the user to confirm that they wish to remove the selected items, and will then remove the selected items if the user agrees.

											This button is disabled whenever the value of the =someSelected= state property is =false=. Put another way, this button is only enabled when the value of =someSelected= is =true=.

											NOTES
											- the markup for this child widget is optional, and a given implementation of a collection widget's HTML does not need to offer this button
											- this child widget is added in the constructor
											- see the related =remove= instance method
								*/
							);
					}
				),
				_classPrototype = _class.prototype
			;

		/*** Private Instance Methods ***/
			_classPrototype._addControlButton = _classPrototype.addControlButton = function (
				_buttonName,_clickHandler,_enabledWhen
			) {
				var
					_this = this,
					_buttonWidget = Uize.Widget.Button.addChildButton.call (_this,_buttonName,_clickHandler)
				;
				if (typeof _enabledWhen == 'string' && (_enabledWhen = _enabledWhen.replace (' ',''))) {
					var
						_propertyName = _enabledWhen.replace ('!',''),
						_negative = _enabledWhen.charAt (0) == '!'
					;
					_enabledWhen = {
						affectedBy:_propertyName,
						stateEvaluator:function () {return _this.get (_propertyName) != _negative}
					};
				}
				if (_enabledWhen) {
					var
						_updateButtonEnabled = function () {
							_buttonWidget.set ({enabled:_enabledWhen.stateEvaluator.call (_this) ? 'inherit' : _false});
						},
						_affectedBy = _enabledWhen.affectedBy
					;
					if (typeof _affectedBy == 'string') _affectedBy = [_affectedBy];
					Uize.forEach (
						_affectedBy,
						function (_affectedByProperty) {_this.wire ('Changed.' + _affectedByProperty,_updateButtonEnabled)}
					);
					_updateButtonEnabled ();
				};
				return _buttonWidget;
				/*?
					Instance Methods
						addControlButton
							For advanced developers only, this is a subclassing hook that lets you add a button child widget with the specified name, with a specified click handler function, and whose enabled state is determined by a specified condition.

							SYNTAX
							.............................................................................................
							buttonOBJ = myInstance.addControlButton (buttonNameSTR,clickHandlerFUNC,enabledWhenSTRorOBJ);
							.............................................................................................

							This method returns a reference to the button child widget created.

							buttonNameSTR
								A string, specifying the name of the button widget that will be added as a child widget of the collection widget instance.

							clickHandlerFUNC
								A function reference, specifying a function that should be executed when the button is clicked and in the enabled state.

							enabledWhenSTRorOBJ
								A string or object, specifying a rule that should be used for determining when the button is enabled and when it is not.

								The value of this parameter can be of type string or type object. When a string value is specified for this parameter, then the value should be the name of a state property of the collection widget whose value will determine the button's enabled state. An optional "!" (exclamation mark) prefix allows you to not the value of the state property specified in the =enabledWhenSTRorOBJ= parameter.

								A much more versatile way of declaring the enabled state rule for the button is to specify an object type value for the =enabledWhenSTRorOBJ= parameter. An object specified for this parameter should have the following structure...

								.......................................................................................
								{
									affectedBy     : affectedBySTRorARRAY,  // which properties affect the enabled state
									stateEvaluator : stateEvaluatorFUNC     // a function for calculating enabled state
								}
								.......................................................................................

								The value of the =affectedBy= property of this object allows you to declare the name of a single state property of the collection widget instance that affects the enabled state of the button, or an array of the names of multiple state properties of the instance that affect the button's enabled state. The collection widget instance will watch on a change in the value of this property or properties, and will execute the state evaluator function specified in the =stateEvaluator= property each time there is such a change.

								The function you specify in the =stateEvaluator= property should return a boolean value, indicating whether or not the button should be enabled. Your function will not receive any parameters, but it *will* be called as an instance method on the collection instance, so it will be able to access the values of the state properties that affect the button's enabled state by using the =get= instance method. For good examples of how the =addControlButton= method can be used in the creation of your own subclasses, look at the implementation of this class.

							VARIATION 1
							.........................................................................................
							buttonOBJ = myInstance.addControlButton (buttonNameSTR,eventNameSTR,enabledWhenSTRorOBJ);
							.........................................................................................

							When the =eventNameSTR= parameter is specified in place of the =clickHandlerFUNC= parameter, then an event of the name specified by the =eventNameSTR= parameter will be fired on the button child widget.

							VARIATIONS 2 & 3
							.........................................................................
							buttonOBJ = myInstance.addControlButton (buttonNameSTR,clickHandlerFUNC);
							buttonOBJ = myInstance.addControlButton (buttonNameSTR,eventNameSTR);
							.........................................................................

							When the =enabledWhenSTRorOBJ= parameter is omitted, then no enabled state management will be performed and you will have to implement your own enabled state management, if desired.

							NOTES
							- this is a hook method that can be used by a subclass
				*/
			};

			_classPrototype._fireItemsChangedEvent = function () {
				this.fire ('Items Changed')
				/*?
					Instance Events
						Items Changed
							An instance even that is fired whenever the items in the collection are modified.
				*/
			};

			_classPrototype._updateTotalSelected = function () {
				this.set ({_totalSelected:this._getSelected ().length});
			};

			_classPrototype._updateUiTotalItems = function () {
				this.isWired && this.setNodeValue ('totalItems',this._totalItems);
				/*?
					Implied Nodes
						totalItems Implied Node
							A node that will be used to display the total number of items in the collection.

							Whenever the value of the =totalItems= state property changes, this node will be updated using the =setNodeValue= instance method of the =Uize.Widget= class. Because the =setNodeValue= method is used for displaying the value of the =totalItems= property, the =totalItems Implied Node= can be of any type supported by the =setNodeValue= method - it can be a =div= tag, a =span= tag, a =p= tag, a text =input= tag, a =textarea= tag, etc.

							NOTES
							- see the related =totalItems= state property
							- the markup for this implied node is optional, and a given implementation of a collection widget's HTML does not need to offer this node
				*/
			};

			_classPrototype._removeAllItemsUiAndWidget = function () {
				var _this = this;
				_this._forAll (function (_itemWidget) {_this._removeItemUiAndWidget (_itemWidget)});
				_this._itemWidgets.length = 0;
			};

			_classPrototype._removeItemUiAndWidget = function (_itemWidget) {
				_itemWidget.removeUi ();
				_itemWidget.kill ();
				this.removeChild (_itemWidget);
			};

			_classPrototype._removeWithConfirm = function (_itemWidgetsToRemove,_byUser) {
				var
					_this = this,
					_itemWidgetsToRemoveLength = _itemWidgetsToRemove.length
				;
				if (_itemWidgetsToRemoveLength) {
					var _remove = function () {_this.remove (_itemWidgetsToRemove,_byUser)};
					if (_byUser) {
						_this.confirm ({
							message:
								_this.localize (
									_itemWidgetsToRemoveLength == 1 ? 'removeItemConfirmation' : 'removeItemsConfirmation',
									{
										0:_itemWidgetsToRemoveLength,
										itemsToRemove:_itemWidgetsToRemove
									}
									/*?
										Localizable Strings
											removeItemConfirmation
												A localizable string, that will be displayed as the message in a confirmation dialog when the user chooses to remove a single item from the collection.

												NOTES
												- see the companion =removeItemsConfirmation= localizable string
												- see the related =removeItemConfirmationTitle= and =removeItemsConfirmationTitle= localizable strings

											removeItemsConfirmation
												A localizable string, that will be displayed as the message in a confirmation dialog when the user chooses to remove multiple items from the collection.

												NOTES
												- see the companion =removeItemConfirmation= localizable string
												- see the related =removeItemConfirmationTitle= and =removeItemsConfirmationTitle= localizable strings
									*/
								),
							title:
								_this.localize (
									_itemWidgetsToRemoveLength == 1 ? 'removeItemConfirmationTitle' : 'removeItemsConfirmationTitle',
									{
										0:_itemWidgetsToRemoveLength,
										itemsToRemove:_itemWidgetsToRemove
									}
									/*?
										Localizable Strings
											removeItemConfirmationTitle
												A localizable string, that will be displayed as the title of a confirmation dialog when the user chooses to remove a single item from the collection.

												NOTES
												- see the companion =removeItemsConfirmationTitle= localizable string
												- see the related =removeItemConfirmation= and =removeItemsConfirmation= localizable strings

											removeItemsConfirmationTitle
												A localizable string, that will be displayed as the title of a confirmation dialog when the user chooses to remove multiple items from the collection.

												NOTES
												- see the companion =removeItemConfirmationTitle= localizable string
												- see the related =removeItemConfirmation= and =removeItemsConfirmation= localizable strings
									*/
								),
							yesHandler:_remove
						});
					} else {
						// silent removal that wasn't directly initiated by the user
						_remove ();
					}
				}
			};

		/*** Public Instance Methods ***/
			_classPrototype.addItemWidget = function (_widgetName,_widgetProperties) {
				var
					_this = this,
					_itemWidget = _this.addChild (
						_widgetName,
						_this._itemWidgetClass,
						Uize.copyInto (_widgetProperties,_this.getItemWidgetProperties ())
					)
				;

				_this.wireItemWidget (_itemWidget);
				_this._itemWidgets.push (_itemWidget);
				_this.isWired && _itemWidget.insertOrWireUi ();
				return _itemWidget;
				/*?
					Instance Methods
						addItemWidget
							Lets you add an item widget to the collection, returning a reference to the item widget added.

							SYNTAX
							.....................................................................................
							itemWidgetOBJ = myInstance.addItemWidget (itemWidgetNameSTR,itemWidgetPropertiesOBJ);
							.....................................................................................

							The value of the =itemWidgetNameSTR= parameter should be the widget name for the item widget that will be added as a child of the collection widget. The value of this parameter can be any string, so long as it doesn't collide with the names of existing child widgets of the collection widget, including the various button widgets of the class, and other existing item widgets. A value for this parameter can be generated using the =makeItemWidgetName= hook method.

							The value of the =itemWidgetPropertiesOBJ= parameter should be an object containing the values for state properties of the item widget to be created. This object will be modified by the =addItemWidget= method, by copying in the properties of the object returned by the =getItemWidgetProperties= hook method.

							NOTES
							- see the related =makeItemWidgetName= hook method
							- see the related =wireItemWidget= hook method
				*/
			};

			_classPrototype.wireItemWidget = function (_itemWidget) {
				var _this = this;

				_itemWidget.wire ({
					'Changed.selected':
						function () {
							if (_itemWidget.get ('selected')) {
								_this._selectionMode == 'single' &&
									_this.selectAll (_false,_this._lastSelectedItemWidget = _itemWidget)
									/* NOTE:
										If this becomes selected (programmatically) and the selection mode is single, we need to deselect everything else to keep things correct.
									*/
								;
								_this.fire ({name:'Item Selected',itemWidget:_itemWidget});
								/*?
									Instance Events
										Item Selected
											An instance event that is fired whenever an item becomes selected.

											When this event is fired, the event object will contain an =itemWidget= property whose value will be a reference to the item widget for the item that has become selected.
								*/
							} else if (_itemWidget == _this._lastSelectedItemWidget)
								_this._lastSelectedItemWidget = _null
							;
							_this._updateTotalSelected ();
						},
					'Click Selected':
						function (_event) {
							var
								_domEvent = _event.domEvent,
								_shiftKey = _domEvent && _domEvent.shiftKey,
								_ctrlKey = (!_shiftKey && _event.forceToggle) || (_domEvent && _domEvent.ctrlKey),
								_selectWithModifier = _ctrlKey || _shiftKey
							;
							_selectWithModifier && Uize.Node.Event.abort (_domEvent); // prevent browser spawning new window
							if (
								(_this._selectionMode == 'single' && !(_ctrlKey && _itemWidget.get ('selected'))) ||
								!_selectWithModifier
							) {
								_itemWidget.set ({selected:_true});
								_this.selectAll (_false,_this._lastSelectedItemWidget = _itemWidget); // unselect all others
							} else {
								_shiftKey
									? _this.selectRange (_this._lastSelectedItemWidget,_itemWidget)
									: (_this._lastSelectedItemWidget = _itemWidget).toggle ('selected')
								;
							}
						},
					'Item Changed':
						function () {
							var
								_index,
								_itemWidgets = _this._itemWidgets
							;
							for (var widgetNo = -1; ++widgetNo < _itemWidgets.length;)
								if (_itemWidgets[widgetNo] == _itemWidget) _index = widgetNo;
							_this._items [_index] = Uize.clone (_itemWidget.get ('properties'));
							_this._fireItemsChangedEvent ()
						},
					Remove:
						function (_event) {
							_this._removeWithConfirm (
								_itemWidget.get ('selected') && _this._itemRemoveActsOnSelection
									? _this._getSelected ()
									: [_itemWidget],
								_event.byUser
							);
						}
				});
			};
				/*?
					Instance Methods
						wireItemWidget
							A hook allowing subclasses to post-process new item widgets

							SYNTAX
							.....................................................................................
							myInstance.wireItemWidget (itemWidgetOBJ);
							.....................................................................................
				*/

			_classPrototype.forAll = _classPrototype._forAll = function (_function) {
				for (
					var _itemWidgetNo = -1, _itemWidgets = this._itemWidgets, _itemWidgetsLength = _itemWidgets.length;
					++_itemWidgetNo < _itemWidgetsLength;
				) {
					if (_function (_itemWidgets [_itemWidgetNo],_itemWidgetNo) === _false) break;
				}
				/*?
					Instance Methods
						forAll
							Iterates through all the collection item widgets in the collection and performs the specified handler function for each item widget.

							SYNTAX
							....................................
							myInstance.forAll (itemHandlerFUNC);
							....................................

							The function specified for the =itemHandlerFUNC= parameter should expect to receive two parameters: =itemWidgetOBJ= and =itemNo=, where =itemWidgetOBJ= is a reference to an item's collection item widget, and where =itemNo= is the item number / index for the item being processed. Your handler function can optionally omit the =itemNo= parameter from its definition if it doesn't need an item's index to perform its operation. If your handler function returns the special value =false=, then the iteration will be terminated.

							EXAMPLE
							.....................................
							var itemUserIsOver;
							myCollection.forAll (
								function (itemWidget) {
									if (itemWidget.get ('over')) {
										itemUserIsOver = itemWidget;
										return false;
									}
								}
							)
							.....................................

							In the above example, the =forAll= method is being used to iterate through the item widgets in the collection to find the one (if any) that the user is currently mousing over. If the item handler function finds an item that the user is over, where the value of the item widget's =over= state property is =true=, then the handler sets the =itemUserIsOver= variable to this item widget and then returns the special value =false=, indicating to the =forAll= iterator that it should break out of the iteration (after all, the item handler function can't use the =break= statement to accomplish that in this case).
				*/
			};

			_classPrototype.getItemWidgetProperties = function () {
				/* NOTE: can be overrided by subclasses in order to stitch in additional item widget properties */
				return this._itemWidgetProperties
				/*?
					Instance Methods
						getItemWidgetProperties
							For advanced developers only, this is a subclassing hook that lets you override the default use of the =itemWidgetProperties= state property in the =addItemWidget= instance method.

							SYNTAX
							................................................................
							itemWidgetPropertiesOBJ = myInstance.getItemWidgetProperties ();
							................................................................

							The implementation of this method by this base class simply returns a reference to the =itemWidgetProperties= state property. By overriding this method in a subclass, you can provide your own logic for generating the item widget properties that will be used when adding item widgets in the =addItemWidget= instance method. One thing you can do with your own override of this method is to stitch in additional properties at the time of adding an item widget. You can look for an example of this in the implementation of the =Uize.Widget.Collection.Dynamic= class.

							NOTES
							- this is a hook method, intended to be overrided in a subclass
				*/
			};

			_classPrototype.makeItemWidgetName = function (_item) {
				var _this = this;
				return (
					(_item && _this._itemPropertyForItemWidgetName && _item [_this._itemPropertyForItemWidgetName]) ||
					(
						_this._itemWidgetNamePrefix +
						(_this._itemWidgets.length ? ++_this._itemWidgetNameUniquifier : _this._itemWidgetNameUniquifier = 0)
					)
				);
				/*?
					Instance Methods
						makeItemWidgetName
							For advanced developers only, this is a subclassing hook that lets you obtain a generated name for a new item widget that is to be added.

							SYNTAX
							............................................................
							itemWidgetNameSTR = myInstance.makeItemWidgetName (itemOBJ);
							............................................................

							This method is not intended to be overrided by a subclass, but is intended instead to be used as part of the implementation of a subclass method that adds items to the collection. The method will be called first in order to generate a widget name for the item widget about to be added, and the generated name will then be used when adding the new item widget.

							The =itemOBJ= parameter can be used to supply a reference to the =properties= "bucket" for additional item data. When an object is specified for the =itemOBJ= parameter, and when the =itemPropertyForItemWidgetName= state property is set to a non-empty string, and when the value of the property in the =itemOBJ= object specified by the =itemPropertyForItemWidgetName= property is a non-empty string, then that property will be returned as the item widget name. Otherwise, the item widget name will be generated by concatenating the value of the =itemWidgetNamePrefix= state property with a dynamically generated and automatically incremented uniquifier value.

							VARIATION
							.....................................................
							itemWidgetNameSTR = myInstance.makeItemWidgetName ();
							.....................................................

							When the =itemOBJ= parameter is not specified, then the =makeItemWidgetName= method will behave as though the value =null= were specified for this parameter (see above).

							NOTES
							- this is a hook method that can be used by a subclass
							- see the related =itemPropertyForItemWidgetName= and =itemWidgetNamePrefix= state properties
				*/
			};

			_classPrototype.getSelected = _classPrototype._getSelected = function (_allIfNone) {
				var _selected = [];
				this._forAll (function (_itemWidget) {_itemWidget.get ('selected') && _selected.push (_itemWidget)});
				return !_selected.length && _allIfNone ? this._itemWidgets.concat () : _selected;
				/*?
					Instance Methods
						getSelected
							Returns an array of the selected collection items, where each element of the array is an object reference to a selected item's collection item widget.

							SYNTAX
							.............................................
							itemWidgetsARRAY = myInstance.getSelected ();
							.............................................

							The elements of the returned selected items array are in the order of the items in =itemWidgets= array.

							VARIATION
							..........................................................
							itemWidgetsARRAY = myInstance.getSelected (allIfNoneBOOL);
							..........................................................

							When the optional =allIfNoneBOOL= parameter is specified, you can control whether or not all the item widgets in the collection should be returned when none are selected. This may be useful for certain operations that should operate on all items when a selection has not been made.

							NOTES
							- see the related =getPropertyForSelected= instance method
				*/
			};

			_classPrototype.getPropertyForItems = function (_propertyName,_itemWidgets) {
				return Uize.map (
					_itemWidgets,
					function (_itemWidget) {
						var _itemProperties = _itemWidget.get ('properties');
						return _propertyName == _undefined ? _itemProperties : _itemProperties [_propertyName];
					}
				);
				/*?
					Instance Methods
						getPropertyForItems
							Returns an array, being the values of the specified =properties= "bucket" property for the specified items.

							SYNTAX
							........................................................................................
							propertyValuesARRAY = myInstance.getPropertyForItems (propertyNameSTR,itemWidgetsARRAY);
							........................................................................................

							Items in the collection are represented by item widgets, and each item widget for an item should have a =properties= state property, which serves as a "bucket" for additional item data. The =getPropertyForItems= method lets you get an array of the values for a specific property in this =properties= "bucket" for all of the specified items, where the items are specified by an array containing item widgets that correspond to items in the collection.

							For All Items
								To get the value of a specific =properties= "bucket" property for all the items in the collection, supply the value of the =itemWidgets= instance property as the value of the =itemWidgetsARRAY= parameter, as in...

								.........................................................................................
								var productIds = myCollection.getPropertyForItems ('productId',myCollection.itemWidgets);
								.........................................................................................

							An Example
								To better illustrate how the =getPropertyForItems= method behaves, let's consider an example...

								EXAMPLE
								.........................................................................................
								var myCollection = page.addChild (
									'collection',
									Uize.Widget.Collection,
									{
										itemWidgetClass:Uize.Widget.CollectionItem,
										items:[
											{
												title:'A Lighted Spot',
												properties:{
													productId:'228277244419896914',
													category:'Trees Among Us'
												}
											},
											{
												title:'Braving the Onslaught',
												properties:{
													productId:'228109666540948246',
													category:'The Winter Collection'
												}
											},
											{
												title:'Companion to a Sunset',
												properties:{
													productId:'228745103279879745',
													category:'The Sunset Collection'
												}
											}
										]
									}
								);

								var productIds = myCollection.getPropertyForItems ('productId',myCollection.itemWidgets);
								.........................................................................................

								In the above example, we're creating an instance of the =Uize.Widget.Collection= class, and we're setting it up with three items that represent different products. The =properties= bucket property for each of the items contains two extraneous item data properties: =productId= and =category=. Then we're using the =getPropertyForItems= instance method to get the value of the =productId= property for all items in the collection. After the above code has executed, the =productIds= variable will have the value...

								................................................................
								['228277244419896914','228109666540948246','228745103279879745']
								................................................................

							Getting All Properties
								When the special value =null= or =undefined= is specified for the =propertyNameSTR= parameter, then the =getPropertyForItems= method will return an array containing the values of the =properties= state property for all of the specified items.

								EXAMPLE
								..................................................................................
								var productIds = myCollection.getPropertyForItems (null,myCollection.itemWidgets);
								..................................................................................

								If we assume that the collection instance =myCollection= was set up just as in the example `An Example`, then the above statement would result in the =productIds= variable having the value...

								......................................
								[
									{
										productId:'228277244419896914',
										category:'Trees Among Us'
									},
									{
										productId:'228109666540948246',
										category:'The Winter Collection'
									},
									{
										productId:'228745103279879745',
										category:'The Sunset Collection'
									}
								]
								......................................

								IMPORTANT

								Note that the elements of the returned array will be the values of the =properties= state property for the specified items. Given that the =properties= state property for collection item widgets is an object, the elements array returned by the =getPropertyForItems= method will contain references to the same objects shared by the item widgets. Therefore, modifying the values of the objects in the returned array will have an affect on the item widgets. In cases where you wish to modify the returned data, you should probably use the =Uize.clone= static method to create your own clone of this data before modifying it.

							NOTES
							- see the related =getPropertyForSelected= instance method
				*/
			};

			_classPrototype.getPropertyForSelected = function (_propertyName,_allIfNone) {
				return this.getPropertyForItems (_propertyName,this._getSelected (_allIfNone));
				/*?
					Instance Methods
						getPropertyForSelected
							Returns an array, being the values of the specified =properties= "bucket" property for the selected items.

							SYNTAX
							..........................................................................
							propertyValuesARRAY = myInstance.getPropertyForSelected (propertyNameSTR);
							..........................................................................

							Using this method is equivalent to using the =getPropertyForItems= instance method and using the =getSelected= instance method to get an array of just the selected item widgets to specify for the =getPropertyForItems= method's =itemWidgetsARRAY= parameter. For example, the statement =myCollection.getPropertyForSelected ('productId')= would be equivalent to the statement =myCollection.getPropertyForItems ('productId',myCollection.getSelected ())=.

							Because the =getPropertyForSelected= method uses the =getPropertyForItems= method for its implementation, you can consult the reference for the =getPropertyForItems= method for more detail on how the =getPropertyForSelected= method behaves.

							VARIATION
							........................................................................................
							propertyValuesARRAY = myInstance.getPropertyForSelected (propertyNameSTR,allIfNoneBOOL);
							........................................................................................

							When the value =true= is specified for the optional =allIfNoneBOOL= parameter, then the =getPropertyForSelected= method will return an array of the values of the specified =properties= "bucket" property for *all* items in the collection when no items are selected.

							NOTES
							- see the related =getPropertyForItems= instance method
				*/
			};

			_classPrototype.updateUi = function () {
				this._updateUiTotalItems ()
			};

			_classPrototype.remove = function (_itemWidgetsToRemove,_byUser) {
				var _this = this;
				function _callFinishRemove (_itemWidgetsToRemove,_byUser) {
					_this.finishRemove (_itemWidgetsToRemove,_byUser);
				}
				_this.fire ({
					name:'Remove',
					itemWidgets:_itemWidgetsToRemove,
					byUser:_byUser,
					finishRemove:_callFinishRemove
					/*?
						Instance Events
							Remove
								An instance event that is fired when calling the =remove= instance method.

								This event is fired immediately upon calling the =remove= instance method, and before calling the =finishRemove= hook method. When this event is fired, the event object will have the following contents...

								EVENT OBJECT
								......................................................................................
								{
									name         : 'Remove',                  // event name (standard event property)
									source       : collectionInstanceOBJ,     // event source (standard event property)
									itemWidgets  : itemWidgetsToRemoveARRAY,  // widgets for items being removed
									byUser       : byUserBOOL,                // whether or not user initiated remove
									finishRemove : finishRemoveCallbackFUNC   // callback, if you set handled to true
								}
								......................................................................................

								A handler that is wired for this event has the option of declaring that the remove request has been handled, by setting the =handled= property on the event object to =true=. If a handler does this, then the =remove= method will *not* call the =finishRemove= hook method after the event has been fired. Instead, it will be up to your even handler code to complete the removal of the items by calling the "finishRemove" function that is a property of the event object, when it is appropriate to do so, and supplying values for the =itemWidgetsToRemoveARRAY= and =byUserBOOL= parameters that this function accepts. Alternatively, the handler code could *not* call the "finishRemove" function and could, instead, remove the item widgets itself.

								Among other things, this event mechanism allows specialized subclass or application code to insert an asynchronous interstitial step in the remove process, and it allows custom code to modify the list of items that will be removed.

								NOTES
								- see the related =remove= instance method
								- see the related =remove Child Widget=
					*/
				}).handled ||
					_callFinishRemove (_itemWidgetsToRemove,_byUser)
				;
				/*?
					Instance Methods
						remove
							Lets you initiate removal of the specified set of items from the collection.

							SYNTAX
							........................................................
							myInstance.remove (itemWidgetsToRemoveARRAY,byUserBOOL);
							........................................................

							The items to be removed by this method should be specified in the =itemWidgetsToRemoveARRAY= parameter, where the value of this parameter should be an array of item widgets corresponding to the items to be removed. This method should be called with the value =true= specified for the =byUserBOOL= method when the remove operation is initiated by the user, such as when the user clicks on a remove button in the UI.

							When this method is called, the method first fires the =Remove= instance event. If a handler is wired to handle this event and sets the =handled= property on the event object to =true=, then the =remove= method will do nothing after the event has been fired. If, on the other hand, the =handled= property of the event object is not set to =true=, then the =remove= method will call the =finishRemove= instance method after the event has been fired. The =finishRemove= method is a hook method that provides a subclass of =Uize.Widget.Collection= the ability to implement a custom items remover method.

							VARIATION
							.............................................
							myInstance.remove (itemWidgetsToRemoveARRAY);
							.............................................

							When the =byUserBOOL= parameter is omitted, or its value is =undefined= or =null=, then its value is defaulted to =false=.

							NOTES
							- for creating subclasses of =Uize.Widget.Collection=, see the =finishRemove= hook method
							- see the related =Remove= instance event
							- see the related =remove Child Widget=
				*/
			};

			_classPrototype.finishRemove = function (_itemWidgetsToRemove,_byUser) {
				var
					_this = this,
					_items = _this.get ('items'),
					_itemWidgets = _this.itemWidgets,
					_itemWidgetsLength = _itemWidgets.length,
					_itemWidgetsRemoved = _itemWidgetsToRemove,
					_itemWidgetsRemovedLength = _itemWidgetsToRemove.length
				;
				if (_itemWidgetsRemovedLength == _itemWidgetsLength) {
					_this._removeAllItemsUiAndWidget ();
					_items.length = 0;
				} else {
					/*** find the items(s) in the array and remove ***/
						_itemWidgetsRemoved = [];
						_itemWidgetsRemovedLength = 0;
						var _itemToMakeActive = _null;
						_this.forAll (
							function (_itemWidget,_itemWidgetNo) {
								if (Uize.isIn (_itemWidgetsToRemove,_itemWidget)) {
									_itemToMakeActive = _null;
									_itemWidgetsRemoved.push (_itemWidget);
									_itemWidgetsRemovedLength++;
									_this._removeItemUiAndWidget (_itemWidget,_itemWidgetNo);
								} else {
									if (!_itemToMakeActive && !_itemWidget.get ('locked'))
										_itemToMakeActive = _itemWidget
									;
									if (_itemWidgetsRemovedLength) {
										_items [_itemWidgetNo - _itemWidgetsRemovedLength] = _items [_itemWidgetNo];
										_itemWidgets [_itemWidgetNo - _itemWidgetsRemovedLength] = _itemWidget;
									}
								}
							}
						);
						_items.length = _itemWidgets.length = _itemWidgetsLength - _itemWidgetsRemovedLength;
				}
				if (_itemWidgetsRemovedLength) {
					_this.fire ({
						name:'Items Removed',
						byUser:_byUser,
						totalBeforeRemove:_itemWidgetsLength,
						itemWidgetsRemoved:_itemWidgetsRemoved,
						totalRemoved:_itemWidgetsRemovedLength,
						percentRemoved:_itemWidgetsRemovedLength / _itemWidgetsLength * 100
					});
					_this._fireItemsChangedEvent ();
				}
				/*?
					Instance Methods
						finishRemove
							A hook method, that is intended to be overrided in a subclass' implementation and that is called to complete a remove operation begun by calling the =remove= instance method.

							SYNTAX
							..............................................................
							myInstance.finishRemove (itemWidgetsToRemoveARRAY,byUserBOOL);
							..............................................................

							A subclass' implementation for this method should expect the two parameters =itemWidgetsToRemoveARRAY= and =byUserBOOL=, where =itemWidgetsToRemoveARRAY= is an array of collection item widgets for the items to be removed, and where =byUserBOOL= is a boolean indicating whether or not the remove was initiated by the user (as opposed to programmatically).

							NOTES
							- this is a hook method, intended to be overrided in a subclass
							- see the related =remove= instance method
				*/
			};

			_classPrototype.selectAll = function (_selected,_toExcludeItemWidget) {
				if (!(_selected = _selected !== _false) || this._selectionMode != 'single' || this._totalItems == 1)
					this._forAll (
						function (_itemWidget) {
							_itemWidget !== _toExcludeItemWidget && _itemWidget.set ({selected:_selected});
							/* NOTE: strict equality match here because of a stupid bug in Chrome */
						}
					)
				;
				/*?
					Instance Methods
						selectAll
							Selects all collection item widgets in the collection.

							SYNTAX
							........................
							myInstance.selectAll ();
							........................

							Calling this method has the effect of setting the value of the =selected= state property of all collection item widgets to =true=. Calling this method will also result in the values of the =allSelected=, =oneSelected=, =someSelected=, and =totalSelected= state properties being updated, upon which some of these properties may change value.

							VARIATION 1
							....................................
							myInstance.selectAll (selectedBOOL);
							....................................

							When the optional =selectedBOOL= parameter is specified, the desired selected state for all the collection items in the collection can be specified. Specifying the value =true= for the =selectedBOOL= parameter is equivalent to calling this method without specifying a parameter, and specifying the value =false= is equivalent to calling the =selectNone= instance method.

							VARIATION 2
							...........................................................
							myInstance.selectAll (selectedBOOL,toExcludeItemWidgetOBJ);
							...........................................................

							When the optional =toExcludeItemWidgetOBJ= parameter is specified, then an object reference can be specified for a collection item widget whose selected state should not be modified by calling the =selectAll= method. This allows you to select all but or deselect all but a specific item in the collection.

							NOTES
							- see the related =selectNone= and =selectRange= instance methods
							- see the related =allSelected=, =oneSelected=, =someSelected=, and =totalSelected= state properties
				*/
			};

			_classPrototype.selectRange = function (_itemWidgetA,_itemWidgetB) {
				var _this = this;
				if (_itemWidgetA && _itemWidgetB && (_this._selectionMode == 'multi' || _itemWidgetA == _itemWidgetB)) {
					var _selecting = _false;
					_this._forAll (
						function (_itemWidget) {
							var _itemOnRangeBoundary = _itemWidget == _itemWidgetA || _itemWidget == _itemWidgetB;
							if (_itemOnRangeBoundary) _selecting = !_selecting;
							_itemWidget.set ({selected:_selecting || _itemOnRangeBoundary});
						}
					);
				}
				/*?
					Instance Methods
						selectRange
							Selects all collection item widgets in the specified range - from the one specified item widget to the other specified item widget.

							SYNTAX
							.......................................................
							myInstance.selectRange (itemWidgetAOBJ,itemWidgetBOBJ);
							.......................................................

							Calling this method has the effect of setting the value of the =selected= state property of all collection item widgets within the specified range to =true=, and all collection item widgets outside of the specified range to =false=. The range is specified by the =itemWidgetAOBJ= and =itemWidgetBOBJ= parameters, and is inclusive of the two item widgets that are specified by these parameters. The order of the range bounds is unimportant - the item specified by =itemWidgetAOBJ= can be before or after the item specified by =itemWidgetBOBJ= in the =itemWidgets= array.

							Calling this method will result in the values of the =allSelected=, =oneSelected=, =someSelected=, and =totalSelected= state properties being updated, upon which some of these properties may change value. Calling this method will have no effect if the values of either - or both - of the =itemWidgetAOBJ= or =itemWidgetBOBJ= parameters is =null= or =undefined=, or if the value of the =selectionMode= state property is ='single'= and the values of the =itemWidgetAOBJ= and =itemWidgetBOBJ= parameters are not identical (ie. you can only select a range of one item when =selectionMode= is set to ='single'=, and trying to select a range of more than one item will result in no action).

							NOTES
							- see the related =selectAll= and =selectNone= instance methods
							- see the related =allSelected=, =oneSelected=, =someSelected=, and =totalSelected= state properties
				*/
			};

			_classPrototype.selectNone = function () {
				this.selectAll (_false)
				/*?
					Instance Methods
						selectNone
							Deselects all collection item widgets in the collection.

							SYNTAX
							.........................
							myInstance.selectNone ();
							.........................

							Calling this method has the effect of setting the value of the =selected= state property of all collection item widgets to =false=, and is equivalent to calling the =selectAll= instance method and specifying the value =false= for the =selectedBOOL= parameter. Calling this method will also result in the values of the =allSelected=, =oneSelected=, =someSelected=, and =totalSelected= state properties being updated, upon which some of these properties may change value.

							NOTES
							- see the related =selectAll= and =selectRange= instance methods
							- see the related =allSelected=, =oneSelected=, =someSelected=, and =totalSelected= state properties
				*/
			};

		/*** State Properties ***/
			_class.stateProperties ({
				_allSelected:{
					name:'allSelected',
					value:_false
					/*?
						State Properties
							allSelected
								A read-only boolean, indicating whether or not all the items in the collection are selected.

								Whenever the value of the =totalSelected= state property changes, the value of this property will be updated to be kept current and correct. Whenever the value of this property is =true=, the value of the =someSelected= state property will also be =true=.

								The =Changed.allSelected= instance event can be wired in order to maintain enabled state of any UI elements whose enabled state is affected by whether or not all items are selected. For example, whenever this property is set to =true=, the =selectAll= child widget will be disabled. Conversely, whenever =allSelected= is set to =false=, the =selectAll= child widget will be enabled (provided that the =isEmpty= state property is not set to =true=).

								NOTES
								- this property is read-only
								- see the related =oneSelected=, =someSelected=, and =totalSelected= state properties
								- the initial value is =false=
					*/
				},
				_isEmpty:{
					name:'isEmpty',
					value:_true
					/*?
						State Properties
							isEmpty
								A read-only boolean, indicating whether or not the collection is empty (ie. has no items).

								Whenever the value of the =totalItems= state property changes, the value of the =isEmpty= state property will be updated to be kept current and correct. When the =isEmpty= property is set to =true=, then the =selectAll Child Widget= will be disabled.

								NOTES
								- this property is read-only
								- the initial value is =true=
					*/
				},
				_itemPropertyForItemWidgetName:{
					name:'itemPropertyForItemWidgetName',
					value:'id'
					/*?
						State Properties
							itemPropertyForItemWidgetName
								A string, specifying the name of a property in an item's properties object that should be used as the name of the item's widget in the collection.

								For a detailed discussion, see the section `Explicit Naming of Collection Item Widgets`.

								NOTES
								- see the related =itemWidgetNamePrefix= state property
								- the initial value is ='id'=
					*/
				},
				_itemRemoveActsOnSelection:{
					name:'itemRemoveActsOnSelection',
					value:_false
					/*?
						State Properties
							itemRemoveActsOnSelection
								A boolean, specifying whether or not a =Remove= event fired by a selected collection item (as a result of the user clicking the item's remove button) should act on the rest of the selected items.

								In certain applications, it might seem more appropriate for clicking the remove button of an individual collection item in a selection of collection items to remove all items in the current selection. In such cases, the =itemRemoveActsOnSelection= property can be set to =true=.

								Even when this property is set to =true=, removing an individual collection item will not remove all selected items if the item being removed is not in the selection - if it is an unselected item, then only that item will be removed. So, essentially, when =itemRemoveActsOnSelection= is set to =true=, a single selected item becomes a proxy for the entire selection for a remove initiated on the item.

								NOTES
								- the initial value is =false=
					*/
				},
				_items:{
					name:'items',
					value:[],
					onChange:function () {
						var _this = this;

						/** first remove the old items UI **/
							_this._removeAllItemsUiAndWidget();

						/*** create item widgets ***/
							Uize.forEach (
								_this._items,
								function (_item) {_this.addItemWidget (_this.makeItemWidgetName (_item),{properties:_item})}
							);

						_this._fireItemsChangedEvent ();
					}
					/*?
						State Properties
							items
								An array of objects, representing the item data corresponding to the items in the collection.

								Each element of the =items= array should be an object, which serves as a "bucket" for additional data for an item. When a collection item widget is created for an item in the =items= array, the element from the =items= array is used as the value of the item widget's =properties= state property.

								Whenever the value of the =items= property is changed, the following actions will be taken...

								- collection item widgets will be added for all the elements of the =items= array
								- the =Items Changed= instance event will be fired.

								NOTES
								- see the related =itemWidgets= instance property
								- see also the =Items Changed= instance event
					*/
				},
				_itemWidgetClass:'itemWidgetClass',
					/*?
						State Properties
							itemWidgetClass
								An object reference, specifying the =Uize.Widget.CollectionItem= subclass that should be used for creating item widget instances.

								In some cases, the =Uize.Widget.CollectionItem= base class may be adequate. In other cases, however, one may wish the item widgets to have more than just the most basic functionality. In such cases, one can create one's own collection item widget class and then specify this class as the value of the =itemWidgetClass= property when creating the collection instance.

								NOTES
								- the initial value is =undefined=
					*/
				_itemWidgetNamePrefix:{
					name:'itemWidgetNamePrefix',
					value:'item'
					/*?
						State Properties
							itemWidgetNamePrefix
								A string, specifying a prefix that should be used in collection item widget names when automatic widget naming is employed.

								For a detailed discussion, see the section `Automatic Naming of Collection Item Widgets`.

								NOTES
								- see the related =itemPropertyForItemWidgetName= state property
								- the initial value is ='item'=
					*/
				},
				_itemWidgetProperties:'itemWidgetProperties',
					/*?
						State Properties
							itemWidgetProperties
								An object reference, specifying the values for any state properties that are common for all collection item widgets that are created by this class.

								The =Uize.Widget.Collection= class will use this property when creating new collection item widget instances as child widgets. Consider the following example...

								EXAMPLE
								.........................................................
								var myCollection = page.addChild (
									'collection',
									Uize.Widget.Collection,
									{
										itemWidgetClass:Uize.Widget.CollectionItem,
										itemPropertyForItemWidgetName:'widgetName',
										itemWidgetProperties:{previewClickAction:'Select'},
										items:[
											{
												widgetName:'bravingTheOnslaught',
												title:'Braving the Onslaught',
												category:'The Winter Collection'
											},
											{
												widgetName:'flockOfClouds',
												title:'Flock of Clouds',
												category:'The Photographic Orphanage'
											}
										]
									}
								);
								.........................................................

								In the above example, we're setting the =itemWidgetProperties= state property to the value ={previewClickAction:'Select'}=. This means that the two collection item child widgets that are created will both have their =previewClickAction= state property set to the value ='Select'=, which means that clicking on them will change their selected state.

								NOTES
								- the initial value is =undefined=
					*/
				_oneSelected:{
					name:'oneSelected',
					value:_false
					/*?
						State Properties
							oneSelected
								A read-only boolean, indicating whether or not just one item is selected.

								Whenever the value of the =totalSelected= state property changes, the value of this property will be updated to be kept current and correct. Whenever the value of this property is =true=, the value of the =someSelected= state property will also be =true=.

								The =Changed.oneSelected= instance event can be wired in order to maintain enabled state of any UI elements that trigger action on a single item and that are, therefore, not applicable when more than one item or no items are selected, but where it is still desirable to permit multiple selection for the sake of other actions that *can* operate on more than one item.

								NOTES
								- this property is read-only
								- see the related =allSelected=, =someSelected=, and =totalSelected= state properties
								- the initial value is =false=
					*/
				},
				_selectionMode:{
					name:'selectionMode',
					value:'multi'
					/*?
						State Properties
							selectionMode
								A string, specifying the mode (='single'= or ='multi'=) for selecting items in the collection.

								- ='single'= - In this selection mode, only one item can be selected at a time. Attempting to add to the selection using the ctrl or shift modifier keys will result in any currently selected item being deselected in favor of the new item being clicked on. In this mode it *is* possible, however, to use the ctrl modifier key to deselect the current item by ctrl-clicking on it. Also, when in this selection mode, the =selectAll Child Widget= will be disabled if there is more than one item in the collection.

								- ='multi'= - In this selection mode, multiple items may be selected at the same time. A user can add to the selection by using the ctrl or shift modifier keys, to do non-contiguous or range selection, respectively. In this mode, the =selectAll Child Widget= will be enabled unless all items in the collection are already selected, or the collection is empty.

								NOTES
								- the initial value is ='multi'=
					*/
				},
				_someSelected:{
					name:'someSelected',
					value:_false
					/*?
						State Properties
							someSelected
								A read-only boolean, indicating whether or not there are any items selected.

								Whenever the value of the =totalSelected= state property changes, the value of this property will be updated to be kept current and correct. The value of this property will be =true= when the value of the =oneSelected= state property is =true=.

								The =Changed.someSelected= instance event can be wired in order to maintain enabled state of any UI elements that trigger action on a selection and that are, therefore, not applicable when no items are selected. For example, whenever this property is set to =true=, the =selectNone= child widget will be enabled. Conversely, whenever =someSelected= is set to =false=, the =selectNone= child widget will be disabled.

								NOTES
								- this property is read-only
								- see the related =allSelected=, =oneSelected=, and =totalSelected= state properties
								- the initial value is =false=
					*/
				},
				_totalItems:{
					name:'totalItems',
					onChange:function () {
						this.set ({_isEmpty:!this._totalItems});
						this._updateUiTotalItems ();
					}
					/*?
						State Properties
							totalItems
								A read-only integer, indicating the total number of items in the collection.

								Whenever the total number of items in the collection changes, either as a result of adding new items or removing items, the value of the =isEmpty= state property will be updated to be kept current and correct, and the =totalItems Implied Node= will be updated to reflect the new number of items in the collection.

								NOTES
								- this property is read-only
								- see the related =isEmpty= state property
								- the initial value is =0=
					*/
				},
				_totalSelected:{
					name:'totalSelected',
					value:0,
					onChange:function () {
						var
							_this = this,
							_totalSelected = _this._totalSelected
						;
						_this.set ({
							_oneSelected:_totalSelected == 1,
							_someSelected:_totalSelected > 0,
							_allSelected:_totalSelected > 0 && _totalSelected == _this._totalItems
						});
					}
					/*?
						State Properties
							totalSelected
								An read-only integer, indicating the total number of items that are selected.

								Whenever the selection is changed, either by the user or programmatically, the value of this property will be updated. Whenever its value changes, the values of the =oneSelected=, =someSelected=, and =allSelected= state properties will be updated to be kept current and correct.

								NOTES
								- this property is read-only
								- see the related =allSelected=, =oneSelected=, and =someSelected= state properties
								- the initial value is =0=
					*/
				}
			});

		return _class;
	}
});

