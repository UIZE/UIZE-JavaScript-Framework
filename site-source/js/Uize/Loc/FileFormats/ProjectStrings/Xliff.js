/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Loc.FileFormats.ProjectStrings.Xliff Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 1
	codeCompleteness: 100
	docCompleteness: 5
*/

/*?
	Introduction
		The =Uize.Loc.FileFormats.ProjectStrings.Xliff= module provides methods to serialize a resource strings object to XLIFF format and parse a resource strings object from XLIFF format.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Loc.FileFormats.ProjectStrings.Xliff',
	required:[
		'Uize.Util.Html.Encode',
		'Uize.Loc.FileFormats.ProjectStrings.Util',
		'Uize.Parse.Xml.NodeList',
		'Uize.Parse.Xml.Util',
		'Uize.Str.Split'
	],
	builder:function () {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_Uize_Parse_Xml_Util = Uize.Parse.Xml.Util,

			/*** Variable for Performance Optimization ***/
				_getTags = _Uize_Parse_Xml_Util.getTags,
				_isTag = _Uize_Parse_Xml_Util.isTag,
				_getAttributeValue = _Uize_Parse_Xml_Util.getAttributeValue,
				_htmlEncode = Uize.Util.Html.Encode.encode,
				_split = Uize.Str.Split.split
		;

		return Uize.package ({
			to:function (_toEncode,_options) {
				_options || (_options = {});
				var
					_sourceLanguage = _toEncode.sourceLanguage,
					_targetLanguage = _toEncode.targetLanguage,
					_seedTarget = _options.seedTarget,
					_seedTargetIsObject = Uize.isPlainObject (_seedTarget),
					_tokenSplitter = _options.tokenSplitter,
					_phId = 0,
					_xliffLines = [
						'<?xml version="1.0" ?>',
						'<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">'
					]
				;
				if (Uize.isRegExp (_tokenSplitter)) {
					var _tokenRegExp = _tokenSplitter;
					_tokenSplitter = function (_string) {
						return _split (_string,_tokenRegExp,null,'match');
					};
				}
				Uize.forEach (
					_toEncode.strings,
					function (_resourceFileStrings,_resourceFileSubPath) {
						function _flattenResourceStrings (_resourceFileStrings) {
							return Uize.Loc.FileFormats.ProjectStrings.Util.flatten (_resourceFileStrings);
						}

						function _encodeResourceStringText (_text) {
							return (
								_tokenSplitter
									? Uize.map (
										_tokenSplitter (_text),
										function (_segment,_segmentNo) {
											return (
												_segmentNo % 2
													? '<ph id="' + ++_phId + '" ctype="x-param">' + _htmlEncode (_segment) + '</ph>'
													: _htmlEncode (_segment)
											);
										}
									).join ('')
									: _htmlEncode (_text)
							);
						}

						_xliffLines.push (
							'\t<file ' +
								'original="' + _htmlEncode (_resourceFileSubPath) + '" ' +
								'source-language="' + _sourceLanguage + '" ' +
								'target-language="' + _targetLanguage + '" ' +
								'datatype="plaintext"' +
							'>',
							'\t\t<body>'
						);
						var _targetValues =
							_seedTargetIsObject && _flattenResourceStrings (_seedTarget [_resourceFileSubPath] || {})
						;
						Uize.forEach (
							_flattenResourceStrings (_resourceFileStrings),
							function (_resourceStringSource,_id) {
								var
									_resourceStringTarget = (
										_seedTarget ? ((_targetValues && _targetValues [_id]) || _resourceStringSource) : ''
									),
									_source = _encodeResourceStringText (_resourceStringSource)
								;
								_xliffLines.push (
									'\t\t\t<trans-unit id="' + _htmlEncode (_id) + '">',
									'\t\t\t\t<source>' + _source + '</source>',
									'\t\t\t\t<target>' +
										(
											_resourceStringTarget &&
											(
												_resourceStringTarget == _resourceStringSource
													? _source
													: _encodeResourceStringText (_resourceStringTarget)
											)
										) +
									'</target>',
									'\t\t\t</trans-unit>'
								);
							}
						);
						_xliffLines.push (
							'\t\t</body>',
							'\t</file>'
						);
					}
				);
				_xliffLines.push ('</xliff>');
				return _xliffLines.join ('\n');
			},

			from:function (_toDecode) {
				var _strings = {};
				Uize.forEach (
					_getTags (
						_getTags (new Uize.Parse.Xml.NodeList (_toDecode.replace (/<\?.*?\?>/,'')),'xliff') [0].childNodes,
						'file'
					),
					function (_fileTag) {
						var _fileStrings = {};
						Uize.forEach (
							_getTags (_getTags (_fileTag.childNodes,'body') [0].childNodes,'trans-unit'),
							function (_transUnitTag) {
								var _targetTagChildNodes = _getTags (_transUnitTag.childNodes,'target') [0].childNodes;
								_fileStrings [_getAttributeValue (_transUnitTag,'id')] = _targetTagChildNodes
									? Uize.map (
										_targetTagChildNodes.nodes,
										function (_node) {
											if ('text' in _node) {
												return _node.text;
											} else if (_isTag (_node,'ph')) {
												var _textChildNode = _node.childNodes.nodes [0];
												return _textChildNode ? _textChildNode.text : '';
											}
										}
									).join ('')
									: ''
								;
							}
						);
						_strings [_getAttributeValue (_fileTag,'original')] =
							Uize.Loc.FileFormats.ProjectStrings.Util.unflatten (_fileStrings)
						;
					}
				);
				return _strings;
			}
		});
	}
});

