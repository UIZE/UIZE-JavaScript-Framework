/*
	UIZE Web Site 2012-01-10

	http://www.uize.com/reference/UizeDotCom.Templates.WidgetToGoTitle.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'UizeDotCom.Templates.WidgetToGoTitle',builder:function(){var _a=function(){};_a.process=function(input){var output=[];
output.push('<div class="widgetHeader">\r\n	<div id="',input.idPrefix,'_menu_selector" title="Click to show/hide widget options..." class="widgetTitle">\r\n		<div class="logo"></div>\r\n		<div class="textShadow">',input.title,'</div>\r\n		<div class="textHighlight">',input.title,'</div>\r\n		<div class="textMain">',input.title,'</div>\r\n	</div>\r\n	<div id="',input.idPrefix,'_menu-palette" class="subMenuShell">\r\n		<a id="',input.idPrefix,'_menu-getThisWidget" href="javascript://" class="subMenuItem">GET THIS WIDGET</a>\r\n		<div class="divider"></div>\r\n		<a id="',input.idPrefix,'_menu-aboutThisWidget" href="javascript://" class="subMenuItem">About This Widget</a>\r\n		<a id="',input.idPrefix,'_menu-openInNewWindow" href="javascript://" class="subMenuItem">Open Widget in New Window</a>\r\n		<div class="divider"></div>\r\n		<a id="',input.idPrefix,'_menu-moreWidgets"  href="javascript://" class="subMenuItem">More UIZE Widgets...</a>\r\n		<a id="',input.idPrefix,'_menu-uize" href="javascript://" class="subMenuItem">UIZE JavaScript Framework</a>\r\n	</div>\r\n</div>\r\n\r\n');
return output.join('');};_a.input={idPrefix:'string',title:'string'};return _a;}});