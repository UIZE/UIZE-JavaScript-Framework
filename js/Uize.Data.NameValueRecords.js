/*
	UIZE JAVASCRIPT FRAMEWORK 2012-01-10

	http://www.uize.com/reference/Uize.Data.NameValueRecords.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Data.NameValueRecords',builder:function(){var _a,_b=Uize.defaultNully,_c=function(){};_c.fromHash=function(_d,_e,_f){var _g=[];if(Uize.isObject(_d)){var _h=typeof _e=='number'&&typeof _f=='number',_i;_e=_b(_e,'name');_f=_b(_f,'value');for(var _j in _d){_g.push(_i=_h?[]:{});_i[_e]=_j;_i[_f]=_d[_j];}}return _g;};_c.toHash=function(_k,_e,_f){var _g={},_l=Uize.isArray(_k)&&_k.length;if(_l){var _h=Uize.isArray(_k[0]);_e=_b(_e,_h?0:'name');_f=_b(_f,_h?1:'value');for(var _m= -1,_i,_j;++_m<_l;){_j=(_i=_k[_m])[_e];if(_j!=_a)_g[_j]=_i[_f];}}return _g;};return _c;}});