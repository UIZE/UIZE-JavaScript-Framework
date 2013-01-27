/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Node Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2004-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 9
	codeCompleteness: 95
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Node= module facilitates [[http://en.wikipedia.org/wiki/Document_Object_Model][DOM]] manipulation, with support for finding nodes, and querying and modifying their properties, CSS styling, and more.

		*DEVELOPERS:* `Chris van Rensburg`, `Vinson Chuong`

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
				....................................................................
				Uize.Node.show (['saveButton','cancelButton','skipButton'],true);
				....................................................................

				In the above example, the =nodeBLOB= parameter is an array, where each element is a string representing the =id= of a button to show.

				EXAMPLE
				....................................................................
				var
					topButtons = ['loginLogoutButton','checkoutButton','helpButton'],
					bottomButtons = ['saveButton','cancelButton','skipButton']
				;
				Uize.Node.show ([topButtons,bottomButtons],true);
				....................................................................

				In a slightly more complex example, the =nodeBLOB= parameter is an array, where each element is itself an array of button node ids.

				If a particular method can accept an =nodeBLOB= parameter, it will be noted in the reference section for that method.
*/

Uize.module ({
	name:'Uize.Node',
	required:'Uize.Class',
	builder:function () {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_package = function () {},
				_undefined,
				_typeString = 'string',
				_typeObject = 'object',
				_typeFunction = 'function',
				_true = true,
				_false = false,
				_null = null,
				_hidden = 'hidden',
				_Uize = Uize,
				_Uize_copyInto = _Uize.copyInto,
				_Uize_isPrimitive = _Uize.isPrimitive,
				_Uize_returnFalse = _Uize.returnFalse
			;

		/*** General Variables ***/
			var
				_isBrowser = typeof navigator != 'undefined',
				_navigator = _isBrowser ? navigator : {userAgent:'',appName:''},
				_userAgent = _navigator.userAgent.toLowerCase (),
				_isIe = _navigator.appName == 'Microsoft Internet Explorer',
				_ieInnerHtmlReadOnly = {
					TABLE:_true, THEAD:_true, TFOOT:_true, TBODY:_true, TR:_true, COL:_true, COLGRPUP:_true,
					FRAMESET:_true, HEAD:_true, HTML:_true, STYLE:_true, TITLE:_true
				},
				_isSafari = _userAgent.indexOf ('applewebkit') > -1,
				_isMozilla = _userAgent.indexOf ('gecko') > -1,
				_isOpera = _userAgent.indexOf ('opera') > -1,
				_isMozillaOrOpera = _isMozilla || _isOpera,
				_ieMajorVersion = +(_isIe && (_userAgent.match (/MSIE\s*(\d+)/i) || [0,0]) [1]),
				_useHandForPointerCursor = _isIe && _ieMajorVersion < 9,
				_wirings = _package._wirings = {},
				_wiringIdsByOwnerId = {},
				_totalWirings = 0,
				_mousePos = {clientX:0,clientY:0,pageX:0,pageY:0}
			;

		/*** Utility Functions ***/
			var _captureMousePos = _package._captureMousePos = function (_event) {
				_mousePos.clientX = _event.clientX;
				_mousePos.clientY = _event.clientY;
				_mousePos.pageX = _event.pageX;
				_mousePos.pageY = _event.pageY;
			};

			function _getElementById (_nodeId) {
				var _result = document.getElementById (_nodeId);
				return (!_isIe || (_result && _result.id == _nodeId)) ? _result : _null;
				/* WORKAROUND:
					stupid issue in IE, where document.getElementById will return a reference to a node that has a name attribute with the specified ID value, if no node has an id with that value
				*/
			}

			function _getDocumentScrollElement () {
				return document [_isSafari ? 'body' : 'documentElement'];
			}

			function _resolveStringEventName (_eventName) {
				return (
					_package.VirtualEvent && _eventName.charCodeAt (_eventName.length - 1) == 41
						? _package.VirtualEvent.resolve (_eventName)
						: _eventName.charCodeAt (0) == 111 && _eventName.charCodeAt (1) == 110
							? _eventName.slice (2)
							: _eventName
				);
			}

		/*** Public Static Methods ***/
			var
				_tableDisplayValuePrefix = 'table-',
				_tableRowDisplayValue = _tableDisplayValuePrefix + 'row',
				_tableCellDisplayValue = _tableDisplayValuePrefix + 'cell',
				_tagSpecificDisplayValues = _Uize_copyInto (
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
				)
			;
			_package.display = function (_nodeBlob,_mustDisplay) {
				_mustDisplay = _mustDisplay === _undefined || !!_mustDisplay;
				_doForAll (
					_nodeBlob,
					function (_node) {
						_node.style.display = _mustDisplay ? (_tagSpecificDisplayValues [_node.tagName] || 'block') : 'none';
					}
				);
				/*?
					Static Methods
						Uize.Node.display
							Displays or hides the specified `node blob`, using the "display" CSS property.

							SYNTAX
							................................................
							Uize.Node.display (nodeBLOB,mustDisplayANYTYPE);
							................................................

							While typically a Boolean, the =mustDisplayANYTYPE= parameter can be of any type and the node(s) will be displayed if it resolves to =true=, and hidden if it resolves to =false= - with the exception of =undefined=, when the node(s) will be displayed (see explanation below).

							VARIATION
							.............................
							Uize.Node.display (nodeBLOB);
							.............................

							When no =mustDisplayANYTYPE= parameter is specified (or when its value is =undefined=), the node(s) will be displayed.

							NOTES
							- compare to the =Uize.Node.show= static method
							- this method can operate on multiple nodes at a time. For more details, see the section on `node blob`
				*/
			};

			var _doForAll = _package.doForAll = function (_nodeBlob,_function,_idPrefix,_nodeCache) {
				if (typeof _nodeBlob == _typeString)
					_nodeBlob = _getById (_nodeBlob,_idPrefix,_nodeCache)
				;
				if (_nodeBlob != _undefined) {
					if (_isNode (_nodeBlob)) {
						_function (_nodeBlob);
					} else {
						var _typeofNodeBlob = typeof _nodeBlob;
						if (
							(_typeofNodeBlob == _typeObject || _typeofNodeBlob == _typeFunction) &&
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
						Uize.Node.doForAll
							Iterates through the specified `node blob`, calling the specified function for each node and passing the node reference as a parameter.

							SYNTAX
							.........................................
							Uize.Node.doForAll (nodeBLOB,actionFUNC);
							.........................................

							EXAMPLE
							.........................................................................................
							Uize.Node.doForAll (
								['topLeftAddButton','topRightAddButton','bottomLeftAddButton','bottomRightAddButton'],
								function (node) {
									node.src = 'images/add-button.gif';
									node.style.border = '1px solid #fff';
									Uize.Node.wire (node,'click',handleAddButtonClick);
								}
							);
							.........................................................................................

							VARIATION
							.....................................................
							Uize.Node.doForAll (nodeBLOB,actionFUNC,idPrefixSTR);
							.....................................................

							When the optional =idPrefixSTR= parameter is specified, then any nodes specified in the =nodeBLOB= using a string ID are resolved by first applying the ID prefix.
				*/
			};

			var _doRectanglesOverlap = _package.doRectanglesOverlap =
			function (_aLeft,_aTop,_aWidth,_aHeight,_bLeft,_bTop,_bWidth,_bHeight) {
				return (
					_aWidth - 1 + +_aLeft >= _bLeft && _bWidth - 1 + +_bLeft >= _aLeft &&
					_aHeight - 1 + +_aTop >= _bTop && _bHeight - 1 + +_bTop >= _aTop
				);
				/*?
					Static Methods
						Uize.Node.doRectanglesOverlap
							Returns a boolean, indicating whether or not the rectangles specified by the two coordinate sets overlap one another. Two rectangles are considered to overlap if any part of either rectangle is contained by the other.

							SYNTAX
							.................................................................
							rectanglesOverlapBOOL = Uize.Node.doRectanglesOverlap (
								aLeftPixelsINT,aTopPixelsINT,aWidthPixelsINT,aHeightPixelsINT,
								bLeftPixelsINT,bTopPixelsINT,bWidthPixelsINT,bHeightPixelsINT
							);
							.................................................................

							TEST FOR OVERLAPPING LINES

							To use this method to test if two lines overlap (rather than two rectangles), you can use dummy values for one of the axes, as in...

							..................................................
							linesOverlapBOOL = Uize.Node.doRectanglesOverlap (
								aPosINT,0,aDimINT,1,bPosINT,0,bDimINT,1
							);
							..................................................

							By specifying =0= for both the =aTopPixelsINT= and =bTopPixelsINT= parameters, and =1= for both the =aHeightPixelsINT= and =bHeightPixelsINT= parameters, you are essentially guaranteeing that the two rectangles overlap on the vertical axis (since their vertical coordinates are identical), and this has the effect of making the vertical test redundant, so the horizontal values can then be used to test for overlapping of two line segments.

							Of course, you can use this technique to test for overlapping of any two line segments - it doesn't matter if those lines are from a vertical or horizontal axis, since we've collapsed a test in 2D space to being a test in 1D space.

							NOTES
							- any parameter of this method can be an object that implements a =valueOf= interface (such as an instance of a =Uize.Class= subclass that implements the =value= state property)
				*/
			};

			var _getById = _package.getById = function (_node,_idPrefix,_nodeCache) {
				if (typeof _node != _typeString) return _node;

				var _result = _nodeCache ? _nodeCache [_node] : _undefined;
				if (_result === _undefined) {
					var _nodeIdOrName = _joinIdPrefixAndNodeId (_idPrefix,_node);
					(_result = _getElementById (_nodeIdOrName)) ||
						(
							((_result = document.getElementsByName (_nodeIdOrName)).length < 2) &&
							(_result = _result [0] || _null)
						)
					;
					if (_nodeCache) _nodeCache [_node] = _result;
				}
				return _result;
				/*?
					Static Methods
						Uize.Node.getById
							Returns a reference to the specified node, where the node is specified by its ID or by the value of its =name= attribute.

							SYNTAX
							...........................................
							nodeOBJ = Uize.Node.getById (nodeSTRorOBJ);
							...........................................

							If there are multiple nodes with the same value for their =name= attribute, then this method will return an array of node references.

							NOTES
							- in the event that the value of the =nodeSTRorOBJ= parameter is actually a reference to a node, then that value will simply be returned
							- in the event that a node specified by ID does not exist in the DOM, then the value =null= will be returned
							- see also the =Uize.Node.find= static method
				*/
			};

			_package.find = function (_properties) {
				/*** return early if the parameter for find is already resolved to a node or array of nodes ***/
					if (
						typeof _properties != _typeObject || !_properties ||
						typeof _properties.length == 'number' || _isNode (_properties)
					)
						return _properties
					;

				var
					_document = document,
					_nodePool = [],
					_unusedProperties = _Uize_copyInto ({},_properties),
					_root = 'root' in _unusedProperties ? _getById (_unusedProperties.root) : _document
				;
				delete _unusedProperties.root;

				/*** narrow down node pool, consuming root, id, name, and tagName tests, where possible ***/
					if (_root) {
						var _tagName = _unusedProperties.tagName;
						if ('id' in _unusedProperties && _Uize_isPrimitive (_unusedProperties.id)) {
							/* NOTE: optimization for when id is specified and has a simple value */
							var _node = _getElementById (_unusedProperties.id);
							_node && _nodePool.push (_node);
							delete _unusedProperties.id;
						} else if ('name' in _unusedProperties && _Uize_isPrimitive (_unusedProperties.name)) {
							/* NOTE: optimization for when name is specified and has a simple value */
							_nodePool = _document.getElementsByName (_unusedProperties.name);
							delete _unusedProperties.name;
						} else {
							/* NOTE:
								populate the node pool using getElementsByTagName, with optimization for when tagName is specified and has a simple value
							*/
							var _tagNameIsSimplyType = _Uize_isPrimitive (_tagName);
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
										_Uize_isPrimitive (_test)
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
						Uize.Node.find
							Returns an array, representing those nodes within the document that match the specified find expression.

							SYNTAX
							................................................
							nodesARRAY = Uize.Node.find (findExpressionOBJ);
							................................................

							With the exception of a few =Special Qualifiers=, each property of the =findExpressionOBJ= parameter is a property test for potential node matches, where the property's name is the name of a node property to test, and the property's value is the test to perform. The test can be a simple equality test, or it can also be a regular expression or function test.

							In order for a node being tested to be a match for the find, all of the tests must succeed, so there is an implicit logical =and= operation between all the tests specified in the =findExpressionOBJ= parameter, although the individual tests could succeed for multiple values by utilizing the more powerful =Regular Expression Test= and =Function Test= types of tests (described in more detail below).

							Test Types
								Simple Test
									In the case of a simple test, the value of the property to be tested will simply be tested for equality against the test value.

									EXAMPLE
									.......................................................................
									var buttonImages = Uize.Node.find ({tagName:'IMG',className:'button'});
									.......................................................................

									The above example will return an array of all the nodes in the document that are =IMG= tags and that have their =class= attribute set to the value =button=.

								Regular Expression Test
									In the case of a regular expression test, the value of the property to be tested will be tested using the specified regular expression.

									Expanding on the example from the =Simple Test= explanation above, let's say that we didn't want to find *only* those nodes whose =class= attribute was exactly =button=, but rather any image node that contained the class =button= somewhere in its =class= attribute. Then you could use a find expression as follows...

									EXAMPLE
									...........................................................................
									var buttonImages = Uize.Node.find ({tagName:'IMG',className:/\bbutton\b/});
									...........................................................................

									In the above example, a regular expression is being specified for the =className= test that will test to find the string =button= between word boundaries (sometimes referred to as a whole word match).

								Function Test
									In the case of a function test, the value of the property to be tested will be tested using the specified function.

									The test function should expect to receive the value to be tested as its single parameter, and it should return a value to indicate if the test succeeded. Expanding on the example from the =Regular Expression Test= explanation above, let's say that we also wanted to ensure that the matching nodes had to have an =offsetWidth= value greater than 100 pixels and an =offsetHeight= value greater than 30 pixels. Then you could use a find expression as follows...

									.....................................................
									var bigButtonImages = Uize.Node.find ({
										tagName:'IMG',
										className:/\bbutton\b/,
										offsetWidth:function (value) {return value > 100},
										offsetHeight:function (value) {return value > 30}
									});
									.....................................................

							Not a CSS Selector
								The =Uize.Node.find= method is a means of finding nodes within a document. The find expression specified is fundamentally not a CSS selector, is not as powerful in a number of ways, but is also somewhat more powerful in a number of ways, and can be used in many cases to accomplish very similar things. For example...

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

								..........................................................
								var nodesWithPageIdPrefix = Uize.Node.find ({id:/^page/});
								..........................................................

								Significantly, the =Uize.Node.find= method tests the reflected properties of nodes, so one can programmatically select nodes based upon properties that are interesting in the land of JavaScript but that are not accessible to the land of CSS. So, for example, you could find all =div= nodes in the document with the CSS class =scrollableDiv= and that have been scrolled vertically, using the following find expression...

								........................................................
								var verticallyScrolledScrollableDivs = Uize.Node.find ({
									tagName:'DIV',
									className:/\bscrollableDiv\b/,
									scrollTop:function (value) {return value > 0}
								});
								........................................................

								So, in essence, the =Uize.Node.find= method provides the ability to find nodes in a lightweight implementation and in a reasonably intuitive manner that very deliberately leverages the power of JavaScript for testing values. It is neither a CSS selector evaluator nor an XPath query evaluator, both of which are substantially more complex in the complete scope of their specifications.

							Special Qualifiers
								The =Uize.Node.find= method supports some special qualifiers that can help to narrow down a find, improve performance, and provide other capabilities.

								root
									In a number of cases, you might want to find nodes that match a find expression within the limited scope of a specific root node - you don't want to scan all the nodes in the entire document. In such cases, the =root= qualifier lets you specify the root node under which to perform the find. Only nodes that are descendants of the root node will be considered in the find. The root node can be specified by id or reference.

									EXAMPLE
									................................................
									var myWidgetButtonImageNodes = Uize.Node.find ({
										root:myWidget.getNode (),
										tagName:'IMG',
										className:/\bbutton\b/
									});
									................................................

									In the above example, the =Uize.Node.find= method would find only those image nodes that are descendants of the =myWidget= widget's root node and that have the CSS class =button= specified in their =class= attribute. The =root= qualifier is set to a reference to the widget's root node, obtained using the =getNode= instance method of the =Uize.Widget= class (specifying no parameter gets you the root node).

								self
									The =self= qualifier lets you specify a test that can be performed on the node, itself, as a whole. This can be useful when you want to provide a test that involves an interaction between multiple properties of the nodes being tested.

									EXAMPLE
									.............................................................
									var thumbnailImages = Uize.Node.find ({
										tagName:'IMG',
										self:function () {return this.width * this.height < 40000}
									});
									.............................................................

									In the above example, image nodes are being found whose area is less than =40000= square pixels (the area of a 200x200 image).

									When using the =self= qualifier, it is not meaningful to specify a test type other than a =Function Test=. Also, the function that you specify does not need to declare a parameter in this case - it will not receive a defined value, anyway. Like all function tests, the function that you specify for the test will be called as an instance method on the node being tested, so the =this= keyword will hold a reference to the node inside the scope of your function's implementation. This gives your function full access to the properties and methods of the node for the purpose of performing the test.

							Optimizations
								The =Uize.Node.find= method performs optimizations wherever possible to utilize high performance built-in DOM methods, such as =getElementById=, =getElementsByName=, and =getElementsByTagName=. However, if test values specified for =id=, =name=, or =tagName= are not simple types, then this method will have to iterate in order to perform such tests.

							NOTES
							- in the event that no matches are found, an empty array will be returned
							- when the value of the =findExpressionOBJ= parameter is an array, node reference, or string, then that value will simply be returned as is and no find operation will be performed, making this method convenient to use in classes where either a find expression object or a node or array of nodes may be specified
							- see also the =Uize.Node.getById= static method
				*/
			};

			var _getCoords = _package.getCoords = function (_node) {
				var
					_x = 0,
					_y = 0,
					_width = 0,
					_height = 0,
					_seen = _true,
					_percentSeen = 100,
					_documentElement = _getDocumentScrollElement (),
					_windowDims = _getDimensions (window)
				;
				function _factorInDocScroll () {
					_x += _documentElement.scrollLeft;
					_y += _documentElement.scrollTop;
				}
				if (_node == window) {
					_factorInDocScroll ();
					_width = _windowDims.width;
					_height = _windowDims.height;
				} else if (_isNode (_node = _getById (_node))) {
					/*** calculate dimensions ***/
						_width = _node.offsetWidth;
						_height = _node.offsetHeight;
						if (!(_width && _height) && _node.tagName == 'DIV') {
							/* NOTE:
								This is a workaround to handle the fact that a container DIV may report offset dimensions of 0, even though it contain many child nodes.
							*/
							for (
								var _childNodes = _node.childNodes, _childNodeNo = _childNodes.length;
								--_childNodeNo >= 0;
							) {
								if (_childNodes [_childNodeNo].nodeName.charAt (0) != '#') {
									var _childCoords = _getCoords (_childNodes [_childNodeNo]);
									if (_childCoords.width || _childCoords.height) {
										_width = Math.max (_width,_childCoords.right - _x + 1);
										_height = Math.max (_height,_childCoords.bottom - _y + 1);
									}
								}
							}
						}

					if (_node.tagName == 'A' && _node.childNodes.length == 1 && _node.childNodes [0].tagName == 'IMG')
						/* NOTE:
							this is a workaround for Mozilla, which doesn't seem to be able to give reliable values for determining coordinates of links that fully enclose IMG tags. In such cases, using the child IMG tag for determining coordinates is reliable. This workaround has no negative effect in IE, so it is not conditionalized
						*/
						_node = _node.childNodes [0]
					;
					var
						 _nodeHidden = function (_node) {
							return _getStyle (_node,'display') == 'none' || _getStyle (_node,'visibility') == _hidden;
						},
						_nodeVisible = _seen = !_nodeHidden (_node),
						_offsetParent = _node,
						_currentNode = _node,
						_windowWidth = _windowDims.width,
						_windowHeight = _windowDims.height,
						_documentElementScrollLeft = _documentElement.scrollLeft,
						_documentElementScrollTop = _documentElement.scrollTop,
						_documentElementRight = _documentElementScrollLeft + _windowWidth,
						_documentElementBottom = _documentElementScrollTop + _windowHeight
					;
					while (_currentNode.parentNode && typeof _currentNode.parentNode != 'unknown') {
						var
							_currentNodeOffsetLeft = _currentNode.offsetLeft || 0,
							_currentNodeOffsetTop = _currentNode.offsetTop || 0,
							_currentNodeOffsetWidth = _currentNode.offsetWidth,
							_currentNodeOffsetHeight = _currentNode.offsetHeight
						;
						if (_seen && _nodeHidden (_currentNode))
							_seen = _false
						;
						if (_currentNode == _offsetParent) {
							_x += _currentNodeOffsetLeft + (parseInt (_getStyle (_currentNode,'borderLeftWidth')) || 0);
							_y += _currentNodeOffsetTop + (parseInt (_getStyle (_currentNode,'borderTopWidth')) || 0);
							_offsetParent = _currentNode.offsetParent;
							_getStyle (_currentNode,'position') == 'fixed' &&
								_factorInDocScroll ()
							;
						}
						if (
							_currentNode != _node &&
							_currentNode != document.body &&
							_currentNode != document.documentElement &&
							(
								_currentNode.scrollWidth > _currentNodeOffsetWidth ||
								_currentNode.scrollHeight > _currentNodeOffsetHeight
								/* NOTE:
									it's not just for container nodes that are scrolled, but also container nodes that are scrollable (that's where the scrollWidth is greater than the offsetWidth)
								*/
							)
						) {
							_x -= _currentNode.scrollLeft;
							_y -= _currentNode.scrollTop;
							if (_isIe) {
								_x += _currentNode.clientLeft;
								_y += _currentNode.clientTop;
							}
							if (_seen)
								_seen = _doRectanglesOverlap (
									_x,_y,_width,_height,
									_currentNodeOffsetLeft,_currentNodeOffsetTop,_currentNodeOffsetWidth,_currentNodeOffsetHeight
								)
							;
						}
						_currentNode = _currentNode.parentNode;
					}

					/*** test if node is in portion of document scrolled into view ***/
						if (_seen)
							_seen = _doRectanglesOverlap (
								_x,_y,_width,_height,
								_documentElementScrollLeft,_documentElementScrollTop,_windowWidth,_windowHeight
							)
						;

						// if the node is seen, calculate how much of its area is seen
						_percentSeen = _seen ?
							((Math.min (_x + _width, _documentElementRight) - Math.min (Math.max (_x, _documentElementScrollLeft), _documentElementRight))
								* (Math.min (_y + _height, _documentElementBottom) - Math.min (Math.max (_y, _documentElementScrollTop), _documentElementBottom)))
								/ (_width * _height)
								* 100 :
							0
						;
				}
				return {
					x:_x,
					y:_y,
					width:_width,
					height:_height,
					area:_width * _height,
					left:_x,
					top:_y,
					right:_x + _width - 1,
					bottom:_y + _height - 1,
					seen:_seen,
					percentSeen:_percentSeen
				};
				/*?
					Static Methods
						Uize.Node.getCoords
							Returns an object, representing the coordinates of the specified node, relative to the top left of the document.

							SYNTAX
							...................................................
							nodeCoordsOBJ = Uize.Node.getCoords (nodeSTRorOBJ);
							...................................................

							RETURN
							............................
							{
								x : xPixelsINT,
								y : yPixelsINT,
								width : widthPixelsINT,
								height : heightPixelsINT,
								area : areaPixelsINT,
								left : leftPixelsINT,
								top : topPixelsINT,
								right : rightPixelsINT,
								bottom : bottomPixelsINT,
								seen : seenBOOL
							}
							............................

							The "x" and "left" properties of the return object are equivalent, as are the "y" and "top" properties.

							NOTES
							- compare to the =Uize.Node.getDimensions= static method
				*/
			};

			var _getDimensions = _package.getDimensions = function (_node) {
				if (_node == window) {
					var _documentElement = document.documentElement;
					return {
						width:_documentElement.clientWidth || window.innerWidth || _documentElement.offsetWidth,
						height:_documentElement.clientHeight || window.innerHeight || _documentElement.offsetHeight
					};
				} else if (_node = _getById (_node)) {
					return {
						width:_node.offsetWidth || parseInt (_getStyle (_node,'width')) || 0,
						height:_node.offsetHeight || parseInt (_getStyle (_node,'height')) || 0
					};
				} else {
					return {width:0,height:0};
				}
				/*?
					Static Methods
						Uize.Node.getDimensions
							Returns an object, containing =width= and =height= properties that reflect the displayed dimensions for the specified node.

							SYNTAX
							.....................................................
							nodeDimsOBJ = Uize.Node.getDimensions (nodeSTRorOBJ);
							.....................................................

							RETURN VALUE
							................
							{
								width : INT,
								height : INT
							}
							................
				*/
			};

			var
				_trblStylePropertiesMap = {
					borderColor:['border','Color'],
					borderWidth:['border','Width'],
					padding:1,
					margin:1
				},
				_getStyle = _package.getStyle = function (_node,_property) {
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
							Uize.Node.getStyle
								Returns the value of the specified style property (or style properties) for the specified node.

								SYNTAX
								.....................................................................
								propertyValueSTR = Uize.Node.getStyle (nodeSTRorOBJ,propertyNameSTR);
								.....................................................................

								Style properties for a node that are defined inside style sheets (whether inline or external) rather than in the node's =style= object are not reflected in the =style= property of the node in the DOM. This can be frustrating when trying to run code that may conditionalize based upon the values of certain style properties. This method acts as an abstraction to use the appropriate technique for the given browser to determine the value of a specified style property. In some browsers this may be done using the =getComputedStyle= method, while in other browsers it may be done using the =currentStyle= property.

								VARIATION
								..........................................................................
								stylePropertiesOBJ = Uize.Node.getStyle (nodeSTRorOBJ,stylePropertiesOBJ);
								..........................................................................

								In order to get the values for multiple style properties in a single call, a style properties object can be specified using the =stylePropertiesOBJ= parameter. The value for this parameter should be an object, where each key is the name of a style property. The values for the individual properties in this object are not important - you can use any dummy values you like.

								Considerations for the value of the =stylePropertiesOBJ= parameter for the =Uize.Node.getStyle= method are consistent with those for the =stylePropertiesOBJ= parameter of the =Uize.Node.setStyle= method, and the values should be interchangeable between this pair of methods. Consider the following example...

								EXAMPLE
								..........................................................................
								var styleProperties = {borderWidth:0,borderColor:0,backgroundColor:0};

								Uize.Node.setStyle ('node2',Uize.Node.getStyle ('node1',styleProperties));
								Uize.Node.setStyle ('node4',Uize.Node.getStyle ('node3',styleProperties));
								..........................................................................

								In the above example, the variable =styleProperties= is defined to specify a set of style properties. The values for the individual properties in this object are not important - we use the dummy values =0=. The two statements that follow copy the values of the =borderWidth=, =borderColor=, and =backgroundColor= style properties from one node to another: in the first statement from the node with the id "node1" to the node with the id "node2", and in the second statement from the node with the id "node3" to the node with the id "node4".

								When provided with a =stylePropertiesOBJ= parameter, the =Uize.Node.getStyle= method returns a value that is a style properties object, and this object can then be supplied to the =Uize.Node.setStyle= method.

								Handling of Opacity
									The =Uize.Node.getStyle= method deals with the difference between Internet Explorer and browsers that support the CSS standard =opacity= style property.

									For IE, the proprietary =filter= style property is queried, but as a developer you can specify =opacity= as if it were supported by IE.

									EXAMPLE 1
									...........................................................
									var opacityValue = Uize.Node.getStyle ('myNode','opacity');
									...........................................................

									EXAMPLE 2
									.......................................................................................
									var opacityAndBorderColorObj = Uize.Node.getStyle ('myNode',{opacity:1,borderColor:1});
									.......................................................................................

								NOTES
								- see also the companion =Uize.Node.setStyle= static method
					*/
				}
			;

			var _getText = _package.getText = function (_node) {
				var _text = '';
				if (_node = _getById (_node)) {
					var  _gatherText = function (_node) {
						if (typeof _node.innerText == _typeString) {
							_text += _node.innerText.replace (/\r|\n|\r\n/g,'');
						} else if (typeof _node.textContent == _typeString) {
							_text += _node.textContent;
						} else {
							if (_node.nodeType == 3) _text += _node.data;
							_node.childNodes && _Uize.forEach (_node.childNodes,_gatherText);
						}
					};
					_gatherText (_node);
				}
				return _text;
				/*?
					Static Methods
						Uize.Node.getText
							Returns a string, representing the text content of the specified node.

							SYNTAX
							...............................................
							nodeTextSTR = Uize.Node.getText (nodeSTRorOBJ);
							...............................................

							In Internet Explorer, this method employs the =innerText= property, removing all linebreaks. In other browsers that support the =textContent= property, this is used. For browsers that support neither, this method iterates recursively through the child nodes and cumulatively harvests the text content using the data property of all the text nodes.

							EXAMPLE
							............................
							<div id="testNode">
								<p>This is a test</p>
								<table>
									<tr>
										<td> of</td>
										<td> the</td>
									</tr>
								</table>
								<blockquote>
									<ul>
										<li> emergency
										<li> broadcasting
									</ul>
									<p> network</p>
								</blockquote>
							</div>
							............................

							In the above example, the statement =Uize.Node.getText ('testNode')= would return roughly ='this is a test of the emergency broadcasting network'= (between browsers there might be variability with the whitespace content).

							NOTES
							- this method is not quaranteed to return exactly the same value for the exact same markup in all browsers
				*/
			};

			_package.getValue = function (_node) {
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
						Uize.Node.getValue
							Returns a string or boolean, representing the value of the specified node.

							SYNTAX
							.......................................................
							nodeValueSTRorBOOL = Uize.Node.getValue (nodeSTRorOBJ);
							.......................................................

							This method provides a convenient abstraction that makes it easier to change a form's implementation, without having to worry about modifying the JavaScript application logic that gets values from the form's fields. For example, you could change the HTML of a form so that what was once a =select= tag becomes a =radio= button set, and the call to =Uize.Node.getValue= could remain unchanged.

							Text Fields
								For =textarea= tags and =input= tags of type =text= and =hidden=, this method returns the value of the node's =value= property.

							Select Boxes - Single Select
								For =select= tags in single select mode (ie. where the =multiple= attribute is absent), this method returns the value of the selected option's =value= property.

								In the event that no option is selected, this method will return the value =''= (empty array).

							Select Boxes - Multiple Select
								For =select= tags in multiple select mode (ie. where the =multiple= attribute is set to the value ='multiple'=), this method returns an array containing the values of the all selected options, in the order in which they appear in the options array.

								In the event that no options are selected, this method will return an empty array.

							Checkboxes
								For checkboxes (=input= tags of type =checkbox=), this method returns the value of the node's =checked= property.

							Radio Buttons
								For radio buttons (=input= tags of type =radio=), this method returns the value of the checked radio button's =value= property. If no radio button in the set is checked, then the value =undefined= is returned.

							Image Tags
								For =img= tags, this method returns the value of the node's =src= property.

							Other HTML Tags
								For all other HTML tags, this method returns value of the node's =innerHTML= property, with various characters decoded from HTML entities to reverse the effects of using the =Uize.Node.setValue= static method.

							NOTES
							- see the corresponding =Uize.Node.setValue= static method
				*/
			};

			_package.injectHtml = function (_nodeBlob,_htmlToInject,_mode) {
				var
					_isInnerReplace, _isOuterReplace, _isInnerTop, _isOuterTop, _isOuterBottom, _isInnerBottom,
					_areNodes =
						_Uize.isArray (_htmlToInject) ||
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
							if (_isInnerReplace)
								if (_isIe && _ieInnerHtmlReadOnly [_node.tagName]) {
									var _newNode = _node.cloneNode ();
									_node.replaceNode (_newNode);
									_node = _newNode;
								} else
									_node.innerHTML = '';
							if (_areNodes) {
								var _nodesToInject = [];
								for (var _nodeNo = -1, _nodesLength = _htmlToInject.length; ++_nodeNo < _nodesLength;)
									_nodesToInject.push (_htmlToInject [_nodeNo].cloneNode (_true));
							} else {
							var _dummyNode = document.createElement ('DIV');
								_dummyNode.innerHTML = '<i>e</i>'	// fix for IE NoScope issue (http://www.thecssninja.com/javascript/noscope)
									+ _htmlToInject
								;
								var _nodesToInject = _dummyNode.childNodes
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
				/*?
					Static Methods
						Uize.Node.injectHtml
							Injects the specified HTML into the specified `node blob`.

							The action of this method is different to simply setting the =innerHTML= property in that it does not replace the existing contents, but instead adds to it.

							SYNTAX
							.............................................
							Uize.Node.injectHtml (nodeBLOB,htmlSTRorOBJ);
							.............................................

							The =htmlSTRorOBJ= parameter can be a DOM node, an array of DOM nodes, a string containing the HTML you wish to inject, or it can be any object that implements a =valueOf= interface (such as an instance of a =Uize.Class= subclass that implements the =value= state property).

							VARIATION
							...........................................................
							Uize.Node.injectHtml (nodeBLOB,htmlSTRorOBJ,injectModeSTR);
							...........................................................

							When the optional =injectModeSTR= parameter is specified, the manner in which the HTML is injected can be controlled. The default value for this parameter, ='inner bottom'=, results in the HTML being appended to the existing contents. However, if the value ='inner top'= is specified, then the HTML will be injected before the existing contents.

							Injection Modes
								- ='inner bottom'= - HTML will be injected inside the node, after all of its contents
								- ='inner top'= - HTML will be injected inside the node, before all of its contents
								- ='outer bottom'= (the default) - HTML will be injected outside the node, right after the node
								- ='outer top'= - HTML will be injected outside the node, right before the node
								- ='inner replace'= - HTML will replace the contents in the node (equivalent to innerHTML replacement)
								- ='outer replace'= - HTML will replace the node itself (equivalent to IE's outerHTML replacement)

							NOTES
							- this method can operate on multiple nodes at a time. For more details, see the section on `node blob`
							- compare to the =Uize.Node.setInnerHtml= static method
				*/
			};

			var _isNode = _package.isNode = function (_node) {
				return !!(
					_node && typeof _node == _typeObject &&
					(_node.getAttribute || _node.documentElement || _node.self == _node)
				);
				/*?
					Static Methods
						Uize.Node.isNode
							Returns a boolean, indicating whether or not the specified value is a node reference.

							SYNTAX
							....................................................
							isNodeBOOL = Uize.Node.isNode (possibleNodeANYTYPE);
							....................................................

							In order for this method to return =true=, the value of the =possibleNodeANYTYPE= parameter *must* be an object reference to an element node, and not merely a string whose value is the ID of a node.
				*/
			};

			var _isOnNodeTree = _package.isOnNodeTree = function (_node,_rootNode) {
				_node = _getById (_node);
				_rootNode = _getById (_rootNode);
				while (_node) {
					if (_node == _rootNode) return _true;
					_node = _node.parentNode;
				}
				return _false;
				/*?
					Static Methods
						Uize.Node.isOnNodeTree
							Returns a boolean, indicating whether or not the specified node is contained somewhere within the node tree of the specified root node.

							SYNTAX
							..........................................................................
							isOnNodeTreeBOOL = Uize.Node.isOnNodeTree (nodeSTRorOBJ,rootNodeSTRorOBJ);
							..........................................................................

							NOTES
							- returns =true= if the =nodeSTRorOBJ= and =rootNodeSTRorOBJ= parameters both specify the same node
				*/
			};

			var _joinIdPrefixAndNodeId = _package.joinIdPrefixAndNodeId = function (_idPrefix,_nodeId) {
				return (_idPrefix || '') + (_idPrefix && _nodeId ? '-' : '') + _nodeId;
			};

			_package.remove = function (_nodeBlob) {
				_doForAll (_nodeBlob,function (_node) {_node.parentNode.removeChild (_node)});
				/*?
					Static Methods
						Uize.Node.remove
							Removes the specified `node blob` from the DOM.

							SYNTAX
							............................
							Uize.Node.remove (nodeBLOB);
							............................

							NOTES
							- if other references to nodes being removed are still being maintained, those nodes will not be freed from memory until all those other references are nulled
							- this method can operate on multiple nodes at a time. For more details, see the section on `node blob`
				*/
			};

			_package.setClipRect = function (_nodeBlob,_top,_right,_bottom,_left) {
				var _clipValue = 'rect(' + _top + 'px, ' + _right + 'px, ' + _bottom + 'px, ' + _left + 'px)';
				_doForAll (_nodeBlob,function (_node) {_node.style.clip = _clipValue});
				/*?
					Static Methods
						Uize.Node.setClipRect
							Serializes the specified clip parameters into a string and sets the value of the "clip" CSS property for the specified `node blob`.

							SYNTAX
							...................................................................
							Uize.Node.setClipRect (nodeBLOB,topINT,rightINT,bottomINT,leftINT);
							...................................................................

							NOTES
							- this method can operate on multiple nodes at a time. For more details, see the section on `node blob`
				*/
			};

			var _coordNames = ['left','top','width','height'];
			_package.setCoords = function (_nodeBlob,_coords) {
				_setStyle (_nodeBlob,_Uize.isArray (_coords) ? _Uize.meldKeysValues (_coordNames,_coords) : _coords);
				/*?
					Static Methods
						Uize.Node.setCoords
							Sets the left, top, width, and height coordinates for the specified `node blob`.

							SYNTAX
							................................................
							Uize.Node.setCoords (nodeBLOB,coordsARRAYorOBJ);
							................................................

							The =coordsARRAYorOBJ= parameter can be an object of the form...

							...........................................
							{
								left: leftINTorSTRorOBJ,     // optional
								top: topINTorSTRorOBJ,       // optional
								width: widthINTorSTRorOBJ,   // optional
								height: heightINTorSTRorOBJ  // optional
							}
							...........................................

							...or an array of the form...

							...........................................................................
							[leftINTorSTRorOBJ,topINTorSTRorOBJ,widthINTorSTRorOBJ,heightINTorSTRorOBJ]
							...........................................................................

							...or...

							....................................
							[leftINTorSTRorOBJ,topINTorSTRorOBJ]
							....................................

							When number type values are specified for =leftINTorSTRorOBJ=, =topINTorSTRorOBJ=, =widthINTorSTRorOBJ=, or =heightINTorSTRorOBJ=, those values will be converted to strings by appending the "px" unit. When string type values are specified, the unit should already be present in the value. =Uize.Class= subclass instances can also be specified, and they will be converted to values by invoking their =valueOf Intrinsic Method=.

							EXAMPLES
							.......................................................................................
							// just left and top coordinates

							Uize.Node.setCoords ('nodeId',[0,0]);
							Uize.Node.setCoords ('nodeId',['0px','0px']);
							Uize.Node.setCoords ('nodeId',[sliderL,sliderT]);
							Uize.Node.setCoords ('nodeId',{left:0,top:0});
							Uize.Node.setCoords ('nodeId',{left:'0px',top:'0px'});
							Uize.Node.setCoords ('nodeId',{left:sliderL,top:sliderT});


							// left, top, width, and height

							Uize.Node.setCoords ('nodeId',[0,0,200,100]);
							Uize.Node.setCoords ('nodeId',['0px','0px','200px','100px']);
							Uize.Node.setCoords ('nodeId',[sliderL,sliderT,sliderW,sliderH]);
							Uize.Node.setCoords ('nodeId',{left:0,top:0,width:200,height:100});
							Uize.Node.setCoords ('nodeId',{left:'0px',top:'0px',width:'200px',height:'100px'});
							Uize.Node.setCoords ('nodeId',{left:sliderL,top:sliderT,width:sliderW,height:sliderH});


							// just width and height

							Uize.Node.setCoords ('nodeId',{width:200,height:100});
							Uize.Node.setCoords ('nodeId',{width:'200px',height:'100px'});
							Uize.Node.setCoords ('nodeId',{width:sliderW,height:sliderH});
							.......................................................................................

							In the above example, =sliderL=, =sliderT=, =sliderW=, and =sliderH= are instances of the =Uize.Widget.Bar.Slider= class.

							NOTES
							- this method can operate on multiple nodes at a time. For more details, see the section on `node blob`
							- see also the =Uize.Node.getCoords= static method
				*/
			};

			_package.centerInWindow = function (_nodeBlob) {
				var _windowCoords = _getCoords (window);
				_doForAll (
					_nodeBlob,
					function (_node) {
						var _nodeDims = _getDimensions (_node);
						_package.setCoords (
							_node,
							{
								left:_windowCoords.x + ((_windowCoords.width - _nodeDims.width) >> 1),
								top:_windowCoords.y + ((_windowCoords.height - _nodeDims.height) >> 1)
							}
						);
					}
				);
				/*?
					Static Methods
						Uize.Node.centerInWindow
							Positions the specified absolutely positioned node (or `node blob`) to be centered in the window.

							SYNTAX
							....................................
							Uize.Node.centerInWindow (nodeBLOB);
							....................................

							This method can be useful for positioning dialogs, loading indicator overlays, splashscreens, etc.

							NOTES
							- this method can operate on multiple nodes at a time. For more details, see the section on `node blob`
							- nodes centered using this method should be absolutely positioned and should not be set to =display:none= at the time of being centered
				*/
			};

			_package.getEventAbsPos = function (_eventOrPosObj) {
				var _targetTouches = (_eventOrPosObj || (_eventOrPosObj = _mousePos)).targetTouches;
				if (_targetTouches && _targetTouches.length)
					_eventOrPosObj = _targetTouches [0]
				;
				if (_eventOrPosObj.pageX != _undefined) {
					return {left:_eventOrPosObj.pageX,top:_eventOrPosObj.pageY};
				} else {
					var _documentElement = _getDocumentScrollElement ();
					return {
						left:_eventOrPosObj.clientX + _documentElement.scrollLeft,
						top:_eventOrPosObj.clientY + _documentElement.scrollTop
					};
				}
				/*?
					Static Methods
						Uize.Node.getEventAbsPos
							Returns an object, representing the coordinates of the specified DOM event, relative to the top left of the document.

							SYNTAX
							........................................................
							eventAbsPosOBJ = Uize.Node.getEventAbsPos (domEventOBJ);
							........................................................

							RETURN
							........................
							{
								left : leftPixelsINT,
								top : topPixelsINT
							}
							........................

							VARIATION
							.............................................
							eventAbsPosOBJ = Uize.Node.getEventAbsPos ();
							.............................................

							When no =domEventOBJ= parameter is specified, this method returns the absolute coordinates for the mouse's current position. This is useful, because sometimes the reference to an initiating DOM event might get lost through multiple layers of handler code in your application. In such cases, this variation provides a fallback for getting the current mouse coordinates for use in positioning popups, dialogs, etc.
				*/
			};

			var _setAbsPos = _package.setAbsPos = function (_nodeBlob,_absPos,_coordMargin) {
				_coordMargin = typeof _coordMargin == 'number'
					? {x:_coordMargin,y:_coordMargin}
					: (_coordMargin || {x:0,y:0})
				;
				var
					_documentElement = document [_isSafari ? 'body' : 'documentElement'],
					_viewDims = _getDimensions (window)
				;
				_doForAll (
					_nodeBlob,
					function (_node) {
						function _getAxisConstrainedPos (_posName,_scrollPosName,_dimName,_axisName) {
							var
								_absPosForAxis = _absPos [_posName],
								_coordMarginForAxis = _coordMargin [_axisName],
								_preferredViewPos = _absPosForAxis - _documentElement [_scrollPosName],
								_coordsMarginPlusNodeDim = _coordMarginForAxis + _nodeDims [_dimName]
							;
							return (
								_absPosForAxis +
								(
									_preferredViewPos + _coordsMarginPlusNodeDim > _viewDims [_dimName]
										? Math.max (-_coordsMarginPlusNodeDim,-_preferredViewPos)
										: _coordMarginForAxis
								)
							);
						}
						var _nodeDims = _getDimensions (_node);
						_setStyle (
							_node,
							{
								left:_getAxisConstrainedPos ('left','scrollLeft','width','x'),
								top:_getAxisConstrainedPos ('top','scrollTop','height','y'),
								right:'auto',
								bottom:'auto'
							}
						);
					}
				);
				/*?
					Static Methods
						Uize.Node.setAbsPos
							Positions the specified absolutely positioned node (or `node blob`) to be adjacent to the specified absolute position coordinates.

							SYNTAX
							.............................................................
							Uize.Node.setAbsPos (nodeBLOB,absPosOBJ,coordMarginINTorOBJ);
							.............................................................

							This method is useful for displaying an absolutely positioned node adjacent to absolute position coordinates, in such a way that the node being positioned is kept within view in the browser window. This comes in handy, for example, when positioning tooltips that track the mouse cursor position. If the default positioning of the node causes some part of it to fall out of view in a given axis, then its position will be flipped to the other side of the absolute position coordinate for that axis, according to the `flipping behavior` described below.

							The absPosOBJ Parameter
								The =absPosOBJ= parameter specifies the center of the region, adjacent to which the node should be positioned.

								The value of this parameter should be an object of the form...

								........................
								{
									left : leftPixelsINT,
									top : topPixelsINT
								}
								........................

							The coordMarginINTorOBJ Parameter
								The optional =coordMarginINTorOBJ= parameter specifies a margin around the coordinates specified in the =absPosOBJ= parameter that should be avoided when positioning the node.

								This parameter is useful for positioning tooltips that should track the cursor position and that should avoid obscuring - or being obscured by - the cursor pointer. The value of this parameter should be either an integer that specifies a margin for both the x and y axes, or an object of the form...

								........................
								{
									x : xMarginPixelsINT,
									y : yMarginPixelsINT
								}
								........................

							Combining absPosOBJ and coordMarginINTorOBJ
								Essentially, the combination of the =absPosOBJ= and =coordMarginINTorOBJ= parameters defines a region, adjacent to which the node should be positioned, and that should be avoided when positioning the node, and where the margin specified by the =coordMarginINTorOBJ= parameter extends the region to either side of the point specified by the =absPosOBJ= paramter on each axis, by the number of pixels specified for each axis in the =coordMarginINTorOBJ= parameter.

							Flipping Behavior
								By default, this method will first try to position the node so that its top edge butts up against the bottom edge of the region defined by the combination of the =absPosOBJ= and =coordMarginINTorOBJ= parameters, and so that its left edge butts up against this region's right edge.

								If, with this positioning, the node is not fully in view vertically, then its position will be flipped on the y axis so that its bottom edge butts up against the top edge of the region. And if, with this positioning, the node is not fully in view horizontally, then its position will be flipped about on the x axis so that its right edge butts up against the left edge of the region.

							VARIATION
							.........................................
							Uize.Node.setAbsPos (nodeBLOB,absPosOBJ);
							.........................................

							When the optional =coordMarginINTorOBJ= parameter is not specified, then its value will be defaulted to ={x:0,y:0}=.

							NOTES
							- compare to the =Uize.Node.setAbsPosAdjacentTo= static method
				*/
			};

			_package.setAbsPosAdjacentTo = function (_nodeBlob,_referenceNode,_pivotAxis) {
				_referenceNode = _getById (_referenceNode);
				var
					_referenceNodeCoords = _getCoords (_referenceNode),
					_referenceNodeWidthDiv2 = _referenceNodeCoords.width / 2,
					_referenceNodeHeightDiv2 = _referenceNodeCoords.height / 2,
					_pivotSign = _pivotAxis == 'x' ? -1 : 1
				;
				if (!_referenceNodeWidthDiv2 && !_referenceNodeHeightDiv2)
					_referenceNodeCoords = _package.getEventAbsPos ()
				;
				_doForAll (
					_nodeBlob,
					function (_node) {
						_setAbsPos (
							_node,
							{
								left:_referenceNodeCoords.left + _referenceNodeWidthDiv2,
								top:_referenceNodeCoords.top + _referenceNodeHeightDiv2
							},
							{x:-_referenceNodeWidthDiv2 * _pivotSign,y:_referenceNodeHeightDiv2 * _pivotSign}
						);
					}
				);
				/*?
					Static Methods
						Uize.Node.setAbsPosAdjacentTo
							Positions the specified absolutely positioned node (or `node blob`) to be adjacent to the specified reference node.

							SYNTAX
							.......................................................................
							Uize.Node.setAbsPosAdjacentTo (nodeBLOB,referenceNodeOBJ,pivotAxisSTR);
							.......................................................................

							This method is useful for displaying an absolutely positioned node adjacent to a reference node, in such a way that the node being positioned is kept within view in the browser window. This comes in handy for positioning tooltips, droplists, popup palettes, etc. If the default positioning of the node causes some part of it to fall out of view, then the position will be flipped to the other side of the reference node on the specified pivot axis.

							Y Pivot Axis
								When the value ='y'= is specified for the =pivotAxisSTR= parameter, then this method will first try to position the node so that its top edge butts up against the bottom edge of the reference node, and so that its left edge is aligned with the left edge of the reference node. If the node being positioned is not fully in view vertically, then its position will be flipped about the y pivot axis so that its bottom edge butts up against the top edge of the reference node. If the node being positioned is not fully in view horizontally, then its position will be flipped about on the x axis so that its right edge is aligned with the right edge of the reference node. The y pivot axis mode is useful for droplists / dropdown menus.

							X Pivot Axis
								When the value ='x'= is specified for the =pivotAxisSTR= parameter, then this method will first try to position the node so that its left edge butts up against the right edge of the reference node, and so that its top edge is aligned with the top edge of the reference node. If the node being positioned is not fully in view horizontally, then its position will be flipped about the x pivot axis so that its right edge butts up against the left edge of the reference node. If the node being positioned is not fully in view vertically, then its position will be flipped about on the y axis so that its bottom edge is aligned with the bottom edge of the reference node. The x pivot axis mode is useful for submenus of a dropdown menu, or for the top level menus of a vertically arranged menu.

							VARIATION 1
							..........................................................
							Uize.Node.setAbsPosAdjacentTo (nodeBLOB,referenceNodeOBJ);
							..........................................................

							When the optional =pivotAxisSTR= parameter is not specified, then its value will be defaulted to ='y'=.

							VARIATION 2
							.........................................
							Uize.Node.setAbsPosAdjacentTo (nodeBLOB);
							.........................................

							When only the =nodeBLOB= parameter is specified, then the current absolute position of the mouse cursor will be used as the reference point for positioning, and the =pivotAxisSTR= parameter will be defaulted to ='y'=.

							NOTES
							- when the value of the =referenceNodeOBJ= parameter is =null=, =undefined=, or is a string value representing the id for a node that is not in the document, or if the node is not displayed when this method is called and its dimensions are reported as 0x0, then this method will use the current absolute position of the mouse cursor as the reference point for positioning
							- compare to the =Uize.Node.setAbsPos= static method
				*/
			};

			_package.setInnerHtml = function (_nodeBlob,_html) {
				_html += ''; // coerce to a string value by invoking valueOf method
				_doForAll (_nodeBlob,function (_node) {_node.innerHTML = _html});
				/*?
					Static Methods
						Uize.Node.setInnerHtml
							Sets the value of the =innerHTML= property of the specified `node blob`.

							SYNTAX
							...............................................
							Uize.Node.setInnerHtml (nodeBLOB,htmlSTRorOBJ);
							...............................................

							The =htmlSTRorOBJ= parameter can be a string containing the HTML you wish to inject, or it can be any object that implements a =valueOf= interface (such as an instance of a =Uize.Class= subclass that implements the =value= state property).

							NOTES
							- this method can operate on multiple nodes at a time. For more details, see the section on `node blob`
							- compare to the =Uize.Node.injectHtml= static method
				*/
			};

			var _opacityStyleProperty = {};
			_package.setOpacity = function (_nodeBlob,_opacity) {
				_opacityStyleProperty.opacity = _opacity;
				_setStyle (_nodeBlob,_opacityStyleProperty);
				/*?
					Static Methods
						Uize.Node.setOpacity
							Sets the opacity (and, therefore, the transparency) of the specified `node blob`.

							SYNTAX
							..................................................
							Uize.Node.setOpacity (nodeBLOB,opacityFLOATorOBJ);
							..................................................

							Varying degrees of opacity are achieved in different browsers using slightly different techniques. This method acts as an abstraction so you can set opacity for a node in a standard way. =opacityFLOAT= should be a number in the range of =0= to =1=, where =0= represents completely invisible, =1= represents completely opaque, and any fractional values inbetween represent varying degrees of transparency / opacity.

							NOTES
							- this method can operate on multiple nodes at a time. For more details, see the section on `node blob`
							- the =opacityFLOATorOBJ= parameter can be an object that implements a =valueOf= interface (such as an instance of a =Uize.Class= subclass that implements the =value= state property)
				*/
			};

			_package.setProperties = function (_nodeBlob,_properties) {
				_doForAll (_nodeBlob,function (_node) {_Uize_copyInto (_node,_properties)});
				/*?
					Static Methods
						Uize.Node.setProperties
							Sets values for an arbitrary set of properties for the specified `node blob`.

							SYNTAX
							.................................................
							Uize.Node.setProperties (nodeBLOB,propertiesOBJ);
							.................................................

							EXAMPLE
							...........................................................
							Uize.Node.setProperties (
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
			};

			var _setStyle = _package.setStyle = function (_nodeBlob,_properties) {
				_doForAll (
					_nodeBlob,
					function (_node) {
						var
							_nodeStyle = _node.style,
							_propertyValue
						;
						if (_isIe && 'opacity' in _properties)
							_nodeStyle.filter =
								(_propertyValue = Math.round (_properties.opacity * 100)) < 100
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
						Uize.Node.setStyle
							Sets values for an arbitrary set of style properties for the specified `node blob`.

							SYNTAX
							.................................................
							Uize.Node.setStyle (nodeBLOB,stylePropertiesOBJ);
							.................................................

							EXAMPLE
							..................................................
							Uize.Node.setStyle (
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
								The =Uize.Node.setStyle= method abstracts the differences between Internet Explorer and browsers that support the standard CSS =opacity= property.

								This means that you can use the =Uize.Node.setStyle= method to set opacity as you would any other CSS style property, and the method will set the value of IE's proprietary =filter= style property as necessary.

								EXAMPLE
								..................................................................
								Uize.Node.setStyle ('myNodeId',{opacity:.5,width:200,height:100});
								..................................................................

							Specifying Number Values
								When number type values are specified for CSS style properties (other than the =opacity= and =zIndex= properties), the values are converted to strings by appending the "px" unit.

								So, for example, the following statement...

								...............................................................
								Uize.Node.setStyle ('myNodeId',{width:'200px',height:'100px'});
								...............................................................

								...can also be written as...

								.......................................................
								Uize.Node.setStyle ('myNodeId',{width:200,height:100});
								.......................................................

								This feature of the =Uize.Node.setStyle= method is provided as a convenience, so that the values of number type variables can be supplied - as is - when setting style properties such as =left=, =top=, =width=, =height=, =fontSize=, etc.

							Specifying Instance Values
								When an instance of a =Uize.Class= subclass is specified for a CSS style property, the instance's =valueOf Intrinsic Method= is invoked in order to obtain the value of the instance's =value= state property.

								So, for example, the following statement...

								...........................................................................
								Uize.Node.setStyle ('myNodeId',{width:myWidthSlider.get ('value') + 'px'});
								...........................................................................

								...can also be written as just...

								......................................................
								Uize.Node.setStyle ('myNodeId',{width:myWidthSlider});
								......................................................

								This feature of the =Uize.Node.setStyle= method is provided as a convenience, so that instances of =Uize.Class= subclasses that are value selectors and that implement the =value= state property can be supplied - as is - when setting any style properties. If the value for an instance is a number type, then it will be further handled according to the rules for `specifying number values`.

							NOTES
							- this method can operate on multiple nodes at a time. For more details, see the section on `node blob`
							- see also the companion =Uize.Node.getStyle= static method
				*/
			};

			_package.setValue = function (_nodeBlob,_value) {
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
							_node.value = _value;
						} else if (_nodeTagName == 'INPUT') {
							var _nodeType = _node.type;
							if (_nodeType == 'text' || _nodeType == _hidden || _nodeType == 'password') {
								_node.value = _value;
							} else if (_nodeType == 'checkbox') {
								_node.checked = _value == 'true';
							} else if (_nodeType == 'radio') {
								_node.checked = _node.value == _value;
							}
						} else if (_nodeTagName == 'SELECT') {
							if (!_value) {
								_node.selectedIndex = -1;
							} else {
								var _options = _node.options;
								if (_node.multiple && (_value == '*' || _value.indexOf (',') > -1)) {
									var _valuesMap = _value != '*' ? _Uize.lookup (_value.split (',')) : _undefined;
									for (var _optionNo = _options.length, _option; --_optionNo >= 0;)
										(_option = _options [_optionNo]).selected = !_valuesMap || _valuesMap [_option.value]
									;
								} else {
									_node.selectedIndex = _Uize.findRecordNo (_options,{value:_value},_node.selectedIndex);
								}
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
						Uize.Node.setValue
							Sets the value of the specified `node blob`.

							SYNTAX
							.......................................................
							Uize.Node.setValue (nodeBLOB,valueSTRorNUMorBOOLorOBJ);
							.......................................................

							In addition to being able to be a simple type value (like a string, boolean, or number), the =valueSTRorNUMorBOOLorOBJ= parameter can also be any object that implements a =valueOf= interface (such as an instance of a =Uize.Class= subclass that implements the =value= state property).

							This method provides a convenient abstraction that makes it easier to change a form's implementation, without having to worry about modifying the JavaScript application logic that sets values for the form's fields. For example, you could change the HTML of a form so that what was once a =select= tag becomes a =radio= button set, and the call to =Uize.Node.setValue= could remain unchanged.

							EXAMPLE
							....................................................................
							Uize.Node.setValue (
								[
									Uize.Node.find ({root:'myFormId',tagName:'TEXTAREA'}),
									Uize.Node.find ({root:'myFormId',tagName:'INPUT',type:'text'})
								],
								''
							);
							....................................................................

							In the above example, an array `node blob` is being supplied to the =Uize.Node.setValue= method. Each element of the array is itself an array, being the result of a call to the =Uize.Node.find= method. Essentially, this example is finding all the =textarea= and text =input= tags within the form of the id =myFormId= and using the =Uize.Node.setValue= method to set their values to an empty string, thereby clearing all the form's text fields.

							Text Fields
								For =textarea= tags and =input= tags of type =text= and =hidden=, the node's =value= property is set to the value of the =valueSTRorNUMorBOOLorOBJ= parameter.

							Select Boxes - Single Select
								For =select= tags in single select mode (ie. where the =multiple= attribute is absent), the node's =selectedIndex= property is set to the index of the option whose =value= property corresponds to the value of the =valueSTRorNUMorBOOLorOBJ= parameter.

								If there is no option whose =value= property corresponds, then the =selectedIndex= of the node will not be changed.

								Empty String Reserved
									When the special value =''= (empty string) is specified, then the =selectedIndex= of the node will be set to the value =-1=, upon which no option will be selected.

							Select Boxes - Multiple Select
								For =select= tags in multiple select mode (ie. where the =multiple= attribute is set to the value ='multiple'=), the =selected= property for every option in the select box whose value is in the specified selected options value will be set to =true=.

								When using the =Uize.Node.setValue= method to set the selected options of a multiple select =select= tag, the selected options can be specified either as an array of strings, or as a string formatted as a comma-separated list, where the items in the selected options list should be the values of the options that should become selected (ie. *not* the display text for the options).

								Order Unimportant
									The order in which the selected options are specified in the list is not important.

									In the following example, both statements would have the same outcome...

									EXAMPLE
									............................................................
									Uize.Node.setValue ('renewableEnergyList',['Solar','Wind']);
									Uize.Node.setValue ('renewableEnergyList',['Wind','Solar']);
									............................................................

								Invalid Values Ignored
									Any option values that appear in the list that don't correspond to options in the =select= tag will be ignored.

									EXAMPLE
									..................................................................................
									Uize.Node.setValue ('renewableEnergyList',['Solar','Wind','Oil']);  // oil ignored
									..................................................................................

									There is no option ='Oil'= in our list of renewable energy technologies, so this value would simply be ignored, and only the ='Solar'= and ='Wind'= options would become selected.

								Duplicate Values Are Allowed
									Duplicate entries in the selected options list are permitted, a behavior which comes in handy when performing `additive selection`.

									In the following example, both statements would have the same outcome...

									EXAMPLE
									......................................................................................
									Uize.Node.setValue ('renewableEnergyList',['Solar','Wind']);
									Uize.Node.setValue ('renewableEnergyList',['Solar','Wind','Solar']);  // has duplicate
									......................................................................................

								Don't Pad Comma-separated Values
									When the selected options are specified as a comma-separated string, the values in the string *should not* be padded with extra spaces, or the specified options will not become selected correctly.

									INCORRECT
									.......................................................................................
									Uize.Node.setValue ('renewableEnergyList','Wind , Solar');  // padding around comma bad
									Uize.Node.setValue ('renewableEnergyList','Wind, Solar');   // padding after comma bad
									Uize.Node.setValue ('renewableEnergyList','Wind ,Solar');   // padding before comma bad
									Uize.Node.setValue ('renewableEnergyList',' Wind,Solar ');  // padding around list bad
									.......................................................................................

									CORRECT
									........................................................
									Uize.Node.setValue ('renewableEnergyList','Wind,Solar');
									........................................................

								Option Values May Not Contain Commas
									Because this method supports a selected options list specified as a comma-separated string, the values of individual options must not contain commas in order for this method to work correctly.

									Due to the implementation of this method, this restriction applies even when specifying the selected options list as an array of strings.

								Empty String Reserved
									When the special value =''= (empty string) is specified, then the =selectedIndex= of the node will be set to the value =-1=, upon which no options will be selected.

									Using this value has the effect of clearing all the selected options, behaving as a "select none" feature.

									EXAMPLE
									................................................................................
									Uize.Node.setValue ('renewableEnergyList','');  // clear selection of renewables
									................................................................................

								Wildcard '*' Reserved
									When the special wildcard value ='*'= is specified, then the =selected= property for every option in the select box will be set to =true=.

									Using this value has the effect of selecting all available options, behaving as a "select all" feature.

									EXAMPLE
									..................................................................................
									Uize.Node.setValue ('renewableEnergyList','*');  // select all forms of renewables
									..................................................................................

								Additive Selection
									When using the =Uize.Node.setValue= method to set the selected options of a multiple select =select= tag, the selected options after the method is called will be *only* those in the specified selected options value.

									Any options that are *not* in the specified selected options value will become unselected. In most cases, this will be the desired behavior. However, in some cases one may wish to add additional selected options without blowing away existing selected options. To accomplish this, one can use the =Uize.Node.getValue= method in conjunction with the =Uize.Node.setValue= method, as follows...

									EXAMPLE
									.....................................................................
									Uize.Node.setValue (
										'renewableEnergyList',
										Uize.Node.getValue ('renewableEnergyList').concat ('Solar','Wind')
									);
									.....................................................................

									In the above example, a node with the =id= of ='renewableEnergyList'= is a multiple select =select= tag that lets the user choose any number of renewable energy technologies.

									Executing the statement in the example would add the ='Solar'= and ='Wind'= options to the selected options. To avoid blowing away any currently selected options, the =Uize.Node.getValue= method is used to get the currently selected options. The value returned from this method is an array, so we can use the =concat= method of the =Array= object to "merge in" the ='Solar'= and ='Wind'= options. The resulting array is then supplied to the =Uize.Node.setValue= method to set the selected options. It doesn't matter if either - or both - of the ='Solar'= and ='Wind'= options were already selected, since `duplicate values are allowed` by the =Uize.Node.setValue= method.

							Checkboxes
								For checkboxes (=input= tags of type =checkbox=), the =checked= property of the node is set to =true= or =false= dependending on whether or not the value of the =valueSTRorNUMorBOOLorOBJ= parameter is equivalent to =true= (ie. if it has the boolean value =true= or the string value ='true'=).

							Radio Buttons
								For radio buttons (=input= tags of type =radio=), the =checked= property of the radio button node in the set whose =value= property corresponds to the value of the =valueSTRorNUMorBOOLorOBJ= parameter is set to =true=, while the =checked= property of all other radio button nodes in the set is set to =false=.

								If there is no radio button whose =value= property corresponds, then all radio buttons in the set will be left unchecked.

							Image Tags
								For =img= tags, the node's =src= property is set to the value of the =valueSTRorNUMorBOOLorOBJ= parameter.

							Other HTML Tags
								For all other HTML tags, the node's =innerHTML= property is set to the value of the =valueSTRorNUMorBOOLorOBJ= parameter, with various characters encoded to HTML entities so that the value is displayed literally.

							NOTES
							- you can use the =Uize.Node.setValue= method to set values on readonly form elements
							- see the corresponding =Uize.Node.getValue= static method
							- the =value= parameter can be an object that implements a =valueOf= interface (such as an instance of a =Uize.Class= subclass that implements the =value= state property)
				*/
			};

			_package.show = function (_nodeBlob,_mustShow) {
				_setStyle (_nodeBlob,{visibility:_mustShow || _mustShow === _undefined ? 'inherit' : _hidden});
				/*?
					Static Methods
						Uize.Node.show
							Lets you show or hide the specified `node blob`.

							SYNTAX
							.......................................
							Uize.Node.show (nodeBLOB,mustShowBOOL);
							.......................................

							This method operates on the =visibility= style property of nodes. When =true= is specified for the =mustShowBOOL= parameter, then the =visibility= property is set to ="inherit"=. When =false= is specified, the =visibility= property is set to ="hidden"=.

							NOTES
							- this method can operate on multiple nodes at a time. For more details, see the section on `node blob`
				*/
			};

			_package.showClickable = function (_nodeBlob,_clickable) {
				_setStyle (
					_nodeBlob,
					{
						cursor:
							_clickable || _clickable === _undefined
								? (_useHandForPointerCursor ? 'hand' : 'pointer')
								: 'default'
					}
				);
				/*?
					Static Methods
						Uize.Node.showClickable
							Sets the value of the "cursor" style property of the specified `node blob` so that the node(s) appear either clickable or not, depending on the specified boolean value.

							This method is useful for DOM nodes that need to be wired up with click actions by JavaScript code, but that don't have CSS selectors from the document applying the appropriate cursor style to them.

							SYNTAX
							....................................................
							Uize.Node.showClickable (nodeBLOB,clickableANYTYPE);
							....................................................

							While typically a Boolean, the =clickableANYTYPE= parameter can be of any type and the node(s) will be set to appear clickable if it resolves to =true=, and not clickable if it resolves to =false= - with the exception of =undefined=, when the node(s) will be set to appear clickable (see explanation below).

							VARIATION
							...................................
							Uize.Node.showClickable (nodeBLOB);
							...................................

							When no =clickableANYTYPE= parameter is specified (or when its value is =undefined=), the node(s) will be set to appear clickable.

							NOTES
							- this method can operate on multiple nodes at a time. For more details, see the section on `node blob`
				*/
			};

			var _unwire = _package.unwire = function (_nodeBlob,_eventNameOrEventsMap,_argument3,_argument4) {
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
						Uize.Node.unwire
							Lets you unwire one or more event handlers for the specified node or `node blob`.

							SYNTAX
							..........................................................
							Uize.Node.unwire (nodeBLOB,eventNameSTR,eventHandlerFUNC);
							..........................................................

							EXAMPLE
							..................................................
							function clickHandler1 () {alert ('foo')}
							function clickHandler2 () {alert ('bar')}

							Uize.Node.wire ('myNode','click',clickHandler1);
							Uize.Node.wire ('myNode','click',clickHandler2);

							Uize.Node.unwire ('myNode','click',clickHandler1);
							..................................................

							The above example would unwire only the =clickHandler1= handler for the =click= event of the node =myNode=. So, after the above code has been executed, clicking on this node would produce only one alert dialog displaying the text "bar" (so long, foo).

							VARIATION 1
							.........................................
							Uize.Node.unwire (nodeBLOB,eventNameSTR);
							.........................................

							When no =eventHandlerFUNC= parameter is specified, then all handlers wired for the specified event of the specified node or `node blob` will be unwired. This applies only to handlers wired using the =Uize.Node= module, and belonging to the `global wirings owner`.

							EXAMPLE
							....................................
							Uize.Node.unwire ('myNode','click');
							....................................

							The above example would unwire all handlers for the =click= event of the node =myNode=.

							VARIATION 2
							.......................................................
							Uize.Node.unwire (nodeBLOB,eventNamesToHandlersMapOBJ);
							.......................................................

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

							Uize.Node.wire (
								'myNode',
								{
									mouseover:mouseoverHandler,
									mouseout:mouseoutHandler,
									click:clickHandler
								}
							);
							Uize.Node.unwire (
								'myNode',
								{
									mouseover:mouseoverHandler,
									mouseout:mouseoutHandler
								}
							);
							..................................................

							In the above example, handlers are being wired to the =mouseover=, =mouseout=, and =click= events of the node =myNode=. Then the handlers for the =mouseover= and =mouseout= events are being unwired, leaving only the handler that was wired to the =click= event.

							VARIATION 3
							............................
							Uize.Node.unwire (nodeBLOB);
							............................

							When no =eventNameSTR= or =eventHandlerFUNC= parameters are specified, then all handlers wired for all events of the specified node or `node blob` will be unwired. This applies only to handlers wired using the =Uize.Node= module, and belonging to the `global wirings owner`.

							EXAMPLE
							............................
							Uize.Node.unwire ('myNode');
							............................

							The above example would unwire all handlers for all events of the node =myNode=.

							VARIATION 4
							.....................................................................
							Uize.Node.unwire (nodeBLOB,eventNameSTR,eventHandlerFUNC,ownerIdSTR);
							Uize.Node.unwire (nodeBLOB,eventNamesToHandlersMapOBJ,ownerIdSTR);
							.....................................................................

							When the optional =ownerIdSTR= parameter is specified, then only wirings belonging to the specified owner will be unwired by this method. This ownership mechanism is primarily intended for the implementation of the =Uize.Widget= class, but may also be useful when coding less formal mappings of interaction logic to sets of DOM nodes.

							Global Wirings Owner
								When the optional =ownerIdSTR= parameter is not specified, the default value of =''= (empty string) is used.

								The default empty string owner ID can be considered as the global wirings owner. Whenever the =Uize.Node.wire= and =Uize.Node.unwire= static methods are called and no =ownerIdSTR= is supplied, or if the value =''= (empty string) is explicitly specified for this parameter, then the wirings are assigned to the global pool.

								With this default behavior, this method only unwires event handlers that have been wired by this module and will not unwire event handlers wired for a node by widget instances (ie. instances of a =Uize.Widget= subclass), even if the specified event name and handler match a wiring owned by a widget instance. Additionally, this method will not unwire event handlers wired for nodes using code that does not utilize the =Uize.Node= module for DOM event management.

							NOTES
							- see the companion =Uize.Node.wire= static method
							- compare to the =Uize.Node.unwireEventsByOwnerId= static method
							- compare to the =wireNode=, =unwireNode=, and =unwireNodeEventsByMatch= instance methods of the =Uize.Widget= module
				*/
			};

			_package.unwireEventsByOwnerId = function (_wiringOwnerId,_eventMatch) {
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
											_node == window
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
						Uize.Node.unwireEventsByOwnerId
							Unwires node event handlers that have been wired for the specified owner.

							This method is primarily intended for the implementation of the =Uize.Widget= class, but may also be useful when coding less formal mappings of interaction logic to sets of DOM nodes.

							SYNTAX
							.............................................
							Uize.Node.unwireEventsByOwnerId (ownerIdSTR);
							.............................................

							VARIATION
							...........................................................
							Uize.Node.unwireEventsByOwnerId (ownerIdSTR,eventMatchOBJ);
							...........................................................

							When the optional =eventMatchOBJ= parameter is specified, then node event handlers of the specified owner will only be unwired if they fit the specified match criteria. The =eventMatchOBJ= parameter is an object that may contain any of the properties =node=, =eventName=, and =handler=, where =node= should be a reference to a DOM node (or an array of references to DOM nodes), =eventName= should be the name of a node event, and =handler= should be a function reference.

							EXAMPLE 1
							....................................................................
							Uize.Node.unwireEventsByOwnerId ('imageViewer',{eventName:'click'});
							....................................................................

							In this example, all =click= event handlers of the owner "imageViewer" would be unwired.

							EXAMPLE 2
							....................................................................
							Uize.Node.unwireEventsByOwnerId ('imageViewer',{node:'zoomButton'});
							....................................................................

							In this example, all handlers wired for the "zoomButton" node of the owner ='imageViewer'= would be unwired.

							NOTES
							- see also the =Uize.Node.wire= static method
				*/
			};

			var
				_quarantine = Uize.quarantine,
				_makeWindowEventHandlerCaller = _quarantine (
					function (_wiringId) {
						return (
							function (_event) {
								var _wiring = window.Uize && Uize.Node._wirings [_wiringId];
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
								var _wiring = window.Uize && Uize.Node._wirings [_wiringId];
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
										_wiring = window.Uize && Uize.Node._wirings [_wiringId],
											/* NOTE: test on window.Uize in case page is being torn down */
										_exitNode = (_event || (_event = window.event)).fromElement || _event.relatedTarget
									;
									if (_wiring) {
										/* NOTE:
											_wiring could be undefined if window.Uize is undefined because the page is being torn down, or in some cases in IE if the DOM event is still fired after the wiring is removed (some kind of a threading issue?)
										*/
										if (_exitNode) {
											try {
												if (!_exitNode.Uize_Widget_Drag_shield && !Uize.Node.isOnNodeTree (_exitNode,_wiring._node))
													_exitNode = null;
											} catch (_error) {
												/* NOTE:
													In some cases in Firefox, trying to get a property of form nodes results in a weird permission denied exception. In this case we can't determine if the node is in the tree.
													In that case, pass the event along
												*/
												_exitNode = null;
											}
										}
										if (!_exitNode) {
											Uize.Node._captureMousePos (_event);
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
										_wiring = window.Uize && Uize.Node._wirings [_wiringId],
											/* NOTE: test on window.Uize in case page is being torn down */
										_entryNode = (_event || (_event = window.event)).toElement || _event.relatedTarget
									;
									if (_wiring) {
										/* NOTE:
											_wiring could be undefined if window.Uize is undefined because the page is being torn down, or in some cases in IE if the DOM event is still fired after the wiring is removed (some kind of a threading issue?)
										*/
										if (_entryNode) {
											try {
												if (!_entryNode.Uize_Widget_Drag_shield && !Uize.Node.isOnNodeTree (_entryNode,_wiring._node))
													_entryNode = null;
											} catch (_error) {
												/* NOTE:
													In some cases in Firefox, trying to get a property of form nodes results in a weird permission denied exception. In this case we can't determine if the node is in the tree.
													In that case, pass the event along
												*/
												_entryNode = null;
											}
										}
										if (!_entryNode)
											return _wiring._handler.call (_wiring._node,_event);
									}
								}
							);
						}
					),
					mousedown:_makeGenericHandlerCaller,
					mouseup:_makeGenericHandlerCaller
				}
			;

			_package.wire = function (_nodeBlob,_eventName,_handler,_wiringOwnerId) {
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
						var _nodeTagName = _node.tagName;

						/*** update handler mapping info ***/
							(_wiringIdsByOwnerId [_wiringOwnerId] || (_wiringIdsByOwnerId [_wiringOwnerId] = [])).push (
								_totalWirings
							);

						/*** make handler caller function ***/
							var _handlerCaller =
								(
									_isVirtualDomEvent
										? _Uize_returnFalse
										: _node == window
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
								_node == window
									? _windowEventVehicle.wire (_eventName,_handlerCaller)
									: _isIe
										? _node.attachEvent (_eventPropertyName,_handlerCaller)
										: _node.addEventListener (_eventName,_handlerCaller,_false)
								;
								if (
									_nodeTagName == 'A' &&
									(_eventName == 'mousedown' || _eventName == 'click') && !_node [_eventPropertyName]
								)
									_node [_eventPropertyName] = _Uize_returnFalse
								;
						} else if (_isVirtualDomEvent) {
							_eventName.wire (_node,_handler,_wiring._subWiringsOwnerId = _Uize.getGuid ());
						}
					}
				);
				/*?
					Static Methods
						Uize.Node.wire
							Wires the specified handler function to the specified event, or the specified handlers to the specified events, of the specified node or `node blob`.

							SYNTAX
							........................................................
							Uize.Node.wire (nodeBLOB,eventNameSTR,eventHandlerFUNC);
							........................................................

							Different browsers provide different ways of registering event handlers for nodes. This method acts as an abstraction so you can manage event handlers in a standard way in your code.

							VARIATION 1
							.....................................................
							Uize.Node.wire (nodeBLOB,eventNamesToHandlersMapOBJ);
							.....................................................

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
							...................................................................
							Uize.Node.wire (
								'infoLink',
								{
									mouseover:
										function () {Uize.Node.display ('infoLinkPreview')},
									mouseout:
										function () {Uize.Node.display ('infoLinkPreview',false)},
									click:
										function () {Uize.Node.display ('info')}
								}
							);
							...................................................................

							VARIATION 2
							...................................................................
							Uize.Node.wire (nodeBLOB,eventNameSTR,eventHandlerFUNC,ownerIdSTR);
							Uize.Node.wire (nodeBLOB,eventNamesToHandlersMapOBJ,ownerIdSTR);
							...................................................................

							When the optional =ownerIdSTR= parameter is specified, then the wired node events will be associated to the specified owner, thus allowing easy unwiring of all wired node events of a specific owner using the =Uize.Node.unwireEventsByOwnerId= or =Uize.Node.unwire= static methods. This ownership mechanism is primarily intended for the implementation of the =Uize.Widget= class, but may also be useful when coding less formal mappings of interaction logic to sets of DOM nodes.

							Window Events
								The =Uize.Node.wire= method supports wiring handlers for events of the =window= object.

								Handlers can be wired for the =focus=, =blur=, =load=, =beforeunload=, =unload=, =resize=, and =scroll= events.

								EXAMPLE 1
								.........................................
								Uize.Node.wire (
									window,
									'load',
									function () {
										// do something when document loads
									}
								);
								.........................................

								EXAMPLE 2
								..............................................................
								Uize.Node.wire (
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
							- see also the companion =Uize.Node.unwire= static method
				*/
			};

		/*** Public Static Properties ***/
			_package.ieMajorVersion = _ieMajorVersion;
				/*?
					Static Properties
						Uize.Node.ieMajorVersion
							A number, indicating the major version of the Microsoft Internet Explorer browser being used, or the value =0= if the brower is not Internet Explorer.

							NOTES
							- see the related =Uize.Node.isIe= static property
							- see also the =Uize.Node.isSafari= and =Uize.Node.isMozilla= static properties
				*/

			_package.isIe = _isIe;
				/*?
					Static Properties
						Uize.Node.isIe
							A boolean, indicating whether or not the browser is a version of Microsoft Internet Explorer.

							NOTES
							- see the related =Uize.Node.ieMajorVersion= static property
							- see also the =Uize.Node.isSafari= and =Uize.Node.isMozilla= static properties
				*/

			_package.isSafari = _isSafari;
				/*?
					Static Properties
						Uize.Node.isSafari
							A boolean, indicating whether or not the browser is a version of Apple Safari.

							NOTES
							- see also the =Uize.Node.isIe= and =Uize.Node.isMozilla= static properties
				*/

			_package.isMozilla = _isMozilla;
				/*?
					Static Properties
						Uize.Node.isMozilla
							A boolean, indicating whether or not the browser is a version of Mozilla Firefox.

							NOTES
							- see also the =Uize.Node.isIe= and =Uize.Node.isSafari= static properties
				*/

		/*** Initialization ***/
			if (_isBrowser) {
				/*** wire up document mousemove to keep track of mouse position ***/
					_package.wire (document.documentElement,'mousemove',_captureMousePos);

				/*** wire up window events to fire events on window event vehicle ***/
					var
						_windowEventVehicle = Uize.Class (),
						_documentLoadedTimeout = setTimeout (function () {_windowEventVehicle.fire ('load')},15000)
					;
					_Uize.forEach (
						['focus','blur','load','beforeunload','unload','resize','scroll'],
						function (_windowEventName) {
							var
								_windowEventPropertyName = 'on' + _windowEventName,
								_oldWindowEventHandler = window [_windowEventPropertyName] || _Uize_returnFalse
							;
							window [_windowEventPropertyName] = function (_event) {
								_windowEventName == 'load' && clearTimeout (_documentLoadedTimeout);
								_oldWindowEventHandler.call (window,_event || (_event = window.event));
								_windowEventVehicle.fire ({name:_windowEventName,windowEvent:_event});
							};
						}
					);
			}

		/*** Deprecated Features ***/
			_package.returnFalse = _Uize_returnFalse;
				/*?
					Deprecated Features
						Uize.returnFalse
							.
				*/

			_package.returnTrue = _Uize.returnTrue;
				/*?
					Deprecated Features
						Uize.returnTrue
							.
				*/

		return _package;
	}
});

