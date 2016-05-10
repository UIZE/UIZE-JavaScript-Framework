/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widgets.ShareStrip.Widget Class
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
		The =Uize.Widgets.ShareStrip.Widget= module implements an abstract base class for share strip widget classes.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widgets.ShareStrip.Widget',
	superclass:'Uize.Widget.V2',
	required:[
		'Uize.Widgets.ShareStrip.Html',
		'Uize.Widgets.ShareStrip.Css',
		'Uize.Widgets.Buttons.Share.Twitter.Widget',
		'Uize.Widgets.Buttons.Share.Facebook.Widget',
		'Uize.Widgets.Buttons.Share.StumbleUpon.Widget',
		'Uize.Widgets.Buttons.Share.Reddit.Widget',
		'Uize.Widgets.Buttons.Share.Digg.Widget',
		'Uize.Widgets.Buttons.Share.Delicious.Widget',
		'Uize.Widgets.Buttons.Share.LinkedIn.Widget',
		'Uize.Widgets.Buttons.Share.GoogleBookmarks.Widget',
		'Uize.Widgets.Buttons.Share.Email.Widget',
	],
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			children:{
				shareViaTwitter:{widgetClass:Uize.Widgets.Buttons.Share.Twitter.Widget},
				shareViaFacebook:{widgetClass:Uize.Widgets.Buttons.Share.Facebook.Widget},
				shareViaStumbleUpon:{widgetClass:Uize.Widgets.Buttons.Share.StumbleUpon.Widget},
				shareViaReddit:{widgetClass:Uize.Widgets.Buttons.Share.Reddit.Widget},
				shareViaDigg:{widgetClass:Uize.Widgets.Buttons.Share.Digg.Widget},
				shareViaDelicious:{widgetClass:Uize.Widgets.Buttons.Share.Delicious.Widget},
				shareViaLinkedIn:{widgetClass:Uize.Widgets.Buttons.Share.LinkedIn.Widget},
				shareViaGoogleBookmarks:{widgetClass:Uize.Widgets.Buttons.Share.GoogleBookmarks.Widget},
				shareViaEmail:{widgetClass:Uize.Widgets.Buttons.Share.Email.Widget},
			},

			stateProperties:{
				comprehensive:{
					value:true
				}
			},

			set:{
				html:Uize.Widgets.ShareStrip.Html
			},

			staticProperties:{
				cssModule:Uize.Widgets.ShareStrip.Css
			},

			htmlBindings:{
				comprehensive:[
					'shareViaLinkedIn:show',
					'shareViaGoogleBookmarks:show'
				]
			}
		});
	}
});

