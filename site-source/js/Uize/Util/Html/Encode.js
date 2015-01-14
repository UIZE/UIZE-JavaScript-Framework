/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Util.Html.Encode Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)1997-2015 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 2
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Util.Html.Encode= package defines utility methods for HTML encoding and HTML decoding of strings.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Util.Html.Encode',
	required:[
		'Uize.Str.Replace',
		'Uize.Util.Html.Entities'
	],
	builder:function () {
		'use strict';

		var _entityNameToCharCodeLookup = Uize.Util.Html.Entities.entityNameToCharCodeLookup;

		return Uize.package ({
			encode:Uize.Str.Replace.replacerByLookup ({
				'&':'&amp;',
				'"':'&quot;',
				'\'':'&apos;',
				'<':'&lt;',
				'>':'&gt;',
				'\n':'&#10;',
				'\r':'&#13;'
				/* NOTE: what else needs to be entitized? Characters from extended character set? */
				/*?
					Static Methods
						Uize.Util.Html.Encode.encode
							Returns a string, representing the HTML-encoded form of the specified string.

							SYNTAX
							.....................................................................................
							encodedAttributeValueSTR = Uize.Util.Html.Encode.encode (unencodedAttributeValueSTR);
							.....................................................................................

							EXAMPLE
							..................................................................................
							encodedValue = Uize.Util.Html.Encode.encode ('solar & wind beats "fossil" fuels');
							..................................................................................

							After executing the above statement, the variable =encodedValue= would have the value ='solar &amp;amp; wind beats &amp;quot;fossil&amp;quot; fuels'=.

							NOTES
							- see also the corresponding =Uize.Util.Html.Encode.decode= static method
				*/
			}),

			decode:function (_toDecode) {
				return (
					(_toDecode += '') &&
					_toDecode.replace (
						/&(?:(\w+)|#(\d{1,4}|x[0-9a-fA-F]{1,4}));/g,
						function (_match,_entityName,_entityNumber) {
							return String.fromCharCode (
								_entityNumber
									? +(_entityNumber.charAt (0) == 'x' ? ('0' + _entityNumber) : _entityNumber)
									: _entityNameToCharCodeLookup [_entityName]
							);
						}
					)
				);
				/*?
					Static Methods
						Uize.Util.Html.Encode.decode
							Returns a string, representing the decoded form of the specified HTML-encoded string.

							SYNTAX
							.....................................................................................
							unencodedAttributeValueSTR = Uize.Util.Html.Encode.decode (encodedAttributeValueSTR);
							.....................................................................................

							This method supports decoding the full set of 252 character entities contained in the HTML 4 specification, as well as entities encoded using the forms =&amp;#nnnn;= and =&amp;#xhhhh;= (where =nnnn= and =hhhh= are the Unicode character code of the character in decimal and hexadecimal formats, respectively).

							EXAMPLE
							....................................................
							unencoded = Uize.Util.Html.Encode.decode (
								'solar &amp; wind beats &quot;fossil&quot; fuels'
							);
							....................................................

							After executing the above statement, the variable =unencoded= would have the value ='solar &amp; wind beats "fossil" fuels'=.

							NOTES
							- see also the corresponding =Uize.Util.Html.Encode.encode= static method
				*/
			},

			encodeTextNode:Uize.Str.Replace.replacerByLookup ({
				'&':'&amp;',
				'<':'&lt;',
				'>':'&gt;'
			})
		});
	}
});

