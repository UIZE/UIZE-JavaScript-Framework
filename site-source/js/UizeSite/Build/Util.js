/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Build.Util Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2012-2013 UIZE
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
		'Uize.String',
		'Uize.Services.FileSystem'
	],
	builder:function () {
		'use strict';

		/*** General Variables ***/
			var
				_fileSystem = Uize.Services.FileSystem.singleton (),
				_widgetClassSuffixRegExp = /\.Widget$/
			;

		return Uize.package ({
			getIndexableFiles:function (_sourcePath,_indexableFolderUnderSource,_indexableFileExtensionRegExp) {
				return _fileSystem.getFiles ({
					path:_sourcePath + '/' + _indexableFolderUnderSource,
					pathMatcher:function (_filePath) {
						return (
							_indexableFileExtensionRegExp.test (_filePath) &&
							!Uize.String.startsWith (Uize.Url.from (_filePath).fileName,'~')
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
			},

			visualTestsModuleNameFromWidgetClass:function (_widgetClass) {
				return (
					_widgetClassSuffixRegExp.test (_widgetClass)
						? _widgetClass.replace (_widgetClassSuffixRegExp,'.VisualTests')
						: ''
				);
				/*?
					Static Methods
						UizeSite.Build.Util.visualTestsModuleNameFromWidgetClass
							Returns a string, representing the name of the corresponding visual tests module for the specified widget class name.

							SYNTAX
							.....................................................................................
							visualTestsModuleNameSTR = UizeSite.Build.Util.visualTestsModuleNameFromWidgetClass (
								widgetClassNameSTR
							);
							.....................................................................................

							EXAMPLE
							.....................................................................................
							UizeSite.Build.Util.visualTestsModuleNameFromWidgetClass ('Uize.Widgets.Log.Widget');
							.....................................................................................

							RESULT
							..............................
							'Uize.Widgets.Log.VisualTests'
							..............................

							NOTES
							- see also the companion =UizeSite.Build.Util.visualSamplerModuleNameFromWidgetClass= static method
				*/
			},

			visualSamplerModuleNameFromWidgetClass:function (_widgetClass) {
				return (
					_widgetClassSuffixRegExp.test (_widgetClass)
						? _widgetClass.replace (_widgetClassSuffixRegExp,'.VisualSampler')
						: ''
				);
				/*?
					Static Methods
						UizeSite.Build.Util.visualSamplerModuleNameFromWidgetClass
							Returns a string, representing the name of the corresponding visual sampler module for the specified widget class name.

							SYNTAX
							.........................................................................................
							visualSamplerModuleNameSTR = UizeSite.Build.Util.visualSamplerModuleNameFromWidgetClass (
								widgetClassNameSTR
							);
							.........................................................................................

							EXAMPLE
							.......................................................................................
							UizeSite.Build.Util.visualSamplerModuleNameFromWidgetClass ('Uize.Widgets.Log.Widget');
							.......................................................................................

							RESULT
							................................
							'Uize.Widgets.Log.VisualSampler'
							................................

							NOTES
							- see also the companion =UizeSite.Build.Util.visualTestsModuleNameFromWidgetClass= static method
				*/
			}
		});
	}
});

