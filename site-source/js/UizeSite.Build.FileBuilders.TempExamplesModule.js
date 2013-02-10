/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Build.FileBuilders.TempExamplesModule Package
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
		The =UizeSite.Build.FileBuilders.TempExamplesModule= module defines a file builder for the generated UizeSite.Examples module in the site temp folder.

		*DEVELOPERS:* `Chris van Rensburg`

		Functions defined in the file builder are called as instance methods on an instance of a subclass of the =Uize.Services.FileBuilderAdapter= class, so the functions can access instance methods implemented in this class.
*/

Uize.module ({
	name:'UizeSite.Build.FileBuilders.TempExamplesModule',
	required:'Uize.Build.Util',
	builder:function () {
		var _examplesDataModuleName = 'UizeSite.Examples';

		return {
			description:'Generated UizeSite.Examples module under temp',
			urlMatcher:function (_urlParts) {
				return _urlParts.pathname == this.tempUrl ('js/' + _examplesDataModuleName + '.js');
			},
			builderInputs:function () {
				return {filesIndex:this.memoryUrl ('examples.index')};
			},
			builder:function (_inputs) {
				return Uize.Build.Util.dataAsModule (
					_examplesDataModuleName,
					this.readFile ({path:_inputs.filesIndex})
				);
			}
		};
	}
});

