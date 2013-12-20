/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Pagination Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2007-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 5
	codeCompleteness: 0
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

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					null,
					function () {
						var m = this;

						m._addChildButton('prev', function () { m._gotoPage(m._value - 1) } );
						m._addChildButton('next', function () { m._gotoPage(m._value + 1) } );
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

			_classPrototype._calculateMaxPages = function () { return Math.ceil(this._numResults / this._pageSize) };

			_classPrototype._calculatePagesStart = function () {
				var
					m = this,
					_value = m._value,
					_numPagesToShow = m._numPagesToShow,
					_maxPages = m._calculateMaxPages(),
					_minPagesStart = 1 + (m._showFirstPage && _value > 1), // i.e. if we're shhowing the first page we want to start at 2
					_maxPagesEnd = _maxPages - (m._showLastPage && _value < _maxPages),	// i.e. if we're showing the last page we want to end at the page before
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

			_classPrototype._gotoPage = function (_pageNumber) { this.set({_value:_pageNumber}) };

			_classPrototype._updatePages = function () {
				var
					m = this,
					_children = m.children,
					_value = m._value,
					_maxPages = m._calculateMaxPages(),
					_hasMultiplePages = _maxPages > 1,
					_numResults = m._numResults
				;

				if (m.isWired && m.getNode()) {
					m.displayNode('displayShell', _numResults > 0);
					m.displayNode('paginationShell', _hasMultiplePages);

					m.setNodeInnerHtml(
						'displayShell',
						m.localize(
							'displayInfo',
							{
								number:_formatNumber((_value - 1) * m._pageSize + 1),
								toNumber:_formatNumber(Math.min(_numResults, _value * m._pageSize)),
								total:m.localize('numResultsDisplay', {numResults:_formatNumber(_numResults)}) || _formatNumber(_numResults)
							}
						)
					);
					
					m.setNodeInnerHtml(
						'pageDisplay',
						m.localize(
							'pageDisplayInfo',
							{
								page:_formatNumber(_value),
								totalPages:_formatNumber(m.localize('numResultsDisplay', {numResults:_maxPages}) || _maxPages)
							}
						)
					);

					if (_hasMultiplePages) {
						var
							_display = function(_pageButtonName, _mustDisplay) {
								_children[_pageButtonName] &&
									_children[_pageButtonName].displayNode('', _mustDisplay);
							},
							_setText = function(_pageButtonName, _pageNumber) {
								_children[_pageButtonName] &&
									_children[_pageButtonName].set({text:_formatNumber(_pageNumber)});
							}
						;

						_display('prev', _value > 1);
						_display('next', _value < _maxPages);
						m._setEdgeButtons && _setText('first', 1);

						_display('first', _value > 1);
						_display('last', _value < _maxPages);
						m._setEdgeButtons && _setText('last', _maxPages);

						var _pagesStart = m._calculatePagesStart();

						m.displayNode('less', _pagesStart > (1 + m._showFirstPage));
						m.displayNode('more', (_pagesStart + m._numPagesToShow) < (_maxPages - m._showLastPage));

						for (var _pageNo = -1; ++_pageNo < m._numPagesToShow;) {
							var
								_pageName = 'page' + _pageNo,
								_pageLinkNode = _children[_pageName].getNode(),
								_pageNumber = _pagesStart + _pageNo,
								_isCurrentPage = _pageNumber == _value
							;

							_setText(
								_pageName,
								_isCurrentPage
									? m.localize('selectedPage', {page:_pageNumber}) || _pageNumber
									: _pageNumber
							);
							_display(_pageName, _pageNumber == _value || _pageNumber <= (_maxPages - m._showLastPage));
							Uize.Node.Classes.setState(_pageLinkNode, m._classSelected, _isCurrentPage);
						}
					}
				}
			};

		/*** Public Methods ***/
			_classPrototype.updateUi = function () {
				var m = this;

				if (m.isWired) {
					m._updatePages();
					_superclass.doMy (m,'updateUi');
				}
			};

			_classPrototype.wireUi = function() {
				var m = this;

				if (!m.isWired) {
					/*** Determine which page links exist ***/
						var
							_childExists = function(_childName) { return !!Uize.Node.getById(m.get('idPrefix') + '_' + _childName) },
							_addPageButton = function(_pageNo) {
								m._addChildButton(
									'page' + _pageNo,
									function() { m._gotoPage(m._calculatePagesStart() + _pageNo) }
								);
							}
						;

						m._showFirstPage = _childExists('first');
						m._showLastPage = _childExists('last');

						/** Calculate how many inner page linkss there are to show ***/
							m._numPagesToShow = -1;
							while (_childExists('page' + ++m._numPagesToShow));

					m._showFirstPage
						&& m._addChildButton('first', function () { m._gotoPage(1) } );
					m._showLastPage
						&& m._addChildButton('last', function () { m._gotoPage(m._calculateMaxPages()) } );


					for (var _pageNo = -1; ++_pageNo < m._numPagesToShow;)
						_addPageButton(_pageNo)
					;

					_superclass.doMy (m,'wireUi');
				}
			};

		/*** State Properties ***/
			_class.stateProperties ({
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
					conformer:function (_newValue) {
						var _maxPages = this._calculateMaxPages();

						return _newValue ? (!_maxPages || _newValue < _maxPages ? Math.floor(_newValue) : _maxPages) : 1;
					},
					onChange:[
						function () {
							var m = this;
							
							if (m._urlBase && m.isWired)
								location.href = Uize.Url.resolve(
									m._urlBase,
									Uize.pairUp(m._urlParam, m._value)
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
