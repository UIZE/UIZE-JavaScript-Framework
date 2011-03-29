/*
	This is an automatically generated module, compiled from the JavaScript template file:
		Uize.Templates.SevenSegmentDisplay.js.jst
*/

/*ScruncherSettings Mappings="=" LineCompacting="TRUE"*/

Uize.module ({
	name:'Uize.Templates.SevenSegmentDisplay',
	builder:function () {
		var _package = function () {};

		/*** Public Static Methods ***/
			_package.process = function (input) {
				var output = [];
				/* Module Meta Data
					type: Template
					importance: 1
					codeCompleteness: 100
					testCompleteness: 0
					docCompleteness: 100
				*/
				output.push ('<div id="',input .idPrefix,'" class="sevenSeg">\r\n	<div id="',input .idPrefix,'-segmentA" class="sevenSegSegment sevenSegHorzSegment sevenSegHorzSegmentTop sevenSegSegmentOff">\r\n		<div class="sevenSegSegmentEnd sevenSegSegmentLeftEnd"></div>\r\n		<div class="sevenSegSegmentBar"></div>\r\n		<div class="sevenSegSegmentEnd sevenSegSegmentRightEnd"></div>\r\n	</div>\r\n	<div id="',input .idPrefix,'-segmentB" class="sevenSegSegment sevenSegVertSegment sevenSegVertSegmentRight sevenSegVertSegmentTop sevenSegSegmentOff">\r\n		<div class="sevenSegSegmentEnd sevenSegSegmentTopEnd"></div>\r\n		<div class="sevenSegSegmentBar"></div>\r\n		<div class="sevenSegSegmentEnd sevenSegSegmentBottomEnd"></div>\r\n	</div>\r\n	<div id="',input .idPrefix,'-segmentC" class="sevenSegSegment sevenSegVertSegment sevenSegVertSegmentRight sevenSegVertSegmentBottom sevenSegSegmentOff">\r\n		<div class="sevenSegSegmentEnd sevenSegSegmentTopEnd"></div>\r\n		<div class="sevenSegSegmentBar"></div>\r\n		<div class="sevenSegSegmentEnd sevenSegSegmentBottomEnd"></div>\r\n	</div>\r\n	<div id="',input .idPrefix,'-segmentD" class="sevenSegSegment sevenSegHorzSegment sevenSegHorzSegmentBottom sevenSegSegmentOff">\r\n		<div class="sevenSegSegmentEnd sevenSegSegmentLeftEnd"></div>\r\n		<div class="sevenSegSegmentBar"></div>\r\n		<div class="sevenSegSegmentEnd sevenSegSegmentRightEnd"></div>\r\n	</div>\r\n	<div id="',input .idPrefix,'-segmentE" class="sevenSegSegment sevenSegVertSegment sevenSegVertSegmentLeft sevenSegVertSegmentBottom sevenSegSegmentOff">\r\n		<div class="sevenSegSegmentEnd sevenSegSegmentTopEnd"></div>\r\n		<div class="sevenSegSegmentBar"></div>\r\n		<div class="sevenSegSegmentEnd sevenSegSegmentBottomEnd"></div>\r\n	</div>\r\n	<div id="',input .idPrefix,'-segmentF" class="sevenSegSegment sevenSegVertSegment sevenSegVertSegmentLeft sevenSegVertSegmentTop sevenSegSegmentOff">\r\n		<div class="sevenSegSegmentEnd sevenSegSegmentTopEnd"></div>\r\n		<div class="sevenSegSegmentBar"></div>\r\n		<div class="sevenSegSegmentEnd sevenSegSegmentBottomEnd"></div>\r\n	</div>\r\n	<div id="',input .idPrefix,'-segmentG" class="sevenSegSegment sevenSegHorzSegment sevenSegHorzSegmentMiddle sevenSegSegmentOff">\r\n		<div class="sevenSegSegmentEnd sevenSegSegmentLeftEnd"></div>\r\n		<div class="sevenSegSegmentBar"></div>\r\n		<div class="sevenSegSegmentEnd sevenSegSegmentRightEnd"></div>\r\n	</div>\r\n</div>\r\n\r\n');
				return output.join ('');
			};

		/*** Public Static Properties ***/
			_package.input = {
				idPrefix:'string'
			};

		return _package;
	}
});

