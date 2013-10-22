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
					function () {
						var
							m = this,
							_updateUiDisplayState = function () { m._updateUiDisplayState() }
						;

						m.wire({
							'Changed.enabledInherited':_updateUiDisplayState,
							'Changed.selected':_updateUiDisplayState
						});
					}
				),
				_classPrototype = _class.prototype
			;

		/*** Private Instance Methods ***/
			_classPrototype._updateUiLabel = function () {
				var m = this;

				if (m.isWired) {
					var
						_label = m._label,
						_labelWithCount = m.localize(
							'filterWithCount',
							{
								filterLabel:_label,
								count:m._count
							}
						)
					;

					m.set({
						text:m._showCount && _labelWithCount
							? _labelWithCount
							: _label
					});
				}
			};

			_classPrototype._updateUiDisplayState = function () {
				var m = this;

				if (m.isWired) {
					var
						_Uize_Node_Classes = Uize.Node.Classes,
						_rootNode = m.getNode()
					;

					_Uize_Node_Classes.setState(
						_rootNode,
						['', m._cssClassFeatured],
						m._featured
					);
					_Uize_Node_Classes.setState(
						_rootNode,
						['', m._cssClassDisabled],
						!m.get('enabledInherited')
					);
					_Uize_Node_Classes.setState(
						_rootNode,
						['', m._cssClassSelected],
						m.get('selected')
					);
				}
			};

		/*** Public Instance Methods ***/
			_classPrototype.updateUi = function () {
				var m = this;
				if (m.isWired) {
					m._updateUiLabel();
					m._updateUiDisplayState();
					_superclass.prototype.updateUi.call (m);
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

