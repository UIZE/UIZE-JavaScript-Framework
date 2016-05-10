/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.Buttons.Share.LinkedIn.Widget Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2015-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 1
	codeCompleteness: 5
	docCompleteness: 5
*/

/*?
	Introduction
		The =Uize.Widgets.Buttons.Share.LinkedIn.Widget= module implements a widget class.

		*DEVELOPERS:* `Chris van Rensburg`

		Visual Sampler
			Below is a visual sampler of the =Uize.Widgets.Buttons.Share.LinkedIn.Widget= class...

			..............................................................
			<< widget >>

			widgetClass: Uize.Widgets.Buttons.Share.LinkedIn.VisualSampler
			..............................................................
*/

Uize.module ({
	name:'Uize.Widgets.Buttons.Share.LinkedIn.Widget',
	superclass:'Uize.Widgets.Buttons.Share.Widget',
	required:[
		'Uize.Widgets.Buttons.Share.LinkedIn.Css',
		'Uize.Url'
	],
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			staticProperties:{
				cssModule:Uize.Widgets.Buttons.Share.LinkedIn.Css,
				shareVia:'LinkedIn'
			},

			instanceMethods:{
				getShareUrl:function (_pageInfo) {
					return [
						'http://www.linkedin.com/shareArticle',
						{
							mini:true,
							title:_pageInfo.title,
							url:_pageInfo.url,
							summary:_pageInfo.description,
							source:Uize.Url.from (_pageInfo.url).hostname
						}
					];
				}
			}
		});
	}
});

