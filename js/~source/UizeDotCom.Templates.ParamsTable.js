/*
	This is an automatically generated module, compiled from the JavaScript template file:
		UizeDotCom.Templates.ParamsTable.js.jst
*/

/*ScruncherSettings Mappings="=" LineCompacting="TRUE"*/

Uize.module ({
	name:'UizeDotCom.Templates.ParamsTable',
	builder:function () {
		var _package = function () {};

		/*** Public Static Methods ***/
			_package.process = function (input) {
				var output = [];

					var
						params = input.params,
						idPrefix = input.idPrefix
					;

				output.push ('\r\n<table id="',idPrefix,'" class="paramsTable">');
				 for (var paramName in params) {
				output.push ('\r\n	<tr>\r\n		<td class="fieldLabel">',paramName,'</td>\r\n		<td class="field">');

							var
								paramType = params [paramName],
								paramId = idPrefix + '_' + paramName
							;
							if (paramType == 'boolean') {
				output.push ('\r\n			<input id="',paramId,'" type="checkbox"/>');
				 } else if (Uize.isArray (paramType)) {
				output.push ('\r\n			<select id="',paramId,'">');
				 for (var optionNo = -1, totalOptions = paramType.length; ++optionNo < totalOptions;) {
				 var value = paramType [optionNo];
				output.push ('\r\n				<option value="',value,'">',value,'</option>');
				 }
				output.push ('\r\n			</select>');
				 } else if (typeof paramType == 'object') {
				output.push ('\r\n			<input id="',paramId,'" type="text" style="width:50px;"/> (',paramType.minValue,'-',paramType.maxValue,')');
				 } else if (paramType == 'string-multiline') {
				output.push ('\r\n			<textarea id="',paramId,'"/ wrap="off"></textarea>');
				 } else { // json, integer, number, string, text
				output.push ('\r\n			<input id="',paramId,'" type="text"/>');
				 }

				output.push ('\r\n		</td>\r\n	</tr>');
				 }
				output.push ('\r\n</table>\r\n');
				return output.join ('');
			};

		/*** Public Static Properties ***/
			_package.input = {
				params:'object',
				idPrefix:'string'
			};

		return _package;
	}
});

