/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Loc.FileFormats.JavaProperties Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2015 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 1
	codeCompleteness: 100
	docCompleteness: 50
*/

/*?
	Introduction
		The =Uize.Loc.FileFormats.JavaProperties= module provides support for serializing to and parsing from [[http://en.wikipedia.org/wiki/.properties][Java properties]] files.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Loc.FileFormats.JavaProperties',
	required:[
		'Uize.Parse.JavaProperties.Document',
		'Uize.Parse.JavaProperties.Property'
	],
	builder:function () {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_Uize_Parse_JavaProperties = Uize.Parse.JavaProperties,

			/*** Variables for Performance Optimization ***/
				_Uize_Parse_JavaProperties_Document = _Uize_Parse_JavaProperties.Document,
				_Uize_Parse_JavaProperties_Property = _Uize_Parse_JavaProperties.Property
		;

		return Uize.package ({
			from:function (_javaPropertiesFileStr) {
				var _properties = {};
				Uize.forEach (
					(new _Uize_Parse_JavaProperties_Document (_javaPropertiesFileStr)).items,
					function (_property) {
						if (_property.name && _property.value)
							_properties [_property.name.name] = _property.value.value
						;
					}
				);
				return _properties;
				/*?
					Static Methods
						Uize.Loc.FileFormats.JavaProperties.from
							Returns an object, being the properties parsed from the specified Java properties file string.

							SYNTAX
							......................................................................
							propertiesOBJ = Uize.Loc.FileFormats.JavaProperties.from (javaPropertiesFileSTR);
							......................................................................

							NOTES
							- see the companion =Uize.Loc.FileFormats.JavaProperties.to= static method
				*/
			},

			to:function (_properties) {
				var
					_document = new _Uize_Parse_JavaProperties_Document (),
					_items = _document.items
				;
				Uize.forEach (
					_properties,
					function (_propertyValue,_propertyName) {
						var _property = new _Uize_Parse_JavaProperties_Property ('key=value');
						_property.name.name = _propertyName;
						_property.value.value = _propertyValue;
						_items.push (_property);
					}
				);
				return _document.serialize ();
				/*?
					Static Methods
						Uize.Loc.FileFormats.JavaProperties.to
							Returns a string, being the specified properties object serialized to a Java properties file string.

							SYNTAX
							....................................................................
							javaPropertiesFileSTR = Uize.Loc.FileFormats.JavaProperties.to (propertiesOBJ);
							....................................................................

							NOTES
							- see the companion =Uize.Loc.FileFormats.JavaProperties.from= static method
				*/
			}
		});
	}
});

