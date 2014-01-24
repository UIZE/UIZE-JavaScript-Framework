/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Build.PluralsModules Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 3
	codeCompleteness: 100
	docCompleteness: 4
*/

/*?
	Introduction
		The =Uize.Build.PluralsModules= build script builds plural rules modules for various languages, as defined by the [[http://unicode.org/repos/cldr-tmp/trunk/diff/supplemental/language_plural_rules.html][CLDR plural rules]].

		*DEVELOPERS:* `Chris van Rensburg`

		EXAMPLE
		..........................................................................................
		node build.js Uize.Build.PluralsModules pluralRules=../cldr/json/supplemental/plurals.json
		..........................................................................................
*/

Uize.module ({
	name:'Uize.Build.PluralsModules',
	required:[
		'Uize.Services.FileSystem',
		'Uize.Json',
		'Uize.Loc.Plurals.RuleParser',
		'Uize.Loc.Plurals.ModuleTemplate'
	],
	builder:function () {
		'use strict';

		return Uize.package ({
			perform:function (_params) {
				var
					_fileSystem = Uize.Services.FileSystem.singleton (),
					_pluralRules = Uize.Json.from (_fileSystem.readFile ({path:_params.pluralRules})),
					_modulesPath = _params.uizePath + '/' + _params.modulesFolder + '/'
				;
				Uize.forEach (
					_pluralRules.supplemental ['plurals-type-cardinal'],
					function (_languagePlurals,_language) {
						var
							_pluralRulesMap = {},
							_prefixRegExp = /^pluralRule-count-/
						;
						Uize.forEach (
							_languagePlurals,
							function (_pluralRule,_pluralRuleName) {
								_pluralRulesMap [_pluralRuleName.replace (_prefixRegExp,'')] = _pluralRule;
							}
						);
						_fileSystem.writeFile ({
							path:_modulesPath + Uize.modulePathResolver ('Uize.Loc.Plurals.' + _language) + '.js',
							contents:Uize.Loc.Plurals.ModuleTemplate.process ({
								namespace:'Uize.Loc.Plurals',
								language:_language,
								pluralRules:_pluralRulesMap,
								pluralRulesFunction:Uize.Loc.Plurals.RuleParser.rulesToJsFunctionStr (_pluralRulesMap)
							})
						});
					}
				);
			}
		});
	}
});

