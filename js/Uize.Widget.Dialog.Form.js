/*
	UIZE JAVASCRIPT FRAMEWORK 2012-01-10

	http://www.uize.com/reference/Uize.Widget.Dialog.Form.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Widget.Dialog.Form',required:['Uize.Data','Uize.Node.Form'],builder:function(d_a){var d_b=true,d_c=false,d_d=Uize.Node.Form;var d_e=d_a.subclass(function(){var d_f=this;d_f.d_g=d_c;function d_h(d_i){if(!d_f.d_j)return d_f.fire('Submission Complete');var d_k=d_f.getResult();if(d_k.isModified)d_f.d_l=d_k.formData;d_k.isQualifiedOk=d_i;d_f.fire({name:'Submission Complete',result:d_k});d_f.d_g=d_c;}d_f.wire({'Ok':function(){d_h(d_c);},'Qualified Ok':function(){d_h(d_b);},'Cancel':function(){if(d_f.d_j){d_f.d_g=d_f.getResult().isModified;}},'Before Show':function(){d_f.d_j&&d_f.d_l&&d_f.d_g&&d_d.setValues(d_f.d_l);}});}),d_m=d_e.prototype;d_m.wireUi=function(){var d_f=this;if(!d_f.isWired){var d_j=d_f.d_j=d_f.getNode('form');if(d_j&& !d_f.d_l)d_f.d_l=d_d.getValues(d_j);d_a.prototype.wireUi.call(d_f);}};d_m.getResult=function(){var d_f=this,d_l=d_d.getValues(d_f.d_j);return{isModified:!Uize.Data.identical(d_f.d_l,d_l),formData:d_l};};d_e.registerProperties({d_l:{name:'formData',value:null,
onChange:function(){d_d.setValues(this.d_l);}}});return d_e;}});