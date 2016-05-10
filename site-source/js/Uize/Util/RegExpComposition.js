/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Util.RegExpComposition Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 1
	codeCompleteness: 5
	docCompleteness: 5
*/

/*?
	Introduction
		The =Uize.Util.RegExpComposition= module provides a way to define regular expressions in a compositional way, by defining regular expressions to use other regular expressions.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Util.RegExpComposition',
	superclass:'Uize.Oop.BasicClass',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			constructor:Uize.noNew (
				function (_regExpLookup) {
					this._regExpLookup = _regExpLookup;
					this._resolved = {};
				}
			),

			instanceMethods:{
				get:function (_name) {
					var
						_regExpLookup = this._regExpLookup,
						_resolved = this._resolved
					;
					function _resolveRegularExpression (_regExpName) {
						if (!_resolved [_regExpName]) {
							var _regExp = _regExpLookup [_regExpName];
							_resolved [_regExpName] = new RegExp (
								_regExp.source.replace (
									/{([a-zA-Z_$][a-zA-Z_$\d]*)}/g,
									function (_match,_subRegExpName) {
										_resolveRegularExpression (_subRegExpName);
										return _resolved [_subRegExpName].source;
									}
								),
								'g'
							)
						}
					}
					_resolveRegularExpression (_name);

					return _resolved [_name];
				},

				extend:function (_regExpLookup) {
					return this.Class (Uize.copy (this._regExpLookup,_regExpLookup))
				}
			}
		});
	}
});

