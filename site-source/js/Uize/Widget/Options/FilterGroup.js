/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Options.FilterGroup Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2016 UIZE
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

		*DEVELOPERS:* `Ben Ilegbodu`, original code contributed by `Zazzle Inc.`
*/

Uize.module ({
	name:'Uize.Widget.Options.FilterGroup',
	required:[
		'Uize.Widget.Button.Filter',
		'Uize.Dom.Classes'
	],
	builder:function (_superclass) {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_true = true,
				_false = false,
				_Uize_Dom_Classes = Uize.Dom.Classes
		;

		/*** Private Instance Methods ***/
			function _updateUiExpanded (m) {
				m.isWired
					&& _Uize_Dom_Classes.setState(
						m.getNode('options'),
						['', m._expandedCssClass],
						m._expanded
					)
				;
			}

			function _updateUiFilterVisibility (m) {
				var _allZero = _true;

				m.isWired
					&& m.forAll(
						function (_filterWidget) {
							var
								_filterCount = _filterWidget.get('count'),
								_displayFilter = !m._hideWhenZero
									|| _filterCount
							;

							_filterWidget.displayNode('', _displayFilter);
							_filterWidget.set({enabled:!_filterCount ? _false : 'inherit'});

							if (_displayFilter)
								_allZero = _false;
						}
					)
				;

				m.displayNode(
					'',
					m.getInherited('allowMultiple') === _false
						|| (!_allZero && m.get('values').length > 1)
				);
			}

			function _updateUiTitle (m) { m.isWired && m.setNodeInnerHtml('title', m._title) }

		return _superclass.subclass ({
			instanceMethods:{
				updateCounts:function (_counts) {
					var
						m = this,
						_countsLength = _counts.length
					;

					if (m.isWired) {
						// NOTE: the count parameter for each filter in the values set
						// will be out of sync...

						_counts
							&& _countsLength
							&& m.forAll(
								function (_filterWidget, _filterNo) {
									_filterNo < _countsLength
										&& _filterWidget.set({count:_counts[_filterNo]});
								}
							)
						;

						_updateUiFilterVisibility(m);
					}
				},

				updateUi:function () {
					var m = this;
					if (m.isWired) {
						_updateUiTitle(m);
						_updateUiExpanded(m);
						_updateUiFilterVisibility(m);
						_superclass.doMy (m,'updateUi');
					}
				}
			},

			stateProperties:{
				_expanded:{
					name:'expanded',
					onChange:function () {_updateUiExpanded (this)},
					value:_false
				},
				_expandedCssClass:{
					name:'expandedCssClass',
					onChange:function () {_updateUiExpanded (this)},
					value:''
				},
				_hideWhenZero:{
					name:'hideWhenZero',
					onChange:function () {_updateUiFilterVisibility (this)},
					value:_true
				},
				_title:{
					name:'title',
					onChange:function () {_updateUiTitle (this)},
					value:''
				}
			},

			set:{
				optionWidgetClass:Uize.Widget.Button.Filter
			}
		});
	}
});

