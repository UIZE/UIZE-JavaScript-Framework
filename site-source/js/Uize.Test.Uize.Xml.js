/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Xml Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Test
	importance: 2
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Test.Uize.Xml= module defines a suite of unit tests for the =Uize.Xml= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Xml',
	required:[
		'Uize.Class',
		'Uize.Class.Value'
	],
	builder:function () {
		'use strict';

		return Uize.Test.declare ({
			title:'Test for Uize.Xml Module',
			test:[
				Uize.Test.requiredModulesTest ('Uize.Xml'),
				Uize.Test.staticMethodsTest ([
					['Uize.Xml.toAttributeValue',[
						['Test that calling with empty string produces empty string',
							'',
							''
						],
						['Test that a string that doesn\'t contain any characters that need encoding is returned as is',
							'SOLAR POWER',
							'SOLAR POWER'
						],
						['Test that a string containing "&" (ampersand) characters is encoded correctly',
							'SOLAR & WIND & BIOFUEL & GEOTHERMAL',
							'SOLAR &amp; WIND &amp; BIOFUEL &amp; GEOTHERMAL'
						],
						['Test that a string containing "\\n" (linefeed) characters is encoded correctly',
							'SOLAR\nWIND\nBIOFUEL\nGEOTHERMAL',
							'SOLAR&#10;WIND&#10;BIOFUEL&#10;GEOTHERMAL'
						],
						['Test that a string containing "\\r" (carriage return) characters is encoded correctly',
							'SOLAR\rWIND\rBIOFUEL\rGEOTHERMAL',
							'SOLAR&#13;WIND&#13;BIOFUEL&#13;GEOTHERMAL'
						],
						['Test that a string containing double quotes is encoded correctly',
							'"SOLAR" "WIND" "BIOFUEL" "GEOTHERMAL"',
							'&quot;SOLAR&quot; &quot;WIND&quot; &quot;BIOFUEL&quot; &quot;GEOTHERMAL&quot;'
						],
						['Test that a string containing single quotes is encoded correctly',
							'\'SOLAR\' \'WIND\' \'BIOFUEL\' \'GEOTHERMAL\'',
							'&apos;SOLAR&apos; &apos;WIND&apos; &apos;BIOFUEL&apos; &apos;GEOTHERMAL&apos;'
						],
						['Test that a string containing "<" (less than sign) characters is encoded correctly',
							'1 < 2 < 3 < 4',
							'1 &lt; 2 &lt; 3 &lt; 4'
						],
						['Test that a string containing ">" (greater than sign) characters is encoded correctly',
							'4 > 3 > 2 > 1',
							'4 &gt; 3 &gt; 2 &gt; 1'
						],
						['Test that a string containing multiple characters that need to be encoded is encoded correctly',
							'SOLAR & WIND\n"BIOFUEL"\r<GEOTHERMAL>',
							'SOLAR &amp; WIND&#10;&quot;BIOFUEL&quot;&#13;&lt;GEOTHERMAL&gt;'
						],
						['Test that the value undefined is coerced to a string before being encoded',
							undefined,
							'undefined'
						],
						['Test that the value null is coerced to a string before being encoded',
							null,
							'null'
						],
						['Test that a number type value is coerced to a string before being encoded',
							42,
							'42'
						],
						['Test that the number type value NaN is coerced to a string before being encoded',
							NaN,
							'NaN'
						],
						['Test that the number type value Infinity is coerced to a string before being encoded',
							Infinity,
							'Infinity'
						],
						['Test that the boolean type value false is coerced to a string before being encoded',
							false,
							'false'
						],
						['Test that a Boolean object instance is coerced to a string before being encoded',
							[new Boolean (true)],
							'true'
						],
						['Test that a Number object instance is coerced to a string before being encoded',
							[new Number (42)],
							'42'
						],
						['Test that a String object instance is coerced to a string before being encoded',
							[new String ('SOLAR POWER')],
							'SOLAR POWER'
						],
						['Test that a Uize class instance is coerced to a string before being encoded',
							[Uize.Class.Value ({value:'SOLAR POWER'})],
							'SOLAR POWER'
						]
					]],
					['Uize.Xml.fromAttributeValue',[
						['Test that calling with empty string produces empty string',
							'',
							''
						],
						['Test that a string that doesn\'t contain any entities is returned as is',
							'SOLAR POWER',
							'SOLAR POWER'
						],
						['Test that entities are decoded correctly',
							'&quot; &amp; &apos; &lt; &gt; &#10; &#13;',
							'" & \' < > \n \r'
						],
						['Test that some arbitrary character code entity is decoded correctly',
							'&#1234;',
							String.fromCharCode (1234)
						],
						['Test that the value undefined is coerced to a string before being decoded',
							undefined,
							'undefined'
						],
						['Test that the value null is coerced to a string before being decoded',
							null,
							'null'
						],
						['Test that a number type value is coerced to a string before being decoded',
							42,
							'42'
						],
						['Test that the number type value NaN is coerced to a string before being decoded',
							NaN,
							'NaN'
						],
						['Test that the number type value Infinity is coerced to a string before being decoded',
							Infinity,
							'Infinity'
						],
						['Test that the boolean type value false is coerced to a string before being decoded',
							false,
							'false'
						],
						['Test that a Boolean object instance is coerced to a string before being decoded',
							[new Boolean (true)],
							'true'
						],
						['Test that a Number object instance is coerced to a string before being decoded',
							[new Number (42)],
							'42'
						],
						['Test that a String object instance is coerced to a string before being decoded',
							[new String ('SOLAR POWER')],
							'SOLAR POWER'
						],
						['Test that a Uize class instance is coerced to a string before being decoded',
							[Uize.Class.Value ({value:'SOLAR POWER'})],
							'SOLAR POWER'
						]
					]],
					['Uize.Xml.toAttributes',[
						['Test that calling with no parameters produces an empty string',
							[],
							''
						],
						['Test that calling with an empty object produces an empty string',
							{},
							''
						],
						['Test that an object with a single attribute whose value contains no characters that need encoding is encoded correctly',
							{attrib1:'attrib1Value'},
							'attrib1="attrib1Value"'
						],
						['Test that an object with multiple attributes is encoded correctly',
							{attrib1:'attrib1Value',attrib2:'attrib2Value',attrib3:'attrib3Value'},
							'attrib1="attrib1Value" attrib2="attrib2Value" attrib3="attrib3Value"'
						],
						['Test that single quotes are supported for quoting attribute valus',
							[{attrib1:'attrib1Value',attrib2:'attrib2Value',attrib3:'attrib3Value'},{quoteChar:'\''}],
							'attrib1=\'attrib1Value\' attrib2=\'attrib2Value\' attrib3=\'attrib3Value\''
						],
						['Test that single quotes are supported for quoting attribute valus',
							{'':'attribValue',foo:'bar'},
							'foo="bar"'
						],
						['Test that attributes can have empty string values',
							{attrib1:'',attrib2:''},
							'attrib1="" attrib2=""'
						],
						['Test that whitespace inside attribute values is respected',
							{a1:'  a1Value',a2:'a2Value  ',a3:'  a3Value  ',a4:'a4 Value',a5:'\t a5 \n Value \r'},
							'a1="  a1Value" a2="a2Value  " a3="  a3Value  " a4="a4 Value" a5="\t a5 &#10; Value &#13;"'
						],
						['Test that attribute values can be only whitespace',
							{a1:'  ',a2:'\t\t',a3:'\n\n',a4:'\r\r'},
							'a1="  " a2="\t\t" a3="&#10;&#10;" a4="&#13;&#13;"'
						],
						['Test that, by default, attribute names and values are case-sensitive, and that case is respected',
							{attribute:'attribute',Attribute:'Attribute',ATTRIBUTE:'ATTRIBUTE'},
							'attribute="attribute" Attribute="Attribute" ATTRIBUTE="ATTRIBUTE"'
						],
						['Test that lowercasing of attribute names is supported correctly and doesn\'t affect case of values',
							[{attrib1:'attrib1Value',Attrib2:'Attrib2Value',ATTRIB3:'ATTRIB3VALUE'},{nameCase:'lower'}],
							'attrib1="attrib1Value" attrib2="Attrib2Value" attrib3="ATTRIB3VALUE"'
						],
						['Test that uppercasing of attribute names is supported correctly and doesn\'t affect case of values',
							[{attrib1:'attrib1Value',Attrib2:'Attrib2Value',ATTRIB3:'ATTRIB3VALUE'},{nameCase:'upper'}],
							'ATTRIB1="attrib1Value" ATTRIB2="Attrib2Value" ATTRIB3="ATTRIB3VALUE"'
						],
						['Test that unique attributes can become duplicates as a result of name case changing, in which case the value of the last one wins',
							[{attribute:'BIOFUEL',Attribute:'WIND',ATTRIBUTE:'SOLAR'},{nameCase:'lower'}],
							'attribute="SOLAR"'
						],
						['Test that characters in attribute values that need to be encoded as entities are encoded correctly',
							{quot:'"',amp:'&',apos:'\'',lt:'<',gt:'>',lf:'\n',cr:'\r'},
							'quot="&quot;" amp="&amp;" apos="&apos;" lt="&lt;" gt="&gt;" lf="&#10;" cr="&#13;"'
						],
						['Test that non-string type attribute values are coerced to string before being encoded',
							{
								number:42,
								infinity:Infinity,
								nan:NaN,
								bool:true,
								stringObj:new String ('hello'),
								numberObj:new Number (42),
								boolObj:new Boolean (false),
								uizeInstance:Uize.Class.Value ({value:'hello'}),
								undefinedValue:undefined,
								nullValue:null,
								array:[1,2,3,4]
							},
							[
								'number="42"',
								'infinity="Infinity"',
								'nan="NaN"',
								'bool="true"',
								'stringObj="hello"',
								'numberObj="42"',
								'boolObj="false"',
								'uizeInstance="hello"',
								'undefinedValue="undefined"',
								'nullValue="null"',
								'array="1,2,3,4"'
							].join (' ')
						]
					]],
					['Uize.Xml.fromAttributes',[
						['Test that calling with no parameters produces an empty object',
							[],
							{}
						],
						['Test that calling with an empty string produces an empty object',
							'',
							{}
						],
						['Test that a string with a single attribute whose value contains no entities is decoded correctly',
							'attrib1="attrib1Value"',
							{attrib1:'attrib1Value'}
						],
						['Test that a string with multiple attributes is decoded correctly',
							'attrib1="attrib1Value" attrib2="attrib2Value" attrib3="attrib3Value"',
							{attrib1:'attrib1Value',attrib2:'attrib2Value',attrib3:'attrib3Value'}
						],
						['Test that superfluous whitespace around a set of attributes is ignored',
							' \t\n\r attrib1="attrib1Value" attrib2="attrib2Value" attrib3="attrib3Value" \t\n\r ',
							{attrib1:'attrib1Value',attrib2:'attrib2Value',attrib3:'attrib3Value'}
						],
						['Test that various different types of whitespace separating multiple attributes is supported',
							'a1="a1Value"   a2="a2Value"\t\ta3="a3Value"\na4="a4Value"\ra5="a5Value"',
							{a1:'a1Value',a2:'a2Value',a3:'a3Value',a4:'a4Value',a5:'a5Value'}
						],
						['Test that whitespace around the "=" (equals sign) name/value separator is supported',
							'a1  =  "a1Value" a2\t\t=\t\t"a2Value" a3\n\n=\n\n"a3Value" a4\r\r=\r\r"a4Value"',
							{a1:'a1Value',a2:'a2Value',a3:'a3Value',a4:'a4Value'}
						],
						['Test that attributes without values are supported and that their values are an empty string',
							'attrib1 attrib2 attrib3',
							{attrib1:'',attrib2:'',attrib3:''}
						],
						['Test that single quotes are supported for quoting attribute valus',
							'attrib1=\'attrib1Value\' attrib2=\'attrib2Value\' attrib3=\'attrib3Value\'',
							{attrib1:'attrib1Value',attrib2:'attrib2Value',attrib3:'attrib3Value'}
						],
						['Test that attributes can have empty string values inside quotes',
							'attrib1="" attrib2=\'\'',
							{attrib1:'',attrib2:''}
						],
						['Test that whitespace inside attribute values is respected',
							'a1="  a1Value" a2="a2Value  " a3="  a3Value  " a4="a4 Value" a5="\t a5 \n Value \r"',
							{a1:'  a1Value',a2:'a2Value  ',a3:'  a3Value  ',a4:'a4 Value',a5:'\t a5 \n Value \r'}
						],
						['Test that attribute values can be only whitespace',
							'a1="  " a2="\t\t" a3="\n\n" a4="\r\r"',
							{a1:'  ',a2:'\t\t',a3:'\n\n',a4:'\r\r'}
						],
						['Test that, by default, attribute names and values are case-sensitive, and that case is respected',
							'attribute="attribute" Attribute="Attribute" ATTRIBUTE="ATTRIBUTE"',
							{attribute:'attribute',Attribute:'Attribute',ATTRIBUTE:'ATTRIBUTE'}
						],
						['Test that lowercasing of attribute names is supported correctly and doesn\'t affect case of values',
							['attrib1="attrib1Value" Attrib2="Attrib2Value" ATTRIB3="ATTRIB3VALUE"',{nameCase:'lower'}],
							{attrib1:'attrib1Value',attrib2:'Attrib2Value',attrib3:'ATTRIB3VALUE'}
						],
						['Test that uppercasing of attribute names is supported correctly and doesn\'t affect case of values',
							['attrib1="attrib1Value" Attrib2="Attrib2Value" ATTRIB3="ATTRIB3VALUE"',{nameCase:'upper'}],
							{ATTRIB1:'attrib1Value',ATTRIB2:'Attrib2Value',ATTRIB3:'ATTRIB3VALUE'}
						],
						['Test that when attributes are repeated, later values win',
							'attribute="BIOFUEL" attribute="WIND" attribute="SOLAR"',
							{attribute:'SOLAR'}
						],
						['Test that unique attributes can become duplicates as a result of name case changing',
							['attribute="BIOFUEL" Attribute="WIND" ATTRIBUTE="SOLAR"',{nameCase:'lower'}],
							{attribute:'SOLAR'}
						],
						['Test that entities in attribute values are decoded correctly',
							'quot="&quot;" amp="&amp;" apos="&apos;" lt="&lt;" gt="&gt;" lf="&#10;" cr="&#13;"',
							{quot:'"',amp:'&',apos:'\'',lt:'<',gt:'>',lf:'\n',cr:'\r'}
						]
					]]
				])
			]
		});
	}
});

