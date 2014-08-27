/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Loc.FileFormats.AndroidStrings Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013-2014 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 1
	codeCompleteness: 100
	docCompleteness: 15
*/

/*?
	Introduction
		The =Uize.Loc.FileFormats.AndroidStrings= module provides support for serializing to and parsing from Android resource strings files.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Loc.FileFormats.AndroidStrings',
	required:[
		'Uize.Parse.Xml.NodeList',
		'Uize.Util.Html.Encode',
		'Uize.Data.NameValueRecords'
	],
	builder:function () {
		'use strict';

		return Uize.package ({
			from:function (_stringsFileStr) {
				function _isTag (_node,_tagName) {
					return _node.tagName && _node.tagName.serialize () == _tagName;
				}
				var
					_xliffNodeList = new Uize.Parse.Xml.NodeList (_stringsFileStr.replace (/<\?.*?\?>/,'')),
					_strings = {}
				;
				Uize.forEach (
					Uize.findRecord (
						_xliffNodeList.nodes,
						function (_node) {return _isTag (_node,'resources')}
					).childNodes.nodes,
					function (_node) {
						function _getStringName () {
							return _node.tagAttributes.attributes [0].value.value;
						}
						if (_isTag (_node,'string')) {
							_strings [_getStringName ()] = Uize.map (
								_node.childNodes.nodes,
								function (_node) {
									return (_isTag (_node,'xliff:g') ? _node.childNodes.nodes [0] : _node).text || '';
								}
							).join ('');
						} else if (_isTag (_node,'string-array')) {
							var _stringsArray = _strings [_getStringName ()] = [];
							Uize.forEach (
								_node.childNodes.nodes,
								function (_node) {
									if (_isTag (_node,'item')) {
										var _textNode = _node.childNodes.nodes [0];
										_stringsArray.push (_textNode ? _textNode.text : '');
									}
								}
							);
						}
					}
				);
				return _strings;
				/*?
					Static Methods
						Uize.Loc.FileFormats.AndroidStrings.from
							Returns an object, being the strings parsed from the specified Android resource strings file string.

							SYNTAX
							.......................................................................
							stringsOBJ = Uize.Loc.FileFormats.AndroidStrings.from (stringsFileSTR);
							.......................................................................

							NOTES
							- see the companion =Uize.Loc.FileFormats.AndroidStrings.to= static method
				*/
			},

			to:function (_strings) {
				var _encodeHtml = Uize.Util.Html.Encode.encode;
				return (
					'<?xml version="1.0" encoding="utf-8"?>\n' +
					'<resources xmlns:xliff="urn:oasis:names:tc:xliff:document:1.2">\n' +
					Uize.map (
						Uize.Data.NameValueRecords.fromHash (_strings),
						function (_record) {
							var
								_name = _record.name,
								_value = _record.value
							;
							return (
								Uize.isArray (_value)
									? (
										'\t<string-array name="' + _name + '">\n' +
										Uize.map (
											_value,
											function (_value) {return '\t\t<item>' + _encodeHtml (_value) + '</item>\n'}
										).join ('') +
										'\t</string-array>'
									)
									: '\t<string name="' + _name + '">' + _encodeHtml (_value) + '</string>'
							);
						}
					).join ('\n') + '\n' +
					'</resources>\n'
				);
				/*?
					Static Methods
						Uize.Loc.FileFormats.AndroidStrings.to
							Returns a string, being the specified strings object serialized to an Android resource strings file string.

							SYNTAX
							.....................................................................
							stringsFileSTR = Uize.Loc.FileFormats.AndroidStrings.to (stringsOBJ);
							.....................................................................

							NOTES
							- see the companion =Uize.Loc.FileFormats.AndroidStrings.from= static method
				*/
			}
		});
	}
});

