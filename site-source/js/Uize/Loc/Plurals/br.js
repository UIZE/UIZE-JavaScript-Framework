/* Module Meta Data
	type: Class
	importance: 1
	codeCompleteness: 5
	docCompleteness: 5
*/

/*?
	Introduction
		The =Uize.Loc.Plurals.br= module implements a .

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Loc.Plurals.br',
	required:'Uize.Loc.Plurals.Util',
	builder:function () {
		'use strict';

		return Uize.package ({
			getPluralCategory:function (_value) {
				return Uize.Loc.Plurals.Util.getPluralCategory (
					_value,
					function (n,i,f,t,v,w,within) {
						return n % 10 == 1 && within (n % 100,[11,71,91]) ? 'one' : n % 10 == 2 && within (n % 100,[12,72,92]) ? 'two' : within (n % 10,[[3,4],9]) && within (n % 100,[[10,19],[70,79],[90,99]]) ? 'few' : n != 0 && n % 1000000 == 0 ? 'many' : 'other';
					}
				);
			}
		});
	}
});

