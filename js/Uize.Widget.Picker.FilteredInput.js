/*
	UIZE JAVASCRIPT FRAMEWORK 2011-03-24

	http://www.uize.com/reference/Uize.Widget.Picker.FilteredInput.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Widget.Picker.FilteredInput',required:'Uize.Date.Formatter',builder:function(e_a){var e_b=e_a.subclass();e_b.registerProperties({e_c:'filter',e_d:'filters',e_e:'fullLinks',e_f:'inputWidgetClass',e_g:'inputWidgetProperties'});e_b.set({pipedProperties:['inputWidgetClass','inputWidgetProperties','filter','filters','fullLinks'],selectorButtonWidgetClass:Uize.Widget.ValueDisplay.Selector,dialogWidgetClass:'Uize.Widget.Dialog.Picker'});return e_b;}});