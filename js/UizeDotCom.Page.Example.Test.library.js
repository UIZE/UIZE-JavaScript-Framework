/*______________
|       ______  |   B U I L T     O N     U I Z E     F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |   This JavaScript application is developed using the object
|   /    / /    |   oriented UIZE JavaScript framework as its foundation.
|  /    / /  /| |
| /____/ /__/_| |    ONLINE : http://www.uize.com
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeDotCom.Page.Example.Test.library Library Module
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2009-2012 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*?
	Introduction
		The =UizeDotCom.Page.Example.Test.library= module is a library module that bundles together various JavaScript modules common to the test pages of the UIZE JavaScript Framework's Web site.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	required:'UizeDotCom.Page.Example.library',
	builder:function () {
		

Uize.module({name:'UizeDotCom.Page.Example.Test',required:'Uize.Widget.Button',builder:function(f_a){var f_b=f_a.subclass(null,function(){var f_c=this;var f_d=Uize.Widget.Button.addChildButton.call(this,'performTest',function(){f_d.set({busy:true});f_c.setNodeInnerHtml('testResults','<div style="font-size:30px; text-align:center;">BUSY PERFORMING TEST</div>'+'<div style="font-size:11px; text-align:center;">-- you get no progress bar because we don\'t want to pollute the results --</div>');setTimeout(function(){f_c.performTest(function(f_e){f_c.setNodeInnerHtml('testResults',f_e);f_d.set({busy:'inherit'});f_d.setNodeInnerHtml('','PERFORM TEST AGAIN');});},500);});}),f_f=f_b.prototype;f_f.executeFunctionsWithPause=function(f_g,f_h,f_i){function f_j(){f_k++;f_k<f_l?setTimeout(function(){var f_m=new Date;f_g[f_k]();f_n.push(new Date-f_m);f_j();},f_h):f_i(f_n);}var f_l=f_g.length,f_n=[],f_k= -1;f_j();};f_f.performTest=function(f_i){f_i('');};return f_b;}});
		Uize.module ({name:'UizeDotCom.Page.Example.Test.library'});
	}
});

