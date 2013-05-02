/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Date.Formatter Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Test
	importance: 2
	codeCompleteness: 90
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Test.Uize.Date.Formatter= module defines a suite of unit tests for the =Uize.Date.Formatter= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Date.Formatter',
	required:[
		'Uize.Class',
		'Uize.Class.Value'
	],
	builder:function () {
		'use strict';

		function _newDate (_year,_month,_dayNo,_hours,_minutes,_seconds,_milliseconds) {
			var _date = new Date (
				+_year + (_year < 100 && 400),
				(+_month || 1) - 1,
				+_dayNo || 1,
				+_hours || 0,
				+_minutes || 0,
				+_seconds || 0,
				+_milliseconds || 0
			);
			_year < 100 && _date.setFullYear (_year);
			return _date;
		}
		var
			/*** various test dates, for use in tests for different methods ***/
				_testDate = _newDate (2001,9,11,8,46,40,95),
				_testDateInvalid = new Date (NaN),
				_testDateYearWithOneDigit = _newDate (9,1,1),
				_testDateYearWithTwoDigits = _newDate (99,1,1),
				_testDateYearWithThreeDigits = _newDate (999,1,1),
				_testDateYearWithFourDigits = _newDate (9999,1,1),
				_testDateMonthWithOneDigit = _newDate (2001,1,1),
				_testDateMonthWithTwoDigits = _newDate (2001,12,1),
				_testDateDateWithOneDigit = _newDate (2001,1,1),
				_testDateDateWithTwoDigits = _newDate (2001,1,31),

				/*** dates for different months ***/
					_testDateMonthIsJan = _newDate (2001,1,1),
					_testDateMonthIsFeb = _newDate (2001,2,1),
					_testDateMonthIsMar = _newDate (2001,3,1),
					_testDateMonthIsApr = _newDate (2001,4,1),
					_testDateMonthIsMay = _newDate (2001,5,1),
					_testDateMonthIsJun = _newDate (2001,6,1),
					_testDateMonthIsJul = _newDate (2001,7,1),
					_testDateMonthIsAug = _newDate (2001,8,1),
					_testDateMonthIsSep = _newDate (2001,9,1),
					_testDateMonthIsOct = _newDate (2001,10,1),
					_testDateMonthIsNov = _newDate (2001,11,1),
					_testDateMonthIsDec = _newDate (2001,12,1),

				/*** dates for different days of the week ***/
					_testDateDayIsSun = _newDate (2001,1,7),
					_testDateDayIsMon = _newDate (2001,1,8),
					_testDateDayIsTue = _newDate (2001,1,9),
					_testDateDayIsWed = _newDate (2001,1,10),
					_testDateDayIsThu = _newDate (2001,1,11),
					_testDateDayIsFri = _newDate (2001,1,12),
					_testDateDayIsSat = _newDate (2001,1,13),

				/*** dates for different times of the day ***/
					_testDateTimeIsMidnight = _newDate (2001,1,1,0,0,0,0),
					_testDateTimeIsJustBeforeNoon = _newDate (2001,1,1,11,59,59,999),
					_testDateTimeIsNoon = _newDate (2001,1,1,12,0,0,0),
					_testDateTimeIs1pm = _newDate (2001,1,1,13,0,0,0),
					_testDateTimeIsJustBeforeMidnight = _newDate (2001,1,1,23,59,59,999)
		;

		return Uize.Test.declare ({
			title:'Test for Uize.Date.Formatter Module',
			test:[
				Uize.Test.requiredModulesTest ('Uize.Date.Formatter'),
				Uize.Test.staticMethodsTest ([
					['Uize.Date.Formatter.format',[
						/*** test handling of the {YYYY} token ***/
							['Test that the {YYYY} token is handled correctly for years with one digit',
								[_testDateYearWithOneDigit,'{YYYY}'],
								'0009'
							],
							['Test that the {YYYY} token is handled correctly for years with two digits',
								[_testDateYearWithTwoDigits,'{YYYY}'],
								'0099'
							],
							['Test that the {YYYY} token is handled correctly for years with three digits',
								[_testDateYearWithThreeDigits,'{YYYY}'],
								'0999'
							],
							['Test that the {YYYY} token is handled correctly for years with four digits',
								[_testDateYearWithFourDigits,'{YYYY}'],
								'9999'
							],
							['Test that the {YYYY} token is handled correctly for an invalid date',
								[_testDateInvalid,'{YYYY}'],
								'????'
							],

						/*** test handling of the {YY} token ***/
							['Test that the {YY} token is handled correctly for years with one digit',
								[_testDateYearWithOneDigit,'{YY}'],
								'09'
							],
							['Test that the {YY} token is handled correctly for years with two digits',
								[_testDateYearWithTwoDigits,'{YY}'],
								'99'
							],
							['Test that the {YY} token is handled correctly for years with three digits',
								[_testDateYearWithThreeDigits,'{YY}'],
								'99'
							],
							['Test that the {YY} token is handled correctly for years with four digits',
								[_testDateYearWithFourDigits,'{YY}'],
								'99'
							],
							['Test that the {YY} token is handled correctly for an invalid date',
								[_testDateInvalid,'{YY}'],
								'??'
							],

						/*** test handling of the {MM} token ***/
							['Test that the {MM} token is handled correctly for months with one digit',
								[_testDateMonthWithOneDigit,'{MM}'],
								'01'
							],
							['Test that the {MM} token is handled correctly for months with two digits',
								[_testDateMonthWithTwoDigits,'{MM}'],
								'12'
							],
							['Test that the {MM} token is handled correctly for an invalid date',
								[_testDateInvalid,'{MM}'],
								'??'
							],

						/*** test handling of the {monthNo} token ***/
							['Test that the {monthNo} token is handled correctly for months with one digit',
								[_testDateMonthWithOneDigit,'{monthNo}'],
								'1'
							],
							['Test that the {monthNo} token is handled correctly for months with two digits',
								[_testDateMonthWithTwoDigits,'{monthNo}'],
								'12'
							],
							['Test that the {monthNo} token is handled correctly for an invalid date',
								[_testDateInvalid,'{monthNo}'],
								'?'
							],

						/*** test handling of the {monthName} token ***/
							['Test that the {monthName} token is handled correctly for January',
								[_testDateMonthIsJan,'{monthName}'],
								'January'
							],
							['Test that the {monthName} token is handled correctly for February',
								[_testDateMonthIsFeb,'{monthName}'],
								'February'
							],
							['Test that the {monthName} token is handled correctly for March',
								[_testDateMonthIsMar,'{monthName}'],
								'March'
							],
							['Test that the {monthName} token is handled correctly for April',
								[_testDateMonthIsApr,'{monthName}'],
								'April'
							],
							['Test that the {monthName} token is handled correctly for May',
								[_testDateMonthIsMay,'{monthName}'],
								'May'
							],
							['Test that the {monthName} token is handled correctly for June',
								[_testDateMonthIsJun,'{monthName}'],
								'June'
							],
							['Test that the {monthName} token is handled correctly for July',
								[_testDateMonthIsJul,'{monthName}'],
								'July'
							],
							['Test that the {monthName} token is handled correctly for August',
								[_testDateMonthIsAug,'{monthName}'],
								'August'
							],
							['Test that the {monthName} token is handled correctly for September',
								[_testDateMonthIsSep,'{monthName}'],
								'September'
							],
							['Test that the {monthName} token is handled correctly for October',
								[_testDateMonthIsOct,'{monthName}'],
								'October'
							],
							['Test that the {monthName} token is handled correctly for November',
								[_testDateMonthIsNov,'{monthName}'],
								'November'
							],
							['Test that the {monthName} token is handled correctly for December',
								[_testDateMonthIsDec,'{monthName}'],
								'December'
							],
							['Test that the {monthName} token is handled correctly for an invalid date',
								[_testDateInvalid,'{monthName}'],
								'?????????'
							],

						/*** test handling of the {shortMonthName} token ***/
							['Test that the {shortMonthName} token is handled correctly for January',
								[_testDateMonthIsJan,'{shortMonthName}'],
								'Jan'
							],
							['Test that the {shortMonthName} token is handled correctly for February',
								[_testDateMonthIsFeb,'{shortMonthName}'],
								'Feb'
							],
							['Test that the {shortMonthName} token is handled correctly for March',
								[_testDateMonthIsMar,'{shortMonthName}'],
								'Mar'
							],
							['Test that the {shortMonthName} token is handled correctly for April',
								[_testDateMonthIsApr,'{shortMonthName}'],
								'Apr'
							],
							['Test that the {shortMonthName} token is handled correctly for May',
								[_testDateMonthIsMay,'{shortMonthName}'],
								'May'
							],
							['Test that the {shortMonthName} token is handled correctly for June',
								[_testDateMonthIsJun,'{shortMonthName}'],
								'Jun'
							],
							['Test that the {shortMonthName} token is handled correctly for July',
								[_testDateMonthIsJul,'{shortMonthName}'],
								'Jul'
							],
							['Test that the {shortMonthName} token is handled correctly for August',
								[_testDateMonthIsAug,'{shortMonthName}'],
								'Aug'
							],
							['Test that the {shortMonthName} token is handled correctly for September',
								[_testDateMonthIsSep,'{shortMonthName}'],
								'Sep'
							],
							['Test that the {shortMonthName} token is handled correctly for October',
								[_testDateMonthIsOct,'{shortMonthName}'],
								'Oct'
							],
							['Test that the {shortMonthName} token is handled correctly for November',
								[_testDateMonthIsNov,'{shortMonthName}'],
								'Nov'
							],
							['Test that the {shortMonthName} token is handled correctly for December',
								[_testDateMonthIsDec,'{shortMonthName}'],
								'Dec'
							],
							['Test that the {shortMonthName} token is handled correctly for an invalid date',
								[_testDateInvalid,'{shortMonthName}'],
								'???'
							],

						/*** test handling of the {DD} token ***/
							['Test that the {DD} token is handled correctly for dates with one digit',
								[_testDateDateWithOneDigit,'{DD}'],
								'01'
							],
							['Test that the {DD} token is handled correctly for dates with two digits',
								[_testDateDateWithTwoDigits,'{DD}'],
								'31'
							],
							['Test that the {DD} token is handled correctly for an invalid date',
								[_testDateInvalid,'{DD}'],
								'??'
							],

						/*** test handling of the {dayNo} token ***/
							['Test that the {dayNo} token is handled correctly for dates with one digit',
								[_testDateDateWithOneDigit,'{dayNo}'],
								'1'
							],
							['Test that the {dayNo} token is handled correctly for dates with two digits',
								[_testDateDateWithTwoDigits,'{dayNo}'],
								'31'
							],
							['Test that the {dayNo} token is handled correctly for an invalid date',
								[_testDateInvalid,'{dayNo}'],
								'?'
							],

						/*** test handling of the {dayNoSuffix} token ***/
							['Test that the {dayNoSuffix} token is handled correctly for the 1st of the month',
								[_newDate (2001,1,1),'{dayNoSuffix}'],
								'st'
							],
							['Test that the {dayNoSuffix} token is handled correctly for the 2nd of the month',
								[_newDate (2001,1,2),'{dayNoSuffix}'],
								'nd'
							],
							['Test that the {dayNoSuffix} token is handled correctly for the 3rd of the month',
								[_newDate (2001,1,3),'{dayNoSuffix}'],
								'rd'
							],
							['Test that the {dayNoSuffix} token is handled correctly for the 4th of the month',
								[_newDate (2001,1,4),'{dayNoSuffix}'],
								'th'
							],
							['Test that the {dayNoSuffix} token is handled correctly for the 10th of the month',
								[_newDate (2001,1,10),'{dayNoSuffix}'],
								'th'
							],
							['Test that the {dayNoSuffix} token is handled correctly for the 11th of the month',
								[_newDate (2001,1,11),'{dayNoSuffix}'],
								'th'
							],
							['Test that the {dayNoSuffix} token is handled correctly for the 12th of the month',
								[_newDate (2001,1,12),'{dayNoSuffix}'],
								'th'
							],
							['Test that the {dayNoSuffix} token is handled correctly for the 13th of the month',
								[_newDate (2001,1,13),'{dayNoSuffix}'],
								'th'
							],
							['Test that the {dayNoSuffix} token is handled correctly for the 14th of the month',
								[_newDate (2001,1,14),'{dayNoSuffix}'],
								'th'
							],
							['Test that the {dayNoSuffix} token is handled correctly for the 20th of the month',
								[_newDate (2001,1,20),'{dayNoSuffix}'],
								'th'
							],
							['Test that the {dayNoSuffix} token is handled correctly for the 21st of the month',
								[_newDate (2001,1,21),'{dayNoSuffix}'],
								'st'
							],
							['Test that the {dayNoSuffix} token is handled correctly for the 22nd of the month',
								[_newDate (2001,1,22),'{dayNoSuffix}'],
								'nd'
							],
							['Test that the {dayNoSuffix} token is handled correctly for the 23rd of the month',
								[_newDate (2001,1,23),'{dayNoSuffix}'],
								'rd'
							],
							['Test that the {dayNoSuffix} token is handled correctly for the 24th of the month',
								[_newDate (2001,1,24),'{dayNoSuffix}'],
								'th'
							],
							['Test that the {dayNoSuffix} token is handled correctly for the 30th of the month',
								[_newDate (2001,1,30),'{dayNoSuffix}'],
								'th'
							],
							['Test that the {dayNoSuffix} token is handled correctly for the 31st of the month',
								[_newDate (2001,1,31),'{dayNoSuffix}'],
								'st'
							],
							['Test that the {dayNoSuffix} token is handled correctly for an invalid date',
								[_testDateInvalid,'{dayNoSuffix}'],
								'??'
							],

						/*** test handling of the {dayName} token ***/
							['Test that the {dayName} token is handled correctly for Sunday',
								[_testDateDayIsSun,'{dayName}'],
								'Sunday'
							],
							['Test that the {dayName} token is handled correctly for Monday',
								[_testDateDayIsMon,'{dayName}'],
								'Monday'
							],
							['Test that the {dayName} token is handled correctly for Tuesday',
								[_testDateDayIsTue,'{dayName}'],
								'Tuesday'
							],
							['Test that the {dayName} token is handled correctly for Wednesday',
								[_testDateDayIsWed,'{dayName}'],
								'Wednesday'
							],
							['Test that the {dayName} token is handled correctly for Thursday',
								[_testDateDayIsThu,'{dayName}'],
								'Thursday'
							],
							['Test that the {dayName} token is handled correctly for Friday',
								[_testDateDayIsFri,'{dayName}'],
								'Friday'
							],
							['Test that the {dayName} token is handled correctly for Saturday',
								[_testDateDayIsSat,'{dayName}'],
								'Saturday'
							],
							['Test that the {dayName} token is handled correctly for an invalid date',
								[_testDateInvalid,'{dayName}'],
								'????????'
							],

						/*** test handling of the {shortDayName} token ***/
							['Test that the {shortDayName} token is handled correctly for Sunday',
								[_testDateDayIsSun,'{shortDayName}'],
								'Sun'
							],
							['Test that the {shortDayName} token is handled correctly for Monday',
								[_testDateDayIsMon,'{shortDayName}'],
								'Mon'
							],
							['Test that the {shortDayName} token is handled correctly for Tuesday',
								[_testDateDayIsTue,'{shortDayName}'],
								'Tue'
							],
							['Test that the {shortDayName} token is handled correctly for Wednesday',
								[_testDateDayIsWed,'{shortDayName}'],
								'Wed'
							],
							['Test that the {shortDayName} token is handled correctly for Thursday',
								[_testDateDayIsThu,'{shortDayName}'],
								'Thu'
							],
							['Test that the {shortDayName} token is handled correctly for Friday',
								[_testDateDayIsFri,'{shortDayName}'],
								'Fri'
							],
							['Test that the {shortDayName} token is handled correctly for Saturday',
								[_testDateDayIsSat,'{shortDayName}'],
								'Sat'
							],
							['Test that the {shortDayName} token is handled correctly for an invalid date',
								[_testDateInvalid,'{shortDayName}'],
								'???'
							],

						/*** test handling of the {hh} token ***/
							['Test that the {hh} token is handled correctly when the time is midnight',
								[_testDateTimeIsMidnight,'{hh}'],
								'00'
							],
							['Test that the {hh} token is handled correctly when the time is just before noon',
								[_testDateTimeIsJustBeforeNoon,'{hh}'],
								'11'
							],
							['Test that the {hh} token is handled correctly when the time is noon',
								[_testDateTimeIsNoon,'{hh}'],
								'12'
							],
							['Test that the {hh} token is handled correctly when the time is 1pm',
								[_testDateTimeIs1pm,'{hh}'],
								'13'
							],
							['Test that the {hh} token is handled correctly when the time is just before midnight',
								[_testDateTimeIsJustBeforeMidnight,'{hh}'],
								'23'
							],
							['Test that the {hh} token is handled correctly for an invalid date',
								[_testDateInvalid,'{hh}'],
								'??'
							],

						/*** test handling of the {h12} token ***/
							['Test that the {h12} token is handled correctly when the time is midnight',
								[_testDateTimeIsMidnight,'{h12}'],
								'12'
							],
							['Test that the {h12} token is handled correctly when the time is just before noon',
								[_testDateTimeIsJustBeforeNoon,'{h12}'],
								'11'
							],
							['Test that the {h12} token is handled correctly when the time is noon',
								[_testDateTimeIsNoon,'{h12}'],
								'12'
							],
							['Test that the {h12} token is handled correctly when the time is 1pm',
								[_testDateTimeIs1pm,'{h12}'],
								'1'
							],
							['Test that the {h12} token is handled correctly when the time is just before midnight',
								[_testDateTimeIsJustBeforeMidnight,'{h12}'],
								'11'
							],
							['Test that the {h12} token is handled correctly for an invalid date',
								[_testDateInvalid,'{h12}'],
								'?'
							],

						/*** test handling of the {hh12} token ***/
							['Test that the {hh12} token is handled correctly when the time is midnight',
								[_testDateTimeIsMidnight,'{hh12}'],
								'12'
							],
							['Test that the {hh12} token is handled correctly when the time is just before noon',
								[_testDateTimeIsJustBeforeNoon,'{hh12}'],
								'11'
							],
							['Test that the {hh12} token is handled correctly when the time is noon',
								[_testDateTimeIsNoon,'{hh12}'],
								'12'
							],
							['Test that the {hh12} token is handled correctly when the time is 1pm',
								[_testDateTimeIs1pm,'{hh12}'],
								'01'
							],
							['Test that the {hh12} token is handled correctly when the time is just before midnight',
								[_testDateTimeIsJustBeforeMidnight,'{hh12}'],
								'11'
							],
							['Test that the {hh12} token is handled correctly for an invalid date',
								[_testDateInvalid,'{hh12}'],
								'??'
							],

						/*** test handling of the {ampm} token ***/
							['Test that the {ampm} token is handled correctly when the time is midnight',
								[_testDateTimeIsMidnight,'{ampm}'],
								'am'
							],
							['Test that the {ampm} token is handled correctly when the time is just before noon',
								[_testDateTimeIsJustBeforeNoon,'{ampm}'],
								'am'
							],
							['Test that the {ampm} token is handled correctly when the time is noon',
								[_testDateTimeIsNoon,'{ampm}'],
								'pm'
							],
							['Test that the {ampm} token is handled correctly when the time is 1pm',
								[_testDateTimeIs1pm,'{ampm}'],
								'pm'
							],
							['Test that the {ampm} token is handled correctly when the time is just before midnight',
								[_testDateTimeIsJustBeforeMidnight,'{ampm}'],
								'pm'
							],
							['Test that the {ampm} token is handled correctly for an invalid date',
								[_testDateInvalid,'{ampm}'],
								'??'
							],

						/*** test handling of the {mm} token ***/
							['Test that the {mm} token is handled correctly when the minutes is 0',
								[_testDateTimeIsMidnight,'{mm}'],
								'00'
							],
							['Test that the {mm} token is handled correctly when the minutes is 59',
								[_testDateTimeIsJustBeforeNoon,'{mm}'],
								'59'
							],
							['Test that the {mm} token is handled correctly for an invalid date',
								[_testDateInvalid,'{mm}'],
								'??'
							],

						/*** test handling of the {minutes} token ***/
							['Test that the {minutes} token is handled correctly when the minutes is 0',
								[_testDateTimeIsMidnight,'{minutes}'],
								'0'
							],
							['Test that the {minutes} token is handled correctly when the minutes is 59',
								[_testDateTimeIsJustBeforeNoon,'{minutes}'],
								'59'
							],
							['Test that the {minutes} token is handled correctly for an invalid date',
								[_testDateInvalid,'{minutes}'],
								'?'
							],

						/*** test handling of the {ss} token ***/
							['Test that the {ss} token is handled correctly when the seconds is 0',
								[_testDateTimeIsMidnight,'{ss}'],
								'00'
							],
							['Test that the {ss} token is handled correctly when the seconds is 59',
								[_testDateTimeIsJustBeforeNoon,'{ss}'],
								'59'
							],
							['Test that the {ss} token is handled correctly for an invalid date',
								[_testDateInvalid,'{ss}'],
								'??'
							],

						/*** test handling of the {seconds} token ***/
							['Test that the {seconds} token is handled correctly when the seconds is 0',
								[_testDateTimeIsMidnight,'{seconds}'],
								'0'
							],
							['Test that the {seconds} token is handled correctly when the seconds is 59',
								[_testDateTimeIsJustBeforeNoon,'{seconds}'],
								'59'
							],
							['Test that the {seconds} token is handled correctly for an invalid date',
								[_testDateInvalid,'{seconds}'],
								'?'
							],

						/*** test handling of the {zzz} token ***/
							['Test that the {zzz} token is handled correctly when the milliseconds is 0',
								[_testDateTimeIsMidnight,'{zzz}'],
								'000'
							],
							['Test that the {zzz} token is handled correctly when the milliseconds is 9',
								[_newDate (2001,1,1,11,59,59,9),'{zzz}'],
								'009'
							],
							['Test that the {zzz} token is handled correctly when the milliseconds is 99',
								[_newDate (2001,1,1,11,59,59,99),'{zzz}'],
								'099'
							],
							['Test that the {zzz} token is handled correctly when the milliseconds is 999',
								[_testDateTimeIsJustBeforeNoon,'{zzz}'],
								'999'
							],
							['Test that the {zzz} token is handled correctly for an invalid date',
								[_testDateInvalid,'{zzz}'],
								'???'
							],

						/*** test handling of the {milliseconds} token ***/
							['Test that the {milliseconds} token is handled correctly when the milliseconds is 0',
								[_testDateTimeIsMidnight,'{milliseconds}'],
								'0'
							],
							['Test that the {milliseconds} token is handled correctly when the milliseconds is 9',
								[_newDate (2001,1,1,11,59,59,9),'{milliseconds}'],
								'9'
							],
							['Test that the {milliseconds} token is handled correctly when the milliseconds is 99',
								[_newDate (2001,1,1,11,59,59,99),'{milliseconds}'],
								'99'
							],
							['Test that the {milliseconds} token is handled correctly when the milliseconds is 999',
								[_testDateTimeIsJustBeforeNoon,'{milliseconds}'],
								'999'
							],
							['Test that the {milliseconds} token is handled correctly for an invalid date',
								[_testDateInvalid,'{milliseconds}'],
								'?'
							],

						/*** test that date to format can be specified in a number of other different ways ***/
							['Test that date to format can be specified as a string',
								[_testDate + '','{YYYY}-{MM}-{DD}'],
								'2001-09-11'
							],
							['Test that date to format can be specified as a string in ISO8601 format',
								['2001-09-11','{YYYY}-{MM}-{DD}'],
								'2001-09-11'
							],
							['Test that date to format can be specified as a millisecond integers number',
								[+_testDate,'{YYYY}-{MM}-{DD}'],
								'2001-09-11'
							],

						/*** miscellaneous tests ***/
							['Test that the same token can be used more than once in the format string',
								[_testDate,'{YYYY}{YYYY}{YYYY}'],
								'200120012001'
							],
							['Test that characters surrounding tokens are preserved',
								[_testDate,'year: {YYYY}, YEAR: {YYYY}, Year --> {YYYY} <-- Year'],
								'year: 2001, YEAR: 2001, Year --> 2001 <-- Year'
							],
							['Test that all tokens can be used in the same format string',
								[
									_testDate,
									'YY: {YY}, YYYY: {YYYY}, MM: {MM}, monthNo: {monthNo}, monthName: {monthName}, shortMonthName: {shortMonthName}, DD: {DD}, dayNo: {dayNo}, dayNoSuffix: {dayNoSuffix}, dayName: {dayName}, shortDayName: {shortDayName}, hh: {hh}, h12: {h12}, hh12: {hh12}, mm: {mm}, minutes: {minutes}, ss: {ss}, seconds: {seconds}, zzz: {zzz}, milliseconds: {milliseconds}, ampm: {ampm}'
								],
								'YY: 01, YYYY: 2001, MM: 09, monthNo: 9, monthName: September, shortMonthName: Sep, DD: 11, dayNo: 11, dayNoSuffix: th, dayName: Tuesday, shortDayName: Tue, hh: 08, h12: 8, hh12: 08, mm: 46, minutes: 46, ss: 40, seconds: 40, zzz: 095, milliseconds: 95, ampm: am'
							],
							['Test that the default format is {dayName}, {dayNo}{dayNoSuffix} {monthName} {YYYY}',
								_testDate,
								'Tuesday, 11th September 2001'
							]
					]],
					['Uize.Date.Formatter.toPretty',[
					]],
					['Uize.Date.Formatter.parse',[
						/*** test that non-string values for date to parse are handled correctly ***/
							['Test that a date specified as a Date object instance is handled correctly',
								[_testDate],
								_testDate
							],
							['Test that specifying the value null for the date to parse produces the value undefined',
								null,
								undefined
							],
							['Test that specifying an empty string for the date to parse produces the value undefined',
								'',
								undefined
							],
							['Test that a date specified as a number is handled correctly',
								[+_testDate],
								_testDate
							],

						/*** test handling of the {YYYY} token ***/
							['Test that the {YYYY} token is handled correctly when year is specified with four digits',
								['2001','{YYYY}'],
								_newDate (2001,1,1)
							],
							['Test that the {YYYY} token is handled correctly when year is less than 100 (ie. year is not placed in 20th century)',
								['0099','{YYYY}'],
								_newDate (99,1,1)
							],
							['Test that the {YYYY} token does not match numbers with less than four digits specified',
								['200','{YYYY}'],
								undefined
							],

						/*** test handling of the {YY} token ***/
							['Test that the {YY} token is handled correctly when year is specified with two digits',
								['99','{YY}'],
								_newDate (1999,1,1)
							],
							['Test that the {YY} token is handled correctly when year is less than 10',
								['09','{YY}'],
								_newDate (1909,1,1)
							],
							['Test that the {YY} token does not match numbers with less than two digits specified',
								['9','{YY}'],
								undefined
							],
							['Test that the {YY} token will match only the first two digits in a four digit year',
								['2001','{YY}'],
								_newDate (1920,1,1)
							],

						/*** test handling of the {MM} token ***/
							['Test that the {MM} token is handled correctly when month is specified with two digits',
								['12','{MM}'],
								_newDate (0,12,1)
							],
							['Test that the {MM} token is handled correctly when month is less than 10',
								['09','{MM}'],
								_newDate (0,9,1)
							],
							['Test that the {MM} token does not match a two digit number that is greater than 12',
								['13','{MM}'],
								undefined
							],
							['Test that the {MM} token does not match a two digit number that is less than 1 (ie. 0)',
								['00','{MM}'],
								undefined
							],
							['Test that the {MM} token does not match numbers with less than two digits specified',
								['9','{MM}'],
								undefined
							],

						/*** test handling of the {monthNo} token ***/
							['Test that the {monthNo} token is handled correctly when month is specified with two digits',
								['12','{monthNo}'],
								_newDate (0,12,1)
							],
							['Test that the {monthNo} token is handled correctly when month is specified with one digit',
								['9','{monthNo}'],
								_newDate (0,9,1)
							],
							['Test that the {monthNo} token will not match a two digit number that is greater than 12, but will instead match only the first digit',
								['73','{monthNo}'],
								_newDate (0,7,1)
							],
							['Test that the {monthNo} token does not match a one digit number that is less than 1 (ie. 0)',
								['0','{monthNo}'],
								undefined
							],

						/*** test handling of the {monthName} token ***/
							['Test that the {monthName} token is handled correctly for January',
								['January','{monthName}'],
								_newDate (0,1,1)
							],
							['Test that the {monthName} token is handled correctly for February',
								['February','{monthName}'],
								_newDate (0,2,1)
							],
							['Test that the {monthName} token is handled correctly for March',
								['March','{monthName}'],
								_newDate (0,3,1)
							],
							['Test that the {monthName} token is handled correctly for April',
								['April','{monthName}'],
								_newDate (0,4,1)
							],
							['Test that the {monthName} token is handled correctly for May',
								['May','{monthName}'],
								_newDate (0,5,1)
							],
							['Test that the {monthName} token is handled correctly for June',
								['June','{monthName}'],
								_newDate (0,6,1)
							],
							['Test that the {monthName} token is handled correctly for July',
								['July','{monthName}'],
								_newDate (0,7,1)
							],
							['Test that the {monthName} token is handled correctly for August',
								['August','{monthName}'],
								_newDate (0,8,1)
							],
							['Test that the {monthName} token is handled correctly for September',
								['September','{monthName}'],
								_newDate (0,9,1)
							],
							['Test that the {monthName} token is handled correctly for October',
								['October','{monthName}'],
								_newDate (0,10,1)
							],
							['Test that the {monthName} token is handled correctly for November',
								['November','{monthName}'],
								_newDate (0,11,1)
							],
							['Test that the {monthName} token is handled correctly for December',
								['December','{monthName}'],
								_newDate (0,12,1)
							],

						/*** test handling of the {shortMonthName} token ***/
							['Test that the {shortMonthName} token is handled correctly for January',
								['Jan','{shortMonthName}'],
								_newDate (0,1,1)
							],
							['Test that the {shortMonthName} token is handled correctly for February',
								['Feb','{shortMonthName}'],
								_newDate (0,2,1)
							],
							['Test that the {shortMonthName} token is handled correctly for March',
								['Mar','{shortMonthName}'],
								_newDate (0,3,1)
							],
							['Test that the {shortMonthName} token is handled correctly for April',
								['Apr','{shortMonthName}'],
								_newDate (0,4,1)
							],
							['Test that the {shortMonthName} token is handled correctly for May',
								['May','{shortMonthName}'],
								_newDate (0,5,1)
							],
							['Test that the {shortMonthName} token is handled correctly for June',
								['Jun','{shortMonthName}'],
								_newDate (0,6,1)
							],
							['Test that the {shortMonthName} token is handled correctly for July',
								['Jul','{shortMonthName}'],
								_newDate (0,7,1)
							],
							['Test that the {shortMonthName} token is handled correctly for August',
								['Aug','{shortMonthName}'],
								_newDate (0,8,1)
							],
							['Test that the {shortMonthName} token is handled correctly for September',
								['Sep','{shortMonthName}'],
								_newDate (0,9,1)
							],
							['Test that the {shortMonthName} token is handled correctly for October',
								['Oct','{shortMonthName}'],
								_newDate (0,10,1)
							],
							['Test that the {shortMonthName} token is handled correctly for November',
								['Nov','{shortMonthName}'],
								_newDate (0,11,1)
							],
							['Test that the {shortMonthName} token is handled correctly for December',
								['Dec','{shortMonthName}'],
								_newDate (0,12,1)
							],

						/*** test handling of the {DD} token ***/
							['Test that the {DD} token is handled correctly when date is specified with two digits',
								['31','{DD}'],
								_newDate (0,1,31)
							],
							['Test that the {DD} token is handled correctly when date is less than 10',
								['09','{DD}'],
								_newDate (0,1,9)
							],
							['Test that the {DD} token does not match a two digit number that is greater than 31',
								['32','{DD}'],
								undefined
							],
							['Test that the {DD} token does not match a two digit number that is less than 1 (ie. 0)',
								['00','{DD}'],
								undefined
							],
							['Test that the {DD} token does not match numbers with less than two digits specified',
								['9','{DD}'],
								undefined
							],

						/*** test handling of the {dayNo} token ***/
							['Test that the {dayNo} token is handled correctly when day number is specified with two digits',
								['10','{dayNo}'],
								_newDate (0,1,10)
							],
							['Test that the {dayNo} token is handled correctly when day number is specified with one digit',
								['9','{dayNo}'],
								_newDate (0,1,9)
							],
							['Test that the {dayNo} token will not match a two digit number that is greater than 31, but will instead match only the first digit',
								['32','{dayNo}'],
								_newDate (0,1,3)
							],
							['Test that the {dayNo} token does not match a one digit number that is less than 1 (ie. 0)',
								['0','{dayNo}'],
								undefined
							],

						/*** test handling of the {dayNoSuffix} token ***/
							['Test that the {dayNoSuffix} token is handled correctly for the "st" suffix',
								['st','{dayNoSuffix}'],
								_newDate (0,1,1)
							],
							['Test that the {dayNoSuffix} token is handled correctly for the "nd" suffix',
								['nd','{dayNoSuffix}'],
								_newDate (0,1,1)
							],
							['Test that the {dayNoSuffix} token is handled correctly for the "rd" suffix',
								['rd','{dayNoSuffix}'],
								_newDate (0,1,1)
							],
							['Test that the {dayNoSuffix} token is handled correctly for the "th" suffix',
								['th','{dayNoSuffix}'],
								_newDate (0,1,1)
							],
							['Test that the {dayNoSuffix} token does not match a date string with no {dayNoSuffix} value specified',
								['XX','{dayNoSuffix}'],
								undefined
							],

						/*** test handling of the {dayName} token ***/
							['Test that the {dayName} token is handled correctly for Sunday',
								['Sunday','{dayName}'],
								_newDate (0,1,1)
							],
							['Test that the {dayName} token is handled correctly for Monday',
								['Monday','{dayName}'],
								_newDate (0,1,1)
							],
							['Test that the {dayName} token is handled correctly for Tuesday',
								['Tuesday','{dayName}'],
								_newDate (0,1,1)
							],
							['Test that the {dayName} token is handled correctly for Wednesday',
								['Wednesday','{dayName}'],
								_newDate (0,1,1)
							],
							['Test that the {dayName} token is handled correctly for Thursday',
								['Thursday','{dayName}'],
								_newDate (0,1,1)
							],
							['Test that the {dayName} token is handled correctly for Friday',
								['Friday','{dayName}'],
								_newDate (0,1,1)
							],
							['Test that the {dayName} token is handled correctly for Saturday',
								['Saturday','{dayName}'],
								_newDate (0,1,1)
							],
							['Test that the {dayName} token does not match a date string with no {dayName} value name',
								['XXXXXXX','{dayName}'],
								undefined
							],

						/*** test handling of the {shortDayName} token ***/
							['Test that the {shortDayName} token is handled correctly for Sunday',
								['Sun','{shortDayName}'],
								_newDate (0,1,1)
							],
							['Test that the {shortDayName} token is handled correctly for Monday',
								['Mon','{shortDayName}'],
								_newDate (0,1,1)
							],
							['Test that the {shortDayName} token is handled correctly for Tuesday',
								['Tue','{shortDayName}'],
								_newDate (0,1,1)
							],
							['Test that the {shortDayName} token is handled correctly for Wednesday',
								['Wed','{shortDayName}'],
								_newDate (0,1,1)
							],
							['Test that the {shortDayName} token is handled correctly for Thursday',
								['Thu','{shortDayName}'],
								_newDate (0,1,1)
							],
							['Test that the {shortDayName} token is handled correctly for Friday',
								['Fri','{shortDayName}'],
								_newDate (0,1,1)
							],
							['Test that the {shortDayName} token is handled correctly for Saturday',
								['Sat','{shortDayName}'],
								_newDate (0,1,1)
							],
							['Test that the {shortDayName} token does not match a date string with no {shortDayName} value specified',
								['XXX','{shortDayName}'],
								undefined
							],

						/*** test handling of the {hh} token ***/
							['Test that the {hh} token is handled correctly when hour is specified with two digits',
								['23','{hh}'],
								_newDate (0,1,1,23)
							],
							['Test that the {hh} token is handled correctly when hour is less than 10',
								['09','{hh}'],
								_newDate (0,1,1,9)
							],
							['Test that the {hh} token is handled correctly when the hour is 0',
								['00','{hh}'],
								_newDate (0,1,1)
							],
							['Test that the {hh} token does not match a two digit number that is greater than 23',
								['24','{hh}'],
								undefined
							],
							['Test that the {hh} token does not match numbers with less than two digits specified',
								['9','{hh}'],
								undefined
							],
							['Test that the {hh} token does not match a date string with no {hh} value specified',
								['XXX','{hh}'],
								undefined
							],

						/*** test handling of the {h12} token ***/
							['Test that the {h12} token is handled correctly when hour is specified with two digits',
								['12','{h12}'],
								_newDate (0,1,1)
							],
							['Test that the {h12} token is handled correctly when hour is less than 10',
								['9','{h12}'],
								_newDate (0,1,1,9)
							],
							['Test that the {h12} token does not match a number that is less than 1 (ie. 0)',
								['0','{h12}'],
								undefined
							],
							['Test that the {h12} token does not match a number that is greater than 12, but will instead match only the first digit',
								['13','{h12}'],
								_newDate (0,1,1,1)
							],
							['Test that the {h12} token does not match a date string with no {h12} value specified',
								['XXX','{h12}'],
								undefined
							],

						/*** test handling of the {hh12} token ***/
							['Test that the {hh12} token is handled correctly when hour is specified with two digits',
								['12','{hh12}'],
								_newDate (0,1,1)
							],
							['Test that the {hh12} token is handled correctly when hour is less than 10',
								['09','{hh12}'],
								_newDate (0,1,1,9)
							],
							['Test that the {hh12} token does not match a two digit number that is less than 1 (ie. 0)',
								['00','{hh12}'],
								undefined
							],
							['Test that the {hh12} token does not match a two digit number that is greater than 12',
								['13','{hh12}'],
								undefined
							],
							['Test that the {hh12} token does not match numbers with less than two digits specified',
								['9','{hh12}'],
								undefined
							],
							['Test that the {hh12} token does not match a date string with no {hh12} value specified',
								['XXX','{hh12}'],
								undefined
							],

						/*** test handling of the {ampm} token ***/
							['Test that the {ampm} token is handled correctly for am, when no hour is specified',
								['am','{ampm}'],
								_newDate (0,1,1)
							],
							['Test that the {ampm} token is handled correctly for pm, when no hour is specified',
								['pm','{ampm}'],
								_newDate (0,1,1,12)
							],
							['Test that the {ampm} token is handled correctly for the time 12am',
								['12am','{h12}{ampm}'],
								_newDate (0,1,1)
							],
							['Test that the {ampm} token is handled correctly for the time 1am',
								['1am','{h12}{ampm}'],
								_newDate (0,1,1,1)
							],
							['Test that the {ampm} token is handled correctly for the time 11am',
								['11am','{h12}{ampm}'],
								_newDate (0,1,1,11)
							],
							['Test that the {ampm} token is handled correctly for the time 12pm',
								['12pm','{h12}{ampm}'],
								_newDate (0,1,1,12)
							],
							['Test that the {ampm} token is handled correctly for the time 1pm',
								['1pm','{h12}{ampm}'],
								_newDate (0,1,1,13)
							],
							['Test that the {ampm} token is handled correctly for the time 11pm',
								['11pm','{h12}{ampm}'],
								_newDate (0,1,1,23)
							],
							['Test that the {ampm} token does not match a date string with no {ampm} value specified',
								['XXX','{ampm}'],
								undefined
							],

						/*** test handling of the {mm} token ***/
							['Test that the {mm} token is handled correctly when minutes is specified with two digits',
								['59','{mm}'],
								_newDate (0,1,1,0,59)
							],
							['Test that the {mm} token is handled correctly when minutes is less than 10',
								['09','{mm}'],
								_newDate (0,1,1,0,9)
							],
							['Test that the {mm} token does not match a two digit number that is greater than 59',
								['60','{mm}'],
								undefined
							],
							['Test that the {mm} token is handled correctly when the minutes is 0',
								['00','{mm}'],
								_newDate (0,1,1)
							],
							['Test that the {mm} token does not match numbers with less than two digits specified',
								['9','{mm}'],
								undefined
							],
							['Test that the {mm} token does not match a date string with no {mm} value specified',
								['XXX','{mm}'],
								undefined
							],

						/*** test handling of the {minutes} token ***/
							['Test that the {minutes} token is handled correctly when minutes is specified with two digits',
								['59','{minutes}'],
								_newDate (0,1,1,0,59)
							],
							['Test that the {minutes} token is handled correctly when minutes is specified with one digit',
								['9','{minutes}'],
								_newDate (0,1,1,0,9)
							],
							['Test that the {minutes} token does not match a two digit number that is greater than 59, but will instead match only the first digit',
								['60','{minutes}'],
								_newDate (0,1,1,0,6)
							],
							['Test that the {minutes} token is handled correctly when the minutes is 0',
								['0','{minutes}'],
								_newDate (0,1,1)
							],
							['Test that the {minutes} token does not match a date string with no {minutes} value specified',
								['XXX','{minutes}'],
								undefined
							],

						/*** test handling of the {ss} token ***/
							['Test that the {ss} token is handled correctly when seconds is specified with two digits',
								['59','{ss}'],
								_newDate (0,1,1,0,0,59)
							],
							['Test that the {ss} token is handled correctly when seconds is less than 10',
								['09','{ss}'],
								_newDate (0,1,1,0,0,9)
							],
							['Test that the {ss} token does not match a two digit number that is greater than 59',
								['60','{ss}'],
								undefined
							],
							['Test that the {ss} token is handled correctly when the seconds is 0',
								['00','{ss}'],
								_newDate (0,1,1)
							],
							['Test that the {ss} token does not match numbers with less than two digits specified',
								['9','{ss}'],
								undefined
							],
							['Test that the {ss} token does not match a date string with no {ss} value specified',
								['XXX','{ss}'],
								undefined
							],

						/*** test handling of the {seconds} token ***/
							['Test that the {seconds} token is handled correctly when seconds is specified with two digits',
								['59','{seconds}'],
								_newDate (0,1,1,0,0,59)
							],
							['Test that the {seconds} token is handled correctly when seconds is specified with one digit',
								['9','{seconds}'],
								_newDate (0,1,1,0,0,9)
							],
							['Test that the {seconds} token does not match a two digit number that is greater than 59, but will instead match only the first digit',
								['60','{seconds}'],
								_newDate (0,1,1,0,0,6)
							],
							['Test that the {seconds} token is handled correctly when the seconds is 0',
								['0','{seconds}'],
								_newDate (0,1,1)
							],
							['Test that the {seconds} token does not match a date string with no {seconds} value specified',
								['XXX','{seconds}'],
								undefined
							],

						/*** test handling of the {zzz} token ***/
							['Test that the {zzz} token is handled correctly when milliseconds is specified with three digits',
								['999','{zzz}'],
								_newDate (0,1,1,0,0,0,999)
							],
							['Test that the {zzz} token is handled correctly when milliseconds is less than 100',
								['099','{zzz}'],
								_newDate (0,1,1,0,0,0,99)
							],
							['Test that the {zzz} token is handled correctly when milliseconds is less than 10',
								['009','{zzz}'],
								_newDate (0,1,1,0,0,0,9)
							],
							['Test that the {zzz} token is handled correctly when the milliseconds is 0',
								['000','{zzz}'],
								_newDate (0,1,1)
							],
							['Test that the {zzz} token does not match numbers with only two digits specified',
								['99','{zzz}'],
								undefined
							],
							['Test that the {zzz} token does not match numbers with only one digit specified',
								['9','{zzz}'],
								undefined
							],
							['Test that the {zzz} token does not match a date string with no {zzz} value specified',
								['XXX','{zzz}'],
								undefined
							],

						/*** test handling of the {milliseconds} token ***/
							['Test that the {milliseconds} token is handled correctly when milliseconds is specified with three digits',
								['999','{milliseconds}'],
								_newDate (0,1,1,0,0,0,999)
							],
							['Test that the {milliseconds} token is handled correctly when milliseconds is specified with two digits',
								['99','{milliseconds}'],
								_newDate (0,1,1,0,0,0,99)
							],
							['Test that the {milliseconds} token is handled correctly when milliseconds is specified with one digit',
								['9','{milliseconds}'],
								_newDate (0,1,1,0,0,0,9)
							],
							['Test that the {milliseconds} token is handled correctly when the milliseconds is 0',
								['0','{milliseconds}'],
								_newDate (0,1,1)
							],
							['Test that the {milliseconds} token does not match a date string with no {milliseconds} value specified',
								['XXX','{milliseconds}'],
								undefined
							],

						/*** test handling of extraneous text ***/
							['Test that tokens may be interspersed within extraneous static text',
								['YYYY:2001,MM:09,DD:11','YYYY:{YYYY},MM:{MM},DD:{DD}'],
								_newDate (2001,9,11)
							],
							['Test that static text in a date format must exist in a date string in order for the date to be successfully parsed',
								['2001-09-11','DATE:{YYYY}-{MM}-{DD}'],
								undefined
							],
							['Test that text surrounding a date in a date string is ignored',
								['DATE --> 2001-09-11 <-- DATE','{YYYY}-{MM}-{DD}'],
								_newDate (2001,9,11)
							],
							['Test that a date string to parse may contain multiple dates, but only the date matching the specified format will govern the result',
								['2000-8-10,2001-09-11,2002/10/12','{YYYY}-{MM}-{DD}'],
								_newDate (2001,9,11)
							],
							['Test that a date string may contain multiple dates of a specified format, but only the first date matching the format will be parsed',
								['2000-08-10,2001-09-11,2002-10-12','{YYYY}-{MM}-{DD}'],
								_newDate (2000,8,10)
							],
							['Test that extraneous text around tokens may contain regular expression special characters',
								['{[(2001|\\$^*+?.09|\\$^*+?.11)]}','{[({YYYY}|\\$^*+?.{MM}|\\$^*+?.{DD})]}'],
								_newDate (2001,9,11)
							],

						/*** test whitespace handling ***/
							['Test that whitespace within extraneous static text is implicitly treated as flexible',
								['DATE:    2001-09-11','DATE: {YYYY}-{MM}-{DD}'],
								_newDate (2001,9,11)
							],
							['Test that whitespace within extraneous static text requires that some whitespace exist in the same place in the date string to parse',
								['DATE:2001-09-11','DATE: {YYYY}-{MM}-{DD}'],
								undefined
							],
							['Test that tokens imply optional arbitrary whitespace around them in a date string to parse',
								['2001 \t - \n 09    -    11','{YYYY}-{MM}-{DD}'],
								_newDate (2001,9,11)
							],

						/*** miscellaneous tests ***/
							['Test that a date string containing tokens for all components of a date is handled correctly',
								[
									'YY: 01, YYYY: 2001, MM: 09, monthNo: 9, monthName: September, shortMonthName: Sep, DD: 11, dayNo: 11, dayNoSuffix: th, dayName: Tuesday, shortDayName: Tue, hh: 08, h12: 8, hh12: 08, mm: 46, minutes: 46, ss: 40, seconds: 40, zzz: 095, milliseconds: 95, ampm: am',
									'YY: {YY}, YYYY: {YYYY}, MM: {MM}, monthNo: {monthNo}, monthName: {monthName}, shortMonthName: {shortMonthName}, DD: {DD}, dayNo: {dayNo}, dayNoSuffix: {dayNoSuffix}, dayName: {dayName}, shortDayName: {shortDayName}, hh: {hh}, h12: {h12}, hh12: {hh12}, mm: {mm}, minutes: {minutes}, ss: {ss}, seconds: {seconds}, zzz: {zzz}, milliseconds: {milliseconds}, ampm: {ampm}'
								],
								_testDate
							],
							['Test that the same token can be used more than once in the format string, and that the last instance of the token wins',
								['2001,2002,2003','{YYYY},{YYYY},{YYYY}'],
								_newDate (2003)
							],
							['Test that date parsing is case insensitive, for both month names and day names, as well as extraneous static text around tokens',
								['date: tUeSdAy 11TH sEpTeMbEr 2001','DATE: {dayName} {dayNo}{dayNoSuffix} {monthName} {YYYY}'],
								_newDate (2001,9,11)
							],

						/*** test support for objects that implement valueOf interface ***/
							['Test that a date specified as a Date object instance is handled correctly',
								[Uize.Class.Value ({value:_testDate})],
								_testDate
							],
							['Test that specifying the value null for the date to parse produces the value undefined',
								[Uize.Class.Value ({value:null})],
								undefined
							],
							['Test that specifying an empty string for the date to parse produces the value undefined',
								[Uize.Class.Value ({value:''})],
								undefined
							],
							['Test that a date specified as a number is handled correctly',
								[Uize.Class.Value ({value:+_testDate})],
								_testDate
							],
							['Test that a date specified as a number is handled correctly',
								[Uize.Class.Value ({value:'2001-09-11'}),'{YYYY}-{MM}-{DD}'],
								_newDate (2001,9,11)
							],

						/*** test fallback to use of Uize.Date.resolve method when no format is specified ***/
							['Test that when no format is specified, an ISO 8601 formatted date is parsed correctly',
								['2001-09-11'],
								_newDate (2001,9,11)
							],
							['Test that when no format is specified, a serialized Date object is parsed correctly',
								[_newDate (2001,9,11,8,46,40) + ''],
								_newDate (2001,9,11,8,46,40)
							]
					]]
				])
			]
		});
	}
});

