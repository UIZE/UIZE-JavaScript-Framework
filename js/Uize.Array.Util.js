/*
	UIZE JAVASCRIPT FRAMEWORK 2012-01-10

	http://www.uize.com/reference/Uize.Array.Util.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Array.Util',builder:function(){var _a=function(){},_b=undefined,_c=Array.prototype,_d=_c.push,_e=_c.concat,_f=_c.splice,_g=Infinity,_h=[0,_g];_a.replaceContents=function(_i,_j){if(_i!=_j){_i.length=0;_j&&_j.length&&_d.apply(_i,_j);}return _i;};_a.swapContents=function(_i,_j){if(_i!=_j){_d.apply(_i,_f.apply(_j,_h.concat(_i.splice(0,_g))));}return _i;};_a.flatten=function(_k,_l,_m){_l=_l==_b?_g: +_l||0;var _n=_k,_o,_p=0;while(_p++ <_l&&_n.length!=_o){_o=_n.length;_n=_e.apply([],_n);}return(_m!==true?_a.replaceContents(_m||_k,_n):_n!=_k?_n:_k.concat());};return _a;}});