/*
	UIZE JAVASCRIPT FRAMEWORK 2012-01-10

	http://www.uize.com/reference/Uize.Widget.Dialog.Picker.Palette.Selector.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Widget.Dialog.Picker.Palette.Selector',required:['Uize.Widget.Options.Selector','Uize.Util.Coupler'],builder:function(f_a){var f_b=f_a.subclass(null,function(){Uize.Util.Coupler({instances:[this,this.children.value],properties:['valueNo','tentativeValueNo']})});function f_c(f_d){this.fireSubmissionComplete(true,f_d)}f_b.registerProperties({f_e:{name:'tentativeValueNo',onChange:f_c,value:-1},f_f:{name:'valueNo',onChange:f_c,value:-1},f_g:{name:'values',value:[]}});f_b.set({pipedProperties:['values'],valueWidgetClass:Uize.Widget.Options.Selector,shieldOpacity:.01});return f_b;}});