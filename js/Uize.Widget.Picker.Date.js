/*
	UIZE JAVASCRIPT FRAMEWORK 2012-01-10

	http://www.uize.com/reference/Uize.Widget.Picker.Date.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Widget.Picker.Date',required:'Uize.Date.Formatter',builder:function(e_a){var e_b=e_a.subclass();e_b.registerProperties({e_c:{name:'displayFormat',value:'{YYYY}-{MM}-{DD}'}});e_b.set({dialogWidgetClass:'Uize.Widget.Dialog.Picker.Date',pipedProperties:['displayFormat','maxValue','minValue'],valueFormatter:function(e_d){return Uize.Date.Formatter.format(e_d,this.e_c)}});return e_b;}});