/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Str.Indented Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2015-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 1
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Str.Indented= module provides methods for working with multi-line strings, supporting indenting, changing linebreaks, modifying lines, etc.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Str.Indented',
	required:'Uize.Str.Lines',
	builder:function () {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_undefined,
				_indent = Uize.Str.Lines.indent,
				_isNumber = Uize.isNumber,

			/*** General Variables ***/
				_sacredEmptyObject = {}
		;

		/*** Utility Functions ***/
			function _resolveEncodingOptions (_encodingOptions) {
				return (
					_encodingOptions == _undefined
						? _sacredEmptyObject
						: Uize.isNumber (_encodingOptions)
							? {indentAmount:_encodingOptions}
							: _encodingOptions
				);
			}

		return Uize.package ({
			from:function (_toDecode,_encodingOptions) {
				_encodingOptions = _resolveEncodingOptions (_encodingOptions);
				var _amount = _encodingOptions.amount;
				return _indent (
					_toDecode,
					-(_amount == _undefined ? Infinity : +_amount || 0),
					_encodingOptions.chars
				);
			},

			to:function (_toEncode,_encodingOptions) {
				_encodingOptions = _resolveEncodingOptions (_encodingOptions);
				return _indent (
					_toEncode,
					_encodingOptions.amount,
					_encodingOptions.chars,
					!!_encodingOptions.firstLine
				);
			}
		});
	}
});

