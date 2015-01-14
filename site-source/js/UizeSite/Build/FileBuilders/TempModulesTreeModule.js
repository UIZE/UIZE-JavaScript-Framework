/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Build.FileBuilders.TempModulesTreeModule Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2012-2015 UIZE
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
		The =UizeSite.Build.FileBuilders.TempModulesTreeModule= module defines a file builder for the generated =UizeSite.ModulesTree= module in the site temp folder.

		*DEVELOPERS:* `Chris van Rensburg`

		Functions defined in the file builder are called as instance methods on an instance of a subclass of the =Uize.Services.FileBuilderAdapter= class, so the functions can access instance methods implemented in this class.
*/

Uize.module ({
	name:'UizeSite.Build.FileBuilders.TempModulesTreeModule',
	required:'Uize.Build.Util',
	builder:function () {
		var _modulesTreeDataModuleName = 'UizeSite.ModulesTree';

		return Uize.package ({
			description:'Generated UizeSite.ModulesTree module under temp',
			urlMatcher:function (_urlParts) {
				return _urlParts.pathname == this.tempUrl (this.getModuleUrl (_modulesTreeDataModuleName));
			},
			builderInputs:function () {
				return {modulesTree:this.memoryUrl ('modules-tree')};
			},
			builder:function (_inputs) {
				return Uize.Build.Util.dataAsModule (
					_modulesTreeDataModuleName,
					this.readFile ({path:_inputs.modulesTree})
				);
			}
		});
	}
});

