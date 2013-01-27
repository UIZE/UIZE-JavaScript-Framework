/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.FormWarnings Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 5
	codeCompleteness: 80
	docCompleteness: 0
*/

/*?
	Introduction
		The =Uize.Widget.FormWarnings= widget provides functionality for displaying warnings for a =Uize.Widget.Form=.

		*DEVELOPERS:* `Ben Ilegbodu`, `Tim Carter`
*/

Uize.module ({
	name:'Uize.Widget.FormWarnings',
	required:'Uize.Template',	// for the JST
	builder:function (_superclass) {
		'use strict';

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (),
				_classPrototype = _class.prototype
			;

		/*** Private Instance Methods ***/
			_classPrototype._wireWatchedElement = function (_watchedElement) {
				var
					_this = this,
					_undefined
				;

				function _updateUiWarnings() {
					if (_this.isWired) {
						_this.unwireUi();
						_this.get ('html') != _undefined
							&& _this.set({built:false});
						_this.insertOrWireUi();
					}
				}

				_watchedElement.wire({
					'Changed.warningShown':_updateUiWarnings,
					'Changed.warningMessage':_updateUiWarnings
				});
			};

		/*** Public Instance Methods ***/
			_classPrototype.addWatchedElements = function (_elementsToWatch) {
				var
					_this = this,
					_watchedElements = _this._watchedElements || [],
					_elementsToWatchList = Uize.isArray(_elementsToWatch) ? _elementsToWatch : [_elementsToWatch],
					_elementsToWatchLength = _elementsToWatchList.length,
					_elementNo = -1
				;

				for (; ++_elementNo < _elementsToWatchLength;) {
					var _watchedElement = _elementsToWatchList[_elementNo];

					_watchedElements.push(_watchedElement);
					_this._wireWatchedElement(_watchedElement);
				}

				_this._watchedElements = _watchedElements;
				_this.fire('Changed.watchedElements');
			};

		/*** State Properties ***/
			_class.stateProperties({
				_shown:{
					name:'shown',
					onChange:function() {
						this.isWired
							&& this.displayNode('', this._shown)
					},
					value:false
				},
				_watchedElements:{
					name:'watchedElements',
					onChange:function() {
						var _this = this;
						Uize.forEach (
							_this._watchedElements,
							function (_watchedElement) {_this._wireWatchedElement (_watchedElement)}
						);
					},
					value:[]
				}
			});

		return _class;
	}
});
