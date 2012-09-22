/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Build.BuildPagesFromSourceCode Namespace
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2008-2012 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/
Uize.module({name:'UizeSite.Build.BuildPagesFromSourceCode',required:['Uize.Wsh','Uize.Build.Util','Uize.Template'],builder:function(){var _a=function(){};_a.perform=function(_b){var _c='\\source-code',_d='~SOURCE-CODE-TEMPLATE.html',_e,_f,_g=/\.js$/i;function _h(_i){return Uize.capFirstChar(_i.match(/(.*)\.[^\.]*$/)[1].replace(/-/g,' '));}Uize.Wsh.buildFiles({alwaysBuild:env.alwaysBuild,targetFolderPathCreator:function(_j){var _k=null;if(/js\\~source$/.test(_j)){_e='module';_k='reference'+_c;
}else if(/examples$/.test(_j)){_e='exampleOrTool';_k=_j+_c;}if(_k&& !(_f=Uize.Build.Util.compileJstFile(_k+'\\'+_d)))_k=null;return _k;},targetFilenameCreator:function(_l){return(_e=='module'?(_g.test(_l)?_l.replace(_g,'.html'):null):(/\.html$/i.test(_l)&&_l.charAt(0)!='~'?_l:null));},fileBuilder:function(_l,_m){return{outputText:_f({sourceFilename:_l,title:_e=='module'?_h(_l):_m.match(/<title>(.+?)\s*\|\s*JavaScript\s+(?:Tools|Examples)\s*(\|.*?)?<\/title>/)[1],body:_m})};}});};return _a;}});