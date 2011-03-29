/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Options.Accordion Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2007-2011 UIZE
|           |__ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*ScruncherSettings Mappings="=d" LineCompacting="TRUE"*/

/* Module Meta Data
	type: Class
	importance: 4
	codeCompleteness: 100
	testCompleteness: 0
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Widget.Options.Accordion= class extends its superclass by adding an accordion style behavior for revealing the contents of the selected tab.

		*DEVELOPERS:* `Jan Borgersen`
*/

Uize.module ({
	name:'Uize.Widget.Options.Accordion',
	required:[
		'Uize.Node',
		'Uize.Fade'
	],
	builder:function (_superclass) {
		/*** Variables for Scruncher Optimization ***/
			var
				_true = true,
				_false = false,
				_null = null,
				_Uize_Node = Uize.Node
			;

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					_null,
					function () {
						var _this = this;

						/*** Private Instance Properties ***/
							_this.fade = new Uize.Fade ({
								curve:Uize.Fade.celeration (0,1),
								duration:500
							});
					}
				),
				_classPrototype = _class.prototype
			;

		/*** Private Instance Methods ***/
			_classPrototype._resolveToValueNo = function (_valueOrValueNo) {
				return Uize.isNumber (_valueOrValueNo) ? _valueOrValueNo : this.getValueNoFromValue (_valueOrValueNo);
			};

			_classPrototype._getTabBodyNode = function (_valueOrValueNo) {
				return this.getNode ('option' + this._resolveToValueNo (_valueOrValueNo) + 'TabBody');
			};

			_classPrototype._updateUiOptionToggle = function(_optionNo, _isVisible) {
				var
					_optionButton = this.getOptionButton( _optionNo ),
					_toggleNode = _optionButton.getNode('toggle'),
					_toggleParentNode = _toggleNode ? _toggleNode.parentNode : _null,
					_toggleParentNodeDimensions = _toggleParentNode ? _Uize_Node.getDimensions(_toggleParentNode) : _null
				;
				_toggleNode &&
					this.setNodeStyle(_toggleNode, {top:_isVisible ? -_toggleParentNodeDimensions.height : 0})
				;
			};

			_classPrototype._updateUiTabBodies = function (_showAnimation) {
				var
					_this = this,
					_valueNo = _this.get('valueNo'),
					_buttonHeights = _this._buttonHeights,
					_buttonHeightsLength = _buttonHeights.length,
					_top = 0
				;
				if( _showAnimation ) {
					if( _valueNo != _this._lastShownTabBodyNo ) {
						_this.fade.stop();
						_this._growingNode = _this._getTabBodyNode( _valueNo );
						_this._shrinkingNode = _this._getTabBodyNode( _this._lastShownTabBodyNo );

						for (var _tabNo = -1; ++_tabNo < _buttonHeightsLength;) {
							_this.displayNode( _this._getTabBodyNode(_tabNo), (_tabNo == _valueNo || _tabNo == _this._lastShownTabBodyNo) );
							_this._updateUiOptionToggle(_tabNo, _valueNo == _tabNo);
						}

						_this.setNodeStyle(_this._growingNode, {height:1});
						_this.setNodeStyle(_this._shrinkingNode,{height:_this._maxTabHeight});
						_this.fade.start();
					}
				} else {
					for (var _tabNo = -1; ++_tabNo < _buttonHeightsLength;) {
						var _tabNode = _this._getTabBodyNode( _tabNo );
						_this.getOptionButton( _tabNo ).setNodeStyle('',{top:_top});
						_top += _buttonHeights[ _tabNo ];
						if( _valueNo == _tabNo ) {
							_this.displayNode(_tabNode);
							_this.setNodeStyle(_tabNode,{top:_top,height:_this._maxTabHeight});
							_top += _this._maxTabHeight;
						} else {
							_this.displayNode(_tabNode,_false);
						}
						_this._updateUiOptionToggle(_tabNo, _valueNo == _tabNo);
					}
				}
			};

		/*** Public Instance Methods ***/
			_classPrototype.getOptionButton = function (_valueOrValueNo) {
				return this.children ['option' + this._resolveToValueNo (_valueOrValueNo)];
			};

			_classPrototype.tabExists = function (_valueOrValueNo) {
				var _optionButton = this.getOptionButton (_valueOrValueNo);
				return (
					_optionButton && (_optionButton.getNode () || this._getTabBodyNode (_valueOrValueNo))
						? true
						: false
				);
			};

			_classPrototype.wireUi = function () {
				var _this = this;
				if (!_this.isWired) {
					_superclass.prototype.wireUi.call (_this);

					/*** grab explicit heights and set absolute positioning ***/
						var
							_values = _this.get('values'),
							_shellHeight = _Uize_Node.getCoords( _this.getNode() ).height,
							_totalButtonHeights = 0
						;
						_this._buttonHeights = [];
						for (
							var _valueNo = -1, _values = _this.get ('values'), _valuesLength = _values.length;
							++_valueNo < _valuesLength;
						) {
							var
								_buttonNode = _this.getOptionButton(_valueNo).getNode(),
								_tabNode = _this._getTabBodyNode( _valueNo )
							;
							_this._buttonHeights[ _valueNo ] = _Uize_Node.getCoords( _buttonNode ).height;
							_totalButtonHeights += _this._buttonHeights[ _valueNo ];
							_this.setNodeStyle([_buttonNode,_tabNode],{position:'absolute'/*,overflow:'hidden'*/});
						}
						_this._maxTabHeight = _shellHeight - _totalButtonHeights;

					/*** setup ui ***/
						_this._growingTab = _this._shrinkingTab = _null;
						if( _this.get ('valueNo') < 0 )
							_this.set({valueNo:0})
						;
						_this._lastShownTabBodyNo = _this.get ('valueNo');

						_this.fade.set ({
							startValue:0,
							endValue:_this._maxTabHeight
						});

						var _growingNodeOverflow, _shrinkingNodeOverflow;

						_this.fade.wire ({
							Start:function() {
								_growingNodeOverflow = _this.getNodeStyle(_this._growingNode, 'overflow');
								_shrinkingNodeOverflow = _this.getNodeStyle(_this._shrinkingNode, 'overflow');

								_this.setNodeStyle(_this._growingNode, {overflow:'hidden'});
								_this.setNodeStyle(_this._shrinkingNode, {overflow:'hidden'});
							},
							'Changed.value':function () {
								var
									_valueNo = _this.get('valueNo'),
									_top = 0,
									_growingValue = +_this.fade,
									_shrinkingValue = _this._maxTabHeight - _growingValue
								;
								// first set heights
								_this.setNodeStyle(_this._growingNode,{height:_growingValue});
								_this.setNodeStyle(_this._shrinkingNode,{height:_shrinkingValue});
								// then adjust positions
								for(
									var
										_tabNo = -1,
										_buttonHeights = _this._buttonHeights,
										_buttonHeightsLength = _buttonHeights.length
									;
									++_tabNo < _buttonHeightsLength;
								) {
									_this.getOptionButton( _tabNo ).setNodeStyle('', {top:_top});
									_top += _buttonHeights[ _tabNo ];

									if( _tabNo == _valueNo ) { // growing
										_this.setNodeStyle(_this._growingNode,{top:_top});
										_top += _growingValue;
									} else if( _tabNo == _this._lastShownTabBodyNo ) { // shrinking
										_this.setNodeStyle(_this._shrinkingNode,{top:_top});
										_top += _shrinkingValue;
									}
								}
							},
							Done:function () {
								_this.displayNode(_this._shrinkingNode, _false);
								_this.setNodeStyle(_this._growingNode, {overflow:_growingNodeOverflow});
								_this.setNodeStyle(_this._shrinkingNode, {overflow:_shrinkingNodeOverflow});
								_this._lastShownTabBodyNo = _this.get('valueNo');
							}
						});

						_this.wire ('Changed.value',function () {
							_this._updateUiTabBodies (_true);
						});

						_this._updateUiTabBodies (_false);
				}
			};

		return _class;
	}
});

