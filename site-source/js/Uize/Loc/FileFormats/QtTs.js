/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Loc.FileFormats.QtTs Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2016 UIZE
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
		'Uize.Parse.Xml.Util',
		'Uize.Util.Html.Encode'
	],
	builder:function () {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_Uize_Parse_Xml_Util = Uize.Parse.Xml.Util,

			/*** Variables for Performance Optimization ***/
				_findNodeByTagName = _Uize_Parse_Xml_Util.findNodeByTagName,
				_getTags = _Uize_Parse_Xml_Util.getTags,
				_isTag = _Uize_Parse_Xml_Util.isTag,
				_getText = _Uize_Parse_Xml_Util.getText,
				_getAttributeValue = _Uize_Parse_Xml_Util.getAttributeValue
		;

		return Uize.package ({
			from:function (_stringsFileStr) {
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
											var
												_stringValue,
												_translationTag = _findNodeByTagName (_childNodes,'translation')
											;
											if (_getAttributeValue (_node,'numerus') == 'yes') {
												_stringValue = [];
												Uize.forEach (
													_getTags (_translationTag.childNodes,'numerusform'),
													function (_node) {_stringValue.push (_getText (_node))}
												);
											} else {
												_stringValue = _getText (_translationTag);
											}
											_contextStrings [_getText (_findNodeByTagName (_childNodes,'source'))] = _stringValue;
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

			to:function (_strings,_options) {
				if (!_options) _options = {};
				var
					_encodeString = Uize.Util.Html.Encode.encode,
					_language = _options.language || 'en',
					_lines = [
						'<?xml version="1.0" encoding="utf-8"?>',
						'<!DOCTYPE TS>',
						'<TS version="2.1" language="' + _language + '">'
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
								var _isNumerus = Uize.isArray (_stringValue);
								_lines.push (
									'		<message' + (_isNumerus ? ' numerus="yes"': '') + '>',
									'			<source>' + _encodeString (_stringId) + '</source>'
								);
								if (_isNumerus) {
									var
										_unfinished = true,
										_numerusFormLines = Uize.map (
											_stringValue,
											function (_numerusFormValue) {
												_unfinished = _unfinished && !_numerusFormValue;
												return (
													'				<numerusform>' + _encodeString (_numerusFormValue) + '</numerusform>'
												);
											}
										)
									;
									_lines.push ('			<translation' + (_unfinished ? ' type="unfinished"' : '') + '>');
									Uize.push (_lines,_numerusFormLines);
									_lines.push ('			</translation>');
								} else {
									_lines.push (
										'			<translation' + (_stringValue ? '' : ' type="unfinished"') + '>' + _encodeString (_stringValue) + '</translation>'
									);
								}
								_lines.push (
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

