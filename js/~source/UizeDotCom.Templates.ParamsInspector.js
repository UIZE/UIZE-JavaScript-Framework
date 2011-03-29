/*
	This is an automatically generated module, compiled from the JavaScript template file:
		UizeDotCom.Templates.ParamsInspector.js.jst
*/

/*ScruncherSettings Mappings="=" LineCompacting="TRUE"*/

Uize.module ({
	name:'UizeDotCom.Templates.ParamsInspector',
	required:[
		'UizeDotCom.Templates.ParamsTable'
	],
	builder:function () {
		var _package = function () {};

		/*** Public Static Methods ***/
			_package.process = function (input) {
				var output = [];
				output.push ('\r\n<div class="tabShell">\r\n	<div class="tabStubShell">\r\n		<a id="',input .idPrefix,'_tabs_option0" class="tabStub" href="javascript://">PRESETS</a>\r\n		<a id="',input .idPrefix,'_tabs_option1" class="tabStub" href="javascript://">PARAMS</a>\r\n		<br style="clear:left;"/>\r\n	</div>\r\n	<div class="tabBodyShell">\r\n		<div id="',input .idPrefix,'_tabs-option0TabBody" class="tabBodyInactive">\r\n			<div id="',input .idPrefix,'-presets" class="selectorLinks">');
				 for (var _presetName in input.presets) {
				output.push ('\r\n				<a href="javascript://" onfocus="this.blur ()" class="buttonLink">',_presetName,'</a>');
				 }
				output.push ('\r\n			</div>\r\n		</div>\r\n		<div id="',input .idPrefix,'_tabs-option1TabBody" class="tabBodyInactive" style="overflow:auto;">\r\n			',UizeDotCom.Templates.ParamsTable.process ({idPrefix:input.idPrefix,params:input.params}),'\r\n		</div>\r\n	</div>\r\n</div>\r\n<div id="',input .idPrefix,'_preview" class="button">',input .previewButtonText,'</div>\r\n\r\n');
				return output.join ('');
			};

		/*** Public Static Properties ***/
			_package.input = {
				idPrefix:'string',
				params:'object',
				presets:'object',
				previewButtonText:'string'
			};

		return _package;
	}
});

