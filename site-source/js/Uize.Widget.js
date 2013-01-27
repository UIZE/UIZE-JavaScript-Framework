/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2005-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 9
	codeCompleteness: 90
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Widget= class serves as the base class for widgets in the UIZE JavaScript Framework, providing services to ease the implementation of widgets.

		*DEVELOPERS:* `Chris van Rensburg`, `Ben Ilegbodu`, `Vinson Chuong`

		An Abstract Class
			The =Uize.Widget= class is primarily an abstract class, intended for the creation of widget subclasses.

			That said, however, it is possible and sometimes useful to create instances of this class that will act as wrappers for sets of child widgets in order to achieve functional grouping for the child widgets within a widget class. Child widgets grouped together in this way can then be enabled or disabled as a group, separately from the other child widgets.
*/

Uize.module ({
	name:'Uize.Widget',
	superclass:'Uize.Class',
	required:'Uize.Node',
	builder:function (_superclass) {
		'use strict';

		/*** Variables for Optimization ***/
			var
				/*** Scruncher Optimization ***/
					_null = null,
					_true = true,
					_false = false,
					_typeString = 'string',
					_Uize = Uize,
					_isFunction = _Uize.isFunction,
					_concatenated = 'concatenated',
					_undefined,
					_Uize_Node = _Uize.Node,
					_Uize_Node_doForAll = _Uize_Node.doForAll,

				/*** References for Performance Optimization ***/
					_Uize_Node_isNode = _Uize_Node.isNode,
					_Uize_Node_getById = _Uize_Node.getById
			;

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					function (_properties) {
						var _this = this;

						if (_properties) {
							/*** try to harvest declarative widget properties ***/
								var _declarativeWidgetProperties =
									_this._harvestDeclarativeWidgetProperties (_properties.idPrefix,_properties.parent)
								;
								_declarativeWidgetProperties && _Uize.copyInto (_properties,_declarativeWidgetProperties);

							delete _properties.widgetClass;
						}

						/*** Private Instance Properties ***/
							_this._unappliedChildrenProperties = {};

						/*** Public Instance Properties ***/
							_this.children = _this._children = {};
								/*?
									Instance Properties
										children ~~ children Instance Property
											An object, each of whose properties is a reference to one of a widget's child widgets.

											For example, an instance of the =Uize.Widget.SlideShow= class assigned to the variable =mySlideShow= may have child widgets that can be referenced as follows...

											.............................
											mySlideShow.children.first
											mySlideShow.children.last
											mySlideShow.children.previous
											mySlideShow.children.next
											.............................

											Don't Directly Modify the children Object
												The contents of the =children= object is managed by the various instance methods of the =Uize.Widget= class, such as the =addChild= and =removeChild= methods.

												One should not directly modify the contents of the =children= object, but should only do this through the child widget management methods.

											The Special children state Property
												The =children= instance property has a companion state property of the same name, but which has a special behavior.

												The `children state property` provides a convenient way to distribute widget properties to any or all of a widget's child widgets.

											NOTES
											- the =children= object is read-only - its contents should not be directly modified
											- see also the special `children state property`
											- see also the related =parent= instance property
								*/
					}
				),
				_classPrototype = _class.prototype
			;

		/*** Private Instance Methods ***/
			_classPrototype._harvestDeclarativeWidgetProperties = function (_idPrefix,_parent) {
				var
					_properties,
					_globalVariableName
				;
				(
					_idPrefix &&
					(_properties = window [_globalVariableName = '$' + _idPrefix]) &&
					typeof _properties == 'object' &&
					(!_parent || _idPrefix != _parent._idPrefix)
						/* NOTE:
							There are still some widgets that are implemented using child widgets where the idPrefix of the child widgets is set to that of the parent widget, and we don't want the global qualifier properties being applied to those child widgets, so we check for this condition.
						*/
				)
					? (window [_globalVariableName] = _undefined)
						/* NOTE:
							We've harvested the global variable for the declarative widget properties, so we set it to undefined so there aren't lingering references to the data lying around (which could impact memory usage).
						*/
					: (_properties = _undefined)
				;
				return _properties;
			};

			_classPrototype._applyDeclarativeWidgetProperties = function () {
				var
					_this = this,
					_declarativeWidgetProperties = _this._harvestDeclarativeWidgetProperties (_this._idPrefix,_this.parent)
				;
				_declarativeWidgetProperties && _this.set (_declarativeWidgetProperties);
			};

			_classPrototype._constructIdPrefix = function (_parentIdPrefix,_childIdPrefix,_childName,_idPrefixConstruction) {
				return (
					(!_idPrefixConstruction || _idPrefixConstruction == _concatenated) && _parentIdPrefix != _undefined
						? (_parentIdPrefix + (_childName !== '' ? '_' : '') + _childName)
						: (_idPrefixConstruction == 'same as parent' ? _parentIdPrefix : _childIdPrefix)
				);
			};

			function _declareTreeInheritedProperty (_propertyPrivateToPublicNameMapping,_defaultValue) {
				var
					_propertyPrivateNames = _Uize.keys (_propertyPrivateToPublicNameMapping),
					_propertyPublicNames = _Uize.values (_propertyPrivateToPublicNameMapping),
					_propertyPrivateName = _propertyPrivateNames [0],
					_propertyInheritedPrivateName = _propertyPrivateNames [1]
				;
				function _checkInherited () {
					var _value = this [_propertyPrivateName];
					if (_value == 'inherit')
						_value = this.parent ? this.parent [_propertyInheritedPrivateName] : _defaultValue
					;
					if (_value != this [_propertyInheritedPrivateName])
						this.set (_propertyInheritedPrivateName,_value)
					;
				}
				_class.stateProperties (
					_Uize.pairUp (
						_propertyPrivateName,
						{
							name:_propertyPublicNames [0],
							onChange:_checkInherited,
							value:'inherit'
						},
						_propertyInheritedPrivateName,
						{
							name:_propertyPublicNames [1],
							onChange:function () {_Uize.callOn (this._children,_checkInherited)},
							value:_defaultValue
						}
					)
				);
			}

			_classPrototype._tryUseConfirmInheritedFromTree = function (_mode,_params,_builtInConfirmFallback) {
				var _promptMethodName = 'show' + _Uize.capFirstChar (_mode);
				this.getProvider (_promptMethodName)
					? this.callInherited (_promptMethodName) (_params)
					:
						setTimeout (
							function () {
								var _confirmed = _builtInConfirmFallback ();
								(_params.callback || (_confirmed ? _params.yesHandler : _params.noHandler) || _Uize.nop)
								(_confirmed)
							},
							0
						)
				;
			};

		/*** Public Instance Methods ***/
			_classPrototype.confirm = function (_params) {
				this._tryUseConfirmInheritedFromTree (
					'confirm',_params,function () {return confirm (_params.message)}
				);
				/*?
					Instance Methods
						confirm
							Lets you obtain user confirmation through a decorated HTML dialog.

							SYNTAX
							............................
							myWidget.confirm (paramOBJ);
							............................

							PARAMS
							...................................................................................
							{
								title:titleSTR,           // text to display in dialog's title bar (optional)
								message:messageSTR,       // message to display in dialog's content area
								yesHandler:yesFUNC,       // handler for user clicking "ok"
								noHandler:noFUNC,         // handler for user clicking "cancel" or close button
								callback:callbackFUNC,    // handler for user dismissing dialog (ok *or* cancel)

								// IMPLEMENTATION DEPENDENT...

								state:stateSTR,           // info, warning, error, confirm, success (optional)
								okText:okTextSTR,         // text for the ok button of the dialog (optional)
								cancelText:cancelTextSTR  // text for the cancel button of the dialog (optional)
							}
							...................................................................................

							How It Works
								Strictly speaking, the parameters supported by the =paramsOBJ= parameter are determined by the specific implementation of confirm. Technically, what happens when the =confirm= instance method is called is that the widget finds the nearest parent up the parent chain that provides an implementation for the =showConfirm= instance method.

								Typically, =showConfirm= is implemented at the page widget level, but it can also be overrided by parent widgets closer to the widget on which the =confirm= instance method is called. If no =showConfirm= implementation is provided, anywhere up the parent chain, then the browser's default =confirm global function= is used.

								Because a decorated HTML implementation is asynchronous in its behavior, the call to the =confirm= instance method cannot expect the confirmation value to be returned to it as a result, so the confirmation logic must be coded asynchronously by providing callback handlers - even in the case where this class resorts to using the built-in =confirm global function=.

								You can provide callback handlers for either or both of the yes and no states, using the =yesHandler= and =noHandler= parameters, respectively, or you can provide a generic handler through the =callback= parameter, where your callback will be called with a single parameter that represents the confirmation value.

							EXAMPLE
							.......................................................................
							myWidget.confirm ({
								title:'Confirm Delete',
								message:'Are you sure you would like to delete the selected items?',
								okText:'YES, DELETE',
								cancelText:'NO, DON\'T DELETE',
								yesHandler:function () {myWidget.deleteSelected ()}
							});
							.......................................................................

							NOTES
							- see also the companion =inform= instance method
				*/
			};

			_classPrototype.showInform = _classPrototype.showConfirm = _undefined;
				/*?
					State Properties
						showInform
							The implementation for a decorated inform (ie. alert) dialog.

							This method will be used when the =infom= instance method is called. This method is typically implemented at the page widget level, although it can also be implemented by child widgets at any level on the widget tree.

							NOTES
							- the initial value is =undefined=
							- see the =inform= instance method
							- see also the companion =showConfirm= instance method

						showConfirm
							The implementation for a decorated confirmation dialog.

							This method will be used when the =confirm= instance method is called. This method is typically implemented at the page widget level, although it can also be implemented by child widgets at any level on the widget tree.

							NOTES
							- the initial value is =undefined=
							- see the =confirm= instance method
							- see also the companion =showInform= instance method
				*/

			_classPrototype.inform = function (_params) {
				this._tryUseConfirmInheritedFromTree (
					'inform',_params,function () {alert (_params.message); return _true}
				)
				/*?
					Instance Methods
						inform
							Lets you provide information to the user in a decorated HTML dialog.

							SYNTAX
							...........................
							myWidget.inform (paramOBJ);
							...........................

							PARAMS
							...................................................................................
							{
								title:titleSTR,           // text to display in dialog's title bar (optional)
								message:messageSTR,       // message to display in dialog's content area
								callback:callbackFUNC,    // handler for user dismissing dialog (ok *or* cancel)

								// IMPLEMENTATION DEPENDENT...

								state:stateSTR,           // info, warning, error, confirm, success (optional)
								okText:okTextSTR          // text for the ok button of the dialog (optional)
							}
							...................................................................................

							How It Works
								Strictly speaking, the parameters supported by the =paramsOBJ= parameter are determined by the specific implementation of inform. Technically, what happens when the =inform= instance method is called is that the widget finds the nearest parent up the parent chain that provides an implementation for the =showInform= instance method.

								Typically, =showInform= is implemented at the page widget level, but it can also be overrided by parent widgets closer to the widget on which the =inform= instance method is called. If no =showInform= implementation is provided, anywhere up the parent chain, then the browser's default =alert global function= is used.

								Because a decorated HTML implementation is asynchronous in its behavior, the inform logic must be coded asynchronously by providing a callback handler through the =callback= parameter - even in the case where this class resorts to using the built-in =alert global function=.

							EXAMPLE
							.........................................................................
							myWidget.inform ({
								title:'Items Deleted',
								message:'The items that you selected have been successfully deleted.',
								okText:'OK'
								callback:function () {
									// continuation code
								}
							});
							.........................................................................

							NOTES
							- see also the companion =confirm= instance method
							- no "cancel" button is shown for information dialogs
				*/
			};

			_classPrototype.ajax = function (_serviceParams,_requestParams) {
				this.callInherited ('performAjax') (
					_serviceParams,
					_Uize.isFunction (_requestParams) ? {callback:_requestParams} : _requestParams || {}
				)
				/*?
					Instance Methods
						ajax
							Performs an asynchronous service (Ajax) request with the specified service parameters and (optional) request parameters.

							SYNTAX
							..................................................
							myWidget.ajax (serviceParamsOBJ,requestParamsOBJ);
							..................................................

							The =serviceParamsOBJ= contains parameters needed by the service (typically what is passed on the query string or as post data in the request). The =requestParamsOBJ= contains parameters used in configuring the request itself, such as callbacks, caching level, request method, etc.

							EXAMPLE
							..................................................
							myWidget.ajax (
								{
									action:'getresults',
									query:'dog shirts',
									sort:'price_asc',
									pg:2,
									num:25
								},
								{
									cache:'browser',
									requestMethod:'GET',
									callback:function (responseObj) {
										// Do something with search results data
									}
								}
							);
							..................................................

							Depending on how =ajax= has been implemented for widgets in your site-specific page widget (see `performAjax Implementation`), the resulting Ajax service request could look like:

							..................................................................................................
							http://www.somedomain.com/services?action=getresults&query=dog%20shirts&sort=price_asc&pg=2&num=25
							..................................................................................................

							performAjax Implementation
								Strictly speaking, the parameters supported by the =serviceParamsOBJ= and =requestParamsOBJ= parameters are determined by the specific implementation of =ajax=.

								Technically, what happens when the =ajax= instance method is called is that the widget finds the nearest parent up the parent chain that provides an implementation for the =performAjax= instance method.

								Typically, =performAjax= is implemented at the page widget level, but it can also be overriden by parent widgets closer to the widget on which the =ajax= instance method is called. If no =performAjax= implementation is provided, anywhere up the parent chain, then no Ajax request would be made and the code will fail silently. There is no default implementation for =ajax= aside from supporting the variations outlined below.

								SAMPLE IMPLEMENTATION
								.........................................................................
								_classPrototype.performAjax = function (_serviceParams,_requestParams) {
									this._commObject.request ({
										url:['http://www.somedomain.com/services',_requestParams],
										returnType:'json',
										requestMethod:_requestParams.requestMethod || 'POST',
										cache:_requestParams.cache,
										callback:_requestParams.callback
									})
								};
								.........................................................................

								The above sample implementation assumes that there is a private reference to a comm object, which could be an instance of either the =Uize.Comm.Ajax= or the =Uize.Comm.Iframe= class, and that was most likely created in the constructor of this widget.

							The base implementation of =ajax= does not contain code to make an Ajax request; it is up to your site-specific implementation to handle this (see `performAjax Implementation`). However, the base implementation does support abstract variations to =ajax= so that the site-specific implementation only has to deal with the single method syntax outlined above.

							VARIATION 1
							..............................................
							myWidget.ajax (serviceParamsOBJ,callbackFUNC);
							.............................................

							This variation supports just passing a callback function (with no additional request parameters) as the second parameter to =ajax=.

							EXAMPLE
							................................................
							myWidget.ajax (
								{
									action:'getresults',
									query:'dog shirts',
									sort:'price_asc',
									pg:2,
									num:25
								},
								function (responseObj) {
									// Do something with search results data
								}
							);
							..............................................

							This would be equivalent to...

							................................................
							myWidget.ajax (
								{
									action:'getresults',
									query:'dog shirts',
									sort:'price_asc',
									pg:2,
									num:25
								},
								{
									callback:function (responseObj) {
										// Do something with search results data
									}
								}
							);
							.................................................

							VARIATION 2
							.................................
							myWidget.ajax (serviceParamsOBJ);
							.................................

							In this variation, the =requestParamsOBJ= parameter is completely ommitted. This variation is useful when you do not need to alter how the Ajax request is made and calling a callback is unnecessary. Making an Ajax request without a callback is typically rare, but there are some use cases where it is appropriate, such as when logging information.
				*/
			};

			_classPrototype.localize = function (_resourceId,_substitutions,_tokenNaming) {
				var
					_localizedResource,
					_widget = this
				;
				while (
					!(_localizedResource = _widget._localized ? _widget._localized [_resourceId] : _undefined) &&
					(_widget = _widget.parent)
				);
				return (
					_isFunction (_localizedResource)
						? _localizedResource.call (this,_substitutions)
						: _Uize.substituteInto (_localizedResource,_substitutions,_tokenNaming || '{KEY}')
				);
				/*?
					Instance Methods
						localize
							Returns a string value, representing the localized version of the specified resource string or function.

							SYNTAX
							.........................................................................
							localizedSTR = myWidget.localize (resourceIdSTR,substitutionsARRAYorOBJ);
							.........................................................................

							When an array is specified for the =substitutionsARRAYorOBJ= parameter, the values in the array will be substituted for the tokens ={0}=, ={1}=, ={2}=, ..., ={N}=, where N is the index of the last element in the array.

							EXAMPLE
							.....................................................................................
							myWidget.set ({localized:{welcomeMessage:'Welcome, {0} of {1}, {2}'}});
							var localWelcome = myWidget.localize ('welcomeMessage',['Chris','California','USA']);
							.....................................................................................

							The above example would produce the result ='Welcome, Chris of California, USA'=.

							When an object is specified for the =substitutionsARRAYorOBJ= parameter, then the keys (property names) of the object are assumed to be the token names.

							EXAMPLE
							.........................................................................................
							myWidget.set ({localized:{welcomeMessage:'Welcome, {firstName} of {state}, {country}'}});
							var localWelcome = myWidget.localize (
								'welcomeMessage',
								{firstName:'Chris',state:'California',country:'USA'}
							);
							.........................................................................................

							The above example would also produce the result ='Welcome, Chris of California, USA'=.

							VARIATION 1
							............................................................................
							localizedSTR = myWidget.localize (resourceIdSTR,substitutionSTRorBOOLorNUM);
							............................................................................

							When a simple type =substitutionSTRorBOOLorNUM= parameter is specified in place of a hash or array of multiple substitutions, then the specified simple type value will be substituted for the token ={0}=.

							EXAMPLE
							................................................................
							myWidget.set ({localized:{welcomeMessage:'Welcome, {0}'}});
							var localWelcome = myWidget.localize ('welcomeMessage','Chris');
							................................................................

							The above example would produce the result ='Welcome, Chris'=.

							VARIATION 2
							.................................................
							localizedSTR = myWidget.localize (resourceIdSTR);
							.................................................

							When no =substitutionsARRAYorOBJ= or =substitutionSTRorBOOLorNUM= parameter is specified, then no substitution will be performed - the localized resource string will be looked up and simply returned as is. If the localized resource is a function (see the section `Function Type Resources`), then it will simply be called with an =undefined= value as its input parameter.

							EXAMPLE
							........................................................
							myWidget.set ({localized:{welcomeMessage:'Welcome'}});
							var localWelcome = myWidget.localize ('welcomeMessage');
							........................................................

							The above example would produce the result ='Welcome'=.

							VARIATION 3
							.....................................................................................
							localizedSTR = myWidget.localize (resourceIdSTR,substitutionsANYTYPE,tokenNamingSTR);
							.....................................................................................

							When the optional =tokenNamingSTR= parameter is specified, the syntax of the tokens that will be substituted can be controlled. This facility provides a lot of flexibility in how tokens are formatted inside localized resource strings. The value specified for the =tokenNamingSTR= parameter should be a string containing the text ='KEY'= somewhere inside it, where that segment will be replaced with the name for a given key. So, for example, a value of ='[KEY]'= for the =tokenNamingSTR= parameter would produce the token name ='[firstName]'= for the substitution key ='firstName'=. Consider the following example...

							EXAMPLE
							.........................................................................................
							myWidget.set ({localized:{welcomeMessage:'Welcome, [firstName] of [state], [country]'}});
							var localWelcome = myWidget.localize (
								'welcomeMessage',
								{firstName:'Chris',state:'California',country:'USA'},
								'[KEY]'
							);
							.........................................................................................

							The above example would also produce the result ='Welcome, Chris of California, USA'=.

							Providence
								An important feature of the =localize= method is its ability to go up the parent chain of a widget to find the nearest parent widget that provides a value for the specified resource in its =localized= state property.

								This allows localized resources to be declared with the top-most parent widget in a page - the page widget - if that is what proves most convenient for the application. Additionally, a parent widget might define a value for a localized resource which is overrided by a child widget's =localized= resources map.

								EXAMPLE
								.....................................................................................
								myWidget.parent.set ({localized:{welcomeMessage:'Welcome, {0} of {1}, {2}'}});
								myWidget.set ({localized:{}});
								var localWelcome = myWidget.localize ('welcomeMessage',['Chris','California','USA']);
								.....................................................................................

								The above example would still produce the result ='Welcome, Chris of California, USA'=, even though the localized resource string is not declared with the =myWidget= instance, but its parent instead.

							Function Type Resources
								A simple yet powerful feature of the =localize= method is its support for function type resources.

								Typically, a localized resource will be a string. In some cases, such strings will have substitution tokens and the =localize= method will need to be called with one or more substitution values. In exceptional cases, plain old token substitution may not be adequate and more sophisticated string construction may be necessary. In such cases, a function type resource can be used.

								For a detailed discussion of this feature, complete with examples, consult the section `Function Type Localized Resources` of the explainer [[../explainers/javascript-localization.html][JavaScript Localization]].

							NOTES
							- see also the =localized= state property.
				*/
			};

			_classPrototype.buildHtml = function (_alternateTemplateInput) {
				var
					_this = this,
					_html = _this._html
				;
				if (_html != _undefined) {
					var _nodeToInjectInto = _this._container || _this.getNode ('shell') || _this.getNode ();
					/*?
						Implied Nodes
							Root Node
								The optional `root node` of a widget is the implied node with the name =''= (empty string).

								The =id= for the root node of a widget instance is the value of that instance's =idPrefix= state property - there is no "-" (hyphen) separating the =idPrefix= and the empty implied node name. So, for an instance of the slider class with its =idPrefix= set to the value ='mySlider'=, the id of that instance's root node would be just =mySlider=.

								A reference to the root node can be obtained by either specifying the value =''= (empty string) or no =impliedNodeSTRorBLOB= parameter when calling the =getNode= instance method, as in...

								............................................
								var theRootNode = myWidget.getNode ();
								var alsoTheRootNode = myWidget.getNode ('');
								............................................

								Similarly, when using the `node related instance methods`, one can specify the value =''= (empty string), as in...

								....................................................................................
								myWidget.displayNode ('',false); // hide myWidget, if it has a root node in its HTML
								....................................................................................

							shell
								The optional =shell= implied node for a widget instance provides a "slot" in the document into which markup for that instance can be inserted.
					*/
					if (_html === _true) {
						_html = _this._html = _Uize.Template && _nodeToInjectInto
							? {
								process:_Uize.Template.compile (
									(
										_Uize_Node.find ({root:_nodeToInjectInto,tagName:'SCRIPT',type:'text/jst'}) [0] ||
										_nodeToInjectInto
									).innerHTML,
									{openerToken:'[%',closerToken:'%]'}
								)
							}
							: _undefined
						;
						if (!_html) return;
					}
					_this._idPrefix || _this.set ({_idPrefix:_this.instanceId});
					var
						_templateInput = _Uize.copyInto (
						{
							pathToResources:_Uize.pathToResources,
							blankGif:_class.getBlankImageUrl ()
						},
						_alternateTemplateInput || _this.get ()
						),
						_htmlFuncOutput
					;
					_Uize_Node.injectHtml (
						_nodeToInjectInto || document.body,
						typeof _html != _typeString && _isFunction (_html.process)
							? _html.process.call (_this,_templateInput)
							: _isFunction (_html)
								? typeof (_htmlFuncOutput = _html (_templateInput)) === 'string'
									? _Uize.substituteInto (_htmlFuncOutput, _templateInput)
									: _htmlFuncOutput
								: _Uize.substituteInto (_html, _templateInput)
						,
						_this._insertionMode || (_nodeToInjectInto ? 'inner replace' : 'inner bottom')
					);
					_this._nodeCache = _null;
					_this.set ({_built:_true});
				}
				/*?
					Instance Methods
						buildHtml
							Rebuilds the HTML for a widget instance, replacing its existing HTML in the DOM.

							SYNTAX
							......................
							myWidget.buildHtml ();
							......................

							HTML for a widget instance is generated by using the instance's =html= state property. If the value of the =html= property is a function, or is an object with a =process= property whose value is a function, then the HTML generator function will be supplied with the current state of the instance's state properties as input - in the form of a single input object.

							The generator function can either return a string containing HTML markup, a DOM node, or an array of DOM nodes.

							The generated HTML for the widget is inserted into a node in the document, according to a series of fallbacks. Priority is given to the =container= state property. If =container= is set to =null= or =undefined=, then the =shell= implied node is considered. If the =shell= implied node is not present, then the `root node` is considered. If no `root node` is present, then the HTML is inserted at the bottom of the document's body.

							This method always builds the HTML for a widget instance and does not consider the value of the instance's =built= state property. Moreover, after this method has been called, the =built= state property will be set to =true=.

							VARIATION
							...............................................
							myWidget.buildHtml (alternateTemplateInputOBJ);
							...............................................

							When the optional =alternateTemplateInputOBJ= parameter is specified, then the object specified by this parameter will be used as the input for the HTML generator, rather than the current state of the instance's state properties.

							NOTES
							- see also the =shell= and `root node` implied nodes
							- compare to the =insertUi= and =insertOrWireUi= instance methods
				*/
			};

			/*** UI Node Methods ***/
				function _makeNodeMethod (_methodPrefix,_methodSuffix) {
					_classPrototype [_methodPrefix + 'Node' + _methodSuffix] = Function (
						'arguments.length' +
							'?(arguments[0]=this.getNode(arguments[0]))' +
							':(arguments[arguments.length++]=this.getNode());' +
						'return Uize.Node.' + _methodPrefix + _methodSuffix + '.apply(0,arguments)'
					);
				}

				_classPrototype.getNode = function (_nodeBlob) {
					if (_nodeBlob == _null /* null or undefined */) {
						if (_nodeBlob === _null) return _null;
						_nodeBlob = '';
					}
					var _this = this;
					if (_this._nodeMap && typeof _nodeBlob == _typeString) {
						var _remappedNode = _this._nodeMap [_nodeBlob];
						if (_remappedNode !== _undefined)
							_nodeBlob = _remappedNode
						;
					}
					if (typeof _nodeBlob == _typeString) {
						return _Uize_Node_getById (_nodeBlob,_this._idPrefix,_this._nodeCache || (_this._nodeCache = {}));
					} else if (_Uize_Node_isNode (_nodeBlob)) {
						return _nodeBlob;
					} else {
						var _result = _null;
						_Uize_Node_doForAll (
							_nodeBlob,
							function (_node) {(_result || (_result = [])).push (_node)},
							_this._idPrefix,
							_this._nodeCache || (_this._nodeCache = {})
						);
						return _result;
					}
					/*?
						Instance Methods
							getNode
								Returns a reference to the specified implied node of the widget, or an array of references to the specified blob of implied nodes.

								SYNTAX
								..................................................
								nodeOBJ = myWidget.getNode (impliedNodeSTRorBLOB);
								..................................................

								EXAMPLE
								...........................................
								var sliderKnob = mySlider.getNode ('knob');
								...........................................

								Returns the "knob" implied node of the slider widget.

								EXAMPLE
								.........................................
								var sliderRootNode = mySlider.getNode ();
								.........................................

								Returns the `root node` of the slider widget.

								NOTES
								- The =impliedNodeSTRorBLOB= parameter can be a string specifying the name of the implied node, or an object reference to the implied node. When a reference is specified, it is simply returned.
								- When the =impliedNodeSTRorBLOB= parameter has a value of =null=, then the value =null= is returned.
								- When the =impliedNodeSTRorBLOB= parameter has a value of =undefined= or is not specified, then the root node of the widget is returned. This has the same effect as specifying the empty string. (ie. =getNode ()= is equivalent to =getNode ('')=)
					*/
				};

				_makeNodeMethod ('get','Style');
					/*?
						Instance Methods
							getNodeStyle
								Returns the value of the specified style property (or style properties) for the specified implied node.

								SYNTAX
								...............................................................................
								propertyValueSTR = myWidget.getNodeStyle (impliedNodeSTRorOBJ,propertyNameSTR);
								...............................................................................

								VARIATION
								....................................................................................
								stylePropertiesOBJ = myWidget.getNodeStyle (impliedNodeSTRorOBJ,stylePropertiesOBJ);
								....................................................................................

								In order to get the values for multiple style properties in a single call, a style properties object can be specified using the =stylePropertiesOBJ= parameter. The value for this parameter should be an object, where each key is the name of a style property. The values for the individual properties in this object are not important - you can use any dummy values you like.

								EXAMPLE
								.................................................................
								myWidget2.setNodeStyle (
									'title',
									myWidget1.getNodeStyle ('title',{borderWidth:0,borderColor:0})
								);
								.................................................................

								When provided with a =stylePropertiesOBJ= parameter, the =getNodeStyle= method returns a value that is a style properties object, and this object can then be supplied to the =setNodeStyle= instance method. In the above example, values of the =borderWidth= and =borderColor= CSS style properties are being "copied" from the "title" implied node of =myWidget1= to the "title" implied node of =myWidget2=.

								NOTES
								- see also the companion =setNodeStyle= instance method
								- compare to the =Uize.Node.getStyle= and =Uize.Node.setStyle= static methods
					*/

				_makeNodeMethod ('get','Value');
					/*?
						Instance Methods
							getNodeValue
								Returns a string or boolean value, representing the value of the specified implied node of the widget instance.

								SYNTAX
								.................................................................
								nodeValueSTRorBOOL = myWidget.getNodeValue (impliedNodeSTRorOBJ);
								.................................................................

								This method uses the =Uize.Node.getValue= static method in its implementation. For more details, consult the reference for the =Uize.Node= module.

								NOTES
								- see the corresponding =setNodeValue= instance method
								- compare to the =Uize.Node.getValue= static method
					*/

				_classPrototype.flushNodeCache = function (_impliedNodeName) {
					if (this._nodeCache)
						_impliedNodeName == _undefined ? (this._nodeCache = _null) : delete this._nodeCache [_impliedNodeName]
					;
					/*?
						Instance Methods
							flushNodeCache
								Flushes the cached reference to the specified implied node, or all cached node references, from the widget instance's node cache.

								SYNTAX
								.........................................
								myWidget.flushNodeCache (impliedNodeSTR);
								.........................................

								VARIATION
								...........................
								myWidget.flushNodeCache ();
								...........................

								When no =impliedNodeSTR= parameter is specified, the entire node cache for the widget instance will be flushed. This will not affect the functioning of a widget that has already been wired up, but may incur a very small performance cost the next time that operations on implied nodes are performed.
					*/
				};

				_classPrototype.globalizeNode = function (_impliedNode) {
					var
						_this = this,
						_docBody = document.body
					;
					_Uize_Node_doForAll (
						_this.getNode (_impliedNode),
						function (_node) {
							if (_node.parentNode != _docBody) {
								(_this._globalizedNodes || (_this._globalizedNodes = [])).push (_node);
								_Uize_Node.setStyle (_node,{position:'absolute',left:-10000,top:-10000});
								_docBody.appendChild (_node);
							}
						}
					);
					/*?
						Instance Methods
							globalizeNode
								SYNTAX
								..............................................
								myWidget.globalizeNode (impliedNodeSTRorBLOB);
								..............................................
					*/
				};

				_makeNodeMethod ('display','');
					/*?
						Instance Methods
							displayNode
								Lets you display or hide the specified implied node, using the =display= CSS style property.

								SYNTAX
								...............................................................
								myWidget.displayNode (impliedNodeSTRorBLOB,mustDisplayANYTYPE);
								...............................................................

								While typically a Boolean, the =mustDisplayANYTYPE= parameter can be of any type and the node will be displayed if it resolves to =true=, and hidden if it resolves to =false= - with the exception of =undefined=, when the node will be displayed (see explanation below).

								VARIATIONS
								............................................
								myWidget.displayNode (impliedNodeSTRorBLOB);
								............................................

								When no =mustDisplayANYTYPE= parameter is specified (or when its value is =undefined=), the node will be displayed.

								NOTES
								- compare to the =showNode= instance method
								- compare to the =Uize.Node.display= static method
					*/

				_makeNodeMethod ('inject','Html');
					/*?
						Instance Methods
							injectNodeHtml
								Lets you inject the specified HTML markup into the specified implied node, using the specified injection mode.

								SYNTAX
								.....................................................................
								myWidget.injectNodeHtml (impliedNodeSTRorBLOB,htmlSTR,injectModeSTR);
								.....................................................................

								This method uses the =Uize.Node.injectHtml= static method in its implementation. For more details and for a more in-depth discussion of the supported injection modes and how they behave, consult the reference for the =Uize.Node= module.

								VARIATION
								.......................................................
								myWidget.injectNodeHtml (impliedNodeSTRorBLOB,htmlSTR);
								.......................................................

								When no =injectModeSTR= parameter is specified, then the default injection mode ='inner bottom'= will be used.

								NOTES
								- compare to the =setNodeInnerHtml= instance method
								- compare to the =Uize.Node.injectHtml= static method
					*/

				_classPrototype.removeNode = function (_impliedNode) {
					_Uize_Node.remove (this.getNode (_impliedNode));
					this.flushNodeCache (_impliedNode);
						/* TO DO!!!
							if a node blob is specified for _impliedNode, the current implementation of flushNodeCache will not succeed in flushing the specified nodes
						*/
					/*?
						Instance Methods
							removeNode
								Removes the specified implied node (or nodes) from the DOM.

								SYNTAX
								...........................................
								myWidget.removeNode (impliedNodeSTRorBLOB);
								...........................................
					*/
				};

				_makeNodeMethod ('set','Properties');
					/*?
						Instance Methods
							setNodeProperties
								Sets the specified properties for the specified implied node (or nodes).

								SYNTAX
								................................................................
								myWidget.setNodeProperties (impliedNodeSTRorBLOB,propertiesOBJ);
								................................................................

								EXAMPLE
								............................
								myWidget.setNodeProperties (
									'thumbnail',
									{
										src:...,
										width:...,
										height:...,
										title:...
									}
								);
								............................

								NOTES
								- compare to the =Uize.Node.setProperties= static method
					*/

				_makeNodeMethod ('set','Opacity');
					/*?
						Instance Methods
							setNodeOpacity
								Sets the opacity (and, therefore, the transparency) of the specified implied node (or nodes).

								SYNTAX
								.................................................................
								myWidget.setNodeOpacity (impliedNodeSTRorBLOB,opacityFLOATorOBJ);
								.................................................................

								The value of the =opacityFLOATorOBJ= parameter should be a number in the range of =0= to =1=, where =0= represents completely invisible, =1= represents completely opaque, and any fractional values inbetween represent varying degrees of transparency / opacity. Alternatively, if an instance of a =Uize.Class= subclass is specified, then a value will be obtained by invoking the instance's =valueOf Intrinsic Method=.

								NOTES
								- compare to the =Uize.Node.setOpacity= static method
					*/

				_makeNodeMethod ('set','Style');
					/*?
						Instance Methods
							setNodeStyle
								Sets values for an arbitrary set of style attributes for the specified implied node (or nodes).

								SYNTAX
								..............................................................
								myWidget.setNodeStyle (impliedNodeSTRorBLOB,propertyValueSTR);
								..............................................................

								EXAMPLE
								..................................................
								myWidget.setNodeStyle (
									'selector',
									{
										display:'block',
										position:'absolute',
										visibility:'inherit',
										top:'100px'
									}
								);
								..................................................

								When number type values are specified for CSS style properties, those values will be converted to strings by appending the "px" unit. When string type values are specified, the unit should already be present in the value. Instances of =Uize.Class= subclasses can also be specified, and they will be converted to values by invoking their =valueOf Intrinsic Method=. For a more detailed discussion, consult the reference for the =Uize.Node.setStyle= static method.

								NOTES
								- see also the companion =getNodeStyle= instance method
								- compare to the =Uize.Node.getStyle= and =Uize.Node.setStyle= static methods
					*/

				_makeNodeMethod ('set','ClipRect');
					/*?
						Instance Methods
							setNodeClipRect
								Sets the clip style property of the specified implied node (or =Node Blob=) of the widget instance, using the supplied rectangle coordinates.

								SYNTAX
								..................................................................................
								myWidget.setNodeClipRect (impliedNodeSTRorBLOB,leftINT,topINT,rightINT,bottomINT);
								..................................................................................

								- compare to the =Uize.Node.setClipRect= static method
					*/

				_makeNodeMethod ('set','InnerHtml');
					/*?
						Instance Methods
							setNodeInnerHtml
								Set the =innerHTML= property for the specified implied node (or =Node Blob=) to the specified HTML string.

								SYNTAX
								.........................................................
								myWidget.setNodeInnerHtml (impliedNodeSTRorBLOB,htmlSTR);
								.........................................................

								This method uses the =Uize.Node.setInnerHtml= static method in its implementation. For more details, consult the reference for the =Uize.Node= module.

								EXAMPLE
								..............................................................................
								page.setNodeInnerHtml (
									'priceShell',
									'<span class="priceAmount">$' + (priceInCents / 100).toFixed (2) + '</span>
								);
								..............................................................................

								NOTES
								- compare to the =injectNodeHtml= instance method
								- compare to the =Uize.Node.setInnerHtml= static method
					*/

				_makeNodeMethod ('set','Value');
					/*?
						Instance Methods
							setNodeValue
								Sets the value of the specified implied node (or =Node Blob=) of the widget instance.

								SYNTAX
								.................................................................
								myWidget.setNodeValue (impliedNodeSTRorBLOB,valueSTRorBOOLorNUM);
								.................................................................

								This method uses the =Uize.Node.setValue= static method in its implementation. For more details, consult the reference for the =Uize.Node= module.

								NOTES
								- you can use the =setNodeValue= instance method to set values on readonly form elements
								- see the corresponding =getNodeValue= instance method
								- the =value= parameter can be an object that implements a =valueOf= interface (such as an instance of a =Uize.Class= subclass that implements the =value= state property)
								- compare to the =Uize.Node.setValue= static method
					*/

				_makeNodeMethod ('show','');
					/*?
						Instance Methods
							showNode
								Lets you show or hide the specified implied node, using the =visibility= CSS style property.

								SYNTAX
								.........................................................
								myWidget.showNode (impliedNodeSTRorBLOB,mustShowANYTYPE);
								.........................................................

								While typically a Boolean, the =mustShowANYTYPE= parameter can be of any type and the node will be shown if it resolves to =true=, and hidden if it resolves to =false= - with the exception of =undefined=, when the node will be shown (see explanation below).

								VARIATIONS
								.......................................
								myWidget.displayNode (mustShowANYTYPE);
								.......................................

								When no =mustShowANYTYPE= parameter is specified (or when its value is =undefined=), the node will be shown.

								NOTES
								- compare to the =displayNode= instance method
								- compare to the =Uize.Node.show= static method
					*/

				_classPrototype.wireNode = function (_impliedNode,_eventNameOrEventsMap,_handler) {
					arguments.length == 3
						? _Uize_Node.wire (this.getNode (_impliedNode),_eventNameOrEventsMap,_handler,this.instanceId)
						: _Uize_Node.wire (this.getNode (_impliedNode),_eventNameOrEventsMap,this.instanceId)
					;
					/*?
						Instance Methods
							wireNode
								Wires the specified handler function to the specified event, or the specified handlers to the specified events, of the specified implied node (or =Node Blob=) of the widget instance.

								SYNTAX
								.......................................................................
								myWidget.wireNode (impliedNodeSTRorBLOB,eventNameSTR,eventHandlerFUNC);
								.......................................................................

								EXAMPLE
								.....................
								myWidget.wireNode (
									'',
									'click',
									function () {
										// do something
									}
								);
								.....................

								In the above example, a handler is being wired to the =click= event of the widget's `root node`.

								VARIATION
								....................................................................
								myWidget.wireNode (impliedNodeSTRorBLOB,eventNamesToHandlersMapOBJ);
								....................................................................

								When the =eventNamesToHandlersMapOBJ= parameter is specified in place of the =eventNameSTR= and =eventHandlerFUNC= parameters, then this method has the effect of iterating through the event-name-to-handler mappings in the =eventNamesToHandlersMapOBJ= object and wiring the handler for each mapping.

								The contents of the =eventNamesToHandlersMapOBJ= object must be of the form...

								................................
								{
									event1Name:event1HandlerFUNC,
									event2Name:event2HandlerFUNC,
									...
									eventNName:eventNHandlerFUNC
								}
								................................

								EXAMPLE
								...........................
								myWidget.wireNode (
									'',
									{
										mouseover:
											function () {
												// do something
											},
										mouseout:
											function () {
												// do something
											},
										click:function () {
											// do something
										}
									}
								);
								...........................

								In the above example, handlers are being wired to the =mouseover=, =mouseout=, and =click= events of the widget's `root node`.

								NOTES
								- see the companion =unwireNode= instance method
								- compare to the =Uize.Node.wire= static method of the =Uize.Node= module
					*/
				};

				_classPrototype.unwireNode = function (_impliedNode,_eventNameOrEventsMap,_handler) {
					if (_impliedNode !== _undefined)
						_impliedNode = this.getNode (_impliedNode)
					;
					arguments.length == 2 &&
					typeof _eventNameOrEventsMap == 'object' &&
					_eventNameOrEventsMap &&
					!_eventNameOrEventsMap.virtualDomEvent
						? _Uize_Node.unwire (_impliedNode,_eventNameOrEventsMap,this.instanceId)
						: _Uize_Node.unwire (_impliedNode,_eventNameOrEventsMap,_handler,this.instanceId)
					;
					/*?
						Instance Methods
							unwireNode
								Lets you unwire one or more event handlers for the specified implied node.

								SYNTAX
								.........................................................................
								myWidget.unwireNode (impliedNodeSTRorBLOB,eventNameSTR,eventHandlerFUNC);
								.........................................................................

								EXAMPLE
								...............................................
								function clickHandler1 () {alert ('foo')}
								function clickHandler2 () {alert ('bar')}

								myWidget.wireNode ('','click',clickHandler1);
								myWidget.wireNode ('','click',clickHandler2);

								myWidget.unwireNode ('','click',clickHandler1);
								...............................................

								The above example would unwire only the =clickHandler1= handler for the =click= event of the =myWidget= instance's `root node`. So, after the above code has been executed, clicking on the root node of =myWidget= would produce only one alert dialog displaying the text "bar" (so long, foo).

								VARIATION 1
								........................................................
								myWidget.unwireNode (impliedNodeSTRorBLOB,eventNameSTR);
								.......................................................

								When no =eventHandlerFUNC= parameter is specified, then all handlers wired for the specified event of the specified implied node of the widget instance will be unwired.

								EXAMPLE
								.................................
								myWidget.unwireNode ('','click');
								.................................

								The above example would unwire all handlers for the =click= event of the =myWidget= instance's root node.

								VARIATION 2
								......................................................................
								myWidget.unwireNode (impliedNodeSTRorBLOB,eventNamesToHandlersMapOBJ);
								......................................................................

								When the =eventNamesToHandlersMapOBJ= parameter is specified in place of the =eventNameSTR= and =eventHandlerFUNC= parameters, then this method has the effect of iterating through the event-name-to-handler mappings in the =eventNamesToHandlersMapOBJ= object and unwiring the handler for each mapping.

								The contents of the =eventNamesToHandlersMapOBJ= object must be of the form...

								................................
								{
									event1Name:event1HandlerFUNC,
									event2Name:event2HandlerFUNC,
									...
									eventNName:eventNHandlerFUNC
								}
								................................

								EXAMPLE
								..................................................
								function mouseoverHandler () {alert ('mouseover')}
								function mouseoutHandler () {alert ('mouseout')}
								function clickHandler () {alert ('click')}

								myWidget.wireNode (
									'',
									{
										mouseover:mouseoverHandler,
										mouseout:mouseoutHandler,
										click:clickHandler
									}
								);
								myWidget.unwireNode (
									'',
									{
										mouseover:mouseoverHandler,
										mouseout:mouseoutHandler
									}
								);
								..................................................

								In the above example, handlers are being wired to the =mouseover=, =mouseout=, and =click= events of the widget's `root node`. Then the handlers for the =mouseover= and =mouseout= events are being unwired, leaving only the handler that was wired to the =click= event.

								VARIATION 3
								...........................................
								myWidget.unwireNode (impliedNodeSTRorBLOB);
								...........................................

								When no =eventNameSTR= or =eventHandlerFUNC= parameters are specified, then all handlers wired for all events of the specified implied node of the widget instance will be unwired.

								EXAMPLE
								.........................
								myWidget.unwireNode ('');
								.........................

								The above example would unwire all handlers for all events of the =myWidget= instance's root node.

								VARIATION 4
								.......................
								myWidget.unwireNode ();
								.......................

								When no parameters are specified, then all event handlers wired for the entire widget instance will be unwired.

								IMPORTANT

								This method only unwires event handlers that have been wired by the widget instance on which this method is called. Event handlers that may have been wired for the same node(s) by other widget instances or application code are not unwired.

								NOTES
								- see the companion =wireNode= instance method
								- compare to the =unwireNodeEventsByMatch= instance method
								- compare to the =Uize.Node.unwire= static method of the =Uize.Node= module
					*/
				};

				_classPrototype.unwireNodeEventsByMatch = function (_impliedNode,_wiringMatch) {
					this.unwireNode (_impliedNode,(_wiringMatch || (_wiringMatch = {})).eventName,_wiringMatch.handler);
					/*?
						Instance Methods
							unwireNodeEventsByMatch
								Lets you unwire one or more event handlers for the specified implied node, using a wiring match object.

								SYNTAX
								........................................................................
								myWidget.unwireNodeEventsByMatch (impliedNodeSTRorBLOB,wiringtMatchOBJ);
								........................................................................

								The =wiringtMatchOBJ= parameter is an object of the form...
								.......................................................................................
								{
									eventName:eventNameSTR,  // name of event to unwire (optional, all if not specified)
									handler:eventHandlerFUNC // handler to unwire (optional, all if not specified)
								}
								.......................................................................................

								EXAMPLE
								..........................................................
								myWidget.unwireNodeEventsByMatch ('',{eventName:'click'});
								..........................................................

								The above example would unwire all handlers for the =click= event of the =myWidget= instance's `root node`.

								VARIATION 1
								........................................................
								myWidget.unwireNodeEventsByMatch (impliedNodeSTRorBLOB);
								........................................................

								When no =wiringtMatchOBJ= parameter is specified, all handlers wired for all events of the specified implied node of the widget instance will be unwired.

								EXAMPLE
								.............................................
								myWidget.unwireNodeEventsByMatch ('preview');
								.............................................

								The above example would unwire all handlers for all events of the =myWidget= instance's 'preview' implied node.

								VARIATION 2
								....................................
								myWidget.unwireNodeEventsByMatch ();
								....................................

								When no parameters are specified, then all event handlers wired for the entire widget instance will be unwired.

								IMPORTANT

								This method only unwires event handlers that have been wired by the widget instance on which this method is called. Event handlers that may have been wired for the same node(s) by other widget instances or application code are not unwired.

								NOTES
								- see the related =wireNode= instance method
								- compare to the =unwireNode= instance method
					*/
				};

			/*** Hierarchy Related Methods ***/
				_classPrototype.addChild = function (_childName,_childInstanceOrClass,_properties) {
					if (!_properties) _properties = {};
					var
						_this = this,
						_idPrefix = _this._idPrefix,
						_child = _Uize.isInstance (_childInstanceOrClass) ? _childInstanceOrClass : _null,
						_childIdPrefix = 'idPrefix' in _properties ? _properties.idPrefix : _properties.node,
						_childIdPrefixConstruction = _properties.idPrefixConstruction
					;
					_properties.parent = _this;
					if (_childName == _undefined) _childName = _properties.name;
					if (_child) {
						if (_childName == _undefined) _childName = _child._name;
						if (_childIdPrefix == _undefined) _childIdPrefix = _child._idPrefix;
						if (!_childIdPrefixConstruction)
							_childIdPrefixConstruction = _child._idPrefixConstruction
						;
					}
					_properties.idPrefix = _this._constructIdPrefix (
						_idPrefix,
						_childIdPrefix,
						_properties.name = _childName,
						_properties.idPrefixConstruction =
							_childIdPrefixConstruction || (_childIdPrefix == _undefined ? _concatenated : 'explicit')
					);

					/*** apply unapplied data for child (set through children state property) ***/
						var
							_unappliedChildrenProperties = _this._unappliedChildrenProperties,
							_unappliedChildrenPropertiesForChild = _unappliedChildrenProperties [_childName]
						;
						if (_unappliedChildrenPropertiesForChild) {
							_Uize.copyInto (_properties,_unappliedChildrenPropertiesForChild);
							delete _unappliedChildrenProperties [_childName];
						}

					_child && _child.set (_properties);
					return _this._children [_childName] = _child || new _childInstanceOrClass (_properties);
					/*?
						Instance Methods
							addChild
								The =addChild= method lets you add a child widget to a widget.

								SYNTAX
								..................................................................
								childWidgetOBJ = myWidget.addChild (
									childWidgetNameSTR,childWidgetClassOBJ,childWidgetPropertiesOBJ
								);
								..................................................................

								VARIATION
								............................................................................
								childWidgetOBJ = myWidget.addChild (childWidgetNameSTR,childWidgetClassOBJ);
								............................................................................

								The =childWidgetPropertiesOBJ= parameter is optional and can be omitted when the default property values for a widget class are sufficient, or when the properties will be set to the desired values at a later stage.

								NOTES
								- returns a reference to the child widget instance that was added
								- the value of the =childWidgetNameSTR= can be =null= or =undefined= if a value is specified for the =name= property in the =childWidgetPropertiesOBJ= parameter
								- see also the =removeChild= instance method, and the `children instance property`

						Instance Properties
							parent
								A read-only reference to the instance's parent, if the instance has been added as a child widget of another widget by calling the =addChild= instance method on that other widget.

								The value of this property is set for an instance when the instance is added as a child widget of another widget instance. The value is read-only and is not intended to be set directly, but will be modified if the instance is removed from its parent by calling the =removeChild= instance method on the parent widget.

								NOTES
								- this property is read-only
								- the initial value is =undefined=
								- see also the related `children instance property`
					*/
				};

				_classPrototype.removeChild = function (_childNameOrInstance) {
					var
						_children = this._children,
						_childName =
							typeof _childNameOrInstance == _typeString || _Uize.isNumber (_childNameOrInstance)
								? _childNameOrInstance
								: _childNameOrInstance._name,
						_child = _children [_childName]
					;
					if (_child) {
						_child.unwireUi ();
						delete _child.parent;
						delete _children [_childName];
					}
					/*?
						Instance Methods
							removeChild
								The =removeChild= instance method lets you remove a child widget from a widget.

								SYNTAX
								...........................................
								myWidget.removeChild (childWidgetSTRorOBJ);
								...........................................

								When using this method, the child widget to remove can be specified by its name, or by an object reference to it.

								NOTES
								- see also the =addChild= instance method, and the `children instance property`
					*/
				};

				_classPrototype.getProvider = function (_property) {
					var
						_instance = this,
						_value
					;
					while (
						((_value = _instance.get (_property)) === 'inherit' || _value === _undefined) &&
						(_instance = _instance.parent)
					);
					return _instance;
					/*?
						Instance Methods
							getProvider
								Returns a reference to the nearest widget instance up the parent widget chain that provides a value for the specified state property.

								SYNTAX
								.............................................................
								providerWidgetOBJ = myWidget.getProvider (setGetPropertySTR);
								.............................................................

								If a value other than ='inherit'= or =undefined= is set for the specified state property of the instance, then a reference to the instance will be returned. Otherwise, this method will walk up the parent widget chain until a widget is found that has a value other than ='inherit'= or =undefined= set for this state property. If none is found, then the value =undefined= will be returned.

								NOTES
								- see also the =callInherited=, =getInherited=, and =setInherited= instance methods
					*/
				};

				_classPrototype.getInherited = function (_property) {
					var _provider = this.getProvider (_property);
					return _provider ? _provider.get (_property) : _undefined;
					/*?
						Instance Methods
							getInherited
								Returns the value for the specified state property, as inherited from the widget's parent chain.

								SYNTAX
								.............................................................
								inheritedANYTYPE = myWidget.getInherited (setGetPropertySTR);
								.............................................................

								If a value other than ='inherit'= or =undefined= is set for the specified state property of the instance, then the property's value will be returned. Otherwise, this method will walk up the parent widget chain until a widget is found that has a value other than ='inherit'= or =undefined= set for this state property. If none is found, then the value =undefined= will be returned.

								NOTES
								- see also the =callInherited=, =getProvider=, and =setInherited= instance methods
					*/
				};

				_classPrototype.setInherited = function (_properties) {
					var _provider;
					for (var _propertyName in _properties) {
						if (_provider = this.getProvider (_propertyName))
							_provider.set (_propertyName,_properties [_propertyName])
						;
					}
					/*?
						Instance Methods
							setInherited
								Allows you to set values for the specified state properties on the instance in the widget's parent chain from which the properties are inherited.

								SYNTAX
								............................................
								myWidget.setInherited (setGetPropertiesOBJ);
								............................................

								NOTES
								- see also the =callInherited=, =getProvider=, and =getInherited= instance methods
					*/
				};

				_classPrototype.callInherited = function (_property) {
					var _this = this;
					return (
						function () {
							var
								_provider = _this.getProvider (_property),
								_result
							;
							if (_provider) {
								var _inheritedMethod = _provider.get (_property);
								if (_isFunction (_inheritedMethod))
									_result = _inheritedMethod.apply (_provider,arguments)
								;
							}
							return _result;
						}
					);
					/*?
						Instance Methods
							callInherited
								Returns a function, being a caller for the specified instance method, as inherited from the widget's parent chain.

								SYNTAX
								......................................................
								callerFUNC = myInstance.callInherited (methodNameSTR);
								......................................................

								Once you have a caller function for calling an instance method inherited from up the parent chain, then you can call it and pass parameters as if you were calling that method on the instance that provides the method.

								EXAMPLE
								.........................................................
								myWidget.callInherited ('useDialog') ({
									widgetClassName:'MyNamespace.SomeDialogWidget',
									widgetProperties:{
										name:'myDialog',
										title:'This is My Diaog, Hear it Roar'
									},
									submitHandler:function (_confirmed) {
										// handle dialog being submitted (ie. OK or CANCEL)
									}
								});
								.........................................................

								In the above example, =myWidget= is a widget instance that is on a widget tree with a page widget instance (an instance of =Uize.Widget.Page=, or a subclass of it) at the root. The =Uize.Widget.Page= class implements a =useDialog= instance method. Now, even though the widget class of the =myWidget= instance doesn't implement a =useDialog= instance method, and even though it isn't a subclass of =Uize.Widget.Page= and, therefore, doesn't inherit the implementation from the page widget class, the =callInherited= instance method is able to "locate" the provider of this method up the parent widget chain and returns a function that will call the method as an instance method on its provider.

								NOTES
								- see also the =getProvider=, =getInherited=, and =setInherited= instance methods
					*/
				};

			/*** Overridable Wiring and Updating Methods ***/
				_classPrototype.kill = function () {
					_Uize.callOn (this._children,'kill');
					_superclass.prototype.kill.call (this);
					/*?
						Instance Methods
							kill
								Overrides the =kill= method of the =Uize.Class= base class to call the =kill= method on all of an instance's child widgets.

								SYNTAX
								.................
								myWidget.kill ();
								.................
					*/
				};

				_classPrototype.insertOrWireUi = function () {
					this._built ? this.wireUi () : this.insertUi ();
					/*?
						Instance Methods
							insertOrWireUi
								Calls either the =wireUi= or =insertUi= instance method, depending on the value of the =built= state property.

								SYNTAX
								...........................
								myWidget.insertOrWireUi ();
								...........................

								If =built= is set to =true= at the time that =insertOrWireUi= is called, then the =wireUi= method will be called. Otherwise, the =insertUi= method will be called. When you're dealing with widgets where the UI may or may not already be built, and the value of the =built= property is not guaranteed to be known, then the =insertOrWireUi= method provides a convenient conditional behavior so that you don't have to always write such conditional logic in your application or widget code.

								NOTES
								- see the related =insertUi= and =wireUi= instance methods
					*/
				};

				_classPrototype.insertUi = function () {
					this.buildHtml ();
					this.wireUi ();
					/*?
						Instance Methods
							insertUi
								Inserts the UI for an instance by calling the =buildHtml= instance method, and then wires the instance's UI by calling the =wireUi= method.

								SYNTAX
								.....................
								myWidget.insertUi ();
								.....................

								The =insertUi= method always first builds the instance's UI, regardless of the value of the =built= state property. To conditionally build an instance's UI before wiring it, taking into account the value of the =built= property, use the =insertOrWireUi= instance method.

								NOTES
								- see the related =insertOrWireUi= and =wireUi= instance methods
					*/
				};

				_classPrototype.removeUi = function () {
					this.unwireUi ();
					this.removeNode ();
					_Uize_Node.remove (this._globalizedNodes);
					this._globalizedNodes = _undefined;
					_Uize.callOn (this._children,'removeUi');
					this.set ({_built:_false});
					/*?
						Instance Methods
							removeUi
								Unwires the UI of the widget, removes the widget's `root node` from the DOM, and calls this method on all the widget's child widgets.

								SYNTAX
								.....................
								myWidget.removeUi ();
								.....................
					*/
				};

				_classPrototype.updateUi = function () {
					/*?
						Instance Methods
							updateUi
								Not implemented in this class, this method is intended to be overrided / implemented in a subclass.

								SYNTAX
								.....................
								myWidget.updateUi ();
								.....................

								The =updateUi= method is called on the instance as the last step of this class' =wireUi= method implementation. The =updateUi= method should perform any DOM updates necessary in order that the UI correctly reflect the widget's state.

								Child Widgets
									It is generally not necessary for the implementation of this method to invoke updates on child widgets, unless the child widgets are used to represent some aspects of the widget's state and may have become out of sync with that state. Typically, state of a widget that is reflected using its child widgets is set on those child widgets whenever that state changes using private update handlers that are more granular than the =updateUi= method. It might be desirable in one's implementation to break granular update code out into private methods so that this code can be called for those state changes as well as from the =updateUi= method's implementation.

								NOTES
								- although this method currently has no implementation in this class, it is suggested that subclasses call this method on their superclass as the last step in their implementation, as this method may someday perform other operations in this class
					*/
				};

				_classPrototype.wireUi = function () {
					if (!this.isWired) {
						this._applyDeclarativeWidgetProperties ();
						this.set ({wired:_true});

						/*** wire or insert UI of children ***/
							_Uize.callOn (this._children,'insertOrWireUi');

						this.updateUi ();
					}
					/*?
						Instance Methods
							wireUi
								Wires the widget's UI.

								After the UI has been wired, all of the widget's child widgets are wired by calling this method on each of them. Finally, the widget's UI is updated through a call to the =updateUi= instance method, which also has the effect of updating the UI of all child widgets down the widget tree.

								When creating a subclass of Uize.Widget, this method should be overrided according to the following structure...

								................................................
								_classPrototype.wireUi = function () {
									var _this = this;
									if (!_this.isWired) {

										// do a
										// whole bunch
										// of wiring

										_superclass.prototype.wireUi.call (_this);
									}
								};
								................................................

								...where =_classPrototype= is the prototype property of the widget subclass being implemented, and =_superclass= is the superclass from which the new widget class is being subclassed.

								NOTES
								- if the widget's UI has already been wired, this method has no effect.
								- see also the =wired= state property
								- see also the =updateUi= and =unwireUi= instance methods
					*/
				};

				_classPrototype.unwireUi = function () {
					if (this.isWired) {
						this._nodeCache = _null;
						this.unwireNode ();
						_Uize.callOn (this._children,'unwireUi');
						this.set ({wired:_false});
					}
					/*?
						Instance Methods
							unwireUi
								Unwires all the events associated to the instance and all of its child widgets. After this method has been called, the =wired= state property will be set to =false=.

								SYNTAX
								.....................
								myWidget.unwireUi ();
								.....................

								NOTES
								- see also the =wireUi= instance method
					*/
				};

		/*** Public Static Methods ***/
			_class.getBlankImageUrl = function () {
				return _Uize.pathToResources + 'Uize/blank.gif';
				/*?
					Static Methods
						Uize.Widget.getBlankImageUrl
							Returns a string, representing the relative path from the current document to the "blank.gif" image resource that is available to all =Uize.Widget= subclasses that may need it in generating HTML markup, or in building or manipulating DOM nodes.

							SYNTAX
							...................................................
							blankImageUrlSTR = Uize.Widget.getBlankImageUrl ();
							...................................................
				*/
			};

			_class.spawn = function (_properties,_parent) {
				var
					_this = this,
					_instances = [],
					_instance,
					_parentIdPrefixPlus = _parent && _parent._idPrefix ? _parent._idPrefix + '_' : '',
					_parentIdPrefixPlusLength = _parentIdPrefixPlus.length
				;
				_Uize_Node_doForAll (
					_Uize.Node.find (_properties.idPrefix),
					function (_node) {
						_properties.idPrefix = _node;
						_parent
							? (
								_instance = _parent.addChild (
									_node.id.slice (0,_parentIdPrefixPlusLength) == _parentIdPrefixPlus
										? _node.id.slice (_parentIdPrefixPlusLength)
										: 'generatedChildName' + _Uize.getGuid (),
									_this,
									_properties
								)
							)
							: (_instance = new _this (_properties)).insertOrWireUi ()
						;
						_instances.push (_instance);
					}
				);
				return _instances;
				/*?
					Static Methods
						Uize.Widget.spawn
							Spawns a number of widgets using the specified state property values, attaches them as children to the specified parent widget, and returns the spawned widgets as an array.

							SYNTAX
							.................................................................
							widgetsARRAY = Uize.Widget.spawn (propertiesOBJ,parentWidgetOBJ);
							.................................................................

							VARIATION
							.................................................
							widgetsARRAY = Uize.Widget.spawn (propertiesOBJ);
							.................................................

							When no =parentWidgetOBJ= parameter is specified, the spawned widgets are not added as children of any parent widget and are wired *immediately* by calling their =wireUi= instance method.

							Called on Subclasses
								The =Uize.Widget.spawn= static method is inherited by subclasses of =Uize.Widget= and spawns instances of the class on which it is called, so it is not typically called on the =Uize.Widget= class but rather on a specific widget class.

							The propertiesOBJ Parameter
								The =propertiesOBJ= parameter is an object, containing values for the state properties of the widget class of which instances are being spawned.

								Besides the required =idPrefix= property (see `Special Meaning of idPrefix`), the =propertiesOBJ= parameter may contain values for any of the other state properties of the widget class on which this method is being called.

							Special Meaning of idPrefix
								The number of widgets spawned is determined by the value of the "idPrefix" property in the =propertiesOBJ= object.

								A value for "idPrefix" must be specified, otherwise the =Uize.Widget.spawn= method will not work correctly. The value of this property identifies one or more DOM nodes for which the widget instances should be spawned, and may be a DOM node reference, a string representing the =id= of a DOM node, an array of DOM node references, or a find expression object that will be used with the =Uize.Node.find= static method to find the DOM nodes.

								Once the value of the "idPrefix" property has been resolved to one or more DOM nodes, an instance of the widget class on which the method is called will be created for each of the DOM nodes. For each widget instance that is created, the actual =idPrefix= value for the instance will be derived from the =id= attribute of the DOM node for which the instance is being created. For this reason, the DOM nodes represented by the "idPrefix" property should be the root nodes for the widget instances that will be spawned.

							Child Widget Naming
								When spawned widgets are added as child widgets of a specified parent widget, the names of the child widget are - if possible - derived using the value of the =idPrefix= state property of the parent widget and the value of the =id= attribute for the DOM node for which a widget instance is being spawned.

								For example, if the =id= attribute of a DOM node for which a widget is to be spawned has the value "page_item0", and if the parent widget of the spawned widget is a page widget instance with the =idPrefix= value of ='page'=, then the spawned widget will be added as the child named "item0".

							An Example
								Let's look at an example of how the =Uize.Widget.spawn= static method can be used...

								EXAMPLE
								.....................................................................
								Uize.Widget.CollectionItem.Zooming.spawn (
									{
										idPrefix:{root:'thumbnails',tagName:'A',className:'thumbnail'},
										previewZoomUrl:function () {return this.get ('previewUrl')},
										zoomPower:2.5
									},
									page
								);
								.....................................................................

								In the above example, instances of the =Uize.Widget.CollectionItem.Zooming= widget class are being spawned - one for each of the nodes obtained by evaluating the find expression object ={root:'thumbnails',tagName:'A',className:'thumbnail'}=.

								Besides the =idPrefix= value here that identifies the DOM nodes for which the =Uize.Widget.CollectionItem.Zooming= instances should be created, the values specified for the =previewZoomUrl= and =zoomPower= state properties of this widget class are common for all instances that are spawned. Finally, the =parentWidgetOBJ= parameter is used here to attach the spawned instances as children of a page widget instance.

							NOTES
							- the widget adoption mechanism implemented in the =Uize.Widget.Page= class supports a declaration syntax for spawning widgets
				*/
			};

		/*** State Properties ***/
			_class.stateProperties ({
				_built:{
					name:'built',
					value:_true
					/*?
						State Properties
							built
								A boolean, indicating whether or not a specific child widget's UI has already been built and inserted into the DOM by the time that its parent widget wires up the child widgets.

								NOTES
								- the initial value is =true=
					*/
				},
				_children:{
					name:'children',
					conformer:function (_value) {
						if (_value) {
							var
								_children = this._children,
								_unappliedChildrenProperties = this._unappliedChildrenProperties
							;
							for (var _childName in _value) {
								var _childProperties = _value [_childName];
								_children [_childName]
									? _children [_childName].set (_childProperties)
									: _unappliedChildrenProperties [_childName] = _childProperties
								;
							}
						}
						return this._children;
					}
					/*?
						State Properties
							children ~~ children State Property
								A special state property that provides a way to distribute widget properties to any or all of the widget's child widgets, or even child widgets of the widget's child widgets - all the way down to the deepest child widgets in the widget's widget tree.

								For a detailed discussion of the =children= state property, consult the [[../explainers/javascript-widgets.html][JavaScript Widgets]] explainer and read through specifically the section entitled "The children State Property".

								NOTES
								- see also the companion `children instance property`
								- see also the related =parent= instance property
					*/
				},
				_container:'container',
					/*?
						State Properties
							container
								A string, representing the ID of a container node, or an object reference to a container node, into which the HTML for a widget should be inserted when the =insertUi= instance method is called.

								NOTES
								- the initial value is =undefined=
					*/
				_html:'html',
					/*?
						State Properties
							html
								A string, function, object, or boolean value, specifying the HTML that should be inserted into the document by the =insertUi= instance method.

								Values Types
									The following value types are supported for the =html= state property...

									String
										Lets you specify a template string for the HTML of a widget.

										A string value specified for this property may contain tokens of the form =[#setGetPropertyName]=, which will be substituted by the values of the corresponding state properties of the widget.

									Function
										Lets you specify a generator function for a widget's markup.

										A function that you register as an HTML generator for your widget using the =html= state property should expect to receive one parameter, being an object containing the `HTML generator input`. The function should return either a string, being the generated HTML markup for the widget, or a DOM node or array of DOM nodes. While the generator function can use the values in the `HTML generator input` object when constructing the HTML for the widget, the string returned by the function may also contain tokens of the form =[#setGetPropertyName]=, which will be substituted by the values of the corresponding state properties of the widget.

									Object
										Lets you supply a JavaScript Template Module as the HTML generator for a widget.

										When specifying an object for this property, the object should contain a =process= property that is a generator function. That generator function should expect to receive one parameter, being an object containing the `HTML generator input`. The function should return a string, being the generated HTML markup for the widget. The string returned will *not* be processed any further and will be inserted into the document as is, so it is the reponsibility of the generator function in this case to stitch in any values it cares to from the `HTML generator input`.

										Now, typically an object specified for the =html= state property will be a JavaScript Template Module, but you can supply any object - the only requirement is that it have a =process= property that is a generator function. Since the function type value for the =html= state property results in the string returned by the function being processed further with token substitution, using the object type is one way to dodge that extra processing if it's not desired - without actually having to create a full-blown JavaScript Template Module.

										INSTEAD OF...
										....................................................
										myWidget.set ({html:myWidgetHtmlGeneratorFunction});
										....................................................

										YOU COULD USE...
										..............................................................
										myWidget.set ({html:{process:myWidgetHtmlGeneratorFunction}});
										..............................................................

									Boolean
										Lets you embed a JavaScript Template inside a widget's markup, which will then be used for generating the widget's UI.

										When the boolean value =true= is set for this property, and if the =Uize.Template= module is loaded, then the =Uize.Widget= class will attempt to find a =script= tag inside the container, shell, or `root node` of the widget with the type "text/jst" (JavaScript Template). If such a =script= tag is found, then its contents will be compiled by the =Uize.Template= module and the resulting JST module will be set on the =html= state property.

								HTML Generator Input
									When a generator function is called, it is supplied with an object that contains the current state of the state properties for the widget instance.

									This allows the generator function to use any - or all - of the state properties when constructing the HTML for a specific instance of the widget.

									SPECIAL PATH PROPERTIES

									In addition to the state property values, the HTML Generator Input object also contains the two special properties =pathToResources= and =blankGif=, where =pathToResources= is set to the value of the =Uize.pathToResources= static property, and =blankGif= is set to the result from calling the =Uize.Widget.getBlankImageUrl= static method.

									These special path properties allow widgets to generate HTML that references assets that are located in directories relative to the JavaScript modules that implement the widgets.

								NOTES
								- the initial value is =undefined=
					*/
				_idPrefix:{
					name:'idPrefix|node',
					conformer:function (_idPrefix) {
						/* NOTE:
							if the idPrefix is a node reference, convert it to a string whose value is the id of the node
						*/
						return (
							_Uize_Node_isNode (_idPrefix)
							? (_idPrefix.id || (_idPrefix.id = _Uize.getGuid ()))
							: _idPrefix
						);
					},
					onChange:function () {
						var
							_this = this,
							_idPrefix = _this._idPrefix
						;
						_this._nodeCache = _null;
						if (_idPrefix != _undefined) {
							_this._applyDeclarativeWidgetProperties ();

							/*** set the idPrefix for every child widget that doesn't have a value set for this property ***/
								var
									_children = _this._children,
									_child
								;
								for (var _childName in _children)
									(_child = _children [_childName]).set ({
										_idPrefix:
											_this._constructIdPrefix (
												_idPrefix,_child._idPrefix,_childName,_child._idPrefixConstruction
											)
									})
								;

							/*** rewire the widget, if it's already wired ***/
								if (_this.isWired) {
									// perhaps any previously wired nodes should also be unwired first
									_this.set ({wired:_false});
									_this.wireUi ();
								}
						}
					}
					/*?
						State Properties
							idPrefix
								A string, specifying the ID prefix to be used when resolving implied nodes and child widgets to DOM node references.

								NOTES
								- see the related =idPrefixConstruction= state property
								- the initial value is =undefined=
					*/
				},
				_idPrefixConstruction:'idPrefixConstruction',
					/*?
						State Properties
							idPrefixConstruction
								A string, specifying the mode of construction of the value for the =idPrefix= state property.

								The value of the =idPrefixConstruction= property is used when the value of the =idPrefix= property is constructed. This happens either at the time that a widget is added as a child widget of a parent widget using the =addChild= instance method, or when the =idPrefix= value of a child widget's parent widget is modified *after* it has already been added as a child.

								VALUES

								- ='same as parent'= - When =idPrefixConstruction= is set to ='same as parent'=, the =idPrefix= property will be set to the value of a widget's parent widget whenever the =idPrefix= value needs to be constructed.

								- ='concatenated'= - When =idPrefixConstruction= is set to ='concatenated'=, the =idPrefix= property will be constructed using the =idPrefix= value of a widget's parent widget as a prefix, and using the value of the widget's =name= property as a suffix, with the prefix and suffix separated by a "_" (underscore) character. For example, if a button widget has the name ='selectAll'=, and its parent widget has the =idPrefix= value of ='page_collection'=, then the =idPrefix= value produced for the button widget using this =idPrefixConstruction= mode would be ='page_collection_selectAll'=.

								- ='explicit'= - When =idPrefixConstruction= is set to ='explicit'=, an explicit value specified for a widget's =idPrefix= property will be used throughout the lifetime of the widget, and the =idPrefix= will not be otherwise derived.

								- =undefined= (the default value) - When =idPrefixConstruction= is set to =undefined=, the behavior for the value ='concatenated'= will be used (ie. the value =undefined= is equivalent to the value ='concatenated'=).

								NOTES
								- see the related =idPrefix= state property
								- the initial value is =undefined= (equivalent to the value ='concatenated'=)
					*/
				_insertionMode:'insertionMode',
					/*?
						State Properties
							insertionMode
								A string, specifying the injection mode that should be used when inserting the HTML for a widget into the page.

								This property works in conjunction with the =built=, =container=, and =html= state properties. If the value for the =built= property is =true= for a widget instance, then =insertionMode= is not applicable. But if the value for =built= is =false=, then the HTML generated using the =html= state property will be injected into a container node specified by the =container= state property (or the =shell= implied node, or the `root node` of the widget instance, or the document's body, whichever is non-null) using the mode specified by =insertionMode=.

								EXAMPLE
								......................................................
								page.addChild (
									'quantitySlider',
									Uize.Widget.Bar.Slider,
									{
										html:MySiteNamespace.Templates.Slider,
										built:false,
										container:Uize.Node.getById ('quantityUiShell'),
										insertionMode:'inner bottom'
									}
								);
								......................................................

								In the above example, an instance of the =Uize.Widget.Bar.Slider= class will have its HTML generated by the template module =MySiteNamespace.Templates.Slider= and then inserted into the container node =quantityUiShell=, using the ='inner bottom'= insertion mode. This means that if the =quantityUiShell= node already contained contents, that contents will not be replaced by insertion of the widget's HTML, but the widget's HTML will be inserted at the bottom - under the existing contents.

								Values
									The possible values for the =insertionMode= state property are the same as the valid values for the =injectModeSTR= parameter of the =Uize.Node.injectHtml= static method: ='inner bottom'=, ='inner top'=, ='outer bottom'=, ='outer top'=, ='inner replace'=, and ='outer replace'=. For a more in-depth discussion of insertion modes and how they behave, consult the reference for the =Uize.Node.injectHtml= static method.

									If the value of the =insertionMode= state property is =null=, =undefined=, or an empty string, then an insertion mode is chosen automatically based upon the node that the HTML is being inserted into: ='inner replace'= if a container node is specified, and ='inner bottom'= into the document body if no container node is specified or if the document body is specified for the container.

								NOTES
								- the initial value is =undefined= (which results in default auto behavior)
								- see also the =built=, =container=, and =html= state properties
					*/
				_localized:'localized',
					/*?
						State Properties
							localized
								An object which, if defined, lets you specify localized strings that can be accessed using the =localized= instance method.

								EXAMPLE
								..........................................................................
								myWidget.set ({
									localized:{welcomeMessage:'Welcome, {firstName} of {state}, {country}'}
								});
								var localWelcome = myWidget.localize (
									'welcomeMessage',
									{firstName:'Chris',state:'California',country:'USA'}
								);
								..........................................................................

								The above example would produce the result ='Welcome, Chris of California, USA'=.

								NOTES
								- the initial value is =undefined=
								- see also the =localize= instance method
					*/
				_name:'name',
					/*?
						State Properties
							name
								A read-only string, specifying the name of the widget if it is added as a child widget of another widget by calling the =addChild= instance method on that other widget.

								The value of this property is set for an instance when the instance is added as a child widget of another widget instance. The value is read-only and is not intended to be set later.

								NOTES
								- this property is read-only
								- the initial value is =undefined=
					*/
				_nodeMap:'nodeMap',
					/*?
						State Properties
							nodeMap
								An object which, if defined, lets you provide override mappings for implied nodes. Each property's name-value pair is a single implied node mapping, where the property name is the natural name (as implemented in the widget subclass) for the implied node, and where the property value is the override (which can be either an alternate node name, or an actual node reference).

								NOTES
								- the initial value is =undefined=
					*/
				isWired:{
					name:'wired',
					value:_false
					/*?
						State Properties
							wired
								A boolean, indicating whether or not the widget's UI has been wired up. This property is set to =true= after the =wireUi= instance method has been called on a widget and all its child widgets.

								NOTES
								- the initial value is =false=
								- see also the =isWired= instance property

						Instance Properties
							isWired
								An alternate way of accessing the value of the =wired= state property, that doesn't require using the =get= instance method.

								Using this property is functionally equivalent to =myWidget.get ('wired')=. This property is provided primarily as a convenience and to improve performance, since the =wired= state property is accessed many times in many widget class files, and often in heavily hit areas of code. Using this property to access the value of the =wired= state property offers slightly better performance than using the =get= instance method, which may help a little with performance optimization.

								INSTEAD OF...
								............................
								if (!this.get ('wired')) {
									// code to perform wiring
								}
								............................

								USE...
								............................
								if (!this.isWired) {
									// code to perform wiring
								}
								............................

								NOTES
								- see also the =wired= state property
					*/
				}
			});

			_declareTreeInheritedProperty ({_busy:'busy',_busyInherited:'busyInherited'},_false);
				/*?
					State Properties
						busy
							A boolean, indicating whether or not the widget is busy.

							The busy state can be useful when a complex set of processes needs to be performed and user interaction with certain widgets needs to be blocked during that time. Widgets that are in a busy state should not allow user interaction. It is up to an individual widget class to provide its own implementation for the busy state.

							NOTES
							- the initial value is =true=
							- this state property has a significantly different effect to the =enabled= state property

						busyInherited
							A boolean, indicating whether or not the instance is busy. A widget subclass can use this state property when performing UI updates in order to reflect a busy state.

							This property will be =true= if the =busy= state property is set to =true=, or if =busy= is set to ='inherit'= and the value inherited from up the parent chain resolves to =true=. If an inherited value resolves to =inherit=, then this property will be set to =false=.

							NOTES
							- the initial value is =false=
							- see also the =busy= state property
							- see also the =getInherited= instance method
				*/

			_declareTreeInheritedProperty ({_enabled:'enabled',_enabledInherited:'enabledInherited'},_true);
				/*?
					State Properties
						enabled
							A boolean, specifying whether or not the widget is enabled.

							The enabled state can be useful when a complex set of processes needs to be performed and user interaction with certain widgets needs to be blocked during that time. Widgets that are not in an enabled state (ie. disabled) should not allow user interaction. It is up to an individual widget class to provide its own implementation for the enabled state.

							NOTES
							- the initial value is =true=
							- this state property has a significantly different effect to the =busy= state property

						enabledInherited
							A boolean, indicating whether or not the instance is enabled. A widget subclass can use this state property when performing UI updates in order to reflect a disabled state.

							This property will be set to =true= if the =enabled= state property is set to =true=, or if =enabled= is set to ='inherit'= and the inherited value resolves to either ='inherit'= or =true=.

							NOTES
							- the initial value is =true=
							- see also the =enabled= state property
							- see also the =getInherited= instance method
				*/

		return _class;
	}
});

