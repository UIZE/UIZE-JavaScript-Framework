/*
	UIZE JAVASCRIPT FRAMEWORK 2012-07-07

	http://www.uize.com/reference/Uize.Service.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Service',superclass:'Uize.Class',builder:function(_a){var _b,_c=false,_d=true,_e=Uize,SERVICE_TAKING_TOO_LONG=5000;var _f=_a.subclass(),_g=_f.prototype;_g._h=function(_i){this.log('SERVICE WARNING: '+_i);};_f.declareServiceMethods=function(_j){};_f.registerProperties({_k:{name:'adapter',conformer:function(_k){if(typeof _k=='string')_k=eval(_k);if(_k!=_b){}return _k;},onChange:function(){var _l=this;_l.set('initialized',_c);}},_m:{name:'initialized',value:false}});}});