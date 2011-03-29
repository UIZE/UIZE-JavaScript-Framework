/*
	This is an automatically generated module, compiled from the JavaScript template file:
		UizeDotCom.Templates.SlideShow.Basic.js.jst
*/

/*ScruncherSettings Mappings="=" LineCompacting="TRUE"*/

Uize.module ({
	name:'UizeDotCom.Templates.SlideShow.Basic',
	required:[
		'UizeDotCom.Templates.SlideShow'
	],
	builder:function () {
		var _package = function () {};

		/*** Public Static Methods ***/
			_package.process = function (input) {
				var output = [];
				function viewHtml () {var output = [];
				output.push ('\r\n<img id="',input .idPrefix,'-slide_image" width="',input .width,'" height="',input .height,'" src="../images/blank.gif" alt=""/>');
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

