/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Data.PathsTree Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2009-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 2
	codeCompleteness: 100
	docCompleteness: 2
*/

/*?
	Introduction
		The =Uize.Data.PathsTree= package provides methods for converting between a...

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Data.PathsTree',
	builder:function () {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_undefined,
				_package = function () {},
				_sacredEmptyObject = {}
			;

		/*** Public Static Methods ***/
			_package.toList = function (_tree,_delimiter) {
				if (_delimiter == _undefined)
					_delimiter = '.'
				;
				var _paths = [];
				function _processTreeNode (_treeNode,_namespace) {
					_namespace && _paths.push (_namespace);
					for (var _subNodeName in _treeNode)
						_processTreeNode (_treeNode [_subNodeName],_namespace + (_namespace && _delimiter) + _subNodeName)
					;
				}
				_processTreeNode (_tree,'');
				return _paths;
			};

			_package.fromList = function (_paths,_delimiter) {
				if (_delimiter == _undefined)
					_delimiter = '.'
				;
				var _tree = {};
				for (var _pathNo = -1, _pathsLength = _paths.length; ++_pathNo < _pathsLength;) {
					var
						_path = _paths [_pathNo],
						_treeNode = _tree
					;
					for (
						var
							_pathPartNo = -1,
							_pathParts = _path.split (_delimiter),
							_pathPartsLength = _pathParts.length,
							_pathPart
						;
						++_pathPartNo < _pathPartsLength;
					)
						_treeNode =
							_treeNode [_pathPart = _pathParts [_pathPartNo]] ||
							(_treeNode [_pathPart] = _pathPartsLength - 1 - _pathPartNo && {})
					;
				}
				return _tree;
			};

		return _package;
	}
});
