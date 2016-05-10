/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Template.Module Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2008-2016 UIZE
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
		The =Uize.Template.Module= module provides methods for building JavaScript modules from JavaScript templates.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Template.Module',
	required:[
		'Uize.Template',
		'Uize.Str.Lines',
		'Uize.Json',
		'Uize.Build.Util'
	],
	builder:function () {
		'use strict';

		return Uize.package ({
			defineTemplateModule:function (_moduleName,_templateText) {
				var _compiledTemplate = Uize.Template.compile (_templateText,{result:'full'});
				Uize.module ({
					name:_moduleName,
					required:_compiledTemplate.required,
					builder:function () {
						return Uize.package ({
							process:Function ('input',_compiledTemplate.code),
							input:_compiledTemplate.input
						});
					}
				});
			},

			buildTemplateModuleText:function (_moduleName,_templateText) {
				var _compiledTemplate = Uize.Template.compile (_templateText,{result:'full'});
				return Uize.Build.Util.moduleAsText ({
					name:_moduleName,
					required:_compiledTemplate.required,
					builder:[
						'function () {',
						'	\'use strict\';',
						'',
						'	return Uize.package ({',
						'		process:function (input) {',
						'			' +
							Uize.Str.Lines.indent (Uize.Str.Lines.trimRight (_compiledTemplate.code),4,'\t',false),
						'		},',
						'',
						'		input:' +
							Uize.Str.Lines.indent (Uize.Json.to (_compiledTemplate.input),3,'\t',false),
						'	});',
						'}'
					].join ('\n')
				});
			}
		});
	}
});

