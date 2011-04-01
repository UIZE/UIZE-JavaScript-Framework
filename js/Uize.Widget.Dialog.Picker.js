/*
	UIZE JAVASCRIPT FRAMEWORK 2011-04-01

	http://www.uize.com/reference/Uize.Widget.Dialog.Picker.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Widget.Dialog.Picker',required:'Uize.Widget.Button.Checkbox',builder:function(d_a){var d_b=false,d_c=true;var d_d=d_a.subclass(null,function(){var d_e=this;function d_f(d_g){var d_h=d_e.children.value;d_e.d_i=d_c;d_e.fire({name:'Submission Complete',result:{value:d_h.valueOf(),valueDetails:d_h.get('valueDetails')},keepOpen:d_g});}d_e.addChild('value',d_e.d_j).wire('Changed.value',function(){if(d_e.get('shown')&& !d_e.d_k){d_f(d_e.d_g);d_e.d_g||d_e.set({shown:d_b});}});d_e.addChild('keepOpen',Uize.Widget.Button.Checkbox).wire('Changed.selected',function(d_l){d_e.set({d_g:d_l.source.get('selected')})});d_e.wire({Ok:function(){d_f()},Cancel:function(){d_e.d_i&&d_e.fire({name:'Submission Complete',result:d_e.d_m});},'Before Show':function(){d_e.d_k=d_c;d_e.children.value.set(d_e.get((d_e.d_n||[]).concat('value')));d_e.d_m=d_e.d_o;d_e.d_k=d_e.d_i=d_b;}});d_e.d_p=d_c;d_e.d_q();}),d_r=d_d.prototype;d_r.d_q=function(){this.d_p&&this.children.keepOpen.set({selected:this.d_g});};
d_d.registerProperties({d_g:{name:'keepOpen',onChange:d_r.d_q,value:d_b},d_j:'valueWidgetClass',d_n:'pipedProperties',d_o:'value'});d_d.set({shieldOpacity:0});return d_d;}});