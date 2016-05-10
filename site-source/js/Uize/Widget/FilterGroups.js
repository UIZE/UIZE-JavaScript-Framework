/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.FilterGroups Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2016 UIZE
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

		*DEVELOPERS:* `Ben Ilegbodu`, original code contributed by `Zazzle Inc.`
*/

Uize.module ({
	name:'Uize.Widget.FilterGroups',
	required:[
		'Uize.Widget.Options.FilterGroup',
		'Uize.Data.Compare'
	],
	builder:function (_superclass) {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_Uize = Uize
		;

		/*** Private Methods ***/
			function _forAll (m,_function) {
				for (
					var _valueNo = -1, _valuesLength = m._values.length, _children = m.children;
					++_valueNo < _valuesLength;
				)
					if (_function (_children ['filterGroup' + _valueNo],_valueNo) === false) break;
			}

			function _updateSelectedFilters (m,_changedValue) {
				if (m.isWired) {
					var _selectedFilters = [];

					_forAll(
						m,
						function (_filterGroupWidget) {
							var _value = _filterGroupWidget.valueOf();
							_value
								&& _selectedFilters.push(_value);
						}
					);

					if (!_Uize.Data.Compare.clones(_selectedFilters, m._previousSelectedFilters)) {
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
			}

			function _setFilterGroupsSelectedFilter (m) {
				if (m.isWired) {
					var
						_selectedFilters = m._value,
						_selectedFilterLookup = {}
					;
					_forAll(
						m,
						function (_filterGroupWidget) {
							var _filterToSet = null;

							for (var _selectedFilterNo = -1; ++_selectedFilterNo < _selectedFilters.length;) {
								var _selectedFilter = _selectedFilters[_selectedFilterNo];
								if (
									!_selectedFilterLookup[_selectedFilter] &&
									_filterGroupWidget.getValueNoFromValue(_selectedFilter) > -1
								) {
									_filterToSet = _selectedFilter;
									_selectedFilterLookup[_selectedFilter] = true;
									break;
								}
							}

							_filterGroupWidget.set({value:_filterToSet});
						}
					);
				}
			}

		return _superclass.subclass ({
			omegastructor:function () {
				this._previousSelectedFilters = this._value;
			},

			instanceMethods:{
				updateCounts:function (_counts) {
					var
						m = this,
						_countsLength = _counts.length
					;

					if (m.isWired) {
						_counts
							&& _countsLength
							&& _forAll(
								m,
								function (_filterGroupWidget, _filterGroupNo) {
									_filterGroupNo < _countsLength
										&& _filterGroupWidget.updateCounts(_counts[_filterGroupNo])
									;
								}
							)
						;
					}
				},

				wireUi:function () {
					var m = this;

					if (!m.isWired) {
						var
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
								function (_event) { _updateSelectedFilters(m,_event.source.valueOf()) }
							)
						;

						_superclass.doMy (m,'wireUi');

						_setFilterGroupsSelectedFilter(m);
						_updateSelectedFilters(m);
					}
				}
			},

			stateProperties:{
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
					value:true
				},
				_value:{
					name:'value',
					conformer:function (_value) {
						_value = _Uize.isArray(_value) ? _value : [];
						var _valueLength = _value.length;
						return this._allowMultiple || _valueLength == 1 ? _value : _value.splice(_valueLength-1,1);
					},
					onChange:function () {_setFilterGroupsSelectedFilter (this)},
					value:[]
				},
				_values:{
					name:'values',
					value:[]
				}
			}
		});
	}
});

