/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.mModels Mixin
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Mixin
	importance: 5
	codeCompleteness: 60
	docCompleteness: 50
*/

/*?
	Introduction
		The =Uize.Widget.mModels= widget mixin provides support for widgets that can contain child model class objects, allowing state between a widget and its child models to be bound.

		*DEVELOPERS:* `Ben Ilegbodu`, original code contributed by `Zazzle Inc.`

		=Uize.Widget.mModels= mixes in =Uize.Class.mModels= which provides a majority of the model functionality. =Uize.Widget.mModels= provides the following additional support...

		- Any model objects added to a widget are passed down to its child widgets, provided that those child widgets also support containing model objects
*/

Uize.module ({
	name:'Uize.Widget.mModels',
	required:'Uize.Class.mModels',
	builder:function () {
		'use strict';

		return function (_class) {
			_class.declare ({
				mixins:Uize.Class.mModels,

				alphastructor: function () {
					var
						m = this,
						_children = m.children,
						_models = m.models,

						_addModelsToChildren = function() {
							for (var _childName in _children) {
								var _child = _children[_childName];

								Uize.isFunction(_child.addModel)  // TODO: More robust way to determine that child mixes in Uize.Class.mModels?
									&& _children[_childName].set({models:_models})
								;
							}
						}
					;

					m.addedModels.wire('Changed.*', _addModelsToChildren); // TODO: support for removed models
					m.addedChildren.wire('Changed.*', _addModelsToChildren); // TODO: support for removed widgets
				}
			});
		};
	}
});
