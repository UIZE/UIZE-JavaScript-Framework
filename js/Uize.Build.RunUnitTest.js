/*
	UIZE JAVASCRIPT FRAMEWORK

	http://www.uize.com/reference/Uize.Build.RunUnitTest.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Build.RunUnitTest',required:'Uize.Build.Util',builder:function(){var _a=function(){};_a.perform=function(_b){Uize.Build.Util.runUnitTests(_b.testModule);};return _a;}});