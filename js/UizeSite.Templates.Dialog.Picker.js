/*
	This is an automatically generated module, compiled from the JavaScript template file:
		UizeSite.Templates.Dialog.Picker.js.jst
*/
Uize.module({name:'UizeSite.Templates.Dialog.Picker',required:['UizeSite.Templates.Dialog','Uize.Templates.Calendar'],builder:function(){var _a=function(){};_a.process=function(input){var output=[];output.push('\r\n',UizeSite.Templates.Dialog.process({idPrefix:input.idPrefix,title:input.title,contents:input.contents,topLeftButtons:'<a id="'+input.idPrefix+'_keepOpen" class="dialogKeepOpenButton" title="Toggle Keep Open"></a>',dialogClass:'dialogPalette'}),'\r\n');return output.join('');};_a.input={idPrefix:'string',title:'string',contents:'string'};return _a;}});