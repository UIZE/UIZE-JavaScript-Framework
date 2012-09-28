/*
	This is an automatically generated module, compiled from the JavaScript template file:
		UizeSite.Templates.SlideShow.Wipes.js.jst
*/
Uize.module({name:'UizeSite.Templates.SlideShow.Wipes',required:['UizeSite.Templates.SlideShow'],builder:function(){var _a=function(){};_a.process=function(input){var output=[];function viewHtml(){var output=[];output.push('\r\n<div id="',input.idPrefix,'_slideImage" style="position:relative; left:0px; top:0px; width:',input.width,'px; height:',input.height,'px; background:#000;">');return output.join('');}output.push('\r\n',UizeSite.Templates.SlideShow.process({idPrefix:input.idPrefix,viewHtml:viewHtml()}),'\r\n');return output.join('');};_a.input={idPrefix:'string',width:'number',height:'number'};return _a;}});