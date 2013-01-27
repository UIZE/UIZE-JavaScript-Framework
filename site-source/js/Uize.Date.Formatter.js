/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Date.Formatter Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2009-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 4
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Date.Formatter= module provides methods for formatting and parsing date strings, supporting a wide variety of different formatting options.

		*DEVELOPERS:* `Chris van Rensburg`

		In a Nutshell
			The =Uize.Date.Formatter= module is a package under the =Uize.Date= namespace.

			Date Component
				For the purposes of discussing the formatting of date strings, a date is comprised of multiple date components, such as year, month, month name, day, day name, hour, minutes, etc.

				For each Date Component there is a corresponding `date component token` that can be used within a `date format` string to indicate the placement for the value for that component.

			Date Component Token
				A date component token is one of the many available `date component tokens` that can appear inside a `date format` string and that indicate where `date component` values should be placed.

				Date component tokens are comprised of a `date component` name enclosed inside curly braces. For example, the date component token for the year formatted using four digits is ={YYYY}=.

			Date Component Token Value
				A date component token value is a value for a specific `date component token` for a specific date.

				For example, for the date September 11th, 2001, the date component token value for the ={monthName}= date component token would be ='September'=, while the date component token value for the ={YYYY}= date component token would be ='2001'=. When `formatting a date string`, every `date component token` in a `date format` string will be replaced with the date component token value for the specific date being formatted. Conversely, when `parsing a date string`, a date component token value is "captured" for every date component token in the date format string, after which a date object is produced by combining the values for all the components of the date together.

			Date Component Tokens
				The =Uize.Date.Formatter= module supports the following date component tokens...

				{date}
					The full date, as serialized by JavaScript's built-in =Date= object.

					NOTES
					- the =Uize.Date.Formatter.parse= method does currently not support parsing the ={date}= `date component token`
					- because the value for this token is serialized by the built-in =Date= object, the exact formatting may vary depending on the JavaScript interpreter being used

				{YYYY}
					The full year, represented using four digits, where leading zeros will be added as needed for dates before the year 1000.

				{YY}
					The year, represented using only two digits (ie. only year of century).

					When `parsing a date string` where the year is represented using the ={YY}= token, the year is assumed to be in the 20th century (ie. the value =99= represents the year 1999). When `formatting a date string` where the year is represented using the ={YY}= token, century information will be lost. Therefore, this token can only be safely used in a `date format` that will be applied to dates in the 20th century.

				{MM}
					The month number, represented always using two digits (ie. leading =0= if necessary), where January is represented by the value =01=, and where December is represented by the value =12=.

				{monthNo}
					The month number, represented using only as many digits as necessary (ie. no leading =0=), where January is represented by the value =1=, and where December is represented by the value =12=.

				{monthName}
					The full name of the month, as registered in the =Uize.Date.monthNames= static property of the =Uize.Date= module.

					Unless overriding the value of the =Uize.Date.monthNames= static property, the month names will be the English names January, February, March, April, May, June, July, August, September, October, November, and December.

				{shortMonthName}
					The short name of the month, as registered in the =Uize.Date.shortMonthNames= static property of the =Uize.Date= module.

					Unless overriding the value of the =Uize.Date.shortMonthNames= static property, the short month names will be derived from the English month names, as Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, and Dec.

				{DD}
					The day number, represented always using two digits (ie. leading =0= if necessary), where the first day of any month is represented by the value =01=, and where the last day of the month January is represented by the value =31=.

				{dayNo}
					The day number, represented using only as many digits as necessary (ie. no leading =0=), where the first day of any month is represented by the value =1=, and where the last day of the month January is represented by the value =31=.

				{dayNoSuffix}
					An English language suffix that can be appended after the value for the ={dayNo}= token in order to produce friendlier and more human readable date strings.

					The suffixes ='st'=, ='nd'=, ='rd'=, and ='th'= are registered in the =Uize.Date.dayNoSuffixes= static property of the =Uize.Date= module. The ={dayNoSuffix}= token can be combined with the ={dayNo}= token, as in ={dayNo}{dayNoSuffix}=, to produce formatted results like =1st=, =2nd=, =3rd=, etc.

					The rules for determining the suffix for a particular day number are as follows...

					- ='th'= - for the day numbers =10= to =19=, and for all other day numbers whose first digit is either =0= or is greater than =3= (so, day numbers =4= through =20=, and =24= through =30=)
					- ='st'= - for any day number whose first digit is =1=, excepting the special case of =11= (so, day numbers =1=, =21=, and =31=)
					- ='nd'= - for any day number whose first digit is =2=, excepting the special case of =12= (so, day numbers =2= and =22=)
					- ='rd'= - for any day number whose first digit is =3=, excepting the special case of =13= (so, day numbers =3= and =23=)

					...................................
					DAY NUMBER(S)  |  DAY NUMBER SUFFIX
					---------------+-------------------
					1              |  st
					2              |  nd
					3              |  rd
					4-20           |  th
					21             |  st
					22             |  nd
					23             |  rd
					24-30          |  th
					31             |  st
					...................................

					Because multiple days in a month can have the same day number suffix, the value of the ={dayNoSuffix}= token is ambiguous and is not considered meaningful when parsing date strings formatted using this token - it is simply ignored.

				{dayName}
					The full name of the day, as registered in the =Uize.Date.dayNames= static property of the =Uize.Date= module.

					Unless overriding the value of the =Uize.Date.dayNames= static property, the day names will be the English names Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, and Sunday. Because multiple days in a month can occur on the same day of the week and have the same day name, the value of the ={dayName}= token is ambiguous and is not considered meaningful when parsing date strings formatted using this token - it is simply ignored.

				{shortDayName}
					The short name of the day, as registered in the =Uize.Date.shortDayNames= static property of the =Uize.Date= module.

					Unless overriding the value of the =Uize.Date.shortDayNames= static property, the short day names will be derived from the English day names, as Mon, Tue, Wed, Thu, Fri, Sat, and Sun. Because multiple days in a month can occur on the same day of the week and have the same short day name, the value of the ={shortDayName}= token is ambiguous and is not considered meaningful when parsing date strings formatted using this token - it is simply ignored.

				{hh}
					The hour in military time ([[http://en.wikipedia.org/wiki/24-hour_clock][24-hour clock]]), represented always using two digits (ie. leading =0= if necessary), where 12am (midnight) is represented by the value =00=, where 12pm (midday) is represented by the value =12=, and where 11pm is represented by the value =23=.

				{h12}
					The hour of the day in 12-hour notation, represented using only as many digits as necessary (ie. no leading =0=), where 12am (midnight) and 12pm (midday) are both represented by the value =12=, and where 1am and 1pm are both represented by the value =1=.

					Because the ={h12}= token does not convey whether the time is in the first or second half of the day, this token should be used in conjunction with the companion ={ampm}= token.

				{hh12}
					The hour of the day in 12-hour notation, represented always using two digits (ie. leading =0= if necessary), where 12am (midnight) and 12pm (midday) are both represented by the value =12=, and where 1am and 1pm are both represented by the value =01=.

					Because the ={hh12}= token does not convey whether the time is in the first or second half of the day, this token should be used in conjunction with the companion ={ampm}= token.

				{mm}
					The minutes of the hour, represented always using two digits (ie. leading =0= if necessary), where the first minute of the hour is represented by the value =00=, and where the last minute of the hour is represented by the value =59=.

				{minutes}
					The minutes of the hour, represented using only as many digits as necessary (ie. no leading =0=), where the first minute of the hour is represented by the value =0=, and where the last minute of the hour is represented by the value =59=.

				{ss}
					The seconds of the minute, represented always using two digits (ie. leading =0= if necessary), where the first second of the minute is represented by the value =00=, and where the last second of the minute is represented by the value =59=.

				{seconds}
					The seconds of the minute, represented using only as many digits as necessary (ie. no leading =0=), where the first second of the minute is represented by the value =0=, and where the last second of the minute is represented by the value =59=.

				{zzz}
					The milliseconds of the second, represented always using three digits (ie. leading zeros as necessary), where the first millisecond of the second is represented by the value =000=, and where the last millisecond of the second is represented by the value =59=.

				{milliseconds}
					The milliseconds of the second, represented using only as many digits as necessary (ie. no leading zeros), where the first millisecond of the second is represented by the value =0=, and where the last millisecond of the second is represented by the value =999=.

				{ampm}
					An indicator of which half of the day the hour is in, where the first half of the day (morning) is represented by the value =am=, and where the second half of the day (afternoon and evening) is represented by the value =pm=.

					When using either of the ={h12}= or ={hh12}= tokens to indicate hour of day in a `date format` string, it is important to also use the ={ampm}= token in order to disambiguate between the two halves of the day.

			Date Component Tokens Example
				The following table uses the example date "Sat Sep 8 2007 18:03:05" to show the `date component token value` for each of the `date component tokens` supported by the =Uize.Date.Formatter= module.

				..................................................................................
				DATE COMPONENT TOKEN  |  VALUE (using the example date Sat Sep 8 2007 18:03:05)
				----------------------+-----------------------------------------------------------
				{date}                |  Sat Sep 08 2007 18:03:05 GMT-0700 (Pacific Daylight Time)
				{YYYY}                |  2007
				{YY}                  |  07
				{MM}                  |  09
				{monthNo}             |  9
				{monthName}           |  September
				{shortMonthName}      |  Sep
				{DD}                  |  08
				{dayNo}               |  8
				{dayNoSuffix}         |  th
				{dayName}             |  Saturday
				{shortDayName}        |  Sat
				{hh}                  |  18
				{h12}                 |  6
				{hh12}                |  06
				{mm}                  |  03
				{minutes}             |  3
				{ss}                  |  05
				{seconds}             |  5
				{zzz}                 |  000
				{milliseconds}        |  0
				{ampm}                |  pm
				..................................................................................

			Date Format
				A date format is specified by a date format string, which contains one or more `date component tokens` separated by optional `date format static text`.

				EXAMPLE
				.........................................................................................
				DATE FORMAT STRING                                     | EXAMPLE FORMATTED DATE STRING
				-------------------------------------------------------+---------------------------------
				{dayName}, {dayNo}{dayNoSuffix} of {monthName}, {YYYY} | Tuesday, 11th of September, 2001
				.........................................................................................

				Date Format and Formatting Dates
					When `formatting a date string` using a specified `date format`, each `date component token` in the date format string is replaced by the corresponding `date component token value` for the date being formatted.

					Any `date format static text` separating the tokens is left undisturbed and makes its way into the formatted date string. As you can tell from the above example, all the tokens have been replaced with the appropriate values for our example date, the historically significant September 11th, 2001. The static text - such as the comma, spaces, and the "of" - have been left in. The end result is an elegantly formatted date.

				Date Format and Parsing Dates
					When `parsing a date string` to produce a date object, the `date format` must be specified in order for the parser to know how to parse the string.

					The parser takes the specified `date format` string and translates it into a sophisticated regular expression that is used to match against the date string being parsed and then "capture" the values for the various `date component tokens` in the date format string. If the regular expression cannot be matched against a date string being parsed, then that date string is not formatted according to the specified date format, and the parser will produce the value =undefined=.

				Date Format Static Text
					A `date format` string may contain static text arround the one or more `date component tokens`.

					Static text can be used to introduce separator characters between year, month, and day, for example. Static text can also be used to create more elegant and more human readable date strings. For instance, in the date format string ='{dayName}, {dayNo}{dayNoSuffix} of {monthName}, {YYYY}'=, the commas, spaces, and the "of" static text all contribute to friendlier date strings, such as the date string "Tuesday, 11th of September, 2001".

				A Bad Date
					The formatting and parsing methods of the =Uize.Date.Formatter= module don't care which of the `date component tokens` are used or how they are used.

					Insufficient tokens could be used to fully convey the date. Or, the same token could be used multiple times, either to produce silly results or to express a date in multiple ways in the same formatted result. The wrong tokens could be used in the wrong places to produce incorrect representations of a date. Bottom line: specifying a silly `date format` string will produce a silly result.

					EXAMPLE
					.........................................................................
					alert (
						Uize.Date.Formatter.format (
							new Date ('Sat Sep 8 2007 18:03:05'),
							'{ss}:{mm}:{h12}{ampm} on {YYYY}{dayNoSuffix} {monthName} {dayNo}',
						)
					);
					.........................................................................

					In the above example, the date ='Sat Sep 8 2007 18:03:05'= is being formatted using the `date format` string ='{ss}:{mm}:{h12}{ampm} on {YYYY}{dayNoSuffix} {monthName} {dayNo}'=, and the resulting date string is then displayed in an alert dialog. The alert dialog will show the value ='05:03:6pm on 2007th September 8'=. Any human reading this date string will be completely confused. It's not a date that makes any sense. That said, if this date string was parsed using the =Uize.Date.Formatter.parse= method and using the same format that was used to produce it, then the correct original date would be produced.

			Formatting a Date String
				Date objects can be formatted to produce date strings using the =Uize.Date.Formatter.format= static method.

				When using the =Uize.Date.Formatter.format= method to format a date string, any or all of the available `date component tokens` can be utilized. For instance, you could format a date to a string and only utilize the year component. In cases where only a subset of the date components are used to format a date string, parsing a date string formatted in that way can result in a `loss of date detail`.

				For more info on formatting date strings, see the reference for the =Uize.Date.Formatter.format= method.

			Parsing a Date String
				Date strings can be parsed to produce date objects using the =Uize.Date.Formatter.parse= static method.

				When using the =Uize.Date.Formatter.parse= method to parse a date string, the `date format` for the date string must be specified in order for this method to know how to parse the date string. When parsing a date string, if the `date format` only utilizes a subset of the available date components, then a `loss of date detail` can occur and the resulting date object will have default values for the date components for which no data is present in the date string, according to the rules of the `date component defaults`. For example, if you were to parse a date string that only had a year component, then the month, day, hour, minutes, seconds, and milliseconds would be defaulted.

				For more info on parsing date strings, see the reference for the =Uize.Date.Formatter.parse= method.

			Date Component Defaults
				A `date format` string is not required to contain tokens for every `date component`, and so there is date component defaulting logic that is employed when `parsing a date string` that does not contain complete date information.

				The value defaulting for the different components of a date is as follows...

				- *year* - When there is no ={YYYY}= or ={YY}= token in the `date format` string, then the year for the date will be defaulted to the year =0=.

				- *month* - When there is no ={MM}=, ={monthNo}=, ={monthName}=, or ={shortMonthName}= token in the `date format` string, then the month for the date will be defaulted to the first month of the year (ie. January).

				- *day number* - When there is no ={DD}= or ={dayNo}= token in the `date format` string, then the day of the month for the date will be defaulted to =0= (ie. the first day of the month).

				- *hour* - When there is no ={hh}=, ={h12}=, or ={hh12}= token in the `date format` string, then the default value for the hour of the day will be determined by the value of the ={ampm}= token, if present. If the ={ampm}= token is present, then the hour of the day will be defaulted to =0= when the value of the ={ampm}= token is "am" (ie. the hour is defaulted to 12am), and the hour will be defaulted to =12= when the value of the ={ampm}= token is "pm" (ie. the hour is defaulted to 12pm). If the ={ampm}= token is *not* present, then the hour of the day will be defaulted to =0= (ie. 12am).

				- *ampm* - When there is no ={ampm}= token in the `date format` string, and when the hour of the day is specified using either of the ={h12}= or ={hh12}= tokens, then the time of day is defaulted to morning.

				- *minutes* - When there is no ={mm}= or ={minutes}= token in the `date format` string, then the minutes of the hour for the date will be defaulted to =0= (ie. the first minute of the hour).

				- *seconds* - When there is no ={ss}= or ={seconds}= token in the `date format` string, then the seconds of the minute for the date will be defaulted to =0= (ie. the first second of the minute).

				- *milliseconds* - When there is no ={zzz}= or ={milliseconds}= token in the `date format` string, then the milliseconds of the second for the date will be defaulted to =0= (ie. the first millisecond of the second).

			Loss of Date Detail
				Date detail can be lost when parsing a date string that is in a `date format` that doesn't contain a `date component token value` for all of the components of a date.

				In a rather typical case, a date object may be formatted to a date string and only include the components for year, month, and day - omitting the time of day components. In such cases, the time of day of the source date object will be lost when formatting it to a date string. Consequently, if the formatted date string is later parsed back to a date object, the time of day will be defaulted according to the rules of the `date component defaults`. Consider the following example...

				EXAMPLE
				.......................................................................
				var
					date = new Date ('Sat Sep 8 2007 18:03:05'),
					dateFormat = '{YYYY}-{MM}-{DD}',
					formattedDateStr = Uize.Date.Formatter.format (date,dateFormat),
					parsedDate = Uize.Date.Formatter.parse (formattedDateStr,dateFormat)
				;
				alert (+date == +parsedDate);  // alerts "false"
				.......................................................................

				In the above example, the date "Sat Sep 8 2007 18:03:05" is being formatted to a date string using the date format ='{YYYY}-{MM}-{DD}'=, which produces the date string ='2007-09-08'=. Then, this date string is being parsed using the same date format, and the resulting date object is being assigned to the =parsedDate= variable. The =alert= statement compares the time in milliseconds of the original date against the time in milliseconds of the parsed date. In this case they are not the same, because the date string ='2007-09-08'= that is being parsed has lost the original time of day information. Instead, the parsed date will be initialized to the time 12am (the beginning of the day), according to the rules of the `date component defaults`.
*/

Uize.module ({
	name:'Uize.Date.Formatter',
	builder:function () {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_package = function () {},
				_Uize_Date = Uize.Date
			;

		/*** General Variables ***/
			var
				_tokenMatcherRegExp,
				_tokenNameToValueRegExpString = {
					YYYY:'\\d{4}',
					YY:'\\d\\d',
					MM:'1[0-2]|0[1-9]',
					monthNo:'1[0-2]|0?[1-9]',
					DD:'30|31|[1-2]\\d|0[1-9]',
					dayNo:'30|31|[1-2]\\d|0?[1-9]',
					dayNoSuffix:_Uize_Date.dayNoSuffixes.join ('|'),
					hh:'[0-1]\\d|2[0-3]',
					h12:'1[0-2]|0?[1-9]',
					hh12:'1[0-2]|0[1-9]',
					mm:'[0-5]\\d',
					minutes:'[0-5]?\\d',
					ss:'[0-5]\\d',
					seconds:'[0-5]?\\d',
					zzz:'\\d{3}',
					milliseconds:'\\d{1,3}',
					ampm:'am|pm'
				},
				_dynamicTokenValueRegExpStrings = ['monthName','shortMonthName','dayName','shortDayName'],
				_ctrlG = String.fromCharCode (7)
			;

		/*** Utility Functions ***/
			function _findValueInArrayCaseInsensitive (_values,_value) {
				/* TO DO: the Uize.indexIn method could be used if it had an option for doing a case insensitive search */
				_value = _value.toLowerCase ();
				for (var _valueNo = -1, _valuesLength = _values.length; ++_valueNo < _valuesLength;)
					if (_value == _values [_valueNo].toLowerCase ())
						return _valueNo
				;
				return -1;
			}

		/*** Public Static Methods ***/
			_package.format = _package.toPretty = _Uize_Date.format;
				/*?
					Static Methods
						Uize.Date.Formatter.format
							Returns a string, being the specified date formatted using the specified formatting.

							SYNTAX
							...................................................................
							dateStr = Uize.Date.Formatter.format (dateSTRorNUMorOBJ,formatSTR);
							...................................................................

							The date to be formatted is specified using the =dateSTRorNUMorOBJ= parameter. Before the date is formatted, the value of the =dateSTRorNUMorOBJ= parameter is resolved to a date object using the =Uize.Date.resolve= static method of the =Uize.Date= module. The format to be used is specified as a `date format` string, where each of the `date component tokens` specified in the format string (enclosed in the curly braces ={= and =}=) is replaced by the corresponding `date component token value` derived from the specified date. Consider the following example...

							EXAMPLE
							........................................................................................
							Uize.Date.Formatter.format ('Sat Sep 8 2007','{YYYY}/{MM}/{DD}');  // RESULT: 2007/09/08
							........................................................................................

							In the above example, the date value ='Sat Sep 8 2007'= is being formatted using the `date format` string ='{YYYY}/{MM}/{DD}'= to produce the result ='2007/09/08'=.

							MORE EXAMPLES
							............................................................................
							var date = 'Sat Sep 8 2007 18:03:05';

							Uize.Date.Formatter.format (date,'{YY}-{MM}-{DD}');
								// RESULT : 07-09-08

							Uize.Date.Formatter.format (date,'{YYYY}/{MM}/{DD}');
								// RESULT : 2007/09/08

							Uize.Date.Formatter.format (date,'{YYYY}{MM}{DD}');
								// RESULT : 20070908

							Uize.Date.Formatter.format (date,'{dayNo} {shortMonthName} {YYYY}');
								// RESULT : 8 Sep 2007

							Uize.Date.Formatter.format (date,'{dayNo}{dayNoSuffix} {monthName} {YYYY}');
								// RESULT : 8th September 2007

							Uize.Date.Formatter.format (
								date,
								'{monthName} {dayNo}{dayNoSuffix}, {YYYY} ({h12}:{mm}{ampm})'
							);
								// RESULT : September 8th, 2007 (6:03pm)

							Uize.Date.Formatter.format (date,'{YYYY}/{MM}/{DD} ({hh}:{mm}:{ss})');
								// RESULT : 2007/09/08 (18:03:05)

							Uize.Date.Formatter.format (
								date,
								'{minutes} minutes and {seconds} seconds past {h12}{ampm}'
							);
								// RESULT : 3 minutes and 5 seconds past 6pm

							Uize.Date.Formatter.format (
								date,
								'{monthNo}/{dayNo}/{YYYY} is {YYYY}-{MM}-{DD} in ISO 8601'
							);
								// RESULT : 9/8/2007 is 2007-09-08 in ISO 8601
							............................................................................

							The above example shows how the date value ='Sat Sep 8 2007 18:03:05'= would be formatted using a variety of wildly different `date format` strings.

							VARIATION
							.........................................................
							dateStr = Uize.Date.Formatter.format (dateSTRorNUMorOBJ);
							.........................................................

							When no =formatSTR= parameter is specified, then the value for this parameter will be defaulted to ='{dayName}, {dayNo}{dayNoSuffix} {monthName} {YYYY}'=. This is equivalent to using the =Uize.Date.Formatter.toPretty= static method.

							NOTES
							- see the companion =Uize.Date.Formatter.parse= static method
							- see the related =Uize.Date.Formatter.toPretty= static method
							- when the value =''= (empty string), =null=, or =undefined= is specified for the =dateSTRorNUMorOBJ= parameter, then this parameter will be defaulted to the date at the time that the method is called (today's date, essentially)

						Uize.Date.Formatter.toPretty
							Returns a string, representing a "pretty" formatting of the specified date.

							SYNTAX
							.................................................................
							prettyDateSTR = Uize.Date.Formatter.toPretty (dateSTRorNUMorOBJ);
							.................................................................

							The date to be pretty-formatted can be specified using the =dateSTRorNUMorOBJ= value type. Using the =Uize.Date.Formatter.toPretty= method is equivalent to using the =Uize.Date.Formatter.format= method and specifying the following `date format` string value for its =formatSTR= parameter...

							PRETTY DATE FORMAT
							..................................................
							{dayName}, {dayNo}{dayNoSuffix} {monthName} {YYYY}
							..................................................

							Following are some examples of pretty-formatted dates...

							EXAMPLES
							............................
							Friday, 15th December 2006
							Tuesday, 23rd February 1999
							Friday, 4th July 2008
							Thursday, 1st April 2004
							Saturday, 2nd September 2006
							............................

							NOTES
							- see the related =Uize.Date.Formatter.format= static method
							- when the value =''= (empty string), =null=, or =undefined= is specified for the =dateSTRorNUMorOBJ= parameter, then this parameter will be defaulted to the date at the time that the method is called (today's date, essentially)
				*/

			_package.parse = function (_date,_format) {
				var _tokenName;

				/*** return early for dates specified as Date object, null, undefined, empty string, or number ***/
					if (typeof _date == 'object' && _date && !(_date instanceof Date)) _date = _date.valueOf ();
					if (_date instanceof Date) return _date;
					if (_date == null || _date == '') return;
					if (typeof _date == 'number') return new Date (_date);

				/*** use Uize.Date.resolve method if no format is specified ***/
					if (!_format) return _Uize_Date.resolve (_date);

				/*** re-initialize dynamic token value RegExp strings ***/
					Uize.lookup (_dynamicTokenValueRegExpStrings,null,_tokenNameToValueRegExpString);

				if (!_tokenMatcherRegExp)
					_tokenMatcherRegExp = new RegExp (
						'\\{(' + Uize.keys (_tokenNameToValueRegExpString).join ('|') + ')\\}','g'
					)
				;

				var
					_tokens = [],
					_tokenNo = 0,
					_matcher = new RegExp (
						Uize.escapeRegExpLiteral (
							_format.replace (
								_tokenMatcherRegExp,
								function (_token,_tokenName) {
									_tokens.push (_tokenName);
									return _ctrlG;
								}
							)
						).replace (
							/\s+/g,'\\s+'
						).replace (
							/\x07/g,
							function () {
								return (
									'\\s*(' +
									(
										_tokenNameToValueRegExpString [_tokenName = _tokens [_tokenNo++]] ||
										(_tokenNameToValueRegExpString [_tokenName] = _Uize_Date [_tokenName + 's'].join ('|'))
									) +
									')\\s*'
								);
							}
						),
						'i'
					),
					_matchSegments = (_date + '').match (_matcher)
				;
				if (_matchSegments) {
					var
						_fullYearFourDigit = 0,
						_monthNo = 1,
						_dayNo = 1,
						_hourNo,
						_h12 = 0,
						_minutes = 0,
						_seconds = 0,
						_milliseconds = 0,
						_isPm = false
					;
					for (
						var _matchSegmentNo = 0, _matchSegmentsLength = _matchSegments.length;
						++_matchSegmentNo < _matchSegmentsLength;
					) {
						var _matchSegmentValue = _matchSegments [_matchSegmentNo];
						switch (_tokens [_matchSegmentNo - 1]) {
							/* NOTE:
								We don't need to do anything for the dayNoSuffix, dayName, and shortDayName tokens, because they are purely cosmetic.
							*/
							case 'YYYY':
								_fullYearFourDigit = +_matchSegmentValue;
								break;
							case 'YY':
								_fullYearFourDigit = 1900 + +_matchSegmentValue;
								break;
							case 'MM':
							case 'monthNo':
								_monthNo = +_matchSegmentValue;
								break;
							case 'monthName':
								_monthNo = _findValueInArrayCaseInsensitive (_Uize_Date.monthNames,_matchSegmentValue) + 1;
								break;
							case 'shortMonthName':
								_monthNo = _findValueInArrayCaseInsensitive (_Uize_Date.shortMonthNames,_matchSegmentValue) + 1;
								break;
							case 'DD':
							case 'dayNo':
								_dayNo = +_matchSegmentValue;
								break;
							case 'hh':
								_hourNo = +_matchSegmentValue;
								break;
							case 'h12':
							case 'hh12':
								_h12 = +_matchSegmentValue;
								break;
							case 'mm':
							case 'minutes':
								_minutes = +_matchSegmentValue;
								break;
							case 'ss':
							case 'seconds':
								_seconds = +_matchSegmentValue;
								break;
							case 'zzz':
							case 'milliseconds':
								_milliseconds = +_matchSegmentValue;
							case 'ampm':
								_isPm = /^pm$/i.test (_matchSegmentValue)
						}
					}
					return _Uize_Date (
						_fullYearFourDigit,
						_monthNo,
						_dayNo,
						_hourNo !== undefined ? _hourNo : _h12 * (_h12 != 12) + _isPm * 12,
						_minutes,
						_seconds,
						_milliseconds
					);
				}
				/*?
					Static Methods
						Uize.Date.Formatter.parse
							Returns a date object, that is parsed from the specified date that is formatted in the specified `date format`, or the value =undefined= if the specified date cannot be parsed.

							SYNTAX
							................................................................
							dateOBJ = Uize.Date.Formatter.parse (dateANYTYPE,dateFormatSTR);
							................................................................

							Whereas the =Uize.Date.Formatter.format= method can be used to format a date object using a specified `date format`, the =Uize.Date.Formatter.parse= method can be used to reverse that process and parse a date string that has been formatted using a specific `date format`. Consider the following example....

							EXAMPLE
							...................................................................................
							var
								date = new Date ('Sat Sep 8 2007 18:03:05'),
								dateFormat = '{h12}:{mm}:{ss}{ampm} on {dayNo}{dayNoSuffix} {monthName} {YYYY}',
								formattedDateStr = Uize.Date.Formatter.format (date,dateFormat),
								parsedDate = Uize.Date.Formatter.parse (formattedDateStr,dateFormat)
							;
							alert (+date == +parsedDate);  // alerts "true"
							...................................................................................

							In the above example, the date "Sat Sep 8 2007 18:03:05" is being formatted to a date string using the date format ='{h12}:{mm}:{ss}{ampm} on {dayNo}{dayNoSuffix} {monthName} {YYYY}'=, which produces the date string ='6:03:05pm on 8th September 2007'=. Then, this date string is being parsed using the same date format, and the resulting date object is being assigned to the =parsedDate= variable. The =alert= statement compares the time in milliseconds of the original date against the time in milliseconds of the parsed date. They are identical, because the =Uize.Date.Formatter.parse= method is able to successfully parse a date using the same format that was used to format it with the =Uize.Date.Formatter.format= method.

							A Bad Date
								When a date string cannot be parsed, then the =Uize.Date.Formatter.parse= method will return the value =undefined=.

								This could occur if the date string is not a validly formatted date, or if it *is* a perfectly well formatted date that is simply not formatted according to the `date format` string specified when calling the =Uize.Date.Formatter.parse= method.

								EXAMPLES
								..................................................................................
								Uize.Date.Formatter.parse ('this is not a date','{YYYY}-{MM}-{DD}');  // undefined
								Uize.Date.Formatter.parse ('2001/09/11','{YYYY}-{MM}-{DD}');          // undefined
								Uize.Date.Formatter.parse ('Tue Sep 11 2001','{YYYY}-{MM}-{DD}');     // undefined
								..................................................................................

								All of the statements in the above example will return the value =undefined=. In the first statement, the value of the =dateANYTYPE= parameter is clearly not a date (it even says so). In the other statements, the date strings specified in the =dateANYTYPE= parameter do not match the formats specified in the =dateFormatSTR= parameter.

							Extraneous Text Ignored
								Any extraneous text in a date string around a portion of the date string that is matched by the specified `date format` will be ignored.

								Consider the following example...

								EXAMPLE
								...............................................................................
								Uize.Date.Formatter.parse ('DATE --> 2001-09-11  <-- DATE','{YYYY}-{MM}-{DD}');
								...............................................................................

								In the above example, the text substring "2001-09-11" is matched by the `date format` ='{YYYY}-{MM}-{DD}'=. The extraneous text around the date that points with arrows to the ISO8601 formatted date is ignored.

							First Matching Date Wins
								When a date string contains multiple text substrings that match a specified `date format` string, then the date will be parsed from the first matching substring.

								Consider the following example...

								EXAMPLE
								.......................................................................
								Uize.Date.Formatter.parse ('2000-08-08,2001-09-11','{YYYY}-{MM}-{DD}');
								.......................................................................

								In the above example, the date string that is being parsed contains two text substrings that are ISO8601 formatted dates. Only the first match for the `date format` string is used, and so the date object that is produced by the =Uize.Date.Formatter.parse= method will be for the 8th of August, 2000 - the "2001-09-11" text is ignored.

							Last Equivalent Date Component Token Wins
								If a `date format` string contains multiple of the same `date component token`, or multiple different `date component tokens` that are equivalent (such as ={DD}= and ={dayNo}=), then the value for the last equivalent token will override values for previous equivalent tokens.

								Consider the following example...

								EXAMPLE
								.....................................................................................
								Uize.Date.Formatter.parse ('2001-09-11 5th','{YYYY}-{MM}-{DD} {dayNo}{dayNoSuffix}');
								.....................................................................................

								In the above example, a date string is being parsed that is formatted according to the `date format` ='{YYYY}-{MM}-{DD} {dayNo}{dayNoSuffix}'=. Now, this date format has two equivalent date component tokens in it - namely, the ={DD}= and ={dayNo}= tokens. Because the ={dayNo}= token is last in the date string, it wins, and so the produced date object is for the 5th September 2001 - not the 11th.

							Whitespace Handling
								In order to be flexible enough to parse a wider array of date strings, the =Uize.Date.Formatter.parse= method has some special rules around handling whitespace in date strings.

								Optional Token Value Padding
									All values for `date component tokens` can implicitly have whitespace / padding around them.

									Consider the following example...

									EXAMPLE
									................................................................
									Uize.Date.Formatter.parse ('2001 / 09 / 11','{YYYY}/{MM}/{DD}');
									................................................................

									In the above example, the date string is being parsed using the `date format` ='{YYYY}/{MM}/{DD}'=. Now, even though there are no spaces around the slashes in the format, the values for the ={YYYY}=, ={MM}=, and ={DD}= tokens in the date string being parsed can implicitly have an arbitrary amount of surrounding whitespace padding. Therefore, the date string ='2001 / 09 / 11'=, even though it *does* have whitespace padding around the slashes, can be parsed successfully. It's not that the slashes can have padding around them, but that any `date component token value` may have padding around it.

								Flexible Static Text Whitespace
									Whitespace within `date format static text` is implicitly treated as flexible, so that some whitespace between non-whitespace characters within the static text will be matched against some whitespace within the corresponding static text of a date string being parsed.

									Consider the following example...

									EXAMPLE
									..................................................
									Uize.Date.Formatter.parse (
										'HISTORICALLY   IMPORTANT   DATE: 2001-09-11',
										'HISTORICALLY IMPORTANT DATE: {YYYY}-{MM}-{DD}'
									);
									..................................................

									In the above example, the date September 11th, 2001 will be successfully parsed from the date string, even though the static text in the date string contains more whitespace separating the words than the corresponding "HISTORICALLY IMPORTANT DATE" static text in the `date format` string.

								Static Text Whitespace Required
									Whitespace within `date format static text` in a `date format` string must exist within the corresponding static text in a date string being parsed in order for it to be parsed successfully.

									Consider the following example...

									EXAMPLE
									..................................................
									Uize.Date.Formatter.parse (
										'HistoricallyImportantDate: 2001-09-11',
										'Historically Important Date: {YYYY}-{MM}-{DD}'
									);
									..................................................

									In the above example, the =Uize.Date.Formatter.parse= method will return the value =undefined= because it will not be able to successfully parse the date string. This is because the whitespace separating the words in the static text of the `date format` string must exist within the corresponding static text of the date being parsed. The exact amount of whitespace is not important, as long as the words / non-whitespace substrings are separated by whitespace in the same spots in both the `date format` string and the date string being parsed.

							Case Insensitivity
								In order to be flexible enough to parse a wider array of date strings, the =Uize.Date.Formatter.parse= method performs case insensitive matching when `parsing a date string`.

								Case insensitivity applies to both the values of `date component tokens` as well as `date format static text`. Consider the following example...

								EXAMPLES
								................................................................
								Uize.Date.Formatter.parse (
									'tuesday 11th september 2001',
									'{dayName} {dayNo}{dayNoSuffix} {monthName} {YYYY}'
								);

								Uize.Date.Formatter.parse (
									'TUE 11TH SEP 2001',
									'{shortDayName} {dayNo}{dayNoSuffix} {shortMonthName} {YYYY}'
								);

								Uize.Date.Formatter.parse (
									'SePtEmBeR 11tH, 2001',
									'{monthName} {dayNo}{dayNoSuffix}, {YYYY}'
								);

								Uize.Date.Formatter.parse (
									'historically important date: 2001-09-11',
									'HISTORICALLY IMPORTANT DATE: {YYYY}-{MM}-{DD}'
								);
								................................................................

								All of the above statements would correctly parse the date September 11th, 2001.

							NOTES
							- see the companion =Uize.Date.Formatter.format= static method
							- the =Uize.Date.Formatter.parse= method does currently not support parsing the ={date}= `date component token`
				*/
			};

		return _package;
	}
});

