/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Parse.Xml.TagOrAttributeName Object
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2015 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Object
	importance: 4
	codeCompleteness: 100
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Parse.Xml.TagOrAttributeName= module provides methods for parsing and serializing tag names or attribute names of XML tags.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Parse.Xml.TagOrAttributeName',
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
					namespace:'',
					name:'',

					parse:function (_source,_index) {
						var
							m = this,
							_sourceLength = (m.source = _source = _source || '').length
						;
						m.index = _index || (_index = 0);
						m.namespace = m.name = '';
						m.isValid = false;
						if (_tagNameStartCharsLookup [_source.charAt (_index)]) {
							m.isValid = true;
							_index++;
							while (_index < _sourceLength && _tagNameContinueCharsLookup [_source.charAt (_index)])
								_index++
							;
							if (_source.charAt (_index) == ':') {
								m.namespace = _source.slice (m.index,_index);
								var _namePos = ++_index;
								if (_tagNameStartCharsLookup [_source.charAt (_index)]) {
									_index++;
									while (_index < _sourceLength && _tagNameContinueCharsLookup [_source.charAt (_index)])
										_index++
									;
									m.name = _source.slice (_namePos,_index);
								}
							} else {
								m.name = _source.slice (m.index,_index);
							}
							m.length = _index - m.index;
						}
					},

					serialize:function () {
						var m = this;
						return m.isValid ? (m.namespace + (m.namespace && ':') + m.name) : '';
					}
				}
			}
		);
	}
});

