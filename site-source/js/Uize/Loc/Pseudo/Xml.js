/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Loc.Pseudo.Xml Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2015-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 2
	codeCompleteness: 100
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
		'Uize.Parse.Xml.Util',
		'Uize.Parse.Xml.NodeList',
		'Uize.Util.Matchers.AttributeMatcher'
	],
	builder:function () {
		'use strict';

		var
			/*** Variables for Scuncher Optimization ***/
				_resolveAttributeMatcher = Uize.Util.Matchers.AttributeMatcher.resolve,

			/*** General Variables ***/
				_sacredEmptyObject = {}
		;

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
						_attributeMatcher = _resolveAttributeMatcher (_options.attributeMatcher || Uize.returnFalse),
						_tagNameMatcher = Uize.resolveMatcher (_options.tagNameMatcher)
					;
					Uize.Parse.Xml.Util.recurseNodes (
						{childNodes:_nodeListParser},
						function (_node) {
							function _addPseudoLocalizableString (_object,_property) {
								_strings.push (_object [_property]);
								_stringOrigins.push ({_object:_object,_property:_property});
							}
							if ('text' in _node) {
								_addPseudoLocalizableString (_node,'text');
							} else if (('tagName' in _node) && !_tagNameMatcher (_node.tagName.name)) {
								return false;
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
						}
					);

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

