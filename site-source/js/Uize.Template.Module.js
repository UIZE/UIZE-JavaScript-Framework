/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Template.Module Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2008-2013 UIZE
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
		'Uize.String.Lines',
		'Uize.Json'
	],
	builder:function () {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var _package = function () {};

		/*** Public Static Methods ***/
			_package.defineTemplateModule = function (_moduleName,_templateText) {
				var _compiledTemplate = Uize.Template.compile (_templateText,{result:'full'});
				Uize.module ({
					name:_moduleName,
					required:_compiledTemplate.required,
					builder:function () {
						var _package = function () {};
						_package.process = Function ('input',_compiledTemplate.code);
						_package.input = _compiledTemplate.input;
						return _package;
					}
				});
			};

			_package.buildTemplateModuleText = function (_moduleName,_templateText) {
				var
					_compiledTemplate = Uize.Template.compile (_templateText,{result:'full'}),
					_required = _compiledTemplate.required
				;
				return [
					'Uize.module ({',
					'	name:' + Uize.Json.to (_moduleName) + ',',
					'	required:' + Uize.String.Lines.indent (Uize.Json.to (_required),1,'\t',false) + ',',
					'	builder:function () {',
					'		\'use strict\';',
					'',
					'		var _package = function () {};',
					'',
					'		/*** Public Static Methods ***/',
					'			_package.process = function (input) {',
					'				' + Uize.String.Lines.indent (Uize.String.Lines.trimRight (_compiledTemplate.code),4,'\t',false),
					'			};',
					'',
					'		/*** Public Static Properties ***/',
					'			_package.input = ' + Uize.String.Lines.indent (Uize.Json.to (_compiledTemplate.input),3,'\t',false) + ';',
					'',
					'		return _package;',
					'	}',
					'});'
				].join ('\n');
			};

		return _package;
	}
});

