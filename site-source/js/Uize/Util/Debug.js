/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Util.Debug Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2008-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 1
	codeCompleteness: 10
	docCompleteness: 5
*/

/*?
	Introduction
		The =Uize.Util.Debug= package provides convenience methods to aid in debugging code during development.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Util.Debug',
	required:'Uize.Util.Oop',
	builder:function () {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_package,
				_undefined,
				_Uize = Uize,
				_Uize_Util_Oop = _Uize.Util.Oop
		;

		return _package = Uize.package ({
			typeSummary:function (m) {
				return (
					'[' +
						(
							m == _undefined
								? m
								: (
									(
										_Uize.isPrimitive (m)
											? 'primitive'
											: m && m.moduleName
												? (_Uize_Util_Oop.isUizeClass (m) ? 'class' : 'package')
												: 'object'
									) +
									' ' + (_Uize_Util_Oop.getClassName (_Uize_Util_Oop.resolveToClass (m)) || 'Function')
								)
						) +
					']'
				);
			},

			summary:function (m) {
				var _summaryDetails = '';
				if (_Uize_Util_Oop.isUizeClass (m) || _Uize_Util_Oop.isUizeClassInstance (m)) {
					var _propertiesLines = [];
					_Uize.forEach (
						m.get (),
						function (_propertyValue,_propertyName) {
							_propertiesLines.push (
								_propertyName + ' : ' +
								(
									_propertyValue == _undefined || _Uize.isPrimitive (_propertyValue)
										? _propertyValue
										: _package.typeSummary (_propertyValue)
								)
							);
						}
					);
					_summaryDetails = _propertiesLines.sort ().join ('\n');
				}
				return (
					_package.typeSummary (m) +
					(_summaryDetails && '\n\n') +
					_summaryDetails
				);
			}
		});
	}
});

