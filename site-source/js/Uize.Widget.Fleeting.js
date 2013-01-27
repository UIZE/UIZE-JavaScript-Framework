/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Fleeting Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2006-2013 UIZE
|           |__ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 4
	codeCompleteness: 100
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Widget.Fleeting= class implements a fleeting message behavior with a configurable display lifespan and a JavaScript animation fade out effect.

		*DEVELOPERS:* `Jan Borgersen`, `Ben Ilegbodu`
*/

Uize.module ({
	name:'Uize.Widget.Fleeting',
	required:'Uize.Fade',
	builder:function (_superclass) {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_true = true,
				_false = false,
				_undefined
			;

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					function () {
						var _this = this;

						/*** Private Instance Properties ***/
							_this._lifeTimeout = null;
							_this._showFade = Uize.Fade ({
								curve:Uize.Fade.celeration (0,1),
								duration:750
							});
							_this._showFade.wire ({
								Start:function () {
									_this._shown
										&& _this.displayNode ('',_this._shown)
									},
								'Changed.value':function () {
									_this.setNodeOpacity ('', _this._showFade)
									},
								Done:function () {
									!_this._shown
										&& _this.displayNode ('', _this._shown)
									}
							});
					}
				),
				_classPrototype = _class.prototype
			;

		/*** Private Instance Methods ***/
			_classPrototype._updateUiText = function () {
				this._text != _undefined && this.isWired && this.setNodeInnerHtml ('text',this._text);
				/*?
					Implied Nodes
						text Implied Node
							An optional node whose contents will be replaced with the value of the =text= state property, if this property's value is not =null= or =undefined=.

							The =innerHTML= value of the =text Implied Node= will be updated to reflect the value of the =text= state property whenever the value of this property is changed, is not =null= or =undefined=, and the instance is wired up.

							NOTES
							- this implied node is optional
				*/
			};

		/*** Public Instance Methods ***/
			_classPrototype.show = function () {
				var _this = this;

				if (_this._lifeTimeout != null) {
					clearTimeout (_this._timeout);
					_this._timeout = null;
				}

				_this.set ({_shown:_true});
			};

			_classPrototype.updateUi = function () {
				var _this = this;

				if (_this.isWired) {
					_this._updateUiText ();
					_superclass.prototype.updateUi.call (_this);
				}
			};

			_classPrototype.wireUi = function () {
				var _this = this;
				if (!_this.isWired) {
					var _rootNode = _this._rootNode = _this.getNode ();
					if (_rootNode) {
						/*** initialize text value if undefined ***/
							_this._text == _undefined
								&& _this.set ({_text:_this.getNodeValue('text')})
							;

						_superclass.prototype.wireUi.call (_this);
					}
				}
			};

		/*** State Properties ***/
			_class.stateProperties ({
				_maxOpacity:{
					name:'maxOpacity',
					value:1
				},
				_lifeSpan:{
					name:'lifeSpan',
					value:5000
				},
				_shown:{
					name:'shown',
					onChange:function () {
						var _this = this;

						if (_this.isWired) {
							_this._shown
								&& _this.fire ('Before Show');

						_this._showFade.start ({
							startValue: _this._shown ? 0 : _this._maxOpacity,
								endValue:_this._shown ? _this._maxOpacity : 0
						});

							if (_this._shown)
								_this._lifeTimeout = setTimeout(
									function() { _this.set({_shown:_false}) },
									_this._lifeSpan
								)
							;

							!_this._shown
								&& _this.fire('After Hide');
						}
					},
					value:_false
				},
				_text:{
					name:'text',
					onChange:_classPrototype._updateUiText
					/*?
						State Properties
							text
								A string, whose value will be used to set the value of the =innerHTML= property of the =text Implied Node=.

								The =innerHTML= value of the =text Implied Node= will be updated to reflect the value of the =text= state property whenever the value of this property is changed, is not =null= or =undefined=, and the instance is wired up.

								NOTES
								- the initial value is =undefined=
					*/
				}
			});

		return _class;
	}
});

