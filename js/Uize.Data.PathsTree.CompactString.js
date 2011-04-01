/*
	UIZE JAVASCRIPT FRAMEWORK 2011-04-01

	http://www.uize.com/reference/Uize.Data.PathsTree.CompactString.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Data.PathsTree.CompactString',builder:function(){var _a=function(){},_b={};_a.fromCompactString=function(_c,_d){_d||(_d=_b);var _e=Uize.defaultNull(_d.opener,'[')+'',_f=Uize.defaultNull(_d.closer,']')+'',_g=Uize.defaultNull(_d.separator,'|')+'',_h=_e.length,_i=_f.length,_j=_g.length,_k={},_l=[_k],_m=_k,_n=0,_o=_c.length,_p=_o+1,_q,_r,_s,_t,_u;while(_n<_o){_s=_c.slice(_n,_t=Math.min(_q=((_c.indexOf(_e,_n)+1)||_p)-1,_r=((_c.indexOf(_f,_n)+1)||_p)-1,((_c.indexOf(_g,_n)+1)||_p)-1));_n=_t;if(_n<_o){if(_t==_q){_l.push(_m=_m[_s]={});_u=false;_n+=_h;}else{if(!_u)_m[_s]=0;if(_u=_t==_r){_m=_l[--_l.length-1];_n+=_i;}else{_n+=_j;}}if(_n==_o&& !_u)_m['']=0;}else{_m[_s]=0;}}return _l[0];};_a.toCompactString=function(_k,_d){_d||(_d=_b);var _e=Uize.defaultNull(_d.opener,'[')+'',_f=Uize.defaultNull(_d.closer,']')+'',_g=Uize.defaultNull(_d.separator,'|')+'';function _v(_k){if(typeof _k!='object'|| !_k)return null;var _w=[];for(var _x in _k){var _y=_v(_k[_x]);_w.push(_x+(_y!=null?_e+_y+_f:''));}
return _w.join(_g);}return _v(_k)||'';};return _a;}});