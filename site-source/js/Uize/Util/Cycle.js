/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Util.Cycle Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2006-2015 UIZE
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

		/*** Private Instance Methods ***/
			function _clearAdvanceTimeout (m) {
				if (m._advanceTimeout) {
					clearTimeout (m._advanceTimeout);
					m._advanceTimeout = null;
				}
			}

			function _advance (m) {
				var _bindings = m._bindings;
				_clearAdvanceTimeout (m);
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
						var _sourceValue = _source [m._cycleNo % _source.length];
						if (_binding.sourceProperty)
							_sourceValue = _sourceValue [_binding.sourceProperty]
						;
						_binding.targetProperty
							? _target.set (_binding.targetProperty,_sourceValue)
							: _target.set (_sourceValue)
						;
					}
				}
				if (m._running)
					m._advanceTimeout = setTimeout (function () {_advance (m)},m._interval)
				;
				m._cycleNo++;
			}

		return _superclass.subclass ({
			alphastructor:function () {
				var m = this;

				/*** Private Instance Properties ***/
					m._cycleNo = 0;
					m._running = false;
					m._advanceTimeout = null;

				/*** Initialization ***/
					/*
					m.fade.wire (
						'Done',
						function () {
							if (m._running && (m._cycleNo < m._images.length - 1 || m._loop))
								m._advanceTimeout = setTimeout (function () {_advance (m)},m._interval)
							;
						}
					);
					*/
			},

			instanceMethods:{
				start:function () {
					this._running = true;
					_advance (this);
				},

				stop:function () {
					_clearAdvanceTimeout (this);
					this._running = false;
				}
			},

			stateProperties:{
				_bindings:'bindings',
				_interval:{
					name:'interval',
					value:6000
				},
				_loop:{
					name:'loop',
					value:true
				}
			}
		});
	}
});

