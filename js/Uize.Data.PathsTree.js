/*
	UIZE JAVASCRIPT FRAMEWORK 2012-01-10

	http://www.uize.com/reference/Uize.Data.PathsTree.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Data.PathsTree',builder:function(){var _a,_b=function(){},_c={};_b.toList=function(_d,_e){if(_e==_a)_e='.';var _f=[];function _g(_h,_i){_i&&_f.push(_i);for(var _j in _h)_g(_h[_j],_i+(_i&&_e)+_j);}_g(_d,'');return _f;};_b.fromList=function(_f,_e){if(_e==_a)_e='.';var _d={};for(var _k= -1,_l=_f.length;++_k<_l;){var _m=_f[_k],_h=_d;for(var _n= -1,_o=_m.split(_e),_p=_o.length,_q;++_n<_p;)_h=_h[_q=_o[_n]]||(_h[_q]=_p-1-_n&&{});}return _d;};return _b;}});