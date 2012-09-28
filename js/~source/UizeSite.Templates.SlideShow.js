/*
	This is an automatically generated module, compiled from the JavaScript template file:
		UizeSite.Templates.SlideShow.js.jst
*/

Uize.module ({
	name:'UizeSite.Templates.SlideShow',
	builder:function () {
		var _package = function () {};

		/*** Public Static Methods ***/
			_package.process = function (input) {
				var output = [];
				output.push ('\r\n<table class="slideshow" cellspacing="0" cellpadding="0" style="margin:auto;">\r\n	<tr class="slideshowHeader" valign="top">\r\n		<td align="left">\r\n			<table border="0" cellspacing="0" cellpadding="0">\r\n				<tr valign="top">\r\n					<td><a id="',input .idPrefix,'_first" class="navButton" href="javascript://"><div class="arrow towardsFirst gotoFirst"></div></a></td>\r\n					<td><a id="',input .idPrefix,'_previous" class="navButton" href="javascript://"><div class="arrow towardsFirst gotoPrevious"></div></a></td>\r\n				</tr>\r\n			</table>\r\n		</td>\r\n		<td align="center">\r\n			<span id="',input .idPrefix,'-slide_title" class="slideshowTitle"></span><br/>\r\n			<span class="slideshowSubtitle">(<span id="',input .idPrefix,'-slideNumber"></span> of <span id="',input .idPrefix,'-totalSlides"></span>)</span>\r\n		</td>\r\n		<td align="right">\r\n			<table border="0" cellspacing="0" cellpadding="0">\r\n				<tr valign="top">\r\n					<td><a id="',input .idPrefix,'_next" class="navButton" href="javascript://"><div class="arrow towardsLast gotoNext"></div></a></td>\r\n					<td><a id="',input .idPrefix,'_last" class="navButton" href="javascript://"><div class="arrow towardsLast gotoLast"></div></a></td>\r\n				</tr>\r\n			</table>\r\n		</td>\r\n	</tr>\r\n	<tr>\r\n		<td colspan="3" align="center" valign="center">',input .viewHtml,'</td>\r\n	</tr>\r\n</table>\r\n\r\n');
				return output.join ('');
			};

		/*** Public Static Properties ***/
			_package.input = {
				idPrefix:'string',
				viewHtml:'string'
			};

		return _package;
	}
});

