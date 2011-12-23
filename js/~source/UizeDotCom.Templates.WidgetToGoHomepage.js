/*
	This is an automatically generated module, compiled from the JavaScript template file:
		UizeDotCom.Templates.WidgetToGoHomepage.js.jst
*/

/*ScruncherSettings Mappings="=" LineCompacting="TRUE"*/

Uize.module ({
	name:'UizeDotCom.Templates.WidgetToGoHomepage',
	required:[
		'Uize.Xml',
		'Uize.String'
	],
	builder:function () {
		var _package = function () {};

		/*** Public Static Methods ***/
			_package.process = function (input) {
				var output = [];

					var
						_widgetName = input.title.toLowerCase (),
						_widgetNameForUrl = _widgetName.replace (/\s+/g,'-'),
						_description = input.description.short || 'This is the homepage for the ' + input.title + ' widget of the UIZE JavaScript Framework.'
					;

				output.push ('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\n<html xmlns="http://www.w3.org/1999/xhtml">\n<head>\n	<title>',input .title,' | Widgets | UIZE JavaScript Framework</title>\n	<meta name="keywords" content="',_widgetName,' widget embed blog iframe bookmarklet"/>\n	<meta name="description" content="',Uize.Xml.toAttributeValue (_description),'"/>\n	<link rel="alternate" type="application/rss+xml" title="UIZE JavaScript Framework - Latest News" href="http://www.uize.com/latest-news.rss"/>\n	\n	<!-- for Facebook Share (http://wiki.developers.facebook.com/index.php/Facebook_Share/Specifying_Meta_Tags) -->\n		<meta name="title" content="',_widgetName,'"/>\n		<link rel="image_src" href="../images/widgets/',_widgetNameForUrl,'-96x96.gif"/>\n\n	<link rel="stylesheet" href="../css/page.css"/>\n	<link rel="stylesheet" href="../examples/css/params-table.css"/>\n	<link rel="stylesheet" href="../css/page.widgethomepage.css"/>\n</head>\n\n<body>\n\n<script type="text/javascript" src="../js/Uize.js"></script>\n\n<h1 class="document-title">\n	<a id="page-homeLink" href="../index.html" title="UIZE JavaScript Framework home"></a>\n	<a href="../javascript-widgets.html" class="breadcrumb breadcrumbWithArrow">WIDGETS</a>\n	',input .title,'\n</h1>\n\n');

					var
						_dimensions = input.dimensions,
						_webWidth = _dimensions.webWidth,
						_webHeight = _dimensions.webHeight,
						_widgetWebUrl = 'http://www.uize.com/widgets/' + _widgetNameForUrl + '/web.html'
					;

				output.push ('<div class="main">\n	<div class="preamble">\n		',_description,'\n	</div>\n\n	<div class="widgetInfoPane">\n		<ul class="featuresList">',Uize.String.hugJoin (input.features,'\t\t\t<li>','</li>\n'),'</ul>\n\n		<p>This widget is built using the <a href="../reference/',input .widgetClassModule,'.html">',input .widgetClassModule,'</a> module of the UIZE JavaScript Framework. To see more JavaScript examples, view the <a href="../javascript-examples.html">Javascript Examples</a> index page.</p>\n\n		');
				 /*
				output.push ('<p>To see the ??? widget in action, view the <a href="../examples/???.html">???</a> example.</p>');
				 */
				output.push ('\n	</div>\n\n	<div class="widgetPreviewPane">\n		<iframe src="',_widgetNameForUrl,'/web.html" style="width:',_webWidth,'px; height:',_webHeight,'px;" scrolling="no" frameborder="0" allowtransparency="true" class="widgetPreviewIframe"></iframe>\n\n		<table class="paramsTable">\n			<tr>\n				<td class="fieldLabel">EMBED</td>\n				<td><input type="text" value="',Uize.Xml.toAttributeValue (('<iframe src="' + _widgetWebUrl + '" style="width:' + _webWidth + 'px; height:' + _webHeight + 'px;" scrolling="no" frameborder="0" allowtransparency="true"></iframe>')),'" readonly="readonly"/></td>\n			</tr>\n			<tr>\n				<td class="fieldLabel">BOOKMARKLET</td>\n				<td><a href="javascript:window.open(\'',_widgetWebUrl,'\',\'',_widgetName,'\',\'width=',_webWidth,',%20height=',_webHeight,',toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no\').focus(),undefined;">',input .title.toUpperCase (),'</a></a></td>\n			</tr>\n		</table>\n\n		<a href="../javascript-widgets.html" class="buttonLink seeMoreWidgetsButton">SEE MORE WIDGETS</a>\n	</div>\n\n	<br style="clear:left;"/>\n</div>\n\n<script type="text/javascript">\n\nUize.module ({\n	required:[\n		\'UizeDotCom.Page.library\',\n		\'UizeDotCom.Page\'\n	],\n	builder:function () {(window.page = UizeDotCom.Page ()).wireUi ()}\n});\n\n</script>\n\n</body></html>\n\n');
				return output.join ('');
			};

		/*** Public Static Properties ***/
			_package.input = {
				title:'string',
				urls:'object',
				dimensions:'object',
				description:'object',
				author:'object',
				images:'object'
			};

		return _package;
	}
});

