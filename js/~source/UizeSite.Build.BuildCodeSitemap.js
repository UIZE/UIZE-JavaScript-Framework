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
	required:'Uize.Wsh',
	builder:function () {
		/*** Variables for Scruncher Optimization ***/
			var _package = function () {};

		/*** Public Static Methods ***/
			_package.perform = function (_params) {
				var
					_dotJsRegExp = /\.js$/i,
					_scriptFolderPathLengthPlusOne = Uize.Wsh.getScriptFolderPath ().length + 1,
					_siteMapChunks = [
						'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:codesearch="http://www.google.com/codesearch/schemas/sitemap/1.0">'
					]
				;
				for (
					var
						_moduleFileNo = 0,
						_moduleFiles = Uize.Wsh.getFiles (env.moduleFolderPath),
						_moduleFilesLength = _moduleFiles.length,
						_moduleName
					;
					_moduleFileNo < _moduleFilesLength;
					_moduleFileNo++
				) {
					if (_dotJsRegExp.test (_moduleName = _moduleFiles [_moduleFileNo]))
						_siteMapChunks.push (
							'\t<url>',
								'\t\t<loc>' +
									'http://www.uize.com/' + _moduleName.slice (_scriptFolderPathLengthPlusOne).replace (/\\/g,'/') +
								'</loc>',
								'\t\t<codesearch:codesearch>',
									'\t\t\t<codesearch:filetype>javascript</codesearch:filetype>',
									'\t\t\t<codesearch:license>GPL</codesearch:license>',
								'\t\t</codesearch:codesearch>',
							'\t</url>'
						)
					;
				}
				_siteMapChunks.push ('</urlset>');

				Uize.Wsh.writeFile ({path:'sitemap-code.xml',text:_siteMapChunks.join ('\n')});
			};

		return _package;
	}
});

