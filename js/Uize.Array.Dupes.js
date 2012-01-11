/*
	UIZE JAVASCRIPT FRAMEWORK 2012-01-10

	http://www.uize.com/reference/Uize.Array.Dupes.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Array.Dupes',required:'Uize.Json',builder:function(){var _a=function(){},_b=true,_c=false,_d;var _e={};_a.dedupe=function(_f,_g,_h){var _i=Uize.lookup(_d,1,_b),_j,_k=0;for(var _l= -1,_m=_f.length,_n,_o,_p,_q;++_l<_m;){_q=_c;_n=_f[_l];if(Uize.isPrimitive(_o=_g?_g(_n):_n)|| !(Uize.isObject(_o)||Uize.isFunction(_o))){if((_i[_o]||(_i[_o]={}))[_p=typeof _o]){_q=true;}else{_i[_o][_p]=_b;}}else{if(_o.tagged==_e){_q=true;}else{(_j||(_j=[])).push({_r:_o,_s:_o.hasOwnProperty('tagged'),_t:_o.tagged});_o.tagged=_e;}}if(_q){_k++;}else if(_k){_f[_l-_k]=_n;}}_f.length-=_k;if(_j){for(var _u=_j.length,_v,_r;--_u>=0;){_r=(_v=_j[_u])._r;_v._s?(_r.tagged=_v._t):delete _r.tagged;}}return _f;};_a.removeValues=function(_f,_w,_g,_h){};_a.retainValues=function(_f,_w,_g,_h){};return _a;}});