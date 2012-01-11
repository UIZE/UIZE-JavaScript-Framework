/*
	UIZE JAVASCRIPT FRAMEWORK 2012-01-10

	http://www.uize.com/reference/Uize.Widget.ColorInfo.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Widget.ColorInfo',required:['Uize.Color','Uize.Templates.ColorInfo'],builder:function(c_a){var c_b=c_a.subclass(),c_c=c_b.prototype;c_c.c_d=function(){var c_e=this;if(c_e.isWired){var c_f=Uize.Color.to(c_e.c_g,'#hex');c_e.setNodeValue('value',c_f);c_e.setNodeStyle(['swatch','asBackground'],{backgroundColor:c_f});c_e.setNodeStyle('asForeground',{color:c_f});}};c_c.updateUi=function(){this.c_d();};c_b.registerProperties({c_g:{name:'value',onChange:c_c.c_d,value:'#000000'}});c_b.set({built:false,html:Uize.Templates.ColorInfo});return c_b;}});