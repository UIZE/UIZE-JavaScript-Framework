/*
	This is an automatically generated module, compiled from the JavaScript template file:
		UizeDotCom.Templates.WidgetToGoGadgetXml.js.jst
*/

/*ScruncherSettings Mappings="=" LineCompacting="TRUE"*/

Uize.module ({
	name:'UizeDotCom.Templates.WidgetToGoGadgetXml',
	required:[
		'Uize.Xml'
	],
	builder:function () {
		var _package = function () {};

		/*** Public Static Methods ***/
			_package.process = function (input) {
				var output = [];
				output.push ('<?xml version="1.0" encoding="UTF-8"?>\r\n<Module>\r\n	<ModulePrefs\r\n		title="',Uize.Xml.toAttributeValue (input .title),'"\r\n		title_url="',Uize.Xml.toAttributeValue (input .urls.homepage),'"\r\n		description="',Uize.Xml.toAttributeValue (input .description.short),'"\r\n		author="',Uize.Xml.toAttributeValue ((input.author.name.first + ' ' + input.author.name.last)),'"\r\n		author_email="',Uize.Xml.toAttributeValue (input .author.email),'"\r\n		author_location="',Uize.Xml.toAttributeValue (input .author.location),'"\r\n		author_affiliation="',Uize.Xml.toAttributeValue (input .author.affiliation),'"\r\n		height="',input .dimensions.webHeight,'"\r\n		screenshot="',Uize.Xml.toAttributeValue (input .images.screenshot),'"\r\n		thumbnail="',Uize.Xml.toAttributeValue (input .images.thumbnail120x60),'"\r\n	/>\r\n	<Content\r\n		type="url"\r\n		href="',Uize.Xml.toAttributeValue (input .urls.web),'"\r\n	/>\r\n</Module>\r\n');
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

