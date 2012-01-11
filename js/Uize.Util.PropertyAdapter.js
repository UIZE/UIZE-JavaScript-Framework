/*
	UIZE JAVASCRIPT FRAMEWORK 2012-01-10

	http://www.uize.com/reference/Uize.Util.PropertyAdapter.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Util.PropertyAdapter',superclass:'Uize.Class',builder:function(b_a){var b_b=b_a.subclass(),b_c=b_b.prototype;function b_d(){var b_e=this,b_f=b_e.b_f;function b_g(b_h){for(var b_i= -1,b_j=b_f.length;++b_i<b_j;)(b_k=b_f[b_i]).b_l[b_h](b_k.b_m,b_k.b_n);}if(b_f)b_f=b_e.b_f=b_g('unwire');if(b_e.b_o){var b_p=b_e.b_p,b_q=b_e.b_q,b_r=b_e.b_r,b_s;function b_t(b_u){var b_v=b_u?b_p:b_q,b_w=b_u?b_q:b_p;if(b_s!=b_w){var b_x=b_v.instance.get(b_v.property);b_s=b_v;b_w.instance.set(b_w.property,b_r?b_r[b_u?'aToB':'bToA'](b_x):b_x);b_s=null;}}if(b_p&&b_q){b_t(true);b_f=b_e.b_f=[{b_l:b_p.instance,b_m:'Changed.'+b_p.property,b_n:function(){b_t(true)}},{b_l:b_q.instance,b_m:'Changed.'+b_q.property,b_n:function(){b_t()}}];b_g('wire');}}}function b_y(b_z){if(b_z){var b_A=Uize.isArray(b_z);if(b_A||Uize.isInstance(b_z))b_z=b_A?{instance:b_z[0],property:b_z[1]}:{instance:b_z};b_z.property||(b_z.property='value');}return b_z;}b_b.registerProperties({b_o:{name:'connected',onChange:b_d,value:true},b_p:{
name:'propertyA',conformer:b_y,onChange:b_d},b_q:{name:'propertyB',conformer:b_y,onChange:b_d},b_r:{name:'valueAdapter',onChange:b_d}});return b_b;}});