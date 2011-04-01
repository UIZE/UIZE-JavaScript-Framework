/*
	UIZE JAVASCRIPT FRAMEWORK 2011-04-01

	http://www.uize.com/reference/Uize.Array.Order.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Array.Order',builder:function(){var _a=function(){};function _b(_c){return _c}function _d(){return Math.random()-.5}var _e=_a.reorder=function(_f,_g,_h){if(typeof _h!='object')_h=_h===false?_f:[];if(_h==_f&&(_g=='normal'||_g=='reverse'||_g=='jumbled')){_g=='reverse'?_f.reverse():_g=='jumbled'?_f.sort(_d):0;}else{if(_h==_f)_f=_f.concat();var _i=_f.length,_j=_i-1,_k;if(_g=='reverse'){_k=function(_l){return _j-_l};}else if(_g=='inside out'){var _m=_i%2,_n=Math.ceil(_j/2);_k=function(_l){return(_l%2==_m?_n-1-(_l>>1):_n+(_l>>1));};}else if(_g=='outside in'){_k=function(_l){return _l%2?_j-(_l>>1):_l>>1;};}else if(_g=='normal'){_k=_b;}else{var _o=[];for(var _p=_i;--_p> -1;)_o[_p]=_p;_o.sort(_d);_k=function(_l){return _o[_l]};}for(var _p= -1;++_p<=_j;)_h[_p]=_f[_k(_p)];}return _h;};_a.insideOut=function(_q,_h){return _e(_q,'inside out',_h)};_a.jumble=function(_q,_h){return _e(_q,'jumbled',_h)};_a.outsideIn=function(_q,_h){return _e(_q,'outside in',_h)};_a.reverse=function(_q,_h){
return _e(_q,'reverse',_h)};return _a;}});