/*
	UIZE JAVASCRIPT FRAMEWORK 2011-04-01

	http://www.uize.com/reference/Uize.Widget.InlinePicker.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Widget.InlinePicker',superclass:'Uize.Widget.FormElement',required:'Uize.Widget.ValueDisplay',builder:function(d_a){var d_b=d_a.subclass(null,function(){var d_c=this,d_d=d_c.addChild('value',d_c.d_e,d_c.get((d_c.d_f||[]).concat('value'))),d_g=d_c.addChild('valueDisplay',d_c.d_h||Uize.Widget.ValueDisplay,d_c.d_i);d_d.wire({'Changed.value':function(){d_g.set({value:d_d.valueOf()})},'Changed.valueDetails':function(){d_g.set({valueDetails:d_d.get('valueDetails')})}});});d_b.registerProperties({d_f:'pipedProperties',d_h:'valueDisplayWidgetClass',d_i:'valueDisplayWidgetProperties',d_j:'valueFormatter',d_e:'valueWidgetClass'});return d_b;}});