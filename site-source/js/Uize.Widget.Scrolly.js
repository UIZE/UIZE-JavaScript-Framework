/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Scrolly Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2005-2013 UIZE
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
		The =Uize.Widget.Scrolly= class provides animated scrolling for the contents of a view port, with support for both horizontal and vertical scrolling.

		*DEVELOPERS:* `Chris van Rensburg`, `Jan Borgersen`, original code donated by `Zazzle Inc.`

		In a Nutshell
			The =Uize.Widget.Scrolly= class is essentially just a scroller for a node.

			It supports horizontal scrolling, vertical scrolling, or both horiztonal and vertical scrolling together in the same instance. User interface and programmatic means are provided for controlling the scroll position of an instance.

			Scrolling in Pages
				Scroll position is expressed in pages, where one horizontal page is defined as the width of the =view= implied node, and one vertical page is defined as the height of the =view= implied node.

				A scrolly is scrollable horizontally if the value of its =scrollWidth= style property is greater than the value of its =offsetWidth= style property. Similarly, a scrolly is scrollable vertically if the value of its =scrollHeight= style property is greater than the value of its =offsetHeight= style property.

			How Scrolling is Performed
				Scrolling is achieved by setting the values of the =scrollLeft= and =scrollTop= properties of the =view= implied node.

				Animation
					Whenever the values of either the =pageX= or =pageY= state properties are modified, a fade is initiated in order to animate the scroll position of the =view= implied node from its current position to the new position represented by the new =pageX= and =pageY= values.

					The scrolly instance creates an instance of the =Uize.Fade= class in order to drive the scroll position fade. This fade instance is accessible through the =fade= instance property, so the properties of the scroll fade can be configured by setting values for the various state properties of this =fade= instance, such as its =curve=, =duration=, and other state properties.

					If the value of the =pageX= or =pageY= state properties are modified in the middle of a scroll fade - either by `scrolling with buttons` or by `scrolling programmatically` - then the current animation will be stopped and a new animation will be started to fade the scroll position from its current position to the new scroll position.

			Scrolling With Buttons
				Instances of the =Uize.Widget.Scrolly= class are equipped with four scroll buttons: =left= and =right= buttons for scrolling horizontally, and =up= and =down= buttons for scrolling vertically.

				Providing markup for the buttons is optional, and one can provide button HTML for only horizontal scrolling, only vertical scrolling, or both horiztonal and vertical scrolling. If one doesn't provide markup for any of the scroll buttons, there is still the option of `scrolling programmatically`.

				Shift-click
					Clicking the buttons scrolls one page at a time (see `Scrolling in Pages`), but holding down the shift modifier key when clicking on the buttons will scroll all the way to the extremes.

					Holding down shift while clicking on the =left= button will scroll to the far left (first page, horizontally), effectively setting =pageX= to =0=. Holding down shift while clicking on the =right= button will scroll to the far right (last page, horizontally), effectively setting =pageX= to the value of =maxPageX=. Holding down shift while clicking on the =up= button will scroll to the top (first page, vertically), effectively setting =pageY= to =0=. Holding down shift while clicking on the =down= button will scroll to the bottom (last page, vertically), effectively setting =pageX= to the value of =maxPageX=.

			Scrolling Programmatically
				In addition to `scrolling with buttons`, it is also possible to programmatically scroll an instance by setting the values of its =pageX= and =pageY= state properties.

				EXAMPLES
				........................................................................................
				// scroll horizontally

				scrolly.set ({pageX:scrolly.get ('pageX') - 1});   // scroll one page left
				scrolly.set ({pageX:scrolly.get ('pageX') + 1});   // scroll one page right
				scrolly.set ({pageX:0});                           // scroll to first page, horizontally
				scrolly.set ({pageX:Infinity});                    // scroll to last page, horizontally


				// scroll vertically

				scrolly.set ({pageY:scrolly.get ('pageY') - 1});   // scroll one page up
				scrolly.set ({pageY:scrolly.get ('pageY') + 1});   // scroll one page down
				scrolly.set ({pageY:0});                           // scroll to first page, vertically
				scrolly.set ({pageY:Infinity});                    // scroll to last page, vertically
				........................................................................................

				When scrolling left or right by incrementing or decrementing the value of the =pageX= state property, and when scrolling up or down by incrementing or decrementing the value of the =pageY= state property, it is not necessary to worry about detecting the first and last page boundaries, since a conformer for the =pageX= and =pageY= state properties takes care of this for you and makes sure that the values are always within bounds. This is why it is also possible to scroll to the last page by specifying the value =Infinity=, since this value will be constrained to the value of =maxPageX= when setting =pageX= and the value of =maxPageY= when setting =pageY=.

			State Summary
				For the convenience of application code, a full complement of read-only state properties provides a state summary for scrolly instances.

				This state summary is provided through the =isScrollableX= and =isScrollableY= boolean read-only properties, and the =maxPageX=, and =maxPageY= integer read-only properties. These various state properties can be used in the implementation of subclasses, in other widget classes that use the =Uize.Widget.Scrolly= class, or in application code that uses scrollies.

			The HTML
				The following example HTML shows a typical way that the HTML markup for an instance could be implemented.

				EXAMPLE HTML
				....................................................................................
				<div class="scrollyHorz">
					<a id="page_myScrolly_left" href="javascript://" class="scrollyButtonLeft"></a>
					<div id="page_myScrolly-view" class="scrollyView">
						<!-- THE SCROLLABLE STUFF GOES HERE -->
					</div>
					<a id="page_myScrolly_right" href="javascript://" class="scrollyButtonRight"></a>
				</div>
				....................................................................................

				The above example HTML is for a scrolly instance that is attached as the child widget named "myScrolly" to the page widget instance with the =idPrefix= of ='page'=. Therefore, the =idPrefix= of the =left= child widget is ='page_myScrolly_left'=, and the =idPrefix= of the scrolly's =view= implied node is ='page_myScrolly-view'=.
