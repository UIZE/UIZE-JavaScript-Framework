/*
	UIZE JAVASCRIPT FRAMEWORK 2012-01-10

	http://www.uize.com/reference/Uize.Widget.Swap.Html.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Widget.Swap.Html',required:'Uize.Node',builder:function(d_a){var d_b=Uize.Node;var d_c=d_a.subclass(function(){var d_d=this;d_d.d_e=0;}),d_f=d_c.prototype;d_c.registerProperties({d_g:{name:'background',value:'#000'},d_h:{name:'content|value',onChange:function(){var d_d=this;if(d_d.isWired){var d_i=d_d.getNode('item'+d_d.d_e),d_j=1-d_d.d_e,d_k=d_d.getNode('item'+d_j);d_d.prepareForNextItem(d_i,d_k);d_k.innerHTML=d_d.d_h;d_d.d_e=d_j;d_d.setCurrentItem(d_k);}},value:''}});d_c.set({html:{process:function(input){var d_l=d_b.getDimensions(this.getNode());function d_m(d_n){return('<div id="'+input.idPrefix+'-item'+d_n+'" style="position:absolute; margin:0px; padding:0px; left:0px; top:0px; width:'+d_l.width+'px; height:'+d_l.height+'px; background:'+input.background+'; overflow:hidden;"></div>');}return d_m(0)+d_m(1);}}});return d_c;}});