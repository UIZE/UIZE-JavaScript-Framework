/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Loc.FileFormats.QtTs Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 1
	codeCompleteness: 60
	docCompleteness: 10
*/

/*?
	Introduction
		The =Uize.Loc.FileFormats.QtTs= module provides support for serializing to and parsing from [[http://qt-project.org/doc/qt-4.8/linguist-ts-file-format.html][QT Framework string resources files]].

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Loc.FileFormats.QtTs',
	required:[
		'Uize.Parse.Xml.NodeList',
		'Uize.Util.Html.Encode'
	],
	builder:function () {
		'use strict';

		return Uize.package ({
			from:function (_stringsFileStr) {
				function _findNodeByTagName (_nodeList,_tagName) {
					return Uize.findRecord (_nodeList.nodes,function (_node) {return _isTag (_node,_tagName)});
				}

				function _isTag (_node,_tagName) {
					return _node.tagName && _node.tagName.serialize () == _tagName;
				}

				function _getText (_node) {
					var
						_childNodes = _node && _node.childNodes,
						_textNode = _childNodes && _childNodes.nodes [0]
					;
					return _textNode ? _textNode.text : '';
				}

				var
					_nodeList = new Uize.Parse.Xml.NodeList (_stringsFileStr.replace (/<\?.*?\?>|<!DOCTYPE\s+TS>/g,'')),
					_strings = {},
					_context
				;
				Uize.forEach (
					_findNodeByTagName (_nodeList,'TS').childNodes.nodes,
					function (_node) {
						if (_isTag (_node,'context')) {
							var _contextStrings = {};
							Uize.forEach (
								_node.childNodes.nodes,
								function (_node) {
									if (_isTag (_node,'message')) {
										var _childNodes = _node.childNodes;
										if (_childNodes) {
											_contextStrings [_getText (_findNodeByTagName (_childNodes,'source'))] =
												_getText (_findNodeByTagName (_childNodes,'translation'))
											;
										}
									} else if (_isTag (_node,'name')) {
										_strings [_getText (_node)] = _contextStrings;
									}
								}
							)
						}
					}
				);
				return _strings;
				/*?
					Static Methods
						Uize.Loc.FileFormats.QtTs.from
							Returns an object, being the strings parsed from the specified TS resource strings file string.

							SYNTAX
							.............................................................
							stringsOBJ = Uize.Loc.FileFormats.QtTs.from (stringsFileSTR);
							.............................................................

							NOTES
							- see the companion =Uize.Loc.FileFormats.QtTs.to= static method
				*/
			},

			to:function (_strings) {
				var
					_encodeString = Uize.Util.Html.Encode.encode,
					_lines = [
						'<?xml version="1.0" encoding="utf-8"?>',
						'<!DOCTYPE TS>',
						'<TS version="2.1" language="en">'
					]
				;
				Uize.forEach (
					_strings,
					function (_contextStrings,_contextName) {
						_lines.push (
							'	<context>',
							'		<name>' + _encodeString (_contextName) + '</name>'
						);
						Uize.forEach (
							_contextStrings,
							function (_stringValue,_stringId) {
								_lines.push (
									'		<message>',
									'			<source>' + _encodeString (_stringId) + '</source>',
									'			<translation' + (_stringValue ? '' : ' type="unfinished"') + '>' + _encodeString (_stringValue) + '</translation>',
									'		</message>'
								);
							}
						);
						_lines.push ('\t</context>');
					}
				);
				_lines.push (
					'</TS>',
					''
				);
				return _lines.join ('\n');
				/*?
					Static Methods
						Uize.Loc.FileFormats.QtTs.to
							Returns a string, being the specified strings object serialized to a TS resource strings file string.

							SYNTAX
							...........................................................
							stringsFileSTR = Uize.Loc.FileFormats.QtTs.to (stringsOBJ);
							...........................................................

							NOTES
							- see the companion =Uize.Loc.FileFormats.QtTs.from= static method
				*/
			}
		});
	}
});