*/

Uize.module ({
	name:'Uize.Widget.Scrolly',
	required:[
		'Uize.Fade',
		'Uize.Widget.Button'
	],
	builder:function (_superclass) {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_true = true,
				_false = false
			;

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					function () {
						var _this = this;

						/*** Public Instance Properties ***/
							_this.fade = Uize.Fade ({
								duration:400,
								curve:Uize.Fade.celeration (0,1),
								quantization:1
								/*?
									Instance Properties
										fade
											An instance of the =Uize.Fade= class that is used to animate the scrolling of the contents of the =view= implied node.

											The =fade= instance is created during the construction of the =Uize.Widget.Scrolly= instance, so the fade properties can be modified immediately after the scrolly is created. The behavior of the animation can be controlled by setting values for the various state properties of the =fade= instance, such as its =curve=, =duration=, and other state properties.

											EXAMPLE
											...........................................................................
											page.addChild ('myScrolly',Uize.Widget.Scrolly).fade.set ({duration:1000});
											...........................................................................

											In the above example, an instance of the =Uize.Widget.Scrolly= class is added as a child widget of a page widget instance, and then its fade duration is set to =1000= (ie. one second). Because the =addChild= instance method returns a reference to the child widget being added, and because the =fade= instance is created during construction of the =Uize.Widget.Scrolly= instance, the =set= instance method can be called in a chained fashion.
								*/
							});

						/*** Initialization ***/
							_this.fade.wire (
								'Changed.value',
								function () {
									_this.isWired && _this.setNodeProperties ('view',_this.fade.valueOf ());
								}
							);
					},
					function () {
						var _this = this;

						/*** create the button widgets ***/
							function _addNavigationButton (_buttonName,_shiftX,_shiftY) {
								_this._addChildButton (
									_buttonName,
									function (_event) {
										var
											_factor = _event.domEvent.shiftKey ? Infinity : 1,
											_properties = {}
										;
										if (_shiftX) _properties._pageX = _this._pageX + _shiftX * _factor;
										if (_shiftY) _properties._pageY = _this._pageY + _shiftY * _factor;
										_this.set (_properties);
									}
								)
							}
							_addNavigationButton ('left',-1,0);
								/*?
									Child Widgets
										left
											An instance of the =Uize.Widget.Button= class, that is wired up so that clicking on it will scroll the =view= implied node left by one page.

											Clicking this button has the effect of decrementing the value of the =pageX= state property. The markup for this button is optional. The enabled state of this button is managed by the =Uize.Widget.Scrolly= class, so that it is disabled whenever it is not possible to scroll left, such as when the =view= implied node is already scrolled all the way to the left (ie. the value of =pageX= is =0=).

											NOTES
											- see the related =pageX= state property
											- see the companion =right= child widget, and the related =up= and =down= child widgets
								*/
							_addNavigationButton ('right',1,0);
								/*?
									Child Widgets
										right
											An instance of the =Uize.Widget.Button= class, that is wired up so that clicking on it will scroll the =view= implied node right by one page.

											Clicking this button has the effect of incrementing the value of the =pageX= state property. The markup for this button is optional. The enabled state of this button is managed by the =Uize.Widget.Scrolly= class, so that it is disabled whenever it is not possible to scroll right, such as when the =view= implied node is already scrolled all the way to the right (ie. the value of =pageX= is equal to the value of =maxPageX=).

											NOTES
											- see the related =pageX= state property
											- see the companion =left= child widget, and the related =up= and =down= child widgets
								*/
							_addNavigationButton ('up',0,-1);
								/*?
									Child Widgets
										up
											An instance of the =Uize.Widget.Button= class, that is wired up so that clicking on it will scroll the =view= implied node up by one page.

											Clicking this button has the effect of decrementing the value of the =pageY= state property. The markup for this button is optional. The enabled state of this button is managed by the =Uize.Widget.Scrolly= class, so that it is disabled whenever it is not possible to scroll up, such as when the =view= implied node is already scrolled all the way to the top (ie. the value of =pageY= is =0=).

											NOTES
											- see the related =pageY= state property
											- see the companion =down= child widget, and the related =left= and =right= child widgets
								*/
							_addNavigationButton ('down',0,1);
								/*?
									Child Widgets
										down
											An instance of the =Uize.Widget.Button= class, that is wired up so that clicking on it will scroll the =view= implied node down by one page.

											Clicking this button has the effect of incrementing the value of the =pageY= state property. The markup for this button is optional. The enabled state of this button is managed by the =Uize.Widget.Scrolly= class, so that it is disabled whenever it is not possible to scroll down, such as when the =view= implied node is already scrolled all the way to the bottom (ie. the value of =pageY= is equal to the value of =maxPageY=).

											NOTES
											- see the related =pageY= state property
											- see the companion =up= child widget, and the related =left= and =right= child widgets
								*/
					}
				),
				_classPrototype = _class.prototype
			;

		/*** Private Instance Methods ***/
			_classPrototype._addChildButton = Uize.Widget.Button.addChildButton;

			_classPrototype._displayAxisButtons = function (_axis,_decButtonName,_incButtonName) {
				var _this = this;
				_this.isWired &&
					_this.displayNode (
						[_this.children [_decButtonName].getNode (),_this.children [_incButtonName].getNode ()],
						_this._showButtonsWhenNotScrollable || _this.get ('isScrollable' + _axis)
					)
				;
			};

			_classPrototype._updateMaxPageProperty = function (_axisName) {
				if (this.isWired) {
					var
						_viewNode = this.getNode ('view'),
						_axisDimSuffix = _axisName == 'X' ? 'Width' : 'Height'
					;
					this.set (
						'maxPage' + _axisName,
						_viewNode
							? Math.max (
								Math.ceil (_viewNode ['scroll' + _axisDimSuffix] / _viewNode ['offset' + _axisDimSuffix]) - 1,
								0
							)
							: 0
					);
				}
			};

			_classPrototype._conformPageValue = function (_newValue,_axisName) {
				this._updateMaxPageProperty (_axisName);
				return (
					Uize.isNumber (_newValue = +_newValue)
						? Uize.constrain (_newValue,0,this.get ('maxPage' + _axisName) || 0)
						: this.get ('page' + _axisName)
				);
			};

			_classPrototype._updateButtonsEnabled = function (_axisName) {
				var
					_page = this.get ('page' + _axisName),
					_children = this.children
				;
				function _enableButton (_buttonName,_enabled) {
					var _button = _children [_buttonName];
					_button && _button.set ({enabled:_enabled ? 'inherit' : _false});
				}
				_enableButton (_axisName == 'X' ? 'left' : 'up',_page);
				_enableButton (_axisName == 'X' ? 'right' : 'down',(this.get ('maxPage' + _axisName) - _page + 1 || 2) > 1);
					/* NOTE:
						If maxPage is NaN, then maxPage - page is also NaN. Then, adding 1 still gives NaN, OR'ing with 2 gives you 2, which is greater than 1. This makes maxPage - page == NaN behave like 1 or above, rather than 0, but still makes 0 behave like 0 (ie. 0 + 1 || 2 is 1, which is not greater than 1).
					*/
			};

		/*** Public Instance Methods ***/
			_classPrototype.updateUi = function () {
				this._updateMaxPageProperty ('X');
				this._updateMaxPageProperty ('Y');
			};

		/*** State Properties ***/
			function _handlePageChange () {
				var _this = this;
				if (_this.isWired) {
					var _viewNode = _this.getNode ('view');
						/*?
							Implied Nodes
								view
									A node of any type, whose =scrollLeft= and =scrollTop= style properties are maintained by the =Uize.Widget.Scrolly= class as the values of the =pageX= and =pageY= state properties are modified.

									The =overflow= CSS style property for this node should be set to =hidden=, either in an inline =style= attribute, an inline stylesheet, or an external stylesheet.
						*/
					_this.fade.start ({
						startValue:{
							scrollLeft:_viewNode.scrollLeft,
							scrollTop:_viewNode.scrollTop
						},
						endValue:{
							scrollLeft:_this._pageX * _viewNode.offsetWidth,
							scrollTop:_this._pageY * _viewNode.offsetHeight
						}
					});
				}
			}
			function _updateButtonsEnabledX () {this._updateButtonsEnabled ('X')}
			function _updateButtonsEnabledY () {this._updateButtonsEnabled ('Y')}
			function _displayAxisButtonsX () {this._displayAxisButtons ('X','left','right')}
			function _displayAxisButtonsY () {this._displayAxisButtons ('Y','up','down')}

			_class.stateProperties ({
				_isScrollableX:{
					name:'isScrollableX',
					onChange:_displayAxisButtonsX,
					value:_false
					/*?
						State Properties
							isScrollableX
								A read-only boolean (whose value is managed by the =Uize.Widget.Scrolly= class), indicating whether or not the contents of the =view= implied node is wide enough to make it horizontally scrollable.

								NOTES
								- this property is read-only
								- see the companion =isScrollableY= state property
								- the initial value is =false=, and it is updated each time the value of =maxPageX= changes
					*/
				},
				_isScrollableY:{
					name:'isScrollableY',
					onChange:_displayAxisButtonsY,
					value:_false
					/*?
						State Properties
							isScrollableY
								A read-only boolean (whose value is managed by the =Uize.Widget.Scrolly= class), indicating whether or not the contents of the =view= implied node is tall enough to make it vertically scrollable.

								NOTES
								- this property is read-only
								- see the companion =isScrollableX= state property
								- the initial value is =false=, and it is updated each time the value of =maxPageY= changes
					*/
				},
				_maxPageX:{
					name:'maxPageX',
					onChange:[
						function () {
							this.set ({_isScrollableX:(this._maxPageX + 1 || 2) > 1});
							/* NOTE:
								If maxPageX is NaN, then adding 1 still gives NaN, OR'ing with 2 gives you 2, which is greater than 1. This makes NaN behave like 1 or above, rather than 0, but still makes 0 behave like 0 (ie. 0 + 1 || 2 is 1, which is not greater than 1).
							*/
						},
						_updateButtonsEnabledX
					]
					/*?
						State Properties
							maxPageX
								A read-only integer (whose value is managed by the =Uize.Widget.Scrolly= class), indicating the maximum possible value for the =pageX= state property.

								The value of this property can be used as an indication of the number of horizontal pages for the contents of the =view= implied node. For example, a value of =0= indicates that there is only one page horizontally (ie. the maximum value for =pageX= is =0=). A value of =5=, on the other hand, indicates that there are six pages horizontally, where those six pages are represented by the values =0= through =5= for the =pageX= state property.

								NOTES
								- this property is read-only
								- the initial value is =undefined=, and it is later updated upon wiring the instance's UI, every time the =updateUi= instance method is called, and every time a value is set for the =pageX= state property
								- see the companion =maxPageY= state property
					*/
				},
				_maxPageY:{
					name:'maxPageY',
					onChange:[
						function () {
							this.set ({_isScrollableY:(this._maxPageY + 1 || 2) > 1});
							/* NOTE:
								If maxPageY is NaN, then adding 1 still gives NaN, OR'ing with 2 gives you 2, which is greater than 1. This makes NaN behave like 1 or above, rather than 0, but still makes 0 behave like 0 (ie. 0 + 1 || 2 is 1, which is not greater than 1).
							*/
						},
						_updateButtonsEnabledY
					]
					/*?
						State Properties
							maxPageY
								A read-only integer (whose value is managed by the =Uize.Widget.Scrolly= class), indicating the maximum possible value for the =pageY= state property.

								The value of this property can be used as an indication of the number of vertical pages for the contents of the =view= implied node. For example, a value of =0= indicates that there is only one page vertically (ie. the maximum value for =pageY= is =0=). A value of =5=, on the other hand, indicates that there are six pages vertically, where those six pages are represented by the values =0= through =5= for the =pageY= state property.

								NOTES
								- this property is read-only
								- the initial value is =undefined=, and it is later updated upon wiring the instance's UI, every time the =updateUi= instance method is called, and every time a value is set for the =pageY= state property
								- see the companion =maxPageX= state property
					*/
				},
				_pageX:{
					name:'pageX',
					conformer:function (_value) {return this._conformPageValue (_value,'X')},
					onChange:[_handlePageChange,_updateButtonsEnabledX],
					value:0
					/*?
						State Properties
							pageX
								An integer, representing the current horizontal scroll position of the =view= implied node as a page number (see `Scrolling in Pages`) in the X-axis.

								Conformed
									When setting the value for this property, the value is conformed in a number of ways.

									+. The value will be coerced to a number type by invoking the =valueOf Intrinsic Method=. This means that one can specify a string value that is a valid formatted number, or an object (such as an instance of a =Uize.Class= subclass) that implements the =value= interface.
									+. Values that cannot be successfully coerced to a number type (such as =null=, =NaN=, etc.) will result in the property not changing its value.
									+. The value will be constrained so that it cannot go below =0= and cannot go above the value of the =maxPageX= state property.

								NOTES
								- see the companion =pageY= state property
								- the initial value is =0=
					*/
				},
				_pageY:{
					name:'pageY',
					conformer:function (_value) {return this._conformPageValue (_value,'Y')},
					onChange:[_handlePageChange,_updateButtonsEnabledY],
					value:0
					/*?
						State Properties
							pageY
								An integer, representing the current vertical scroll position of the =view= implied node as a page number (see `Scrolling in Pages`) in the Y-axis.

								Conformed
									When setting the value for this property, the value is conformed in a number of ways.

									+. The value will be coerced to a number type by invoking the =valueOf Intrinsic Method=. This means that one can specify a string value that is a valid formatted number, or an object (such as an instance of a =Uize.Class= subclass) that implements the =value= interface.
									+. Values that cannot be successfully coerced to a number type (such as =null=, =NaN=, etc.) will result in the property not changing its value.
									+. The value will be constrained so that it cannot go below =0= and cannot go above the value of the =maxPageY= state property.

								NOTES
								- see the companion =pageX= state property
								- the initial value is =0=
					*/
				},
				_showButtonsWhenNotScrollable:{
					name:'showButtonsWhenNotScrollable',
					onChange:[_displayAxisButtonsX,_displayAxisButtonsY],
					value:_true
					/*?
						State Properties
							showButtonsWhenNotScrollable
								A boolean, specifying whether or not the scroll buttons should be displayed in a given axis when it is not possible to scroll in that axis.

								When =showButtonsWhenNotScrollable= is set to =false=, the scroll buttons for a given axis will be hidden when it is not possible to scroll in that axis. If it *is* possible to scroll in the axis, then the buttons will be displayed and one of them may be disabled. When =showButtonsWhenNotScrollable= is set to =true= and it is *not* possible to scroll in a given axis, then the scroll buttons *will* be displayed for that axis but will both be disabled.

								NOTES
								- see the related =left=, =right=, =up=, and =down= child widgets
								- the initial value is =true=
					*/
				}
			});

		return _class;
	}
});

