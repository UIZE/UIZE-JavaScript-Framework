/*
	UIZE JAVASCRIPT FRAMEWORK 2011-04-01

	http://www.uize.com/reference/Uize.Widget.Page.xDeferredLinks.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Widget.Page.xDeferredLinks',required:'Uize.Node',builder:function(d_a){d_a.prototype.wireDeferredLinks=function(){var d_b=this,d_c=d_b.d_d,d_e=d_c.length,d_f=0;(function d_g(){function d_h(d_i){var d_j=Uize.Node.getById(d_i[0]),d_k=d_i[1];if(typeof d_k=='string')d_b.setNodeProperties(d_j,{href:d_k});else d_b.wireNode(d_j,'click',function(){d_b.launchPopup(Uize.copyInto({url:d_k.href,name:d_k.target},d_k.popupParams))});}for(var d_l=Math.min(d_e,d_f+d_b.d_m);d_f<d_l;d_f++)d_h(d_c[d_f]);if(d_f<d_e)setTimeout(d_g,0);})();};d_a.registerProperties({d_d:{name:'deferredLinks',value:[]},d_m:{name:'linkBatchSize',value:25}});}});