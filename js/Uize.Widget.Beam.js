/*
	UIZE JAVASCRIPT FRAMEWORK 2012-01-10

	http://www.uize.com/reference/Uize.Widget.Beam.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Widget.Beam',required:'Uize.Node',builder:function(c_a){var c_b=null,c_c=Uize.Node;var c_d=c_a.subclass(),c_e=c_d.prototype;var c_f=c_e.updateUi=function(){var c_g=this;if(c_g.isWired){var c_h=c_g.c_h,c_i=c_g.c_i,c_j=Math.round(c_i*c_g.c_k),c_l=Math.round(c_i-c_j)*c_g.c_m,c_n=c_l+c_j-1;c_g.setNodeStyle('',c_g.get(['left','top','width','height']));c_g.setNodeStyle('diamondTopLeft',{left:0,top:0,width:c_h,height:c_l});c_g.setNodeStyle('diamondBottomLeft',{left:0,top:c_l+c_j,width:c_h,height:c_i-c_j-c_l});c_g.setNodeStyle('middle',{left:0,top:c_l,width:c_h,height:c_j});}};c_d.registerProperties({c_o:{name:'direction',onChange:c_f,value:'right'},c_i:{name:'height',onChange:c_f,value:100},c_p:{name:'left',onChange:c_f,value:0},c_m:{name:'thinAlign',onChange:c_f,value:.5},c_k:{name:'thinSize',onChange:c_f,value:.1},c_q:{name:'top',onChange:c_f,value:0},c_h:{name:'width',onChange:c_f,value:100}});return c_d;}});