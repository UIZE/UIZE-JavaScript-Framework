/*
	UIZE JAVASCRIPT FRAMEWORK

	http://www.uize.com/reference/Uize.Util.Needs.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Util.Needs',superclass:'Uize.Class',builder:function(b_a){var b_b=b_a.subclass(),b_c=b_b.prototype;b_c.need=function(b_d,b_e){var b_f=this;b_f.once(b_d,b_e);typeof b_d=='string'?b_f.met('Needed:'+b_d):Uize.forEach(b_d,function(b_g){b_f.met('Needed:'+b_g)});};b_c.provide=function(b_g,b_h){var b_f=this;b_f.once('Needed:'+b_g,function(){b_h(function(b_i){b_f.met(b_g,b_i)})});};return b_b;}});