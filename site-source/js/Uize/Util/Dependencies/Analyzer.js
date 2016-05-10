/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Util.Dependencies.Analyzer Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2013-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 1
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Util.Dependencies.Analyzer= utility module provides a way to perform a detailed analysis of the dependencies of a module, producing a comprehensive report in the form of a JSON object.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Util.Dependencies.Analyzer',
	required:'Uize.Util.Dependencies.Async',
	builder:function () {
		'use strict';

		var
			/*** General Variables ***/
				_moduleInfoLookup = {}
		;

		return Uize.package ({
			analyze:function (_moduleName,_getModuleInfo,_callback) {
				function _getAndCacheModuleInfo (_moduleName,_callback) {
					var _moduleInfo = _moduleInfoLookup [_moduleName];
					_moduleInfo
						? _callback (_moduleInfo)
						: _getModuleInfo (
							_moduleName,
							function (_moduleInfo) {_callback (_moduleInfoLookup [_moduleName] = _moduleInfo)}
						)
					;
				}

				Uize.Util.Dependencies.Async.traceDependencies (
					_moduleName,
					function (_moduleName,_callback) {
						_getAndCacheModuleInfo (
							_moduleName,
							function (_moduleInfo) {_callback (_moduleInfo.directDependencies)}
						);
					},
					[],
					function (_dependencies) {
						var
							_moduleInfo = _moduleInfoLookup [_moduleName],
							_directDependenciesLookup = Uize.lookup (_moduleInfo.directDependencies),
							_totalSize = 0,
							_analysis = {metaData:_moduleInfo.metaData}
						;
						Uize.forEach (
							_dependencies,
							function (_moduleName) {_totalSize += _moduleInfoLookup [_moduleName].builtSize}
						);

						/*** create the overview section ***/
							var _overview = _analysis.overview = {};
							function _addDependenciesSegment (_segmentName,_segmentMatcher) {
								var
									_count = 0,
									_size = 0
								;
								Uize.forEach (
									_dependencies,
									function (_moduleName) {
										if (_segmentMatcher (_moduleName)) {
											_count++;
											_size += _moduleInfoLookup [_moduleName].builtSize;
										}
									}
								);
								_overview [_segmentName] = {
									segment:_segmentName,
									modules:_count,
									size:_size,
									sizeKb:_size / 1024,
									sizePercent:_size / _totalSize * 100
								};
							}
							_addDependenciesSegment ('Module',function (_dependency) {return _dependency == _moduleName});
							_addDependenciesSegment (
								'Direct Dependencies',
								function (_dependency) {return _dependency != _moduleName && _directDependenciesLookup [_dependency]}
							);
							_addDependenciesSegment (
								'Indirect Dependencies',
								function (_dependency) {return _dependency != _moduleName && !_directDependenciesLookup [_dependency]}
							);
							_addDependenciesSegment ('Total',Uize.returnTrue);

						/*** update the dependencies list table ***/
							/*** calculate local sharedness of modules ***/
								/* NOTE:
									This builds a lookup table that maps each dependency to the other dependencies within the local dependency tree that directly depend on it. For any dependency in the dependency tree, this provides an indication of the local sharedness of the dependency. This can be useful when contemplating whether the dependencies list could be reduced in size by eliminating the dependency on any given module. If a module is shared as a direct dependency by more than one module, then it will be harder to eliminate the dependency on it.
								*/
								var _localUsedByLookup = {};
								_localUsedByLookup [_moduleName] = [];
								Uize.forEach (
									_dependencies,
									function (_dependency) {
										Uize.forEach (
											_moduleInfoLookup [_dependency].directDependencies,
											function (_directDependency) {
												(
													_localUsedByLookup [_directDependency] ||
													(_localUsedByLookup [_directDependency] = [])
												).push (_dependency)
											}
										);
									}
								);
								_localUsedByLookup.Uize = _dependencies.slice (0,-1);

							/*** calculate size contribution uniquely attributable to module ***/
								var _uniqueSizeLookup = {};
								function _calculateUniqueSize (_moduleName) {
									if (!(_moduleName in _uniqueSizeLookup)) {
										_uniqueSizeLookup [_moduleName] = _moduleInfoLookup [_moduleName].builtSize;
										Uize.forEach (
											_moduleInfoLookup [_moduleName].directDependencies,
											function (_dependency) {
												_calculateUniqueSize (_dependency);
												if (_localUsedByLookup [_dependency].length == 1)
													_uniqueSizeLookup [_moduleName] += _uniqueSizeLookup [_dependency]
												;
											}
										);
									}
								}
								_calculateUniqueSize (_moduleName);

							_analysis.dependencies = Uize.map (
								_dependencies,
								function (_dependency,_dependencyIndex) {
									var
										_moduleInfo = _moduleInfoLookup [_dependency],
										_metadata = _moduleInfo.metaData,
										_size = _moduleInfo.builtSize
									;
									return {
										name:_dependency,
										type:_metadata.type,
										index:_dependencyIndex,
										depth:_dependency == _moduleName ? 0 : _directDependenciesLookup [_dependency] ? 1 : 2,
										importance:+_metadata.importance || 0,
										codeCompleteness:+_metadata.codeCompleteness || 0,
										directDependencies:_moduleInfo.directDependencies.length,
										shared:_localUsedByLookup [_dependency].length,
										sizePercent:_size / _totalSize * 100,
										size:_size,
										uniqueSize:_uniqueSizeLookup [_dependency],
										moduleInfo:_moduleInfo
									};
								}
							).reverse ();

						_callback (_analysis);
					}
				);
			}
		});
	}
});

