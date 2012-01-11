/*
	UIZE JAVASCRIPT FRAMEWORK 2012-01-10

	http://www.uize.com/reference/Uize.Wsh.UpdateCopyrightNotices.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Wsh.UpdateCopyrightNotices',required:'Uize.Wsh.AutoScruncher',builder:function(){var _a=function(){};var _b=/\(c\)\s*\d{4}(?:\s*-\s*(\d{4}))?/i,_c=/(-\s*)(\d{4})/;_a.perform=function(_d){var _e=(new Date).getFullYear();Uize.Wsh.buildFiles(Uize.copyInto({targetFolderPathCreator:function(_f){return _f;},targetFilenameCreator:function(_g){return/\.(js|jst)$/.test(_g)?_g:null;},fileBuilder:function(_g,_h){var _i=_h.match(_b);if(_i){var _j=_i[0],_k=_j.match(_c),_l=_k?_j.replace(_c,'$1'+_e):_j+'-'+_e,_m=_h.replace(_j,_l);}return(_i&&_m!=_h?{outputText:_m,logDetails:'\t\tCopyright Notice Updated:\n'+'\t\t\tWAS: '+_j+'\n'+'\t\t\tNOW: '+_l+'\n'}:{logDetails:'\t\tFILE ALREADY OK\n'});}},_d,{alwaysBuild:true}));};return _a;}});