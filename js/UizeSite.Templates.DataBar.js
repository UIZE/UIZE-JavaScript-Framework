/*
	This is an automatically generated module, compiled from the JavaScript template file:
		UizeSite.Templates.DataBar.js.jst
*/
Uize.module({name:'UizeSite.Templates.DataBar',builder:function(){var _a=function(){};_a.process=function(input){var output=[];output.push('\r\n<div class="dataBar">\r\n	<div id="',input.idPrefix,'-track" class="dataBarTrack">\r\n		<div id="',input.idPrefix,'-full" class="dataBarTrackFull"></div>\r\n		<div id="',input.idPrefix,'-empty" class="dataBarTrackEmpty"></div>\r\n		<div id="',input.idPrefix,'-knob" class="dataBarKnob"><span id="',input.idPrefix,'-value"></span>',input.unit,'</div>\r\n	</div>\r\n</div>\r\n\r\n');return output.join('');};_a.input={idPrefix:'string',unit:'string'};return _a;}});