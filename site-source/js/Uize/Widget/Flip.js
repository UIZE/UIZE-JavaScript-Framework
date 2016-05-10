/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Flip Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2005-2016 UIZE
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
		The =Uize.Widget.Flip= class implements a widget for producing a flip up or flip down JavaScript animation effect when its HTML contents are changed.

		*DEVELOPERS:* `Jan Borgersen`, `Chris van Rensburg`, original code contributed by `Zazzle Inc.`
*/

Uize.module ({
	name:'Uize.Widget.Flip',
	required:'Uize.Fade',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			alphastructor:function () {
				/*** Private Instance Properties ***/
					this._phase = 'idle';

				/*** Public Instance Properties ***/
					this.fade = Uize.Fade ({duration:400});
			},

			instanceMethods:{
				changeContent:function (_content, _direction) {
					var m = this;

					if (_content != m._newContent) {
						m._newContent = _content;
						m._phase = 'out';
						m.set ({_direction:_direction});

						m.fade.start ({
							startValue: 0,
							endValue:m._direction == 'down' ? 0-m._offset : m._offset-0,
							curve:Uize.Fade.celeration (1,0)
						});
					}
				},

				wireUi:function () {
					var m = this;
					if (!m.isWired) {
						var _contentNode = m.getNode();

						m.fade.wire ({
							'Changed.value':
								function () {
									m.setNodeStyle ('',{top:Math.round (m.fade)})
								},
							Done:
								function () {
									if( m._phase == 'out' ) {
										m.setNodeInnerHtml (_contentNode,m._newContent);
										m.fade.set ({
											startValue:m._direction == 'down' ? m._offset-0 : 0-m._offset,
											endValue:0,
											curve:Uize.Fade.celeration (0,1)
										});
										m._phase = 'in';
										m.fade.start ();
										m.fire('Content Changed');
									} else if( m._phase == 'in' ) {
										m._phase = 'idle';
										m.fire('Updated');
									}
								}
						});

						if (_contentNode)
							m._newContent = _contentNode.innerHTML
						;

						_superclass.doMy (m,'wireUi');
					}
				}
			},

			stateProperties:{
				_direction:{
					name:'direction',
					value:'down'
				},
				_offset:{
					name:'offset',
					value:'20'
				}
			}
		});
	}
});

