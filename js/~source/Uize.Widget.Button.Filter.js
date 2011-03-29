/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Button.Filter Class
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
	codeCompleteness: 100
	testCompleteness: 0
	docCompleteness: 0
*/

/*?
	Introduction
		The =Uize.Widget.Button.Filter= widget provides functionality for a filter button within a =Uize.Widget.Options.FilterGroup= widget.

		*DEVELOPERS:* `Ben Ilegbodu`
*/

Uize.module ({
	name:'Uize.Widget.Button.Filter',
	required:'Uize.Node.Classes',
	builder:function (_superclass) {
		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (),
				_classPrototype = _class.prototype
			;

		/*** Private Instance Methods ***/
			_classPrototype._updateUiLabel = function() {
				var _this = this;
				
				if (_this.isWired) {
					var
						_label = _this._label,
						_labelWithCount = _this.localize(
							'filterWithCount',
							{
								filterLabel:_label,
								count:_this._count
							}
						)
					;
					
					_this.set({
						text:_this._showCount && _labelWithCount
							? _labelWithCount
							: _label
					});
				}
			};
			
			_classPrototype._updateUiState = function() {
				var _this = this;
				
				_this.isWired
					&& Uize.Node.Classes.setState(
						_this.getNode(),
						['', _this._featuredCssClass],
						_this._featured
					)
				;
			};

		/*** Public Instance Methods ***/
			_classPrototype.updateUi = function () {
				var _this = this;
				if (_this.isWired) {
					_this._updateUiLabel();
					_this._updateUiState();
					_superclass.prototype.updateUi.call (_this);
				}
			};

		/*** Register Properties ***/
			_class.registerProperties ({
				_count:{
					name:'count',
					onChange:_classPrototype._updateUiLabel
				},
				_featured:{
					name:'featured',
					onChange:_classPrototype._updateUiState
				},
				_featuredCssClass:{
					name:'featuredCssClass',
					onChange:_classPrototype._updateUiState,
					value:''
				},
				_label:{
					name:'label',
					onChange:_classPrototype._updateUiLabel
				},
				_showCount:{
					name:'showCount',
					onChange:_classPrototype._updateUiLabel
				}
			});

		return _class;
	}
});

