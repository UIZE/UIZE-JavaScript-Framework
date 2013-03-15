/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Node.CssModule.Test Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 1
	codeCompleteness: 100
	docCompleteness: 5
*/

/*?
	Introduction
		The =Uize.Node.CssModule.Test= class....

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Node.CssModule.Test',
	builder:function (_superclass) {
		'use strict';

		return _superclass.subclass ({
			staticProperties:{
				css:
					'.foo {' +
						'width: 50px;' +
						'height: 50px;' +
						'background: #f00;' +
					'}'
			}
		});
	}
});

