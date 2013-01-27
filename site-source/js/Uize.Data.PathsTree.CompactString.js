/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Data.PathsTree.CompactString Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2011-2013 UIZE
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
		The =Uize.Data.PathsTree.CompactString= package provides methods for converting between a...

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Data.PathsTree.CompactString',
	builder:function () {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_package = function () {},
				_sacredEmptyObject = {},
				_Uize_defaultNully = Uize.defaultNully
			;

		/*** Public Static Methods ***/
			_package.fromCompactString = function (_compactStr,_encodingOptions) {
				_encodingOptions || (_encodingOptions = _sacredEmptyObject);
				var
					_opener = _Uize_defaultNully (_encodingOptions.opener,'[') + '',
					_closer = _Uize_defaultNully (_encodingOptions.closer,']') + '',
					_separator = _Uize_defaultNully (_encodingOptions.separator,'|') + '',
					_openerLength = _opener.length,
					_closerLength = _closer.length,
					_separatorLength = _separator.length,
					_tree = {},
					_levels = [_tree],
					_levelNode = _tree,
					_currentPos = 0,
					_compactStrLength = _compactStr.length,
					_compactStrLengthPlus1 = _compactStrLength + 1,
					_openerPos,
					_closerPos,
					_subPath,
					_delimPos,
					_lastDelimWasCloser
				;
				while (_currentPos < _compactStrLength) {
					_subPath = _compactStr.slice (
						_currentPos,
						_delimPos = Math.min (
							_openerPos = ((_compactStr.indexOf (_opener,_currentPos) + 1) || _compactStrLengthPlus1) - 1,
							_closerPos = ((_compactStr.indexOf (_closer,_currentPos) + 1) || _compactStrLengthPlus1) - 1,
							((_compactStr.indexOf (_separator,_currentPos) + 1) || _compactStrLengthPlus1) - 1
						)
					);
					_currentPos = _delimPos;
					if (_currentPos < _compactStrLength) {
						if (_delimPos == _openerPos) {
							_levels.push (_levelNode = _levelNode [_subPath] = {});
							_lastDelimWasCloser = false;
							_currentPos += _openerLength;
						} else {
							if (!_lastDelimWasCloser)
								_levelNode [_subPath] = 0
							;
							if (_lastDelimWasCloser = _delimPos == _closerPos) {
								_levelNode = _levels [--_levels.length - 1];
								_currentPos += _closerLength;
							} else {
								_currentPos += _separatorLength;
							}
						}
						if (_currentPos == _compactStrLength && !_lastDelimWasCloser)
							_levelNode [''] = 0
						;
					} else {
						_levelNode [_subPath] = 0;
					}
				}
				return _levels [0];
			};

			_package.toCompactString = function (_tree,_encodingOptions) {
				_encodingOptions || (_encodingOptions = _sacredEmptyObject);
				var
					_opener = _Uize_defaultNully (_encodingOptions.opener,'[') + '',
					_closer = _Uize_defaultNully (_encodingOptions.closer,']') + '',
					_separator = _Uize_defaultNully (_encodingOptions.separator,'|') + ''
				;
				function _toCompactString (_tree) {
					if (typeof _tree != 'object' || !_tree) return null;
					var _paths = [];
					for (var _path in _tree) {
						var _pathSubPathsAsCompactStr = _toCompactString (_tree [_path]);
						_paths.push (
							_path +
							(
								_pathSubPathsAsCompactStr != null
									? _opener + _pathSubPathsAsCompactStr + _closer
									: ''
							)
						);
					}
					return _paths.join (_separator);
				}
				return _toCompactString (_tree) || '';
			};

		return _package;
	}
});

