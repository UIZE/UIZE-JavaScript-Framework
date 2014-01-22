/* Module Meta Data
	type: Class
	importance: 1
	codeCompleteness: 5
	docCompleteness: 5
*/

/*?
	Introduction
		The =Uize.Loc.Plurals.lt= module implements a .

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Loc.Plurals.lt',
	required:'Uize.Loc.Plurals.Util',
	builder:function () {
		'use strict';

		return Uize.package ({
			getPluralCategory:function (_value) {
				return Uize.Loc.Plurals.Util.getPluralCategory (
					_value,
					function (n,i,f,t,v,w,within) {
						return n % 10 == 1 && within (n % 100,[[11,19]]) ? 'one' : within (n % 10,[[2,9]]) && within (n % 100,[[11,19]]) ? 'few' : f != 0 ? 'many' : 'other';
					}
				);
			}
		});
	}
});

