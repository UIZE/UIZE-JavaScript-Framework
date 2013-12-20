/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Services.StoreAdapter.Memory Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 1
	codeCompleteness: 0
	docCompleteness: 5
*/

/*?
	Introduction
		The =Uize.Services.StoreAdapter.Memory= module defines a simple adapter for the store service (=Uize.Services.Store=) that uses a non-persistent in-memory object for storing data.

		*DEVELOPERS:* `Chris van Rensburg`

		The =Uize.Services.StoreAdapter.Memory= adapter is intended to be used in situations where persistence of data beyond execution of the same JavaScript code is not essential, but where the code has been written to use the =Uize.Services.Store= service. In such cases, the services setup for the environment can choose to set up the store service using this lightweight and highly performant adapter that doesn't support persistence of the data.
*/

Uize.module ({
	name:'Uize.Services.StoreAdapter.Memory',
	superclass:'Uize.Class',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			alphastructor:function () {
				this._store = {};
			},
			instanceMethods:{
				key:function (_params,_callback) {
					var
						_index = _params.index,
						_keyNo = -1,
						_store = this._store
					;
					for (var _key in _store) {
						if (_store.hasOwnProperty (_key) && ++_keyNo == _index)
							return _key
						;
					}
					return null;
				},

				getItem:function (_params,_callback) {
					_callback (this._store [_params.key]);
				},

				setItem:function (_params,_callback) {
					this._store [_params.key] = _params.value;
					_callback ();
				},

				removeItem:function (_params,_callback) {
					delete this._store [_params.key];
					_callback ();
				},

				clear:function (_params,_callback) {
					this._store = {};
				},

				init:function (_params,_callback) {
					_callback ();
				}
			}
		});
	}
});

