/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Dom.Basics Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2004-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 9
	codeCompleteness: 100
	docCompleteness: 95
*/

/*?
	Introduction
		The =Uize.Dom.Basics= module provides a very minimal set of methods to ease working with DOM nodes - just the basics that are needed by the =Uize.Widget= class.

		*DEVELOPERS:* `Chris van Rensburg`

		Features
			Node Blob
				Many of the methods in this package can operate on multiple nodes at a time by specifying the nodes using the =nodeBLOB= parameter.

				This parameter may be...

				- a string, being the =id= of one node
				- an object reference to one node
				- a =null= or =undefined= value, which will be ignored
				- an array, whose elements are node blobs
				- an object, whose properties have values that are node blobs

				Effectively, this means that one can specify an arbitrary number of nodes in an arbitrarily complex data structure, combining nested arrays and objects as appropriate to the application.

				EXAMPLE
				.......................................................................
				Uize.Dom.Basics.show (['saveButton','cancelButton','skipButton'],true);
				.......................................................................

				In the above example, the =nodeBLOB= parameter is an array, where each element is a string representing the =id= of a button to show.

				EXAMPLE
				....................................................................
				var
					topButtons = ['loginLogoutButton','checkoutButton','helpButton'],
					bottomButtons = ['saveButton','cancelButton','skipButton']
				;
				Uize.Dom.Basics.show ([topButtons,bottomButtons],true);
				....................................................................

				In a slightly more complex example, the =nodeBLOB= parameter is an array, where each element is itself an array of button node ids.

				If a particular method can accept an =nodeBLOB= parameter, it will be noted in the reference section for that method.
*/

