/* Module Meta Data
	type: Class
	importance: 1
	codeCompleteness: 5
	docCompleteness: 5
*/

/*?
	Introduction
		The =Uize.Loc.Plurals.hr= module implements a .

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Loc.Plurals.hr',
	required:'Uize.Loc.Plurals.Util',
	builder:function () {
		'use strict';

		return Uize.package ({
			getPluralCategory:function (_value) {
				return Uize.Loc.Plurals.Util.getPluralCategory (
					_value,
					function (n,i,f,t,v,w,within) {
						return v == 0 && i % 10 == 1 && i % 100 != 11 || f % 10 == 1 && f % 100 != 11 ? 'one' : v == 0 && within (i % 10,[[2,4]]) && within (i % 100,[[12,14]]) || within (f % 10,[[2,4]]) && within (f % 100,[[12,14]]) ? 'few' : 'other';
					}
				);
			}
		});
	}
});

