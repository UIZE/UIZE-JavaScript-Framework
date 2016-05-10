/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Dom.Text Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2004-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 2
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Dom.Text= module provides a method for getting the text content of DOM nodes.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Dom.Text',
	required:'Uize.Dom.Basics',
	builder:function () {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_Uize = Uize,
				_getById = _Uize.Dom.Basics.getById
		;

		return _Uize.package ({
			getText:function (_node) {
				var _text = '';
				if (_node = _getById (_node)) {
					var _gatherText = function (_node) {
						if (typeof _node.innerText == 'string') {
							_text += _node.innerText.replace (/\r|\n|\r\n/g,'');
						} else if (typeof _node.textContent == 'string') {
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
						Uize.Dom.Text.getText
							Returns a string, representing the text content of the specified node.

							SYNTAX
							...................................................
							nodeTextSTR = Uize.Dom.Text.getText (nodeSTRorOBJ);
							...................................................

							In Internet Explorer, this method employs the =innerText= property, removing all linebreaks. In other browsers that support the =textContent= property, this is used. For browsers that support neither, this method iterates recursively through the child nodes and cumulatively harvests the text content using the data property of all the text nodes.

							EXAMPLE
							..........................
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
							..........................

							In the above example, the statement =Uize.Dom.Text.getText ('testNode')= would return roughly ='this is a test of the emergency broadcasting network'= (between browsers there might be variability with the whitespace content).

							NOTES
							- this method is not quaranteed to return exactly the same value for the exact same markup in all browsers
				*/
			}
		});
	}
});

