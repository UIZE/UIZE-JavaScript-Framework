/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.CollectionItem Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2007-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 5
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Widget.CollectionItem= widget class manages state for an item that is intended to be one of many items owned by a collection widget instance.

		*DEVELOPERS:* `Chris van Rensburg`, `Jan Borgersen`

		In a Nutshell
			The =Uize.Widget.CollectionItem= class implements and manages the user interface for an item in a collection and is intended to be used in conjunction with the =Uize.Widget.Collection= class (or subclass).

			Some examples of collection items would be...

			- search results in a search results grid
			- movies in a queue of pending movie rentals
			- books in a list of book recommendations, in order of ratings score
*/

Uize.module ({
	name:'Uize.Widget.CollectionItem',
	required:[
		'Uize.Node',
		'Uize.Widget.Button',
		'Uize.Node.Classes'
	],
	builder:function (_superclass) {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_true = true,
				_false = false,
				_undefined
			;

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					function () {
						this._properties = {};
					},
					function () {
						var _this = this;

						/*** add select button ***/
							_this._addChildButton (
								'select',function (_event) {_this._selectItem (_event.domEvent,_true)}
								/*?
									Child Widgets
										select
											An instance of the =Uize.Widget.Button= class, that lets the user toggle the =selected= state for the instance.

											NOTES
											- the markup for this child widget is optional, and a given implementation of this widget in HTML does not need to offer a =select= button
								*/
							).set ({
								clickToSelect:_true,
								clickToDeselect:_true
							});
							_this._setSelectorState ();

						/*** add remove button ***/
							_this._addChildButton (
								'remove',
								function (_event) {_this.fire ({name:'Remove',byUser:_true})}
								/*?
									Child Widgets
										remove
											An instance of the =Uize.Widget.Button= class, that lets the user remove the item represented by the instance, or the current selection of items.

											Clicking on this button fires the =Remove= instance event, with a =byUser= property in the event object that is set to the value =true=.

											NOTES
											- the markup for this child widget is optional, and a given implementation of this widget in HTML does not need to offer a =remove= button
											- see the related =Remove= instance event

									Instance Events
										Remove
											An instance event that is fired when the user clicks on the =remove= button of an instance.

											The =Uize.Widget.CollectionItem= class (or subclass) is not responsible for removing the item represented by an instance. Instead, the =Remove= event is fired and handled by an instance of the =Uize.Widget.Collection= class (or subclass) that owns the collection items as child widgets. The =Uize.Widget.Collection= class then performs the operations necessary to update the data set for the collection of items. Also, the =Uize.Widget.Collection= class is responsible for deciding if just the item whose =remove= button was clicked should be removed, or if all currently selected items should be removed.

											NOTES
											- see the related =remove= child widget
								*/
							);
					}
				),
				_classPrototype = _class.prototype
			;

		/*** Private Instance Methods ***/
			_classPrototype._addChildButton = _classPrototype.addChildButton = Uize.Widget.Button.addChildButton;

			_classPrototype._updateUiTitle = function () {
				if (this.isWired) {
					var _title = this._title;
					_title != _undefined && this.setNodeInnerHtml ('title',_title);
					/*?
						Implied Nodes
							title Implied Node
								An optional node whose contents will be replaced with the value of the =title= state property, if this property's value is not =null= or =undefined=.

								The =innerHTML= value of the =title Implied Node= will be updated to reflect the value of the =title= state property whenever the value of this property is changed, is not =null= or =undefined=, and the instance is wired up.

								NOTES
								- this implied node is optional
					*/
				}
			};

			_classPrototype._updateUiState = function () {
				var _this = this;
				if (_this.isWired) {
					/*** set CSS class for root node ***/
						Uize.Node.Classes.setState(
							_this.getNode(),
							['', _this._cssClassOver, _this._cssClassActive],
							(_this._selected ? 2 : _this._over && 1) || 0
							/*?
								Implied Nodes
									Root Node
										The root node is the implied node with the name =''= (empty string), and is required for this widget class.

										The =className= property of this node is updated to reflect the state of the instance's =selected= and =over= state properties. If the instance is selected (i.e. =selected= is =true=, then the =className= property of the node is updated to contain =cssClassActive=. If the instance is not selected, but the user is hovering over it (i.e. =over= is set to =true=), then the =className= property of the node is updated to contain =cssClassOver=. If both =selected= and =over= are both set to =false=, then the node's =className= property will not be updated.

										NOTES
										- this implied node is required
							*/
						);

					/*** set CSS class for preview node ***/
						var
							_cssClassImage = _this._cssClassImage,
							_cssClassImageOver = _this._cssClassImageOver
						;
						typeof _cssClassImage == 'string' && typeof _cssClassImageOver == 'string' &&
							Uize.Node.Classes.setState(
								_this.getNode('preview'),
								[_cssClassImage, _cssClassImageOver],
								_this._over
								/*?
									Implied Nodes
										preview
											An optional node that should provide a preview for the item that is represented by the instance, and whose =className= property is updated to reflect the state of the instance's =over= state property.

											When =over= is set to =true=, the value of this node's =className= property will be set to the value of the =cssClassImageOver= state property. When =over= is set to =false=, the value of this node's =className= property will be set to the value of the =cssClassImage= state property. When either of the =cssClassImage= or =cssClassImageOver= state properties are set to =null= or are left =undefined=, then the =className= property of this node will not be updated.

											NOTES
											- this implied node is optional
											- in a typical implementation this implied node will be an IMG tag, but it does not have to be
								*/
							)
						;
				}
			};

			_classPrototype._selectItem = function (_domEvent,_forceToggle) {
				this.fire ({name:'Click Selected',domEvent:_domEvent,forceToggle:_forceToggle})
				/*?
					Instance Events
						Click Selected
							An instance event that is fired when the user clicks on the optional =select= button, or when the user clicks on the =previewShell= implied node and the value of the =previewClickAction= state property is set to either ='Select'= or ='Toggle Selected'=.

							When this event is fired because the user clicks on the =previewShell= implied node and =previewClickAction= is set to ='Toggle Selected'=, then the event object will contain a =forceToggle= property that is set to =true=.
				*/
			};

			_classPrototype._setSelectorState = function () {
				var
					_selectButton = this.children.select
				;
				_selectButton.get ('state') != 'over' && _selectButton.set ({selected:this._selected});
			};

		/*** Public Instance Methods ***/
			_classPrototype.updateUi = function () {
				this._updateUiState ();
				this._updateUiTitle ();
			};

			_classPrototype.wireUi = function () {
				var _this = this;
				if (!_this.isWired) {
					// NOTE: Ideally want to get rid of cssClassBase because we're using Uize.Node.Classes, but for backwards compatibility, need to still
					// minimally support it.  If there was a case that an application was passing in cssClassBase in order to get the item to have a certain
					// class (and it wasn't already in the markup), we need to set it here, so that would still operate correctly.
					var _rootNode = _this.getNode();
					if (_this._cssClassBase && _rootNode)
						_rootNode.className = _this._cssClassBase
					;

					/*** wire up the preview shell node ***/
						var
							_previewShellNode = _this.getNode ('previewShell') || 'imageLink',
								/*?
									Implied Nodes
										previewShell
											A node that serves as a shell around the =preview= implied node.

											Mouseover, mouseout, and click events are wired for this node in order to manage =over= and =selected= state for the instance, and in order to fire instance events, such as the ='Click Preview'=, ='Click Selected'=, and ='Item Mouse Down'= events.

											NOTES
											- this implied node is required, even if the optional =preview= implied node is omitted

										imageLink -- DEPRECATED 2009-07-28
											The deprecated =imageLink= implied node is an alternate / legacy name for the =previewShell= implied node.

											If the =imageLink= implied node is used, it will behave in exactly the same way as the =previewShell= node. If you're writing new code, you should *not* use this implied node in your HTML markup.

											NOTES
											- this implied node is deprecated
								*/
							_fireItemMouseDownEvent = function (_event) {
								_this.fire ({name:'Item Mouse Down',domEvent:_event,bubble:_true})
								/*?
									Instance Events
										Item Mouse Down
											A bubbling instance event that is fired when the user mouses down on the =previewShell= implied node.

											As a bubbling event, a handler for this event can be wired by an instance of the =Uize.Widget.Collection= class (or subclass) - that owns the collection items as child widgets - on itself. This is the case with the =Uize.Widget.Collection.Dynamic= class, which manages drag-and-drop for reordering of items in a collection.

											When this event is fired, the event object contains a =domEvent= property that is a reference to the mousedown DOM event, and a =bubble= property that is set to =true=.
								*/
							}
						;
						_this.wireNode (
							_previewShellNode,
							{
								mouseover:function () {_this.set ({_over:_true})},
								mouseout:function () {_this.set ({_over:_false})},
								touchstart:_fireItemMouseDownEvent,
								mousedown:_fireItemMouseDownEvent
							}
						);

						if (_this._previewClickAction)
							_this.wireNode (
								_previewShellNode,
								'click',
								function (_event) {
									var _forceToggle = _this._previewClickAction == 'Toggle Selected';
									_forceToggle || _this._previewClickAction == 'Select'
										? _this._selectItem (_event,_forceToggle)
										: _this.fire ({name:'Click Preview',bubble:_true});
											/*?
												Instance Events
													Click Preview
														An instance event that is fired when the user clicks on the =previewShell= implied node and the =previewClickAction= state property is set to ='Preview'= or =null=, or left =undefined=.

														As a bubbling event, a handler for this event can be wired by an instance of the =Uize.Widget.Collection= class (or subclass) - that owns the collection items as child widgets - on itself. When this event is fired, the event object contains a =bubble= property that is set to =true=.
											*/
								}
							)
						;

					_superclass.prototype.wireUi.call (_this);
				}
			};

		/*** State Properties ***/
			_class.stateProperties ({
				_cssClassActive:'cssClassActive',
					/*?
						State Properties
							cssClassActive
								A string, specifying the CSS class name that should be added to the =className= property of the `root node` when the instance is selected (ie. the =selected= state property is set to =true=).

								For a more in-depth discussion of the interaction between this property and the companion =cssClassOver= property, consult the reference for the `root node`.

								NOTES
								- see the companion =cssClassOver= state property
								- see the related =cssClassImage= and =cssClassImageOver= state properties
								- the initial value is =undefined=
					*/
				_cssClassBase:'cssClassBase',
					/*?
						State Properties
							cssClassBase -- DEPRECATED 2011-02-03
								A string, specifying the base CSS class string that should be set as the =className= property of the `root node` when wiring the instance.

								This state property, now deprecated, was originally used to aid in constructing the =className= property for the `root node` to reflect the =selected= and =over= states of the instance.

								NOTES
								- This state property is deprecated
								- the initial value is =undefined=
					*/
				_cssClassImage:'cssClassImage',
					/*?
						State Properties
							cssClassImage
								A string, specifying the value that should be set for the =className= property of the =preview= implied node when the user is not moused over the instance (ie. the =over= state property is set to =false=).

								For a more in-depth discussion of the interaction between this property and the companion =cssClassImageOver= property, consult the reference for the =preview= implied node.

								NOTES
								- see the companion =cssClassImageOver= state property
								- see the related =cssClassActive=, =cssClassBase=, and =cssClassOver= state properties
								- the initial value is =undefined=
					*/
				_cssClassImageOver:'cssClassImageOver',
					/*?
						State Properties
							cssClassImageOver
								A string, specifying the value that should be set for the =className= property of the =preview= implied node when the user mouses over the instance (ie. the =over= state property is set to =true=).

								For a more in-depth discussion of the interaction between this property and the companion =cssClassImage= property, consult the reference for the =preview= implied node.

								NOTES
								- see the companion =cssClassImage= state property
								- see the related =cssClassActive=, =cssClassBase=, and =cssClassOver= state properties
								- the initial value is =undefined=
					*/
				_cssClassOver:'cssClassOver',
					/*?
						State Properties
							cssClassOver
								A string, specifying the CSS class name that should be added to the =className= property of the root node when the user is mousing over the instance and it is not already selected (ie. the =over= state property is set to =true= and the =selected= state property is set to =false=).

								For a more in-depth discussion of the interaction between this property and the companion =cssClassActive= property, consult the reference for the `root node`.

								NOTES
								- see the companion =cssClassActive= state properties
								- see the related =cssClassImage= and =cssClassImageOver= state properties
								- the initial value is =undefined=
					*/
				_locked:{
					name:'locked',
					value:_false
					/*?
						State Properties
							locked
								A boolean, indicating whether or not the instance is locked.

								NOTES
								- the initial value is =false=
					*/
				},
				_over:{
					name:'over',
					onChange:[
						function () {
							var _this = this;
							_this.isWired && _this._previewTooltip && Uize.Tooltip &&
								Uize.Tooltip.showTooltip (_this._previewTooltip,_this._over)
							;
						},
						_classPrototype._updateUiState
					],
					value:_false
					/*?
						State Properties
							over
								A boolean, indicating whether or not the user is mousing over the =previewShell= implied node of the instance.

								The value of this property is set to =true= when the user mouses over the instance's =previewShell= implied node, and is set to =false= when the user mouses out.

								NOTES
								- the initial value is =false=
					*/
				},
				_previewClickAction:'previewClickAction',
					/*?
						State Properties
							previewClickAction
								A string, specifying the desired action that should be performed when the =previewShell= implied node is clicked.

								VALUES

								- ='Preview'= - Clicking will fire a bubbling ='Click Preview'= instance event.
								- ='Select'= - Clicking will select the item, clearing any existing selection.
								- ='Toggle Selected'= - Clicking will toggle the selected state of the item, not affecting any other currently selected items.
								- =not defined= - When this property is not defined or is set to the value =null=, =false=, or =''= (empty string), then a bubbling ='Click Preview'= instance event will be fired (ie. defaulting to the behavior for the value ='Preview'=).

								NOTES
								- the initial value is =undefined=
					*/
				_previewTooltip:'previewTooltip',
					/*?
						State Properties
							previewTooltip
								An object reference to a DOM node, or a string whose value is the =id= for a DOM node, that should be displayed as a tooltip for the instance when the value of the =over= state property changes to =true= and the instance is wired.

								Essentially, the =previewTooltip= state property can be used to specify a tooltip that should appear when the user mouses over the =previewShell= implied node.

								NOTES
								- the initial value is =undefined=
								- in order for the value of this property to be honored, the =Uize.Tooltip= module must already be loaded, but the =Uize.Widget.CollectionItem= module does not explicitly require the =Uize.Tooltip= module
					*/
				_properties:{
					name:'properties',
					onChange:function () {
						var
							_properties = this._properties
						;
						'title' in _properties && this.set ({_title:_properties.title})
					}
					/*?
						State Properties
							properties
								An object, acting as a "bucket" for additional data that may be associated to an instance.

								The data in the =properties= state property is used by the =getPropertyForItems= and =getPropertyForSelected= instance methods of the =Uize.Widget.Collection= class. When the value of the =properties= state property is changed, the value of the =title= state property is set from the "title" property of the =properties= object, if it exists.

								NOTES
								- the initial value is =undefined=
					*/
				},
				_selected:{
					name:'selected',
					onChange:function () {
						this.children.select && this._setSelectorState ();
						this._updateUiState ();
					},
					value:_false
					/*?
						State Properties
							selected
								A boolean, indicating whether or not the instance is selected.

								When the value of the =selected= state property changes, the selected state of the =select= child widget will be updated, and the CSS class of the =Root Node= will be updated to reflect the instance's selected state.

								NOTES
								- the initial value is =false=
					*/
				},
				_title:{
					name:'title',
					onChange:function () {
						var
							_this = this,
							_properties = _this._properties
						;
						if (_properties) {
							_properties.title = _this._title;
							_this._updateUiTitle ();
						}
					}
					/*?
						State Properties
							title
								A string, whose value will be used to set the value of the =innerHTML= property of the =title Implied Node=.

								The =innerHTML= value of the =title Implied Node= will be updated to reflect the value of the =title= state property whenever the value of this property is changed, is not =null= or =undefined=, and the instance is wired up. When the value of the =properties= state property is changed, the value of the =title= state property is set from the "title" property of the =properties= object.

								NOTES
								- the initial value is =undefined=
					*/
				}
			});

		return _class;
	}
});

