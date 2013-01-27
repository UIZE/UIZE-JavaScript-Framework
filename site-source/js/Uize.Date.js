/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Date Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2004-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 5
	codeCompleteness: 90
	docCompleteness: 95
*/

/*?
	Introduction
		The =Uize.Date= module provides methods for working with dates, including converting time to different units, encoding / decoding dates in =ISO 8601=, etc.

		*DEVELOPERS:* `Chris van Rensburg`

		In a Nutshell
			The =Uize.Date= module is a package under the =Uize= namespace, providing a suite of utility methods for working with dates.

			ISO 8601
				Methods of the =Uize.Date= module that accept date values for parameters allow such date values to be specified as strings in =ISO 8601= format.

				[[http://en.wikipedia.org/wiki/ISO_8601][ISO 8601]] is an international standard for the representation of dates. A key characteristic of this format is its ordering of components of a date from most significant (year) to least significant (day). When dates in this format are used in file names, titles, or otherwise used to construct alphanumeric strings, sorting such strings can have the effect of sorting the strings chronologically as well.

				The =Uize.Date= module supports parsing from and serializing to the most typical and simple of the =ISO 8601= standard's many formatting options, namely the big-endian all-numeric date notation =YYYY-MM-DD=. JavaScript's built-in =Date= object does not support parsing dates in =ISO 8601= format. When having date strings in this format, the =Uize.Date.resolve= static method can be used to produce =Date= instances set to the correct date. Consider the following example...

				INCORRECT
				.........................................................................
				var myDate = new Date ('2009-09-27');  // produces an invalid date object
				.........................................................................

				CORRECT
				..............................................
				var myDate = Uize.Date.resolve ('2009-09-27');
				..............................................

				As mentioned, dates in ISO 8601 format can be used with methods of the =Uize.Date= module that accept dates as parameters. Consider the following example...

				EXAMPLE
				................................................
				Uize.Date.getRangeAround ('2009-01-10','month');
				................................................

				The statement in the above example would produce a =dateRangeOBJ= value representing the month around January 10th, 2009.
*/

