/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Xml Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)1997-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 4
	codeCompleteness: 10
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Xml= package defines utility methods (primarily for serialization and deserialization) that are useful when handling data in the XML format.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Xml',
	required:'Uize.String.Replace',
	builder:function () {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_package = function () {},
				_true = true,
				_false = false,
				_sacredEmptyObject = {}
			;

		/*** General Variables ***/
			var
				_entityMap,
				_getEntityMap = function () {
					return _entityMap || (
						_entityMap = {
							quot:34, amp:38, apos:39, lt:60, gt:62, nbsp:160, iexcl:161, cent:162, pound:163, curren:164, yen:165, brvbar:166, sect:167, uml:168, copy:169, ordf:170, laquo:171, not:172, shy:173, reg:174, macr:175, deg:176, plusmn:177, sup2:178, sup3:179, acute:180, micro:181, para:182, middot:183, cedil:184, sup1:185, ordm:186, raquo:187, frac14:188, frac12:189, frac34:190, iquest:191, Agrave:192, Aacute:193, Acirc:194, Atilde:195, Auml:196, Aring:197, AElig:198, CCedil:199, Egrave:200, Eacute:201, Ecirc:202, Euml:203, Igrave:204, Iacute:205, Icirc:206, Iuml:207, ETH:208, Ntilde:209, Ograve:210, Oacute:211, Ocirc:212, Otilde:213, Ouml:214, times:215, Oslash:216, Ugrave:217, Uacute:218, Ucirc:219, Uuml:220, Yacute:221, THORN:222, szlig:223, agrave:224, aacute:225, acirc:226, atilde:227, auml:228, aring:229, aelig:230, ccedil:231, egrave:232, eacute:233, ecirc:234, euml:235, igrave:236, iacute:237, icirc:238, iuml:239, eth:240, ntilde:241, ograve:242, oacute:243, ocirc:244, otilde:245, ouml:246, divide:247, oslash:248, ugrave:249, uacute:250, ucirc:251, uuml:252, yacute:253, thorn:254, yuml:255, OElig:338, oelig:339, Scaron:352, scaron:353, Yuml:376, fnof:402, circ:710, tilde:732, Alpha:913, Beta:914, Gamma:915, Delta:916, Epsilon:917, Zeta:918, Eta:919, Theta:920, Iota:921, Kappa:922, Lambda:923, Mu:924, Nu:925, Xi:926, Omicron:927, Pi:928, Rho:929, Sigma:931, Tau:932, Upsilon:933, Phi:934, Chi:935, Psi:936, Omega:937, alpha:945, beta:946, gamma:947, delta:948, epsilon:949, zeta:950, eta:951, theta:952, iota:953, kappa:954, lambda:955, mu:956, nu:957, xi:958, omicron:959, pi:960, rho:961, sigmaf:962, sigma:963, tau:964, upsilon:965, phi:966, chi:967, psi:968, omega:969, thetasym:977, upsih:978, piv:982, ensp:8194, emsp:8195, thinsp:8201, zwnj:8204, zwj:8205, lrm:8206, rlm:8207, ndash:8211, mdash:8212, lsquo:8216, rsquo:8217, sbquo:8218, ldquo:8220, rdquo:8221, bdquo:8222, dagger:8224, Dagger:8225, bull:8226, hellip:8230, permil:8240, prime:8242, Prime:8243, lsaquo:8249, rsaquo:8250, oline:8254, frasl:8260, euro:8364, image:8465, weierp:8472, real:8476, trade:8482, alefsym:8501, larr:8592, uarr:8593, rarr:8594, darr:8595, harr:8596, crarr:8629, lArr:8656, uArr:8657, rArr:8658, dArr:8659, hArr:8660, forall:8704, part:8706, exist:8707, empty:8709, nabla:8711, isin:8712, notin:8713, ni:8715, prod:8719, sum:8721, minus:8722, lowast:8727, radic:8730, prop:8733, infin:8734, ang:8736, and:8743, or:8744, cap:8745, cup:8746, int:8747, there4:8756, sim:8764, cong:8773, asymp:8776, ne:8800, equiv:8801, le:8804, ge:8805, sub:8834, sup:8835, nsub:8836, sube:8838, supe:8839, oplus:8853, otimes:8855, perp:8869, sdot:8901, lceil:8968, rceil:8969, lfloor:8970, rfloor:8971, lang:9001, rang:9002, loz:9674, spades:9824, clubs:9827, hearts:9829, diams:9830
						}
					);
				},
				_attributeMatchRegExp = /\s*([^=\s]+)\s*(=\s*("([^"]*)"|'([^']*)'|(\S*))|$|)/g,
				_entityMatchRegExp = /&(?:(\w+)|#(\d{1,4}|x[0-9a-fA-F]{1,4}));/g
			;

		/*** Utility Functions ***/
			function _getNameCaseMethodName (_options) {
				return {upper:'toUpperCase',lower:'toLowerCase'} [_options.nameCase] || 'valueOf';
			}

		/*** Public Static Methods ***/
			var _toAttributeValue = _package.toAttributeValue = Uize.String.Replace.replacerByLookup ({
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
						Uize.Xml.toAttributeValue
							Returns a string, representing the XML attribute encoded form of the specified string.

							SYNTAX
							..................................................................................
							encodedAttributeValueSTR = Uize.Xml.toAttributeValue (unencodedAttributeValueSTR);
							..................................................................................

							EXAMPLE
							...............................................................................
							encodedValue = Uize.Xml.toAttributeValue ('solar & wind beats "fossil" fuels');
							...............................................................................

							After executing the above statement, the variable =encodedValue= would have the value ='solar &amp;amp; wind beats &amp;quot;fossil&amp;quot; fuels'=.

							NOTES
							- see also the corresponding =Uize.Xml.fromAttributeValue= static method
				*/
			});

			var _fromAttributeValue = _package.fromAttributeValue = function (_toDecode) {
				return (
					(_toDecode += '') &&
					_toDecode.replace (
						_entityMatchRegExp,
						function (_match,_entityName,_entityNumber) {
							return (
								String.fromCharCode (
									_entityNumber
										? +(_entityNumber.charAt (0) == 'x' ? ('0' + _entityNumber) : _entityNumber)
										: _getEntityMap () [_entityName]
								)
							);
						}
					)
				);
				/*?
					Static Methods
						Uize.Xml.fromAttributeValue
							Returns a string, representing the decoded form of the specified XML encoded attribute value.

							SYNTAX
							....................................................................................
							unencodedAttributeValueSTR = Uize.Xml.fromAttributeValue (encodedAttributeValueSTR);
							....................................................................................

							This method supports decoding the full set of 252 character entities contained in the HTML 4 specification, as well as entities encoded using the forms =&amp;#nnnn;= and =&amp;#xhhhh;= (where =nnnn= and =hhhh= are the Unicode character code of the character in decimal and hexadecimal formats, respectively).

							EXAMPLE
							....................................................
							unencoded = Uize.Xml.fromAttributeValue (
								'solar &amp; wind beats &quot;fossil&quot; fuels'
							);
							....................................................

							After executing the above statement, the variable =unencoded= would have the value ='solar &amp; wind beats "fossil" fuels'=.

							NOTES
							- see also the corresponding =Uize.Xml.toAttributeValue= static method
				*/
			};

			_package.fromAttributes = function (_toDecode,_options) {
				var _attributesObj = {};
				if (_toDecode) {
					_options = _options || _sacredEmptyObject;
					var
						_nameCaseMethodName = _getNameCaseMethodName (_options),
						_attributeMatch
					;
					while (_attributeMatch = _attributeMatchRegExp.exec (_toDecode))
						_attributesObj [_attributeMatch [1] [_nameCaseMethodName] ()] =
							_fromAttributeValue (_attributeMatch [4] || _attributeMatch [5] || _attributeMatch [6] || '')
					;
				}
				return _attributesObj;
				/*?
					Static Methods
						Uize.Xml.fromAttributes
							A utility method that parses an XML formatted attributes string and returns the attributes as an object.

							SYNTAX
							........................................................
							attributesOBJ = Uize.Xml.fromAttributes (attributesSTR);
							........................................................

							EXAMPLE
							......................................................................................
							Uize.Xml.fromAttributes ('src="myimage.gif" width="640" height="480" alt="My Image"');
							......................................................................................

							With the above attributes string, the =Uize.Xml.fromAttributes= method would produce the object...

							......................
							{
								src:'myimage.gif',
								width:'640',
								height:'480',
								alt:'My Image'
							}
							......................

							VARIATION
							...................................................................
							attributesOBJ = Uize.Xml.fromAttributes (attributesSTR,optionsOBJ);
							...................................................................

							The optional =optionsOBJ= parameter lets you qualify how the specified attributes string should be decoded.

							DECODING OPTIONS
							..................................................................
							{
								nameCase:nameCaseSTR // 'lower' | 'upper' | undefined (default)
							}
							..................................................................

							nameCase
								A string, specifying the case for keys in the object that is produced from decoding the attributes string. This property is optional. By default, attribute names are left as they appear in the attributes string. This property allows you to coerce the case in order to correct for attribute strings that do not conform in your specific use case.

							EXAMPLE
							......................................................................................
							Uize.Xml.fromAttributes (
								'src="myimage.gif" WIDTH="640" Height="480" ALT="My Image"',
								{nameCase:'lower'}
							);
							......................................................................................

							The above attributes string contains attribute names in mixed case. Specifying the value ='lower'= for the =nameCase= property of the =optionsOBJ= parameter will cause the decoding to produce an object with all lowercase keys, as in...

							......................
							{
								src:'myimage.gif',
								width:'640',
								height:'480',
								alt:'My Image'
							}
							......................

							NOTES
							- when parsing the attributes string, all attribute values are treated as strings
							- see also the corresponding =Uize.Xml.toAttributes= static method
				*/
			};

			_package.toAttributes = function (_toEncode,_options) {
				var
					_nameCaseMethodName = _getNameCaseMethodName (_options = _options || _sacredEmptyObject),
					_quoteChar = _options.quoteChar || '"',
					_equalPlusQuoteChar = '=' + _quoteChar,
					_attributesStrChunks = []
				;
				/*** change name case of attributes, in a way that collapses duplicates that may otherwise arise ***/
					if (_nameCaseMethodName != 'valueOf') {
						var _oldToEncode = _toEncode;
						_toEncode = {};
						for (var _attributeName in _oldToEncode)
							_toEncode [_attributeName [_nameCaseMethodName] ()] = _oldToEncode [_attributeName]
						;
					}

				for (var _attributeName in _toEncode)
					_attributeName && _attributesStrChunks.push (
						_attributeName + _equalPlusQuoteChar + _toAttributeValue (_toEncode [_attributeName]) + _quoteChar
					)
				;
				return _attributesStrChunks.join (' ');
				/*?
					Static Methods
						Uize.Xml.toAttributes
							A utility method that serializes the properties of the specified object to produce an XML formatted attributes string.

							SYNTAX
							......................................................
							attributesSTR = Uize.Xml.toAttributes (attributesOBJ);
							......................................................

							EXAMPLE
							........................
							Uize.Xml.toAttributes ({
								src:'myimage.gif',
								width:'640',
								height:'480',
								alt:'My Image'
							});
							........................

							With the above =attributesOBJ= value, the =Uize.Xml.toAttributes= method would produce the string...

							...........................................................
							'src="myimage.gif" width="640" height="480" alt="My Image"'
							...........................................................

							VARIATION
							.................................................................
							attributesSTR = Uize.Xml.toAttributes (attributesOBJ,optionsOBJ);
							.................................................................

							The optional =optionsOBJ= parameter lets you qualify how the specified attributes object should be encoded to produce an attribute string.

							ENCODING OPTIONS
							..................................................................
							{
								nameCase:nameCaseSTR // 'lower' | 'upper' | undefined (default)
							}
							..................................................................

							nameCase
								A string, specifying the case for attribute names that are generated from the keys of the attributes object. This property is optional. By default, attribute names are identical to the keys in the attributes object. This property allows you to coerce the case in order to conform the attributes string for your specific use case.

							EXAMPLE
							........................
							Uize.Xml.toAttributes (
								{
									SRC:'myimage.gif',
									WIDTH:'640',
									HEIGHT:'480',
									ALT:'My Image'
								}
								{nameCase:'lower'}
							);
							........................

							The above attributes object contains keys that are all uppercase. Specifying the value ='lower'= for the =nameCase= property of the =optionsOBJ= parameter will cause the encoding to produce an attributes string with all lowercase attribute names, as in...

							...........................................................
							'src="myimage.gif" width="640" height="480" alt="My Image"'
							...........................................................

							NOTES
							- all attribute values are enclosed in double quotes
							- empty string attribute values are always fully serialized (eg. =myattribute&#61;""=)
							- see also the corresponding =Uize.Xml.fromParams= static method
				*/
			};

		return _package;
	}
});

