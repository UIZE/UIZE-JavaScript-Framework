/* Module Meta Data
	type: Class
	importance: 1
	codeCompleteness: 5
	docCompleteness: 5
*/

/*?
	Introduction
		The =Uize.Loc.Plurals.pl= module implements a .

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Loc.Plurals.pl',
	required:'Uize.Loc.Plurals.Util',
	builder:function () {
		'use strict';

		return Uize.package ({
			getPluralCategory:function (_value) {
				return Uize.Loc.Plurals.Util.getPluralCategory (
					_value,
					function (n,i,f,t,v,w,within) {
						return i == 1 && v == 0 ? 'one' : v == 0 && within (i % 10,[[2,4]]) && within (i % 100,[[12,14]]) ? 'few' : v == 0 && i != 1 && within (i % 10,[[0,1]]) || v == 0 && within (i % 10,[[5,9]]) || v == 0 && within (i % 100,[[12,14]]) ? 'many' : 'other';
					}
				);
			}
		});
	}
});

