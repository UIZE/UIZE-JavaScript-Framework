/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeDotCom.SiteMap
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2009-2011 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*ScruncherSettings Mappings="=" LineCompacting="TRUE"*/

/*?
	Introduction
		A package that defines a tree data structure for the *uize.com* Web site's site hierarchy.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'UizeDotCom.SiteMap',
	required:[
		'UizeDotCom.ModulesTree',
		'UizeDotCom.ExamplesInfoForSiteMap'
	],
	builder:function () {
		var _data;
		return function () {
			if (!_data) {
				var _divider = {title:'-'};

				/*** build the modules reference items from the modules tree data ***/
					function _getModuleReferenceUrl (_moduleName) {
						return 'reference/' + _moduleName + '.html';
					}
					function _buildModuleItem (_moduleHost,_moduleSubModuleName,_moduleProfile) {
						var
							_moduleName = _moduleHost + (_moduleHost && '.') + _moduleSubModuleName,
							_moduleLink = _getModuleReferenceUrl (_moduleName),
							_item = {title:_moduleSubModuleName,link:_moduleLink},
							_itemItems = _item.items = []
						;
						if (_moduleProfile)
							for (var _subModule in _moduleProfile)
								_itemItems.push (
									_buildModuleItem (_moduleName,_subModule,_moduleProfile [_subModule])
								)
						;
						_itemItems.length && _moduleName &&
							_itemItems.unshift (
								{title:'[[ BASE ]]',link:_moduleLink},
								_divider
							)
						;
						return _item;
					}
					var _modulesReferenceItem = _buildModuleItem ('','',UizeDotCom.ModulesTree ());
					_modulesReferenceItem.title = 'Module Reference';
					_modulesReferenceItem.link = 'javascript-modules-index.html';

				/*** file size optimization tricks ***/
					function _item (_title,_section,_link) {
						return {
							title:_title,
							link:(_section || '') + (_link || _title.toLowerCase ().replace (/\W+/g,'-')) + '.html'
						}
					}
					function _explainer (_title,_link) {return _item (_title,'explainers/',_link)}
					function _news (_year) {return _item (_year + ' News','','news-' + _year)}
					function _javaScriptReference (_title,_link) {return _item (_title,'javascript-reference/',_link)}
					function _appendix (_title,_link) {return _item (_title,'appendixes/',_link)}
					function _perfTest (_title,_link) {return _item (_title,'tests/performance/',_link)}

				/*** utilize the info from the UizeDotCom.ExamplesInfoForSiteMap module ***/
					var _infoForSiteMap = UizeDotCom.ExamplesInfoForSiteMap ();

					/*** build the examples submenu's items ***/
						function _examplesByTheme (_tour) {
							var _tourIndexLink = 'javascript-' + (_tour != 'all' ? (_tour + '-') : '') + 'examples.html';
							return {
								title:Uize.capFirstChar (_tour) + ' examples',
								link:_tourIndexLink,
								items:[
									{
										title:'TOUR ' + _tour.toUpperCase () + ' EXAMPLES',
										link:'javascript-feature-tours.html?tour=' + _tour
									},
									_divider,
									{
										title:'Index of ' + _tour + ' examples',
										link:_tourIndexLink
									}
								]
							}
						}
						var _examplesSubmenuItems = [
							_examplesByTheme ('featured'),
							_divider
						];
						for (
							var
								_keywordNo = -1,
								_keywords = _infoForSiteMap.keywords,
								_keywordsLength = _keywords.length,
								_keyword
							;
							++_keywordNo < _keywordsLength;
						)
							((_keyword = _keywords [_keywordNo]) != 'featured') &&
								_examplesSubmenuItems.push (_examplesByTheme (_keyword))
						;
						_examplesSubmenuItems.push (
							_divider,
							_examplesByTheme ('all'),
							_divider,
							{
								title:'EXAMPLES, BY MODULE...',
								link:'javascript-examples-by-module.html'
							}
						);

					/*** build the tools submenu's items ***/
						var _toolsSubmenuItems = [
							_item ('The DELVE Tool','','explainers/using-the-delve-tool'),
							_explainer ('JavaScript Bookmarklets'),
							_divider
						];
						for (
							var _toolNo = -1, _tools = _infoForSiteMap.tools, _toolsLength = _tools.length, _tool;
							++_toolNo < _toolsLength;
						)
							_toolsSubmenuItems.push ({
								title:(_tool = _tools [_toolNo]).title,
								link:_tool.path
							})
						;
						_toolsSubmenuItems.push (
							_divider,
							_item ('Index of JavaScript Tools','','javascript-tool-examples')
						);

				_data = [
					_item ('Home','','index'),
					_item ('DOWNLOAD'),
					_explainer ('Getting Started'),
					{
						title:'Latest News',
						link:'latest-news.html',
						items:[
							_news (2011),
							_news (2010),
							_news (2009),
							_news (2008),
							_news (2006)
						]
					},
					_divider,
					{
						title:'Examples',
						link:'javascript-examples.html',
						items:_examplesSubmenuItems
					},
					_appendix ('Showcase'),
					{
						title:'Widgets To Go',
						link:'javascript-widgets.html'
					},
					{
						title:'Tools',
						link:'javascript-tool-examples.html',
						items:_toolsSubmenuItems
					},
					_divider,
					{
						title:'Explainers',
						link:'javascript-explainers.html',
						items:[
							_explainer ('Introduction to UIZE'),
							_explainer ('Getting Started With UIZE','getting-started'),
							_explainer ('Using the Documentation'),
							_explainer ('Overview of Features'),
							_explainer ('Building UIZE-powered Pages'),
							{
								title:'MORE TOPICS...',
								items:[
									_explainer ('JavaScript Modules'),
									_explainer ('JavaScript Inheritance'),
									_explainer ('Set-get Properties'),
									_explainer ('JavaScript Event System'),
									_divider,
									_explainer ('JavaScript DOM Events'),
									_explainer ('JavaScript Widgets'),
									_explainer ('JavaScript Localization'),
									_explainer ('JavaScript Templates'),
									_explainer ('JavaScript Animation and Effects'),
									_divider,
									_explainer ('JavaScript Libraries'),
									_explainer ('JavaScript Build Scripts'),
									_explainer ('JavaScript Testing Framework'),
									_explainer ('JavaScript Documentation System'),
									_explainer ('All About Scrunching'),
									_explainer ('JavaScript Troubleshooting'),
									_explainer ('Using the DELVE Tool'),
									_divider,
									_explainer ('General Constructs'),
									_explainer ('JavaScript Bookmarklets'),
									_explainer ('The Philosophy of UIZE','philosophy-of-uize')
								]
							},
							_divider,
							_item ('Index of JavaScript Explainers','','javascript-explainers')
						]
					},
					_modulesReferenceItem,
					{
						title:'JavaScript Reference',
						items:[
							_javaScriptReference ('Array'),
							_javaScriptReference ('Boolean'),
							_javaScriptReference ('Date'),
							_javaScriptReference ('Function'),
							_javaScriptReference ('Math'),
							_javaScriptReference ('Number'),
							_javaScriptReference ('Object'),
							_javaScriptReference ('RegExp'),
							_javaScriptReference ('String'),
							_javaScriptReference ('Window'),
							_javaScriptReference ('XMLHTTPRequest')
						]
					},
					{
						title:'Appendixes',
						items:[
							_appendix ('Press Center'),
							_appendix ('Showcase'),
							_item ('License'),
							_divider,
							_appendix ('Credits'),
							_item ('Endorsements'),
							_divider,
							_appendix ('HTML Style Guide'),
							_appendix ('JavaScript Code Conventions'),
							_appendix ('JavaScript Optimization'),
							_divider,
							_item ('Index of JavaScript Modules','','javascript-modules-index'),
							_appendix ('SOTU (State of the UIZE)','sotu'),
							_divider,
							_appendix ('JavaScript Fun'),
							_appendix ('JavaScript Interview Questions'),
							_appendix ('Code Fragments'),
							_appendix ('Glossary')
						]
					},
					_divider,
					{
						title:'UIZE Development',
						items:[
							_explainer ('Creating a New UIZE Module'),
							_explainer ('Creating a New UIZE Example Page'),
							_appendix ('SOTU (State of the UIZE)','sotu'),
							_item ('UIZE Unit Tests','examples/'),
							{
								title:'Performance Tests',
								items:[
									_perfTest ('Array Iteration Styles'),
									_perfTest ('Caching Node References'),
									_perfTest ('Checking if Undefined'),
									_perfTest ('Extended String Class'),
									_perfTest ('getElementById vs getElementsByName','getElementById-vs-getElementsByName'),
									_perfTest ('Repeat String Approaches'),
									_perfTest ('Storing Length for Iterator'),
									_perfTest ('Storing Reference to Sub-object','storing-reference-to-subobject'),
									_perfTest ('String Concatenation Approaches'),
									_perfTest ('String Match Conditional Styles'),
									_perfTest ('String Starts With Substring Styles')
								]
							},
							{
								title:'TO DO',
								items:[
									_appendix ('TO DO - Modules'),
									_appendix ('TO DO - Documentation'),
									_appendix ('TO DO - General')
								]
							}
							/*
							,
							{
								title:'Issue, Browser, Language Tests',
								items:[
									_item ('Multi-line Return Statements','tests/issues/','multiline-return-statements'),
									_item ('Styling AREA Tags','tests/issues/'),
									_item ('Undefined Across Frames','tests/issues/')
								]
							}
							*/
						]
					},
					_divider,
					_item ('SUPPORT'),
					_item ('SITE MAP','','directory'),
					_item ('SEARCH','','search-sections')
				];
			}
			return _data;
		};
	}
});


