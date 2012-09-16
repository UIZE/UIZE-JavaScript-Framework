/*
	UIZE JAVASCRIPT FRAMEWORK

	http://www.uize.com/reference/Uize.Services.FileSystem.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Services.FileSystem',superclass:'Uize.Service',builder:function(c_a){var c_b=false,c_c=true;var c_d=c_a.subclass();c_d.declareServiceMethods({readFile:{async:c_b},writeFile:{async:c_b},init:{async:c_b}});return c_d;}});