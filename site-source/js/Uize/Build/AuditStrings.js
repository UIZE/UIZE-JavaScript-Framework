/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Build.AuditStrings Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2009-2015 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 1
	codeCompleteness: 90
	docCompleteness: 5
*/

/*?
	Introduction
		The =Uize.Build.AuditStrings= package provides a method to audit all JavaScript files in a folder for literal strings - useful for internationalization.

		*DEVELOPERS:* `Chris van Rensburg`

		This build script recurses through all folders of a project, harvests all the string literals from JavaScript files, filters them into different buckets depending on their likelihood of internationalizability, and produces a report with summaries for all the JavaScript files.

		The build script groups the literal strings it finds inside a JavaScript file into four buckets...

		NON-INTERNATIONALIZABLE STRINGS
			This category includes strings that are recognized by certain patterns as being non-internationalizable strings, including...

			- DOM event names (e.g. =click=)
			- very JavaScript specific keywords (e.g. =function=)
			- HTML specific attribute names (e.g. =href=)
			- sufficiently distinctive HTML tag names (e.g. =div=), file extensions (e.g. =.gif=)
			- strings that are only whitespace
			- strings that have no letter characters
			- hex formatted RGB color values (e.g. =#ff0000=)
			- module names (e.g. =Uize.Widget.Bar=)
			- any string starting with "Uize"
			- underscore delimited identifiers (e.g. =button_big_disabled=)
			- Changed.[propertyName] events (e.g. =Changed.value=), and the Changed.&#42; event
			- sufficiently distinguishable URL paths (e.g. =myfolder/mysubfolder/myfile.html=)
			- camelCase identifiers (e.g. =languageSortAscending=)

		LIKELY NON-INTERNATIONALIZABLE STRINGS
			This category includes strings with only one letter character (e.g. =a=), and strings that look like short url snippets (e.g. =myfolder/mysubfolder=).

		POSSIBLY INTERNATIONALIZABLE STRINGS
			This category includes strings that are not filtered out into either the `NON-INTERNATIONALIZABLE STRINGS`, `LIKELY NON-INTERNATIONALIZABLE STRINGS`, or `LIKELY INTERNATIONALIZABLE STRINGS` categories.

		LIKELY INTERNATIONALIZABLE STRINGS
			This category includes strings that are not filtered out into either the `NON-INTERNATIONALIZABLE STRINGS` or `LIKELY NON-INTERNATIONALIZABLE STRINGS` categories and that contain three adjacent, space separated words, where the middle word is all lowecase.

		Below is a snippet from the log file after this build script was run inside the =UIZE-JavaScript-Framework= folder of the UIZE Web site project...

		LOG FILE SNIPPET
		..........................................................................................
		***** C:\~uize\UIZE-JavaScript-Framework\site-source\js\Uize.Widget.TableSort.js
			TARGET FILE: C:\~uize\UIZE-JavaScript-Framework\site-source\js\Uize.Widget.TableSort.js
			BUILT (ALWAYS BUILD), BUILD DURATION: 188ms
				NON-INTERNATIONALIZABLE STRINGS
					 --- 92,101,189
					TD --- 54
					TR --- 142,249,274
					Uize.Dom.Basics --- 22
					Uize.Widget.TableSort --- 21
					headingLitClass --- 346
					headingOverClass --- 342
					languageSortAscending --- 350
					languageSortDescending --- 355
					click --- 292
					rowOverClass --- 360
					updateUi --- 339

				LIKELY NON-INTERNATIONALIZABLE STRINGS

				POSSIBLY INTERNATIONALIZABLE STRINGS
					TH --- 55
					tbody --- 50
					thead --- 272

				LIKELY INTERNATIONALIZABLE STRINGS
					Click to sort in ascending order --- 352
					Click to sort in descending order --- 357
		..........................................................................................

		A few things to notice about the format...

		- the strings are listed in ASCIIbetically sorted order
		- to the right of each string is a listing of all the line numbers on which the string occurs

		THIS ONE'S SLOW

		Be warned: this build script can be quite slow to run, especially if you have a large project with many folders and many JavaScript files. It could take a few minutes to process all JavaScript files in a large project. You'll know when it's done running by the modified date of the associated log file, or you can watch the *WSCRIPT.EXE* process in the Windows Task Manager.

		NOTES
		- the summary info for this build script is output to the log file =Uize.Build.AuditStrings.log=
*/

