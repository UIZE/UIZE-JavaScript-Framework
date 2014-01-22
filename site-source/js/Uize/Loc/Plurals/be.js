/* Module Meta Data
	type: Class
	importance: 1
	codeCompleteness: 5
	docCompleteness: 5
*/

/*?
	Introduction
		The =Uize.Loc.Plurals.be= module implements a .

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Loc.Plurals.be',
	required:'Uize.Loc.Plurals.Util',
	builder:function () {
		'use strict';

		return Uize.package ({
			getPluralCategory:function (_value) {
				return Uize.Loc.Plurals.Util.getPluralCategory (
					_value,
					function (n,i,f,t,v,w,within) {
						return n % 10 == 1 && n % 100 != 11 ? 'one' : within (n % 10,[[2,4]]) && within (n % 100,[[12,14]]) ? 'few' : n % 10 == 0 || within (n % 10,[[5,9]]) || within (n % 100,[[11,14]]) ? 'many' : 'other';
					}
				);
			}
		});
	}
});

