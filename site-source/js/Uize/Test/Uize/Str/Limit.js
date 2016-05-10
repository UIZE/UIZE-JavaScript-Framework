/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Str.Limit Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2016 UIZE
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
		The =Uize.Test.Uize.Str.Limit= module defines a suite of unit tests for the =Uize.Str.Limit= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Str.Limit',
	builder:function () {
		'use strict';

		return Uize.Test.resolve ({
			title:'Test for Uize.Str.Limit Module',
			test:[
				Uize.Test.requiredModulesTest ('Uize.Str.Limit'),
				Uize.Test.staticMethodsTest ([
					['Uize.Str.Limit.joinUsingSuffixPriority',[
						['Test when max length is greater than combined lengths of prefix and suffix',
							['prefix',' - suffix',20],
							'prefix - suffix'
						],
						['Test when max length is equal to combined lengths of prefix and suffix',
							['prefix',' - suffix',15],
							'prefix - suffix'
						],
						['Test when max length is less than combined lengths of prefix and suffix',
							['prefix',' - suffix',12],
							'pre - suffix'
						],
						['Test when max length is equal to length of suffix',
							['prefix',' - suffix',9],
							' - suffix'
						],
						['Test when max length is less than length of suffix',
							['prefix',' - suffix',6],
							' - suf'
						],
						['Test when max length is zero',
							['prefix',' - suffix',0],
							''
						],
						['Test when max length is negative',
							['prefix',' - suffix',-1],
							''
						]
					]],
					['Uize.Str.Limit.limitLength',[
						['A max length of zero produces empty string',
							['0123456789',0],
							''
						],
						['A negative max length produces empty string',
							['0123456789',-1],
							''
						],
						['A max length greater than the source string length produces the source string',
							['0123456789',15],
							'0123456789'
						],
						['A max length equal to the source string length produces the source string',
							['0123456789',10],
							'0123456789'
						],
						['A max length less than the source string length produces a truncated version of the source string',
							['0123456789',9],
							'012345...'
						],
						['A max length equal to the continuation string length produces just a truncated source string with no continuation characters',
							['0123456789',3],
							'012'
						],
						['A max length less than the continuation string length produces just a truncated source string with no continuation characters',
							['0123456789',1],
							'0'
						]
					]],
					['Uize.Str.Limit.lengthize',[
						/*** test left alignment ***/
							['When the desired length is greater than the source string length and left alignment is specified, then all necessary padding will be added on the right side',
								['foobarbazqux',16,'left'],
								'foobarbazqux    '
							],
							['When the desired length is equal to the source string length and left alignment is specified, then the source string will be returned as is',
								['foobarbazqux',12,'left'],
								'foobarbazqux'
							],
							['When the desired length is less than the source string length and left alignment is specified, then the necessary characters will be removed from the right side',
								['foobarbazqux',6,'left'],
								'foobar'
							],

						/*** test right alignment ***/
							['When the desired length is greater than the source string length and right alignment is specified, then all necessary padding will be added on the left side',
								['foobarbazqux',16,'right'],
								'    foobarbazqux'
							],
							['When the desired length is equal to the source string length and right alignment is specified, then the source string will be returned as is',
								['foobarbazqux',12,'right'],
								'foobarbazqux'
							],
							['When the desired length is less than the source string length and right alignment is specified, then the necessary characters will be removed from the left side',
								['foobarbazqux',6,'right'],
								'bazqux'
							],

						/*** test center alignment ***/
							['When the desired length is greater than the source string length and center alignment is specified, then the necessary padding will be distributed evenly on both sides',
								['foobarbazqux',16,'center'],
								'  foobarbazqux  '
							],
							['When the desired length is equal to the source string length and center alignment is specified, then the source string will be returned as is',
								['foobarbazqux',12,'center'],
								'foobarbazqux'
							],
							['When the desired length is less than the source string length and center alignment is specified, then the necessary characters will be removed evenly from both sides',
								['foobarbazqux',6,'center'],
								'barbaz'
							],

						/*** test fractional alignment ***/
							/*** test fractional alignment when truncation occurs ***/
								['When the desired length is less than the source string length and the value 0 is specified for alignment, then all of the necessary characters will be removed from the right side',
									['aaaabbbbccccddddeeee',4,0],
									'aaaa'
								],
								['When the desired length is less than the source string length and the value .25 is specified for alignment, then a quarter of the necessary characters will be removed from the left side and the other three quarters will be removed from the right side',
									['aaaabbbbccccddddeeee',4,.25],
									'bbbb'
								],
								['When the desired length is less than the source string length and the value .5 is specified for alignment, then half of the necessary characters will be removed from the left side and the other half will be removed from the right side',
									['aaaabbbbccccddddeeee',4,.5],
									'cccc'
								],
								['When the desired length is less than the source string length and the value .75 is specified for alignment, then three quarters of the necessary characters will be removed from the left side and the other quarter will be removed from the right side',
									['aaaabbbbccccddddeeee',4,.75],
									'dddd'
								],
								['When the desired length is less than the source string length and the value 1 is specified for alignment, then all of the necessary characters will be removed from the left side',
									['aaaabbbbccccddddeeee',4,1],
									'eeee'
								],

							/*** test fractional alignment when padding occurs ***/
								['When the desired length is greater than the source string length and the value 0 is specified for alignment, then all necessary padding will be added on the right side',
									['foo',7,0],
									'foo    '
								],
								['When the desired length is greater than the source string length and the value .25 is specified for alignment, then a quarter of the necessary padding will be added on the left side and the other three quarters will be added on the right side',
									['foo',7,.25],
									' foo   '
								],
								['When the desired length is greater than the source string length and the value .5 is specified for alignment, then half of the necessary padding will be added on the left side and the other half will be added on the right side',
									['foo',7,.5],
									'  foo  '
								],
								['When the desired length is greater than the source string length and the value .75 is specified for alignment, then three quarters of the necessary padding will be added on the left side and the other quarter will be added on the right side',
									['foo',7,.75],
									'   foo '
								],
								['When the desired length is greater than the source string length and the value 1 is specified for alignment, then all necessary padding will be added on the left side',
									['foo',7,1],
									'    foo'
								],

						/*** test handling of desired length less than 1 ***/
							['When the desired length is zero, then an empty string will be returned',
								['foobarbazqux',0],
								''
							],
							['When the desired length is negative, then an empty string will be returned',
								['foobarbazqux',-10],
								''
							],

						/*** miscellaneous tests ***/
							{
								title:'When no value is specified for the alignment argument, left alignment is used',
								test:function () {
									return (
										this.expect ('foobarbazqux    ',Uize.Str.Limit.lengthize ('foobarbazqux',16)) &&
										this.expect ('foobarbazqux',Uize.Str.Limit.lengthize ('foobarbazqux',12)) &&
										this.expect ('foobar',Uize.Str.Limit.lengthize ('foobarbazqux',6))
									);
								}
							},
							{
								title:'The source string may be an empty string, and padding will be added as necessary if the specified new length is greater than or equal to 1',
								test:function () {
									return (
										this.expect ('          ',Uize.Str.Limit.lengthize ('',10,'left')) &&
										this.expect ('          ',Uize.Str.Limit.lengthize ('',10,'center')) &&
										this.expect ('          ',Uize.Str.Limit.lengthize ('',10,'right')) &&
										this.expect ('',Uize.Str.Limit.lengthize ('',0)) &&
										this.expect ('',Uize.Str.Limit.lengthize ('',-10))
									);
								}
							}
					]]
				])
			]
		});
	}
});

