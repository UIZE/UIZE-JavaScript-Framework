/*
	UIZE JAVASCRIPT FRAMEWORK 2011-04-01

	http://www.uize.com/reference/Uize.Widget.SelectorOption.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Widget.SelectorOption',superclass:'Uize.Widget.Button',builder:function(d_a){var d_b=d_a.subclass(null,function(){var d_c=this;function d_d(){d_c.d_d()}d_c.wire({'Changed.busyInherited':d_d,'Changed.enabledInherited':d_d,'Changed.selected':function(){d_c.d_e()}});}),d_f=d_b.prototype;d_f.d_g=function(d_h){this.isWired&&this.setNodeProperties('input',d_h)};d_f.d_e=function(){this.d_g({checked:this.get('selected')})};d_f.d_d=function(){var d_c=this,d_i=d_c.get('enabledInherited')&& !d_c.get('busyInherited');d_c.d_g({readOnly:!d_i,disabled:!d_i});};d_f.updateUi=function(){var d_c=this;if(d_c.isWired){d_c.d_e();d_c.d_d();d_a.prototype.updateUi.call(d_c);}};d_f.wireUi=function(){var d_c=this;if(!d_c.isWired){var d_j=d_c.getNode('input');d_c.wireNode(d_j,'change',function(){d_c.set({selected:d_j.checked})});d_a.prototype.wireUi.call(d_c);}};return d_b;}});