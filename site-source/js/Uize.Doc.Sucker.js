/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Doc.Sucker Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2006-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 5
	codeCompleteness: 85
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Doc.Sucker= package provides methods for extracting SimpleDoc documentation from special documentation comments inside JavaScript source code.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module({
	name:'Uize.Doc.Sucker',
	required:[
		'Uize.Build.Scruncher',
		'Uize.String',
		'Uize.String.Lines',
		'Uize.Data.Simple',
		'Uize.Doc.Simple',
		'Uize.Util.Oop'
	],
	builder:function () {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var _package = function () {};

		/*** General Variables ***/
			var
				_docCommentRegExp = /^\/\*\?/,
				_featureTypeToSectionTitleSuffix = {Method:'Methods',Property:'Properties'}
			;

		/*** Public Static Methods ***/
			_package.suckDoc = function (_javascriptSource,_module,_modulesTree,_examples) {
				var _simpleDocChunks = [];
				for (
					var
						_commentNo = -1,
						_comment,
						_comments = Uize.Build.Scruncher.scrunch (_javascriptSource).comments,
						_commentsLength = _comments.length
					;
					++_commentNo < _commentsLength;
				) {
					_docCommentRegExp.test (_comment = _comments [_commentNo]) &&
						_simpleDocChunks.push (
							Uize.String.Lines.normalizeIndent (_comment.replace (_docCommentRegExp,'').replace (/\*\/$/,''))
						)
					;
				}
				if (_module) {
					var
						_moduleName = Uize.Util.Oop.getClassName (_module),
						_isClass = Uize.Util.Oop.isUizeClass (_module)
					;

					/*** append sections for automatically detected features ***/
						var
							_featuresPerSection = {
								'Instance Methods':[],
								'Instance Properties':[],
								'State Properties':[],
								'Static Methods':[],
								'Static Properties':[]
							},
							_featuresSectionTitle,
							_nonInheritableStatics = _module.nonInheritableStatics
						;
						for (
							var
								_featureNo = -1,
								_features = Uize.Util.Oop.getFeatures (_module),
								_featuresLength = _features.length,
								_feature
							;
							++_featureNo < _featuresLength;
						)
							(_feature = _features [_featureNo]).access == 'Public' &&
							_featureTypeToSectionTitleSuffix [_feature.type] &&
								_featuresPerSection [
									_feature.context + ' ' + _featureTypeToSectionTitleSuffix [_feature.type]
								].push (
									_feature
								)
						;

						for (_featuresSectionTitle in _featuresPerSection) {
							var
								_features = _featuresPerSection [_featuresSectionTitle],
								_featuresLength = _features.length
							;
							if (_featuresLength) {
								_simpleDocChunks.push (_featuresSectionTitle + '\n');
								for (var _featureNo = -1; ++_featureNo < _featuresLength;) {
									var
										_feature = _features [_featureNo],
										_introducedIn = _feature.introducedIn,
										_introducedInModuleName = Uize.Util.Oop.getClassName (_introducedIn),
										_overriddenIn = _feature.overriddenIn,
										_overriddenInModuleName = Uize.Util.Oop.getClassName (_overriddenIn)
									;
									_simpleDocChunks.push (
										'\t' + _feature.name + '\n' +
										(
											_overriddenIn != _module
												? (
													'\t\tInherited from =' + _overriddenInModuleName + '=' +
													(
														_introducedIn != _overriddenIn
															? ', but introduced in =' + _introducedInModuleName + '='
															: ''
													) +
													'.\n'
												)
												: ''
										) +
										'\n' +
										'\t\tIMPLEMENTATION INFO\n' +
										'\t\t- ' + (
											_introducedIn == _module
												? 'this feature was introduced in this module'
												: (
													(
														_overriddenIn == _module
															? 'this is an override of an inherited feature'
															: 'this is an inherited feature'
													) + (
														' (' +
															'implementation is in ' +
															(
																_overriddenIn != _module
																	? ('=' + _overriddenInModuleName + '=')
																	: 'this module'
															) +
															', first introduced in ' +
															(
																_introducedIn != _module
																	? ('=' + _introducedInModuleName + '=')
																	: 'this module'
															) +
														')'
													)
												)
										) + '\n' +
										(
											_isClass && _feature.context == 'Static'
												?
													'\t\t- this static feature is ' +
													(_nonInheritableStatics [_feature.shortName] ? '*not*' : '') +
													' inherited by subclasses\n'
												: ''
										)
									);
								}
							}
						}

					/*** append examples section ***/
						_simpleDocChunks.push (
							'Introduction\n' +
								'\tExamples\n' +
									(
										_examples && _examples.length
											?
												(
													'\t\tThe following example pages are good showcases for the =' + _moduleName + '= module...\n' +
													Uize.map (
														_examples,
														'"\\t\\t- [[" + value.url + "][" + value.title + "]] - " + value.description + "\\n"'
													).join ('')
												)
											: '\t\tThere are no dedicated showcase example pages for the =' + _moduleName + '= module.\n'
									) +
									'\n' +
									'\t\tSEARCH FOR EXAMPLES\n' +
									'\t\tUse the link below to search for example pages on the UIZE Web site that reference the =' + _moduleName + '= module...\n' +
									'\t\t[[http://www.google.com/search?hl=en&safe=off&domains=uize.com%2Fexamples&sitesearch=uize.com%2Fexamples&q=%22' + _moduleName + '%22][SEARCH]]\n' +
							'\n'
						);

					/*** append implementation info section ***/
						var _inheritanceChain = _isClass && Uize.Util.Oop.getInheritanceChain (_module);
						_simpleDocChunks.push (
							'Introduction\n' +
								'\tImplementation Info\n' +
									'\t\tThe =' + _moduleName + '= module defines the =' + _moduleName + '= ' +
									(
										_isClass
											? 'class'
											: /\.x[A-Z0-9_$][a-zA-Z0-9_$]*$/.test (_moduleName)
												? 'extension module'
												: Uize.Util.Oop.isPackage (_module)
													? 'package'
													: 'object'
									) +
									(
										_isClass
											? (
												_module != Uize
													?
														', which is a subclass of =' +
														Uize.Util.Oop.getClassName (_module.superclass) +
														'='
													: ''
											)
											: _moduleName.indexOf ('.') > -1
												?
													' under the =' +
													_moduleName.slice (0,_moduleName.lastIndexOf ('.')) +
													'= namespace'
												: ''
									) + '.\n' +
									'\n' +
									(
										_isClass
											? (
												'\t\tINHERITANCE CHAIN\n' +
												'\t\t' +
													Uize.map (_inheritanceChain,'"=" + value.moduleName + "="').join (' -> ') +
													'\n' +
												'\n'
											)
											: ''
									)
						);

						/*** list out features according to where they are introduced and overridden ***/
							var _addFilteredFeatures = function (
								_relationshipToModule,_sectionTitle,_introduction,_introductionIfNoFeatures
							) {
								var
									_hasFilteredFeatures,
									_filteredFeaturesChunks = []
								;
								for (_featuresSectionTitle in _featuresPerSection) {
									for (
										var
											_featureNo = -1,
											_features = _featuresPerSection [_featuresSectionTitle],
											_featuresLength = _features.length,
											_filteredFeatures = [],
											_feature
										;
										++_featureNo < _featuresLength;
									) {
										_feature = _features [_featureNo];
										if (
											_feature.introducedIn == _module
												? _relationshipToModule == 'introduced'
												: _feature.overriddenIn == _module
													? _relationshipToModule == 'overridden'
													: _relationshipToModule == 'inherited'
										)
											_filteredFeatures.push (_feature)
										;
									}
									if (_filteredFeatures.length) {
										_hasFilteredFeatures = true;
										_filteredFeaturesChunks.push (
											'\t\t\t' + _featuresSectionTitle.toUpperCase () + '\n' +
											'\t\t\t' + Uize.map (_filteredFeatures,'"=" + value.name + "="').join (' | ') + '\n' +
											'\n'
										);
									}
								}
								_simpleDocChunks.push (
									_sectionTitle,
									_hasFilteredFeatures ? _introduction : _introductionIfNoFeatures,
									'\n',
									_filteredFeaturesChunks.join ('')
								);
							};

							/*** list out features introduced in this module ***/
								_addFilteredFeatures (
									'introduced',
									'\t\tFeatures Introduced in This Module\n',
									'\t\t\tThe features listed in this section have been introduced in this module.\n',
									'\t\t\tNo features have been introduced in this module.\n'
								);

							/*** list out features overridden in this module ***/
								_addFilteredFeatures (
									'overridden',
									'\t\tFeatures Overridden in This Module\n',
									'\t\t\tThe features listed in this section have been overridden in this module.\n' +
									'\n' +
									'\t\t\tThe module that an overridden feature was initially introduced in will be noted in the IMPLEMENTATION INFO notes for the feature.\n',
									'\t\t\tNo features have been overridden in this module.\n'
								);

							/*** list out features inherited from other modules ***/
								_addFilteredFeatures (
									'inherited',
									'\t\tFeatures Inherited From Other Modules\n',
									'\t\t\tThe features listed in this section have been inherited from other modules.\n' +
									'\n' +
									'\t\t\tThe module that an inherited feature was initially introduced in will be noted in the IMPLEMENTATION INFO notes for the feature.\n',
									'\t\t\tThis module has no inherited features.\n'
								);

						/*** list all modules directly under this module's namespace ***/
							if (_modulesTree) {
								var _moduleNode = _modulesTree;
								for (
									var
										_moduleNamePartNo = -1,
										_moduleNameParts = _moduleName.split ('.'),
										_moduleNamePartsLength = _moduleNameParts.length
									;
									++_moduleNamePartNo < _moduleNamePartsLength;
								)
									_moduleNode = _moduleNode [_moduleNameParts [_moduleNamePartNo]]
								;
								var _modulesUnderNamespace = Uize.keys (_moduleNode);
								_simpleDocChunks.push (
									'\t\tModules Directly Under This Namespace\n' +
									'\t\t\t' +
									(
										_modulesUnderNamespace.length
											? Uize.String.hugJoin (_modulesUnderNamespace,'=' + _moduleName + '.','=',' | ')
											: 'There are no modules directly under this namespace.'
									) + '\n' +
									'\n'
								);
							}

						/*** append unit tests info ***/
							if (_modulesTree) {
								var _unitTestModuleName = _moduleName.split ('.',1) [0] + '.Test.' + _moduleName;
								_simpleDocChunks.push (
									'\t\tUnit Tests\n' +
									'\t\t\t' +
										(
											(
												function () {
													var mt = _modulesTree;
													try {return eval ('mt.' + _unitTestModuleName) != undefined} catch (_error) {}
												}
											) ()
												? 'The =' + _moduleName + '= module is unit tested by the =' + _unitTestModuleName + '= test module.'
												: 'There is no dedicated unit tests module for the =' + _moduleName + '= module.'
										) + '\n' +
									'\n'
								);
							}
				}
				return _simpleDocChunks.join ('\n');
			};

			_package.toDocument = function (_javascriptSource,_params) {
				/* PARAMETERS:
					module
						A reference to a module, for which the JavaScript source is providing documentation.

					modulesTree
						An object, defining the hierarchical modules tree.

					examples
						An array, listing examples that showcase the module.

						Each element of the =examples= array is an object of the form...

						..............................
						{
							path:filePathSTR,
							title:titleSTR,
							keywords:keywordsSTR,
							description:descriptionSTR,
							imageSrc:imageSrcSTR
						}
						..............................
				*/
				function _extractParam (_paramName) {
					var _paramValue;
					if (_paramName in _params) {
						_paramValue = _params [_paramName];
						delete _params [_paramName];
					}
					return _paramValue;
				}
				return (
					Uize.Doc.Simple.build (
						Uize.copyInto (
							{
								data:_package.suckDoc (
									_javascriptSource,
									_extractParam ('module'),
									_extractParam ('modulesTree'),
									_extractParam ('examples')
								),
								sectionsToSort:[
									/*** methods ***/
										'Instance Methods',
										'Static Methods',
										//'Parameters', -- problematic, because some methods have Parameters sections, where it's not appropriate to sort the parameters, since they should be listed in the order in which they appear in the arguments list
									/*** properties ***/
										'Instance Properties',
										'Static Properties',
										'State Properties',
									/*** events ***/
										'Instance Events',
										'Static Events',
									/*** widgets & nodes ***/
										'Child Widgets',
										'Implied Nodes',
									/*** misc ***/
										'Deprecated Features'
								]
							},
							_params
						)
					)
				);
			};

		return _package;
	}
});

