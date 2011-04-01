/*
	UIZE JAVASCRIPT FRAMEWORK 2011-04-01

	http://www.uize.com/reference/Uize.Widget.Droplist.Navigate.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Widget.Droplist.Navigate',required:'Uize.Url',builder:function(g_a){var g_b=g_a.subclass(null,function(){var g_c=this;g_c.wire('Changed.value',function(){g_c.g_d()});}),g_e=g_b.prototype;g_e.g_d=function(){var g_c=this,g_f={},g_g=g_c.getValueObject(),g_h=g_c.g_h,g_i=g_c.get('valueMap');if(g_g){if(!g_h){g_h={};for(var g_j in g_g){if(g_j!='name'&&g_j!=g_i.displayName)g_h[g_j]=g_j;}}for(var g_k in g_h)g_f[g_k]=g_g[g_h[g_k]];location.href=Uize.Url.resolve(g_c.g_l||location.href,g_f);}};g_b.registerProperties({g_l:'urlBase',g_h:'urlParamsMap'});return g_b;}});