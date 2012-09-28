/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Build.BuildSotu Namespace
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2008-2012 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/
Uize.module({name:'UizeSite.Build.BuildSotu',required:['Uize.Wsh','Uize.Build.Util','Uize.Build.AutoScruncher','Uize.String','Uize.String.Lines','Uize.Data.Simple','UizeSite.Build.Util'],builder:function(){var _a=function(){};function _b(_c){return _c.match(/^\s*(.*?)\s*\|/)[1]}var _d={},_e=[];_a.perform=function(_f){var _g=Uize.Build.Util.getHtmlFilesInfo('reference',_b),_h=UizeSite.Build.Util.getExamplesByKeyword(),_i=[];for(var _j= -1,_k=_g.length;++_j<_k;){var _l=_g[_j],_m=_l.title,_n={name:_m,
description:_l.description,examples:(_h[_m]||_e).length};if((_m=='Uize'||Uize.String.startsWith(_m,'Uize.'))&& !Uize.String.startsWith(_m,'Uize.Test.')){var _o=0,_p=0,_q=_m+'.',_r=_q.length;for(var _s=_j;++_s<_k;){var _t=_g[_s].title;if(Uize.String.startsWith(_t,_q)){_p++;_t.indexOf('.',_r)== -1&&_o++;}}_n.directSubmodules=_o;_n.nestedSubmodules=_p;var _u=Uize.Wsh.readFile(_f.moduleFolderPath+'\\'+_m+'.js'),_v=/\/\*\s*Module\s*Meta\s*Data/i,_w=_u.search(_v),_x=_u.indexOf('*/',_w),_y=_w> -1?_u.slice(_w,_x).replace(_v,''):'',_z=_y?Uize.Data.Simple.parse({simple:Uize.String.Lines.normalizeIndent(_y),collapseChildren:true}):_d;_n.type=_z.type||'Unknown';_n.importance= +_z.importance||0;_n.codeCompleteness= +_z.codeCompleteness||0;_n.docCompleteness= +_z.docCompleteness||0;_n.testCompleteness= +_z.testCompleteness||0;_n.keywords=_z.keywords||'';_n.sourceFileSize=_u.length;_n.scrunchedFileSize=Uize.Wsh.readFile(Uize.Build.AutoScruncher.getScrunchedFolderPath(Uize.Wsh.getScriptFolderPath()+'\\'+_f.moduleFolderPath,
_f.buildFolderPath,_f.sourceFolderName)+'\\'+_m+'.js').length;_i.push(_n);}}Uize.Build.Util.processJstFile('appendixes\\sotu.html.jst',{modules:_i});};return _a;}});