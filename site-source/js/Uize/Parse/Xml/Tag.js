/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Parse.Xml.Tag Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 4
	codeCompleteness: 100
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Parse.Xml.Tag= module provides methods for parsing and serializing individual XML tags.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Parse.Xml.Tag',
	superclass:'Uize.Parse.Base',
	required:[
		'Uize.Str.Whitespace',
		'Uize.Parse.Xml.TagOrAttributeName',
		'Uize.Parse.Xml.TagAttributes'
		// 'Uize.Parse.Xml.NodeList'  // ISSUE: circular dependency
	],
	builder:function (_superclass) {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_undefined,
				_Uize_Util_Xml = Uize.Parse.Xml,
				_indexOfNonWhitespace = Uize.Str.Whitespace.indexOfNonWhitespace
		;

		return _superclass.subclass ({
			constructor:function () {
				var m = this;
				m.tagName = new _Uize_Util_Xml.TagOrAttributeName;
				m.tagAttributes = new _Uize_Util_Xml.TagAttributes;
				m.childNodes = _undefined;
				_superclass.apply (m,arguments);
			},

			instanceMethods:{
				parse:function (_source,_index) {
					function _eatWhitespace () {
						_index = (_indexOfNonWhitespace (_source,_index) + 1 || _sourceLength + 1) - 1;
					}
					var
						m = this,
						_sourceLength = (m.source = _source).length
					;
					m.index = _index || (_index = 0);
					m.isValid = false;
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
								if (_source.charAt (_index) == '<') {
									_index++;
									_eatWhitespace ();
									if (_source.charAt (_index) == '/') {
										_index++;
										_eatWhitespace ();
										var
											_tagNameSerialized = m.tagName.serialize (),
											_tagNameSerializedLength = _tagNameSerialized.length
										;
										if (_source.substr (_index,_tagNameSerializedLength) == _tagNameSerialized) {
											_index += _tagNameSerializedLength;
											_eatWhitespace ();
											if (_source.charAt (_index) == '>') {
												_index++;
												m.isValid = true;
											}
										}
									}
								}
							} else if (_source.charAt (_index) == '/') {
								_index++;
								_eatWhitespace ();
								if (_source.charAt (_index) == '>') {
									m.childNodes = _undefined;
									_index++;
									m.isValid = true;
								}
							}
						}
					}
					if (!m.isValid)
						_index = m.index
					;
					m.tag = _source.slice (m.index,_index);
					m.length = _index - m.index;
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
		});
	}
});

