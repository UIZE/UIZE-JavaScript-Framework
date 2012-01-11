/*
	UIZE JAVASCRIPT FRAMEWORK 2012-01-10

	http://www.uize.com/reference/Uize.Node.Form.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Node.Form',builder:function(){var _a=function(){},_b=Uize.Node;_a.doForAll=function(_c,_d){_b.doForAll(_b.find({root:_c,tagName:/^(TEXTAREA|SELECT|INPUT)$/,type:function(_e){return _e!='submit'&&_e!='button'&&(_e!='radio'||this.checked);}}),_d)};_a.getValues=function(_c,_f,_g){var _h={},_i=_g?_g.length:0;_a.doForAll(_c,function(_j){var _k=_f&&_j.type!='radio'?_j.id:_j.name;_h[_i?_k.slice(_i):_k]=_b.getValue(_j);});return _h;};_a.setEnabled=function(_c,_l){_a.doForAll(_c,function(_j){_b.setProperties(_j,{disabled:_l==false?'disabled':''})})};_a.setValues=function(_m,_g){_g=_g||'';for(var _n in _m)_b.setValue(_g+_n,_m[_n]);};return _a;}});