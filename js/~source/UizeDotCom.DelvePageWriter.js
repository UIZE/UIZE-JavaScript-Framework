/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeDotCom.DelvePageWriter
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2011 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*ScruncherSettings Mappings="=" LineCompacting="TRUE"*/

/*?
	Introduction
		document...

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'UizeDotCom.DelvePageWriter',
	required:[
		'Uize.Node',
		'UizeDotCom.Templates.DelvePageHtml'
	],
	builder:function () {
		var _package = function () {};

		/*** Public Static Methods ***/
			_package.initialize = function () {
				Uize.Node.setStyle (document.body,{margin:0});
				var
					_html = UizeDotCom.Templates.DelvePageHtml.process ({
						pathToResources:Uize.pathToResources
					}),
					_srcAttributeValue = 'javascript:\'' + encodeURIComponent (_html.replace (/'/g,'\\\'').replace (/\r|\n|\r\n/g,'')) + '\''
				;
				Uize.Node.injectHtml (
					document.body,
					'<iframe src="' + _srcAttributeValue + '" frameborder="0" style="width:100%; height:100%; border:0;"></iframe>'
				);
			};

		return _package;
	}
});

