/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.FilterGroups Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2011 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*ScruncherSettings Mappings="=c" LineCompacting="TRUE"*/

/* Module Meta Data
	type: Class
	importance: 6
	codeCompleteness: 0
	testCompleteness: 0
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
		/*** Variables for Scruncher Optimization ***/
			var
				_true = true,
				_null = null
			;
			
		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					_null,
					function() {
						var
							_this = this
						;

						_this._previousSelectedFilters = _this._value;
					}
				),
				_classPrototype = _class.prototype
			;
			
		/*** Private Methods ***/
			_classPrototype._updateSelectedFilters = function() {
				var _this = this;
				
				if (_this.isWired) {
					var _selectedFilters = [];
					
					for (var _filterGroupNo = -1; ++_filterGroupNo < _this._values.length;) {
						var _selectedFilter = _this.children['filterGroup' + _filterGroupNo].valueOf();
						
						_selectedFilter != _null
							&& _selectedFilters.push(_selectedFilter);
					}
					
					if (!Uize.Data.clones(_selectedFilters, _this._previousSelectedFilters)) {
						_this._previousSelectedFilters = _selectedFilters;
						_this.set({_value:_selectedFilters});
					}
				}
			};
			
			_classPrototype._setFilterGroupsSelectedFilter = function() {
				var _this = this;
				
				if (_this.isWired) {
					var
						_selectedFilters = _this._value,
						_filterGroupsData = _this._values,
						_children = _this.children,
						_selectedFilterLookup = {}
					;
					
					for (var _filterGroupNo = -1; ++_filterGroupNo < _filterGroupsData.length;) {
						var
							_filterGroupWidget = _children['filterGroup' + _filterGroupNo],
							_filterToSet = _null
						;
						
						for (var _selectedFilterNo = -1; ++_selectedFilterNo < _selectedFilters.length;) {
							var _selectedFilter = _selectedFilters[_selectedFilterNo];

							if (!_selectedFilterLookup[_selectedFilter] && _filterGroupWidget.getValueNoFromValue(_selectedFilter) > -1) {
								_filterToSet = _selectedFilter;
								_selectedFilterLookup[_selectedFilter] = _true;
								break;
							}
						}
						
						_filterGroupWidget.set({value:_filterToSet});
					}
				}
			};

		/*** Public Methods ***/
			_classPrototype.wireUi = function () {
				var _this = this;
				
				if (!_this.isWired) {
					var
						_selectedFilters = _this._value,
						_filterGroupsData = _this._values
					;
					
					for (var _filterGroupNo = -1; ++_filterGroupNo < _filterGroupsData.length;)
						_this.addChild (
							'filterGroup' + _filterGroupNo,
							Uize.Widget.Options.FilterGroup,
							_filterGroupsData[_filterGroupNo]
						).wire(
							'Changed.value',
							function() { _this._updateSelectedFilters() }
						)
					;

					_superclass.prototype.wireUi.call (_this);
					
					_this._setFilterGroupsSelectedFilter();
					_this._updateSelectedFilters();
				}
			};

		/*** Register Properties ***/
			_class.registerProperties ({
				_allowMultiple:{
					name:'allowMultiple',
					onChange:function() {
						var _this = this;
						
						!_this._allowMultiple
							&& _this._value.length > 1
							&& _this.set({_value:_this._value.splice(0,1)})
						;
					},
					value:_true
				},
				_value:{
					name:'value',
					conformer:function(_value) {
						return this._allowMultiple || _value.length == 1 ? _value : _value.splice(0,1)
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

