/*** boilerplate setup code for WSH build scripts ***/
	var _setupFile = new ActiveXObject ('Scripting.FileSystemObject').OpenTextFile ('_build-script-setup.js',1);
	eval (_setupFile.ReadAll ()) ();
	_setupFile.Close ();

Uize.module ({
	required:[
		'Uize.Wsh',
		'Uize.Wsh.BuildUtils',
		'UizeDotCom.Templates.WidgetToGoGadgetXml',
		'UizeDotCom.Templates.WidgetToGoPage',
		'UizeDotCom.Templates.WidgetToGoHomepage'
	],
	builder:function () {
		var _widgets = Uize.Wsh.BuildUtils.readSimpleDataFile ('widgets/widgets.simpledata').widgets;
		for (var _widgetNo = -1, _widgetsLength = _widgets.length; ++_widgetNo < _widgetsLength;) {
			var
				_widget = _widgets [_widgetNo],
				_widgetNameForUrls = _widget.title.toLowerCase (),
				_widgetFilesPathPrefix = 'widgets\\' + _widgetNameForUrls
			;

			/*** build widget's homepage ***/
				Uize.Wsh.writeFile ({
					path:_widgetFilesPathPrefix + '.html',
					text:UizeDotCom.Templates.WidgetToGoHomepage.process (_widget)
				});

			/*** build files in widget's folder ***/
				/*** build widget's Google Gadget XML file ***/
					Uize.Wsh.writeFile ({
						path:_widgetFilesPathPrefix + '\\gadget.xml',
						text:UizeDotCom.Templates.WidgetToGoGadgetXml.process (_widget)
					});
	
				/*** build widget's web.html page ***/
					Uize.Wsh.writeFile ({
						path:_widgetFilesPathPrefix + '\\web.html',
						text:UizeDotCom.Templates.WidgetToGoPage.process ({widget:_widget})
					});
	
				/*** build widget's mobile.html page ***/
					Uize.Wsh.writeFile ({
						path:_widgetFilesPathPrefix + '\\mobile.html',
						text:UizeDotCom.Templates.WidgetToGoPage.process ({widget:_widget,mobile:true})
					});
		}
	}
});

