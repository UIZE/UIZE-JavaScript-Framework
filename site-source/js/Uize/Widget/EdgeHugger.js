/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.EdgeHugger Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2009-2016 UIZE
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
		'Uize.Util.Browser.Cookies',
		'Uize.Dom.Pos'
	],
	builder:function (_superclass) {
		'use string';

		var
			/*** Variables for Scruncher Optimization ***/
				_true = true,
				_false = false,
				_undefined
		;

		/*** Private Instance Methods ***/
			function _fadeToNewState (m,_suppressFade) {
				var
					_edge = m._edge,
					_dimName = _edge == 'left' || _edge == 'right' ? 'width' : 'height',
					_fadeProperties = Uize.copy (m._fadeProperties,_suppressFade ? {duration:0} : null),
					_maximized = m._maximized,
					_lastMaximized = m._lastMaximized
				;
				function _fadePanelNode (_maximized,_revealed) {
					var _panelNode = _maximized ? 'maximized' : 'minimized';
					m.setNodeStyle (_panelNode,Uize.pairUp (_edge,-50000));
					m.displayNode (_panelNode,true);

					return Uize.Fx.fadeStyle (
						m.getNode (_panelNode),
						Uize.pairUp (
							_edge,
							-m.get (_panelNode + 'Height') || -Uize.Dom.Pos.getCoords (m.getNode (_panelNode)) [_dimName]
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
								m.displayNode (_lastMaximized ? 'maximized' : 'minimized',_false);
								_fadeInNewPanelNode ();
							}
						)
					: _fadeInNewPanelNode ()
				;
				m._lastMaximized = _maximized;
				/*?
					DOM Nodes
						maximized DOM Node
							.

						minimized
							.
				*/
			}

			function _updateCookie (m) {
				m._cookieName &&
					Uize.Util.Browser.Cookies.setCookie (m._cookieName,m._contentId + '|' + +m._maximized,m._cookiePath)
				;
			}

		return _superclass.subclass ({
			instanceMethods:{
				wireUi:function () {
					var m = this;
					if (!m.isWired) {
						var _mustFade = m._whenToFadeOnInit == 'always';

						/*** read cookie, if configured to store state in cookie ***/
							if (m._cookieName) {
								var
									_cookieValue = Uize.Util.Browser.Cookies.getCookie (m._cookieName),
									_cookieValueParts = _cookieValue.split ('|'),
									_maximizedFromCookie = _cookieValueParts [1] != '0'
								;
								if (!_cookieValue || _cookieValueParts [0] != m._contentId) {
									_maximizedFromCookie = _true;
									_mustFade = m._whenToFadeOnInit != 'never';
								}
								m.set ({_maximized:_maximizedFromCookie});
								_updateCookie (m);
							}

						/*** wire links for maximizing / minimizing ***/
							m.wireNode (
								'maximize',
								'click',
								function () {m.set ({_maximized:_true})}
								/*?
									DOM Nodes
										maximize
											.
								*/
							);
							m.wireNode (
								'minimize',
								'click',
								function () {m.set ({_maximized:_false})}
								/*?
									DOM Nodes
										minimize
											.
								*/
							);

						_superclass.doMy (m,'wireUi');

						/*** workaround for IE6's lack of support for fixed positioning ***/
							if (navigator.appVersion.indexOf ('MSIE 6') > -1) {
								function _updateRootNodePositionForIe6 () {
									var _windowCoords = Uize.Dom.Pos.getCoords (window);
									m.setNodeStyle (
										'',
										{
											left:_windowCoords [m._edge == 'right' ? 'right' : 'left'],
											top:_windowCoords [m._edge == 'bottom' ? 'bottom' : 'top']
										}
									);
								}
								m.globalizeNode ('');
								m.setNodeStyle ('',{left:'',top:'',right:'',bottom:''});
								_updateRootNodePositionForIe6 ();
								m.wireNode (
									window,
									{
										scroll:_updateRootNodePositionForIe6,
										resize:_updateRootNodePositionForIe6
									}
								);
							}

						/*** reveal appropriate panel node ***/
							_fadeToNewState (m,!_mustFade);
					}
				}
			},

			stateProperties:{
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
						var m = this;
						if (m.isWired) {
							_updateCookie (m);
							_fadeToNewState (m);
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
			}
		});
	}
});

