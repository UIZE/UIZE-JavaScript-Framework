/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Util.Cycle Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2006-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 1
	codeCompleteness: 100
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Util.Cycle= module implements a cycle automation behavior that can be useful in building automated / animated user experiences, such as slideshows.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Util.Cycle',
	superclass:'Uize.Class',
	builder:function (_superclass) {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_true = true,
				_false = false
			;

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					function () {
						var _this = this;
						/*** Private Instance Properties ***/
							_this._cycleNo = 0;
							_this._running = _false;
							_this._advanceTimeout = null;

						/*** Initialization ***/
							/*
							_this.fade.wire (
								'Done',
								function () {
									if (_this._running && (_this._cycleNo < _this._images.length - 1 || _this._loop))
										_this._advanceTimeout = setTimeout (function () {_this._advance ()},_this._interval)
									;
								}
							);
							*/
					}
				),
				_classPrototype = _class.prototype
			;

		/*** Private Instance Methods ***/
			_classPrototype._clearAdvanceTimeout = function () {
				if (this._advanceTimeout) {
					clearTimeout (this._advanceTimeout);
					this._advanceTimeout = null;
				}
			};

			_classPrototype._advance = function () {
				var
					_this = this,
					_bindings = _this._bindings
				;
				_this._clearAdvanceTimeout ();
				if (_bindings) {
					for (
						var _bindingNo = -1, _bindingsLength = _bindings.length;
						++_bindingNo < _bindingsLength;
					) {
						var
							_binding = _bindings [_bindingNo],
							_source = Uize.values (_binding.source),
							_target = _binding.target
						;
						var _sourceValue = _source [_this._cycleNo % _source.length];
						if (_binding.sourceProperty)
							_sourceValue = _sourceValue [_binding.sourceProperty]
						;
						_binding.targetProperty
							? _target.set (_binding.targetProperty,_sourceValue)
							: _target.set (_sourceValue)
						;
					}
				}
				if (_this._running)
					_this._advanceTimeout = setTimeout (function () {_this._advance ()},_this._interval)
				;
				_this._cycleNo++;
			};

		/*** Public Instance Methods ***/
			_classPrototype.start = function () {
				this._running = _true;
				this._advance ();
			};

			_classPrototype.stop = function () {
				this._clearAdvanceTimeout ();
				this._running = _false;
			};

		/*** State Properties ***/
			_class.stateProperties ({
				_bindings:'bindings',
				_interval:{
					name:'interval',
					value:6000
				},
				_loop:{
					name:'loop',
					value:_true
				}
			});

		return _class;
	}
});

