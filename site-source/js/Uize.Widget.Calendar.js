/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Calendar Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2007-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 4
	codeCompleteness: 90
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Widget.Calendar= class implements a calendar widget that supports selecting a date within a given date range, with month and year navigation.

		*DEVELOPERS:* `Jan Borgersen`, `Chris van Rensburg`

		Key Features
			The =Uize.Widget.Calendar= module provides the following key features...

			- `Valid Date Range` - You can configure a valid date range to limit the date range within which the user can select dates.
			- `Navigation Buttons` - Month and year navigation buttons let the user navigate the calendar to a different month or year in order to select a date.
			- `Navigation Button State Management` - The enabled states of the month and year navigation buttons are managed so that they are disabled when their action would take the view outside of a configured `valid date range`.
			- `Date Grid` - A date grid, with links for every day of the month, lets the user select a date.
			- `Snap View Behavior` - A snap view behavior ensures that the date is in view and that the view is not outside of the `valid date range` after the values of the =value=, =minValue=, or =maxValue= state properties are changed programmatically.
			- Flexibility in `specifying date values` - Flexibility in how dates can be specified when setting values for the =value=, =minValue=, and =maxValue= state properties lets you specify dates in any of the ways supported by the =Uize.Date.resolve= method.

		Implemented Interfaces
			The =Uize.Widget.Calendar= implements the following JavaScript interfaces...

			- *Value Interface* - This class implements a =value= state property and, therefore, it implements the `value interface`.
			- *Value Range Interface* - This class implements =minValue= and =maxValue= state properties and, therefore, it implements the `value range interface`.

		Valid Date Range
			The =Uize.Widget.Calendar= module supports the ability to limit the date range within which the user can select dates.

			It does this by providing the =minValue= and =maxValue= state properties, where the =minValue= property specifies the start date of the valid date range, and the =maxValue= property specifies the end date of the range.

			Upper and Lower Bounds
				When dates are specified for both the =minValue= and =maxValue= state properties, then date selection can be constrained to a bounded date range - the user will not be able to select a date outside of this range.

				EXAMPLE
				................................................
				page.addChild (
					'calendar',
					Uize.Widget.Calendar,
					{minValue:'2000-01-01',maxValue:'2099-12-31'}
				);
				................................................

				In the above example, the user will be able to select a date only in the 21st century - not in the 20th century or earlier, and not in the 22nd century or beyond.

				Using Uize.Date.getRangeAround
					When supplying values for the =minValue= and =maxValue= state properties, it may be useful to use static methods of the =Uize.Date= module to more easily create logical date ranges.

					One particularly useful method of the =Uize.Date= module is the =Uize.Date.getRangeAround= method, which will generate a "neat" date range of the specified range size around the specified date, such as the week around a specified date, the month around a date, the quarter around a date, the year around a date, etc.

					EXAMPLE
					.....................................................................................
					page.addChild ('calendar',Uize.Widget.Calendar,Uize.Date.getRangeAround ('','week'));
					.....................................................................................

					In the above example, the user will be able to select a date in the current week (ie. the week of the date on which this calendar widget is instantiated). The result from the call to the =Uize.Date.getRangeAround= method is being supplied as the state property values for the =Uize.Widget.Calendar= instance. This works because the =Uize.Widget.Calendar= class implements =minValue= and =maxValue= state properties, and because the =dateRangeOBJ= value returned by the =Uize.Date.getRangeAround= method contains =minValue= and =maxValue= properties.

			Boundless Date Ranges
				The =minValue= and =maxValue= properties are nullable.

				This means that either - or both - of the =minValue= and =maxValue= properties can be set to =null= or =''= (empty string), to indicate that there is no lower and/or upper bound, respectively, for the valid date range.

				Lower Bound Only
					When only the =minValue= property is set to a date and the =maxValue= property is set to =null= or =''= (empty string), then there will be no upper bound to the `valid date range`.

					This configuration lets the user select a date from a specified start date onwards. Consider the following examples...

					EXAMPLE 1
					........................................................................
					page.addChild ('calendar',Uize.Widget.Calendar,{minValue:'2000-01-01'});
					........................................................................

					In the above example, the user will be able to select a date in the 21st century and beyond.

					EXAMPLE 2
					....................................................................
					page.addChild ('calendar',Uize.Widget.Calendar,{minValue:new Date});
					....................................................................

					In the above example, the user will be able to select a date from today's date (ie. the date on which this calendar widget is instantiated) onwards.

				Upper Bound Only
					When only the =maxValue= property is set to a date and the =minValue= property is set to =null= or =''= (empty string), then there will be no lower bound to the `valid date range`.

					This configuration lets the user select a date up until a specified date. Consider the following examples...

					EXAMPLE 1
					........................................................................
					page.addChild ('calendar',Uize.Widget.Calendar,{maxValue:'1999-12-31'});
					........................................................................

					In the above example, the user will be able to select a date in the 20th century or earlier.

					EXAMPLE 2
					....................................................................
					page.addChild ('calendar',Uize.Widget.Calendar,{maxValue:new Date});
					....................................................................

					In the above example, the user will be able to select a date up until today's date (ie. the date on which this calendar widget is instantiated).

				No Lower or Upper Bounds
					When both the =minValue= *and* =maxValue= properties are set to =null= or =''= (empty string), then there will be no restriction on the date that the user can select.

					In this case, there will effectively be no valid date range constraint. Put another way, the valid date range will include all dates for all time - completely boundless.

			Invalidation of value
				The value of the =value= state property (ie. the selected date) may be set to =null=, effectively being invalidated, if the values of the =minValue= and/or =maxValue= state properties are modified and the selected date no longer falls within the newly set `valid date range`.

		Specifying Date Values
			The =Uize.Widget.Calendar= module uses the =Uize.Date.resolve= static method of the =Uize.Date= module to conform date values to instances of JavaScript's =Date= object.

			This provides flexibility in how dates can be specified when setting values for the =value=, =minValue=, and =maxValue= state properties. Supported value types include: strings in =ISO 8601= format, instances of JavaScript's =Date= object, date strings that can be parsed by the =Date= object, and basically any value type that is supported by the =Uize.Date= module's =Uize.Date.resolve= method.

		Navigation Buttons
			The =Uize.Widget.Calendar= module implements support for month and year navigation in the form of navigation buttons.

			The navigation button child widgets, which are all instances of the =Uize.Widget.Button= class, allow the user to navigate the calendar to a different month or year in order to select a date. Month navigation is offered via the =nextMonth= and =previousMonth= buttons, which are wired to control the value of the =month= state property. Year navigation is offered via the =nextYear= and =previousYear= buttons, which are wired to control the value of the =year= state property.

			The markup for the navigation button child widgets is optional, and a given implementation of a calendar widget's HTML does not need to offer the navigation buttons in its UI. If the navigation button markup is omitted, the application may elect to provide month and year navigation through some alternate UI. In other cases, a calendar widget's HTML may exclude just the markup for the year navigation buttons, especially in cases where the user is not likely to need to navigate to earlier or later years, or if date selection will be constrained to dates from a particular year.

			Navigation Button State Management
				The =Uize.Widget.Calendar= module manages the =enabled= state of the `navigation buttons` so that they are disabled when their action would take the view outside of a `valid date range` specified by the =minValue= and =maxValue= state properties.

				- When a non-null value is specified for the =maxValue= state property and incrementing the value of the =month= state property would take the view outside of the `valid date range`, then the =nextMonth= button will be disabled.

				- When a non-null value is specified for the =minValue= state property and decrementing the value of the =month= state property would take the view outside of the `valid date range`, then the =previousMonth= button will be disabled.

				- When a non-null value is specified for the =maxValue= state property and incrementing the value of the =year= state property would take the view outside of the `valid date range`, then the =nextYear= button will be disabled.

				- When a non-null value is specified for the =minValue= state property and decrementing the value of the =year= state property would take the view outside of the `valid date range`, then the =previousYear= button will be disabled.

		Snap View Behavior
			The =Uize.Widget.Calendar= module implements a snap-into-view behavior, so that programmatically changing the value of the =value=, =minValue=, or =maxValue= state properties will update the =month= and =year= state properties - as needed - in order to ensure that the date is in view and that the view is not outside of the `valid date range`.

			The snap view behavior, as it pertains to the =value= state property, is switchable with the boolean =snapViewOnValueChange= state property. If the =snapViewOnValueChange= state property is set to =true= at the time that the =value= property is modified, then the values of the =year= and =month= state properties will be updated, if necessary, in order to ensure that the viewed year and month is not outside of the `valid date range` and that the selected date is in view. If no date is selected, then the =year= and =month= will be updated so that today's date is in view, unless today's date is outside of the `valid date range`, in which case the =year= and =month= will be updated so that the start or end date of the `valid date range` is in view, with priority given to the start date, but with the end date being used if there is no lower bound to the `valid date range`.

		Date Grid
			The =Uize.Widget.Calendar= module implements a date grid, with links for every day of the month, which lets the user select a date.

			The HTML for the date grid is dynamically generated to have links for the month of the year currently in view by the instance. The currently selected date is indicated in the grid with a highlight. Days of the month currently in view that are outside of the `valid date range` are grayed out.
