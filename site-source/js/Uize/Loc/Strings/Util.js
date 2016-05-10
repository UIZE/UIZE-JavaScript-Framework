/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Loc.Strings.Util Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 1
	codeCompleteness: 100
	docCompleteness: 5
*/

/*?
	Introduction
		The =Uize.Loc.Strings.Util= module provides utility methods for working with resource strings.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Loc.Strings.Util',
	required:[
		'Uize.Data.Diff',
		'Uize.Data.Csv',
		'Uize.Loc.Strings.StringPath'
	],
	builder:function () {
		'use strict';

		var
			/*** references to methods used internally ***/
				_toStringPath = Uize.Loc.Strings.StringPath.to,
				_initValues,

			/*** General Variables ***/
				_blankStringPropertyObject = {value:''},
				_sacredEmptyObject = {}
		;

		return Uize.package ({
			initNonTranslatable:function (
				_translatableLanguageStrings,_primaryLanguageStrings,_initMode,_isTranslatableString
			) {
				var _initModeParts = (
					{
						never:',never,',
						primary:'non-translatable,always,primary',
						blank:'non-translatable,always,blank',
						'primary-if-blank':'non-translatable,if-blank,primary'
					} [_initMode || 'primary-if-blank'] || _initMode
				).split (',');
				return _initValues (
					_translatableLanguageStrings,
					_primaryLanguageStrings,
					_initModeParts [0],
					_initModeParts [1],
					_initModeParts [2],
					_isTranslatableString
				);
				/*?
					Static Methods
						Uize.Loc.Strings.Util.initNonTranslatable
							Lets you initialize the non-translatable strings in a project resource strings object.

							SYNTAX
							...................................................................
							initializedStringsOBJ = Uize.Loc.Strings.Util.initNonTranslatable (
								translatableLanguageStringsOBJ,
								primaryLanguageStringsOBJ,
								initModeSTR,
								isTranslatableStringFUNC
							);
							...................................................................

							The =Uize.Loc.Strings.Util.initNonTranslatable= method is essentially a specialized usage of the more versatile =Uize.Loc.Strings.Util.initValues= static method.

							NOTES
							- compare to the related =Uize.Loc.Strings.Util.initValues= static method
				*/
			},

			initValues:_initValues = function (
				_translatableLanguageStrings,_primaryLanguageStrings,_initWhat,_initWhen,_initTo,_isTranslatableString
			) {
				if (_initWhat == 'none' || _initWhen == 'never') {
					return _translatableLanguageStrings;
				} else {
					var
						_initWhatIsAll = _initWhat == 'all',
						_initWhatIsTranslatable = _initWhat == 'translatable',
						_initWhenIsAlways = _initWhen == 'always',
						_initToIsBlank = _initTo == 'blank'
					;
					return Uize.Data.Diff.diff (
						_translatableLanguageStrings,
						_primaryLanguageStrings,
						function (_translatableLanguageString,_primaryLanguageString,_path) {
							_primaryLanguageString.path = _path;
							return (
								_translatableLanguageString &&
								(
									(
										_initWhatIsAll ||
										_initWhatIsTranslatable == _isTranslatableString (_primaryLanguageString)
									) &&
									(
										_initWhenIsAlways ||
										(_translatableLanguageString.value == null || _translatableLanguageString.value === '')
									)
										? (_initToIsBlank ? _blankStringPropertyObject : _primaryLanguageString)
										: _translatableLanguageString
								)
							);
						},
						{skeleton:true}
					);
				}
				/*?
					Static Methods
						Uize.Loc.Strings.Util.initValues
							Lets you initialize strings in a project resource strings object, with versatile options that make it possible to achieve a variety of different initialization behaviors.

							SYNTAX
							..........................................................
							initializedStringsOBJ = Uize.Loc.Strings.Util.initValues (
								translatableLanguageStringsOBJ,
								primaryLanguageStringsOBJ,
								initWhatSTR,
								initWhenSTR,
								initToSTR,
								isTranslatableStringFUNC
							);
							..........................................................

							NOTES
							- compare to the related =Uize.Loc.Strings.Util.initNonTranslatable= static method
				*/
			},

			removeEmptyStrings:function (_strings) {
				return Uize.Data.Diff.diff (
					_strings,
					{},
					function (_string) {return _string.value === '' ? undefined : _string}
				);
				/*?
					Static Methods
						Uize.Loc.Strings.Util.removeEmptyStrings
							Returns a new project resource strings object, being the specified project resource strings object with all empty strings removed.

							SYNTAX
							.........................................................................
							prunedStringsOBJ = Uize.Loc.Strings.Util.removeEmptyStrings (stringsOBJ);
							.........................................................................
				*/
			},

			pseudoLocalizeResources:function (_primaryLanguageResources,_isTranslatableString,_pseudoLocalizeString) {
				return Uize.Data.Diff.diff (
					_primaryLanguageResources,
					{},
					function (_string,_dummy,_path) {
						_string.path = _path;
						if (_isTranslatableString (_string))
							_string.value = _pseudoLocalizeString (_string)
						;
						return _string;
					},
					{skeleton:true}
				);
				/*?
					Static Methods
						Uize.Loc.Strings.Util.pseudoLocalizeResources
							Returns a new project resource strings object, being the specified project resource strings object with all translatable strings pseudo-localized.

							SYNTAX
							...........................................................................
							pseudoLocalizedStringsOBJ = Uize.Loc.Strings.Util.pseudoLocalizeResources (
								stringsOBJ,
								isTranslatableStringFUNC,
								pseudoLocalizeStringFUNC
							);
							...........................................................................
				*/
			},

			diffResources:function (_resourcesA,_resourcesB) {
				var _resourcesDiff = [];
				Uize.Data.Diff.diff (
					_resourcesA,
					_resourcesB,
					function (_resourcesAString,_resourcesBString,_path) {
						if (
							!_resourcesAString ||
							!_resourcesBString ||
							_resourcesAString.value !== _resourcesBString.value
						) {
							var
								_valueInA = (_resourcesAString || _sacredEmptyObject).value || '',
								_valueInB = (_resourcesBString || _sacredEmptyObject).value || ''
							;
							_resourcesDiff.push ({
								key:_path [_path.length - 1],
								path:_path.concat (),
								valueInA:_valueInA,
								valueInB:_valueInB,
								difference:!_resourcesAString || !_valueInA
									? 'missing in A'
									: !_resourcesBString || !_valueInB
										? 'missing in B'
										: 'different'
							});
						}
					}
				);
				return _resourcesDiff;
				/*?
					Static Methods
						Uize.Loc.Strings.Util.diffResources
							Returns a strings diff array, containing string diff objects for every string for which there are differences between the two specified project resource strings objects.

							SYNTAX
							.................................................................................
							stringsDiffARRAY = Uize.Loc.Strings.Util.diffResources (stringsAOBJ,stringsBOBJ);
							.................................................................................
				*/
			},

			resourcesDiffAsCsv:function (_resourcesDiff) {
				return Uize.Data.Csv.to (
					Uize.map (
						_resourcesDiff,
						function (_stringDiff) {
							var _path = _stringDiff.path;
							return [
								_path [0],
								_stringDiff.key,
								_toStringPath (_path),
								_stringDiff.difference,
								_stringDiff.valueInA,
								_stringDiff.valueInB
							];
						}
					),
					{
						hasHeader:true,
						columns:[
							'Resource File',
							'Key',
							'Path',
							'Difference',
							'Value in A',
							'Value in B'
						]
					}
				);
				/*?
					Static Methods
						Uize.Loc.Strings.Util.resourcesDiffAsCsv
							Returns a strings, being the specified strings diff array serialized to CSV format.

							SYNTAX
							..................................................................................
							stringsDiffAsCsvSTR = Uize.Loc.Strings.Util.resourcesDiffAsCsv (stringsDiffARRAY);
							..................................................................................
				*/
			}
		});
	}
});

