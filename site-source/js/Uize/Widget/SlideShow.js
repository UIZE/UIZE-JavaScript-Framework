/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.SlideShow Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2004-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 4
	codeCompleteness: 100
	docCompleteness: 90
*/

/*?
	Introduction
		The =Uize.Widget.SlideShow= class eases the creation of slideshow presentations, supporting navigation controls, configurable visualizations, and more.

		*DEVELOPERS:* `Chris van Rensburg`

		A Panoply of Flavors
			The =Uize.Widget.SlideShow= class doesn't dictate how slides are presented, but provides a versatile framework for a wide range of different flavors of slideshow presentations.

			Among the range of possibilities for slideshows are...

			- a simple image slideshow, with no transition effects and merely employing a DOM node for the slide image
			- an image slideshow with transition effects, employing helper widget classes (such as =Uize.Widget.ImageWipe=)
			- an image slideshow with transition effects, and displaying slide meta data (such as rating, description, tags, etc.) through a combination of helper widgets and DOM nodes
			- a slideshow of data, such as a bar chart representing different facets of data for different months of a year, and employing helper widget classes (such as =Uize.Widget.Bar=)
			- a slideshow of slideshows, such as a slideshow of different houses - where each slide represents a house and itself presents its own sub-slideshow of different pictures of the house

		Navigation Control
			The =Uize.Widget.SlideShow= class wires up and manages enabled state for navigation control buttons that allow the user to navigate forward and back through a slideshow.

			The navigation control is comprised of four buttons:

			- the =next= button navigates to the next slide in the slides set
			- the =previous= button navigates to the previous slide in the slides set
			- the =first= button navigates to the first slide in the slides set
			- that =last= button navigates to the last slide in the slides set

			All the navigation buttons are optional. That is to say, it is not necessary to provide markup for the button child widgets, and if no HTML is present for them no disastrous consequences will ensue - the user will simply not see those buttons and the slideshow will still function correctly. Usually one wants markup for at least the =next= and =previous= buttons, so one may choose to omit markup for the =first= and =last= buttons, or one may choose only to provide markup for the =first= button as a "go back to beginning" feature.

			Enabled State Management
				The =Uize.Widget.SlideShow= class manages the enabled state of the various navigation buttons, so that they're never inappropriately enabled.

				For example, when the slideshow is at the first slide the =first= button becomes disabled. Likewise, when the slideshow is at the last slide the =last= button becomes disabled. If there are no slides in the set, then all the navigation buttons become disabled. As for the =next= and =previous= buttons, the =next= button becomes disabled when at the last slide and =wrap= is set to =false= and, similarly, the =previous= button becomes disabled when at the first slide and =wrap= is set to =false=.

		No Effects Please, We're British
			A slideshow will typically be presented with transition / animation effects as one navigates from one slide to the next.

			The =Uize.Widget.SlideShow= base class does not provide or impose any specific transition effects, however, and acts primarily as a foundation / scaffolding upon which to build a slideshow user experience. Slideshows with elaborate transition effects can quite easily be configured by combining the =Uize.Widget.SlideShow= class with other widget classes from the UIZE JavaScript Framework - such as the =Uize.Widget.Swap.Image= and =Uize.Widget.ImageWipe= classes - or your own widget classes.

		Slide Properties
			The =Uize.Widget.SlideShow= class supports an arbitrary number of properties for slides, each of which can be bound - either implicitly or explicitly - to child widgets, DOM nodes, =Uize.Class= subclass instances, or handler functions.

			The system for binding slide properties so that they are represented in the user interface for a slideshow supports a wide range of possible applications for slideshows, where each slide may contain a rich set of data for display. For example, you may implement a slideshow with slides that contain =imageUrl=, =title=, =description=, =rating=, =author=, and =tags= properties. Or, you may implement a nutritional information slideshow - where each slide represents a different fruit and contains properties like =calories=, =totalFat=, =saturatedFat=, =cholesterol=, =sodium=, etc.

			### Phantom Slide Properties -- CLEAN UP THE INCONSISTENCY BEFORE DOCUMENTING!!!
				progress
				slideNumber
				totalSlides

		Slide Property Bindings
			A slideshow would not be terribly useful if there was nothing to see.

			As mentioned earlier, the =Uize.Widget.SlideShow= class does not make assumptions about the content described by slides, and does also not presume to know how best to display that content. Instead, it is left to an individual application, a subclass of =Uize.Widget.SlideShow=, or some other widget class that uses the =Uize.Widget.SlideShow= class as a helper class to implement the presentation.

			What the =Uize.Widget.SlideShow= class *does* provide is a mechanism for binding the values of slide properties - either implicitly to child widgets or DOM nodes, or explicitly to registered =Uize.Class= subclass instances or handler functions.

			Implicit Bindings
				The =Uize.Widget.SlideShow= class implements a convenient facility for implicitly binding properties of the current slide to either child widgets of a =Uize.Widget.SlideShow= instance, or DOM nodes of the instance.

				Child Widget Bindings
					One facility for implicit slide property binding involves testing for a child widget of a specific name.

					When the user interface for a =Uize.Widget.SlideShow= instance is updated - either initially when it is wired up, or each time that the current slide is changed - the slideshow instance tests for the existence of child widgets that correspond to each of the properties in the =slide= object. It does this by following the rule that any child widget that is intended to be bound to a slide property should be named =slide[PropertyName]=, where =PropertyName= is the name of the property with its first letter capitalized. So, for example, to have the =imageUrl= property for a slide implicitly bound to a child widget, a child widget should exist with the name =slideImageUrl=.

					HOW IT'S DISPLAYED

					Now, if a child widget instance is found that corresponds to a slide property, then the =value= state property for that child widget will be set to the value of the slide property for the current slide. This means that child widgets that are implicitly bound to slide properties must implement the `value interface` (i.e. provide a =value= state property). If the state property that logically represents the value in the child widget's class is not publicly named =value=, then one could modify the class to declare =value= as a public alias for that property (for more details, consult the guide [[../guides/state-properties.html][State Properties]]).

					If the `child widget bindings` facility is not successful in implicitly binding a slide property to a child widget, then the `DOM node bindings` facility will be employed.

				DOM Node Bindings
					Another facility for implicit slide property binding involves setting the value for a DOM node.

					If the `child widget bindings` facility is not successful in implicitly binding a slide property to a child widget, then the slideshow instance will attempt to display the value of that slide property in a DOM node of the instance, following the rule that a DOM node that is intended to be bound to a slide property should be named =slide_[propertyName]=. So, for example, to have the =imageUrl= property for a slide implicitly bound to a DOM node, a DOM node named =slide_imageUrl= should exist in the DOM.

					HOW IT'S DISPLAYED

					To display the values of slide properties in corresponding DOM nodes, the =setNodeValue= instance method of the =Uize.Widget= base class is used. This has the implication that values of slide properties can easily be represented in form elements (such as text input fields, textarea fields, radio buttons, checkboxes, etc.), image elements (=src= attribute will be set), or any HTML element (=innerHTML= will be set). If no node exists that corresponds to a slide property, then that slide property will simply not be represented in the user interface. Therefore, it is acceptable to have properties in the =slide= object that are either not meant to appear in the slideshow UI, or for which the UI is not yet implemented.

					In the most simple usage of the =Uize.Widget.SlideShow= class, the `DOM node bindings` facility provides a simple and lightweight way to reflect slide properties in the UI, simply by adding nodes to the DOM with correctly named id's.

				Remapped DOM Node Bindings
					In the event that the naming scheme employed by the `DOM node bindings` facility does not suit your needs, you can use the DOM node name remapping facility provided in the =Uize.Widget= base class to bind slide properties to arbitrarily named DOM nodes.

					EXAMPLE
					......................................
					mySlideShow = Uize.Widget.SlideShow ({
						nodeMap:{
							slide_imageUrl:'imageUrl'
						}
					});
					......................................

					In the above example, the value of the =imageUrl= slide property - that would normally be bound by the `DOM node bindings` facility to the DOM node =slide_imageUrl= - is being remapped so that it is bound instead to the DOM node =imageUrl=, using the =nodeMap= state property that is implemented in the =Uize.Widget= class.

			Explicit Bindings
				A facility is provided to explicitly declare a binding between a slide property and either an instance of a =Uize.Class= subclass that implements the `value interface` (i.e. provides a =value= state property), or an update handler function that will be executed when the value of the =slide= state property changes.

				This facility is implemented in the form of the =slideBindings= state property, whose value should be an object that provides mappings between slide properties and binding targets. The name of each key in the =slideBindings= object should correspond to the name of a property in the =slide= object, and its value should be either a reference to an instance of a =Uize.Class= subclass that implements the `value interface` (i.e. provides a =value= state property), or an update handler function that will be executed when the value of the =slide= state property changes. If an explicit binding is provided for a particular slide property, then the `implicit bindings` facility will not be employed for that slide property (the explicit binding takes precedence).

				Explicit Object Bindings
					Any slide property can be bound to an instance of a =Uize.Class= subclass that implements the `value interface` (i.e. provides a =value= state property), simply by specifying a reference to that instance as the value for a binding.

					EXAMPLE
					......................................
					mySlideShow = Uize.Widget.SlideShow ({
						slideBindings:{
							imageUrl:myImageWipeInstance
						}
					});
					......................................

					In the above example, the =imageUrl= slide property is being bound to the widget instance =myImageWipeInstance= - an instance of the =Uize.Widget.ImageWipe= widget class.

				Explicit Function Bindings
					Any slide property can be bound to a handler function, simply by specifying a reference to that function as the value for a binding.

					EXAMPLE
					..............................................................
					mySlideShow = Uize.Widget.SlideShow ({
						slideBindings:{
							imageUrl:function (value) {
								myCustomImageEffectsWidget.chooseRandomTransition ();
								myCustomImageEffectsWidget.set ({image:value});
							}
						}
					});
					..............................................................

					In the above example, the value of the =imageUrl= slide property is being represented using the hypothetical =myCustomImageEffectsWidget= instance. The explicit binding of =imageUrl= to a handler function causes this handler to be executed when the value of the =slide= state property changes. In the handler function, the hypothetical =chooseRandomTransition= instance method is called to choose a new transition effect, and then the =image= state property of the =myCustomImageEffectsWidget= instance is set to the new value of the =imageUrl= slide property (which is passed as the single parameter to the handler function).

			Mixed Bindings
				One may use a combination of the `implicit bindings` and `explicit bindings` facilities.

				You are not forced to choose one facility or the other for all slide properties. So, if a non-null value is specified for the =slideBindings= state property, it does not mean that all slide properties must be bound explicitly. Rather, any slide property for which an explicit binding is not declared in the =slideBindings= state property will be attempted to be bound using the `implicit bindings` facility.
*/

