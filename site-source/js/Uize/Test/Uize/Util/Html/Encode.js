/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Util.Html.Encode Class
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
		The =Uize.Test.Uize.Util.Html.Encode= module defines a suite of unit tests for the =Uize.Util.Html.Encode= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Util.Html.Encode',
	required:'Uize.Class.Value',
	builder:function () {
		'use strict';

		return Uize.Test.resolve ({
			title:'Test for Uize.Util.Html.Encode Module',
			test:[
				Uize.Test.requiredModulesTest ('Uize.Util.Html.Encode'),
				Uize.Test.staticMethodsTest ([
					['Uize.Util.Html.Encode.encode',[
						['Calling with empty string produces empty string',
							'',
							''
						],
						['A string that doesn\'t contain any characters that need encoding is returned as is',
							'SOLAR POWER',
							'SOLAR POWER'
						],
						['When the source string contains "&" (ampersand) characters, all those characters will be encoded',
							'SOLAR & WIND & BIOFUEL & GEOTHERMAL',
							'SOLAR &amp; WIND &amp; BIOFUEL &amp; GEOTHERMAL'
						],
						['When the source string contains "\\n" (linefeed) characters, all those characters will be encoded',
							'SOLAR\nWIND\nBIOFUEL\nGEOTHERMAL',
							'SOLAR&#10;WIND&#10;BIOFUEL&#10;GEOTHERMAL'
						],
						['When the source string contains "\\r" (carriage return) characters, all those characters will be encoded',
							'SOLAR\rWIND\rBIOFUEL\rGEOTHERMAL',
							'SOLAR&#13;WIND&#13;BIOFUEL&#13;GEOTHERMAL'
						],
						['When the source string contains double quotes, all those double quotes will be encoded',
							'"SOLAR" "WIND" "BIOFUEL" "GEOTHERMAL"',
							'&quot;SOLAR&quot; &quot;WIND&quot; &quot;BIOFUEL&quot; &quot;GEOTHERMAL&quot;'
						],
						['When the source string contains single quotes, all those single quotes will be encoded',
							'\'SOLAR\' \'WIND\' \'BIOFUEL\' \'GEOTHERMAL\'',
							'&apos;SOLAR&apos; &apos;WIND&apos; &apos;BIOFUEL&apos; &apos;GEOTHERMAL&apos;'
						],
						['When the source string contains "<" (less than sign) characters, all those characters will be encoded',
							'1 < 2 < 3 < 4',
							'1 &lt; 2 &lt; 3 &lt; 4'
						],
						['When the source string contains ">" (greater than sign) characters, all those characters will be encoded',
							'4 > 3 > 2 > 1',
							'4 &gt; 3 &gt; 2 &gt; 1'
						],
						['When the source string contains multiple different characters that need to be encoded, all those characters will be encoded',
							'SOLAR & WIND\n"BIOFUEL"\r<GEOTHERMAL>',
							'SOLAR &amp; WIND&#10;&quot;BIOFUEL&quot;&#13;&lt;GEOTHERMAL&gt;'
						],
						['The value undefined is coerced to a string before being encoded',
							undefined,
							'undefined'
						],
						['The value null is coerced to a string before being encoded',
							null,
							'null'
						],
						['A number type value is coerced to a string before being encoded',
							42,
							'42'
						],
						['The number type value NaN is coerced to a string before being encoded',
							NaN,
							'NaN'
						],
						['The number type value Infinity is coerced to a string before being encoded',
							Infinity,
							'Infinity'
						],
						['The boolean type value false is coerced to a string before being encoded',
							false,
							'false'
						],
						['A Boolean object instance is coerced to a string before being encoded',
							[new Boolean (true)],
							'true'
						],
						['A Number object instance is coerced to a string before being encoded',
							[new Number (42)],
							'42'
						],
						['A String object instance is coerced to a string before being encoded',
							[new String ('SOLAR POWER')],
							'SOLAR POWER'
						],
						['A Uize class instance is coerced to a string before being encoded',
							[Uize.Class.Value ({value:'SOLAR POWER'})],
							'SOLAR POWER'
						]
					]],
					['Uize.Util.Html.Encode.decode',[
						['Calling with empty string produces empty string',
							'',
							''
						],
						['A string that doesn\'t contain any entities is returned as is',
							'SOLAR POWER',
							'SOLAR POWER'
						],
						['When the source string contains HTML entities, all those entities are decoded',
							'&quot; &amp; &apos; &lt; &gt; &#10; &#13;',
							'" & \' < > \n \r'
						],
						['When the source string contains arbitrary character code entity, all those entities are decoded',
							'&#1234;',
							String.fromCharCode (1234)
						],
						['The value undefined is coerced to a string before being decoded',
							undefined,
							'undefined'
						],
						['The value null is coerced to a string before being decoded',
							null,
							'null'
						],
						['A number type value is coerced to a string before being decoded',
							42,
							'42'
						],
						['The number type value NaN is coerced to a string before being decoded',
							NaN,
							'NaN'
						],
						['The number type value Infinity is coerced to a string before being decoded',
							Infinity,
							'Infinity'
						],
						['The boolean type value false is coerced to a string before being decoded',
							false,
							'false'
						],
						['A Boolean object instance is coerced to a string before being decoded',
							[new Boolean (true)],
							'true'
						],
						['A Number object instance is coerced to a string before being decoded',
							[new Number (42)],
							'42'
						],
						['A String object instance is coerced to a string before being decoded',
							[new String ('SOLAR POWER')],
							'SOLAR POWER'
						],
						['A Uize class instance is coerced to a string before being decoded',
							[Uize.Class.Value ({value:'SOLAR POWER'})],
							'SOLAR POWER'
						]
					]]
				])
			]
		});
	}
});

