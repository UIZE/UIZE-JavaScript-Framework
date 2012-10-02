/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Pagination Class
|   /    / /    |    AUTHOR : Jan Borgersen, Chris van Rensburg (original code donated by Zazzle Inc.)
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2005-2012 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*ScruncherSettings Mappings="=c" LineCompacting="TRUE"*/

/*
	TODO
		- pages that aren't NEXT or PREV links
*/

Uize.module ({
	name:'Uize.Widget.Pagination',
	required:'Uize.Widget.Population',
	builder:function (_superclass) {
		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					function () {window [this.instanceId] = this}
				),
				_classPrototype = _class.prototype
			;

		/*** Public Instance Methods ***/
			_classPrototype.getCurrentPage = function () { return +this._currentPage };
			_classPrototype.previous = function () { this.goToPage( this._currentPage - 1 )  };
			_classPrototype.next = function () {this.goToPage( +this._currentPage + 1 ) };

			_classPrototype.goToPage = function ( _page, _forceUpdate ) {
				var _this = this;
				_page = Uize.constrain (_page,1,_this._maxPages);

				if ( _page != _this._currentPage || _forceUpdate === true) {
					_this.set ({_currentPage:_page});
					_this.updateUi();
				}
			};

			_classPrototype.clicked = function ( _node ) {
				this.set ({_pageUrl:_node.href});
				this.fire('Updated');
			};

			_classPrototype.updateUi = function () {
				var _this = this;
				if( _this.isWired ) {
					var
						_pageLinks = '',
						_currentPage = _this._currentPage,
						_numPagesToShow = _this._numPagesToShow,
						_startIndex = Math.max( 1, _currentPage - (_numPagesToShow >> 1) ),
						_endIndex = _this._maxPages
					;
					// fix start and end indexes
					if( _startIndex + _numPagesToShow - 1 > _endIndex ) {
						_startIndex = Math.max (1,_endIndex - _numPagesToShow + 1);
					} else {
						_endIndex = _startIndex + _numPagesToShow - 1;
					}
					function _createPageLink( _pageNo ) {
						return (
							_pageNo == _currentPage
								? ("<span class='" + _this._currentClass + "'>" + _pageNo + "</span>")
								: (
									"<a href='' onclick='" + _this.instanceId + ".goToPage(" + _pageNo + ");return false;' class='" + _this._linkClass + "'>" + _pageNo + "</a>"
								)
						);
					}
					// always show page 1
					if( _startIndex > 1 ) {
						_pageLinks += _createPageLink( 1 );
						if( _startIndex > 2 )
							_pageLinks += "<span class='elipsis'>&hellip;</span>"
						;
					}
					// show our target range
					for( var _index = _startIndex; _index <= _endIndex; _index++ )
						_pageLinks += _createPageLink( _index )
					;
					// always show the last page
					if( _endIndex < _this._maxPages-1 )
						_pageLinks += "<span class='elipsis'>&hellip;</span>"
					;
					if( _endIndex < _this._maxPages )
						_pageLinks += _createPageLink( _this._maxPages )
					;

					for( _controlNo = 0; _controlNo < _this._idPrefixes.length; _controlNo++ ) {
						var _population = _this._populations[ _controlNo ];
						_population.set({
							enabled:true,
							items:[
								{
									prevLink:'',
									prevLinkClass:_currentPage == 1 ? "disabled" : "",
									prevLinkOnclick:_this.instanceId+".previous();",
									nextLink:'',
									nextLinkClass:_currentPage == _this._maxPages ? "disabled" : "",
									nextLinkOnclick:_this.instanceId+".next();",
									pageLinks:_pageLinks,
									id:_this._idPrefixes[ _controlNo ]
								}
							]
						});
						//do not show the pagination controls if there is one and only one page of results
						_this.displayNode( _population.get( 'container' ), _startIndex < _endIndex );
					}
					_this.fire('Updated');
				}
			};

			_classPrototype.wireUi = function () {
				var _this = this;
				if ( !_this.isWired ) {

					var
						_populations = _this._populations = [],
						_properties = {
							enabled:false,
							templateStr:_this._template,
							templateItem:{
								id:"##id##",
								prevLink:"##prevLink##",
								prevLinkClass:"##prevLinkClass##",
								prevLinkOnclick:"previous();",
								nextLink:"##nextLink##",
								nextLinkClass:"##nextLinkClass##",
								nextLinkOnclick:"next();",
								pageLinks:"##pageLinks##"
							}
						}
					;
					for( var _idPrefixNo = 0; _idPrefixNo < _this._idPrefixes.length; _idPrefixNo++ ) {
						_properties.container = _this._idPrefixes[ _idPrefixNo ];
						(_populations[ _idPrefixNo ] = Uize.Widget.Population(_properties)).wireUi ();
					}

					_superclass.prototype.wireUi.call (_this);
				}
			};

		/*** Register Properties ***/
			_class.registerProperties ({
				_pageUrl:{
					name:'pageUrl',
					value:''
				},
				_template:{
					name:'template',
					value:''
				},
				_linkClass:{
					name:'linkClass',
					value:'pageLink'
				},
				_currentClass:{
					name:'currentClass',
					value:'current'
				},
				_idPrefixes:{
					name:'idPrefixes',
					value:[]
				},
				_currentPage:{
					name:'currentPage',
					value:1
				},
				_numPagesToShow:{
					name:'numPagesToShow',
					value:10
				},
				_maxPages:{
					name:'maxPages',
					value:1
				}
			});

		return _class;
	}
});