Uize.module ({
	name:'Uize.Widget.SlideShow',
	required:'Uize.Widget.Button',
	builder:function (_superclass) {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_undefined,

			/*** General Variables ***/
				_sacredEmptyArray = [],
				_sacredEmptyObject = {}
		;

		/*** Private Instance Methods ***/
			function _conformSlideNo (m,_slide) {
				var
					_result = -1,
					_totalSlides = _getTotalSlides (m)
				;
				if (_totalSlides) {
					if (_slide == _undefined || typeof _slide == 'number') {
						_result = _slide == _undefined ? m._slideNo : _slide;
						_result = m._wrap
							? ((_result % _totalSlides) + _totalSlides) % _totalSlides
							: Uize.constrain (_result,0,_totalSlides - 1)
						;
					} else {
						_result = Uize.indexIn (m._slides,_slide);
					}
				}
				return _result;
			}

			function _getTotalSlides (m) {
				return (m._slides || _sacredEmptyArray).length;
			}

			function _updateUiButtonsEnabled () {
				var
					m = this,
					_children = m.children
				;
				if (_children.previous) {
					var
						_updateButtonState = function (_buttonName,_canNavigate) {
							_children [_buttonName].set ({enabled:_totalSlides && _canNavigate ? 'inherit' : false});
						},
						_totalSlides = m._totalSlides,
						_slideNo = m._slideNo,
						_notAtFirst = !!_slideNo,
						_notAtLast = _slideNo != _totalSlides - 1
					;
					_updateButtonState ('previous',_notAtFirst || m._wrap);
					_updateButtonState ('first',_notAtFirst);
					_updateButtonState ('next',_notAtLast || m._wrap);
					_updateButtonState ('last',_notAtLast);
				}
			}

			function _updateUiSlideProperty (m,_propertyName,_propertyValue,_propertyNodeId) {
				var
					_propertyBinding =
						(m._slideBindings || _sacredEmptyObject) [_propertyName] ||
						m.children ['slide' + Uize.capFirstChar (_propertyName)]
				;
				_propertyBinding
					? (
						Uize.isFunction (_propertyBinding)
							? _propertyBinding.call (m,_propertyValue)
							: _propertyBinding.set ({value:_propertyValue})
					)
					: m.isWired && m.setNodeValue (_propertyNodeId || _propertyName,_propertyValue)
				;
			}

			function _updateUiSlide (m) {
				var _slide = m._slide;
				for (var _slideProperty in _slide)
					_updateUiSlideProperty (m,_slideProperty,_slide [_slideProperty],'slide_' + _slideProperty)
					/*?
						Child Widgets
							slide[PropertyName]
								An instance of any widget class that implements the `value interface` (i.e. provides a =value= state property), and that will be used to represent the value for a corresponding slide property of the name =propertyName=.

								For example, a child widget that is intended to represent the value for a slide property named =imageUrl= should be named =slideImageUrl=. An arbitrary number of child widgets may be added to an instance of the =Uize.Widget.SlideShow= class, for the purpose of representing the values of slide properties through the `child widget bindings` facility.

						DOM Nodes
							slide_[propertyName]
								An element node of any type, that will be used to represent the value for a corresponding slide property of the name =propertyName=.

								For example, a DOM node that is intended to represent the value for a slide property named =imageUrl= should be named =slide_imageUrl=. An arbitrary number of DOM nodes may exist in the DOM for an instance of the =Uize.Widget.SlideShow= class, for the purpose of representing the values of slide properties through the `DOM node bindings` facility.
					*/
				;
			}

			function _updateUiProgress (m) {
				_updateUiSlideProperty (m,'progress',m._progress);
			}

			function _updateUiSlideNo (m) {
				_updateUiSlideProperty (m,'slideNumber',m._slideNo + 1);
			}

			function _updateUiTotalSlides (m) {
				_updateUiSlideProperty (m,'totalSlides',m._totalSlides);
			}

		/*** shared onChange functions ***/
			function _calculateProgress () {
				var _totalSlides = this._totalSlides;
				this.set ({_progress:_totalSlides ? Math.round ((this._slideNo + 1) / _totalSlides * 100) : 0});
			}
			function _calculateSlide () {
				this.set ({_slide:(this._slides || _sacredEmptyArray) [_conformSlideNo (this,this._slideNo)] || null});
			}

		return _superclass.subclass ({
			omegastructor:function () {
				var m = this;

				/*** add navigation buttons ***/
					m.addChildren (
						{
							previous:{action:function () {m.advance (-1)}},
							next:{action:function () {m.advance (1)}},
							first:{action:function () {m.set ({_slideNo:0})}},
							last:{action:function () {m.set ({_slideNo:m._totalSlides - 1})}}
						},
						{widgetClass:Uize.Widget.Button}
					);

					/*?
						Child Widgets
							first
								An instance of =Uize.Widget.Button=, that is wired up as part of the `navigation control`, and that advances the slideshow to the first slide in the set.

								NOTES
								- this button becomes disabled when the slideshow is at the first slide, or if the =slides= array is empty
								- the markup for this child widget is optional, and a given implementation of a slideshow widget in HTML does not need to offer a =first= button

							last
								An instance of =Uize.Widget.Button=, that is wired up as part of the `navigation control`, and that advances the slideshow to the last slide in the set.

								NOTES
								- this button becomes disabled when the slideshow is at the last slide, or if the =slides= array is empty
								- the markup for this child widget is optional, and a given implementation of a slideshow widget in HTML does not need to offer a =last= button

							next
								An instance of =Uize.Widget.Button=, that is wired up as part of the `navigation control`, and that advances the slideshow to the next slide.

								NOTES
								- this button becomes disabled when the slideshow is at the last slide and =wrap= is set to =false=, or if the =slides= array is empty
								- the markup for this child widget is optional, and a given implementation of a slideshow widget in HTML does not need to offer a =next= button

							previous
								An instance of =Uize.Widget.Button=, that is wired up as part of the `navigation control`, and that advances the slideshow to the previous slide.

								NOTES
								- this button becomes disabled when the slideshow is at the first slide and =wrap= is set to =false=, or if the =slides= array is empty
								- the markup for this child widget is optional, and a given implementation of a slideshow widget in HTML does not need to offer a =previous= button
					*/

				/*** Initialization ***/
					m.updateUi (); // doing this early, because some updates are properties for child widgets
			},

			instanceMethods:{
				updateUi:function () {
					var m = this;
					_updateUiButtonsEnabled.call (m);
					_updateUiSlideNo (m);
					_updateUiProgress (m);
					_updateUiTotalSlides (m);
					_updateUiSlide (m);
				},

				advance:function (_direction) {
					this.set ({_slideNo:this._slideNo + _direction});
					/*?
						Instance Methods
							advance
								Lets you advance the position within the slideshow by a specified amount.

								SYNTAX
								......................................
								myInstance.advance (advanceAmountINT);
								......................................

								Specifying a positive number for the =advanceAmountINT= parameter navigates forwards in the slideshow, while specifying a negative number navigates backwards. Typically, this method would be used to advance one slide in either direction, as in...

								..........................................
								myInstance.advance (-1); // previous slide
								myInstance.advance (1);  // next slide
								..........................................

								This method is offered merely as a convenience. There is nothing terribly special about it, and the same effect could be accomplished simply by modifying the value of the =slideNo= state property, as in...

								............................................................................
								myInstance.set ({slideNo:myInstance.get ('slideNo') - 1}); // previous slide
								myInstance.set ({slideNo:myInstance.get ('slideNo') + 1}); // next slide
								............................................................................

								The behavior when advancing in a negative direction beyond the first slide, or advancing in a positive direction beyond the last slide is governed by the =wrap= state property.

								NOTES
								- see the =slideNo= and =wrap= state properties
					*/
				}
			},

			stateProperties:{
				_progress:{
					name:'progress',
					onChange:function () {_updateUiProgress (this)}
					/*?
						State Properties
							progress
								An integer, representing the progress (measured in percentage) through the entire set of slides.

								The value of this read-only property is derived from the values of the =slideNo= and =totalSlides= state properties and is not intended to be set by an application.

								NOTES
								- this property is read-only
								- the initial value is =0=
					*/
				},
				_slide:{
					name:'slide',
					onChange:function () {_updateUiSlide (this)}
					/*?
						State Properties
							slide
								An object, representing the element in the =slides= array that corresponds to the current slide (as specified by the =slideNo= property).

								The value of this read-only property is derived from the values of the =slideNo= and =slides= state properties and is not intended to be set by an application. As the values of the =slideNo= and =slides= properties are modified, the =slide= property is automatically updated and kept current.

								NOTES
								- this property is read-only
								- if the =slides= state property is set to =null= or =undefined=, or if the =slides= array has zero elements, then the =slide= property will be set to =null=
								- the initial value is =undefined=
					*/
				},
				_slideBindings:'slideBindings',
					/*?
						State Properties
							slideBindings
								An object, representing explicit bindings between slide properties and =Uize.Class= subclass instances or handler functions.

								The name of each key in the =slideBindings= object should correspond to the name of a property in the =slide= object, and its value should be either a reference to an instance of a =Uize.Class= subclass that implements the `value interface` (i.e. provides a =value= state property), or an update handler function that will be executed when the value of the =slide= state property changes. It is not necessary to provide a binding for every slide property, and any slide property for which no explicit binding is provided will be bound implicitly to either a child widget or a DOM node.

								For more details on property bindings, consult the section `Slide Property Bindings`.

								NOTES
								- the initial value is =undefined=
					*/
				_slideNo:{
					name:'slideNo',
					conformer:function (_value) {return _conformSlideNo (this,_value)},
					onChange:[
						_calculateSlide,
						_calculateProgress,
						function () {_updateUiSlideNo (this)},
						_updateUiButtonsEnabled
					],
					value:-1
					/*?
						State Properties
							slideNo
								An integer, representing the current position within the slideshow presentation.

								The value of this property can be set in order to jump straight to a different position in the slideshow, and the slideshow will update automatically - including updating the navigation buttons to the appropriate state.

								NOTES
								- see also the =advance= instance method
								- if the =slides= state property is set to =null= or =undefined=, or if the =slides= array has zero elements, then the =slideNo= property will be set to =-1=
								- the initial value is =-1=
					*/
				},
				_slides:{
					name:'slides',
					onChange:[
						function () {
							this.set ({
								_slideNo:this._slideNo == -1 ? 0 : this._slideNo,
								_totalSlides:_getTotalSlides (this)
							});
						},
						_calculateSlide
					],
					value:[]
					/*?
						State Properties
							slides
								An array, representing the set of slides for the slideshow, where each element of the array should be an object whose properties can be presented in the user interface.

								NOTES
								- the initial value is =[]= (an empty array)
					*/
				},
				_totalSlides:{
					name:'totalSlides',
					onChange:[
						_calculateProgress,
						function () {_updateUiTotalSlides (this)},
						_updateUiButtonsEnabled
					]
					/*?
						State Properties
							totalSlides
								An integer, specifying the total number of slides in the slides set.

								The value of this read-only property will correspond to the length of the array specified by the =slides= set-gt property, but if =slides= is set to =null= or =undefined=, then =totalSlides= will be set to the value =0=.

								NOTES
								- this property is read-only
								- the initial value is =0=
					*/
				},
				_wrap:{
					name:'wrap',
					value:false,
					onChange:_updateUiButtonsEnabled
					/*?
						State Properties
							wrap
								A boolean, specifying whether or not navigation should be allowed beyond the beginning or end of the set of slides.

								By default, navigation is not permitted beyond the beginning or end of the set of slides, and the previous and next buttons become disabled when reaching the beginning or end of the set, respectively. Moreover, attempting to set the value of the =slideNo= state property outside of the range of the slides set causes it to be conformed to the beginning or the end of the set.

								But when the =wrap= state property is set to =true=, then the previous and next buttons will remain enabled, and navigating to the previous slide when at the first slide will cause =slideNo= to "wrap" around to the last slide, and navigating to the next slide when at the last slide will cause =slideNo= to "wrap" around to the first slide.

								Moreoever, attempting to set the value of the =slideNo= state property outside of the range of the slides set causes it to be conformed to within the range by "wrapping" its value around as many times as needed in order to bring it into range. For example, in a set of ten slides and  when =wrap= is set to =true=, setting the =slideNo= property to =13= will cause it to be conformed to =3= (wrapped around forwards once), and setting =slideNo= to =-23= will cause it to be conformed to =7= (wrapped around backwards twice and then third from the end).

								NOTES
								- the initial value is =false=
					*/
				}
			}
		});
	}
});

