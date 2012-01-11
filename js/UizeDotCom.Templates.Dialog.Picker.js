/*
	UIZE Web Site 2012-01-10

	http://www.uize.com/reference/UizeDotCom.Templates.Dialog.Picker.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'UizeDotCom.Templates.Dialog.Picker',required:['UizeDotCom.Templates.Dialog','Uize.Templates.Calendar'],builder:function(){var _a=function(){};_a.process=function(input){var output=[];output.push('\r\n',UizeDotCom.Templates.Dialog.process({idPrefix:input.idPrefix,title:input.title,contents:input.contents,topLeftButtons:'<a id="'+input.idPrefix+'_keepOpen" class="dialogKeepOpenButton" title="Toggle Keep Open"></a>',dialogClass:'dialogPalette'}),'\r\n');return output.join('');};_a.input={idPrefix:'string',title:'string',contents:'string'};return _a;}});