/*
	This is an automatically generated module, compiled from the JavaScript template file:
		UizeDotCom.Templates.SlideShow.Wipes.js.jst
*/

/*ScruncherSettings Mappings="=" LineCompacting="TRUE"*/

Uize.module ({
	name:'UizeDotCom.Templates.SlideShow.Wipes',
	required:[
		'UizeDotCom.Templates.SlideShow'
	],
	builder:function () {
		var _package = function () {};

		/*** Public Static Methods ***/
			_package.process = function (input) {
				var output = [];
				function viewHtml () {var output = [];
				output.push ('\r\n<div id="',input .idPrefix,'_slideImage" style="position:relative; left:0px; top:0px; width:',input .width,'px; height:',input .height,'px; background:#000;">');
				return output.join ('');}
				output.push ('\r\n',UizeDotCom.Templates.SlideShow.process ({idPrefix:input.idPrefix,viewHtml:viewHtml ()}),'\r\n');
				return output.join ('');
			};

		/*** Public Static Properties ***/
			_package.input = {
				idPrefix:'string',
				width:'number',
				height:'number'
			};

		return _package;
	}
});

