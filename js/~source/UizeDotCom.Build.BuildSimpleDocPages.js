/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeDotCom.Build.BuildSimpleDocPages Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2005-2012 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 5
	codeCompleteness: 100
	testCompleteness: 0
	docCompleteness: 3
*/

/*?
	Introduction
		The =UizeDotCom.Build.BuildSimpleDocPages= package provides a method to build all the SimpleDoc documentation for the *uize.com* Web site.

		*DEVELOPERS:* `Chris van Rensburg`

		The =UizeDotCom.Build.BuildSimpleDocPages= module is designed specifically to run in the context of Windows Script Host.
*/

Uize.module ({
	name:'UizeDotCom.Build.BuildSimpleDocPages',
	required:[
		'Uize.Build.BuildSimpleDocPages',
		'Uize.Wsh',
		'Uize.Data.Simple',
		'Uize.Url',
		'UizeDotCom.Build.Util'
	],
	builder:function () {
		/*** Variables for Scruncher Optimization ***/
			var _package = function () {};

		/*** Public Static Methods ***/
			_package.perform = function (_params) {
				var
					_urlDictionary = {},
					_moduleReferenceFolderName = 'reference',
					_dotSimpleRegExp = /\.simple$/i,
					_dotJsRegExp = /\.js$/i
				;
				/*** utility functions ***/
					function _getFilenameFromPath (_filePath) {
						return Uize.Url.from (_filePath).fileName;
					}

				/*** populate URL dictionary ***/
					/*** add UIZE developers to URL dictionary ***/
						function _addDictionaryUrlsFromCreditsSimpleDataFile (_filePath) {
							var _listings =
								Uize.Data.Simple.parse ({simple:Uize.Wsh.readFile (_filePath),collapseChildren:true}).listings
							;
							for (var _listingNo = -1, _listingsLength = _listings.length; ++_listingNo < _listingsLength;) {
								var _listing = _listings [_listingNo];
								if (_listing.link)
									_urlDictionary [_listing.fullName] = _listing.link
								;
							}
						}
						_addDictionaryUrlsFromCreditsSimpleDataFile ('appendixes/credits.html.simpledata');
						_addDictionaryUrlsFromCreditsSimpleDataFile ('endorsements.html.simpledata');

					/*** add reference pages to URL dictionary ***/
						function _addReferencePagesToUrlDictionary (_sourceFolder,_sourceFileMatcher,_referenceFolder) {
							for (
								var
									_fileNo = -1,
									_referenceUrlPrefix = '/' + (_referenceFolder || _sourceFolder)+ '/',
									_files = Uize.Wsh.getFiles (_sourceFolder,_sourceFileMatcher,_getFilenameFromPath),
									_filesLength = _files.length,
									_fileName
								;
								++_fileNo < _filesLength;
							)
								_urlDictionary [_fileName = _files [_fileNo]] = _referenceUrlPrefix + _fileName + '.html'
							;
						}
						_addReferencePagesToUrlDictionary ('javascript-reference',_dotSimpleRegExp);
						_addReferencePagesToUrlDictionary (env.moduleFolderPath,_dotJsRegExp,_moduleReferenceFolderName);

				/*** now build the SimpleDoc pages ***/
					Uize.Build.BuildSimpleDocPages.perform (
						Uize.copyInto (
							{
								urlDictionary:_urlDictionary,
								examplesByKeyword:UizeDotCom.Build.Util.getExamplesByKeyword ()
							},
							_params
						)
					);
			};

		return _package;
	}
});

