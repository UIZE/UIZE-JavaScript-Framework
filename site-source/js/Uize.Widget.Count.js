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
				var _this = this;
				return (
					_this._numbersImagesPath
						? '<img src="' + _this._numbersImagesPath + '/' + _number + '.' + _this._numbersFiletype + '" border="0" />'
						: _number
				);
			};

			_classPrototype._update = function ( _direction ) {
				var
					_this = this,
					_tmpCount = _this._count,
					_children = _this.children
				;
				for (var _digitsIndex = -1; ++_digitsIndex < _this._digits;) {
					_children ['digit' + _digitsIndex].changeContent( _this._createContent( _tmpCount % _this._base ) , _direction );
					_tmpCount = Math.floor(_tmpCount / _this._base);
				}
				_this._count || _this.fire('zero');
				_this._count == _this._limit && _this.fire('limit');
			};

		/*** Public Instance Methods ***/
			_classPrototype.up = function () {
				var _this = this;
				_this.set ({_count:_this._count==_this._limit ? 0 : _this._count + 1});
				_this._update('up');
			};

			_classPrototype.down = function () {
				var _this = this;
				_this.set ({_count:_this._count==0 ? _this._limit : _this._count - 1});
				_this._update('down');
			};

			_classPrototype.getCount = function () {
				return this._count;
			};

			_classPrototype.setCount = function (_newCount) {
				var _this = this;
				_this.set ({_count:_newCount});
				_this._update('up');
			};

			_classPrototype.zero = function () {
				var _this = this;
				_this.set ({_count:0});
				_this._update('down');
			};

			_classPrototype.wireUi = function () {
				var _this = this;
				if( !_this.isWired ) {
					for (var _digitsIndex = -1; ++_digitsIndex < _this._digits;)
						_this.addChild ('digit' + _digitsIndex,Uize.Widget.Flip)
					;
					_this._limit || _this.set ({_limit:Math.pow(_this._base,_this._digits) - 1});

					_superclass.prototype.wireUi.call( _this );
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

