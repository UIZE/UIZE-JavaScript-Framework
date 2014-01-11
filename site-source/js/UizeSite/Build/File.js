/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Build.File Namespace
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2012-2014 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 5
	codeCompleteness: 0
	docCompleteness: 2
*/

/*?
	Introduction
		The =UizeSite.Build.File= package provides a method for building any file requested for the UIZE Web site.

		*DEVELOPERS:* `Chris van Rensburg`

		EXAMPLE USAGE
		......................................................................................................
		node build.js UizeSite.Build.File url=reference/Uize.html sourcePath=site-source tempPath=site-temp memoryPath=site-memory builtPath=site-built staleBefore=now
		......................................................................................................

		Parameters
			builtPath
				.

			staleBefore
				.

			isDev
				.

			memoryPath
				.

			staleBefore
				.

			url
				.

			sourcePath
				.

			tempPath
				.
*/

Uize.module ({
	name:'UizeSite.Build.File',
	superclass:'Uize.Services.FileBuilderAdapter.Basic',
	required:[
		'UizeSite.Build.FileBuilders.Homepage',
		'UizeSite.Build.FileBuilders.TempModulesTreeModule',
		'UizeSite.Build.FileBuilders.TempExamplesModule',
		'UizeSite.Build.FileBuilders.TempExamplesInfoForSiteMapModule',
		'UizeSite.Build.FileBuilders.TempSotuModule',
		'UizeSite.Build.FileBuilders.ModuleInfoModules',
		'UizeSite.Build.FileBuilders.WidgetsToGo.GoogleGadgetXmlPages',
		'UizeSite.Build.FileBuilders.WidgetsToGo.IndexPage',
		'UizeSite.Build.FileBuilders.WidgetsToGo.WidgetHomepages',
		'UizeSite.Build.FileBuilders.WidgetsToGo.WidgetIframePages',
		'UizeSite.Build.FileBuilders.GoogleCodeSitemap',
		'Uize.Build.FileBuilders.InMemoryHtmlInfo',
		'UizeSite.Build.FileBuilders.IndexPages.JavaScriptModules',
		'UizeSite.Build.FileBuilders.IndexPages.JavaScriptGuides',
		'UizeSite.Build.FileBuilders.IndexPages.Appendixes',
		'UizeSite.Build.FileBuilders.IndexPages.JavaScriptReference',
		'UizeSite.Build.FileBuilders.IndexPages.JavaScriptModulesToDo',
		'UizeSite.Build.FileBuilders.IndexPages.JavaScriptWhitePapers',
		'UizeSite.Build.FileBuilders.IndexPages.InMemoryHtmlFiles',
		'UizeSite.Build.FileBuilders.InMemoryExamplesByKeywordLookup',
		'UizeSite.Build.FileBuilders.ExamplesByKeywordIndexPages',
		'UizeSite.Build.FileBuilders.JavaScriptExamplesByModule',
		'UizeSite.Build.FileBuilders.IndexPages.InMemoryNews',
		'UizeSite.Build.FileBuilders.InMemoryNewsByYearLookup',
		'UizeSite.Build.FileBuilders.NewsByYearIndexPages',
		'UizeSite.Build.FileBuilders.LatestNewsRssFeed',
		'UizeSite.Build.FileBuilders.DirectoryPage',
		'UizeSite.Build.FileBuilders.InMemoryModulesTree',
		'UizeSite.Build.FileBuilders.InMemoryExamplesInfoForSiteMap',
		'UizeSite.Build.FileBuilders.InMemoryUrlDictionary',
		'Uize.Build.FileBuilders.SimpleDocPages',
		'UizeSite.Build.FileBuilders.JavaScriptModulesToDoPages',
		'UizeSite.Build.FileBuilders.ModuleReferencePages',
		'UizeSite.Build.FileBuilders.ModuleSourceCodePages',
		'UizeSite.Build.FileBuilders.ExampleSourceCodePages',
		'Uize.Build.FileBuilders.SimpleDataPages',
		'Uize.Build.FileBuilders.InMemoryModuleMetadata',
		'Uize.Build.FileBuilders.InMemoryModuleBuiltSize',
		'Uize.Build.FileBuilders.InMemoryModuleDirectDependencies'
	],
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			instanceMethods:{
				init:function (_params,_callback) {
					this.registerFileBuilders (
						UizeSite.Build.FileBuilders.Homepage,
						UizeSite.Build.FileBuilders.TempModulesTreeModule,
						UizeSite.Build.FileBuilders.TempExamplesModule,
						UizeSite.Build.FileBuilders.TempExamplesInfoForSiteMapModule,
						UizeSite.Build.FileBuilders.TempSotuModule,
						UizeSite.Build.FileBuilders.ModuleInfoModules
					);
					_superclass.doMy (this,'init',[{},Uize.nop]);
					this.registerFileBuilders (
						UizeSite.Build.FileBuilders.WidgetsToGo.GoogleGadgetXmlPages,
						UizeSite.Build.FileBuilders.WidgetsToGo.IndexPage,
						UizeSite.Build.FileBuilders.WidgetsToGo.WidgetHomepages,
						UizeSite.Build.FileBuilders.WidgetsToGo.WidgetIframePages,
						UizeSite.Build.FileBuilders.GoogleCodeSitemap,
						Uize.Build.FileBuilders.InMemoryHtmlInfo,
						UizeSite.Build.FileBuilders.IndexPages.JavaScriptModules,
						UizeSite.Build.FileBuilders.IndexPages.JavaScriptGuides,
						UizeSite.Build.FileBuilders.IndexPages.Appendixes,
						UizeSite.Build.FileBuilders.IndexPages.JavaScriptReference,
						UizeSite.Build.FileBuilders.IndexPages.JavaScriptModulesToDo,
						UizeSite.Build.FileBuilders.IndexPages.InMemoryHtmlFiles,
						UizeSite.Build.FileBuilders.InMemoryExamplesByKeywordLookup,
						UizeSite.Build.FileBuilders.ExamplesByKeywordIndexPages,
						UizeSite.Build.FileBuilders.JavaScriptExamplesByModule,
						UizeSite.Build.FileBuilders.IndexPages.InMemoryNews,
						UizeSite.Build.FileBuilders.InMemoryNewsByYearLookup,
						UizeSite.Build.FileBuilders.NewsByYearIndexPages,
						UizeSite.Build.FileBuilders.LatestNewsRssFeed,
						UizeSite.Build.FileBuilders.DirectoryPage,
						UizeSite.Build.FileBuilders.InMemoryModulesTree,
						UizeSite.Build.FileBuilders.InMemoryExamplesInfoForSiteMap,
						UizeSite.Build.FileBuilders.InMemoryUrlDictionary,
						Uize.Build.FileBuilders.SimpleDocPages,
						UizeSite.Build.FileBuilders.JavaScriptModulesToDoPages,
						UizeSite.Build.FileBuilders.IndexPages.JavaScriptWhitePapers,
						UizeSite.Build.FileBuilders.ModuleReferencePages,
						UizeSite.Build.FileBuilders.ModuleSourceCodePages,
						UizeSite.Build.FileBuilders.ExampleSourceCodePages,
						Uize.Build.FileBuilders.SimpleDataPages,
						Uize.Build.FileBuilders.InMemoryModuleMetadata,
						Uize.Build.FileBuilders.InMemoryModuleBuiltSize,
						Uize.Build.FileBuilders.InMemoryModuleDirectDependencies
					);
					_callback ();
				}
			}
		});
	}
});

