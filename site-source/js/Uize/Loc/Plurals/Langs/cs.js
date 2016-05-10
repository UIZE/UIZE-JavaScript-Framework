/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Loc.Plurals.Langs.cs Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2015-2016 UIZE
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
		The =Uize.Loc.Plurals.Langs.cs= module implements a feature for determining a plural category from a number value for the cs language.

		*DEVELOPERS:* `Chris van Rensburg`

		Plural Categories
			........................................................
			<< table >>

			title: Plural Categories
			data:
			:| Category | Rule |
			:| one | i = 1 and v = 0 @integer 1 |
			:| few | i = 2..4 and v = 0 @integer 2~4 |
			:| many | v != 0   @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, … |
			:| other |  @integer 0, 5~19, 100, 1000, 10000, 100000, 1000000, … |
			........................................................
*/

Uize.module ({
	name:'Uize.Loc.Plurals.Langs.cs',
	required:'Uize.Loc.Plurals.Util',
	builder:function () {
		'use strict';

		return Uize.package ({
			getPluralCategory:function (_value) {
				return Uize.Loc.Plurals.Util.getPluralCategory (
					_value,
					function (n,i,f,t,v,w,within) {
						return i == 1 && v == 0 ? 'one' : within (i,[[2,4]]) && v == 0 ? 'few' : v != 0 ? 'many' : 'other';
					}
				);
			}
		});
	}
});

