/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Build.Files.SimpleDocPages Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2005-2015 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 5
	codeCompleteness: 100
	docCompleteness: 3
*/

/*?
	Introduction
		The =UizeSite.Build.Files.SimpleDocPages= build script recurses through all folders of the UIZE Web site project, building pages from all the Simple Doc (=.simple=) files that it finds, as well as building HTML reference documentation pages from all JavaScript modules that it finds in the modules folder.

		*DEVELOPERS:* `Chris van Rensburg`

		Simple Doc Pages
			An HTML page is generated for each Simple Doc (=.simple=) file.

			The build script recurses through all the folders, finding Simple Doc (=.simple=) files. For each file, it builds an HTML page from the Simple Doc document, using the =~SIMPLE-DOC-TEMPLATE.html.jst= template file that is contained inside the same folder as the Simple Doc file. The built HTML page is then output to the same folder as the Simple Doc file, where the filename of the built file is the filename of the Simple Doc file with the =.simple= file extension replaced with the =.html= extension.

			FILE NAMING EXAMPLE
			..............................................................................
			javascript-build-scripts.simple --> PRODUCES --> javascript-build-scripts.html
			..............................................................................

		Module Reference Pages
			An HTML reference documentation page is generated for each JavaScript module contained inside the modules folder.

			The build script iterates through all the JavaScript modules contained inside the modules folder (as specified by the =modulesFolder= build environment variable). For each file, it extracts all the Simple Doc comments, stitches all those comments together into a single Simple Doc document, and then builds an HTML page from that document, using the =~SIMPLE-DOC-TEMPLATE.html.jst= template file that is contained inside the =reference/= folder of the UIZE Web site project. The built HTML reference documentation page is then output to the =reference/= folder, where the filename of the built file is the filename of the JavaScript module with the =.js= file extension replaced with the =.html= extension.

			FILE NAMING EXAMPLE
			.............................................................
			js/Uize.Widget.js --> PRODUCES --> reference/Uize.Widget.html
			.............................................................

		For more information on Simple Doc - such as its rules on document structure, inline formatting, etc. - refer to the guide [[javascript-documentation-system.html][JavaScript Documentation System]].

		NOTES
		- the summary info for this build script is output to the log file =UizeSite.Build.Files.SimpleDocPages.log=
*/

Uize.module ({
	name:'UizeSite.Build.Files.SimpleDocPages',
	required:'Uize.Build.Util',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			staticMethods:{
				determineFilesToBuild:function (_params) {
					var
						m = this,
						_sourcePath = _params.sourcePath
					;

					/*** add URLs for all .simple files (guides, appendixes, JavaScript reference pages, etc.) ***/
						var _dotSimpleExtensionRegExp = /\.simple$/;
						m.addFiles (
							m.fileSystem.getFiles ({
								path:_sourcePath,
								recursive:true,
								pathMatcher:_dotSimpleExtensionRegExp,
								pathTransformer:function (_path) {return _path.replace (_dotSimpleExtensionRegExp,'.html')}
							})
						);

					/*** add URLs for all JavaScript module reference files ***/
						m.addFiles (
							Uize.map (
								Uize.Build.Util.getJsModules (_params).sort (),
								'"reference/" + value + ".html"'
							)
						);
				}
			}
		});
	}
});

