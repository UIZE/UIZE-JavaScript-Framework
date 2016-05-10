/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Loc.FileFormats.ProjectStrings.Util Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 1
	codeCompleteness: 100
	docCompleteness: 5
*/

/*?
	Introduction
		The =Uize.Loc.FileFormats.ProjectStrings.Util= module provides utility methods for working with project strings objects, in the context of representing the resource strings of a project using different file formats.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Loc.FileFormats.ProjectStrings.Util',
	required:[
		'Uize.Data.Flatten',
		'Uize.Loc.Strings.StringPath'
	],
	builder:function () {
		'use strict';

		return Uize.package ({
			flatten:function (_unflattenedStrings) {
				return Uize.Data.Flatten.flatten (
					_unflattenedStrings,
					Uize.Loc.Strings.StringPath.to,
					false,
					true
				);
			},

			unflatten:function (_flattenedStrings) {
				return Uize.Data.Flatten.unflatten (
					_flattenedStrings,
					Uize.Loc.Strings.StringPath.from,
					true
				);
			}
		});
	}
});

