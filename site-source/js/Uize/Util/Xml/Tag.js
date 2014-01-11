/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Util.Xml.Tag Package
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
		The =Uize.Util.Xml.Tag= module provides methods for parsing and serializing individual XML tags.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Util.Xml.Tag',
	required:[
		'Uize.Util.Xml.TagName',
		'Uize.Util.Xml.TagAttributes'
		// 'Uize.Util.Xml.NodeList'  // ISSUE: circular dependency
	],
	builder:function () {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_Uize_Util_Xml = Uize.Util.Xml,

			/*** Variables for Performance Optimization ***/
				_Uize_Util_Xml_TagName = _Uize_Util_Xml.TagName,
				_Uize_Util_Xml_TagAttributes = _Uize_Util_Xml.TagAttributes,
				_Uize_Util_Xml_NodeList = _Uize_Util_Xml.NodeList,
		;

		return Uize.copyInto (
			function () {
				var m = this;
				m.tagName = new _Uize_Util_Xml_TagName;
				m.tagAttributes = new _Uize_Util_Xml.TagAttributes;
				m._childNodes = m.childNodes = new _Uize_Util_Xml_NodeList;
			},

			prototype:{
				source:'',
				index:0,
				length:0,
				isValid:false,

				parse:function (_source,_index) {
					var
						m = this,
						_sourceLength = (m.source = _source).length
					;
					m.index = _index || (_index = 0);
					m.length = 0;
					if (m.isValid = _source.charAt (_index) == '<') {
						_index++;
						/*
							eat whitespace
							then expect tagName
							if whitespace, eat whitespace
							then expect possible attributes
							then expect possible ">" or "/>"
							if "/>" then
								end parsing
							else
								then expect possible nodes
								then expect closing tag to match opening tag
								then end parsing
						*/
					};
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
							_childNodesSerialized && (
								_childNodesSerialized +
								'</' + _tagNameSerialized + '>'
							)
						);
					} else {
						return '';
					}
				}
			}
		);
	}
});

