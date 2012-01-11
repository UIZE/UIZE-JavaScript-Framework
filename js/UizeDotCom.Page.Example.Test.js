/*
	UIZE Web Site 2012-01-10

	http://www.uize.com/reference/UizeDotCom.Page.Example.Test.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'UizeDotCom.Page.Example.Test',required:'Uize.Widget.Button',builder:function(f_a){var f_b=f_a.subclass(null,function(){var f_c=this;var f_d=Uize.Widget.Button.addChildButton.call(this,'performTest',function(){f_d.set({busy:true});f_c.setNodeInnerHtml('testResults','<div style="font-size:30px; text-align:center;">BUSY PERFORMING TEST</div>'+'<div style="font-size:11px; text-align:center;">-- you get no progress bar because we don\'t want to pollute the results --</div>');setTimeout(function(){f_c.performTest(function(f_e){f_c.setNodeInnerHtml('testResults',f_e);f_d.set({busy:'inherit'});f_d.setNodeInnerHtml('','PERFORM TEST AGAIN');});},500);});}),f_f=f_b.prototype;f_f.executeFunctionsWithPause=function(f_g,f_h,f_i){function f_j(){f_k++;f_k<f_l?setTimeout(function(){var f_m=new Date;f_g[f_k]();f_n.push(new Date-f_m);f_j();},f_h):f_i(f_n);}var f_l=f_g.length,f_n=[],f_k= -1;f_j();};f_f.performTest=function(f_i){f_i('');};return f_b;}});