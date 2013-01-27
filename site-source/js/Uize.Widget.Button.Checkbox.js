/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Button.Checkbox Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2006-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 2
	codeCompleteness: 100
	docCompleteness: 70
*/

/*?
	Introduction
		The =Uize.Widget.Button.Checkbox= class implements a thin wrapper around the button base class in order to support buttons that behave as checkboxes.

		*DEVELOPERS:* `Ben Ilegbodu`, original code donated by `Zazzle Inc.`
*/

Uize.module ({
	name:'Uize.Widget.Button.Checkbox',
	builder:function (_superclass) {
		'use strict';

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					function () {
						var _this = this;

						/*** initialization ***/
							_this.wire ('Click',function () {_this.toggle ('selected')});
					}
				)
			;

		/*** Override Initial Values for Inherited State Properties ***/
			_class.set ({clickToDeselect:true});

		return _class;
	}
});

