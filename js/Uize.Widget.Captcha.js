/*
	UIZE JAVASCRIPT FRAMEWORK 2012-01-10

	http://www.uize.com/reference/Uize.Widget.Captcha.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Widget.Captcha',builder:function(c_a){var c_b=c_a.subclass(),c_c=c_b.prototype;c_c.initializeCaptcha=function(){};c_c.validate=function(c_d){return this.c_e=false};c_c.wireUi=function(){var c_f=this;if(!c_f.isWired){c_a.prototype.wireUi.call(c_f)}};c_b.registerProperties({c_e:{name:'isValid',value:false},c_g:'value'});return c_b;}});