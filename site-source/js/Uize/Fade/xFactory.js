/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Fade.xFactory Class Extension
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2008-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Extension
	importance: 5
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Fade.xFactory= module has been deprecated in favor of the newer =Uize.Fade.Factory= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Fade.xFactory',
	required:[
		'Uize.Fade',
		'Uize.Fade.Factory'
	],
	builder:function () {
		'use strict';

		Uize.Fade.Factory.extend (Uize.Fade);
		/*?
			Static Methods
				Uize.Fade.fade -- DEPRECATED 2015-10-24
					This method has been deprecated in favor of the newer =Uize.Fade.Factory.fade= method of the =Uize.Fade.Factory= module.

					...................................................
					Uize.Fade.fade >> BECOMES >> Uize.Fade.Factory.fade
					...................................................

					The new =Uize.Fade.Factory.fade= method behaves in the same way as the deprecated =Uize.Fade.fade= method.

				Uize.Fade.fadeMethod -- DEPRECATED 2015-10-24
					This method has been deprecated in favor of the newer =Uize.Fade.Factory.fadeMethod= method of the =Uize.Fade.Factory= module.

					...............................................................
					Uize.Fade.fadeMethod >> BECOMES >> Uize.Fade.Factory.fadeMethod
					...............................................................

					The new =Uize.Fade.Factory.fadeMethod= method behaves in the same way as the deprecated =Uize.Fade.fadeMethod= method.

				Uize.Fade.fadeProperties -- DEPRECATED 2015-10-24
					This method has been deprecated in favor of the newer =Uize.Fade.Factory.fadeProperties= method of the =Uize.Fade.Factory= module.

					.......................................................................
					Uize.Fade.fadeProperties >> BECOMES >> Uize.Fade.Factory.fadeProperties
					.......................................................................

					The new =Uize.Fade.Factory.fadeProperties= method behaves in the same way as the deprecated =Uize.Fade.fadeProperties= method.

				Uize.Fade.fadeProperty -- DEPRECATED 2015-10-24
					This method has been deprecated in favor of the newer =Uize.Fade.Factory.fadeProperty= method of the =Uize.Fade.Factory= module.

					...................................................................
					Uize.Fade.fadeProperty >> BECOMES >> Uize.Fade.Factory.fadeProperty
					...................................................................

					The new =Uize.Fade.Factory.fadeProperty= method behaves in the same way as the deprecated =Uize.Fade.fadeProperty= method.
		*/
	}
});

