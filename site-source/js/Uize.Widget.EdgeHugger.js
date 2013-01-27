/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.EdgeHugger Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2009-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 3
	codeCompleteness: 100
	docCompleteness: 10
*/

/*?
	Introduction
		The =Uize.Widget.EdgeHugger= class...

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widget.EdgeHugger',
	required:[
		'Uize.Fx',
		'Uize.Fade',
		'Uize.Cookie',
		'Uize.Node'
	],
	builder:function (_superclass) {
		'use string';

		/*** Variables for Scruncher Optimization ***/
			var
				_true = true,
				_false = false,
				_undefined
			;

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (),
				_classPrototype = _class.prototype
			;

		/*** Private Instance Methods ***/
			_classPrototype._fadeToNewState = function (_suppressFade) {
				var
					_this = this,
					_edge = _this._edge,
					_dimName = _edge == 'left' || _edge == 'right' ? 'width' : 'height',
					_fadeProperties = Uize.copyInto ({},_this._fadeProperties,_suppressFade ? {duration:0} : null),
					_maximized = _this._maximized,
					_lastMaximized = _this._lastMaximized
				;
				function _fadePanelNode (_maximized,_revealed) {
					var _panelNode = _maximized ? 'maximized' : 'minimized';
					_this.setNodeStyle (_panelNode,Uize.pairUp (_edge,-50000));
					_this.displayNode (_panelNode,true);

					return Uize.Fx.fadeStyle (
						_this.getNode (_panelNode),
						Uize.pairUp (
							_edge,
							-_this.get (_panelNode + 'Height') || -Uize.Node.getCoords (_this.getNode (_panelNode)) [_dimName]
						),
						Uize.pairUp (_edge,0),
						0,
						Uize.copyInto (_fadeProperties,{reverse:!_revealed})
					);
				}
				function _fadeInNewPanelNode () {
					_fadePanelNode (_maximized,_true);
				}
				_lastMaximized != _undefined
					? _fadePanelNode (_lastMaximized,_false)
						.wire (
							'Done',
							function () {
								_this.displayNode (_lastMaximized ? 'maximized' : 'minimized',_false);
								_fadeInNewPanelNode ();
							}
						)
					: _fadeInNewPanelNode ()
				;
				_this._lastMaximized = _maximized;
				/*?
					Implied Nodes
						maximized Implied Node
							.

						minimized
							.
				*/
			};

			_classPrototype._updateCookie = function () {
				var _this = this;
				_this._cookieName &&
					Uize.Cookie.setCookie (_this._cookieName,_this._contentId + '|' + +_this._maximized,_this._cookiePath)
				;
			};

		/*** Public Instance Methods ***/
			_classPrototype.wireUi = function () {
				var _this = this;
				if (!_this.isWired) {
					var _mustFade = _this._whenToFadeOnInit == 'always';

					/*** read cookie, if configured to store state in cookie ***/
						if (_this._cookieName) {
							var
								_cookieValue = Uize.Cookie.getCookie (_this._cookieName),
								_cookieValueParts = _cookieValue.split ('|'),
								_maximizedFromCookie = _cookieValueParts [1] != '0'
							;
							if (!_cookieValue || _cookieValueParts [0] != _this._contentId) {
								_maximizedFromCookie = _true;
								_mustFade = _this._whenToFadeOnInit != 'never';
							}
							_this.set ({_maximized:_maximizedFromCookie});
							_this._updateCookie ();
						}

					/*** wire links for maximizing / minimizing ***/
						_this.wireNode (
							'maximize',
							'click',
							function () {_this.set ({_maximized:_true})}
							/*?
								Implied Nodes
									maximize
										.
							*/
						);
						_this.wireNode (
							'minimize',
							'click',
							function () {_this.set ({_maximized:_false})}
							/*?
								Implied Nodes
									minimize
										.
							*/
						);

					_superclass.prototype.wireUi.call (_this);

					/*** workaround for IE6's lack of support for fixed positioning ***/
						if (navigator.appVersion.indexOf ('MSIE 6') > -1) {
							function _updateRootNodePositionForIe6 () {
								var _windowCoords = Uize.Node.getCoords (window);
								_this.setNodeStyle (
									'',
									{
										left:_windowCoords [_this._edge == 'right' ? 'right' : 'left'],
										top:_windowCoords [_this._edge == 'bottom' ? 'bottom' : 'top']
									}
								);
							}
							_this.globalizeNode ('');
							_this.setNodeStyle ('',{left:'',top:'',right:'',bottom:''});
							_updateRootNodePositionForIe6 ();
							_this.wireNode (
								window,
								{
									scroll:_updateRootNodePositionForIe6,
									resize:_updateRootNodePositionForIe6
								}
							);
						}

					/*** reveal appropriate panel node ***/
						_this._fadeToNewState (!_mustFade);
				}
			};

		/*** State Properties ***/
			_class.stateProperties ({
				_contentId:{
					name:'contentId',
					value:''
					/*?
						State Properties
							contentId
								.
					*/
				},
				_cookieName:'cookieName',
					/*?
						State Properties
							cookieName
								.
					*/
				_cookiePath:{
					name:'cookiePath',
					value:'/'
					/*?
						State Properties
							cookiePath
								.
					*/
				},
				_edge:{
					name:'edge',
					value:'bottom' // 'top' | 'bottom' | 'left' | 'right'
					/*?
						State Properties
							edge
								.
					*/
				},
				_fadeProperties:{
					name:'fadeProperties',
					value:{duration:200,curve:Uize.Fade.celeration (0,1)}
					/*?
						State Properties
							fadeProperties
								.
					*/
				},
				_maximized:{
					name:'maximized',
					onChange:function () {
						var _this = this;
						if (_this.isWired) {
							_this._updateCookie ();
							_this._fadeToNewState ();
						}
					},
					value:_true
					/*?
						State Properties
							maximized
								.
					*/
				},
				_maximizedHeight:'maximizedHeight',
					/*?
						State Properties
							maximizedHeight
								.
					*/
				_minimizedHeight:'minimizedHeight',
					/*?
						State Properties
							minimizedHeight
								.
					*/
				_whenToFadeOnInit:{
					name:'whenToFadeOnInit',
					value:'first' // 'first' | 'always' | 'never'
					/*?
						State Properties
							whenToFadeOnInit
								.
					*/
				}
			});

		return _class;
	}
});

