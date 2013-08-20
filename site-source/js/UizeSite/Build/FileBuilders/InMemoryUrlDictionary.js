/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Build.FileBuilders.InMemoryUrlDictionary Package
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
		The =UizeSite.Build.FileBuilders.InMemoryUrlDictionary= module defines a file builder for the in-memory URL dictionary object used when building SimpleDoc pages.

		*DEVELOPERS:* `Chris van Rensburg`

		Functions defined in the file builder are called as instance methods on an instance of a subclass of the =Uize.Services.FileBuilderAdapter= class, so the functions can access instance methods implemented in this class.
*/

Uize.module ({
	name:'UizeSite.Build.FileBuilders.InMemoryUrlDictionary',
	required:[
		'Uize.Url',
		'Uize.Build.Util'
	],
	builder:function () {
		return Uize.package ({
			description:'In-memory URL dictionary for SimpleDoc pages',
			urlMatcher:function (_urlParts) {
				return _urlParts.pathname == this.memoryUrl ('url-dictionary');
			},
			builderInputs:function (_urlParts) {
				return {
					credits:this.memoryUrl ('appendixes/credits.html.simpledata'),
					endorsements:this.memoryUrl ('endorsements.html.simpledata')
				};
			},
			builder:function (_inputs) {
				var
					_this = this,
					_urlDictionary = {}
				;

				/*** add the credits and endorsements links ***/
					function _addUrlsFromListingsInput (_inputName) {
						for (
							var
								_listingNo = -1,
								_listings = _this.readFile ({path:_inputs [_inputName]}).listings,
								_listingsLength = _listings.length,
								_listing
							;
							++_listingNo < _listingsLength;
						) {
							if ((_listing = _listings [_listingNo]).link)
								_urlDictionary [_listing.fullName] = _listing.link
							;
						}
					}
					_addUrlsFromListingsInput ('credits');
					_addUrlsFromListingsInput ('endorsements');

				/*** add links to module reference pages ***/
					Uize.forEach (
						Uize.Build.Util.getJsModules (_this.params),
						function (_moduleName) {
							_urlDictionary [_moduleName] = '/reference/' + _moduleName + '.html';
						}
					);

				/*** add links to JavaScript reference pages ***/
					var
						_simpleModuleExtensionRegExp = /\.simple$/,
						_javaScriptReferenceFolder = 'javascript-reference'
					;
					_this.fileSystem.getFiles ({
						path:_this.sourceUrl (_javaScriptReferenceFolder),
						pathMatcher:_simpleModuleExtensionRegExp,
						pathTransformer:function (_filePath) {
							var _fileName = Uize.Url.from (_filePath).file.replace (_simpleModuleExtensionRegExp,'');
							_urlDictionary [_fileName] = '/' + _javaScriptReferenceFolder + '/' + _fileName + '.html';
						}
					});

				return _urlDictionary;
			}
		});
	}
});

