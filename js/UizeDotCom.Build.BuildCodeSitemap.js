/*
	UIZE Web Site 2012-07-08

	http://www.uize.com/reference/UizeDotCom.Build.BuildCodeSitemap.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'UizeDotCom.Build.BuildCodeSitemap',required:'Uize.Wsh',builder:function(){var _a=function(){};_a.perform=function(_b){var _c=/\.js$/i,_d=Uize.Wsh.getScriptFolderPath().length+1,_e=['<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:codesearch="http://www.google.com/codesearch/schemas/sitemap/1.0">'];for(var _f=0,_g=Uize.Wsh.getFiles(env.moduleFolderPath),_h=_g.length,_i;_f<_h;_f++){if(_c.test(_i=_g[_f]))_e.push('\t<url>','\t\t<loc>'+'http://www.uize.com/'+_i.slice(_d).replace(/\\/g,'/')+'</loc>','\t\t<codesearch:codesearch>','\t\t\t<codesearch:filetype>javascript</codesearch:filetype>','\t\t\t<codesearch:license>GPL</codesearch:license>','\t\t</codesearch:codesearch>','\t</url>');}_e.push('</urlset>');Uize.Wsh.writeFile({path:'sitemap-code.xml',text:_e.join('\n')});};return _a;}});