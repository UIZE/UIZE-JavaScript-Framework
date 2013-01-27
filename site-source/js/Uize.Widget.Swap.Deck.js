/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Swap.Deck Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2009-2013 UIZE
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
		The =Uize.Widget.Swap.Deck= class manages the displayed state of nodes in a deck of nodes, swapping from one to another using an animated swap effect.

		*DEVELOPERS:* `Chris van Rensburg`

		As a subclass of =Uize.Widget.Swap=, this class employs the same underlying swap transition effect mechanism. Consequently, effects settings defined in the =Uize.Widget.Swap.xPresets= extension module, and that can be used with the =Uize.Widget.Swap.Html=, =Uize.Widget.Swap.Image=, and other subclasses of the =Uize.Widget.Swap= base class, can also be used with this class. The animated swap effect can be configured by state properties of the class to achieve a wide variety of different transition effects.

		SEO-friendly
			The =Uize.Widget.Swap.Deck= module is particularly useful for slideshow type content that has to be SEO-friendly.

			A key difference between the =Uize.Widget.Swap.Deck= class and the =Uize.Widget.Swap.Html= and =Uize.Widget.Swap.Image= classes is that the latter two classes generate HTML for the current item based upon the current value for the widget. The dynamic generation approach is great for data sets with dozens or more items, since the HTML required for all those items doesn't have to weigh down the initial loading of the document. The downside of the dynamic generation approach is that the content for all the items is not "seen" by the search engines. For some applications, this may not matter, but for others it may be important that the HTML for all items be in the document sent to the browser.

			The =Uize.Widget.Swap.Deck= expects the HTML for all items to be already in the document, and merely manages the displayed state for the current item and deals with performing the transition effect between the current item and displaying the next item.

		One Piece in a Puzzle
			The =Uize.Widget.Swap.Deck= widget class is just one piece in a puzzle, and is designed to be incorporated as a viewer component in any other larger interface - in conjuction with other widgets or application code.

			For example, an instance of the =Uize.Widget.Swap.Deck= class could be hooked up as the main display portion of a slideshow interface that uses an instance of the =Uize.Widget.SlideShow= class as the controller. The =Uize.Widget.Swap.Deck= class, therefore, intentionally does not implement any navigation interface, since it is designed to be used in a mix and match approach with other widgets.

		The HTML
			Visibility vs. Display
				For best results, the nodes for items in the deck should not initially be visible.

				While this can be accomplished using CSS by setting the =display= style property to =none=, and the =Uize.Widget.Swap.Deck= class will do the correct thing for displaying the items in the deck, some browsers are optimized to not load images for nodes that are =display:none=. By setting =visibility= to =hidden= instead, you will also accomplish hiding of the item nodes, but while having the browser pre-cache any images in the item nodes. Using the =visibility:hidden= approach will produce smoother results, since images will be immediately ready for a new item node that is to be revealed.

			Stack Using CSS
				The nodes for the items of the deck should be "stacked" on top of one another by using CSS to set their =position= to =absolute= within the root node of the widget.

			An Example
				Let's look at an example of what the CSS, HTML, and JavaScript might look like for one case of creating a =Uize.Widget.Swap.Deck= instance.

				EXAMPLE CSS
				.....................
				.deck {
					position:relative;
					width:400px;
					height:300px;
				}
				.deckItem {
					display:block;
					position:absolute;
					visibility:hidden;
					width:100%;
					height:100%;
				}
				.....................

				The =deck= class is used for the root node of the widget and sets the positioning to =relative= so that the deck items can be set to =absolute= positioning and stacked on top of one another. The =deckItem= class sets the positioning of the deck item nodes to =absolute= and sets their =visibility= to =hidden= so that they are not initially seen. You can name the CSS classes for your deck nodes as you like, they can be in an inline =style= tag or an external style sheet file, or you can use inline CSS inside the deck HTML itself.

				EXAMPLE HTML
				..............................................
				<div id="page_swap" class="deck">
					<div id="page_swap-item0" class="deckItem">
						<!-- stuff inside here for item 0 -->
					</div>
					<div id="page_swap-item1" class="deckItem">
						<!-- stuff inside here for item 1 -->
					</div>
					<div id="page_swap-item2" class="deckItem">
						<!-- stuff inside here for item 2 -->
					</div>
					<div id="page_swap-item3" class="deckItem">
						<!-- stuff inside here for item 3 -->
					</div>
					<div id="page_swap-item4" class="deckItem">
						<!-- stuff inside here for item 4 -->
					</div>
				</div>
				..............................................

				The deck item nodes are contained directly inside the root node of the widget. In this case, the widget name is "swap", and its a child widget of the page widget. Notice the =item[itemNo]= naming scheme for the deck item implied nodes.

				EXAMPLE WIDGET DECLARATION
				..........................................
				<script type="text/javascript">
					$page_swap = {
						widgetClass:'Uize.Widget.Swap.Deck',
						totalItems:5,
						itemNo:0,
						crossFade:false,
						viewSeedSizeX:1,
						viewSeedSizeY:0,
						viewSeedAlignX:0,
						viewSeedAlignY:.5,
						dissolve:false,
						viewContentAlignX:'none',
						viewContentAlignY:'none'
					};
				</script>
				..........................................

				If you didn't want to add the =Uize.Widget.Swap.Deck= instance to the page widget using the =addChild= method somewhere inside your page widget setup code, then you could also declare the widget using the declarative syntax inside a =script= block that is close to the widget's HTML markup. This may even be part of the output from the same server component / control that generated the HTML markup. Notice how the name of the global $ variable maps to the =idPrefix= of the widget and, therefore, the =id= of the widget's root node.
