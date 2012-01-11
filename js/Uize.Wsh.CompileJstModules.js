/*
	UIZE JAVASCRIPT FRAMEWORK 2012-01-10

	http://www.uize.com/reference/Uize.Wsh.CompileJstModules.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Wsh.CompileJstModules',required:['Uize.Template','Uize.Wsh.BuildUtils'],builder:function(){var _a=function(){};_a.perform=function(_b){var _c='\\'+_b.moduleFolderPath,_d=_c.length,_e,_f=/\.js\.jst$/i;Uize.Wsh.buildFiles(Uize.copyInto({targetFolderPathCreator:function(_g){var _h=_g.slice(-_d)==_c?_g:null;if(_h)_e=Uize.Wsh.BuildUtils.compileJstFile(_g+'\\Uize.Templates.JstModule.js.jst');return _h;},targetFilenameCreator:function(_i){return _f.test(_i)?_i.replace(_f,'.js'):null;},fileBuilder:function(_i,_j){return{outputText:_e({moduleName:_i.replace(_f,''),compiledTemplate:Uize.Template.compile(_j,{result:'full'})})};}},_b));};return _a;}});