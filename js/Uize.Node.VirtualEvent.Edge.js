/*
	UIZE JAVASCRIPT FRAMEWORK 2012-01-10

	http://www.uize.com/reference/Uize.Node.VirtualEvent.Edge.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Node.VirtualEvent.Edge',builder:function(){var _a=function(){},_b=true,_c=false;var _d=['left','right','top','bottom'];function _e(_f,_g){var _h=_d[_g],_i='mouse'+(_f?'Exit':'Enter')+Uize.capFirstChar(_h),_j=_f?'mouseout':'mouseover';Uize.Node.VirtualEvent.register(_i,function(){return Uize.Node.VirtualEvent.getCached(_i+'()',function(_k,_l,_m){Uize.Node.wire(_k,_j,function(_n){var _o=Uize.Node.getEventAbsPos(_n),_p=Uize.Node.getCoords(this);var _q=(_o.left-_p.left+parseFloat(Uize.Node.getStyle(this,'borderLeftWidth')))/_p.width,_r=(_o.top-_p.top+parseFloat(Uize.Node.getStyle(this,'borderTopWidth')))/_p.height,_s=_q>=.5?1:0,_t=_r>=.5?1:0,_u=(_s?1-_q:_q)>(_t?1-_r:_r)?_t+2:_s;_u==_g&&_l.call(_k,_n);},_m);});});}_e(0,0);_e(0,1);_e(0,2);_e(0,3);_e(1,0);_e(1,1);_e(1,2);_e(1,3);return _a;}});