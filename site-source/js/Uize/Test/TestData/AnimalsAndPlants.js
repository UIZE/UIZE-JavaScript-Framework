/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.TestData.AnimalsAndPlants
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*?
	Introduction
		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.TestData.AnimalsAndPlants',
	required:[
		'Uize.Test.TestData.Animals',
		'Uize.Test.TestData.Plants'
	],
	builder:function () {
		'use strict';

		var _cachedData;

		return function (_getCopy) {
			if (_cachedData && !_getCopy) return _cachedData;

			var _data = [
				{title:'Animals',items:Uize.Test.TestData.Animals (true)},
				{title:'Plants',items:Uize.Test.TestData.Plants (true)}
			];

			return _getCopy ? _data : (_cachedData = _data);
		};
	}
});

