/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Node Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2004-2014 UIZE
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
	required:[
		'Uize.Dom.Basics',
		'Uize.Dom.Pos',
		'Uize.Dom.Text'
	],
	builder:function () {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_undefined,
				_Uize = Uize,
				_Uize_Dom = _Uize.Dom,
				_Uize_Dom_Basics = _Uize_Dom.Basics,

			/*** variables for showClickable method ***/
				_useHandForPointerCursor = _Uize_Dom_Basics.isIe && _Uize_Dom_Basics.ieMajorVersion < 9
		;

		return _Uize.package (
			_Uize.copyInto (
				{
					showClickable:function (_nodeBlob,_clickable) {
						_Uize_Dom_Basics.setStyle (
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
					}
				},
				_Uize_Dom_Basics,
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

					/*?
						Static Methods
							Uize.Node.joinIdPrefixAndNodeId
								.
					*/

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

					/*?
						Static Properties
							Uize.Node.ieMajorVersion
								A number, indicating the major version of the Microsoft Internet Explorer browser being used, or the value =0= if the brower is not Internet Explorer.

								NOTES
								- see the related =Uize.Node.isIe= static property
								- see also the =Uize.Node.isSafari= and =Uize.Node.isMozilla= static properties
					*/

					/*?
						Static Properties
							Uize.Node.isIe
								A boolean, indicating whether or not the browser is a version of Microsoft Internet Explorer.

								NOTES
								- see the related =Uize.Node.ieMajorVersion= static property
								- see also the =Uize.Node.isSafari= and =Uize.Node.isMozilla= static properties
					*/

					/*?
						Static Properties
							Uize.Node.isSafari
								A boolean, indicating whether or not the browser is a version of Apple Safari.

								NOTES
								- see also the =Uize.Node.isIe= and =Uize.Node.isMozilla= static properties
					*/

					/*?
						Static Properties
							Uize.Node.isMozilla
								A boolean, indicating whether or not the browser is a version of Mozilla Firefox.

								NOTES
								- see also the =Uize.Node.isIe= and =Uize.Node.isSafari= static properties
					*/

				_Uize_Dom.Pos,
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

					/*?
						Static Methods
							Uize.Node.getDocumentScrollElement
								A utility function that returns the DOM node on which you can scroll the document.

								SYNTAX
								......................................
								Uize.Node.getDocumentScrollElement ();
								......................................

								This method abstracts the difference between WebKit browsers (Safari, Chrome, etc.) and other browsers as to which DOM node is the one that allows changing the scrolling position of the document.

								EXAMPLE
								......................................................................................
								Uize.Node.getDocumentScrollElement ().scrollTop = 0;  // scroll to the top of the page
								......................................................................................
					*/

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

				_Uize_Dom.Text
			)
		);
	}
});

