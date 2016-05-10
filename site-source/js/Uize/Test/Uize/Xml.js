/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Xml Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2016 UIZE
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
	required:'Uize.Class.Value',
	builder:function () {
		'use strict';

		return Uize.Test.resolve ({
			title:'Test for Uize.Xml Module',
			test:[
				Uize.Test.requiredModulesTest ([
					'Uize.Util.Html.Encode',
					'Uize.Xml'
				]),
				Uize.Test.staticMethodsTest ([
					['Uize.Xml.toAttributes',[
						['Calling with no parameters produces an empty string',
							[],
							''
						],
						['Calling with an empty object produces an empty string',
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
						['Single quotes can be used for quoting attribute valus',
							[{attrib1:'attrib1Value',attrib2:'attrib2Value',attrib3:'attrib3Value'},{quoteChar:'\''}],
							'attrib1=\'attrib1Value\' attrib2=\'attrib2Value\' attrib3=\'attrib3Value\''
						],
						['Single quotes can be used for quoting attribute valus',
							{'':'attribValue',foo:'bar'},
							'foo="bar"'
						],
						['Attributes can have empty string values',
							{attrib1:'',attrib2:''},
							'attrib1="" attrib2=""'
						],
						['Whitespace inside attribute values is respected',
							{a1:'  a1Value',a2:'a2Value  ',a3:'  a3Value  ',a4:'a4 Value',a5:'\t a5 \n Value \r'},
							'a1="  a1Value" a2="a2Value  " a3="  a3Value  " a4="a4 Value" a5="\t a5 &#10; Value &#13;"'
						],
						['Attribute values can be only whitespace',
							{a1:'  ',a2:'\t\t',a3:'\n\n',a4:'\r\r'},
							'a1="  " a2="\t\t" a3="&#10;&#10;" a4="&#13;&#13;"'
						],
						['By default, attribute names and values are case-sensitive, and case is respected',
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
						['If unique attributes become duplicates as a result of name case changing, then the value of the last one wins',
							[{attribute:'BIOFUEL',Attribute:'WIND',ATTRIBUTE:'SOLAR'},{nameCase:'lower'}],
							'attribute="SOLAR"'
						],
						['Characters in attribute values that need to be encoded as entities are encoded',
							{quot:'"',amp:'&',apos:'\'',lt:'<',gt:'>',lf:'\n',cr:'\r'},
							'quot="&quot;" amp="&amp;" apos="&apos;" lt="&lt;" gt="&gt;" lf="&#10;" cr="&#13;"'
						],
						['Non-string type attribute values are coerced to string before being encoded',
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
						['Calling with no parameters produces an empty object',
							[],
							{}
						],
						['Calling with an empty string produces an empty object',
							'',
							{}
						],
						['A string with a single attribute whose value contains no entities can be decoded',
							'attrib1="attrib1Value"',
							{attrib1:'attrib1Value'}
						],
						['A string with multiple attributes can be decoded',
							'attrib1="attrib1Value" attrib2="attrib2Value" attrib3="attrib3Value"',
							{attrib1:'attrib1Value',attrib2:'attrib2Value',attrib3:'attrib3Value'}
						],
						['Superfluous whitespace around a set of attributes is ignored',
							' \t\n\r attrib1="attrib1Value" attrib2="attrib2Value" attrib3="attrib3Value" \t\n\r ',
							{attrib1:'attrib1Value',attrib2:'attrib2Value',attrib3:'attrib3Value'}
						],
						['Various different types of whitespace separating multiple attributes is supported',
							'a1="a1Value"   a2="a2Value"\t\ta3="a3Value"\na4="a4Value"\ra5="a5Value"',
							{a1:'a1Value',a2:'a2Value',a3:'a3Value',a4:'a4Value',a5:'a5Value'}
						],
						['Test that whitespace around the "=" (equals sign) name/value separator is supported',
							'a1  =  "a1Value" a2\t\t=\t\t"a2Value" a3\n\n=\n\n"a3Value" a4\r\r=\r\r"a4Value"',
							{a1:'a1Value',a2:'a2Value',a3:'a3Value',a4:'a4Value'}
						],
						['An attribute can have no specified value, in which case the value is defaulted to an empty string',
							'attrib1 attrib2 attrib3',
							{attrib1:'',attrib2:'',attrib3:''}
						],
						['Single quotes can be used for quoting attribute valus',
							'attrib1=\'attrib1Value\' attrib2=\'attrib2Value\' attrib3=\'attrib3Value\'',
							{attrib1:'attrib1Value',attrib2:'attrib2Value',attrib3:'attrib3Value'}
						],
						['Attributes can have empty string values inside quotes',
							'attrib1="" attrib2=\'\'',
							{attrib1:'',attrib2:''}
						],
						['Whitespace inside attribute values is respected',
							'a1="  a1Value" a2="a2Value  " a3="  a3Value  " a4="a4 Value" a5="\t a5 \n Value \r"',
							{a1:'  a1Value',a2:'a2Value  ',a3:'  a3Value  ',a4:'a4 Value',a5:'\t a5 \n Value \r'}
						],
						['Attribute values can be only whitespace',
							'a1="  " a2="\t\t" a3="\n\n" a4="\r\r"',
							{a1:'  ',a2:'\t\t',a3:'\n\n',a4:'\r\r'}
						],
						['By default, attribute names and values are case-sensitive, and case is respected',
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
						['When attributes are repeated, later values win',
							'attribute="BIOFUEL" attribute="WIND" attribute="SOLAR"',
							{attribute:'SOLAR'}
						],
						['If unique attributes become duplicates as a result of name case changing, then the value of the last one wins',
							['attribute="BIOFUEL" Attribute="WIND" ATTRIBUTE="SOLAR"',{nameCase:'lower'}],
							{attribute:'SOLAR'}
						],
						['HTML entities in attribute values are decoded',
							'quot="&quot;" amp="&amp;" apos="&apos;" lt="&lt;" gt="&gt;" lf="&#10;" cr="&#13;"',
							{quot:'"',amp:'&',apos:'\'',lt:'<',gt:'>',lf:'\n',cr:'\r'}
						]
					]]
				]),
				Uize.Test.migratedStaticMethodsTest ([
					['Uize.Xml.toAttributeValue','Uize.Util.Html.Encode.encode'],
					['Uize.Xml.fromAttributeValue','Uize.Util.Html.Encode.decode']
				])
			]
		});
	}
});

