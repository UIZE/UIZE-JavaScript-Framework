/*
	UIZE JAVASCRIPT FRAMEWORK 2012-01-10

	http://www.uize.com/reference/Uize.Widget.Swap.Image.Cycle.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Widget.Swap.Image.Cycle',builder:function(e_a){var e_b=true,e_c=false;var e_d=e_a.subclass(function(){var e_e=this;e_e.e_f= -1;e_e.e_g=e_c;e_e.e_h=null;e_e.fade.wire('Done',function(){if(e_e.e_g&&(e_e.e_f<e_e.e_i.length-1||e_e.e_j))e_e.e_h=setTimeout(function(){e_e.e_k()},e_e.e_l);});}),e_m=e_d.prototype;e_m.e_n=function(){if(this.e_h){clearTimeout(this.e_h);this.e_h=null;}};e_m.e_k=function(){var e_e=this,e_o=e_e.e_o;e_e.e_n();e_o&&e_e.set(e_o[e_e.e_p=(e_e.e_p+1)%e_o.length]);e_e.set({src:e_e.e_i[e_e.e_f=(e_e.e_f+1)%e_e.e_i.length]});};e_m.start=function(){this.e_g=e_b;this.e_k();};e_m.stop=function(){this.e_n();this.e_g=e_c;};e_d.registerProperties({e_i:{name:'images',value:[]},e_l:{name:'interval',value:2000},e_j:{name:'loop',value:e_b},e_o:{name:'cycleSettings',conformer:function(e_q){return Uize.isArray(e_q)?e_q:Uize.values(e_q)},onChange:function(){this.e_p= -1}}});return e_d;}});