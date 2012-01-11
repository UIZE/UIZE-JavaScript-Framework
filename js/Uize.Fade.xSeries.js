/*
	UIZE JAVASCRIPT FRAMEWORK 2012-01-10

	http://www.uize.com/reference/Uize.Fade.xSeries.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Fade.xSeries',builder:function(b_b_a){b_b_a.prototype.getSeries=function(b_b_b){var b_b_c=this,b_b_d=[],b_b_e=Math.max(b_b_b-1,1);for(var b_b_f= -1;++b_b_f<b_b_b;){b_b_c.set({b_b_g:b_b_f/b_b_e});b_b_d.push(Uize.clone(b_b_c.valueOf()));}return b_b_d;};b_b_a.getSeries=function(b_b_h,b_b_i,b_b_b,b_b_j){return(new b_b_a(Uize.copyInto({startValue:b_b_h,endValue:b_b_i},b_b_j)).getSeries(b_b_b));};}});