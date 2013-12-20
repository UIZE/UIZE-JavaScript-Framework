/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Count Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2005-2013 UIZE
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

		*DEVELOPERS:* `Jan Borgersen`, `Chris van Rensburg`, original code donated by `Zazzle Inc.`
*/

Uize.module ({
	name:'Uize.Widget.Count',
	required:'Uize.Widget.Flip',
	builder:function (_superclass) {
		'use strict';

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (),
				_classPrototype = _class.prototype
			;

		/*** Private Instance Methods ***/
			_classPrototype._createContent = function ( _number ) {
				var m = this;
				return (
					m._numbersImagesPath
						? '<img src="' + m._numbersImagesPath + '/' + _number + '.' + m._numbersFiletype + '" border="0" />'
						: _number
				);
			};

			_classPrototype._update = function ( _direction ) {
				var
					m = this,
					_tmpCount = m._count,
					_children = m.children
				;
				for (var _digitsIndex = -1; ++_digitsIndex < m._digits;) {
					_children ['digit' + _digitsIndex].changeContent( m._createContent( _tmpCount % m._base ) , _direction );
					_tmpCount = Math.floor(_tmpCount / m._base);
				}
				m._count || m.fire('zero');
				m._count == m._limit && m.fire('limit');
			};

		/*** Public Instance Methods ***/
			_classPrototype.up = function () {
				var m = this;
				m.set ({_count:m._count==m._limit ? 0 : m._count + 1});
				m._update('up');
			};

			_classPrototype.down = function () {
				var m = this;
				m.set ({_count:m._count==0 ? m._limit : m._count - 1});
				m._update('down');
			};

			_classPrototype.getCount = function () {
				return this._count;
			};

			_classPrototype.setCount = function (_newCount) {
				var m = this;
				m.set ({_count:_newCount});
				m._update('up');
			};

			_classPrototype.zero = function () {
				var m = this;
				m.set ({_count:0});
				m._update('down');
			};

			_classPrototype.wireUi = function () {
				var m = this;
				if( !m.isWired ) {
					for (var _digitsIndex = -1; ++_digitsIndex < m._digits;)
						m.addChild ('digit' + _digitsIndex,Uize.Widget.Flip)
					;
					m._limit || m.set ({_limit:Math.pow(m._base,m._digits) - 1});

					_superclass.doMy (m,'wireUi');
				}
			};

		/*** State Properties ***/
			_class.stateProperties ({
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
			});

		return _class;
	}
});

