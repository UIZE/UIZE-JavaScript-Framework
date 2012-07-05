/*
	UIZE JAVASCRIPT FRAMEWORK 2012-07-04

	http://www.uize.com/reference/Uize.Data.Combinations.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Data.Combinations',builder:function(){var _a=function(){},_b,_c=Uize.isList;_a.generate=function(_d,_e,_f){var _g=[];_a.forEach(_d,function(_h){_g.push(_h)},_e,_f);return _g;};_a.forEach=function(_d,_i,_e,_f){if(Uize.isObject(_d)){if(_e!=_b)_e=Uize.resolveTransformer(_e);if(_f!=_b)_f=Uize.resolveMatcher(_f);var _j=[],_k,_l= -1,_m,_n=[],_o=[],_p=[],_q=Uize.isArray(_d);Uize.forEach(_d,function(_m,_k){_m=_d[_k];if(!_c(_m))_m=[_m];if(_m.length){_j.push(_k);_l++;_o[_l]=(_n[_l]=_m).length;_p[_l]=0;}});var _r= -1,_s=_l+1,_t;while(_l>=0){_r++;var _h=_q?[]:{};for(_l= -1;++_l<_s;)_h[_j[_l]]=_n[_l][_p[_l]];if(_e&&(_t=_e(_h,_r))!==_b)_h=_t;(!_f||_f(_h,_r))&&_i(_h);_l=_s;while(--_l>=0&& !(_p[_l]=(_p[_l]+1)%_o[_l]));}}};return _a;}});