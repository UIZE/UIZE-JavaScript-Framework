/* Module Meta Data
	type: Class
	importance: 1
	codeCompleteness: 5
	docCompleteness: 5
*/

/*?
	Introduction
		The =Uize.Loc.Plurals.lv= module implements a .

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Loc.Plurals.lv',
	required:'Uize.Loc.Plurals.Util',
	builder:function () {
		'use strict';

		return Uize.package ({
			getPluralCategory:function (_value) {
				return Uize.Loc.Plurals.Util.getPluralCategory (
					_value,
					function (n,i,f,t,v,w,within) {
						return n % 10 == 0 || within (n % 100,[[11,19]]) || v == 2 && within (f % 100,[[11,19]]) ? 'zero' : n % 10 == 1 && n % 100 != 11 || v == 2 && f % 10 == 1 && f % 100 != 11 || v != 2 && f % 10 == 1 ? 'one' : 'other';
					}
				);
			}
		});
	}
});

