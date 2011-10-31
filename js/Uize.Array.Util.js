/*
	UIZE JAVASCRIPT FRAMEWORK 2011-10-30

	http://www.uize.com/reference/Uize.Array.Util.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Array.Util',builder:function(){var _a=function(){},_b=undefined,_c=Array.prototype,_d=_c.push,_e=_c.concat,_f=_c.splice,_g=[0,Infinity];_a.replaceContents=function(_h,_i){if(_h!=_i){_h.length=0;_i&&_i.length&&_d.apply(_h,_i);}return _h;};_a.swapContents=function(_h,_i){if(_h!=_i){_d.apply(_h,_f.apply(_i,_g.concat(_h.splice(0,Infinity))));}return _h;};_a.flatten=function(_j,_k,_l){_k=_k==_b?Infinity: +_k||0;var _m=_j,_n,_o=0;while(_o++ <_k&&_m.length!=_n){_n=_m.length;_m=_e.apply([],_m);}return(_l!==true?_a.replaceContents(_l||_j,_m):_m!=_j?_m:_j.concat());};return _a;}});