/*
	UIZE JAVASCRIPT FRAMEWORK 2012-01-10

	http://www.uize.com/reference/Uize.Templates.ColorInfo.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Templates.ColorInfo',builder:function(){var _a=function(){};_a.process=function(input){var output=[];output.push('<div id="',input.idPrefix,'" class="colorInfo">\r\n	<div id="',input.idPrefix,'-value" class="colorInfoTitle"></div>\r\n	<div id="',input.idPrefix,'-swatch" class="colorInfoSwatch"></div>\r\n	<div class="subheader">As a background</div>\r\n	<div id="',input.idPrefix,'-asBackground" class="colorInfoAsBg">\r\n		<span style="color:#fff;">white text</span>&nbsp;&nbsp;\r\n		<span style="color:#000;">black text</span>\r\n	</div>\r\n	<div class="subheader">As a text color</div>\r\n	<div id="',input.idPrefix,'-asForeground" class="colorInfoAsColor">\r\n		<div class="onWhite"></div>\r\n		<div class="onBlack"></div>\r\n		<div style="position:relative; width:100%;">on white&nbsp;&nbsp;&nbsp;&nbsp;on black</div>\r\n	</div>\r\n</div>\r\n\r\n');return output.join('');};_a.input={idPrefix:'string'};return _a;}});