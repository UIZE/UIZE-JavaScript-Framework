/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Options.FilterGroup Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 7
	codeCompleteness: 50
	docCompleteness: 0
*/

/*?
	Introduction
		The =Uize.Widget.Options.FilterGroup= widget provides the functionality for a filter group widget...

		*DEVELOPERS:* `Ben Ilegbodu`
*/

Uize.module ({
	name:'Uize.Widget.Options.FilterGroup',
	required:[
		'Uize.Widget.Button.Filter',
		'Uize.Node.Classes'
	],
	builder:function (_superclass) {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_true = true,
				_false = false,
				_Uize_Node_Classes = Uize.Node.Classes
			;

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (),
				_classPrototype = _class.prototype
			;

		/*** Private Instance Methods ***/
			_classPrototype._updateUiExpanded = function() {
				var _this = this;

				_this.isWired
					&& _Uize_Node_Classes.setState(
						_this.getNode('options'),
						['', _this._expandedCssClass],
						_this._expanded
					)
				;
			};

			_classPrototype._updateUiFilterVisibility = function() {
				var
					_this = this,
					_allZero = _true
				;

				_this.isWired
					&& _this.forAll(
						function(_filterWidget) {
							var
								_filterCount = _filterWidget.get('count'),
								_displayFilter = !_this._hideWhenZero
									|| _filterCount
							;

							_filterWidget.displayNode('', _displayFilter);
							_filterWidget.set({enabled:!_filterCount ? _false : 'inherit'});

							if (_displayFilter)
								_allZero = _false;
						}
					)
				;

				_this.displayNode('', !_allZero && _this.get('values').length > 1);
			};

			_classPrototype._updateUiTitle = function() {
				this.isWired && this.setNodeInnerHtml('title', this._title)
			};

		/*** Public Instance Methods ***/
			_classPrototype.updateCounts = function(_counts) {
				var
					_this = this,
					_countsLength = _counts.length
				;

				if (_this.isWired) {
					// NOTE: the count parameter for each filter in the values set
					// will be out of sync...

					_counts
						&& _countsLength
						&& _this.forAll(
							function(_filterWidget, _filterNo) {
								_filterNo < _countsLength
									&& _filterWidget.set({count:_counts[_filterNo]})
							}
						)
					;

					_this._updateUiFilterVisibility();
				}
			};

			_classPrototype.updateUi = function () {
				var _this = this;
				if (_this.isWired) {
					_this._updateUiTitle();
					_this._updateUiExpanded();
					_this._updateUiFilterVisibility();
					_superclass.prototype.updateUi.call (_this);
				}
			};

		/*** State Properties ***/
			_class.stateProperties ({
				_expanded:{
					name:'expanded',
					onChange:_classPrototype._updateUiExpanded,
					value:_false
				},
				_expandedCssClass:{
					name:'expandedCssClass',
					onChange:_classPrototype._updateUiExpanded,
					value:''
				},
				_hideWhenZero:{
					name:'hideWhenZero',
					onChange:_classPrototype._updateUiFilterVisibility,
					value:_true
				},
				_title:{
					name:'title',
					onChange:_classPrototype._updateUiTitle,
					value:''
				}
			});

		/*** Override Initial Values for Inherited State Properties ***/
			_class.set ({
				optionWidgetClass:Uize.Widget.Button.Filter,
				ensureValueInValues:_true
			});

		return _class;
	}
});

