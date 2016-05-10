/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Str.Builder Class
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
		The =Uize.Test.Uize.Str.Builder= module defines a suite of unit tests for the =Uize.Str.Builder= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Str.Builder',
	required:'Uize.Data',
	builder:function () {
		'use strict';

		function _getHelloStringBuilderAppended () {
			var _stringBuilder = Uize.Str.Builder ();
			_stringBuilder.append ('H');
			_stringBuilder.append ('e');
			_stringBuilder.append ('l');
			_stringBuilder.append ('l');
			_stringBuilder.append ('o');

			return _stringBuilder;
		}

		return Uize.Test.resolve ({
			title:'Test for Uize.Str.Builder Module',
			test:[
				Uize.Test.requiredModulesTest ('Uize.Str.Builder'),
				{
					title:'Test creating an instance with no constructor arguments (should initialize to empty string)',
					test:function () {
						var _stringBuilder = Uize.Str.Builder ();
						return this.expect (0,_stringBuilder.length) && this.expect ('',_stringBuilder.valueOf ());
					}
				},
				{
					title:'Test creating an instance with a non-empty string as initial value',
					test:function () {
						var _stringBuilder = Uize.Str.Builder ('hello');
						return this.expect (5,_stringBuilder.length) && this.expect ('hello',_stringBuilder.valueOf ());
					}
				},
				{
					title:'Test creating an instance with a number as initial value',
					test:function () {
						return this.expect ('1234567',(Uize.Str.Builder (1234567)).valueOf ());
					}
				},
				{
					title:'Test creating an instance with a boolean as initial value',
					test:function () {
						return this.expect ('true',(Uize.Str.Builder (true)).valueOf ());
					}
				},
				{
					title:'Test that equals instance method works when strings are equal',
					test:function () {
						return this.expect (true,(Uize.Str.Builder ('hello')).equals ('hello'));
					}
				},
				{
					title:'Test that equals instance method works with no parameters (i.e. testing for empty string)',
					test:function () {
						return (
							this.expect (true,Uize.Str.Builder ().equals ()) &&
							this.expect (false,Uize.Str.Builder ('hello').equals ())
						);
					}
				},
				{
					title:'Test that equals instance method works when strings are not equal',
					test:function () {
						return this.expect (false,Uize.Str.Builder ('hello').equals ('goodbye'));
					}
				},
				{
					title:'The getValue, valueOf, and toString instance methods all return the same result',
					test:function () {
						var _stringBuilder = Uize.Str.Builder ('hello');
						return (
							this.expect ('hello',_stringBuilder.getValue ()) &&
							this.expect ('hello',_stringBuilder.valueOf ()) &&
							this.expect ('hello',_stringBuilder.toString ())
						);
					}
				},
				{
					title:'A string builder instance can be coerced to a string',
					test:function () {
						return this.expect ('hello',Uize.Str.Builder ('hello') + '');
					}
				},
				{
					title:'Test that append instance method works correctly',
					test:function () {
						var _stringBuilder = Uize.Str.Builder ();
						_stringBuilder.append ('h');
						_stringBuilder.append ('e');
						_stringBuilder.append ('l');
						_stringBuilder.append ('l');
						_stringBuilder.append ('o');
						return this.expect (5,_stringBuilder.length) && this.expect ('hello',_stringBuilder.valueOf ());
					}
				},
				{
					title:'Test that prepend instance method works correctly',
					test:function () {
						var _stringBuilder = Uize.Str.Builder ();
						_stringBuilder.prepend ('o');
						_stringBuilder.prepend ('l');
						_stringBuilder.prepend ('l');
						_stringBuilder.prepend ('e');
						_stringBuilder.prepend ('h');
						return this.expect (5,_stringBuilder.length) && this.expect ('hello',_stringBuilder.valueOf ());
					}
				},
				{
					title:'Test that append and prepend instance methods work correctly in combination',
					test:function () {
						var _stringBuilder = Uize.Str.Builder ();
						_stringBuilder.append ('l');
						_stringBuilder.prepend ('e');
						_stringBuilder.append ('l');
						_stringBuilder.prepend ('h');
						_stringBuilder.append ('o');
						return this.expect (5,_stringBuilder.length) && this.expect ('hello',_stringBuilder.valueOf ());
					}
				},
				{
					title:'A number type value can be appended',
					test:function () {
						var _stringBuilder = Uize.Str.Builder (123);
						_stringBuilder.append (4567);
						return this.expect (7,_stringBuilder.length) && this.expect ('1234567',_stringBuilder.valueOf ());
					}
				},
				{
					title:'A boolean type value can be appended',
					test:function () {
						var _stringBuilder = Uize.Str.Builder (false);
						_stringBuilder.append (true);
						return this.expect (9,_stringBuilder.length) && this.expect ('falsetrue',_stringBuilder.valueOf ());
					}
				},
				{
					title:'A number type value can be prepended',
					test:function () {
						var _stringBuilder = Uize.Str.Builder (4567);
						_stringBuilder.prepend (123);
						return this.expect (7,_stringBuilder.length) && this.expect ('1234567',_stringBuilder.valueOf ());
					}
				},
				{
					title:'A boolean type value can be prepended',
					test:function () {
						var _stringBuilder = Uize.Str.Builder (true);
						_stringBuilder.prepend (false);
						return this.expect (9,_stringBuilder.length) && this.expect ('falsetrue',_stringBuilder.valueOf ());
					}
				},
				{
					title:'Test that clear instance method works correctly',
					test:function () {
						var _stringBuilder = Uize.Str.Builder ('hello');
						_stringBuilder.clear ();
						return this.expect (0,_stringBuilder.length) && this.expect ('',_stringBuilder.valueOf ());
					}
				},
				{
					title:'Test that setValue instance method with non-empty string works correctly',
					test:function () {
						var _stringBuilder = Uize.Str.Builder ('hello');
						_stringBuilder.setValue ('goodbye');
						return this.expect (7,_stringBuilder.length) && this.expect ('goodbye',_stringBuilder.valueOf ());
					}
				},
				{
					title:'Test that setValue instance method with no parameters works correctly',
					test:function () {
						var _stringBuilder = Uize.Str.Builder ('hello');
						_stringBuilder.setValue ();
						return this.expect (0,_stringBuilder.length) && this.expect ('',_stringBuilder.valueOf ());
					}
				},
				{
					title:'Test that setValue instance method with number value works correctly',
					test:function () {
						var _stringBuilder = Uize.Str.Builder ('hello');
						_stringBuilder.setValue (1234567);
						return this.expect (7,_stringBuilder.length) && this.expect ('1234567',_stringBuilder.valueOf ());
					}
				},
				{
					title:'Test that setValue instance method with boolean value works correctly',
					test:function () {
						var _stringBuilder = Uize.Str.Builder ('hello');
						_stringBuilder.setValue (true);
						return this.expect (4,_stringBuilder.length) && this.expect ('true',_stringBuilder.valueOf ());
					}
				},
				{
					title:'Test that charAt instance method works correctly',
					test:function () {return this.expect ('o',_getHelloStringBuilderAppended ().charAt (4))}
				},
				{
					title:'Test that charCodeAt instance method works correctly',
					test:function () {return this.expect (111,_getHelloStringBuilderAppended ().charCodeAt (4))}
				},
				{
					title:'Test that concat instance method works correctly',
					test:function () {
						return this.expect ('Hello there you',_getHelloStringBuilderAppended ().concat (' there',' you'));
					}
				},
				{
					title:'Test that indexOf instance method works correctly',
					test:function () {return this.expect (2,_getHelloStringBuilderAppended ().indexOf ('l'))}
				},
				{
					title:'Test that lastIndexOf instance method works correctly',
					test:function () {return this.expect (3,_getHelloStringBuilderAppended ().lastIndexOf ('l'))}
				},
				{
					title:'Test that match instance method works correctly',
					test:function () {return this.expect ('ll',_getHelloStringBuilderAppended ().match (/l+/) [0])}
				},
				{
					title:'Test that replace instance method works correctly',
					test:function () {return this.expect ('Heo',_getHelloStringBuilderAppended ().replace (/l+/,''))}
				},
				{
					title:'Test that search instance method works correctly',
					test:function () {return this.expect (2,_getHelloStringBuilderAppended ().search (/l+/))}
				},
				{
					title:'Test that slice instance method works correctly',
					test:function () {return this.expect ('el',_getHelloStringBuilderAppended ().slice (1,3))}
				},
				{
					title:'Test that split instance method works correctly',
					test:function () {
						return this.expect (['H','e','l','l','o'],_getHelloStringBuilderAppended ().split (''));
					}
				},
				{
					title:'Test that substr instance method works correctly',
					test:function () {return this.expect ('el',_getHelloStringBuilderAppended ().substr (1,2))}
				},
				{
					title:'Test that substring instance method works correctly',
					test:function () {return this.expect ('e',_getHelloStringBuilderAppended ().substring (1,2))}
				},
				{
					title:'Test that toLowerCase instance method works correctly',
					test:function () {return this.expect ('hello',_getHelloStringBuilderAppended ().toLowerCase ())}
				},
				{
					title:'Test the HTML related instance methods to make sure they work correctly',
					test:function () {
						return (
							this.expect ('Hello'.anchor ('blah'),_getHelloStringBuilderAppended ().anchor ('blah')) &&
							this.expect ('Hello'.big (),_getHelloStringBuilderAppended ().big ()) &&
							this.expect ('Hello'.blink (),_getHelloStringBuilderAppended ().blink ()) &&
							this.expect ('Hello'.bold (),_getHelloStringBuilderAppended ().bold ()) &&
							this.expect ('Hello'.fixed (),_getHelloStringBuilderAppended ().fixed ()) &&
							this.expect ('Hello'.fontcolor ('FFFFFF'),_getHelloStringBuilderAppended ().fontcolor ('FFFFFF')) &&
							this.expect ('Hello'.fontsize ('12px'),_getHelloStringBuilderAppended ().fontsize ('12px')) &&
							this.expect ('Hello'.italics (),_getHelloStringBuilderAppended ().italics ()) &&
							this.expect ('Hello'.link ('uize.com'),_getHelloStringBuilderAppended ().link ('uize.com')) &&
							this.expect ('Hello'.small (),_getHelloStringBuilderAppended ().small ()) &&
							this.expect ('Hello'.strike (),_getHelloStringBuilderAppended ().strike ()) &&
							this.expect ('Hello'.sub (),_getHelloStringBuilderAppended ().sub ()) &&
							this.expect ('Hello'.sup (),_getHelloStringBuilderAppended ().sup ())
						);
					}
				}
			]
		});
	}
});

