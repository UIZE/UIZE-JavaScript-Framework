/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Util.Xml.TagName Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 4
	codeCompleteness: 1
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Util.Xml.TagName= module provides methods for parsing and serializing tag names of XML tags.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Util.Xml.TagName',
	builder:function () {
		'use strict';

		var
			/*** General Variables ***/
				_tagNameStartChars = '_abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
				_tagNameStartCharsLookup = _charsLookup (_tagNameStartChars),
				_tagNameContinueCharsLookup = _charsLookup (_tagNameStartChars + '-0123456789')
		;

		/*** Utility Functions ***/
			function _charsLookup (_charsStr) {
				return Uize.lookup (_charsStr.split (''));
			}

		return Uize.mergeInto (
			function (_source,_index) {
				this.parse (_source,_index);
			},
			{
				prototype:{
					source:'',
					index:0,
					length:0,
					isValid:false,
					name:'',

					parse:function (_source,_index) {
						var
							m = this,
							_sourceLength = (m.source = _source = _source || '').length
						;
						m.index = _index || (_index = 0);
						if (_tagNameStartCharsLookup [_source.charAt (_index)]) {
							_index++;
							while (_index < _sourceLength && _tagNameContinueCharsLookup [_source.charAt (_index)])
								_index++
							;
						}
						m.name = _source.slice (m.index,_index);
						m.isValid = !!(m.length = _index - m.index);
					},

					serialize:function () {
						return this.name;
					}
				}
			}
		);
	}
});

