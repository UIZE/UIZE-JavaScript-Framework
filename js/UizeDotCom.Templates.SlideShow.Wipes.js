/*
	UIZE Web Site 2012-01-10

	http://www.uize.com/reference/UizeDotCom.Templates.SlideShow.Wipes.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'UizeDotCom.Templates.SlideShow.Wipes',required:['UizeDotCom.Templates.SlideShow'],builder:function(){var _a=function(){};_a.process=function(input){var output=[];function viewHtml(){var output=[];output.push('\r\n<div id="',input.idPrefix,'_slideImage" style="position:relative; left:0px; top:0px; width:',input.width,'px; height:',input.height,'px; background:#000;">');return output.join('');}output.push('\r\n',UizeDotCom.Templates.SlideShow.process({idPrefix:input.idPrefix,viewHtml:viewHtml()}),'\r\n');return output.join('');};_a.input={idPrefix:'string',width:'number',height:'number'};return _a;}});