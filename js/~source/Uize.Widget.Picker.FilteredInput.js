/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Picker.FilteredInput Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2011 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*ScruncherSettings Mappings="=e" LineCompacting="TRUE"*/

/* Module Meta Data
	type: Class
	importance: 4
	codeCompleteness: 50
	testCompleteness: 0
	docCompleteness: 0
*/

/*?
	Introduction
		The =Uize.Widget.Picker.FilteredInput= class implements a filtered input picker widget, using a deferred loaded filtered input picker modal dialog to let the user select from an input.

		*DEVELOPERS:* `Ben Ilegbodu`
*/

Uize.module ({
	name:'Uize.Widget.Picker.FilteredInput',
	required:'Uize.Widget.ValueDisplay.Selector',
	builder:function (_superclass) {
		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					null,
					function() {
						var _this = this;
						
						_this.wire(
							'Changed.valueDetails',
							function() { _this._updateUiSelector() }
						);
						
						_this._previousValueDisplayShellWidth = 0;
					}
				),
				_classPrototype = _class.prototype
			;
			
		/*** Private Methods ***/
			_classPrototype._updateUiSelector = function() {
				var _this = this;
				
				if (_this.isWired) {
					var
						_valueDisplayShellNode = _this.children.selector.getNode('valueDisplayShell'),
						_valueDisplayShellNodeWidth = Uize.Node.getDimensions(_valueDisplayShellNode).width,
						_previousValueDisplayShellWidth = _this._previousValueDisplayShellWidth
					;

					if (_previousValueDisplayShellWidth && _valueDisplayShellNodeWidth < _previousValueDisplayShellWidth)
						_this.setNodeStyle(_valueDisplayShellNode, {minWidth:_previousValueDisplayShellWidth});
					else if (_valueDisplayShellNodeWidth)
						_this._previousValueDisplayShellWidth = _valueDisplayShellNodeWidth;
				}
			};
			
		/*** Public Methods ***/
			_classPrototype.getDialogWidgetProperties = function() {
				var
					_mooringNode = this.children.selector.getNode () || this.getNode ('input'),
					_undefined
				;
				
				return {
					offsetX:'adjacent',	// we want the dialog to show up next to the selector button to look like a droplist palette
					offsetY:'adjacent',
					minWidth:_mooringNode
						? Uize.Node.getDimensions(_mooringNode).width
						: _undefined
				};
			};
			
			_classPrototype.updateUi = function () {
				var _this = this;
				if (_this.isWired) {
					_this._updateUiSelector();
					_superclass.prototype.updateUi.call (_this);
				}
			};

		/*** Register Properties ***/
			_class.registerProperties ({
				_filter:'filter',
				_filters:'filters',
				_inputWidgetClass:'inputWidgetClass',
				_inputWidgetProperties:'inputWidgetProperties'
			});

		/*** Override Initial Values for Inherited Set-Get Properties ***/
			_class.set ({
				pipedProperties:['inputWidgetClass', 'inputWidgetProperties', 'filter', 'filters'],
				selectorButtonWidgetClass:Uize.Widget.ValueDisplay.Selector,
				dialogWidgetClass:'Uize.Widget.Dialog.Picker.FilteredInput'
			});

		return _class;
	}
});

