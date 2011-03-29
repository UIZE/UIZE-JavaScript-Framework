/*
	This is an automatically generated module, compiled from the JavaScript template file:
		UizeDotCom.Templates.IndexPage.js.jst
*/

/*ScruncherSettings Mappings="=" LineCompacting="TRUE"*/

Uize.module ({
	name:'UizeDotCom.Templates.IndexPage',
	required:[
		'UizeDotCom.Templates.Footer'
	],
	builder:function () {
		var _package = function () {};

		/*** Public Static Methods ***/
			_package.process = function (input) {
				var output = [];
				output.push ('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">','\r\n<html xmlns="http://www.w3.org/1999/xhtml">\r\n<head>\r\n	<title>',input .title,' | UIZE JavaScript Framework</title>\r\n	<meta name="keywords" content="UIZE JavaScript Framework"/>\r\n	<meta name="description" content="',input .description,'"/>\r\n	<link rel="alternate" type="application/rss+xml" title="UIZE JavaScript Framework - Latest News" href="http://www.uize.com/latest-news.rss"/>\r\n	<link rel="stylesheet" href="css/page.css"/>\r\n	<link rel="stylesheet" href="css/page.simpledoc.css"/>\r\n	<link rel="stylesheet" href="css/page.index.css"/>\r\n</head>\r\n\r\n<body>\r\n\r\n<script type="text/javascript" src="js/Uize.js"></script>\r\n\r\n<h1 class="document-title">\r\n	<a id="page-homeLink" href="index.html" title="UIZE JavaScript Framework home"></a>\r\n	',input .title,'\r\n</h1>\r\n\r\n<div class="main">\r\n\r\n<div class="preamble">\r\n	',input .description,'\r\n	',input .extraPreambleContent,'\r\n</div>\r\n\r\n<ul id="page-index">');

					for (var _fileNo = -1, _files = input.files, _filesLength = _files.length; ++_fileNo < _filesLength;) {
						var _file = _files [_fileNo];

				output.push ('\r\n	<li>\r\n		<div class="itemTitle"><a href="',_file.path,'">',_file.title,'</a><span class="arrow">&nbsp;</span></div>\r\n		<div class="itemBody">');

							if (_file.imageSrc) {

				output.push ('<a href="',_file.path,'"><img src="',_file.imageSrc,'" class="fileThumbnail"/></a>');

							}

				output.push (_file.description,'</div>');

							if (_file.imageSrc) {

				output.push ('<br style="clear:both;"/>');

							}

				output.push ('\r\n	</li>');
				 }
				output.push ('\r\n</ul>\r\n\r\n</div>\r\n\r\n<script type="text/javascript">\r\n\r\nUize.module ({\r\n	required:[\r\n		\'UizeDotCom.Page.Doc.library\',\r\n		\'UizeDotCom.Page.Index\'\r\n	],\r\n	builder:function () {(window.page = new UizeDotCom.Page.Index).wireUi ()}\r\n});\r\n\r\n</script>\r\n\r\n</body></html>\r\n');
				return output.join ('');
			};

		/*** Public Static Properties ***/
			_package.input = {};

		return _package;
	}
});

