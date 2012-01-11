/*
	UIZE JAVASCRIPT FRAMEWORK 2012-01-10

	http://www.uize.com/reference/Uize.Color.xCmyk.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Color.xCmyk',builder:function(_a){var _b=_a.colorSpaces.sRGB;_a.colorSpaces.CMYK={fromHsl:function(_c){_c=_b.fromHsl(_c);var _d=_c[0]/255,_e=_c[1]/255,_f=_c[2]/255,_g=Math.min(1-_d,1-_e,1-_f),_h=1-_g;return[_h&&((_h-_d)/_h*100),_h&&((_h-_e)/_h*100),_h&&((_h-_f)/_h*100),_g*100];},toHsl:function(_c){var _g=_c[3]/100,_h=1-_g;return _b.toHsl([(1-Math.min(1,_c[0]/100*_h+_g))*255,(1-Math.min(1,_c[1]/100*_h+_g))*255,(1-Math.min(1,_c[2]/100*_h+_g))*255]);}};Uize.copyInto(_a.encodings,{'CMYK array':{colorSpace:'CMYK',from:_a.setTupleFromArray,to:_a.cloneTuple},'CMYK object':{colorSpace:'CMYK',from:function(_i,_c){_a.setTuple(_c,_i.cyan,_i.magenta,_i.yellow,_i.key);},to:function(_c){return{cyan:_c[0],magenta:_c[1],yellow:_c[2],key:_c[3]}}},'CMYK string':{colorSpace:'CMYK',from:_a.setTupleFromString,to:function(_c){function _j(_k){return Uize.constrain(Math.round(_c[_k]),0,100);}return('cmyk('+_j(0)+'%,'+_j(1)+'%,'+_j(2)+'%,'+_j(3)+'%'+')');}}});}});