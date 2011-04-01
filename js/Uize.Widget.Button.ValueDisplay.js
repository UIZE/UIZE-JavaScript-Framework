/*
	UIZE JAVASCRIPT FRAMEWORK 2011-04-01

	http://www.uize.com/reference/Uize.Widget.Button.ValueDisplay.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Widget.Button.ValueDisplay',builder:function(d_a){var d_b=d_a.subclass(null,function(){var d_c=this;d_c.d_d&&d_c.addChild('valueDisplay',d_c.d_d,Uize.copyInto({value:d_c.d_e,valueDetails:d_c.d_f},d_c.d_g));});function d_h(){var d_i=this.children.valueDisplay;d_i&&d_i.set({value:this.d_e,valueDetails:this.d_f});}d_b.registerProperties({d_e:{name:'value',onChange:d_h},d_f:{name:'valueDetails',onChange:d_h},d_d:'valueDisplayWidgetClass',d_g:'valueDisplayWidgetProperties'});return d_b;}});