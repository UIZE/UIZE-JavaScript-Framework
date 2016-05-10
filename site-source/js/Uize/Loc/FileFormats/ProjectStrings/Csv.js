/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Loc.FileFormats.ProjectStrings.Csv Package
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
		The =Uize.Loc.FileFormats.ProjectStrings.Csv= module provides support for representing the resource strings for an entire project using the CSV file format.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Loc.FileFormats.ProjectStrings.Csv',
	required:[
		'Uize.Data.NameValueRecords',
		'Uize.Loc.FileFormats.ProjectStrings.Util',
		'Uize.Data.Csv'
	],
	builder:function () {
		'use strict';

		return Uize.package ({
			to:function (_toEncode) {
				return Uize.Data.Csv.to (
					Uize.Data.NameValueRecords.fromHash (
						Uize.Loc.FileFormats.ProjectStrings.Util.flatten (_toEncode),
						0,
						1
					)
				);
			},

			from:function (_toDecode) {
				return Uize.Loc.FileFormats.ProjectStrings.Util.unflatten (
					Uize.Data.NameValueRecords.toHash (Uize.Data.Csv.from (_toDecode),0,1)
				);
			}
		});
	}
});

