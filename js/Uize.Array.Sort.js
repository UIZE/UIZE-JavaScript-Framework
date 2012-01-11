/*
	UIZE JAVASCRIPT FRAMEWORK 2012-01-10

	http://www.uize.com/reference/Uize.Array.Sort.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Array.Sort',builder:function(){var _a=function(){};var _b=[],_c=new Function('a','b','return a.v<b.v?-1:a.v>b.v?1:0'),_d=new Function('a','b','return a.v<b.v?1:a.v>b.v?-1:0'),_e=new Function('a','b','return a<b?-1:a>b?1:0'),_f=new Function('a','b','return a<b?1:a>b?-1:0');_a.sortBy=function(_g,_h,_i){var _j=_g.length;if(_j>1){if(_h!=null){var _k;if(!Uize.isFunction(_h)){if(typeof _h=='number')_h='value ['+_h+']';if(typeof _h=='string')_h=new Function('value','key','return '+_h);};for(var _l=_b.length=_j;--_l>=0;){(_k=_b[_l]||(_b[_l]={})).v=_h(_k._m=_g[_k._l=_l],_l);}_b.sort(_i== -1?_d:_c);for(var _l=_j;--_l>=0;){if(_l!=(_k=_b[_l])._l)_g[_l]=_k._m;_k._m=_k.v=null;}}else{_g.sort(_i== -1?_f:_e);}}return _g;};return _a;}});