/*
	UIZE JAVASCRIPT FRAMEWORK

	http://www.uize.com/reference/Uize.Build.ModuleInfo.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Build.ModuleInfo',required:'Uize.Wsh',builder:function(){var _a=function(){},_b=true,_c=false,_d,_e={},_f=Uize.forEach;function _g(_h){return Uize.Wsh.readFile(env.moduleFolderPath+'\\'+_h+'.js');}_a.getDefinitionFromCode=function(_i){var _j,Uize={module:function(_k){_j=_k}};eval(_i);return _j;};_a.getDefinition=function(_h){return _a.getDefinitionFromCode(_g(_h));};var _l=_a.getDirectDependencies=function(_h){var _k=_a.getDefinition(_h);return _k?Uize.resolveModuleDefinition(_k).required:[];};_a.traceDependencies=function(_m,_n){var _o={},_p=[];_f(_n,function(_q){_o[_q]=_e});function _r(_m){_f(_m.sort(),function(_h){if(_o[_h]!=_e){_o[_h]=_e;_r(_l(_h));_p.push(_h);}});}_r(['Uize'].concat(typeof _m=='string'?[_m]:_m));return _p;};return _a;}});