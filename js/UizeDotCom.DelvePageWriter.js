/*
	UIZE Web Site 2012-01-10

	http://www.uize.com/reference/UizeDotCom.DelvePageWriter.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'UizeDotCom.DelvePageWriter',required:['Uize.Node','UizeDotCom.Templates.DelvePageHtml'],builder:function(){var _a=function(){};_a.initialize=function(){Uize.Node.setStyle(document.body,{margin:0});var _b=UizeDotCom.Templates.DelvePageHtml.process({pathToResources:Uize.pathToResources}),_c='javascript:\''+encodeURIComponent(_b.replace(/'/g,'\\\'').replace(/\r|\n|\r\n/g,''))+'\'';Uize.Node.injectHtml(document.body,'<iframe src="'+_c+'" frameborder="0" style="width:100%; height:100%; border:0;"></iframe>');};return _a;}});