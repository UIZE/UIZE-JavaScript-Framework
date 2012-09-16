/*
	UIZE JAVASCRIPT FRAMEWORK

	http://www.uize.com/reference/Uize.Build.ServicesSetup.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Build.ServicesSetup',required:['Uize.Util.Needs','Uize.Data.Matches'],builder:function(){var _a=Uize.require,_b=Uize.Util.Needs(),_c={},_d={};Uize.require=function(_e,_f){if(typeof _e=='string')_e=[_e];_a(_e,function(){var _g=arguments;_b.need(Uize.Data.Matches.values(_e,function(_h){return _c[_h]==_d}),function(){_f&&_f.apply(0,_g)});});};function _i(_j,_k,_l){_c[_j]=_d;_b.provide(_j,function(_m){_a([_j,_k],function(_n,_o){(_p=_n.singleton()).set('adapter',_o.singleton());_l(_p,function(){_m(_p)});});});}var _q=typeof ActiveXObject!='undefined';_i('Uize.Services.FileSystem',_q?'Uize.Services.FileSystemWsh':'Uize.Services.FileSystemNode',function(_p,_r){_p.init();_r();});}});