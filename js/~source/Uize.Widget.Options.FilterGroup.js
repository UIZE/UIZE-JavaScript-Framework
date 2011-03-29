/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Options.FilterGroup Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2011 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*ScruncherSettings Mappings="=d" LineCompacting="TRUE"*/

/* Module Meta Data
	type: Class
	importance: 7
	codeCompleteness: 50
	testCompleteness: 0
	docCompleteness: 0
*/

/*?
	Introduction
		The =Uize.Widget.Options.FilterGroup= widget provides the functionality for a filter group widget...

		*DEVELOPERS:* `Ben Ilegbodu`
*/

Uize.module ({
	name:'Uize.Widget.Options.FilterGroup',
	required:[
		'Uize.Widget.Button.Filter',
		'Uize.Node.Classes'
	],
	builder:function (_superclass) {
		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (),
				_classPrototype = _class.prototype
			;

		/*** Private Instance Methods ***/
			_classPrototype._updateUiExpanded = function() {
				var _this = this;

				_this.isWired
					&& Uize.Node.Classes.setState(
						_this.getNode('options'),
						['', _this._expandedCssClass],
						_this._expanded
					)
				;
			};
			
			_classPrototype._updateUiTitle = function() {
				this.isWired && this.setNodeInnerHtml('title', this._title)
			};

		/*** Public Instance Methods ***/
			_classPrototype.updateUi = function () {
				var _this = this;
				if (_this.isWired) {
					_this._updateUiTitle();
					_this._updateUiExpanded();
					_superclass.prototype.updateUi.call (_this);
				}
			};

		/*** Register Properties ***/
			_class.registerProperties ({
				_expanded:{
					name:'expanded',
					onChange:_classPrototype._updateUiExpanded,
					value:false
				},
				_expandedCssClass:{
					name:'expandedCssClass',
					onChange:_classPrototype._updateUiExpanded,
					value:''
				},
				_title:{
					name:'title',
					onChange:_classPrototype._updateUiTitle,
					value:''
				}
			});

		/*** Override Initial Values for Inherited Set-Get Properties ***/
			_class.set ({
				optionWidgetClass:Uize.Widget.Button.Filter
			});

		return _class;
	}
});

