/*
	UIZE JAVASCRIPT FRAMEWORK 2012-01-10

	http://www.uize.com/reference/Uize.Widget.Dialog.Picker.Palette.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Widget.Dialog.Picker.Palette',required:'Uize.Util.Coupler',builder:function(e_a){var e_b=e_a.subclass(null,function(){var e_c=this;Uize.Util.Coupler({instances:[e_c,e_c.children.value],properties:['tentativeValue','tentativeValueDetails']});e_c.wire('After Show',function(){e_c.children.value.updateUi();if(e_c.e_d){e_c.setNodeStyle('',{minWidth:e_c.e_d});Uize.Node.ieMajorVersion<=7&&e_c.setNodeStyle('valueShell',{minWidth:e_c.e_d});}});});e_b.registerProperties({e_d:'minWidth',e_e:{name:'tentativeValue',onChange:function(){var e_c=this;setTimeout(function(){e_c.fireSubmissionComplete(true,{tentativeValue:e_c.e_e,tentativeValueDetails:e_c.e_f})},0);},value:null},e_f:'tentativeValueDetails'});e_b.set({dismissOnShieldClick:true});return e_b;}});