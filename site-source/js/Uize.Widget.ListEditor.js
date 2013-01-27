/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.ListEditor Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2006-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 3
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Widget.ListEditor= class manages a list of text values in a multi-select box, with support for adding values and removing selected values.

		*DEVELOPERS:* `Ben Ilegbodu`, `Chris van Rensburg`, original code donated by `Zazzle Inc.`

	In a Nutshell
		The =Uize.Widget.ListEditor= class implements a widget that lets the user build and edit a simple list of string values.

		Editing the List
			The =Uize.Widget.ListEditor= class uses a number of child widgets and implied nodes to build a UI that lets the user edit the list.

			The =input= child widget, which is an instance of the =Uize.Widget.TextInput= class, lets the user enter text for a new item to be added to the =list= array. The =add= child widget, which is an instance of the =Uize.Widget.Button= class, lets the user add the currently entered text as a new item in the =list= array. The =list Implied Node=, which is a multiple select =select= tag (ie. where the =multiple= attribute is set to the value ='multiple'=), displays the current list and lets the user select one or more items in the list to be removed. The =remove= child widget, which is an instance of the =Uize.Widget.Button= class, lets the user remove the items currently selected in the =list Implied Node= from the =list= array.

			More on Adding Items
				Conforming New Items
					The  =itemConformer= state property lets you configure an optional item conformer function to "tidy up" new list items added by the user.

					An application of this would be when using the =Uize.Widget.ListEditor= class for a domain list editor, where one may wish to always remove the protocol and leave only the host name when adding new items to the list.

				Adding Existing Items
					Adding an item that is already in the list doesn't result in a duplicate entry, but simply selects only that item.

				Special Keys
					The =input= child widget that is used for entering the text for new items supports special handling for the enter and escape keys.

					Pressing the enter key in the text =input= field triggers the add action, but only if the =add= button enabled. Pressing the escape key in the text =input= field clears its value.

				New Item Placement
					When the user adds a new item, where it shows up in the =list= array is determined by the value of the =sort= state property.

					The =sort= property is sufficiently configurable to allow the =list= to be kept in a sorted state, or to be unsorted with new items added either at the beginning or the end of the =list=.

				New Item Becomes Selected
					An item that is added by the user immediately becomes the currently selected option in the =list Implied Node=.

					This makes it easy for the user to immediately remove that item if they notice they entered it incorrectly. Removing the item then places it back in the =input= field.

			More on Removing Items
				Removing a Single Item
					When removing a single item from the =list=, the text of the removed item will be placed in the text =input= field and this field will become focused.

					This allows the item to be easily re-added, in case it was accidentally removed, or edited / modified first before being re-added. This behavior does not apply to removing multiple items.

				Special Keys
					Pressing the delete key when the =list Implied Node= is focused will remove any items that are selected at the time (pressing the delete key has the same effect as clicking the =remove= button).

			Editing Items
				The =Uize.Widget.ListEditor= class does not provide a dedicated way to edit existing items in the list, but the combination of the add and remove behaviors provides for a sufficiently intuitive way to make edits.

				When removing a single item from the list, the text for that item is placed in the text =input= field and this field is then focused. The user can then make changes to the text and press the enter key to re-add the modified version. Upon not seeing an edit button, the user will figure the only way to make a change is to remove the incorrect item, and will then be pleasantly surprised to see the removed item go into the =input= field for modification and reentry in the list.

		Accessing and Setting the List
			The list that is edited by the user can be accessed programmatically through the =list= state property, which is an array of string values.

			The list can also be pre-seeded or updated programmatically by setting the value of this property.

			Value Interface
				The =value= state property is declared as an alias to the =list= state property.

				This means that the =Uize.Widget.ListEditor= class effectively implements the =Value Interface=, so the following statements would all be equivalent...

				...........................
				myListEditor.get ('list');
				myListEditor.get ('value');
				myListEditor.valueOf ();
				...........................

		List Sorting
			The =sort= state property provides a way to maintain the =list= array in a sorted state.

			The list can be sorted ASCIIbetically, in ascending or descending order, or it can be sorted with your own custom sort function, or it can be unsorted with new items added to the beginning or the end of the =list=. When sorting is enabled, the list is kept sorted as items are added by the user, or as its items are otherwise changed - even when items are changed programmatically by setting the value of the =list= state property.

		Button State Management
			The =Uize.Widget.ListEditor= class manages the state of its button child widgets, so they are only enabled when appropriate.

			Disabled Add Button
				When the value of the =input= child widget's =isValid= state property is set to =false=, then the =add= button will be disabled.

				This typically occurs when the =input= child widget's value is =''= (an empty string), but could also occur if its value is non-empty but not valid according to a validator function specified by its =validator= state property.

			Disabled Remove Button
				When no options of the =list Implied Node= are selected, then the =remove= button will be disabled.

				This may happen when there are no items in the =list= array, when the user has just removed the previously selected items, or if the user uses ctrl-click to deselect all selected items.
