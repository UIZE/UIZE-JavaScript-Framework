/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.Container.Html Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013-2016 UIZE
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
		The =Uize.Widgets.Container.Html= module is a JavaScript Template module, defining a very basic template for generating the HTML for V2 widgets.

		*DEVELOPERS:* `Chris van Rensburg`

		Specifically, the template first obtains the generated HTML for all of the widget's child widgets and then wraps all of the children's HTML together inside a single root node, producing the HTML for the widget.
*/

Uize.module ({
	name:'Uize.Widgets.Container.Html',
	builder:function () {
		'use strict';

		return Uize.package ({
			process:function () {
				var
					m = this,
					_children = m.children,
					_htmlChunks = [],
					_htmlChunksLength = 0
				;
				for (var _childName in _children)
					_htmlChunks [_htmlChunksLength++] = _children [_childName].getHtml ()
				;
				return '<div id="' + m.nodeId () + '">' + _htmlChunks.join ('') + '</div>';
			}
		});
	}
});

