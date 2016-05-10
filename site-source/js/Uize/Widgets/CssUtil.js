/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.CssUtil Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 3
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Widgets.CssUtil= module provides utilities to facilitate ensuring standardized styling throughout the various built-in widgets of the UIZE JavaScript Framework.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widgets.CssUtil',
	builder:function () {
		'use strict';

		return Uize.package ({
			font:{
				family:'Arial, Helvetica, Verdana'
			},
			chrome:{
				bgColor: '#f4f4f4'
			},
			box:{
				border:{
					color:'#ccc',
					width:1,
					radius:2
				}
			},
			selectedValue:{
				color:'#fff',
				bgColor:'#ffa200'
			},
			sizes:{
				tiny:{
					sizeNo:1,
					font:12,
					outer:23
				},
				small:{
					sizeNo:2,
					font:13,
					outer:28
				},
				medium:{
					sizeNo:3,
					font:15,
					outer:38
				},
				large:{
					sizeNo:4,
					font:21,
					outer:51
				}
			},
			pseudoStroke:function (_color) {
				return (
					'text-shadow:' +
						[
							'-1px -1px 0 ' + _color,
							'0 -1px 0 ' + _color,
							'1px -1px 0 ' + _color,
							'-1px 0 0 ' + _color,
							'1px 0 0 ' + _color,
							'-1px 1px 0 ' + _color,
							'0 1px 0 ' + _color,
							'1px 1px 0 ' + _color,

							// and once more, just to make it stronger
							'-1px -1px 0 ' + _color,
							'0 -1px 0 ' + _color,
							'1px -1px 0 ' + _color,
							'-1px 0 0 ' + _color,
							'1px 0 0 ' + _color,
							'-1px 1px 0 ' + _color,
							'0 1px 0 ' + _color,
							'1px 1px 0 ' + _color
						].join (', ') +
					';'
				);
			}
		});
	}
});

