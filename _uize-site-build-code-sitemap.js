/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Code Sitemap Build Script
|   /    / /    |    AUTHOR : Chris van Rensburg (http://www.tomkidding.com)
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2009-2012 Chris van Rensburg
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*
	DESCRIPTION
		A script for WSH that builds a code sitemap, to be used by search engines for code search.
*/

/*** boilerplate setup code for WSH build scripts ***/
	var _setupFile = new ActiveXObject ('Scripting.FileSystemObject').OpenTextFile ('_build-script-setup.js',1);
	eval (_setupFile.ReadAll ()) ();
	_setupFile.Close ();

Uize.module ({
	required:'Uize.Wsh',
	builder:function () {
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
	}
});

