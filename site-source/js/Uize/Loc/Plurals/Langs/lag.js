/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Loc.Plurals.Langs.lag Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2015 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 1
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Loc.Plurals.Langs.lag= module implements a feature for determining a plural category from a number value for the lag language.

		*DEVELOPERS:* `Chris van Rensburg`

		Plural Categories
			........................................................
			<< table >>

			title: Plural Categories
			data:
			:| Category | Rule |
			:| zero | n = 0 @integer 0 @decimal 0.0, 0.00, 0.000, 0.0000 |
			:| one | i = 0,1 and n != 0 @integer 1 @decimal 0.1~1.6 |
			:| other |  @integer 2~17, 100, 1000, 10000, 100000, 1000000, … @decimal 2.0~3.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, … |
			........................................................
*/

Uize.module ({
	name:'Uize.Loc.Plurals.Langs.lag',
	required:'Uize.Loc.Plurals.Util',
	builder:function () {
		'use strict';

		return Uize.package ({
			getPluralCategory:function (_value) {
				return Uize.Loc.Plurals.Util.getPluralCategory (
					_value,
					function (n,i,f,t,v,w,within) {
						return n == 0 ? 'zero' : within (i,[0,1]) && n != 0 ? 'one' : 'other';
					}
				);
			}
		});
	}
});

