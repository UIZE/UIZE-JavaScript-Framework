/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.mLoc Mixin
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Mixin
	importance: 6
	codeCompleteness: 2
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Widget.mLoc= mixin module implements features to facilitate the creation of localized widget classes.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widget.mLoc',
	builder:function () {
		'use strict';

		var _localeStringsLookup = {};

		/*** Utility Methods ***/
			function _needLocaleStrings (_module,_locale,_callback) {
				if (_module) {
					var
						_moduleName = _module.moduleName,
						_localeStringsId = _moduleName + ':' + _locale
					;
					if (_localeStringsLookup [_localeStringsId]) {
						_callback (_localeStringsLookup [_localeStringsId]);
					} else {
						_needLocaleStrings (
							_module.superclass,
							_locale,
							function (_inheritedLocaleStrings) {
								function _setLocaleStringsAndProvide (_moduleLocaleStrings) {
									_callback (
										_localeStringsLookup [_localeStringsId] = Uize.copy (
											_inheritedLocaleStrings,
											_moduleLocaleStrings
										)
									);
								}
								if (_module.mLoc_hasLoc) {
									var
										_isPseudoLocale = _locale == 'en-ZZ',
										_locModuleNamespace = _moduleName.replace (/\.Widget$/,'.Loc.')
									;
									_isPseudoLocale
										? Uize.require (
											['Uize.Loc.Pseudo',_locModuleNamespace + 'en_US'],
											function (_Uize_Loc_Pseudo,_moduleLocaleStrings) {
												_setLocaleStringsAndProvide (
													Uize.map (
														_moduleLocaleStrings,
														function (_value) {return _Uize_Loc_Pseudo.pseudoLocalize (_value)}
													)
												);
											}
										)
										: Uize.require (
											_locModuleNamespace + _locale.replace ('-','_'),
											_setLocaleStringsAndProvide
										)
									;
								} else {
									_setLocaleStringsAndProvide ();
								}
							}
						);
					}
				} else {
					_callback ({});
				}
			}

		return function (_class) {
			_class.declare ({
				instanceMethods:{
					loc:function (_resourceId,_inputs) {
						return this.get ('loc_' + _resourceId) (_inputs);
					}
				},

				treeInheritedStateProperties:{
					locale:{value:'en-US'}
				},

				staticMethods:{
					hasLoc:function (_hasLoc) {
						this.nonInheritableStatics.mLoc_hasLoc = 1;
						this.mLoc_hasLoc = _hasLoc;
					}
				},

				stateProperties:{
					localeInherited:{
						onChange:function () {
							var m = this;
							_needLocaleStrings (m.Class,m.localeInherited,function (_localeStrings) {m.set (_localeStrings)});
						}
					}
				}
			});
		};
	}
});

