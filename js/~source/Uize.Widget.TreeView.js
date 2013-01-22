/*______________
|       ______  |   U I Z E     J A V A S C R I P T     A P I
|     /      /  |   -----------------------------------------
|    /    O /   |    MODULE : Uize.Widget.TreeView (version 1.0)
|   /    / /    |    AUTHOR : Tim Carter
|  /    / /  /| |    ONLINE : http://www.tomkidding.net/uize/
| /____/ /__/_| | COPYRIGHT : (c)2003-2011 UIZE
|          /___ |   LICENSE : Distributed under the terms of the GNU General Public License
|_______________|             http://www.gnu.org/licenses/gpl.txt
*/

/*
	DESCRIPTION
		Implements a basic tree menu whose nodes expand and collapse based on user input.
		The nodes are initialized when the tree's root array is initialized with json
		data representing the nodes within the tree. When the tree's insertUi method is called,
		the nodes are asked to generated their DOM structure. The resulting markup is then
		inserted into the tree's container node (_this.getNode()).

	REQUIRES
		- Uize.Widget.js (the base class)
		- Uize.Node.js
		- Uize.Widget.TreeNode.js

	TO DO
		- One idea is to have the view inform the data, rather than the current implementation
			(currently, Uize.Widget.TreeMenu does this).
		- Refactoring both this and TreeNode could eventually force these two classes into the
			Uize.Widget.Collection/Uize.Widget.CollectionItem relationship that other Uize
			classes enjoy.
*/

Uize.module({
	name:'Uize.Widget.TreeView',
	required:[
		'Uize.Node',
		'Uize.Widget.TreeNode'
	],
	builder:function(_superclass) {
		/*** Variables for Scruncher Optimization ***/
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

		// conducts a dfs iteration through the tree, returning either
		// the first or all the nodes that match the evalFn, depending
		// on the second parameter.
		_classPrototype._iterateDFS = function(_evalFn, _returnMulti) {
			var
				_idx = 0,
				_this = this,
				_childWidgets,
				_currNode,
				_rootWidgets = _this._rootWidgets,
				_stack = [],
				_toReturn = []
			;

			for (; _idx < _rootWidgets.length; ++_idx) _stack.push(_rootWidgets[_idx]);
			while (_currNode = _stack.pop()){
				if (_evalFn(_currNode))
				{
					if (_returnMulti) _toReturn.push(_currNode);
					else return _currNode;
				}

				_childWidgets = _currNode.get('childWidgets');
				for (_idx = 0; _idx < _childWidgets.length; ++_idx) _stack.push(_childWidgets[_idx]);
			}

			return _toReturn.length == 0 ? _null : _toReturn;
		};

		/*** Public Methods ***/

		_classPrototype.selectNode = function(_evalFn) {
			var
				_this = this,
				_node = _this.getTreeNode(_evalFn),
				_selectedNode = _this._selectedNode
			;
			if (_node && (_node != _selectedNode)) {
				// unset the previous node
				if (_selectedNode) _selectedNode.set({selected:_false});

				_node.set({selected:_true});
				_this.set({selectedNode:_node});
			}
		};

		// Expands the first node that causes the evalFn to return true.
		_classPrototype.expandToNode = function(_evalFn) {

			var
				_this = this,
			      	_node = _this.getTreeNode(_evalFn)
			;

			if (_node)
				_node.set({expanded:_true});
		};

		// Gets the first node that satisfies the eval function
		_classPrototype.getTreeNode = function(_evalFn) {
			return this._iterateDFS(_evalFn, _false);
		};

		// Gets any node that satisfies the eval function.
		// Slower than getNode since it has to iterate through every node.
		_classPrototype.getTreeNodes = function(_evalFn) {
			return this._iterateDFS(_evalFn, _true);
		};

		/*** Register and Set Properties ***/
		_class.registerProperties({
			_expandedNodes:{
				name:'expandedNodes',
				onChange:function() {
					var
						_currNode,
						_idx = 0,
						_this = this,
						_expandedNodes = _this._expandedNodes,
						_newExpandedNodesArr = [],
						_selectedNode = _this._selectedNode
					;
					// have to make sure that only one node is expanded,
					// if that setting is true. We also assume that the last
					// node added is the one to be expanded
					if (!_this._multiExpandable && _expandedNodes.length) {
						for (; _idx < _expandedNodes.length; ++_idx) {
							if (_expandedNodes[_idx] != _selectedNode &&
								!_selectedNode.isDescendantOf(_expandedNodes[_idx]))
								_expandedNodes[_idx].set({expanded:_false});
							else _newExpandedNodesArr.push(_expandedNodes[_idx]);
					}
						_this._expandedNodes = _newExpandedNodesArr;
					}
				},
				value:[]
			},
			_multiExpandable:{
				name:'multiExpandable',
				value:true
			},
			_roots:{
				name:'roots',
				onChange:function() {
					var
						_this = this,
						_idx = 0
					;

					// should we be removing the previous widgets?
					// probably ask Chris about this step in the process
					// when he gets back.

					_this._rootWidgets = [];

					// start the process of creating all the child widgets.
					for (; _idx < _this._roots.length; ++_idx)
						_this._rootWidgets.push(_this.addChild(
							'level0node' + _idx,
							Uize.Widget.TreeNode,
							Uize.copyInto(
								_this._roots[_idx],
								{tree:_this}
							)
						))
					;

				},
				value:[]
			},
			_rootWidgets:{
				name:'rootWidgets',
				value:[]
			},
			_selectedNode:{
				name:'selectedNode'
			}
		});

		/*** Override Initial Values for Inherited Set-Get Properties ***/
			_class.set ({
				html:{
					process:function () {
						var
							_this = this,
							_htmlChunks = []
						;
						for(var _idx = 0; _idx < _this._rootWidgets.length; ++_idx)
							_htmlChunks.push (_this._rootWidgets[_idx].generateHtml())
						;
						return _htmlChunks.join ('');
					}
				}
			});

		/*** Return class (this is a function, after all) ***/
		return _class;
	}
});

