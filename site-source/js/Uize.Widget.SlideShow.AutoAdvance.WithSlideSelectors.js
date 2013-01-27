/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.SlideShow.AutoAdvance.WithSlideSelectors Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 2
	codeCompleteness: 0
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Widget.SlideShow.AutoAdvance.WithSlideSelectors= extends its superclass by adding an options widgets for selecting individual slides.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Widget.SlideShow.AutoAdvance.WithSlideSelectors',
	required:'Uize.Widget.Options',
	builder:function (_superclass) {
		'use strict';

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					null,
					function () {
						var _this = this;

						/*** add the options widget ***/
							var _options = _this.addChild ('options',Uize.Widget.Options);

							/*** keep options widget synchronized to slideshow ***/
								_this.wire ({
									'Changed.slideNo':function () {_this.children.options.set ({value:_this.get ('slideNo')})},
									'Changed.totalSlides':function () {_this._updateOptionsValueAndValues ()}
								});

							/*** keep slideshow synchronized to options widget ***/
								_options.wire (
									'Changed.value',
									function () {
										var _tentativeValue = _options.get('value');
										if (_tentativeValue != _this.get ('slideNo')) {
											_this.stopThenResume ();
											_this.set ({slideNo:_tentativeValue});
										}
									}
								);

						/* HACK!!! */
							_this.wire ('Changed.slideNo',function () {_this.wipeDone ()});

						/*** initialization ***/
							_this._updateOptionsValueAndValues ();
							_this.set ({slideNo:_this._startSlideNo}); // HACK
					}
				),
				_classPrototype = _class.prototype
			;

		/*** Private Instance Methods ***/
			_classPrototype._updateOptionsValueAndValues = function () {
				this.children.options.set ({
					value:this.get ('slideNo'),
					values:Uize.map (this.get ('totalSlides'),'key')
				});
			};

		/*** State Properties ***/
			_class.stateProperties ({
				_startSlideNo:'startSlideNo' // HACK
			});

		return _class;
	}
});

