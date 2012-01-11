/*
	UIZE JAVASCRIPT FRAMEWORK 2012-01-10

	http://www.uize.com/reference/Uize.Templates.JstModule.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Templates.JstModule',required:['Uize.String.Lines','Uize.Json'],builder:function(){var _a=function(){};_a.process=function(input){var output=[];output.push('/*\r\n	This is an automatically generated module, compiled from the JavaScript template file:\r\n		',input.moduleName,'.js.jst\r\n*/\r\n\r\n/*ScruncherSettings Mappings="=" LineCompacting="TRUE"*/\r\n\r\nUize.module ({\r\n	name:',Uize.Json.to(input.moduleName),',');var required=input.compiledTemplate.required;if(required.length){output.push('\r\n	required:',Uize.String.Lines.indent(Uize.Json.to(required),1,'\t',false),',');}
output.push('\r\n	builder:function () {\r\n		var _package = function () {};\r\n\r\n		/*** Public Static Methods ***/\r\n			_package.process = function (input) {\r\n				',Uize.String.Lines.indent(Uize.String.Lines.trimRight(input.compiledTemplate.code),4,'\t',false),'\r\n			};\r\n\r\n		/*** Public Static Properties ***/\r\n			_package.input = ',Uize.String.Lines.indent(Uize.Json.to(input.compiledTemplate.input),3,'\t',false),';\r\n\r\n		return _package;\r\n	}\r\n});\r\n\r\n');return output.join('');};_a.input={compiledTemplate:'object'};return _a;}});