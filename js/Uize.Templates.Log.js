/*
	UIZE JAVASCRIPT FRAMEWORK 2012-01-10

	http://www.uize.com/reference/Uize.Templates.Log.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Templates.Log',builder:function(){var _a=function(){};_a.process=function(input){var output=[];output.push('<div id="',input.idPrefix,'" class="log">\r\n	<div class="logHeading">\r\n		<span>',input.title,'</span>\r\n		<a id="',input.idPrefix,'_clear" href="javascript://" class="logClearButton button">clear</a>\r\n	</div>\r\n	<div id="',input.idPrefix,'-messages" class="logMessages"></div>\r\n</div>\r\n\r\n');return output.join('');};_a.input={idPrefix:'string',title:'string'};return _a;}});