*/

Uize.module ({
	name:'Uize.Widget.ListEditor',
	required:[
		'Uize.Widget.Button',
		'Uize.Widget.TextInput',
		'Uize.Node.Event'
	],
	builder:function (_superclass) {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var _undefined;

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					null,
					function () {
						var _this = this;

						function _addText() {
							if (_this.children.add.get ('enabledInherited')) {
								var
									_listItemText = _this._itemConformer ? _this._itemConformer (_input + '') : _input + '',
									_selectedIndex = Uize.indexIn (_this._list,_listItemText)
								;
								if (_selectedIndex < 0) {
									_this._addNewOption (_listItemText);
									var _list = _this._list.concat ();
									_this._sort == 'prepend' ? _list.unshift (_listItemText) : _list.push (_listItemText);
									_this.set ({_list:_list});
								} else if (_this._listNode) {
									_this._listNode.selectedIndex = _selectedIndex;
								}
								_this._updateUiRemoveButtonState ();
								_clearInputNode();
							}
						}

						/*** add text input widget ***/
							var _input = _this.addChild ('input',Uize.Widget.TextInput,{minLength:1});
								/*?
									Child Widgets
										input
											An instance of the =Uize.Widget.TextInput= class, that lets the user enter text for a new item to be added to the =list= array.

											Text entered in the =input= child widget can be added to the =list= array by either pressing the enter key when the =input= child widget is focused, or by clicking on the =add= button. Upon adding the =input= widget's text to the =list= array, the value of the =input= widget is cleared (ie. set to an empty string). Pressing the escape key when the =input= child widget is focused will clear the value of the =input= widget without adding the item to the =list= array.

											NOTES
											- see the related =add= child widget
											- this child widget is added in the constructor
								*/

							function _clearInputNode () {_input.set ({value:''})};

							_input.wire({
								Ok:function (_event) {
									_event.cancelSubmit = true;
									_addText ();
								},
								Cancel:_clearInputNode,
								'Changed.isValid':function () {_this._updateUiAddButtonState ()}
							});

						/*** button widgets ***/
							_this._addChildButton ('add',_addText);
								/*?
									Child Widgets
										add
											An instance of the =Uize.Widget.Button= class, that lets the user add the current text entered in the =input= child widget as a new item in the =list= array.

											When the value of the =input= child widget's =isValid= state property is set to =false=, then the =add= button will be disabled. This typically occurs when the =input= child widget's value is =''= (an empty string), but could also occur if its value is non-empty but not valid according to a validator function specified by its =validator= state property.

											When the =add= button is enabled and is clicked by the user, any text entered in the =input= child widget will first be processed by the =itemConformer= function (if specified) and will then be added to the =list= array. Where the new item appears in the =list= will depend on the value of the =sort= state property.

											NOTES
											- see the related =input= child widget
											- this child widget is added in the constructor
								*/
							_this._addChildButton ('remove',function () {_this._removeSelected ()});
								/*?
									Child Widgets
										remove
											An instance of the =Uize.Widget.Button= class, that lets the user remove the items currently selected in the =list Implied Node= from the =list= array.

											When no options of the =list Implied Node= are selected, then the =remove= button will be disabled. This may happen when there are no items in the =list= array, when the user has just removed the previously selected items, or if the user uses ctrl-click to deselect all selected items.

											NOTES
											- see the related =list Implied Node= and the =list= state property
											- this child widget is added in the constructor
								*/

						_this._childWidgetsAdded = true;
						_this._updateUiAddButtonState ();
						_this._updateUiRemoveButtonState ();
					}
				),
				_classPrototype = _class.prototype
			;

		/*** Private Instance Methods ***/
			_classPrototype._addChildButton = Uize.Widget.Button.addChildButton;

			_classPrototype._addNewOption = function (_listItemText,_append) {
				var _listNode = this._listNode;
				if (_listNode) {
					var _newOption = document.createElement ('option');

					_newOption.text = _newOption.value = _listItemText;

					/* QUESTION: can't we just use normal DOM methods here for attaching nodes? */
					if (_append) {
						try {
							_listNode.add (_newOption,null);
						} catch(_ex) {
							_listNode.add (_newOption); // for IE7 and earlier
						}
					} else {
						try {
							_listNode.add (_newOption,_listNode.options [0] || null);
						} catch(_ex) {
							_listNode.add (_newOption,0); // for IE7 and earlier
						}
					}
				}
			};

			_classPrototype._removeOption = function(_listItemNo) {
				this._listNode && this._listNode.remove (_listItemNo);
			};

			_classPrototype._removeSelected = function () {
				var _this = this;
				if (_this._listNode) {
					var
						_selectedIndices = [],
						_options = _this._listNode.options,
						_optionsLength = _options.length
					;
					if (_optionsLength) {
						for (var _optionNo = -1; ++_optionNo < _optionsLength;)
							_options [_optionNo].selected && _selectedIndices.push (_optionNo)
						;
						if (_selectedIndices.length == 1) {
							var _input = _this.children.input;
							_input.set ({value:_this._list [_selectedIndices [0]]});
							_input.focus ();
						}
						var _list = _this._list.concat ();
						for (var _indexToRemoveNo = _selectedIndices.length; --_indexToRemoveNo >= 0;) {
							var _indexToRemove = _selectedIndices [_indexToRemoveNo];
							_this._removeOption (_indexToRemove);
							_list.splice (_indexToRemove, 1);
						}
						_this.set ({_list:_list});
					}
				}
			};

			_classPrototype._sortList = function (_list) {
				var _sort = this._sort;
				if (_sort != 'prepend' && _sort != 'append') {
					var _sortFunction = Uize.isFunction (_sort)
						? _sort
						: _sort == 'z-a' ? function (a,b) {return a > b ? -1 : 1} : _undefined
					;
					_sortFunction ? _list.sort (_sortFunction) : _list.sort ();
				}
				return _list;
			};

			_classPrototype._setButtonEnabled = function (_widgetName,_enabled) {
				this.children [_widgetName].set ({enabled:_enabled ? 'inherit' : false})
			};

			_classPrototype._updateUiAddButtonState = function () {
				this._childWidgetsAdded &&
					this._setButtonEnabled ('add',this.children.input.get ('isValid'))
				;
			};

			_classPrototype._updateUiRemoveButtonState = function () {
				var _this = this;
				_this._childWidgetsAdded &&
					_this._setButtonEnabled ('remove',_this._listNode && _this._listNode.selectedIndex > -1)
				;
			};

			_classPrototype._updateUiList = function() {
				var
					_this = this,
					_listNode = _this._listNode
				;
				if (_this.isWired && _listNode) {
					var
						_options = _listNode.options,
						_optionsLength = _options.length,
						_list = _this._list,
						_listLength = _list.length,
						_optionNo
					;

					/*** replace the existing options ***/
						for (_optionNo = Math.min (_optionsLength,_listLength); --_optionNo >= 0;) {
							var
								_option = _options [_optionNo],
								_listItemText = _list [_optionNo]
							;
							if (_listItemText != _option.text || _listItemText != _option.value)
								_option.text = _option.value = _listItemText
							;
						}

					/*** add or remove options to make up the difference ***/
						if (_listLength > _optionsLength) {
							// more options than in select element, so add new options
							for (_optionNo = _optionsLength - 1; ++_optionNo < _listLength;)
								_this._addNewOption (_list [_optionNo],true)
							;
						} else if (_listLength < _optionsLength) {
							// fewer options than in select element, so remove extras
							for (_optionNo = _optionsLength; --_optionNo >= _listLength;)
								_this._removeOption(_optionNo)
							;
						}

					/*** make sure newly added options are selected ***/
						if (_this._lastDisplayedList) {
							var
								_selectedHash = {},
								_selected = [],
								_lastDisplayedList = _this._lastDisplayedList,
								_optionNo
							;
							for (_optionNo = _listLength; --_optionNo >= 0;)
								_selectedHash [_list [_optionNo]] = 1
							;
							for (_optionNo = _lastDisplayedList.length; --_optionNo >= 0;)
								delete _selectedHash [_lastDisplayedList [_optionNo]]
							;
							for (var _listItemText in _selectedHash)
								_selected.push (_listItemText)
							;
							_this.setNodeValue (_listNode,_selected);

							/* or, if there was a filter out option in Uize.Data.filter...
								_this.setNodeValue (
									_listNode,
									Uize.keys (
										Uize.Data.filter (Uize.lookup (_list),_this._lastDisplayedList,true)
									)
								)
							*/
						}
						_this._lastDisplayedList = _list;

					_this._updateUiRemoveButtonState ();
				}
			};

		/*** Public Instance Methods ***/
			_classPrototype.updateUi = function () {
				var _this = this;
				if (_this.isWired) {
					_this._updateUiList ();
					_this._updateUiRemoveButtonState ();
				}
			};

			_classPrototype.wireUi = function () {
				var _this = this;
				if (!_this.isWired) {
					_this.wireNode (
						_this._listNode = _this.getNode ('list'),
						{
							keyup:
								function (_domEvent) {Uize.Node.Event.isKeyDelete (_domEvent) && _this._removeSelected ()},
							click:
								function () {_this._updateUiRemoveButtonState ()}
						}
						/*?
							Implied Nodes
								list Implied Node
									A multiple select =select= tag (ie. where the =multiple= attribute is set to the value ='multiple'=), that is used to display the current items in the =list= array, and that allows the user to select one or more items to remove.

									When the =list Implied Node= is focused and one or more options of the select tag are selected, then pressing the delete key will result in the selected items being removed from the list.

									NOTES
									- see the related =list= state property
						*/
					);

					_superclass.prototype.wireUi.call (_this);
				}
			};

		/*** State Properties ***/
			_class.stateProperties ({
				_itemConformer:'itemConformer',
					/*?
						State Properties
							itemConformer
								An optional function, that should be used to conform new items that are added to the =list= by the user.

								EXAMPLE
								.......................................................................
								page.addChild (
									'domainListEditor',
									Uize.Widget.ListEditor,
									{
										itemConformer:function (value) {
											return value.replace (/(^\s*(https?\:\/\/)?|(\/)+\s*$)/gi,'');
										}
									}
								);
								.......................................................................

								In the above example, an instance of the =Uize.Widget.ListEditor= class is being used to set up a domain list editor. This could be for something like a domain whitelist, or a domain based, blacklist style content filter. In this case, we only care about the host name and path, but don't care about the protocol. So, by specifying a function for the =itemConformer= property, we can have the "http" or "https" stripped off the beginning of new items before they are added to the list.

								NOTES
								- the initial value is =undefined=
					*/
				_list:{
					name:'list|value',
					conformer:function (_value) {
						this._sortList (_value);
						return _value + '' != this._list + '' ? _value : this._list;
					},
					onChange:_classPrototype._updateUiList,
					value:[]
					/*?
						State Properties
							list
								An array of strings, representing the items in the list.

								Setting the value of this property programmatically will result in the instance updating its UI to reflect the new items in the list. Whenever an item is added to the list by the user, or when one or more items are removed by the user, the value of this property will be changed. Therefore, registering a handler for the =Changed.list= event will catch cases where the list is modified by the user as well as programmatically by code setting the value of this property.

								New Items Become Selected
									Items in the new list that didn't previously exist in the list when the UI was last updated will automatically become the selected items.

									EXAMPLE
									.......................................................................................
									myListEditor.set ({list:myListEditor.get ('list').concat ('new item 1','new item 2')});
									.......................................................................................

									The above statement would result in the items ='new item 1'= and ='new item 2'= becoming the selected items (assuming that they weren't previously in the list).

								Automatically Sorted
									When the value of the =list= property is being set and a value other than ='append'= or ='prepend'= is specified for the =sort= state property, then the =list= value will first be conformed by sorting it according to the current sort mode before the new value is applied.

									EXAMPLE
									......................................................................................
									var myListEditor = page.addChild ('myListEditor',Uize.Widget.ListEditor,{sort:'a-z'});
									myListEditor.set ({list:['c','b','a']});
									......................................................................................

									In the above example, the =sort= property of the instance =myListEditor= is set to ='a-z'=. Now, when the =set= statement is issued to set the value of the =list= property to =['c','b','a']=, the value is sorted ASCIIbetically in ascending order. So, after the =set= statement has executed, the value of the =list= property will actually be =['a','b','c']=.

								Ignored Sets
									When a new value is being set for the =list= property, and the conformed new value is equivalent to the current value, then the conformer will return the current array and there will be no value change and *no* =Changed.list= event will be fired.

									EXAMPLE
									......................................................................................
									var myListEditor = page.addChild ('myListEditor',Uize.Widget.ListEditor,{sort:'a-z'});
									myListEditor.wire ('Changed.list',function () {alert ('LIST CHANGED')});
									myListEditor.set ({list:['a','b','c']});  // WE GET AN ALERT THIS TIME
									myListEditor.set ({list:['a','b','c']});  // NO ALERT!
									myListEditor.set ({list:['c','b','a']});  // STILL NO ALERT!
									......................................................................................

									In the above example, the =sort= property of the instance =myListEditor= is set to ='a-z'=. A handler is registered for the =Changed.list= event in order to pop up an alert dialog each time the value of the =list= property actually changes.

									Now, upon executing the first =set= statement, the value of the =list= property will change to =['a','b','c']= and the =Changed.list= event will fire. Upon executing the second =set= statement, the conformer for the =list= property will detect that there is no change in the list's contents - even though technically a new array reference is being supplied in the =set= statement. Consequently, there will be no =Changed.list= event fired. Finally, upon executing the third =set= statement, the contents of the list is different in its order. However, the sort mode will result in the list being conformed to =['a','b','c']=. Once again, there will be no change in the conformed list's contents and there will be no =Changed.list= event fired.

								NOTES
								- see the related =list Implied Node=
								- see the related =value= state property
								- when the list is changed programmatically, the item conformer specified by the =itemConformer= state property is not applied to the items in the list - they must already be conformed correctly
								- the initial value is =[]= (an empty array)

							value
								An alias to the =list= state property, so that this class effectively implements the =Value Interface=.

								NOTES
								- see the related =list= state property
					*/
				},
				_sort:{
					name:'sort',
					onChange:function () {this.set ({_list:this._sortList (this._list.concat ())})},
					value:'prepend'
					/*?
						State Properties
							sort
								A string, specifying one of the supported list sort modes, or a function reference for a custom list sorter function.

								VALUES
								- ='append'= - the list is not sorted, but new items added by the user are added at the end of the list
								- ='prepend'= - the list is not sorted, but new items added by the user are added at the beginning of the list
								- ='a-z'= - the list is sorted ASCIIbetically, in ascending order
								- ='z-a'= - the list is sorted ASCIIbetically, in descending order
								- =custom function= - your own custom list sorter function (the same kind of function you would supply to JavaScript's =Array= object sort method)

								Whenever the value of the =sort= property is changed, the =list= array is resorted according to the new sort mode. Whenever the value of the =list= state property is set, it is first conformed by sorting it according to the current sort mode.

								NOTES
								- the initial value is ='prepend'=
					*/
				}
			});

		return _class;
	}
});

