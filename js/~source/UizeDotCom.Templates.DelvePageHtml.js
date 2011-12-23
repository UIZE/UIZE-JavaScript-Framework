/*
	This is an automatically generated module, compiled from the JavaScript template file:
		UizeDotCom.Templates.DelvePageHtml.js.jst
*/

/*ScruncherSettings Mappings="=" LineCompacting="TRUE"*/

Uize.module ({
	name:'UizeDotCom.Templates.DelvePageHtml',
	required:[
		'Uize.Url',
		'Uize.Json'
	],
	builder:function () {
		var _package = function () {};

		/*** Public Static Methods ***/
			_package.process = function (input) {
				var output = [];

					var _baseUrl = Uize.Url.from (input.pathToResources).fullDomain;

				output.push ('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\r\n<html xmlns="http://www.w3.org/1999/xhtml">\r\n<head>\r\n	<title>DELVE</title>\r\n	<base href="',_baseUrl,'"/>\r\n	<link rel="stylesheet" href="css/page.css"/>\r\n	<link rel="stylesheet" href="css/widget.datatable.css"/>\r\n	<link rel="stylesheet" href="css/widget.tabs.css"/>\r\n	<link rel="stylesheet" href="css/page.delve.css"/>\r\n	<link rel="stylesheet" href="css/widget.hashtable.css"/>\r\n</head>\r\n\r\n<body>\r\n\r\n<script type="text/javascript" src="',input.pathToResources,'Uize.js"></script>\r\n\r\n<script type="text/javascript">\r\n\r\nUize.module ({\r\n	required:[\r\n		\'UizeDotCom.Delve.library\',\r\n		\'UizeDotCom.Templates.DelveUiHtml\',\r\n		\'Uize.Node\',\r\n		\'UizeDotCom.Delve\'\r\n	],\r\n	builder:function () {\r\n		/*** inject the guts of the page ***/\r\n			Uize.Node.injectHtml (document.body,UizeDotCom.Templates.DelveUiHtml.process ());\r\n\r\n		/*** create the example page widget ***/\r\n			var _page = window.page = UizeDotCom.Delve ({baseUrl:',Uize.Json.to (_baseUrl),',window:top.opener});\r\n\r\n		/*** wire up the page widget ***/\r\n			_page.wireUi ();\r\n	}\r\n});\r\n\r\n</script>\r\n\r\n</body>\r\n</html>\r\n\r\n');
				return output.join ('');
			};

		/*** Public Static Properties ***/
			_package.input = {
				pathToResources:'string'
			};

		return _package;
	}
});

