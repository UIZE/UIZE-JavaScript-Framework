/*
	UIZE JAVASCRIPT FRAMEWORK 2011-04-01

	http://www.uize.com/reference/Uize.Widget.FormElement.Text.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Widget.FormElement.Text',builder:function(d_a){var d_b=d_a.subclass(null,function(){var d_c=this;d_c.wire('Changed.focused',function(){var d_d=d_c.get('focused'),d_e=d_c.d_e,d_f=d_c.get('value');if(d_e){function d_g(d_h){d_c.set({value:d_h})}if(d_d&&d_f==d_e)d_g('');else if(!d_d&& !d_f)d_g(d_e)}if(d_c.isWired&&d_d){var d_i=d_c.getNode('input'),d_j=d_i.value?d_i.value.length:0;if(d_j>0){if(d_i.createTextRange){var d_k=d_i.createTextRange();d_k.move('character',d_j);d_k.select();}else if(d_i.setSelectionRange)d_i.setSelectionRange(d_j,d_j);}}});d_c.d_l();}),d_m=d_b.prototype;d_m.d_l=function(){var d_c=this;d_c.d_n=[function(d_f){var d_j=d_f?d_f.length:0;return d_j>=d_c.d_o&&d_j<=d_c.d_p;}];};d_m.checkIsEmpty=function(){return d_a.prototype.checkIsEmpty.call(this)||this.get('value')==this.d_e};d_m.getMoreValidators=function(){return this.d_n};d_b.registerProperties({d_e:'defaultValue',d_o:{name:'minLength',onChange:d_m.d_l,value:0},d_p:{name:'maxLength',onChange:d_m.d_l,value:32767}});
return d_b;}});