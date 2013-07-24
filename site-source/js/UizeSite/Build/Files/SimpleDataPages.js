/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Build.Files.SimpleDataPages Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2008-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 6
	codeCompleteness: 100
	docCompleteness: 3
*/

/*?
	Introduction
		The =UizeSite.Build.Files.SimpleDataPages= build script recurses through all folders of the UIZE Web site project, building pages from all the Simple Data (=.simpledata=) files that it finds.

		*DEVELOPERS:* `Chris van Rensburg`

		Simple Data is a data file format that is even more human readable than XML (how could this even be possible!?!?) and that uses indentation to indicate structure (so, kind of like Python, but for data). This build script finds all these files and builds pages from them, by processing the data in each file using an accompanying JavaScript Template (=.jst=) file.

		File Naming Scheme
			The filename for the JST file and the target (ie. built) file are determined by a simple file naming scheme that associates the two files with the Simple Data source file.

			According to this scheme, the filename for the JST file is the filename of the Simple Data file with the =.simpledata= file extension replaced with the =.jst= extension, and the filename of the built file is the filename of the Simple Data file with the =.simpledata= file extension stripped off. Consider the following example...

			FILE NAMING EXAMPLE
			.............................................
			built file         >  credits.html
			JST template file  >  credits.html.jst
			Simple Data file   >  credits.html.simpledata
			.............................................

			In the above example, the file =credits.html.simpledata= is the source Simple Data file, the file =credits.html.jst= is the JavaScript template that should be used for processing the data in the Simple Data file, and the file =credits.html= is the built file that contains the output of the template processing operation.

			Based on this file naming principle, the desired file extension for the built file is put before the =.simpledata= and =.jst= extensions. This means that the UIZE Site Build Simple Data Pages build script can build any type of text file from Simple Data files it encounters, and, in fact, the UIZE Web site project uses it to build a few of its HTML pages.
*/

Uize.module ({
	name:'UizeSite.Build.Files.SimpleDataPages',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			staticMethods:{
				determineFilesToBuild:function (_params) {
					var
						_fileSystem = this.fileSystem,
						_dotSimpledataExtensionRegExp = /\.simpledata$/,
						_sourcePath = _params.sourcePath
					;
					this.addFiles (
						_fileSystem.getFiles ({
							path:_sourcePath,
							recursive:true,
							pathMatcher:function (_path) {
								return (
									_dotSimpledataExtensionRegExp.test (_path) &&
										// path must end with .simpledata extension
									/\.[^\.\\\/]+$/.test (_path.replace (_dotSimpledataExtensionRegExp,'')) &&
										// path minus .simpledata extension must have a remaining real extension
									_fileSystem.fileExists ({
										path:_sourcePath + '/' + _path.replace (_dotSimpledataExtensionRegExp,'.jst')
										// there must be a corresponding .jst template file
									})
								);
							},
							pathTransformer:function (_path) {return _path.replace (_dotSimpledataExtensionRegExp,'')}
						})
					);
				}
			}
		});
	}
});

