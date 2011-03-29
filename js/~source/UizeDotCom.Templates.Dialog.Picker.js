/*
	This is an automatically generated module, compiled from the JavaScript template file:
		UizeDotCom.Templates.Dialog.Picker.js.jst
*/

/*ScruncherSettings Mappings="=" LineCompacting="TRUE"*/

Uize.module ({
	name:'UizeDotCom.Templates.Dialog.Picker',
	required:[
		'UizeDotCom.Templates.Dialog',
		'Uize.Templates.Calendar'
	],
	builder:function () {
		var _package = function () {};

		/*** Public Static Methods ***/
			_package.process = function (input) {
				var output = [];
				output.push ('\r\n',UizeDotCom.Templates.Dialog.process ({
						idPrefix:input.idPrefix,
						title:input.title,
						contents:input.contents,
						topLeftButtons:'<a id="' + input.idPrefix + '_keepOpen" class="dialogKeepOpenButton" title="Toggle Keep Open"></a>',
						dialogClass:'dialogPalette'
					}),'\r\n');
				return output.join ('');
			};

		/*** Public Static Properties ***/
			_package.input = {
				idPrefix:'string',
				title:'string',
				contents:'string'
			};

		return _package;
	}
});

