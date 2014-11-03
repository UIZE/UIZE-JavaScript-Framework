/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Loc.Strings.Util Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014 UIZE
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
		'Uize.Json'
	],
	builder:function () {
		'use strict';

		var
			/*** General Variables ***/
				_blankStringPropertyObject = {value:''}
		;

		return Uize.package ({
			initNonTranslatable:function (
				_translatableLanguageStrings,_primaryLanguageStrings,_initNonTranslatable,_isTranslatableString
			) {
				if (_initNonTranslatable == 'never') {
					return _translatableLanguageStrings;
				} else {
					var
						_initNonTranslatableToPrimaryIfBlank =
							!_initNonTranslatable || _initNonTranslatable == 'primary-if-blank',
						_initNonTranslatableToPrimary = _initNonTranslatable == 'primary'
					;
					return Uize.Data.Diff.diff (
						_translatableLanguageStrings,
						_primaryLanguageStrings,
						function (_translatableLanguageString,_primaryLanguageString) {
							return (
								_translatableLanguageString &&
								(
									_initNonTranslatableToPrimaryIfBlank
										? (
											!_translatableLanguageString.value &&
											!_isTranslatableString (_primaryLanguageString)
												? _primaryLanguageString
												: _translatableLanguageString
										)
										: (
											_isTranslatableString (_primaryLanguageString)
												? _translatableLanguageString
												: _initNonTranslatableToPrimary
													? _primaryLanguageString
													: _blankStringPropertyObject
										)
								)
							);
						},
						{skeleton:true}
					);
				}
			},

			serializeStringPath:function (_path) {
				return Uize.Json.to (_path,'mini');
			},

			parseStringPath:Uize.Json.from,

			removeEmptyStrings:function (_strings) {
				return Uize.Data.Diff.diff (
					_strings,
					{},
					function (_string) {return _string.value === '' ? undefined : _string}
				);
			}
		});
	}
});

