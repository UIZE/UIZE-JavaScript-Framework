/*
	UIZE JAVASCRIPT FRAMEWORK 2012-01-10

	http://www.uize.com/reference/Uize.Color.xHsv.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Color.xHsv',builder:function(_a){_a.colorSpaces.HSV={fromHsl:function(_b){var _c=_b[2]/100,_d=_b[1]/50*(_c<.5?_c:1-_c),_e=_c+_d/2;return[_b[0],_e?_d/_e*100:0,_e*100];},toHsl:function(_b){var _e=_b[2]/100,_f=_e*(1-_b[1]/100),_d=_e-_f,_c=(_e+_f)/2;return[_b[0],_d?50*_d/(_c<.5?_c:(1-_c)):0,_c*100];}};Uize.copyInto(_a.encodings,{'HSV array':{colorSpace:'HSV',from:_a.setTupleFromArray,to:_a.cloneTuple},'HSV object':{colorSpace:'HSV',from:function(_g,_b){_a.setTuple(_b,_g.hue,_g.saturation,_g.value);},to:function(_b){return{hue:_b[0],saturation:_b[1],value:_b[2]}}},'HSV string':{colorSpace:'HSV',from:_a.setTupleFromString,to:function(_b){function _h(_i,_j,_k){return Uize.constrain(Math.round(_b[_i]),_j,_k);}return('hsv('+_h(0,0,360)+','+_h(1,0,100)+'%,'+_h(2,0,100)+'%'+')');}}});}});