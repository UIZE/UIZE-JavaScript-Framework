/*
	UIZE Web Site 2012-01-10

	http://www.uize.com/reference/UizeDotCom.Templates.SlideShow.Basic.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'UizeDotCom.Templates.SlideShow.Basic',required:['UizeDotCom.Templates.SlideShow'],builder:function(){var _a=function(){};_a.process=function(input){var output=[];function viewHtml(){var output=[];output.push('\r\n<img id="',input.idPrefix,'-slide_image" width="',input.width,'" height="',input.height,'" src="../images/blank.gif" alt=""/>');return output.join('');}output.push('\r\n',UizeDotCom.Templates.SlideShow.process({idPrefix:input.idPrefix,viewHtml:viewHtml()}),'\r\n');return output.join('');};_a.input={idPrefix:'string',width:'number',height:'number'};return _a;}});