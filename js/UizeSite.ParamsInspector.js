/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.ParamsInspector
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2009-2012 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/
Uize.module({name:'UizeSite.ParamsInspector',superclass:'Uize.Widget',required:['Uize.Widget.Options.Tabbed','Uize.Data','Uize.Json','Uize.Node.Form','UizeSite.Templates.ParamsInspector'],builder:function(c_a){var c_b=c_a.subclass(null,function(){var c_c=this;c_c.addChild('tabs',Uize.Widget.Options.Tabbed,{bodyClassActive:'tabBodyActive',bodyClassInactive:'tabBodyInactive',values:['presets','params'],value:'presets'});c_c.addChild('preview',Uize.Widget.Button).wire('Click',function(){c_c.c_d()});}),c_e=c_b.prototype;
c_e.c_f=function(c_g){var c_c=this,c_h=c_c.c_h;Uize.Node.Form.setValues(Uize.map(c_c.c_i[c_g],function(c_j,c_k){return c_h[c_k]=='json'?Uize.Json.to(c_j,'mini'):c_j}),c_c.get('idPrefix')+'_');};c_e.c_d=function(){this.fire('Preset Selected');};c_e.getValues=function(){var c_h=this.c_h;return(Uize.map(Uize.Node.Form.getValues(this.getNode(),true,this.get('idPrefix')+'_'),function(c_j,c_k){var c_l=c_h[c_k];return(c_l=='json'?Uize.Json.from(c_j):Uize.isArray(c_l)?c_j:c_l=='integer'||c_l=='number'||typeof c_l=='object'? +c_j:c_j);},false));};c_e.wireUi=function(){var c_c=this;if(!c_c.isWired){c_a.prototype.wireUi.call(c_c);c_c.wireNode('presets','click',function(c_m){var c_n=c_m.target||c_m.srcElement;if(c_n.tagName=='A'){c_c.c_f(Uize.Node.getText(c_n));c_c.c_d();}});for(var c_g in c_c.c_i)break;c_c.c_f(c_g);c_c.c_d();}};c_b.registerProperties({c_h:{name:'params',value:{}},c_i:{name:'presets',value:{}}});c_b.set({built:false,html:UizeSite.Templates.ParamsInspector});return c_b;}});