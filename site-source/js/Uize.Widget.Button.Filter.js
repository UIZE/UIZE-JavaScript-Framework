/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Button.Filter Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 7
	codeCompleteness: 100
	docCompleteness: 0
*/

/*?
	Introduction
		The =Uize.Widget.Button.Filter= widget provides functionality for a filter button within a =Uize.Widget.Options.FilterGroup= widget.

		*DEVELOPERS:* `Ben Ilegbodu`
*/

Uize.module ({
	name:'Uize.Widget.Button.Filter',
	required:'Uize.Node.Classes',
	builder:function (_superclass) {
		'use strict';

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					null,
					function() {
						var
							_this = this,
							_updateUiDisplayState = function() { _this._updateUiDisplayState() }
						;

						_this.wire({
							'Changed.enabledInherited':_updateUiDisplayState,
							'Changed.selected':_updateUiDisplayState
						});
					}
				),
				_classPrototype = _class.prototype
			;

		/*** Private Instance Methods ***/
			_classPrototype._updateUiLabel = function() {
				var _this = this;

				if (_this.isWired) {
					var
						_label = _this._label,
						_labelWithCount = _this.localize(
							'filterWithCount',
							{
								filterLabel:_label,
								count:_this._count
							}
						)
					;

					_this.set({
						text:_this._showCount && _labelWithCount
							? _labelWithCount
							: _label
					});
				}
			};

			_classPrototype._updateUiDisplayState = function() {
				var _this = this;

				if (_this.isWired) {
					var
						_Uize_Node_Classes = Uize.Node.Classes,
						_rootNode = _this.getNode()
					;

					_Uize_Node_Classes.setState(
						_rootNode,
						['', _this._cssClassFeatured],
						_this._featured
					);
					_Uize_Node_Classes.setState(
						_rootNode,
						['', _this._cssClassDisabled],
						!_this.get('enabledInherited')
					);
					_Uize_Node_Classes.setState(
						_rootNode,
						['', _this._cssClassSelected],
						_this.get('selected')
					);
				}
			};

		/*** Public Instance Methods ***/
			_classPrototype.updateUi = function () {
				var _this = this;
				if (_this.isWired) {
					_this._updateUiLabel();
					_this._updateUiDisplayState();
					_superclass.prototype.updateUi.call (_this);
				}
			};

		/*** State Properties ***/
			_class.stateProperties ({
				_count:{
					name:'count',
					onChange:_classPrototype._updateUiLabel
				},
				_cssClassDisabled:{
					name:'cssClassDisabled',
					onChange:_classPrototype._updateUiDisplayState,
					value:''
				},
				_cssClassFeatured:{
					name:'cssClassFeatured',
					onChange:_classPrototype._updateUiDisplayState,
					value:''
				},
				_cssClassSelected:{
					name:'cssClassSelected',
					onChange:_classPrototype._updateUiDisplayState,
					value:''
				},
				_featured:{
					name:'featured',
					onChange:_classPrototype._updateUiDisplayState
				},
				_label:{
					name:'label',
					onChange:_classPrototype._updateUiLabel
				},
				_showCount:{
					name:'showCount',
					onChange:_classPrototype._updateUiLabel
				}
			});

		return _class;
	}
});

