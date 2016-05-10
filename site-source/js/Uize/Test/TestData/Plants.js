/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.TestData.Plants
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
	name:'Uize.Test.TestData.Plants',
	builder:function () {
		'use strict';

		var _cachedData;

		return function (_getCopy) {
			if (_cachedData && !_getCopy) return _cachedData;

			var _data = [
				{
					title:'Garden Flowers',
					items:[
						{
							title:'Flowering Annuals',
							items:[
								{title:'Calendula'},
								{title:'Carnations'},
								{title:'Cosmos'},
								{title:'Pansies'},
								{title:'Petunia'},
								{title:'Viola'}
							]
						},
						{
							title:'Flowering Bulbs',
							items:[
								{title:'Gladiolus'},
								{title:'Iris'},
								{title:'Lily'},
								{title:'Ranunculus'},
								{title:'Tulip'}
							]
						},
						{
							title:'Flowering Perennials',
							items:[
								{title:'Artemisia'},
								{title:'Begonia'},
								{title:'Columbine'},
								{title:'Foxglove'},
								{title:'Gypsophila'},
								{title:'Japanese Anemone'},
								{title:'Helianthus'},
								{title:'Pelargonium'},
								{title:'Salvia'}
							]
						}
					]
				},
				{
					title:'Bushes and Shrubs',
					items:[
						{
							title:'Hedges',
							items:[
								{title:'Boxwood'},
								{title:'Dogwood'},
								{title:'Escallonia'},
								{title:'Euonmymous'},
								{title:'Holly'},
								{title:'Pyracantha'},
								{title:'Viburnum'},
								{title:'Wax Leaf Privet'}
							]
						},
						{
							title:'Accent',
							items:[
								{title:'Desert Spoon'},
								{title:'Octopus Agave'},
								{title:'Red Yucca'},
								{title:'Smooth Edged Agave'}
							]
						}
					]
				},
				{title:'-'},
				{
					title:'Trees',
					items:[
						{
							title:'Deciduous',
							items:[
								{title:'Birch'},
								{title:'Gum Tree'},
								{title:'Laburnum'},
								{title:'Mountain Ash'},
								{title:'Oak'},
								{title:'Poplar'},
								{title:'Wild Cherry'}
							]
						},
						{
							title:'Evergreen',
							items:[
								{title:'Arbutus'},
								{title:'Buxus'},
								{title:'Eucalyptus'},
								{title:'Fir'},
								{title:'Pine'},
								{title:'Spruce'}
							]
						}
					]
				},
				{
					title:'Other',
					items:[
						{
							title:'Ferns',
							items:[
								{title:'Bracken'},
								{title:'Maiden Hair Fern'},
								{title:'Monkey Tail Fern'},
								{title:'Mother Fern'},
								{title:'Sword Fern'},
								{title:'Tree Fern'}
							]
						},
						{
							title:'Palms',
							items:[
								{title:'King Palm'},
								{title:'Mediterranean Fan Palm'},
								{title:'Pineapple Palm'},
								{title:'Pygmy Date Palm'},
								{title:'Queen Palm'},
								{title:'Windmill Palm'}
							]
						}
					]
				}
			];

			return _getCopy ? _data : (_cachedData = _data);
		};
	}
});

