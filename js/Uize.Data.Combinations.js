/*
	UIZE JAVASCRIPT FRAMEWORK 2012-03-12

	http://www.uize.com/reference/Uize.Data.Combinations.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Data.Combinations',builder:function(){var _a=function(){},_b,_c=Uize.isList;function _d(_e){return(typeof _e=='string'?new Function('value','key','return '+_e):_e);}_a.generate=function(_f,_g,_h){var _i=[];_a.forEach(_f,function(_j){_i.push(_j)},_g,_h);return _i;};_a.forEach=function(_f,_k,_g,_h){if(Uize.isObject(_f)){_g=_d(_g);_h=_d(_h);var _l=[],_m,_n= -1,_o,_p=[],_q=[],_r=[],_s=Uize.isArray(_f);Uize.forEach(_f,function(_o,_m){_o=_f[_m];if(!_c(_o))_o=[_o];if(_o.length){_l.push(_m);_n++;_q[_n]=(_p[_n]=_o).length;_r[_n]=0;}});var _t= -1,_u=_n+1,_v,_w=true;while(_n>=0){_t++;var _j=_s?[]:{};for(_n= -1;++_n<_u;)_j[_l[_n]]=_p[_n][_r[_n]];if(_g&&(_v=_g(_j,_t))!==_b)_j=_v;if(_h)_w=_h(_j,_t);_w&&_k(_j);_n=_u;while(--_n>=0&& !(_r[_n]=(_r[_n]+1)%_q[_n]));}}};return _a;}});