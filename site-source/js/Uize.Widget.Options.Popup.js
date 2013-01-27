/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Options.Popup Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2007-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 3
	codeCompleteness: 100
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Widget.Options.Popup= widget lets the user click a button to bring up a popup palette, with a button-based option set for selecting an option.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widget.Options.Popup',
	required:'Uize.Widget.PopupPalette',
	builder:function (_superclass) {
		'use strict';

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					null,
					function () {
						var
							_this = this,
							_popupPalette = _this._popupPalette = _this.addChild (
								'popupPalette',Uize.Widget.PopupPalette,{idPrefixConstruction:'same as parent'}
							)
						;
						_popupPalette.fade.set ({duration:0});
						_popupPalette.wire (
							'Palette Shown',
							function () {
								if (_this.get ('valueNo') > -1) {
									/* IMPORTANT:
										- code can be optimized, and perhaps shouldn't always set scrollTop (depends on viewport dims?)
										- code makes assumption about HTML nodes used in implementation of option buttons
									*/
									var _selectedOptionNode = _this._getSelectedOptionNode ();
									_selectedOptionNode &&
										_popupPalette.setNodeProperties (
											'Palette',
											{
												scrollLeft:_selectedOptionNode.offsetLeft,
												scrollTop:_selectedOptionNode.offsetTop
											}
										)
									;
								}
							}
						);

						_this.wire('Changed.value', function() { _this.updateUi() });
					}
				),
				_classPrototype = _class.prototype
			;

		/*** Private Instance Methods ***/
			_classPrototype._getSelectedOptionNode = function () {
				var _selectedOption = this.children ['option' + this.get ('valueNo')];
				return _selectedOption ? _selectedOption.getNode () : null;
			};

		/*** Public Instance Methods ***/
			_classPrototype.updateUi = function () {
				var _this = this;
				if (_this.isWired) {
					_superclass.prototype.updateUi.call (_this);
					_this._popupPalette.updateUi ();
					var _selector = _this._popupPalette.children.selector;
					/* NOTE: need to investigate why it's not initially safe to assume that the selector widget exists -- may have something to do with a non-standard wireUi sequence for this code */
					_selector && _selector.set ({enabled:_this.get ('values').length > 1 ? 'inherit' : false});
					_this.setNodeInnerHtml ('label',Uize.Node.getText (_this._getSelectedOptionNode ()) || _this._emptyLabel);
				}
			};

		/*** State Properties ***/
			_class.stateProperties ({
				_emptyLabel:{
					name:'emptyLabel',
					value:''
				}
			});

		return _class;
	}
});

