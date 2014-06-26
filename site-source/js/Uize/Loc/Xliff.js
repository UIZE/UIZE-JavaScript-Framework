/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Loc.Xliff Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014 UIZE
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
		The =Uize.Loc.Xliff= module provides methods to serialize a resource strings object to XLIFF format and parse a resource strings object from XLIFF format.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Loc.Xliff',
	required:[
		'Uize.Util.Html.Encode',
		'Uize.Data.Flatten',
		'Uize.Json'
	],
	builder:function () {
		'use strict';

		var
			/*** Variable for Performance Optimization ***/
				_htmlEncode = Uize.Util.Html.Encode.encode
		;

		return Uize.package ({
			to:function (_toEncode) {
				var _xliffLines = [
					'<?xml version="1.0" ?>',
					'<xliff version="1.0">'
				];
				Uize.forEach (
					_toEncode.strings,
					function (_resourceFileStrings,_resourceFileSubPath) {
						_xliffLines.push (
							'\t<file ' +
								'original="' + _htmlEncode (_resourceFileSubPath) + '" ' +
								'source-language="' + _toEncode.sourceLanguage + '" ' +
								'target-language="' + _toEncode.targetLanguage + '" ' +
								'datatype="plaintext"' +
							'>'
						);
						Uize.forEach (
							Uize.Data.Flatten.flatten (
								_resourceFileStrings,
								function (_path) {return Uize.Json.to (_path,'mini')}
							),
							function (_resourceStringText,_id) {
								_xliffLines.push (
									'\t\t<trans-unit id="' + _htmlEncode (_id) + '">',
									'\t\t\t<source>' + _htmlEncode (_resourceStringText) + '</source>',
									'\t\t\t<target></target>',
									'\t\t</trans-unit>'
								);
							}
						);
						_xliffLines.push (
							'\t</file>'
						);
					}
				);
				_xliffLines.push ('</xliff>');
				return _xliffLines.join ('\n');
			},

			from:function (_toDecode) {
			}
		});
	}
});

