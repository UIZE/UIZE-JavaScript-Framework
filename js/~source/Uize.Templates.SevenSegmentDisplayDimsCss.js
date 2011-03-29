/*
	This is an automatically generated module, compiled from the JavaScript template file:
		Uize.Templates.SevenSegmentDisplayDimsCss.js.jst
*/

/*ScruncherSettings Mappings="=" LineCompacting="TRUE"*/

Uize.module ({
	name:'Uize.Templates.SevenSegmentDisplayDimsCss',
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

					var
						_segmentThickness = input.segmentThickness,
						_displayWidth = input.displayWidth,
						_displayHeight = input.displayHeight,
						_segmentGap = input.segmentGap,
						_segmentThicknessDiv2 = _segmentThickness / 2,
						_segmentThicknessPlusSegmentGap = _segmentThickness + _segmentGap
					;

				output.push ('\r\n.sevenSeg {\r\n	width:',_displayWidth,'px;\r\n	height:',_displayHeight,'px;\r\n}\r\n.sevenSegSegmentEnd {\r\n	border-width:',_segmentThicknessDiv2,'px;\r\n}\r\n.sevenSegHorzSegment {\r\n	height:',_segmentThickness,'px;\r\n}\r\n.sevenSegHorzSegmentMiddle {\r\n	top:',_displayHeight / 2 - _segmentThicknessDiv2,'px;\r\n}\r\n.sevenSegSegmentLeftEnd {\r\n	left:',_segmentGap,'px;\r\n}\r\n.sevenSegHorzSegment .sevenSegSegmentBar {\r\n	left:',_segmentThicknessPlusSegmentGap,'px;\r\n	right:',_segmentThicknessPlusSegmentGap,'px;\r\n}\r\n.sevenSegSegmentRightEnd {\r\n	right:',_segmentGap,'px;\r\n}\r\n.sevenSegVertSegment {\r\n	width:',_segmentThickness,'px;\r\n}\r\n.sevenSegSegmentTopEnd {\r\n	top:',_segmentGap,'px;\r\n}\r\n.sevenSegVertSegment .sevenSegSegmentBar {\r\n	top:',_segmentThicknessPlusSegmentGap,'px;\r\n	bottom:',_segmentThicknessPlusSegmentGap,'px;\r\n}\r\n.sevenSegSegmentBottomEnd {\r\n	bottom:',_segmentGap,'px;\r\n}\r\n.sevenSegVertSegmentTop .sevenSegSegmentBottomEnd {\r\n	bottom:',_segmentGap - _segmentThicknessDiv2,'px;\r\n}\r\n.sevenSegVertSegmentTop  .sevenSegSegmentBar {\r\n	bottom:',_segmentGap + _segmentThicknessDiv2,'px;\r\n}\r\n.sevenSegVertSegmentBottom .sevenSegSegmentTopEnd {\r\n	top:',_segmentGap - _segmentThicknessDiv2,'px;\r\n}\r\n.sevenSegVertSegmentBottom  .sevenSegSegmentBar {\r\n	top:',_segmentGap + _segmentThicknessDiv2,'px;\r\n}\r\n\r\n');
				return output.join ('');
			};

		/*** Public Static Properties ***/
			_package.input = {
				segmentThickness:'integer',
				displayWidth:'integer',
				displayHeight:'integer',
				segmentGap:'integer'
			};

		return _package;
	}
});

