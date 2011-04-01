/*
	UIZE JAVASCRIPT FRAMEWORK 2011-04-01

	http://www.uize.com/reference/Uize.Widget.Fleeting.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Widget.Fleeting',required:'Uize.Fade',builder:function(c_a){var c_b=true,c_c=false;var c_d=c_a.subclass(function(){var c_e=this;c_e.c_f=null;c_e.c_g=new Uize.Fade({curve:Uize.Fade.celeration(0,1),duration:750});c_e.c_g.wire({Start:function(){if(c_e.c_h)c_e.displayNode('',c_e.c_h);},'Changed.value':function(){c_e.setNodeOpacity('',c_e.c_g);},Done:function(){if(!c_e.c_h)c_e.displayNode('',c_e.c_h);}});}),c_i=c_d.prototype;c_i.show=function(){var c_e=this;if(c_e.c_f!=null){clearTimeout(c_e.c_j);c_e.c_j=null;}c_e.set({c_h:c_b});};c_d.registerProperties({c_k:{name:'maxOpacity',value:1},c_l:{name:'lifeSpan',value:5000},c_h:{name:'shown',onChange:function(){var c_e=this;c_e.c_h&&c_e.fire('Before Show');c_e.c_g.start({startValue:c_e.c_h?0:c_e.c_k,endValue:c_e.c_h?c_e.c_k:0,curve:Uize.Fade.celeration(0,1)});if(c_e.c_h){c_e.c_f=setTimeout(function(){c_e.set({shown:false});},c_e.c_l);}!c_e.c_h&&c_e.fire('After Hide');},value:c_c}});return c_d;}});