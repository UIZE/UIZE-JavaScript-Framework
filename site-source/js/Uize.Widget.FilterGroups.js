/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.FilterGroups Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 6
	codeCompleteness: 0
	docCompleteness: 0
*/

/*?
	Introduction
		The =Uize.Widget.FilteredInput= widget provides functionality for...

		*DEVELOPERS:* `Ben Ilegbodu`
*/

Uize.module ({
	name:'Uize.Widget.FilterGroups',
	required:[
		'Uize.Widget.Options.FilterGroup',
		'Uize.Data'
	],
	builder:function (_superclass) {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_true = true,
				_null = null,

				_Uize = Uize
			;

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					_null,
					function () {
						var
							m = this
						;

						m._previousSelectedFilters = m._value;
					}
				),
				_classPrototype = _class.prototype
			;

		/*** Private Methods ***/
			_classPrototype._forAll = function (_function) {
				for (
					var _valueNo = -1, _valuesLength = this._values.length, _children = this.children;
					++_valueNo < _valuesLength;
				)
					if (_function (_children ['filterGroup' + _valueNo],_valueNo) === false) break;
			};

			_classPrototype._updateSelectedFilters = function (_changedValue) {
				var m = this;

				if (m.isWired) {
					var _selectedFilters = [];

					m._forAll(
						function (_filterGroupWidget) {
							var _value = _filterGroupWidget.valueOf();
							_value
								&& _selectedFilters.push(_value);
						}
					);

					if (!_Uize.Data.clones(_selectedFilters, m._previousSelectedFilters)) {
						_selectedFilters = m._allowMultiple || !_changedValue
							? _selectedFilters
							: (_Uize.indexIn(_selectedFilters, _changedValue) > -1
								? [_changedValue]
								: _selectedFilters
							)
						;
						m._previousSelectedFilters = _selectedFilters;
						m.set({_value:_selectedFilters});
					}
				}
			};

			_classPrototype._setFilterGroupsSelectedFilter = function () {
				var m = this;

				if (m.isWired) {
					var
						_selectedFilters = m._value,
						_filterGroupsData = m._values,
						_children = m.children,
						_selectedFilterLookup = {}
					;
					m._forAll(
						function (_filterGroupWidget) {
							var _filterToSet = _null;

							for (var _selectedFilterNo = -1; ++_selectedFilterNo < _selectedFilters.length;) {
								var _selectedFilter = _selectedFilters[_selectedFilterNo];
								if (
									!_selectedFilterLookup[_selectedFilter] &&
									_filterGroupWidget.getValueNoFromValue(_selectedFilter) > -1
								) {
									_filterToSet = _selectedFilter;
									_selectedFilterLookup[_selectedFilter] = _true;
									break;
								}
							}

							_filterGroupWidget.set({value:_filterToSet});
						}
					);
				}
			};

		/*** Public Methods ***/
			_classPrototype.updateCounts = function (_counts) {
				var
					m = this,
					_countsLength = _counts.length
				;

				if (m.isWired) {
					_counts
						&& _countsLength
						&& m._forAll(
							function (_filterGroupWidget, _filterGroupNo) {
								_filterGroupNo < _countsLength
									&& _filterGroupWidget.updateCounts(_counts[_filterGroupNo])
							}
						)
					;
				}
			};

			_classPrototype.wireUi = function () {
				var m = this;

				if (!m.isWired) {
					var
						_selectedFilters = m._value,
						_filterGroupsData = m._values
					;

					for (var _filterGroupNo = -1; ++_filterGroupNo < _filterGroupsData.length;)
						m.addChild (
							'filterGroup' + _filterGroupNo,
							_Uize.Widget.Options.FilterGroup,
							_Uize.copyInto(
								{ensureValueInValues:m._allowMultiple},
								_Uize.clone(_filterGroupsData[_filterGroupNo])
							)
						).wire(
							'Changed.value',
							function (_event) { m._updateSelectedFilters(_event.source.valueOf()) }
						)
					;

					_superclass.doMy (m,'wireUi');

					m._setFilterGroupsSelectedFilter();
					m._updateSelectedFilters();
				}
			};

		/*** State Properties ***/
			_class.stateProperties ({
				_allowMultiple:{
					name:'allowMultiple',
					onChange:function () {
						var
							m = this,
							_valueLength = m._value.length
						;

						!m._allowMultiple
							&& _valueLength > 1
							&& m.set({_value:m._value.splice(_valueLength-1,1)})
						;
					},
					value:_true
				},
				_value:{
					name:'value',
					conformer:function (_value) {
						_value = _Uize.isArray(_value) ? _value : [];
						var _valueLength = _value.length;
						return this._allowMultiple || _valueLength == 1 ? _value : _value.splice(_valueLength-1,1);
					},
					onChange:_classPrototype._setFilterGroupsSelectedFilter,
					value:[]
				},
				_values:{
					name:'values',
					value:[]
				}
			});

		return _class;
	}
});

