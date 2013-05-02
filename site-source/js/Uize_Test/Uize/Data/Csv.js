/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Data.Csv Class
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
		The =Uize.Test.Uize.Data.Csv= module defines a suite of unit tests for the =Uize.Data.Csv= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Data.Csv',
	builder:function () {
		'use strict';

		return Uize.Test.declare ({
			title:'Uize.Data.Csv Module Test',
			test:[
				Uize.Test.requiredModulesTest ('Uize.Data.Csv'),
				Uize.Test.staticMethodsTest ([
					['Uize.Data.Csv.from',[
						['Default Decoding Options',
							[
								'"John ""Willy""",Wilkey,(650) 123-4567\n' +
								'Marie, Stevenson ,"(415) 456-7890, Ext. 214"\n' +
								'Craig,Pollack,"(310) 987-6543\n(650) 303-1000"',
							],
							[
								['John "Willy"','Wilkey','(650) 123-4567'],
								['Marie',' Stevenson ','(415) 456-7890, Ext. 214'],
								['Craig','Pollack','(310) 987-6543\n(650) 303-1000']
							]
						],
						['Padding After Value Separator Comma, Trim Padding On Parse',
							[
								'John, Wilkey, (650) 123-4567\n' +
								'Marie, Stevenson, (415) 456-7890\n' +
								'Craig, Pollack, (310) 987-6543',
								{trimPaddingOnParse:true}
							],
							[
								['John','Wilkey','(650) 123-4567'],
								['Marie','Stevenson','(415) 456-7890'],
								['Craig','Pollack','(310) 987-6543']
							]
						],
						['No Header Row, Column Names Explicitly Specified',
							[
								'John,Wilkey,(650) 123-4567\n' +
								'Marie,Stevenson,(415) 456-7890\n' +
								'Craig,Pollack,(310) 987-6543',
								{columns:['firstName','lastName','phone']}
							],
							[
								{firstName:'John',lastName:'Wilkey',phone:'(650) 123-4567'},
								{firstName:'Marie',lastName:'Stevenson',phone:'(415) 456-7890'},
								{firstName:'Craig',lastName:'Pollack',phone:'(310) 987-6543'}
							]
						],
						['With Header Row',
							[
								'firstName,lastName,phone\n' +
								'John,Wilkey,(650) 123-4567\n' +
								'Marie,Stevenson,(415) 456-7890\n' +
								'Craig,Pollack,(310) 987-6543',
								{hasHeader:true}
							],
							[
								{firstName:'John',lastName:'Wilkey',phone:'(650) 123-4567'},
								{firstName:'Marie',lastName:'Stevenson',phone:'(415) 456-7890'},
								{firstName:'Craig',lastName:'Pollack',phone:'(310) 987-6543'}
							]
						],
						['With Header Row, Rows Are Arrays',
							[
								'firstName,lastName,phone\n' +
								'John,Wilkey,(650) 123-4567\n' +
								'Marie,Stevenson,(415) 456-7890\n' +
								'Craig,Pollack,(310) 987-6543',
								{hasHeader:true,rowType:'array'}
							],
							[
								['John','Wilkey','(650) 123-4567'],
								['Marie','Stevenson','(415) 456-7890'],
								['Craig','Pollack','(310) 987-6543']
							]
						],
						{
							title:'With Header Row, Rows Are Arrays, Get Back Column Names',
							test:function () {
								var _columnNames = [];
								return this.expect (
									true,
									Uize.Data.identical (
										Uize.Data.Csv.from (
											'firstName,lastName,phone\n' +
											'John,Wilkey,(650) 123-4567\n' +
											'Marie,Stevenson,(415) 456-7890\n' +
											'Craig,Pollack,(310) 987-6543',
											{hasHeader:true,rowType:'array',columns:_columnNames}
										),
										[
											['John','Wilkey','(650) 123-4567'],
											['Marie','Stevenson','(415) 456-7890'],
											['Craig','Pollack','(310) 987-6543']
										]
									)
									&&
									Uize.Data.identical (_columnNames,['firstName','lastName','phone'])
								);
							}
						},
						['Values Quoted Using Single Quotes',
							[
								'\'John\',\'Wilkey\',\'(650) 123-4567\'\n' +
								'\'Marie\',\'Stevenson\',\'(415) 456-7890\'\n' +
								'\'Craig\',\'Pollack\',\'(310) 987-6543\'',
								{quoteChar:'\''}
							],
							[
								['John','Wilkey','(650) 123-4567'],
								['Marie','Stevenson','(415) 456-7890'],
								['Craig','Pollack','(310) 987-6543']
							]
						],
						['Pipe Used As a Value Delimiter',
							[
								'John|Wilkey|(650) 123-4567\n' +
								'Marie|Stevenson|(415) 456-7890\n' +
								'Craig|Pollack|(310) 987-6543',
								{valueDelimiter:'|'}
							],
							[
								['John','Wilkey','(650) 123-4567'],
								['Marie','Stevenson','(415) 456-7890'],
								['Craig','Pollack','(310) 987-6543']
							]
						],
						['Space As Value Delimiter, Values Quoted Using Hash',
							[
								'#John# #Wilkey# #(650) 123-4567#\n' +
								'#Marie# #Stevenson# #(415) 456-7890#\n' +
								'#Craig# #Pollack# #(310) 987-6543#',
								{quoteChar:'#',valueDelimiter:' '}
							],
							[
								['John','Wilkey','(650) 123-4567'],
								['Marie','Stevenson','(415) 456-7890'],
								['Craig','Pollack','(310) 987-6543']
							]
						]
					]],
					['Uize.Data.Csv.to',[
						['Default Encoding Options',
							[
								[
									['John','Wilkey','(650) 123-4567'],
									['Marie','Stevenson','(415) 456-7890'],
									['Craig','Pollack','(310) 987-6543']
								]
							],
							'John,Wilkey,(650) 123-4567\n' +
							'Marie,Stevenson,(415) 456-7890\n' +
							'Craig,Pollack,(310) 987-6543'
						],
						['Default Encoding Options, Values Needing Quotes',
							[
								[
									['John "Willy"','Wilkey','(650) 123-4567'],
									['Marie','Stevenson','(415) 456-7890, Ext. 214'],
									['Craig','Pollack','(310) 987-6543\n(650) 303-1000']
								]
							],
							'"John ""Willy""",Wilkey,(650) 123-4567\n' +
							'Marie,Stevenson,"(415) 456-7890, Ext. 214"\n' +
							'Craig,Pollack,"(310) 987-6543\n' +
							'(650) 303-1000"'
						],
						['Default Encoding Options, Values With Padding',
							[
								[
									['John',' Wilkey ','(650) 123-4567'],
									['Marie',' Stevenson ','(415) 456-7890'],
									['Craig',' Pollack ','(310) 987-6543']
								]
							],
							'John, Wilkey ,(650) 123-4567\n' +
							'Marie, Stevenson ,(415) 456-7890\n' +
							'Craig, Pollack ,(310) 987-6543'
						],
						['Values With Padding, Trim Padding On Parse',
							[
								[
									['John',' Wilkey ','(650) 123-4567'],
									['Marie',' Stevenson ','(415) 456-7890'],
									['Craig',' Pollack ','(310) 987-6543']
								],
								{trimPaddingOnParse:true}
							],
							'John," Wilkey ",(650) 123-4567\n' +
							'Marie," Stevenson ",(415) 456-7890\n' +
							'Craig," Pollack ",(310) 987-6543'
						],
						['With Header Row, Column Names Explicitly Specified',
							[
								[
									['John','Wilkey','(650) 123-4567'],
									['Marie','Stevenson','(415) 456-7890'],
									['Craig','Pollack','(310) 987-6543']
								],
								{
									hasHeader:true,
									columns:['firstName','lastName','phone']
								}
							],
							'firstName,lastName,phone\n' +
							'John,Wilkey,(650) 123-4567\n' +
							'Marie,Stevenson,(415) 456-7890\n' +
							'Craig,Pollack,(310) 987-6543'
						],
						['With Header Row, Rows Are Objects, Column Names From Object Keys',
							[
								[
									{phone:'(650) 123-4567',lastName:'Wilkey',firstName:'John'},
									{firstName:'Marie',lastName:'Stevenson',phone:'(415) 456-7890'},
									{firstName:'Craig',lastName:'Pollack',phone:'(310) 987-6543'}
								],
								{hasHeader:true}
							],
							'phone,lastName,firstName\n' +
							'(650) 123-4567,Wilkey,John\n' +
							'(415) 456-7890,Stevenson,Marie\n' +
							'(310) 987-6543,Pollack,Craig'
						],
						['With Header Row, Rows Are Objects, Column Order Specified',
							[
								[
									{phone:'(650) 123-4567',lastName:'Wilkey',firstName:'John'},
									{firstName:'Marie',lastName:'Stevenson',phone:'(415) 456-7890'},
									{firstName:'Craig',lastName:'Pollack',phone:'(310) 987-6543'}
								],
								{
									hasHeader:true,
									columns:['firstName','lastName','phone']
								}
							],
							'firstName,lastName,phone\n' +
							'John,Wilkey,(650) 123-4567\n' +
							'Marie,Stevenson,(415) 456-7890\n' +
							'Craig,Pollack,(310) 987-6543'
						],
						['With Header Row, Rows Are Objects, Subset of Columns',
							[
								[
									{phone:'(650) 123-4567',lastName:'Wilkey',firstName:'John'},
									{firstName:'Marie',lastName:'Stevenson',phone:'(415) 456-7890'},
									{firstName:'Craig',lastName:'Pollack',phone:'(310) 987-6543'}
								],
								{
									hasHeader:true,
									columns:['firstName','lastName']
								}
							],
							'firstName,lastName\n' +
							'John,Wilkey\n' +
							'Marie,Stevenson\n' +
							'Craig,Pollack'
						],
						['With Header Row, Columns Are Indices',
							[
								[
									['John','Wilkey','(650) 123-4567'],
									['Marie','Stevenson','(415) 456-7890'],
									['Craig','Pollack','(310) 987-6543']
								],
								{hasHeader:true}
							],
							'0,1,2\n' +
							'John,Wilkey,(650) 123-4567\n' +
							'Marie,Stevenson,(415) 456-7890\n' +
							'Craig,Pollack,(310) 987-6543'
						],
						['Always Quote Values',
							[
								[
									['John','Wilkey','(650) 123-4567'],
									['Marie','Stevenson','(415) 456-7890'],
									['Craig','Pollack','(310) 987-6543']
								],
								{whenToQuoteValues:'always'}
							],
							'"John","Wilkey","(650) 123-4567"\n' +
							'"Marie","Stevenson","(415) 456-7890"\n' +
							'"Craig","Pollack","(310) 987-6543"'
						],
						['Always Quote Values, Using Single Quotes',
							[
								[
									['John','Wilkey','(650) 123-4567'],
									['Marie','Stevenson','(415) 456-7890'],
									['Craig','Pollack','(310) 987-6543']
								],
								{whenToQuoteValues:'always',quoteChar:'\''}
							],
							'\'John\',\'Wilkey\',\'(650) 123-4567\'\n' +
							'\'Marie\',\'Stevenson\',\'(415) 456-7890\'\n' +
							'\'Craig\',\'Pollack\',\'(310) 987-6543\''
						],
						['Use Pipe As a Value Delimiter',
							[
								[
									['John','Wilkey','(650) 123-4567'],
									['Marie','Stevenson','(415) 456-7890'],
									['Craig','Pollack','(310) 987-6543']
								],
								{valueDelimiter:'|'}
							],
							'John|Wilkey|(650) 123-4567\n' +
							'Marie|Stevenson|(415) 456-7890\n' +
							'Craig|Pollack|(310) 987-6543'
						],
						['Space As Value Delimiter, Quote Values Using Hash',
							[
								[
									['John','Wilkey','(650) 123-4567'],
									['Marie','Stevenson','(415) 456-7890'],
									['Craig','Pollack','(310) 987-6543']
								],
								{quoteChar:'#',valueDelimiter:' '}
							],
							'#John# #Wilkey# #(650) 123-4567#\n' +
							'#Marie# #Stevenson# #(415) 456-7890#\n' +
							'#Craig# #Pollack# #(310) 987-6543#'
						],
						['Value Delimiter Contains Whitespace',
							[
								[
									['John','Wilkey','(650) 123-4567'],
									['Marie','Stevenson','(415) 456-7890'],
									['Craig','Pollack','(310) 987-6543']
								],
								{valueDelimiter:', '}
							],
							'"John", "Wilkey", "(650) 123-4567"\n' +
							'"Marie", "Stevenson", "(415) 456-7890"\n' +
							'"Craig", "Pollack", "(310) 987-6543"'
						],
						['Value Delimiter Contains Whitespace, Trim Padding on Parse',
							[
								[
									['John','Wilkey','(650) 123-4567'],
									['Marie','Stevenson','(415) 456-7890'],
									['Craig',' Pollack ','(310) 987-6543']
								],
								{valueDelimiter:', ',trimPaddingOnParse:true}
							],
							'John, Wilkey, (650) 123-4567\n' +
							'Marie, Stevenson, (415) 456-7890\n' +
							'Craig, " Pollack ", (310) 987-6543'
						]
					]]
				])
			]
		});
	}
});

