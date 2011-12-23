/*
	This is an automatically generated module, compiled from the JavaScript template file:
		UizeDotCom.Templates.WidgetToGoPage.js.jst
*/

/*ScruncherSettings Mappings="=" LineCompacting="TRUE"*/

Uize.module ({
	name:'UizeDotCom.Templates.WidgetToGoPage',
	required:[
		'Uize.Xml',
		'Uize.Json'
	],
	builder:function () {
		var _package = function () {};

		/*** Public Static Methods ***/
			_package.process = function (input) {
				var output = [];

					var
						_widget = input.widget,
						_widgetName = _widget.title.toLowerCase ()
					;

				output.push ('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\r\n<html xmlns="http://www.w3.org/1999/xhtml">\r\n<head>\r\n	<title>',Uize.Xml.toAttributeValue (_widget.title),'</title>');
				 if (input.mobile) {
				output.push ('\r\n	<meta name="viewport" content="width=320; initial-scale=1.0; maximum-scale=1.0; user-scalable=0;"/>');
				 }
				output.push ('\r\n	<link rel="stylesheet" href="../../css/page.css"/>\r\n	<link rel="stylesheet" href="../../css/page.widget.css"/>');
				 if (input.mobile) {
				output.push ('\r\n	<link rel="stylesheet" href="../../css/page.widget.mobile.css"/>');
				 }
				output.push ('\r\n	<link rel="stylesheet" href="../../css/widget.',_widgetName,'.css"/>\r\n	<link rel="stylesheet" href="../../css/widget.',_widgetName,'.widgetstogo.css"/>');
				 if (input.mobile) {
				output.push ('\r\n	<link rel="stylesheet" href="../../css/widget.',_widgetName,'.widgetstogo.mobile.css"/>');
				 }
				output.push ('\r\n</head>\r\n\r\n<body>\r\n\r\n<script type="text/javascript" src="../../js/Uize.js"></script>\r\n\r\n<script type="text/javascript">\r\n\r\nUize.module ({\r\n	required:[\r\n		\'UizeDotCom.WidgetToGoPage.',Uize.capFirstChar (_widgetName),'.library\',\r\n		\'UizeDotCom.WidgetToGoPage\'\r\n	],\r\n	builder:function () {\r\n		(\r\n			window.page = UizeDotCom.WidgetToGoPage ({\r\n				title:',Uize.Json.to (_widget.title),',\r\n				widgetToGoClass:',Uize.Json.to (_widget.widgetClassModule),',\r\n				widgetToGoHtml:',Uize.Json.to (_widget.widgetTemplateModule),'\r\n			})\r\n		).wireUi ();\r\n	}\r\n});\r\n\r\n</script>\r\n\r\n</body>\r\n</html>\r\n\r\n');
				return output.join ('');
			};

		/*** Public Static Properties ***/
			_package.input = {
				widget:'object',
				mobile:'boolean'
			};

		return _package;
	}
});

