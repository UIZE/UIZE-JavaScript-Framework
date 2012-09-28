/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Build.Util
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2011-2012 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/
Uize.module({name:'UizeSite.Build.Util',required:'Uize.Build.Util',builder:function(){var _a=function(){};_a.getFirstTitleSegment=function(_b){return _b.match(/^\s*(.*?)\s*\|/)[1]};_a.getExamplesByKeyword=function(){var _c={};for(var _d= -1,_e=Uize.Build.Util.getHtmlFilesInfo('examples',_a.getFirstTitleSegment),_f=_e.length,_g,_h;++_d<_f;){if(_h=(_g=_e[_d]).keywords){var _i=_h.split(' ');for(var _j= -1,_k=_i.length,_l;++_j<_k;)(_c[_l=_i[_j]]||(_c[_l]=[])).push({title:_g.title,url:'../'+_g.path,description:_g.description});}}
return _c;};return _a;}});