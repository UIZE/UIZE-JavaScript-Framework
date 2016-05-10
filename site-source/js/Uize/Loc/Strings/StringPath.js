/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Loc.Strings.StringPath Package
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
		The =Uize.Loc.Strings.StringPath= module provides methods for serializing to and parsing from string path values.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Loc.Strings.StringPath',
	required:'Uize.Json',
	builder:function () {
		'use strict';

		return Uize.package ({
			to:function (_path) {
				return Uize.Json.to (_path,'mini');
				/*?
					Static Methods
						Uize.Loc.Strings.StringPath.to
							Returns a string, representing the serialized form of the specified string path array.

							SYNTAX
							...........................................................................
							serializedStringPathSTR = Uize.Loc.Strings.StringPath.to (stringPathARRAY);
							...........................................................................

							NOTES
							- see the companion =Uize.Loc.Strings.StringPath.from= static method
				*/
			},

			from:Uize.Json.from
				/*?
					Static Methods
						Uize.Loc.Strings.StringPath.from
							Returns an array, representing the string path array parsed from the specified serialized string path.

							SYNTAX
							.............................................................................
							stringPathARRAY = Uize.Loc.Strings.StringPath.from (serializedStringPathSTR);
							.............................................................................

							NOTES
							- see the companion =Uize.Loc.Strings.StringPath.to= static method
				*/
		});
	}
});

