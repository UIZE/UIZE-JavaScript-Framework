/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Parse.Xml.Tag Object
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
		The =Uize.Parse.Xml.Tag= module provides methods for parsing and serializing individual XML tags.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Parse.Xml.Tag',
	required:[
		'Uize.Str.Whitespace',
		'Uize.Parse.Xml.TagOrAttributeName',
		'Uize.Parse.Xml.TagAttributes'
		// 'Uize.Parse.Xml.NodeList'  // ISSUE: circular dependency
	],
	builder:function () {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_undefined,
				_Uize_Util_Xml = Uize.Parse.Xml,
				_indexOfNonWhitespace = Uize.Str.Whitespace.indexOfNonWhitespace
		;

		return Uize.mergeInto (
			function (_source,_index) {
				var m = this;
				m.tagName = new _Uize_Util_Xml.TagOrAttributeName;
				m.tagAttributes = new _Uize_Util_Xml.TagAttributes;
				m.childNodes = _undefined;
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
									m.childNodes = new _Uize_Util_Xml.NodeList (_source,++_index);
									_index += m.childNodes.length;
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
									m.childNodes = _undefined;
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
								_childNodes = m.childNodes
							;
							return (
								'<' +
									_tagNameSerialized +
									(_tagAttributesSerialized && ' ') + _tagAttributesSerialized +
									(_childNodes ? '' : '/') +
								'>' +
								(_childNodes ? (_childNodes.serialize () + '</' + _tagNameSerialized + '>') : '')
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

