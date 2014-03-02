/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Build.FileBuilders.CompiledWidgetHtmltModules Package
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
		The =Uize.Build.FileBuilders.CompiledWidgetHtmltModules= module defines a file builder for widget HTML template (=.htmlt=) modules.

		*DEVELOPERS:* `Chris van Rensburg`

		Functions defined in the file builder are called as instance methods on an instance of a subclass of the =Uize.Services.FileBuilderAdapter= class, so the functions can access instance methods implemented in this class.
*/

/* TODO
	- load widget's JS module
	- evaluate widget's declared html and CSS bindings
	- use bindings to stitch in additional template logic
*/

Uize.module ({
	name:'Uize.Build.FileBuilders.CompiledWidgetHtmltModules',
	required:[
		'Uize.Build.Util',
		'Uize.Parse.Xml.NodeList',
		'Uize.Json',
		'Uize.Str.Split'
	],
	builder:function () {
		var
			/*** General Variables ***/
				_replacementTokenOpener = '{{[[',
				_replacementTokenCloser = ']]}}',
				_replacementTokenRegExp = new RegExp (
					Uize.escapeRegExpLiteral (_replacementTokenOpener) +
					'(.+?)' +
					Uize.escapeRegExpLiteral (_replacementTokenCloser),
					'g'
				)
		;

		/*** Utility Functions ***/
			function _sourceUrlFromTempUrl (m,_pathname) {
				return m.sourceUrlFromTempUrl (_pathname).replace (/\.js$/,'.htmlt');
			}

		return Uize.package ({
			description:'Compiled widget HTML template modules, generated from source .htmlt files',
			urlMatcher:function (_urlParts) {
				var _pathname = _urlParts.pathname;
				return (
					_urlParts.fileType == 'js' &&
					this.isTempUrl (_pathname) &&
					this.fileExists ({path:_sourceUrlFromTempUrl (this,_pathname)})
				);
			},
			builderInputs:function (_urlParts) {
				return {source:_sourceUrlFromTempUrl (this,_urlParts.pathname)};
			},
			builder:function (_inputs,_urlParts) {
				var
					_params = this.params,
					_moduleName = Uize.Build.Util.moduleNameFromModulePath (
						_urlParts.pathname
							.slice ((_params.tempPath + '/' + _params.modulesFolder + '/').length)
							.replace (/\.js$/i,'')
					),
					_nodeListParser = new Uize.Parse.Xml.NodeList (this.readFile ({path:_inputs.source})),
					_replacements = {}
				;
				console.log (_nodeListParser.serialize ());

				/*** recurse parser object tree, process tag nodes and build replacements lookup ***/
					function _processNode (_node) {
						if (_node.tagName) {
							Uize.forEach (
								_node.tagAttributes.attributes,
								function (_attributeParser) {
									var _attributeName = _attributeParser.name.name;
									if (_attributeName == 'id' || _attributeName == 'class') {
										var
											_attributeValue = _attributeParser.value.value,
											_replacementName = _attributeName + ' ~ ' + _attributeValue
										;
										_attributeParser.value.value =
											_replacementTokenOpener + _replacementName + _replacementTokenCloser
										;
										_replacements [_replacementName] = _attributeName == 'id'
											? '_idPrefix' + (_attributeValue && ' + \'-' + _attributeValue + '\'')
											: 'm.cssClass (\'' + _attributeValue + '\')'
										;
									}
								}
							);
						}
						var _childNodes = _node.childNodes;
						_childNodes && Uize.forEach (_childNodes.nodes,_processNode);
					}
					_processNode ({childNodes:_nodeListParser});

				/*** find root tag node and give it special treatment ***/
					/*
						- it's the first tag node at the root level that has no id or has an empty id
						- ensure it has an id attribute whose value is empty
						- ensure it has a class attribute with a special token
					*/

				/*** re-serialize processed parser object tree, split HTML by replacement tokens ***/
					var _templateExpression =
						Uize.map (
							Uize.Str.Split.split (_nodeListParser.serialize (),_replacementTokenRegExp),
							function (_segment,_segmentNo) {
								return _segmentNo % 2 ? _replacements [_segment] : Uize.Json.to (_segment);
							}
						).join (' + ')
					;

				return Uize.Build.Util.moduleAsText ({
					name:_moduleName,
					builder:[
						'function () {',
						'	\'use strict\';',
						'',
						'	return Uize.package ({',
						'		process:function (i) {',
						'			var m = this, _idPrefix = i.idPrefix;',
						'			return ' + _templateExpression + ';',
						'		}',
						'	});',
						'}'
					].join ('\n')
				});
			}
		});
	}
});

