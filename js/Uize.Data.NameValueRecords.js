/*
	UIZE JAVASCRIPT FRAMEWORK 2011-04-01

	http://www.uize.com/reference/Uize.Data.NameValueRecords.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Data.NameValueRecords',builder:function(){var _a,_b=function(){};_b.fromHash=function(_c,_d,_e){var _f=[];if(_d==_a)_d='name';if(_e==_a)_e='value';var _g=typeof _d=='number'&&typeof _e=='number';for(var _h in _c){var _i=_g?[]:{};_i[_d]=_h;_i[_e]=_c[_h];_f.push(_i);}return _f;};_b.toHash=function(_j,_d,_e){var _f={},_k=_j.length;if(_k){var _g=Uize.isArray(_j[0]);if(_d==_a)_d=_g?0:'name';if(_e==_a)_e=_g?1:'value';for(var _l= -1,_i;++_l<_k;)_f[_i[_d]]=(_i=_j[_l])[_e];}return _f;};return _b;}});