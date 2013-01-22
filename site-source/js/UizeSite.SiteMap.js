/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.SiteMap
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2009-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*?
	Introduction
		A package that defines a tree data structure for the UIZE Web site's site hierarchy.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'UizeSite.SiteMap',
	required:[
		'UizeSite.ModulesTree',
		'UizeSite.ExamplesInfoForSiteMap'
	],
	builder:function () {
		'use strict';

		var _data;
		return function (_overrides) {
			if (!_data || _overrides) {
				if (!_overrides)
					_overrides = {}
				;
				var _divider = {title:'-'};

				/*** build the modules reference items from the modules tree data ***/
					var
						_buildModuleItem = function (_moduleHost,_moduleSubModuleName,_moduleProfile) {
							var
								_moduleName = _moduleHost + (_moduleHost && '.') + _moduleSubModuleName,
								_moduleLink = 'reference/' + _moduleName + '.html',
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
						},
						_modulesReferenceItem = _buildModuleItem ('','',_overrides.modulesTree || UizeSite.ModulesTree ())
					;
					_modulesReferenceItem.title = 'Module Reference';
					_modulesReferenceItem.link = 'javascript-modules-index.html';

				/*** file size optimization tricks ***/
					var
						_item = function (_title,_section,_link) {
							return {
								title:_title,
								link:(_section || '') + (_link || _title.toLowerCase ().replace (/\W+/g,'-')) + '.html'
							}
						},
						_explainer = function (_title,_link) {return _item (_title,'explainers/',_link)},
						_news = function (_year) {return _item (_year + ' News','','news-' + _year)},
						_javaScriptReference = function (_title,_link) {return _item (_title,'javascript-reference/',_link)},
						_appendix = function (_title,_link) {return _item (_title,'appendixes/',_link)},
						_todo = function (_title,_link) {return _item (_title,'todo/',_link)},
						_perfTest = function (_title,_link) {return _item (_title,'tests/performance/',_link)}
					;

				/*** utilize the info from the UizeSite.ExamplesInfoForSiteMap module ***/
					var _infoForSiteMap = _overrides.examplesInfo || UizeSite.ExamplesInfoForSiteMap ();

					/*** build the examples submenu's items ***/
						var
							_examplesByTheme = function (_tour) {
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
							},
							_examplesSubmenuItems = [
								_examplesByTheme ('featured'),
								_divider
							]
						;
						Uize.forEach (
							_infoForSiteMap.keywords,
							function (_keyword) {
								_keyword  != 'featured' && _examplesSubmenuItems.push (_examplesByTheme (_keyword));
							}
						);
						_examplesSubmenuItems.push (
							_divider,
							_examplesByTheme ('all'),
							_divider,
							{
								title:'EXAMPLES, BY MODULE...',
								link:'javascript-examples-by-module.html'
							}
						);

				_data = [
					_item ('Home','','index'),
					_item ('DOWNLOAD'),
					_explainer ('Getting Started'),
					{
						title:'Latest News',
						link:'latest-news.html',
						items:[
							_news (2013),
							_news (2012),
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
						items:
							[
								_item ('The DELVE Tool','','explainers/using-the-delve-tool'),
								_explainer ('JavaScript Bookmarklets'),
								_divider
							].concat (
								Uize.map (
									_infoForSiteMap.tools,
									function (_tool) {return {title:_tool.title,link:_tool.path}}
								),
								[
									_divider,
									_item ('Index of JavaScript Tools','','javascript-tool-examples')
								]
							)
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
									_explainer ('State Properties'),
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
									_explainer ('JavaScript Strict Mode'),
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
						link:'javascript-reference.html',
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
						link:'appendixes.html',
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
									_todo ('Modules'),
									_todo ('Documentation'),
									_todo ('General'),
									_todo ('News Announcements'),
									_todo ('External Site Integration')
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


