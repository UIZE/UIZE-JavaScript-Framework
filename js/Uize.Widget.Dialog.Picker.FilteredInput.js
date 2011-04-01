/*
	UIZE JAVASCRIPT FRAMEWORK 2011-04-01

	http://www.uize.com/reference/Uize.Widget.Dialog.Picker.FilteredInput.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Widget.Dialog.Picker.FilteredInput',required:'Uize.Widget.FilteredInput',builder:function(e_a){var e_b=e_a.subclass(null,function(){var e_c=this;e_c.wire('After Show',function(){e_c.e_d&&e_c.setNodeStyle('',{minWidth:e_c.e_d})});});e_b.registerProperties({e_e:'filter',e_f:'filters',e_g:'inputWidgetClass',e_h:'inputWidgetProperties',e_d:'minWidth'});e_b.set({valueWidgetClass:Uize.Widget.FilteredInput,pipedProperties:['inputWidgetClass','inputWidgetProperties','filter','filters'],dismissOnShieldClick:true});return e_b;}});