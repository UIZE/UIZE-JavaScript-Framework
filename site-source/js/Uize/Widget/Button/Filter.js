/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Button.Filter Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2016 UIZE
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

		*DEVELOPERS:* `Ben Ilegbodu`, original code contributed by `Zazzle Inc.`
*/

Uize.module ({
	name:'Uize.Widget.Button.Filter',
	required:'Uize.Dom.Classes',
	builder:function (_superclass) {
		'use strict';

		/*** Private Instance Methods ***/
			function _updateUiLabel () {
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
			}

			function _updateUiDisplayState () {
				var m = this;

				if (m.isWired) {
					var
						_Uize_Dom_Classes = Uize.Dom.Classes,
						_rootNode = m.getNode()
					;

					_Uize_Dom_Classes.setState(
						_rootNode,
						['', m._cssClassFeatured],
						m._featured
					);
					_Uize_Dom_Classes.setState(
						_rootNode,
						['', m._cssClassDisabled],
						!m.get('enabledInherited')
					);
					_Uize_Dom_Classes.setState(
						_rootNode,
						['', m._cssClassSelected],
						m.get('selected')
					);
				}
			}

		return _superclass.subclass ({
			omegastructor:function () {
				var
					m = this,
					_boundUpdateUiDisplayState = function () { _updateUiDisplayState.call(m) }
				;

				m.wire({
					'Changed.enabledInherited':_boundUpdateUiDisplayState,
					'Changed.selected':_boundUpdateUiDisplayState
				});
			},

			instanceMethods:{
				updateUi:function () {
					var m = this;
					if (m.isWired) {
						_updateUiLabel.call(m);
						_updateUiDisplayState.call(m);
						_superclass.doMy (m,'updateUi');
					}
				}
			},

			stateProperties:{
				_count:{
					name:'count',
					onChange:_updateUiLabel
				},
				_cssClassDisabled:{
					name:'cssClassDisabled',
					onChange:_updateUiDisplayState,
					value:''
				},
				_cssClassFeatured:{
					name:'cssClassFeatured',
					onChange:_updateUiDisplayState,
					value:''
				},
				_cssClassSelected:{
					name:'cssClassSelected',
					onChange:_updateUiDisplayState,
					value:''
				},
				_featured:{
					name:'featured',
					onChange:_updateUiDisplayState
				},
				_label:{
					name:'label',
					onChange:_updateUiLabel
				},
				_showCount:{
					name:'showCount',
					onChange:_updateUiLabel
				}
			}
		});
	}
});