Uize.module ({
	name:'Uize.Dom.Basics',
	required:'Uize.Event.Bus',
	builder:function () {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_undefined,
				_null = null,
				_true = true,
				_false = false,
				_typeString = 'string',
				_typeObject = 'object',
				_Uize = Uize,
				_copyInto = _Uize.copyInto,
				_returnFalse = _Uize.returnFalse,

			/*** references to static methods used internally ***/
				_getById,
				_doForAll,
				_isNode,
				_joinIdPrefixAndNodeId,
				_isOnNodeTree,
				_getStyle,
				_setStyle,
				_unwire,

			/*** General Variables ***/
				_isBrowser = typeof navigator != 'undefined',
				_navigator = _isBrowser ? navigator : {userAgent:'',appName:''},
				_userAgent = _navigator.userAgent.toLowerCase (),
				_isIe = _navigator.appName == 'Microsoft Internet Explorer',
				_ieMajorVersion = +(_isIe && (_userAgent.match (/MSIE\s*(\d+)/i) || [0,0]) [1]),
				_isMozilla = _userAgent.indexOf ('gecko') > -1,
				_isOpera = _userAgent.indexOf ('opera') > -1,
				_isMozillaOrOpera = _isMozilla || _isOpera,
				_mousePos = {clientX:0,clientY:0,pageX:0,pageY:0},
				_ActiveXObject = _isIe && ActiveXObject,

			/*** variables for event wiring methods ***/
				_wirings = {},
				_wiringIdsByOwnerId = {},
				_totalWirings = 0,
				_needsWindowEventVehicle = _isIe && _ieMajorVersion < 7,

			/*** variables for display method ***/
				_tableDisplayValuePrefix = 'table-',
				_tableRowDisplayValue = _tableDisplayValuePrefix + 'row',
				_tableCellDisplayValue = _tableDisplayValuePrefix + 'cell',
				_tagSpecificDisplayValues = _copyInto (
					{
						SPAN:'inline',
						THEAD:_tableDisplayValuePrefix + 'header-group',
						TFOOT:_tableDisplayValuePrefix + 'footer-group',
						LI:'list-item'
					},
					_isIe && typeof DOMImplementation == 'undefined'
						/* NOTE:
							IE8 supports all the display values, and also the DOMImplementation object (so we use it for testing for older IE)
						*/
						? _null
						: {
							TABLE:'table',
							TR:_tableRowDisplayValue,
							TH:_tableCellDisplayValue,
							TD:_tableCellDisplayValue,
							TBODY:_tableRowDisplayValue + '-group',
							COLGROUP:_tableDisplayValuePrefix + 'column-group',
							COL:_tableDisplayValuePrefix + 'column',
							CAPTION:_tableDisplayValuePrefix + 'caption'
						}
				),

			/*** variables for getStyle method ***/
				_trblStylePropertiesMap = {
					borderColor:['border','Color'],
					borderWidth:['border','Width'],
					padding:1,
					margin:1
				},

			/*** variables for injectHtml method ***/
				_ieInnerHtmlReadOnly = {
					TABLE:_true, THEAD:_true, TFOOT:_true, TBODY:_true, TR:_true, COL:_true, COLGRPUP:_true,
					FRAMESET:_true, HEAD:_true, HTML:_true, STYLE:_true, TITLE:_true
				},

			/*** variables for setOpacity method ***/
				_opacityStyleProperty = {}
		;

		/*** Utility Functions ***/
			function _getElementById (_nodeId) {
				var _result = document.getElementById (_nodeId);
				return (!_isIe || (_result && _result.id == _nodeId)) ? _result : _null;
				/* WORKAROUND:
					stupid issue in IE, where document.getElementById will return a reference to a node that has a name attribute with the specified ID value, if no node has an id with that value
				*/
			}

			function _captureMousePos (_event) {
				_mousePos.clientX = _event.clientX;
				_mousePos.clientY = _event.clientY;
				_mousePos.pageX = _event.pageX;
				_mousePos.pageY = _event.pageY;
			}

			function _resolveStringEventName (_eventName) {
				var _VirtualEvent = _Uize.Dom.VirtualEvent;
				return (
					_VirtualEvent && _eventName.charCodeAt (_eventName.length - 1) == 41
						? _VirtualEvent.resolve (_eventName)
						: _eventName.charCodeAt (0) == 111 && _eventName.charCodeAt (1) == 110
							? _eventName.slice (2)
							: _eventName
				);
			}

		var _package = _Uize.package ({
			/*** Private Static Properties ***/
				_wirings:_wirings,
				_captureMousePos:_captureMousePos, // NOTE: this is needed for the quarantined mouseover handler

			/*** Public Static Methods ***/
				display:function (_nodeBlob,_mustDisplay) {
					_mustDisplay = _mustDisplay === _undefined || !!_mustDisplay;
					_doForAll (
						_nodeBlob,
						function (_node) {
							_node.style.display = _mustDisplay ? (_tagSpecificDisplayValues [_node.tagName] || 'block') : 'none';
						}
					);
					/*?
						Static Methods
							Uize.Dom.Basics.display
								Displays or hides the specified `node blob`, using the "display" CSS property.

								SYNTAX
								......................................................
								Uize.Dom.Basics.display (nodeBLOB,mustDisplayANYTYPE);
								......................................................

								While typically a Boolean, the =mustDisplayANYTYPE= parameter can be of any type and the node(s) will be displayed if it resolves to =true=, and hidden if it resolves to =false= - with the exception of =undefined=, when the node(s) will be displayed (see explanation below).

								VARIATION
								...................................
								Uize.Dom.Basics.display (nodeBLOB);
								...................................

								When no =mustDisplayANYTYPE= parameter is specified (or when its value is =undefined=), the node(s) will be displayed.

								NOTES
								- compare to the =Uize.Dom.Basics.show= static method
								- this method can operate on multiple nodes at a time. For more details, see the section on `node blob`
					*/
				},

				find:function (_properties) {
					/*** return early if the parameter for find is already resolved to a node or array of nodes ***/
						if (
							typeof _properties != _typeObject || !_properties ||
							typeof _properties.length == 'number' || _isNode (_properties)
						)
							return _properties
						;

					var
						_document = document,
						_isPrimitive = _Uize.isPrimitive,
						_nodePool = [],
						_unusedProperties = _copyInto ({},_properties),
						_root = 'root' in _unusedProperties ? _getById (_unusedProperties.root) : _document
					;
					delete _unusedProperties.root;

					/*** narrow down node pool, consuming root, id, name, and tagName tests, where possible ***/
						if (_root) {
							var _tagName = _unusedProperties.tagName;
							if ('id' in _unusedProperties && _isPrimitive (_unusedProperties.id)) {
								/* NOTE: optimization for when id is specified and has a simple value */
								var _node = _getElementById (_unusedProperties.id);
								_node && _nodePool.push (_node);
								delete _unusedProperties.id;
							} else if ('name' in _unusedProperties && _isPrimitive (_unusedProperties.name)) {
								/* NOTE: optimization for when name is specified and has a simple value */
								_nodePool = _document.getElementsByName (_unusedProperties.name);
								delete _unusedProperties.name;
							} else {
								/* NOTE:
									populate the node pool using getElementsByTagName, with optimization for when tagName is specified and has a simple value
								*/
								var _tagNameIsSimplyType = _isPrimitive (_tagName);
								_tagNameIsSimplyType && delete _unusedProperties.tagName;
								_nodePool = _root.getElementsByTagName (_tagName && _tagNameIsSimplyType ? _tagName : '*');
								_root = _null;
							}
							if (_root == _document)
								/* NOTE:
									By this point, if the root has not been consumed and *is* the document, then eliminate it as a test, since all nodes in the pool will fall under this root.
								*/
								_root = _null
							;
							if (!_tagName || _tagName == '*')
								/* NOTE:
									By this point, if we weren't able to consume tagName (because we fell into the id case or the name case) and it is the wildcard character (or an empty string or null or undefined), then eliminate it as a test, since it will have no limiting effect (being the wildcard that it is).
								*/
								delete _unusedProperties.tagName
							;
						}

					/*** return early (which I generally hate doing) if node pool is empty, or no unused properties ***/
						var _nodePoolLength = _nodePool.length;
						for (var _firstUnusedPropertyName in _unusedProperties) break;
						if (!_nodePoolLength || (_firstUnusedPropertyName == _undefined && !_root)) return _nodePool;

					/*** test each node in node pool against remaining unused properties (and possible root test) ***/
						var
							_matchingNodes = [],
							_isMatch
						;
						for (var _nodeNo = -1; ++_nodeNo < _nodePoolLength;) {
							var _node = _nodePool [_nodeNo];
							if (_isMatch = _root ? _isOnNodeTree (_node,_root) : _true) {
								for (var _propertyName in _unusedProperties) {
									var
										_nodePropertyValue = _node [_propertyName],
										_test = _unusedProperties [_propertyName],
										_isFunction = _Uize.isFunction
									;
									if (
										!(
											_isPrimitive (_test)
												? _nodePropertyValue == _test
												: (
													_test instanceof RegExp
														? _test.test (_nodePropertyValue || '')
														: (_isFunction (_test) ? _test.call (_node,_nodePropertyValue) : _true)
												)
										)
									) {
										_isMatch = _false;
										break;
									}
								}
							}
							_isMatch && _matchingNodes.push (_node);
						}
						return _matchingNodes;
					/*?
						Static Methods
							Uize.Dom.Basics.find
								Returns an array, representing those nodes within the document that match the specified find expression.

								SYNTAX
								......................................................
								nodesARRAY = Uize.Dom.Basics.find (findExpressionOBJ);
								......................................................

								With the exception of a few =Special Qualifiers=, each property of the =findExpressionOBJ= parameter is a property test for potential node matches, where the property's name is the name of a node property to test, and the property's value is the test to perform. The test can be a simple equality test, or it can also be a regular expression or function test.

								In order for a node being tested to be a match for the find, all of the tests must succeed, so there is an implicit logical =and= operation between all the tests specified in the =findExpressionOBJ= parameter, although the individual tests could succeed for multiple values by utilizing the more powerful =Regular Expression Test= and =Function Test= types of tests (described in more detail below).

								Test Types
									Simple Test
										In the case of a simple test, the value of the property to be tested will simply be tested for equality against the test value.

										EXAMPLE
										.............................................................................
										var buttonImages = Uize.Dom.Basics.find ({tagName:'IMG',className:'button'});
										.............................................................................

										The above example will return an array of all the nodes in the document that are =IMG= tags and that have their =class= attribute set to the value =button=.

									Regular Expression Test
										In the case of a regular expression test, the value of the property to be tested will be tested using the specified regular expression.

										Expanding on the example from the =Simple Test= explanation above, let's say that we didn't want to find *only* those nodes whose =class= attribute was exactly =button=, but rather any image node that contained the class =button= somewhere in its =class= attribute. Then you could use a find expression as follows...

										EXAMPLE
										.................................................................................
										var buttonImages = Uize.Dom.Basics.find ({tagName:'IMG',className:/\bbutton\b/});
										.................................................................................

										In the above example, a regular expression is being specified for the =className= test that will test to find the string =button= between word boundaries (sometimes referred to as a whole word match).

									Function Test
										In the case of a function test, the value of the property to be tested will be tested using the specified function.

										The test function should expect to receive the value to be tested as its single parameter, and it should return a value to indicate if the test succeeded. Expanding on the example from the =Regular Expression Test= explanation above, let's say that we also wanted to ensure that the matching nodes had to have an =offsetWidth= value greater than 100 pixels and an =offsetHeight= value greater than 30 pixels. Then you could use a find expression as follows...

										.....................................................
										var bigButtonImages = Uize.Dom.Basics.find ({
											tagName:'IMG',
											className:/\bbutton\b/,
											offsetWidth:function (value) {return value > 100},
											offsetHeight:function (value) {return value > 30}
										});
										.....................................................

								Not a CSS Selector
									The =Uize.Dom.Basics.find= method is a means of finding nodes within a document. The find expression specified is fundamentally not a CSS selector, is not as powerful in a number of ways, but is also somewhat more powerful in a number of ways, and can be used in many cases to accomplish very similar things. For example...

									CSS SELECTOR
									...........................................................
									div.myCssClassName, span.myCssClassName, img.myCssClassName
									...........................................................

									The effect of the above CSS selector could be accomplished by the following find expression...

									FIND EXPRESSION
									...........................................................
									{tagName:/^(DIV|SPAN|IMG)$/,className:/\bmyCssClassName\b/}
									...........................................................

									Regular expressions are more powerful in what they can accomplish. So, for example, if we wanted to find all the nodes in the document whose id's started with the prefix =page=, you could use a find expression like...

									................................................................
									var nodesWithPageIdPrefix = Uize.Dom.Basics.find ({id:/^page/});
									................................................................

									Significantly, the =Uize.Dom.Basics.find= method tests the reflected properties of nodes, so one can programmatically select nodes based upon properties that are interesting in the land of JavaScript but that are not accessible to the land of CSS. So, for example, you could find all =div= nodes in the document with the CSS class =scrollableDiv= and that have been scrolled vertically, using the following find expression...

									..............................................................
									var verticallyScrolledScrollableDivs = Uize.Dom.Basics.find ({
										tagName:'DIV',
										className:/\bscrollableDiv\b/,
										scrollTop:function (value) {return value > 0}
									});
									..............................................................

									So, in essence, the =Uize.Dom.Basics.find= method provides the ability to find nodes in a lightweight implementation and in a reasonably intuitive manner that very deliberately leverages the power of JavaScript for testing values. It is neither a CSS selector evaluator nor an XPath query evaluator, both of which are substantially more complex in the complete scope of their specifications.

								Special Qualifiers
									The =Uize.Dom.Basics.find= method supports some special qualifiers that can help to narrow down a find, improve performance, and provide other capabilities.

									root
										In a number of cases, you might want to find nodes that match a find expression within the limited scope of a specific root node - you don't want to scan all the nodes in the entire document. In such cases, the =root= qualifier lets you specify the root node under which to perform the find. Only nodes that are descendants of the root node will be considered in the find. The root node can be specified by id or reference.

										EXAMPLE
										................................................
										var myWidgetButtonImageNodes = Uize.Dom.Basics.find ({
											root:myWidget.getNode (),
											tagName:'IMG',
											className:/\bbutton\b/
										});
										................................................

										In the above example, the =Uize.Dom.Basics.find= method would find only those image nodes that are descendants of the =myWidget= widget's root node and that have the CSS class =button= specified in their =class= attribute. The =root= qualifier is set to a reference to the widget's root node, obtained using the =getNode= instance method of the =Uize.Widget= class (specifying no parameter gets you the root node).

									self
										The =self= qualifier lets you specify a test that can be performed on the node, itself, as a whole. This can be useful when you want to provide a test that involves an interaction between multiple properties of the nodes being tested.

										EXAMPLE
										.............................................................
										var thumbnailImages = Uize.Dom.Basics.find ({
											tagName:'IMG',
											self:function () {return this.width * this.height < 40000}
										});
										.............................................................

										In the above example, image nodes are being found whose area is less than =40000= square pixels (the area of a 200x200 image).

										When using the =self= qualifier, it is not meaningful to specify a test type other than a =Function Test=. Also, the function that you specify does not need to declare a parameter in this case - it will not receive a defined value, anyway. Like all function tests, the function that you specify for the test will be called as an instance method on the node being tested, so the =this= keyword will hold a reference to the node inside the scope of your function's implementation. This gives your function full access to the properties and methods of the node for the purpose of performing the test.

								Optimizations
									The =Uize.Dom.Basics.find= method performs optimizations wherever possible to utilize high performance built-in DOM methods, such as =getElementById=, =getElementsByName=, and =getElementsByTagName=. However, if test values specified for =id=, =name=, or =tagName= are not simple types, then this method will have to iterate in order to perform such tests.

								NOTES
								- in the event that no matches are found, an empty array will be returned
								- when the value of the =findExpressionOBJ= parameter is an array, node reference, or string, then that value will simply be returned as is and no find operation will be performed, making this method convenient to use in classes where either a find expression object or a node or array of nodes may be specified
								- see also the =Uize.Dom.Basics.getById= static method
					*/
				},

				getById:_getById = function (_node,_idPrefix,_nodeCache) {
					if (typeof _node != _typeString) return _node;

					var _result = _nodeCache ? _nodeCache [_node] : _undefined;
					if (_result === _undefined) {
						var _nodeIdOrName = _joinIdPrefixAndNodeId (_idPrefix,_node);
						(_result = _getElementById (_nodeIdOrName)) ||
							(
								(_result = document.getElementsByName (_nodeIdOrName)).length < 2 &&
								(_result = _result [0] || _null)
							)
						;
						if (_nodeCache) _nodeCache [_node] = _result;
					}
					return _result;
					/*?
						Static Methods
							Uize.Dom.Basics.getById
								Returns a reference to the specified node, where the node is specified by its ID or by the value of its =name= attribute.

								SYNTAX
								.................................................
								nodeOBJ = Uize.Dom.Basics.getById (nodeSTRorOBJ);
								.................................................

								If there are multiple nodes with the same value for their =name= attribute, then this method will return an array of node references.

								NOTES
								- in the event that the value of the =nodeSTRorOBJ= parameter is actually a reference to a node, then that value will simply be returned
								- in the event that a node specified by ID does not exist in the DOM, then the value =null= will be returned
								- see also the =Uize.Dom.Basics.find= static method
					*/
				},

				getStyle:_getStyle = function (_node,_property) {
					var
						_typeofPropertyIsString = typeof _property == _typeString,
						_value = _typeofPropertyIsString ? '' : {}
					;
					if (_node = _getById (_node)) {
						if (_typeofPropertyIsString) {
							var
								_opacityInIe = _isIe && _property == 'opacity',
								_documentDefaultView = document.defaultView,
								_computedStyle = _documentDefaultView && _documentDefaultView.getComputedStyle (_node,'')
							;
							if (_opacityInIe) _property = 'filter';
							if (_computedStyle) {
								if (!(_value = _computedStyle [_property])) {
									var _trblStylePropertyPrefixSuffix = _trblStylePropertiesMap [_property];
									if (_trblStylePropertyPrefixSuffix) {
										var
											_stylePropertyPrefix = _trblStylePropertyPrefixSuffix [0] || _property,
											_stylePropertySuffix = _trblStylePropertyPrefixSuffix [1] || '',
											_top = _computedStyle [_stylePropertyPrefix + 'Top' + _stylePropertySuffix],
											_right = _computedStyle [_stylePropertyPrefix + 'Right' + _stylePropertySuffix],
											_bottom = _computedStyle [_stylePropertyPrefix + 'Bottom' + _stylePropertySuffix],
											_left = _computedStyle [_stylePropertyPrefix + 'Left' + _stylePropertySuffix]
										;
										_value = _top == _right && _right == _bottom && _bottom == _left
											? _left
											: _top + ' ' + _right + ' ' + _bottom + ' ' + _left
										;
									}
								}
							} else {
								var _nodeCurrentStyle = _node.currentStyle;
								_value = _nodeCurrentStyle
									? _nodeCurrentStyle.getAttribute (_property)
									: _node.style [_property]
								;
							}
							if (_opacityInIe) {
								var _match = (_value || '').match (/alpha\s*\(\s*opacity\s*=([^\)]*)\)/i);
								_value = _match ? _match [1] / 100 : 1;
							}
						} else {
							for (_property in _property)
								_value [_property] = _getStyle (_node,_property)
							;
						}
					}
					return _value;
					/*?
						Static Methods
							Uize.Dom.Basics.getStyle
								Returns the value of the specified style property (or style properties) for the specified node.

								SYNTAX
								...........................................................................
								propertyValueSTR = Uize.Dom.Basics.getStyle (nodeSTRorOBJ,propertyNameSTR);
								...........................................................................

								Style properties for a node that are defined inside style sheets (whether inline or external) rather than in the node's =style= object are not reflected in the =style= property of the node in the DOM. This can be frustrating when trying to run code that may conditionalize based upon the values of certain style properties. This method acts as an abstraction to use the appropriate technique for the given browser to determine the value of a specified style property. In some browsers this may be done using the =getComputedStyle= method, while in other browsers it may be done using the =currentStyle= property.

								VARIATION
								................................................................................
								stylePropertiesOBJ = Uize.Dom.Basics.getStyle (nodeSTRorOBJ,stylePropertiesOBJ);
								................................................................................

								In order to get the values for multiple style properties in a single call, a style properties object can be specified using the =stylePropertiesOBJ= parameter. The value for this parameter should be an object, where each key is the name of a style property. The values for the individual properties in this object are not important - you can use any dummy values you like.

								Considerations for the value of the =stylePropertiesOBJ= parameter for the =Uize.Dom.Basics.getStyle= method are consistent with those for the =stylePropertiesOBJ= parameter of the =Uize.Dom.Basics.setStyle= method, and the values should be interchangeable between this pair of methods. Consider the following example...

								EXAMPLE
								......................................................................................
								var styleProperties = {borderWidth:0,borderColor:0,backgroundColor:0};

								Uize.Dom.Basics.setStyle ('node2',Uize.Dom.Basics.getStyle ('node1',styleProperties));
								Uize.Dom.Basics.setStyle ('node4',Uize.Dom.Basics.getStyle ('node3',styleProperties));
								......................................................................................

								In the above example, the variable =styleProperties= is defined to specify a set of style properties. The values for the individual properties in this object are not important - we use the dummy values =0=. The two statements that follow copy the values of the =borderWidth=, =borderColor=, and =backgroundColor= style properties from one node to another: in the first statement from the node with the id "node1" to the node with the id "node2", and in the second statement from the node with the id "node3" to the node with the id "node4".

								When provided with a =stylePropertiesOBJ= parameter, the =Uize.Dom.Basics.getStyle= method returns a value that is a style properties object, and this object can then be supplied to the =Uize.Dom.Basics.setStyle= method.

								Handling of Opacity
									The =Uize.Dom.Basics.getStyle= method deals with the difference between Internet Explorer and browsers that support the CSS standard =opacity= style property.

									For IE, the proprietary =filter= style property is queried, but as a developer you can specify =opacity= as if it were supported by IE.

									EXAMPLE 1
									.................................................................
									var opacityValue = Uize.Dom.Basics.getStyle ('myNode','opacity');
									.................................................................

									EXAMPLE 2
									.............................................................................................
									var opacityAndBorderColorObj = Uize.Dom.Basics.getStyle ('myNode',{opacity:1,borderColor:1});
									.............................................................................................

								NOTES
								- see also the companion =Uize.Dom.Basics.setStyle= static method
					*/
				},

				getValue:function (_node) {
					var _value;
					if (_node = _getById (_node)) {
						if (_isNode (_node)) {
							var _nodeTagName = _node.tagName;
							if (_nodeTagName == 'TEXTAREA') {
								_value = _node.value;
							} else if (_nodeTagName == 'INPUT') {
								_value = _node.type == 'checkbox' ? _node.checked : _node.value;
							} else if (_nodeTagName == 'SELECT') {
								if (_node.multiple) {
									_value = [];
									_Uize.forEach (
										_node.options,
										function (_option) {_option.selected && _value.push (_option.value)}
									);
								} else {
									_value = _node.value;
								}
							} else if (_nodeTagName == 'IMG') {
								_value = _node.src;
							} else {
								_value = _node.innerHTML.replace (/<br\/?>/gi,'\n').replace (/&nbsp;/g,' ');
							}
						} else {
							_value = (_Uize.findRecord (_node,{tagName:'INPUT',type:'radio',checked:_true}) || {}).value;
						}
					}
					return _value;
					/*?
						Static Methods
							Uize.Dom.Basics.getValue
								Returns a string or boolean, representing the value of the specified node.

								SYNTAX
								.............................................................
								nodeValueSTRorBOOL = Uize.Dom.Basics.getValue (nodeSTRorOBJ);
								.............................................................

								This method provides a convenient abstraction that makes it easier to change a form's implementation, without having to worry about modifying the JavaScript application logic that gets values from the form's fields. For example, you could change the HTML of a form so that what was once a =select= tag becomes a =radio= button set, and the call to =Uize.Dom.Basics.getValue= could remain unchanged.

								Text Fields
									For =textarea= tags and =input= tags of type =text= and =hidden=, this method returns the value of the node's =value= property.

								Select Boxes - Single Select
									For =select= tags in single select mode (i.e. where the =multiple= attribute is absent), this method returns the value of the selected option's =value= property.

									In the event that no option is selected, this method will return the value =''= (empty array).

								Select Boxes - Multiple Select
									For =select= tags in multiple select mode (i.e. where the =multiple= attribute is set to the value ='multiple'=), this method returns an array containing the values of the all selected options, in the order in which they appear in the options array.

									In the event that no options are selected, this method will return an empty array.

								Checkboxes
									For checkboxes (=input= tags of type =checkbox=), this method returns the value of the node's =checked= property.

								Radio Buttons
									For radio buttons (=input= tags of type =radio=), this method returns the value of the checked radio button's =value= property. If no radio button in the set is checked, then the value =undefined= is returned.

								Image Tags
									For =img= tags, this method returns the value of the node's =src= property.

								Other HTML Tags
									For all other HTML tags, this method returns value of the node's =innerHTML= property, with various characters decoded from HTML entities to reverse the effects of using the =Uize.Dom.Basics.setValue= static method.

								NOTES
								- see the corresponding =Uize.Dom.Basics.setValue= static method
					*/
				},

				injectHtml:function (_nodeBlob,_htmlToInject,_mode) {
					if (_htmlToInject != _null) {
						var
							_isInnerReplace, _isOuterReplace, _isInnerTop, _isOuterTop, _isOuterBottom, _isInnerBottom,
							_areNodes =
								_Uize.isList (_htmlToInject) ||
								(_isNode (_htmlToInject) && (_htmlToInject = [_htmlToInject]))
						;
						(
							(_isInnerReplace = _mode == 'inner replace') ||
							(_isOuterReplace = _mode == 'outer replace') ||
							(_isInnerTop = _mode == 'inner top') ||
							(_isOuterTop = _mode == 'outer top') ||
							(_isOuterBottom = _mode == 'outer bottom') ||
							(_isInnerBottom = _true)
						);
						_areNodes || (_htmlToInject += ''); // coerce to a string value by invoking valueOf method

						_doForAll (
							_nodeBlob,
							function (_node) {
								var _nodeChildNodes = _node.childNodes;
								function _htmlHasScript (_html) {
									return _html && /<script/i.test (_html)
								}
								function _htmlToInjectHasScript () {
									return _htmlHasScript (_htmlToInject)
								}
								if (
									(_isInnerReplace || (!_nodeChildNodes.length && (_isInnerTop || _isInnerBottom))) &&
									!_isNode &&
									!_htmlToInjectHasScript ()
								) {
									_node.innerHTML = _htmlToInject;
								} else if (_isOuterReplace && _isIe && !_isNode && !_htmlToInjectHasScript ()) {
									_node.outerHTML = _htmlToInject;
								} else {
									var _nodesToInject = [];
									if (_isInnerReplace)
										if (_isIe && _ieInnerHtmlReadOnly [_node.tagName]) {
											var _newNode = _node.cloneNode ();
											_node.replaceNode (_newNode);
											_node = _newNode;
										} else
											_node.innerHTML = '';
									if (_areNodes) {
										for (var _nodeNo = -1, _nodesLength = _htmlToInject.length; ++_nodeNo < _nodesLength;) {
											var _nodeToInject = _htmlToInject [_nodeNo];
											if (_nodeToInject) {
												if (_nodeToInject.parentNode)
													_nodeToInject = _nodeToInject.cloneNode (_true);
												_nodesToInject.push (_nodeToInject);
											}
										}
									} else {
										// IE is "special" in that it has nodes that don't accept innerHTML, so the solution to parse
										// the HTML string is to parse it as XML with the XMLDOM ACtiveX control. But XmlDom is different
										// than HtmlDom nodes, so we have to traverse the XmlDom tree creating corresponding HtmlDom nodes
										if (_ActiveXObject && _ieInnerHtmlReadOnly [_node.tagName]) {
											var _activeXObject = new _ActiveXObject('Microsoft.XMLDOM');
											_activeXObject.async = _false;
											_activeXObject.loadXML('<foo>' + _htmlToInject.replace(/&/g, '&amp;') + '</foo>');

											var
												_xmlChildNodes = _activeXObject.documentElement.childNodes,
												_convertToHtmlNode = function (_xmlNode) {
													var _htmlNode;
													switch (_xmlNode.nodeType) {
														case 1: // element
															_htmlNode = document.createElement(_xmlNode.tagName);

															// add attributes
															for (
																var
																	_xmlNodeAttributes = _xmlNode.attributes,
																	_attributeNo = _xmlNodeAttributes.length
																;
																--_attributeNo >= 0;
															) {
																var _attribute = _xmlNodeAttributes[_attributeNo];
																_htmlNode.setAttribute(_attribute.nodeName, _attribute.nodeValue);
															}

															// handle scripts specially but just getting text contents
															if (_htmlNode.tagName == 'SCRIPT')
																_htmlNode.text = _xmlNode.text;
															else {
																// all others iterate through child nodes and get their html equivalents
																for (
																	var
																		_childNodeNo = -1,
																		_xmlNodeChildNodes = _xmlNode.childNodes,
																		_xmlNodeChildNodesLength = _xmlNodeChildNodes.length,
																		_htmlChildNode
																	;
																	++_childNodeNo < _xmlNodeChildNodesLength;
																)
																	(_htmlChildNode = _convertToHtmlNode(_xmlNodeChildNodes[_childNodeNo]))
																		&& _htmlNode.appendChild(_htmlChildNode)
																;
															}

															break;
														case 3:	// text
															_htmlNode = document.createTextNode(_xmlNode.nodeValue);
															break;
														case 8: // comment
															_htmlNode = document.createComment(_xmlNode.nodeValue);
															break;
													}
													return _htmlNode;
												}
											;

											// iterate through XML nodes and convert to their HTML equivalents
											for (var _nodeNo = -1; ++_nodeNo < _xmlChildNodes.length;)
												_nodesToInject.push(
													_convertToHtmlNode(_xmlChildNodes[_nodeNo])
												)
											;

											// we have an array of nodes as opposed to a NodeList
											_areNodes = _true;
										} else {
											var _dummyNode = document.createElement (_node.tagName);
											_dummyNode.innerHTML = '<i>e</i>'	// fix for IE NoScope issue (http://www.thecssninja.com/javascript/noscope)
												+ _htmlToInject
											;
											_nodesToInject = _dummyNode.childNodes;
										}
									}
									var
										_nodeToInsertBefore = _isInnerTop
											? _nodeChildNodes [0]
											: _isOuterBottom ? _node.nextSibling : _node
										,
										_nodeParentNode = _node.parentNode,
										_nodesToSkip = +!_areNodes, // IE NoScope fix not needed when given dom nodes
										_fixCrippledScripts = function (_node) {
											if (_node.tagName == 'SCRIPT') {
												/* WORKAROUND:
													This is a workaround for an issue where script tags, that are part of HTML that is injected through innerHTML replacement, become crippled in the document. This is particularly an issue for component markup that is loaded and inserted dynamically and that may wish to define properties in companion script tags using the $[idPrefix] syntax.
												*/
												var _activatedScriptNode = document.createElement ('script');

												/*** transfer properties of crippled script node to fresh script node ***/
													if (_node.id) _activatedScriptNode.id = _node.id;
													if (_node.type) _activatedScriptNode.type = _node.type;
													_activatedScriptNode.text = _node.text;
													if (_node.src) _activatedScriptNode.src = _node.src;

												_node.parentNode.replaceChild (_activatedScriptNode,_node);
											} else if (_htmlHasScript (_node.innerHTML)) {
												_Uize.forEach (_node.childNodes,_fixCrippledScripts);
											}
										}
									;
									while (_nodesToInject.length > _nodesToSkip) {
										var _childNodeToInject = _areNodes ?
											_nodesToInject.shift () :
											_nodesToInject [_nodesToSkip];
										if (_isInnerBottom || _isInnerReplace) {
											_node.appendChild (_childNodeToInject);
										} else if (_isInnerTop) {
											_nodeToInsertBefore
												? _node.insertBefore (_childNodeToInject,_nodeToInsertBefore)
												: _node.appendChild (_childNodeToInject)
											;
										} else if (_isOuterTop || _isOuterReplace) {
											_nodeParentNode.insertBefore (_childNodeToInject,_nodeToInsertBefore);
										} else if (_isOuterBottom) {
											_nodeToInsertBefore
												? _nodeParentNode.insertBefore (_childNodeToInject,_nodeToInsertBefore)
												: _nodeParentNode.appendChild (_childNodeToInject)
											;
										}
										_areNodes || _fixCrippledScripts (_childNodeToInject); // Assume if given nodes that the proper fixes have already been applied
									}
									_isOuterReplace && _nodeParentNode.removeChild (_node);
								}
							}
						);
					}
					/*?
						Static Methods
							Uize.Dom.Basics.injectHtml
								Injects the specified HTML into the specified `node blob`.

								The action of this method is different to simply setting the =innerHTML= property in that it does not replace the existing contents, but instead adds to it.

								SYNTAX
								...................................................
								Uize.Dom.Basics.injectHtml (nodeBLOB,htmlSTRorOBJ);
								...................................................

								The =htmlSTRorOBJ= parameter can be a DOM node, an array of DOM nodes, a string containing the HTML you wish to inject, or it can be any object that implements a =valueOf= interface (such as an instance of a =Uize.Class= subclass that implements the =value= state property).

								VARIATION
								.................................................................
								Uize.Dom.Basics.injectHtml (nodeBLOB,htmlSTRorOBJ,injectModeSTR);
								.................................................................

								When the optional =injectModeSTR= parameter is specified, the manner in which the HTML is injected can be controlled. The default value for this parameter, ='inner bottom'=, results in the HTML being appended to the existing contents. However, if the value ='inner top'= is specified, then the HTML will be injected before the existing contents.

								Injection Modes
									- ='inner bottom'= (the default) - HTML will be injected inside the node, after all of its contents
									- ='inner top'= - HTML will be injected inside the node, before all of its contents
									- ='outer bottom'= - HTML will be injected outside the node, right after the node
									- ='outer top'= - HTML will be injected outside the node, right before the node
									- ='inner replace'= - HTML will replace the contents in the node (equivalent to innerHTML replacement)
									- ='outer replace'= - HTML will replace the node itself (equivalent to IE's outerHTML replacement)

								NOTES
								- this method can operate on multiple nodes at a time. For more details, see the section on `node blob`
								- compare to the =Uize.Dom.Basics.setInnerHtml= static method
					*/
				},

				isOnNodeTree:_isOnNodeTree = function (_node,_rootNode) {
					_node = _getById (_node);
					_rootNode = _getById (_rootNode);
					while (_node) {
						if (_node == _rootNode) return _true;
						_node = _node.parentNode;
					}
					return _false;
					/*?
						Static Methods
							Uize.Dom.Basics.isOnNodeTree
								Returns a boolean, indicating whether or not the specified node is contained somewhere within the node tree of the specified root node.

								SYNTAX
								................................................................................
								isOnNodeTreeBOOL = Uize.Dom.Basics.isOnNodeTree (nodeSTRorOBJ,rootNodeSTRorOBJ);
								................................................................................

								NOTES
								- returns =true= if the =nodeSTRorOBJ= and =rootNodeSTRorOBJ= parameters both specify the same node
					*/
				},

				isNode:_isNode = function (_node) {
					return !!(
						_node && typeof _node == _typeObject &&
						(_node.nodeType || _node.getAttribute || _node.documentElement || _node.self == _node)
					);
					/*?
						Static Methods
							Uize.Dom.Basics.isNode
								Returns a boolean, indicating whether or not the specified value is a node reference.

								SYNTAX
								..........................................................
								isNodeBOOL = Uize.Dom.Basics.isNode (possibleNodeANYTYPE);
								..........................................................

								In order for this method to return =true=, the value of the =possibleNodeANYTYPE= parameter *must* be an object reference to an element node, and not merely a string whose value is the ID of a node.
					*/

				},

				joinIdPrefixAndNodeId:_joinIdPrefixAndNodeId = function (_idPrefix,_nodeId) {
					return (_idPrefix || '') + (_idPrefix && _nodeId ? '-' : '') + _nodeId;
					/*?
						Static Methods
							Uize.Dom.Basics.joinIdPrefixAndNodeId
								.
					*/
				},

				doForAll:_doForAll = function (_nodeBlob,_function,_idPrefix,_nodeCache) {
					if (typeof _nodeBlob == _typeString)
						_nodeBlob = _getById (_nodeBlob,_idPrefix,_nodeCache)
					;
					if (_nodeBlob != _undefined) {
						if (_isNode (_nodeBlob)) {
							_function (_nodeBlob);
						} else {
							var _typeofNodeBlob = typeof _nodeBlob;
							if (
								(_typeofNodeBlob == _typeObject || _typeofNodeBlob == 'function') &&
								typeof _nodeBlob.length == 'number'
							) {
								for (
									var _subNodeBlobNo = -1, _nodeBlobLength = _nodeBlob.length;
									++_subNodeBlobNo < _nodeBlobLength;
								)
									_doForAll (_nodeBlob [_subNodeBlobNo],_function,_idPrefix,_nodeCache)
								;
							} else if (_typeofNodeBlob == _typeObject) {
								for (var _subNodeBlobName in _nodeBlob)
									_doForAll (_nodeBlob [_subNodeBlobName],_function,_idPrefix,_nodeCache)
								;
							}
						}
					}
					/*?
						Static Methods
							Uize.Dom.Basics.doForAll
								Iterates through the specified `node blob`, calling the specified function for each node and passing the node reference as a parameter.

								SYNTAX
								...............................................
								Uize.Dom.Basics.doForAll (nodeBLOB,actionFUNC);
								...............................................

								EXAMPLE
								.........................................................................................
								Uize.Dom.Basics.doForAll (
									['topLeftAddButton','topRightAddButton','bottomLeftAddButton','bottomRightAddButton'],
									function (node) {
										node.src = 'images/add-button.gif';
										node.style.border = '1px solid #fff';
										Uize.Dom.Basics.wire (node,'click',handleAddButtonClick);
									}
								);
								.........................................................................................

								VARIATION
								...........................................................
								Uize.Dom.Basics.doForAll (nodeBLOB,actionFUNC,idPrefixSTR);
								...........................................................

								When the optional =idPrefixSTR= parameter is specified, then any nodes specified in the =nodeBLOB= using a string ID are resolved by first applying the ID prefix.
					*/
				},

				remove:function (_nodeBlob) {
					_doForAll (_nodeBlob,function (_node) {_node.parentNode.removeChild (_node)});
					/*?
						Static Methods
							Uize.Dom.Basics.remove
								Removes the specified `node blob` from the DOM.

								SYNTAX
								..................................
								Uize.Dom.Basics.remove (nodeBLOB);
								..................................

								NOTES
								- if other references to nodes being removed are still being maintained, those nodes will not be freed from memory until all those other references are nulled
								- this method can operate on multiple nodes at a time. For more details, see the section on `node blob`
					*/
				},

				setClipRect:function (_nodeBlob,_top,_right,_bottom,_left) {
					var _clipValue = 'rect(' + _top + 'px, ' + _right + 'px, ' + _bottom + 'px, ' + _left + 'px)';
					_doForAll (_nodeBlob,function (_node) {_node.style.clip = _clipValue});
					/*?
						Static Methods
							Uize.Dom.Basics.setClipRect
								Serializes the specified clip parameters into a string and sets the value of the "clip" CSS property for the specified `node blob`.

								SYNTAX
								.........................................................................
								Uize.Dom.Basics.setClipRect (nodeBLOB,topINT,rightINT,bottomINT,leftINT);
								.........................................................................

								NOTES
								- this method can operate on multiple nodes at a time. For more details, see the section on `node blob`
					*/
				},

				setInnerHtml:function (_nodeBlob,_html) {
					_html += ''; // coerce to a string value by invoking valueOf method
					_doForAll (_nodeBlob,function (_node) {_node.innerHTML = _html});
					/*?
						Static Methods
							Uize.Dom.Basics.setInnerHtml
								Sets the value of the =innerHTML= property of the specified `node blob`.

								SYNTAX
								.....................................................
								Uize.Dom.Basics.setInnerHtml (nodeBLOB,htmlSTRorOBJ);
								.....................................................

								The =htmlSTRorOBJ= parameter can be a string containing the HTML you wish to inject, or it can be any object that implements a =valueOf= interface (such as an instance of a =Uize.Class= subclass that implements the =value= state property).

								NOTES
								- this method can operate on multiple nodes at a time. For more details, see the section on `node blob`
								- compare to the =Uize.Dom.Basics.injectHtml= static method
					*/
				},

				setOpacity:function (_nodeBlob,_opacity) {
					_opacityStyleProperty.opacity = _opacity;
					_setStyle (_nodeBlob,_opacityStyleProperty);
					/*?
						Static Methods
							Uize.Dom.Basics.setOpacity
								Sets the opacity (and, therefore, the transparency) of the specified `node blob`.

								SYNTAX
								..................................................
								Uize.Dom.Basics.setOpacity (nodeBLOB,opacityFLOATorOBJ);
								..................................................

								Varying degrees of opacity are achieved in different browsers using slightly different techniques. This method acts as an abstraction so you can set opacity for a node in a standard way. =opacityFLOAT= should be a number in the range of =0= to =1=, where =0= represents completely invisible, =1= represents completely opaque, and any fractional values inbetween represent varying degrees of transparency / opacity.

								NOTES
								- this method can operate on multiple nodes at a time. For more details, see the section on `node blob`
								- the =opacityFLOATorOBJ= parameter can be an object that implements a =valueOf= interface (such as an instance of a =Uize.Class= subclass that implements the =value= state property)
					*/
				},

				setProperties:function (_nodeBlob,_properties) {
					_doForAll (_nodeBlob,function (_node) {_copyInto (_node,_properties)});
					/*?
						Static Methods
							Uize.Dom.Basics.setProperties
								Sets values for an arbitrary set of properties for the specified `node blob`.

								SYNTAX
								.......................................................
								Uize.Dom.Basics.setProperties (nodeBLOB,propertiesOBJ);
								.......................................................

								EXAMPLE
								...........................................................
								Uize.Dom.Basics.setProperties (
									['thumbnailImage0','thumbnailImage1','thumbnailImage2'],
									{
										src:'images/blank.gif',
										width:200,
										height:150,
										alt:'loading...',
										title:'loading...'
									}
								);
								...........................................................

								NOTES
								- this method can operate on multiple nodes at a time. For more details, see the section on `node blob`
					*/
				},

				setStyle:_setStyle = function (_nodeBlob,_properties) {
					_doForAll (
						_nodeBlob,
						function (_node) {
							var
								_nodeStyle = _node.style,
								_propertyValue
							;
							if (_isIe && 'opacity' in _properties)
								_nodeStyle.filter =
									/* NOTE:
										if the value is an empty string, it will be turned into #, which will produce NaN when multiplied by 100, and NaN is not less than 100. For the number 0, the string '0' will be retained and coerced back to 0 when multiplied. This is more compact and does not involve an additional function call, which is more important for animations for opacity where it is called repeatedly.
									*/
									(_propertyValue = Math.round ((_properties.opacity + '' || '#') * 100)) < 100
										? 'alpha(opacity=' + _propertyValue + ')'
										: ''
							;
							for (var _property in _properties)
								_nodeStyle [_property] =
									(
										typeof (_propertyValue = _properties [_property]) == _typeObject && _propertyValue
											? (_propertyValue = _propertyValue.valueOf ())
											: _propertyValue
									) != _undefined
										? (
											typeof _propertyValue == 'number' && _property != 'opacity' && _property != 'zIndex'
												? Math.round (_propertyValue) + 'px'
												: _propertyValue + ''
										)
										: ''
							;
						}
					);
					/*?
						Static Methods
							Uize.Dom.Basics.setStyle
								Sets values for an arbitrary set of style properties for the specified `node blob`.

								SYNTAX
								.......................................................
								Uize.Dom.Basics.setStyle (nodeBLOB,stylePropertiesOBJ);
								.......................................................

								EXAMPLE
								..................................................
								Uize.Dom.Basics.setStyle (
									['navButton1Id','navButton2Id','navButton3Id'],
									{
										display : 'block',
										position  :'absolute',
										visibility : 'inherit',
										top : '100px'
									}
								);
								..................................................

								Special Handling for Opacity
									The =Uize.Dom.Basics.setStyle= method abstracts the differences between Internet Explorer and browsers that support the standard CSS =opacity= property.

									This means that you can use the =Uize.Dom.Basics.setStyle= method to set opacity as you would any other CSS style property, and the method will set the value of IE's proprietary =filter= style property as necessary.

									EXAMPLE
									........................................................................
									Uize.Dom.Basics.setStyle ('myNodeId',{opacity:.5,width:200,height:100});
									........................................................................

								Specifying Number Values
									When number type values are specified for CSS style properties (other than the =opacity= and =zIndex= properties), the values are converted to strings by appending the "px" unit.

									So, for example, the following statement...

									.....................................................................
									Uize.Dom.Basics.setStyle ('myNodeId',{width:'200px',height:'100px'});
									.....................................................................

									...can also be written as...

									.............................................................
									Uize.Dom.Basics.setStyle ('myNodeId',{width:200,height:100});
									.............................................................

									This feature of the =Uize.Dom.Basics.setStyle= method is provided as a convenience, so that the values of number type variables can be supplied - as is - when setting style properties such as =left=, =top=, =width=, =height=, =fontSize=, etc.

								Specifying Instance Values
									When an instance of a =Uize.Class= subclass is specified for a CSS style property, the instance's =valueOf Intrinsic Method= is invoked in order to obtain the value of the instance's =value= state property.

									So, for example, the following statement...

									.................................................................................
									Uize.Dom.Basics.setStyle ('myNodeId',{width:myWidthSlider.get ('value') + 'px'});
									.................................................................................

									...can also be written as just...

									............................................................
									Uize.Dom.Basics.setStyle ('myNodeId',{width:myWidthSlider});
									............................................................

									This feature of the =Uize.Dom.Basics.setStyle= method is provided as a convenience, so that instances of =Uize.Class= subclasses that are value selectors and that implement the =value= state property can be supplied - as is - when setting any style properties. If the value for an instance is a number type, then it will be further handled according to the rules for `specifying number values`.

								NOTES
								- this method can operate on multiple nodes at a time. For more details, see the section on `node blob`
								- see also the companion =Uize.Dom.Basics.getStyle= static method
					*/
				},

				setValue:function (_nodeBlob,_value) {
					_value += ''; // coerce to a string value by invoking valueOf method
					_doForAll (
						_nodeBlob,
						function (_node) {
							var
								_nodeTagName = _node.tagName,
								_oldReadOnly = _node.readOnly
							;
							if (_oldReadOnly) _node.readOnly = _false;
							if (_nodeTagName == 'TEXTAREA') {
								if (_value != _node.value)
									_node.value = _value
								;
							} else if (_nodeTagName == 'INPUT') {
								var _nodeType = _node.type;
								if (_nodeType == 'checkbox') {
									_node.checked = _value == 'true';
								} else if (_nodeType == 'radio') {
									_node.checked = _node.value == _value;
								} else {	// text, password, hidden, HTML5 types, etc.
									if (_value != _node.value)
										_node.value = _value
									;
								}
							} else if (_nodeTagName == 'SELECT') {
								var _options = _node.options;
								if (_node.multiple && (_value == '*' || _value.indexOf (',') > -1)) {
									var _valuesMap = _value != '*' ? _Uize.lookup (_value.split (',')) : _undefined;
									for (var _optionNo = _options.length, _option; --_optionNo >= 0;)
										(_option = _options [_optionNo]).selected = !_valuesMap || _valuesMap [_option.value]
									;
								} else {
									_node.selectedIndex = _Uize.findRecordNo (
										_options,{value:_value},
										_value ? _node.selectedIndex : -1
									);
								}
							} else if (_nodeTagName == 'IMG') {
								if (_value) _node.src = _value;
							} else {
								_nodeTagName == 'PRE' && _isIe
									? (_node.innerText = _value)
									: (_node.innerHTML = _value.replace (/</g,'&lt;').replace (/\n/g,'<br/>'))
								;
							}
							if (_oldReadOnly) _node.readOnly = _oldReadOnly;
						}
					);
					/*?
						Static Methods
							Uize.Dom.Basics.setValue
								Sets the value of the specified `node blob`.

								SYNTAX
								.............................................................
								Uize.Dom.Basics.setValue (nodeBLOB,valueSTRorNUMorBOOLorOBJ);
								.............................................................

								In addition to being able to be a simple type value (like a string, boolean, or number), the =valueSTRorNUMorBOOLorOBJ= parameter can also be any object that implements a =valueOf= interface (such as an instance of a =Uize.Class= subclass that implements the =value= state property).

								This method provides a convenient abstraction that makes it easier to change a form's implementation, without having to worry about modifying the JavaScript application logic that sets values for the form's fields. For example, you could change the HTML of a form so that what was once a =select= tag becomes a =radio= button set, and the call to =Uize.Dom.Basics.setValue= could remain unchanged.

								EXAMPLE
								..........................................................................
								Uize.Dom.Basics.setValue (
									[
										Uize.Dom.Basics.find ({root:'myFormId',tagName:'TEXTAREA'}),
										Uize.Dom.Basics.find ({root:'myFormId',tagName:'INPUT',type:'text'})
									],
									''
								);
								..........................................................................

								In the above example, an array `node blob` is being supplied to the =Uize.Dom.Basics.setValue= method. Each element of the array is itself an array, being the result of a call to the =Uize.Dom.Basics.find= method. Essentially, this example is finding all the =textarea= and text =input= tags within the form of the id =myFormId= and using the =Uize.Dom.Basics.setValue= method to set their values to an empty string, thereby clearing all the form's text fields.

								Text Fields
									For =textarea= tags and =input= tags of type =text= and =hidden=, the node's =value= property is set to the value of the =valueSTRorNUMorBOOLorOBJ= parameter.

								Select Boxes - Single Select
									For =select= tags in single select mode (i.e. where the =multiple= attribute is absent), the node's =selectedIndex= property is set to the index of the option whose =value= property corresponds to the value of the =valueSTRorNUMorBOOLorOBJ= parameter.

									If there is no option whose =value= property corresponds, then the =selectedIndex= of the node will not be changed.

									Empty String Reserved
										When the special value =''= (empty string) is specified, then the =selectedIndex= of the node will be set to the value =-1=, upon which no option will be selected.

								Select Boxes - Multiple Select
									For =select= tags in multiple select mode (i.e. where the =multiple= attribute is set to the value ='multiple'=), the =selected= property for every option in the select box whose value is in the specified selected options value will be set to =true=.

									When using the =Uize.Dom.Basics.setValue= method to set the selected options of a multiple select =select= tag, the selected options can be specified either as an array of strings, or as a string formatted as a comma-separated list, where the items in the selected options list should be the values of the options that should become selected (i.e. *not* the display text for the options).

									Order Unimportant
										The order in which the selected options are specified in the list is not important.

										In the following example, both statements would have the same outcome...

										EXAMPLE
										............................................................
										Uize.Dom.Basics.setValue ('renewablesList',['Solar','Wind']);
										Uize.Dom.Basics.setValue ('renewablesList',['Wind','Solar']);
										............................................................

									Invalid Values Ignored
										Any option values that appear in the list that don't correspond to options in the =select= tag will be ignored.

										EXAMPLE
										...................................................................................
										Uize.Dom.Basics.setValue ('renewablesList',['Solar','Wind','Oil']);  // oil ignored
										...................................................................................

										There is no option ='Oil'= in our list of renewable energy technologies, so this value would simply be ignored, and only the ='Solar'= and ='Wind'= options would become selected.

									Duplicate Values Are Allowed
										Duplicate entries in the selected options list are permitted, a behavior which comes in handy when performing `additive selection`.

										In the following example, both statements would have the same outcome...

										EXAMPLE
										.......................................................................................
										Uize.Dom.Basics.setValue ('renewablesList',['Solar','Wind']);
										Uize.Dom.Basics.setValue ('renewablesList',['Solar','Wind','Solar']);  // has duplicate
										.......................................................................................

									Don't Pad Comma-separated Values
										When the selected options are specified as a comma-separated string, the values in the string *should not* be padded with extra spaces, or the specified options will not become selected correctly.

										INCORRECT
										........................................................................................
										Uize.Dom.Basics.setValue ('renewablesList','Wind , Solar');  // padding around comma bad
										Uize.Dom.Basics.setValue ('renewablesList','Wind, Solar');   // padding after comma bad
										Uize.Dom.Basics.setValue ('renewablesList','Wind ,Solar');   // padding before comma bad
										Uize.Dom.Basics.setValue ('renewablesList',' Wind,Solar ');  // padding around list bad
										........................................................................................

										CORRECT
										.........................................................
										Uize.Dom.Basics.setValue ('renewablesList','Wind,Solar');
										.........................................................

									Option Values May Not Contain Commas
										Because this method supports a selected options list specified as a comma-separated string, the values of individual options must not contain commas in order for this method to work correctly.

										Due to the implementation of this method, this restriction applies even when specifying the selected options list as an array of strings.

									Empty String Reserved
										When the special value =''= (empty string) is specified, then the =selectedIndex= of the node will be set to the value =-1=, upon which no options will be selected.

										Using this value has the effect of clearing all the selected options, behaving as a "select none" feature.

										EXAMPLE
										.................................................................................
										Uize.Dom.Basics.setValue ('renewablesList','');  // clear selection of renewables
										.................................................................................

									Wildcard '*' Reserved
										When the special wildcard value ='*'= is specified, then the =selected= property for every option in the select box will be set to =true=.

										Using this value has the effect of selecting all available options, behaving as a "select all" feature.

										EXAMPLE
										...................................................................................
										Uize.Dom.Basics.setValue ('renewablesList','*');  // select all forms of renewables
										...................................................................................

									Additive Selection
										When using the =Uize.Dom.Basics.setValue= method to set the selected options of a multiple select =select= tag, the selected options after the method is called will be *only* those in the specified selected options value.

										Any options that are *not* in the specified selected options value will become unselected. In most cases, this will be the desired behavior. However, in some cases one may wish to add additional selected options without blowing away existing selected options. To accomplish this, one can use the =Uize.Dom.Basics.getValue= method in conjunction with the =Uize.Dom.Basics.setValue= method, as follows...

										EXAMPLE
										......................................................................
										Uize.Dom.Basics.setValue (
											'renewablesList',
											Uize.Dom.Basics.getValue ('renewablesList').concat ('Solar','Wind')
										);
										......................................................................

										In the above example, a node with the =id= of ='renewablesList'= is a multiple select =select= tag that lets the user choose any number of renewable energy technologies.

										Executing the statement in the example would add the ='Solar'= and ='Wind'= options to the selected options. To avoid blowing away any currently selected options, the =Uize.Dom.Basics.getValue= method is used to get the currently selected options. The value returned from this method is an array, so we can use the =concat= method of the =Array= object to "merge in" the ='Solar'= and ='Wind'= options. The resulting array is then supplied to the =Uize.Dom.Basics.setValue= method to set the selected options. It doesn't matter if either - or both - of the ='Solar'= and ='Wind'= options were already selected, since `duplicate values are allowed` by the =Uize.Dom.Basics.setValue= method.

								Checkboxes
									For checkboxes (=input= tags of type =checkbox=), the =checked= property of the node is set to =true= or =false= dependending on whether or not the value of the =valueSTRorNUMorBOOLorOBJ= parameter is equivalent to =true= (i.e. if it has the boolean value =true= or the string value ='true'=).

								Radio Buttons
									For radio buttons (=input= tags of type =radio=), the =checked= property of the radio button node in the set whose =value= property corresponds to the value of the =valueSTRorNUMorBOOLorOBJ= parameter is set to =true=, while the =checked= property of all other radio button nodes in the set is set to =false=.

									If there is no radio button whose =value= property corresponds, then all radio buttons in the set will be left unchecked.

								Image Tags
									For =img= tags, the node's =src= property is set to the value of the =valueSTRorNUMorBOOLorOBJ= parameter.

								Other HTML Tags
									For all other HTML tags, the node's =innerHTML= property is set to the value of the =valueSTRorNUMorBOOLorOBJ= parameter, with various characters encoded to HTML entities so that the value is displayed literally.

								NOTES
								- you can use the =Uize.Dom.Basics.setValue= method to set values on readonly form elements
								- see the corresponding =Uize.Dom.Basics.getValue= static method
								- the =value= parameter can be an object that implements a =valueOf= interface (such as an instance of a =Uize.Class= subclass that implements the =value= state property)
					*/
				},

				show:function (_nodeBlob,_mustShow) {
					_setStyle (_nodeBlob,{visibility:_mustShow || _mustShow === _undefined ? 'inherit' : 'hidden'});
					/*?
						Static Methods
							Uize.Dom.Basics.show
								Lets you show or hide the specified `node blob`.

								SYNTAX
								.............................................
								Uize.Dom.Basics.show (nodeBLOB,mustShowBOOL);
								.............................................

								This method operates on the =visibility= style property of nodes. When =true= is specified for the =mustShowBOOL= parameter, then the =visibility= property is set to ="inherit"=. When =false= is specified, the =visibility= property is set to ="hidden"=.

								NOTES
								- this method can operate on multiple nodes at a time. For more details, see the section on `node blob`
					*/
				},

				unwire:_unwire = function (_nodeBlob,_eventNameOrEventsMap,_argument3,_argument4) {
					if (
						typeof _eventNameOrEventsMap == _typeObject &&
						_eventNameOrEventsMap &&
						!_eventNameOrEventsMap.virtualDomEvent
					) {
						// _argument3 is _wiringOwnerId
						for (var _eventName in _eventNameOrEventsMap)
							_unwire (_nodeBlob,_eventName,_eventNameOrEventsMap [_eventName],_argument3)
						;
					} else {
						// _argument3 is _handler
						// _argument4 is _wiringOwnerId
						_package.unwireEventsByOwnerId (
							_argument4,
							_nodeBlob !== _undefined || _eventNameOrEventsMap != _undefined || _argument3 != _undefined
								? {node:_nodeBlob,eventName:_eventNameOrEventsMap,handler:_argument3}
								: _undefined
						);
					}
					/*?
						Static Methods
							Uize.Dom.Basics.unwire
								Lets you unwire one or more event handlers for the specified node or `node blob`.

								SYNTAX
								................................................................
								Uize.Dom.Basics.unwire (nodeBLOB,eventNameSTR,eventHandlerFUNC);
								................................................................

								EXAMPLE
								........................................................
								function clickHandler1 () {alert ('foo')}
								function clickHandler2 () {alert ('bar')}

								Uize.Dom.Basics.wire ('myNode','click',clickHandler1);
								Uize.Dom.Basics.wire ('myNode','click',clickHandler2);

								Uize.Dom.Basics.unwire ('myNode','click',clickHandler1);
								........................................................

								The above example would unwire only the =clickHandler1= handler for the =click= event of the node =myNode=. So, after the above code has been executed, clicking on this node would produce only one alert dialog displaying the text "bar" (so long, foo).

								VARIATION 1
								...............................................
								Uize.Dom.Basics.unwire (nodeBLOB,eventNameSTR);
								...............................................

								When no =eventHandlerFUNC= parameter is specified, then all handlers wired for the specified event of the specified node or `node blob` will be unwired. This applies only to handlers wired using the =Uize.Dom.Basics= module, and belonging to the `global wirings owner`.

								EXAMPLE
								..........................................
								Uize.Dom.Basics.unwire ('myNode','click');
								..........................................

								The above example would unwire all handlers for the =click= event of the node =myNode=.

								VARIATION 2
								.............................................................
								Uize.Dom.Basics.unwire (nodeBLOB,eventNamesToHandlersMapOBJ);
								.............................................................

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

								Uize.Dom.Basics.wire (
									'myNode',
									{
										mouseover:mouseoverHandler,
										mouseout:mouseoutHandler,
										click:clickHandler
									}
								);
								Uize.Dom.Basics.unwire (
									'myNode',
									{
										mouseover:mouseoverHandler,
										mouseout:mouseoutHandler
									}
								);
								..................................................

								In the above example, handlers are being wired to the =mouseover=, =mouseout=, and =click= events of the node =myNode=. Then the handlers for the =mouseover= and =mouseout= events are being unwired, leaving only the handler that was wired to the =click= event.

								VARIATION 3
								..................................
								Uize.Dom.Basics.unwire (nodeBLOB);
								..................................

								When no =eventNameSTR= or =eventHandlerFUNC= parameters are specified, then all handlers wired for all events of the specified node or `node blob` will be unwired. This applies only to handlers wired using the =Uize.Dom.Basics= module, and belonging to the `global wirings owner`.

								EXAMPLE
								..................................
								Uize.Dom.Basics.unwire ('myNode');
								..................................

								The above example would unwire all handlers for all events of the node =myNode=.

								VARIATION 4
								...........................................................................
								Uize.Dom.Basics.unwire (nodeBLOB,eventNameSTR,eventHandlerFUNC,ownerIdSTR);
								Uize.Dom.Basics.unwire (nodeBLOB,eventNamesToHandlersMapOBJ,ownerIdSTR);
								...........................................................................

								When the optional =ownerIdSTR= parameter is specified, then only wirings belonging to the specified owner will be unwired by this method. This ownership mechanism is primarily intended for the implementation of the =Uize.Widget= class, but may also be useful when coding less formal mappings of interaction logic to sets of DOM nodes.

								Global Wirings Owner
									When the optional =ownerIdSTR= parameter is not specified, the default value of =''= (empty string) is used.

									The default empty string owner ID can be considered as the global wirings owner. Whenever the =Uize.Dom.Basics.wire= and =Uize.Dom.Basics.unwire= static methods are called and no =ownerIdSTR= is supplied, or if the value =''= (empty string) is explicitly specified for this parameter, then the wirings are assigned to the global pool.

									With this default behavior, this method only unwires event handlers that have been wired by this module and will not unwire event handlers wired for a node by widget instances (i.e. instances of a =Uize.Widget= subclass), even if the specified event name and handler match a wiring owned by a widget instance. Additionally, this method will not unwire event handlers wired for nodes using code that does not utilize the =Uize.Dom.Basics= module for DOM event management.

								NOTES
								- see the companion =Uize.Dom.Basics.wire= static method
								- compare to the =Uize.Dom.Basics.unwireEventsByOwnerId= static method
								- compare to the =wireNode=, =unwireNode=, and =unwireNodeEventsByMatch= instance methods of the =Uize.Widget= module
					*/
				},

				unwireEventsByOwnerId:function (_wiringOwnerId,_eventMatch) {
					var _wiringIds = _wiringIdsByOwnerId [_wiringOwnerId = _wiringOwnerId || ''];
					if (_wiringIds) {
						var _unwireWiringForNode = function (_eventMatchNode) {
							if (_eventMatchNode !== _null) {
								var
									_eventMatchEventName = _eventMatch && _eventMatch.eventName,
									_eventMatchHandler = _eventMatch && _eventMatch.handler,
									_effectivelyHasEventMatch = _eventMatchNode || _eventMatchEventName || _eventMatchHandler
								;
								if (_eventMatchEventName && _eventMatchEventName.charCodeAt)
									_eventMatchEventName = _resolveStringEventName (_eventMatchEventName)
								;
								for (var _wiringIdNo = _wiringIds.length; --_wiringIdNo >= 0;) {
									var
										_wiringId = _wiringIds [_wiringIdNo],
										_wiring = _wirings [_wiringId],
										_node = _wiring._node,
										_eventName = _wiring._eventName
									;
									if (
										!_effectivelyHasEventMatch ||
										(
											(!_eventMatchNode || _eventMatchNode == (_wiring._unremappedNode || _node)) &&
											(!_eventMatchEventName || _eventMatchEventName == _eventName) &&
											(!_eventMatchHandler || _eventMatchHandler == _wiring._handler)
										)
									) {
										_effectivelyHasEventMatch && _wiringIds.splice (_wiringIdNo,1);
										if (_wiring._subWiringsOwnerId) {
											_package.unwireEventsByOwnerId (_wiring._subWiringsOwnerId)
											/* NOTE:
												the wiring is for a virtual DOM event that holds references to supporting events that form part of its implementation and which must also be unwired
											*/
										} else {
											try {
												_node == window && _needsWindowEventVehicle
													? _windowEventVehicle.unwire (_eventName,_wiring._handlerCaller)
													: _isIe
														? _node.detachEvent ('on' + _eventName,_wiring._handlerCaller)
														: _node.removeEventListener (_eventName,_wiring._handlerCaller,_false)
												;
											} catch (_error) {
												// the node must be gone already, so don't do anything
											}
										}
										delete _wirings [_wiringId];
									}
								}
								(_effectivelyHasEventMatch && _wiringIds.length) || delete _wiringIdsByOwnerId [_wiringOwnerId];
							}
						};
						_eventMatch && _eventMatch.node !== _undefined
							? _doForAll (_eventMatch.node,_unwireWiringForNode)
							: _unwireWiringForNode ()
						;
					}
					/*?
						Static Methods
							Uize.Dom.Basics.unwireEventsByOwnerId
								Unwires node event handlers that have been wired for the specified owner.

								This method is primarily intended for the implementation of the =Uize.Widget= class, but may also be useful when coding less formal mappings of interaction logic to sets of DOM nodes.

								SYNTAX
								...................................................
								Uize.Dom.Basics.unwireEventsByOwnerId (ownerIdSTR);
								...................................................

								VARIATION
								.................................................................
								Uize.Dom.Basics.unwireEventsByOwnerId (ownerIdSTR,eventMatchOBJ);
								.................................................................

								When the optional =eventMatchOBJ= parameter is specified, then node event handlers of the specified owner will only be unwired if they fit the specified match criteria. The =eventMatchOBJ= parameter is an object that may contain any of the properties =node=, =eventName=, and =handler=, where =node= should be a reference to a DOM node (or an array of references to DOM nodes), =eventName= should be the name of a node event, and =handler= should be a function reference.

								EXAMPLE 1
								..........................................................................
								Uize.Dom.Basics.unwireEventsByOwnerId ('imageViewer',{eventName:'click'});
								..........................................................................

								In this example, all =click= event handlers of the owner "imageViewer" would be unwired.

								EXAMPLE 2
								..........................................................................
								Uize.Dom.Basics.unwireEventsByOwnerId ('imageViewer',{node:'zoomButton'});
								..........................................................................

								In this example, all handlers wired for the "zoomButton" node of the owner ='imageViewer'= would be unwired.

								NOTES
								- see also the =Uize.Dom.Basics.wire= static method
					*/
				},

				wire:(function () {
					var
						_quarantine = _Uize.quarantine,
						_makeWindowEventHandlerCaller = _quarantine (
							function (_wiringId) {
								return (
									function (_event) {
										var _wiring = window.Uize && Uize.Dom.Basics._wirings [_wiringId];
											/* NOTE: test on window.Uize in case page is being torn down */
										return _wiring && _wiring._handler.call (_wiring._node,_event.windowEvent);
											/* NOTE:
												_wiring could be undefined if window.Uize is undefined because the page is being torn down, or in some cases in IE if the DOM event is still fired after the wiring is removed (some kind of a threading issue?)
											*/
									}
								);
							}
						),
						_makeGenericHandlerCaller = _quarantine (
							function (_wiringId) {
								return (
									function (_event) {
										var _wiring = window.Uize && Uize.Dom.Basics._wirings [_wiringId];
											/* NOTE: test on window.Uize in case page is being torn down */
										return _wiring && _wiring._handler.call (_wiring._node,_event || window.event);
											/* NOTE:
												_wiring could be undefined if window.Uize is undefined because the page is being torn down, or in some cases in IE if the DOM event is still fired after the wiring is removed (some kind of a threading issue?)
											*/
									}
								);
							}
						),
						_handlerCallerMakersByEvent = {
							click:_makeGenericHandlerCaller,
							mouseover:_quarantine (
								function (_wiringId) {
									return (
										function (_event) {
											var
												_Uize_Dom_Basics = Uize.Dom.Basics,
												_wiring = window.Uize && _Uize_Dom_Basics._wirings [_wiringId],
													/* NOTE: test on window.Uize in case page is being torn down */
												_exitNode = (_event || (_event = window.event)).fromElement || _event.relatedTarget
											;
											if (_wiring) {
												/* NOTE:
													_wiring could be undefined if window.Uize is undefined because the page is being torn down, or in some cases in IE if the DOM event is still fired after the wiring is removed (some kind of a threading issue?)
												*/
												if (_exitNode) {
													try {
														if (
															!_exitNode.Uize_Widget_Drag_shield &&
															!_Uize_Dom_Basics.isOnNodeTree (_exitNode,_wiring._node)
														)
															_exitNode = null
														;
													} catch (_error) {
														/* NOTE:
															In some cases in Firefox, trying to get a property of form nodes results in a weird permission denied exception. In this case we can't determine if the node is in the tree.
															In that case, pass the event along
														*/
														_exitNode = null;
													}
												}
												if (!_exitNode) {
													_Uize_Dom_Basics._captureMousePos (_event);
													return _wiring._handler.call (_wiring._node,_event);
												}
											}
										}
									);
								}
							),
							mouseout:_quarantine (
								function (_wiringId) {
									return (
										function (_event) {
											var
												_Uize_Dom_Basics = Uize.Dom.Basics,
												_wiring = window.Uize && _Uize_Dom_Basics._wirings [_wiringId],
													/* NOTE: test on window.Uize in case page is being torn down */
												_entryNode = (_event || (_event = window.event)).toElement || _event.relatedTarget
											;
											if (_wiring) {
												/* NOTE:
													_wiring could be undefined if window.Uize is undefined because the page is being torn down, or in some cases in IE if the DOM event is still fired after the wiring is removed (some kind of a threading issue?)
												*/
												if (_entryNode) {
													try {
														if (
															!_entryNode.Uize_Widget_Drag_shield &&
															!_Uize_Dom_Basics.isOnNodeTree (_entryNode,_wiring._node)
														)
															_entryNode = null
														;
													} catch (_error) {
														/* NOTE:
															In some cases in Firefox, trying to get a property of form nodes results in a weird permission denied exception. In this case we can't determine if the node is in the tree.
															In that case, pass the event along
														*/
														_entryNode = null;
													}
												}
												if (!_entryNode)
													return _wiring._handler.call (_wiring._node,_event)
												;
											}
										}
									);
								}
							),
							mousedown:_makeGenericHandlerCaller,
							mouseup:_makeGenericHandlerCaller
						}
					;
					return function (_nodeBlob,_eventName,_handler,_wiringOwnerId) {
						if (!_eventName) return;

						if (_wiringOwnerId == _undefined) _wiringOwnerId = '';
						var _isVirtualDomEvent;
						if (_eventName.charCodeAt)
							_eventName = _resolveStringEventName (_eventName)
						;
						if (typeof _eventName == _typeObject && !(_isVirtualDomEvent = !!_eventName.virtualDomEvent)) {
							_wiringOwnerId = arguments [2] || ''; // third argument is wiring owner ID in this variation
							for (var _event in _eventName)
								_package.wire (_nodeBlob,_event,_eventName [_event],_wiringOwnerId)
							;
							return;
						}
						_doForAll (
							_nodeBlob,
							function (_node) {
								var
									_nodeTagName = _node.tagName,
									_useWindowEventVehicle = _node == window && _needsWindowEventVehicle
								;

								/*** update handler mapping info ***/
									(_wiringIdsByOwnerId [_wiringOwnerId] || (_wiringIdsByOwnerId [_wiringOwnerId] = [])).push (
										_totalWirings
									);

								/*** make handler caller function ***/
									var _handlerCaller =
										(
											_isVirtualDomEvent
												? _returnFalse
												: _useWindowEventVehicle
													? _makeWindowEventHandlerCaller
													: _handlerCallerMakersByEvent [_eventName] || _makeGenericHandlerCaller
										) (_totalWirings)
									;

								/*** add entry in handler map ***/
									var _wiring = _wirings [_totalWirings++] = {
										_node:_node,
										_eventName:_eventName,
										_handler:_handler,
										_handlerCaller:_handlerCaller
									};
									if (_isMozillaOrOpera && _nodeTagName == 'BODY' && _eventName == 'scroll') {
										/* NOTE:
											special node remapping for Firefox, so that the scroll event can be wired for the body node (from the application's perspective), even though FF only supports this event for the document object.
										*/
										_wiring._unremappedNode = _node;
										_node = _wiring._node = document;
									}

								if (_handlerCaller) {
									/*** wire the event ***/
										var _eventPropertyName = 'on' + _eventName;
										_useWindowEventVehicle
											? _windowEventVehicle.wire (_eventName,_handlerCaller)
											: _node.attachEvent
												? _node.attachEvent (_eventPropertyName,_handlerCaller)
												: _node.addEventListener (_eventName,_handlerCaller,_false)
										;
										if (
											_nodeTagName == 'A' &&
											(_eventName == 'mousedown' || _eventName == 'click' || _eventName == 'touchstart') && !_node [_eventPropertyName]
										)
											_node [_eventPropertyName] = _returnFalse
										;
								} else if (_isVirtualDomEvent) {
									_eventName.wire (_node,_handler,_wiring._subWiringsOwnerId = _Uize.getGuid ());
								}
							}
						);
					}
					/*?
						Static Methods
							Uize.Dom.Basics.wire
								Wires the specified handler function to the specified event, or the specified handlers to the specified events, of the specified node or `node blob`.

								SYNTAX
								..............................................................
								Uize.Dom.Basics.wire (nodeBLOB,eventNameSTR,eventHandlerFUNC);
								..............................................................

								Different browsers provide different ways of registering event handlers for nodes. This method acts as an abstraction so you can manage event handlers in a standard way in your code.

								VARIATION 1
								...........................................................
								Uize.Dom.Basics.wire (nodeBLOB,eventNamesToHandlersMapOBJ);
								...........................................................

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
								.........................................................................
								Uize.Dom.Basics.wire (
									'infoLink',
									{
										mouseover:
											function () {Uize.Dom.Basics.display ('infoLinkPreview')},
										mouseout:
											function () {Uize.Dom.Basics.display ('infoLinkPreview',false)},
										click:
											function () {Uize.Dom.Basics.display ('info')}
									}
								);
								.........................................................................

								VARIATION 2
								.........................................................................
								Uize.Dom.Basics.wire (nodeBLOB,eventNameSTR,eventHandlerFUNC,ownerIdSTR);
								Uize.Dom.Basics.wire (nodeBLOB,eventNamesToHandlersMapOBJ,ownerIdSTR);
								.........................................................................

								When the optional =ownerIdSTR= parameter is specified, then the wired node events will be associated to the specified owner, thus allowing easy unwiring of all wired node events of a specific owner using the =Uize.Dom.Basics.unwireEventsByOwnerId= or =Uize.Dom.Basics.unwire= static methods. This ownership mechanism is primarily intended for the implementation of the =Uize.Widget= class, but may also be useful when coding less formal mappings of interaction logic to sets of DOM nodes.

								Window Events
									The =Uize.Dom.Basics.wire= method supports wiring handlers for events of the =window= object.

									Handlers can be wired for the =focus=, =blur=, =load=, =beforeunload=, =unload=, =resize=, and =scroll= events.

									EXAMPLE 1
									.........................................
									Uize.Dom.Basics.wire (
										window,
										'load',
										function () {
											// do something when document loads
										}
									);
									.........................................

									EXAMPLE 2
									..............................................................
									Uize.Dom.Basics.wire (
										window,
										{
											resize:
												function () {
													// do something when window is resized
												},
											scroll:
												function () {
													// do something when window / document is scrolled
												}
										}
									);
									..............................................................

								NOTES
								- this method can operate on multiple nodes at a time. For more details, see the section on `node blob`
								- see also the companion =Uize.Dom.Basics.unwire= static method
					*/
				}) (),

			/*** Static Properties ***/
				ieMajorVersion:_ieMajorVersion,
					/*?
						Static Properties
							Uize.Dom.Basics.ieMajorVersion
								A number, indicating the major version of the Microsoft Internet Explorer browser being used, or the value =0= if the brower is not Internet Explorer.

								NOTES
								- see the related =Uize.Dom.Basics.isIe= static property
								- see also the =Uize.Dom.Basics.isSafari= and =Uize.Dom.Basics.isMozilla= static properties
					*/

				isIe:_isIe,
					/*?
						Static Properties
							Uize.Dom.Basics.isIe
								A boolean, indicating whether or not the browser is a version of Microsoft Internet Explorer.

								NOTES
								- see the related =Uize.Dom.Basics.ieMajorVersion= static property
								- see also the =Uize.Dom.Basics.isSafari= and =Uize.Dom.Basics.isMozilla= static properties
					*/

				isSafari:_userAgent.indexOf ('applewebkit') > -1,
					/*?
						Static Properties
							Uize.Dom.Basics.isSafari
								A boolean, indicating whether or not the browser is a version of Apple Safari.

								NOTES
								- see also the =Uize.Dom.Basics.isIe= and =Uize.Dom.Basics.isMozilla= static properties
					*/

				isMozilla:_isMozilla,
					/*?
						Static Properties
							Uize.Dom.Basics.isMozilla
								A boolean, indicating whether or not the browser is a version of Mozilla Firefox.

								NOTES
								- see also the =Uize.Dom.Basics.isIe= and =Uize.Dom.Basics.isSafari= static properties
					*/

				mousePos:_mousePos
					/*?
						Static Properties
							Uize.Dom.Basics.mousePos
								An object, indicating the current position of the mouse pointer.
					*/
		});

		/*** Initialization ***/
			if (_isBrowser) {
				/*** wire up document mousemove to keep track of mouse position ***/
					_package.wire (document.documentElement,'mousemove',_captureMousePos);

				/*** wire up window events to fire events on window event vehicle (if necessary) ***/
					if (_needsWindowEventVehicle) {
						var
							_windowEventVehicle = new _Uize.Event.Bus,
							_documentLoadedTimeout = setTimeout (function () {_windowEventVehicle.fire ('load')},15000)
						;
						_Uize.forEach (
							['focus','blur','load','beforeunload','unload','resize','scroll','hashchange'],
							function (_windowEventName) {
								var
									_windowEventPropertyName = 'on' + _windowEventName,
									_oldWindowEventHandler = window [_windowEventPropertyName] || _returnFalse
								;
								window [_windowEventPropertyName] = function (_event) {
									_windowEventName == 'load' && clearTimeout (_documentLoadedTimeout);
									_oldWindowEventHandler.call (window,_event || (_event = window.event));
									_windowEventVehicle.fire ({name:_windowEventName,windowEvent:_event});
								};
							}
						);
					}
			}

		return _package;
	}
});

