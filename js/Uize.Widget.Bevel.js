/*
	UIZE JAVASCRIPT FRAMEWORK 2012-01-10

	http://www.uize.com/reference/Uize.Widget.Bevel.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Widget.Bevel',required:['Uize.Node','Uize.Node.Util'],builder:function(c_a){var c_b=null,c_c=Uize.Node;var c_d=c_a.subclass(function(){var c_e=this;c_e.c_f=[0,0];}),c_g=c_d.prototype;c_g.c_h=function(){var c_e=this,c_i=c_e.getNode();if(c_i){c_e.c_f[0]=c_i.offsetWidth;c_e.c_f[1]=c_i.offsetHeight;var c_j=(c_c.isIe=='Microsoft Internet Explorer'&&document.compatMode!='CSS1Compat')?0:c_e.c_k*2,c_l='solid '+c_e.c_k+'px ',c_m='<div style="width:'+(c_e.c_f[0]-c_j)+'px; height:'+(c_e.c_f[1]-c_j)+'px; border-left:'+c_l+'#ccc; border-top:'+c_l+'#fff; border-right:'+c_l+'#444; border-bottom:'+c_l+'#000;'+c_c.Util.getOpacityStr(c_e.c_n)+'">'+'&nbsp'+'</div>';c_i.innerHTML=c_m;}};c_g.insertUi=function(){this.c_h();};c_d.registerProperties({c_n:{name:'opacity',onChange:c_g.c_h,value:.3},c_k:{name:'thickness',onChange:c_g.c_h,value:10}});return c_d;}});