Uize.module ({
	name:'Uize.Date',
	builder:function () {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_package = function (_year,_month,_dayNo,_hours,_minutes,_seconds,_milliseconds) {
					/* NOTE:
						This is a workaround for the issue where the variation of the Date object constructor that takes year, month, date, hour, minute, second, and millisecond arguments considers the years 0-99 to be in the 1900's (20th century). To avoid messups with leap years, we shift 0-99 to 400-499 (0 is a leap year just like 400). Then we use the setFullYear method to correct the year (this method *does* respect years from 0-99).
					*/
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
				},
				_undefined
			;

		/*** Utility Functions ***/
			function _twoDigit (_value) {return isNaN (_value) ? '??' : (_value < 10 ? '0' : '') + _value}

			function _threeDigit (_value) {
				return (isNaN (_value) ? '???' : (_value < 10 ? '00' : _value < 100 ? '0' : '') + _value);
			}

			function _fourDigit (_value) {
				return (
					isNaN (_value)
						? '????'
						: (_value < 10 ? '000' : _value < 100 ? '00' : _value < 1000 ? '0' : '') + _value
				);
			}

		/*** Public Static Methods ***/
			var _unitsToMsFactorMap = {
				ms:1,               // canonical unit
				seconds:1000,       // x 1000 ms per second
				minutes:60000,      // x 60 seconds per minute
				hours:3600000,      // x 60 minutes per hour
				days:86400000,      // x 24 hours per day
				weeks:604800000,    // x 7 days per week
				months:2629743840,  // x 4.348121428571429 weeks per month (working back from 365.2422 days per year)
				years:31556926080   // x 12 months per year
			};
			var _convert = _package.convert = function (_timeValue,_timeUnit,_newTimeUnit) {
				/* NOTES: first convert to the canonical unit ms, then convert to target unit */
				return _timeValue * _unitsToMsFactorMap [_timeUnit + ''] / _unitsToMsFactorMap [_newTimeUnit + ''];
				/*?
					Static Methods
						Uize.Date.convert
							Converts the specified time in the specified time unit to a different specified time unit.

							SYNTAX
							....................................................................................
							convertedTimeFLOAT = Uize.Date.convert (timeFLOAT,timeUnitSTR,convertedTimeUnitSTR);
							....................................................................................

							This methods allows you to convert from days to milliseconds, seconds to years, years to hours, hours to weeks, months to hours, or from any one of the supported time units to another.

							TIME UNITS
							The value specified for the =timeUnitSTR= and =convertedTimeUnitSTR= parameters can be any one of:  =ms=, =seconds=, =minutes=, =hours=, =days=, =weeks=, =months=, =years=.

							EXAMPLES
							............................................................
							var
								timeInDays = Uize.Date.convert (18287659,'ms','days'),
								timeInHours = Uize.Date.convert (15306,'seconds','hours'),
								timeInWeeks = Uize.Date.convert (6,'months','weeks')
							;
							............................................................

							NOTES
							- any parameter of this method can be an object that implements a =valueOf= interface (such as an instance of a =Uize.Class= subclass that implements the =value= state property)
				*/
			};

			var _resolve = _package.resolve = function (_date,_default) {
				return (
					_date instanceof Date
						? _date
						: _date == null || _date === ''
							? (_default !== _undefined ? _default : new Date)
							: typeof _date == 'string' ? _package.fromIso8601 (_date) || new Date (_date) : new Date (+_date)
				);
				/*?
					Static Methods
						Uize.Date.resolve
							Resolves the specified date to a =Date= object instance and returns that instance.

							SYNTAX
							................................................
							dateOBJ = Uize.Date.resolve (dateSTRorNUMorOBJ);
							................................................

							The date to resolve can be specified using the =dateSTRorNUMorOBJ= value type. When the specified date is already an instance of the =Date= object, then that instance is simply returned.

							This method can be useful when implementing other methods, to give them flexibility in the manner in which dates can be specified for them. Resolving dates means that your code can be sure to be dealing with =Date= object instances, and can then have a canonical implementation when dealing with dates.

							VARIATION 1
							...................................................................
							dateOBJ = Uize.Date.resolve (dateSTRorNUMorOBJ,defaultDateANYTYPE);
							...................................................................

							When the optional =defaultDateANYTYPE= parameter is specified, the value of this parameter will be returned by the =Uize.Date.resolve= method when the value specified for the =dateSTRorNUMorOBJ= parameter is =''= (empty string), =null=, or =undefined=. This allows you to resolve a date with a default other than the date at the time that the =Uize.Date.resolve= method is called. Note that the =value= of the =defaultDateANYTYPE= parameter is not itself resolved to a date - its value will be returned as is. So, if you want a =Date= object instance to be the default value for the resolved date, provide the default as a =Date= object instance.

							VARIATION 2
							...............................
							dateOBJ = Uize.Date.resolve ();
							...............................

							When no =dateSTRorNUMorOBJ= parameter is specified, or if an empty string or the value =null= is specified for this parameter, then a fresh =Date= object instance (ie. now) will be returned.

							NOTES
							- when the value =''= (empty string), =null=, or =undefined= is specified for the =dateSTRorNUMorOBJ= parameter, and when no value is specified for the =defaultDateANYTYPE= parameter, then this parameter will be defaulted to the date at the time that the method is called (today's date, essentially)
				*/
			};

			_package.equal = function (_date1,_date2,_precision) {
				return _package.inRange (_date1,_package.getRangeAround (_date2,_precision || 'day'));
				/*?
					Static Methods
						Uize.Date.equal
							Returns a boolean, indicating whether or not the two specified dates can be considered equal, according to the specified level of precision / accuracy.

							SYNTAX
							............................................................................
							datesEqualBOOL = Uize.Date.equal (date1STRorOBJ,date2STRorOBJ,precisionSTR);
							............................................................................

							You can use this method to easily test if two dates exist together within the same logical date range. For example, you can test to see if two dates are in the same week, the same month, the same quarter of the year, the same decade, etc. Consider the following example...

							EXAMPLE
							.....................................................................................
							Uize.Date.equal ('2009/09/10 18:19:25','2009/08/01 01:51:47','hour');        // false
							Uize.Date.equal ('2009/09/10 18:19:25','2009/08/01 01:51:47','day');         // false
							Uize.Date.equal ('2009/09/10 18:19:25','2009/08/01 01:51:47','week');        // false
							Uize.Date.equal ('2009/09/10 18:19:25','2009/08/01 01:51:47','month');       // false
							Uize.Date.equal ('2009/09/10 18:19:25','2009/08/01 01:51:47','quarter');     // true
							Uize.Date.equal ('2009/09/10 18:19:25','2009/08/01 01:51:47','year');        // true
							Uize.Date.equal ('2009/09/10 18:19:25','2009/08/01 01:51:47','decade');      // true
							Uize.Date.equal ('2009/09/10 18:19:25','2009/08/01 01:51:47','century');     // true
							.....................................................................................

							Values specified for the =date1STRorOBJ= and =date2STRorOBJ= parameters are of the =dateSTRorNUMorOBJ= value type. The values that can be specified for the =precisionSTR= parameter are all the values that can be specified for the =rangeSizeSTR= parameter of the =Uize.Date.getRangeAround= method (eg. ='minute'=, ='hour'=, ='am/pm'=, ='week'=, ='quarter'=, ='decade'=, etc.).

							MIND THE GAP

							Don't be suckered into thinking that two dates like those shown in the example below should be considered equal when compared with precision down to the second.

							.................................................................................
							Uize.Date.equal ('2009/09/10 18:19:25','2008/09/10 18:19:25','second');  // false
							.................................................................................

							Yes, the hours, minutes, and seconds of the two dates are identical, but they're a full year apart. So, they can't be considered equal down to a second in accuracy. In fact, they can't even be considered equal down to a year in accuracy.

							VARIATION 1
							...............................................................
							datesEqualBOOL = Uize.Date.equal (date1STRorOBJ,date2STRorOBJ);
							...............................................................

							When no =precisionSTR= parameter is specified, the value ='day'= will be used as the default for this parameter. This default provides a convenient way of just testing if two dates are for the same day of the same month of the same year, without regard to hours, minutes, seconds, or milliseconds. This is a typical way to compare two dates, such as testing if a particular date is someone's birthday, or a national holiday, etc.

							EXAMPLE
							.................................................................................
							Uize.Date.equal ('2009/09/10 18:19:25','2009/09/10 12:30:10');  // produces true
							Uize.Date.equal ('2009/09/10 18:19:25','2009/09/09 18:19:25');  // produces false
							.................................................................................

							VARIATION 2
							..............................................
							todayIsBOOL = Uize.Date.equal (date1STRorOBJ);
							..............................................

							When no =date2STRorOBJ= parameter is specified, then the date at the time that the =Uize.Date.equal= method is called will be used as the default for this parameter. Combined with the sensible defaulting of the =precisionSTR= parameter, this shorthand provides a convenient way ot testing if today's date is a particular date. Consider a few examples...

							EXAMPLES
							...........................................................
							isTodayHalloween2009 = Uize.Date.equal ('2009-10-31');
							isTodayChristmas2010 = Uize.Date.equal ('2009-12-25');
							isTodayStartOfRamadan2010 = Uize.Date.equal ('2010-08-11');
							...........................................................

							Specifying the value =null= or =''= (empty string) for the =date2STRorOBJ= parameter has the same effect as omitting this parameter.

							NOTES
							- see the related =Uize.Date.getRangeAround= and =Uize.Date.inRange= static methods
				*/
			};

			_package.toIso8601 = function (_date) {
				return (
					_fourDigit ((_date = _resolve (_date)).getFullYear ()) + '-' +
					_twoDigit (_date.getMonth () + 1) + '-' +
					_twoDigit (_date.getDate ())
				);
				/*?
					Static Methods
						Uize.Date.toIso8601
							Returns a string, representing the specified date in =ISO 8601= format (YYYY-MM-DD).

							SYNTAX
							.........................................................
							dateIso8601STR = Uize.Date.toIso8601 (dateSTRorNUMorOBJ);
							.........................................................

							The date to be formatted in the =ISO 8601= format can be specified using the =dateSTRorNUMorOBJ= value type.

							VARIATION
							........................................
							dateIso8601STR = Uize.Date.toIso8601 ();
							........................................

							When no =dateSTRorNUMorOBJ= parameter is specified, this method will return the current date in =ISO 8601= format.

							NOTES
							- see also the companion =Uize.Date.fromIso8601= static method
							- when the value =''= (empty string), =null=, or =undefined= is specified for the =dateSTRorNUMorOBJ= parameter, then this parameter will be defaulted to the date at the time that the method is called (today's date, essentially)
				*/
			};

			_package.fromIso8601 = function (_dateIso8601) {
				var _yearMonthDayMatch = _dateIso8601.match (/(\d{2,})-(\d\d?)-(\d\d?)(?:\D|$)/);
				return (
					_yearMonthDayMatch
						? _package (
							+_yearMonthDayMatch [1] + (_yearMonthDayMatch [1].length < 3) * 1900,
							_yearMonthDayMatch [2],
							_yearMonthDayMatch [3]
						)
						: _undefined
				);
				/*?
					Static Methods
						Uize.Date.fromIso8601
							Converts the specified =ISO 8601= format (YYYY-MM-DD) date string and returns the date as a =Date= object instance.

							SYNTAX
							.................................................
							dateOBJ = Uize.Date.fromIso8601 (dateIso8601STR);
							.................................................

							If the date specified by the =dateIso8601STR= parameter is not in the =ISO 8601= format, then this method will return the value =undefined=.

							EXAMPLES
							..................................................................
							Uize.Date.fromIso8601 ('1981-01-12');       // 12th January 1981
							Uize.Date.fromIso8601 ('99-6-29');          // 29th June 1999
							Uize.Date.fromIso8601 ('2001-09-11');       // 11th September 2001
							Uize.Date.fromIso8601 ('2008-11-04');       // 4th November 2008
							Uize.Date.fromIso8601 ('Fri Jul 16 2006');  // undefined
							..................................................................

							NOTES
							- see also the companion =Uize.Date.toIso8601= static method
				*/
			};

			var _invalidDateSubstitutions = {
				date:'Invalid Date',
				YYYY:'????',
				YY:'??',
				MM:'??',
				monthNo:'?',
				monthName:'?????????',
				shortMonthName:'???',
				DD:'??',
				dayNo:'?',
				dayNoSuffix:'??',
				dayName:'????????',
				shortDayName:'???',
				hh:'??',
				h12:'?',
				hh12:'??',
				mm:'??',
				minutes:'?',
				ss:'??',
				seconds:'?',
				zzz:'???',
				milliseconds:'?',
				ampm:'??'
			};
			_package.format = _package.toPretty = function (_date,_format) {
				var _substitutions = _invalidDateSubstitutions;
				if (!isNaN (_date = _resolve (_date))) {
					var
						_fullYearFourDigit = _fourDigit (_date.getFullYear ()),
						_monthNo = _date.getMonth () + 1,
						_dayNo = _date.getDate (),
						_dayNoMod10 = _dayNo % 10,
						_dayOfWeek = _date.getDay (),
						_hourNo = _date.getHours (),
						_isPm = _hourNo > 11,
						_h12 = (_hourNo - (_isPm && 12)) || 12,
						_minutes = _date.getMinutes (),
						_seconds = _date.getSeconds (),
						_milliseconds = _date.getMilliseconds ()
					;
					_substitutions = {
						date:_date,
						YYYY:_fullYearFourDigit,
						YY:_fullYearFourDigit.slice (-2),
						MM:_twoDigit (_monthNo),
						monthNo:_monthNo,
						monthName:_package.monthNames [_monthNo - 1],
						shortMonthName:_package.shortMonthNames [_monthNo - 1],
						DD:_twoDigit (_dayNo),
						dayNo:_dayNo,
						dayNoSuffix:
							_package.dayNoSuffixes [(_dayNoMod10 < 4 && Math.floor (_dayNo / 10) % 10 != 1) * _dayNoMod10],
						dayName:_package.dayNames [_dayOfWeek],
						shortDayName:_package.shortDayNames [_dayOfWeek],
						hh:_twoDigit (_hourNo),
						h12:_h12,
						hh12:_twoDigit (_h12),
						mm:_twoDigit (_minutes),
						minutes:_minutes,
						ss:_twoDigit (_seconds),
						seconds:_seconds,
						zzz:_threeDigit (_milliseconds),
						milliseconds:_milliseconds,
						ampm:_isPm ? 'pm' : 'am'
					};
				}
				return Uize.substituteInto (
					_format || '{dayName}, {dayNo}{dayNoSuffix} {monthName} {YYYY}',
					_substitutions,
					'{KEY}'
				);
			};

			_package.getRangeAround = function (_date,_rangeSize) {
				var
					_minValue = new Date (_date = _resolve (_date)),
					_maxValue = new Date (_minValue)
				;
				function _setBounds (_boundsMethod,_boundsMin,_boundsMax) {
					_minValue [_boundsMethod] (_boundsMin);
					_maxValue [_boundsMethod] (_boundsMax);
				}
				function _setIntraBounds (_boundsComponent,_divisionSize) {
					var _divisionStart = Math.floor (_date ['get' + _boundsComponent] () / _divisionSize) * _divisionSize;
					_setBounds ('set' + _boundsComponent,_divisionStart,_divisionStart + _divisionSize - 1);
				}
				switch (_rangeSize || (_rangeSize = 'month')) {
					case 'millennium':
					case 'century':
					case 'decade':
						_setIntraBounds ('FullYear',_rangeSize == 'millennium' ? 1000 : _rangeSize == 'century' ? 100 : 10);
					case 'year':
					case 'quarter':
						_rangeSize == 'quarter' ? _setIntraBounds ('Month',3) : _setBounds ('setMonth',0,11);
					case 'month':
					case 'week':
						if (_rangeSize == 'week') {
							var _weekStartDate = _date.getDate () - _date.getDay ();
							_setBounds ('setDate',_weekStartDate,_weekStartDate + 6);
						} else {
							_setBounds ('setDate',1,_package.getDaysInMonth (_maxValue.getMonth (),_maxValue.getFullYear ()));
						}
					case 'day':
					case 'am/pm':
						_rangeSize == 'am/pm' ? _setIntraBounds ('Hours',12) : _setBounds ('setHours',0,23);
					case 'hour':
						_setBounds ('setMinutes',0,59);
					case 'minute':
						_setBounds ('setSeconds',0,59);
					case 'second':
						_setBounds ('setMilliseconds',0,999);
					// don't need to do anything for millisecond range size, since minValue should be the same as maxValue
				}
				return {minValue:_minValue,maxValue:_maxValue};
				/*?
					Static Methods
						Uize.Date.getRangeAround
							Returns an object, specifying the "neat" date range of the specified range size around the specified date.

							SYNTAX
							.........................................................................
							dateRangeOBJ = Uize.Date.getRangeAround (dateSTRorNUMorOBJ,rangeSizeSTR);
							.........................................................................

							This method can be used to obtain the date range for the week around a specified date, the month around a date, the quarter around a date, the year around a date, etc. The date range is specified by a =dateRangeOBJ= type value.

							rangeSizeSTR
								The =rangeSizeSTR= parameter is a string, specifying the size of the date range, where the following sizes are supported...

								'second'
									The second sized date range containing the specified date.

									EXAMPLE
									...............................................................
									Uize.Date.getRangeAround ('Thu Sep 10 2009 18:19:25','second');
									// minValue: Thu Sep 10 2009 18:19:25 (and 0 milliseconds)
									// maxValue: Thu Sep 10 2009 18:19:25 (and 999 milliseconds)
									...............................................................

								'minute'
									The minute sized date range containing the specified date.

									EXAMPLE
									...............................................................
									Uize.Date.getRangeAround ('Thu Sep 10 2009 18:19:25','minute');
									// minValue: Thu Sep 10 2009 18:19:00 (and 0 milliseconds)
									// maxValue: Thu Sep 10 2009 18:19:59 (and 999 milliseconds)
									...............................................................

								'hour'
									The hour sized date range containing the specified date.

									EXAMPLE
									.............................................................
									Uize.Date.getRangeAround ('Thu Sep 10 2009 18:19:25','hour');
									// minValue: Thu Sep 10 2009 18:00:00 (and 0 milliseconds)
									// maxValue: Thu Sep 10 2009 18:59:59 (and 999 milliseconds)
									.............................................................

								'am/pm'
									The half day sized date range containing the specified date.

									EXAMPLE
									..............................................................
									Uize.Date.getRangeAround ('Thu Sep 10 2009 18:19:25','am/pm');
									// minValue: Thu Sep 10 2009 12:00:00 (and 0 milliseconds)
									// maxValue: Thu Sep 10 2009 23:59:59 (and 999 milliseconds)
									..............................................................

								'day'
									The day sized date range containing the specified date.

									EXAMPLE
									............................................................
									Uize.Date.getRangeAround ('Thu Sep 10 2009 18:19:25','day');
									// minValue: Thu Sep 10 2009 00:00:00 (and 0 milliseconds)
									// maxValue: Thu Sep 10 2009 23:59:59 (and 999 milliseconds)
									............................................................

								'week'
									The week sized date range containing the specified date.

									EXAMPLE
									.............................................................
									Uize.Date.getRangeAround ('Thu Sep 10 2009 18:19:25','week');
									// minValue: Sun Sep 06 2009 00:00:00 (and 0 milliseconds)
									// maxValue: Sat Sep 12 2009 23:59:59 (and 999 milliseconds)
									.............................................................

								'month'
									The month sized date range containing the specified date.

									EXAMPLE
									..............................................................
									Uize.Date.getRangeAround ('Thu Sep 10 2009 18:19:25','month');
									// minValue: Tue Sep 01 2009 00:00:00 (and 0 milliseconds)
									// maxValue: Wed Sep 30 2009 23:59:59 (and 999 milliseconds)
									..............................................................

								'quarter'
									The quarter sized date range containing the specified date.

									EXAMPLE
									................................................................
									Uize.Date.getRangeAround ('Thu Sep 10 2009 18:19:25','quarter');
									// minValue: Wed Jul 01 2009 00:00:00 (and 0 milliseconds)
									// maxValue: Wed Sep 30 2009 23:59:59 (and 999 milliseconds)
									................................................................

								'year'
									The year sized date range containing the specified date.

									EXAMPLE
									.............................................................
									Uize.Date.getRangeAround ('Thu Sep 10 2009 18:19:25','year');
									// minValue: Thu Jan 01 2009 00:00:00 (and 0 milliseconds)
									// maxValue: Thu Dec 31 2009 23:59:59 (and 999 milliseconds)
									.............................................................

								'decade'
									The decade sized date range containing the specified date.

									EXAMPLE
									...............................................................
									Uize.Date.getRangeAround ('Thu Sep 10 2009 18:19:25','decade');
									// minValue: Sat Jan 01 2000 00:00:00 (and 0 milliseconds)
									// maxValue: Thu Dec 31 2009 23:59:59 (and 999 milliseconds)
									...............................................................

								'century'
									The century sized date range containing the specified date.

									EXAMPLE
									................................................................
									Uize.Date.getRangeAround ('Thu Sep 10 2009 18:19:25','century');
									// minValue: Sat Jan 01 2000 00:00:00 (and 0 milliseconds)
									// maxValue: Thu Dec 31 2099 23:59:59 (and 999 milliseconds)
									................................................................

								'millennium'
									The millennium sized date range containing the specified date.

									EXAMPLE
									...................................................................
									Uize.Date.getRangeAround ('Thu Sep 10 2009 18:19:25','millennium');
									// minValue: Sat Jan 01 2000 00:00:00 (and 0 milliseconds)
									// maxValue: Tue Dec 31 2999 23:59:59 (and 999 milliseconds)
									...................................................................

								'millisecond'
									The millisecond sized date range containing the specified date.

									EXAMPLE
									....................................................................
									Uize.Date.getRangeAround ('Thu Sep 10 2009 18:19:25','millisecond');
									// minValue: Thu Sep 10 2009 18:19:25 (and N milliseconds)
									// maxValue: Thu Sep 10 2009 18:19:25 (and N milliseconds)
									....................................................................

									SPECIAL CASE

									The millisecond sized date range is a special case, which is nevertheless useful in certain situations. Since milliseconds is the highest degree of precision in representing date values in JavaScript, when a millisecond sized date range is requested, the =minValue= and =maxValue= properties of the =dateRangeOBJ= object will be identifical to the value of the =dateSTRorNUMorOBJ= parameter. In other words, technically, the date range around a specific date that is only a millisecond big is where the upper and lower bounds of the range are the date itself.

							Using Date Ranges
								Using Date Ranges With Classes Supporting the Value Range Interface
									Because the value returned by the =Uize.Date.getRangeAround= method is an object containing =minValue= and =maxValue= properties, this object can be used to set the state properties for an instance of any class that implements the `value range interface`.

									An example of this is the =Uize.Widget.Picker.Date= class, which lets the user select a date inside a popup date dialog.

									EXAMPLE
									................................................
									page.addChild (
										'datePickerThisWeek',
										Uize.Widget.Picker.Date,
										Uize.Date.getRangeAround (
											'',     // empty string for date means now
											'week'  // range size
										)
									);
									................................................

									In the above example, the date picker widget that is being added as a child of the page widget would let the user select a date in the current week. The result from the call to the =Uize.Date.getRangeAround= method is being supplied as the state property values for the =Uize.Widget.Picker.Date= instance. This works because the =Uize.Widget.Picker.Date= class implements =minValue= and =maxValue= state properties for constraining the range in which the user can select a date.

								Using Date Ranges With Other Uize.Date Methods
									Other methods of the =Uize.Date= module can accept date range objects as values for certain parameters.

									An example of this is the =Uize.Date.inRange= static method, which returns a boolean value indicating whether or not the specified date falls within the specified date range.

									EXAMPLE
									...................................................
									function dateIsThisWeek (date) {
										return Uize.Date.inRange (
											date,
											Uize.Date.getRangeAround (
												'',     // empty string for date means now
												'week'  // range size
											)
										);
									}
									...................................................

									In the above example, a =dateIsThisWeek= function is being defined. This function accepts a date as a parameter and then returns a boolean indicating whether or not this date is within the current week. It does this by getting the week sized date range around today's date by calling the =Uize.Date.getRangeAround= method. The resulting date range object is then supplied as the value of the =dateRangeOBJ= parameter for the =Uize.Date.inRange= method.

							NOTES
							- when the value =''= (empty string), =null=, or =undefined= is specified for the =dateSTRorNUMorOBJ= parameter, then this parameter will be defaulted to the date at the time that the method is called (today's date, essentially)
							- see the related =Uize.Date.inRange= static method
				*/
			};

			_package.inRange = function (_date,_range) {
				if (typeof _date != 'number') _date = +_resolve (_date);
				return _date >= _resolve (_range.minValue,-Infinity) && _date <= _resolve (_range.maxValue,Infinity);
				/*?
					Static Methods
						Uize.Date.inRange
							Returns a boolean, indicating whether or not the specified date is within the specified date range.

							SYNTAX
							.................................................................
							inRangeBOOL = Uize.Date.inRange (dateSTRorNUMorOBJ,dateRangeOBJ);
							.................................................................

							The date range is specified by a =dateRangeOBJ= type value.

							EXAMPLES
							..................................................................
							Uize.Date.inRange (             // produces the result false
								'2009/09/23 00:00:00',
								{minValue:'2009/09/23 00:00:01',maxValue:'2009/09/23 23:59:59'}
							);

							Uize.Date.inRange (             // produces the result true
								'2009/09/23 00:00:01',
								{minValue:'2009/09/23 00:00:01',maxValue:'2009/09/23 23:59:59'}
							);

							Uize.Date.inRange (             // produces the result true
								'2009/09/23 23:59:59',
								{minValue:'2009/09/23 00:00:01',maxValue:'2009/09/23 23:59:59'}
							);

							Uize.Date.inRange (             // produces the result false
								'2009/09/24 00:00:00',
								{minValue:'2009/09/23 00:00:01',maxValue:'2009/09/23 23:59:59'}
							);
							..................................................................

							Precision to the Millisecond
								It is important to note that the =Uize.Date.inRange= method considers all components of the boundary dates in the date range supplied to it.

								This includes the hours, minutes, seconds, and even milliseconds. Consider the example where you want to determine if a specified date is today or later. If you just specify the value =new Date= for the =minValue= property of the date range object, you may miss some dates that are today but whose time is before the time when the =new Date= value is created for the =minValue= property.

								What you can do in such cases is "snap" a date to a neat boundary using the =Uize.Date.getRangeAround= method. Then you can take only the =minValue= or =maxValue= property of the returned date range in order to produce a new date range that's missing one of its boundaries, as shown in the example below...

								EXAMPLE
								.............................................................
								function isTodayOrLater (date) {
									return Uize.Date.inRange (
										date,
										{minValue:Uize.Date.getRangeAround ('','day').minValue}
									);
								}
								.............................................................

								The call to the =Uize.Date.getRangeAround= method here produces a date range with a =minValue= that is at the start of today, and a =maxValue= that is at the end of today. Then we use just the =minValue= property to create a new date range that has no =maxValue=, and we supply this date range with no upper bound to the =Uize.Date.inRange= method.

							NOTES
							- see the related =Uize.Date.getRangeAround= static method
							- this method supports `boundless date ranges`
							- when the value =''= (empty string), =null=, or =undefined= is specified for the =dateSTRorNUMorOBJ= parameter, then this parameter will be defaulted to the date at the time that the method is called (today's date, essentially)
				*/
			};

			_package.isLeapYear = function (_year) {
				return _year % 4 == 0 && (_year % 100 != 0 || _year % 400 == 0);
				/*?
					Static Methods
						Uize.Date.isLeapYear
							Returns a boolean, indicating whether or not the specified year is a leap year.

							SYNTAX
							................................................
							isLeapYearBOOL = Uize.Date.isLeapYear (yearINT);
							................................................

							EXAMPLES
							................................................................................
							Uize.Date.isLeapYear (2008);   // returns true, because 2008 is a leap year
							Uize.Date.isLeapYear (2009);   // returns false, because 2009 is not a leap year
							................................................................................

							NOTES
							- see the related =Uize.Date.getDaysInMonth= static method
				*/
			};

			_package.getDaysInMonth = function (_month,_year) {
				return 30 + ((2773 >> _month) & 1) - (_month == 1 && (2 - _package.isLeapYear (_year)));
				/* NOTE:
					2773 is 101011010101 in binary, which flags the 31 day months, and we use a binary shift right to "index" into the flags, with a binary and on 1 to mask out unwanted crud
				*/
				/*?
					Static Methods
						Uize.Date.getDaysInMonth
							Returns an integer, indicating the number of days in the specified month of the specified year.

							SYNTAX
							..................................................................
							daysInMonthINT = Uize.Date.getDaysInMonth (month0to11INT,yearINT);
							..................................................................

							The value of the =month0to11INT= parameter should be a number in the range of =0= to =11=, where =0= represents January, and =11= represents December.

							EXAMPLES
							...................................................................................
							Uize.Date.getDaysInMonth (1,2008);   // returns 29, because 2008 is a leap year
							Uize.Date.getDaysInMonth (1,2009);   // returns 28, because 2009 is not a leap year
							Uize.Date.getDaysInMonth (3,1876);   // returns 30 for April of any year
							Uize.Date.getDaysInMonth (11,1989);  // returns 31 for December of any year
							...................................................................................

							NOTES
							- see the related =Uize.Date.isLeapYear= static method
				*/
			};

			_package.isRecent = function (_date,_recencyWindowDays,_referencePointDate) {
				return _package.inRange (
					_date,
					{minValue:_resolve (_referencePointDate) - _convert (_recencyWindowDays,'days','ms')}
				);
				/*?
					Static Methods
						Uize.Date.isRecent
							Returns a boolean, indicating whether or not the specified date is within the specified window of recency (as specified in days).

							SYNTAX
							...........................................................................
							isRecentBOOL = Uize.Date.isRecent (dateSTRorNUMorOBJ,recencyWindowDaysINT);
							...........................................................................

							The date to be tested for recency can be specified using the =dateSTRorNUMorOBJ= value type. This method can be useful for filtering content to highlight as new or recent, based upon release date.

							VARIATION
							...................................
							isRecentBOOL = Uize.Date.isRecent (
								dateSTRorNUMorOBJ,
								recencyWindowDaysINT,
								referencePointDateSTRorNUMorOBJ
							);
							...................................

							The optional =referencePointDateSTRorNUMorOBJ= parameter lets you specify the reference point date, relative to which the date specified by the =dateSTRorNUMorOBJ= parameter should be tested for recency. When the optional =referencePointDateSTRorNUMorOBJ= parameter is not specified, then the default reference point is the time that the =Uize.Date.isRecent= method is called. It may be, however, that you wish to determine if a date is recent relative to some other reference point date. In such cases, use the =referencePointDateSTRorNUMorOBJ= parameter.
				*/
			};

		/*** Public Static Properties ***/
			_package.dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
				/*?
					Static Properties
						Uize.Date.dayNames
							An array of strings, representing the names of the days of the week, starting with Sunday.

							SYNTAX
							...............................................
							dayNameSTR = Uize.Date.dayNames [dayOfWeekINT];
							...............................................

							EXAMPLE
							..............................................................
							var todaysDayName = Uize.Date.dayNames [(new Date).getDay ()];
							..............................................................

							In the above example, the variable =todaysDayName= would be left with the name of the day of the week during which the code is executed.

							NOTES
							- see also the companion =Uize.Date.shortDayNames= static property
							- see the related =Uize.Date.monthNames= and =Uize.Date.shortMonthNames= static properties
				*/

			_package.dayNoSuffixes = ['th','st','nd','rd'];
				/*?
					Static Properties
						Uize.Date.dayNoSuffixes
							.
				*/

			_package.monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
				/*?
					Static Properties
						Uize.Date.monthNames
							An array of strings, representing the names of the months of the year, starting with January.

							SYNTAX
							.....................................................
							monthNameSTR = Uize.Date.monthNames [monthOfYearINT];
							.....................................................

							EXAMPLE
							....................................................................
							var todaysMonthName = Uize.Date.monthNames [(new Date).getMonth ()];
							....................................................................

							In the above example, the variable =todaysMonthName= would be left with the name of the month of the year during which the code is executed.

							NOTES
							- see also the companion =Uize.Date.shortMonthNames= static property
							- see the related =Uize.Date.dayNames= and =Uize.Date.shortDayNames= static properties
				*/

			_package.shortDayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
				/*?
					Static Properties
						Uize.Date.shortDayNames
							An array of strings, representing the short names of the days of the week, starting with Sunday.

							SYNTAX
							.........................................................
							shortDayNameSTR = Uize.Date.shortDayNames [dayOfWeekINT];
							.........................................................

							EXAMPLE
							........................................................................
							var todaysShortDayName = Uize.Date.shortDayNames [(new Date).getDay ()];
							........................................................................

							In the above example, the variable =todaysShortDayName= would be left with the short name of the day of the week during which the code is executed.

							NOTES
							- see also the companion =Uize.Date.dayNames= static property
							- see the related =Uize.Date.monthNames= and =Uize.Date.shortMonthNames= static properties
				*/

			_package.shortMonthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
				/*?
					Static Properties
						Uize.Date.shortMonthNames
							An array of strings, representing the short names of the months of the year, starting with January.

							SYNTAX
							...............................................................
							shortMonthNameSTR = Uize.Date.shortMonthNames [monthOfYearINT];
							...............................................................

							EXAMPLE
							..............................................................................
							var todaysShortMonthName = Uize.Date.shortMonthNames [(new Date).getMonth ()];
							..............................................................................

							In the above example, the variable =todaysShortMonthName= would be left with the short name of the month of the year during which the code is executed.

							NOTES
							- see also the companion =Uize.Date.monthNames= static property
							- see the related =Uize.Date.dayNames= and =Uize.Date.shortDayNames= static properties
				*/

		/*?
			Value Types
				The following parameters are common to a number of methods and warrant separate, shared explanations...

				dateSTRorNUMorOBJ
					A string in =ISO 8601= format (YYYY-MM-DD), a string that can be parsed by the =Date= object, a =Date= object instance, or a number specifying the [[http://en.wikipedia.org/wiki/Unix_time][Unix Time]] in milliseconds.

					Methods accepting this value type for a parameter may resolve the value =''= (empty string), =null=, or =undefined= to the date at the time that the method is called (today's date, essentially), or they may provide an alternate defaulting behavior.

					EXAMPLES
					......................................................................................
					'Thu Sep 10 2009'             // string that can be parsed by JavaScript's Date object
					'2009-09-10'                  // ISO 8601
					new Date ('Thu Sep 10 2009')  // JavaScript Date object instance
					......................................................................................

					The above example are all valid ways to specify the same date using the =dateSTRorNUMorOBJ= value type.

				dateRangeOBJ
					An object, containing =minValue= and =maxValue= properties, where the value of these properties are of the type =dateSTRorNUMorOBJ=, and where the =minValue= property specifies the start of the date range, and the =maxValue= property specifies the end of the range.

					STRUCTURE
					...................................
					{
						minValue:startDateSTRorNUMorOBJ,
						maxValue:endDateSTRorNUMorOBJ
					}
					...................................

					Various methods deal with values of the =dateRangeOBJ= type. One example is the =Uize.Date.getRangeAround= method, which returns a =dateRangeOBJ= value specifying the "neat" date range of the specified range size around the specified date. Another example is the =Uize.Date.inRange= method, which returns a boolean, indicating whether or not the specified date is within the date range specified by a =dateRangeOBJ= value.

					Boundless Date Ranges
						Methods that accept a value of type =dateRangeOBJ= should treat the absence of a property specifying a value for a boundary, or specifying the value =null= or =undefined= for a boundary, as indicating that the date range is not bounded on that end of its range.

						So, specifying no value for the =minValue= property (or specifying the value =null= or =undefined=) would mean that the date range has no lower bound. Similarly, specifying no value for the =maxValue= property (or specifying the value =null= or =undefined=) would mean that the date range has no upper bound. Not specifying values for either of the =minValue= or =maxValue= properties would mean that the date range is unbounded - all dates would fall within such a date range.

						EXAMPLES
						.........................................................................
						// no upper bound

						Uize.Date.inRange ('2009-08-10',{minValue:'2009-09-01'});        // false
						Uize.Date.inRange ('2009-09-01',{minValue:'2009-09-01'});        // true
						Uize.Date.inRange ('2009-09-10',{minValue:'2009-09-01'});        // true


						// no lower bound

						Uize.Date.inRange ('2009-08-10',{maxValue:'2009-09-01'});        // true
						Uize.Date.inRange ('2009-09-01',{maxValue:'2009-09-01'});        // true
						Uize.Date.inRange ('2009-09-10',{maxValue:'2009-09-01'});        // false


						// no bound at all

						Uize.Date.inRange ('2009-09-10',{});                             // true
						Uize.Date.inRange ('2009-09-10',{minValue:null});                // true
						Uize.Date.inRange ('2009-09-10',{maxValue:null});                // true
						Uize.Date.inRange ('2009-09-10',{minValue:null,maxValue:null});  // true
						.........................................................................
		*/

		return _package;
	}
});

