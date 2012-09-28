/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.WidgetToGoPage
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2009-2012 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/
Uize.module({name:'UizeSite.WidgetToGoPage',superclass:'Uize.Widget.Page',required:['Uize.Node','UizeSite.Templates.WidgetToGoTitle','Uize.Widget.PopupPalette'],builder:function(d_a){var d_b=d_a.subclass(null,function(){this.addChild('menu',Uize.Widget.PopupPalette,{hideWhenOut:true,positioning:'absolute'}).fade.set({duration:0});}),d_c=d_b.prototype;d_c.wireUi=function(){var d_d=this;if(!d_d.isWired){Uize.Node.injectHtml(document.body,UizeSite.Templates.WidgetToGoTitle.process({idPrefix:d_d.get('idPrefix'),
title:document.title}));Uize.module({required:[d_d.d_e,d_d.d_f],builder:function(){d_d.addChild('widget',eval(d_d.d_e),{built:false,html:eval(d_d.d_f)}).insertOrWireUi();}});var d_g=d_d.children.menu,d_h='../'+d_d.d_i.toLowerCase().replace(/\s+/g,'-')+'.html';function d_j(d_k,d_l,d_m,d_n,d_o){page.launchPopup({name:d_k,url:d_l,width:d_m,height:d_n,toolbar:d_o,location:d_o,directories:d_o,status:d_o,menubar:d_o,scrollbars:d_o,resizable:d_o});}function d_p(d_q,d_l){d_g.wireNode(d_q,'click',function(){d_j(null,d_l,1010,690,1)});}d_p('getThisWidget',d_h);d_p('aboutThisWidget',d_h);d_p('moreWidgets','../../javascript-widgets.html');d_p('uize','../../index.html');d_g.wireNode('openInNewWindow','click',function(){var d_r=Uize.Node.getDimensions(window);d_j('',location.href,d_r.width,d_r.height,0);});d_a.prototype.wireUi.call(d_d);}};d_b.registerProperties({d_i:'title',d_e:'widgetToGoClass',d_f:'widgetToGoHtml'});return d_b;}});