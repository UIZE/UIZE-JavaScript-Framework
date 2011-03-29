/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeDotCom.Page.Home.library Library Module
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2009-2011 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*?
	Introduction
		The =UizeDotCom.Page.Home.library= module is a library module that bundles together various JavaScript modules used by the very important homepage of the UIZE JavaScript Framework's Web site.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	required:'UizeDotCom.Page.library',
	builder:function () {
		/* Library Contents
			Uize.Fx.xShadows
			Uize.Widget.HoverFader
			Uize.Json
			Uize.String
			Uize.Template
			Uize.Tooltip
			Uize.Widget.AutoTooltip
			Uize.Widget.Button
			Uize.Widget.Scrolly
			UizeDotCom.Page.Home
		*/
		Uize.module ({name:'UizeDotCom.Page.Home.library'});
	}
});

