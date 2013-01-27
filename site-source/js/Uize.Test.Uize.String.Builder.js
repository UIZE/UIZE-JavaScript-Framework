/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.String.Builder Class
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
		The =Uize.Test.Uize.String.Builder= module defines a suite of unit tests for the =Uize.String.Builder= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.String.Builder',
	required:'Uize.Data',
	builder:function () {
		'use strict';

		function _getHelloStringBuilderAppended () {
			var _stringBuilder = Uize.String.Builder ();
			_stringBuilder.append ('H');
			_stringBuilder.append ('e');
			_stringBuilder.append ('l');
			_stringBuilder.append ('l');
			_stringBuilder.append ('o');

			return _stringBuilder;
		}

		return Uize.Test.declare ({
			title:'Test for Uize.String.Builder Module',
			test:[
				Uize.Test.requiredModulesTest ('Uize.String.Builder'),
				{
					title:'Test creating an instance with no constructor arguments (should initialize to empty string)',
					test:function () {
						var _stringBuilder = Uize.String.Builder ();
						return _stringBuilder.length === 0 && _stringBuilder.valueOf () === '';
					}
				},
				{
					title:'Test creating an instance with a non-empty string as initial value',
					test:function () {
						var _stringBuilder = Uize.String.Builder ('hello');
						return _stringBuilder.length === 5 && _stringBuilder.valueOf () == 'hello';
					}
				},
				{
					title:'Test creating an instance with a number as initial value',
					test:function () {return (Uize.String.Builder (1234567)).valueOf () === '1234567'}
				},
				{
					title:'Test creating an instance with a boolean as initial value',
					test:function () {return (Uize.String.Builder (true)).valueOf () === 'true'}
				},
				{
					title:'Test that equals instance method works when strings are equal',
					test:function () {return (Uize.String.Builder ('hello')).equals ('hello')}
				},
				{
					title:'Test that equals instance method works with no parameters (ie. testing for empty string)',
					test:function () {
						return Uize.String.Builder ().equals () && !Uize.String.Builder ('hello').equals ();
					}
				},
				{
					title:'Test that equals instance method works when strings are not equal',
					test:function () {return !Uize.String.Builder ('hello').equals ('goodbye')}
				},
				{
					title:'Test that getValue, valueOf, and toString instance methods all return the same result',
					test:function () {
						var _stringBuilder = Uize.String.Builder ('hello');
						return (
							_stringBuilder.getValue () == 'hello' &&
							_stringBuilder.valueOf () == 'hello' &&
							_stringBuilder.toString () == 'hello'
						);
					}
				},
				{
					title:'Test that coercion of instance to string works correctly',
					test:function () {return Uize.String.Builder ('hello') + '' == 'hello'}
				},
				{
					title:'Test that append instance method works correctly',
					test:function () {
						var _stringBuilder = Uize.String.Builder ();
						_stringBuilder.append ('h');
						_stringBuilder.append ('e');
						_stringBuilder.append ('l');
						_stringBuilder.append ('l');
						_stringBuilder.append ('o');
						return _stringBuilder.length === 5 && _stringBuilder.valueOf () == 'hello';
					}
				},
				{
					title:'Test that prepend instance method works correctly',
					test:function () {
						var _stringBuilder = Uize.String.Builder ();
						_stringBuilder.prepend ('o');
						_stringBuilder.prepend ('l');
						_stringBuilder.prepend ('l');
						_stringBuilder.prepend ('e');
						_stringBuilder.prepend ('h');
						return _stringBuilder.length === 5 && _stringBuilder.valueOf () == 'hello';
					}
				},
				{
					title:'Test that append and prepend instance methods work correctly in combination',
					test:function () {
						var _stringBuilder = Uize.String.Builder ();
						_stringBuilder.append ('l');
						_stringBuilder.prepend ('e');
						_stringBuilder.append ('l');
						_stringBuilder.prepend ('h');
						_stringBuilder.append ('o');
						return _stringBuilder.length === 5 && _stringBuilder.valueOf () == 'hello';
					}
				},
				{
					title:'Test that appending a number value works correctly',
					test:function () {
						var _stringBuilder = Uize.String.Builder (123);
						_stringBuilder.append (4567);
						return _stringBuilder.length === 7 && _stringBuilder.valueOf () == '1234567';
					}
				},
				{
					title:'Test that appending a boolean value works correctly',
					test:function () {
						var _stringBuilder = Uize.String.Builder (false);
						_stringBuilder.append (true);
						return _stringBuilder.length === 9 && _stringBuilder.valueOf () == 'falsetrue';
					}
				},
				{
					title:'Test that prepending a number value works correctly',
					test:function () {
						var _stringBuilder = Uize.String.Builder (4567);
						_stringBuilder.prepend (123);
						return _stringBuilder.length === 7 && _stringBuilder.valueOf () == '1234567';
					}
				},
				{
					title:'Test that prepending a boolean value works correctly',
					test:function () {
						var _stringBuilder = Uize.String.Builder (true);
						_stringBuilder.prepend (false);
						return _stringBuilder.length === 9 && _stringBuilder.valueOf () == 'falsetrue';
					}
				},
				{
					title:'Test that clear instance method works correctly',
					test:function () {
						var _stringBuilder = Uize.String.Builder ('hello');
						_stringBuilder.clear ();
						return _stringBuilder.length === 0 && _stringBuilder.valueOf () === '';
					}
				},
				{
					title:'Test that setValue instance method with non-empty string works correctly',
					test:function () {
						var _stringBuilder = Uize.String.Builder ('hello');
						_stringBuilder.setValue ('goodbye');
						return _stringBuilder.length === 7 && _stringBuilder.valueOf () == 'goodbye';
					}
				},
				{
					title:'Test that setValue instance method with no parameters works correctly',
					test:function () {
						var _stringBuilder = Uize.String.Builder ('hello');
						_stringBuilder.setValue ();
						return _stringBuilder.length === 0 && _stringBuilder.valueOf () === '';
					}
				},
				{
					title:'Test that setValue instance method with number value works correctly',
					test:function () {
						var _stringBuilder = Uize.String.Builder ('hello');
						_stringBuilder.setValue (1234567);
						return _stringBuilder.length === 7 && _stringBuilder.valueOf () === '1234567';
					}
				},
				{
					title:'Test that setValue instance method with boolean value works correctly',
					test:function () {
						var _stringBuilder = Uize.String.Builder ('hello');
						_stringBuilder.setValue (true);
						return _stringBuilder.length === 4 && _stringBuilder.valueOf () === 'true';
					}
				},
				{
					title:'Test that charAt instance method works correctly',
					test:function () {return _getHelloStringBuilderAppended ().charAt (4) == 'o'}
				},
				{
					title:'Test that charCodeAt instance method works correctly',
					test:function () {return _getHelloStringBuilderAppended ().charCodeAt (4) == 111}
				},
				{
					title:'Test that concat instance method works correctly',
					test:function () {return _getHelloStringBuilderAppended ().concat (' there',' you') == 'Hello there you'}
				},
				{
					title:'Test that indexOf instance method works correctly',
					test:function () {return _getHelloStringBuilderAppended ().indexOf ('l') == 2}
				},
				{
					title:'Test that lastIndexOf instance method works correctly',
					test:function () {return _getHelloStringBuilderAppended ().lastIndexOf ('l') == 3}
				},
				{
					title:'Test that match instance method works correctly',
					test:function () {return _getHelloStringBuilderAppended ().match (/l+/) [0] == 'll'}
				},
				{
					title:'Test that replace instance method works correctly',
					test:function () {return _getHelloStringBuilderAppended ().replace (/l+/,'') == 'Heo'}
				},
				{
					title:'Test that search instance method works correctly',
					test:function () {return _getHelloStringBuilderAppended ().search (/l+/) == 2}
				},
				{
					title:'Test that slice instance method works correctly',
					test:function () {return _getHelloStringBuilderAppended ().slice (1,3) == 'el'}
				},
				{
					title:'Test that split instance method works correctly',
					test:function () {
						return Uize.Data.identical (_getHelloStringBuilderAppended ().split (''),['H','e','l','l','o'])
					}
				},
				{
					title:'Test that substr instance method works correctly',
					test:function () {return _getHelloStringBuilderAppended ().substr (1,2) == 'el'}
				},
				{
					title:'Test that substring instance method works correctly',
					test:function () {return _getHelloStringBuilderAppended ().substring (1,2) == 'e'}
				},
				{
					title:'Test that toLowerCase instance method works correctly',
					test:function () {return _getHelloStringBuilderAppended ().toLowerCase () == 'hello'}
				},
				{
					title:'Test the HTML related instance methods to make sure they work correctly',
					test:function () {
						return !!(
							_getHelloStringBuilderAppended ().anchor ('blah') == 'Hello'.anchor ('blah') &&
							_getHelloStringBuilderAppended ().big () == 'Hello'.big () &&
							_getHelloStringBuilderAppended ().blink () == 'Hello'.blink () &&
							_getHelloStringBuilderAppended ().bold () == 'Hello'.bold () &&
							_getHelloStringBuilderAppended ().fixed () == 'Hello'.fixed () &&
							_getHelloStringBuilderAppended ().fontcolor ('FFFFFF') == 'Hello'.fontcolor ('FFFFFF') &&
							_getHelloStringBuilderAppended ().fontsize ('12px') == 'Hello'.fontsize ('12px') &&
							_getHelloStringBuilderAppended ().italics () == 'Hello'.italics () &&
							_getHelloStringBuilderAppended ().link ('uize.com') == 'Hello'.link ('uize.com') &&
							_getHelloStringBuilderAppended ().small () == 'Hello'.small () &&
							_getHelloStringBuilderAppended ().strike () == 'Hello'.strike () &&
							_getHelloStringBuilderAppended ().sub () == 'Hello'.sub () &&
							_getHelloStringBuilderAppended ().sup () == 'Hello'.sup ()
						);
					}
				}
			]
		});
	}
});

