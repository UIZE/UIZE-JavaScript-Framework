/*
	UIZE JAVASCRIPT FRAMEWORK 2012-01-10

	http://www.uize.com/reference/Uize.Wsh.BuildSimpleDataPages.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Wsh.BuildSimpleDataPages',required:['Uize.Wsh.BuildUtils','Uize.Template','Uize.Data.Simple','Uize.Url'],builder:function(){var _a=function(){},_b=Uize.Data.Simple.parse;_a.perform=function(_c){var _d,_e,_f=/\.simpledata$/i;Uize.Wsh.buildFiles(Uize.copyInto({targetFolderPathCreator:function(_g){return _d=_g},targetFilenameCreator:function(_h){_e=null;if(_f.test(_h)){_e=_h.replace(_f,'');if(_e.indexOf('.')== -1)_e=null;}return _e;},fileBuilder:function(_h,_i){var _j=_b({simple:_i,collapseChildren:true});return{outputText:Uize.Wsh.BuildUtils.compileJstFile(_j.templatePath?Uize.Url.toAbsolute(_d+'\\',_j.templatePath):_d+'\\'+_e+'.jst')(_j)};}},_c));};return _a;}});