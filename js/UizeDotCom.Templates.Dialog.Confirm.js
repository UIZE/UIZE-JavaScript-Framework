/*
	UIZE Web Site 2012-01-10

	http://www.uize.com/reference/UizeDotCom.Templates.Dialog.Confirm.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'UizeDotCom.Templates.Dialog.Confirm',required:['UizeDotCom.Templates.Dialog'],builder:function(){var _a=function(){};_a.process=function(input){var output=[];function dialogContents(){var output=[];output.push('\r\n			<table>\r\n				<tr>\r\n					<td><div class="dialogIcon dialogConfirmIcon" id="',input.idPrefix,'-icon">&nbsp;</div></td>\r\n					<td><div id="',input.idPrefix,'-message" class="dialogMessage">',input.message||'','</div></td>\r\n				</tr>\r\n			</table>');return output.join('');}output.push('\r\n',UizeDotCom.Templates.Dialog.process({idPrefix:input.idPrefix,title:input.title,contents:dialogContents()}),'\r\n');return output.join('');};_a.input={idPrefix:'string',message:'string',title:'string'};return _a;}});