*/

Uize.module ({
	name:'Uize.Widget.Calendar',
	required:[
		'Uize.Widget.Button',
		'Uize.Date',
		'Uize.Date.Formatter'
	],
	builder:function (_superclass) {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_true = true,
				_false = false,
				_null = null,
				_Uize_Date = Uize.Date,
				_dayNames = _Uize_Date.dayNames,
				_monthNames = _Uize_Date.monthNames
			;

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					_null,
					function () {
						var _this = this;

						/*** create buttons ***/
							_this._nextMonthButton = _this._addChildButton (
								'nextMonth',
								function () {_this.set ({_month:_this._month + 1})}
								/*?
									Child Widgets
										nextMonth
											An instance of =Uize.Widget.Button=, that is wired up as part of the `navigation buttons`, and that increments the value of the =month= state property.

											When a non-null value is specified for the =maxValue= state property and incrementing the value of the =month= state property would take the view outside of the `valid date range`, then the =nextMonth= button will be disabled (for more info, see the section `Navigation Button State Management`).

											When the =month= state property is set to the value =11= (the last month of the year), then incrementing its value will increment the value of the =year= state property and set the =month= property to =0=. Thus, the =nextMonth= button can be used to navigate across years (see `Month Wrapping Behavior`).

											NOTES
											- the markup for this child widget is optional, and a given implementation of a calendar widget's HTML does not need to offer a =nextMonth= button
											- see the companion =previousMonth= child widget
											- see the related =nextYear= and =previousYear= child widgets
											- this child widget is added in the constructor
								*/
							);
							_this._previousMonthButton = _this._addChildButton (
								'previousMonth',
								function () {_this.set ({_month:_this._month - 1})}
								/*?
									Child Widgets
										previousMonth
											An instance of =Uize.Widget.Button=, that is wired up as part of the `navigation buttons`, and that decrements the value of the =month= state property.

											When a non-null value is specified for the =minValue= state property and decrementing the value of the =month= state property would take the view outside of the `valid date range`, then the =previousMonth= button will be disabled (for more info, see the section `Navigation Button State Management`).

											When the =month= state property is set to the value =0= (the first month of the year), then decrementing its value will decrement the value of the =year= state property and set the =month= property to =11=. Thus, the =previousMonth= button can be used to navigate across years (see `Month Wrapping Behavior`).

											NOTES
											- the markup for this child widget is optional, and a given implementation of a calendar widget's HTML does not need to offer a =previousMonth= button
											- see the companion =nextMonth= child widget
											- see the related =nextYear= and =previousYear= child widgets
											- this child widget is added in the constructor
								*/
							);
							_this._nextYearButton = _this._addChildButton (
								'nextYear',
								function () {_this.set ({_year:_this._year + 1})}
								/*?
									Child Widgets
										nextYear
											An instance of =Uize.Widget.Button=, that is wired up as part of the `navigation buttons`, and that increments the value of the =year= state property.

											When a non-null value is specified for the =maxValue= state property and incrementing the value of the =year= state property would take the view outside of the `valid date range`, then the =nextYear= button will be disabled (for more info, see the section `Navigation Button State Management`).

											NOTES
											- the markup for this child widget is optional, and a given implementation of a calendar widget's HTML does not need to offer a =nextYear= button
											- see the companion =previousYear= child widget
											- see the related =nextMonth= and =previousMonth= child widgets
											- this child widget is added in the constructor
								*/
							);
							_this._previousYearButton = _this._addChildButton (
								'previousYear',
								function () {_this.set ({_year:_this._year - 1})}
								/*?
									Child Widgets
										previousYear
											An instance of =Uize.Widget.Button=, that is wired up as part of the `navigation buttons`, and that decrements the value of the =year= state property.

											When a non-null value is specified for the =minValue= state property and decrementing the value of the =year= state property would take the view outside of the `valid date range`, then the =previousYear= button will be disabled (for more info, see the section `Navigation Button State Management`).

											NOTES
											- the markup for this child widget is optional, and a given implementation of a calendar widget's HTML does not need to offer a =previousYear= button
											- see the companion =nextYear= child widget
											- see the related =nextMonth= and =previousMonth= child widgets
											- this child widget is added in the constructor
								*/
							);

						_this._childWidgetsAdded = _true;
						_this._updateUiNavButtonsState ();
					}
				),
				_classPrototype = _class.prototype
			;

		/*** Private Instance Methods ***/
			_classPrototype._addChildButton = Uize.Widget.Button.addChildButton;

			var _snapView = _classPrototype._snapView = function () {
				var
					_this = this,
					_minValueMaxValueAsRangeObject = {minValue:_this._minValue,maxValue:_this._maxValue}
				;
				_this._value && !_Uize_Date.inRange (_this._value,_minValueMaxValueAsRangeObject) &&
					_this.set ({_value:_null})
				;
				var _date = _this._value || new Date;
				if (!_Uize_Date.inRange (_date,_minValueMaxValueAsRangeObject))
					_date = _this._minValue || _this._maxValue
				;
				_this.set ({_month:_date.getMonth (),_year:_date.getFullYear ()});
			};

			var _updateUiNavButtonsState = _classPrototype._updateUiNavButtonsState = function () {
				var _this = this;
				if (_this._childWidgetsAdded) {
					var
						_firstOfViewMonth = new Date (_this._year,_this._month,1),
						_viewMonthRange = _Uize_Date.getRangeAround (_firstOfViewMonth,'month'),
						_viewYearRange = _Uize_Date.getRangeAround (_firstOfViewMonth,'year'),
						_minValue = _this._minValue,
						_maxValue = _this._maxValue,
						_enableWidget = function (_widget,_mustEnable) {
							_widget.set ({enabled:_mustEnable ? 'inherit' : _false});
						}
					;
					_enableWidget (_this._previousMonthButton,!_minValue || _minValue < _viewMonthRange.minValue);
					_enableWidget (_this._nextMonthButton,!_maxValue || _maxValue > _viewMonthRange.maxValue);
					_enableWidget (_this._previousYearButton,!_minValue || _minValue < _viewYearRange.minValue);
					_enableWidget (_this._nextYearButton,!_maxValue || _maxValue > _viewYearRange.maxValue);
				}
			};

			_classPrototype._updateUiMonthDisplay = function () {
				this.isWired && this.setNodeValue ('month',_monthNames [this._month]);
				/*?
					Implied Nodes
						month Implied Node
							A node that is used to display the name of the current month in view (ie. the value of the =month= state property, displayed as a month name).

							This implied node can be of many types: =div=, =span=, =p=, =b=, =td=, =input=, etc. The month name is displayed in this implied node using the =setNodeValue= instance method of the =Uize.Widget= base class. Therefore, any features supported by the =setNodeValue= method are also supported for this implied node.

							NOTES
							- the markup for this implied node is optional
							- see the companion =year Implied Node=
				*/
			};

			_classPrototype._updateUiYearDisplay = function () {
				this.isWired && this.setNodeValue ('year',this._year);
				/*?
					Implied Nodes
						year Implied Node
							A node that is used to display the current year in view (ie. the value of the =year= state property).

							This implied node can be of many types: =div=, =span=, =p=, =b=, =td=, =input=, etc. The year is displayed in this implied node using the =setNodeValue= instance method of the =Uize.Widget= base class. Therefore, any features supported by the =setNodeValue= method are also supported for this implied node.

							NOTES
							- the markup for this implied node is optional
							- see the companion =month Implied Node=
				*/
			};

			var _updateUiGrid = _classPrototype._updateUiGrid = function () {
				var _this = this;
				if (_this.isWired) {
					var
						_dateAsInt = function (_date,_defaultValue) {
							return (
								_date
									? _date.getFullYear () * 10000 + (_date.getMonth () + 1) * 100 + _date.getDate ()
									: _defaultValue
							);
						},
						_value = _this._value,
						_minValue = _this._minValue,
						_maxValue = _this._maxValue,
						_year = _this._year,
						_month = _this._month,
						_daysInMonth = _Uize_Date.getDaysInMonth (_month,_year),
						_firstDayOfMonth = new Date (_year,_month,1),
						_firstDayOfMonthAsInt = _dateAsInt (_firstDayOfMonth),
						_firstEnabledDayNo =
							Uize.constrain (_dateAsInt (_minValue,0) - _firstDayOfMonthAsInt + 1,1,_daysInMonth + 1),
						_lastEnabledDayNo =
							Uize.constrain (_dateAsInt (_maxValue,Infinity) - _firstDayOfMonthAsInt + 1,-1,_daysInMonth),
						_lastDisplayedGridState = _this._lastDisplayedGridState
					;
					if (
						!_lastDisplayedGridState ||
						_value != _lastDisplayedGridState._value ||
						_month != _lastDisplayedGridState._month ||
						_year != _lastDisplayedGridState._year ||
						_firstEnabledDayNo != _lastDisplayedGridState._firstEnabledDayNo ||
						_lastEnabledDayNo != _lastDisplayedGridState._lastEnabledDayNo
					) {
						if (_lastDisplayedGridState) {
							/*** unwire previously wired day nodes ***/
								for (var _dayNo = 0, _dayNodeName; ++_dayNo < 32;) {
									_this.unwireNode (_dayNodeName = 'day' + _dayNo);
									_this.flushNodeCache (_dayNodeName);
								}
						}

						/*** update last displayed state ***/
							if (!_lastDisplayedGridState)
								_lastDisplayedGridState = _this._lastDisplayedGridState = {}
							;
							_lastDisplayedGridState._value = _value;
							_lastDisplayedGridState._month = _month;
							_lastDisplayedGridState._year = _year;
							_lastDisplayedGridState._firstEnabledDayNo = _firstEnabledDayNo;
							_lastDisplayedGridState._lastEnabledDayNo = _lastEnabledDayNo;

						var _gridStringChunks = ['<table class="calendarGrid" cellpadding="0" cellspacing="0"><tr>'];

						/*** build and replace the grid HTML ***/
							/*** build the days header ***/
								for (var _dayNo = -1; ++_dayNo < 7;)
									_gridStringChunks.push (
										'<th title="' + _dayNames [_dayNo] + '">' + _dayNames [_dayNo].charAt (0) + '</th>'
									)
								;
								_gridStringChunks.push ('</tr><tr>');

							/*** build the day selectors ***/
								var
									_valueAsInt = _dateAsInt (_value,_null),
									_idPrefix = _this.get ('idPrefix'),
									_dayNo = 1 - _firstDayOfMonth.getDay ()
								;
								for (var _rowNo = -1; ++_rowNo < 6;) {
									_gridStringChunks.push ('<tr>');
									for (var _columnNo = -1; ++_columnNo < 7;) {
										if (_dayNo > 0 && _dayNo <= _daysInMonth) {
											var _selected = _dateAsInt (new Date (_year,_month,_dayNo)) == _valueAsInt;
											_gridStringChunks.push (
												_dayNo >= _firstEnabledDayNo && _dayNo <= _lastEnabledDayNo
													? (
														'<td' + (_selected ? ' class="selected"' : '') + '><a href="javascript://" id="' + _idPrefix + '-day' + _dayNo + '" style="display:block; width:100%; text-align:center;">' + _dayNo + '</a></td>'
													) : (
														'<td class="' + (_selected ? 'selected ' : '') + 'grayed">' + _dayNo + '</td>'
													),
												'</td>'
											);
										} else {
											_gridStringChunks.push ('<td>&nbsp;</td>');
										}
										_dayNo++;
									}
									_gridStringChunks.push ('</tr>');
								}

							_gridStringChunks.push ('</table>');
							_this.setNodeInnerHtml ('grid',_gridStringChunks.join (''));
								/*?
									Implied Nodes
										grid
											A node, whose contents will be replaced with the dynamically generated grid HTML for the month of the year currently in view by the instance.

											This implied node can be of any type that can accept HTML contents containing a table. The contents of this node will be replaced when the grid needs to be updated - as a result of the values of the =month= or =year= properties changing, as a result of the `valid date range` changing, or as a result of any other state change in the instance that would affect what is displayed in the grid. For more info, see the section `Date Grid`.

											NOTES
											- see the related =day[dayNo]= implied node
								*/

						/*** wire the day selectors ***/
							for (
								var
									_dayNo = _daysInMonth + 1,
									_wireDaySelector = function (_dayNo) {
										_this.wireNode (
											'day' + _dayNo,
											'click',
											function () {_this.set ({_value:new Date (_year,_month,_dayNo)})}
										);
										/*?
											Implied Nodes
												day[dayNo]
													One of a number of nodes in the `date grid` that are used to indicate the days of the month of the year currently in view by the instance and that may be wired up to let the user select the corresponding date.

													The HTML for these implied nodes are generated dynamically when the contents of the =grid= implied node is replaced with the updated date grid HTML. The specific =day[dayNo]= implied node that corresponds to the currently selected date will be highlighted. All =day[dayNo]= implied nodes that represent dates that are outside of the `valid date range` will be grayed out.

													NOTES
													- see the related =grid= implied node
										*/
									}
								;
								--_dayNo > 0;
							)
								_wireDaySelector (_dayNo)
							;
					}
				} else {
					_this._lastDisplayedGridState = _null;
				}
			};

		/*** Public Instance Methods ***/
			_classPrototype.updateUi = function () {
				this._updateUiMonthDisplay ();
				this._updateUiYearDisplay ();
				this._updateUiGrid ();
			};

		/*** State Properties ***/
			function _conformNullableDateValue (_value) {
				return _Uize_Date.Formatter.parse (_value,this._displayFormat) || null;
			}
			_class.stateProperties ({
				_displayFormat:'displayFormat',
				_maxValue:{
					name:'maxValue',
					conformer:_conformNullableDateValue,
					onChange:[_snapView,_updateUiGrid,_updateUiNavButtonsState]
					/*?
						State Properties
							maxValue
								An instance of JavaScript's =Date= object, representing the latest date that can be selected by the user (ie. the maximum value for the =value= state property).

								The =maxValue= property specifies the end date of the valid date range represented by the =minValue= and =maxValue= properties combined (for more info, see the section `Valid Date Range`).

								Flexibility in Specifying Value
									When setting the =maxValue= property, the date can be specified in a variety of different manners (for more info, see the section `Specifying Date Values`).

								Nullable
									The =maxValue= property can be set to =null= or =''= (empty string), to indicate that there is no upper bound to the `valid date range` (for more info, see the section `Boundless Date Ranges`).

								Snapping into View
									When the =maxValue= property is modified, the values of the =year= and =month= state properties will be updated, if necessary, in order to ensure that the viewed year and month is not outside of the newly set `valid date range` (for more info, see the section `Snap View Behavior`).

								Value Invalidation
									When the =maxValue= property is modified, the =value= state property may be set to =null= if the selected date lies outside of the newly set `valid date range` (for more info, see the section `Invalidation of value`).

								Updating Navigation Button State
									When the value of the =maxValue= property is modified, the state of the year and month navigation buttons will be updated, so that buttons will only be enabled if their action would not take the view outside of the newly set `valid date range` (for more info, see the section `Navigation Button State Management`).

								NOTES
								- see the companion =minValue= state property
								- see also the =snapViewOnValueChange= state property
					*/
				},
				_minValue:{
					name:'minValue',
					conformer:_conformNullableDateValue,
					onChange:[_snapView,_updateUiGrid,_updateUiNavButtonsState]
					/*?
						State Properties
							minValue
								An instance of JavaScript's =Date= object, representing the earliest date that can be selected by the user (ie. the minimum value for the =value= state property).

								The =minValue= property specifies the start date of the valid date range represented by the =minValue= and =maxValue= properties combined (for more info, see the section `Valid Date Range`).

								Flexibility in Specifying Value
									When setting the =minValue= property, the date can be specified in a variety of different manners (for more info, see the section `Specifying Date Values`).

								Nullable
									The =minValue= property can be set to =null= or =''= (empty string), to indicate that there is no lower bound to the `valid date range` (for more info, see the section `Boundless Date Ranges`).

								Snapping into View
									When the =minValue= property is modified, the values of the =year= and =month= state properties will be updated, if necessary, in order to ensure that the viewed year and month is not outside of the newly set `valid date range` (for more info, see the section `Snap View Behavior`).

								Value Invalidation
									When the =minValue= property is modified, the =value= state property may be set to =null= if the selected date lies outside of the newly set `valid date range` (for more info, see the section `Invalidation of value`).

								Updating Navigation Button State
									When the value of the =minValue= property is modified, the state of the year and month navigation buttons will be updated, so that buttons will only be enabled if their action would not take the view outside of the newly set `valid date range` (for more info, see the section `Navigation Button State Management`).

								NOTES
								- see the companion =maxValue= state property
								- see also the =snapViewOnValueChange= state property
					*/
				},
				_month:{
					name:'month',
					conformer:function (_value) {
						var _yearOffset = Math.floor (_value / 12);
						_yearOffset && this.set ({_year:this._year + _yearOffset});
						return ((_value % 12) + 12) % 12;
					},
					onChange:[_classPrototype._updateUiMonthDisplay,_updateUiGrid,_updateUiNavButtonsState]
					/*?
						State Properties
							month
								An integer in the range of =0= to =11=, repesenting the month of the year that should be in view in the calendar's UI.

								The value of this state property is independent of the selected date that is represented by the =value= state property.

								Month Wrapping Behavior
									The conformer of the =month= property supports wrapping when values are specified outside of the range of =0= to =11=.

									This makes is possible to increment or decrement the value of this property to effectively navigate across years.

									EXAMPLE
									......................................................
									myCalendar.set ({year:2009,month:11});

									// increment month into next year
									myCalendar.set ({month:myCalendar.get ('month') + 1});

									alert (myCalendar.get ('year'));   // displays 2010
									alert (myCalendar.get ('month'));  // displays 0

									// decrement month back into previous year
									myCalendar.set ({month:myCalendar.get ('month') - 1});

									alert (myCalendar.get ('year'));   // displays 2009
									alert (myCalendar.get ('month'));  // displays 11
									......................................................

									The wrapping behavior uses a modulus, so you can increment or decrement by any number of months at a time. For instance, the statement =myCalendar.set ({month:myCalendar.get ('month') + 18})= would advance the view of the =myCalendar= widget a year and a half into the future.

								NOTES
								- see the companion =year= state property
								- see the related =snapViewOnValueChange= and =value= state properties
					*/
				},
				_snapViewOnValueChange:{
					name:'snapViewOnValueChange',
					value:_true
					/*?
						State Properties
							snapViewOnValueChange
								A boolean, specifying whether or not the values of the =month= and =year= state properties should automatically be set when the value of the =value= state property changes.

								When this property is set to =true=, the =month= and =year= properties will be automatically set when the value of the =value= property changes, to ensure that the newly selected date is in view. In this mode, the values of the =month= and =year= properties can still be changed so that the currently selected date is not in view, but whenever the =value= property is next modified, the =month= and =year= properties will be "snapped back" to the month and year of the selected date.

								NOTES
								- see the related =month=, =year=, and =value= state properties
					*/
				},
				_value:{
					name:'value',
					conformer:_conformNullableDateValue,
					value:new Date,
					onChange:[
						function () {this._snapViewOnValueChange && this._snapView ()},
						_updateUiGrid,
						_updateUiNavButtonsState
					]
					/*?
						State Properties
							value
								An instance of JavaScript's =Date= object, representing the currently selected date value for the instance.

								When the user selects a date using the instance's user interface, the =value= property is updated. When the =value= property is modified programmatically, the user interface will be updated to reflect the new value.

								Flexibility in Specifying Value
									When setting the =value= property, the date can be specified in a variety of different manners (for more info, see the section `Specifying Date Values`).

								Nullable
									The =value= property can be set to =null= or =''= (empty string), to indicate that no date has been selected.

								Snapping Into View
									If the =snapViewOnValueChange= state property is set to =true= at the time that the =value= property is modified, then the values of the =year= and =month= state properties will be updated as needed in order to ensure that the newly selected date is in view.

									For more information on this behavior, see the section `Snap View Behavior`.

								NOTES
								- see the related =minValue= and =maxValue= state properties
								- see also the =snapViewOnValueChange= state property
					*/
				},
				_year:{
					name:'year',
					onChange:[_classPrototype._updateUiYearDisplay,_updateUiGrid,_updateUiNavButtonsState]
					/*?
						State Properties
							year
								An integer, repesenting the year that should be in view in the calendar's UI.

								The value of this state property is independent of the selected date that is represented by the =value= state property.

								NOTES
								- see the companion =month= state property
								- see the related =snapViewOnValueChange= and =value= state properties
					*/
				}
			});

		return _class;
	}
});

