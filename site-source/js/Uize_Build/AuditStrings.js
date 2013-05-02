/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Build.AuditStrings Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2009-2013 UIZE
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

		The =Uize.Build.AuditStrings= module is designed specifically to run in the context of Windows Script Host.
*/

/*
	TO DO:
		What's still being missed that should be recognized as non-internationalizable...
			250x155 - width x height in pixels

			imageTextSpacingX - not being recognized as camelCase identifier because last capital is not followed by any lowercase characters

			disableGSDProducts, fixedPPI - consecutive caps

			&amp; - any single entity should be filtered out

			<zz:error_image_src> - just a tag, without contents should be detectable (open or close tags)
			</tr><tr> - catch one or more just tags in a row (eg. <br/><br/><br/>)

			Content-length, Content-type - specific HTTP headers

			-1000px - /^(-?\d+)?px$/

			womens_laceup_heel_womens5.5 - it looks like an identifier with underscores, but there's a period

			sz500 - a word with multiple digits

			top= - fragments of code (how to identify them?)

			-jiggler - hyphen starts a word

			pd - two or more adjacent letters with no vowels (lowercase or uppercase)

			- ff00ff - six letter hex format strings should be filtered to LIKELY NON-INTERNATIONALIZABLE STRINGS

			- miscellaneous
				price?input=js&output=js
				MultiProductFactory_form-designData
				?private=true
				&end=
				create/
				icon_medium icon_medium-
				.value
				_ctgy_in.value
				window.parent.parent.document.frmParms.mat
				resizable=yes,status=no,scrollbars=yes,location=no,toolbar=no,directories=no,menubar=no,width=470,innerWidth=470,height=400,innerHeight=400

		- switches
			- a switch for levels of doubt
				1: show only LIKELY INTERNATIONALIZABLE STRINGS
				2: show LIKELY INTERNATIONALIZABLE STRINGS, POSSIBLY INTERNATIONALIZABLE STRINGS
				3: show LIKELY INTERNATIONALIZABLE STRINGS, POSSIBLY INTERNATIONALIZABLE STRINGS, LIKELY NON-INTERNATIONALIZABLE STRINGS
				4: show LIKELY INTERNATIONALIZABLE STRINGS, POSSIBLY INTERNATIONALIZABLE STRINGS, LIKELY NON-INTERNATIONALIZABLE STRINGS, NON-INTERNATIONALIZABLE STRINGS
			- a switch for not showing headings for empty buckets
			- a switch for not showing files for which all buckets that would be displayed are empty

		- summary for overal totals for all buckets, per file, and for all files
		- ability to supply additional dictionaries of known non-internationalizable strings and likely non-internationalizable strings, and regular expressions as well
		- idea: summary for cases where creating a variable for a string that is repeatedly used would save some space when the file is scrunched
*/

Uize.module ({
	name:'Uize.Build.AuditStrings',
	required:[
		'Uize.Build.Util',
		'Uize.Build.Scruncher',
		'Uize.String'
	],
	builder:function () {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var _package = function () {};

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
						'.asp', '.ASP', '.gif', '.html', '.jpg', '.js', '.jst', '.png', '.PNG', '.txt', '.xhtml', '.xml' // this could be in a regular expression, with leading period optional, and case insensitive, perhaps it would be good to add a filename match, to catch things like, filename.gif, .gif, and gif (ie. patterns like [[filename].]gif|jpg|html)
				].concat (
					_eventNames,
					Uize.map (_eventNames,'\'on\' + value')
				),
				_nonI18nStringsDictionaryLookup
			;

		/*** Public Static Methods ***/
			_package.perform = function (_params) {
				var
					_endsWithDotJsRegExp = /\.js$/,
					_sourceFolderName = _params.sourceFolderName
				;
				if (!_nonI18nStringsDictionaryLookup)
					_nonI18nStringsDictionaryLookup = Uize.lookup (_nonI18nStringsDictionary)
				;
				Uize.Build.Util.buildFiles (
					Uize.copyInto (
						{
							targetFolderPathCreator:function (_folderPath) {
								return Uize.String.endsWith (_folderPath,_sourceFolderName) ? _folderPath : null;
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
											Uize.String.hugJoin (_nonI18nStrings,'\t\t\t','\n') + '\n' +
										'\t\tLIKELY NON-INTERNATIONALIZABLE STRINGS\n' +
											Uize.String.hugJoin (_likelyNonI18nStrings,'\t\t\t','\n') + '\n' +
										'\t\tPOSSIBLY INTERNATIONALIZABLE STRINGS\n' +
											Uize.String.hugJoin (_possibleI18nStrings,'\t\t\t','\n') + '\n' +
										'\t\tLIKELY INTERNATIONALIZABLE STRINGS\n' +
											Uize.String.hugJoin (_likelyI18nStrings,'\t\t\t','\n')
								};
							}
						},
						_params,
						{
							alwaysBuild:true,
							dryRun:true
						}
					)
				);
			};

		return _package;
	}
});

