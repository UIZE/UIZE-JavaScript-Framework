/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Pagination Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2007-2012 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 5
	codeCompleteness: 0
	testCompleteness: 0
	docCompleteness: 0
*/

/*?
	Introduction
		The =Uize.Widget.Pagination= class implements support for client-side pagination

		*DEVELOPERS:* `Ben Ilegbodu`

		The =Uize.Widget.Pagination= module defines the =Uize.Widget.Pagination= widget class, a subclass of =Uize.Widget=.
*/

Uize.module ({
	name:'Uize.Widget.Pagination',
	required:[
		'Uize.Widget.Button',
		'Uize.Node',
		'Uize.Node.Classes',
		'Uize.Url'
	],
	builder:function (_superclass) {
		'use strict';

		/*** Variables for Scruncher Optimization ***/

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					null,
					function() {
						var _this = this;

						_this._addChildButton('prev', function() { _this._gotoPage(_this._value - 1) } );
						_this._addChildButton('next', function() { _this._gotoPage(_this._value + 1) } );
					}
				),
				_classPrototype = _class.prototype,
				_formatNumber = function(_number) {
					var
						_numberString = _number + '',
						_numberStringLength = _numberString.length,
						_formattedStringBuilder = []
					;
					
					for (var _count = 0; ++_count <= _numberStringLength;) {
						_formattedStringBuilder.unshift(_numberString.charAt(_numberStringLength - _count));
						!(_count % 3)
							&& _count < _numberStringLength
							&& _formattedStringBuilder.unshift(',');
					}
					
					return _formattedStringBuilder.join('');
				}
			;

		/*** Private Methods ***/
			_classPrototype._addChildButton = Uize.Widget.Button.addChildButton;

			_classPrototype._calculateMaxPages = function() { return Math.ceil(this._numResults / this._pageSize) };

			_classPrototype._calculatePagesStart = function() {
				var
					_this = this,
					_value = _this._value,
					_numPagesToShow = _this._numPagesToShow,
					_maxPages = _this._calculateMaxPages(),
					_minPagesStart = 1 + (_this._showFirstPage && _value > 1), // i.e. if we're shhowing the first page we want to start at 2
					_maxPagesEnd = _maxPages - (_this._showLastPage && _value < _maxPages),	// i.e. if we're showing the last page we want to end at the page before
					_deltaFromCurrentPage = Math.ceil(_numPagesToShow / 2),
					_deltaLeft = _value - _deltaFromCurrentPage + 1,
					_deltaRight = _value + (_numPagesToShow - _deltaFromCurrentPage)
				;

				if (_deltaLeft >= _minPagesStart && _deltaRight <= _maxPagesEnd)
					return _deltaLeft;
				else if (_deltaLeft >= _minPagesStart)
					return Math.max(_minPagesStart, _maxPagesEnd - _numPagesToShow + 1);
				else
					return _minPagesStart;
			};

			_classPrototype._gotoPage = function(_pageNumber) { this.set({_value:_pageNumber}) };

			_classPrototype._updatePages = function() {
				var
					_this = this,
					_children = _this.children,
					_value = _this._value,
					_maxPages = _this._calculateMaxPages(),
					_hasMultiplePages = _maxPages > 1,
					_numResults = _this._numResults
				;

				if (_this.isWired && _this.getNode()) {
					_this.displayNode('displayShell', _numResults > 0);
					_this.displayNode('paginationShell', _hasMultiplePages);

					_this.setNodeInnerHtml(
						'displayShell',
						_this.localize(
							'displayInfo',
							{
								number:_formatNumber((_value - 1) * _this._pageSize + 1),
								toNumber:_formatNumber(Math.min(_numResults, _value * _this._pageSize)),
								total:_this.localize('numResultsDisplay', {numResults:_formatNumber(_numResults)}) || _formatNumber(_numResults)
							}
						)
					);
					
					_this.setNodeInnerHtml(
						'pageDisplay',
						_this.localize(
							'pageDisplayInfo',
							{
								page:_formatNumber(_value),
								totalPages:_formatNumber(_this.localize('numResultsDisplay', {numResults:_maxPages}) || _maxPages)
							}
						)
					);

					if (_hasMultiplePages) {
						var
							_display = function(_pageButtonName, _mustDisplay) {
								_children[_pageButtonName] &&
									_children[_pageButtonName].displayNode('', _mustDisplay)
							},
							_setText = function(_pageButtonName, _pageNumber) {
								_children[_pageButtonName] &&
									_children[_pageButtonName].set({text:_formatNumber(_pageNumber)})
							}
						;

						_display('prev', _value > 1);
						_display('next', _value < _maxPages);
						_this._setEdgeButtons && _setText('first', 1);

						_display('first', _value > 1);
						_display('last', _value < _maxPages);
						_this._setEdgeButtons && _setText('last', _maxPages);

						var _pagesStart = _this._calculatePagesStart();

						_this.displayNode('less', _pagesStart > (1 + _this._showFirstPage));
						_this.displayNode('more', (_pagesStart + _this._numPagesToShow) < (_maxPages - _this._showLastPage));

						for (var _pageNo = -1; ++_pageNo < _this._numPagesToShow;) {
							var
								_pageName = 'page' + _pageNo,
									_pageLinkNode = _children[_pageName].getNode(),
								_pageNumber = _pagesStart + _pageNo,
								_isCurrentPage = _pageNumber == _value
							;

							_setText(
								_pageName,
								_isCurrentPage
									? _this.localize('selectedPage', {page:_pageNumber}) || _pageNumber
									: _pageNumber
							);
							_display(_pageName, _pageNumber == _value || _pageNumber <= (_maxPages - _this._showLastPage));
								Uize.Node.Classes.setState(_pageLinkNode, _this._classSelected, _isCurrentPage);
						}
					}
				}
			};

		/*** Public Methods ***/
			_classPrototype.updateUi = function() {
				var _this = this;

				if (_this.isWired) {
					_this._updatePages();
					_superclass.prototype.updateUi.call(_this);
				}
			};

			_classPrototype.wireUi = function() {
				var _this = this;

				if (!_this.isWired) {
					/*** Determine which page links exist ***/
						var
							_childExists = function(_childName) { return !!Uize.Node.getById(_this.get('idPrefix') + '_' + _childName) },
							_addPageButton = function(_pageNo) {
								_this._addChildButton(
									'page' + _pageNo,
									function() { _this._gotoPage(_this._calculatePagesStart() + _pageNo) }
								)
							}
						;

						_this._showFirstPage = _childExists('first');
						_this._showLastPage = _childExists('last');

						/** Calculate how many inner page linkss there are to show ***/
							_this._numPagesToShow = -1;
							while (_childExists('page' + ++_this._numPagesToShow));

					_this._showFirstPage
						&& _this._addChildButton('first', function() { _this._gotoPage(1) } );
					_this._showLastPage
						&& _this._addChildButton('last', function() { _this._gotoPage(_this._calculateMaxPages()) } );


					for (var _pageNo = -1; ++_pageNo < _this._numPagesToShow;)
						_addPageButton(_pageNo)
					;

					_superclass.prototype.wireUi.call(_this);
				}
			};

		/*** Register Properties ***/
			_class.registerProperties ({
				_classSelected:{
					name:'classSelected',
					value:'selected'
				},
				_numResults:{
					name:'numResults',
					onChange:_classPrototype._updatePages
				},
				_pageSize:{
					name:'pageSize',
					conformer:function(_newPageSize) { return _newPageSize ? _newPageSize : 30 },
					onChange:_classPrototype._updatePages,
					value:30
				},
				_setEdgeButtons:{
					name:'setEdgeButtons',
					value:true
				},
				_thousandsSeparator:{
					name:'thousandsSeparator',
					onChange:_classPrototype._updatePages,
					value:','
				},
				_urlAnchor:'urlAnchor',
				_urlBase:'urlBase',
				_urlParam:{
					name:'urlParam',
					value:'pg'
				},
				_value:{
					name:'value',
					conformer:function(_newValue) {
						var _maxPages = this._calculateMaxPages();

						return _newValue ? (!_maxPages || _newValue < _maxPages ? Math.floor(_newValue) : _maxPages) : 1
					},
					onChange:[
						function() {
							var _this = this;
							
							if (_this._urlBase && _this.isWired)
								location.href = Uize.Url.resolve(
									_this._urlBase,
									Uize.pairUp(_this._urlParam, _this._value)
								)
							;
						},
						_classPrototype._updatePages
					],
					value:1
				}
			});

		return _class;
	}
});
