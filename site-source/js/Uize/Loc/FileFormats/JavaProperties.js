/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Loc.FileFormats.JavaProperties Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2016 UIZE
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
		'Uize.Parse.JavaProperties.Property',
		'Uize.Parse.Code.Whitespace'
	],
	builder:function () {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_Uize_Parse_JavaProperties = Uize.Parse.JavaProperties
		;

		return Uize.package ({
			documentParser:_Uize_Parse_JavaProperties.Document,
			propertyParser:_Uize_Parse_JavaProperties.Property,

			from:function (_javaPropertiesFileStr) {
				var _properties = {};
				Uize.forEach (
					(new this.documentParser (_javaPropertiesFileStr)).items,
					function (_item) {
						if (_item.name && _item.value)
							_properties [_item.name.name] = _item.value.value
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
					_document = new this.documentParser (),
					_itemParser = this.propertyParser,
					_items = _document.items
				;
				Uize.forEach (
					_properties,
					function (_propertyValue,_propertyName) {
						var _item = new _itemParser ('key=value');
						_item.name.name = _propertyName;
						_item.value.value = _propertyValue;
						_items.length && _items.push (new Uize.Parse.Code.Whitespace ('\n'));
						_items.push (_item);
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

