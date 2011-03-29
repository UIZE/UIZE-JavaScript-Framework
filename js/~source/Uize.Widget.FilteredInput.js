/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.FilteredInput Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2011 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*ScruncherSettings Mappings="=c" LineCompacting="TRUE"*/

/* Module Meta Data
	type: Class
	importance: 6
	codeCompleteness: 0
	testCompleteness: 0
	docCompleteness: 0
*/

/*?
	Introduction
		The =Uize.Widget.FilteredInput= widget provides functionality for...

		*DEVELOPERS:* `Ben Ilegbodu`
*/

Uize.module ({
	name:'Uize.Widget.FilteredInput',
	required:[
		'Uize.Widget.FilterGroups',
		'Uize.Util.Coupler',
		'Uize.Widget.Button.FullLink'
	],
	builder:function (_superclass) {
		/*** Variables for Scruncher Optimization ***/
			var
				_null = null
			;
			
		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					_null,
					function() {
						var
							_this = this,
							_Uize = Uize,
							
							_inputWidget = _this.addChild(
								'input',
								_this._inputWidgetClass,
								_Uize.copyInto(
									{},
									_this._filter ? {filter:_this._filter} : _null,
									_this._inputWidgetProperties
								)
							),
							_filterGroupsWidget = _this.addChild(
								'filterGroups',
								_Uize.Widget.FilterGroups,
								_Uize.copyInto(
									{},
									_this._filters ? {values:_this._filters} : _null,
									_this._filter ? {value:_this._filter} : _null
								)
							)
						;

						new Uize.Util.Coupler({
							instances:[_inputWidget, _this],
							properties:['value', 'valueDetails']
						});
						
						_filterGroupsWidget.wire(
							'Changed.value',
							function() { _inputWidget.set({filter:_filterGroupsWidget.valueOf()})}
						);
					}
				)
			;

		/*** Public Methods ***/
			_class.prototype.wireUi = function () {
				var _this = this;
				
				if (!_this.isWired) {
					var _fullLinksData = _this._fullLinks;
					
					if (_fullLinksData) {
						function _setUpFullLink(_fullLinkNo) {
							_this.addChild (
								'fullLink' + _fullLinkNo,
								Uize.Widget.Button.FullLink,
								_fullLinksData[_fullLinkNo]
							).wire(
								'Click',
								function(_event) {
									// TODO: launch full dialog
									console.log('full dialog: ' + _event.source.get('label'));
								}
							)
						}
						
						for (var _fullLinkNo = -1; ++_fullLinkNo < _fullLinksData.length;)
							_setUpFullLink(_fullLinkNo)
						;
					}

					_superclass.prototype.wireUi.call (_this);
				}
			};

		/*** Register Properties ***/
			_class.registerProperties ({
				_filter:'filter',
				_filters:'filters',
				_fullLinks:'fullLinks',
				_inputWidgetClass:'inputWidgetClass',
				_inputWidgetProperties:'inputWidgetProperties',
				_value:{
					name:'value',
					value:null
				},
				_valueDetails:'valueDetails'
			});

		return _class;
	}
});

