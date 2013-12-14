/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Web.xFilters Object Extension
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2009-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Extension
	importance: 5
	codeCompleteness: 50
	docCompleteness: 50
*/

/*?
	Introduction
		The =Uize.Web.xFilters= module extends the =Uize.Web= object by adding functionality for filtering & traversing the matched set of DOM elements.

		*DEVELOPERS:* `Ben Ilegbodu`, original code donated by `Zazzle Inc.`
		
		The =Uize.Web.xFilters= module is an extension module that extends the =Uize.Web= class. Pages that want to leverage the syntax-friendly nature of =Uize.Web= may not need to leverage any filtering or traversing functionality. Therefore, the filtering & traversing functionality is not implemented in the =Uize.Web= class in order to reduce the need for loading the extra code.  Instead, in order to include the filtering & traversing functionality, one needs to require the =Uize.Web.xFilters= extension module.
		
		Key Features
			The =Uize.Web.xFilters= extension module provides the following features...
			
			Filtering Methods
				document...
				
			Tree Traversal Methods
				document...
*/

Uize.module ({
	name:'Uize.Web.xFilters',
	required:'Uize.Node',
	builder:function (_object) {
		'use strict';
		
		/*** Variables for Scruncher Optimization ***/
			var
				_true = true,
				_false = false,
				_undefined,

				_Uize = Uize,
				_Uize_Node = _Uize.Node,

				_Uize_Node_isNode = _Uize_Node.isNode,
				
				_window = _Uize.global(),
				_document = _window.document,

				_objectPrototype = _object.prototype
			;

		/*** Utility Functions ***/
			var
				_getAncestors = function(_filterSelector, _fullTree, _findSelector) {
					var _ancestors = [];
					
					this.each(
						function() {
							var _node = this;
							while (_node = _node.parentNode) {
								if (_findSelector && _isMatch(_node, _findSelector))
									break;
								
								_node != _document
									&& _isMatch(_node, _filterSelector)
									&& _ancestors.push(_node)
								;

								if (!_fullTree)
									break;
							}
						}
					);
					
					return _object(_ancestors);
				},
				_getNodesLookup = function(_nodes) {
					var
						_nodesLookup = {},
						_nodesLength = _nodes.length,
						_nodeNo = -1
					;
					
					// add existing nodes to lookup table for comparising from added nodes
					for (; ++_nodeNo < _nodesLength;) {
						var _node = _nodes[_nodeNo];
						if (_Uize_Node_isNode(_node))
							_nodesLookup[_getNodeUid(_node)] = _node;
					}
					
					return _nodesLookup;
				},
				_getSelectorTestFunc = function(_param) {
					var _testFunc;

					// for all of the test functions, "this" will be the node to test
					if (_Uize.isFunction(_param))
						_testFunc = _param;
					else if (_Uize.isString(_param)) // CSS selector syntax
						_testFunc = function() { return  _isMatch(this, _param) };
					else if (_Uize_Node_isNode(_param)) // simple node comparison
						_testFunc = function() { return this == _param };
					else if (_object.isWeb(_param)) // if a Uize.Web object we'll just call any on the object with our node
						_testFunc = function() { return _param.any(this) };
					else if (_Uize.isList(_param)) {
						var _nodeLookup = _getNodesLookup(_param);
						_testFunc = function() { return _getNodeUid(this) in _nodeLookup };
					}

					return _testFunc;
				},
				_getNodeUid = _object.getNodeUid,
				_isMatch = _object.isMatch,
				_single = function (_nodes, _index) {
					var
						_nodesLength = _nodes.length,
						_singleNode
					;
					
					if (_index >= 0 && _index < _nodesLength)
						_singleNode = _nodes[_index];
					else if (_index < 0 && (_index + _nodesLength) >= 0)
						_singleNode = _nodes[_index + _nodesLength];
					
					return _singleNode;
				}
			;
		
		/*** Private Instance Methods ***/
			_objectPrototype._filter = function(_selector, _mustMatch) {
				var
					m = this,
					_testFunc = _getSelectorTestFunc(_selector),
					_newSet = []
				;
				
				if (_mustMatch == _undefined)
					_mustMatch = _true;
				
				m.each(
					function() {
						// add node to the new set if we didn't have a test function, or the test function doesn't match (meaning we don't want to exclude)
						if (!_testFunc || _testFunc.call(this) == _mustMatch)
							_newSet.push(this);
					}
				);
				
				return _newSet;
			};
		
		/*** Public Instance Methods ***/
			/** Filtering **/
				_objectPrototype.any = function(_selector) { return this._filter(_selector).length > 0 };
					/*?
						Instance Methods
							any
								Checks the current matched set of DOM nodes against the specified selector, test function, element or =Uize.Web= object and returns =true= if at least one of these DOM nodes matches, and =false= otherwise.
	
								SYNTAX
								........................................................
								anyBOOL = myWeb.any(selectorSTR);
								........................................................
								
								VARIATION 1
								........................................................
								anyBOOL = myWeb.any(testFUNC);
								........................................................
								
								VARIATION 2
								........................................................
								anyBOOL = myWeb.any(nodeOBJ);
								........................................................
								
								VARIATION 3
								........................................................
								anyBOOL = myWeb.any(webOBJ);
								........................................................
					*/
				
				_objectPrototype.filter = function(_selector) { return _object(this._filter(_selector)) };
					/*?
						Instance Methods
							filter
								Reduce the set of matched DOM nodes to those that match the specified selector, returning a new =Uize.Web= object containing that DOM node.
	
								SYNTAX
								........................................................
								newWeb = myWeb.filter(selectorSTR);
								........................................................
								
								VARIATION 1
								........................................................
								anyBOOL = myWeb.filter(testFUNC);
								........................................................
								
								VARIATION 2
								........................................................
								anyBOOL = myWeb.filter(nodeOBJ);
								........................................................
								
								VARIATION 3
								........................................................
								anyBOOL = myWeb.filter(webOBJ);
								........................................................
								
								NOTES
								- Returns a reference to the a new =Uize.Web= object
								- See companion =not= method
					*/
				
				_objectPrototype.first = function(_selector) {
					return (
						_selector
							? _object(_single(this._filter(_selector), 0)) // filters the nodes based on the selector, picks the first one (if available), then creates a new object
							: this.single(0)
					);
					/*?
						Instance Methods
							first
								Reduce the set of matched DOM nodes to the first in the set, returning a new =Uize.Web= object containing that DOM node.
	
								SYNTAX
								........................................................
								newWeb = myWeb.first();
								........................................................
	
								VARIATION 1
								........................................................
								newWeb = myWeb.first(selectorSTR);
								........................................................
								
								VARIATION 2
								........................................................
								anyBOOL = myWeb.first(testFUNC);
								........................................................
								
								VARIATION 3
								........................................................
								anyBOOL = myWeb.first(nodeOBJ);
								........................................................
								
								VARIATION 4
								........................................................
								anyBOOL = myWeb.first(webOBJ);
								........................................................
								
								NOTES
								- Returns a reference to the a new =Uize.Web= object
								- See companion =last= method
								- See related =single= and =filter= methods
					*/
				};
				
				_objectPrototype.last = function(_selector) {
					return (
						_selector
							? _object(_single(this._filter(_selector), -1)) // filters the nodes based on the selector, picks the last one (if available), then creates a new object
							: this.single(-1)
					);
					/*?
						Instance Methods
							last
								Reduce the set of matched DOM nodes to the last in the set, returning a new =Uize.Web= object containing that DOM node.
	
								SYNTAX
								........................................................
								newWeb = myWeb.last();
								........................................................
	
								VARIATION 1
								........................................................
								newWeb = myWeb.last(selectorSTR);
								........................................................
								
								VARIATION 2
								........................................................
								anyBOOL = myWeb.last(testFUNC);
								........................................................
								
								VARIATION 3
								........................................................
								anyBOOL = myWeb.last(nodeOBJ);
								........................................................
								
								VARIATION 4
								........................................................
								anyBOOL = myWeb.last(webOBJ);
								........................................................
								
								NOTES
								- Returns a reference to the a new =Uize.Web= object
								- See companion =first= method
								- See related =single= and =filter= methods
					*/
				};
					
				_objectPrototype.not = function(_selector) { return _object(this._filter(_selector, _false)) };
					/*?
						Instance Methods
							not
								Reduce the set of matched DOM nodes to those that do not match the specified selector, returning a new =Uize.Web= object containing that DOM node.
	
								SYNTAX
								........................................................
								newWeb = myWeb.not(selectorSTR);
								........................................................
								
								VARIATION 1
								........................................................
								anyBOOL = myWeb.not(testFUNC);
								........................................................
								
								VARIATION 2
								........................................................
								anyBOOL = myWeb.not(nodeOBJ);
								........................................................
								
								VARIATION 3
								........................................................
								anyBOOL = myWeb.not(webOBJ);
								........................................................
								
								NOTES
								- Returns a reference to the a new =Uize.Web= object
								- See companion =filter= method
					*/
					
					_objectPrototype.single = function(_index) { return _object(_single(this, _index)) };
					/*?
						Instance Methods
							single
								Reduce the set of matched DOM nodes to the one at the specified index, returning a new =Uize.Web= object containing that DOM node.
	
								SYNTAX
								........................................................
								newWeb = myWeb.single(indexINT);
								........................................................
								
								NOTES
								- Returns a reference to the a new =Uize.Web= object
					*/
				
				_objectPrototype.slice = function(_start, _end) { return _object(this.element().slice(_start, _end)) };
					/*?
						Instance Methods
							slice
								Reduce the set of matched DOM nodes to the one at the specified range of indices, returning a new =Uize.Web= object containing that DOM node.
	
								SYNTAX
								........................................................
								newWeb = myWeb.slice(startINT, endINT);
								........................................................
	
								VARIATION
								........................................................
								newWeb = myWeb.slice(startINT);
								........................................................
								
								NOTES
								- Returns a reference to the a new =Uize.Web= object
					*/
			
			/** Traversing **/
				_objectPrototype.add = function(_selector, _rootNode) {
					var
						_mergedNodes = this.element(),
						_nodesLookup = _getNodesLookup(_mergedNodes),
						_addedNodes = _object.select(_selector, _rootNode).nodes,
						_addedNodesLength = _addedNodes.length,
						_nodeNo = -1
					;
	
					// ensure no duplicates in the nodes to add
					for (_nodeNo = -1; ++_nodeNo < _addedNodesLength;) {
						var _node = _addedNodes[_nodeNo];
						if (!_nodesLookup[_getNodeUid(_node)]) // assuming added nodes has no duplicates
							_mergedNodes.push(_node);
					}
					
					// NOTE: Right now we're making a clone of the underlying nodes, the addedNodes is a new array
					// and constructing the object is making a clone of the merged nodes. How can we reduce the
					// number of unused new arrays while keeping the node order?
					
					return _object(_mergedNodes); // create new object w/ merged set of nodes (which will have a new _key)
					/*?
						Instance Methods
							add
								Adds nodes to the set of matched nodes.
	
								SYNTAX
								........................................................
								myWeb = myWeb.add(selectorSTR);
								........................................................
								
								VARIATION 1
								........................................................
								myWeb = myWeb.add(selectorSTR, nodeBLOB);
								........................................................
								
								VARIATION 2
								........................................................
								myWeb = myWeb.add(node);
								........................................................
								
								VARIATION 3
								........................................................
								myWeb = myWeb.add(nodesARRAY);
								........................................................
								
								VARIATION 4
								........................................................
								myWeb = myWeb.add(myWeb);
								........................................................
								
								VARIATION 5
								........................................................
								myWeb = myWeb.add();
								........................................................
								
								NOTES
								- Returns a reference to the same =Uize.Web= object
								- See also `Constructor`
					*/
				};
				
				_objectPrototype.ancestors = function(_selector) {
					return _getAncestors.call(this, _selector, _true);
					/*?
						Instance Methods
							ancestors
								Retrieves *all* of the ancestor nodes in the DOM tree (ordered from immediate parent on up) for each DOM node in the matched set of DOM nodes, optionally filtered by the specified selector, returning a new =Uize.Web= object containing those DOM nodes.
	
								SYNTAX
								........................................................
								newWeb = myWeb.ancestors();
								........................................................
								
								VARIATION 1
								........................................................
								newWeb = myWeb.ancestors(selector);
								........................................................
								
								NOTES
								- Returns a reference to a new =Uize.Web= object
								- Any duplicates are removed
								- See related =ancestorsUntil= and =parent= methods
					*/
				};
				
				_objectPrototype.ancestorsUntil = function(_findSelector, _filterSelector) {
					return _getAncestors.call(this, _filterSelector, _true, _findSelector);
					/*?
						Instance Methods
							ancestors
								Retrieves *all* of the ancestor nodes in the DOM tree for each DOM node in the matched set of DOM nodes (ordered from immediate parent on up to but not including the DOM node matching the optional find selector), optionally filtered by the specified filter selector, returning a new =Uize.Web= object containing those DOM nodes.
	
								SYNTAX
								........................................................
								newWeb = myWeb.ancestorsUntil(findSelector, filterSelector);
								........................................................
								
								VARIATION 1
								........................................................
								newWeb = myWeb.ancestorsUntil(findSelector);
								........................................................
								
								VARIATION 1
								........................................................
								newWeb = myWeb.ancestorsUntil();
								........................................................
								
								NOTES
								- Returns a reference to a new =Uize.Web= object
								- Any duplicates are removed
								- See related =ancestors= and =parent= methods
					*/
				};
				
				_objectPrototype.contents = function(_selector) {
					var _allChildNodes = [];
					
					this.each(
						function() { _allChildNodes.push.apply (_allChildNodes, _Uize.copyList(this.childNodes).splice(0, Infinity)) }
					);
					
					var _newObject = _object(_allChildNodes);
					
					return _selector ? _newObject.filter(_selector) : _newObject;
					/*?
						Instance Methods
							contents
								Retrieves the children of each DOM node in the matched set of DOM nodes, including text and comment nodes, filtered by the optional selector.
	
								SYNTAX
								........................................................
								newWeb = myWeb.contents();
								........................................................
								
								VARIATION
								........................................................
								newWeb = myWeb.contents(selector);
								........................................................
								
								NOTES
								- Returns a reference to a =Uize.Web= object
					*/
				};
				
				_objectPrototype.map = function(_mapper) { return _object(_Uize.map(this, _mapper)) };
					/*?
						Instance Methods
							map
								Passes each DOM node in the matched set of DOM nodes through the specified mapping function, producting a new =Uize.Web= object containing the return values.
	
								SYNTAX
								........................................................
								newWeb = myWeb.map(mapperFUNC);
								........................................................
								
								NOTES
								- Returns a reference to a =Uize.Web= object
					*/
				
				_objectPrototype.parent = function(_selector) {
					return _getAncestors.call(this, _selector, _false);
					/*?
						Instance Methods
							parent
								Retrieves the parent node for each DOM node in the matched set of DOM nodes, optionally filtered by the specified selector, returning a new =Uize.Web= object containing those DOM nodes.
	
								SYNTAX
								........................................................
								newWeb = myWeb.parent();
								........................................................
								
								VARIATION 1
								........................................................
								newWeb = myWeb.parent(selector);
								........................................................
								
								NOTES
								- Returns a reference to a new =Uize.Web= object
								- Any duplicates are removed
								- See related =ancestors= and =ancestorsUntil= methods
					*/
				};
	}
});
