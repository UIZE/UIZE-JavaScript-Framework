/*
	UIZE JAVASCRIPT FRAMEWORK 2012-01-10

	http://www.uize.com/reference/Uize.Widget.Log.InstanceEvents.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Widget.Log.InstanceEvents',required:['Uize.Json','Uize.String'],builder:function(d_a){var d_b;var d_c=d_a.subclass(),d_d=d_c.prototype;d_c.registerProperties({d_e:{name:'instance',conformer:function(d_f){return(d_f!=d_b&&typeof d_f=='object'&&Uize.isFunction(d_f.wire)&&Uize.isFunction(d_f.unwire)?d_f:undefined);},onChange:function(){var d_g=this,d_h=d_g.d_h,d_e=d_g.d_e;d_h&&d_h.d_e.unwire(d_h.d_i);d_g.clear();d_g.log(d_g.localize(d_e?'startedWatching':'nothingToWatch'));d_g.d_h=d_e?{d_e:d_e,d_i:{'*':function(d_j){if(!Uize.String.startsWith(d_j.name,'Changed.')){d_g.log(d_g.localize('customInstanceEvent')+': '+Uize.Json.to(d_j,'mini'));}},'Changed.*':function(d_j){d_g.log(d_g.localize('propertiesChangedEvent')+': '+Uize.Json.to(d_j.properties,'mini'));}}}:d_b;d_e&&d_e.wire(d_g.d_h.d_i);}}});d_c.set({localized:{customInstanceEvent:'INSTANCE EVENT',nothingToWatch:'No valid object to watch',propertiesChangedEvent:'PROPERTIES CHANGED',startedWatching:'Started watching events'}});return d_c;
}});