/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Build.UpdateCopyrightNotices Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2011-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 1
	codeCompleteness: 100
	docCompleteness: 4
*/

/*?
	Introduction
		The =Uize.Build.UpdateCopyrightNotices= package provides a way to recurse folder structures and update the copyright notices for all JavaScript (.js) files to cover the current year.

		*DEVELOPERS:* `Chris van Rensburg`

		The =Uize.Build.UpdateCopyrightNotices= module is designed specifically to run in the context of Windows Script Host.
*/

Uize.module ({
	name:'Uize.Build.UpdateCopyrightNotices',
	required:'Uize.Build.Util',
	builder:function () {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var _package = function () {};

		/*** General Variables ***/
			var
				_copyrightNoticeRegExp = /\(c\)\s*\d{4}(?:\s*-\s*(\d{4}))?/i,
				_copyrightNoticeEndYearRegExp = /(-\s*)(\d{4})/
			;

		/*** Public Static Methods ***/
			_package.perform = function (_params) {
				var _thisYear = (new Date).getFullYear ();
				Uize.Build.Util.buildFiles (
					Uize.copyInto (
						{
							targetFolderPathCreator:function (_folderPath) {
								return _folderPath;
							},
							targetFilenameCreator:function (_sourceFileName) {
								return /\.(js|jst)$/.test (_sourceFileName) ? _sourceFileName : null;
							},
							fileBuilder:function (_sourceFileName,_sourceFileText) {
								var _copyrightNoticeMatch = _sourceFileText.match (_copyrightNoticeRegExp);
								if (_copyrightNoticeMatch) {
									var _oldCopyrightNotice = _copyrightNoticeMatch [0];
									if (_oldCopyrightNotice == '(c)' + _thisYear) {
										_copyrightNoticeMatch = null;
									} else {
										var
											_endYearMatch = _oldCopyrightNotice.match (_copyrightNoticeEndYearRegExp),
											_newCopyrightNotice = _endYearMatch
												? _oldCopyrightNotice.replace (_copyrightNoticeEndYearRegExp,'$1' + _thisYear)
												: _oldCopyrightNotice + '-' + _thisYear,
											_updatedaSourceFileText =
												_sourceFileText.replace (_oldCopyrightNotice,_newCopyrightNotice)
										;
									}
								}
								return (
									_copyrightNoticeMatch &&
									_updatedaSourceFileText != _sourceFileText
										? {
											outputText:_updatedaSourceFileText,
											logDetails:
												'\t\tCopyright Notice Updated:\n' +
												'\t\t\tWAS: ' + _oldCopyrightNotice + '\n' +
												'\t\t\tNOW: ' + _newCopyrightNotice + '\n'
										}
										: {logDetails:'\t\tFILE ALREADY OK\n'}
								);
							}
						},
						_params,
						{alwaysBuild:true}
					)
				);
			};

		return _package;
	}
});

