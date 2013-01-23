/*______________
|       ______  |   U I Z E     J A V A S C R I P T     A P I
|     /      /  |   -----------------------------------------
|    /    O /   |    MODULE : Uize.Widget.TreeMenu Class (version 1.1.0)
|   /    / /    |    AUTHOR : Chris van Rensburg (http://www.tomkidding.com)
|  /    / /  /| |    ONLINE : http://www.tomkidding.com/uize/uize-js-api
| /____/ /__/_| | COPYRIGHT : (c)2003-2011 UIZE
|          /___ |   LICENSE : Distributed under the terms of the GNU General Public License
|_______________|             http://www.gnu.org/licenses/gpl.txt
*/

/*
	DESCRIPTION
		Implements a javascript class for the representation of treenodes belonging to a
		tree represented by Uize.Widget.TreeMenu.

	REQUIRES
		- Uize.Widget.js (base class)
		- Uize.Node.js

	TO DO
		- HTML should be generated using a custom template, rather than inside this JS code
*/

Uize.module({
	name:'Uize.Widget.TreeNode',
	required:[
		'Uize.Node'
	],
	builder:function(_superclass) {
		/*** Variables for scruncher optimization ***/
		var
			_true = true,
			_false = false,
			_null = null,
			_undefined,


		/*** Constructor ***/
			_class = _superclass.subclass(
				function() {
				}
			),
			_classPrototype = _class.prototype
		;

		/*** Private Methods ***/

		/*** Public stuff ***/

		_classPrototype.isDescendantOf = function(_possibleAncestor) {
			var
				_this = this
			;
			// we'll take advantage of the fact that the children have pointers to their parents
			return _possibleAncestor && (_possibleAncestor == _this	|| (_this._parentWidget && _this._parentWidget.isDescendantOf(_possibleAncestor)));
		};

		_classPrototype.generateHtml = function() {

			var
				_html = '',
				_this = this,
				_depth = _this._depth,
				_childWidget,
				_childWidgets = _this._childWidgets,
				_idPrefix = _this.get('idPrefix')
			;
			// the algorithm will be based upon a simple pre-processing with some post-processing thrown in for the hell of it
			// Also, we'll be assuming a list structure for all this (it's simpler than nobrs and spans, no?)
			_html += '<li id="' + _idPrefix + '" class="' + _this._cssClass + '">' +
				'<a href="javascript://" id="' + _idPrefix + '-button">' +
				_this._displayName +
				'</a>'
			;

			if (_childWidgets.length)
			{
				_html += '<ul id="' + _idPrefix + '-children">';
				for (_childWidget = 0; _childWidget < _childWidgets.length; ++_childWidget)
					_html += _childWidgets[_childWidget].generateHtml();
				_html += '</ul>';
			}

			return _html + '</li>';
		};

		/*** Wire UI ***/
		_classPrototype.wireUi = function()
		{
			var
				_this = this
			;

			if (!_this.isWired)
			{
				_this.wireNode(
					'button',
					'click',
					function() {
						_this._tree.selectNode(function(_node) { return _node == _this; });
						_this.set({expanded:!_this._expanded});
					}
				);

				// add the event handlers here
				_this.wire(_this._eventsToHandle);

				_this.displayNode('', _this._shown);

				_superclass.prototype.wireUi.call(_this);
			}
		};

		/*** Properties ***/
		_class.registerProperties({
			_childData:{
				name:'childData',
				onChange:function() {
					var
						_this = this,
						_childDepth = _this._depth + 1,
						_children = _this._childData,
						_childWidget,
						_childWidgetQueue = [],
						_idx
					;

					for (_idx = 0; _idx < _children.length; ++_idx) {
						_childWidget = _this.addChild(
								'level' + _childDepth + 'node' + _idx,
								Uize.Widget.TreeNode,
								Uize.copyInto(
									_children[_idx],
									{
										parentWidget:_this,
										tree:_this._tree
									}
								)
							)
						;

						_childWidget.wire(
							'Changed.shown',
							function(_event) {
								if (_event.source.get('shown') && !_this._expanded)
									_this.set({_expanded:_true});
							}
						);

						_childWidgetQueue.push(_childWidget);
					}

					_this._childWidgets = _childWidgetQueue;
				},
				value:[]
			},
			_childWidgets:{
				name:'childWidgets',
				value:[]
			},
			_cssClass:{
				name:'cssClass',
				value:''
			},
			_depth:{
				name:'depth',
				value:-1
			},
			_displayName:{
				name:'displayName',
				onChange:function() {
					var
						_this = this
					;
					if (_this.isWired)
						_this.setNodeInnerHtml('button', _this._displayName);
				}
			},
			// eventHandlers should be the object that
			// gets passed into a _this.wire
			// function call (eg:
			// 	_this.wire({
			// 		'Click':function(){},
			// 		'Shown':function() {}
			// 	});
			_eventsToHandle:{
				name:'eventsToHandle',
				value:{}
			},
			_expanded:{
				name:'expanded',
				onChange:function() {
					var
						_idx = 0,
						_this = this,
						_children = _this._childWidgets,
						_expanded = _this._expanded,
						_tree = _this._tree
					;

					if (_this.isWired){

						if (!_this._shown && _expanded) _this.set({_shown:_true});

						for (; _idx < _children.length; ++_idx)
							_children[_idx].set({shown:_expanded});

						_this.fire(_expanded ? 'Expanded' : 'Contracted');

						if (_tree && _expanded) {
							_tree.set({expandedNodes:_tree.get('expandedNodes').concat([_this])});
						}
					}
				}
			},
			_parentWidget:'parentWidget',
			// additional properties that might be useful for different uses of treenodes.
			_properties:'properties',
			_selected:{
				name:'selected',
				onChange:function() {
					var
						_this = this
					;
					if (_this.isWired)
						// change the css
						_this.getNode('button').className = _this._selected ? _this._selectedCssClass : _this._cssClass;
				},
				value:_false
			},
			_selectedCssClass:'selectedCssClass',
			_shown:{
				name:'shown',
				conformer:function(_new, _old) {
					// we always want to show root nodes
					return this._depth > 0 ? _new : _true;
				},
				onChange:function() {
					var
						_this = this,
						_shown = _this._shown
					;
					if (_this.isWired)
					{
						_this.displayNode('', _shown);
						if (_shown) _this.fire('Shown');
						else	_this.set({expanded:_false});
					}
				},
				value:_true
			},
			_tree:'tree'
		});

		return _class;

	}
});
