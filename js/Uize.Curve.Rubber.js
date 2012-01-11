/*
	UIZE JAVASCRIPT FRAMEWORK 2012-01-10

	http://www.uize.com/reference/Uize.Curve.Rubber.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Curve.Rubber',builder:function(_a){var _b=function(){},_c=_a.makeEasingCurveGenerators,_d=_a.resolve;_c('elastic',function(_e,_f){if(!_e)_e=.3;if(!_f||_f<1)_f=1;var _g=2*Math.PI/_e,_h=Math.asin(1/_f)/_g;return function(_i){return(_i&&_i!=1?(-_f*Math.pow(2,10*(_i-=1))*Math.sin((_i-_h)*_g)):_i)}},_b);_c('back',function(_j){if(_j==null)_j=1.70158;var _k=_j+1;return function(_i){return _i*_i*(_k*_i-_j)};},_b);var _l=_a.easeInSweetPow(1.76);_c('bounce',function(_m,_n,_o,_p){if(!_m)_m=4;_n=_d(_n,_l,true);_o= !_o?2:_o*_o==1?1.0001:_o<0? -1/_o:_o;_p=_d(_p,2);function _q(_m){return(Math.pow(_r,_m)-1)/(_r-1)}var _r=_o,_s=_r-1,_t=_m-1,_u=_q(_m)-Math.pow(_r,_t)/2,_v=Math.log(_r),_w=[];for(var _x= -1;++_x<_m;){var _y=_q(_x),_z=(_q(_x+1)-_y)/2,_A=_y+_z;_w.push({_B:_n(_A/_u),_C:_A,_z:_z});}return function(_i){var _D=_i*_u,_E=_w[Uize.constrain(Math.floor(Math.log(_D*_s+1)/_v),0,_t)];return _E._B*(_p(1-Math.abs(_D-_E._C)/_E._z));}},_b);return _b;}});