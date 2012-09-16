/*
	UIZE JAVASCRIPT FRAMEWORK

	http://www.uize.com/reference/Uize.Util.Needs.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Util.Needs',superclass:'Uize.Class',builder:function(b_a){var b_b='NEEDED_';var b_c=b_a.subclass(),b_d=b_c.prototype;b_d.need=function(b_e,b_f){var b_g=this;b_g.once(b_e,b_f);typeof b_e=='string'?b_g.met(b_b+b_e):Uize.forEach(b_e,function(b_h){b_g.met(b_b+b_h)});};b_d.provide=function(b_h,b_i){var b_g=this;b_g.once(b_b+b_h,function(){b_i(function(b_j){b_g.met(b_h,b_j)})});};return b_c;}});