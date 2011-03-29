/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Widget.Droplist.Navigate Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2010-2011 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*ScruncherSettings Mappings="=g" LineCompacting="TRUE"*/

/* Module Meta Data
	type: Class
	importance: 2
	codeCompleteness: 100
	testCompleteness: 0
	docCompleteness: 0
*/

/*?
	Introduction
		The =Uize.Widget.Droplist.Navigate= widget provides the functionality for navigating to a url using a droplist

		*DEVELOPERS:* `Ben Ilegbodu`,`Michael Cheng`
*/

Uize.module ({
	name:'Uize.Widget.Droplist.Navigate',
	required:'Uize.Url',
	builder:function (_superclass) {
		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					null,
					function () {
						var _this = this;

						_this.wire('Changed.value',function() { _this._navigate() });
					}
				),
				_classPrototype = _class.prototype
			;

		/*** Private Instance Methods ***/
			_classPrototype._navigate = function () {
				var
					_this = this,
					_urlParams = {},
					_selectedValueObj = _this.getValueObject(),
					_urlParamsMap = _this._urlParamsMap,
					_valueMap = _this.get('valueMap')
				;

				if (_selectedValueObj) {
					// if there's no map defined, create a default mapping of all the property names
					// (except 'name' & 'displayName') to themselves
					if (!_urlParamsMap) {
						_urlParamsMap = {};
						for (var _valuePropertyName in _selectedValueObj) {
							if (_valuePropertyName != 'name' && _valuePropertyName != _valueMap.displayName)
								_urlParamsMap[_valuePropertyName] = _valuePropertyName;
						}
					}

					// Loop through the keys of the map and set the URL parameter name to be the map name and
					// the URL parameter value to be the value in the selectedValueObj that has the key defined
					// as the value of the URL params map.  This essentially allows flexibility in what param
					// names are used in the query string parameter
					for (var _urlParamName in _urlParamsMap)
						_urlParams[_urlParamName] = _selectedValueObj[
							_urlParamsMap[_urlParamName]
						]
					;

					// navigate
					location.href = Uize.Url.resolve (
						_this._urlBase || location.href,
						_urlParams
					);
				}
			};

		/*** Register Properties ***/
			_class.registerProperties({
				_urlBase:'urlBase',
				_urlParamsMap:'urlParamsMap'
			});

		return _class;
	}
});