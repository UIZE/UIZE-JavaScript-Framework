/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeDotCom.DialogDate
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2009-2012 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*ScruncherSettings Mappings="=e" LineCompacting="TRUE"*/

/*?
	Introduction
		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'UizeDotCom.DialogDate',
	superclass:'Uize.Widget.Dialog.Picker.Date',
	required:'UizeDotCom.Templates.Dialog.Picker.Date',
	builder:function (_superclass) {
		/*** Class Constructor ***/
			var _class = _superclass.subclass ();

		/*** Override Initial Values for Inherited Set-Get Properties ***/
			_class.set ({
				built:false,
				height:145,
				html:UizeDotCom.Templates.Dialog.Picker.Date,
				title:'PICK DATE',
				width:150
			});

		return _class;
	}
});

