/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Page.Doc.library Library Module
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2009-2012 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*?
	Introduction
		The =UizeSite.Page.Doc.library= module is a library module that bundles together various JavaScript modules common to the SimpleDoc pages of the UIZE JavaScript Framework's Web site.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	required:'UizeSite.Page.library',
	builder:function () {
		/* Library Contents
			Uize.Tooltip
			Uize.Widget.Tree.List
			UizeSite.Page.Doc
		*/
		Uize.module ({name:'UizeSite.Page.Doc.library'});
	}
});

