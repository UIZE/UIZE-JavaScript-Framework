/*
	UIZE JAVASCRIPT FRAMEWORK 2012-01-10

	http://www.uize.com/reference/Uize.Widget.Dialog.Iframe.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Widget.Dialog.Iframe',builder:function(d_a){var d_b=true,d_c=false,d_d=null;var d_e=d_a.subclass(function(){var d_f=this;function d_g(d_h){if(d_h!=d_f.d_i){d_f.d_i=d_h;var d_j=d_f.getContentWindow();d_j&&d_j.location?d_j.location.replace(d_h):(d_f.getNode('content').src=d_h);}}d_f.wire({'Before Show':function(){d_g(Uize.isFunction(d_f.d_h)?d_f.d_h():d_f.d_h)},'After Hide':function(){d_f.d_k&&d_g('about:blank')}});}),d_l=d_e.prototype;d_l.getContentWindow=function(){var d_m=this.getNode('content');return d_m?d_m.contentWindow:d_d;};d_e.registerProperties({d_k:{name:'resetUrl',value:d_b},d_h:{name:'url',value:''}});return d_e;}});