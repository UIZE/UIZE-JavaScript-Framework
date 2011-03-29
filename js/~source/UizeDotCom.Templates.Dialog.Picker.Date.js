/*
	This is an automatically generated module, compiled from the JavaScript template file:
		UizeDotCom.Templates.Dialog.Picker.Date.js.jst
*/

/*ScruncherSettings Mappings="=" LineCompacting="TRUE"*/

Uize.module ({
	name:'UizeDotCom.Templates.Dialog.Picker.Date',
	required:[
		'UizeDotCom.Templates.Dialog.Picker',
		'Uize.Templates.Calendar'
	],
	builder:function () {
		var _package = function () {};

		/*** Public Static Methods ***/
			_package.process = function (input) {
				var output = [];
				output.push ('\r\n',UizeDotCom.Templates.Dialog.Picker.process ({
						idPrefix:input.idPrefix,
						title:input.title,
						contents:Uize.Templates.Calendar.process ({idPrefix:input.idPrefix + '_value'})
					}),'\r\n');
				return output.join ('');
			};

		/*** Public Static Properties ***/
			_package.input = {
				idPrefix:'string',
				title:'string'
			};

		return _package;
	}
});

