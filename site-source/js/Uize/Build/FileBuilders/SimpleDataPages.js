/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Build.FileBuilders.SimpleDataPages Package
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
		The =Uize.Build.FileBuilders.SimpleDataPages= module defines a file builder for HTML pages derived from SimpleData (=.simpledata=) files.

		*DEVELOPERS:* `Chris van Rensburg`

		Functions defined in the file builder are called as instance methods on an instance of a subclass of the =Uize.Services.FileBuilderAdapter= class, so the functions can access instance methods implemented in this class.
*/

Uize.module ({
	name:'Uize.Build.FileBuilders.SimpleDataPages',
	required:'Uize.Data.Simple',
	builder:function () {
		'use strict';

		return Uize.package ({
			description:'SimpleData pages',
			urlMatcher:function (_urlParts) {
				var _pathname = _urlParts.pathname;
				return (
					this.isBuiltUrl (_pathname) &&
					this.fileExists ({path:this.sourceUrlFromBuiltUrl (_pathname) + '.jst'}) &&
					this.fileExists ({path:this.sourceUrlFromBuiltUrl (_pathname) + '.simpledata'})
				);
			},
			builderInputs:function (_urlParts) {
				var _pathname = _urlParts.pathname;
				return {
					jstTemplate:this.memoryUrlFromBuiltUrl (_pathname) + '.jst',
					simpleData:this.sourceUrlFromBuiltUrl (_pathname) + '.simpledata'
				};
			},
			builder:function (_inputs) {
				return this.readFile ({path:_inputs.jstTemplate}) (
					Uize.Data.Simple.parse ({
						simple:this.readFile ({path:_inputs.simpleData}),
						collapseChildren:true
					})
				);
			}
		});
	}
});

