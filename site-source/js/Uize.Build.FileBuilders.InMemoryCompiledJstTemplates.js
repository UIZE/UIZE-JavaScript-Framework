/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Build.FileBuilders.InMemoryCompiledJstTemplates Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2012-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 5
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Build.FileBuilders.InMemoryCompiledJstTemplates= module defines a file builder for building in-memory compiled JST templates from =.jst= source files.

		*DEVELOPERS:* `Chris van Rensburg`

		Functions defined in the file builder are called as instance methods on an instance of a subclass of the =Uize.Services.FileBuilderAdapter= class, so the functions can access instance methods implemented in this class.
*/

Uize.module ({
	name:'Uize.Build.FileBuilders.InMemoryCompiledJstTemplates',
	required:'Uize.Template',
	builder:function () {
		return {
			description:'In-memory compiled JST templates',
			urlMatcher:function (_urlParts) {
				return this.isMemoryUrl (_urlParts.pathname) && _urlParts.fileType == 'jst';
			},
			builderInputs:function (_urlParts) {
				return {source:this.sourceUrlFromMemoryUrl (_urlParts.pathname)};
			},
			builder:function (_inputs) {
				var _template = Uize.Template.compile (this.readFile ({path:_inputs.source}),{result:'full'});
				Uize.require (_template.required);
				return _template.templateFunction;
			}
		};
	}
});

