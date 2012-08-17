/*
	UIZE JAVASCRIPT FRAMEWORK 2012-08-17

	http://www.uize.com/reference/Uize.Fade.xSeries.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Fade.xSeries',builder:function(_a){_a.prototype.getSeries=function(_b){var _c=this,_d=[],_e=Math.max(_b-1,1);for(var _f= -1;++_f<_b;){_c.set({progress:_f/_e});_d.push(Uize.clone(_c.valueOf()));}return _d;};_a.getSeries=function(_g,_h,_b,_i){return(new _a(Uize.copyInto({startValue:_g,endValue:_h},_i)).getSeries(_b));};}});