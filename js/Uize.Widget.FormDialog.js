/*
	UIZE JAVASCRIPT FRAMEWORK 2012-01-10

	http://www.uize.com/reference/Uize.Widget.FormDialog.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Widget.FormDialog',superclass:'Uize.Widget.Dialog',required:'Uize.Widget.Form',builder:function(d_a){var d_b=d_a.subclass(null,function(){var d_c=this,d_d=false,d_e=d_c.addChild('form',d_c.d_f,{useNormalSubmit:d_d});d_e.wire('Changed.okToSubmit',function(){d_e.get('okToSubmit')&&d_c.handleFormValue(function(){d_c.fire({name:'Submission Complete',result:d_e.get('value')});d_c.set({shown:d_d});});});d_c.wire({Ok:function(d_g){d_e.submit();d_g.abort=true;},'Before Show':function(){if(d_c.d_h)d_e.set({value:Uize.clone(d_c.d_h)});},'After Show':function(){d_e.updateUi()},'After Hide':function(){d_e.reset()}});});d_b.prototype.handleFormValue=function(d_i){d_i()};d_b.registerProperties({d_f:{name:'formWidgetClass',value:Uize.Widget.Form},d_h:'value'});return d_b;}});