Uize.module ({
	name:'Uize.Build.AuditStrings',
	required:[
		'Uize.Build.Util',
		'Uize.Build.Scruncher',
		'Uize.Array.Join'
	],
	builder:function () {
		'use strict';

		/*** General Variables ***/
			var
				_eventNames = [
					'abort', 'activate', 'afterupdate', 'beforedeactivate', 'beforeeditfocus', 'beforeupdate', 'blur', 'cellchange', 'change', 'click', 'dblclick', 'deactivate', 'drag', 'dragend', 'dragenter', 'dragleave', 'dragover', 'drop', 'error', 'finish', 'focus', 'help', 'keydown', 'keypress', 'keyup', 'load', 'losecapture', 'mousedown', 'mousemove', 'mouseup', 'mouseout', 'mouseover', 'propertychange', 'readystatechange', 'rowenter', 'rowexit', 'rowsdelete', 'rowsinserted', 'scroll', 'submit', 'start', 'unload'
				],
				_nonI18nStringsDictionary = [
					/*** pretty JavaScript-specific value types ***/
						'function', 'object', 'string', 'undefined', // maybe these should be in a likely list?

					/*** properties/attributes that are distinctive enough ***/
						'alt', 'href', 'src',

					/*** JavaScript-specific acronyms ***/
						'ajax', 'json', 'CSS1Compat',

					/*** HTML tag names that are distinctive enough ***/
						'div', 'DIV', 'hr', 'HR', 'iframe', 'IFRAME', 'img', 'IMG', 'li', 'LI', 'ol', 'OL', 'span', 'SPAN', 'td', 'TD', 'textarea', 'TEXTAREA', 'tr', 'TR', 'ul', 'UL',

					/*** file extensions ***/
						'.asp', '.ASP', '.gif', '.html', '.jpg', '.js', '.jst', '.png', '.PNG', '.txt', '.xhtml', '.xml' // this could be in a regular expression, with leading period optional, and case insensitive, perhaps it would be good to add a filename match, to catch things like, filename.gif, .gif, and gif (i.e. patterns like [[filename].]gif|jpg|html)
				].concat (
					_eventNames,
					Uize.map (_eventNames,'\'on\' + value')
				),
				_nonI18nStringsDictionaryLookup
			;

		return Uize.package ({
			perform:function (_params) {
				var _endsWithDotJsRegExp = /\.js$/;
				if (!_nonI18nStringsDictionaryLookup)
					_nonI18nStringsDictionaryLookup = Uize.lookup (_nonI18nStringsDictionary)
				;
				Uize.Build.Util.buildFiles ({
					targetFolderPathCreator:function (_folderPath) {
						return _folderPath;
					},
					targetFilenameCreator:function (_sourceFileName) {
						return _endsWithDotJsRegExp.test (_sourceFileName) ? _sourceFileName : null;
					},
					fileBuilder:function (_sourceFileName,_sourceFileText) {
						var
							_scruncherResult = Uize.Build.Scruncher.scrunch (_sourceFileText,{AUDITSTRINGS:true}),
							_stringsMap = _scruncherResult.stringsMap,
							_strings = Uize.keys (_stringsMap),
							_nonI18nStrings = [],
							_likelyNonI18nStrings = [],
							_possibleI18nStrings = [],
							_likelyI18nStrings = []
						;
						_strings.sort ();
						for (var _stringNo = -1, _stringsLength = _strings.length; ++_stringNo < _stringsLength;) {
							var _string = _strings [_stringNo];
							(
								_nonI18nStringsDictionaryLookup [_string] ||
									// ignore strings that are recognized as non-internationalizable strings
								!/\S/.test (_string) ||
									// ignore strings that are only whitespace (spaces, tabs, linebreaks, etc.)
								!/[a-zA-Z]/.test (_string) ||
									// ignore strings that have no letter characters
								/^(#|0x)([0-9a-fA-F]{3}){1,2}$/.test (_string) ||
									// ignore hex RGB color values
								/^[A-Z][a-zA-Z0-9$_]*(\.[a-zA-Z0-9$_]+)+$/.test (_string) ||
									// ignore what look like module names
								/^Uize/i.test (_string) ||
									// if it starts with "Uize", it's related to the framework
								/^[a-zA-Z0-9$_]*_[a-zA-Z0-9$_]*$/.test (_string) ||
									// ignore what look like underscore delimited identifiers
								/^Changed\.(\*|[a-zA-Z0-1]+)$/.test (_string) ||
									// ignore Changed.[propertyName] events
								/^\S*[\/\\][\w_]+[\/\\]\S*$/.test (_string) ||
									// ignore what look like URL paths
								/^\$?[a-zA-Z][a-z0-9]*([A-Z][a-z0-9]+)+$/.test (_string)
									// ignore what look obviously like camelCase identifiers
								/* TO DO: catch strings that are only numbers */
									? _nonI18nStrings
									: (
										/[a-zA-Z]{2,}/.test (_string) &&
											// string must have at least two consecutive word characters
										!/^\S*[\w_]+[\/\\][\w_]+\S*$/.test (_string)
											// ignore what could be short URL snippets
											? (
												/\b[a-zA-Z][a-z]*\s[a-z]+\s[a-zA-Z][a-z]*\b/.test (_string)
													? _likelyI18nStrings
													: _possibleI18nStrings
											) : _likelyNonI18nStrings
									)
							).push (_string + ' --- ' + _stringsMap [_string]);
						}
						return {
							logDetails:
								'\t\tNON-INTERNATIONALIZABLE STRINGS\n' +
									Uize.Array.Join.hugJoin (_nonI18nStrings,'\t\t\t','\n') + '\n' +
								'\t\tLIKELY NON-INTERNATIONALIZABLE STRINGS\n' +
									Uize.Array.Join.hugJoin (_likelyNonI18nStrings,'\t\t\t','\n') + '\n' +
								'\t\tPOSSIBLY INTERNATIONALIZABLE STRINGS\n' +
									Uize.Array.Join.hugJoin (_possibleI18nStrings,'\t\t\t','\n') + '\n' +
								'\t\tLIKELY INTERNATIONALIZABLE STRINGS\n' +
									Uize.Array.Join.hugJoin (_likelyI18nStrings,'\t\t\t','\n')
						};
					},
					alwaysBuild:true,
					dryRun:true,
					rootFolderPath:_params.sourcePath,
					logFilePath:_params.logFilePath
				});
			}
		});
	}
});

