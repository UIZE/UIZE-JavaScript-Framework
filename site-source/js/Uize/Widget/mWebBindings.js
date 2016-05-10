/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.mWebBindings Mixin
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Mixin
	importance: 3
	codeCompleteness: 100
	docCompleteness: 80
*/

/*?
	Introduction
		The =Uize.Widget.mWebBindings= module is an aggregator mixin module that allows widget classes to more easily mix in =Uize.Widget.mWeb= and other widget binding modules with additional helpful functionality.

		*DEVELOPERS:* `Ben Ilegbodu`
*/

Uize.module ({
	name:'Uize.Widget.mWebBindings',
	required:[
		'Uize.Widget.mWeb',
		'Uize.Widget.mHtmlBindings',
		'Uize.Widget.mCssBindings',
		'Uize.Widget.mEventBindings',
		'Uize.Web'
	],
	builder:function () {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_Uize_Widget = Uize.Widget
		;

		return function(_class) {
			_class.declare({
				mixins:[
					_Uize_Widget.mWeb,
					_Uize_Widget.mHtmlBindings,
					_Uize_Widget.mCssBindings,
					_Uize_Widget.mEventBindings
				],

				instanceMethods:{
					webSelect:function(_selector) {
						var m = this;
						return Uize.Web(
							(_selector || '').replace(
								/[\.|\#]\w+/g,
								function(_match) {
									var _firstChar = _match[0];
									return _firstChar
										+ m[
											_firstChar == '#' ? 'nodeId' : 'cssClass'
										](_match.substr(1))
									;
								}
							),
							m.getNode()
						);
						/*?
							Instance Methods
								webSelect
									Selects descendent DOM nodes within the `root node` matching the specified selector, returning a =Uize.Web= object that wraps the node(s).

									The selector is modified such that class selectors are appropriately prefixed with their =cssClassPrefix= and ID selectors are appropriately prefixed with their =idPrefix=.

									SYNTAX
									..................................................
									webOBJ = widgetOBJ.webSelect(selectorSTR);
									..................................................

									EXAMPLE MARKUP
									...........................................
									<ul id="page_mylist" class="MyList">
										<li id="page_myList-item0" class="MyList-item">Item 0</item>
										<li id="page_myList-item1" class="MyList-item">Item 1</item>
										<li id="page_myList-item2" class="MyList-item">Item 2</item>
										<li id="page_myList-item3" class="MyList-item">Item 3</item>
										<li id="page_myList-item4" class="MyList-item MyList-selected">Item 4</item>
										<li id="page_myList-item5" class="MyList-item">Item 5</item>
									</ul>
									...........................................

									EXAMPLE CODE
									.......
									var items = myList.webSelect('.item');
									.......

									The code above returns a =Uize.Web= object with the 6 list item DOM nodes. The specified selector is transformed from =".item"= to =".MyList-item"= using the =cssClass= method (from =Uize.Widget.mBindings=) and then searches within the `root node` for matching DOM nodes.

									EXAMPLE CODE 2
									.........................................
									var thirdItem = myList.webSelect('#item2');
									.........................................

									The code above returns a =Uize.Web= object with the DOM node that has an ID of ="page_myList-item2"=. The specified selector is transformed from ="#item2"= to ="#page_myList-item2"= using the =idPrefix= method (from =Uize.Widget=) and then searches within the `root node` for matching DOM nodes.

									An ID selector is equivalent to =myList.web('item2')=.

									EXAMPLE CODE 3
									...........................................
									var selectedItem = myList.webSelect('li.selected');
									...........................................

									The code above returns a =Uize.Web= object with the DOM node that has an ID of ="page_myList-item4"= because it is an &lt;li&gt; tag with a class of =".MyList-seelcted"=.

									NOTES
									- See related =cssClass= instance method of =Uize.Widget.mBindings=
									- See related =idPrefix= instance method of =Uize.Widget.
									- See also =Uize.Web= object
						*/
					}
				}
			});
		};
	}
});
