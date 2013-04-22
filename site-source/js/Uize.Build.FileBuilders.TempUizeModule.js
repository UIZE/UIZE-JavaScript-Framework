/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Build.FileBuilders.TempUizeModule Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013 UIZE
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
		The =Uize.Build.FileBuilders.TempUizeModule= module defines a file builder for the =Uize= module that stitches in registration of the folder organization namespaces (as specified by the =folderOrgNamespaces= property of the UIZE config for the site).

		*DEVELOPERS:* `Chris van Rensburg`

		Functions defined in the file builder are called as instance methods on an instance of a subclass of the =Uize.Services.FileBuilderAdapter= class, so the functions can access instance methods implemented in this class.
*/

Uize.module ({
	name:'Uize.Build.FileBuilders.TempUizeModule',
	required:[
		'Uize.Build.Util',
		'Uize.Json'
	],
	builder:function () {
		return {
			description:'The Uize JavaScript base module under temp',
			urlMatcher:function (_urlParts) {
				return _urlParts.pathname == this.tempUrl (this.params.modulesFolder + '/Uize.js');
			},
			builderInputs:function (_urlParts) {
				return {
					sourceJs:this.sourceUrlFromTempUrl (_urlParts.pathname),
					config:'uize-config.json'
				};
			},
			builder:function (_inputs) {
				return (
					this.readFile ({path:_inputs.sourceJs}) +
					'\n' +
					'Uize.addFolderOrgNamespaces (' +
						Uize.Json.to (Uize.Json.from (this.readFile ({path:_inputs.config})).folderOrgNamespaces || []) +
					');\n'
				);
			}
		};
	}
});

