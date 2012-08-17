/*
	UIZE Web Site 2012-08-17

	http://www.uize.com/reference/UizeDotCom.Build.BuildWidgetPages.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'UizeDotCom.Build.BuildWidgetPages',required:['Uize.Wsh','Uize.Build.Util','UizeDotCom.Templates.WidgetToGoGadgetXml','UizeDotCom.Templates.WidgetToGoPage','UizeDotCom.Templates.WidgetToGoHomepage'],builder:function(){var _a=function(){};_a.perform=function(_b){var _c=Uize.Build.Util.readSimpleDataFile('widgets/widgets.simpledata').widgets;for(var _d= -1,_e=_c.length;++_d<_e;){var _f=_c[_d],_g=_f.title.toLowerCase(),_h='widgets\\'+_g;Uize.Wsh.writeFile({path:_h+'.html',text:UizeDotCom.Templates.WidgetToGoHomepage.process(_f)});Uize.Wsh.writeFile({path:_h+'\\gadget.xml',text:UizeDotCom.Templates.WidgetToGoGadgetXml.process(_f)});Uize.Wsh.writeFile({path:_h+'\\web.html',text:UizeDotCom.Templates.WidgetToGoPage.process({widget:_f})});Uize.Wsh.writeFile({path:_h+'\\mobile.html',text:UizeDotCom.Templates.WidgetToGoPage.process({widget:_f,mobile:true})});}};return _a;}});