/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.TableSort Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2005-2013 UIZE
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
	required:'Uize.Node',
	builder:function (_superclass) {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_undefined,
				_null = null,
				_true = true,
				_false = false,
				_Uize_Node = Uize.Node
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
				return _Uize_Node.getById (_node).getElementsByTagName ('tbody') [0];
			}

			function _getRowCells (_row) {
				var _cells = _getChildNodesByTagName (_row,'TD');
				if (!_cells.length) _cells = _getChildNodesByTagName (_row,'TH');
				return _cells;
			}

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (),
				_classPrototype = _class.prototype
			;

		/*** Private Instance Methods ***/
			_classPrototype._isColumnNextSortOrderAscending = function (_columnNo) {
				var _this = this;
				return (
					_columnNo == _this._headingNoSorted
						? !_this._ascendingOrder
						:
							(
								(_this._dominantSortOrderByColumn && _this._dominantSortOrderByColumn [_columnNo]) ||
								_this._dominantSortOrder
							) == 'ascending'
				);
			};

			_classPrototype._updateColumnUi = function (_columnNo) {
				var _this = this;
				if (_this.isWired) {
					var _heading = _this._headings [_columnNo];
					_heading.className =
						(
							_columnNo == _this._headingNoSorted
								? _this._headingLitClass
								: (
									_columnNo == _this._headingNoOver
										? _this._headingOverClass
										: _this._headingsOldClasses [_columnNo]
								)
						) || ''
					;
					_heading.title = _this._isColumnNextSortOrderAscending (_columnNo)
						? _this._languageSortAscending
						: _this._languageSortDescending
					;
				}
			};

			_classPrototype._updateRowUi = function (_row) {
				var _this = this;
				if (_this.isWired && _row)
					_row.className = (_row == _this._rowOver ? _this._rowOverClass : _row.Uize_Widget_TableSort_oldClassName) || ''
				;
			};

			_classPrototype._headingMouseover = function (_columnNo) {
				var _this = this;
				_this._headingMouseout ();
				_this._headingNoOver = _columnNo;
				_this._updateColumnUi (_columnNo);
			};

			_classPrototype._headingMouseout = function () {
				var _this = this;
				if (_this._headingNoOver != _null) {
					var _lastHeadingNoOver = _this._headingNoOver;
					_this._headingNoOver = _null;
					_this._updateColumnUi (_lastHeadingNoOver);
				}
			};

			_classPrototype._rowMouseover = function (_row) {
				var _this = this;
				_this._rowMouseout ();
				_this._rowOver = _row;
				_this._updateRowUi (_row);
			};

			_classPrototype._rowMouseout = function () {
				var _this = this;
				if (_this._rowOver) {
					var _lastRowOver = _this._rowOver;
					_this._rowOver = _null;
					_this._updateRowUi (_lastRowOver);
				}
			};

		/*** Public Instance Methods ***/
			_classPrototype.sort = function (_columnNo) {
				var
					_this = this,
					_table = _this.getNode ()
				;
				if (_table) {
					var
						_tableBody = _getTableBody (_table),
						_rows = _getChildNodesByTagName (_tableBody,'TR'),
						_rowsLength = _rows.length,
						_columnValues = [],
						_columnSortMap = [],
						_columnIsNumber = _true,
						_columnIsDate = _true
					;
					_this._ascendingOrder = _this._isColumnNextSortOrderAscending (_columnNo);

					/*** initialize sort map, harvest sort column's values, and inspect to determine type ***/
						for (var _rowNo = -1; ++_rowNo < _rowsLength;) {
							_columnSortMap [_rowNo] = _rowNo;
							/* NOTE: conditionalized to skip over the headings row (if in table body) and any rows with too few cells */
							if (_rowNo != _this._headingsRowNo) {
								var _cells = _getRowCells (_rows [_rowNo]);
								if (_cells.length == _this._headings.length) {
									var _cellText = _Uize_Node.getText (_cells [_columnNo]);
									if (_cellText) {
										_columnIsDate = _columnIsDate && !isNaN (+new Date (_cellText));
										_columnIsNumber = _columnIsNumber && /\d/.test (_cellText);
										_columnValues [_rowNo] = _cellText;
									}
								}
							}
						}

					/*** sort the sort map ***/
						var
							_compareGeneral = function (_valueA,_valueB) {
								return _valueA == _valueB ? 0 : (_valueA < _valueB ? -1 : 1);
							},
							_compareNumbers = _compareGeneral, // for now, at least
							_columnIsDateOrNumber = _columnIsDate || _columnIsNumber,
							_comparisonFunction = _columnIsDateOrNumber ? _compareNumbers : _compareGeneral,
							_incorrectComparisonFunctionResult = _this._ascendingOrder ? 1 : -1,
							_skipRow = function (_sortMapIndex) {
								return _columnValues [_columnSortMap [_sortMapIndex]] === _undefined;
							}
						;
						/*** for number and date columns, convert text values to numbers for more efficient sort ***/
							if (_columnIsDateOrNumber) {
								for (var _rowNo = -1; ++_rowNo < _rowsLength;) {
									if (!_skipRow (_rowNo))
										_columnValues [_rowNo] = _columnIsDate
											? +new Date (_columnValues [_rowNo])
											: +_columnValues [_rowNo].replace (/[^\d\.]/g,'')
									;
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
						if (_columnNo != _this._headingNoSorted) {
							if (_this._headingNoSorted != _null) {
								var _lastHeadingNoSorted = _this._headingNoSorted;
								_this._headingNoSorted = _null;
								_this._updateColumnUi (_lastHeadingNoSorted);
							}
							_this._headingNoSorted = _columnNo;
							_this._updateColumnUi (_columnNo);
						}
				}
			};

			_classPrototype.updateUi = function () {
				var _this = this;
				if (_this.isWired) {
					for (var _columnNo = -1; ++_columnNo < _this._headings.length;)
						_this._updateColumnUi (_columnNo)
					;
					_this._updateRowUi (_this._rowOver);
				}
			};

			_classPrototype.wireUi = function () {
				var _this = this;
				if (!_this.isWired) {
					/*** Initialize Instance Properties ***/
						_this._headings = [];
						_this._headingsOldClasses = [];
						_this._headingNoOver = _this._headingNoSorted = _this._rowOver = _null;
						_this._ascendingOrder = _true;

					var _table = _this.getNode ();
					if (_table) {
						var
							_tableBody = _getTableBody (_this.getNode ()),
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
											_this._headings = _rowCells;
											_this._headingsRowNo = _rowNo;
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
							_this._headingsRowNo = -1;
							_this._headings.length || _tryFindHeadings (_tableBodyRows);

						/*** wire up headings ***/
							Uize.forEach (
								_this._headings,
								function (_heading,_headingNo) {
									_this._headingsOldClasses [_headingNo] = _heading.className;
									_this.wireNode (
										_heading,
										{
											mouseover:function () {_this._headingMouseover (_headingNo)},
											mouseout:function () {_this._headingMouseout ()},
											click:function () {_this.sort (_headingNo)}
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
										_this._headings,
										function (_heading) {return _Uize_Node.getText (_heading)}
									),
									_wireRow = function (_row) {
										_row.Uize_Widget_TableSort_oldClassName = _row.className;
										_this.wireNode (
											_row,
											{
												mouseover:function () {_this._rowMouseover (_row)},
												mouseout:function () {_this._rowMouseout ()}
											}
										);
									}
								;
								++_rowNo < _tableBodyRowsLength;
							) {
								/* NOTE: conditionalized to skip over the headings row (if in table body) and any rows with too few cells */
								if (_rowNo != _this._headingsRowNo) {
									var
										_row = _tableBodyRows [_rowNo],
										_cells = _getRowCells (_row)
									;
									_cells.length == _this._headings.length && _wireRow (_row);
									for (var _cellNo = -1; ++_cellNo < _cells.length;) {
										if (
											_this._cellTooltipsByColumn && _cellNo in _this._cellTooltipsByColumn
												? _this._cellTooltipsByColumn [_cellNo]
												: _this._cellTooltips
										)
											_cells [_cellNo].title = _headingsText [_cellNo]
										;
									}
								}
							}
					}

					_superclass.prototype.wireUi.call (_this);
				}
			};

		/*** State Properties ***/
			var _updateUi = 'updateUi';
			_class.stateProperties ({
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
			});

		return _class;
	}
});

