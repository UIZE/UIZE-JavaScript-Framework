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
		'Uize.Data.Matches'
	],
	builder:function () {
		'use strict';

		var
			/*** Variable for Performance Optimization ***/
				_htmlEncode = Uize.Util.Html.Encode.encode
		;

		return Uize.package ({
			to:function (_toEncode,_options) {
				_options || (_options = {});
				var
					_sourceLanguage = _toEncode.sourceLanguage,
					_targetLanguage = _toEncode.targetLanguage,
					_seedTarget = _options.seedTarget,
					_xliffLines = [
						'<?xml version="1.0" ?>',
						'<xliff version="1.0">'
					]
				;
				Uize.forEach (
					_toEncode.strings,
					function (_resourceFileStrings,_resourceFileSubPath) {
						_xliffLines.push (
							'\t<file ' +
								'original="' + _htmlEncode (_resourceFileSubPath) + '" ' +
								'source-language="' + _sourceLanguage + '" ' +
								'target-language="' + _targetLanguage + '" ' +
								'datatype="plaintext"' +
							'>'
						);
						Uize.forEach (
							Uize.Data.Flatten.flatten (
								_resourceFileStrings,
								function (_path) {return Uize.Json.to (_path,'mini')}
							),
							function (_resourceStringText,_id) {
								var _source = _htmlEncode (_resourceStringText);
								_xliffLines.push (
									'\t\t<trans-unit id="' + _htmlEncode (_id) + '">',
									'\t\t\t<source>' + _source + '</source>',
									'\t\t\t<target>' + (_seedTarget ? _source : '') + '</target>',
									'\t\t</trans-unit>'
								);
							}
						);
						_xliffLines.push (
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
							_getTags (_fileTag.childNodes,'trans-unit'),
							function (_transUnitTag) {
								_fileStrings [_getAttributeValue (_transUnitTag,'id')] =
									_getTags (_transUnitTag.childNodes,'target') [0].childNodes.nodes [0].text
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

