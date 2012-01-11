/*
	UIZE JAVASCRIPT FRAMEWORK 2012-01-10

	http://www.uize.com/reference/Uize.Widget.Swap.Deck.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Widget.Swap.Deck',builder:function(d_a){var d_b=d_a.subclass(function(){var d_c=this;d_c.d_d= -1;}),d_e=d_b.prototype;d_e.d_f=function(d_g){return d_g> -1?('item'+d_g):null;};d_e.d_h=function(){var d_c=this;if(d_c.isWired){d_c.showNode(d_c.d_i,false);d_c.displayNode(d_c.d_i);}};d_e.d_j=function(){var d_c=this;if(d_c.isWired){var d_k=d_c.getNode(d_c.d_f(d_c.d_d)),d_l=d_c.getNode(d_c.d_f(d_c.d_g));d_c.d_h();d_c.prepareForNextItem(d_k,d_l);d_c.setCurrentItem(d_l);d_c.showNode([d_k,d_l]);d_c.d_d=d_c.d_g;}};d_e.updateUi=function(){this.d_h();this.d_j();};d_b.registerProperties({d_g:{name:'itemNo|value',onChange:d_e.d_j,value:-1},d_m:{name:'totalItems',onChange:function(){var d_c=this;d_c.d_i=Uize.map(d_c.d_m,function(d_n,d_g){return d_c.d_f(d_g)});},value:0}});return d_b;}});