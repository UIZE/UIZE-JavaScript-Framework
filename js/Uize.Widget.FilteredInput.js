/*
	UIZE JAVASCRIPT FRAMEWORK 2011-04-01

	http://www.uize.com/reference/Uize.Widget.FilteredInput.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Widget.FilteredInput',required:['Uize.Widget.FilterGroups','Uize.Util.Coupler'],builder:function(c_a){var c_b=null;var c_c=c_a.subclass(c_b,function(){var c_d=this,c_e=Uize,c_f=c_d.addChild('input',c_d.c_g,c_e.copyInto({},c_d.c_h?{filter:c_d.c_h}:c_b,c_d.c_i)),c_j=c_d.addChild('filterGroups',c_e.Widget.FilterGroups,c_e.copyInto({},c_d.c_k?{values:c_d.c_k}:c_b,c_d.c_h?{value:c_d.c_h}:c_b));new Uize.Util.Coupler({instances:[c_f,c_d],properties:['value']});c_f.wire('Changed.valueDetails',function(){c_d.set({c_l:c_f.get('valueDetails')})});c_j.wire('Changed.value',function(){c_f.set({filter:c_j.valueOf()})});});c_c.registerProperties({c_h:'filter',c_k:'filters',c_g:'inputWidgetClass',c_i:'inputWidgetProperties',c_m:{name:'value',value:null},c_l:'valueDetails'});return c_c;}});