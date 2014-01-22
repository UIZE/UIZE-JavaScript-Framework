/* Module Meta Data
	type: Class
	importance: 1
	codeCompleteness: 5
	docCompleteness: 5
*/

/*?
	Introduction
		The =Uize.Loc.Plurals.ar= module implements a .

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Loc.Plurals.ar',
	required:'Uize.Loc.Plurals.Util',
	builder:function () {
		'use strict';

		return Uize.package ({
			getPluralCategory:function (_value) {
				return Uize.Loc.Plurals.Util.getPluralCategory (
					_value,
					function (n,i,f,t,v,w,within) {
						return n == 0 ? 'zero' : n == 1 ? 'one' : n == 2 ? 'two' : within (n % 100,[[3,10]]) ? 'few' : within (n % 100,[[11,99]]) ? 'many' : 'other';
					}
				);
			}
		});
	}
});

