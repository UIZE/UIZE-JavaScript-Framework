/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Data.Flatten Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 1
	codeCompleteness: 100
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Data.Flatten= package provides methods for flattening a hierarchical / tree structured object to a flat, key/value hash table, as well as unflattening a key/value hash table to produce a hierarchical / tree structured object.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Data.Flatten',
	builder:function () {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_undefined
		;

		/*** Utility Functions ***/
			function _makeDelimiterBasedPathToKeyTransformer (_delimiter) {
				return function (_path) {return _path.join (_delimiter)};
			}

			function _makeDelimiterBasedKeyToPathTransformer (_delimiter) {
				return function (_key) {return _key.split (_delimiter)};
			}

			var
				_pathToKeyPeriodDelimited = _makeDelimiterBasedPathToKeyTransformer ('.'),
				_keyToPathPeriodDelimited = _makeDelimiterBasedKeyToPathTransformer ('.')
			;

		return Uize.package ({
			flatten:function (_tree,_pathToKey,_inclueNonLeafNodes) {
				_pathToKey = _pathToKey == _undefined
					? _pathToKeyPeriodDelimited
					: typeof _pathToKey == 'string'
						? _makeDelimiterBasedPathToKeyTransformer (_pathToKey)
						: _pathToKey
				;
				var _hash = {};
				function _processTreeNode (_treeNode,_path) {
					if (Uize.isPlainObject (_treeNode)) {
						if (_inclueNonLeafNodes && _path.length)
							_hash [_pathToKey (_path)] = _treeNode
						;
						for (var _subNodeName in _treeNode)
							_processTreeNode (_treeNode [_subNodeName],_path.concat (_subNodeName))
						;
					} else {
						_hash [_pathToKey (_path)] = _treeNode;
					}
				}
				_processTreeNode (_tree,[]);
				return _hash;
			},

			unflatten:function (_hash,_keyToPath) {
				_keyToPath = _keyToPath == _undefined
					? _keyToPathPeriodDelimited
					: typeof _keyToPath == 'string'
						? _makeDelimiterBasedKeyToPathTransformer (_keyToPath)
						: _keyToPath
				;
				var _tree = {};
				for (var _key in _hash) {
					for (
						var
							_path = _keyToPath (_key),
							_pathPartNo = -1,
							_pathLength = _path.length,
							_pathPart,
							_treeNode = _tree
						;
						++_pathPartNo < _pathLength;
					)
						_treeNode =
							_treeNode [_pathPart = _path [_pathPartNo]] ||
							(_treeNode [_pathPart] = _pathLength - 1 - _pathPartNo ? {} : _hash [_key])
					;
				}
				return _tree;
			}
		});
	}
});
