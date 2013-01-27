/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Node.Tree Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2003-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 2
	codeCompleteness: 100
	docCompleteness: 0
*/

/*?
	Introduction
		The =Uize.Node.Tree= package provides convenience methods for generating a tree data object by analyzing HTML on a page.

		*DEVELOPERS:* `Chris van Rensburg`

	In a Nutshell
		The =Uize.Node.Tree= module provides convenient ways to derive a `tree data object` from HTML on a page.

		Tree Data Object
			A tree data object is an array, where each element of the array is a `tree item`.

			Because a tree item may itself contain a child tree data object, specified by its =items= property, a tree data object can be used to represent an arbitrarily complex, hierarchical structure for information.

		Using a Tree Data Object
			A `tree data object` can be used in any number of ways, but is commonly used for building tree-based user interface elements such as contents lists, structured dropdown menus, etc.

			A number of widget class support data in the `tree data object` format, such as the =Uize.Widget.Tree.List=, =Uize.Widget.Tree.Menu=, and =Uize.Widget.Tree.Select= classes. Outside of widgets, tree data objects can be used to drive the generation of HTML, in build scripts or Web applications, using [[../explainers/javascript-templates.html][JavaScript Templates]]. To see tree data objects in action, see the [[../examples/tree-list.html][Tree List From JSON]] and [[../examples/tree-menu.html][Tree Menu From JSON]] examples.

		Tree Item
			A tree item is a single item in an array of items that make up a `tree data object`.

			Any tree item may contain a subtree, which is itself a `tree data object`, specified by the =items= property. A tree item has the following structure...

			ITEM STRUCTURE
			................................................................
			{
				title       : titleSTR,         // required
				link        : linkUrlSTR,       // optional
				description : descriptionSTR,   // optional
				items       : childItemsARRAY,  // optional
				expanded    : expandedBOOL      // optional, defaults to true
			}
			................................................................

			title
				A string, specifying the display title for the item.

			link
				An optional string, specifying the URL that the item should link to.

				For items that should execute JavaScript code, a link with the =javascript:= protocol can be used.

			description
				An optional string, specifying description text for the item.

			items
				An optional array, specifying the `tree data object` for a subtree, where each element in the array is an item.

				An empty array value for this property is equivalent to the values =null= or =undefined=, and indicates that the item does not have a subtree.

			expanded
				An optional boolean, specifying whether or not a subtree specified by the =items= property is expanded.

				When this property is omitted, its value is defaulted to =true=. Therefore, for a subtree to be collapsed, the =expanded= property must be explicitly set to =false=.

		Getting a Tree From a List Element
			To generate a `tree data object` from a hierarchical list defined by an HTML =ul= (unordered list) or =ol= (ordered list) tag, the =Uize.Node.Tree= module provides the =Uize.Node.Tree.getTreeFromList= static method.

			This method is able to scan through the structure and contents of a list element and build a data structure that reflects the structure of the list. All the method needs in order to work its magic is a reference to
			(or id for) either a list node or the immediate parent node of a list node. The method can handle unordered lists as well as ordered lists. From the list HTML that it analyzes, the method is able to build a tree data object where each item will have a =title= property, and may also have =link=, =description=, =items=, and =expanded= properties.

			An Example
				The following sample code blocks show the source HTML, JavaScript code, and output `tree data object` for the [[../examples/get-tree-from-list.html][Get Tree from List]] example.

				HTML
				..............................................................................................
				<ul id="page-list">
					<li>Dogs
						<ul>
							<li>Small Breeds
								<ul>
									<li>
										<a href="http://en.wikipedia.org/wiki/West_Highland_White_Terrier">
											West Highland White
										</a>
									</li>
									<li>
										<a href="http://en.wikipedia.org/wiki/Mexican_Hairless_Dog">
											Mexican Hairless
										</a>
									</li>
									<li>
										<a href="http://en.wikipedia.org/wiki/Chihuahua_%28dog%29">
											Miniature Chihuahua
										</a>
									</li>
									<li>
										<a href="http://en.wikipedia.org/wiki/Teacup_Poodle#Poodle_sizes">
											Teacup Poodle
										</a>
									</li>
								</ul>
							</li>
							<li>Large Breeds
								<ul>
									<li>
										<a href="http://en.wikipedia.org/wiki/Afghan_Hound">Afghan</a>
									</li>
									<li>
										<a href="http://en.wikipedia.org/wiki/Great_Dane">Great Dane</a>
									</li>
									<li>
										<a href="http://en.wikipedia.org/wiki/Irish_Wolfhound">Irish Wolfhound</a>
									</li>
									<li>
										<a href="http://en.wikipedia.org/wiki/St._Bernard_%28dog%29">St. Bernard</a>
									</li>
								</ul>
							</li>
						</ul>
					</li>
					<li>Cats
						<ul>
							<li><a href="http://en.wikipedia.org/wiki/Persian_%28cat%29">Persian</a></li>
							<li><a href="http://en.wikipedia.org/wiki/Siamese_%28cat%29">Siamese</a></li>
							<li><a href="http://en.wikipedia.org/wiki/Hairless_cat">Hairless</a></li>
						</ul>
					</li>
					<li>Other
						<ul>
							<li><a href="http://en.wikipedia.org/wiki/Bunny">Bunny</a></li>
							<li><a href="http://en.wikipedia.org/wiki/Hamster">Hamster</a></li>
							<li><a href="http://en.wikipedia.org/wiki/Mouse">Mouse</a></li>
							<li><a href="http://en.wikipedia.org/wiki/Rat">Rat</a></li>
						</ul>
					</li>
				</ul>
				..............................................................................................

				JAVASCRIPT
				.......................................................
				Uize.Node.Tree.getTreeFromList (page.getNode ('list'));
				.......................................................

				OUTPUT
				.................................................................................
				[
					{
						title:'Dogs',
						items:[
							{
								title:'Small Breeds',
								items:[
									{
										title:'West Highland White',
										link:'http://en.wikipedia.org/wiki/West_Highland_White_Terrier'
									},
									{
										title:'Mexican Hairless',
										link:'http://en.wikipedia.org/wiki/Mexican_Hairless_Dog'
									},
									{
										title:'Miniature Chihuahua',
										link:'http://en.wikipedia.org/wiki/Chihuahua_%28dog%29'
									},
									{
										title:'Teacup Poodle',
										link:'http://en.wikipedia.org/wiki/Teacup_Poodle#Poodle_sizes'
									}
								]
							},
							{
								title:'Large Breeds',
								items:[
									{
										title:'Afghan',
										link:'http://en.wikipedia.org/wiki/Afghan_Hound'
									},
									{
										title:'Great Dane',
										link:'http://en.wikipedia.org/wiki/Great_Dane'
									},
									{
										title:'Irish Wolfhound',
										link:'http://en.wikipedia.org/wiki/Irish_Wolfhound'
									},
									{
										title:'St. Bernard',
										link:'http://en.wikipedia.org/wiki/St._Bernard_%28dog%29'
									}
								]
							}
						]
					},
					{
						title:'Cats',
						items:[
							{
								title:'Persian',
								link:'http://en.wikipedia.org/wiki/Persian_%28cat%29'
							},
							{
								title:'Siamese',
								link:'http://en.wikipedia.org/wiki/Siamese_%28cat%29'
							},
							{
								title:'Hairless',
								link:'http://en.wikipedia.org/wiki/Hairless_cat'
							}
						]
					},
					{
						title:'Other',
						items:[
							{
								title:'Bunny',
								link:'http://en.wikipedia.org/wiki/Bunny'
							},
							{
								title:'Hamster',
								link:'http://en.wikipedia.org/wiki/Hamster'
							},
							{
								title:'Mouse',
								link:'http://en.wikipedia.org/wiki/Mouse'
							},
							{
								title:'Rat',
								link:'http://en.wikipedia.org/wiki/Rat'
							}
						]
					}
				]
				.................................................................................

			Deriving Item Property Values
				Values for item properties are derived in a number of different ways, depending on the property.

				Deriving the title Property's Value
					The value of the =title= item property is derived by getting the cumulative text contained inside an item node, without regard to HTML elements used in formatting the item node, and excluding the text contained inside nested lists.

					EXAMPLE
					..............................................
					<li><span>This is the item <b>title</b></span>
						<ul>
							<li>This is nested item 1</li>
							<li>This is nested item 2</li>
						</ul>
					</li>
					..............................................

					If the above HTML were the HTML for a `tree item`, then the value derived for the =title= property of the item would be "This is the item title". For one thing, the =span= and =b= tags would be stripped out, and only the unformatted / unmarked up text would be retained. And, secondly, the text contents of the nested =ul= tag would be ignored and would not contribute to the tree item's derived =title=.

				Deriving the link Property's Value
					The value of the =link= property is derived from the =href= property of an item's node, if this node is a link tag.

					EXAMPLE
					........................................................................
					<li><a href="http://www.uize.com"><b>HOME</b></span>
						<ul>
							<li><a href="http://www.uize.com/download.html">Download</a></li>
							<li><a href="http://www.uize.com/directory.html">Site Map</a></li>
						</ul>
					</li>
					........................................................................

					If the above HTML were the HTML for a `tree item`, then the value derived for the =link= property of the item would be "http://www.uize.com". It doesn't matter that there are multiple link tags in the HTML, since the two other link tags belong to a nested =ul= tag - only the first link tag will be used when deriving the value for the item's =link= property. Note that not all items need to be linked - for item nodes that are not link tags, the value of the =link= property will not be set and the =link= property will not be present in the `tree item`.

				Deriving the description Property's Value
					The value of the =description= property is derived from the "title" attribute of an item's node, if this node is a link tag.

					EXAMPLE
					......................................................................................
					<li><a href="http://www.uize.com" title="UIZE JavaScript Framework"><b>HOME</b></span>
						<ul>
							<li><a href="http://www.uize.com/download.html">Download</a></li>
							<li><a href="http://www.uize.com/directory.html">Site Map</a></li>
						</ul>
					</li>
					......................................................................................

					If the above HTML were the HTML for a `tree item`, then the value derived for the =description= property of the item would be "UIZE JavaScript Framework". It doesn't matter that there are multiple link tags in the HTML, since the two other link tags belong to a nested =ul= tag - only the first link tag will be used when deriving the value for the item's =description= property.

					Note that not all items need to be linked - for item nodes that are not link tags, the value of the =description= property will not be set and the =description= property will not be present in the `tree item`. Similarly, for item nodes that *are* link tags, but that do not have a "title" attribute specified, or that have an empty string specified for the "title" attribute, the =description= property will not be present in the `tree item`.

				Deriving the items Property's Value
					The value of the =items= property is derived from the first =ul= (unordered list) or =ol= (ordered list) tag encountered in an item's node.

					EXAMPLE
					......................................................................................
					<li><a href="http://www.uize.com" title="UIZE JavaScript Framework"><b>HOME</b></span>
						<ul>
							<li><a href="http://www.uize.com/download.html">Download</a></li>
							<li><a href="http://www.uize.com/directory.html">Site Map</a></li>
						</ul>
					</li>
					......................................................................................

					If the above HTML were the HTML for a `tree item`, then the value derived for the =items= property of the item would be an array with the following structure...

					...............................................
					[
						{
							title:'Download',
							link:'http://www.uize.com/download.html'
						},
						{
							title:'Site Map',
							link:'http://www.uize.com/directory.html'
						}
					]
					...............................................

					It doesn't matter that there is HTML content ahead of the nested =ul= tag - that content will be ignored when deriving the value for the =items= property, but it will be used when deriving values for the =title=, =link=, and =description= properties of the `tree item` object. Note that not every item needs to have a subtree - in most cases, the majority will not. For item nodes that do not contain nested list tags, the value of the =items= property will not be set and the =items= property will not be present in the `tree item`.

				Deriving the expanded Property's Value
					The value of the =expanded= property is derived from the value of the =display= CSS property of the first =ul= (unordered list) or =ol= (ordered list) tag encountered in an item's node.

					EXAMPLE
					......................................................................................
					<li><a href="http://www.uize.com" title="UIZE JavaScript Framework"><b>HOME</b></span>
						<ul style="display:none;">
							<li><a href="http://www.uize.com/download.html">Download</a></li>
							<li><a href="http://www.uize.com/directory.html">Site Map</a></li>
						</ul>
					</li>
					......................................................................................

					If the above HTML were the HTML for a `tree item`, then the value derived for the =expanded= property of the item would be =false=. The rule is simple: if the list tag that represents the items in the subtree for an item is set to =display:none=, either through inline CSS in a =style= attribute, or in a style rule in an external style sheet, then the value of the =expanded= property will be =false=. Note that not every item needs to have a subtree - in most cases, the majority will not. For item nodes that do not contain nested list tags, the =expanded= property will not be present in the `tree item`. Also, for any item that *does* have a subtree and where the subtree is expanded, the value of the =expanded= property will be =true= and the property will not be present in the `tree item`, since =true= is the default value for this property.

		Getting a Tree From a Page's Section Headings
			To generate a `tree data object` from the section headings contained inside a document, the =Uize.Node.Tree= module provides the =Uize.Node.Tree.getTreeFromPage= static method.

			This method is able to scan through all the nodes inside a document, building a data structure that reflects the structure of the document by analyzing the occurrence of different CSS classes for section headings at different depths of a document. All this method needs in order to work its magic is an array specifying the names of CSS classes that identify section headings at different depths (section heading nodes may be of any type, including =div=, =span=, =p=, etc.). From the document HTML that it analyzes, the method is able to build a tree data object where each item will have =title= and =link= properties, and may also have =description= and =items= properties.

			An Example
				The following sample code blocks show the source HTML, JavaScript code, and output `tree data object` for the [[../examples/get-tree-from-page.html][Get Tree from Page]] example.

				HTML
				..........................................................................................
				<div id="sect1" class="level1Header" title="All about renewable energy technologies">
					1. Renewable Energy
				</div>
					<p class="level1Body">WWW WWW WWW WWW WWW WWW WWW WWW WWW WWW WWW WWW WWW WWW</p>
					<div id="sect1_1" class="level2Header" title="An introduction to solar power">
						1.1. Solar Power
					</div>
						<p class="level2Body">WWW WWW WWW WWW WWW WWW WWW WWW WWW WWW WWW WWW WWW WWW</p>
					<div id="sect1_2" class="level2Header" title="An introduction to wind power">
						1.2. Wind Power
					</div>
						<p class="level2Body">WWW WWW WWW WWW WWW WWW WWW WWW WWW WWW WWW WWW WWW WWW</p>
					<div id="sect1_3" class="level2Header" title="An introduction to biofuels">
						1.3. Biofuels
					</div>
						<p class="level2Body">WWW WWW WWW WWW WWW WWW WWW WWW WWW WWW WWW WWW WWW WWW</p>
				<div id="sect2" class="level1Header" title="All about fossil fuel technologies">
					2. Fossil Fuels
				</div>
					<p class="level1Body">WWW WWW WWW WWW WWW WWW WWW WWW WWW WWW WWW WWW WWW WWW</p>
					<div id="sect2_1" class="level2Header" title="Peak oil and how it will affect us">
						2.1. Peak Oil
					</div>
						<p class="level2Body">WWW WWW WWW WWW WWW WWW WWW WWW WWW WWW WWW WWW WWW WWW</p>
					<div id="sect2_2" class="level2Header" title="A look at the types of fossil fuels">
						2.2. Types of Fossil Fuel
					</div>
						<p class="level2Body">WWW WWW WWW WWW WWW WWW WWW WWW WWW WWW WWW WWW WWW WWW</p>
						<div id="sect2_2_1" class="level3Header" title="Oil as an energy source">
							2.2.1. Oil
						</div>
							<p class="level3Body">WWW WWW WWW WWW WWW WWW WWW WWW WWW WWW WWW WWW WWW WWW</p>
						<div id="sect2_2_2" class="level3Header" title="An introduction to natural gas">
							2.2.2. Natural Gas
						</div>
							<p class="level3Body">WWW WWW WWW WWW WWW WWW WWW WWW WWW WWW WWW WWW WWW WWW</p>
					<div id="sect2_3" class="level2Header" title="Climate change and fossil fuels">
						2.3. Climate Change
					</div>
						<p class="level2Body">WWW WWW WWW WWW WWW WWW WWW WWW WWW WWW WWW WWW WWW WWW</p>
					<div id="sect2_4" class="level2Header" title="Fossil fuels and energy security">
						2.4. Energy Security
					</div>
						<p class="level2Body">WWW WWW WWW WWW WWW WWW WWW WWW WWW WWW WWW WWW WWW WWW</p>
				..........................................................................................

				JAVASCRIPT
				.........................................................................................
				Uize.Node.Tree.getTreeFromPage (['level1Header','level2Header','level3Header'],Infinity);
				.........................................................................................

				OUTPUT
				..............................................................................................
				[
					{
						title:'Contents',
						items:[
							{
								title:'1. Renewable Energy',
								link:'http://www.uize.com/examples/get-tree-from-page.html#sect1',
								description:'All about renewable energy technologies',
								items:[
									{
										title:'1.1. Solar Power',
										link:'http://www.uize.com/examples/get-tree-from-page.html#sect1_1',
										description:'An introduction to solar power'
									},
									{
										title:'1.2. Wind Power',
										link:'http://www.uize.com/examples/get-tree-from-page.html#sect1_2',
										description:'An introduction to wind power'
									},
									{
										title:'1.3. Biofuels',
										link:'http://www.uize.com/examples/get-tree-from-page.html#sect1_3',
										description:'An introduction to biofuels'
									}
								]
							},
							{
								title:'2. Fossil Fuels',
								link:'http://www.uize.com/examples/get-tree-from-page.html#sect2',
								description:'All about fossil fuel technologies',
								items:[
									{
										title:'2.1. Peak Oil',
										link:'http://www.uize.com/examples/get-tree-from-page.html#sect2_1',
										description:'An introduction to the concept of peak oil'
									},
									{
										title:'2.2. Types of Fossil Fuel',
										link:'http://www.uize.com/examples/get-tree-from-page.html#sect2_2',
										description:'A look at different types of fossil fuels',
										items:[
											{
												title:'2.2.1. Oil',
												link:'http://www.uize.com/examples/get-tree-from-page.html#sect2_2_1',
												description:'A look at the history and future of oil'
											},
											{
												title:'2.2.2. Natural Gas',
												link:'http://www.uize.com/examples/get-tree-from-page.html#sect2_2_2',
												description:'An introduction to natural gas'
											}
										]
									},
									{
										title:'2.3. Climate Change',
										link:'http://www.uize.com/examples/get-tree-from-page.html#sect2_3',
										description:'Climate change and fossil fuels'
									},
									{
										title:'2.4. Energy Security',
										link:'http://www.uize.com/examples/get-tree-from-page.html#sect2_4',
										description:'Fossil fuels and energy security'
									}
								]
							}
						]
					}
				]
				..............................................................................................

			Deriving Item Property Values
				Deriving the title Property's Value
					The value of the =title= item property is derived by getting the cumulative text contained inside an item's heading node, without regard to HTML elements used in formatting the heading text, and then stripping leading and trailing whitespace.

					EXAMPLE
					.......................................................
					<h2 id="sect2" class="heading1">
						<span class="headingNumber">
							<a href="#sect2" title="2. Static Methods">2</a>.
						</span> Static Methods
					</h2>
					.......................................................

					If the above HTML were the HTML for a `tree item` heading node, then the value derived for the =title= property of the item would be "2.1. Tree Data Object" - the =span= and =a= tags would be stripped out, and only the unformatted / unmarked up text would be retained. Note also that the leading and trailing whitespace resulting from the indentation of the HTML tags would be stripped as well.

				Deriving the link Property's Value
					The value of the =link= property is derived from the =id= attribute of an item's heading node, by concatenating the value of the =id= attribute at the end of the value of the =location= object's =href= property, with the two parts separated by a "#" (pound / hash) character.

					EXAMPLE 1
					..........................................................
					<h2 id="sect2" class="heading1">
						<span class="headingNumber">
							<a href="#sect2" title="2. Static Methods">2</a>.
						</span> Static Methods
					</h2>
					..........................................................

					If the above HTML were the HTML for a `tree item` heading node, and if the value of the =location= object's =href= property was "http://www.uize.com", then the value derived for the =link= property of the item would be "http://www.uize.com#sect2".

					For heading nodes that do not have an =id= specified, an ID will be dynamically generated and assigned to the node. The generated ID will be constructed by combining the prefix "Uize_Node_Tree_" with a suffix that indicates the "path" of the section or subsection in the overal hierarchical structure of the document. The format for the suffix is =[sectionNo]&#95;[subsectionNo]&#95;[subSubsectionNo]...=, where the numbering for sections at any level in the tree structure is one-based (*not* zero-based). In order words, the generated suffix for the third subsection of the second section of a document would "2_3", where "2" represents the second section, and "3" represents the third subsection.

					Consider the following example...

					EXAMPLE 2
					.......................................................
					<h2 class="heading1">
						<span class="headingNumber">2.</span> Static Methods
					</h2>
					.......................................................

					In the above example, assuming that the heading was for the second section of the document, then the value derived for the =link= property of the item would be "http://www.uize.com#Uize_Node_Tree_2".

				Deriving the description Property's Value
					The value of the =description= property is derived from the "title" attribute of an item's heading node.

					EXAMPLE
					..........................................................
					<h2 id="sect2" class="heading1" title="2. Static Methods">
						<span class="headingNumber">
							<a href="#sect2" title="2. Static Methods">2</a>.
						</span> Static Methods
					</h2>
					..........................................................

					If the above HTML were the HTML for a `tree item` heading node, then the value derived for the =description= property of the item would be "2. Static Methods". For item heading nodes that do not have a "title" attribute specified, or that have an empty string specified for the "title" attribute, the value of the =description= property will not be set and the =description= property will not be present in the `tree item`.

				Deriving the items Property's Value
					The value of the =items= property is derived from all `tree item` heading nodes following the current item's heading node, that are at the immediately deeper level in the document structure, and up until the very next heading node that is at the same level as or at a shallower level than the current item.

					So, for example, if an item is a section, then the items in that section will be derived by finding all heading nodes following the section heading node that are subsection heading nodes, up until the next section heading node. Consider the following example...

					EXAMPLE
					.........................................................................................
					<h2 id="sect2" class="heading1" title="2. Static Methods">
						<span class="headingNumber">
							<a href="#sect2" title="2. Static Methods">2</a>.
						</span> Static Methods
					</h2>

					<div class="contents1">
						<h2 id="sect2_1" class="heading2" title="2. Static Methods -> 2.1. Uize.callOn">
							<span class="headingNumber">
								<a href="#sect2" title="2. Static Methods">2</a>.
								<a href="#sect2_1" title="2. Static Methods -> 2.1. Uize.callOn">1</a>.
							</span> Uize.callOn
						</h2>

						<div class="contents2">
							...
						</div>

						<h2 id="sect2_2" class="heading2" title="2. Static Methods -> 2.2. Uize.capFirstChar">
							<span class="headingNumber">
								<a href="#sect2" title="2. Static Methods">2</a>.
								<a href="#sect2_2" title="2. Static Methods -> 2.2. Uize.capFirstChar">2</a>.
							</span> Uize.capFirstChar
						</h2>

						<div class="contents2">
							...
						</div>
					</div>
					.........................................................................................

					If the above HTML were the HTML for a `tree item`, then the value derived for the =items= property of the item would be an array with the following structure...

					...............................................................
					[
						{
							title:'2.1. Uize.callOn',
							link:'http://www.uize.com/reference/Uize.html#sect2_1',
							description:'2. Static Methods -> 2.1. Uize.callOn'
						},
						{
							title:'2.2. Uize.capFirstChar',
							link:'http://www.uize.com/reference/Uize.html#sect2_2',
							description:'2. Static Methods -> 2.2. Uize.capFirstChar'
						}
					]
					...............................................................

					Note that not every item needs to have a subtree - in most cases, the majority will not. For items that do not, the value of the =items= property will not be set and the =items= property will not be present in the `tree item`. In our above example, this is the case for the items for sections 2.1 and 2.2.

				Deriving the expanded Property's Value
					When using the =Uize.Node.Tree.getTreeFromPage= method, the value of the =expanded= property is derived from the value of the method's =initialExpandedDepthINT= parameter and the level of the current item.

					The =initialExpandedDepthINT= parameter specifies the depth to which the generated `tree data object` should be expanded, so the value of the =expanded= property for any `tree item` will be =true= if the depth level of that item is less than or equal to the value of the =initialExpandedDepthINT= parameter. Put another way, a value of =1= for the =initialExpandedDepthINT= parameter will result in the generated `tree data object` being expanded to only one level deep, while the value =2= will result in the `tree data object` being expanded to two levels deep.

					So, for example, if sections of a document are considered to be at level 1, and subsections of a document are considered to be at level 2, then the value =2= for the =initialExpandedDepthINT= parameter will result in all section and subsection items in the generated `tree data object` being expanded, the value =1= will result in only section items being expanded, and the value =0= will result in all items being collapsed. If you wish all levels of the tree to be expanded, then you can specify the value =Infinity= for the =initialExpandedDepthINT= parameter. If you wish all levels to be collapsed, then you can specify any value less than =1=.

					NOTE
					Note that for any item that is expanded, the value of the =expanded= property will be =true= and the property will not be present in the `tree item`, since =true= is the default value for this property.
*/

