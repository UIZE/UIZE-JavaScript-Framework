/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.TestData.Animals
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2007-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*?
	Introduction
		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.TestData.Animals',
	builder:function () {
		'use strict';

		var _cachedData;

		return function (_getCopy) {
			if (_cachedData && !_getCopy) return _cachedData;

			var _data = [
				{
					title:'Pets',
					items:[
						{
							title:'Dogs',
							items:[
								{
									title:'Small Breeds',
									items:[
										{title:'West Highland White'},
										{title:'Mexican Hairless'},
										{title:'Miniature Chihuahua'},
										{title:'Teacup Poodle'}
									]
								},
								{
									title:'Large Breeds',
									items:[
										{title:'Afghan'},
										{title:'Great Dane'},
										{title:'Irish Wolfhound'},
										{title:'St. Bernard'}
									]
								}
							]
						},
						{
							title:'Cats',
							items:[
								{title:'Persian'},
								{title:'Siamese'},
								{title:'Hairless'}
							]
						},
						{
							title:'Other',
							items:[
								{title:'Bunny'},
								{title:'Hamster'},
								{title:'Mouse'},
								{title:'Rat'}
							]
						}
					]
				},
				{
					title:'Wild Animals',
					items:[
						{
							title:'Dogs',
							items:[
								{title:'Coyote'},
								{title:'Dingo'}
							]
						},
						{
							title:'Cats',
							items:[
								{title:'Bobcat'},
								{title:'Cheetah'},
								{title:'Leopard'},
								{title:'Lion'},
								{title:'Lynx'},
								{title:'Mountain Lion'},
								{title:'Tiger'}
							]
						},
						{
							title:'Other',
							items:[
								{title:'Aardvark'},
								{title:'Elephant'},
								{title:'Hedgehog'},
								{title:'Opossum'},
								{title:'Water Buffalo'},
								{title:'Wildebeest'},
								{title:'Wild Boar'},
								{title:'Zebra'}
							]
						}
					]
				}
			];

			return _getCopy ? _data : (_cachedData = _data);
		};
	}
});

