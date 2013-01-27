/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.HoverFader Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2008-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 2
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Widget.HoverFader= class wires up a set of nodes with a hover fader effect, allowing creation of menus with a wide variety of complex effects.

		*DEVELOPERS:* `Chris van Rensburg`

		All in the Set
			The entire interface for the =Uize.Widget.HoverFader= class is exposed through its state properties.

			There are no special methods for this class. All methods and other properties are inherited from the =Uize.Widget= base class. All that one does in order to utilize this widget is to instantiate it with the desired settings.

		Fading CSS Style Properties
			The =Uize.Widget.HoverFader= class is flexible enough to enable a healthy array of CSS style property fade effects.

			Many of the CSS style properties can be faded using this class, including...

			- color style properties: =color=, =background=, =backgroundColor=, =borderColor=, =borderTopColor=, =borderRightColor=, =borderBottomColor=, =borderLeftColor=

			- position style properties: =top=, =right=, =bottom=, =left=, =backgroundPosition=

			- padding and margin style properties: =padding=, =paddingTop=, =paddingRight=, =paddingBottom=, =paddingLeft=, =margin=, =marginTop=, =marginRight=, =marginBottom=, =marginLeft=

			- dimension style properties: =width=, =height=, =maxWidth=, =maxHeigh=, =borderWidth=, =borderTopWidth=, =borderRightWidth=, =borderBottomWidth=, =borderLeftWidth=

			- font style properties: =fontSize=, =letterSpacing=, =wordSpacing=, =lineHeight=, =textIndent=

			NOTES
			- values for color style properties can be specified in single digit, three digit, or six digit hex RGB format - with or without the "#" (hash / pound sign) prefix
			- values for position and dimension style properties can be specified as strings with the "px" suffix (eg. ='100px'=) or simply as numbers (eg. =100=)

			Configurable fade properties let you control the rate of the fade-in independently of the rate of the fade-out, and any other state properties of the =Uize.Fade= class (such as =curve=) can be specified for both the fade-in and fade-out.

		Any Nodes
			The nodes that you wire up with this widget can be of any type: links, divs, spans, etc.

			Each instance of the =Uize.Widget.HoverFader= class manages the hover fade effect for a set of nodes. The class doesn't much care what the relationship between the nodes is. They can be clumped together in the layout in the form of a set of menu links, or they can be inline links interspersed throughout a paragraph, or just plain old anywhere. To supply the class with your nodes, you can use any means for gathering those nodes. One approach would be to use the =Uize.Node.find= static method to find nodes that match given criteria - such as class name, or tag type, or a combination thereof.

		Progressive Enhancement
			The =Uize.Widget.HoverFader= widget class falls into the category of [[http://en.wikipedia.org/wiki/Progressive_enhancement][Progressive Enhancement]] (or "unobtrusive JavaScript") widgets.

			HTML that is enhanced with this widget will still function if the widget fails to wire, some library module fails to load, or JavaScript is disabled. The widget instance becomes essentially a vehicle for storing the effect configuration for the group of nodes that it manages, and doesn't present its own UI. Using the widget architecture also allows the behavior to be unwired using the =unwireUi= instance method.

		An Example
			The example below demonstrates how a set of menu links could be wired with a hover color fade effect.

			EXAMPLE
			..........................................................................
			page.addChild (
				'menuHoverFader',
				Uize.Widget.HoverFader,
				{
					nodes:Uize.Node.find ({root:'menu',className:/\bmenuLink\b/}),
					defaultStyle:{color:'bbb',backgroundColor:'000',borderColor:'555'},
					hoverStyle:{color:'fff',backgroundColor:'77a',borderColor:'000'},
					fadeIn:{duration:500,curve:Uize.Fade.celeration (0,1)},
					fadeOut:{duration:750,curve:Uize.Fade.celeration (1,0)}
				}
			);
			..........................................................................

			In the above example, the =Uize.Widget.HoverFader= instance is being added as a child widget to a page widget instance, so the effect will be wired up when the page widget instance is wired. The value for the =nodes= state property specifies the nodes that should be wired up with the effect. The nodes being supplied in this case are obtained through a call to the =Uize.Node.find= static method. Based on the options specified in the call, the =Uize.Node.find= method will find all nodes with a class name of "menuLink" that are in a node tree with a node of the id "menu" at its root.

			The =defaultStyle= state property specifies the color style property values for the default state of the nodes (ie. when not mousing over them), in this case light gray text on a black background with a dark gray border. The =hoverStyle= state property specifies the color style property values for the hover state of the nodes (ie. when mousing over them), in this case white text on a pastel blue background with a black border.

			The =fadeIn= state property specifies properties for the fade process that is used to fade the node that is currently being moused over from the =defaultStyle= styling to the =hoverStyle= styling, in this case with a duration of =500= milliseconds and accelerating through the entire fade. The =fadeOut= state property specifies properties for the fade process that is used to fade the node that is currently being moused out of from the =hoverStyle= styling back to the =defaultStyle= styling, in this case with a duration of =750= milliseconds and accelerating through the entire fade. A greater duration for the fade-out will result in a lingering trail, and the acceleration will accentuate this quality.
*/

Uize.module ({
	name:'Uize.Widget.HoverFader',
	required:[
		'Uize.Fx',
		'Uize.Fade.xFactory',
		'Uize.Node'
	],
	builder:function (_superclass) {
		'use strict';

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (),
				_classPrototype = _class.prototype
			;

		/*** Private Instance Methods ***/
			_classPrototype._handleNodeMouseEvent = function (_node,_isOver,_fadeProperties) {
				_isOver != (_fadeProperties.reverse || false)
					? Uize.Fx.fadeStyle (_node,this._defaultStyle,this._hoverStyle,0,_fadeProperties)
					: Uize.Fx.fadeStyle (_node,this._hoverStyle,this._defaultStyle,0,_fadeProperties)
				;
			};

			_classPrototype._mouseoverNode = function (_node) {
				this._handleNodeMouseEvent (_node,true,this._resolvedFadeIn);
			};

			_classPrototype._mouseoutNode = function (_node) {
				this._handleNodeMouseEvent (_node,false,this._resolvedFadeOut);
			};

		/*** Public Instance Methods ***/
			_classPrototype.tickle = function (_fadeProperties) {
				var _this = this;
				if (_this.isWired) {
					var
						_nodes = _this._nodes,
						_nodesLengthMinus1 = _nodes.length - 1,
						_lastNodeNo
					;
					Uize.Fade.fade (
						function (_nodeNo) {
							if (_lastNodeNo == null)
								_lastNodeNo = _nodeNo - 1
							;
							var _direction = _nodeNo > _lastNodeNo ? 1 : -1;
							while (_lastNodeNo != _nodeNo)
								_this._mouseoutNode (_nodes [_lastNodeNo += _direction])
							;
						},
						0,
						_nodesLengthMinus1,
						0,
						_fadeProperties == null || typeof _fadeProperties != 'object'
							? {quantization:1,duration:_nodesLengthMinus1 * (_fadeProperties == null ? 100 : _fadeProperties)}
							: Uize.copyInto ({quantization:1,duration:750},_fadeProperties)
					);
				}
				/*?
					Instance Methods
						tickle
							Lets you initiate a "tickling" of the =nodes= of the instance, emulating the effect of the user moving their mouse across the nodes.

							SYNTAX
							................................
							myInstance.tickle (intervalINT);
							................................

							The =intervalINT= parameter lets you specify an interval, measured in milliseconds, between triggering of the fade-outs for the different =nodes= of the instance.

							VARIATION 1
							.....................
							myInstance.tickle ();
							.....................

							When no =intervalINT= parameter is specified, then its value will be defaulted to =100=.

							VARIATION 2
							......................................
							myInstance.tickle (fadePropertiesOBJ);
							......................................

							When the =fadePropertiesOBJ= parameter is specified in place of the =intervalINT= parameter, then an object containing fade properties (ie. state properties of the =Uize.Fade= class) can be specified to configure the fade that drives the tickling of the =nodes=.

							Among other things, this allows one to specify a =curve= property for the fade, so that the timing of the triggering of the fade-outs for the different =nodes= of the instance is not uniform. In addition, one can use the =reverse= fade property to control the order in which the tickling occurs. Specifying the value =true= for the =reverse= fade property will cause the tickling to start with the last node and end at the first node.

							When using this parameter, it is not possible to specify an interval between triggering the different nodes. Instead, one specifies the duration of the overal tickling process in the =duration= fade property. Because a non-linear curve can be specified, a single interval value is not meaningful, anyway.

							EXAMPLE 1
							......................................
							myHoverFader.tickle ({duration:1000});
							......................................

							In the above example, the =nodes= of the instance =myHoverFader= are being tickled over a period of 1000 milliseconds (1 second). Specifying the =fadePropertiesOBJ= parameter in place of the =intervalINT= parameter lets you control the overal duration of the tickling process with the =duration= fade property. The number of =nodes= can change, but the overal duration of the tickling will remain the same. By contrast, the overal duration would change as the number of =nodes= changes when using the =intervalINT= paramter.

							EXAMPLE 2
							.................................................................................
							myHoverFader.tickle ({duration:1000,reverse:true,curve:Uize.Curve.resolve (-3)});
							.................................................................................

							In the above example, the =nodes= of the instance =myHoverFader= are being tickled over a period of 1000 milliseconds (1 second), starting from the last node and ending at the first node, and starting out slowly and accelerating towards the end (the expression =Uize.Curve.resolve (-3)= creates a cubic ease-in curve function).
				*/
			};

			_classPrototype.wireUi = function () {
				var
					_this = this,
					_nodes = _this._nodes
				;
				if (!_this.isWired && _nodes) {
					_this.wireNode (
						_this._nodes = Uize.Node.find (_nodes),
						{
							mouseover:function () {_this._mouseoverNode (this)},
							mouseout:function () {_this._mouseoutNode (this)}
						}
					);

					_superclass.prototype.wireUi.call (_this);
				}
			};

		/*** State Properties ***/
			function _updateResolvedFadeInFadeOutProperties () {
				var _fadeInOut = this._fadeInOut;
				this._resolvedFadeIn = _fadeInOut ? Uize.copyInto ({},_fadeInOut,this._fadeIn) : this._fadeIn;
				this._resolvedFadeOut = _fadeInOut
					? Uize.copyInto ({},_fadeInOut,{reverse:!_fadeInOut.reverse},this._fadeOut)
					: this._fadeOut
				;
			}
			_class.stateProperties ({
				_defaultStyle:{
					name:'defaultStyle',
					value:{color:'fff',backgroundColor:'000'}
					/*?
						State Properties
							defaultStyle
								An object, whose properties specify the values for CSS style properties at the start of the hover fade-in (and also the end of the hover fade-out).

								EXAMPLE VALUE
								.......................................
								{
									width:'110px',
									borderLeftWidth:'1px',
									color:'bbb',           // light gray
									backgroundColor:'000', // black
									borderColor:'555'      // dark gray
								}
								.......................................

								The =defaultStyle= object may contain values for any of the supported CSS style properties (see the section `Fading CSS Style Properties`). The structure of the object should match the structure of the companion =hoverStyle= state property's value, or the effect will not work correctly. In other words, if the =defaultStyle= object contains a value for =borderColor=, then the =hoverStyle= object must also contain a value for this style property.

								For a more complete example of how this state property is used in conjunction with other state properties, consult the section `An Example`.

								NOTES
								- for best effect, style property values specified in this property should match the initial style property values for the nodes (as determined by stylesheet rules for your page)
								- see the companion =hoverStyle= state property
								- the initial value is ={color:'fff',backgroundColor:'000'}=
					*/
				},
				_fadeIn:{
					name:'fadeIn',
					onChange:_updateResolvedFadeInFadeOutProperties,
					value:{duration:250}
					/*?
						State Properties
							fadeIn
								An object, specifying fade properties for the fade-in phase (ie. when mousing over a node) of the hover fade effect.

								If the default fade-in duration does not suit your needs, you should at least use this property to configure a suitable duration. Any valid state properties of the =Uize.Fade= class (such as =curve=) can be specified in the =fadeIn= object, and these values will be applied when the fade-in starts.

								EXAMPLE VALUE
								...................................
								{
									duration:500,
									curve:Uize.Fade.celeration (1,0)
								}
								...................................

								NOTES
								- see the companion =fadeInOut= and =fadeOut= state properties
								- the initial value is ={duration:250}=
					*/
				},
				_fadeInOut:{
					name:'fadeInOut',
					onChange:_updateResolvedFadeInFadeOutProperties
					/*?
						State Properties
							fadeInOut
								An object, specifying fade properties that are common to both the fade-in phase (ie. when mousing over a node) and the fade-out phase (ie. when mousing out of a node) of the hover fade effect.

								EXAMPLE
								...................................................
								page.addChild (
									'menuHoverFader',
									Uize.Widget.HoverFader,
									{
										defaultStyle:{color:'b',backgroundColor:'0'},
										hoverStyle:{color:'0',backgroundColor:'f'},
										fadeInOut:{
											curve:{
												backgroundColor:[
													Uize.Curve.Mod.band (1,.5,0),
													Uize.Curve.Mod.band (1,.5,.5),
													Uize.Curve.Mod.band (1,.5,1)
												]
											}
										},
										fadeIn:{duration:500},
										fadeOut:{duration:1250}
									}
								);
								...................................................

								In the above example, a =Uize.Widget.HoverFader= instance is being added to the page widget as a child widget named =menuHoverFader=. The =fadeInOut= state property is being used to specify fade properties that are common to both the fade-in and fade-out phases of the hover fade effect.

								These settings achieve a "hot" fade from black to white (and vice versa), where the background color transitions through shades of reds and yellows. This is accomplished by specifying different curve functions for the red, green, and blue components of the color tuple for the =backgroundColor= CSS style property. Now, because we want the fade-in to be faster than the fade-out, we are using the =fadeIn= and =fadeOut= state properties as well to provide the fade properties that are different for the two phases - in this case, the =duration= fade property values.

								Common Duration
									If the duration of the fade-in is to be the same as the duration of the fade-out, then this common duration can be specified in the =fadeInOut= property, rather than redundantly in both the =fadeIn= and =fadeOut= properties.

								Special Handling of reverse Fade Property
									The =reverse= fade property has special handling in the context of this widget class.

									Normally, when specifying the value =true= for the =reverse= fade property, the entire fade will be reversed. However, the =Uize.Widget.HoverFader= class guarantees that at the end of the fade-in phase the style settings for a node will be those specified by the =hoverStyle= state property. Similarly, at the end of the fade-out phase the style settings for a node will be those specified by the =defaultStyle= state property.

									Therefore, when specifying the value =true= for the =reverse= fade property, the =Uize.Widget.HoverFader= class swaps the values that it would normally use as the start and end values of the style fade for a node. This has the effect of only reversing the transition effect, but not the start and end style. This becomes more pronounced - and more compelling - when compound values are specified for the =curve= fade property, where reversing the effect of the curves produces interesting results.

									Now, when specifying a value for the =fadeInOut= state property, the value of the =reverse= fade property for the fade-out is automatically defaulted to being the logical not of the value specified for this property in the =fadeInOut= object. This has the effect of making the fade-out a mirror of the fade-in - especially useful with settings that accomplish complex color transitions, where this behavior guarantees the same color transition effect for both phases of the effect. In order to override this automatic defaulting behavior, you can always explicitly specify values for the =reverse= fade property in either - or both - of the =fadeIn= and =fadeOut= objects.

								NOTES
								- see the companion =fadeIn= and =fadeOut= state properties
								- the initial value is =undefined=
					*/
				},
				_fadeOut:{
					name:'fadeOut',
					onChange:_updateResolvedFadeInFadeOutProperties,
					value:{duration:350}
					/*?
						State Properties
							fadeOut
								An object, specifying fade properties for the fade-out phase (ie. when mousing out of a node) of the hover fade effect.

								If the default fade-out duration does not suit your needs, you should at least use this property to configure a suitable duration. Any valid state properties of the =Uize.Fade= class (such as =curve=) can be specified in the =fadeOut= object, and these values will be applied when the fade-out starts.

								EXAMPLE VALUE
								.....................................
								{
									duration:1000,
									curve:Uize.Fade.celeration (.5,.5)
								}
								.....................................

								NOTES
								- see the companion =fadeIn= and =fadeInOut= state properties
								- the initial value is ={duration:350}=
					*/
				},
				_hoverStyle:{
					name:'hoverStyle',
					value:{color:'000',backgroundColor:'fff'}
					/*?
						State Properties
							hoverStyle
								An object, whose properties specify the values for CSS style properties at the end of the hover fade-in (and also the start of the hover fade-out).

								EXAMPLE VALUE
								........................................
								{
									width:'100px',
									borderLeftWidth:'11px',
									color:'fff',           // white
									backgroundColor:'77a', // pastel blue
									borderColor:'000'      // black
								}
								........................................

								The =hoverStyle= object may contain values for any of the supported CSS style properties (see the section `Fading CSS Style Properties`). The structure of the object should match the structure of the companion =defaultStyle= state property's value, or the effect will not work correctly. In other words, if the =hoverStyle= object contains a value for =borderColor=, then the =defaultStyle= object must also contain a value for this style property.

								For a more complete example of how this state property is used in conjunction with other state properties, consult the section `An Example`.

								NOTES
								- for best effect, style property values specified in this property should match the hover style property values for the nodes (as determined by stylesheet rules for your page)
								- see the companion =defaultStyle= state property
								- the initial value is ={color:'000',backgroundColor:'fff'}=
					*/
				},
				_nodes:'nodes'
				/*?
					State Properties
						nodes
							An array or collection of nodes or a find expression object, specifying the nodes that should be wired up with the hover fade effect.

							The value of this property can be...

							- a *string*, being the id of a single node to wire up
							- a *node reference* to a single node to wire up
							- an *array* of nodes to wire up, where each element can be a string, or node reference
							- an *object*, being a find expression (see the =Uize.Node.find= static method)

							EXAMPLE 1
							..........................................
							var hoverFader = Uize.Widget.HoverFader ({
								nodes:['link1Id','link2Id','link3Id']
							});
							..........................................

							EXAMPLE 2
							............................................
							var hoverFader = Uize.Widget.HoverFader ({
								nodes:document.getElementsByTagName ('A')
							});
							............................................

							EXAMPLE 3
							................................................
							var hoverFader = Uize.Widget.HoverFader ({
								nodes:{tagName:'A',className:'hoverFadeLink'}
							});
							................................................

							Each instance of the =Uize.Widget.HoverFader= class manages a set of nodes. For more information on the types of nodes that can be wired up and how they can be obtained, consult the section `Any Nodes`.

							NOTES
							- the initial value is =undefined=
				*/
			});

		return _class;
	}
});

