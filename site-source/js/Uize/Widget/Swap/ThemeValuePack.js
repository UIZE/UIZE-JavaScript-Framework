/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Swap.ThemeValuePack Class Extension
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2015-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 1
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Widget.Swap.ThemeValuePack= module provides a way to convert between a theme oject and a theme value pack for the =Uize.Widget.Swap= widget.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widget.Swap.ThemeValuePack',
	required:'Uize.Data.ValuePack',
	builder:function () {
		'use strict';

		var
			/*** General Variables ***/
				_valuePack = Uize.Data.ValuePack ({
					archetype:{
						crossFade:true,
						crossFadeSize:0,
						crossFadeAlign:.5,
						dissolve:true,
						viewContentAlignX:'none',
						viewContentAlignY:'none',
						viewSeedSizeX:1,
						viewSeedSizeY:1,
						viewSeedAlignX:.5,
						viewSeedAlignY:.5
					}
				})
		;

		return Uize.package ({
			to:function (_toEncode) {
				return _valuePack.pack (_toEncode);
			},

			from:function (_toDecode) {
				return _valuePack.unpack (_toDecode);
			}
		});
	}
});

