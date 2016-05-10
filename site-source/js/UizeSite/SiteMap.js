/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.SiteMap
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2009-2016 UIZE
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
						_guide = function (_title,_link) {return _item (_title,'guides/',_link)},
						_whitePaper = function (_title,_link) {return _item (_title,'white-papers/',_link)},
						_news = function (_year) {return _item (_year + ' News','','news-' + _year)},
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
					{
						title:'Latest News',
						link:'latest-news.html',
						items:[
							_news (2015),
							_news (2014),
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
					_item ('DOWNLOAD'),
					{
						title:'Getting Started',
						link:'guides/getting-started.html',
						items:[
							_guide ('Getting Started With UIZE','getting-started'),
							_divider,
							_guide ('Introduction to UIZE'),
							_guide ('Overview of Features'),
							_guide ('Using the Documentation'),
							_guide ('Building UIZE-powered Pages'),
							_divider,
							_guide ('The Philosophy of UIZE','philosophy-of-uize')
						]
					},
					_divider,
					{
						title:'Examples',
						link:'javascript-examples.html',
						items:_examplesSubmenuItems
					},
					{
						title:'Tools',
						link:'javascript-tool-examples.html',
						items:
							[
								_item ('The DELVE Tool','','guides/using-the-delve-tool'),
								_guide ('JavaScript Bookmarklets'),
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
					{
						title:'Guides',
						link:'javascript-guides.html',
						items:[
							_guide ('Getting Started With UIZE','getting-started'),
							_divider,
							_guide ('Modules','javascript-modules'),
							_guide ('Classes and Inheritance'),
							_guide ('State Properties'),
							_guide ('Event System','javascript-event-system'),
							_divider,
							_guide ('DOM Events','javascript-dom-events'),
							_guide ('Widgets','javascript-widgets'),
							_guide ('Templates','javascript-templates'),
							_guide ('Animation and Effects','javascript-animation-and-effects'),
							_divider,
							{
								title:'i18n & Localization',
								items:
									[
										_guide ('Localization','javascript-localization'),
										_guide ('Localization Automation'),
										_divider,
										_whitePaper ('Whitepaper - Localization','localization'),
										_whitePaper ('Whitepaper - Resource String Guidelines','resource-string-guidelines')
									]
							},
							_divider,
							_guide ('Libraries','javascript-libraries'),
							_guide ('Build Scripts','javascript-build-scripts'),
							_guide ('Testing Framework','javascript-testing-framework'),
							_guide ('Documentation System','javascript-documentation-system'),
							_guide ('All About Scrunching'),
							_guide ('Strict Mode','javascript-strict-mode'),
							_divider,
							_guide ('Troubleshooting','javascript-troubleshooting'),
							_guide ('Using the DELVE Tool'),
							_divider,
							_guide ('General Constructs'),
							_guide ('Bookmarklets','javascript-bookmarklets'),
							_divider,
							_item ('Index of JavaScript Guides','','javascript-guides')
						]
					},
					_modulesReferenceItem,
					_divider,
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
							_item ('Widgets To Go','','javascript-widgets'),
							_appendix ('SOTU (State of the UIZE)','sotu'),
							_divider,
							_appendix ('JavaScript Fun'),
							_appendix ('JavaScript Interview Questions'),
							_appendix ('Glossary')
						]
					},
					{
						title:'UIZE Development',
						items:[
							_guide ('Creating a New UIZE Module'),
							_guide ('Creating a New UIZE Example Page'),
							_divider,
							_item ('UIZE Unit Tests','examples/'),
							_item ('Widget Visual Tests','examples/'),
							_item ('Widget Visual Samplers','examples/'),
							{
								title:'Performance Tests',
								items:[
									_perfTest ('Caching Node References'),
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
							_divider,
							_appendix ('SOTU (State of the UIZE)','sotu'),
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
					{
						title:'White Papers',
						link:'javascript-white-papers.html',
						items:[
							_whitePaper ('Localization')
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


