/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Build.BuildWidgetPages Namespace
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2009-2012 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/
Uize.module({name:'UizeSite.Build.BuildWidgetPages',required:['Uize.Wsh','Uize.Build.Util','UizeSite.Templates.WidgetToGoGadgetXml','UizeSite.Templates.WidgetToGoPage','UizeSite.Templates.WidgetToGoHomepage'],builder:function(){var _a=function(){};_a.perform=function(_b){var _c=Uize.Build.Util.readSimpleDataFile('widgets/widgets.simpledata').widgets;for(var _d= -1,_e=_c.length;++_d<_e;){var _f=_c[_d],_g=_f.title.toLowerCase(),_h='widgets\\'+_g;Uize.Wsh.writeFile({path:_h+'.html',
text:UizeSite.Templates.WidgetToGoHomepage.process(_f)});Uize.Wsh.writeFile({path:_h+'\\gadget.xml',text:UizeSite.Templates.WidgetToGoGadgetXml.process(_f)});Uize.Wsh.writeFile({path:_h+'\\web.html',text:UizeSite.Templates.WidgetToGoPage.process({widget:_f})});Uize.Wsh.writeFile({path:_h+'\\mobile.html',text:UizeSite.Templates.WidgetToGoPage.process({widget:_f,mobile:true})});}};return _a;}});