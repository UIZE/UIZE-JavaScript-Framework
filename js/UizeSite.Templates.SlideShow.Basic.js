/*
	This is an automatically generated module, compiled from the JavaScript template file:
		UizeSite.Templates.SlideShow.Basic.js.jst
*/
Uize.module({name:'UizeSite.Templates.SlideShow.Basic',required:['UizeSite.Templates.SlideShow'],builder:function(){var _a=function(){};_a.process=function(input){var output=[];function viewHtml(){var output=[];output.push('\r\n<img id="',input.idPrefix,'-slide_image" width="',input.width,'" height="',input.height,'" src="../images/blank.gif" alt=""/>');return output.join('');}output.push('\r\n',UizeSite.Templates.SlideShow.process({idPrefix:input.idPrefix,viewHtml:viewHtml()}),'\r\n');return output.join('');};_a.input={idPrefix:'string',width:'number',height:'number'};return _a;}});