/*
	UIZE JAVASCRIPT FRAMEWORK 2011-03-24

	http://www.uize.com/reference/Uize.Widget.InlinePicker.FilteredInput.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Widget.InlinePicker.FilteredInput',required:['Uize.Widget.FilteredInput','Uize.Widget.ValueDisplay.Selector'],builder:function(e_a){var e_b=e_a.subclass();e_b.registerProperties({e_c:'filter',e_d:'filters',e_e:'fullLinks',e_f:'inputWidgetClass',e_g:'inputWidgetProperties'});e_b.set({pipedProperties:['inputWidgetClass','inputWidgetProperties','filter','filters','fullLinks'],valueDisplayWidgetClass:Uize.Widget.ValueDisplay.Selector,valueWidgetClass:Uize.Widget.FilteredInput});return e_b;}});