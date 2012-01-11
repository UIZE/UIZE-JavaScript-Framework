/*
	UIZE JAVASCRIPT FRAMEWORK 2012-01-10

	http://www.uize.com/reference/Uize.Widget.Dialog.Confirm.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Widget.Dialog.Confirm',builder:function(d_a){var d_b=false,d_c=true;var d_d=d_a.subclass(null,function(){var d_e=this;function d_f(d_g){d_e.fire({name:'Submission Complete',result:d_g})}d_e.wire({Ok:function(){d_f(d_c)},Cancel:function(){d_f(d_b)},Close:function(){d_f(d_b)}});}),d_h=d_d.prototype;d_h.d_i=function(){this.isWired&&this.setNodeProperties('icon',{className:'dialogIcon dialog'+Uize.capFirstChar(this.d_j)+'Icon'});};d_h.d_k=function(){this.isWired&&this.d_l!=null&&this.setNodeInnerHtml('message',this.d_l)};d_h.d_m=function(){this.isWired&&this.children.cancel.showNode('',!this.d_n.indexOf('confirm'))};d_h.updateUi=function(){this.d_i();this.d_k();this.d_m();d_a.prototype.updateUi.call(this);};d_d.registerProperties({d_l:{name:'message',onChange:d_h.d_k,value:''},d_n:{name:'mode',onChange:function(){this.d_n.indexOf('Custom')<0&&this.set({defaultTitle:this.localize(this.d_n=='confirm'?'confirm':'attention')});this.d_m();},value:'confirm'},d_j:{name:'state',onChange:d_h.d_i,
value:'info'}});return d_d;}});