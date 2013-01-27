/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Tree.Select Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2005-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 1
	codeCompleteness: 90
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Widget.Tree.Select= class extends its superclass by adding support for selecting options from a hierarchical tree using regular select tags.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widget.Tree.Select',
	required:'Uize.Node',
	builder:function (_superclass) {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_null = null,
				_true = true,
				_false = false
			;

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					function (_properties) {
						var _this = this;

						/*** Private Instance Properties ***/
							_this._levels = _null;
							_this._totalLevels = 0;
							_this._selectionComplete = _false;

						/*** handle change in items ***/
							_this.wire (
								'Changed.items',
								function () {
									function _burrowDeeper (_item,_currentDepth) {
										_this._totalLevels = Math.max (_this._totalLevels,_currentDepth);
										if (_class.itemHasChildren (_item)) {
											for (
												var _itemNo = -1, _itemItems = _item.items, _itemItemsLength = _itemItems.length;
												++_itemNo < _itemItemsLength;
											)
												_burrowDeeper (_itemItems [_itemNo],_currentDepth + 1)
											;
										}
									}
									var _rootItem = {items:_this.get ('items')};
									_this._levels = [[_rootItem]];
									_this._totalLevels = 0;
									_burrowDeeper (_rootItem,0);
									_this._updateUi ();
									_this._onItemSelected (0);
								}
							);
					}
				),
				_classPrototype = _class.prototype
			;

		/*** Private Instance Methods ***/
			_classPrototype._updateUi = function () {
				var _this = this;
				if (_this.isWired) {
					for (var _levelNo = 0; ++_levelNo <= _this._maxLevels;)
						_this.displayNode ('level' + _levelNo,_levelNo <= _this._totalLevels)
					;
				}
			};

			_classPrototype._onItemSelected = function (_thisLevelNo) {
				var _this = this;
				if (_this.isWired) {
					var
						_thisLevel = _this._levels [_thisLevelNo],
						_thisSelect = _this.getNode ('level' + _thisLevelNo),
						_nextLevelNo = _thisLevelNo + 1,
						_enableSelect = function (_select,_mustEnable) {
							_select.disabled = !_mustEnable;
							_this.displayNode (_select,_mustEnable || _this._displayDisabledSelects);
						}
					;
					for (var _levelNo = _nextLevelNo - 1; ++_levelNo <= _this._totalLevels;) {
						var _select = _this.getNode ('level' + _levelNo);
						_select.options.length = 0;
						_enableSelect (_select,_false);
					}
					var
						_thisItemNo = _thisSelect ? _thisSelect.selectedIndex - 1 : 0,
						_itemSelected = _thisLevel [_thisItemNo],
						_itemSelectedHasChildren = _class.itemHasChildren (_itemSelected),
						_selectionComplete = _thisItemNo > -1 && !_itemSelectedHasChildren
					;
					_this.setNodeProperties ('submitButton',{disabled:!_selectionComplete});
					if (_itemSelectedHasChildren) {
						/* populate values for the next level's select box */
						_this._levels.length = _nextLevelNo + 1;
						_this._levels [_nextLevelNo] = _itemSelected.items;
						var
							_nextSelect = _this.getNode ('level' + _nextLevelNo),
							_addOption = function (_optionText) {
								_nextSelect.options [_nextSelect.options.length] = new Option (_optionText);
							}
						;
						_addOption (_this._chooseText);
						Uize.forEach (_itemSelected.items,function (_item) {_addOption (_item.title)});
						_enableSelect (_nextSelect,_true);
					}
					if (_selectionComplete != _this._selectionComplete) {
						_this.fire ('Selection ' + (_selectionComplete ? 'Complete' : 'Incomplete'));
						_this._selectionComplete = _selectionComplete;
					}
				}
			};

		/*** Public Instance Methods ***/
			_classPrototype.updateUi = _classPrototype._updateUi;

			_classPrototype.wireUi = function () {
				var _this = this;
				if (!_this.isWired) {
					for (
						var
							_levelNo = 0,
							_getOnItemSelectedHandler = function (_levelNo) {
								return function () {_this._onItemSelected (_levelNo)};
							}
						;
						++_levelNo <= _this._maxLevels;
					)
						_this.wireNode ('level' + _levelNo,'change',_getOnItemSelectedHandler (_levelNo))
					;

					_superclass.prototype.wireUi.call (_this);
					_this._onItemSelected (0);
				}
			};

		/*** State Properties ***/
			_class.stateProperties ({
				_displayDisabledSelects:{
					name:'displayDisabledSelects',
					value:_true
				},
				_chooseText:{
					name:'chooseText',
					value:'--- SELECT ONE ---'
				},
				_maxLevels:{
					name:'maxLevels',
					value:20
				}
			});

		return _class;
	}
});

