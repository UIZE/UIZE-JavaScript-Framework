/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Templates.List Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2008-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Template
	importance: 1
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Templates.List= module is a JavaScript Template module, used for generating HTML markup for an unordered list from a JSON data tree.

		*DEVELOPERS:* `Chris van Rensburg`

	Public Static Methods
		Uize.Templates.List.process
			Returns a string, being the generated HTML for the unordered list.

			SYNTAX
			.....................................................
			listHtmlSTR = Uize.Templates.List.process (inputOBJ);
			.....................................................

			The value of the =inputOBJ= parameter should be an object of the form...

			.............................................................................................
			{
				indentChars : indentCharsSTR,  // optional, the character(s) used for indenting list items
				items       : itemsARRAY       // require, the items in the root level list
			}
			.............................................................................................

			indentChars
				An optional string, specifying the characters(s) that should be used for indenting list items in the generated HTML output.

				When this property is not specified, its value is defaulted to the "\t" (single tab) character.

			items
				An array, specifying the items in the list.

				Each element of the =items= array should be an object of the form...

				ITEM
				...................................................................................
				{
					title       : titleSTR,        // required, the displayed title for the item
					link        : linkHrefSTR,     // optional, the URL for a linked item
					description : descriptionSTR,  // optional, the text to be used for a tooltip
					items       : itemsARRAY,      // optional, an array of items for a nested list
					expanded    : expandedBOOL     // optional, a boolean to specify list collapsing
				}
				...................................................................................

				title
					A string, specifying text that should be displayed for the item, and that will be linked if a URL is specified in the item's =link= property.

				link
					An optional string, specifying a URL that the item's =title= should be linked to.

					When this property is present, the value of an item's =title= property will be enclosed in a link tag, otherwise the item's =title= will be rendered simply as unlinked text.

				description
					An optional string, specifying text that should be used for the "title" attribute of a link tag that encloses the value of the item's =title= property.

					If no link URL is specified for the item's =link= property, then the =description= property is not applicable. By using the value of the =description= property for the "title" attribute of the link, the specified description will be displayed in a tooltip when the user mouses over a linked item.

				items
					An optional array, specifying the =items= in a nested list (yes, it's items all the way down).

				expanded
					An optional boolean, specifying whether or not the nested list specified by an item's =items= property should be expanded.

					When this property is not present, it's value will be defaulted to =true=. By default, all lists at all levels in the tree are expanded. If the value =false= is specified for the =expanded= property, then the CSS style setting =display:none= will be added to the HTML generated for an item's nested list. If no array is specified for an item's =items= property, then the item's =expanded= property is not applicable.

	Public Static Properties
		Uize.Templates.List.input
			An object, describing the allowed properties of the =inputOBJ= parameter of the =Uize.Templates.List.process= static method.
*/

Uize.module ({
	name:'Uize.Templates.List',
	required:'Uize.Xml',
	builder:function () {
		/*** Variables for Scruncher Optimization ***/
			var
				_package = function () {},
				_Uize_Xml_toAttributeValue = Uize.Xml.toAttributeValue
			;

		/*** Public Static Methods ***/
			_package.process = function (_input) {
				var
					_indentChars = typeof _input.indentChars == 'string' ? _input.indentChars : '\t',
					_listLines = []
				;
				function _addListLine (_listLine) {_listLines.push (_listLine)}
				function _addListItem (_item,_indentStr) {
					var
						_itemItemsLength = (_item.items || '').length,
						_itemLink = _item.link
					;
					_addListLine (
						_indentStr + '<li>' +
							(
								_itemLink
									? (
										'<a href="' + _item.link + '"' +
										(
											_item.description
												? (' title="' + _Uize_Xml_toAttributeValue (_item.description) + '"')
												: ''
										)
										+ '>'
									)
									: ''
							) +
								_item.title +
							(_itemLink ? '</a>' : '') +
						(_itemItemsLength ? '' : '</li>')
					);
					if (_itemItemsLength) {
						_addListItems (_item,_indentStr + _indentChars);
						_addListLine (_indentStr + '</li>');
					}
				}
				function _addListItems (_item,_indentStr) {
					var _items = _item.items;
					if (_items && _items.length) {
						_addListLine (_indentStr + '<ul' + (_item.expanded === false ? ' style="display:none;"' : '') + '>');
						for (var _itemNo = -1, _itemsLength = _items.length; ++_itemNo < _itemsLength;)
							_addListItem (_items [_itemNo],_indentStr + _indentChars)
						;
						_addListLine (_indentStr + '</ul>');
					}
				}
				_addListItems ({items:_input.items},'');
				return _listLines.join ('\n');
			};

		/*** Public Static Properties ***/
			_package.input = {
				indentChars:'string',
				items:'array'
			};

		return _package;
	}
});

