/*
	UIZE JAVASCRIPT FRAMEWORK 2012-01-10

	http://www.uize.com/reference/Uize.Widget.Button.Filter.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Widget.Button.Filter',required:'Uize.Node.Classes',builder:function(d_a){var d_b=d_a.subclass(),d_c=d_b.prototype;d_c.d_d=function(){var d_e=this;if(d_e.isWired){var d_f=d_e.d_f,d_g=d_e.localize('filterWithCount',{filterLabel:d_f,count:d_e.d_h});d_e.set({text:d_e.d_i&&d_g?d_g:d_f});}};d_c.d_j=function(){var d_e=this;d_e.isWired&&Uize.Node.Classes.setState(d_e.getNode(),['',d_e.d_k],d_e.d_l);};d_c.updateUi=function(){var d_e=this;if(d_e.isWired){d_e.d_d();d_e.d_j();d_a.prototype.updateUi.call(d_e);}};d_b.registerProperties({d_h:{name:'count',onChange:d_c.d_d},d_l:{name:'featured',onChange:d_c.d_j},d_k:{name:'featuredCssClass',onChange:d_c.d_j,value:''},d_f:{name:'label',onChange:d_c.d_d},d_i:{name:'showCount',onChange:d_c.d_d}});return d_b;}});