/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.HtmltCompiler Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 3
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Widget.HtmltCompiler= package module provides methods for compiling widget template JavaScript code from template source.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widget.HtmltCompiler',
	required:[
		'Uize.Parse.Xml.NodeList',
		'Uize.Parse.Xml.TagAttribute',
		'Uize.Parse.Xml.Text',
		'Uize.Json',
		'Uize.Str.Split',
		'Uize.Str.Trim'
	],
	builder:function () {
		var
			/*** Variables for Scruncher Optimization ***/
				_undefined,
				_split = Uize.Str.Split.split,

			/*** Variables for Performance Optimization ***/
				_trim = Uize.Str.Trim.trim,

			/*** references to static methods used internally ***/
				_compileToFunctionBody,

			/*** General Variables ***/
				_replacementTokenOpener = '{{[[',
				_replacementTokenCloser = ']]}}',
				_replacementNameDelimiter = ' ~ ',
				_replacementTokenRegExp = new RegExp (
					Uize.escapeRegExpLiteral (_replacementTokenOpener) +
					'(.+?)' +
					Uize.escapeRegExpLiteral (_replacementTokenCloser),
					'g'
				),
				_extraClassesToken = _replacementTokenOpener + 'extraClasses' + _replacementTokenCloser
		;

		return Uize.package ({
			compile:function (_source,_widgetClass) {
				return new Function (_compileToFunctionBody (_source,_widgetClass));
			},

			compileToFunctionBody:_compileToFunctionBody = function (_source,_widgetClass) {
				var
					_nodeListParser = new Uize.Parse.Xml.NodeList (_source),
					_replacements = {}
				;

				function _ensureNodeAttribute (_node,_attributeName,_attributeValue) {
					var _attribute = _findAttribute (_node,_attributeName);
					_attribute ||
						_node.tagAttributes.attributes.push (
							_attribute = new Uize.Parse.Xml.TagAttribute (_attributeName + '=""')
						)
					;
					if (_attributeValue != _undefined)
						_attribute.value.value = _attributeValue
					;
					return _attribute;
				}

				/*** find root tag node and give it special treatment for id and class attributes ***/
					function _findAttribute (_node,_attributeName) {
						return Uize.findRecord (
							_node.tagAttributes.attributes,
							function (_attribute) {return _attribute.name.name == _attributeName}
						);
					}

					var _rootNode = Uize.findRecord (
						_nodeListParser.nodes,
						function (_node) {
							if (!_node.tagName) return false;
							var _idAttribute = _findAttribute (_node,'id');
							return !_idAttribute || !_idAttribute.value.value;
						}
					);
					_rootNode && _ensureNodeAttribute (_rootNode,'id','');

				/*** build a lookup of HTML bindings by node ID ***/
					var _bindingsById = {};
					_widgetClass && Uize.forEach (
						_widgetClass.mBindings_html,
						function (_bindings) {
							Uize.forEach (
								_bindings,
								function (_binding) {
									if (_binding.bindingType) {
										var _id = _binding.nodeName;
										(_bindingsById [_id] || (_bindingsById [_id] = [])).push (_binding);
									}
								}
							);
						}
					);

				/*** recurse parser object tree, process tag nodes and build replacements lookup ***/
					function _processNode (_node) {
						function _splitCssClasses (_classes) {
							return _split (_trim (_classes),/\s+/);
						}

						function _classNamespacerExpression (_class) {
							return '_cssClass (\'' + _class + '\')';
						}

						function _addAttributeReplacement (_attribute,_replacementName,_replacementValue) {
							_replacements [_replacementName] = _replacementValue;
							_attribute.value.value = _replacementTokenOpener + _replacementName + _replacementTokenCloser;
						}

						function _propertyReference (_propertyName) {
							return 'i[' + Uize.Json.to (_propertyName) + ']';
						}

						if (_node.tagName) {
							var
								_idAttribute = _findAttribute (_node,'id'),
								_nodeId = _idAttribute && _idAttribute.value.value
							;
							if (_idAttribute) {
								_addAttributeReplacement (
									_idAttribute,
									'id' + _replacementNameDelimiter + _nodeId,
									'_idPrefix' + (_nodeId && ' + \'-' + _nodeId + '\'')
								);

								var _bindings = _bindingsById [_nodeId];
								if (_bindings) {
									var _styleExpressionParts = [];
									Uize.forEach (
										_bindings,
										function (_binding) {
											var
												_bindingType = _binding.bindingType,
												_bindingProperty = _binding.propertyName
											;
											/*** remap binding types ***/
												if (_bindingType == 'className') {
													_bindingType = '@class';
												}

											if (_bindingType == 'html' || _bindingType == 'innerHTML') {
												var _replacementName = 'innerHTML' + _replacementNameDelimiter + _nodeId;
												_replacements [_replacementName] = _propertyReference (_bindingProperty);
												(_node.childNodes || (_node.childNodes = new Uize.Parse.Xml.NodeList)).parse (
													_replacementTokenOpener + _replacementName + _replacementTokenCloser
												);
											} else if (_bindingType.charCodeAt (0) == 64) {
												_addAttributeReplacement (
													_ensureNodeAttribute (_node,_bindingType.slice (1)),
													_bindingType + _replacementNameDelimiter + _nodeId,
													_propertyReference (_bindingProperty)
												);
											} else if (_bindingType.slice (0,6) == 'style.') {
												var _stylePropertyName = _bindingType.slice (6);
												_styleExpressionParts.push (
													Uize.Json.to (
														_stylePropertyName.replace (
															/* TODO: put this into a separate Uize.Str.* module */
															/([a-z])([A-Z])/g,
															function (_match,_lowerCaseLetter,_upperCaseLetter) {
																return _lowerCaseLetter + '-' + _upperCaseLetter.toLowerCase ();
															}
														) +
														':'
													) + ' + ' + _propertyReference (_bindingProperty) + ' + \';\''
												);
											}
										}
									);
									if (_styleExpressionParts.length) {
										var _styleAttribute = _ensureNodeAttribute (_node,'style');
										_addAttributeReplacement (
											_styleAttribute,
											'style' + _replacementNameDelimiter + _nodeId,
											Uize.Json.to (_styleAttribute.value.value) + ' + ' +
												_styleExpressionParts.join (' + ')
										);
									}
								}
							}
							if (_nodeId !== '') {
								var _classAttribute = _findAttribute (_node,'class');
								if (_classAttribute) {
									var _classTokens = [];
									Uize.forEach (
										_splitCssClasses (_classAttribute.value.value),
										function (_cssClass) {
											var _replacementName = 'class' + _replacementNameDelimiter + _cssClass;
											_replacements [_replacementName] = _classNamespacerExpression (_cssClass);
											_classTokens.push (
												_replacementTokenOpener + _replacementName + _replacementTokenCloser
											);
										}
									);
									_classAttribute.value.value = _classTokens.join (' ');
								}
							}
						}
						var _childNodes = _node.childNodes;
						if (_childNodes) {
							var _nodes = _childNodes.nodes;
							Uize.forEach (
								_nodes,
								function (_node,_nodeNo) {
									var _tagName = _node.tagName;
									if (_tagName) {
										if (_tagName.name == 'child') {
											/*** build lookup of attributes, to be used for child widget properties ***/
												var _attributesLookup = {};
												Uize.forEach (
													_node.tagAttributes.attributes,
													function (_attribute) {
														_attributesLookup [_attribute.name.name] = _attribute.value.value;
													}
												);
												var _childName = _attributesLookup.name;

											/*** special handling for the extraClasses property ***/
												var _extraClasses = _attributesLookup.extraClasses;
												if (_extraClasses) {
													_extraClasses = Uize.map (
														_splitCssClasses (_extraClasses),
														_classNamespacerExpression
													).join (' + \' \' + ');
													_attributesLookup.extraClasses = _extraClassesToken;
												}

											/*** add replacement and replace child tag node with text node ***/
												var
													_replacementName = 'child' + _replacementNameDelimiter + _childName,
													_serializedProperties = Uize.Json.to (_attributesLookup)
												;
												_replacements [_replacementName] =
													'_childHtml (' +
													(
														_extraClasses
															? _serializedProperties.replace (
																'\'' + _extraClassesToken + '\'',
																_extraClasses
															)
															: _serializedProperties
													) +
													')'
												;
												_nodes [_nodeNo] = new Uize.Parse.Xml.Text (
													_replacementTokenOpener + _replacementName + _replacementTokenCloser
												);
										} else {
											_processNode (_node);
										}
									}
								}
							);
						}
					}
					_processNode ({childNodes:_nodeListParser});

				/*** split re-serialized HTML by replacement tokens and resolve all fragments to expressions ***/
					var
						_fragmentOccurrences = {},
						_fragmentsToCapture = {},
						_fragments = Uize.map (
							Uize.Str.Split.split (_nodeListParser.serialize (),_replacementTokenRegExp),
							function (_segment,_segmentNo) {
								var _fragment = _segmentNo % 2 ? _replacements [_segment] : Uize.Json.to (_segment);
								if (!_fragmentsToCapture [_fragment]) {
									var
										_fragmentLength = _fragment.length,
										_occurrences =
											_fragmentOccurrences [_fragment] = (_fragmentOccurrences [_fragment] || 0) + 1
									;
									if (_occurrences * _fragmentLength > 3 + _fragmentLength + _occurrences * 2)
										_fragmentsToCapture [_fragment] = true
									;
								}
								return _fragment;
							}
						)
					;

				var
					_fragmentNo = 0,
					_varChunks = [
						'm = this',
						'i = arguments [0]',
						'_idPrefix = i.idPrefix'
					]
				;

				Uize.forEach (
					_fragmentsToCapture,
					function (_true,_fragmentToCapture) {
						var _fragmentVar = '_fragment' + _fragmentNo++;
						_varChunks.push (_fragmentVar + ' = ' + _fragmentToCapture);
						_fragmentsToCapture [_fragmentToCapture] = _fragmentVar;
					}
				);

				return (
					'function _cssClass (_class) {return m.cssClass (_class)}\n' +
					'function _childHtml (_properties) {return m.childHtml (_properties)}\n' +
					'var\n' +
						'\t' + _varChunks.join (',\n\t') + '\n' +
					';\n' +
					'return ' +
						Uize.map (
							_fragments,
							function (_fragment) {return _fragmentsToCapture [_fragment] || _fragment}
						).join (' + ') + ';\n'
				);
			}
		});
	}
});

