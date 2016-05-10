/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Util.Bucket Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Class
	importance: 1
	codeCompleteness: 100
	docCompleteness: 3
*/

/*?
	Introduction
		The =Uize.Util.Bucket= module implements methods for randomized selection of values from defined sets of buckets.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Util.Bucket',
	builder:function () {
		'use strict';

		var
			/*** references to static methods used internally ***/
				_bucketedSelection
		;

		return Uize.package ({
			bucketedSelection:_bucketedSelection = function (_buckets) {
				var
					_totalBucketSizes = 0,
					_bucketsLength = _buckets.length
				;
				for (var _bucketNo = _bucketsLength; --_bucketNo >= 0;)
					_totalBucketSizes += _buckets [_bucketNo].size
				;
				return function () {
					var
						_randomTotalBucketSizes = Math.random () * _totalBucketSizes,
						_currentTotalBucketSizes = 0
					;
					for (
						var _bucketNo = -1;
						++_bucketNo < _bucketsLength &&
						(_currentTotalBucketSizes += _buckets [_bucketNo].size) < _randomTotalBucketSizes;
					);
					return _buckets [_bucketNo].value;
				};
			},

			bucketedExecution:function (_buckets) {
				var _bucketedFunctionSelector = _bucketedSelection (_buckets);
				return function () {return _bucketedFunctionSelector () ()};
			}
		});
	}
});



