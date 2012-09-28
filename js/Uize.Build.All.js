/*
	UIZE JAVASCRIPT FRAMEWORK

	http://www.uize.com/reference/Uize.Build.All.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Build.All',required:'Uize.Build.Util',builder:function(){var _a=function(){};_a.perform=function(_b){var _c=Uize.Build.Util.runScripts(_b.buildSequence.concat(_b.test=='true'?_b.testSequence:[]));_b.silent=='true'||alert(_c?('BUILD FAILED IN THE FOLLOWING SCRIPT:\n\n'+_c.script):'BUILD ALL COMPLETE!!!');_c&&WScript.Quit(1);};return _a;}});