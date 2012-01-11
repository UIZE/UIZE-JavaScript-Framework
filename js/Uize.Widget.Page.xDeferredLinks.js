/*
	UIZE JAVASCRIPT FRAMEWORK 2012-01-10

	http://www.uize.com/reference/Uize.Widget.Page.xDeferredLinks.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Widget.Page.xDeferredLinks',required:'Uize.Node',builder:function(c_a_a){c_a_a.prototype.wireDeferredLinks=function(){var c_a_b=this,c_a_c=c_a_b.c_a_d,c_a_e=c_a_c.length,c_a_f=0;(function c_a_g(){function c_a_h(c_a_i){var c_a_j=Uize.Node.getById(c_a_i[0]),c_a_k=c_a_i[1];if(typeof c_a_k=='string')c_a_b.setNodeProperties(c_a_j,{href:c_a_k});else c_a_b.wireNode(c_a_j,'click',function(){c_a_b.launchPopup(Uize.copyInto({url:c_a_k.href,name:c_a_k.target},c_a_k.popupParams))});}for(var c_a_l=Math.min(c_a_e,c_a_f+c_a_b.c_a_m);c_a_f<c_a_l;c_a_f++)c_a_h(c_a_c[c_a_f]);if(c_a_f<c_a_e)setTimeout(c_a_g,0);})();};c_a_a.registerProperties({c_a_d:{name:'deferredLinks',value:[]},c_a_m:{name:'linkBatchSize',value:25}});}});