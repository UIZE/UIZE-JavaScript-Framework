/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.TestData.AnimalsAndPlants
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*?
	Introduction
		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'UizeSite.TestData.AnimalsAndPlants',
	required:[
		'UizeSite.TestData.Animals',
		'UizeSite.TestData.Plants'
	],
	builder:function () {
		'use strict';

		var _cachedData;

		return function (_getCopy) {
			if (_cachedData && !_getCopy) return _cachedData;

			var _data = [
				{title:'Animals',items:UizeSite.TestData.Animals (true)},
				{title:'Plants',items:UizeSite.TestData.Plants (true)}
			];

			return _getCopy ? _data : (_cachedData = _data);
		};
	}
});

