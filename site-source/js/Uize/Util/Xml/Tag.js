/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Util.Xml.Tag Object
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Object
	importance: 4
	codeCompleteness: 1
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Util.Xml.Tag= module provides methods for parsing and serializing individual XML tags.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Util.Xml.Tag',
	required:[
		'Uize.Str.Whitespace',
		'Uize.Util.Xml.TagOrAttributeName',
		'Uize.Util.Xml.TagAttributes'
		// 'Uize.Util.Xml.NodeList'  // ISSUE: circular dependency
	],
	builder:function () {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_Uize_Util_Xml = Uize.Util.Xml,
				_indexOfNonWhitespace = Uize.Str.Whitespace.indexOfNonWhitespace
		;

		return Uize.mergeInto (
			function (_source,_index) {
				var m = this;
				m.tagName = new _Uize_Util_Xml.TagOrAttributeName;
				m.tagAttributes = new _Uize_Util_Xml.TagAttributes;
				m._childNodes = m.childNodes = new _Uize_Util_Xml.NodeList;
				m.parse (_source,_index);
			},

			{
				prototype:{
					source:'',
					index:0,
					length:0,
					isValid:false,

					parse:function (_source,_index) {
						function _eatWhitespace () {
							_index = (_indexOfNonWhitespace (_source,_index) + 1 || _sourceLength + 1) - 1;
						}
						var
							m = this,
							_sourceLength = (m.source = _source = _source || '').length
						;
						m.index = _index || (_index = 0);
						if (_source.charAt (_index) == '<') {
							_index++;
							_eatWhitespace ();
							m.tagName.parse (_source,_index);
							if (m.tagName.isValid) {
								_index += m.tagName.length;
								_eatWhitespace ();
								m.tagAttributes.parse (_source,_index);
								_index += m.tagAttributes.length;
								_eatWhitespace ();
								if (_source.charAt (_index) == '>') {
									_index++;
									m._childNodes.parse (_source,_index);
									_index += m._childNodes.length;
									_eatWhitespace ();
									var
										_closingTag = '</' + m.tagName.serialize () + '>',
										_closingTagLength = _closingTag.length
									;
									if (_source.substr (_index,_closingTagLength) == _closingTag)
										_index += _closingTagLength
									;
								} else if (_source.substr (_index,2) == '/>') {
									_index += 2;
									m._childNodes.parse ();
								}
							} else {
								_index = m.index;
							}
						};
						m.tag = _source.slice (m.index,_index);
						m.isValid = !!(m.length = _index - m.index);
					},

					serialize:function () {
						var m = this;
						if (m.isValid) {
							var
								_tagNameSerialized = m.tagName.serialize (),
								_tagAttributesSerialized = m.tagAttributes.serialize (),
								_childNodesSerialized = m._childNodes.serialize ()
							;
							return (
								'<' +
									_tagNameSerialized +
									(_tagAttributesSerialized && ' ') + _tagAttributesSerialized +
									(_childNodesSerialized ? '' : '/') +
								'>' +
								(
									_childNodesSerialized && (
										_childNodesSerialized +
										'</' + _tagNameSerialized + '>'
									)
								)
							);
						} else {
							return '';
						}
					}
				}
			}
		);
	}
});

