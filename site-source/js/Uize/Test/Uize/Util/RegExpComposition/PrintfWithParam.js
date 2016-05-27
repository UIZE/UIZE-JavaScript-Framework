/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Util.RegExpComposition.PrintfWithParam Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2016 UIZE
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
		The =Uize.Test.Uize.Util.RegExpComposition.PrintfWithParam= module defines a suite of unit tests for the =Uize.Util.RegExpComposition.PrintfWithParam= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Util.RegExpComposition.PrintfWithParam',
	required:'Uize.Class',
	builder:function () {
		'use strict';

		function _regExpCompositionTest (_title,_sourceStr,_matchOrNot) {
			return {
				title:_title,
				test:function () {
					return (
						_sourceStr.replace (Uize.Util.RegExpComposition.PrintfWithParam.get ('placeholder'),'').length ==
						(_matchOrNot ? 0 : _sourceStr.length)
					);
				}
			};
		}

		return Uize.Test.resolve ({
			title:'Test for Uize.Util.RegExpComposition.PrintfWithParam Module',
			test:[
				Uize.Test.requiredModulesTest ('Uize.Util.RegExpComposition.PrintfWithParam'),

				/*** test support for the special "%" type ***/
					_regExpCompositionTest (
						'The "%" type is supported for escaping "%" characters',
						'%%',
						true
					),
					_regExpCompositionTest (
						'The "%" type cannot be preceded by a parameter field',
						'%$1%',
						false
					),
					_regExpCompositionTest (
						'The "%" type cannot be preceded by a flag field',
						'%+%',
						false
					),
					_regExpCompositionTest (
						'The "%" type cannot be preceded by a width field',
						'%4%',
						false
					),
					_regExpCompositionTest (
						'The "%" type cannot be preceded by a precision field',
						'%.4%',
						false
					),
					_regExpCompositionTest (
						'The "%" type cannot be preceded by a length field',
						'%L%',
						false
					),

				/*** test support for the various formattable type fields ***/
					_regExpCompositionTest (
						'A printf token can have the "d" specifier for the type field',
						'%d',
						true
					),
					_regExpCompositionTest (
						'A printf token can have the "i" specifier for the type field',
						'%i',
						true
					),
					_regExpCompositionTest (
						'A printf token can have the "u" specifier for the type field',
						'%u',
						true
					),
					_regExpCompositionTest (
						'A printf token can have the "f" specifier for the type field',
						'%f',
						true
					),
					_regExpCompositionTest (
						'A printf token can have the "F" specifier for the type field',
						'%F',
						true
					),
					_regExpCompositionTest (
						'A printf token can have the "e" specifier for the type field',
						'%e',
						true
					),
					_regExpCompositionTest (
						'A printf token can have the "E" specifier for the type field',
						'%E',
						true
					),
					_regExpCompositionTest (
						'A printf token can have the "g" specifier for the type field',
						'%g',
						true
					),
					_regExpCompositionTest (
						'A printf token can have the "G" specifier for the type field',
						'%G',
						true
					),
					_regExpCompositionTest (
						'A printf token can have the "x" specifier for the type field',
						'%x',
						true
					),
					_regExpCompositionTest (
						'A printf token can have the "X" specifier for the type field',
						'%X',
						true
					),
					_regExpCompositionTest (
						'A printf token can have the "o" specifier for the type field',
						'%o',
						true
					),
					_regExpCompositionTest (
						'A printf token can have the "s" specifier for the type field',
						'%s',
						true
					),
					_regExpCompositionTest (
						'A printf token can have the "c" specifier for the type field',
						'%c',
						true
					),
					_regExpCompositionTest (
						'A printf token can have the "P" specifier for the type field',
						'%P',
						true
					),
					_regExpCompositionTest (
						'A printf token can have the "a" specifier for the type field',
						'%a',
						true
					),
					_regExpCompositionTest (
						'A printf token can have the "A" specifier for the type field',
						'%A',
						true
					),
					_regExpCompositionTest (
						'A printf token can have the "n" specifier for the type field',
						'%n',
						true
					),

				/*** test support for the width field ***/
					_regExpCompositionTest (
						'A printf token may contain an optional width field',
						'%5d',
						true
					),
					_regExpCompositionTest (
						'The optional width field in a printf token may have any number of digits',
						'%123456789d',
						true
					),

				/*** test support for the precision field ***/
					_regExpCompositionTest (
						'A printf token may contain an optional precision field',
						'%.2f',
						true
					),
					_regExpCompositionTest (
						'The optional precision field in a printf token may have any number of digits',
						'%.123456789f',
						true
					),

				/*** test support for the length field ***/
					_regExpCompositionTest (
						'A printf token can have the "hh" specifier for the length field',
						'%hhd',
						true
					),
					_regExpCompositionTest (
						'A printf token can have the "h" specifier for the length field',
						'%hd',
						true
					),
					_regExpCompositionTest (
						'A printf token can have the "l" specifier for the length field',
						'%ld',
						true
					),
					_regExpCompositionTest (
						'A printf token can have the "ll" specifier for the length field',
						'%lld',
						true
					),
					_regExpCompositionTest (
						'A printf token can have the "L" specifier for the length field',
						'%Ld',
						true
					),
					_regExpCompositionTest (
						'A printf token can have the "z" specifier for the length field',
						'%zd',
						true
					),
					_regExpCompositionTest (
						'A printf token can have the "j" specifier for the length field',
						'%jd',
						true
					),
					_regExpCompositionTest (
						'A printf token can have the "t" specifier for the length field',
						'%td',
						true
					),

				/*** test support for the flags field ***/
					/*** test support for the "-" flag ***/
						_regExpCompositionTest (
							'A printf token can have the "-" specifier for the flag field',
							'%-d',
							true
						),

						/*** test that there may not be multiple "-" flags ***/
							_regExpCompositionTest (
								'A printf token may not have multiple "-" flags',
								'%--d',
								false
							),

					/*** test support for the "+" flag ***/
						_regExpCompositionTest (
							'A printf token can have the "+" specifier for the flag field',
							'%+d',
							true
						),

						/*** test that the "+" flag can't be used for non-number types ***/
							_regExpCompositionTest (
								'The "+" flag cannot be used for the "n" type',
								'%+n',
								false
							),
							_regExpCompositionTest (
								'The "+" flag cannot be used for the "s" type',
								'%+s',
								false
							),

						/*** test that there may not be multiple "+" flags ***/
							_regExpCompositionTest (
								'A printf token may not have multiple "+" flags',
								'%++d',
								false
							),

					/*** test support for the " " flag ***/
						_regExpCompositionTest (
							'A printf token can have the " " specifier for the flag field',
							'% d',
							true
						),

						/*** test that the " " flag can't be used for non-number types ***/
							_regExpCompositionTest (
								'The " " flag cannot be used for the "n" type',
								'% n',
								false
							),
							_regExpCompositionTest (
								'The " " flag cannot be used for the "s" type',
								'% s',
								false
							),

						/*** test that there may not be multiple " " flags ***/
							_regExpCompositionTest (
								'A printf token may not have multiple " " flags',
								'%  d',
								false
							),

					/*** test support for the "#" flag ***/
						_regExpCompositionTest (
							'A printf token can have the "#" specifier for the flag field',
							'%#g',
							true
						),

						/*** test that the "#" flag can't be used for non-number types ***/
							_regExpCompositionTest (
								'The "#" flag cannot be used for the "n" type',
								'%#n',
								false
							),
							_regExpCompositionTest (
								'The "#" flag cannot be used for the "s" type',
								'%#s',
								false
							),

						/*** test that there may not be multiple "#" flags ***/
							_regExpCompositionTest (
								'A printf token may not have multiple "#" flags',
								'%##d',
								false
							),

					/*** test support for multiple flags ***/
						_regExpCompositionTest (
							'A printf token may have multiple flags',
							'%+-#d',
							true
						),
						_regExpCompositionTest (
							'A printf token may not have both "+" and " " flags, since thay are mutually exclusive',
							'%+ d',
							false
						),

				/*** test support for different combinations of parameter, flags, width, precision, and length fields ***/
					_regExpCompositionTest (
						'A printf token may have width and precision fields',
						'%5.2f',
						true
					),
					_regExpCompositionTest (
						'A printf token may have width, precision, and length fields',
						'%2.5hhd',
						true
					),
					_regExpCompositionTest (
						'A printf token may have width and length fields',
						'%2hhd',
						true
					),
					_regExpCompositionTest (
						'A printf token may have precision and length fields',
						'%.5hhd',
						true
					),
					_regExpCompositionTest (
						'A printf token may have flags, width, and precision fields',
						'%+-5.2f',
						true
					),
					_regExpCompositionTest (
						'A printf token may have flags, width, precision, and length fields',
						'%+-2.5hhd',
						true
					),
					_regExpCompositionTest (
						'A printf token may have flags, width, and length fields',
						'%+-2hhd',
						true
					),
					_regExpCompositionTest (
						'A printf token may have flags, precision, and length fields',
						'%+-.5hhd',
						true
					),

				/*** test support for the parameter field ***/
					_regExpCompositionTest (
						'A printf token may contain an optional parameter field',
						'%1$+5.2f',
						true
					),
					_regExpCompositionTest (
						'The optional parameter field in a printf token may have any number of digits',
						'%123456789$+5.2f',
						true
					)
			]
		});
	}
});

