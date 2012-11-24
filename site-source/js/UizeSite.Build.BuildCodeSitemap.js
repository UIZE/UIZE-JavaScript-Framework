/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Build.BuildCodeSitemap Namespace
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2009-2012 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Namespace
	importance: 1
	codeCompleteness: 100
	testCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =UizeSite.Build.BuildCodeSitemap= package provides a method for building an XML code sitemap for the UIZE Web site for all the JavaScript modules of the UIZE JavaScript Framework.

		*DEVELOPERS:* `Chris van Rensburg`

		The sitemap XML file produced by this build script is used by search engines for code search, such as Google's Google Code labs project.
*/

Uize.module ({
	name:'UizeSite.Build.BuildCodeSitemap',
	required:'UizeSite.Build.File',
	builder:function () {
		/*** Variables for Scruncher Optimization ***/
			var _package = function () {};

		/*** Public Static Methods ***/
			_package.perform = function (_params) {
				UizeSite.Build.File.perform (Uize.copyInto ({url:'sitemap-code.xml'},_params));
			};

		return _package;
	}
});

