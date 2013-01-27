/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Doc.Simple Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2004-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 6
	codeCompleteness: 100
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Doc.Simple= package provides a method for building HTML documentation from documentation that is written in the Wikitext-like SimpleDoc format.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module({
	name:'Uize.Doc.Simple',
	required:[
		'Uize.Data.Simple',
		'Uize.String',
		'Uize.Templates.List',
		'Uize.Array.Sort',
		'Uize.Xml'
	],
	builder:function () {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_undefined,
				_string = 'string',
				_package = function () {},
				_Uize_String_limitLength = Uize.String.limitLength
			;

		/*** General Variables ***/
			var
				_bulletCharRegExpStr = '[-\\*~:\\.]',
				_bulletCharRegExp = new RegExp (_bulletCharRegExpStr),
				_onlyBulletCharRegExp = new RegExp ('^\\s*' + _bulletCharRegExpStr + '\\s*$'),
				_orderingStyleRegExpStr = '([@#\\+a-zA-Z]|\\d+)',
				_orderingStyleRegExp = new RegExp (_orderingStyleRegExpStr),
				_listItemPrefixRegExp = new RegExp (
					'^([<\\(\\{\\[]*\\s*' + _orderingStyleRegExpStr + '?\\s*[>\\)\\}\\]]*\\s*' + _bulletCharRegExpStr + '*\\s+)'
				),
				_sectionAliasesRegExp = /\s*~{2,}\s*/,
				_objectTypeRegExp = /^\s*<<\s*([^<]*?)\s*>>\s*[\n\r]/,
				_builtInObjectTemplates = {
					html:function (_input) {
						return _input.code;
					},
					image:function (_input) {
						var
							_indent = _input.indent,
							_indentChars = _input.indentChars,
							_titleAsAttributeValue = Uize.Xml.toAttributeValue (_input.title || ''),
							_subtitleAsAttributeValue = Uize.Xml.toAttributeValue (_input.subtitle || ''),
							_titleAndSubtitle = _titleAsAttributeValue && _subtitleAsAttributeValue,
							_urlAsAttributeValue = Uize.Xml.toAttributeValue (_input.url),
							_imageAlt =
								_titleAsAttributeValue +
								(_titleAndSubtitle && ' (') + _subtitleAsAttributeValue + (_titleAndSubtitle && ')')
						;
						return [
							_indent + '<div class="image">',
								_indent + _indent + '<a href="' + _urlAsAttributeValue + '">',
									_indent + _indent + _indent + '<img' +
										' src="' + _urlAsAttributeValue + '"' +
										' title="' + _imageAlt + '"' +
										' alt="' + _imageAlt + '"' +
										(_input.width ? ' width="' + Uize.Xml.toAttributeValue (_input.width) + '"' : '') +
										(_input.height ? ' height="' + Uize.Xml.toAttributeValue (_input.height) + '"' : '') +
									'/>',
								_indent + _indent + '</a>',
								_indent + _indent + '<div>',
									(
										_titleAsAttributeValue &&
										(_indent + _indent + _indent + '<span class="imageTitle">' + _titleAsAttributeValue + '</span>')
									),
									(
										_subtitleAsAttributeValue &&
										(_indent + _indent + _indent + '<span class="imageSubtitle">' + _subtitleAsAttributeValue + '</span>')
									),
								_indent + _indent + '</div>',
							_indent + '</div>'
						].join ('\n');
					},
					/* NOTE:
						"metadata" is a reserved object block type (for which there is no template)
					*/
					samplecode:function (_input) {
						return '<pre class="sample-code">' + _toSampleCode (_input.code || '') + '</pre>';
					},
					table:function (_input) {
						var
							_indent = _input.indent,
							_indentChars = _input.indentChars,
							_htmlChunks = [_indent + '<table class="data">'],
							_title = _input.title,
							_rows = _input.data,
							_rowsLength = _rows.length
						;
						_title &&
							_htmlChunks.push (
								_indent + _indentChars + '<tr class="title">',
								_indent + _indentChars + _indentChars +
									'<td' + (_rowsLength ? (' colspan="' + _rows [0].length + '"') : '') + '>' +
										_toSampleCode (_title) +
									'</td>',
								_indent + _indentChars + '</tr>'
							)
						;
						for (var _rowNo = -1, _cols; ++_rowNo < _rowsLength;) {
							_htmlChunks.push (_indent + _indentChars + '<tr' + (_rowNo ? '' : ' class="heading"') + '>');
							_cols = _rows [_rowNo];
							for (var _colNo = -1, _colsLength = _cols.length, _col; ++_colNo < _colsLength;)
								_htmlChunks.push (
									_indent + _indentChars + _indentChars +
									'<td>' + _toSampleCode (_cols [_colNo]) + '</td>'
								)
							;
							_htmlChunks.push (_indent + _indentChars + '</tr>');
						}
						_htmlChunks.push (_indent + '</table>');
						return _htmlChunks.join ('\n');
					}
				},
				_slashCharCodesMap = {47:1,92:1} // 47 is forward slash, 92 is backslash
			;

		/*** Utility Functions ***/
			var _sectionIdToPathMap = {};
			function _getSectionPathFromId (_sectionId) {
				return (
					_sectionIdToPathMap [_sectionId] ||
					(_sectionIdToPathMap [_sectionId] = Uize.map (_sectionId.split ('_'),'+value'))
				);
			}

		/*** Public Static Methods ***/
			var _build = _package.build = function (_params) {
				/* PARAMETERS:
					canonicalizePeerSections
						A boolean, indicating whether or not the contents of multiple peer sections of the same name should be consolidated into a single section of that name.
					contentsList
						A boolean, specifying whether or not a contents list should be included in the generated HTML document. Defaults to true, if not specified.
					data
						the data object to be converted to HTML
					indentChars
						the characters to use for each level of indentation
					headingNumberingSeparator
						the characters to be placed between a heading's numbering and the heading's title, as in the following examples...
							1.2.3. This is the heading
							1.2.3: This is the heading
							1.2.3 - This is the heading
					headingNumberingDelimiter
						the characters to be placed between each point level in heading numbering, as in the following examples...
							1.2.3 - This is the heading
							1-2-3 - This is the heading
							1 > 2 > 3 - this is the heading
					pathToRoot
						A string, specifying the relative path to the root of the Web site that will be hosting the generated HTML document, from where the generated HTML document will be located.
					result
						A string, specifying the form in which the result should be returned. When the value ='full'= is specified, an object is returned with the following structure...

						.............................................................................................
						{
							html:htmlSTR,                             // a string, specifying the generated HTML
							contentsTreeItems:contentsTreeItemsARRAY, // a nested array representing the contents tree
							metaData:metaDataOBJ                      // an object, containing meta data properties
						}
						.............................................................................................

					sectionsToSort
						An array, containing the names of sections whose subsections should be sorted.
					urlDictionary
						An optional object, providing a dictionary of link text to URL mappings
				*/
				function _defaultedStringParam (_paramName,_defaultValue) {
					var _paramValue = _params [_paramName];
					return typeof _paramValue == _string ? _paramValue : _defaultValue;
				}
				var
					_data = _params.data,
					_urlDictionary = Uize.copyInto (Uize.lookup (_undefined,0,true),_params.urlDictionary),
					_pathToRoot = _params.pathToRoot || '',
					_indentChars = _defaultedStringParam ('indentChars','\t'),
					_headingNumberingSeparator = _defaultedStringParam ('headingNumberingSeparator','. '),
					_headingNumberingDelimiter = _defaultedStringParam ('headingNumberingDelimiter','.'),
					_maxCssClassLevel = Uize.defaultNully (_params.maxCssClassLevel,9),
					_sectionPath = [],
					_levelListItemNos = [0],
					_docLines = [],
					_contentsTree = {items:[]},
					_metaData = {}
				;
				if (typeof _data == _string)
					_data = Uize.Data.Simple.parse ({simple:_data,parseName:false,ignoreWhitespaceLines:true})
				;

				/*** support for canonicalizing peer sections of the same name ***/
					function _canonicalizePeerSections (_data) {
						var _children = _data.children;
						if (_children.length) {
							/*** collapse all same-named sections at this level ***/
								/* TODO:
									- must support section titles possibly containing aliases
									- section titles with the same display name but different aliases should be merged so that a single title exists with the union of all the aliases
								*/
								var _sectionsByTitle = Uize.lookup (_undefined,0,true); // safe empty lookup object
								for (var _childNo = -1; ++_childNo < _children.length;) {
									var
										_child = _children [_childNo],
										_childChildren = _child.children
									;
									if (_childChildren.length) {
										var
											_childSectionTitle = _child.value,
											_existingSectionOfSameName = _sectionsByTitle [_childSectionTitle]
										;
										if (_existingSectionOfSameName) {
											_existingSectionOfSameName.children =
												_existingSectionOfSameName.children.concat (_childChildren)
											;
											_children.splice (_childNo,1);
											_childNo--;
										} else {
											_sectionsByTitle [_childSectionTitle] = _child;
										}
									}
								}

							/*** perform canonicalizing within each of the peer sections ***/
								Uize.forEach (_children,_canonicalizePeerSections,true);
						}
					}
					_params.canonicalizePeerSections !== false &&
						_canonicalizePeerSections (_data)
					;

				/*** support for sorting of peer sections ***/
					var _sectionsToSort = _params.sectionsToSort;
					if (_sectionsToSort) {
						var
							_sectionsToSortLookup = Uize.lookup (_sectionsToSort),
							_sortPeerSections = function (_data) {
								var _children = _data.children;
								if (_children.length) {
									/*** sort all the peer sections (if this section should be sorted) ***/
										_sectionsToSortLookup [_data.value] && Uize.Array.Sort.sortBy (_children,'value.value');

									/*** handle sorting within each of the peer sections ***/
										Uize.forEach (_children,_sortPeerSections,true);
								}
							}
						;
						_sortPeerSections (_data);
					}

				/*** support code for intra-document section links ***/
					// populate lookups with all section titles from all levels
					var
						_allSectionTitles = Uize.lookup (_undefined,0,true),
						_allSectionTitlesLowerCase = Uize.lookup (_undefined,0,true),
						_sectionNoByLevel = [0]
					;
					function _getSectionIdFromLookup (_lookup,_sectionTitle,_localSectionPath) {
						var _sectionId = _lookup [_sectionTitle];
						if (_sectionId) {
							var
								_sectionIds = _sectionId,
								_sectionIdsLength = _sectionIds.length
							;
							_sectionId = _sectionIds [0];

							/*** if more than one section of same name, then must find closest one in the document ***/
								if (_localSectionPath && _sectionIdsLength > 1) {
									var
										_closestSectionId,
										_closestSectionPath
									;
									for (var _sectionIdNo = -1, _sectionIsCloser; ++_sectionIdNo < _sectionIdsLength;) {
										var _sectionPath = _getSectionPathFromId (_sectionId = _sectionIds [_sectionIdNo]);
										if (!(_sectionIsCloser = !_closestSectionId)) {
											/* NOTE:
												Iterate through all the sections that share the same title, finding the section whose path is closest, in the document's structure, to the specified local section path.

												For every level of the path of a section being considered, the distance between the section (at that level of the path) and the local section (at that level of the path) is compared to the distance between the currently closest section (at that level of the path) and the local section (at that level of the path).

												If the section being considered is closer (at that level of the path), then it replaces the closest section. If it is more distant (at that level of the path), then no more levels of the section's path are examined. If it as at the same distance (at that level of the path), then further levels of the section's path are examined in order to either establish that the section is closer, or that it is more distant.
											*/
											for (
												var _levelNo = -1, _sectionPathLength = _sectionPath.length;
												++_levelNo < _sectionPathLength;
											) {
												var _levelDeltaBetweenNewAbsDistanceAndClosestAbsDistance =
													Math.abs (_sectionPath [_levelNo] - (_localSectionPath [_levelNo] || 0)) -
													Math.abs (
														(_closestSectionPath [_levelNo] || 0) - (_localSectionPath [_levelNo] || 0)
													)
												;
												if (_levelDeltaBetweenNewAbsDistanceAndClosestAbsDistance < 0) {
													_sectionIsCloser = true;
													break;
												} else if (_levelDeltaBetweenNewAbsDistanceAndClosestAbsDistance > 0) {
													_sectionIsCloser = false;
													break;
												}
											}
										}
										if (_sectionIsCloser) {
											_closestSectionId = _sectionId;
											_closestSectionPath = _sectionPath;
										}
									}
									_sectionId = _closestSectionId;
								}
						}
						return _sectionId;
					}
					function _buildAllSectionTitles (_data,_level,_parentSectionId) {
						/* TO DO:
							Ultimately, for improved disambiguation, this code should handle multiple sections at different places in the document tree sharing the same name. To this end, each entry in _allSectionTitles may need to be an array of one or more section profiles. A disambiguation algorithm can then handle cases where a single title is mapped to multiple sections, finding the section that is closest to the section containing the link.
						*/
						var _children = _data.children;
						if (_children.length) {
							_sectionNoByLevel [_level]++;
							var _sectionId = _level
								? _parentSectionId + (_parentSectionId && '_') + _sectionNoByLevel [_level]
								: ''
							;
							/*** add section aliases (and lower case versions) to lookup for intra-document linking ***/
								for (
									var
										_sectionAliasNo = -1,
										_sectionAliases = (_data.value + '').split (_sectionAliasesRegExp),
										_sectionAliasesLength = _sectionAliases.length,
										_sectionAlias,
										_sectionAliasLowerCase
									;
									++_sectionAliasNo < _sectionAliasesLength;
								) {
									(
										_allSectionTitles [_sectionAlias = _sectionAliases [_sectionAliasNo]] ||
										(_allSectionTitles [_sectionAlias] = [])
									).push (
										_sectionId
									);
									(
										_allSectionTitlesLowerCase [_sectionAliasLowerCase = _sectionAlias.toLowerCase ()] ||
										(_allSectionTitlesLowerCase [_sectionAliasLowerCase] = [])
									).push (
										_sectionId
									);
								}

							/*** build section titles for deeper levels ***/
								_sectionNoByLevel [_level + 1] = 0;
								for (var _childNo = -1, _childrenLength = _children.length; ++_childNo < _childrenLength;)
									_buildAllSectionTitles (_children [_childNo],_level + 1,_sectionId)
								;
						}
					}
					_buildAllSectionTitles (_data,0,'');

				function _translateInlineFormatting (_line,_sectionPath) {
					function _format (_formattingPrefix,_text,_formattingSuffix,_linkType,_link) {
						if (!_sectionPath) return _text;

						var _linkTypeIsUrl = _linkType == 'url';
						if (_linkType && !_linkTypeIsUrl) {
							if (_linkType == 'text') _link = _text;
							var _sectionId =
								_getSectionIdFromLookup (_allSectionTitles,_link,_sectionPath) ||
								_getSectionIdFromLookup (_allSectionTitlesLowerCase,_link.toLowerCase (),_sectionPath)
							;
							_sectionId
								? (_link = '#' + _sectionId)
								: ((_link = _urlDictionary [_link] || '') && (_linkTypeIsUrl = true))
							;
						}
						if (_slashCharCodesMap [_link.charCodeAt (0)])
							_link = _pathToRoot + _link.slice (1)
						;
						return (
							_formattingPrefix +
							(
								_link
									? (
										'<a href="' + _link + '"' +
											(
												_linkTypeIsUrl && /^[a-zA-Z]+:/.test (_link)
													? ' target="_blank" class="externalSiteLink"'
													: ''
											) +
										'>' + _text + '</a>'
									)
									: _text
							) +
							_formattingSuffix
						);
					}
					return (
						_line.replace (
							/^#(\S*)/,
							function (_match,_anchorName) {return _format ('<a name="' + _anchorName + '">','','</a>')}
							/* support for anchors, of the form...
								#anchorName
							*/
						).replace (
							/\B\*.+?\*\B/g,
							function (_match) {return _format ('<b>',_match.slice (1,-1),'</b>','text')}
							/* support for bolding, of the form...
								This is some *bolded text*, and here is some more *bolded text*.
							*/
						).replace (
							/\b__.+?__\b/g,
							function (_match) {return _format ('<b><i>',_match.slice (2,-2),'</i></b>','text')}
							/* support for bolded italics, of the form...
								Here's some __bolded italics__, and here's more __bolded italics__.
							*/
						).replace (
							/\b_.+?_\b/g,
							function (_match) {return _format ('<i>',_match.slice (1,-1),'</i>','text')}
							/* support for italics, of the form...
								Here's some _italics_, and here's more _italics_.
							*/
						).replace (
							/\B==.+?==\B/g,
							function (_match) {return _format ('<code><b>',_match.slice (2,-2),'</b></code>','text')}
							/* support for bolded inline code, of the form...
								Here's some ==bolded inline code==. Ain't it purrrdy?
							*/
						).replace (
							/\B=.+?=\B/g,
							function (_match) {return _format ('<code>',_match.slice (1,-1),'</code>','text')}
							/* support for inline code, of the form...
								Here's some =inline code=. Ain't it purrrdy?
							*/
						).replace (
							/\B`.+?`\B/g,
							function (_match) {return _format ('',_match.slice (1,-1),'','text')}
							/* support for intra-document links to sections, of the form...
								See the `Mathematical Progressions` section for further details.
							*/
						).replace (
							/\[\[(#.+?|[a-zA-Z]+:.+?|.+?\.(?:htm|html|jpg|gif|png)(?:[\?#][^\]]*)?)\]\[(.+?)\]\]/g,
							function (_match,_linkHref,_linkText) {return _format ('',_linkText,'','url',_linkHref)}
							/* support for links, of the form...
								Visit [[http://www.tomkidding.com][Tom Kidding's Web site]]
								for further info, consult [[resume.html][Tom Kidding's Resume]]
							*/
						).replace (
							/\[\[(.+?)\]\[(.+?)\]\]/g,
							function (_match,_wikiWord,_linkText) {return _format ('',_linkText,'','section',_wikiWord)}
							/* support for intra-document links to sections, of the form...
								[[Mathematical Progressions][see the Mathematical Progressions section]] for further details
							*/
						).replace (
							/\[\[(#.+?|[a-zA-Z]+?:.+?)\]\]/g,
							function (_match,_linkHref) {return _format ('',_linkHref,'','url',_linkHref)}
							/* support for links, of the form...
								Visit [[http://www.tomkidding.com]]
							*/
						).replace (
							/\[\[(.+?)\]\]/g,
							function (_match,_wikiWord) {return _format ('',_wikiWord,'','text')}
							/* support for intra-document links to sections, of the form...
								See the [[Mathematical Progressions]] section for further details.
							*/
						)
					);
				}
				function _addDocLinesFromData (
					_data,_level,_parentContentsItem,_indentStr,_parentHeadingPath,_parentHeadingDisplayPrefix
				) {
					function _addDocLine (_docLine,_indent) {
						_docLines.push ((_indent !== false ? _indentStr : '') + _docLine);
					}
					function _closeListIfNeeded (_isNextLevel) {
						var _levelForList = _level + !!_isNextLevel;
						if (_levelListItemNos [_levelForList]) {
							_addDocLine ((_isNextLevel ? _indentChars : '') + '</table>');
							_levelListItemNos [_levelForList] = 0;
						}
					}
					var
						_children = _data.children,
						_value = _data.value,
						_listItemPrefixMatch
					;
					if (!_children.length) {
						if (/\r|\n|\r\n/.test (_value)) {
							/*** support for sample code blocks and arbitrary objects ***/
							var _objectHtml;
							_closeListIfNeeded ();

							/*** determine if block is arbitrary object, or just plain sample code block ***/
								var
									_objectTemplate,
									_objectParams,
									_objectTypeMatch = _value.match (_objectTypeRegExp)
								;
								if (_objectTypeMatch) {
									var
										_objectType = _objectTypeMatch [1].toLowerCase (),
										_objectTypeIsMetaData = _objectType == 'metadata'
									;
									if (_objectTypeIsMetaData || (_objectTemplate = _builtInObjectTemplates [_objectType])) {
										_objectParams = Uize.Data.Simple.parse ({
											simple:_value.slice (_objectTypeMatch [0].length),
											collapseChildren:true,
											ignoreWhitespaceLines:true
										});
										_objectTypeIsMetaData && Uize.copyInto (_metaData,_objectParams);
									}
								} else {
									_objectTemplate = _builtInObjectTemplates.samplecode;
									_objectParams = {code:_value};
								}
								if (_objectTemplate) {
									_objectParams.indent = _indentStr;
									_objectParams.indentChars = _indentChars;
									_objectHtml = _objectTemplate (_objectParams);
								}

							if (_objectHtml != _undefined) {
								_addDocLine ('');
								_addDocLine (_objectHtml,false);
								_addDocLine ('');
							}
						} else if (/^={3,}$/.test (_value)) {
							/*** support for thick horizontal rule ***/
							_closeListIfNeeded ();
							_addDocLine ('<hr class="thick"/>');
						} else if (/^-{3,}$/.test (_value)) {
							/*** support for thin horizontal rule ***/
							_closeListIfNeeded ();
							_addDocLine ('<hr class="thin"/>');
						} else if (
							(_listItemPrefixMatch = _value.match (_listItemPrefixRegExp)) &&
							/[^\w\s\d]/.test (_listItemPrefixMatch [1])
						) {
							/* support for lists
								- bullet lists (unordered, decorated with a bullet character)
									- this is a list item
									* this is a list item
									~ this is a list item
									: this is a list item
									. this is a list item

								- ordered lists
									@ this is a list item
									# this is a list item
									+ this is a list item

								[@] this is a list item
								[a] this is a list item
								[A] this is a list item
								[1] this is a list item

								(@) this is a list item
								(a) this is a list item
								(A) this is a list item
								(1) this is a list item

								{@} this is a list item
								{a} this is a list item
								{A} this is a list item
								{1} this is a list item

								<@> this is a list item
								<a> this is a list item
								<A> this is a list item
								<1> this is a list item

								<< @ >> this is a list item
								<< a >> this is a list item
								<< A >> this is a list item
								<< 1 >> this is a list item

								@) this is a list item
								a) this is a list item
								A) this is a list item
								1) this is a list item

								@] this is a list item
								a] this is a list item
								A] this is a list item
								1] this is a list item

								@> this is a list item
								a> this is a list item
								A> this is a list item
								1> this is a list item

								@ - this is a list item
								a - this is a list item
								A - this is a list item
								1 - this is a list item

								@. this is a list item
								a. this is a list item
								A. this is a list item
								1. this is a list item

								@: this is a list item
								a: this is a list item
								A: this is a list item
								1: this is a list item
							*/
							var
								_listItemPrefix = _listItemPrefixMatch [1],
								_orderingStyleMatch = _listItemPrefix.match (_orderingStyleRegExp)
							;
							_levelListItemNos [_level] ||
								_addDocLine ('<table class="list">')
							;
							if (_orderingStyleMatch) {
								var
									_orderingStyle = _orderingStyleMatch [1],
									_orderingStr = ''
								;
								if (/[#\+]|\d+/.test (_orderingStyle)) {
									_orderingStr = _levelListItemNos [_level] + 1 + '';
								} else if (/[@a-z]/i.test (_orderingStyle)) {
									_orderingStr = 'abcdefghijklmnopqrstuvwxyz'.charAt (_levelListItemNos [_level]);
									if (/[A-Z]/.test (_orderingStyle))
										_orderingStr = _orderingStr.toUpperCase ()
									;
								}
								_listItemPrefix = _listItemPrefix.replace (_orderingStyleRegExp,_orderingStr) + '&nbsp;';
							} else {
								_listItemPrefix = _onlyBulletCharRegExp.test (_listItemPrefix)
									? _listItemPrefix.replace (_bulletCharRegExp,'<span class="bullet"></span>')
									: _toSampleCode (_listItemPrefix) + '&nbsp;'
								;
							}
							_addDocLine (
								'<tr valign="top">' +
									'<td style="white-space:nowrap;">' + _listItemPrefix + '</td>' +
									'<td>' +
										_translateInlineFormatting (_value.replace (_listItemPrefixRegExp,''),_sectionPath) +
									'</td>' +
								'</tr>'
							);
							_levelListItemNos [_level]++;
						} else {
							/*** support for paragraph ***/
							_closeListIfNeeded ();
							var _paragraph = _translateInlineFormatting (_value,_sectionPath);
							if (/[A-Z]/.test (_paragraph) && !/[a-z]/.test (_paragraph))
								_paragraph = '<span class="allCaps">' + _paragraph + '</span>'
							;
							_addDocLine ('<p>' + _paragraph + '</p>');
							_addDocLine ('');
						}
					} else {
						_closeListIfNeeded ();
						_sectionPath [_level - 1]++;
						var
							_aliasDelimiterPos = _value.search (_sectionAliasesRegExp),
							_headingSansAliases = _aliasDelimiterPos > -1 ? _value.slice (0,_aliasDelimiterPos) : _value,
							_cssClassLevel = Math.min (_level,_maxCssClassLevel),
							_hasNumbering = _level > 0 && true /* TO DO: add switch for numbering at some point */,
							_headingPrefix = _hasNumbering ? _sectionPath.join ('_') : '',
							_headingTitle =
								(
									_sectionPath.length
										? _sectionPath.join (_headingNumberingDelimiter) + _headingNumberingSeparator
										: ''
								) + _headingSansAliases,
							_headingPath = (_parentHeadingPath ? (_parentHeadingPath + ' -> ') : '') + _headingTitle,
							_headingPathAsTitleAttribute = ' title="' + Uize.Xml.toAttributeValue (_headingPath) + '"',
							_headingDisplayPrefix = _hasNumbering
								? (
									(
										_parentHeadingDisplayPrefix
											? (_parentHeadingDisplayPrefix + _headingNumberingDelimiter)
											: ''
									) +
									'<a href="#' + _headingPrefix + '"' + _headingPathAsTitleAttribute + '>' +
										_sectionPath [_level - 1] +
									'</a>'
								)
								: '',
							_contentsItem = {
								title:_headingTitle || 'Contents',
								description:
									_children [0].children.length
										? ''
										: _Uize_String_limitLength (_translateInlineFormatting (_children [0].value),400),
								link:_headingPrefix ? ('#' + _headingPrefix) : '',
								items:[]
							}
						;
						_parentContentsItem.items.push (_contentsItem);
						if (_value) {
							var
								_hTag = 'h' + Math.min (_level,5),
								_headingNumber = _headingDisplayPrefix + _headingNumberingSeparator
							;
							_addDocLine ('<a name="' + _headingPrefix + '"></a>');
							_addDocLine (
								'<' + _hTag + ' class="heading' + _cssClassLevel + '"' + _headingPathAsTitleAttribute + '>' +
									(
										_headingDisplayPrefix
											? '<span class="headingNumber">' + _headingNumber + '</span>'
											: ''
									) +
									_headingSansAliases +
								'</' + _hTag + '>'
							);
						}
						_addDocLine ('<div class="contents' + _cssClassLevel + '">');
						_sectionPath [_level] = _levelListItemNos [_level + 1] = 0;
						for (var _childNo = -1, _childrenLength = _children.length; ++_childNo < _childrenLength;)
							_addDocLinesFromData (
								_children [_childNo],
								_level + 1,
								_contentsItem,
								_indentStr + _indentChars,
								_headingPath,
								_headingDisplayPrefix
							)
						;
						_closeListIfNeeded (true);
						/\S/.test (_docLines [_docLines.length - 1]) || _docLines.pop ();
						_addDocLine ('</div>');
						_addDocLine ('');
						_sectionPath.length = _level;
					}
				}
				_addDocLinesFromData (_data,0,_contentsTree,'','','');
				var
					_contentsTreeItems = _contentsTree.items,
					_html = (
						_params.contentsList !== false &&
						(
							/* NOTE:
								content tree must have some root items, and must either have more than one root item, or the single root item must have at least one child item
							*/
							_contentsTreeItems.length &&
							(_contentsTreeItems.length > 1 || _contentsTreeItems [0].items.length)
						)
							? (
								'<div id="page_contents" class="contents-tree-shell">\n' +
									Uize.Templates.List.process ({items:_contentsTreeItems}) + '\n' +
								'</div>\n' +
								'\n'
							)
							: ''
					) + _docLines.join ('\n')
				;
				return (
					_params.result == 'full'
						? {
							html:_html,
							contentsTreeItems:_contentsTreeItems,
							metaData:_metaData
						}
						: _html
				);
			};

			_package.toDocument = function (_simple,_simpleDocParams) {
				return _build (Uize.copyInto ({data:_simple},_simpleDocParams));
			};

			var _toSampleCode = _package.toSampleCode = function (_sourceStr) {
				return _sourceStr.replace (/\t/g,'  ').replace (/&/g,'&amp;').replace (/</g,'&lt;').replace (/>/g,'&gt;');
			};

			return _package;
	}
});

