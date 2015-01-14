/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Build.Util Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2012-2015 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 1
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =UizeSite.Build.Util= package provides various utility methods to facilitate building of pages for the UIZE Web site.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'UizeSite.Build.Util',
	required:[
		'Uize.Url',
		'Uize.Str.Has',
		'Uize.Services.FileSystem'
	],
	builder:function () {
		'use strict';

		var
			/*** General Variables ***/
				_fileSystem = Uize.Services.FileSystem.singleton ()
		;

		return Uize.package ({
			getIndexableFiles:function (_sourcePath,_indexableFolderUnderSource,_indexableFileExtensionRegExp) {
				return _fileSystem.getFiles ({
					path:_sourcePath + '/' + _indexableFolderUnderSource,
					pathMatcher:function (_filePath) {
						return (
							_indexableFileExtensionRegExp.test (_filePath) &&
							!Uize.Str.Has.hasPrefix (Uize.Url.from (_filePath).fileName,'~')
						);
					}
				});
				/*?
					Static Methods
						UizeSite.Build.Util.getIndexableFiles
							Returns an array, containing the paths for all the indexable files in the specified folder.

							SYNTAX
							.................................................................
							indexableFilePathsARRAY = UizeSite.Build.Util.getIndexableFiles (
								sourcePathSTR,
								indexableFolderUnderSourceSTR,
								indexableFileExtensionREGEXP
							);
							.................................................................

							This method returns all the files in the folder specified by the =indexableFolderUnderSourceSTR= parameter, that is under the source path specified by the =sourcePathSTR= parameter, and that match the file extension regular expression specified by the =indexableFileExtensionREGEXP= parameter. This method excludes all files whose filenames start with a "~" (tilde) character, since these files are considered veiled and not ready for primetime.
				*/
			}
		});
	}
});

