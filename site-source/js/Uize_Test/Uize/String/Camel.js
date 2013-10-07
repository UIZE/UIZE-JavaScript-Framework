/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.String.Camel Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Test
	importance: 1
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Test.Uize.String.Camel= module defines a suite of unit tests for the =Uize.String.Camel= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.String.Camel',
	required:'Uize.Class.Value',
	builder:function () {
		'use strict';

		return Uize.Test.resolve ({
			title:'Test for Uize.String.Camel Module',
			test:[
				Uize.Test.requiredModulesTest ('Uize.String.Camel'),
				Uize.Test.staticMethodsTest ([
					['Uize.String.Camel.to',[
						['Test single lowercased word with no delimiters',
							'hello',
							'hello'
						],
						['Test single uppercased word with no delimiters',
							'HELLO',
							'hello'
						],
						['Test single lowercased word with no delimiters, but capitalize first character',
							['hello',true],
							'Hello'
						],
						['Test single uppercased word with no delimiters, but capitalize first character',
							['HELLO',true],
							'Hello'
						],
						['Test three lowercased words with space delimiters',
							'hello there john',
							'helloThereJohn'
						],
						['Test three lowercased words with space delimiters, capitalize first character',
							['hello there john',true],
							'HelloThereJohn'
						],
						['Test three uppercased words with space delimiters',
							'HELLO THERE JOHN',
							'helloThereJohn'
						],
						['Test three uppercased words with space delimiters, capitalize first character',
							['HELLO THERE JOHN',true],
							'HelloThereJohn'
						],
						['Test mixture of comma and space as delimiters',
							'city, state, zip',
							'cityStateZip'
						],
						['Test period character as delimiter',
							'www.uize.com',
							'wwwUizeCom'
						],
						['Test mixture of slashes and periods as delimiters',
							'theme/css/button.css',
							'themeCssButtonCss'
						],
						['Test hyphen character as delimiter',
							'nav-arrow-horz-next',
							'navArrowHorzNext'
						],
						['Test hyphen character as delimiter, with leading redundant hyphens',
							'--hyphens-are-cool--',
							'hyphensAreCool'
						],
						['Test specifying array instead of source string',
							[['employee address','city','state','zip']],
							'employeeAddressCityStateZip'
						]
					]]
				])
			]
		});
	}
});

