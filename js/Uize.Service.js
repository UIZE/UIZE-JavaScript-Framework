/*
	UIZE JAVASCRIPT FRAMEWORK 2012-05-05

	http://www.uize.com/reference/Uize.Service.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Service',superclass:'Uize.Class',builder:function(b_a){var b_b,b_c=false,b_d=true,b_e=Uize,SERVICE_TAKING_TOO_LONG=5000;var b_f=b_a.subclass(),b_g=b_f.prototype;b_g.b_h=function(b_i){this.log('SERVICE WARNING: '+b_i);};b_f.declareServiceMethods=function(b_j){};b_f.registerProperties({b_k:{name:'adapter',conformer:function(b_k){if(typeof b_k=='string')b_k=eval(b_k);if(b_k!=b_b){}return b_k;},onChange:function(){var b_l=this;b_l.set('initialized',b_c);}},b_m:{name:'initialized',value:false}});}});