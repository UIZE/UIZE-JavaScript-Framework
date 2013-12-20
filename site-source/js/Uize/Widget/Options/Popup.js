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
							m = this,
							_popupPalette = m._popupPalette = m.addChild (
								'popupPalette',Uize.Widget.PopupPalette,{idPrefixConstruction:'same as parent'}
							)
						;
						_popupPalette.fade.set ({duration:0});
						_popupPalette.wire (
							'Palette Shown',
							function () {
								if (m.get ('valueNo') > -1) {
									/* IMPORTANT:
										- code can be optimized, and perhaps shouldn't always set scrollTop (depends on viewport dims?)
										- code makes assumption about HTML nodes used in implementation of option buttons
									*/
									var _selectedOptionNode = m._getSelectedOptionNode ();
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

						m.wire('Changed.value', function () { m.updateUi() });
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
				var m = this;
				if (m.isWired) {
					_superclass.doMy (m,'updateUi');
					m._popupPalette.updateUi ();
					var _selector = m._popupPalette.children.selector;
					/* NOTE: need to investigate why it's not initially safe to assume that the selector widget exists -- may have something to do with a non-standard wireUi sequence for this code */
					_selector && _selector.set ({enabled:m.get ('values').length > 1 ? 'inherit' : false});
					m.setNodeInnerHtml ('label',Uize.Node.getText (m._getSelectedOptionNode ()) || m._emptyLabel);
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

