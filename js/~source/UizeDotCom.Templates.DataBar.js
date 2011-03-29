/*
	This is an automatically generated module, compiled from the JavaScript template file:
		UizeDotCom.Templates.DataBar.js.jst
*/

/*ScruncherSettings Mappings="=" LineCompacting="TRUE"*/

Uize.module ({
	name:'UizeDotCom.Templates.DataBar',
	builder:function () {
		var _package = function () {};

		/*** Public Static Methods ***/
			_package.process = function (input) {
				var output = [];
				output.push ('\r\n<div class="dataBar">\r\n	<div id="',input .idPrefix,'-track" class="dataBarTrack">\r\n		<div id="',input .idPrefix,'-full" class="dataBarTrackFull"></div>\r\n		<div id="',input .idPrefix,'-empty" class="dataBarTrackEmpty"></div>\r\n		<div id="',input .idPrefix,'-knob" class="dataBarKnob"><span id="',input .idPrefix,'-value"></span>',input .unit,'</div>\r\n	</div>\r\n</div>\r\n\r\n');
				return output.join ('');
			};

		/*** Public Static Properties ***/
			_package.input = {
				idPrefix:'string',
				unit:'string'
			};

		return _package;
	}
});

