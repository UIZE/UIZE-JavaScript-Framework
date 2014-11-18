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
		The =Uize.Loc.FileFormats.AndroidStrings= module provides support for serializing to and parsing from [[http://developer.android.com/guide/topics/resources/string-resource.html][Android string resources files]].

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Loc.FileFormats.AndroidStrings',
	required:[
		'Uize.Parse.Xml.NodeList',
		'Uize.Parse.Xml.Util',
		'Uize.Str.Replace',
		'Uize.Data.NameValueRecords',
		'Uize.Parse.Code.StringLiteral'
	],
	builder:function () {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_Uize_Parse_Xml_Util = Uize.Parse.Xml.Util,

			/*** Variables for Performance Optimization ***/
				_findNodeByTagName = _Uize_Parse_Xml_Util.findNodeByTagName,
				_getAttributeValue = _Uize_Parse_Xml_Util.getAttributeValue,
				_isTag = _Uize_Parse_Xml_Util.isTag,
				_recurseNodes = _Uize_Parse_Xml_Util.recurseNodes
		;

		return Uize.package ({
			from:function (_stringsFileStr) {
				var
					_xliffNodeList = new Uize.Parse.Xml.NodeList (_stringsFileStr.replace (/<\?.*?\?>/,'')),
					_strings = {},
					_stringLiteralParser = new Uize.Parse.Code.StringLiteral
				;
				Uize.forEach (
					_findNodeByTagName (_xliffNodeList,'resources').childNodes.nodes,
					function (_node) {
						function _getStringText (_node) {
							_recurseNodes (
								_node,
								function (_node) {
									if ('text' in _node) {
										_node.serialize = function () {return this.text};
									} else if (_isTag (_node,'xliff:g')) {
										_node.serialize = function () {return this.childNodes.nodes [0].text};
									}
								}
							);
							var
								_string = _node.childNodes.serialize (),
								_stringFirstChar = _string.charAt (0)
							;
							_stringLiteralParser.parse (
								_stringFirstChar == '\'' || _stringFirstChar == '"' ? _string : '"' + _string + '"'
							);
							return _stringLiteralParser.value;
						}

						var _stringValue;
						if (_isTag (_node,'string')) {
							_stringValue = _getStringText (_node);
						} else if (_isTag (_node,'string-array')) {
							_stringValue = [];
							Uize.forEach (
								_node.childNodes.nodes,
								function (_node) {
									if (_isTag (_node,'item'))
										_stringValue.push (_getStringText (_node))
									;
								}
							);
						} else if (_isTag (_node,'plurals')) {
							_stringValue = {};
							Uize.forEach (
								_node.childNodes.nodes,
								function (_node) {
									if (_isTag (_node,'item'))
										_stringValue [_getAttributeValue (_node,'quantity')] = _getStringText (_node)
									;
								}
							);
						}
						if (_stringValue != undefined) {
							_strings [_getAttributeValue (_node,'name')] = _stringValue;
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
				var _encodeString = Uize.Str.Replace.replacerByLookup ({
					// characters that need to be backslash-escaped for Android's peculiar resource file format
					'"':'\\\"',
					'\'':'\\\'',
					'\\':'\\\\',
					'\r':'\\r',
					'\n':'\\n',

					// characters that need to be XML-escaped using XML character entities
					'&':'&amp;',
					'<':'&lt;',
					'>':'&gt;'
				});
				return (
					[
						'<?xml version="1.0" encoding="utf-8"?>',
						'<resources xmlns:xliff="urn:oasis:names:tc:xliff:document:1.2">'
					].concat (
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
											'\t<string-array name="' + _encodeString (_name) + '">\n' +
											Uize.map (
												_value,
												function (_value) {return '\t\t<item>' + _encodeString (_value) + '</item>\n'}
											).join ('') +
											'\t</string-array>'
										)
										: Uize.isPlainObject (_value)
											? (
												'\t<plurals name="' + _encodeString (_name) + '">\n' +
												Uize.map (
													Uize.keys (_value),
													function (_key) {
														return (
															'\t\t<item quantity="' + _encodeString (_key) + '">' +
															_encodeString (_value [_key]) +
															'</item>\n'
														);
													}
												).join ('') +
												'\t</plurals>'
											)
											: (
												'\t<string name="' + _encodeString (_name) + '">' +
												_encodeString (_value) +
												'</string>'
											)
								);
							}
						),
						'</resources>',
						''
					).join ('\n')
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

