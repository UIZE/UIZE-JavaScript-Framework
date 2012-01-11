/*
	UIZE JAVASCRIPT FRAMEWORK 2012-01-10

	http://www.uize.com/reference/Uize.Templates.HashTable.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Templates.HashTable',builder:function(){var _a=function(){};_a.process=function(input){var output=[];output.push('<table class="hashTable" cellspacing="1">');var propertiesToIgnore={idPrefix:1,pathToResources:1,blankGif:1};for(var inputParamName in input){if(!propertiesToIgnore[inputParamName]){output.push('\r\n	<tr valign="top"><td class="hashTableKey">',inputParamName,'</td><td class="hashTableValue">',input[inputParamName],'</td></tr>');}}output.push('\r\n</table>\r\n\r\n');return output.join('');};_a.input={};return _a;}});