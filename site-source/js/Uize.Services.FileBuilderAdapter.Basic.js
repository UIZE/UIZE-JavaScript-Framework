/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Services.FileBuilderAdapter.Basic Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013 UIZE
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
		The =Uize.Services.FileBuilderAdapter.Basic= module defines a basic adapter for the file builder service (=Uize.Services.FileBuilder=).

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Services.FileBuilderAdapter.Basic',
	required:[
		'Uize.Build.FileBuilders.SourceFiles',
		'Uize.Build.FileBuilders.UnprocessedFiles',
		'Uize.Build.FileBuilders.InMemoryCompiledJstTemplates',
		'Uize.Build.FileBuilders.InMemoryParsedSimpleDataFiles',
		'Uize.Build.FileBuilders.BuiltLibraryModules',
		'Uize.Build.FileBuilders.BuiltModules',
		'Uize.Build.FileBuilders.TempJsModules',
		'Uize.Build.FileBuilders.CompiledJstModules'
	],
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			instanceMethods:{
				init:function (_params,_callback) {
					this.registerFileBuilders (
						Uize.Build.FileBuilders.SourceFiles,
						Uize.Build.FileBuilders.UnprocessedFiles,
						Uize.Build.FileBuilders.InMemoryCompiledJstTemplates,
						Uize.Build.FileBuilders.InMemoryParsedSimpleDataFiles,
						Uize.Build.FileBuilders.BuiltLibraryModules,
						Uize.Build.FileBuilders.BuiltModules,
						Uize.Build.FileBuilders.TempJsModules,
						Uize.Build.FileBuilders.CompiledJstModules
					);

					_callback ();
				}
			}
		});
	}
});

