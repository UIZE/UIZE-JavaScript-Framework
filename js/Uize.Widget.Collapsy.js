/*
	UIZE JAVASCRIPT FRAMEWORK 2012-01-10

	http://www.uize.com/reference/Uize.Widget.Collapsy.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Widget.Collapsy',required:'Uize.Node.Classes',builder:function(c_a){var c_b=true,c_c=false;var c_d=c_a.subclass(),c_e=c_d.prototype;c_e.c_f=function(){var c_g=this;if(c_g.isWired){var c_h=c_g.c_h;c_g.setNodeStyle('',{display:c_h?'inline':'none'});if(c_h){c_g.setNodeInnerHtml('text',c_g.c_i(c_g.c_j?c_g.c_k:c_g.c_l));Uize.Node.Classes.setState(c_g.getNode(''),[c_g.c_m,c_g.c_n],c_g.c_j);}}};c_e.c_i=function(c_o){return Uize.isFunction(c_o)?c_o():c_o;};c_e.getCollapsedMessage=function(){return this.c_i(this.c_k)};c_e.getExpandedMessage=function(){return this.c_i(this.c_l)};c_e.updateUi=function(){this.c_f();c_a.prototype.updateUi.call(this);};c_e.wireUi=function(){var c_g=this;if(!c_g.isWired){function c_p(c_j){c_g.set({c_j:c_j})}c_g.wireNode('',{mouseover:function(){c_p(c_c)},mouseout:function(){c_p(c_b)}});c_a.prototype.wireUi.call(c_g);}};c_d.registerProperties({c_j:{name:'collapsed',onChange:c_e.c_f,value:c_b},c_n:{name:'collapsedClass',onChange:c_e.c_f},c_k:{name:'collapsedMessage',
onChange:c_e.c_f,value:''},c_m:{name:'expandedClass',onChange:c_e.c_f},c_l:{name:'expandedMessage',onChange:c_e.c_f},c_h:{name:'shown',onChange:c_e.c_f,value:c_c}});return c_d;}});