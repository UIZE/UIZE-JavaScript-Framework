/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Loc.Xliff Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014 UIZE
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
		The =Uize.Loc.Xliff= module provides methods to serialize a resource strings object to XLIFF format and parse a resource strings object from XLIFF format.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Loc.Xliff',
	required:[
		'Uize.Util.Html.Encode',
		'Uize.Data.Flatten',
		'Uize.Json',
		'Uize.Parse.Xml.NodeList',
		'Uize.Data.Matches',
		'Uize.Str.Split'
	],
	builder:function () {
		'use strict';

		var
			/*** Variable for Performance Optimization ***/
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
							return Uize.Data.Flatten.flatten (
								_resourceFileStrings,
								function (_path) {return Uize.Json.to (_path,'mini')}
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
							function (_resourceStringText,_id) {
								var _source = _tokenSplitter
									? Uize.map (
										_tokenSplitter (_resourceStringText),
										function (_segment,_segmentNo) {
											return (
												_segmentNo % 2
													? '<ph id="' + ++_phId + '" ctype="x-param">' + _htmlEncode (_segment) + '</ph>'
													: _htmlEncode (_segment)
											);
										}
									).join ('')
									: _htmlEncode (_resourceStringText)
								;
								_xliffLines.push (
									'\t\t\t<trans-unit id="' + _htmlEncode (_id) + '">',
									'\t\t\t\t<source>' + _source + '</source>',
									'\t\t\t\t<target>' +
										(_seedTarget ? ((_targetValues && _targetValues [_id]) || _source) : '') +
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
				function _isTag (_node,_tagName) {
					return _node.tagName && _node.tagName.serialize () == _tagName;
				}

				function _getTags (_nodeList,_tagName) {
					return Uize.Data.Matches.values (
						_nodeList.nodes,
						function (_node) {return _isTag (_node,_tagName)}
					);
				}

				function _getAttributeValue (_node,_attributeName) {
					var _attribute = Uize.findRecord (
						_node.tagAttributes.attributes,
						function (_attribute) {return _attribute.name.name == _attributeName}
					);
					return _attribute ? _attribute.value.value : '';
				}

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
						_strings [_getAttributeValue (_fileTag,'original')] = Uize.Data.Flatten.unflatten (
							_fileStrings,
							Uize.Json.from
						);
					}
				);
				return _strings;
			}
		});
	}
});

