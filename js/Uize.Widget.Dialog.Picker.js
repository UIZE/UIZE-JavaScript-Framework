/*
	UIZE JAVASCRIPT FRAMEWORK 2011-02-20

	http://www.uize.com/reference/Uize.Widget.Dialog.Picker.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Widget.Dialog.Picker',required:'Uize.Widget.Button.Checkbox',builder:function(d_a){var d_b=false,d_c=true;var d_d=d_a.subclass(null,function(){var d_e=this;function d_f(d_g){d_e.d_h=d_c;d_e.fire({name:'Submission Complete',result:d_e.children.value.valueOf(),keepOpen:d_g});}d_e.addChild('value',d_e.d_i).wire('Changed.value',function(){if(d_e.get('shown')&& !d_e.d_j){d_f(d_e.d_g);d_e.d_g||d_e.set({shown:d_b});}});d_e.addChild('keepOpen',Uize.Widget.Button.Checkbox).wire('Changed.selected',function(d_k){d_e.set({d_g:d_k.source.get('selected')})});d_e.wire({Ok:function(){d_f()},Cancel:function(){d_e.d_h&&d_e.fire({name:'Submission Complete',result:d_e.d_l});},'Before Show':function(){d_e.d_j=d_c;d_e.children.value.set(d_e.get((d_e.d_m||[]).concat('value')));d_e.d_l=d_e.d_n;d_e.d_j=d_e.d_h=d_b;}});d_e.d_o=d_c;d_e.d_p();}),d_q=d_d.prototype;d_q.d_p=function(){this.d_o&&this.children.keepOpen.set({selected:this.d_g});};d_d.registerProperties({d_g:{name:'keepOpen',onChange:d_q.d_p,value:d_b},
d_i:'valueWidgetClass',d_m:'pipedProperties',d_n:'value'});d_d.set({shieldOpacity:0});return d_d;}});