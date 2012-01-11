/*
	UIZE JAVASCRIPT FRAMEWORK 2012-01-10

	http://www.uize.com/reference/Uize.Util.Cycle.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Util.Cycle',superclass:'Uize.Class',builder:function(b_a){var b_b=true,b_c=false;var b_d=b_a.subclass(function(){var b_e=this;b_e.b_f=0;b_e.b_g=b_c;b_e.b_h=null;}),b_i=b_d.prototype;b_i.b_j=function(){if(this.b_h){clearTimeout(this.b_h);this.b_h=null;}};b_i.b_k=function(){var b_e=this,b_l=b_e.b_l;b_e.b_j();if(b_l){for(var b_m= -1,b_n=b_l.length;++b_m<b_n;){var b_o=b_l[b_m],b_p=Uize.values(b_o.source),b_q=b_o.target;var b_r=b_p[b_e.b_f%b_p.length];if(b_o.sourceProperty)b_r=b_r[b_o.sourceProperty];b_o.targetProperty?b_q.set(b_o.targetProperty,b_r):b_q.set(b_r);}}if(b_e.b_g)b_e.b_h=setTimeout(function(){b_e.b_k()},b_e.b_s);b_e.b_f++;};b_i.start=function(){this.b_g=b_b;this.b_k();};b_i.stop=function(){this.b_j();this.b_g=b_c;};b_d.registerProperties({b_l:'bindings',b_s:{name:'interval',value:6000},b_t:{name:'loop',value:b_b}});return b_d;}});