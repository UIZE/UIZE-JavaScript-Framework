/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeDotCom.TestWidget
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2008-2011 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*ScruncherSettings Mappings="=c" LineCompacting="TRUE"*/

/*?
	Introduction
		A test widget class used in examples to demonstrate the behavior of the =enabled= and =busy= set-get properties.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'UizeDotCom.TestWidget',
	superclass:'Uize.Widget',
	required:'Uize.Widget.Button',
	builder:function (_superclass) {
		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					function () {
						var _this = this;

						/*** add child button widgets ***/
							_this._addChildButton (
								'button1',
								function () {
									alert (_this.get ('idPrefix') + ' --- click button 1');
								}
							);
							_this._addChildButton (
								'button2',
								function () {
									alert (_this.get ('idPrefix') + ' --- click button 2');
								}
							);

						/*** code to update UI whenever enabled and busy set-get properties change ***/
							var _updateUi = function () {_this.updateUi ()};
							_this.wire ({
								'Changed.enabled':_updateUi,
								'Changed.busy':_updateUi
							});
					}
				),
				_classPrototype = _class.prototype
			;

		/*** Private Instance Methods ***/
			_classPrototype._addChildButton = Uize.Widget.Button.addChildButton;

		/*** Public Instance Methods ***/
			_classPrototype.updateUi = function () {
				var _this = this;
				if (_this.isWired) {
					_this.setNodeValue ('enabledSelector',_this.get ('enabled'));
					_this.setNodeValue ('busySelector',_this.get ('busy'));
				}
			};

			_classPrototype.wireUi = function () {
				var _this = this;
				if (!_this.isWired) {
					var _valuesMap = {'false':false,'true':true,inherit:'inherit'};
					_this.wireNode (
						'enabledSelector',
						'change',
						function () {_this.set ({enabled:_valuesMap [_this.getNodeValue ('enabledSelector')]})}
					);
					_this.wireNode (
						'busySelector',
						'change',
						function () {_this.set ({busy:_valuesMap [_this.getNodeValue ('busySelector')]})}
					);

					_superclass.prototype.wireUi.call (_this);
				}
			};

			_classPrototype.resetEnabledAndBusy = function () {
				this.set ({enabled:'inherit',busy:'inherit'});
				Uize.callOn (this.children,'resetEnabledAndBusy');
			};

		/*** Override Initial Values for Inherited Set-Get Properties ***/
			_class.set ({
				html:
					'<div class="widgetShell">' +
						'<div class="heading">[#idPrefix]</div>' +
						'<div class="body">' +
							'ENABLED: ' +
								'<select id="[#idPrefix]-enabledSelector">' +
									'<option value="inherit" selected>inherit</option>' +
									'<option value="true">true</option>' +
									'<option value="false">false</option>' +
								'</select>' +
							'&nbsp;&nbsp;|&nbsp;&nbsp;' +
							'BUSY: ' +
								'<select id="[#idPrefix]-busySelector">' +
									'<option value="inherit" selected>inherit</option>' +
									'<option value="true">true</option>' +
									'<option value="false">false</option>' +
								'</select>' +
							'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
							'<span id="[#idPrefix]_button1" class="button">BUTTON 1</span>' +
							'<span id="[#idPrefix]_button2" class="button">BUTTON 2</span>' +
							'<br clear="left"/>' +
							'<div id="[#idPrefix]_childTestWidget0"></div>' +
							'<div id="[#idPrefix]_childTestWidget1"></div>' +
						'</div>' +
					'</div>'
			});

		return _class;
	}
});

