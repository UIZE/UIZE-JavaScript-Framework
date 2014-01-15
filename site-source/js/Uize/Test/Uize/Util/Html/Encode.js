/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Util.Html.Encode Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2014 UIZE
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
					['Uize.Util.Html.Encode.decode',[
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
					]]
				])
			]
		});
	}
});