Uize.module ({
	name:'Uize.Node.Tree',
	builder:function () {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_package = function () {},
				_Uize_Node = Uize.Node
			;

		/*** Utility Functions ***/
			function _setItemExpanded (_item,_expanded) {if (!_expanded) _item.expanded = false}
			function _isListNode (_node) {return _node && (_node.tagName == 'UL' || _node.tagName == 'OL')}

		/*** Public Static Methods ***/
			_package.getTreeFromList = function (_node) {
				function _getText (_node) {
					var _text = '';
					if (_node) {
						if (_node.nodeType == 3) _text = _node.data;
						var _childNodes = _node.childNodes;
						if (_childNodes) {
							for (
								var _childNodeNo = -1, _childNodesLength = _childNodes.length, _childNode;
								++_childNodeNo < _childNodesLength;
							) {
								if (_isListNode (_childNode = _childNodes [_childNodeNo])) {
									break;
								} else {
									_text += _getText (_childNode);
								}
							}
						}
					}
					return _text.replace (/^\s*/,'').replace (/\s*$/,'');
				}
				function _getItemFromListItem (_node) {
					var _item = null;
					if (_node) {
						_item = {title:_getText (_node)};
						var _childNodes = _node.childNodes;
						for (var _nodeNo = -1; ++_nodeNo < _childNodes.length;) {
							_node = _childNodes [_nodeNo];
							if (_isListNode (_node)) {
								_setItemExpanded (_item,_node.style.display != 'none');
								var _childNodes = _node.childNodes;
								for (var _childNodeNo = -1; ++_childNodeNo < _childNodes.length;) {
									var _childNode = _childNodes [_childNodeNo];
									_childNode.tagName == 'LI' &&
										(_item.items || (_item.items = [])).push (_getItemFromListItem (_childNode))
									;
								}
							} else if (_node.tagName == 'A') {
								_item.link = _node.getAttribute ('href');
								if (_node.title) _item.description = _node.title;
							}
						}
					}
					return _item;
				}
				var _item = _getItemFromListItem (
					_isListNode (_node = _Uize_Node.getById (_node)) ? _node.parentNode : _node
				);
				return (_item && (/\S/.test (_item.title) ? [_item] : _item.items)) || [];
				/*?
					Static Methods
						Uize.Node.Tree.getTreeFromList
							Returns a `tree data object`, generated by analyzing the structure and contents of a hierarchical list defined by an HTML =ul= (unordered list) or =ol= (ordered list) tag.

							SYNTAX
							........................................................
							treeOBJ = Uize.Node.Tree.getTreeFromList (nodeSTRorOBJ);
							........................................................

							The =nodeSTRorOBJ= parameter should specify either a list node (ie. a =ul= or =ol= tag) or the immediate parent node of a list node. List type (unordered or ordered) does not affect the data in the `tree data object` returned by this method, and a hierarchical list can mix different types of lists.

							EXAMPLE

							For an example showing how this method is used, consult the section `Getting a Tree From a List Element`.

							NOTES
							- compare to the =Uize.Node.Tree.getTreeFromPage= static method
				*/
			};

			_package.getTreeFromPage = function  (_levelClasses,_initialExpandedDepth) {
				var
					_levelClassMap = {},
					_levelClassRegExp = [],
					_tree = {title:'Contents'}
				;
				_initialExpandedDepth = Uize.toNumber (_initialExpandedDepth,1);
				for (var _levelClassNo = -1, _levelClass; ++_levelClassNo < _levelClasses.length;) {
					_levelClassMap [_levelClass = _levelClasses [_levelClassNo]] = _levelClassNo;
					_levelClassRegExp.push ('\\b' + _levelClass + '\\b');
				}
				_levelClassRegExp = new RegExp (_levelClassRegExp.join ('|'));
				for (
					var
						_nodeNo = -1,
						_nodes = document.all || document.getElementsByTagName ('*'),
						_nodesLength = _nodes.length,
						_node,
						_nodeClassName,
						_currentLevel = _tree,
						_currentLevelNo = 0,
						_treeLevels = [_tree],
						_anchorPrefix = 'Uize_Node_Tree_',
						_itemSpecifier = [],
						_linkPrefix = location.href.replace (/#[^#]*$/,'') + '#',
						_levelClassMatch
					;
					++_nodeNo < _nodesLength;
				) {
					if (_nodeClassName = (_node = _nodes [_nodeNo]).className) {
						if (_levelClassMatch = _nodeClassName.match (_levelClassRegExp)) {
							var _newLevelNo = _levelClassMap [_levelClassMatch [0]];
							if (_newLevelNo > _currentLevelNo) {
								_treeLevels [_newLevelNo] = _currentLevel.items [_currentLevel.items.length - 1];
								_currentLevelNo = _newLevelNo;
								_currentLevel = _treeLevels [_currentLevelNo];
							} else if (_newLevelNo < _currentLevelNo) {
								_currentLevelNo = _newLevelNo;
								_currentLevel = _treeLevels [_currentLevelNo];
							}
							_itemSpecifier.length = _currentLevelNo;
							if (!_currentLevel.items) {
								_currentLevel.items = [];
								_setItemExpanded (_currentLevel,_currentLevelNo < _initialExpandedDepth);
							}
							_itemSpecifier.push (_currentLevel.items.length + 1);
							var _item = {
								title:_Uize_Node.getText (_node).replace (/^\s+/,'').replace (/\s+$/,''),
								link:_linkPrefix + (_node.id || (_node.id = _anchorPrefix + _itemSpecifier.join ('_')))
							};
							if (_node.title) _item.description = _node.title;
							_currentLevel.items.push (_item);
						}
					}
				}
				return [_tree];
				/*?
					Static Methods
						Uize.Node.Tree.getTreeFromPage
							Returns a `tree data object`, generated by analyzing the occurrence of different CSS classes for section headings at different depths of a document.

							SYNTAX
							.....................................................................................
							treeOBJ = Uize.Node.Tree.getTreeFromPage (levelClassesARRAY,initialExpandedDepthINT);
							.....................................................................................

							Provided that unique CSS classes are used for styling section headings differently at different levels in a document's structure, then the =Uize.Node.Tree.getTreeFromPage= method can be used to glean a contents tree for a document by scanning through the elements of the document and watching for the CSS classes that denote section headings.

							VARIATION
							.............................................................
							treeOBJ = Uize.Node.Tree.getTreeFromPage (levelClassesARRAY);
							.............................................................

							When the =initialExpandedDepthINT= parameter is not specified, then the value =1= will be used as the default for this parameter.

							EXAMPLE

							For an example showing how this method is used, consult the section `Getting a Tree From a Page's Section Headings`.

							Parameters
								The =Uize.Node.Tree.getTreeFromPage= method supports the following parameters...

								levelClassesARRAY
									An array of string type elements, representing the CSS class names that identify section headings for different levels of a document.

									The first element in this array specifies the CSS class name for top level section headings, the second element specifies the CSS class name for subsection headings, the third element specifies the CSS class name for sub-subsection headings, and so on. The =Uize.Node.Tree.getTreeFromPage= method supports documents with an arbitrary number of section levels.

								initialExpandedDepthINT
									An integer, specifying the depth to which the generated `tree data object` should be expanded.

									If you wish all levels of the tree to be expanded, then you can specify the value =Infinity= for the =initialExpandedDepthINT= parameter. If you wish all levels to be collapsed, then you can specify any value less than =1=.

							NOTES
							- compare to the =Uize.Node.Tree.getTreeFromList= static method
				*/
			};

		return _package;
	}
});

