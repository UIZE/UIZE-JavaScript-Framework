/*
	UIZE JAVASCRIPT FRAMEWORK 2012-01-10

	http://www.uize.com/reference/Uize.Widget.Options.Tabbed.Fading.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Widget.Options.Tabbed.Fading',required:'Uize.Fade',builder:function(e_a){var e_b=true,e_c=false,e_d=null;var e_e=e_a.subclass(function(){var e_f=this,e_g=e_f.e_g=e_f.fade=Uize.Fade({duration:1000});e_g.wire({'Changed.value':function(){var e_h=e_g.get('progress');e_f.setNodeOpacity(e_f.e_i,1-e_h);e_f.setNodeOpacity(e_f.e_j,e_h);},Done:function(){e_f.e_k()}});}),e_l=e_e.prototype;e_l.e_k=function(){var e_f=this;e_f.setNodeProperties(e_f.e_i,{className:e_f.get('bodyClassInactive')});e_f.setNodeOpacity(e_f.e_i,1);e_f.setNodeOpacity(e_f.e_j,1);e_f.e_j=e_f.e_i=e_d;};e_l.updateUiTabState=function(e_m,e_n){var e_f=this,e_o=e_f.e_g.get('inProgress');if(e_n==e_m){e_o||e_a.prototype.updateUiTabState.call(e_f,e_m,e_n);}else{if(e_o){e_f.e_g.stop();e_f.e_k();}function e_p(e_q){var e_r=e_q> -1?e_f.getTabBodyNode(e_q):e_d;e_f.setNodeProperties(e_r,{className:e_f.get('bodyClassActive')});e_f.setNodeOpacity(e_r,e_q==e_n?0:1);return e_r;}e_f.e_i=e_p(e_m);e_f.e_j=e_p(e_n);e_f.e_g.start();}};return e_e;}
});