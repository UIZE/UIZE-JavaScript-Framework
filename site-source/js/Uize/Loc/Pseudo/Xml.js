/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Loc.Pseudo.Xml Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2015 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 2
	codeCompleteness: 5
	docCompleteness: 5
*/

/*?
	Introduction
		The =Uize.Loc.Pseudo.Xml= module provides a method to facilitate the [[http://en.wikipedia.org/wiki/Pseudolocalization][pseudo-localization]] of the resource strings of an application that contain XML-based markup (such as HTML).

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Loc.Pseudo.Xml',
	required:[
		'Uize.Loc.Pseudo',
		'Uize.Parse.Xml.NodeList',
		'Uize.Str.Split'
	],
	builder:function () {
		'use strict';

		var
			/*** General Variables ***/
				_sacredEmptyObject = {}
		;

		/*** Utility Functions ***/
			function _resolveValueListMatcher (_matcher) {
				var _resolvedMatcher = _matcher;
				if (!_matcher) {
					_resolvedMatcher = Uize.returnTrue;
				} else if (!Uize.isFunction (_matcher)) {
					if (Uize.isRegExp (_matcher)) {
						_resolvedMatcher = function (_value) {return _matcher.test (_value)};
					} else {
						var
							_trueFlag = {},
							_valuesLookup = Uize.lookup (
								typeof _matcher == 'string'
									? Uize.Str.Split.split (_matcher.replace (/^\s*\[?\s*|\s*\]?\s*$/g,''),/\s*\|\s*/)
									: _matcher,
								_trueFlag
							)
						;
						_resolvedMatcher = function (_value) {return _valuesLookup [_value] == _trueFlag};
					}
				}
				return _resolvedMatcher;
			}

			function _resolveAttributeMatcher (_matcher) {
				var _resolvedMatcher = _matcher;
				if (!_matcher) {
					_resolvedMatcher = Uize.returnTrue;
				} else if (!Uize.isFunction (_matcher)) {
					if (typeof _matcher == 'string') {
						var _atPos = _matcher.indexOf ('@');
						_matcher = {
							tag:_matcher.substr (0,_atPos),
							attribute:_matcher.slice (_atPos + 1)
						};
					}
					if (Uize.isPlainObject (_matcher)) {
						var
							_tagMatcher = _resolveValueListMatcher (_matcher.tag),
							_attributeMatcher = _resolveValueListMatcher (_matcher.attribute)
						;
						_resolvedMatcher = function (_attributeInfo) {
							return _tagMatcher (_attributeInfo.tag) && _attributeMatcher (_attributeInfo.attribute);
						};
					} else if (Uize.isArray (_matcher)) {
						var
							_subMatches = Uize.map (_matcher,_resolveAttributeMatcher),
							_subMatchesLength = _subMatches.length
						;
						_resolvedMatcher = function (_attributeInfo) {
							var _result = false;
							for (var _subMatchNo = -1; !_result && ++_subMatchNo < _subMatchesLength;)
								_result = _subMatches [_subMatchNo] (_attributeInfo)
							;
							return _result;
						};
					}
				}
				return _resolvedMatcher;
			}

		return Uize.package ({
			pseudoLocalize:function (_sourceStr,_options) {
				if (!_options)
					_options = _sacredEmptyObject
				;
				var _nodeListParser = new Uize.Parse.Xml.NodeList (_sourceStr);

				/*** build list of pseudo-localizable strings ***/
					var
						_strings = [],
						_stringOrigins = [],
						_attributeMatcher = _resolveAttributeMatcher (_options.attributeMatcher || Uize.returnFalse)
					;
					function _processNode (_node) {
						function _addPseudoLocalizableString (_object,_property) {
							_strings.push (_object [_property]);
							_stringOrigins.push ({_object:_object,_property:_property});
						}
						if ('text' in _node) {
							_addPseudoLocalizableString (_node,'text');
						} else if ('tagAttributes' in _node) {
							Uize.forEach (
								_node.tagAttributes.attributes,
								function (_attribute) {
									if (_attributeMatcher ({tag:_node.tagName.name,attribute:_attribute.name.name}))
										_addPseudoLocalizableString (_attribute.value,'value')
									;
								}
							);
						}
						var _childNodes = _node.childNodes;
						_childNodes && Uize.forEach (_childNodes.nodes,_processNode);
					}
					_processNode ({childNodes:_nodeListParser});

				/*** pseudo-localize strings and re-integrate into XML ***/
					Uize.forEach (
						Uize.Loc.Pseudo.pseudoLocalize (_strings,_options),
						function (_string,_stringNo) {
							var _stringOrigin = _stringOrigins [_stringNo];
							_stringOrigin._object [_stringOrigin._property] = _string;
						}
					);

				return _nodeListParser.serialize ();
			}
		});
	}
});

