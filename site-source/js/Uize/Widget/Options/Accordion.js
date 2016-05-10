/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Options.Accordion Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2007-2016 UIZE
|           |__ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 2
	codeCompleteness: 100
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Widget.Options.Accordion= class extends its superclass by adding an accordion style behavior for revealing the contents of the selected tab.

		*DEVELOPERS:* `Ben Ilegbodu`, original code contributed by `Zazzle Inc.`
*/

Uize.module ({
	name:'Uize.Widget.Options.Accordion',
	required:[
		'Uize.Dom.Pos',
		'Uize.Fade'
	],
	builder:function (_superclass) {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_Uize = Uize,
				_getDimensions = _Uize.Dom.Pos.getDimensions,
				_Uize_Fade = _Uize.Fade
		;

		/*** Private Instance Methods ***/
			function _resolveToValueNo (m,_valueOrValueNo) {
				return _Uize.isNumber (_valueOrValueNo) ? _valueOrValueNo : m.getValueNoFromValue (_valueOrValueNo)
			}

			function _getTabBodyNode (m,_valueOrValueNo) {
				return m.getNode ('option' + _resolveToValueNo (m,_valueOrValueNo) + 'TabBody')
			}

			function _updateUiTabBodies (m) {
				var
					_previousTabNo = m._previousTabNo,
					_newTabNo = m.get('valueNo')
				;

				if (m.isWired) {
					if (_newTabNo > -1 && _newTabNo != _previousTabNo) {
						var
							_newTabBodyNode = _getTabBodyNode(m, _newTabNo),
							_newTabBodyNodeStyleHeight = m.getNodeStyle(_newTabBodyNode, 'height')
						;

						m.setNodeStyle(
							_newTabBodyNode,
							{
								display:'block',
								height:'auto',
								position:'absolute',
								visibility:'visible'
							}
						);

						var
							// If an explicit height is set then we want that to be the max value not the calculated
							// height. That way you can still have fixed height accordions
							_newTabHeight = parseInt(_newTabBodyNodeStyleHeight) || _getDimensions(_newTabBodyNode).height
						;

						_newTabHeight
							&& m.fade.start({
								curve:m._animationCurve || _Uize_Fade.celeration (0,1),
								duration:m._animationDuration,
								startValue:0,
								endValue:_newTabHeight
							})
						;
					}
					else
						m.forAll(
							function (_optionButton, _optionNo) {
								// hide all the tab bodies that should be hidden
								m.displayNode(
									_getTabBodyNode(m, _optionNo),
									_optionNo === _previousTabNo
								)
							}
						)
					;
				}
			}

		return _superclass.subclass ({
			omegastructor:function () {
				var
					m = this,
					_previousTabNodeHeight,
					_newTabNodeHeight
				;

				function _tabBodyStart(_tabNo) {
					m.isWired
						// prepare the node to animate its height by 1) making sure it's visible
						// and 2) it's in the flow of the container
						&& m.setNodeStyle(
							_getTabBodyNode(m,_tabNo),
							{
								display:'block',
								position:'relative',
								overflow:'hidden',
								visibility:'visible'
							}
						)
				}
				function _setTabBodyHeight(_tabNo, _height) {
					m.isWired
						&& m.setNodeStyle(
							_getTabBodyNode(m,_tabNo),
							{height:_height}
						)
				}
				function _tabBodyDone(_tabNo, _mustDisplay) {
					if (m.isWired) {
						var _tabBodyNode = _getTabBodyNode(m,_tabNo);

						m.displayNode(_tabBodyNode, _mustDisplay);

						// undo the explicit height & overflow we set
						m.setNodeStyle(
							_tabBodyNode,
							{
								height:'',
								overflow:''
							}
						);
					}
				}

				(m.fade = new _Uize_Fade).wire({
					Start:function () {
						_tabBodyStart(m._previousTabNo);
						_tabBodyStart(m.get('valueNo'));
						_previousTabNodeHeight = _getDimensions(_getTabBodyNode(m,m._previousTabNo)).height;
						_newTabNodeHeight = m.fade.get('endValue');
					},
					'Changed.value':function () {
						var _newHeight = +m.fade;

						// Since we have only one fade object, the previous tab body node height
						// needs to change inversely proportional to the change of the new tab body node
						_previousTabNodeHeight
							&& _setTabBodyHeight(
								m._previousTabNo,
								(1 - (_newHeight / _newTabNodeHeight)) * _previousTabNodeHeight
							)
						;
						_setTabBodyHeight(m.get('valueNo'), _newHeight);
					},
					Done:function () {
						var _newValueNo = m.get('valueNo');
						_tabBodyDone(m._previousTabNo, false);
						_tabBodyDone(_newValueNo, true);
						m._previousTabNo = _newValueNo;
					}
				});

				m.wire ('Changed.valueNo',function () { _updateUiTabBodies(m) });
			},

			instanceMethods:{
				enableTab:function (_value,_mustEnable) {
					this.getOptionButton (_value).set ({enabled:_mustEnable ? 'inherit' : false});
					_updateUiTabBodies (this);
				},

				getOptionButton:function (_valueOrValueNo) {
					return this.children ['option' + _resolveToValueNo (this,_valueOrValueNo)]
				},

				tabExists:function (_valueOrValueNo) {
					var _optionButton = this.getOptionButton (_valueOrValueNo);
					return !!(_optionButton && (_optionButton.getNode () || _getTabBodyNode (this,_valueOrValueNo)));
				},

				updateUi:function () {
					var m = this;
					if (m.isWired) {
						var _rootNode = m.getNode();

						// Ensure that the root node is at least positioned relative
						m.getNodeStyle(_rootNode, 'position') == 'static'
							&& m.setNodeStyle(_rootNode, {position:'relative'})
						;

						_updateUiTabBodies(m);

						_superclass.doMy (m,'updateUi');
					}
				},

				wireUi:function () {
					var m = this;
					if (!m.isWired) {
						m._previousTabNo = m.get('valueNo');

						_superclass.doMy (m,'wireUi');
					}
				}
			},

			stateProperties:{
				_animationCurve:'animationCurve',
				_animationDuration:{
					name:'animationDuration',
					value:500
				}
			}
		});
	}
});
