/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Build.FileBuilders.InMemoryModuleBuiltSize Package
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
		The =Uize.Build.FileBuilders.InMemoryModuleBuiltSize= module defines a file builder for the in-memory built size for each JavaScript module.

		*DEVELOPERS:* `Chris van Rensburg`

		Functions defined in the file builder are called as instance methods on an instance of a subclass of the =Uize.Services.FileBuilderAdapter= class, so the functions can access instance methods implemented in this class.
*/

Uize.module ({
	name:'Uize.Build.FileBuilders.InMemoryModuleBuiltSize',
	builder:function () {
		var _moduleBuiltSizeExtensionRegExp = /\.js\.builtsize$/;

		return {
			description:'In-memory built size for module',
			urlMatcher:function (_urlParts) {
				var _pathname = _urlParts.pathname;
				return this.isMemoryUrl (_pathname) && _moduleBuiltSizeExtensionRegExp.test (_pathname);
			},
			builderInputs:function (_urlParts) {
				return {
					builtModule:
						this.builtUrlFromMemoryUrl (_urlParts.pathname).replace (_moduleBuiltSizeExtensionRegExp,'.js')
				};
			},
			builder:function (_inputs) {
				return this.readFile ({path:_inputs.builtModule}).length;
			}
		};
	}
});

