/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Loc.Util.LocModuleCompiler Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2015 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 3
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Loc.Util.LocModuleCompiler= module provides a method for compiling UIZE loc modules (=.loc= files) to JavaScript modules.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Loc.Util.LocModuleCompiler',
	required:[
		'Uize.Build.Util',
		'Uize.Json',
		'Uize.Str.Split'
	],
	builder:function () {
		'use strict';

		var
			/*** Variables for Performance Optimization ***/
				_split = Uize.Str.Split.split,

			/*** General Variables ***/
				_tokenRegExp = /\[\[([^\[\]]+)\]\]/
		;

		return Uize.package ({
			compile:function (_moduleName,_source,_locale) {
				function _compileTokenizedStringExpression (_string) {
					var _expressionParts = [];
					Uize.forEach (
						_split (_string,_tokenRegExp),
						function (_segment,_segmentNo) {
							var _segmentIsToken = _segmentNo % 2;
							if (_segmentIsToken || _segment)
								_expressionParts.push (
									(_segmentIsToken ? 'i [' : '') +
									Uize.Json.to (_segment) +
									(_segmentIsToken ? ']' : '')
								)
							;
						}
					);
					return _expressionParts.join (' + ');
				}
				var
					_strings = Uize.Build.Util.readSimpleDataFile (_source),
					_required = [],
					_pluralsModuleRequired,
					_pluralsModuleName = 'Uize.Loc.Plurals.Langs.' + Uize.capFirstChar (_locale.replace (/[\-_].+$/,'')),
					_builder = [
						'function () {',
						'	return {',
							Uize.map (
								Uize.keys (_strings),
								function (_key) {
									var _stringValue = _strings [_key];
									if (Uize.isPlainObject (_stringValue)) {
										var
											_pluralCategories = Uize.keys (_stringValue),
											_specialCasesLookup = {}
										;
										Uize.forEach (
											_pluralCategories,
											function (_pluralCategory) {
												if (Uize.isNumber (+_pluralCategory))
													_specialCasesLookup [_pluralCategory] = 1
												;
											}
										);
										_stringValue = [].concat (
											'function (i) {',
											'			var n = Uize.Loc.Plurals.Util.resolveValue (i);',
											'			switch (' + Uize.Json.to (_specialCasesLookup,'mini') + '.hasOwnProperty (n) ? n + \'\' : ' + _pluralsModuleName + '.getPluralCategory (n)) {',
											Uize.map (
												_pluralCategories,
												function (_pluralCategory) {
													return (
														'				' +
														'\'' + _pluralCategory + '\': return ' +
														_compileTokenizedStringExpression (_stringValue [_pluralCategory]) + ';'
													);
												}
											),
											'			}',
											'		}'
										).join ('\n');
										if (!_pluralsModuleRequired) {
											_required.push ('Uize.Loc.Plurals.Util',_pluralsModuleName);
											_pluralsModuleRequired = true;
										}
									} else if (_tokenRegExp.test (_stringValue)) {
										_stringValue =
											'function (i) {return ' + _compileTokenizedStringExpression (_stringValue) + '}'
										;
									} else {
										_stringValue = Uize.Json.to (_stringValue);
									}
									return '		' + Uize.Json.to ('loc_' + _key) + ':' + _stringValue;
								}
							).join (',\n'),
						'	};',
						'}'
					].join ('\n')
				;

				return Uize.Build.Util.moduleAsText ({
					name:_moduleName,
					required:_required,
					builder:_builder
				});
			}
		});
	}
});

