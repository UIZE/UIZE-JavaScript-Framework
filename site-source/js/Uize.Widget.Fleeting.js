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
						var m = this;

						/*** Private Instance Properties ***/
							m._lifeTimeout = null;
							m._showFade = Uize.Fade ({
								curve:Uize.Fade.celeration (0,1),
								duration:750
							});
							m._showFade.wire ({
								Start:function () {
									m._shown
										&& m.displayNode ('',m._shown)
									},
								'Changed.value':function () {
									m.setNodeOpacity ('', m._showFade)
									},
								Done:function () {
									!m._shown
										&& m.displayNode ('', m._shown)
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
				var m = this;

				if (m._lifeTimeout != null) {
					clearTimeout (m._timeout);
					m._timeout = null;
				}

				m.set ({_shown:_true});
			};

			_classPrototype.updateUi = function () {
				var m = this;

				if (m.isWired) {
					m._updateUiText ();
					_superclass.doMy (m,'updateUi');
				}
			};

			_classPrototype.wireUi = function () {
				var m = this;
				if (!m.isWired) {
					var _rootNode = m._rootNode = m.getNode ();
					if (_rootNode) {
						/*** initialize text value if undefined ***/
							m._text == _undefined
								&& m.set ({_text:m.getNodeValue('text')})
							;

						_superclass.doMy (m,'wireUi');
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
						var m = this;

						if (m.isWired) {
							m._shown
								&& m.fire ('Before Show');

						m._showFade.start ({
							startValue: m._shown ? 0 : m._maxOpacity,
								endValue:m._shown ? m._maxOpacity : 0
						});

							if (m._shown)
								m._lifeTimeout = setTimeout(
									function() { m.set({_shown:_false}) },
									m._lifeSpan
								)
							;

							!m._shown
								&& m.fire('After Hide');
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

