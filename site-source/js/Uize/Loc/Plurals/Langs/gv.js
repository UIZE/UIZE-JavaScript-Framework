/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Loc.Plurals.Langs.gv Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2015 UIZE
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
		The =Uize.Loc.Plurals.Langs.gv= module implements a .

		*DEVELOPERS:* `Chris van Rensburg`

		Plural Categories
			........................................................
			<< table >>

			title: Plural Categories
			data:
			:| Category | Rule |
			:| one | n % 10 = 1 @integer 1, 11, 21, 31, 41, 51, 61, 71, 101, 1001, … @decimal 1.0, 11.0, 21.0, 31.0, 41.0, 51.0, 61.0, 71.0, 101.0, 1001.0, … |
			:| two | n % 10 = 2 @integer 2, 12, 22, 32, 42, 52, 62, 72, 102, 1002, … @decimal 2.0, 12.0, 22.0, 32.0, 42.0, 52.0, 62.0, 72.0, 102.0, 1002.0, … |
			:| few | n % 100 = 0,20,40,60 @integer 0, 20, 40, 60, 100, 120, 140, 160, 1000, 10000, 100000, 1000000, … @decimal 0.0, 20.0, 40.0, 60.0, 100.0, 120.0, 140.0, 160.0, 1000.0, 10000.0, 100000.0, 1000000.0, … |
			:| other |  @integer 3~10, 13~19, 23, 103, 1003, … @decimal 0.1~0.9, 1.1~1.7, 10.0, 100.1, 1000.1, … |
			........................................................
*/

Uize.module ({
	name:'Uize.Loc.Plurals.Langs.gv',
	required:'Uize.Loc.Plurals.Util',
	builder:function () {
		'use strict';

		return Uize.package ({
			getPluralCategory:function (_value) {
				return Uize.Loc.Plurals.Util.getPluralCategory (
					_value,
					function (n,i,f,t,v,w,within) {
						return n % 10 == 1 ? 'one' : n % 10 == 2 ? 'two' : within (n % 100,[0,20,40,60]) ? 'few' : 'other';
					}
				);
			}
		});
	}
});

