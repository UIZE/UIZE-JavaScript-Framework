/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Date Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Test
	importance: 3
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Test.Uize.Date= module defines a suite of unit tests for the =Uize.Date= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Date',
	required:[
		'Uize.Class',
		'Uize.Class.Value'
	],
	builder:function () {
		'use strict';

		function _dateToNumber (_date) {return +_date}
		function _dateToString (_date) {return _date + ''}
		function _dateToIso8601String (_date) {return Uize.Date.toIso8601 (_date)}

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
			_defaultDate = new Date,
			_oneDayInMilliseconds = 24 * 60 * 60 * 1000,
			_nowTestFudgeFactor = 10,

			/*** various test dates, for use in tests for different methods ***/
				_testDate = _newDate (2001,9,11,8,46,40),
				_testDateInvalid = new Date (NaN),
				_testDateYearWithOneDigit = _newDate (9,1,1),
				_testDateYearWithTwoDigits = _newDate (99,1,1),
				_testDateYearWithThreeDigits = _newDate (999,1,1),
				_testDateYearWithFourDigits = _newDate (9999,1,1),
				_testDateMonthWithOneDigit = _newDate (2001,1,1),
				_testDateMonthWithTwoDigits = _newDate (2001,12,1),
				_testDateDateWithOneDigit = _newDate (2001,1,1),
				_testDateDateWithTwoDigits = _newDate (2001,1,31),

				/*** dates for testing date ranges ***/
					_testDateBeforeDateRangeMin = _newDate (2001,1,1,23,59,59,999),
					_testDateDateRangeMin = _newDate (2001,1,2,0,0,0,0),
					_testDateWithinDateRange = _newDate (2001,6,15),
					_testDateDateRangeMax = _newDate (2001,12,31,23,59,59,999),
					_testDateAfterDateRangeMax = _newDate (2002,1,1,0,0,0,0),
					_dateRangeWithMinAndMax = {minValue:_testDateDateRangeMin,maxValue:_testDateDateRangeMax},
					_dateRangeWithOnlyMin = {minValue:_testDateDateRangeMin},
					_dateRangeWithOnlyMax = {minValue:_testDateDateRangeMax},
					_dateRangeWhereMinIsUsedForMax = {minValue:_testDateDateRangeMin,maxValue:_testDateDateRangeMin},
					_dateRangeWithoutBounds = {}
		;

		function _resolveShouldReturnNowTest (_testTitle,_arguments) {
			return {
				title:_testTitle,
				test:function () {
					var
						_now = Uize.now (),
						_result = Uize.Date.resolve.apply (Uize.Date,_arguments)
					;
					return this.expectInstanceOf (Date,_result) && _now - _result < _nowTestFudgeFactor;
				}
			};
		}
		function _dateMethodShouldReturnSpecificDateTest (_testTitle,_methodName,_arguments,_specificDate) {
			return {
				title:_testTitle,
				test:function () {
					var _result = Uize.Date [_methodName].apply (Uize.Date,_arguments);
					return (
						this.expectInstanceOf (Date,_result) &&
						_result.getFullYear () == _specificDate.getFullYear () &&
						_result.getMonth () == _specificDate.getMonth () &&
						_result.getDate () == _specificDate.getDate ()
					);
				}
			};
		}
		function _resolveShouldReturnSpecificDateTest (_testTitle,_arguments,_specificDate) {
			return _dateMethodShouldReturnSpecificDateTest (_testTitle,'resolve',_arguments,_specificDate);
		}
		function _isRecentDaysFromNowTest (_testTitle,_daysFromNow,_recencyWindow,_expectedValue,_dateEncoder) {
			return {
				title:_testTitle,
				test:function () {
					var _now = Uize.now ();
					return this.expect (
						_expectedValue,
						Uize.Date.isRecent (
							(_dateEncoder || Uize.returnX) (new Date (+_now + _daysFromNow * _oneDayInMilliseconds)),
							_recencyWindow,
							_now
						)
					);
				}
			}
		}

		function _dateRangeValueCanBeOfTypeTest (_testTitle,_rangeProperty,_dateEncoder) {
			return {
				title:_testTitle,
				test:function () {
					var _dateRange = {minValue:_testDateDateRangeMin,maxValue:_testDateDateRangeMin};
					_dateRange [_rangeProperty] = _dateEncoder (_testDateDateRangeMin);
					return (
						!Uize.Date.inRange (_testDateBeforeDateRangeMin,_dateRange) &&
						Uize.Date.inRange (_testDateDateRangeMin,_dateRange) &&
						!Uize.Date.inRange (_testDateWithinDateRange,_dateRange)
					);
				}
			}
		}

		function _getRangeAroundTest (_testTitle,_arguments,_expectedDateRange) {
			return {
				title:_testTitle,
				test:function () {
					var _dateRange = Uize.Date.getRangeAround.apply (Uize.Date,_arguments);
					return !(
						_dateRange.minValue - _expectedDateRange.minValue ||
						_dateRange.maxValue - _expectedDateRange.maxValue
					);
				}
			};
		}

		function _getRangeAroundTestsForRangeSize (_rangeSize,_rangeMinValue,_rangeMiddleValue,_rangeMaxValue) {
			var _expectedDateRange = {minValue:_rangeMinValue,maxValue:_rangeMaxValue};
			return {
				title:'Tests for getting a ' + _rangeSize + ' sized range around dates that fall at the beginning, in the middle, and at the end of a ' + _rangeSize,
				test:[
					_getRangeAroundTest (
						'Test getting a ' + _rangeSize + ' sized range around a date that is at the beginning of a ' + _rangeSize,
						[_rangeMinValue,_rangeSize],
						_expectedDateRange
					),
					_getRangeAroundTest (
						'Test getting a ' + _rangeSize + ' sized range around a date that is within a ' + _rangeSize,
						[_rangeMiddleValue,_rangeSize],
						_expectedDateRange
					),
					_getRangeAroundTest (
						'Test getting a ' + _rangeSize + ' sized range around a date that is at the end of a ' + _rangeSize,
						[_rangeMaxValue,_rangeSize],
						_expectedDateRange
					)
				]
			};
		}

		function _dateToGetRangeAroundIsDefaultedToNowTest (_value,_valueDisplayName) {
			return {
				title:'Test that date to get range around is defaulted to now when its value is ' + _valueDisplayName,
				test:function () {
					var
						_rangeAroundNow = Uize.Date.getRangeAround (new Date,'month'),
						_rangeAroundValue = Uize.Date.getRangeAround (_value,'month')
					;
					return (
						_rangeAroundValue.minValue - _rangeAroundNow.minValue < _nowTestFudgeFactor &&
						_rangeAroundValue.maxValue - _rangeAroundNow.maxValue < _nowTestFudgeFactor
					);
				}
			};
		}

		return Uize.Test.declare ({
			title:'Test for Uize.Date Module',
			test:[
				Uize.Test.requiredModulesTest ('Uize.Date'),
				Uize.Test.staticMethodsTest ([
					['Uize.Date.convert',[
						['Test that converting 1 year to months produces the result 12',
							[1,'years','months'],
							12
						],
						['Test that converting 1 month to weeks produces the result 4.348121428571429',
							[1,'months','weeks'],
							4.348121428571429
						],
						['Test that converting 1 week to days produces the result 7',
							[1,'weeks','days'],
							7
						],
						['Test that converting 1 day to hours produces the result 24',
							[1,'days','hours'],
							24
						],
						['Test that converting 1 hour to minutes produces the result 60',
							[1,'hours','minutes'],
							60
						],
						['Test that converting 1 minute to seconds produces the result 60',
							[1,'minutes','seconds'],
							60
						],
						['Test that converting 1 second to milliseconds produces the result 1000',
							[1,'seconds','ms'],
							1000
						],
						['Test that converting 1 month to years produces the result 1/12',
							[1,'months','years'],
							1/12
						],
						/*
						['Test that converting 1 week to months produces the result 1/4.348121428571429',
							[1,'weeks','months'],
							1/4.348121428571429  // troublesome, because of precision issues
						],
						*/
						['Test that converting 1 day to weeks produces the result 1/7',
							[1,'days','weeks'],
							1/7
						],
						['Test that converting 1 hour to days produces the result 1/24',
							[1,'hours','days'],
							1/24
						],
						['Test that converting 1 minute to hours produces the result 1/60',
							[1,'minutes','hours'],
							1/60
						],
						['Test that converting 1 second to minutes produces the result 1/60',
							[1,'seconds','minutes'],
							1/60
						],
						['Test that converting 1 millisecond to seconds produces the result 1/1000',
							[1,'ms','seconds'],
							1/1000
						],
						['Test that the value to be converted can be a string type',
							['2','hours','seconds'],
							7200
						],
						['Test that the values for all the parameters can be Uize class instances',
							[
								Uize.Class.Value ({value:'2'}),
								Uize.Class.Value ({value:'hours'}),
								Uize.Class.Value ({value:'seconds'})
							],
							7200
						]
					]],
					['Uize.Date.isLeapYear',[
						['Test that a year that is not perfectly divisible by 4 is not considered a leap year',
							2001,
							false
						],
						['Test that a year that is perfectly divisible by 4, but is not perfectly divisible by 100, is considered a leap year',
							2004,
							true
						],
						['Test that a year that is perfectly divisible by 4, but that is perfectly divisible by 100 and not perfectly divisible by 400, is not considered a leap year',
							1900,
							false
						],
						['Test that a year that is perfectly divisible by 4, but is perfectly divisible by 100, but is also perfectly divisible by 400, is considered a leap year',
							2000,
							true
						]
					]],
					['Uize.Date.getDaysInMonth',[
						/*** test all months of a non-leap year ***/
							['Test that January has 31 days in a non-leap year',[0,2001],31],
							['Test that February has 28 days in a non-leap year',[1,2001],28],
							['Test that March has 31 days in a non-leap year',[2,2001],31],
							['Test that April has 30 days in a non-leap year',[3,2001],30],
							['Test that May has 31 days in a non-leap year',[4,2001],31],
							['Test that June has 30 days in a non-leap year',[5,2001],30],
							['Test that July has 31 days in a non-leap year',[6,2001],31],
							['Test that August has 31 days in a non-leap year',[7,2001],31],
							['Test that September has 30 days in a non-leap year',[8,2001],30],
							['Test that October has 31 days in a non-leap year',[9,2001],31],
							['Test that November has 30 days in a non-leap year',[10,2001],30],
							['Test that December has 31 days in a non-leap year',[11,2001],31],

						/*** test all months of a leap year ***/
							['Test that January has 31 days in a leap year',[0,2000],31],
							['Test that February has 29 days in a leap year',[1,2000],29],
							['Test that March has 31 days in a leap year',[2,2000],31],
							['Test that April has 30 days in a leap year',[3,2000],30],
							['Test that May has 31 days in a leap year',[4,2000],31],
							['Test that June has 30 days in a leap year',[5,2000],30],
							['Test that July has 31 days in a leap year',[6,2000],31],
							['Test that August has 31 days in a leap year',[7,2000],31],
							['Test that September has 30 days in a leap year',[8,2000],30],
							['Test that October has 31 days in a leap year',[9,2000],31],
							['Test that November has 30 days in a leap year',[10,2000],30],
							['Test that December has 31 days in a leap year',[11,2000],31]
					]],
					['Uize.Date.fromIso8601',[
						_dateMethodShouldReturnSpecificDateTest (
							'Test that an ISO8601 date string formatted in the typical YYYY-MM-DD manner is decoded correctly',
							'fromIso8601',
							['2001-09-11'],
							_testDate
						),
						['Test that a date string that is not formatted as ISO8601 produces the result undefined',
							'THIS IS NOT A VALID ISO8601 DATE STRING',
							undefined
						],
						_dateMethodShouldReturnSpecificDateTest (
							'Test that an ISO8601 formatted date string is allowed to have three digits for the year',
							'fromIso8601',
							['999-01-02'],
							_newDate (999,1,2)
						),
						_dateMethodShouldReturnSpecificDateTest (
							'Test that an ISO8601 formatted date string with a year less than 100 is not considered in the 20th century when more than two digits are specified for year',
							'fromIso8601',
							['099-01-02'],
							_newDate (99,1,2)
						),
						_dateMethodShouldReturnSpecificDateTest (
							'Test that an ISO8601 formatted date string is allowed to have two digits for the year',
							'fromIso8601',
							['99-01-02'],
							_newDate (1999,1,2)
						),
						['Test that a date string that has only one year digit is not considered a valid ISO8601 formatted date',
							'1-01-02',
							undefined
						],
						_dateMethodShouldReturnSpecificDateTest (
							'Test that an ISO8601 formatted date string is allowed to have more than four digits for the year',
							'fromIso8601',
							['12345-01-02'],
							_newDate (12345,1,2)
						),
						_dateMethodShouldReturnSpecificDateTest (
							'Test that an ISO8601 formatted date string is allowed to have only one digit for the month',
							'fromIso8601',
							['2000-1-02'],
							_newDate (2000,1,2)
						),
						_dateMethodShouldReturnSpecificDateTest (
							'Test that an ISO8601 formatted date string is allowed to have only one digit for the day',
							'fromIso8601',
							['2000-01-2'],
							_newDate (2000,1,2)
						),
						['Test that a date string that has more than two month digits is not considered a valid ISO8601 formatted date',
							'2000-001-02',
							undefined
						],
						['Test that a date string that has more than two day digits is not considered a valid ISO8601 formatted date',
							'2000-01-002',
							undefined
						],
						_dateMethodShouldReturnSpecificDateTest (
							'Test that an ISO8601 date string can be surrounded by extraneous text and still parsed correctly',
							'fromIso8601',
							['AN ISO8601 DATE ----> 2001-09-11 <---- AN ISO8601 DATE'],
							_testDate
						),
						{
							title:'Test that the returned Date object instance has its hours, minutes, seconds, and milliseconds all set to 0',
							test:function () {
								var _result = Uize.Date.fromIso8601 ('2001-09-11');
								return (
									!_result.getHours () &&
									!_result.getMinutes () &&
									!_result.getSeconds () &&
									!_result.getMilliseconds ()
								);
							}
						}
					]],
					['Uize.Date.resolve',[
						/*** test handling of the default date parameter ***/
							['Test that the specified default date is returned when undefined is specified for the dateSTRorOBJ parameter',
								[undefined,_defaultDate],
								_defaultDate
							],
							['Test that the specified default date is returned when null is specified for the dateSTRorOBJ parameter',
								[null,_defaultDate],
								_defaultDate
							],
							['Test that the specified default date is returned when an empty string is specified for the dateSTRorOBJ parameter',
								['',_defaultDate],
								_defaultDate
							],
							_resolveShouldReturnNowTest (
								'Test that specifying undefined as the default date results in the default being defaulted to a date initialized to now',
								['',undefined]
							),
							['Test that specifying null as the default date results in null being used as the default date',
								[undefined,null],
								null
							],
							['Test that the specified default date is returned when an empty string is specified for the dateSTRorOBJ parameter',
								['',_defaultDate],
								_defaultDate
							],
							{
								title:'Test that the specified default date is not used when a valid date to resolve is specified',
								test:function () {
									return Uize.Date.resolve ('Thu Apr 01 2010 18:45:01 GMT-0700 (Pacific Daylight Time)',_defaultDate) != _defaultDate;
								}
							},

						/*** test resolving dates specified in a number of different ways ***/
							_resolveShouldReturnSpecificDateTest (
								'Test that the date to resolve can be an ISO8601 formatted date',
								[_testDate.getFullYear () + '-' + (_testDate.getMonth () + 1) + '-' + _testDate.getDate ()],
								_testDate
							),
							_resolveShouldReturnSpecificDateTest (
								'Test that when an integer is specified for the date to resolve, a Date object instance is created with its time in milliseconds initialized to the specified number',
								[+_testDate],
								_testDate
							),
							_resolveShouldReturnSpecificDateTest (
								'Test that when the number 0 is specified for the date to resolve, a Date object instance is created with its time in milliseconds initialized to 0 (rather than defaulting to now)',
								[0],
								new Date (0)
							),
							_resolveShouldReturnSpecificDateTest (
								'Test that an instance of the Date object resolves to a new Date object instance, set to the same time',
								[_testDate],
								_testDate
							),
							_resolveShouldReturnSpecificDateTest (
								'Test that a correctly formatted valid date string resolves to a Date object instance initialized to the correct time',
								[_testDate + ''],
								_testDate
							),

						/*** miscellaneous ***/
							{
								title:'Test that a badly formatted date string resolves to a Date object instance initialized to the time NaN',
								test:function () {
									var _result = Uize.Date.resolve ('THIS IS NOT A VALID DATE STRING');
									return this.expectInstanceOf (Date,_result) && this.expectSameAs (NaN,+_result);
								}
							},
							_resolveShouldReturnNowTest (
								'Test that calling with no parameters produces a date object initialized to now',
								[]
							)
					]],
					['Uize.Date.toIso8601',[
						['Test that date to encode can be specified as a Date object instance',
							_testDate,
							'2001-09-11'
						],
						['Test that date to encode can be specified as a string',
							_testDate + '',
							'2001-09-11'
						],
						['Test that date to encode can be specified as a string in ISO8601 format',
							'2001-09-11',
							'2001-09-11'
						],
						['Test that date to encode can be specified as a millisecond integers number',
							[+_testDate],
							'2001-09-11'
						],
						['Test that leading zeros are added to year, month, and date, when necessary',
							new Date ('Thu Feb 01 0111 00:00:00 GMT-0800 (Pacific Standard Time)'),
							'0111-02-01'
						],
						{
							title:'Test that now is the default when date to encode is not specfied',
							test:function () {return Uize.Date.toIso8601 () == Uize.Date.toIso8601 (new Date)}
						},
						['Test that an invalid date is formatted in ISO8601 as ????-??-??',
							NaN,
							'????-??-??'
						]
					]],
					['Uize.Date.inRange',[
						/*** test different dates that fall at different places relative to a date range ***/
							['Test that a date that occurs before the start of a date range is not considered in that range',
								[_testDateBeforeDateRangeMin,_dateRangeWithMinAndMax],
								false
							],
							['Test that a date that occurs at the start of a date range is considered in that range',
								[_testDateDateRangeMin,_dateRangeWithMinAndMax],
								true
							],
							['Test that a date that occurs in the middle of a date range is considered in that range',
								[_testDateWithinDateRange,_dateRangeWithMinAndMax],
								true
							],
							['Test that a date that occurs at the end of a date range is considered in that range',
								[_testDateDateRangeMax,_dateRangeWithMinAndMax],
								true
							],
							['Test that a date that occurs after the end of a date range is not considered in that range',
								[_testDateAfterDateRangeMax,_dateRangeWithMinAndMax],
								false
							],

						/*** test that date to test can be specified in a number of other different ways ***/
							['Test that the date to test can be specified as a string',
								[_testDateDateRangeMin + '',_dateRangeWhereMinIsUsedForMax],
								true
							],
							['Test that the date to test can be specified as a string in ISO8601 format',
								['2001-01-02',_dateRangeWhereMinIsUsedForMax],
								true
							],
							['Test that the date to test can be specified as a millisecond integers number',
								[+_testDateDateRangeMin,_dateRangeWhereMinIsUsedForMax],
								true
							],

						/*** test defaulting of the minValue property of the date range ***/
							['Test that start of a date range is defaulted to -Infinity when its value is undefined',
								[-Infinity,{maxValue:_testDateDateRangeMax}],
								true
							],
							['Test that start of a date range is defaulted to -Infinity when its value is null',
								[-Infinity,{minValue:null,maxValue:_testDateDateRangeMax}],
								true
							],
							['Test that start of a date range is defaulted to -Infinity when its value is an empty string',
								[-Infinity,{minValue:'',maxValue:_testDateDateRangeMax}],
								true
							],

						/*** test that maxValue property of date range is still observed when minValue is defaulted ***/
							['Test that, even when a date range has no minValue, a date that occurs before the end of that range is considered in that range',
								[_testDateWithinDateRange,{maxValue:_testDateDateRangeMax}],
								true
							],
							['Test that, even when a date range has no minValue, a date that occurs at the end of that range is considered in that range',
								[_testDateDateRangeMax,{maxValue:_testDateDateRangeMax}],
								true
							],
							['Test that, even when a date range has no minValue, a date that occurs after the end of that range is not considered in that range',
								[_testDateAfterDateRangeMax,{maxValue:_testDateDateRangeMax}],
								false
							],

						/*** test defaulting of the maxValue property of the date range ***/
							['Test that end of a date range is defaulted to Infinity when its value is undefined',
								[Infinity,{minValue:_testDateDateRangeMin}],
								true
							],
							['Test that end of a date range is defaulted to Infinity when its value is null',
								[Infinity,{minValue:_testDateDateRangeMin,maxValue:null}],
								true
							],
							['Test that end of a date range is defaulted to Infinity when its value is an empty string',
								[Infinity,{minValue:_testDateDateRangeMin,maxValue:''}],
								true
							],

						/*** test that minValue property of date range is still observed when maxValue is defaulted ***/
							['Test that, even when a date range has no maxValue, a date that occurs before the start of that range is not considered in that range',
								[_testDateBeforeDateRangeMin,{minValue:_testDateDateRangeMin}],
								false
							],
							['Test that, even when a date range has no maxValue, a date that occurs at the start of that range is considered in that range',
								[_testDateDateRangeMin,{minValue:_testDateDateRangeMin}],
								true
							],
							['Test that, even when a date range has no maxValue, a date that occurs after the start of that range is considered in that range',
								[_testDateWithinDateRange,{minValue:_testDateDateRangeMin}],
								true
							],

						/*** test handling for completely open / unbounded date range ***/
							['Test that -Infinity falls into the unbounded date range (ie. all of time)',
								[-Infinity,_dateRangeWithoutBounds],
								true
							],
							['Test that Infinity falls into the unbounded date range (ie. all of time)',
								[Infinity,_dateRangeWithoutBounds],
								true
							],
							['Test that an invalid date doesn\'t fall anywhere in an unbounded date range (ie. all of time)',
								[new Date (NaN),_dateRangeWithoutBounds],
								false
							],

						/*** test that minValue of date range can be specified in a number of other different ways ***/
							_dateRangeValueCanBeOfTypeTest (
								'Test that minValue of date range can be specified as a string',
								'minValue',
								_dateToString
							),
							_dateRangeValueCanBeOfTypeTest (
								'Test that minValue of date range can be specified as a string in ISO8601 format',
								'minValue',
								_dateToIso8601String
							),
							_dateRangeValueCanBeOfTypeTest (
								'Test that minValue of date range can be specified as a millisecond integers number',
								'minValue',
								_dateToNumber
							),

						/*** test that maxValue of date range can be specified in a number of other different ways ***/
							_dateRangeValueCanBeOfTypeTest (
								'Test that maxValue of date range can be specified as a string',
								'maxValue',
								_dateToString
							),
							_dateRangeValueCanBeOfTypeTest (
								'Test that maxValue of date range can be specified as a string in ISO8601 format',
								'maxValue',
								_dateToIso8601String
							),
							_dateRangeValueCanBeOfTypeTest (
								'Test that maxValue of date range can be specified as a millisecond integers number',
								'maxValue',
								_dateToNumber
							),

						/*** test defaulting of the date to test for being in range ***/
							{
								title:'Test that date to test is defaulted to now when its value is undefined',
								test:function () {
									return Uize.Date.inRange (
										undefined,
										{minValue:Uize.now (),maxValue:Uize.now () + _nowTestFudgeFactor}
									);
								}
							},
							{
								title:'Test that date to test is defaulted to now when its value is null',
								test:function () {
									return Uize.Date.inRange (
										null,
										{minValue:Uize.now (),maxValue:Uize.now () + _nowTestFudgeFactor}
									);
								}
							},
							{
								title:'Test that date to test is defaulted to now when its value is an empty string',
								test:function () {
									return Uize.Date.inRange (
										'',
										{minValue:Uize.now (),maxValue:Uize.now () + _nowTestFudgeFactor}
									);
								}
							}
					]],
					['Uize.Date.isRecent',[
						/*** test zero day recency window ***/
							_isRecentDaysFromNowTest (
								'Test that now is considered to be in the zero day recency window',0,0,true
							),
							_isRecentDaysFromNowTest (
								'Test that yesterday is not considered to be in the zero day recency window',-.9,0,false
							),
							_isRecentDaysFromNowTest (
								'Test that tomorrow is considered to be in the zero day recency window',.9,0,true
							),
							_isRecentDaysFromNowTest (
								'Test that two days from now is considered to be in the zero day recency window',1.9,0,true
							),

						/*** test one day recency window ***/
							_isRecentDaysFromNowTest (
								'Test that now is considered to be in the one day recency window',0,1,true
							),
							_isRecentDaysFromNowTest (
								'Test that yesterday is considered to be in the one day recency window',-.9,1,true
							),
							_isRecentDaysFromNowTest (
								'Test that two days ago is not considered to be in the one day recency window',-1.9,1,false
							),
							_isRecentDaysFromNowTest (
								'Test that tomorrow is considered to be in the one day recency window',.9,1,true
							),

						/*** test two day recency window ***/
							_isRecentDaysFromNowTest (
								'Test that now is not considered to be in the negative one day recency window',0,-1,false
							),
							_isRecentDaysFromNowTest (
								'Test that yesterday is not considered to be in the negative one day recency window',-.9,-1,false
							),
							_isRecentDaysFromNowTest (
								'Test that tomorrow is not considered to be in the negative one day recency window',.9,-1,false
							),
							_isRecentDaysFromNowTest (
								'Test that two days from now is considered to be in the negative one day recency window',1.9,-1,true
							),

						/*** test that date can be specified in a number of other different ways ***/
							_isRecentDaysFromNowTest (
								'Test that the date to test for recency can be specified as a string',
								1,
								1,
								true,
								_dateToString
							),
							_isRecentDaysFromNowTest (
								'Test that the date to test for recency can be specified as a string in ISO8601 format',
								1,
								1,
								true,
								_dateToIso8601String
							),
							_isRecentDaysFromNowTest (
								'Test that the date to test for recency can be specified as a millisecond integers number',
								1,
								1,
								true,
								_dateToNumber
							)
					]],
					['Uize.Date.getRangeAround',[
						/*** test handling for all the different range sizes ***/
							_getRangeAroundTestsForRangeSize (
								'millennium',
								_newDate (2000,1,1,0,0,0,0),_newDate (2500,1,1,0,0,0,0),_newDate (2999,12,31,23,59,59,999)
							),
							_getRangeAroundTestsForRangeSize (
								'century',
								_newDate (2000,1,1,0,0,0,0),_newDate (2050,1,1,0,0,0,0),_newDate (2099,12,31,23,59,59,999)
							),
							_getRangeAroundTestsForRangeSize (
								'decade',
								_newDate (2000,1,1,0,0,0,0),_newDate (2005,1,1,0,0,0,0),_newDate (2009,12,31,23,59,59,999)
							),
							_getRangeAroundTestsForRangeSize (
								'year',
								_newDate (2000,1,1,0,0,0,0),_newDate (2000,6,1,0,0,0,0),_newDate (2000,12,31,23,59,59,999)
							),
							_getRangeAroundTestsForRangeSize (
								'quarter',
								_newDate (2000,1,1,0,0,0,0),_newDate (2000,2,1,0,0,0,0),_newDate (2000,3,31,23,59,59,999)
							),
							_getRangeAroundTestsForRangeSize (
								'month',
								_newDate (2000,1,1,0,0,0,0),_newDate (2000,1,15,0,0,0,0),_newDate (2000,1,31,23,59,59,999)
							),
							_getRangeAroundTestsForRangeSize (
								'week',
								_newDate (2000,1,2,0,0,0,0),_newDate (2000,1,5,0,0,0,0),_newDate (2000,1,8,23,59,59,999)
							),
							_getRangeAroundTestsForRangeSize (
								'day',
								_newDate (2000,1,1,0,0,0,0),_newDate (2000,1,1,12,0,0,0),_newDate (2000,1,1,23,59,59,999)
							),
							_getRangeAroundTestsForRangeSize (
								'am/pm',
								_newDate (2000,1,1,0,0,0,0),_newDate (2000,1,1,6,0,0,0),_newDate (2000,1,1,11,59,59,999)
							),
							_getRangeAroundTestsForRangeSize (
								'hour',
								_newDate (2000,1,1,0,0,0,0),_newDate (2000,1,1,0,30,0,0),_newDate (2000,1,1,0,59,59,999)
							),
							_getRangeAroundTestsForRangeSize (
								'minute',
								_newDate (2000,1,1,0,0,0,0),_newDate (2000,1,1,0,0,30,0),_newDate (2000,1,1,0,0,59,999)
							),
							_getRangeAroundTestsForRangeSize (
								'second',
								_newDate (2000,1,1,0,0,0,0),_newDate (2000,1,1,0,0,0,500),_newDate (2000,1,1,0,0,0,999)
							),
							_getRangeAroundTestsForRangeSize (
								'millisecond',
								_newDate (2000,1,1,0,0,0,0),_newDate (2000,1,1,0,0,0,0),_newDate (2000,1,1,0,0,0,0)
							),

						/*** test that date to get range around can be specified in a number of other different ways ***/
							_getRangeAroundTest (
								'Test that the date to get range around can be specified as a string',
								[_testDateDateRangeMin + '','millisecond'],
								_dateRangeWhereMinIsUsedForMax
							),
							_getRangeAroundTest (
								'Test that the date to get range around can be specified as a string in ISO8601 format',
								['2001-01-02','millisecond'],
								_dateRangeWhereMinIsUsedForMax
							),
							_getRangeAroundTest (
								'Test that the date to get range around can be specified as a string',
								[+_testDateDateRangeMin,'millisecond'],
								_dateRangeWhereMinIsUsedForMax
							),

						/*** test defaulting for range size ***/
							_getRangeAroundTest (
								'Test that range size is defaulted to a month when its value is undefined',
								[_newDate (2000,1,15),undefined],
								{minValue:_newDate (2000,1,1),maxValue:_newDate (2000,1,31,23,59,59,999)}
							),
							_getRangeAroundTest (
								'Test that range size is defaulted to a month when its value is undefined',
								[_newDate (2000,1,15),null],
								{minValue:_newDate (2000,1,1),maxValue:_newDate (2000,1,31,23,59,59,999)}
							),
							_getRangeAroundTest (
								'Test that range size is defaulted to a month when its value is undefined',
								[_newDate (2000,1,15),''],
								{minValue:_newDate (2000,1,1),maxValue:_newDate (2000,1,31,23,59,59,999)}
							),

						/*** test defaulting of the date to get a range around ***/
							_dateToGetRangeAroundIsDefaultedToNowTest (undefined,'undefined'),
							_dateToGetRangeAroundIsDefaultedToNowTest (null,'null'),
							_dateToGetRangeAroundIsDefaultedToNowTest ('','an empty string')
					]],
					['Uize.Date.equal',[
						/*** test that a date is considered equal to itself, at all levels of precision ***/
							['Test that a date is equal to itself down to the precision of a second',
								[_testDate,_testDate,'second'],
								true
							],
							['Test that a date is equal to itself down to the precision of a minute',
								[_testDate,_testDate,'minute'],
								true
							],
							['Test that a date is equal to itself down to the precision of an hour',
								[_testDate,_testDate,'hour'],
								true
							],
							['Test that a date is equal to itself down to the precision of am/pm',
								[_testDate,_testDate,'am/pm'],
								true
							],
							['Test that a date is equal to itself down to the precision of a day',
								[_testDate,_testDate,'day'],
								true
							],
							['Test that a date is equal to itself down to the precision of a week',
								[_testDate,_testDate,'week'],
								true
							],
							['Test that a date is equal to itself down to the precision of a month',
								[_testDate,_testDate,'month'],
								true
							],
							['Test that a date is equal to itself down to the precision of a quarter',
								[_testDate,_testDate,'quarter'],
								true
							],
							['Test that a date is equal to itself down to the precision of a year',
								[_testDate,_testDate,'year'],
								true
							],
							['Test that a date is equal to itself down to the precision of a decade',
								[_testDate,_testDate,'decade'],
								true
							],
							['Test that a date is equal to itself down to the precision of a century',
								[_testDate,_testDate,'century'],
								true
							],
							['Test that a date is equal to itself down to the precision of a millennium',
								[_testDate,_testDate,'millennium'],
								true
							],

						/*** test that two different dates are considered equal, at different levels of precision ***/
							['Test that two different dates are considered equal to the precision of a second',
								['2009/09/10 18:19:25','2009/09/10 18:19:25','second'],
								true
							],
							['Test that two different dates are considered equal to the precision of a minute',
								['2009/09/10 18:19:25','2009/09/10 18:19:26','minute'],
								true
							],
							['Test that two different dates are considered equal to the precision of an hour',
								['2009/09/10 18:19:25','2009/09/10 18:20:26','hour'],
								true
							],
							['Test that two different dates are considered equal to the precision of am/pm',
								['2009/09/10 18:19:25','2009/09/10 19:20:26','am/pm'],
								true
							],
							['Test that two different dates are considered equal to the precision of a day',
								['2009/09/10 18:19:25','2009/09/10 01:20:26','day'],
								true
							],
							['Test that two different dates are considered equal to the precision of a week',
								['2009/09/10 18:19:25','2009/09/11 01:20:26','week'],
								true
							],
							['Test that two different dates are considered equal to the precision of a month',
								['2009/09/10 18:19:25','2009/09/30 01:20:26','month'],
								true
							],
							['Test that two different dates are considered equal to the precision of a quarter',
								['2009/09/10 18:19:25','2009/08/11 01:20:26','quarter'],
								true
							],
							['Test that two different dates are considered equal to the precision of a year',
								['2009/09/10 18:19:25','2009/12/11 01:20:26','year'],
								true
							],
							['Test that two different dates are considered equal to the precision of a decade',
								['2009/09/10 18:19:25','2008/12/11 01:20:26','decade'],
								true
							],
							['Test that two different dates are considered equal to the precision of a century',
								['2009/09/10 18:19:25','2050/12/11 01:20:26','century'],
								true
							],
							['Test that two different dates are considered equal to the precision of a millennium',
								['2009/09/10 18:19:25','2500/12/11 01:20:26','millennium'],
								true
							],

						/*** test that two different dates are considered unequal, at different levels of precision ***/
							['Test that two different dates are considered unequal, at the precision of a second',
								['2009/09/10 18:19:25','2009/09/10 18:19:26','second'],
								false
							],
							['Test that two different dates are considered unequal, at the precision of a minute',
								['2009/09/10 18:19:25','2009/09/10 18:20:25','minute'],
								false
							],
							['Test that two different dates are considered unequal, at the precision of an hour',
								['2009/09/10 18:19:25','2009/09/10 19:19:25','hour'],
								false
							],
							['Test that two different dates are considered unequal, at the precision of am/pm',
								['2009/09/10 18:19:25','2009/09/10 01:19:25','am/pm'],
								false
							],
							['Test that two different dates are considered unequal, at the precision of a day',
								['2009/09/10 18:19:25','2009/09/11 18:19:25','day'],
								false
							],
							['Test that two different dates are considered unequal, at the precision of a week',
								['2009/09/10 18:19:25','2009/09/30 18:19:25','week'],
								false
							],
							['Test that two different dates are considered unequal, at the precision of a month',
								['2009/09/10 18:19:25','2009/08/10 18:19:25','month'],
								false
							],
							['Test that two different dates are considered unequal, at the precision of a quarter',
								['2009/09/10 18:19:25','2009/12/10 18:19:25','quarter'],
								false
							],
							['Test that two different dates are considered unequal, at the precision of a year',
								['2009/09/10 18:19:25','2008/09/10 18:19:25','year'],
								false
							],
							['Test that two different dates are considered unequal, at the precision of a decade',
								['2009/09/10 18:19:25','2050/09/10 18:19:25','decade'],
								false
							],
							['Test that two different dates are considered unequal, at the precision of a century',
								['2009/09/10 18:19:25','2500/09/10 18:19:25','century'],
								false
							],
							['Test that two different dates are considered unequal, at the precision of a millennium',
								['2009/09/10 18:19:25','1999/09/10 18:19:25','millennium'],
								false
							],

						/*** miscellaneous tests ***/
							['Test that calling with no parameters produces the result true (because now is the default for both dates)',
								[],
								true
							],
							{
								title:'Test that day is the default unit of precision, when not specified explicitly',
								test:function () {
									return (
										Uize.Date.equal ('2009/09/10 18:19:25','2009/09/10 01:02:03') &&
										!Uize.Date.equal ('2009/09/10 18:19:25','2009/09/11 18:19:25')
									);
								}
							},

							/*** test that dates can be specified in a number of other different ways ***/
								['Test that dates to compare can be specified as Date object instances',
									[new Date ('2009/09/10 18:19:25'),new Date ('2009/09/11 18:19:25'),'month'],
									true
								],
								['Test that dates to compare can be specified as millisecond integers',
									[+new Date ('2009/09/10 18:19:25'),+new Date ('2009/09/11 18:19:25'),'month'],
									true
								],
								['Test that dates to compare can be specified in ISO8601 format',
									['2009-09-10','2009-09-11','month'],
									true
								]
					]]
				])
			]
		});
	}
});

