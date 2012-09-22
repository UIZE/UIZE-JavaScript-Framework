/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.DelvePageWriter
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2012 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/
Uize.module({name:'UizeSite.DelvePageWriter',required:['Uize.Node','UizeSite.Templates.DelvePageHtml'],builder:function(){var _a=function(){};_a.initialize=function(){Uize.Node.setStyle(document.body,{margin:0});var _b=UizeSite.Templates.DelvePageHtml.process({pathToResources:Uize.pathToResources}),_c='javascript:\''+encodeURIComponent(_b.replace(/'/g,'\\\'').replace(/\r|\n|\r\n/g,''))+'\'';Uize.Node.injectHtml(document.body,'<iframe src="'+_c+'" frameborder="0" style="width:100%; height:100%; border:0;"></iframe>');};
return _a;}});