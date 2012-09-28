/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.DialogDate
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2009-2012 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*?
	Introduction
		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'UizeSite.DialogDate',
	superclass:'Uize.Widget.Dialog.Picker.Date',
	required:'UizeSite.Templates.Dialog.Picker.Date',
	builder:function (_superclass) {
		/*** Class Constructor ***/
			var _class = _superclass.subclass ();

		/*** Override Initial Values for Inherited State Properties ***/
			_class.set ({
				built:false,
				height:145,
				html:UizeSite.Templates.Dialog.Picker.Date,
				title:'PICK DATE',
				width:150
			});

		return _class;
	}
});