*/

Uize.module ({
	name:'Uize.Widget.Swap.Deck',
	builder:function (_superclass) {
		'use strict';

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					function () {
						var _this = this;
						/*** Private Instance Properties ***/
							_this._currentItemNo = -1;
					}
				),
				_classPrototype = _class.prototype
			;

		/*** Private Instance Methods ***/
			_classPrototype._getItemNodeName = function (_itemNo) {
				return _itemNo > -1 ? ('item' + _itemNo) : null;
				/*?
					Implied Nodes
						item[itemNo]
							One of the several implied nodes that comprise the items of the deck.

							There is an implied node name for each item in the deck, named according to the naming scheme =item[itemNo]=, where =[itemNo]= represents the number for an item. For example, an instance whose =totalItems= state property is set to =5= will have the five implied nodes named =item0=, =item1=, =item2=, =item3=, and =item4=. When wiring up an instance of the =Uize.Widget.Swap.Deck= class, be sure that HTML exists in the document that supplies a corresponding implied node for each item in the deck.
				*/
			};

			_classPrototype._updateUiDeck = function () {
				var _this = this;
				if (_this.isWired) {
					_this.showNode (_this._itemNodeNames,false);
					_this.displayNode (_this._itemNodeNames);
				}
			};

			_classPrototype._updateUiItemNo = function () {
				var _this = this;
				if (_this.isWired) {
					var
						_currentItem = _this.getNode (_this._getItemNodeName (_this._currentItemNo)),
						_nextItem = _this.getNode (_this._getItemNodeName (_this._itemNo))
					;
					_this._updateUiDeck ();
					_this.prepareForNextItem (_currentItem,_nextItem);
					_this.setCurrentItem (_nextItem);
					_this.showNode ([_currentItem,_nextItem]);
					_this._currentItemNo = _this._itemNo;
				}
			};

		/*** Public Instance Methods ***/
			_classPrototype.updateUi = function () {
				this._updateUiDeck ();
				this._updateUiItemNo ();
			};

		/*** State Properties ***/
			_class.stateProperties ({
				_itemNo:{
					name:'itemNo|value',
					onChange:_classPrototype._updateUiItemNo,
					value:-1
					/*?
						State Properties
							itemNo
								An integer, representing the number of the currently displayed item.

								When the value of =itemNo= is changed, a swap transition effect will be initiated to transition from the previously displayed item to the newly selected item.

								NOTES
								- this property can also be accessed through the alias =value=
								- the initial value is =-1=

							value
								An alias to the =itemNo= state property, establishing the =itemNo= property as the public Value Interface for this class.
					*/
				},
				_totalItems:{
					name:'totalItems',
					onChange:function () {
						var _this = this;
						_this._itemNodeNames = Uize.map (
							_this._totalItems,
							function (_junkValue,_itemNo) {return _this._getItemNodeName (_itemNo)}
						);
					},
					value:0
					/*?
						State Properties
							totalItems
								An integer, specifying the total number of items in the deck.

								NOTES
								- the initial value is =0=
					*/
				}
			});

		return _class;
	}
});

