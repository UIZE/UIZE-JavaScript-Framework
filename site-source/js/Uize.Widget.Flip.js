/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Flip Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2005-2013 UIZE
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

		*DEVELOPERS:* `Jan Borgersen`, `Chris van Rensburg`, original code donated by `Zazzle Inc.`
*/

Uize.module ({
	name:'Uize.Widget.Flip',
	required:'Uize.Fade',
	builder:function (_superclass) {
		'use strict';

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					function () {
						/*** Private Instance Properties ***/
							this._phase = 'idle';

						/*** Public Instance Properties ***/
							this.fade = Uize.Fade ({duration:400});
					}
				),
				_classPrototype = _class.prototype
			;

		/*** Public Instance Methods ***/
			_classPrototype.changeContent = function (_content, _direction) {
				var _this = this;

				if (_content != _this._newContent) {
					_this._newContent = _content;
					_this._phase = 'out';
					_this.set ({_direction:_direction});

					_this.fade.start ({
						startValue: 0,
						endValue:_this._direction == 'down' ? 0-_this._offset : _this._offset-0,
						curve:Uize.Fade.celeration (1,0)
					});
				}
			};

			_classPrototype.wireUi = function () {
				var _this = this;
				if (!_this.isWired) {
					var _contentNode = _this.getNode();

					_this.fade.wire ({
						'Changed.value':
							function () {
								_this.setNodeStyle ('',{top:Math.round (_this.fade)})
							},
						Done:
							function () {
								if( _this._phase == 'out' ) {
									_this.setNodeInnerHtml (_contentNode,_this._newContent);
									_this.fade.set ({
										startValue:_this._direction == 'down' ? _this._offset-0 : 0-_this._offset,
										endValue:0,
										curve:Uize.Fade.celeration (0,1)
									});
									_this._phase = 'in';
									_this.fade.start ();
									_this.fire('Content Changed');
								} else if( _this._phase == 'in' ) {
									_this._phase = 'idle';
									_this.fire('Updated');
								}
							}
					});

					if (_contentNode)
						_this._newContent = _contentNode.innerHTML
					;

					_superclass.prototype.wireUi.call (_this);
				}
			};

		/*** State Properties ***/
			_class.stateProperties ({
				_direction:{
					name:'direction',
					value:'down'
				},
				_offset:{
					name:'offset',
					value:'20'
				}
			});

		return _class;
	}
});

