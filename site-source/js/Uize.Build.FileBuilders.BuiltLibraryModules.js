/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Build.FileBuilders.BuiltLibraryModules Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2012-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 5
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Build.FileBuilders.BuiltLibraryModules= module defines a file builder for the built versions of the JavaScript library modules (=.library.js= files) of a site.

		*DEVELOPERS:* `Chris van Rensburg`

		Functions defined in the file builder are called as instance methods on an instance of a subclass of the =Uize.Services.FileBuilderAdapter= class, so the functions can access instance methods implemented in this class.
*/

Uize.module ({
	name:'Uize.Build.FileBuilders.BuiltLibraryModules',
	required:[
		'Uize.String',
		'Uize.String.Lines',
		'Uize.Build.Util',
		'Uize.Url'
	],
	builder:function () {
		var
			_contentsCommentRegExp = /\/\*\s*Library\s*Contents/i,
			_lineStartsWithIdentifierCharRegExp = /^[a-zA-Z_$]/,
			_libraryUsesUizeModulesHeader =
				'/*______________\n' +
				'|       ______  |   B U I L T     O N     U I Z E     F R A M E W O R K\n' +
				'|     /      /  |   ---------------------------------------------------\n' +
				'|    /    O /   |   This JavaScript application is developed using the object\n' +
				'|   /    / /    |   oriented UIZE JavaScript framework as its foundation.\n' +
				'|  /    / /  /| |\n' +
				'| /____/ /__/_| |    ONLINE : http://www.uize.com\n' +
				'|          /___ |   LICENSE : Available under MIT License or GNU General Public License\n' +
				'|_______________|             http://www.uize.com/license.html\n' +
				'*/\n\n'
		;

		return {
			description:'JavaScript library modules',
			urlMatcher:function (_urlParts) {
				return (
					!this.params.isDev &&
					Uize.String.startsWith (_urlParts.pathname,this.builtUrl ('js/')) &&
					Uize.String.endsWith (_urlParts.pathname,'.library.js')
				);
			},
			builderInputs:function (_urlParts) {
				var
					_this = this,
					_pathname = _urlParts.pathname,
					_librarySourcePath = _this.sourceUrlFromBuiltUrl (_pathname),
					_inputs = {librarySource:_librarySourcePath},
					_libraryFileContents = _this.readFile ({path:_librarySourcePath}),
					_contentsCommentStartPos = _libraryFileContents.search (_contentsCommentRegExp),
					_contentsCommentEndPos = _libraryFileContents.indexOf ('*/',_contentsCommentStartPos),
					_moduleNo = -1
				;
				Uize.forEach (
					Uize.String.Lines.split (
						_contentsCommentStartPos > -1
							?
								_libraryFileContents.slice (_contentsCommentStartPos,_contentsCommentEndPos)
									.replace (_contentsCommentRegExp,'')
							: _libraryFileContents
					),
					function (_moduleName) {
						if (
							(_moduleName = Uize.String.trim (_moduleName)) &&
							_lineStartsWithIdentifierCharRegExp.test (_moduleName)
						)
							_inputs ['libraryModule' + ++_moduleNo] = _this.builtUrl ('js/' + _moduleName + '.js')
						;
					}
				);
				return _inputs;
			},
			builder:function (_inputs) {
				function _stripModuleHeaderComment (_moduleText) {
					var _moduleHeaderCommentPos = _moduleText.indexOf ('/*');
					return (
						_moduleHeaderCommentPos > -1
							? (
								_moduleText.slice (0,_moduleHeaderCommentPos) +
								_moduleText.slice (_moduleText.indexOf ('*/',_moduleHeaderCommentPos + 2) + 2)
							)
							: _moduleText
					);
				}
				var
					_this = this,
					_libraryFileContents = _this.readFile ({path:_inputs.librarySource}),
					_contentsCommentStartPos = _libraryFileContents.search (_contentsCommentRegExp),
					_contentsCommentEndPos = _libraryFileContents.indexOf ('*/',_contentsCommentStartPos),
					_libraryContentsChunks = [],
					_libraryUsesUizeModules
				;
				Uize.Build.Util.forEachNumberedProperty (
					_inputs,
					'libraryModule',
					function (_modulePath) {
						if (!_libraryUsesUizeModules)
							_libraryUsesUizeModules = Uize.String.startsWith (Uize.Url.from (_modulePath).fileName,'Uize')
						;
						_libraryContentsChunks.push (_stripModuleHeaderComment (_this.readFile ({path:_modulePath})));
					}
				);
				return (
					(_libraryUsesUizeModules ? _libraryUsesUizeModulesHeader : '') +
					_libraryFileContents.slice (0,_contentsCommentStartPos) +
					_libraryContentsChunks.join ('\n') +
					_libraryFileContents.slice (_contentsCommentEndPos + 2)
				);
			}
		};
	}
});

