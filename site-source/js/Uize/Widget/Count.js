/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Count Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2005-2015 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
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
		The =Uize.Widget.Count= class implements a fancy number display, using images to represent digits, and using an animation effect when changing values.

		*DEVELOPERS:* `Jan Borgersen`, `Chris van Rensburg`, original code contributed by `Zazzle Inc.`
*/

Uize.module ({
	name:'Uize.Widget.Count',
	required:'Uize.Widget.Flip',
	builder:function (_superclass) {
		'use strict';

		/*** Private Instance Methods ***/
			function _createContent (m, _number ) {
				return (
					m._numbersImagesPath
						? '<img src="' + m._numbersImagesPath + '/' + _number + '.' + m._numbersFiletype + '" border="0" />'
						: _number
				);
			}

			function _update (m, _direction ) {
				var
					_tmpCount = m._count,
					_children = m.children
				;
				for (var _digitsIndex = -1; ++_digitsIndex < m._digits;) {
					_children ['digit' + _digitsIndex].changeContent( _createContent(m, _tmpCount % m._base ) , _direction );
					_tmpCount = Math.floor(_tmpCount / m._base);
				}
				m._count || m.fire('zero');
				m._count == m._limit && m.fire('limit');
			}

		return _superclass.subclass ({
			instanceMethods:{
				up:function () {
					var m = this;
					m.set ({_count:m._count==m._limit ? 0 : m._count + 1});
					_update(m, 'up');
				},

				down:function () {
					var m = this;
					m.set ({_count:m._count==0 ? m._limit : m._count - 1});
					_update(m, 'down');
				},

				getCount:function () {
					return this._count;
				},

				setCount:function (_newCount) {
					var m = this;
					m.set ({_count:_newCount});
					_update(m, 'up');
				},

				zero:function () {
					var m = this;
					m.set ({_count:0});
					_update(m, 'down');
				},

				wireUi:function () {
					var m = this;
					if( !m.isWired ) {
						for (var _digitsIndex = -1; ++_digitsIndex < m._digits;)
							m.addChild ('digit' + _digitsIndex,Uize.Widget.Flip)
						;
						m._limit || m.set ({_limit:Math.pow(m._base,m._digits) - 1});

						_superclass.doMy (m,'wireUi');
					}
				}
			},

			stateProperties:{
				_count:{
					name:'count',
					value:0
				},
				_digits:{
					name:'digits',
					value:2
				},
				_limit:{
					name:'limit',
					value:0
				},
				_base:{
					name:'base',
					value:10
				},
				_numbersImagesPath:{
					name:'numbersImagesPath',
					value:''
				},
				_numbersFiletype:{
					name:'numbersFiletype',
					value:'gif'
				}
			}
		});
	}
});

