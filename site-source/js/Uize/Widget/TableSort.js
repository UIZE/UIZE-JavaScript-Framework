/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.TableSort Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2005-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 3
	codeCompleteness: 80
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Widget.TableSort= class adds sorting functionality to tables, and provides row highlighting as well as column name tooltips for table cells.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widget.TableSort',
	required:[
		'Uize.Dom.Basics',
		'Uize.Dom.Text'
	],
	builder:function (_superclass) {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_null = null,
				_true = true,
				_updateUi = 'updateUi',
				_getById = Uize.Dom.Basics.getById,
				_getText = Uize.Dom.Text.getText
		;

		/*** Utility Functions ***/
			function _getChildNodesByTagName (_node,_tagName) {
				var
					_result = [],
					_childNodes = _node.childNodes,
					_childNodesLength = _childNodes.length
				;
				for (var _childNo = -1; ++_childNo < _childNodesLength;) {
					var _childNode = _childNodes [_childNo];
					_childNode.tagName == _tagName && _result.push (_childNode);
				}
				return _result;
			}

			function _getTableBody (_node) {
				return _getById (_node).getElementsByTagName ('tbody') [0];
			}

			function _getRowCells (_row) {
				var _cells = _getChildNodesByTagName (_row,'TD');
				if (!_cells.length) _cells = _getChildNodesByTagName (_row,'TH');
				return _cells;
			}

		/*** Private Instance Methods ***/
			function _isColumnNextSortOrderAscending (m,_columnNo) {
				return (
					_columnNo == m._headingNoSorted
						? !m._ascendingOrder
						:
							(
								(m._dominantSortOrderByColumn && m._dominantSortOrderByColumn [_columnNo]) ||
								m._dominantSortOrder
							) == 'ascending'
				);
			}

			function _updateColumnUi (m,_columnNo) {
				if (m.isWired) {
					var _heading = m._headings [_columnNo];
					_heading.className =
						(
							_columnNo == m._headingNoSorted
								? m._headingLitClass
								: (
									_columnNo == m._headingNoOver
										? m._headingOverClass
										: m._headingsOldClasses [_columnNo]
								)
						) || ''
					;
					_heading.title = _isColumnNextSortOrderAscending (m,_columnNo)
						? m._languageSortAscending
						: m._languageSortDescending
					;
				}
			}

			function _updateRowUi (m,_row) {
				if (m.isWired && _row)
					_row.className = (_row == m._rowOver ? m._rowOverClass : _row.Uize_Widget_TableSort_oldClassName) || ''
				;
			}

			function _headingMouseover (m,_columnNo) {
				_headingMouseout (m);
				m._headingNoOver = _columnNo;
				_updateColumnUi (m,_columnNo);
			}

			function _headingMouseout (m) {
				if (m._headingNoOver != _null) {
					var _lastHeadingNoOver = m._headingNoOver;
					m._headingNoOver = _null;
					_updateColumnUi (m,_lastHeadingNoOver);
				}
			}

			function _rowMouseover (m,_row) {
				_rowMouseout (m);
				m._rowOver = _row;
				_updateRowUi (m,_row);
			}

			function _rowMouseout (m) {
				if (m._rowOver) {
					var _lastRowOver = m._rowOver;
					m._rowOver = _null;
					_updateRowUi (m,_lastRowOver);
				}
			}

		return _superclass.subclass ({
			instanceMethods:{
				sort:function (_columnNo) {
					var
						m = this,
						_table = m.getNode ()
					;
					if (_table) {
						var
							_tableBody = _getTableBody (_table),
							_rows = _getChildNodesByTagName (_tableBody,'TR'),
							_rowsLength = _rows.length,
							_columnValues = [],
							_columnSortMap = [],
							_columnHasNumerals = _true,
							_columnIsPureNumber = _true,
							_columnIsDate = _true
						;
						m._ascendingOrder = _isColumnNextSortOrderAscending (m,_columnNo);

						/*** initialize sort map, harvest sort column's values, and inspect to determine type ***/
							for (var _rowNo = -1; ++_rowNo < _rowsLength;) {
								_columnSortMap [_rowNo] = _rowNo;
								/* NOTE: conditionalized to skip over the headings row (if in table body) and any rows with too few cells */
								if (_rowNo != m._headingsRowNo) {
									var _cells = _getRowCells (_rows [_rowNo]);
									if (_cells.length == m._headings.length) {
										var _cellText = _getText (_cells [_columnNo]);
										if (_cellText) {
											var _cellTestIsPureNumber = !Uize.isNaN (+_cellText);
											_columnIsPureNumber = _columnIsPureNumber && _cellTestIsPureNumber;
											_columnIsDate =
												_columnIsDate && !_cellTestIsPureNumber && !Uize.isNaN (+new Date (_cellText))
											;
											_columnHasNumerals =
												_columnHasNumerals && (_cellTestIsPureNumber || /\d/.test (_cellText))
											;
											_columnValues [_rowNo] = _cellText;
										}
									}
								}
							}
							_columnIsDate = _columnIsDate && !_columnIsPureNumber;

						/*** sort the sort map ***/
							var
								_compareGeneral = function (_valueA,_valueB) {
									return _valueA == _valueB ? 0 : (_valueA < _valueB ? -1 : 1);
								},
								_compareNumbers = _compareGeneral, // for now, at least
								_columnIsDateOrNumber = _columnIsDate || _columnHasNumerals,
								_comparisonFunction = _columnIsDateOrNumber ? _compareNumbers : _compareGeneral,
								_incorrectComparisonFunctionResult = m._ascendingOrder ? 1 : -1,
								_skipRow = function (_sortMapIndex) {
									return _columnValues [_columnSortMap [_sortMapIndex]] === undefined;
								},
								_columnValue
							;
							/*** for number and date columns, convert text values to numbers for more efficient sort ***/
								if (_columnIsDateOrNumber) {
									for (var _rowNo = -1; ++_rowNo < _rowsLength;) {
										if (!_skipRow (_rowNo)) {
											_columnValue = _columnValues [_rowNo];
											_columnValues [_rowNo] = +(
												_columnIsPureNumber
													? _columnValue
													: _columnIsDate
														? new Date (_columnValue)
														: _columnValue.replace (/[^\d\.]/g,'')
											);
										}
									}
								}
							/* NOTES:
								- conditionalized to leave headings row (if in table body) and "spacer" rows in same position
								- any row for which no sort column value has been determined (see above) is left in its original order
								- using a hand-rolled bubble sort here, since it's the only way to guarantee fixed rows keep their order (the Array.sort method doesn't guarantee order)
							*/
							var _rowsLengthMinus1 = _rowsLength - 1;
							for (var _sortMapIndexA = -1; ++_sortMapIndexA < _rowsLengthMinus1;) {
								if (!_skipRow (_sortMapIndexA)) {
									for (var _sortMapIndexB = _sortMapIndexA; ++_sortMapIndexB < _rowsLength;) {
										if (!_skipRow (_sortMapIndexB)) {
											if (
												_incorrectComparisonFunctionResult == _comparisonFunction (
													_columnValues [_columnSortMap [_sortMapIndexA]],
													_columnValues [_columnSortMap [_sortMapIndexB]]
												)
											) {
												var _temp = _columnSortMap [_sortMapIndexA];
												_columnSortMap [_sortMapIndexA] = _columnSortMap [_sortMapIndexB];
												_columnSortMap [_sortMapIndexB] = _temp;
											}
										}
									}
								}
							}

						/*** apply the sort map ***/
							for (var _rowNo = -1; ++_rowNo < _rowsLength;)
								_tableBody.appendChild (_rows [_columnSortMap [_rowNo]])
							;

						/*** update the heading UI to reflect new sort status ***/
							if (_columnNo != m._headingNoSorted) {
								if (m._headingNoSorted != _null) {
									var _lastHeadingNoSorted = m._headingNoSorted;
									m._headingNoSorted = _null;
									_updateColumnUi (m,_lastHeadingNoSorted);
								}
								m._headingNoSorted = _columnNo;
								_updateColumnUi (m,_columnNo);
							}
					}
				},

				updateUi:function () {
					var m = this;
					if (m.isWired) {
						for (var _columnNo = -1; ++_columnNo < m._headings.length;)
							_updateColumnUi (m,_columnNo)
						;
						_updateRowUi (m,m._rowOver);
					}
				},

				wireUi:function () {
					var m = this;
					if (!m.isWired) {
						/*** Initialize Instance Properties ***/
							m._headings = [];
							m._headingsOldClasses = [];
							m._headingNoOver = m._headingNoSorted = m._rowOver = _null;
							m._ascendingOrder = _true;

						var _table = m.getNode ();
						if (_table) {
							var
								_tableBody = _getTableBody (m.getNode ()),
								_tableBodyRows = _getChildNodesByTagName (_tableBody,'TR')
							;
							/*** find column headings row (could be in table head or table body) ***/
								/* NOTES:
									- headings are the first row found (either in the table head or the table body) with the maximum number of columns of all the table's rows
								*/
								var
									_maxColumns = 0,
									_tableBodyRowsLength = _tableBodyRows.length
								;
								for (var _rowNo = -1; ++_rowNo < _tableBodyRowsLength;)
									_maxColumns = Math.max (_maxColumns,_getRowCells (_tableBodyRows [_rowNo]).length)
								;
								var
									_tryFindHeadings = function (_rows) {
										for (var _rowNo = -1, _rowsLength = _rows.length; ++_rowNo < _rowsLength;) {
											var _rowCells = _getRowCells (_rows [_rowNo]);
											if (_rowCells.length == _maxColumns) {
												m._headings = _rowCells;
												m._headingsRowNo = _rowNo;
												break;
											}
										}
									},
									_tableHeads = _table.getElementsByTagName ('thead')
								;
								if (_tableHeads.length > 0) {
									var _tableHeadRows = _getChildNodesByTagName (_tableHeads [0],'TR');
									if (!_tableHeadRows.length) _tableHeadRows = [_tableHeads [0]];
									_tryFindHeadings (_tableHeadRows);
								}
								m._headingsRowNo = -1;
								m._headings.length || _tryFindHeadings (_tableBodyRows);

							/*** wire up headings ***/
								Uize.forEach (
									m._headings,
									function (_heading,_headingNo) {
										m._headingsOldClasses [_headingNo] = _heading.className;
										m.wireNode (
											_heading,
											{
												mouseover:function () {_headingMouseover (m,_headingNo)},
												mouseout:function () {_headingMouseout (m)},
												click:function () {m.sort (_headingNo)}
											}
										);
									}
								);

							/*** wire up rows with highlight behavior and title attributes for columns ***/
								for (
									var
										_rowNo = -1,
										_tableBodyRowsLength = _tableBodyRows.length,
										_headingsText = Uize.map (
											m._headings,
											function (_heading) {return _getText (_heading)}
										),
										_wireRow = function (_row) {
											_row.Uize_Widget_TableSort_oldClassName = _row.className;
											m.wireNode (
												_row,
												{
													mouseover:function () {_rowMouseover (m,_row)},
													mouseout:function () {_rowMouseout (m)}
												}
											);
										}
									;
									++_rowNo < _tableBodyRowsLength;
								) {
									/* NOTE: conditionalized to skip over the headings row (if in table body) and any rows with too few cells */
									if (_rowNo != m._headingsRowNo) {
										var
											_row = _tableBodyRows [_rowNo],
											_cells = _getRowCells (_row)
										;
										_cells.length == m._headings.length && _wireRow (_row);
										for (var _cellNo = -1; ++_cellNo < _cells.length;) {
											if (
												m._cellTooltipsByColumn && _cellNo in m._cellTooltipsByColumn
													? m._cellTooltipsByColumn [_cellNo]
													: m._cellTooltips
											)
												_cells [_cellNo].title = _headingsText [_cellNo]
											;
										}
									}
								}
						}

						_superclass.doMy (m,'wireUi');
					}
				}
			},

			stateProperties:{
				_cellTooltips:{
					name:'cellTooltips',
					value:_true
				},
				_cellTooltipsByColumn:'cellTooltipsByColumn',
				_dominantSortOrder:{
					name:'dominantSortOrder',
					value:'ascending'
				},
				_dominantSortOrderByColumn:'dominantSortOrderByColumn',
				_headingOverClass:{
					name:'headingOverClass',
					onChange:_updateUi
				},
				_headingLitClass:{
					name:'headingLitClass',
					onChange:_updateUi
				},
				_languageSortAscending:{
					name:'languageSortAscending',
					onChange:_updateUi,
					value:'Click to sort in ascending order'
				},
				_languageSortDescending:{
					name:'languageSortDescending',
					onChange:_updateUi,
					value:'Click to sort in descending order'
				},
				_rowOverClass:{
					name:'rowOverClass',
					onChange:_updateUi
				}
			}
		});
	}
});

